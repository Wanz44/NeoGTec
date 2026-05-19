/**
 * 📄 Fichier : /src/frontend/components/bi/CostForecasting.tsx
 * 🎯 Objectif : Prévisions, modélisation des coûts futurs et simulations.
 */
import React from 'react';
import { 
  TrendingUp, BarChart, Zap, Target, 
  ArrowRight, ShieldCheck, Activity, LineChart as ChartIcon,
  Search, Filter, Download, Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const FORECAST_DATA = [
  { month: 'Jun', current: 125000, projected: 125000 },
  { month: 'Jul', current: null, projected: 138000 },
  { month: 'Aug', current: null, projected: 145000 },
  { month: 'Sep', current: null, projected: 162000 },
  { month: 'Oct', current: null, projected: 158000 },
  { month: 'Nov', current: null, projected: 175000 },
];

export const CostForecasting: React.FC = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-green-950 rounded-[32px] flex items-center justify-center shadow-2xl shadow-green-900/40">
                <Zap className="w-8 h-8 text-white" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Prévisions & Simulations</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Modélisation Actuarielle Intelligence IA</p>
             </div>
          </div>
          <button className="px-10 py-5 bg-green-600 text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-green-600/20 hover:scale-105 transition-all">
             Lancer Nouveau Scénario
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Forecasting Graph */}
          <div className="lg:col-span-3 bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm space-y-12">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Projection Prochain Semestre</h3>
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Modèle de Coût : Linéaire + Tendance Santé</p>
                </div>
                <div className="flex gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Réel</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Simulé</span>
                   </div>
                </div>
             </div>

             <div className="h-[400px] w-full text-[10px] font-black">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={FORECAST_DATA}>
                      <defs>
                         <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                      <Tooltip contentStyle={{ borderRadius: '32px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }} />
                      <Area type="monotone" dataKey="projected" stroke="#f43f5e" strokeWidth={5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
                      <Area type="monotone" dataKey="current" stroke="#4f46e5" strokeWidth={5} fill="transparent" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Simulation Tools */}
          <div className="space-y-8">
             <div className="bg-slate-950 p-10 rounded-[56px] text-white shadow-2xl space-y-10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="space-y-6 relative z-10">
                   <div className="p-5 bg-white/10 rounded-[32px] w-fit border border-white/20">
                      <Target className="w-10 h-10 text-white" />
                   </div>
                   <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Simulation Rentabilité</h4>
                   <p className="text-xs font-bold text-white/40 italic leading-relaxed">
                      Ajustez les primes ou les plafonds pour voir l'impact immédiat sur votre marge nette.
                   </p>
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30">
                         <span>Variation Primes</span>
                         <span className="text-emerald-400">+15%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="w-[65%] h-full bg-emerald-500" />
                      </div>
                   </div>
                   <button className="w-full py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/5">
                      Générer Rapport
                   </button>
                </div>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[56px] shadow-sm flex flex-col gap-6 text-center group">
                <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto border border-green-100 group-hover:rotate-12 transition-transform">
                   <ChartIcon className="w-10 h-10 text-green-600" />
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-900 uppercase italic">Analyse de Cohorte</h4>
                   <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-relaxed italic">
                      Performance par segment démographique et zone géographique.
                   </p>
                </div>
                <button className="text-green-600 text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 hover:underline">
                   Voir les Détails <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
