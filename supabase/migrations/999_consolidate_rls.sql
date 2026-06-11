-- ================================================================
-- NEOGTEC SAAS - SCHEMA COMPLET ARCA-RDC v2.1
-- Conformité: ISO 27001, RGPD, ARCA-RDC, Loi n°18/035 Protection Données
-- Date: 2026-06-11
-- ================================================================

BEGIN;

-- ================================================================
-- 0. EXTENSIONS & CONFIG
-- ================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ================================================================
-- 1. SCHEMAS
-- ================================================================
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS auth;

-- ================================================================
-- 2. CORE: MULTI-TENANT & RBAC
-- ================================================================

-- 2.1 TENANTS = Entreprises clientes: ACME, Sunu, Ngaliema
CREATE TABLE core.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  country text NOT NULL DEFAULT 'CD',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','deleted')),
  suspended_reason text,
  plan text NOT NULL DEFAULT 'silver' CHECK (plan IN ('silver','gold','platinum')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- 2.2 TENANT_BRANDING = Logo + Couleur par client
CREATE TABLE core.tenant_branding (
  tenant_id uuid PRIMARY KEY REFERENCES core.tenants(id) ON DELETE CASCADE,
  logo_url text,
  primary_color text DEFAULT '#00A86B',
  favicon_url text,
  created_at timestamptz DEFAULT now()
);

-- 2.3 PLANS = Tarifs SaaS
CREATE TABLE core.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  price_per_user numeric(10,2) NOT NULL,
  max_users int,
  features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 2.4 CONTRATS SAAS = ARCA-RDC oblige traçabilité
CREATE TABLE core.contrats_saas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  numero_contrat text UNIQUE NOT NULL,
  plan_id uuid REFERENCES core.plans(id),
  mrr numeric(10,2) NOT NULL,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  statut_signature text NOT NULL DEFAULT 'BROUILLON' CHECK (statut_signature IN ('BROUILLON','SIGNE','EXPIRE','RESILIE')),
  doc_url text,
  docusign_envelope_id text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

-- 2.5 SUBSCRIPTIONS = Facturation mensuelle
CREATE TABLE core.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  contrat_id uuid REFERENCES core.contrats_saas(id),
  user_count int NOT NULL,
  mrr_total numeric(10,2) NOT NULL,
  periode text NOT NULL, -- '2026-06'
  statut_paiement text DEFAULT 'PENDING' CHECK (statut_paiement IN ('PENDING','PAYE','IMPAYE','PARTIEL')),
  date_echeance date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, periode)
);

-- 2.6 INVOICES = Factures NeoGTec → Sunu
CREATE TABLE core.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  subscription_id uuid REFERENCES core.subscriptions(id),
  numero_facture text UNIQUE NOT NULL,
  montant_ht numeric(10,2) NOT NULL,
  tva numeric(10,2) NOT NULL DEFAULT 0,
  montant_ttc numeric(10,2) NOT NULL,
  devise text DEFAULT 'USD',
  statut text DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON','ENVOYEE','PAYEE','ANNULEE')),
  date_emission date DEFAULT CURRENT_DATE,
  date_paiement date,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- 2.7 MODULES = Feature flags par tenant
CREATE TABLE core.tenant_modules (
  tenant_id uuid REFERENCES core.tenants(id),
  module_code text NOT NULL, -- 'bi', 'teleconsultation', 'gps'
  is_enabled boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  PRIMARY KEY (tenant_id, module_code)
);

-- ================================================================
-- 3. RBAC : 12 ROLES + 50 PERMISSIONS
-- ================================================================

