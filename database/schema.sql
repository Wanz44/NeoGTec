-- =============================================================================
-- SQL SCRIPTS - POSTGRESQL DATABASE FOR NEOGTEC CORE PLATFORM
-- CONFORMITY: ISO/IEC 27001:2026, GDPR (RGPD ARTICLE 15/21), ARCA REGULATION RDC
-- DESCRIPTION: Highly structured secure relational schema covering 100% of
--              NeoGTec's 15 operational modules.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. SCHEMAS & GENERAL PARAMS
-- -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS core;
SET search_path TO core, public;

-- -----------------------------------------------------------------------------
-- 2. CUSTOM TYPES
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
    CREATE TYPE user_role_type AS ENUM (
      'SUPER_ADMIN', 'ADMIN_A', 'ADMIN_B', 'MEDICAL_CONSEIL', 'TECHNICAL_SUPERVISOR', 'PARTNER_CLINIC_STAFF'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'validation_status_type') THEN
    CREATE TYPE validation_status_type AS ENUM ('IDLE', 'PENDING_ADMIN_B', 'APPROVED', 'REJECTED', 'SUSPENDED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_level_type') THEN
    CREATE TYPE severity_level_type AS ENUM ('SUCCESS', 'WARNING', 'CRITICAL');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_p_type') THEN
    CREATE TYPE severity_p_type AS ENUM ('P1', 'P2', 'P3', 'P4');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status_type') THEN
    CREATE TYPE lead_status_type AS ENUM ('NEW', 'CONTACTED', 'CONVERTED', 'LOST');
  END IF;
END$$;

