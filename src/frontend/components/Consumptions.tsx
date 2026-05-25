/**
 * 📄 Fichier : /src/frontend/components/Consumptions.tsx
 * 🎯 Objectif : Suivi des consommations d'assurances santé en temps réel avec cost-control.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Wallet, AlertTriangle, TrendingUp, TrendingDown,
  Info, Shield, Users, Search, Download, Filter, 
  ChevronRight, ArrowUpRight, BarChart3, BellRing, ShieldCheck, 
  ClipboardCheck, History as HistoryIcon, X, Check, Lock, Unlock, Mail, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { EligibilityCheck } from './consumptions/EligibilityCheck';
import { ActsValidation } from './consumptions/ActsValidation';
import { ConsumptionHistory } from './consumptions/ConsumptionHistory';

export interface ConsumptionRecord {
  id: string;
  policyNumber: string;
  insuredName: string;
  companyName: string;
  consumed: number;
  totalCeiling: number;
  status: 'Normal' | 'Attention' | 'Critique';
  alerts: string[];
  history: Array<{ date: string; label: string; amount: number; location: string }>;
  isFrozen?: boolean;
}

const INITIAL_RECORDS: ConsumptionRecord[] = [
  {
    id: 'ENT-2025-001',
    policyNumber: 'ENT-2025-001',
    insuredName: 'Jean-Laurent Mukendi',
    companyName: 'Rawbank RDC',
    consumed: 10450,
    totalCeiling: 10000,
    status: 'Critique',
    alerts: ['Plafond Dentaire dépassé (104.5%)'],
    history: [
      { date: '12/03/2026', label: 'Consultation Dentaire', amount: 150, location: 'Hôpital Biamba Marie Mutola' },
      { date: '18/03/2026', label: 'Achat Prothèse & Remplacement', amount: 450, location: 'Pharmacie du Centre Kinshasa' },
      { date: '25/04/2026', label: 'Orthodontie Enfant curative', amount: 9850, location: 'Clinique Ngaliema' },
    ],
    isFrozen: false
  },
  {
    id: 'ENT-2025-042',
    policyNumber: 'ENT-2025-042',
    insuredName: 'Marie Curie Mpunga',
    companyName: 'Vodacom RDC',
    consumed: 9200,
    totalCeiling: 10000,
    status: 'Attention',
    alerts: ['Utilisation élevée (>90%)'],
    history: [
      { date: '10/02/2026', label: 'Consultation Pédiatrique', amount: 80, location: 'Hôpital HJ Hospitals' },
      { date: '14/03/2026', label: 'Scanner Tomographie abdomen', amount: 3500, location: 'Centre Médical de Kinshasa (CMK)' },
      { date: '21/05/2026', label: 'Hospitalisation intensive', amount: 5610, location: 'Clinique Ngaliema' }
    ],
    isFrozen: false
  },
  {
    id: 'ENT-2025-099',
    policyNumber: 'ENT-2025-099',
    insuredName: 'Robert Oppenheimer Kalonji',
    companyName: 'Bralima SARL',
    consumed: 1250,
    totalCeiling: 15000,
    status: 'Normal',
    alerts: [],
    history: [
      { date: '15/04/2026', label: 'Médecine Générale d\'urgence', amount: 150, location: 'Hôpital Sino-Congolais' },
      { date: '19/04/2026', label: 'Analyses Biologiques complètes', amount: 1100, location: 'Hôpital HJ Hospitals' }
    ],
    isFrozen: false
  },
  {
    id: 'IND-2025-301',
    policyNumber: 'IND-2025-301',
    insuredName: 'Sarah Al-Mansoori',
    companyName: 'Individuel Libre',
    consumed: 14200,
    totalCeiling: 15000,
    status: 'Attention',
    alerts: ['Utilisation élevée (>90%)'],
    history: [
      { date: '01/01/2026', label: 'Soins Optiques Réfractive', amount: 2200, location: 'Moorfields Hospital Dubai' },
      { date: '15/03/2026', label: 'IRM du Genou gauche', amount: 12000, location: 'Saudi German Hospital Dubai' }
    ],
    isFrozen: false
  }
];

export const Consumptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'validation' | 'history'>('overview');
  const [records, setRecords] = useState<ConsumptionRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Filters state
  const [filterConsoNinety, setFilterConsoNinety] = useState(false);
  
  // Modals & Drawers state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportPeriod, setExportPeriod] = useState('30j');
  const [exportReason, setExportReason] = useState('Audit Clinique RGPD');
  const [selectedRecord, setSelectedRecord] = useState<ConsumptionRecord | null>(null);
  
  // Alert message notification toast feedback
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Toggle Ice lock on specific policy (suspend the card temporarily due to fraud suspicion etc.)
  const handleToggleFreeze = (id: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        const nextState = !rec.isFrozen;
        triggerNotification(nextState ? `La police "${id}" a été gelée avec succès. Toutes les pré-autorisations sont bloquées.` : `La police "${id}" a été dégelée.`);
        return { ...rec, isFrozen: nextState };
      }
      return rec;
    }));
    // Clean selected drawer
    setSelectedRecord(null);
  };

  // Automated notification of RH for exceeds
  const handleNotifyRH = (policyNumber: string, company: string) => {
    triggerNotification(`Notification d'urgence envoyée par email & SMS au Gestionnaire RH de l'entreprise "${company}" concernant le dépassement du contrat ${policyNumber}.`);
  };

  const handleRunExport = (e: React.FormEvent) => {
    e.preventDefault();
    setExportModalOpen(false);
    triggerNotification(`Exportation autorisée et archivée sous le motif "${exportReason}". Période: ${exportPeriod}. Téléchargement initialisé de l'audit de consommation.`);
  };

  // Filter calculation
  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.insuredName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterConsoNinety) {
      const percentage = (rec.consumed / rec.totalCeiling) * 100;
      return matchesSearch && percentage >= 90;
    }
    return matchesSearch;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'eligibility': return <EligibilityCheck />;
      case 'validation': return <ActsValidation />;
      case 'history': return <ConsumptionHistory />;
      default: return (
        <div className="space-y-6">
          
          {/* Section: Automated Alert Banner at the top of the Overview module */}
          <div className="bg-gradient-to-r from-rose-50 to-rose-100/40 border border-rose-200 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-white border border-rose-200 text-rose-600 rounded-xl mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-rose-200/50 text-rose-700 text-[8px] font-black uppercase tracking-widest rounded-full border border-rose-300">
                  Alerte Dépassement Plafond
                </span>
                <p className="text-sm font-black text-rose-950 uppercase mt-1 leading-tight">Alerte de limitation de contrat</p>
                <p className="text-xs text-slate-500 italic max-w-xl">
                  La police <span className="font-bold text-rose-600">ENT-2025-001</span> (Jean-Laurent Mukendi - Rawbank RDC) a dépassé 100% du plafond dentaire annuel autorisé.
                </p>
              </div>
            </div>

            <button 
              onClick={() => handleNotifyRH('ENT-2025-001', 'Rawbank RDC')}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-colors shadow-lg shadow-rose-600/15 flex items-center gap-2 cursor-pointer outline-none shrink-0"
            >
              <Mail className="w-3.5 h-3.5" /> Notifier RH entreprise
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de Sinistralité GLOBAL</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">42.5% <span className="text-[10px] text-rose-500 font-extrabold">+2.1%</span></p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="w-[42.5%] h-full bg-green-500 rounded-full" />
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 text-white rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Wallet className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Remboursements (Mois)</p>
                  <p className="text-2xl font-black text-white mt-1">2.4M USD</p>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 mt-4 italic">Sur la base de 1,240 factures de tiers payant matchées</p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                  <Shield className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Économies (Fraudes évitées)</p>
                  <p className="text-2xl font-black text-rose-600 mt-1">85K USD</p>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 mt-4 italic">Analyse automatique par OCR et filtre d&apos;actes doublons</p>
            </div>
          </div>

          {/* Main Table Card representing B2 */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
            
            {/* Table Control header */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filtrer par police, assuré ou RH..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none w-64 focus:ring-4 focus:ring-green-500/10 focus:border-green-600 transition-all text-slate-800 font-bold"
                  />
                </div>

                {/* Filter Conso >90% Toggle */}
                <button 
                  onClick={() => setFilterConsoNinety(!filterConsoNinety)}
                  className={cn(
                    "px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                    filterConsoNinety 
                      ? "bg-rose-500 text-white border-transparent shadow-lg shadow-rose-500/10" 
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Conso &gt;90%
                </button>
              </div>

              {/* Exporter Button is registered to Audit & RGPD modal */}
              <button 
                onClick={() => setExportModalOpen(true)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                id="btn-export-audit"
              >
                <Download className="w-4 h-4" /> Exporter l&apos;audit
              </button>
            </div>

            {/* Consumption Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <th className="py-4 px-6">N° Police</th>
                    <th className="py-4 px-6">Assuré</th>
                    <th className="py-4 px-6">Entreprise / Cible</th>
                    <th className="py-4 px-6 text-right">Montant Consommé</th>
                    <th className="py-4 px-6">% Plafond</th>
                    <th className="py-4 px-6">Alerte active</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredRecords.map((rec) => {
                    const pctUsed = (rec.consumed / rec.totalCeiling) * 100;
                    return (
                      <tr 
                        key={rec.id} 
                        onClick={() => setSelectedRecord(rec)}
                        className={cn(
                          "hover:bg-slate-50/50 cursor-pointer transition-colors group",
                          rec.isFrozen ? "bg-slate-100/40 text-slate-400" : ""
                        )}
                      >
                        <td className="py-4 px-6 font-mono font-black text-slate-800">
                          <span className="flex items-center gap-1.5">
                            {rec.isFrozen && <Lock className="w-3 h-3 text-rose-500 shrink-0" />}
                            {rec.policyNumber}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-900 group-hover:text-green-600 transition-colors">
                          {rec.insuredName}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-extrabold uppercase text-[9px] rounded-lg border border-slate-200/50">
                            {rec.companyName}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-black text-slate-900">
                          {rec.consumed.toLocaleString()} $
                        </td>
                        <td className="py-4 px-6 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${Math.min(pctUsed, 100)}%` }} 
                                className={cn(
                                  "h-full rounded-full",
                                  pctUsed >= 100 ? "bg-rose-500" : pctUsed >= 85 ? "bg-amber-500" : "bg-green-500"
                                )}
                              />
                            </div>
                            <span className={cn(
                              "font-extrabold text-[10px]",
                              pctUsed >= 100 ? "text-rose-600" : pctUsed >= 85 ? "text-amber-500" : "text-green-600"
                            )}>
                              {pctUsed.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {rec.alerts.length > 0 ? (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black rounded border border-rose-100 uppercase tracking-tighter">
                              ⚠️ {rec.alerts[0]}
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic bg-emerald-50 px-2 py-0.5 rounded">
                              Conforme
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="p-2 bg-white group-hover:bg-green-50 rounded-xl border border-transparent group-hover:border-green-200 text-slate-400 group-hover:text-green-600 transition-all shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 italic font-medium">
                        Aucun résultat correspondant à votre filtrage.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center border-t border-slate-100">
              Visualisation en temps réel • Audit conforme aux normes RGPD &amp; HIPAA
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Embedded Live feedback toast overlay */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Action Réalisée</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 italic uppercase">Suivi des Consommations</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Calcul dynamique, contrôle anti-fraude et blocage immédiat</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'overview' ? "bg-white text-slate-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Aperçu
          </button>
          <button 
            onClick={() => setActiveTab('eligibility')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'eligibility' ? "bg-white text-slate-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ShieldCheck className="w-4 h-4 text-green-600" /> Éligibilité
          </button>
          <button 
            onClick={() => setActiveTab('validation')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'validation' ? "bg-white text-slate-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ClipboardCheck className="w-4 h-4 text-green-600" /> Validation
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'history' ? "bg-white text-slate-950 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <HistoryIcon className="w-4 h-4" /> Historique ACT
          </button>
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>

      {/* ========================================= */}
      {/* EXPORTATION MODAL (AUDITING & RGPD FOR B2) */}
      {/* ========================================= */}
      <AnimatePresence>
        {exportModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExportModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                    <Download className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight">Exportation Sécurisée (RGPD)</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Traçabilité légale obligatoire</p>
                  </div>
                </div>
                <button onClick={() => setExportModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRunExport} className="p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Période d&apos;extraction</label>
                  <select 
                    value={exportPeriod}
                    onChange={(e) => setExportPeriod(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-600/15 text-slate-800 uppercase"
                  >
                    <option value="30j">30 derniers jours</option>
                    <option value="90j">90 derniers jours</option>
                    <option value="1an">Année d&apos;exercice 2025</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Motif obligatoire d&apos;exportation</label>
                  <select 
                    value={exportReason}
                    onChange={(e) => setExportReason(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-600/15 text-slate-800"
                  >
                    <option value="Audit Clinique RGPD">Audit d&apos;établissement (Clinique/Cabinet)</option>
                    <option value="Vérification soupçon de fraude">Suspicion de Fraude - Contrôle Médical</option>
                    <option value="Transmission RH Trimestrielle">Contrôle de consommation - Partenaire RH</option>
                  </select>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl text-[9px] text-indigo-900 border border-indigo-100 italic">
                  🛑 Chaque export est consigné avec votre adresse mail adonailutonadio70@gmail.com, horodaté et archivé dans le grand livre de sécurité.
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setExportModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg cursor-pointer animate-pulse"
                  >
                    Confirmer et Télécharger
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* TIMELINE CLIENT DRAWER (LINE CLICK B2)    */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[180] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100"
            >
              <div className="p-8 border-b border-rose-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">TIMELINE DE CONSOMMATION</span>
                    <h3 className="text-lg font-black text-slate-900 uppercase italic mt-1">{selectedRecord.insuredName}</h3>
                  </div>
                  <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 items-center mt-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-mono font-bold border border-slate-200">
                    N° Police: {selectedRecord.policyNumber}
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold">
                    RH: {selectedRecord.companyName}
                  </span>
                </div>
              </div>

              {/* Timeline chronological entries */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chronologie des actes médicaux récents</p>

                <div className="relative border-l-2 border-indigo-100 pl-6 ml-2 space-y-6">
                  {selectedRecord.history.map((h, i) => (
                    <div key={i} className="relative space-y-1">
                      {/* circle */}
                      <span className="absolute left-[-31px] top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      </span>
                      <p className="text-[10px] text-slate-400 font-extrabold">{h.date}</p>
                      <p className="text-xs font-black text-slate-900 uppercase">{h.label}</p>
                      <p className="text-[11px] text-indigo-600 font-bold">{h.amount.toLocaleString()} $ • {h.location}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspicion Frozen Action */}
              <div className="p-8 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
                <div className="text-center pb-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase italic">🛡️ Option de blocage d&apos;urgence anti-fraude</p>
                </div>
                
                {selectedRecord.isFrozen ? (
                  <button 
                    onClick={() => handleToggleFreeze(selectedRecord.id)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-transparent"
                  >
                    <Unlock className="w-4 h-4" /> Dégeler les droits de la police
                  </button>
                ) : (
                  <button 
                    onClick={() => handleToggleFreeze(selectedRecord.id)}
                    className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-transparent"
                  >
                    <Lock className="w-4 h-4 animate-bounce" /> Geler d’urgence le contrat
                  </button>
                )}
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="w-full py-4 bg-transparent text-slate-400 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer text-center"
                >
                  Fermer la timeline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