CREATE TABLE public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  tenant_id uuid REFERENCES core.tenants(id), -- null = system role
  is_system boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  module text NOT NULL,
  description text NOT NULL,
  is_dangerous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.role_permissions (
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES core.tenants(id),
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- ================================================================
-- 4. USERS & PROFILES
-- ================================================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES core.tenants(id),
  is_neogtec_staff boolean DEFAULT false,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  status text DEFAULT 'active' CHECK (status IN ('active','invited','suspended','deleted')),
  must_change_password boolean DEFAULT false,
  suspended_reason text,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  signature_digitale_hash text, -- Pour Dr. Sarah
  face_id_hash text,
  poste text,
  matricule text,
  created_at timestamptz DEFAULT now()
);

-- ================================================================
-- 5. METIER ASSURANCE SANTE
-- ================================================================

-- 5.1 ASSURES
CREATE TABLE public.assures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  user_id uuid REFERENCES public.profiles(id),
  numero_police text UNIQUE NOT NULL,
  nom text NOT NULL,
  post_nom text,
  prenom text NOT NULL,
  date_naissance date NOT NULL,
  sexe text CHECK (sexe IN ('M','F')),
  phone text,
  email text,
  photo_url text,
  qr_code_hash text UNIQUE NOT NULL, -- Hash dynamique
  statut_qr text DEFAULT 'ACTIF' CHECK (statut_qr IN ('ACTIF','SUSPENDU','BLOQUE')),
  consent_call boolean DEFAULT true,
  consent_whatsapp boolean DEFAULT true,
  consent_dme_medecin boolean DEFAULT false,
  consent_dme_date timestamptz,
  statut_medical_alerte text, -- 'ALLERGIQUE_PENICILLINE'
  created_at timestamptz DEFAULT now()
);

-- 5.2 POLICES_ASSURANCES
CREATE TABLE public.polices_assurances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  numero_contrat text NOT NULL,
  type_couverture text NOT NULL, -- 'HOSPITALISATION','AMBULATOIRE'
  plafond_annuel numeric(12,2) NOT NULL,
  plafond_consomme numeric(12,2) DEFAULT 0,
  date_debut date NOT NULL,
  date_fin date NOT NULL,
  statut text DEFAULT 'ACTIVE' CHECK (statut IN ('ACTIVE','EXPIREE','RESILIEE')),
  cascade_paiement_json jsonb NOT NULL, -- {"csu":70,"assureur":20,"patient":10}
  created_at timestamptz DEFAULT now()
);

-- 5.3 COTISATIONS = Primes mensuelles
CREATE TABLE public.cotisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  police_id uuid NOT NULL REFERENCES public.polices_assurances(id),
  periode text NOT NULL, -- '2026-06'
  prime_due numeric(10,2) NOT NULL,
  montant_paye numeric(10,2) DEFAULT 0,
  statut_paiement text DEFAULT 'PENDING' CHECK (statut_paiement IN ('PENDING','PAYE','IMPAYE','PARTIEL')),
  date_echeance date NOT NULL,
  date_paiement date,
  mode_paiement text, -- 'MOBILE_MONEY','VIREMENT'
  created_at timestamptz DEFAULT now(),
  UNIQUE(assure_id, periode)
);

-- 5.4 PRESTATAIRES = Hôpitaux, Pharmacies
CREATE TABLE public.prestataires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES core.tenants(id), -- Si hôpital = client
  user_id uuid REFERENCES public.profiles(id), -- Admin de l'hôpital
  type text NOT NULL CHECK (type IN ('HOPITAL','CLINIQUE','PHARMACIE','LABO','MEDECIN_LIBERAL')),
  nom text NOT NULL,
  adresse text,
  gps_lat numeric(10,6),
  gps_lng numeric(10,6),
  phone text,
  email text,
  is_teleconsultation_active boolean DEFAULT false,
  horaires_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- 5.5 TARIFS_CONVENTIONNES
CREATE TABLE public.tarifs_conventionnes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id uuid NOT NULL REFERENCES public.prestataires(id),
  assureur_tenant_id uuid NOT NULL REFERENCES core.tenants(id), -- Sunu, AXA
  code_acte text NOT NULL,
  libelle_acte text NOT NULL,
  tarif_conventionne numeric(10,2) NOT NULL,
  devise text DEFAULT 'USD',
  date_debut date DEFAULT CURRENT_DATE,
  date_fin date,
  created_at timestamptz DEFAULT now(),
  UNIQUE(prestataire_id, assureur_tenant_id, code_acte)
);

