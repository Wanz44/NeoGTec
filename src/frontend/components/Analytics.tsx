/**
 * 📄 Fichier : /src/frontend/components/Analytics.tsx
 * 🎯 Objectif : Interface analytique personnalisable pour les gestionnaires avec KPIs et graphiques.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  BarChart3, TrendingUp, Users, Wallet, Download, 
  Filter, Calendar, ChevronRight, ArrowUpRight, 
  Activity, ShieldAlert, FileSearch, Share2, Key
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Data ---

const REVENUE_DATA = [
  { name: 'Jan', approved: 4500, rejected: 1200, pending: 800 },
  { name: 'Feb', approved: 5200, rejected: 1500, pending: 1100 },
  { name: 'Mar', approved: 4800, rejected: 1100, pending: 950 },
  { name: 'Apr', approved: 6100, rejected: 1800, pending: 1500 },
  { name: 'May', approved: 5900, rejected: 1400, pending: 1300 },
];

const CLAIM_TYPE_DATA = [
  { name: 'Santé', value: 45, color: '#117F02' },
  { name: 'Auto', value: 25, color: '#0ea5e9' },
  { name: 'Prévoyance', value: 20, color: '#10b981' },
  { name: 'Habitation', value: 10, color: '#6366f1' },
];

const PERFORMANCE_DATA = [
  { time: '09:00', claims: 12, risk: 2 },
  { time: '12:00', claims: 45, risk: 8 },
  { time: '15:00', claims: 32, risk: 5 },
  { time: '18:00', claims: 28, risk: 4 },
];

export const Analytics: React.FC = () => {
  const [period, setPeriod] = useState('Mois');

  const exportData = (format: string) => {
    alert(`Exportation du rapport analytique au format ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic">Tableau de Bord Gestionnaire</h2>
          <p className="text-green-900/50 font-medium">Business Intelligence & Performance Analytics</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white p-1 rounded-xl border border-green-100 shadow-sm">
              {['Jour', 'Semaine', 'Mois', 'Année'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    period === p ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-slate-400 hover:text-green-600"
                  )}
                >
                  {p}
                </button>
              ))}
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={() => exportData('PDF')}
                className="p-2.5 bg-white border border-green-100 text-green-600 rounded-xl hover:bg-green-50 transition-all shadow-sm"
                title="Export PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={() => exportData('Excel')}
                className="p-2.5 bg-white border border-green-100 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
                title="Export Excel"
              >
                <FileSearch className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Sinistres Ouverts', value: '42', change: '+12%', icon: BarChart3, color: 'text-green-600', trend: 'up' },
           { label: 'Taux de Remboursement', value: '89.4%', change: '-0.5%', icon: TrendingUp, color: 'text-emerald-600', trend: 'down' },
           { label: 'Montant Approuvé', value: '450K$', change: '+24%', icon: Wallet, color: 'text-indigo-600', trend: 'up' },
           { label: 'Alertes Fraude', value: '7', change: '+3', icon: ShieldAlert, color: 'text-rose-600', trend: 'up' }
         ].map((kpi, idx) => (
           <motion.div 
             key={idx}
             whileHover={{ y: -5 }}
             className="p-6 bg-white border border-green-100 rounded-[32px] shadow-sm relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                 <kpi.icon className="w-20 h-20" />
              </div>
              <div className="relative z-10 space-y-4">
                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", kpi.color.replace('text-', 'bg-').replace('600', '100'))}>
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
                      {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3 rotate-90" />}
                      {kpi.change}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 font-mono italic">vs période précédente</span>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Main Chart: Claims Performance */}
         <div className="fluent-card p-6 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h4 className="text-sm font-black text-green-950 flex items-center gap-2 uppercase tracking-tight">
                    <Activity className="w-4 h-4 text-green-600" /> Performance des Flux
                  </h4>
                  <p className="text-[10px] font-bold text-slate-300 italic">Nombre de sinistres par catégorie (Mensuel)</p>
               </div>
               <button className="p-2 border border-green-50 rounded-lg text-green-200 hover:text-green-600 transition-colors"><Filter className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                      cursor={{ fill: '#f1fcf1' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
                    <Bar dataKey="approved" name="Approuvés" fill="#117F02" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rejected" name="Rejetés" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="En attente" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Right Column: Distribution & Sharing */}
         <div className="space-y-6">
            <div className="fluent-card p-6 flex flex-col min-h-[300px]">
               <h4 className="text-sm font-black text-green-950 mb-6 flex items-center gap-2 uppercase tracking-tight">
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
                             <span className="text-[11px] font-black text-green-950 uppercase tracking-tight">{item.name}</span>
                          </div>
                          <p className="text-[11px] font-black italic opacity-30">{item.value}%</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* API & Sharing Info Card */}
            <div className="p-6 bg-indigo-950 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Share2 className="w-16 h-16" />
               </div>
               <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl border border-indigo-400/30 flex items-center justify-center">
                           <Share2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                           <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Share & Integration API</h4>
                           <p className="text-[10px] font-medium opacity-40">Documentation OAuth 2.0 active</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black italic border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> ONLINE
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                           <Key className="w-4 h-4 text-indigo-300" />
                           <p className="text-[11px] font-bold">Gérer les Clés API (4 actives)</p>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-40" />
                     </div>
                     <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                           <TrendingUp className="w-4 h-4 text-indigo-300" />
                           <p className="text-[11px] font-bold">Logs Synchronisation Partenaires</p>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-40" />
                     </div>
                  </div>

                  <button className="w-full py-2.5 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all">
                     Ouvrir le portail développeur
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Performance Curve */}
      <div className="fluent-card p-6">
         <h4 className="text-sm font-black text-green-950 mb-10 flex items-center gap-2 uppercase tracking-tight">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Courbe de Tendance Réactivité
         </h4>
         <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={PERFORMANCE_DATA} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                  />
                  <Line type="monotone" dataKey="claims" name="Sinistres traités/h" stroke="#117F02" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                  <Line type="monotone" dataKey="risk" name="Alertes critiques" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} strokeDasharray="5 5" />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};
