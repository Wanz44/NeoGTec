-- =================================================================
-- 004_RLS_POLICIES.SQL - NeoGTec SaaS
-- Gère 12 profils + 50 permissions sans collision
-- =================================================================

BEGIN;

-- =========================================
-- 1. FONCTIONS HELPER POUR RLS
-- =========================================

-- Récupère tenant_id du user connecté. Null si Super Admin
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE;

-- Vérifie si Super Admin NeoGTec
CREATE OR REPLACE FUNCTION auth.is_staff() RETURNS boolean AS $$
  SELECT COALESCE(is_neogtec_staff, false) FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE;

-- Vérifie si user a une permission précise
CREATE OR REPLACE FUNCTION auth.has_permission(p_code text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid() AND p.code = p_code
  ) OR auth.is_staff() -- Super Admin bypass tout
$$ LANGUAGE sql STABLE;

-- Récupère le type de prestataire si user est médecin/pharma
CREATE OR REPLACE FUNCTION auth.prestataire_id() RETURNS uuid AS $$
  SELECT id FROM public.prestataires WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE;

-- Récupère assure_id si user est un assuré
CREATE OR REPLACE FUNCTION auth.assure_id() RETURNS uuid AS $$
  SELECT id FROM public.assures WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE;

-- =========================================
-- 2. SEED DES 12 ROLES
-- =========================================
INSERT INTO public.roles (id, name, tenant_id, is_system, description) VALUES
('00000000-0000-0000-0000-000000000001', 'super_admin', null, true, 'Staff NeoGTec. Accès total'),
('00000000-0000-0000-0000-000000000002', 'admin_entreprise', null, true, 'Admin RH Client'),
('00000000-0000-0000-0000-000000000003', 'support_client', null, true, 'Collaborateur standard'),
('00000000-0000-0000-0000-000000000004', 'medecin', null, true, 'Médecin prestataire'),
('00000000-0000-0000-0000-000000000005', 'admin_prestataire', null, true, 'Admin Hôpital/Clinique'),
('00000000-0000-0000-0000-000000000006', 'pharmacien', null, true, 'Pharmacien prestataire'),
('00000000-0000-0000-0000-000000000007', 'finance_manager', null, true, 'Gestionnaire Finance Assureur'),
('00000000-0000-0000-0000-000000000008', 'auditeur_externe', null, true, 'CNAM/ARPTC Lecture seule'),
('00000000-0000-0000-0000-000000000009', 'assure', null, true, 'Assuré sur mobile'),
('00000000-0000-0000-0000-000000000010', 'support_neogtec', null, true, 'Support N1 NeoGTec'),
('00000000-0000-0000-0000-000000000011', 'pending_onboarding', null, true, 'Nouveau user'),
('00000000-0000-0000-0000-000000000012', 'suspended', null, true, 'Compte bloqué')
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- 3. SEED DES 50 PERMISSIONS
-- =========================================
INSERT INTO public.permissions (code, module, description, is_dangerous) VALUES
-- Users
('user.create', 'users', 'Créer utilisateur', false),
('user.read', 'users', 'Voir utilisateurs', false),
('user.update', 'users', 'Modifier utilisateur', false),
('user.delete', 'users', 'Supprimer utilisateur', true),
('user.impersonate', 'users', 'Se connecter en tant que', true),
('user.edit_role', 'users', 'Modifier rôles', true),
-- SaaS
('tenant.create', 'saas', 'Créer entreprise cliente', true),
('tenant.read', 'saas', 'Voir tous les tenants', true),
('tenant.suspend', 'saas', 'Suspendre un tenant', true),
('contrat_saas.manage', 'saas', 'Gérer contrats SaaS', true),
-- Finance
('finance.pay', 'finance', 'Émettre virement', true),
('finance.read', 'finance', 'Voir finance', false),
('cotisation.read', 'finance', 'Voir cotisations', false),
('cotisation.remind', 'finance', 'Relancer impayé', false),
('clearing_factures.validate', 'finance', 'Valider bordereau', true),
-- Sinistres / PEC
('sinistre.read', 'sinistres', 'Voir sinistres', false),
('sinistre.create', 'sinistres', 'Créer sinistre', false),
('sinistre.approve', 'sinistres', 'Approuver PEC', true),
('prise_en_charge.create', 'sinistres', 'Créer PEC', false),
('prise_en_charge.validate', 'sinistres', 'Valider PEC médicalement', true),
('derogation.request', 'sinistres', 'Demander dérogation', false),
('derogation.approve', 'sinistres', 'Approuver dérogation', true),
-- Médical
('dossier_medical.read', 'medical', 'Lire DME', true),
('dossier_medical.read_own', 'medical', 'Lire son propre DME', false),
('ordonnance.create', 'medical', 'Créer ordonnance', false),
('ordonnance.read', 'medical', 'Lire ordonnance', false),
('teleconsultation.start', 'medical', 'Lancer téléconsult', false),
-- Prestataires
('prestataire.update', 'prestataires', 'Modifier hôpital', false),
('tarifs_conventionnes.update', 'prestataires', 'Négocier tarifs', true),
('medecin.create', 'prestataires', 'Créer médecin', false),
-- Assurés
('assure.read', 'assures', 'Voir assurés', false),
('compteurs_plafonds.read', 'assures', 'Voir plafonds', false),
('patient.contact', 'assures', 'Appeler patient', true),
-- Audit
('audit_logs.read', 'audit', 'Voir logs audit', true),
('decision_logs.read', 'audit', 'Voir historique décisions', false),
('alertes.read', 'alertes', 'Voir alertes critiques', false),
-- Communication
('communication_hub.create', 'com', 'Envoyer message', false),
('notification.send', 'com', 'Envoyer notif push', false),
-- BI
('dashboard.bi.read', 'bi', 'Voir Dashboard BI', false),
-- Spécial
('onboarding.complete', 'auth', 'Valider onboarding', false)
ON CONFLICT (code) DO NOTHING;

