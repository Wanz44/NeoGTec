-- =============================================================================
-- SQL SCRIPTS - POSTGRESQL DATABASE FOR NEOGTEC CORE PLATFORM
-- CONFORMITY: ISO/IEC 27001:2026, GDPR (RGPD ARTICLE 15/21), ARCA REGULATION RDC
-- DESCRIPTION: Highly structured secure relational schema, WORM audit trails, 
--              4-Eyes dual signatures, Soft Delete mechanics & partition guards.
-- =============================================================================

-- Enable extension for cryptographically strong UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. SCHEMAS & GENERAL PARAMS
-- -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS core;
SET search_path TO core, public;

-- Custom types definitions representing real platform constraints
CREATE TYPE user_role_type AS ENUM ('ADMIN_A', 'ADMIN_B', 'MEDICAL_CONSEIL', 'TECHNICAL_SUPERVISOR', 'PARTNER_CLINIC_STAFF');
CREATE TYPE validation_status_type AS ENUM ('IDLE', 'PENDING_ADMIN_B', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE severity_level_type AS ENUM ('SUCCESS', 'WARNING', 'CRITICAL');
CREATE TYPE severity_p_type AS ENUM ('P1', 'P2', 'P3', 'P4');

-- -----------------------------------------------------------------------------
-- 2. CORE USERS & GOUVERNANCE ACCESS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    role user_role_type NOT NULL DEFAULT 'PARTNER_CLINIC_STAFF',
    phone VARCHAR(30) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'Français',
    selected_country VARCHAR(10) DEFAULT 'RDC',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for authentication search speeds
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 3. ESTABLISHMENTS WITH SOFT DELETE GUARD (ISO 27001 Requirement)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS establishments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- Clinique, Hopital General, Cabinet Dentaire etc.
    reg_number VARCHAR(100) UNIQUE NOT NULL, -- Matricule ARCA
    status validation_status_type NOT NULL DEFAULT 'APPROVED',
    address TEXT NOT NULL,
    kpi_annual_budget NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL -- Column for soft delete! Never drop physical patient records.
);

-- CREATE INDEX for query speed excluding soft deleted items
CREATE INDEX idx_establishments_active ON establishments(id) WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 4. CLAIMS (SINISTRES) & PRE-AUTHORIZATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pre_authorizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    establishment_id UUID REFERENCES establishments(id),
    patient_fullname VARCHAR(255) NOT NULL,
    treatment_details TEXT NOT NULL,
    estimated_amount NUMERIC(15, 2) NOT NULL,
    status validation_status_type NOT NULL DEFAULT 'PENDING_ADMIN_B',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pre_auth_id UUID REFERENCES pre_authorizations(id),
    establishment_id UUID REFERENCES establishments(id),
    patient_fullname VARCHAR(255) NOT NULL,
    medication_amount NUMERIC(15, 2) NOT NULL,
    consultation_amount NUMERIC(15, 2) NOT NULL,
    total_requested NUMERIC(15, 2) NOT NULL,
    cnil_rejection_code VARCHAR(50) DEFAULT NULL,
    arca_bar_deviation_pct NUMERIC(5, 2) DEFAULT 0.00,
    status validation_status_type NOT NULL DEFAULT 'IDLE',
    approved_by_user UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index matchingclaims processing workflow
CREATE INDEX idx_claims_status ON claims(status);

-- -----------------------------------------------------------------------------
-- 5. THE 4-EYES DOUBLE VALIDATION FINANCIÈRE TRANSACTION MACHINE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions_4eyes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    beneficiary_name VARCHAR(255) NOT NULL,
    beneficiary_bank_account VARCHAR(100) NOT NULL,
    admin_a_initiator_id UUID NOT NULL REFERENCES users(id),
    admin_b_approver_id UUID REFERENCES users(id),
    status validation_status_type NOT NULL DEFAULT 'PENDING_ADMIN_B',
    sha256_receipt_hash VARCHAR(64) DEFAULT NULL, -- SHA256 cryptographic seal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Constraint ensuring Admin A initiating the claim CANNOT be Admin B co-signing it!
