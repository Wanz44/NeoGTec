/**
 * 📄 Fichier : /src/frontend/components/integrations/TeleConsultHub.tsx
 * 🎯 Objectif : Intégration avec AfyaLink et services de téléconsultation.
 */
import React from 'react';
import { 
  Video, Phone, MessageSquare, ShieldCheck, 
  ArrowUpRight, Users, Clock,
  Search, Filter, Play, CheckCircle2,
  Lock, Activity, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const TeleConsultHub: React.FC = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-emerald-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:scale-105 transition-transform rotate-3">
                <Video className="w-10 h-10 text-white" />
             </div>
             <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Plateforme Télésanté</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Connecteur Natif AfyaLink SDK</p>
             </div>
          </div>
          <div className="flex gap-4">
             <button className="px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all italic">Lancer Session AfyaLink</button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm space-y-8 group transition-all hover:shadow-2xl">
                   <div className="flex justify-between items-start">
                      <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100">
                         <Users className="w-8 h-8 text-indigo-600" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 italic uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Actif</span>
                   </div>
                   <div>
                      <h4 className="text-xl font-black italic tracking-tighter uppercase text-slate-900">Synchronisation Patient</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-2 italic leading-relaxed">Accédez à l'historique médical complet pendant la consultation vidéo.</p>
                   </div>
                   <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Dernière Sync: il y a 2m</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm space-y-8 group transition-all hover:shadow-2xl">
                   <div className="flex justify-between items-start">
                      <div className="p-4 bg-rose-50 rounded-3xl border border-rose-100">
                         <Activity className="w-8 h-8 text-rose-600" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 italic uppercase">IDLE</span>
                   </div>
                   <div>
                      <h4 className="text-xl font-black italic tracking-tighter uppercase text-slate-900">Signes Vitaux IoT</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-2 italic leading-relaxed">Intégration d'objets connectés (Tensiomètres, Glucomètres AfyaLink).</p>
                   </div>
                   <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <button className="text-[9px] font-black text-rose-600 uppercase tracking-widest italic hover:underline">Appairer Dispositif</button>
                   </div>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black text-slate-900 uppercase italic">File d'attente Télémédecine</h3>
                   <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                         <Clock className="w-3 h-3" /> Attente Moy : 8 min
                      </div>
                   </div>
                </div>
                <div className="divide-y divide-slate-50">
                   {[
                     { patient: 'Mama Sarah', dr: 'Dr. Mukendi', time: 'En cours', type: 'Video' },
                     { patient: 'Jean-Paul K.', dr: 'Dr. Ilunga', time: '14:30', type: 'Audio' }
                   ].map((call, i) => (
                      <div key={i} className="py-6 flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-all">
                               {call.type === 'Video' ? <Video className="w-6 h-6 text-indigo-400" /> : <Phone className="w-6 h-6 text-indigo-400" />}
                            </div>
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase italic">{call.patient}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{call.dr}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-8">
                            <span className={cn(
                               "text-[10px] font-black uppercase italic tracking-widest",
                               call.time === 'En cours' ? "text-emerald-500" : "text-slate-400"
                            )}>
                               {call.time}
                            </span>
                            <button className="p-3 bg-slate-950 text-white rounded-xl shadow-xl hover:scale-110 transition-all"><Play className="w-4 h-4 fill-white" /></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="p-10 bg-indigo-600 rounded-[64px] text-white shadow-2xl space-y-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="space-y-6 relative z-10">
                   <div className="p-5 bg-white/10 rounded-[32px] w-fit border border-white/20">
                      <Zap className="w-10 h-10 text-white" />
                   </div>
                   <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Crédit Téléconsult</h4>
                   <p className="text-4xl font-black italic tracking-widest">425 <span className="text-[10px] text-white/30 uppercase tracking-widest italic align-middle ml-2">Sessions Libres</span></p>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
                   <div className="w-[72%] h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
                </div>
                <button className="w-full py-5 bg-indigo-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all relative z-10 border border-white/5">Recharger</button>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[64px] shadow-sm flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100 group-hover:rotate-12 transition-transform">
                   <Lock className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="space-y-4">
                   <h4 className="text-sm font-black text-slate-900 uppercase italic">Vie Privée & Sécurité</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">
                      Conversations cryptées de bout en bout.<br/>
                      Aucun stockage vidéo sur nos serveurs.
                   </p>
                   <div className="flex border-t border-slate-50 pt-4 gap-4">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] italic">Conformité RGPD / ARCA</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
