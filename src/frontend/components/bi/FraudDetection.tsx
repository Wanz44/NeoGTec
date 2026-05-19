/**
 * 📄 Fichier : /src/frontend/components/bi/FraudDetection.tsx
 * 🎯 Objectif : Intelligence artificielle pour la détection de fraude et anomalies.
 */
import React from 'react';
import { 
  ShieldAlert, AlertTriangle, Fingerprint, Eye, 
  RotateCcw, ShieldCheck, Zap, History,
  Search, Filter, ChevronRight, MessageSquare,
  Lock, TrendingUp, Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const FraudDetection: React.FC = () => {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
       {/* Security Banner */}
       <div className="p-10 bg-rose-600 rounded-[48px] text-white shadow-2xl relative overflow-hidden group border border-rose-700">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="flex items-center gap-10 relative z-10 w-full">
             <div className="w-24 h-24 bg-white/20 rounded-[32px] border border-white/20 flex items-center justify-center ring-8 ring-white/5 shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                <ShieldAlert className="w-12 h-12 text-white" />
             </div>
             <div className="flex-1 space-y-3">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Neural Fraud Detection</h2>
                <p className="text-sm font-bold text-white/70 italic leading-relaxed max-w-xl">
                   Le moteur IA analyse les schémas de consommation pour identifier les abus, les doublons de facturation et les usurpations d'identité en temps réel.
                </p>
                <div className="flex items-center gap-4 py-1.5 px-4 bg-white/10 rounded-full border border-white/10 w-fit">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em]">Système de Protection Actif</span>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <button className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                   Audit Global
                </button>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Alerts List */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Alertes Critiques en Cours</h3>
                <span className="text-[9px] font-black text-rose-500 uppercase italic tracking-widest bg-rose-50 px-3 py-1 rounded-full">12 Non Traitées</span>
             </div>
             
             <div className="space-y-4">
                {[
                  { id: 'AL-9901', type: 'Doublon Facturation', target: 'Clinique ProSanté', risk: 'Haut', amount: '850.00 $', time: 'Il y a 14 min' },
                  { id: 'AL-9902', type: 'Usage Hors-Zone', target: 'M. Jean Mukendi', risk: 'Moyen', amount: '12.50 $', time: 'Il y a 45 min' },
                  { id: 'AL-9903', type: 'Prescription Atypique', target: 'Pharmacie Centrale', risk: 'Critique', amount: '2,400.00 $', time: 'Il y a 2h' },
                  { id: 'AL-9904', type: 'Usurpation ID', target: 'Inconnu (Bio-Check Failed)', risk: 'Critique', amount: '-', time: 'Il y a 3h' },
                ].map((alert, i) => (
                   <div key={i} className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-rose-100 transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center font-black italic shadow-sm relative",
                           alert.risk === 'Critique' ? "bg-rose-950 text-white" : "bg-rose-50 text-rose-600"
                         )}>
                            {alert.risk === 'Critique' ? '!' : '?'}
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{alert.type}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{alert.target} • {alert.time}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-900 uppercase italic">{alert.amount}</p>
                            <span className={cn(
                               "text-[8px] font-black uppercase tracking-[0.2em] italic mt-1 block",
                               alert.risk === 'Critique' ? "text-rose-600" : "text-amber-500"
                            )}>Risque {alert.risk}</span>
                         </div>
                         <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                            <Eye className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Right Sidebar: AI Performance */}
          <div className="space-y-8">
             <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl space-y-10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                   <Zap className="w-32 h-32" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="p-4 bg-white/10 rounded-3xl w-fit border border-white/20 shadow-xl">
                      <Fingerprint className="w-8 h-8 text-white" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black italic tracking-tighter uppercase">Pertes Évitées</h4>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1 italic">Mois de Mai 2024</p>
                   </div>
                   <p className="text-4xl font-black tracking-widest">85.4k <span className="text-xs font-bold italic">$</span></p>
                </div>
                <div className="space-y-4 relative z-10">
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[78%] h-full bg-emerald-500 rounded-full" />
                   </div>
                   <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] italic">78% de précision neural</p>
                </div>
             </div>

             <div className="p-8 bg-white border border-slate-100 rounded-[48px] shadow-sm flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center border border-indigo-100 group-hover:rotate-12 transition-transform">
                   <Lock className="w-10 h-10 text-indigo-600" />
                </div>
                <div>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Analyse Identité</h4>
                   <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] leading-relaxed">
                      Bio-Match Score global:<br/>
                      <span className="text-emerald-500 font-black">99.2%</span>
                   </p>
                </div>
                <button className="w-full py-4 border border-slate-200 text-slate-950 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                   Gérer les Blacklists
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