-- 5.6 PRISES_EN_CHARGE_PEC
CREATE TABLE public.prises_en_charge_pec (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id), -- Assureur qui paie
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  prestataire_id uuid NOT NULL REFERENCES public.prestataires(id),
  medecin_id uuid REFERENCES public.profiles(id),
  numero_pec text UNIQUE NOT NULL,
  type_pec text NOT NULL CHECK (type_pec IN ('CONSULTATION','HOSPITALISATION','PHARMACIE','LABO','URGENCE')),
  statut text DEFAULT 'DEMANDE' CHECK (statut IN ('DEMANDE','VALIDE','REJETE','FACTURE','PAYE')),
  motif_rejet text,
  montant_total numeric(10,2) NOT NULL,
  montant_csu numeric(10,2) DEFAULT 0,
  montant_assureur numeric(10,2) DEFAULT 0,
  montant_patient numeric(10,2) DEFAULT 0,
  signature_digitale_hash text,
  date_creation timestamptz DEFAULT now(),
  date_validation timestamptz,
  created_by uuid REFERENCES public.profiles(id)
);

-- 5.7 DOSSIER_MEDICAL = CHIFFRE ARCA-RDC
CREATE TABLE public.dossier_medical (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  donnees_chiffrees bytea, -- Chiffré AES-256 via pgsodium
  groupe_sanguin text,
  allergies text[],
  antecedents text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5.8 ORDONNANCES
CREATE TABLE public.ordonnances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  pec_id uuid REFERENCES public.prises_en_charge_pec(id),
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  medecin_id uuid NOT NULL REFERENCES public.profiles(id),
  qr_code_hash text UNIQUE NOT NULL,
  medicaments jsonb NOT NULL, -- [{nom, posologie, duree}]
  statut text DEFAULT 'ACTIVE' CHECK (statut IN ('ACTIVE','DISPENSEE','EXPIREE')),
  date_prescription timestamptz DEFAULT now(),
  date_expiration timestamptz
);

-- 5.9 DEROGATIONS
CREATE TABLE public.derogations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  pec_id uuid NOT NULL REFERENCES public.prises_en_charge_pec(id),
  demandeur_id uuid NOT NULL REFERENCES public.profiles(id), -- Médecin
  montant_demande numeric(10,2) NOT NULL,
  motif text NOT NULL,
  statut_decision text DEFAULT 'EN_ATTENTE' CHECK (statut_decision IN ('EN_ATTENTE','APPROUVE','REFUSE')),
  decideur_id uuid REFERENCES public.profiles(id),
  motif_refus text,
  date_decision timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 5.10 CLEARING_FACTURES = Bordereau Hôpital → Assureur
CREATE TABLE public.clearing_factures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id uuid NOT NULL REFERENCES public.prestataires(id),
  assureur_tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  numero_bordereau text UNIQUE NOT NULL,
  periode_debut date NOT NULL,
  periode_fin date NOT NULL,
  montant_total numeric(12,2) NOT NULL,
  statut text DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON','ENVOYE','VALIDE','PAYE','LITIGE')),
  pec_ids uuid[],
  date_paiement date,
  created_at timestamptz DEFAULT now()
);

-- ================================================================
-- 6. COMPLIANCE ARCA-RDC : AUDIT + CONSENT
-- ================================================================

