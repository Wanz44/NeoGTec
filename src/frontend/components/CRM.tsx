/**
 * 📄 Fichier : /src/frontend/components/CRM.tsx
 * 🎯 Objectif : Hub commercial complet (BBD Clients, Prospects, Commissions, Marketing, Parrainage, Teams, FAQ).
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Target, MessageSquare, Megaphone, 
  Gift, History, TrendingUp, Users2, HelpCircle, 
  Search, Filter, Plus, ChevronRight, Download, 
  Star, Mail, Phone, MapPin, DollarSign, 
  Calendar, Zap, Award, BarChart3, PieChart as PieIcon,
  Bell, FileText, Send, Share2, ShieldCheck, Clock, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

// --- Types ---

export type ClientType = 'Individuel' | 'Entreprise' | 'Mutuelle';
export type LeadMaturity = 'Froid' | 'Tiède' | 'Chaud';
export type CampaignStatus = 'Active' | 'Brouillon' | 'Terminé';

export interface Interaction {
  id: string;
  type: 'Appel' | 'Email' | 'Rendez-vous' | 'Message';
  note: string;
  timestamp: string;
  author: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  type: ClientType;
  status: 'Actif' | 'Inactif';
  email: string;
  phone: string;
  contracts: number;
  totalPaid: number;
  lastInteraction: string;
  score: number; // 0-100
}

export interface Prospect extends ClientProfile {
  maturity: LeadMaturity;
  potentialValue: number;
  interactions: Interaction[];
}

export interface Commission {
  id: string;
  agent: string;
  contractId: string;
  amount: number;
  date: string;
  status: 'Payée' | 'Calculée' | 'En attente';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

// --- Mock Data ---

const MOCK_CLIENTS: ClientProfile[] = [
  { id: 'CLI-001', name: 'Mutombo Dikembe', type: 'Individuel', status: 'Actif', email: 'dikembe@african-hero.cd', phone: '+243 81 000 0001', contracts: 2, totalPaid: 1250, lastInteraction: '2024-05-10', score: 95 },
  { id: 'CLI-002', name: 'Kabasele Mwamba', type: 'Individuel', status: 'Actif', email: 'kabasele@lingala-vision.fr', phone: '+243 81 000 0002', contracts: 1, totalPaid: 450, lastInteraction: '2024-05-14', score: 88 },
  { id: 'CLI-003', name: 'Katanga Mining Solutions', type: 'Entreprise', status: 'Actif', email: 'contact@kms-mining.cd', phone: '+243 81 000 1000', contracts: 45, totalPaid: 12500, lastInteraction: '2024-05-12', score: 92 },
];

const MOCK_PROSPECTS: Prospect[] = [
  { id: 'PRO-001', name: 'Luvuezo Makanda', type: 'Individuel', status: 'Inactif', email: 'luvuezo@it-africa.cd', phone: '+243 77 000 000', contracts: 0, totalPaid: 0, lastInteraction: '2024-05-15', score: 75, maturity: 'Chaud', potentialValue: 2500, interactions: [
    { id: 'i1', type: 'Appel', note: 'Très intéressé par la protection hospitalière.', timestamp: '2024-05-15T10:00:00Z', author: 'Agent Sarah' }
  ] },
  { id: 'PRO-002', name: 'Bosoko Etumangele', type: 'Individuel', status: 'Inactif', email: 'bosoko@river-trade.com', phone: '+243 202 000 000', contracts: 0, totalPaid: 0, lastInteraction: '2024-05-11', score: 40, maturity: 'Tiède', potentialValue: 1200, interactions: [] },
];

const PERFORMANCE_DATA = [
  { name: 'Jan', sales: 45, conversion: 12 },
  { name: 'Feb', sales: 52, conversion: 15 },
  { name: 'Mar', sales: 48, conversion: 14 },
  { name: 'Apr', sales: 70, conversion: 22 },
  { name: 'May', sales: 85, conversion: 28 },
];

const FAQ_DATA: FAQItem[] = [
  { id: 'f1', question: 'Comment renouveler un contrat expiré ?', answer: 'Le renouvellement se fait via le portail client ou en contactant un agent dédié. Une inspection préalable peut être requise.', category: 'Contrats', tags: ['renouvellement', 'expiration'] },
  { id: 'f2', question: 'Quels sont les délais de paiement Mobile Money ?', answer: 'Les paiements sont instantanés mais la synchronisation ledger peut prendre jusqu\'à 2 minutes.', category: 'Paiements', tags: ['mobile money', 'délais'] },
];

export const CRM: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | Prospect | null>(null);

  // Sync internal state with external subModule prop
  useEffect(() => {
    if (!subModule) return;
    const mapping: Record<string, string> = {
      'crm-marketing': 'marketing',
      'crm-performance': 'performance',
      'crm-faq': 'faq',
      'crm-global-perf': 'dashboard',
      'crm-leads': 'prospects'
    };
    if (mapping[subModule]) setActiveTab(mapping[subModule]);
  }, [subModule]);

  // --- Sub-Components & Views ---

  const renderClients = () => (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
             <input 
                type="text" 
                placeholder="Rechercher un client..." 
                className="pl-10 pr-4 py-2 text-xs bg-white border border-green-200 rounded-md outline-none w-64 focus:ring-2 focus:ring-green-500/20 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 hover:scale-105 transition-all border border-green-700">
                <UserPlus className="w-4 h-4" /> Ajouter un Client/Prospect
             </button>
             <button className="p-2 border border-green-200 rounded-md text-green-600 hover:bg-green-50 transition-all shadow-sm"><Download className="w-4 h-4" /></button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 fluent-card overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(client => (
                  <div 
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between",
                      selectedClient?.id === client.id ? "border-green-600 bg-green-50/50" : "border-green-50 hover:border-green-200"
                    )}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white border border-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                           <Users className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-green-950">{client.name}</h4>
                              <span className={cn(
                                "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                                client.type === 'Entreprise' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                              )}>{client.type}</span>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400">{client.email}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                           <Star className="w-3 h-3 text-green-500 fill-green-500" />
                           <span className="text-xs font-black text-green-950">{client.score}%</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">{client.contracts} Contrats</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <AnimatePresence mode="wait">
                {selectedClient ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={selectedClient.id}
                    className="fluent-card p-6"
                  >
                     <div className="text-center space-y-4 mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center text-green-600 border-4 border-white shadow-xl">
                           <Users className="w-10 h-10" />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-green-950">{selectedClient.name}</h3>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedClient.id}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {[
                          { label: 'E-mail', val: selectedClient.email, icon: Mail },
                          { label: 'Téléphone', val: selectedClient.phone, icon: Phone },
                          { label: 'Total ($)', val: `${selectedClient.totalPaid.toLocaleString()} $`, icon: DollarSign },
                          { label: 'Total (CDF)', val: `${(selectedClient.totalPaid * 2800).toLocaleString('fr-CD')} CDF`, icon: Layers },
                          { label: 'Dernier Contact', val: selectedClient.lastInteraction, icon: Calendar }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-50/20 border border-green-50">
                             <item.icon className="w-4 h-4 text-green-400" />
                             <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">{item.label}</p>
                                <p className="text-xs font-bold text-green-950">{item.val}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="mt-8 space-y-3">
                        <button className="w-full py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/30">Nouveau Contrat</button>
                        <button className="w-full py-2.5 border border-green-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-600 hover:bg-green-50">Modifier Profil</button>
                     </div>
                  </motion.div>
                ) : (
                  <div className="p-12 border-2 border-dashed border-green-100 rounded-[32px] text-center text-green-200">
                     <p className="text-xs font-black uppercase italic">Sélectionnez un profil pour voir les détails</p>
                  </div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );

  const renderProspects = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Froid', 'Tiède', 'Chaud'].map((mat) => (
            <div key={mat} className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                     <div className={cn(
                       "w-2 h-2 rounded-full",
                       mat === 'Froid' ? "bg-blue-400" : mat === 'Tiède' ? "bg-orange-400" : "bg-rose-500"
                     )} />
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{mat}</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-200">{MOCK_PROSPECTS.filter(p => p.maturity === mat).length}</span>
               </div>
               
               <div className="space-y-3 min-h-[400px] p-3 bg-slate-50/50 rounded-[32px] border border-slate-100">
                  {MOCK_PROSPECTS.filter(p => p.maturity === mat).map(prospect => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer group"
                      key={prospect.id}
                      onClick={() => { setSelectedClient(prospect); setActiveTab('clients'); }}
                    >
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[8px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase">Potentiel: {prospect.potentialValue}$</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                       </div>
                       <h5 className="text-xs font-black text-slate-900 group-hover:text-green-600 transition-colors uppercase">{prospect.name}</h5>
                       <p className="text-[10px] text-slate-400 mt-1 truncate">{prospect.email}</p>
                       
                       <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                             <Clock className="w-3 h-3 text-slate-300" />
                             <span className="text-[9px] font-bold text-slate-400 italic">{prospect.lastInteraction}</span>
                          </div>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-green-600" style={{ width: `${prospect.score}%` }} />
                          </div>
                       </div>
                    </motion.div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[9px] font-black text-slate-300 uppercase hover:border-green-300 hover:text-green-600 transition-all">
                     + Ajouter Prospect
                  </button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 fluent-card p-6 min-h-[400px]">
             <h4 className="text-sm font-black text-green-950 uppercase mb-8">Évolution des Ventes & Conversion</h4>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#117F02" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#117F02" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" name="Volume Ventes" stroke="#117F02" strokeWidth={3} fill="url(#colorSales)" />
                      <Area type="monotone" dataKey="conversion" name="% Résolution" stroke="#6366f1" strokeWidth={2} fill="transparent" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="space-y-6">
             <div className="fluent-card p-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-[0.2em]">Top Performers (Commercial)</h4>
                <div className="space-y-4">
                   {[
                     { name: 'Jean-Marc D.', score: 98, sales: 24, bonus: 450, rank: 1 },
                     { name: 'Sarah L.', score: 92, sales: 21, bonus: 320, rank: 2 },
                     { name: 'Kevin B.', score: 85, sales: 18, bonus: 180, rank: 3 }
                   ].map((p) => (
                     <div key={p.rank} className="flex items-center justify-between p-3 rounded-2xl border border-green-50 bg-green-50/10 group hover:scale-[1.02] transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center font-black italic shadow-lg shadow-green-600/20">{p.rank}</div>
                           <div>
                              <p className="text-xs font-black text-green-950">{p.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{p.sales} Contrats</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-green-600">+{p.bonus}$</p>
                           <p className="text-[8px] font-black text-slate-300 italic">Bonus mensuel</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Voir le Leaderboard Complet</button>
             </div>

             <div className="p-6 bg-white border border-green-200 rounded-lg text-slate-900 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <Target className="w-20 h-20 text-green-600" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 text-slate-400">Objectif Équipe (Africa)</h4>
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold text-slate-600">Progression Mensuelle</span>
                   <span className="text-[10px] font-black italic text-green-600">82%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
                   <div className="h-full bg-green-600 transition-all duration-1000 shadow-sm" style={{ width: '82%' }} />
                </div>
                <p className="text-[9px] font-bold mt-4 text-slate-400 italic font-mono text-center">Encore 12 ventes pour le bonus collectif</p>
             </div>
          </div>
       </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-orange-950 uppercase tracking-tighter italic">FAQ Commerciale</h2>
          <div className="relative max-w-lg mx-auto">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
             <input 
                type="text" 
                placeholder="Ex: Procédure remboursement, Mobile Money..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-orange-100 rounded-[24px] shadow-sm outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-sm"
             />
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
             {['Tous', 'Contrats', 'Paiements', 'Réclamations', 'Technique'].map(cat => (
               <button key={cat} className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  {cat}
               </button>
             ))}
          </div>
          <div className="md:col-span-3 space-y-4">
             {FAQ_DATA.map(item => (
               <div key={item.id} className="fluent-card p-6 hover:shadow-lg transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-black text-orange-950 group-hover:text-orange-600 transition-colors uppercase italic">{item.question}</h4>
                     <HelpCircle className="w-5 h-5 text-orange-200" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{item.answer}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                     {item.tags.map(tag => (
                       <span key={tag} className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-lg">#{tag}</span>
                     ))}
                  </div>
               </div>
             ))}
             <button className="w-full py-4 border-2 border-dashed border-orange-100 rounded-[24px] text-[10px] font-black text-orange-400 uppercase tracking-widest hover:border-orange-600 hover:text-orange-600 transition-all">
                + Suggérer une Question
             </button>
          </div>
       </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
             <h3 className="text-xl font-black text-orange-950 uppercase italic tracking-tighter">Campagnes & Publicité</h3>
             <p className="text-[10px] font-bold text-orange-950/40 uppercase tracking-widest">Gestion des bannières in-app et emailing ciblé</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">
             <Megaphone className="w-4 h-4" /> Créer une Campagne
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="fluent-card p-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase mb-6 tracking-widest">Aperçu Bannières In-App</h4>
                <div className="aspect-[21/9] bg-gradient-to-r from-orange-600 to-rose-600 rounded-[32px] p-8 text-white relative overflow-hidden group">
                   <div className="absolute right-0 top-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-20" />
                   <div className="relative z-10 h-full flex flex-col justify-center">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] w-fit mb-4">Offre Limitée</span>
                      <h2 className="text-3xl font-black italic tracking-tighter mb-2 leading-none uppercase">Protégez votre<br />Santé à 100%</h2>
                      <p className="text-[10px] opacity-80 uppercase tracking-widest font-black italic mb-6">Réduction de -20% sur la première année</p>
                      <button className="w-fit px-8 py-3 bg-white text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Souscrire maintenant</button>
                   </div>
                </div>
             </div>

             <div className="fluent-card">
                <div className="p-4 border-b border-orange-50 flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase">Historique des Campagnes</h4>
                   <Filter className="w-4 h-4 text-slate-300" />
                </div>
                <div className="divide-y divide-orange-50">
                   {[
                     { name: 'Back2School 2024', type: 'Email', reach: '4.2K', conv: '12%', status: 'Ended' },
                     { name: 'Easter Promo', type: 'App Banner', reach: '12K', conv: '8.4%', status: 'Active' },
                     { name: 'Health Checkup Day', type: 'SMS', reach: '800', conv: '24%', status: 'Draft' }
                   ].map((c, i) => (
                     <div key={i} className="p-4 flex items-center justify-between hover:bg-orange-50/10 group cursor-pointer transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center text-orange-600">
                              {c.type === 'Email' ? <Mail className="w-4 h-4" /> : c.type === 'SMS' ? <MessageSquare className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                           </div>
                           <div>
                              <p className="text-xs font-black text-orange-950 uppercase">{c.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.type}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-12">
                           <div className="text-right">
                              <p className="text-[9px] font-black text-slate-300 uppercase italic">Reach / Conv.</p>
                              <p className="text-xs font-black text-slate-900">{c.reach} / {c.conv}</p>
                           </div>
                           <div className={cn(
                             "px-2.5 py-1 rounded-full text-[9px] font-black uppercase italic",
                             c.status === 'Active' ? "bg-emerald-100 text-emerald-600" : c.status === 'Ended' ? "bg-slate-100 text-slate-400" : "bg-amber-100 text-amber-600"
                           )}>{c.status}</div>
                           <ChevronRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="fluent-card p-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase mb-6 tracking-widest">Parrainage & Récompenses</h4>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <div>
                         <p className="text-[9px] font-black text-indigo-400 uppercase">Invités Totaux</p>
                         <p className="text-2xl font-black text-indigo-600">342</p>
                      </div>
                      <Share2 className="w-10 h-10 text-indigo-200" />
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase italic">Dernières Récompenses</p>
                      {[
                        { user: 'Marie C.', reward: '+100 Pts', date: '2h ago' },
                        { user: 'Arthur R.', reward: '-10% Prime', date: '5h ago' }
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                           <div className="flex items-center gap-2">
                              <Gift className="w-3.5 h-3.5 text-orange-500" />
                              <span className="text-[10px] font-bold text-slate-900">{r.user}</span>
                           </div>
                           <span className="text-[9px] font-black text-emerald-600 uppercase italic">{r.reward}</span>
                        </div>
                      ))}
                   </div>
                   <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">Configurer les Offres</button>
                </div>
             </div>

             <div className="p-6 bg-white rounded-lg text-slate-900 shadow-sm relative overflow-hidden border border-slate-200">
                <div className="absolute bottom-0 right-0 p-8 opacity-10">
                   <Zap className="w-20 h-20 text-orange-400" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">News Flash (RDC)</h4>
                <div className="space-y-4">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                      <p className="text-[11px] font-black mb-1 text-slate-900 uppercase italic">Mise à jour Réseau Santé Africa</p>
                      <p className="text-[9px] text-slate-500 font-bold">5 nouvelles cliniques ajoutées à Lubumbashi & Kinshasa.</p>
                   </div>
                   <button className="w-full py-2 bg-orange-600 text-white rounded-md text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-600/30">Publier une Actu</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       {/* Module Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                CRM & Commercial <Award className="w-7 h-7 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic">Gestion client 360°, Performance commerciale & Marketing ciblé</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-green-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
             {[
               { id: 'clients', label: 'Clients', icon: Users },
               { id: 'prospects', label: 'Prospects', icon: Target },
               { id: 'performance', label: 'Perf/Bonus', icon: Star },
               { id: 'marketing', label: 'Marketing', icon: Megaphone },
               { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
               { id: 'faq', label: 'FAQ', icon: HelpCircle }
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                    activeTab === tab.id ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-slate-400 hover:text-green-600"
                  )}
                >
                   <tab.icon className="w-3.5 h-3.5" />
                   {tab.label}
                </button>
             ))}
          </div>
       </div>

       {/* Module Content */}
       <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             {activeTab === 'clients' && renderClients()}
             {activeTab === 'prospects' && renderProspects()}
             {activeTab === 'performance' && renderPerformance()}
             {activeTab === 'marketing' && renderMarketing()}
             {activeTab === 'faq' && renderFAQ()}
             {activeTab === 'dashboard' && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Conversion Leads', val: '24%', icon: Zap, color: 'text-indigo-600' },
                    { label: 'CAC Moyen', val: '42$', icon: DollarSign, color: 'text-emerald-600' },
                    { label: 'Retention Rate', val: '94%', icon: ShieldCheck, color: 'text-orange-600' },
                    { label: 'Referral ROI', val: '12.4x', icon: Share2, color: 'text-rose-600' }
                  ].map((kpi, i) => (
                    <div key={i} className="fluent-card p-6 flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{kpi.label}</p>
                          <p className={cn("text-2xl font-black", kpi.color)}>{kpi.val}</p>
                       </div>
                       <kpi.icon className={cn("w-8 h-8 opacity-10", kpi.color)} />
                    </div>
                  ))}
               </div>
             )}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
