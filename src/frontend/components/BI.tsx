/**
 * 📄 Fichier : /src/frontend/components/BI.tsx
 * 🎯 Objectif : Hub de Business Intelligence (BI) avec tableaux de bord, analyses de tendances et prédictions.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, TrendingUp, PieChart, LineChart as LucideLineChart, 
  FileDown, Download, Filter, Search, Calendar, 
  Target, AlertTriangle, ShieldCheck, Database, 
  Cpu, Zap, Layers, RefreshCw, ChevronRight,
  ArrowUpRight, ArrowDownRight, MoreVertical,
  Activity, DollarSign, Users, Briefcase
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart as ReachyPieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '../lib/utils';

// --- Types ---

type BITab = 'dashboard' | 'trends' | 'predictions' | 'reports';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

// --- Mock Data ---

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000, expenses: 32000, claims: 12000 },
  { month: 'Feb', revenue: 52000, expenses: 34000, claims: 15000 },
  { month: 'Mar', revenue: 48000, expenses: 31000, claims: 11000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, claims: 19000 },
  { month: 'May', revenue: 55000, expenses: 35000, claims: 14000 },
  { month: 'Jun', revenue: 67000, expenses: 40000, claims: 22000 },
];

const PREDICTION_DATA = [
  { time: 'T-2', actual: 100, predicted: 100 },
  { time: 'T-1', actual: 110, predicted: 108 },
  { time: 'T0', actual: 125, predicted: 122 },
  { time: 'T+1', predicted: 135 },
  { time: 'T+2', predicted: 142 },
  { time: 'T+3', predicted: 155 },
];

const DISTRIBUTION_DATA = [
  { name: 'Sante', value: 45, color: '#117F02' },
  { name: 'Automobile', value: 25, color: '#6366f1' },
  { name: 'Vie', value: 20, color: '#10b981' },
  { name: 'Prevoyance', value: 10, color: '#8b5cf6' },
];

const REPORTS = [
  { id: 'REP-01', title: 'Performance Mensuelle Janvier', type: 'Financier', date: '2024-02-01', format: 'PDF' },
  { id: 'REP-02', title: 'Analyse Sinistralite Q4', type: 'Operationnel', date: '2024-01-15', format: 'XLSX' },
  { id: 'REP-03', title: 'Previsions C.A. 2025', type: 'Strategique', date: '2024-03-01', format: 'PDF' },
];

// --- Sub-components ---

const KPICard: React.FC<KPICardProps> = ({ label, value, change, isPositive, icon: Icon, color }) => (
  <div className="fluent-card p-6 relative overflow-hidden group rounded-xl border border-green-200">
    <div className={cn("absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform", color)}>
      <Icon className="w-16 h-16" />
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className={cn("p-2 rounded-lg bg-opacity-10 border border-current", color.replace('text-', 'bg-'))}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <div className="flex items-end justify-between relative z-10">
      <h3 className="text-2xl font-black text-green-950">{value}</h3>
      <div className={cn(
        "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full italic border",
        isPositive ? "bg-emerald-100 text-emerald-600 border-emerald-200" : "bg-rose-100 text-rose-600 border-rose-200"
      )}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
  </div>
);

export const BI: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<BITab>('dashboard');
  const [simulationImpact, setSimulationImpact] = useState(1.2); // 20% increase scenario

  React.useEffect(() => {
    if (subModule === 'bi-dashboard') setActiveTab('dashboard');
    else if (subModule === 'bi-trends') setActiveTab('trends');
    else if (subModule === 'bi-predictions') setActiveTab('predictions');
    else if (subModule === 'bi-reports') setActiveTab('reports');
  }, [subModule]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          label="C.A. Global ($)" value="2.4M $" change="+12.5%" isPositive={true} 
          icon={DollarSign} color="text-green-600" 
        />
        <KPICard 
          label="C.A. Global (CDF)" value="6.72B CDF" change="+12.5%" isPositive={true} 
          icon={Briefcase} color="text-green-600" 
        />
        <KPICard 
          label="Taux Sinistralite" value="64.2%" change="-2.1%" isPositive={true} 
          icon={Activity} color="text-indigo-600" 
        />
        <KPICard 
          label="Clients Actifs" value="12.4k" change="+840" isPositive={true} 
          icon={Users} color="text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 fluent-card p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-sm font-black text-green-950 uppercase tracking-tight italic">Evolution Financiere</h4>
              <p className="text-[10px] font-bold text-slate-400">Revenus vs Charges vs Sinistres (6 derniers mois)</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-green-200 rounded-lg hover:bg-green-50 transition-all"><Filter className="w-4 h-4 text-green-600" /></button>
              <button className="p-2 border border-green-200 rounded-lg hover:bg-green-50 transition-all"><FileDown className="w-4 h-4 text-green-600" /></button>
            </div>
          </div>
          <div className="h-[300px] w-full bg-slate-50/50 rounded-lg p-4 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#117F02" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#117F02" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #117F02',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#117F02" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Distribution */}
        <div className="fluent-card p-6 rounded-xl border border-green-200">
          <h4 className="text-sm font-black text-green-950 uppercase mb-8">Repartition par Produit</h4>
          <div className="h-[250px] w-full bg-slate-50/50 rounded-lg p-2 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <ReachyPieChart>
                <Pie
                  data={DISTRIBUTION_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </ReachyPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
             {DISTRIBUTION_DATA.map((item) => (
               <div key={item.name} className="flex items-center justify-between p-2 rounded-lg border border-slate-50 hover:border-green-100 transition-colors">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-green-950">{item.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anomaly Detection */}
          <div className="fluent-card p-6 border-rose-200 bg-rose-50/10 rounded-xl">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-green-950 uppercase flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-rose-500" /> Anomalies Detectees
                </h4>
                <span className="px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase italic rounded-full animate-pulse border border-rose-700">Critical IA Scan</span>
             </div>
             <div className="space-y-4">
                {[
                  { title: 'Pic de sinistralité inhabituel', location: 'Togo (Region Maritime)', probability: '92%', status: 'Urgent' },
                  { title: 'Tentative de fraude identifiée', location: 'Client C-9912', probability: '85%', status: 'Revision' },
                  { title: 'Consommation medicament hors-norme', location: 'Prestataire PHARM-22', probability: '78%', status: 'Alerte' },
                ].map((alert, i) => (
                  <div key={i} className="p-4 bg-white border border-rose-100 rounded-xl flex items-center justify-between group hover:border-rose-400 transition-all cursor-pointer shadow-sm">
                     <div>
                        <p className="text-xs font-black text-green-950 uppercase">{alert.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">{alert.location}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-rose-600">{alert.probability}</p>
                        <p className="text-[8px] font-black uppercase text-rose-400 opacity-60">Confiance IA</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="fluent-card p-6 rounded-xl border border-indigo-200">
             <h4 className="text-sm font-black text-green-950 uppercase mb-8 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> Comportements Saisonniers
             </h4>
             <div className="h-[200px] w-full mb-6 bg-slate-50 rounded-lg p-2 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #6366f1' }}
                      />
                      <Bar dataKey="claims" fill="#6366f1" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic border-l-2 border-indigo-200 pl-4 py-2 bg-indigo-50/30 rounded-r-lg">
                L'IA detecte une augmentation recurrente de 15% des sinistres sante durant la periode d'Avril - Mai. Recommandation : Ajuster les reserves techniques.
             </p>
          </div>
       </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Engine */}
          <div className="lg:col-span-1 space-y-6">
             <div className="fluent-card p-6 bg-white text-slate-900 border border-green-200 shadow-sm relative overflow-hidden group rounded-lg">
                <div className="absolute -right-4 -bottom-4 p-8 opacity-5 group-hover:scale-125 transition-transform text-green-600">
                   <Cpu className="w-24 h-24" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-slate-400">Simulation de Scenarios (RDC)</h4>
                
                <div className="space-y-6 relative z-10">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black uppercase text-slate-500">Variation Tarifaire</label>
                         <span className="text-xs font-black text-green-600">+{(simulationImpact * 10 - 10).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" min="1" max="1.5" step="0.1" 
                        value={simulationImpact} onChange={(e) => setSimulationImpact(parseFloat(e.target.value))}
                        className="w-full accent-green-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none border border-slate-200" 
                      />
                   </div>

                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl shadow-inner">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Projection Impact C.A. (Africa)</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-black text-green-600">+{(12.4 * simulationImpact).toFixed(1)}%</span>
                         <span className="text-[10px] font-bold text-slate-400 italic font-mono">sur l'exercice 2024</span>
                      </div>
                   </div>

                   <button className="w-full py-3 bg-green-600 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-700 transition-all flex items-center justify-center gap-2 border border-green-700 shadow-lg shadow-green-600/20">
                      <Zap className="w-4 h-4" /> Executer Simulation
                   </button>
                </div>
             </div>

             <div className="fluent-card p-6 rounded-xl border border-green-200">
                <h4 className="text-sm font-black text-green-950 uppercase mb-6 flex items-center gap-2">
                   <Target className="w-5 h-5 text-emerald-600" /> Rentabilite Previsonnelle
                </h4>
                <div className="space-y-4">
                   {[
                     { label: 'Client Premium (High)', risk: 'Low', color: 'text-emerald-600' },
                     { label: 'Prestataire MED-01', risk: 'Medium', color: 'text-green-600' },
                     { label: 'Produit Sante S1', risk: 'High', color: 'text-rose-600' },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 border-b border-green-50 last:border-0 hover:bg-slate-50 rounded-lg transition-colors">
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{item.label}</span>
                        <span className={cn("text-[10px] font-black uppercase italic border px-2 py-0.5 rounded-full bg-white", item.color, item.color.replace('text-', 'border-'))}>{item.risk} Risk</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Predictive Chart */}
          <div className="lg:col-span-2 fluent-card p-8 rounded-xl border border-green-200">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h4 className="text-sm font-black text-green-950 uppercase tracking-tight italic">Moteur de Prediction IA</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Projection des pertes potentielles & Risques financiers</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Reel</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full border border-indigo-600" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">IA Forecast</span>
                   </div>
                </div>
             </div>
             <div className="h-[350px] w-full bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={PREDICTION_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #117F02' } }
                      />
                      <Line type="monotone" dataKey="actual" stroke="#117F02" strokeWidth={4} dot={{ r: 6, fill: '#117F02', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 border border-green-200">
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-green-950">Alerte de Pertes Potentielles</p>
                      <p className="text-[10px] font-medium text-slate-400 italic">Lien vers les polices a risques generées automatiquement.</p>
                   </div>
                </div>
                <button className="px-5 py-2 bg-white border border-green-200 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-50 transition-all shadow-sm">Consulter Dossiers Risques</button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
       <div className="text-center p-20 border-2 border-dashed border-green-200 rounded-[32px] bg-slate-50/30">
          <FileDown className="w-20 h-20 text-green-200 mx-auto mb-6" />
          <h3 className="text-xl font-black text-green-950 uppercase italic">Aucun rapport</h3>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Lancez une génération pour voir les résultats ici</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       {/* Module Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Business Intelligence <TrendingUp className="w-8 h-8 text-green-50 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Analyse de donnees, Predictions IA & Reporting Strategique</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-xl border border-green-200 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
             {[
               { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
               { id: 'trends', label: 'Tendances', icon: Activity },
               { id: 'predictions', label: 'IA Forecast', icon: Cpu },
               { id: 'reports', label: 'Rapports', icon: FileDown },
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as BITab)}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                    activeTab === tab.id ? "bg-green-600 text-white shadow-lg shadow-green-600/20 border border-green-700" : "text-slate-400 hover:text-green-600"
                  )}
                >
                   <tab.icon className="w-3.5 h-3.5" />
                   {tab.label}
                </button>
             ))}
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             {activeTab === 'dashboard' && renderDashboard()}
             {activeTab === 'trends' && renderTrends()}
             {activeTab === 'predictions' && renderPredictions()}
             {activeTab === 'reports' && renderReports()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