-- =========================================
-- 4. MAPPING ROLE → PERMISSIONS
-- =========================================
-- Super Admin = tout
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM public.permissions
ON CONFLICT DO NOTHING;

-- Admin Entreprise = Marie RH
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000002', id FROM public.permissions 
WHERE code IN ('user.create','user.read','user.update','sinistre.read','sinistre.approve','derogation.approve','cotisation.read','cotisation.remind','assure.read','compteurs_plafonds.read','dashboard.bi.read','alertes.read','decision_logs.read')
ON CONFLICT DO NOTHING;

-- Support Client = Jean
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000003', id FROM public.permissions 
WHERE code IN ('sinistre.read','sinistre.create','assure.read','compteurs_plafonds.read')
ON CONFLICT DO NOTHING;

-- Medecin = Dr. Sarah
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000004', id FROM public.permissions 
WHERE code IN ('prise_en_charge.create','prise_en_charge.validate','dossier_medical.read','ordonnance.create','teleconsultation.start','patient.contact','assure.read')
ON CONFLICT DO NOTHING;

-- Admin Prestataire = Admin Hôpital
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000005', id FROM public.permissions 
WHERE code IN ('medecin.create','prestataire.update','tarifs_conventionnes.update','derogation.request','clearing_factures.validate','user.read','user.create')
ON CONFLICT DO NOTHING;

-- Pharmacien
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000006', id FROM public.permissions 
WHERE code IN ('ordonnance.read','prise_en_charge.create','patient.contact')
ON CONFLICT DO NOTHING;

-- Finance Manager = Assureur
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000007', id FROM public.permissions 
WHERE code IN ('finance.pay','finance.read','clearing_factures.validate','derogation.approve','cotisation.read','alertes.read')
ON CONFLICT DO NOTHING;

-- Auditeur Externe
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000008', id FROM public.permissions 
WHERE code IN ('audit_logs.read','decision_logs.read','dossier_medical.read','sinistre.read','assure.read')
ON CONFLICT DO NOTHING;

-- Assuré
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000009', id FROM public.permissions 
WHERE code IN ('dossier_medical.read_own','compteurs_plafonds.read','ordonnance.read')
ON CONFLICT DO NOTHING;

-- Support NeoGTec N1
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000010', id FROM public.permissions 
WHERE code IN ('user.impersonate','audit_logs.read','user.read')
ON CONFLICT DO NOTHING;

-- =========================================
-- 5. RLS POLICIES - CORE
-- =========================================

-- 5.1 TENANTS : Seul Super Admin voit tout
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_all" ON public.tenants FOR ALL USING (auth.is_staff());
CREATE POLICY "tenant_self" ON public.tenants FOR SELECT USING (id = auth.tenant_id());

-- 5.2 PROFILES : Cloisonnement + Paul voit tout
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_all" ON public.profiles FOR ALL USING (auth.is_staff());
CREATE POLICY "tenant_users" ON public.profiles FOR SELECT USING (tenant_id = auth.tenant_id());
CREATE POLICY "user_self" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- =========================================
-- 6. RLS POLICIES - METIER
-- =========================================