-- 6.1 AUDIT_LOGS = IMMUABLE
CREATE TABLE audit.audit_logs (
  id bigserial PRIMARY KEY,
  tenant_id uuid,
  user_id uuid,
  action text NOT NULL, -- 'login', 'pec.create', 'finance.pay'
  entity_type text,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
REVOKE UPDATE, DELETE ON audit.audit_logs FROM authenticated;

-- 6.2 DECISION_LOGS = Refus/Autoriser
CREATE TABLE public.decision_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  entity_type text NOT NULL CHECK (entity_type IN ('PEC','DEROGATION','DME_ACCESS')),
  entity_id uuid NOT NULL,
  decision text NOT NULL CHECK (decision IN ('AUTORISE','REFUSE')),
  decided_by uuid NOT NULL REFERENCES public.profiles(id),
  motif text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6.3 CONSENT_LOGS = RGPD/ARCA
CREATE TABLE public.consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assure_id uuid NOT NULL REFERENCES public.assures(id),
  type_consent text NOT NULL, -- 'DME_MEDECIN','CALL','WHATSAPP'
  granted boolean NOT NULL,
  granted_by uuid, -- Si médecin scanne QR
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- 6.4 ALERTES_CRITIQUES
CREATE TABLE public.alertes_critiques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(id),
  type text NOT NULL CHECK (type IN ('PLAFOND_CRITIQUE','DEROGATION_ATTENTE','HOSPITALISATION','QR_BLOQUE')),
  severity text NOT NULL CHECK (severity IN ('INFO','WARNING','CRITICAL')),
  title text NOT NULL,
  message text NOT NULL,
  assure_id uuid REFERENCES public.assures(id),
  action_url text,
  is_read boolean DEFAULT false,
  assigned_to uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

-- ================================================================
-- 7. SEED 50 PERMISSIONS
-- ================================================================
INSERT INTO public.permissions (code, module, description, is_dangerous) VALUES
('user.create', 'users', 'Créer utilisateur', false),
('user.read', 'users', 'Voir utilisateurs', false),
('user.update', 'users', 'Modifier utilisateur', false),
('user.delete', 'users', 'Supprimer utilisateur', true),
('user.impersonate', 'users', 'Se connecter en tant que', true),
('user.edit_role', 'users', 'Modifier rôles', true),
('tenant.create', 'saas', 'Créer entreprise cliente', true),
('tenant.read', 'saas', 'Voir tous les tenants', true),
('tenant.suspend', 'saas', 'Suspendre un tenant', true),
('contrat_saas.manage', 'saas', 'Gérer contrats SaaS', true),
('plan.manage', 'saas', 'Gérer plans', true),
('finance.pay', 'finance', 'Émettre virement', true),
('finance.read', 'finance', 'Voir finance', false),
('cotisation.read', 'finance', 'Voir cotisations', false),
('cotisation.remind', 'finance', 'Relancer impayé', false),
('clearing_factures.validate', 'finance', 'Valider bordereau', true),
('sinistre.read', 'sinistres', 'Voir sinistres', false),
('sinistre.create', 'sinistres', 'Créer sinistre', false),
('sinistre.approve', 'sinistres', 'Approuver PEC', true),
('prise_en_charge.create', 'sinistres', 'Créer PEC', false),
('prise_en_charge.validate', 'sinistres', 'Valider PEC médicalement', true),
('derogation.request', 'sinistres', 'Demander dérogation', false),
('derogation.approve', 'sinistres', 'Approuver dérogation', true),
('dossier_medical.read', 'medical', 'Lire DME', true),
('dossier_medical.read_own', 'medical', 'Lire son propre DME', false),
('ordonnance.create', 'medical', 'Créer ordonnance', false),
('ordonnance.read', 'medical', 'Lire ordonnance', false),
('ordonnance.dispense', 'medical', 'Dispenser ordonnance', false),
('teleconsultation.start', 'medical', 'Lancer téléconsult', false),
('prestataire.update', 'prestataires', 'Modifier hôpital', false),
('tarifs_conventionnes.update', 'prestataires', 'Négocier tarifs', true),
('medecin.create', 'prestataires', 'Créer médecin', false),
('assure.read', 'assures', 'Voir assurés', false),
('assure.update', 'assures', 'Modifier assuré', false),
('compteurs_plafonds.read', 'assures', 'Voir plafonds', false),
('patient.contact', 'assures', 'Appeler patient', true),
('audit_logs.read', 'audit', 'Voir logs audit', true),
('decision_logs.read', 'audit', 'Voir historique décisions', false),
('alertes.read', 'alertes', 'Voir alertes critiques', false),
('alertes.manage', 'alertes', 'Assigner alertes', false),
('communication_hub.create', 'com', 'Envoyer message', false),
('notification.send', 'com', 'Envoyer notif push', false),
('dashboard.bi.read', 'bi', 'Voir Dashboard BI', false),
('tenant_modules.toggle', 'config', 'Activer/Désactiver module', true),
('tenant_branding.update', 'config', 'Changer logo/couleur', true),
('onboarding.complete', 'auth', 'Valider onboarding', false)
ON CONFLICT (code) DO NOTHING;

-- ================================================================
-- 8. SEED 12 ROLES
-- ================================================================
INSERT INTO public.roles (name, is_system, description) VALUES
('super_admin', true, 'Staff NeoGTec. Accès total'),
('admin_entreprise', true, 'Admin RH Client'),
('support_client', true, 'Collaborateur standard'),
('medecin', true, 'Médecin prestataire'),
('admin_prestataire', true, 'Admin Hôpital/Clinique'),
('pharmacien', true, 'Pharmacien prestataire'),
('finance_manager', true, 'Gestionnaire Finance Assureur'),
('auditeur_externe', true, 'CNAM/ARPTC Lecture seule'),
('assure', true, 'Assuré sur mobile'),
('support_neogtec', true, 'Support N1 NeoGTec'),
('pending_onboarding', true, 'Nouveau user'),
('suspended', true, 'Compte bloqué')
ON CONFLICT (name) DO NOTHING;

-- ================================================================
-- 9. MAPPING ROLES → PERMISSIONS
-- ================================================================
-- Super Admin = tout
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin Entreprise
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'user.create','user.read','user.update','user.edit_role',
  'sinistre.read','sinistre.approve','derogation.approve',
  'cotisation.read','cotisation.remind','assure.read','assure.update',
  'compteurs_plafonds.read','dashboard.bi.read','alertes.read','alertes.manage','decision_logs.read'
) WHERE r.name = 'admin_entreprise'
ON CONFLICT DO NOTHING;

