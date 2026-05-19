/**
 * 📄 Fichier : /src/frontend/components/claims/WorkflowManager.tsx
 * 🎯 Objectif : Suivi des étapes de traitement des sinistres et attribution.
 */
import React from 'react';
import { 
  GitPullRequest, UserCheck, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Play, Pause,
  Search, Filter, ArrowUpRight, ShieldCheck,
  Activity, Users
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const WorkflowManager: React.FC = () => {
  const currentTasks = [
    { id: 'T-101', claim: 'CLM-0015', type: 'Attribution', assignee: 'Jean Dupont', priority: 'Haute', time: '14m restants' },
    { id: 'T-102', claim: 'CLM-0122', type: 'Vérification Pièces', assignee: 'Marie K.', priority: 'Normale', time: '1h 20m restants' },
    { id: 'T-103', claim: 'CLM-0154', type: 'Approbation Finale', assignee: 'Dr. Mukendi', priority: 'Haute', time: '2m restants' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'File d\'attente', value: '42', color: 'green', icon: Activity },
            { label: 'En cours', value: '18', color: 'amber', icon: Clock },
            { label: 'Traités aujourd\'hui', value: '124', color: 'emerald', icon: CheckCircle2 },
            { label: 'SLA Moyen', value: '2.4h', color: 'slate', icon: ShieldCheck },
          ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><stat.icon className="w-12 h-12" /></div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-2 italic">{stat.value}</p>
             </div>
          ))}
       </div>

       <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-950 rounded-2xl flex items-center justify-center">
                   <GitPullRequest className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase italic">Pipeline de Traitement</h3>
                   <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Attribution automatique temps réel</p>
                </div>
             </div>
             <div className="flex gap-4">
                <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all italic">Actions Groupées</button>
             </div>
          </div>
          
          <div className="p-4 space-y-4">
             {currentTasks.map((task) => (
                <div key={task.id} className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 hover:bg-white hover:shadow-xl hover:border-slate-100 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-8">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-green-600 uppercase italic leading-none mb-1">{task.type}</span>
                         <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{task.claim}</span>
                      </div>
                      <div className="h-10 w-px bg-slate-200/50" />
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-full border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                            {task.assignee.charAt(0)}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-900 uppercase italic">{task.assignee}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestionnaire</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-12">
                      <div className="flex flex-col text-right">
                         <span className="text-[9px] font-black text-rose-500 uppercase italic leading-none mb-1">{task.priority} Priority</span>
                         <div className="flex items-center gap-2 justify-end text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-bold italic">{task.time}</span>
                         </div>
                      </div>
                      <button className="p-4 bg-white text-slate-900 rounded-2xl border border-slate-100 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                         <Play className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="p-10 bg-green-600 rounded-[56px] text-white flex items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 flex-1">
             <h4 className="text-xl font-black italic tracking-tighter uppercase leading-tight mb-2">Algorithme d'Attribution Intelligente</h4>
             <p className="text-xs font-bold text-green-100/60 leading-relaxed italic max-w-lg">
                Le système balance automatiquement la charge de travail entre vos gestionnaires en fonction de leur expertise et disponibilité.
             </p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Statut Load-Balancer</p>
                <p className="text-[11px] font-black uppercase italic tracking-widest">Optimisé (98%)</p>
             </div>
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                <Users className="w-6 h-6" />
             </div>
          </div>
       </div>
    </div>
  );
};