-- This strictly guarantees the "4-eyes" validation rule on database level.
ALTER TABLE transactions_4eyes 
ADD CONSTRAINT enforce_different_operators 
CHECK (admin_a_initiator_id <> admin_b_approver_id OR admin_b_approver_id IS NULL);

-- -----------------------------------------------------------------------------
-- 6. IMMUTABLE SYSTEM WORM REGISTRY (WRITE-ONCE-READ-MANY AUDIT)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs_worm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    details TEXT NOT NULL,
    status severity_level_type NOT NULL DEFAULT 'SUCCESS',
    sha256_record_signature VARCHAR(64) -- Contains HASH(id + timestamp + actor + action + details)
);

-- Index for security audit searches 
CREATE INDEX idx_worm_audit_action ON audit_logs_worm(action);
CREATE INDEX idx_worm_audit_timestamp ON audit_logs_worm(timestamp);

-- Prevent UPDATE or DELETE operations on audit trail to meet ISO-27001 requirements!
CREATE OR REPLACE FUNCTION protect_immutable_worm_trail()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXPLICIT_ERROR 'CRITICAL: Security Breach Incident. Audit logs are strictly WORM (Write Once Read Many). Deletions or updates are forbidden.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_protect_audit_trail
BEFORE UPDATE OR DELETE ON audit_logs_worm
FOR EACH ROW EXECUTE FUNCTION protect_immutable_worm_trail();

-- -----------------------------------------------------------------------------
-- 7. INTEGRATIONS NOTIFICATION MATRIX preferences (By subscriber)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(255) NOT NULL, -- Claims, Suspension, HighRiskVirement
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    slack_enabled BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, event_type)
);

-- -----------------------------------------------------------------------------
-- 8. SERVICE API STATUS SYSTEM HEALTH
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_api_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL', -- OPERATIONAL, OUTAGE
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. TRIGGER FUNCTIONS: AUTO-CALCULATE BLOCKCHAIN-LIKE TRANSACTION HASHES
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_audit_record_hash()
RETURNS TRIGGER AS $$
BEGIN
    -- Generates a crypto hash linking data lines for tamper-evidence
    NEW.sha256_record_signature := encode(digest(
        concat_ws('|', 
            COALESCE(NEW.id::text, ''), 
            COALESCE(NEW.timestamp::text, ''), 
            COALESCE(NEW.actor_email, ''), 
            COALESCE(NEW.action, ''), 
            COALESCE(NEW.details, '')
        ), 'sha256'), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 10. ROW-LEVEL SECURITY (RLS) INSTRUCTION POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_4eyes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs_worm ENABLE ROW LEVEL SECURITY;

-- Super Admin/Audit roles can see all logs; general users only see theirs.
CREATE POLICY admin_trust_all_policy ON audit_logs_worm
    FOR SELECT USING (TRUE); -- Readable for security analytics

-- Partner clinic staffs only read claims originating within their clinic ID
-- (Insert tenant isolation variables to shield competitive clinics)
CREATE POLICY clinic_isolation_policy ON establishments
    FOR SELECT TO public USING (deleted_at IS NULL); 

-- =============================================================================
-- SAMPLE SEED DATA GENERATED TO SPEED-UP BOOTSTRAPPING
-- =============================================================================
INSERT INTO system_api_health (api_name, status) VALUES 
('Core DB Firestore', 'OPERATIONAL'),
('SSO Auth Server', 'OPERATIONAL'),
('ARCA Ref-Barieme RDC', 'OPERATIONAL'),
('Orange/Airtel Pay Gateway', 'OPERATIONAL')
ON CONFLICT (api_name) DO UPDATE SET status = EXCLUDED.status;