-- Support Client
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'sinistre.read','sinistre.create','assure.read','compteurs_plafonds.read'
) WHERE r.name = 'support_client'
ON CONFLICT DO NOTHING;

-- Medecin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'prise_en_charge.create','prise_en_charge.validate','dossier_medical.read',
  'ordonnance.create','teleconsultation.start','patient.contact','assure.read'
) WHERE r.name = 'medecin'
ON CONFLICT DO NOTHING;

-- Admin Prestataire
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'medecin.create','prestataire.update','tarifs_conventionnes.update',
  'derogation.request','clearing_factures.validate','user.read','user.create'
) WHERE r.name = 'admin_prestataire'
ON CONFLICT DO NOTHING;

-- Pharmacien
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'ordonnance.read','ordonnance.dispense','prise_en_charge.create','patient.contact'
) WHERE r.name = 'pharmacien'
ON CONFLICT DO NOTHING;

-- Finance Manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'finance.pay','finance.read','clearing_factures.validate','derogation.approve',
  'cotisation.read','alertes.read'
) WHERE r.name = 'finance_manager'
ON CONFLICT DO NOTHING;

-- Auditeur Externe
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'audit_logs.read','decision_logs.read','dossier_medical.read','sinistre.read','assure.read'
) WHERE r.name = 'auditeur_externe'
ON CONFLICT DO NOTHING;

-- Assuré
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'dossier_medical.read_own','compteurs_plafonds.read','ordonnance.read'
) WHERE r.name = 'assure'
ON CONFLICT DO NOTHING;

