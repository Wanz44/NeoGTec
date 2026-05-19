/**
 * 📄 Fichier : /src/frontend/components/partners/QualityControl.tsx
 * 🎯 Objectif : Evaluation de la qualité des prestations et satisfaction patients.
 */
import React from 'react';
import { 
  Star, ThumbsUp, ThumbsDown, MessageSquare, 
  TrendingUp, Activity, Clock, ShieldCheck, 
  Users, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const QualityControl: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Risk & Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Score Moyen Satisfaction', value: '4.6/5', icon: Star, color: 'amber' },
           { label: 'Délai Prise en Charge', value: '18 min', icon: Clock, color: 'blue' },
           { label: 'Taux de Litiges', value: '1.2%', icon: AlertTriangle, color: 'rose' },
           { label: 'Patients Traités', value: '4.2K', icon: Users, color: 'emerald' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className={cn("p-3 rounded-2xl w-fit mb-4 shadow-sm", `bg-${stat.color}-50`)}>
                 <stat.icon className={cn("w-5 h-5", `text-${stat.color}-600`)} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
              <div className="flex items-center gap-1 mt-3">
                 <TrendingUp className="w-3 h-3 text-emerald-500" />
                 <span className="text-[8px] font-black text-emerald-500 uppercase">+2.5% vs semaine dernière</span>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Performing Providers */}
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
               <h3 className="text-sm font-black text-slate-900 uppercase italic">Top 5 Prestataires (Qualité)</h3>
               <button className="text-[10px] font-black text-indigo-600 uppercase italic underline">Tout voir</button>
            </div>
            <div className="p-4 space-y-3 flex-1">
               {[
                 { name: 'HJ Hospitals', score: 4.9, patients: 1240, status: 'Elite' },
                 { name: 'Clinique Ngaliema', score: 4.7, patients: 850, status: 'Gold' },
                 { name: 'Hôpital de l\'Amitié', score: 4.5, patients: 2100, status: 'Silver' },
                 { name: 'CMK Kinshasa', score: 4.4, patients: 620, status: 'Silver' },
                 { name: 'Pédiatrie Kalembe Lembe', score: 4.2, patients: 1540, status: 'Bronze' },
               ].map((p, i) => (
                 <div key={i} className="group p-4 bg-slate-50/50 rounded-[2rem] border border-slate-50 flex items-center justify-between hover:bg-white hover:shadow-xl hover:border-slate-100 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs italic">
                          #{i+1}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 uppercase italic">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <div className="flex">
                                {[...Array(5)].map((_, idx) => (
                                  <Star key={idx} className={cn("w-2.5 h-2.5", idx < Math.floor(p.score) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                ))}
                             </div>
                             <span className="text-[9px] font-bold text-slate-400">{p.patients} Patients</span>
                          </div>
                       </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase italic tracking-tighter",
                      p.status === 'Elite' ? "bg-indigo-600 text-white" : 
                      p.status === 'Gold' ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"
                    )}>
                       {p.status}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Patient Feedback & Surveys */}
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[80px] -z-10 group-hover:scale-110 transition-transform" />
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-950 rounded-2xl">
                        <MessageSquare className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="text-lg font-black text-slate-900 italic tracking-tight">Derniers Retours Patients</h4>
                  </div>
                  <div className="space-y-4">
                     {[
                       { user: 'Benoit L.', comment: 'Très bonne prise en charge à HJ Hospitals.', sentiment: 'positive', hotel: 'HJ Hospitals' },
                       { user: 'Sarl Omega', comment: 'Temps d\'attente un peu long aux urgences de Ngaliema.', sentiment: 'neutral', hotel: 'Clinique Ngaliema' },
                     ].map((feedback, i) => (
                       <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 space-y-2">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-900 uppercase italic">{feedback.user}</span>
                             <div className="flex items-center gap-1">
                                {feedback.sentiment === 'positive' ? <ThumbsUp className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
                             </div>
                          </div>
                          <p className="text-[11px] text-slate-400 italic">"{feedback.comment}"</p>
                          <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-2">{feedback.hotel}</p>
                       </div>
                     ))}
                  </div>
               </div>
               <button className="w-full mt-8 py-3 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                  Lancer une Enquête Satisfaction <Star className="w-3 h-3" />
               </button>
            </div>

            <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-500/20 flex items-center justify-between gap-6 group overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
               <div className="relative z-10">
                  <h4 className="text-lg font-black italic tracking-tighter">Certification Qualité AfreakCare</h4>
                  <p className="text-xs text-white/60 mt-2 italic leading-relaxed">
                    Le label "AfreakCare Quality Certified" est accordé aux prestataires avec un score {'>'} 4.5
                  </p>
               </div>
               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white/10 shrink-0 relative z-10 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-white" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