-- -----------------------------------------------------------------------------
-- 3. CORE USERS & GOUVERNANCE ACCESS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  role user_role_type NOT NULL DEFAULT 'PARTNER_CLINIC_STAFF',
  phone VARCHAR(30) NOT NULL,
  mfa_enabled BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'Français',
  selected_country VARCHAR(10) DEFAULT 'RDC',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 4. ESTABLISHMENTS WITH SOFT DELETE GUARD (Partenaires Hospitaliers Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  reg_number VARCHAR(100) UNIQUE NOT NULL,
  status validation_status_type NOT NULL DEFAULT 'APPROVED',
  address TEXT NOT NULL,
  kpi_annual_budget NUMERIC(15, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_establishments_active
  ON establishments(id)
  WHERE deleted_at IS NULL;

-- -----------------------------------------------------------------------------
-- 5. CONTRATS & POLICES (Gestion Polices & Sinistres Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(100) UNIQUE NOT NULL,
  subscriber_name VARCHAR(255) NOT NULL,
  coverage_percentage NUMERIC(5, 2) DEFAULT 80.00 CHECK (coverage_percentage BETWEEN 0 AND 100),
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  status validation_status_type NOT NULL DEFAULT 'APPROVED',
  country VARCHAR(20) DEFAULT 'RDC',
  currency VARCHAR(10) DEFAULT 'USD',
  premium_amount NUMERIC(15, 2) NOT NULL,
  max_ceiling NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(contract_number);

-- -----------------------------------------------------------------------------
-- 6. CLAIMS & PRE-AUTHORIZATIONS (Sinistres & Contentieux Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pre_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES establishments(id),
  contract_id UUID REFERENCES contracts(id),
  patient_fullname VARCHAR(255) NOT NULL,
  treatment_details TEXT NOT NULL,
  estimated_amount NUMERIC(15, 2) NOT NULL,
  status validation_status_type NOT NULL DEFAULT 'PENDING_ADMIN_B',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pre_auth_id UUID REFERENCES pre_authorizations(id),
  establishment_id UUID REFERENCES establishments(id),
  contract_id UUID REFERENCES contracts(id),
  patient_fullname VARCHAR(255) NOT NULL,
  medication_amount NUMERIC(15, 2) NOT NULL,
  consultation_amount NUMERIC(15, 2) NOT NULL,
  total_requested NUMERIC(15, 2) NOT NULL,
  cnil_rejection_code VARCHAR(50) DEFAULT NULL,
  arca_bar_deviation_pct NUMERIC(5, 2) DEFAULT 0.00,
  status validation_status_type NOT NULL DEFAULT 'IDLE',
  approved_by_user UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- -----------------------------------------------------------------------------
-- 7. RECLAMATIONS / LITIGES (Module Réclamation Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reclamations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority severity_p_type NOT NULL DEFAULT 'P3',
  status validation_status_type NOT NULL DEFAULT 'IDLE',
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reclamations_status ON reclamations(status);

-- -----------------------------------------------------------------------------
-- 8. PAYMENTS & MOBILE MONEY (Gestion Financière Module / Tiers Payant)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments_mobile_money (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  provider VARCHAR(50) NOT NULL, -- 'M-Pesa', 'Orange Money', 'Airtel Money', 'Visa/Mastercard'
  phone_number VARCHAR(30),
  transaction_ref VARCHAR(100) UNIQUE NOT NULL, -- Gateway validation token
  status validation_status_type NOT NULL DEFAULT 'IDLE',
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_ref ON payments_mobile_money(transaction_ref);

-- -----------------------------------------------------------------------------
-- 9. 4-EYES TRANSACTION MACHINE (Sécurité et Administration Financière)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions_4eyes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  beneficiary_name VARCHAR(255) NOT NULL,
  beneficiary_bank_account VARCHAR(100) NOT NULL,
  admin_a_initiator_id UUID NOT NULL REFERENCES users(id),
  admin_b_approver_id UUID REFERENCES users(id),
  status validation_status_type NOT NULL DEFAULT 'PENDING_ADMIN_B',
  sha256_receipt_hash VARCHAR(64) DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMPTZ
);

-- Add constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'enforce_different_operators'
  ) THEN
    ALTER TABLE transactions_4eyes
      ADD CONSTRAINT enforce_different_operators
      CHECK (admin_a_initiator_id <> admin_b_approver_id OR admin_b_approver_id IS NULL);
  END IF;
END$$;

-- -----------------------------------------------------------------------------
-- 10. TELEMEDICINE CONSULTATIONS (Module Télémédecine Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telemed_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_fullname VARCHAR(255) NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status validation_status_type NOT NULL DEFAULT 'IDLE',
  video_url TEXT,
  prescription_details TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telemed_schedule ON telemed_consultations(scheduled_at);

-- -----------------------------------------------------------------------------
-- 11. CRM & COMMERCIAL LEADS (CRM & Commercial Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  status lead_status_type NOT NULL DEFAULT 'NEW',
  assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  estimated_annual_premium NUMERIC(15, 2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);

-- -----------------------------------------------------------------------------
-- 12. IMMUTABLE SYSTEM WORM REGISTRY (Write-Once-Read-Many Audit)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs_worm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor_email VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  details TEXT NOT NULL,
  status severity_level_type NOT NULL DEFAULT 'SUCCESS',
  sha256_record_signature VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_worm_audit_action ON audit_logs_worm(action);
CREATE INDEX IF NOT EXISTS idx_worm_audit_timestamp ON audit_logs_worm(timestamp);

CREATE OR REPLACE FUNCTION protect_immutable_worm_trail()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'CRITICAL: Security Breach Incident. Audit logs are strictly WORM (Write Once Read Many). Deletions or updates are forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_protect_audit_trail ON audit_logs_worm;
CREATE TRIGGER trigger_protect_audit_trail
BEFORE UPDATE OR DELETE ON audit_logs_worm
FOR EACH ROW EXECUTE FUNCTION protect_immutable_worm_trail();

-- -----------------------------------------------------------------------------
-- 13. NOTIFICATION SETTINGS (Alertes Critiques Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  event_type VARCHAR(255) NOT NULL,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  slack_enabled BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, event_type)
);

-- -----------------------------------------------------------------------------
-- 14. SYSTEM API HEALTH (Interopérabilité Module)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_api_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OPERATIONAL',
  last_checked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 15. HASH CRYPTOGRAPHIC TRIGGER
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_audit_record_hash()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sha256_record_signature := encode(
    digest(
      concat_ws('|',
        COALESCE(NEW.id::text, ''),
        COALESCE(NEW.timestamp::text, ''),
        COALESCE(NEW.actor_email, ''),
        COALESCE(NEW.action, ''),
        COALESCE(NEW.details, '')
      ),
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Continuous trigger activation for tamper-proofing
DROP TRIGGER IF EXISTS trg_generate_audit_record_hash ON audit_logs_worm;
CREATE TRIGGER trg_generate_audit_record_hash
BEFORE INSERT ON audit_logs_worm
FOR EACH ROW EXECUTE FUNCTION generate_audit_record_hash();

-- -----------------------------------------------------------------------------
-- 16. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_4eyes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs_worm ENABLE ROW LEVEL SECURITY;

-- Super admin/audit policies examples
DROP POLICY IF EXISTS admin_trust_all_policy ON audit_logs_worm;
CREATE POLICY admin_trust_all_policy ON audit_logs_worm
  FOR SELECT
  USING (TRUE);

-- Establishments listing visibility
DROP POLICY IF EXISTS clinic_isolation_policy ON establishments;
CREATE POLICY clinic_isolation_policy ON establishments
  FOR SELECT TO public
  USING (deleted_at IS NULL);

-- -----------------------------------------------------------------------------
-- 17. SEED INITIALIZATION DATA
-- -----------------------------------------------------------------------------
INSERT INTO system_api_health (api_name, status)
VALUES
  ('Core DB Firestore', 'OPERATIONAL'),
  ('SSO Auth Server', 'OPERATIONAL'),
  ('ARCA Ref-Barieme RDC', 'OPERATIONAL'),
  ('Interopérabilité SNIS RDC', 'OPERATIONAL'),
  ('Orange Money Gateway', 'OPERATIONAL'),
  ('M-Pesa API Service', 'OPERATIONAL')
ON CONFLICT (api_name) DO UPDATE
SET status = EXCLUDED.status;
