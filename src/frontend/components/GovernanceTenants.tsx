/**
 * 📄 Fichier : /src/frontend/components/GovernanceTenants.tsx
 * 🎯 Objectif : SaaS Multi-tenancy Management, CRM, Overlays & Roles Simulator
 * CONFORMITÉ : ISO/IEC 27001:2026, GDPR, ARCA RDC Regulation
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Globe, ShieldCheck, Lock, Search, X, 
  Hospital, Mail, Phone, MapPin, Activity, Server,
  CheckCircle, Users, CreditCard, UserCheck, ShieldAlert,
  Sliders, Plus, Trash2, ArrowRight, Check, AlertTriangle,
  RotateCcw, Sparkles, BarChart3, Database, Key, Play, AlertOctagon, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

// =============================================================================
// INTERFACES & TYPE DEFINITIONS
// =============================================================================

export interface EnterpriseTenant {
  id: string;
  name: string;
  rccm: string;
  country: string;
  plan: 'Silver' | 'Gold' | 'Custom';
  employeesCount: number;
  employeesLimit: number;
  status: 'active' | 'suspended' | 'unpaid';
  mrr: number;
  adminName: string;
  adminEmail: string;
  logoUrl: string;
  accentColor: string;
  modules: string[];
  claimRate: number;
  apiHealth: 'OK' | 'OUTAGE';
}

export interface AcmeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited';
  department: string;
  lastActive: string;
}

export interface CustomRole {
  name: string;
  permissions: {
    [key: string]: {
      view: boolean;
      create: boolean;
      modify: boolean;
      delete: boolean;
    }
  };
}

// =============================================================================
// SEED INITIAL STATES
// =============================================================================

const INITIAL_TENANTS: EnterpriseTenant[] = [
  {
    id: 'acme-tenant',
    name: 'ACME SARL',
    rccm: 'CD/KIN/RCCM/23-A-12345',
    country: 'RDC',
    plan: 'Gold',
    employeesCount: 1102,
    employeesLimit: 1200,
    status: 'active',
    mrr: 4200,
    adminName: 'Marie KAPEND',
    adminEmail: 'm.kapend@acme.cd',
    logoUrl: '🏢',
    accentColor: '#10b981',
    modules: ['sinistres', 'pre-auth', 'facturation', 'utilisateurs', 'api'],
    claimRate: 78,
    apiHealth: 'OK'
  },
  {
    id: 'beta-tenant',
    name: 'BETA SA',
    rccm: 'CD/GOM/RCCM/24-B-89745',
    country: 'UAE',
    plan: 'Silver',
    employeesCount: 450,
    employeesLimit: 500,
    status: 'active',
    mrr: 900,
    adminName: 'Jean-Luc NGOY',
    adminEmail: 'jl.ngoy@beta-corp.ae',
    logoUrl: '⚡',
    accentColor: '#3b82f6',
    modules: ['sinistres', 'pre-auth', 'facturation'],
    claimRate: 64,
    apiHealth: 'OK'
  },
  {
    id: 'delta-tenant',
    name: 'DELTA INDUSTRIAL',
    rccm: 'FR-TX-88319-75',
    country: 'France',
    plan: 'Custom',
    employeesCount: 3000,
    employeesLimit: 3000,
    status: 'unpaid', // Late SaaS payment J+15
    mrr: 10500,
    adminName: 'Chantal DUPONT',
    adminEmail: 'c.dupont@delta-ind.fr',
    logoUrl: '🚜',
    accentColor: '#f59e0b',
    modules: ['sinistres', 'facturation', 'utilisateurs', 'api'],
    claimRate: 92,
    apiHealth: 'OK'
  }
];

const INITIAL_ACME_USERS: AcmeUser[] = [
  { id: 'usr-1', name: 'Marie KAPEND', email: 'm.kapend@acme.cd', role: 'Super Admin', status: 'active', department: 'Direction', lastActive: 'Il y a 2m' },
  { id: 'usr-2', name: 'Jean MUKENGERI', email: 'jean.m@acme.cd', role: 'RH Standard', status: 'active', department: 'IT', lastActive: 'Il y a 10m' },
  { id: 'usr-3', name: 'Alain TSHIBANDA', email: 'a.tshibanda@acme.cd', role: 'Finance', status: 'active', department: 'Comptabilité', lastActive: 'Il y a 1h' },
  { id: 'usr-4', name: 'Sarah LUZOLO', email: 's.luzolo@acme.cd', role: 'Lecture seule', status: 'invited', department: 'Ventes', lastActive: 'Jamais (Invitation envoyée)' }
];

export const GovernanceTenants: React.FC = () => {
  // General view toggle levels
  const [level, setLevel] = useState<'N1_SUPER_ADMIN' | 'N2_ADMIN_ENTREPRISE' | 'N3_USER_FINAL'>('N1_SUPER_ADMIN');

  // Multi-tenancy State
  const [tenants, setTenants] = useState<EnterpriseTenant[]>(INITIAL_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('acme-tenant');
  const [activeSheetTab, setActiveSheetTab] = useState<'ensemble' | 'modules' | 'admins' | 'audits'>('ensemble');
  
  // Levels switching states
  const [activeUserRole, setActiveUserRole] = useState<'Marie' | 'Jean'>('Marie'); // Marie has full access, Jean has custom RH Standard
  const [activeEnterpriseId, setActiveEnterpriseId] = useState<string>('acme-tenant');

  // List search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');

  // Trigger Overlays / Modals States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState('');
  const [impersonated, setImpersonated] = useState(false);

  // Critical Dialog Triggers State
  const [showLimitReached, setShowLimitReached] = useState(false);
  const [showActionForbidden, setShowActionForbidden] = useState(false);
  const [showTenantSuspended, setShowTenantSuspended] = useState(false);

  // Level 1: Multi-Step Wizard State Input fields
  const [wRaisonSociale, setWRaisonSociale] = useState('');
  const [wRccm, setWRccm] = useState('');
  const [wPays, setWPays] = useState('RDC');
  const [wLogo, setWLogo] = useState('🏢');
  const [wTimezone, setWTimezone] = useState('Africa/Kinshasa');
  const [wPlan, setWPlan] = useState<'Silver' | 'Gold'>('Gold');
  const [wHeadcount, setWHeadcount] = useState(1200);
  const [wModulesEnabled, setWModulesEnabled] = useState<string[]>(['sinistres', 'pre-auth', 'facturation']);
  const [wOptionApi, setWOptionApi] = useState(true);
  const [wAdminName, setWAdminName] = useState('');
  const [wAdminEmail, setWAdminEmail] = useState('');
  const [wIsolatedDb, setWIsolatedDb] = useState(true);
  const [wTypingConfirm, setWTypingConfirm] = useState('');
  const [wizardError, setWizardError] = useState('');

  // Level 2: Core Invite & Roles States
  const [acmeUsers, setAcmeUsers] = useState<AcmeUser[]>(INITIAL_ACME_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('RH Standard');
  const [inviteDept, setInviteDept] = useState('IT');
  const [limitDept, setLimitDept] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [invitePermissions, setInvitePermissions] = useState({
    sinistres_voir: true,
    sinistres_approuver_small: true,
    sinistres_approuver_large: false,
    sinistres_supprimer: false,
    employes_ajouter: true,
    employes_suspendre: true,
    employes_exporter: false,
    factures_voir: false,
    factures_payer: false
  });

  // Custom Roles Matrix
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      name: 'Gestionnaire Paie',
      permissions: {
        'employe.export': { view: true, create: false, modify: true, delete: false },
        'sinistres.read': { view: true, create: false, modify: false, delete: false },
        'finance.read': { view: true, create: true, modify: true, delete: false }
      }
    }
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  // Dynamic MRR Recalculator inside wizard
  const calculateWizardMrr = () => {
    let pricePerEmployee = wPlan === 'Gold' ? 3.5 : 2.0;
    if (wOptionApi) pricePerEmployee += 0.5;
    return wHeadcount * pricePerEmployee;
  };

  // Toast notifier message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Automatically adjust Timezone depending on Selected Country
  useEffect(() => {
    if (wPays === 'RDC') {
      setWTimezone('Africa/Kinshasa');
    } else if (wPays === 'France') {
      setWTimezone('Europe/Paris');
    } else if (wPays === 'UAE') {
      setWTimezone('Asia/Dubai');
    }
  }, [wPays]);

  // Handler for Level 1 Wizard step progression
  const handleNextStep = () => {
    setWizardError('');
    if (modalStep === 1) {
      if (!wRaisonSociale.trim()) {
        setWizardError('La raison sociale est requise.');
        return;
      }
      if (!wRccm.trim()) {
        setWizardError('Le numéro d\'ID Fiscal / RCCM est requis pour validation.');
        return;
      }
      setModalStep(2);
    } else if (modalStep === 2) {
      setModalStep(3);
    } else if (modalStep === 3) {
      if (!wAdminName.trim() || !wAdminEmail.trim()) {
        setWizardError('Le nom de l\'administrateur et son e-mail professionnel sont requis.');
        return;
      }
      if (!wAdminEmail.includes('@') || !wAdminEmail.includes('.')) {
        setWizardError('Format d\'e-mail invalide.');
        return;
      }
      // Pro-domain validation check
      const parts = wAdminEmail.split('@');
      if (parts[1] && parts[1].toLowerCase() === 'gmail.com') {
        setWizardError('Veuillez utiliser un domaine d\'e-mail professionnel (ex: @acme.cd), pas @gmail.com.');
        return;
      }
      setModalStep(4);
    }
  };

  // Save/Create Enterprise Action
  const handleCreateEnterpriseSubmit = () => {
    if (wTypingConfirm.trim().toUpperCase() !== wRaisonSociale.trim().toUpperCase()) {
      setWizardError(`Veuillez saisir "${wRaisonSociale.toUpperCase()}" pour valider la signature financière.`);
      return;
    }

    const calculatedMrr = calculateWizardMrr();
    const newTenant: EnterpriseTenant = {
      id: `${wRaisonSociale.toLowerCase().replace(/\s+/g, '-')}-id`,
      name: wRaisonSociale,
      rccm: wRccm,
      country: wPays,
      plan: wPlan as any,
      employeesCount: 0,
      employeesLimit: wHeadcount,
      status: 'active',
      mrr: calculatedMrr,
      adminName: wAdminName,
      adminEmail: wAdminEmail,
      logoUrl: wLogo,
      accentColor: wPlan === 'Gold' ? '#10b981' : '#3b82f6',
      modules: [...wModulesEnabled, ...(wOptionApi ? ['api'] : [])],
      claimRate: 0,
      apiHealth: 'OK'
    };

    setTenants(prev => [...prev, newTenant]);
    setShowCreateModal(false);
    showToast(`Entreprise ${wRaisonSociale} créée avec succès ! Base de données isolée initialisée.`);
    
    // Clear wizard state inputs
    setWRaisonSociale('');
    setWRccm('');
    setWAdminName('');
    setWAdminEmail('');
    setWTypingConfirm('');
    setModalStep(1);
  };

  // Level 2 Handlers
  const handleInviteUser = () => {
    setDomainError('');
    if (!inviteEmail.trim()) return;

    if (!inviteEmail.includes('@')) {
      setDomainError('E-mail invalide.');
      return;
    }

    // Prohibit Gmail accounts if domain checking is strictly requested
    const domain = inviteEmail.substring(inviteEmail.indexOf('@') + 1);
    if (domain.toLowerCase() === 'gmail.com' || domain.toLowerCase() === 'yahoo.fr') {
      setDomainError(`Interdit : l'administration et le RGPD d'ACME refusent les comptes publics ${domain}.`);
      return;
    }

    const newUser: AcmeUser = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split('@')[0].toUpperCase(),
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      department: limitDept ? inviteDept : 'Tous les Départements',
      lastActive: 'Jamais (Invitation envoyée)'
    };

    setAcmeUsers(prev => [...prev, newUser]);
    setShowInviteModal(false);
    setInviteEmail('');
    showToast(`Invitation SaaS envoyée à ${inviteEmail} (Lien d'activation J+3)`);
  };

  const handleDeleteUser = (email: string) => {
    setAcmeUsers(prev => prev.filter(u => u.email !== email));
    setConfirmDeleteEmail('');
    showToast(`Utilisateur ${email} supprimé définitivement du tenant ACME`);
  };

  // Switch to simulated level easily with feedback
  const navigateToLevel = (levelId: typeof level) => {
    setLevel(levelId);
    showToast(`Émulation: Basculement vers le ${levelId === 'N1_SUPER_ADMIN' ? 'Général Super Admin NeoGTec' : levelId === 'N2_ADMIN_ENTREPRISE' ? 'Portail Client Admin de Marie KAPEND' : 'Tableau de bord de l\'Utilisateur RH Jean'}`);
  };

  // Quick helper to test the late payment suspend screen
  const triggerLateSuspension = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        return { ...t, status: t.status === 'suspended' ? 'active' : 'suspended' };
      }
      return t;
    }));
    
    // If ACME gets suspended, mock open the suspension screen for Level 3
    const acmeTenant = tenants.find(t => t.id === 'acme-tenant');
    if (acmeTenant && acmeTenant.status !== 'suspended') {
      setShowTenantSuspended(true);
    }
  };

  // Active tenant being viewed in N1 detailed pane
  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Alert Notice in the top corner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-green-950 text-emerald-350 border border-green-500/30 shadow-2xl px-6 py-4 rounded-lg flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider">Synchronisation Temps-Réel</p>
              <p className="text-[9px] font-medium text-white italic">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =============================================================================
          EMULATION COCKPIT SELECTOR BAR (HUMBLE & PROFESSIONAL CRAWL)
          ============================================================================= */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-950 text-slate-100 shadow-md">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-[12px] font-black uppercase tracking-wider text-emerald-450 italic">Moteur de Simulation Multi-Tenancy</h3>
            </div>
            <p className="text-[9px] font-medium text-slate-400 mt-1">
              Basculez entre les 3 niveaux d'administration pour tester l'étanchéité RGPD, le cloisonnement des données et le provisionnement des rôles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full xl:w-auto">
            <button
              onClick={() => navigateToLevel('N1_SUPER_ADMIN')}
              className={cn(
                "px-4 py-2.5 rounded-md text-[9px] font-black uppercase tracking-wider text-left md:text-center transition-all flex items-center gap-2 justify-center cursor-pointer",
                level === 'N1_SUPER_ADMIN' 
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-700/20" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              )}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" /> N1: Super Admin NeoGTec
            </button>
            <button
              onClick={() => navigateToLevel('N2_ADMIN_ENTREPRISE')}
              className={cn(
                "px-4 py-2.5 rounded-md text-[9px] font-black uppercase tracking-wider text-left md:text-center transition-all flex items-center gap-2 justify-center cursor-pointer",
                level === 'N2_ADMIN_ENTREPRISE' 
                  ? "bg-indigo-650 text-white shadow-lg shadow-indigo-600/20" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              )}
            >
              <Users className="w-4 h-4 shrink-0" /> N2: Admin ACME (Marie)
            </button>
            <button
              onClick={() => navigateToLevel('N3_USER_FINAL')}
              className={cn(
                "px-4 py-2.5 rounded-md text-[9px] font-black uppercase tracking-wider text-left md:text-center transition-all flex items-center gap-2 justify-center cursor-pointer",
                level === 'N3_USER_FINAL' 
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-655/20" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              )}
            >
              <UserCheck className="w-4 h-4 shrink-0" /> N3: RH Jean (U-Final)
            </button>
          </div>
        </div>
      </div>

      {/* =============================================================================
          NIVEAU 1 : SUPER ADMIN NEOGTEC DASHBOARD & OPERATIONS
          ============================================================================= */}
      {level === 'N1_SUPER_ADMIN' && (
        <div className="space-y-6">
          {/* Section 1 Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-lg border border-green-200 bg-white shadow-sm">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SaaS Revenue (MRR Global)</p>
              <p className="text-2xl font-black text-green-950 mt-1 italic">
                ${tenants.reduce((acc, curr) => acc + curr.mrr, 0).toLocaleString()} <span className="text-xs font-medium text-emerald-650 font-sans">/ mois</span>
              </p>
              <div className="mt-2 text-[9px] font-bold text-slate-400">Portefeuille clients NeoGTec</div>
            </div>
            <div className="p-5 rounded-lg border border-green-200 bg-white shadow-sm">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tenants Clients Total</p>
              <p className="text-2xl font-black text-slate-800 mt-1 italic">{tenants.length}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500">100% de bases décentralisées actives</span>
              </div>
            </div>
            <div className="p-5 rounded-lg border border-green-200 bg-white shadow-sm">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Assurés Inscrits</p>
              <p className="text-2xl font-black text-green-700 mt-1 italic">
                {tenants.reduce((acc, curr) => acc + curr.employeesCount, 0).toLocaleString()}
              </p>
              <div className="mt-2 text-[9px] font-bold text-slate-400">Cap max combiné: 4,700 patients</div>
            </div>
            <div className="p-5 rounded-lg border border-green-200 bg-white shadow-sm">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">État Infrastructure Cloud</p>
              <p className="text-2xl font-black text-emerald-600 mt-1 italic">99.99%</p>
              <div className="mt-2 text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider font-mono">OK / AWS COLD_STANDBY</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tenants Listing Block */}
            <div className="lg:col-span-2 p-6 rounded-lg border border-green-200 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-[13px] font-black text-green-950 uppercase flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-650" /> Tenants Entreprises : {tenants.length}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Vue globale et administration multilocataire
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setModalStep(1);
                      setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-black uppercase tracking-wider transition-all border border-emerald-700 cursor-pointer shadow-md shadow-emerald-700/10"
                  >
                    <Plus className="w-4 h-4" /> Nouvelle Entreprise
                  </button>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nom de l'entreprise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-black text-slate-700 outline-none"
                  >
                    <option value="ALL">PAYS (TOUS)</option>
                    <option value="RDC">RDC</option>
                    <option value="UAE">UAE</option>
                    <option value="France">FRANCE</option>
                  </select>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-black text-slate-700 outline-none"
                  >
                    <option value="ALL">PLANS (TOUS)</option>
                    <option value="Gold">GOLD ONLY</option>
                    <option value="Silver">SILVER ONLY</option>
                  </select>
                </div>

                {/* Tenants Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Entreprise</th>
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Pays / DDL</th>
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Plan</th>
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Assurés</th>
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase">MRR SaaS</th>
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Statut</th>
                        <th className="p-3 text-[9px] font-black text-slate-400 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants
                        .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .filter(t => countryFilter === 'ALL' || t.country === countryFilter)
                        .filter(t => planFilter === 'ALL' || t.plan === planFilter)
                        .map((tenant) => {
                          const isUnpaid = tenant.status === 'unpaid';
                          return (
                            <tr 
                              key={tenant.id}
                              className={cn(
                                "border-b border-slate-100 transition-colors cursor-pointer text-[10px]",
                                selectedTenantId === tenant.id ? "bg-emerald-50/40 font-semibold" : "hover:bg-slate-50",
                                isUnpaid && "bg-rose-50/40 relative"
                              )}
                              onClick={() => setSelectedTenantId(tenant.id)}
                            >
                              <td className="p-3 flex items-center gap-2">
                                <span className="text-sm">{tenant.logoUrl}</span>
                                <div>
                                  <p className="font-bold text-slate-800 uppercase">{tenant.name}</p>
                                  <p className="text-[8px] font-mono text-slate-400">{tenant.rccm}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="font-extrabold text-slate-600">{tenant.country}</span>
                                <span className="block text-[7px] text-indigo-505 font-bold uppercase tracking-wide">POSTGRES CHIP</span>
                              </td>
                              <td className="p-3">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-wider",
                                  tenant.plan === 'Gold' ? "bg-amber-100 text-amber-700" : tenant.plan === 'Silver' ? "bg-slate-100 text-slate-600" : "bg-purple-100 text-purple-700"
                                )}>
                                  {tenant.plan}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold">{tenant.employeesCount}</span> <span className="text-[8px] text-slate-400 font-medium">/ {tenant.employeesLimit}</span>
                              </td>
                              <td className="p-3 font-extrabold text-slate-700">
                                ${tenant.mrr.toLocaleString()}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn(
                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                    tenant.status === 'active' ? "bg-emerald-500" : tenant.status === 'suspended' ? "bg-rose-500" : "bg-amber-500"
                                  )} />
                                  <span className={cn(
                                    "font-black uppercase tracking-wide text-[8px]",
                                    tenant.status === 'active' ? "text-emerald-600" : "text-rose-600"
                                  )}>
                                    {tenant.status === 'active' ? 'ACTIF' : tenant.status === 'suspended' ? 'SUSPENDU' : 'IMPAYÉ'}
                                  </span>
                                </div>
                                {isUnpaid && (
                                  <span className="block text-[7px] font-black text-rose-500 animate-pulse mt-0.5">J+15 RETARD</span>
                                )}
                              </td>
                              <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  {isUnpaid && (
                                    <button
                                      onClick={() => showToast(`Rappel automatique envoyé au service finance de ${tenant.name}`)}
                                      className="px-2 py-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded-[3px] text-[8px] font-black uppercase tracking-wide cursor-pointer"
                                    >
                                      Relancer
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedTenantId(tenant.id);
                                      navigateToLevel('N2_ADMIN_ENTREPRISE');
                                      setImpersonated(true);
                                    }}
                                    title="Se connecter en tant que Marie"
                                    className="p-1 hover:bg-emerald-100 text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded transition-all cursor-pointer flex items-center gap-1 text-[8px] font-extrabold uppercase px-1.5"
                                  >
                                    <Key className="w-3.5 h-3.5" /> Impersonate
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tenant Sheet Sidebar Detail */}
            <div className="p-6 rounded-lg border border-green-200 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                  <span className="text-2xl">{currentTenant.logoUrl}</span>
                  <div>
                    <h3 className="text-[12px] font-black text-green-950 uppercase">{currentTenant.name}</h3>
                    <p className="text-[9px] text-slate-400 font-bold tracking-wide italic lowercase bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                      {currentTenant.adminEmail}
                    </p>
                  </div>
                </div>

                {/* Sub Tab selector */}
                <div className="flex bg-slate-100 p-1 rounded-md mb-6 gap-0.5">
                  {(['ensemble', 'modules', 'admins', 'audits'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSheetTab(tab)}
                      className={cn(
                        "flex-1 text-[8px] font-black uppercase py-1.5 rounded transition-all cursor-pointer",
                        activeSheetTab === tab ? "bg-white text-green-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {tab === 'ensemble' ? 'Général' : tab === 'modules' ? 'Modules' : tab === 'admins' ? 'Admins' : 'Audit'}
                    </button>
                  ))}
                </div>

                {/* Tab content 1: Ensemble */}
                {activeSheetTab === 'ensemble' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Assurés actifs</span>
                        <p className="text-sm font-black text-green-950">{currentTenant.employeesCount} <span className="text-[9px] text-slate-400 font-normal">/ {currentTenant.employeesLimit}</span></p>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${(currentTenant.employeesCount / currentTenant.employeesLimit) * 100}%` }} 
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Taux Sinistralité</span>
                        <p className="text-sm font-black text-amber-650 italic">{currentTenant.claimRate}%</p>
                        <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">Conformité ARCA</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded space-y-2">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Télémétrie API</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600 uppercase">Status Endpoint</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black">INTEROP OK</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 2: Modules & Options */}
                {activeSheetTab === 'modules' && (
                  <div className="space-y-3">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Modules activés pr ce client</span>
                    <div className="space-y-1.5">
                      {[
                        { id: 'sinistres', name: '📁 Gestion des Sinistres' },
                        { id: 'pre-auth', name: '📁 Pré-autorisations d\'accord' },
                        { id: 'facturation', name: '📁 Factures de Tiers-Payant' },
                        { id: 'utilisateurs', name: '🛡 Équipe RH & Administrateurs' },
                        { id: 'api', name: '⚙️ API Interop (Limite 10k/jour)' }
                      ].map((m) => {
                        const isEnabled = currentTenant.modules.includes(m.id);
                        return (
                          <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded">
                            <span className="text-[9px] font-extrabold text-slate-700">{m.name}</span>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-wider",
                              isEnabled ? "text-emerald-600" : "text-slate-300"
                            )}>
                              {isEnabled ? 'Activé' : 'Désactivé'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setTenants(prev => prev.map(t => {
                          if (t.id === currentTenant.id) {
                            const hasBiAndApi = t.modules.includes('api');
                            return {
                              ...t,
                              plan: t.plan === 'Silver' ? 'Gold' : 'Silver',
                              modules: t.plan === 'Silver' 
                                ? ['sinistres', 'pre-auth', 'facturation', 'utilisateurs', 'api'] 
                                : ['sinistres', 'facturation'],
                              mrr: t.plan === 'Silver' ? (t.employeesLimit * 3.5) : (t.employeesLimit * 2)
                            };
                          }
                          return t;
                        }));
                        showToast(`Le plan SaaS de ${currentTenant.name} a été basculé !`);
                      }}
                      className="w-full mt-2 py-2 border border-slate-200 hover:border-indigo-400 bg-slate-50 text-indigo-750 text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                    >
                      Basculez de Plan (Upgrade / Downgrade)
                    </button>
                  </div>
                )}

                {/* Tab content 3: Admins */}
                {activeSheetTab === 'admins' && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-800 uppercase">{currentTenant.adminName}</p>
                          <p className="text-[8px] font-mono text-slate-400 italic lowercase">{currentTenant.adminEmail}</p>
                        </div>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-black rounded">INITIAL</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
                        <span className="text-[8px] text-slate-400 font-bold uppercase">MFA STATUS</span>
                        <span className="text-[8px] font-black text-emerald-600 uppercase flex items-center gap-1">✔ ACTIF (TOTP)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`Le MFA de ${currentTenant.adminName} a été réinitialisé. E-mail de régénération d'urgence émis.`)}
                      className="w-full py-2 bg-slate-900 text-white hover:bg-rose-950 hover:text-rose-100 text-[8px] font-black uppercase tracking-wider rounded transition-all cursor-pointer border border-slate-950"
                    >
                      Réinitialiser le MFA de l'Administrateur
                    </button>
                  </div>
                )}

                {/* Tab content 4: Audits */}
                {activeSheetTab === 'audits' && (
                  <div className="space-y-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Traces d'audits du tenant (Gouvernance)</span>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {[
                        { time: "28/05 10:00", details: "Marie KAPEND a invité l'utilisateur RH Jean MUKENGERI" },
                        { time: "28/05 08:32", details: "Initialisation de la base de données PostgreSQL isolée" },
                        { time: "28/05 08:00", details: "Super Admin NeoGTec a approuvé l'ouverture du service" }
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 border-l-2 border-l-indigo-500 rounded text-[8px] text-slate-600">
                          <span className="font-bold text-indigo-750 block">{item.time}</span>
                          <span className="italic font-medium">{item.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Red suspend button at bottom */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <button
                  onClick={() => triggerLateSuspension(currentTenant.id)}
                  className={cn(
                    "w-full py-3 rounded text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border",
                    currentTenant.status === 'suspended' 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700" 
                      : "bg-rose-600 hover:bg-rose-700 text-white border-rose-700"
                  )}
                >
                  {currentTenant.status === 'suspended' ? 'Activer et Rétablir le Tenant' : 'Suspendre Immédiatement le Tenant'}
                </button>
                <p className="text-[8px] text-slate-400 italic text-center mt-2">
                  La coupure d'un tenant bloque instantanément l'accès aux interfaces N2 et N3 (Conformité de paiement).
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =============================================================================
          NIVEAU 2 : ADMIN ENTREPRISE (MARIE KAPEND @ ACME CLIENT PORTAL)
          ============================================================================= */}
      {level === 'N2_ADMIN_ENTREPRISE' && (
        <div className="space-y-6">
          <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏢</span>
              <div>
                <h3 className="text-[12px] font-black text-indigo-950 uppercase">Session Client de Marie KAPEND @ ACME SARL</h3>
                <p className="text-[9px] font-medium text-indigo-750 mt-0.5">
                  Plan Gold Actif / Base Postgres et RLS Déployés. Vous simulez en temps réel le menu disponible et configurez vos collaborateurs.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImpersonated(false);
                  setLevel('N1_SUPER_ADMIN');
                }}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-wider rounded border border-indigo-700 cursor-pointer"
              >
                Quitter l'Impersonation N2
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Table Users ACME */}
            <div className="lg:col-span-2 p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" /> Gestion de l'Équipe ACME ({acmeUsers.length})
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                    Ajoutez vos gestionnaires de sinistres de tier-payant et associez des rôles précis
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[9px] font-black uppercase tracking-wider cursor-pointer shadow"
                  >
                    + Inviter un collègue
                  </button>
                </div>
              </div>

              {/* Users list for Marie */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-medium">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[9px] text-slate-400 font-black uppercase">
                      <th className="p-3">Collaborateur</th>
                      <th className="p-3">Rôle Assigné</th>
                      <th className="p-3">Département d'Isolation</th>
                      <th className="p-3">Dernière Connexion</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acmeUsers.map((usr) => (
                      <tr key={usr.id} className="border-b border-slate-100 text-[10px] hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{usr.name}</p>
                          <p className="text-[8px] font-mono text-slate-400 lowercase">{usr.email}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-750 font-black text-[8px] uppercase">
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-600 italic">
                          {usr.department}
                        </td>
                        <td className="p-3 text-[9px] text-slate-400">
                          {usr.lastActive}
                        </td>
                        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex gap-1.5">
                            {usr.email !== 'm.kapend@acme.cd' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Voulez-vous révoquer l'accès pour ${usr.email} ?`)) {
                                    handleDeleteUser(usr.email);
                                  }
                                }}
                                className="p-1 hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded cursor-pointer"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Domain Notice */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/60 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-indigo-650 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-slate-705 uppercase">Règle de Sécurité des Domaines</p>
                  <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
                    Les invitations à cet espace de gouvernance ne sont autorisées qu'aux domaines professionnels approuvés de votre entité. Les e-mails de type générique (@gmail.com, @yahoo.fr) sont rejetés par défaut par la validation du formulaire de tier-payant NeoGTec.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Roles Builder Panel */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" /> Rôles Personnalisés
              </h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                Configurez ou visualisez la matrice d'habilitation d'un rôle métier avant de l'assigner
              </p>

              {/* Roles list */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-800 uppercase">Gestionnaire Paie</span>
                    <span className="text-[8px] font-black text-indigo-600 uppercase">3 Règles Actives</span>
                  </div>
                  <div className="space-y-1 text-[8px] font-mono text-slate-500">
                    <p>• export_employes → AUTORISÉ</p>
                    <p>• sinistres_create → REJETÉ</p>
                    <p>• factures_valider → AUTORISÉ (IT SEUL)</p>
                  </div>
                </div>
              </div>

              {/* Create Custom Role Trigger */}
              {!showCreateRoleForm ? (
                <button
                  onClick={() => setShowCreateRoleForm(true)}
                  className="w-full py-2.5 border border-slate-300 hover:border-indigo-400 text-[10px] text-slate-700 font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  + Créer un Rôle Personnalisé
                </button>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <span className="text-[9px] font-black text-indigo-950 uppercase block">Configuration d'un Rôle métier</span>
                  <input
                    type="text"
                    placeholder="Nom du rôle (ex: Audit Interne)..."
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-[9px] font-extrabold outline-none"
                  />
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase">Exemples de permissions (30 dispo)</label>
                    <div className="grid grid-cols-2 gap-2 text-[8px] font-bold text-slate-600">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" defaultChecked /> employe.export
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" /> claims.delete
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" defaultChecked /> finance.view
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" /> client.write
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowCreateRoleForm(false)}
                      className="flex-1 py-1.5 bg-slate-200 text-slate-700 text-[8px] font-black rounded uppercase cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        if (!newRoleName.trim()) return;
                        setCustomRoles(prev => [...prev, { name: newRoleName, permissions: {} }]);
                        setShowCreateRoleForm(false);
                        showToast(`Le rôle "${newRoleName}" a été pré-enregistré avec succès.`);
                        setNewRoleName('');
                      }}
                      className="flex-1 py-1.5 bg-indigo-650 text-white text-[8px] font-black rounded uppercase cursor-pointer"
                    >
                      Créer
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Simulated Sidebar impact depending on toggled modules */}
          <div className="p-6 rounded-lg border border-slate-200 bg-slate-50 font-medium">
            <h4 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Impact sur le menu principal des collaborateurs
            </h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-4 leading-relaxed">
              Tout module que vous désactivez disparaît instantanément de l'interface et du DOM de vos agents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[10px]">
              {[
                { label: '📁 Sinistres / Claims', active: currentTenant.modules.includes('sinistres'), help: 'Visible pour : Marie, Jean' },
                { label: '📁 Pré-autorisations', active: currentTenant.modules.includes('pre-auth'), help: 'Visible pour : Marie, Jean' },
                { label: '📁 Factures de Tiers-Payant', active: currentTenant.modules.includes('facturation'), help: 'Visible pour : Marie, Jean' },
                { label: '📈 Analytics & BI', active: currentTenant.modules.includes('api'), help: 'Option désactivée pour Jean !' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-slate-800">{item.label}</span>
                    <span className={cn(
                      "text-[8px] font-black uppercase rounded px-1",
                      item.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    )}>
                      {item.active ? 'AFFICHÉ' : 'CACHÉ'}
                    </span>
                  </div>
                  <p className="text-[8px] text-slate-400 italic mt-1">{item.help}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =============================================================================
          NIVEAU 3 : UTILISATEUR FINAL (RH JEAN @ RESTRICTED SPACE COCKPIT)
          ============================================================================= */}
      {level === 'N3_USER_FINAL' && (
        <div className="space-y-6">
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <h3 className="text-[12px] font-black text-amber-950 uppercase">Simulateur de Droits: Session de Jean MUKENGERI @ ACME SARL</h3>
            </div>
            <p className="text-[9px] font-medium text-amber-700 leading-relaxed italic">
              Jean a le rôle <span className="bg-amber-100 px-1 py-0.5 rounded font-black text-amber-850">RH Standard</span>. Il est expressément bridé par sa hiérarchie : pas d'accès Finance, pas d'export Excel disponible, et quota bloqué à 1200 collaborateurs inscrits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Live dashboard stats */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-amber-600" /> Mon Espace Collaborateur
              </h4>
              <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase">
                Vue d'ensemble de ses quotas critiques
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase">Assurés Actuels</span>
                    <p className="text-sm font-black text-slate-800">1,200 assurés</p>
                  </div>
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[8px] font-black uppercase rounded animate-pulse">LIMITE ATTEINTE</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase">Fichiers D'export</span>
                    <p className="text-sm font-black text-slate-800">Export désactivé</p>
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase italic">Permission employe.export=OFF</span>
                </div>
              </div>

              {/* Action trigger buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[8px] font-black text-slate-400 uppercase">Testez la réaction du système :</p>
                <button
                  onClick={() => setShowLimitReached(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  <span>1. Ajouter un 1201ème employé</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                </button>
                <p className="text-[7px] text-slate-400 italic">Déclenche automatiquement la barrière de dépassement de plan.</p>
              </div>
            </div>

            {/* Test Action Hors Perimetre */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-amber-600" /> Séparation des Tâches anti-fraude
              </h4>
              <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase">
                Contrôle d'accès lors de l'exécution d'un bouton critique
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <p className="text-[9px] font-extrabold text-slate-700 uppercase">Approbation Directe de Virement :</p>
                <p className="text-[8px] text-slate-400 mt-1 italic">
                  Jean fait partie de l'équipe RH. Il ne peut pas approuver les sinistres ou ordonner de paiement de Tiers Payant Hospitalier.
                </p>
              </div>

              {/* Action trigger buttons */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setShowActionForbidden(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200 text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  <span>2. Approuver Sinistre &gt; 500$</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-700" />
                </button>
                <p className="text-[7px] text-slate-400 italic">Intercepte instantanément l'action et signale les droits nécessaires.</p>
              </div>
            </div>

            {/* Simulate Suspended Tenant Action */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
              <h4 className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2">
                <AlertOctagon className="w-4.5 h-4.5 text-rose-600" /> Coupure de Service SaaS (Late Payment)
              </h4>
              <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase">
                Simulez la déchéance financière de tier-payant
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <p className="text-[9px] font-extrabold text-slate-700 uppercase">Impayé J+15 :</p>
                <p className="text-[8px] text-slate-400 mt-1 italic">
                  Le client DELTA INDUSTRIAL est suspendu par NeoGTec. Si un de ses collaborateurs tente de se logger, la plateforme le redirige immédiatement vers un écran de coupure global.
                </p>
              </div>

              {/* Action trigger buttons */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setShowTenantSuspended(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-900 hover:bg-slate-950 text-slate-300 border border-slate-950 text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                >
                  <span>3. Simuler Écran Tenant Suspendu</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <p className="text-[7px] text-slate-400 italic">Plein écran pour bloquer tout trafic frauduleux tant que le solde n'est pas régularisé.</p>
              </div>
            </div>

          </div>

          {/* Matrix Synth table of operations */}
          <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
            <h4 className="text-[11px] font-black text-slate-800 uppercase mb-2">Synthèse de Permissions : "Qui fait quoi ?"</h4>
            <div className="overflow-x-auto text-[9px]">
              <table className="w-full text-left font-medium border-collapse bg-white border border-slate-200 rounded">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-extrabold">
                    <th className="p-2.5">Action Platform</th>
                    <th className="p-2.5">Super Admin NeoGTec</th>
                    <th className="p-2.5">Admin Marie (ACME)</th>
                    <th className="p-2.5">RH Jean (U-Final)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-bold text-slate-800">Créer Entreprise ACME</td>
                    <td className="p-2.5 text-emerald-600 font-black flex items-center gap-1">✔ Oui</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-bold text-slate-800">Activer Module BI</td>
                    <td className="p-2.5 text-emerald-600 font-black">✔ Oui</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-bold text-slate-800">Créer Utilisateur Jean</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                    <td className="p-2.5 text-emerald-600 font-black">✔ Oui</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-bold text-slate-800">Dept IT Isolation</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                    <td className="p-2.5 text-emerald-600 font-black">✔ Oui</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 font-bold text-slate-800">Approuver Sinistre &lt; 500$</td>
                    <td className="p-2.5 text-rose-500">❌ Non</td>
                    <td className="p-2.5 text-emerald-600 font-black">✔ Oui (Si accord)</td>
                    <td className="p-2.5 text-emerald-500 font-black">✔ Oui (Si Marie l'accorde)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800">Supprimer logs d'audit</td>
                    <td className="p-2.5 text-rose-500 font-black text-rose-600 uppercase" colSpan={3}>❌ INTERDIT (Conformité de Base de Données Postgres WORM Inviolable)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* =============================================================================
          MODAL 1: CRÉER UNE NOUVELLE ENTREPRISE (4-STEPS WIZARD)
          ============================================================================= */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden text-[11px] text-slate-750 font-medium"
            >
              
              {/* Wizard Nav Steps Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-[12px] text-slate-900 uppercase italic">
                    Provisionner un Tenant NeoGTec (Multi-tenant)
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-1 font-bold tracking-wider uppercase">Étape {modalStep} sur 4</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-200/80 rounded cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Progress Bar indicator */}
              <div className="w-full bg-slate-100 h-1.5 flex">
                <div className={cn("h-full bg-emerald-500 transition-all", modalStep >= 1 ? "w-1/4" : "w-0")} />
                <div className={cn("h-full bg-emerald-500 transition-all", modalStep >= 2 ? "w-1/4" : "w-0")} />
                <div className={cn("h-full bg-emerald-500 transition-all", modalStep >= 3 ? "w-1/4" : "w-0")} />
                <div className={cn("h-full bg-emerald-500 transition-all", modalStep >= 4 ? "w-1/4" : "w-0")} />
              </div>

              {/* Wizard Steps Contents */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {wizardError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[10px] font-extrabold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> {wizardError}
                  </div>
                )}

                {/* STEP 1: Identité */}
                {modalStep === 1 && (
                  <div className="space-y-4">
                    <h5 className="font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" /> Informations Identitaires de l'Entreprise
                    </h5>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Raison Sociale *</label>
                        <input
                          type="text"
                          placeholder="Ex: ACME SARL"
                          value={wRaisonSociale}
                          onChange={(e) => setWRaisonSociale(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none font-bold text-slate-700 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">N° RCCM / ID FISCAL *</label>
                        <input
                          type="text"
                          placeholder="Ex: CD/KIN/RCCM/23-A-12345"
                          value={wRccm}
                          onChange={(e) => setWRccm(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none font-bold text-slate-700 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pays d'Implantation</label>
                        <select
                          value={wPays}
                          onChange={(e) => setWPays(e.target.value)}
                          className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded font-black text-slate-600 outline-none"
                        >
                          <option value="RDC">RDC (Devise USD/CDF)</option>
                          <option value="France">France (Devise EUR)</option>
                          <option value="UAE">Dubaï, UAE (Devise AED)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Fuseau Horaire (Auto)</label>
                        <input
                          type="text"
                          readOnly
                          value={wTimezone}
                          className="w-full px-2 py-2 bg-slate-100 border border-slate-200 rounded text-slate-400 font-bold select-none cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Logo de l'Entreprise</label>
                        <select
                          value={wLogo}
                          onChange={(e) => setWLogo(e.target.value)}
                          className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-650"
                        >
                          <option value="🏢">🏢 Immeuble Corporate</option>
                          <option value="⚡">⚡ Énergie / Tech</option>
                          <option value="🚜">🚜 Agricole / Industrie</option>
                          <option value="🌐">🌐 Logiciels / SaaS</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Plan & Modules SaaS */}
                {modalStep === 2 && (
                  <div className="space-y-4">
                    <h5 className="font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" /> Plan d'Abonnement et Modules Facturés
                    </h5>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => {
                          setWPlan('Silver');
                          setWModulesEnabled(['sinistres', 'facturation']);
                        }}
                        className={cn(
                          "p-4 rounded border text-left cursor-pointer transition-all",
                          wPlan === 'Silver' ? "bg-emerald-50 border-emerald-500" : "bg-slate-50 border-slate-200"
                        )}
                      >
                        <span className="text-[10px] font-black text-slate-900 uppercase">Plan Silver Standard</span>
                        <p className="text-[18px] font-black text-slate-800 mt-1 italic">$2.00 / user / mois</p>
                        <p className="text-[8px] text-slate-405 mt-2">Modules inclus de base : Sinistres & Factures prioritaires.</p>
                      </div>

                      <div
                        onClick={() => {
                          setWPlan('Gold');
                          setWModulesEnabled(['sinistres', 'pre-auth', 'facturation', 'utilisateurs']);
                        }}
                        className={cn(
                          "p-4 rounded border text-left cursor-pointer transition-all",
                          wPlan === 'Gold' ? "bg-amber-50/50 border-amber-500" : "bg-slate-50 border-slate-200"
                        )}
                      >
                        <span className="text-[10px] font-black text-slate-900 uppercase">Plan Gold Premium</span>
                        <p className="text-[18px] font-black text-amber-700 mt-1 italic">$3.50 / user / mois</p>
                        <p className="text-[8px] text-slate-405 mt-2">Accompagnement 24/7 de l'ARCA + Télémédecine complète incluse.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Effectif estimé pr facturation NeoGTec *</label>
                        <input
                          type="number"
                          value={wHeadcount}
                          onChange={(e) => setWHeadcount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none font-bold"
                        />
                      </div>
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Option API Interoperabilité</span>
                        <label className="flex items-center gap-1.5 mt-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={wOptionApi}
                            onChange={(e) => setWOptionApi(e.target.checked)}
                          />
                          <span className="text-[9px] font-bold text-slate-700">Activer API (+0.5$ / user / mois)</span>
                        </label>
                      </div>
                    </div>

                    {/* Recalculated MRR live summary card */}
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg flex justify-between items-center shadow-lg">
                      <div>
                        <span className="text-[8px] text-emerald-450 font-black uppercase tracking-widest">Projection SaaS Monthly Recurring Revenue (MRR)</span>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-bold">
                          {wHeadcount.toLocaleString()} employés x ${wPlan === 'Gold' ? (wOptionApi ? 4.0 : 3.5) : (wOptionApi ? 2.5 : 2.0)}
                        </p>
                      </div>
                      <p className="text-xl font-black text-white italic">${calculateWizardMrr().toLocaleString()}/mois</p>
                    </div>
                  </div>
                )}

                {/* STEP 3: Administrateur Principal */}
                {modalStep === 3 && (
                  <div className="space-y-4">
                    <h5 className="font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" /> Initialisation du Compte Administrateur Client
                    </h5>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase block">Nom Complet Admin *</label>
                        <input
                          type="text"
                          placeholder="Ex: Marie KAPEND"
                          value={wAdminName}
                          onChange={(e) => setWAdminName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase block">E-mail Professionnel de l'Admin *</label>
                        <input
                          type="email"
                          placeholder="m.kapend@acme.cd"
                          value={wAdminEmail}
                          onChange={(e) => setWAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black text-slate-800 uppercase">Envoyer e-mail d'activation MFA</span>
                        <p className="text-[8px] text-slate-400 italic">Lien sécurisé pour initialisation du token valable 72h.</p>
                      </div>
                      <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Récapitulatif & Confirmation finale */}
                {modalStep === 4 && (
                  <div className="space-y-4">
                    <h5 className="font-black text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                      Recapitulatif d'Ouverture de Compte
                    </h5>

                    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase text-emerald-450">{wRaisonSociale}</span>
                        <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-emerald-350 text-emerald-950 rounded">{wPlan} Plan</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                        <p>• Pays d'implantation : {wPays}</p>
                        <p>• Admin de contact : {wAdminName} ({wAdminEmail})</p>
                        <p>• Facture SaaS projetée : ${calculateWizardMrr().toLocaleString()}/mois</p>
                      </div>
                    </div>

                    {/* Mandatory GDPR isolation check */}
                    <label className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-300 rounded cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={wIsolatedDb}
                        onChange={(e) => setWIsolatedDb(e.target.checked)}
                        disabled
                      />
                      <div>
                        <span className="text-[10px] font-black text-emerald-950 uppercase">Créer une Base de Données Isolée Dédiée à l'Entreprise (Obligatoire RGPD)</span>
                        <p className="text-[9px] text-emerald-650 italic mt-1 font-medium">Bénéficie du RLS automatique et du verrouillage étanche sur Supabase.</p>
                      </div>
                    </label>

                    {/* Strict billing alert protection confirmation */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-150">
                      <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest block font-bold">
                        Veuillez saisir "{wRaisonSociale.toUpperCase()}" pour confirmer le provisionnement de ce tenant :
                      </label>
                      <input
                        type="text"
                        placeholder="Saisissez en majuscules..."
                        value={wTypingConfirm}
                        onChange={(e) => setWTypingConfirm(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-100 border border-rose-300 rounded font-black text-slate-800 outline-none uppercase font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Nav Steps Footer buttons */}
              <div className="bg-slate-50 border-t border-slate-200 p-5 flex gap-3">
                {modalStep > 1 && (
                  <button
                    onClick={() => setModalStep(prev => prev - 1)}
                    className="flex-1 py-3 text-slate-500 hover:text-slate-800 border border-slate-250 hover:bg-white text-[9px] font-black uppercase tracking-wider rounded cursor-pointer"
                  >
                    Précédent
                  </button>
                )}
                
                {modalStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider rounded cursor-pointer border border-emerald-700 shadow-md shadow-emerald-700/15"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleCreateEnterpriseSubmit}
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-black uppercase tracking-wider rounded cursor-pointer border border-emerald-800 shadow-md shadow-emerald-750/20"
                  >
                    Provisionner l'Entreprise
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* =============================================================================
          MODAL 2: INVITER UN COLLABORATEUR (NIVEAU 2 PORTAL)
          ============================================================================= */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden text-[11px] text-slate-700 font-medium"
            >
              
              <div className="bg-indigo-50 border-b border-indigo-100 p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-[12px] text-indigo-950 uppercase italic flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Inviter un collaborateur sur ACME
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Espace Administrateur Marie KAPEND</p>
                </div>
                <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-indigo-100 rounded cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {domainError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[10px] font-extrabold">
                    {domainError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Adresse E-mail Professionnelle *</label>
                  <input
                    type="email"
                    placeholder="ex: jean.m@acme.cd"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Rôle Métier prédéfini</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-650 outline-none"
                    >
                      <option value="RH Standard">RH Standard (Niveau de Jean)</option>
                      <option value="Finance">Finance (Restreint)</option>
                      <option value="Lecture seule">Auditeur en Lecture Seule</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Limiter par Département</label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={limitDept}
                        onChange={(e) => setLimitDept(e.target.checked)}
                      />
                      <select
                        disabled={!limitDept}
                        value={inviteDept}
                        onChange={(e) => setInviteDept(e.target.value)}
                        className="flex-1 py-1.5 px-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-650 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="IT">Département IT</option>
                        <option value="Ventes">Département Ventes</option>
                        <option value="Direction">Direction</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Granular permissions preview list */}
                <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                  <span className="text-[9px] font-black text-indigo-950 uppercase block">Règles & Permissions granulaires appliquées</span>
                  <div className="grid grid-cols-2 gap-2 text-[8.5px] font-extrabold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invitePermissions.sinistres_voir}
                        onChange={(e) => setInvitePermissions(prev => ({ ...prev, sinistres_voir: e.target.checked }))}
                      />
                      <span>Voir les Sinistres ACME</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invitePermissions.sinistres_approuver_small}
                        onChange={(e) => setInvitePermissions(prev => ({ ...prev, sinistres_approuver_small: e.target.checked }))}
                      />
                      <span>Approuver claims &lt; 500$</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invitePermissions.sinistres_approuver_large}
                        onChange={(e) => setInvitePermissions(prev => ({ ...prev, sinistres_approuver_large: e.target.checked }))}
                      />
                      <span>Approuver claims &gt; 500$</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invitePermissions.employes_ajouter}
                        onChange={(e) => setInvitePermissions(prev => ({ ...prev, employes_ajouter: e.target.checked }))}
                      />
                      <span>Ajouter des Assurés</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invitePermissions.employes_exporter}
                        onChange={(e) => setInvitePermissions(prev => ({ ...prev, employes_exporter: e.target.checked }))}
                      />
                      <span>Exporter Excel / CSV</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invitePermissions.factures_voir}
                        onChange={(e) => setInvitePermissions(prev => ({ ...prev, factures_voir: e.target.checked }))}
                      />
                      <span>Voir les Factures SaaS</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 border-t border-slate-200 flex gap-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 text-slate-500 hover:text-slate-800 border border-slate-300 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer bg-white"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInviteUser}
                  className="flex-1 py-2.5 bg-indigo-650 text-white rounded text-[9px] font-black uppercase tracking-wider cursor-pointer border border-indigo-700 shadow"
                >
                  Envoyer Invitation
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* =============================================================================
          3 CRITICAL DIALOG OVERLAYS OF DOOM (INTERACTIVE OVERLAYS)
          ============================================================================= */}
      
      {/* 1. LIMIT REACHED DIALOG OVERLAY */}
      <AnimatePresence>
        {showLimitReached && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur" onClick={() => setShowLimitReached(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-lg border-t-4 border-t-rose-500 shadow-2xl overflow-hidden p-6 text-[10.5px] space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 rounded-full text-rose-600">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[12px] text-slate-900 uppercase">Limite SaaS Atteinte !</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Module K.12 : Gestion Quotas</p>
                </div>
              </div>

              <p className="text-slate-500 font-semibold leading-relaxed">
                Vous avez atteint le plafond strict de <span className="font-bold text-slate-800">1,200 assurés actifs</span> configurés sur votre plan ACME. L'enregistrement du 1201ème est refusé.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded leading-relaxed">
                <p className="font-extrabold text-slate-800">Pour continuer à enregistrer vos employés :</p>
                <p className="text-[9px] text-slate-405 mt-1">• Demandez à Marie de passer en Plan Gold (Max 3,000 employés)</p>
                <p className="text-[9px] text-slate-405">• Supprimez un collaborateur archivé dans votre liste</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowLimitReached(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-black uppercase rounded cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowLimitReached(false);
                    setLevel('N2_ADMIN_ENTREPRISE');
                    showToast("Basculez de plan sur l'onglet de gauche pour déverrouiller le quota.");
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase rounded cursor-pointer shadow border border-emerald-700"
                >
                  Upgrade maintenant
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ACTION FORBIDDEN OUT OF PERIMETER DIALOG */}
      <AnimatePresence>
        {showActionForbidden && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur" onClick={() => setShowActionForbidden(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-lg border-t-4 border-t-amber-500 shadow-2xl overflow-hidden p-6 text-[10.5px] space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-full text-amber-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[12px] text-slate-900 uppercase text-amber-700">Action Hors Périmètre !</h4>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Contrôle d'accès & Traçabilité</p>
                </div>
              </div>

              <p className="text-slate-500 font-semibold leading-relaxed">
                Votre rôle <span className="font-bold text-slate-800">RH Standard (Jean)</span> ne vous autorise pas à approuver des ordonnances ou valider des sinistres financiers supérieurs à 500$ dans le système.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded text-slate-600">
                <span className="font-black text-amber-950 uppercase text-[9px] block">Raison réglementaire (ARCA / CNIL)</span>
                <p className="italic mt-1 leading-normal">
                  Chaque validation de claim requiert une double-signature Admin B habilitée. Veuillez contacter votre administratrice principale Marie KAPEND (m.kapend@acme.cd).
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowActionForbidden(false)}
                  className="px-4 py-2 bg-slate-950 text-white hover:bg-slate-800 text-[9px] font-black uppercase rounded cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. TENANT SUSPENDED FULL-SCREEN SYSTEM REJECTION */}
      <AnimatePresence>
        {showTenantSuspended && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-rose-950/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="w-full max-w-xl bg-white border border-rose-300 rounded-lg shadow-2xl p-8 text-center space-y-6 text-[11px] text-slate-700 font-medium"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-rose-100 rounded-full text-rose-600">
                  <AlertOctagon className="w-10 h-10 animate-pulse text-rose-600" />
                </div>
                <h3 className="text-xl font-black text-rose-950 uppercase italic tracking-tight">Accès Suspendu - Tenant ACME</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Erreur de conformité / Fin de solde</p>
              </div>

              <p className="text-slate-500 font-semibold leading-relaxed text-sm">
                L'accès à la plateforme <span className="font-black text-rose-800 uppercase">ACME SARL</span> a été interrompu temporairement pour défaut de paiement de la facture mensuelle Cloud SaaS NeoGTec.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-left space-y-2 max-w-md mx-auto leading-relaxed">
                <p className="font-black text-slate-800 uppercase tracking-wide">Que devez-vous faire ?</p>
                <p className="text-slate-500">• Contacter votre service de finances interne (m.kapend@acme.cd)</p>
                <p className="text-slate-500">• Ou envoyer un justificatif de paiement à finance@neogtec.com</p>
              </div>

              <p className="text-[9px] text-slate-400 italic font-bold">
                Toutes les données de vos assurés et cliniques partenaires restent chiffrées et protégées (Conformité RGPD). Aucun dossier n'est détruit.
              </p>

              <div className="pt-4 flex gap-2 justify-center">
                <button
                  onClick={() => setShowTenantSuspended(false)}
                  className="px-6 py-2.5 bg-slate-900 text-slate-300 hover:text-white rounded text-[9px] font-black uppercase tracking-widest cursor-pointer"
                >
                  Simuler un retour au panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