-- Support NeoGTec
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.code IN (
  'user.impersonate','audit_logs.read','user.read'
) WHERE r.name = 'support_neogtec'
ON CONFLICT DO NOTHING;

-- ================================================================
-- 10. RLS - ROW LEVEL SECURITY ARCA-RDC
-- ================================================================

-- Helper Functions
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
$$;
CREATE OR REPLACE FUNCTION auth.is_staff() RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT COALESCE(is_neogtec_staff, false) FROM public.profiles WHERE id = auth.uid()
$$;
CREATE OR REPLACE FUNCTION auth.has_permission(p_code text) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid() AND p.code = p_code
  ) OR auth.is_staff()
$$;

-- Activer RLS sur toutes tables métier
ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenant_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.contrats_saas ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polices_assurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifs_conventionnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prises_en_charge_pec ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossier_medical ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordonnances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.derogations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clearing_factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertes_critiques ENABLE ROW LEVEL SECURITY;

-- Policy générique: Isolation Tenant
CREATE POLICY "tenant_isolation" ON core.tenants FOR SELECT USING (id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.profiles FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.assures FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.polices_assurances FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.cotisations FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.prises_en_charge_pec FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.dossier_medical FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.ordonnances FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.derogations FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.decision_logs FOR SELECT USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "tenant_isolation" ON public.alertes_critiques FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());

-- Policy: Médecin ne voit que ses PEC
CREATE POLICY "medecin_own_pec" ON public.prises_en_charge_pec FOR ALL USING (
  medecin_id = auth.uid() OR auth.is_staff()
);

-- Policy: Assuré ne voit que ses données
CREATE POLICY "assure_own" ON public.assures FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "assure_own_pec" ON public.prises_en_charge_pec FOR SELECT USING (
  assure_id IN (SELECT id FROM public.assures WHERE user_id = auth.uid())
);
CREATE POLICY "assure_own_dme" ON public.dossier_medical FOR SELECT USING (
  assure_id IN (SELECT id FROM public.assures WHERE user_id = auth.uid())
);

-- Policy: DME accès si consentement ARCA-RDC
CREATE POLICY "dme_consent" ON public.dossier_medical FOR SELECT USING (
  auth.is_staff() OR 
  assure_id IN (SELECT id FROM public.assures WHERE user_id = auth.uid()) OR
  (auth.has_permission('dossier_medical.read') AND EXISTS (
    SELECT 1 FROM public.consent_logs cl 
    WHERE cl.assure_id = dossier_medical.assure_id 
    AND cl.type_consent = 'DME_MEDECIN' 
    AND cl.granted = true
    AND cl.granted_to = auth.uid()
  ))
);

-- Policy: Audit logs immuables
CREATE POLICY "audit_read_only" ON audit.audit_logs FOR SELECT USING (auth.has_permission('audit_logs.read'));
REVOKE INSERT, UPDATE, DELETE ON audit.audit_logs FROM authenticated, anon;

-- Policy: Bloque si onboarding ou suspendu
CREATE OR REPLACE FUNCTION auth.check_status() RETURNS boolean AS $$
BEGIN
  IF (SELECT must_change_password FROM public.profiles WHERE id = auth.uid()) = true THEN
    RAISE EXCEPTION 'Onboarding requis' USING ERRCODE = 'P0001';
  END IF;
  IF (SELECT status FROM public.profiles WHERE id = auth.uid()) = 'suspended' THEN
    RAISE EXCEPTION 'Compte suspendu' USING ERRCODE = 'P0002';
  END IF;
  RETURN true;
END; $$ LANGUAGE plpgsql STABLE;

-- Appliquer sur tables critiques
CREATE POLICY "check_status" ON public.prises_en_charge_pec AS RESTRICTIVE FOR ALL USING (auth.check_status());
CREATE POLICY "check_status" ON public.dossier_medical AS RESTRICTIVE FOR ALL USING (auth.check_status());

COMMIT;
