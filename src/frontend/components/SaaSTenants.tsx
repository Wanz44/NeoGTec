/**
 * 📄 Fichier : /src/frontend/components/SaaSTenants.tsx
 * 🎯 Objectif : Module K.12 - Gestion SaaS / Locataires (Particulier pour "Module Système")
 * CONFORMITÉ : ISO/IEC 27001:2026, GDPR, ARCA RDC Regulation
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Globe, ShieldCheck, Lock, Search, X, 
  Hospital, Mail, MapPin, Activity, Server,
  CheckCircle, Users, CreditCard, ShieldAlert,
  Plus, Trash2, ArrowRight, Check, AlertTriangle,
  RotateCcw, Sparkles, BarChart3, Database, Key, Play, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

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
    status: 'unpaid',
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

export const SaasTenants: React.FC = () => {
  const [tenants, setTenants] = useState<EnterpriseTenant[]>(INITIAL_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('acme-tenant');
  const [activeSheetTab, setActiveSheetTab] = useState<'ensemble' | 'modules' | 'admins' | 'audits'>('ensemble');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');

  // Multi-step onboarding wizard
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
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
  const [wTypingConfirm, setWTypingConfirm] = useState('');
  const [wizardError, setWizardError] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (wPays === 'RDC') {
      setWTimezone('Africa/Kinshasa');
    } else if (wPays === 'France') {
      setWTimezone('Europe/Paris');
    } else if (wPays === 'UAE') {
      setWTimezone('Asia/Dubai');
    }
  }, [wPays]);

  const calculateWizardMrr = () => {
    let pricePerEmployee = wPlan === 'Gold' ? 3.5 : 2.0;
    if (wOptionApi) pricePerEmployee += 0.5;
    return wHeadcount * pricePerEmployee;
  };

  const handleNextStep = () => {
    setWizardError('');
    if (modalStep === 1) {
      if (!wRaisonSociale.trim()) {
        setWizardError('La raison sociale est requise.');
        return;
      }
      if (!wRccm.trim()) {
        setWizardError("Le numéro d'ID Fiscal / RCCM est requis pour validation.");
        return;
      }
      setModalStep(2);
    } else if (modalStep === 2) {
      setModalStep(3);
    } else if (modalStep === 3) {
      if (!wAdminName.trim() || !wAdminEmail.trim()) {
        setWizardError("Le nom de l'administrateur et son e-mail professionnel sont requis.");
        return;
      }
      if (!wAdminEmail.includes('@') || !wAdminEmail.includes('.')) {
        setWizardError("Format d'e-mail invalide.");
        return;
      }
      const parts = wAdminEmail.split('@');
      if (parts[1] && parts[1].toLowerCase() === 'gmail.com') {
        setWizardError("Veuillez utiliser un domaine d'e-mail professionnel (ex: @acme.cd), pas @gmail.com.");
        return;
      }
      setModalStep(4);
    }
  };

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
    showToast(`Entreprise ${wRaisonSociale} créée avec succès ! Base de données isolée PostgreSQL initialisée.`);
    
    // Clear state
    setWRaisonSociale('');
    setWRccm('');
    setWAdminName('');
    setWAdminEmail('');
    setWTypingConfirm('');
    setModalStep(1);
  };

  const toggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'active' ? 'suspended' : 'active';
        showToast(`Locataire ${t.name} passée au statut: ${nextStatus.toUpperCase()}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const triggerLateSuspension = (tenantId: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        const nextStatus = t.status === 'suspended' ? 'active' : 'suspended';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    showToast(`Action de suspension/activation togglée avec succès.`);
  };

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  return (
    <div id="saas-tenants-root" className="space-y-6 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -45, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-green-950 text-emerald-350 border border-green-500/30 shadow-2xl px-6 py-4 rounded-lg flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider">Synchronisation SaaS</p>
              <p className="text-[10px] font-medium text-white italic">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="p-6 bg-white border border-green-100 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-green-950 tracking-tight italic">
              Module K.12 : Gestion SaaS / Locataires
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">
              Cloisonnement de Données, Multi-Tenancy & Provisioning Élastique
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setModalStep(1);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-black uppercase tracking-wider transition-all border border-emerald-700 cursor-pointer shadow-lg shadow-emerald-700/10"
        >
          <Plus className="w-4 h-4" /> Nouvelle Entreprise (Locataire)
        </button>
      </div>

      {/* Metriques Globale */}
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
            <span className="text-[9px] font-bold text-slate-500">Bases PostgreSQL actives</span>
          </div>
        </div>
        <div className="p-5 rounded-lg border border-green-200 bg-white shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Assurés Inscrits</p>
          <p className="text-2xl font-black text-green-700 mt-1 italic">
            {tenants.reduce((acc, curr) => acc + curr.employeesCount, 0).toLocaleString()}
          </p>
          <div className="mt-2 text-[9px] font-bold text-slate-400">Total Capacité Actuelle</div>
        </div>
        <div className="p-5 rounded-lg border border-green-200 bg-white shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">État Infrastructure Cloud</p>
          <p className="text-xl font-black text-emerald-600 mt-1 italic">99.998% Uptime</p>
          <div className="mt-2 text-[8px] font-black text-slate-400 uppercase font-mono">STANDBY COLD CLUSTER</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tenants Listing Block */}
        <div className="lg:col-span-2 p-6 rounded-lg border border-green-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-[13px] font-black text-green-950 uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-650 animate-pulse" /> Locataires Enregistrés ({tenants.length})
                </h3>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  Surveillance en temps réel et allocation de ressources
                </p>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-black text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">PAYS (TOUS)</option>
                <option value="RDC">RDC</option>
                <option value="UAE">UAE</option>
                <option value="France">FRANCE</option>
              </select>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-black text-slate-700 outline-none cursor-pointer"
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
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Locataire</th>
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Pays / DDL</th>
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Plan</th>
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Assurés</th>
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase">SaaS MRR</th>
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase">Statut</th>
                    <th className="p-3 text-[9px] font-black text-slate-400 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants
                    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .filter(t => countryFilter === 'ALL' || t.country === countryFilter)
                    .filter(t => planFilter === 'ALL' || t.plan === planFilter)
                    .map((tenant) => {
                      const isSelected = selectedTenantId === tenant.id;
                      return (
                        <tr 
                          key={tenant.id}
                          onClick={() => setSelectedTenantId(tenant.id)}
                          className={cn(
                            "border-b border-slate-100 transition-colors cursor-pointer text-[10px] hover:bg-slate-50/50",
                            isSelected && "bg-emerald-50/40 font-semibold"
                          )}
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
                            <span className="block text-[7px] text-indigo-500 font-bold uppercase tracking-wide">POSTGRES ISOLATION</span>
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
                          </td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleTenantStatus(tenant.id)}
                              className={cn(
                                "px-2.5 py-1 text-[8px] font-black uppercase tracking-wider border rounded cursor-pointer transition-all",
                                tenant.status === 'active' 
                                  ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100" 
                                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                              )}
                            >
                              {tenant.status === 'active' ? 'Suspendre' : 'Activer'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Inspector Sidebar */}
        <div className="p-6 rounded-lg border border-green-200 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <span className="text-2xl">{currentTenant.logoUrl}</span>
              <div>
                <h3 className="text-[12px] font-black text-green-950 uppercase">{currentTenant.name}</h3>
                <p className="text-[9px] text-slate-450 font-semibold tracking-wide italic lowecase bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                  {currentTenant.adminEmail}
                </p>
              </div>
            </div>

            {/* Sub Tab selection */}
            <div className="flex bg-slate-100 p-1 rounded-md mb-6 gap-0.5">
              {(['ensemble', 'modules', 'admins', 'audits'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSheetTab(tab)}
                  className={cn(
                    "flex-1 text-[8px] font-black uppercase py-1.5 rounded transition-all cursor-pointer",
                    activeSheetTab === tab ? "bg-white text-green-950 shadow-sm" : "text-slate-450 hover:text-slate-650"
                  )}
                >
                  {tab === 'ensemble' ? 'Général' : tab === 'modules' ? 'Licences' : tab === 'admins' ? 'Admin' : 'Audit'}
                </button>
              ))}
            </div>

            {/* Tab: General */}
            {activeSheetTab === 'ensemble' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Assurés réels</span>
                    <p className="text-sm font-black text-green-950">{currentTenant.employeesCount} <span className="text-[9px] text-slate-400 font-normal">/ {currentTenant.employeesLimit}</span></p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full" 
                        style={{ width: `${(currentTenant.employeesCount / currentTenant.employeesLimit) * 100}%` }} 
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Sinistralité</span>
                    <p className="text-sm font-black text-amber-600 italic">{currentTenant.claimRate}%</p>
                    <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">Status ARCA CD</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-slate-500 uppercase">ID Unique</span>
                    <span className="font-mono text-slate-800 font-black">{currentTenant.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-150">
                    <span className="font-extrabold text-slate-500 uppercase">ISO 27001</span>
                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 uppercase px-1 rounded animate-pulse">Conforme</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Licenses Modules */}
            {activeSheetTab === 'modules' && (
              <div className="space-y-3">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Modules accordés sous contrat</span>
                <div className="space-y-1.5">
                  {[
                    { id: 'sinistres', name: '📂 Module Sinistres (K.33)' },
                    { id: 'pre-auth', name: "📂 Accords de Pré-autorisation" },
                    { id: 'facturation', name: "📂 Facturations de Tiers-Payant" },
                    { id: 'utilisateurs', name: '👥 Gestion Équipe & Habilitations' },
                    { id: 'api', name: "⚡ API Gateway & Interop RDC" }
                  ].map((m) => {
                    const isEnabled = currentTenant.modules.includes(m.id);
                    return (
                      <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded">
                        <span className="text-[9px] font-extrabold text-slate-700">{m.name}</span>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-wider",
                          isEnabled ? "text-emerald-600" : "text-slate-350"
                        )}>
                          {isEnabled ? 'Accordé' : 'Désactivé'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setTenants(prev => prev.map(t => {
                      if (t.id === currentTenant.id) {
                        const newPlan = t.plan === 'Silver' ? 'Gold' : 'Silver';
                        return {
                          ...t,
                          plan: newPlan,
                          modules: newPlan === 'Gold' 
                            ? ['sinistres', 'pre-auth', 'facturation', 'utilisateurs', 'api'] 
                            : ['sinistres', 'facturation'],
                          mrr: newPlan === 'Gold' ? (t.employeesLimit * 3.5) : (t.employeesLimit * 2)
                        };
                      }
                      return t;
                    }));
                    showToast(`Bascule de plan effectuée pour ${currentTenant.name}`);
                  }}
                  className="w-full mt-2 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[9px] font-black uppercase tracking-wide rounded cursor-pointer transition-colors"
                >
                  Changer de Plan Arbitrairement
                </button>
              </div>
            )}

            {/* Tab: Admins */}
            {activeSheetTab === 'admins' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase">{currentTenant.adminName}</p>
                      <p className="text-[8px] font-mono text-slate-400 lowercase">{currentTenant.adminEmail}</p>
                    </div>
                    <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[8px] font-black rounded">OWNER</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[9px]">
                    <span className="text-slate-400 font-bold uppercase">Multi-factor Authentication</span>
                    <span className="font-black text-emerald-600 uppercase flex items-center gap-1">✔ TOTP ACTIF</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Un e-mail d'urgence de réécriture MFA a été émis pour ${currentTenant.adminName}.`)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white text-[8px] font-black uppercase tracking-wider rounded border border-slate-950 cursor-pointer"
                >
                  Réinitialiser la clé Secrète MFA
                </button>
              </div>
            )}

            {/* Tab: Audits */}
            {activeSheetTab === 'audits' && (
              <div className="space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Registre de Traces d'activités (WORM)</span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {[
                    { time: "29/05 11:32", details: "Lancement du pipeline de backup PostgreSQL à chaud" },
                    { time: "29/05 09:12", details: "Vérification de consistance de table achevée avec succès" },
                    { time: "28/05 14:02", details: "Ajustement automatique d'échelle de quota d'assurés" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 border-l-2 border-l-emerald-500 rounded text-[8px] text-slate-650">
                      <span className="font-bold text-emerald-800 block">{item.time}</span>
                      <span className="italic">{item.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
              {currentTenant.status === 'suspended' ? "Rétablir l'accès au Tenant" : "Suspendre Instantanément le Tenant"}
            </button>
            <p className="text-[8px] text-slate-400 italic text-center mt-2 leading-normal">
              La coupure d'un locataire bloque instantanément ses interfaces du personnel affilié (Règles RLS active).
            </p>
          </div>
        </div>

      </div>

      {/* MODAL / DIALOG DU WIZARD MULTI-ETAPES */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 bg-slate-900 text-white border-b border-slate-950 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Nouveau Locataire (K.12)</span>
                  <h3 className="text-base font-black uppercase">Wizard de Provisioning d'Entreprise</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step indicator bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                {[
                  { step: 1, label: 'Identité' },
                  { step: 2, label: 'Plan & Quotas' },
                  { step: 3, label: 'Admin initial' },
                  { step: 4, label: 'Validation ddb' }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
                      modalStep === s.step 
                        ? "bg-emerald-600 text-white" 
                        : modalStep > s.step ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                    )}>
                      {modalStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                    </span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-wider hidden sm:inline",
                      modalStep === s.step ? "text-slate-800" : "text-slate-400"
                    )}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Wizard Content */}
              <div className="p-6 max-h-[360px] overflow-y-auto space-y-4">
                {wizardError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-[10px] font-bold text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{wizardError}</span>
                  </div>
                )}

                {/* Step 1: Profile Identité */}
                {modalStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Raison Sociale *</label>
                        <input
                          type="text"
                          required
                          placeholder="EX: SAFARICOM CONGO"
                          value={wRaisonSociale}
                          onChange={(e) => setWRaisonSociale(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">RCCM / ID Unique Fiscal *</label>
                        <input
                          type="text"
                          required
                          placeholder="CD/KIN/RCCM/26-B-998812"
                          value={wRccm}
                          onChange={(e) => setWRccm(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Logo / Glyphe</label>
                        <select
                          value={wLogo}
                          onChange={(e) => setWLogo(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold"
                        >
                          <option value="🏢">🏢 Entreprise</option>
                          <option value="🏢">🏢 Institution</option>
                          <option value="⚡">⚡ Tech</option>
                          <option value="🚜">🚜 Agricole / Industrie</option>
                          <option value="💎">💎 Premium</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Pays d'activité</label>
                        <select
                          value={wPays}
                          onChange={(e) => setWPays(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold"
                        >
                          <option value="RDC">RDC (République Démocratique du Congo)</option>
                          <option value="UAE">UAE (Dubai, Abu Dhabi)</option>
                          <option value="France">France</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Fuseau Horaire d'Hôte</label>
                        <input
                          type="text"
                          disabled
                          value={wTimezone}
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Plan Selection & Quotas capacity */}
                {modalStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        onClick={() => setWPlan('Gold')}
                        className={cn(
                          "p-4 border rounded cursor-pointer transition-all",
                          wPlan === 'Gold' ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-xl">⭐️</span>
                        <h4 className="text-[11px] font-black text-emerald-900 uppercase mt-2">Plan Gold (Standard)</h4>
                        <p className="text-[9px] text-slate-450 mt-1">3.5$ par employé inscrit. Accès complet aux APIs.</p>
                      </div>
                      <div 
                        onClick={() => setWPlan('Silver')}
                        className={cn(
                          "p-4 border rounded cursor-pointer transition-all",
                          wPlan === 'Silver' ? "bg-blue-50 border-blue-500" : "bg-white border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-xl">⚖️</span>
                        <h4 className="text-[11px] font-black text-blue-900 uppercase mt-2">Plan Silver (Lite)</h4>
                        <p className="text-[9px] text-slate-450 mt-1">2.0$ par employé. Pas de module API Gateway.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Capacité Max d'Assurés (Patients)</label>
                        <input
                          type="number"
                          value={wHeadcount}
                          onChange={(e) => setWHeadcount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-black text-slate-800"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <input
                          type="checkbox"
                          id="apiOption"
                          checked={wOptionApi}
                          onChange={(e) => setWOptionApi(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <label htmlFor="apiOption" className="text-[10px] font-extrabold text-slate-700 uppercase">Option API Interop (+0.5$/pers)</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Admin Account setup */}
                {modalStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-400 italic">Configurez le compte super-administrateur d'entreprise originel. Il sera invité à configurer son MFA à la première connexion.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Nom Complet Administrateur *</label>
                        <input
                          type="text"
                          placeholder="EX: Jean-Marc MUTOMBO"
                          value={wAdminName}
                          onChange={(e) => setWAdminName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Email Professionnel *</label>
                        <input
                          type="email"
                          placeholder="EX: jm.mutombo@nom-entreprise.cd"
                          value={wAdminEmail}
                          onChange={(e) => setWAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Postgres database creation, Isolation compliance */}
                {modalStep === 4 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg space-y-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="text-emerald-650 w-6 h-6 shrink-0" />
                        <div>
                          <h4 className="text-[11px] font-black text-emerald-950 uppercase">Architecture de Données Décentralisée</h4>
                          <p className="text-[9px] text-slate-450 mt-1 italic">
                            En validant cette signature, une nouvelle base de données Postgres dédiée sera provisionnée sur l'infrastructure cloud pour {wRaisonSociale}.
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-slate-500 uppercase">MRR SaaS Mensuel Estimé :</span>
                        <span className="font-black text-emerald-700 italic text-sm">${calculateWizardMrr().toLocaleString()} / mois</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                        SAISISSEZ "{wRaisonSociale.toUpperCase()}" POUR ENGAGER LA SIGNATURE :
                      </label>
                      <input
                        type="text"
                        value={wTypingConfirm}
                        placeholder={wRaisonSociale.toUpperCase()}
                        onChange={(e) => setWTypingConfirm(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-350 rounded outline-none text-[11px] font-black text-slate-800 uppercase tracking-widest"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer buttons */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (modalStep > 1) setModalStep(modalStep - 1);
                  }}
                  disabled={modalStep === 1}
                  className="px-4 py-2 border border-slate-200 rounded text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  Précédent
                </button>

                {modalStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-slate-900 border border-slate-950 hover:bg-slate-950 rounded text-[10.5px] font-black uppercase tracking-wider text-white"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleCreateEnterpriseSubmit}
                    className="px-5 py-2.5 bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 rounded text-[10.5px] font-black uppercase tracking-wider text-white flex items-center gap-2"
                  >
                    Créer et Déployer le Locataire
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
