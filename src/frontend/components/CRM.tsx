/**
 * 📄 Fichier : /src/frontend/components/CRM.tsx
 * 🎯 Objectif : Hub commercial complet avec pipeline de prospects interactifs, leaderboard et FAQ dynamique.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Target, MessageSquare, Megaphone, 
  Gift, History as HistoryIcon, TrendingUp, Users2, HelpCircle, 
  Search, Filter, Plus, ChevronRight, Download, 
  Star, Mail, Phone, MapPin, DollarSign, 
  Calendar, Zap, Award, BarChart3, PieChart as PieIcon,
  Bell, FileText, Send, Share2, ShieldCheck, Clock, Layers, ArrowUpRight, X, ChevronUp, Check
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

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

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  maturity: LeadMaturity;
  potentialValue: number;
  score: number; // conversion confidence
  lastInteraction: string;
  type: ClientType;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const INITIAL_CLIENTS: ClientProfile[] = [
  { id: 'CLI-001', name: 'Mutombo Dikembe', type: 'Individuel', status: 'Actif', email: 'dikembe@african-hero.cd', phone: '+243 81 000 0001', contracts: 2, totalPaid: 1250, lastInteraction: '2026-05-10', score: 95 },
  { id: 'CLI-002', name: 'Kabasele Mwamba', type: 'Individuel', status: 'Actif', email: 'kabasele@lingala-vision.fr', phone: '+243 81 000 0002', contracts: 1, totalPaid: 450, lastInteraction: '2026-05-14', score: 88 },
  { id: 'CLI-003', name: 'Katanga Mining Solutions', type: 'Entreprise', status: 'Actif', email: 'contact@kms-mining.cd', phone: '+243 81 000 1000', contracts: 45, totalPaid: 12500, lastInteraction: '2026-05-12', score: 92 },
];

const INITIAL_PROSPECTS: Prospect[] = [
  { id: 'PRO-001', name: 'Luvuezo Makanda', email: 'luvuezo@it-africa.cd', phone: '+243 77 000 000', maturity: 'Chaud', potentialValue: 2500, score: 75, lastInteraction: '2026-05-15', type: 'Individuel' },
  { id: 'PRO-002', name: 'Bosoko Etumangele', email: 'bosoko@river-trade.com', phone: '+243 82 201 0422', maturity: 'Tiède', potentialValue: 1200, score: 45, lastInteraction: '2026-05-11', type: 'Individuel' },
  { id: 'PRO-003', name: 'Rawbank RH Contact', email: 'hector.lumbala@rawbank.cd', phone: '+243 81 223 9091', maturity: 'Froid', potentialValue: 9500, score: 12, lastInteraction: '2026-05-01', type: 'Entreprise' },
];

const PERFORMANCE_DATA = [
  { name: 'Jan', sales: 45, conversion: 12 },
  { name: 'Feb', sales: 52, conversion: 15 },
  { name: 'Mar', sales: 48, conversion: 14 },
  { name: 'Apr', sales: 70, conversion: 22 },
  { name: 'May', sales: 85, conversion: 28 },
];

const INITIAL_FAQ: FAQItem[] = [
  { id: 'f1', question: 'Comment renouveler un contrat expiré chez Adonaï ?', answer: 'Le renouvellement se fait directement via le site client ou l’interface de votre compte d’entreprise. Pour les contrats collectifs, contactez votre conseiller commercial dédié.', category: 'Contrats', tags: ['renouvellement', 'expiration'] },
  { id: 'f2', question: 'Quels sont les délais de paiement par Mobile Money ?', answer: 'Les paiements via M-Pesa, Orange Money et Airtel Money sont traités quasi-instantanément. Toutefois, la réconciliation bancaire peut durer 2 minutes pour validation de la référence API.', category: 'Paiements', tags: ['mobile money', 'délais'] },
  { id: 'f3', question: 'Qui contacter si ma demande de tiers-payant est refusée aux urgences ?', answer: 'Appelez immédiatement notre hotline médicale assurée disponible 24h/24 au numéro court 4040. Un médecin coordinateur Adonaï prendra le relais auprès de l’établissement.', category: 'Urgences', tags: ['tiers-payant', 'urgence'] }
];

export const CRM: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Stateful models for lists
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [faqList, setFaqList] = useState<FAQItem[]>(INITIAL_FAQ);

  // FAQ Add Question modal state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCat, setFaqCat] = useState('Contrats');

  // Prospect Add Modal state
  const [isProsModalOpen, setIsProsModalOpen] = useState(false);
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pMat, setPMat] = useState<LeadMaturity>('Froid');
  const [pVal, setPVal] = useState('2000');

  // Global visual toast feedback
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => {
      setToastText(null);
    }, 4500);
  };

  // Sync internal state with external subModule prop
  useEffect(() => {
    if (!subModule) return;
    const mapping: Record<string, string> = {
      'crm-marketing': 'marketing',
      'crm-performance': 'performance',
      'crm-faq': 'faq',
      'crm-global-perf': 'dashboard',
      'crm-leads': 'prospects',
      'crm': 'clients'
    };
    if (mapping[subModule]) setActiveTab(mapping[subModule]);
  }, [subModule]);

  // Upgrade prospect maturity (E1 requirement)
  const handlePromoteMaturity = (prospectId: string) => {
    setProspects(prev => prev.map(prospect => {
      if (prospect.id === prospectId) {
        let nextMat: LeadMaturity = 'Froid';
        let newScore = prospect.score;
        if (prospect.maturity === 'Froid') {
          nextMat = 'Tiède';
          newScore = 45;
        } else if (prospect.maturity === 'Tiède') {
          nextMat = 'Chaud';
          newScore = 80;
        } else {
          showToast(`Le prospect ${prospect.name} est déjà au niveau maximum (Chaud).`);
          return prospect;
        }
        showToast(`Maturité de "${prospect.name}" mise à jour avec succès : ${prospect.maturity} ➔ ${nextMat}.`);
        return { ...prospect, maturity: nextMat, score: newScore, lastInteraction: new Date().toISOString().split('T')[0] };
      }
      return prospect;
    }));
  };

  // Create Prospect (E1 requirement)
  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    const newPrs: Prospect = {
      id: `PRO-${Math.floor(100 + Math.random() * 900)}`,
      name: pName,
      email: pEmail,
      phone: pPhone,
      maturity: pMat,
      potentialValue: Number(pVal),
      score: pMat === 'Chaud' ? 80 : pMat === 'Tiède' ? 45 : 15,
      lastInteraction: new Date().toISOString().split('T')[0],
      type: 'Individuel'
    };

    setProspects([newPrs, ...prospects]);
    setIsProsModalOpen(false);
    showToast(`Prospect "${pName}" créé avec succès et inséré dans la colonne ${pMat}.`);
    setPName('');
    setPEmail('');
    setPPhone('');
  };

  // Submit FAQ Question (E3 requirement)
  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ.trim() || !faqA.trim()) return;

    const newFaq: FAQItem = {
      id: `f${faqList.length + 1}`,
      question: faqQ,
      answer: faqA,
      category: faqCat,
      tags: [faqCat.toLowerCase(), 'user-suggestion']
    };

    setFaqList([...faqList, newFaq]);
    setIsFaqModalOpen(false);
    showToast(`Nouvelle question FAQ enregistrée et mise en ligne.`);
    setFaqQ('');
    setFaqA('');
  };

  // Filter computation for clients
  const filteredClients = INITIAL_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Floating notifications */}
      <AnimatePresence>
        {toastText && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-green-500 rounded-xl text-white">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-green-400">CRM Commercial</p>
              <p className="text-xs text-slate-350 font-bold mt-1 leading-relaxed">{toastText}</p>
            </div>
            <button onClick={() => setToastText(null)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 italic uppercase">Module CRM &amp; Commercial</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pipeline commercial, commissions, leaderboard commercial et support FAQ</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-sm w-fit shrink-0 overflow-x-auto">
          {[
            { id: 'clients', label: 'Clients 360', icon: Users },
            { id: 'prospects', label: 'Pipeline Leads', icon: Target },
            { id: 'performance', label: 'Perf/Bonus', icon: Star },
            { id: 'marketing', label: 'Campagnes', icon: Megaphone },
            { id: 'faq', label: 'Base FAQ', icon: HelpCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap italic",
                activeTab === tab.id ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-3.5 h-3.5 text-indigo-600" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">

        {/* 1. CLIENTS 360 WORKFLOW VIEW */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-black text-slate-900 uppercase">Registre National des Adhérents</span>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Identifiant ou nom..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredClients.map(client => (
                    <div 
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4",
                        selectedClient?.id === client.id ? "bg-slate-50 border-indigo-200 shadow-sm" : "bg-white border-slate-100 hover:border-slate-350"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black uppercase text-xs">
                          {client.name.substring(0,2)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase">{client.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{client.id} • {client.email}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black text-slate-950">{client.totalPaid.toLocaleString()} $</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Score: {client.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedClient ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center font-black text-slate-800 text-lg border border-slate-200">
                      {selectedClient.name.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase">{selectedClient.name}</h4>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded uppercase tracking-widest border border-indigo-150">
                        {selectedClient.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'E-mail', val: selectedClient.email },
                      { label: 'Téléphone', val: selectedClient.phone },
                      { label: 'Total payé ($)', val: `${selectedClient.totalPaid.toLocaleString()} $` },
                      { label: 'Contrats Actifs', val: `${selectedClient.contracts} Polices` },
                      { label: 'Dernier Contact', val: selectedClient.lastInteraction }
                    ].map((row, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-400 uppercase text-[9px] block mb-0.5">{row.label}</span>
                        <span className="font-bold text-slate-800 font-mono text-right">{row.val}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => showToast(`Synchronisation du dossier ${selectedClient.id} complétée.`)}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-slate-900/10 cursor-pointer"
                  >
                    Demander Note d&apos;évaluation
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/50 rounded-[2.5rem] p-6 text-center text-slate-400 italic text-xs py-12">
                  Veuillez sélectionner un assuré ou un prospect dans l&apos;annuaire pour déployer la vue 360°.
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. PROSPECT MATURITY PIPELINE (E1) */}
        {activeTab === 'prospects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase italic">Pipeline des Acquisitions Commerciales</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Classification par maturité d&apos;achat</p>
              </div>

              <button 
                onClick={() => setIsProsModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Ajouter Prospect
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Froid', 'Tiède', 'Chaud'] as LeadMaturity[]).map((level) => {
                const colLeads = prospects.filter(p => p.maturity === level);
                const colValueSum = colLeads.reduce((acc, curr) => acc + curr.potentialValue, 0);

                return (
                  <div key={level} className="space-y-3 bg-slate-50/50 border border-slate-200 p-4 rounded-[2.5rem] min-h-[420px] flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 px-1">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            level === 'Chaud' ? "bg-rose-500" : level === 'Tiède' ? "bg-amber-500" : "bg-blue-500"
                          )} />
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-700">{level}</h5>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-indigo-600">{colValueSum.toLocaleString()}$</p>
                          <p className="text-[7.5px] font-bold text-slate-400 uppercase leading-none">Valeur cumulée</p>
                        </div>
                      </div>

                      {/* Lead Cards */}
                      <div className="space-y-3">
                        {colLeads.map((prs) => (
                          <div 
                            key={prs.id}
                            className="bg-white border border-slate-150 p-4 rounded-xl shadow-sm hover:border-indigo-300 transition-all space-y-3 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-indigo-600 font-mono tracking-tighter">{prs.id}</span>
                              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[8px] font-black text-indigo-700 uppercase">
                                {prs.potentialValue.toLocaleString()} $
                              </span>
                            </div>

                            <div>
                              <h6 className="text-xs font-black text-slate-900 uppercase">{prs.name}</h6>
                              <p className="text-[9px] text-slate-400 font-bold font-mono mt-0.5">{prs.email}</p>
                              <p className="text-[9px] text-slate-400 font-bold mt-0.5">📞 {prs.phone}</p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${prs.score}%` }} />
                              </div>
                              
                              {level !== 'Chaud' && (
                                <button 
                                  onClick={() => handlePromoteMaturity(prs.id)}
                                  className="px-2.5 py-1 bg-slate-900 text-white rounded text-[8.5px] font-black uppercase tracking-wider hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer"
                                >
                                  Avancer ➔
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. PERFORMANCE & COMMISSION LEADERBOARD (E2) */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase italic">Évolution du Volume de Ventes</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Performances régionales d&apos;Adonaï</p>
                </div>
                <Users2 className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ba32c" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4ba32c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" name="Ventes Adhérents" stroke="#4ba32c" strokeWidth={3} fill="url(#colorSales)" />
                    <Area type="monotone" dataKey="conversion" name="Conversion %" stroke="#449528" strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Leaderboard Performance &amp; Commissions</span>
              
              <div className="space-y-3">
                {[
                  { name: 'Sarah Luvuezo', sales: 24, commissionBonus: 1450, r: 1 },
                  { name: 'David Kasongo', sales: 18, commissionBonus: 950, r: 2 },
                  { name: 'Albert Mukendi', sales: 15, commissionBonus: 650, r: 3 }
                ].map((ag) => (
                  <div key={ag.r} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black italic text-xs">
                        #{ag.r}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase">{ag.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{ag.sales} Contrats vendus</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-600">+{ag.commissionBonus.toLocaleString()} $</p>
                      <p className="text-[8px] font-black text-slate-300 italic uppercase">Bonus Direct</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl text-xs space-y-1">
                <p className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Algorithme de calcul bonus</p>
                <p className="font-bold text-slate-700 italic">Commissions fixes à 5% de la prime, avec bonus de conversion de 100$ par palier de 10 signatures.</p>
              </div>
            </div>

          </div>
        )}

        {/* 4. MARKETING EMAIL/BANNER CAMPAIGNS */}
        {activeTab === 'marketing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase italic">Templates Publicitaires ACTIFS</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aperçu mobile et in-app des bannières commerciales</p>
              </div>

              <div className="p-8 bg-gradient-to-r from-indigo-600 to-rose-600 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-white/5 opacity-50 transform skew-x-12 translate-x-12" />
                <div className="relative z-10 max-w-sm space-y-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest w-fit block">Campagne Q2 Acton</span>
                  <h3 className="text-2xl font-black italic tracking-tight leading-none uppercase">Protégez votre famille en RDC à -20%.</h3>
                  <p className="text-xs font-bold text-white/80 leading-relaxed">Activez notre barème NeoGold Supreme à tarification ajustable avec dispense de pré-visite médicale.</p>
                  
                  <button 
                    onClick={() => showToast("Envoi de la newsletter promotionnelle aux 4K prospects...")}
                    className="px-6 py-2.5 bg-white text-indigo-900 text-[10px] font-black rounded-lg uppercase tracking-wider hover:scale-105 transition-all shadow-lg active:scale-95 cursor-pointer"
                  >
                    Simuler Envoi Campagne
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
              <span className="text-xs font-black text-slate-900 uppercase">Répartition des récompenses parrainage</span>
              
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Filleuls Convertis</p>
                  <p className="text-2xl font-black text-indigo-600">342 contacts</p>
                </div>
                <Share2 className="w-10 h-10 text-indigo-200" />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Derniers bonus parrainé</p>
                {[
                  { user: 'Marie Curie', reward: '+150 Pts Fidelity' },
                  { user: 'Benoit Lucas', reward: '-10% Prime Juin' }
                ].map((re, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center text-[10px]">
                    <span className="font-extrabold text-slate-800">{re.user}</span>
                    <span className="font-black text-emerald-600 uppercase">{re.reward}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 5. COMMERCIAL FAQ BASE MANAGER (E3) */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-100 rounded-2xl">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase">Base de Connaissance &amp; FAQ FAQ</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Foire aux questions interne pour les conseillers clientèle</p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Saisie mots clés..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <button 
                  onClick={() => setIsFaqModalOpen(true)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Suggérer Question
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="md:col-span-1 space-y-2">
                {['Toutes', 'Contrats', 'Paiements', 'Réclamations', 'Technique'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (cat === 'Toutes') setSearchQuery('');
                      else setSearchQuery(cat);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer block"
                  >
                    #{cat}
                  </button>
                ))}
              </div>

              <div className="md:col-span-3 space-y-4">
                {faqList.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.category.toLowerCase().includes(searchQuery.toLowerCase())).map((faq) => (
                  <div key={faq.id} className="p-6 bg-white border border-slate-150 rounded-2xl hover:border-slate-350 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[8.5px] font-black uppercase rounded tracking-wider">{faq.category}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">{faq.id}</span>
                    </div>

                    <h5 className="text-sm font-black text-slate-900 uppercase italic">&ldquo;{faq.question}&rdquo;</h5>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed font-bold italic">{faq.answer}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================= */}
      {/* ADD PROSPECT POP-UP MODAL (E1)            */}
      {/* ========================================= */}
      <AnimatePresence>
        {isProsModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProsModalOpen(false)}
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
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-1000 uppercase italic">Ajouter Prospect</h3>
                </div>
                <button onClick={() => setIsProsModalOpen(false)} className="p-2 text-slate-450 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProspect} className="p-8 space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom Complet</label>
                  <input 
                    type="text" 
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Samba Diawara"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">E-mail</label>
                    <input 
                      type="email" 
                      value={pEmail}
                      onChange={(e) => setPEmail(e.target.value)}
                      placeholder="samba@diawara.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Téléphone</label>
                    <input 
                      type="text" 
                      value={pPhone}
                      onChange={(e) => setPPhone(e.target.value)}
                      placeholder="+243 81 404 0404"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Maturité Initiale</label>
                    <select 
                      value={pMat}
                      onChange={(e) => setPMat(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="Froid">Froid (Faible priorité)</option>
                      <option value="Tiède">Tiède (priorité standard)</option>
                      <option value="Chaud">Chaud (priorité critique)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Valeur Estimative ($)</label>
                    <input 
                      type="number" 
                      value={pVal}
                      onChange={(e) => setPVal(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsProsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    Enregistrer Prospect
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* SUGGEST FAQ DIALOG QUESTION MODAL (E3)    */}
      {/* ========================================= */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFaqModalOpen(false)}
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
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-1000 uppercase italic">Suggérer question FAQ</h3>
                </div>
                <button onClick={() => setIsFaqModalOpen(false)} className="p-2 text-slate-450 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddFAQ} className="p-8 space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Catégorie</label>
                  <select 
                    value={faqCat}
                    onChange={(e) => setFaqCat(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-medium"
                  >
                    <option value="Contrats">Gestion des Contrats</option>
                    <option value="Paiements">Passerelle de Paiements</option>
                    <option value="Réclamations">Traitement réclamations</option>
                    <option value="Technique">Portabilité technique</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Sujet / Question commerciale</label>
                  <input 
                    type="text" 
                    value={faqQ}
                    onChange={(e) => setFaqQ(e.target.value)}
                    placeholder="Quels sont les plafonds d'un plan Standard ?"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Réponse d&apos;agent formelle</label>
                  <textarea 
                    rows={4}
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                    placeholder="Les plafonds actuels s'élèvent à un maximum annuel de..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none resize-none"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsFaqModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    Ajouter à la base FAQ
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
