/**
 * 📄 Fichier : /src/frontend/components/bi/PartnerPerformance.tsx
 * 🎯 Objectif : Evaluation et monitoring des performances partenaires.
 */
import React from 'react';
import { 
  Building2, Star, Clock, AlertCircle, 
  TrendingUp, TrendingDown, BarChart3, Search,
  Filter, Download, ChevronRight, ShieldCheck,
  CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'HJ Hospitals', delay: 12, rejection: 2, satisfaction: 9.8 },
  { name: 'Clinique Ngaliema', delay: 18, rejection: 4, satisfaction: 8.5 },
  { name: 'CMK', delay: 15, rejection: 5, satisfaction: 9.0 },
  { name: 'Hôpital Amitié', delay: 24, rejection: 8, satisfaction: 7.2 },
];

export const PartnerPerformance: React.FC = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
       {/* Global KPI Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Délai Moyen Traitement', value: '18 min', icon: Clock, color: 'green', status: 'Optimal' },
            { label: 'Taux Rejet Factures', value: '4.2%', icon: XCircle, color: 'rose', status: 'Attention (+0.5%)' },
            { label: 'Indice Satisfaction', value: '8.8/10', icon: Star, color: 'amber', status: 'Excellent' },
          ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group">
                <div className="space-y-4">
                   <div className={cn("p-4 rounded-3xl w-fit shadow-sm", `bg-${stat.color}-50`)}>
                      <stat.icon className={cn("w-6 h-6", `text-${stat.color}-600`)} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                      <span className={cn("text-[8px] font-black uppercase tracking-widest mt-2 block italic", stat.color === 'rose' ? "text-rose-500" : "text-emerald-500")}>{stat.status}</span>
                   </div>
                </div>
                <div className="w-16 h-full bg-slate-50/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Comparison Chart */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Ranking Délais & Rejets</h3>
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Comparatif Top 5 Établissements</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest underline decoration-2 decoration-green-200">Délai (min)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest underline decoration-2 decoration-rose-200">Rejet (%)</span>
                   </div>
                </div>
             </div>

             <div className="h-[350px] w-full text-[10px] font-black">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={PERFORMANCE_DATA} layout="vertical" barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900, fontStyle: 'italic' }} width={120} />
                      <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }} />
                      <Bar dataKey="delay" fill="#4ba32c" radius={[0, 10, 10, 0]} barSize={20} />
                      <Bar dataKey="rejection" fill="#f43f5e" radius={[0, 10, 10, 0]} barSize={10} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Audit & Compliance Status */}
          <div className="space-y-8">
             <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-6">
                   <div className="p-4 bg-white/10 rounded-[28px] w-fit border border-white/20">
                      <BarChart3 className="w-8 h-8 text-white" />
                   </div>
                   <h4 className="text-xl font-black italic tracking-tighter uppercase">Rapport de Compliance</h4>
                   <p className="text-xs font-bold text-white/50 leading-relaxed italic">
                      Évaluation trimestrielle du respect des barèmes conventionnés et des standards de soins.
                   </p>
                </div>
                <div className="space-y-4 mt-8 relative z-10">
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest italic">
                      <span className="text-white/40 italic">Global Score</span>
                      <span className="text-emerald-400">A++ / 92%</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
                   </div>
                </div>
                <button className="w-full mt-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-widest relative z-10 hover:scale-[1.02] transition-all">
                   Détails par Prestataire
                </button>
             </div>

             <div className="p-8 bg-white border border-slate-100 rounded-[48px] shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center border border-slate-100 shrink-0">
                   <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>
                <div>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Litiges Partenaires</h4>
                   <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">
                      <span className="text-rose-600">3 Litiges Critiques</span><br/>
                      en attente de médiation
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
