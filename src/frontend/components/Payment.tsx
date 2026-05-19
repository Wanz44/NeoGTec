/**
 * 📄 Fichier : /src/frontend/components/Payment.tsx
 * 🎯 Objectif : Gestion financière complète avec facturation normalisée et calculateur de frais.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Wallet, CreditCard, Smartphone, Banknote, 
  ArrowUpRight, ArrowDownLeft, History as HistoryIcon, Zap, 
  ShieldCheck, Download, Filter, Search, 
  Clock, CheckCircle2, AlertCircle, RefreshCcw,
  Building, User, ChevronRight, FileText, Lock,
  BarChart3, Calculator, Info, Landmark
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PricingCalculator } from './billing/PricingCalculator';
import { InvoiceGenerator } from './billing/InvoiceGenerator';
import { ContributionsTracker } from './billing/ContributionsTracker';
import { MobileMoneyPortal } from './billing/MobileMoneyPortal';
import { ReconciliationAudit } from './billing/ReconciliationAudit';
import { TaxReporting } from './billing/TaxReporting';

// --- Types ---

export type PaymentMethod = 'Mobile Money' | 'Card' | 'Bank Transfer';
export type TransactionStatus = 'En attente' | 'Terminé' | 'Échoué' | 'Remboursé';

export interface Transaction {
  id: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  method: PaymentMethod;
  provider: string; // operator or bank
  recipient: string;
  timestamp: string;
  status: TransactionStatus;
  description: string;
}

export interface ProviderPayout {
  id: string;
  name: string;
  totalDue: number;
  pendingClaims: number;
  lastPaymentDate: string;
  status: 'Awaiting' | 'Processing' | 'Paid';
}

// --- Data ---

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-8821', type: 'Inflow', amount: 45.0, method: 'Mobile Money', provider: 'M-Pesa (Vodacom)', recipient: 'Mutombo Kasongo', timestamp: '2024-05-15T09:00:00Z', status: 'Terminé', description: 'Cotisation Santé Mai 2024' },
  { id: 'TX-8822', type: 'Outflow', amount: 1250.0, method: 'Bank Transfer', provider: 'RawBank', recipient: 'Hôpital HJ Hospitals', timestamp: '2024-05-15T10:30:00Z', status: 'En attente', description: 'Règlement Sinistre Luvuezo' },
  { id: 'TX-8823', type: 'Inflow', amount: 120.0, method: 'Card', provider: 'Visa', recipient: 'Kabasele Mwamba', timestamp: '2024-05-15T11:15:00Z', status: 'Échoué', description: 'Renouvellement Contrat Gold' },
];

const REVENUE_TREND = [
  { date: '01/05', inflow: 12000, outflow: 8000 },
  { date: '05/05', inflow: 15400, outflow: 9500 },
  { date: '10/05', inflow: 11200, outflow: 12000 },
  { date: '15/05', inflow: 19800, outflow: 11000 },
];

const METHOD_DISTRIBUTION = [
  { name: 'Mobile Money', value: 65, color: '#4ba32c' },
  { name: 'Card', value: 20, color: '#449528' },
  { name: 'Bank Transfer', value: 15, color: '#3a7d22' },
];

const CDF_RATE = 2800;
const formatAmount = (usd: number) => {
  const cdf = usd * CDF_RATE;
  return `${usd.toLocaleString()} $ / ${cdf.toLocaleString('fr-CD')} CDF`;
};

export const Payment: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [view, setView] = useState<'dashboard' | 'portal' | 'payouts' | 'history' | 'billing' | 'contributions' | 'mobile-money' | 'reconciliation' | 'tax-reporting'>('dashboard');
  
  React.useEffect(() => {
    if (subModule === 'billing-contributions') setView('contributions');
    else if (subModule === 'billing-mobile-money') setView('mobile-money');
    else if (subModule === 'billing-reconciliation') setView('reconciliation');
    else if (subModule === 'billing-tax') setView('tax-reporting');
    else if (subModule === 'payment') setView('dashboard');
  }, [subModule]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Mobile Money');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
       {/* Financial Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Encaissé (USD)', value: '45,200 $', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Banknote, change: '+12.5%', sub: 'Mois de Mai' },
            { label: 'Sorties Sinistres', value: '112,000 $', color: 'text-rose-600', bg: 'bg-rose-50', icon: ArrowDownLeft, change: '-4.2%', sub: 'Prestations Réglées' },
            { label: 'Balance Trésorerie', value: '1.2M $', color: 'text-green-950', bg: 'bg-green-100', icon: Wallet, sub: 'Fonds Mutualisés' },
            { label: 'Taux de Recouvrement', value: '88.5%', color: 'text-green-600', bg: 'bg-green-50', icon: RefreshCcw, change: '+2%', sub: 'vs Mois Dernier' },
          ].map((stat, i) => (
            <div key={i} className="fluent-card p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
               <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-lg", stat.bg)}>
                     <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  {stat.change && <span className={cn("text-[8px] font-black italic", stat.color)}>{stat.change}</span>}
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
               <p className="text-xl font-black text-slate-900">{stat.value}</p>
               {stat.sub && <p className="text-[8px] font-bold text-slate-300 italic">{stat.sub}</p>}
            </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 fluent-card p-6 min-h-[350px]">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h4 className="text-sm font-black text-green-950 uppercase">Flux de Trésorerie</h4>
                   <p className="text-[10px] font-bold text-slate-300 italic">Entrées vs Sorties (15 derniers jours)</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> <span className="text-[9px] font-black uppercase">Entrées</span></div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300" /> <span className="text-[9px] font-black uppercase">Sorties</span></div>
                </div>
             </div>
             <div className="h-[250px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={REVENUE_TREND}>
                      <defs>
                         <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ba32c" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4ba32c" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontStyle: 'italic', fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="inflow" stroke="#4ba32c" strokeWidth={3} fillOpacity={1} fill="url(#colorInflow)" />
                      <Area type="monotone" dataKey="outflow" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="fluent-card p-6 flex flex-col">
             <h4 className="text-sm font-black text-green-950 uppercase mb-6">Canaux de Paiement</h4>
             <div className="flex-1 w-full h-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={METHOD_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {METHOD_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3 mt-4">
                {METHOD_DISTRIBUTION.map(m => (
                  <div key={m.name} className="flex items-center justify-between p-2 rounded-xl border border-green-50 bg-green-50/10">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{m.name}</span>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 italic">{m.value}%</span>
                  </div>
                ))}
             </div>
          </div>
       </div>

       <div className="flex items-center gap-6 p-6 bg-white border border-green-200 rounded-3xl overflow-hidden relative group shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
             <ShieldCheck className="w-40 h-40 text-green-600" />
          </div>
          <div className="flex items-center gap-6 relative z-10 w-full justify-between">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-center">
                   <Lock className="w-8 h-8 text-green-600" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-green-950 uppercase tracking-tight italic">Sécurité Certifiée PCI DSS</h4>
                   <p className="text-xs text-slate-400 tracking-tight italic">Toutes les données sensibles (PAN, Token) sont cryptées en AES-256 avec validation 3D Secure 2.0.</p>
                </div>
             </div>
             <button className="whitespace-nowrap px-8 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-600/30 hover:bg-green-500 transition-all relative z-10 border border-green-700">
                Vérifier l'Audit Compliance
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       {/* Global Dashboard Navigation */}
       <div className="flex items-center justify-between px-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-950 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <Wallet className="w-5 h-5 text-white" />
             </div>
             <div className="hidden md:block">
                <h3 className="text-sm font-black text-green-950 italic">Module de Paiement</h3>
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest leading-none">Management Financier</p>
             </div>
          </div>

          <div className="flex bg-white/50 p-1 rounded-xl gap-1 overflow-x-auto">
             {[
               { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
               { id: 'contributions', label: 'Cotisations', icon: HistoryIcon },
               { id: 'mobile-money', label: 'Mobile Money', icon: Smartphone },
               { id: 'reconciliation', label: 'Audit & Recon.', icon: CheckCircle2 },
               { id: 'tax-reporting', label: 'Fiscalité', icon: Landmark },
               { id: 'billing', label: 'Facturation & Calcul', icon: Calculator },
             ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                    view === item.id ? "bg-green-600 text-white shadow-md shadow-green-600/20" : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                  )}
                >
                   <item.icon className="w-3.5 h-3.5" />
                   {item.label}
                </button>
             ))}
          </div>
       </div>

       <AnimatePresence mode="wait">
          {view === 'dashboard' && <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="dash">{renderDashboard()}</motion.div>}
          {view === 'contributions' && <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="cont"><ContributionsTracker /></motion.div>}
          {view === 'mobile-money' && <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="mm"><MobileMoneyPortal /></motion.div>}
          {view === 'reconciliation' && <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="recon"><ReconciliationAudit /></motion.div>}
          {view === 'tax-reporting' && <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="tax"><TaxReporting /></motion.div>}
          {view === 'billing' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key="billing" className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div className="space-y-8">
                <PricingCalculator />
                <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm overflow-hidden group">
                   <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase italic tracking-tighter">
                     <Info className="w-5 h-5 text-green-500" /> Assistance à la Cotation
                   </h4>
                   <p className="text-xs text-slate-500 leading-relaxed mb-4 italic">
                     Le barème conventionné est automatiquement appliqué selon le type d'établissement.
                   </p>
                   <div className="space-y-2">
                      {['Injections IM', 'Pansement simple', 'Tension artérielle'].map(item => (
                        <div key={item} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-dashed border-slate-200 group-hover:bg-green-50 transition-colors">
                           <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">{item}</span>
                           <span className="text-[10px] font-bold text-green-600 italic">Automatique</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              <InvoiceGenerator />
            </motion.div>
          )}
          {/* ... portal, payouts, history views placeholders or calls ... */}
          {view === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="hist" className="fluent-card p-6">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-green-950 uppercase flex items-center gap-2"><HistoryIcon className="w-5 h-5 text-green-600" /> Journal Ledger Certifié</h4>
               </div>
               <div className="space-y-4">
                  {MOCK_TRANSACTIONS.map(tx => (
                    <div key={tx.id} className="p-4 rounded-lg border border-green-100 bg-white flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", tx.type === 'Inflow' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                             {tx.type === 'Inflow' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase">{tx.recipient}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{tx.description}</p>
                          </div>
                       </div>
                       <p className={cn("text-sm font-black", tx.type === 'Inflow' ? "text-emerald-600" : "text-rose-600")}>
                          {tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toLocaleString()} $
                       </p>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
