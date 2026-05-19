/**
 * 📄 Fichier : /src/frontend/components/Reclamation.tsx
 * 🎯 Objectif : Gestion complète des réclamations (Soumission, Validation, Dashboard, Traçabilité).
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Filter, FileText, Upload, ShieldCheck, 
  History, Clock, CheckCircle2, XCircle, AlertTriangle, 
  ChevronRight, Download, BarChart3, TrendingUp, Zap,
  MessageSquare, User, Eye, ArrowLeft, Send, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// --- Types ---

export type RecStatus = 'Soumise' | 'En cours' | 'Validée' | 'Rejetée' | 'Payée';
export type RecType = 'Hospitalisation' | 'Pharmacie' | 'Consultation' | 'Analyses' | 'Autre';

export interface RecLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  comment?: string;
}

export interface RecDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'Vérifié' | 'En attente' | 'Invalide';
  isDuplicate?: boolean;
}

export interface ReclamationData {
  id: string;
  insuredId: string;
  insuredName: string;
  type: RecType;
  amount: number;
  date: string;
  status: RecStatus;
  urgency: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  description: string;
  documents: RecDocument[];
  history: RecLog[];
  fraudScore: number; // 0-100
  aiSuggestions?: string[];
}

// --- Mock Data ---

const MOCK_RECLAMATIONS: ReclamationData[] = [
  {
    id: 'REC-23091',
    insuredId: 'INS-001',
    insuredName: 'Jean Valjean',
    type: 'Hospitalisation',
    amount: 3450.00,
    date: '2024-05-12',
    status: 'En cours',
    urgency: 'Critique',
    description: 'Intervention chirurgicale d\'urgence suite à une fracture.',
    documents: [
      { id: 'd1', name: 'Facture_Hopital_V4.pdf', type: 'PDF', size: '1.2 MB', status: 'Vérifié' },
      { id: 'd2', name: 'Compte_Rendu_Op.png', type: 'PNG', size: '800 KB', status: 'En attente' }
    ],
    history: [
      { id: 'l1', action: 'Dossier Soumis', user: 'Jean Valjean', timestamp: '2024-05-12T10:00:00Z' },
      { id: 'l2', action: 'Attribution Dossier', user: 'Système', timestamp: '2024-05-12T10:05:00Z' }
    ],
    fraudScore: 12,
    aiSuggestions: ['Vérifier la date de l\'intervention', 'Eligible au remboursement à 80%']
  },
  {
    id: 'REC-23092',
    insuredId: 'INS-002',
    insuredName: 'Cosette Thénardier',
    type: 'Pharmacie',
    amount: 125.50,
    date: '2024-05-14',
    status: 'Soumise',
    urgency: 'Basse',
    description: 'Achat de médicaments récurrents pour asthme.',
    documents: [
      { id: 'd3', name: 'Ordonnance_Mai.jpg', type: 'JPG', size: '450 KB', status: 'Vérifié' }
    ],
    history: [
      { id: 'l3', action: 'Dossier Soumis', user: 'Cosette T.', timestamp: '2024-05-14T08:30:00Z' }
    ],
    fraudScore: 85,
    aiSuggestions: ['Doublon potentiel détecté (Même montant le mois dernier)', 'Vérifier validité ordonnance']
  }
];

const STATS_DATA = [
  { name: 'En attente', value: 12, color: '#117F02' },
  { name: 'Validées', value: 45, color: '#10b981' },
  { name: 'Rejetées', value: 8, color: '#ef4444' },
];

export const Reclamation: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [view, setView] = useState<'list' | 'create' | 'details' | 'dashboard'>('list');
  const [reclamations, setReclamations] = useState<ReclamationData[]>(MOCK_RECLAMATIONS);
  const [selectedRec, setSelectedRec] = useState<ReclamationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle module sync from App.tsx
  useEffect(() => {
    if (subModule === 'reclamation-submit') setView('create');
    else if (subModule === 'reclamation-followup') setView('list');
    else if (subModule === 'reclamation-dashboard') setView('dashboard');
  }, [subModule]);

  const filtered = reclamations.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.insuredName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Views ---

  const renderDashboard = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'En attente', value: '42', color: 'text-green-600', icon: Clock, trend: '+4%' },
            { label: 'Taux de Rejet', value: '3.8%', color: 'text-rose-600', icon: XCircle, trend: '-1%' },
            { label: 'Délai Moyen', value: '2.4h', color: 'text-emerald-600', icon: Zap, trend: '-12%' },
            { label: 'Volume Mensuel', value: '1,842', color: 'text-slate-600', icon: BarChart3, trend: '+8%' }
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-white border border-green-100 rounded-2xl shadow-sm">
               <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <span className={cn("text-[10px] font-black italic", stat.trend.startsWith('+') ? "text-green-500" : "text-rose-500")}>{stat.trend}</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="fluent-card p-6 min-h-[300px]">
             <h4 className="text-sm font-black text-green-950 mb-6 uppercase tracking-tight">Répartition par Statut</h4>
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={STATS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {STATS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-6 mt-4">
                {STATS_DATA.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                     <span className="text-[10px] font-bold text-slate-500">{s.name}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="fluent-card p-6">
             <h4 className="text-sm font-black text-green-950 mb-6 uppercase tracking-tight">Tendances Mobiles</h4>
             <div className="space-y-4">
                {[
                  { label: 'Soumissions Mobile (Push)', percent: 72, color: 'bg-green-600' },
                  { label: 'Validation Automatique (AI)', percent: 45, color: 'bg-indigo-600' },
                  { label: 'Paiements Instantanés', percent: 28, color: 'bg-emerald-500' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                       <span>{item.label}</span>
                       <span>{item.percent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderCreate = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="fluent-card p-8 max-w-2xl mx-auto"
    >
       <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
             <Plus className="w-6 h-6" />
          </div>
          <div>
             <h3 className="text-xl font-black text-green-950">Nouvelle Réclamation</h3>
             <p className="text-xs font-bold text-green-900/40">Saisie sécurisée et cryptée</p>
          </div>
       </div>

       <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest">Type de prestation</label>
                <select className="w-full bg-green-50/50 border border-green-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 outline-none">
                   <option>Hospitalisation</option>
                   <option>Pharmacie</option>
                   <option>Consultation</option>
                   <option>Analyses</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest">Montant Estimé ($)</label>
                <input type="number" placeholder="0.00" className="w-full bg-green-50/50 border border-green-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 outline-none" />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest">Description des soins</label>
             <textarea rows={3} placeholder="Détaillez votre demande..." className="w-full bg-green-50/50 border border-green-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 outline-none resize-none" />
          </div>

          <div className="p-8 border-2 border-dashed border-green-100 rounded-[24px] bg-green-50/20 text-center space-y-4 group cursor-pointer hover:border-green-600 transition-all">
             <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-green-600 shadow-sm border border-green-50 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
             </div>
             <div>
                <p className="text-sm font-black text-green-950">Déposez vos justificatifs</p>
                <p className="text-[10px] font-bold text-slate-400">PDF, JPG, PNG (Max 10MB) • Sécurisé AES-256</p>
             </div>
             <div className="flex justify-center gap-3">
                <span className="px-3 py-1 bg-white text-green-600 text-[9px] font-black uppercase rounded-full shadow-sm">AI OCR Prediction Active</span>
             </div>
          </div>

          <div className="flex gap-4">
             <button onClick={() => setView('list')} className="flex-1 py-4 border border-green-100 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-green-50 transition-all">
                Annuler
             </button>
             <button className="flex-2 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                Envoyer <Send className="w-4 h-4" />
             </button>
          </div>
       </div>
    </motion.div>
  );

  const renderDetails = () => selectedRec && (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
       <div className="flex items-center justify-between">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-green-600 transition-all uppercase italic">
             <ArrowLeft className="w-4 h-4" /> Retour au suivi
          </button>
          <div className="flex gap-3">
             <button className="px-4 py-2 border border-green-100 rounded-xl text-[10px] font-black text-green-600 hover:bg-green-50 transition-all uppercase">Historique Complet</button>
             <button className="px-6 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-rose-600/20 hover:scale-105 transition-all uppercase">Rejeter</button>
             <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all uppercase">Valider l'étape</button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             {/* Security & Fraud Header */}
             <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Shield className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                        selectedRec.fraudScore > 50 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      )}>
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white">Score d'Intégrité AI</h3>
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Analyse cryptographique & Doublons</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-4xl font-black tracking-tighter">{100 - selectedRec.fraudScore}%</p>
                      <p className="text-[10px] font-black text-indigo-400 uppercase">Taux de Confiance</p>
                   </div>
                </div>
                
                {selectedRec.aiSuggestions && (
                  <div className="mt-6 flex flex-wrap gap-2">
                     {selectedRec.aiSuggestions.map((s, idx) => (
                       <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-medium italic opacity-80 flex items-center gap-2">
                          <Zap className="w-3 h-3 text-indigo-400" /> {s}
                       </span>
                     ))}
                  </div>
                )}
             </div>

             <div className="fluent-card p-6">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-sm font-black text-green-950 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" /> Justificatifs Certifiés
                   </h4>
                   <span className="text-[9px] font-black text-slate-400 uppercase italic">SHA-256 Verified Assets</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedRec.documents.map(doc => (
                     <div key={doc.id} className="p-4 rounded-xl border border-green-50 bg-green-50/10 flex items-center justify-between group hover:border-green-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                           <FileText className="w-8 h-8 text-green-200 group-hover:text-green-400 transition-colors" />
                           <div>
                              <p className="text-xs font-black text-green-950">{doc.name}</p>
                              <p className="text-[9px] font-bold text-slate-400">{doc.size} • {doc.type}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Eye className="w-4 h-4 text-slate-300 hover:text-green-600" />
                           {doc.status === 'Vérifié' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Dynamic Timeline */}
             <div className="fluent-card p-6">
                <h4 className="text-sm font-black text-green-950 mb-8 uppercase tracking-tight">Timeline Interactive</h4>
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-green-50">
                   {selectedRec.history.map((log, idx) => (
                     <div key={idx} className="relative pl-12">
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border border-green-100 flex items-center justify-center z-10 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-green-950">{log.action}</p>
                              <p className="text-[9px] text-slate-400 font-mono italic">{new Date(log.timestamp).toLocaleString()}</p>
                           </div>
                           <p className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                              <User className="w-3 h-3" /> {log.user}
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="fluent-card p-6">
                <h4 className="text-[10px] font-black text-green-950/30 uppercase tracking-widest mb-6">Résumé du dossier</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-green-50">
                      <span className="text-[11px] font-bold text-slate-400">ID</span>
                      <span className="text-xs font-black text-green-950">{selectedRec.id}</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-green-50">
                      <span className="text-[11px] font-bold text-slate-400">Montant Requis</span>
                      <span className="text-sm font-black text-green-600 uppercase italic">{selectedRec.amount.toLocaleString()} $</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-green-50">
                      <span className="text-[11px] font-bold text-slate-400">Urgence</span>
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-full uppercase italic",
                        selectedRec.urgency === 'Critique' ? "bg-rose-100 text-rose-600" : "bg-green-100 text-green-600"
                      )}>{selectedRec.urgency}</span>
                   </div>
                </div>
                <div className="mt-8 p-4 bg-green-50/30 rounded-2xl border border-green-100">
                   <h5 className="text-[10px] font-black text-green-950/40 uppercase mb-2">Instructions Gestionnaire</h5>
                   <p className="text-[11px] font-medium leading-relaxed italic text-green-900/60">
                      {selectedRec.description}
                   </p>
                </div>
             </div>

             <div className="fluent-card p-6 bg-green-950 text-white">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <MessageSquare className="w-4 h-4" /> Message au Prestataire
                </h4>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-green-500/20 mb-4 text-white" placeholder="Instruction technique..." />
                <button className="w-full py-2 bg-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-600/30 text-white">Envoyer Notification</button>
             </div>
          </div>
       </div>
    </motion.div>
  );

  const renderList = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-4"
    >
       <div className="fluent-card">
          <div className="p-4 bg-green-50/20 border-b border-green-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                   <input 
                      type="text" 
                      placeholder="Filtrer les réclamations..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 text-xs bg-white border border-green-100 rounded-lg outline-none w-64 focus:ring-2 focus:ring-green-500/20"
                   />
                </div>
                <button className="flex items-center gap-2 text-xs font-bold text-green-600 px-3 py-1.5 hover:bg-green-100 rounded-lg transition-colors">
                   <Filter className="w-3.5 h-3.5" /> Filtres
                </button>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setView('create')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 hover:scale-105 transition-all">
                   <Plus className="w-4 h-4" /> Nouveau
                </button>
                <button className="p-2 border border-green-100 rounded-xl text-green-600 hover:bg-green-50 transition-all"><Download className="w-4 h-4" /></button>
             </div>
          </div>

          <div className="divide-y divide-green-50">
             {filtered.map(rec => (
               <div 
                 key={rec.id} 
                 onClick={() => { setSelectedRec(rec); setView('details'); }}
                 className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-green-50/30 cursor-pointer group transition-all"
               >
                  <div className="flex items-center gap-4 flex-1">
                     <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                       rec.status === 'Soumise' ? "bg-green-100 text-green-600" :
                       rec.status === 'Validée' ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
                     )}>
                        <FileText className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h4 className="text-sm font-black text-green-950">{rec.insuredName}</h4>
                           <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{rec.id}</span>
                        </div>
                        <p className="text-[11px] font-bold text-green-900/60 mt-0.5">{rec.type} • {new Date(rec.date).toLocaleDateString()}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-12 mt-4 md:mt-0">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase italic">Montant</p>
                        <p className="text-sm font-black text-slate-900">{rec.amount.toLocaleString()} $</p>
                     </div>
                     <div className="text-center hidden md:block">
                        <p className="text-[9px] font-black text-slate-300 uppercase italic">Risque Fraud</p>
                        <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn("h-full", rec.fraudScore > 50 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${rec.fraudScore}%` }} />
                           </div>
                           <span className="text-[10px] font-mono font-black">{rec.fraudScore}%</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-tight",
                          rec.status === 'Soumise' ? "bg-green-100 text-green-700" :
                          rec.status === 'Validée' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                        )}>
                           {rec.status}
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                     </div>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Module Réclamations <Zap className="w-6 h-6 text-green-500 fill-green-500" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight">Portail de gestion certifié avec audit IA</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-green-100 shadow-sm">
             {['list', 'dashboard', 'create'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    view === v ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-slate-400 hover:text-green-600"
                  )}
                >
                   {v === 'list' ? 'Suivi' : v === 'dashboard' ? 'Performance' : 'Soumission'}
                </button>
             ))}
          </div>
       </div>

       <AnimatePresence mode="wait">
          {view === 'list' && renderList()}
          {view === 'create' && renderCreate()}
          {view === 'details' && renderDetails()}
          {view === 'dashboard' && renderDashboard()}
       </AnimatePresence>
    </div>
  );
};

