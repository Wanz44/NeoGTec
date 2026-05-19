/**
 * 📄 Fichier : /src/frontend/components/bi/GlobalActivity.tsx
 * 🎯 Objectif : Pilotage de l'activité globale (Assurés, contrats, pénétration).
 */
import React from 'react';
import { 
  Users, UserPlus, TrendingUp, Globe, 
  MapPin, ShieldCheck, Activity, Target,
  ArrowUpRight, BarChart3, PieChartIcon, Search
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';

const GROWTH_DATA = [
  { month: 'Jan', active: 15400, new: 1200 },
  { month: 'Feb', active: 16800, new: 1400 },
  { month: 'Mar', active: 18900, new: 2100 },
  { month: 'Apr', active: 22400, new: 3500 },
  { month: 'May', active: 28500, new: 6100 },
];

const PENETRATION_BY_ZONE = [
  { name: 'Gombe', value: 45, color: '#4ba32c' },
  { name: 'Ngaliema', value: 25, color: '#10b981' },
  { name: 'Limete', value: 15, color: '#f59e0b' },
  { name: 'Kalamu', value: 15, color: '#64748b' },
];

export const GlobalActivity: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
       {/* High Level Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Assurés Actifs', value: '28,500', icon: Users, color: 'green', growth: '+24%' },
            { label: 'Nouveaux (Mois)', value: '6,100', icon: UserPlus, color: 'emerald', growth: '+112%' },
            { label: 'Taux Pénétration', value: '18.2%', icon: Target, color: 'amber', growth: '+2.1%' },
            { label: 'Score Fidélité', value: '94.5%', icon: ShieldCheck, color: 'slate', growth: 'Stable' },
          ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[60px] -z-10 group-hover:scale-110 transition-transform" />
                <div className={cn("p-4 rounded-3xl w-fit mb-5 shadow-sm", `bg-${stat.color}-50`)}>
                   <stat.icon className={cn("w-6 h-6", `text-${stat.color}-600`)} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">{stat.label}</p>
                <div className="flex items-end gap-3">
                   <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                   <span className={cn("text-[9px] font-black italic mb-1", stat.growth.startsWith('+') ? "text-emerald-500" : "text-slate-300")}>{stat.growth}</span>
                </div>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Growth Chart */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Courbe de Croissance</h3>
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Actifs vs Nouveaux Contrats</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Actifs</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-100" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Nouveaux</span>
                   </div>
                </div>
             </div>

             <div className="h-[350px] w-full text-[10px] font-black">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={GROWTH_DATA}>
                      <defs>
                         <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }} />
                      <Area type="monotone" dataKey="active" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorActive)" />
                      <Area type="monotone" dataKey="new" stroke="#e0e7ff" strokeWidth={2} fill="transparent" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Geographical Distribution */}
          <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl flex flex-col justify-between group overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="relative z-10">
                <h4 className="text-sm font-black italic tracking-tighter uppercase mb-8">Pénétration par Zone</h4>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={PENETRATION_BY_ZONE} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                            {PENETRATION_BY_ZONE.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                         </Pie>
                         <Tooltip />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-8">
                   {PENETRATION_BY_ZONE.map(zone => (
                      <div key={zone.name} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{zone.name}</span>
                         </div>
                         <span className="text-[10px] font-black italic text-white/40">{zone.value}%</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {/* Map View Integration Indicator */}
       <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-sm flex items-center justify-between gap-10">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center border border-indigo-100 shadow-sm">
                <Globe className="w-10 h-10 text-indigo-600" />
             </div>
             <div className="space-y-2">
                <h4 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase">Cartographie Interactive</h4>
                <p className="text-xs font-bold text-slate-400 italic italic leading-relaxed">
                   Visualisez la densité d'assurés en temps réel sur la carte de Kinshasa et identifiez les zones blanches.
                </p>
             </div>
          </div>
          <button className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
             Ouvrir la Map BI
          </button>
       </div>
    </div>
  );
};