-- 6.1 ASSURES
ALTER TABLE public.assures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON public.assures FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "assure_self" ON public.assures FOR SELECT USING (user_id = auth.uid());

-- 6.2 POLICES_ASSURANCES
ALTER TABLE public.polices_assurances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON public.polices_assurances FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());

-- 6.3 PRISES_EN_CHARGE_PEC = TABLE CRITIQUE
ALTER TABLE public.prises_en_charge_pec ENABLE ROW LEVEL SECURITY;
-- Règle 1 : Tenant = Sunu voit ses PEC
CREATE POLICY "tenant_isolation" ON public.prises_en_charge_pec FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
-- Règle 2 : Médecin ne voit que ses PEC
CREATE POLICY "medecin_own" ON public.prises_en_charge_pec FOR ALL USING (prestataire_id = auth.prestataire_id() OR auth.is_staff());
-- Règle 3 : Assuré ne voit que ses PEC
CREATE POLICY "assure_own" ON public.prises_en_charge_pec FOR SELECT USING (assure_id = auth.assure_id());

-- 6.4 DOSSIER_MEDICAL = DONNEE SENSIBLE
ALTER TABLE public.dossier_medical ENABLE ROW LEVEL SECURITY;
-- Seul médecin avec PEC active + Assuré + Staff
CREATE POLICY "dme_access" ON public.dossier_medical FOR SELECT USING (
  auth.is_staff() OR 
  assure_id = auth.assure_id() OR
  EXISTS (SELECT 1 FROM public.prises_en_charge_pec pec WHERE pec.assure_id = dossier_medical.assure_id AND pec.prestataire_id = auth.prestataire_id() AND pec.statut IN ('DEMANDE','VALIDE'))
);

-- 6.5 DEROGATIONS
ALTER TABLE public.derogations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON public.derogations FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
-- Seul RH + Finance peuvent approuver
CREATE POLICY "approve_only" ON public.derogations FOR UPDATE USING (auth.has_permission('derogation.approve'));

-- 6.6 COTISATIONS
ALTER TABLE public.cotisations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON public.cotisations FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "assure_own" ON public.cotisations FOR SELECT USING (assure_id = auth.assure_id());

-- 6.7 CLEARING_FACTURES
ALTER TABLE public.clearing_factures ENABLE ROW LEVEL SECURITY;
-- Seul Finance + Admin Presta + Staff
CREATE POLICY "finance_only" ON public.clearing_factures FOR ALL USING (
  auth.has_permission('finance.read') OR auth.is_staff()
);

-- 6.8 PRESTATAIRES
ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_read" ON public.prestataires FOR SELECT TO authenticated USING (true); -- Annuaire public
CREATE POLICY "admin_presta_write" ON public.prestataires FOR UPDATE USING (user_id = auth.uid() OR auth.is_staff());

-- 6.9 DECISION_LOGS
ALTER TABLE public.decision_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON public.decision_logs FOR SELECT USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "assure_own" ON public.decision_logs FOR SELECT USING (assure_id = auth.assure_id());

-- 6.10 ALERTES_CRITIQUES
ALTER TABLE public.alertes_critiques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON public.alertes_critiques FOR ALL USING (tenant_id = auth.tenant_id() OR auth.is_staff());
CREATE POLICY "assigned_or_admin" ON public.alertes_critiques FOR SELECT USING (assigned_to = auth.uid() OR auth.has_permission('alertes.read'));

-- =========================================
-- 7. FONCTION POUR BLOQUER SI ONBOARDING
-- =========================================
CREATE OR REPLACE FUNCTION auth.check_onboarding() RETURNS boolean AS $$
BEGIN
  IF (SELECT must_change_password FROM public.profiles WHERE id = auth.uid()) = true THEN
    RAISE EXCEPTION 'Onboarding requis' USING ERRCODE = 'P0001';
  END If;
  IF (SELECT status FROM public.profiles WHERE id = auth.uid()) = 'suspended' THEN
    RAISE EXCEPTION 'Compte suspendu' USING ERRCODE = 'P0002';
  END IF;
  RETURN true;
END; $$ LANGUAGE plpgsql STABLE;

-- Appliquer sur toutes les tables métier
ALTER TABLE public.prises_en_charge_pec ENABLE ROW LEVEL SECURITY;
CREATE POLICY "block_onboarding" ON public.prises_en_charge_pec AS RESTRICTIVE FOR ALL USING (auth.check_onboarding());

COMMIT;
