/**
 * 📄 Fichier : /src/frontend/components/Analytics.tsx
 * 🎯 Objectif : Gestion des Gestionnaires, Kanban des sinistres, profils, règles d'attribution d'Adonai et Analytics.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  BarChart3, TrendingUp, Users, Wallet, Download, 
  Filter, Calendar, ChevronRight, ArrowUpRight, 
  Activity, ShieldAlert, FileSearch, Share2, Key,
  UserPlus, CheckCircle, Clock, Check, X, Sliders, Play, Settings2, User
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Recharts Chart Mock Data ---
const REVENUE_DATA = [
  { name: 'Jan', approved: 4500, rejected: 1200, pending: 800 },
  { name: 'Feb', approved: 5200, rejected: 1500, pending: 1100 },
  { name: 'Mar', approved: 4800, rejected: 1100, pending: 950 },
  { name: 'Apr', approved: 6100, rejected: 1800, pending: 1500 },
  { name: 'May', approved: 5900, rejected: 1400, pending: 1300 },
];

const CLAIM_TYPE_DATA = [
  { name: 'Dentaire', value: 45, color: '#4f46e5' },
  { name: 'Soin Optique', value: 25, color: '#0ea5e9' },
  { name: 'Hospitalisation', value: 20, color: '#10b981' },
  { name: 'Médecine Générale', value: 10, color: '#f59e0b' },
];

// --- B3 Manager Profile Data ---
interface Manager {
  id: string;
  name: string;
  avatar: string;
  lang: string;
  coverage: string[];
  maxThreshold: number;
}

const INITIAL_MANAGERS: Manager[] = [
  { id: 'M1', name: 'Benoit Lucas', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop', lang: 'Français', coverage: ['Dentaire', 'Médecine Générale'], maxThreshold: 500 },
  { id: 'M2', name: 'Adonïa Lutonadio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop', lang: 'Français, Anglais', coverage: ['Dentaire', 'Optique', 'Hospitalisation'], maxThreshold: 5000 },
  { id: 'M3', name: 'Marie Mpunga', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop', lang: 'Français, Portugais', coverage: ['Hospitalisation', 'Optique'], maxThreshold: 20000 },
];

// --- B3 Kanban Claim Ticket Data ---
interface ClaimTicket {
  id: string;
  patientName: string;
  company: string;
  amount: number;
  type: string;
  assignedTo: string; // managerId or 'None'
  status: 'NonAssigné' | 'EnCours' | 'Validé' | 'Rejeté';
}

const INITIAL_TICKETS: ClaimTicket[] = [
  { id: 'SIN-8902', patientName: 'Esther Kabanga', company: 'Rawbank', amount: 350, type: 'Dentaire', assignedTo: 'None', status: 'NonAssigné' },
  { id: 'SIN-1134', patientName: 'Christian Luyindula', company: 'Bralima', amount: 4800, type: 'Optique', assignedTo: 'M2', status: 'EnCours' },
  { id: 'SIN-4029', patientName: 'Nadia El-Masri', company: 'Individuel', amount: 15400, type: 'Hospitalisation', assignedTo: 'M3', status: 'EnCours' },
  { id: 'SIN-5211', patientName: 'Felix Tshilombo', company: 'Vodacom RDC', amount: 120, type: 'Médecine Générale', assignedTo: 'M1', status: 'Validé' },
  { id: 'SIN-9002', patientName: 'Jean Kabasele', company: 'Rawbank', amount: 950, type: 'Dentaire', assignedTo: 'M1', status: 'Rejeté' }
];

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'managers' | 'kanban' | 'perf'>('managers');
  
  // States
  const [managers, setManagers] = useState<Manager[]>(INITIAL_MANAGERS);
  const [tickets, setTickets] = useState<ClaimTicket[]>(INITIAL_TICKETS);
  
  // Forms & Dialogs
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isNewManagerModalOpen, setIsNewManagerModalOpen] = useState(false);
  const [ruleAmount, setRuleAmount] = useState('500');
  const [ruleTargetRegion, setRuleTargetRegion] = useState('RDC');
  const [ruleTargetManager, setRuleTargetManager] = useState('M1');

  // New Manager profile form states
  const [newMName, setNewMName] = useState('');
  const [newMLang, setNewMLang] = useState('Français, Anglais');
  const [newMCoverage, setNewMCoverage] = useState<string[]>(['Dentaire']);
  const [newMMaxThreshold, setNewMMaxThreshold] = useState('5000');

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Rule activation logic
  const handleApplyAutoRules = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRulesModalOpen(false);
    
    // Auto attribution simulation base
    const managerName = managers.find(m => m.id === ruleTargetManager)?.name || 'le gestionnaire';
    
    setTickets(prev => prev.map(t => {
      if (t.status === 'NonAssigné' && t.amount < Number(ruleAmount)) {
        return { ...t, assignedTo: ruleTargetManager, status: 'EnCours' };
      }
      return t;
    }));

    showToast(`Règles automatiques appliquées : Tous les sinistres < ${ruleAmount}$ ont été transférés à ${managerName}.`);
  };

  // Add customized Manager Profile
  const handleRegisterManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMName) return;

    const added: Manager = {
      id: `M${Date.now()}`,
      name: newMName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop',
      lang: newMLang,
      coverage: newMCoverage,
      maxThreshold: Number(newMMaxThreshold) || 1000
    };

    setManagers([...managers, added]);
    setIsNewManagerModalOpen(false);
    setNewMName('');
    showToast(`Nouveau profil de gestionnaire "${added.name}" déployé avec succès sur le dashboard d&apos;attribution.`);
  };

  // Drag and Drop simulated / Quick assignment update action list
  const handleMoveTicket = (ticketId: string, nextStatus: 'NonAssigné' | 'EnCours' | 'Validé' | 'Rejeté', managerId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: nextStatus, assignedTo: managerId };
      }
      return t;
    }));
    showToast(`Ticket ${ticketId} déplacé vers la colonne "${nextStatus}".`);
  };

  return (
    <div className="space-y-6">

      {/* Floating System message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Attribution automatisée</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 italic uppercase">Cockpit des Gestionnaires</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Suivi des tickets de sinistres assignés aux équipes d&apos;Adonaï</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Config rules auto trigger */}
          <button 
            onClick={() => setIsRulesModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 outline-none"
          >
            <Settings2 className="w-3.5 h-3.5 text-indigo-400" /> Configurer règles auto
          </button>

          <button 
            onClick={() => setIsNewManagerModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 outline-none"
          >
            <UserPlus className="w-3.5 h-3.5" /> Recruter un Gestionnaire
          </button>
        </div>
      </div>

      {/* Ribbon Navigation */}
      <div className="flex p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50 w-fit">
        <button 
          onClick={() => setActiveTab('managers')}
          className={cn(
            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
            activeTab === 'managers' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
          )}
        >
          Profils &amp; Seuils
        </button>
        <button 
          onClick={() => setActiveTab('kanban')}
          className={cn(
            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
            activeTab === 'kanban' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
          )}
        >
          Kanban des Sinistres
        </button>
        <button 
          onClick={() => setActiveTab('perf')}
          className={cn(
            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
            activeTab === 'perf' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
          )}
        >
          Intelligence &amp; Performance
        </button>
      </div>

      {/* Screen Render switch */}
      <div className="space-y-6">

        {activeTab === 'managers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.map((m) => (
              <div key={m.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform">
                  <User className="w-24 h-24" />
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <img 
                      src={m.avatar} 
                      alt={m.name} 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-150" 
                    />
                    <div>
                      <h4 className="text-base font-black text-slate-900 italic leading-tight uppercase">{m.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">ID UNIQUE : {m.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Langues</span>
                      <span className="text-[11px] font-extrabold text-slate-800">{m.lang}</span>
                    </div>
                    <div className="p-3 bg-indigo-50/50 rounded-xl">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Seuil Max</span>
                      <span className="text-[11px] font-black text-indigo-700">{m.maxThreshold.toLocaleString()} $ / acte</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Spécialités couvertes</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.coverage.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-bold rounded-lg uppercase">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between z-10">
                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Qualifié</span>
                  <button 
                    onClick={() => showToast(`Chargement de la fiche disciplinaire de ${m.name}.`)}
                    className="text-[10px] font-black text-indigo-600 uppercase italic hover:underline cursor-pointer"
                  >
                    Performance de traitement
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* COLUMN 1 : Non Assigné */}
            <div className="bg-slate-50 rounded-[2rem] p-5 space-y-4 border border-slate-200/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-900 uppercase">Non Assigné</span>
                <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-black rounded-full">
                  {tickets.filter(t => t.status === 'NonAssigné').length}
                </span>
              </div>
              
              <div className="space-y-3">
                {tickets.filter(t => t.status === 'NonAssigné').map(t => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                    <div>
                      <span className="text-[8px] font-mono font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded tracking-widest">{t.id}</span>
                      <h5 className="text-xs font-black text-slate-900 uppercase mt-1.5">{t.patientName}</h5>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{t.company}</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">Sinistre</span>
                        <span className="text-xs font-bold font-mono text-slate-800">{t.type}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{t.amount}$</span>
                    </div>

                    <div className="pt-2">
                      <select 
                        onChange={(e) => handleMoveTicket(t.id, 'EnCours', e.target.value)}
                        className="w-full text-[10px] font-black uppercase text-slate-700 bg-slate-50 border border-slate-200 py-2 px-3 rounded-lg outline-none cursor-pointer"
                      >
                        <option>Assigner à...</option>
                        {managers.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2 : En Cours */}
            <div className="bg-indigo-50/20 rounded-[2rem] p-5 space-y-4 border border-indigo-100/30">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-indigo-950 uppercase">En Cours</span>
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full">
                  {tickets.filter(t => t.status === 'EnCours').length}
                </span>
              </div>

              <div className="space-y-3">
                {tickets.filter(t => t.status === 'EnCours').map(t => {
                  const assignee = managers.find(m => m.id === t.assignedTo)?.name || 'Inconnu';
                  return (
                    <div key={t.id} className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <span className="text-[8px] font-mono font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded tracking-widest">{t.id}</span>
                          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest italic flex items-center gap-1"><Clock className="w-3 h-3" /> En cours</span>
                        </div>
                        <h5 className="text-xs font-black text-slate-900 uppercase mt-1.5">{t.patientName}</h5>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{t.company}</p>
                      </div>

                      <p className="text-[9px] font-black text-slate-500 uppercase">
                        Assigné à : <span className="text-indigo-600 font-extrabold">{assignee}</span>
                      </p>

                      <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                        <span className="text-xs font-mono font-bold text-slate-800">{t.type}</span>
                        <span className="text-sm font-black text-slate-950">{t.amount}$</span>
                      </div>

                      <div className="pt-2 flex gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <button 
                          onClick={() => handleMoveTicket(t.id, 'Validé', t.assignedTo)}
                          className="flex-1 py-1 bg-green-100 hover:bg-green-200 text-green-700 font-black text-[9px] rounded uppercase text-center cursor-pointer"
                        >
                          Valider
                        </button>
                        <button 
                          onClick={() => handleMoveTicket(t.id, 'Rejeté', t.assignedTo)}
                          className="flex-1 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-[9px] rounded uppercase text-center cursor-pointer"
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3 : Validé */}
            <div className="bg-emerald-50/20 rounded-[2rem] p-5 space-y-4 border border-emerald-100/30">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-950/80 uppercase">Validé (Remboursé)</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                  {tickets.filter(t => t.status === 'Validé').length}
                </span>
              </div>

              <div className="space-y-3">
                {tickets.filter(t => t.status === 'Validé').map(t => (
                  <div key={t.id} className="bg-white/80 p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded tracking-widest">{t.id}</span>
                      <span className="text-emerald-600 p-1 bg-emerald-50 rounded-full"><Check className="w-3.5 h-3.5" /></span>
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 uppercase">{t.patientName}</h5>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{t.company}</p>
                    </div>
                    <div className="flex justify-between border-t border-slate-55 pt-3 text-[11px] font-black text-emerald-600">
                      <span>{t.type}</span>
                      <span>{t.amount}$</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 4 : Rejeté */}
            <div className="bg-rose-50/25 rounded-[2rem] p-5 space-y-4 border border-rose-150/30">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-rose-950/80 uppercase">Rejeté</span>
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full">
                  {tickets.filter(t => t.status === 'Rejeté').length}
                </span>
              </div>

              <div className="space-y-3">
                {tickets.filter(t => t.status === 'Rejeté').map(t => (
                  <div key={t.id} className="bg-white/80 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded tracking-widest">{t.id}</span>
                      <span className="text-rose-600 p-1 bg-rose-50 rounded-full"><X className="w-3.5 h-3.5" /></span>
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 uppercase">{t.patientName}</h5>
                    </div>
                    <div className="flex justify-between border-t border-slate-55 pt-3 text-[11px] font-black text-rose-600">
                      <span>{t.type}</span>
                      <span className="line-through text-slate-400">{t.amount}$</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'perf' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: 'Sinistres Ouverts', value: '42', change: '+12%', icon: BarChart3, color: 'text-green-600', trend: 'up' },
                 { label: 'Taux de Remboursement', value: '89.4%', change: '-0.5%', icon: TrendingUp, color: 'text-indigo-600', trend: 'down' },
                 { label: 'Montant Approuvé', value: '450K$', change: '+24%', icon: Wallet, color: 'text-indigo-600', trend: 'up' },
                 { label: 'Alertes Fraude', value: '7', change: '+3', icon: ShieldAlert, color: 'text-rose-600', trend: 'up' }
               ].map((kpi, idx) => (
                 <div 
                   key={idx}
                   className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                       <kpi.icon className="w-20 h-20" />
                    </div>
                    <div className="relative z-10 space-y-4">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border bg-slate-50")}>
                          <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{kpi.label}</h4>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className={cn(
                            "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black italic",
                            kpi.trend === 'up' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                          )}>
                            {kpi.change}
                          </span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Recharts Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Main Chart: Claims Performance */}
               <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 min-h-[400px] flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                          <Activity className="w-4 h-4 text-indigo-600" /> Performance des Flux
                        </h4>
                        <p className="text-[10px] font-bold text-slate-350 italic">Nombre de sinistres par catégorie (Mensuel)</p>
                     </div>
                  </div>
                  <div className="flex-1 w-full">
                     <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
                          <Bar dataKey="approved" name="Approuvés" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="rejected" name="Rejetés" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="pending" name="En attente" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Right Column: Distribution & Sharing */}
               <div className="space-y-6">
                  <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 flex flex-col min-h-[300px]">
                     <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                       <Filter className="w-4 h-4 text-indigo-600" /> Répartition par Typologie
                     </h4>
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center">
                        <div className="h-full w-full">
                          <ResponsiveContainer width="100%" height={200}>
                             <PieChart>
                                <Pie
                                  data={CLAIM_TYPE_DATA}
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                   {CLAIM_TYPE_DATA.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                                </Pie>
                                <Tooltip />
                             </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                           {CLAIM_TYPE_DATA.map(item => (
                             <div key={item.name} className="flex items-center justify-between p-2 rounded-xl group hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                   <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                                </div>
                                <p className="text-[11px] font-black italic opacity-35">{item.value}%</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================= */}
      {/* CONFIGURE AUTO ATTRIBUTION RULES MODAL (B3) */}
      {/* ========================================= */}
      <AnimatePresence>
        {isRulesModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRulesModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase italic">Algorithme d&apos;attribution</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Automatic assignment builder</p>
                  </div>
                </div>
                <button onClick={() => setIsRulesModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplyAutoRules} className="p-8 space-y-4">
                <p className="text-xs text-slate-500 italic">Configurez un processeur logique de répartition d&apos;activité sans code.</p>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">SI le Dossier Montant est inférieur à :</label>
                  <input 
                    type="number"
                    value={ruleAmount}
                    onChange={(e) => setRuleAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">ET le Pays est :</label>
                  <select 
                    value={ruleTargetRegion}
                    onChange={(e) => setRuleTargetRegion(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="RDC">Kinshasa - République Démocratique du Congo (RDC)</option>
                    <option value="France">Paris - France (UE)</option>
                    <option value="UAE">Dubaï - Émirats Arabes Unis (UAE)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">ALORS attribuer automatiquement à :</label>
                  <select 
                    value={ruleTargetManager}
                    onChange={(e) => setRuleTargetManager(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-700"
                  >
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Seuil: {m.maxThreshold}$)</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsRulesModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg"
                  >
                    Exécuter &amp; Activer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* RECRUTEMENT GESTIONNAIRE MODAL            */}
      {/* ========================================= */}
      <AnimatePresence>
        {isNewManagerModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewManagerModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase italic">Recruter un Gestionnaire</h3>
                </div>
                <button onClick={() => setIsNewManagerModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterManager} className="p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Nom complet</label>
                  <input 
                    type="text"
                    value={newMName}
                    onChange={(e) => setNewMName(e.target.value)}
                    placeholder="ex: Benoit Lucas"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Langues Parlées</label>
                  <input 
                    type="text"
                    value={newMLang}
                    onChange={(e) => setNewMLang(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Plafond maximum de validation ($)</label>
                  <input 
                    type="number"
                    value={newMMaxThreshold}
                    onChange={(e) => setNewMMaxThreshold(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Type d&apos;actes assignés (Multi)</label>
                  <div className="flex gap-2">
                    {['Optique', 'Dentaire', 'Hospitalisation'].map((cov) => {
                      const isSel = newMCoverage.includes(cov);
                      return (
                        <button
                          type="button"
                          key={cov}
                          onClick={() => {
                            if (isSel) setNewMCoverage(newMCoverage.filter(c => c !== cov));
                            else setNewMCoverage([...newMCoverage, cov]);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer",
                            isSel ? "bg-indigo-600 text-white border-transparent" : "bg-slate-50 text-slate-600 border-slate-200"
                          )}
                        >
                          {cov}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsNewManagerModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-center"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/15"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
