import React from 'react';
import { 
  History as HistoryIcon, ShieldCheck, FileText, Download, TrendingUp, 
  Wallet, User, Activity, AlertCircle, Sparkles, 
  ArrowRight, Globe, Lock, Info 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const SelfCarePortal: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative p-8 bg-green-950 rounded-[40px] overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-3xl border-4 border-white/10 overflow-hidden ring-8 ring-white/5">
               <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                  <User className="w-12 h-12" />
               </div>
            </div>
            <div className="flex-1 space-y-2">
               <h1 className="text-3xl font-black text-white italic tracking-tighter">Bienvenue, Adonaï.</h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                     <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Compte Premium</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full backdrop-blur-md border border-green-500/20">
                     <Activity className="w-3.5 h-3.5 text-green-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Statut : Actif</span>
                  </div>
               </div>
            </div>
            <button className="px-8 py-3 bg-white text-green-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
               Voir Ma Carte Virtuelle
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* My Rights & Limits */}
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="p-2 bg-green-50 rounded-xl">
                        <Wallet className="w-5 h-5 text-green-600" />
                     </div>
                     <span className="text-[10px] font-black text-slate-300 uppercase italic">Limite Annuelle</span>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Consommation du Plafond</p>
                     <div className="flex justify-between items-end mb-2">
                        <h4 className="text-2xl font-black text-slate-900">4,250 <span className="text-xs">$</span></h4>
                        <span className="text-sm font-black text-slate-300">/ 15,000 $</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full w-[28%]" />
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4 text-center">
                  <div className="flex items-center justify-center p-3 bg-amber-50 rounded-2xl w-fit mx-auto">
                     <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 italic">Offres Exclusives</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vous avez 2 bilans gratuits</p>
                  </div>
                  <button className="w-full py-2.5 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                     En profiter <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { label: 'Attestations', icon: FileText, color: 'green' },
                  { label: 'Remboursements', icon: HistoryIcon, color: 'emerald' },
                  { label: 'Urgences', icon: AlertCircle, color: 'rose' },
                  { label: 'Téléchargements', icon: Download, color: 'green' },
               ].map((item, i) => (
                  <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-50 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all group">
                     <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", `bg-${item.color}-50`)}>
                        <item.icon className={cn("w-6 h-6", `text-${item.color}-600`)} />
                     </div>
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</span>
                  </button>
               ))}
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h4 className="text-sm font-black text-slate-900 uppercase italic">Activités Récentes</h4>
                  <button className="text-[10px] font-black text-green-600 uppercase italic underline">Tout voir</button>
               </div>
               <div className="divide-y divide-slate-50">
                  {[
                     { desc: 'Consultation Clinique HJ', date: 'Hier, 14:20', amount: '-45.00 $', type: 'Health' },
                     { desc: 'Facture Pharm. Centrale', date: '15 Mai 2026', amount: '-12.50 $', type: 'Med' },
                     { desc: 'Avoir Remboursement', date: '10 Mai 2026', amount: '+250.00 $', type: 'Refund' },
                  ].map((act, i) => (
                     <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-slate-400">
                              {act.type[0]}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900">{act.desc}</p>
                              <p className="text-[10px] font-bold text-slate-400">{act.date}</p>
                           </div>
                        </div>
                        <span className={cn("text-sm font-black", act.amount.startsWith('+') ? "text-emerald-500" : "text-slate-900")}>
                           {act.amount}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar: Digital Services */}
          <div className="space-y-6">
            <div className="p-6 bg-green-600 rounded-[2.5rem] text-white shadow-xl shadow-green-600/20 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10 space-y-4">
                  <div className="p-3 bg-white/10 rounded-2xl w-fit border border-white/20">
                     <Lock className="w-6 h-6 text-green-200" />
                  </div>
                  <div>
                     <h4 className="text-xl font-black italic tracking-tighter">Accès Sécurisé</h4>
                     <p className="text-xs font-bold text-white/50 leading-relaxed mt-2 italic">Activez la biométrie faciale pour une sécurité maximale sur vos dossiers médicaux.</p>
                  </div>
                  <button className="w-full py-3 bg-white text-green-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all shadow-lg">
                     Configurer
                  </button>
               </div>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6 text-center">
               <div className="w-20 h-20 bg-white shadow-xl rounded-2xl mx-auto flex items-center justify-center">
                  <Globe className="w-10 h-10 text-slate-900" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">Assistance 24/7</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Agents disponibles partout dans le monde</p>
               </div>
               <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:border-slate-300 transition-all">
                  Ouvrir un Chat
               </button>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center gap-4">
               <Info className="w-10 h-10 text-green-600/20 shrink-0" />
               <p className="text-[9px] font-bold text-slate-400 leading-relaxed italic uppercase">
                  Vos informations sont protégées par le standard de sécurité des données de santé HDS/GDPR.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
