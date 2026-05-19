/**
 * 📄 Fichier : /src/frontend/components/UsersLogs.tsx
 * 🎯 Objectif : Journalisation des évènements, Audits et Surveillance des activités critiques.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, ShieldAlert, CheckCircle2, AlertTriangle, 
  Search, Filter, Download, Terminal, Eye,
  Clock, User, RefreshCw, Layers, Lock,
  ChevronRight, Calendar, MoreVertical
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  severity: 'Info' | 'Attention' | 'Critique';
  ip: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id: 'LOG-4491', timestamp: '15/05/2024 14:32:01', user: 'Admin_Juan', action: 'Suppression Contrat #C-2291', module: 'Contrats', severity: 'Critique', ip: '41.242.100.2' },
  { id: 'LOG-4490', timestamp: '15/05/2024 14:30:45', user: 'System', action: 'Sauvegarde automatique réussie', module: 'Système', severity: 'Info', ip: '127.0.0.1' },
  { id: 'LOG-4489', timestamp: '15/05/2024 14:28:12', user: 'Guest_992', action: 'Échec tentative de connexion', module: 'Sécurité', severity: 'Attention', ip: '89.14.22.104' },
  { id: 'LOG-4488', timestamp: '15/05/2024 14:25:30', user: 'Sarah_Manager', action: 'Modification barème tarifaire', module: 'Tarification', severity: 'Attention', ip: '41.242.100.2' },
];

export const UsersLogs: React.FC = () => {
  const [filter, setFilter] = useState<string>('Tous');

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-orange-950 tracking-tight italic flex items-center gap-3">
                Audit & Logs <History className="w-8 h-8 text-orange-500 fill-orange-500/10" />
             </h2>
             <p className="text-orange-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-orange-200 underline-offset-4 decoration-2">Journal d'Évènements, Monitoring Critique & Traçabilité</p>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-white border border-orange-200 text-orange-600 px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-sm">
                <Download className="w-4 h-4" /> Exporter (.CSV)
             </button>
             <button className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-105 transition-all border border-orange-700">
                <RefreshCw className="w-4 h-4" /> Actualiser
             </button>
          </div>
       </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Connexions', val: '1,420', icon: User, color: 'text-indigo-600' },
            { label: 'Erreurs Système', val: '12', icon: AlertTriangle, color: 'text-rose-600' },
            { label: 'Actions d\'Audit', val: '48', icon: History, color: 'text-orange-600' },
            { label: 'Tps de réponse', val: '12ms', icon: Clock, color: 'text-emerald-600' },
          ].map((stat, i) => (
             <div key={i} className="fluent-card p-6 flex flex-col justify-between rounded-lg border border-orange-200 bg-white shadow-sm">
                <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-black text-orange-950">{stat.val}</p>
                </div>
             </div>
          ))}
       </div>

       {/* Main Logs Area */}
       <div className="fluent-card p-0 overflow-hidden rounded-lg border border-orange-200 shadow-sm">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
             <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-orange-100 shadow-inner">
                {['Tous', 'Info', 'Attention', 'Critique'].map((s) => (
                   <button
                     key={s}
                     onClick={() => setFilter(s)}
                     className={cn(
                       "px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all",
                       filter === s ? "bg-white text-orange-600 shadow-sm border border-orange-100" : "text-slate-400 hover:text-orange-600"
                     )}
                   >
                      {s}
                   </button>
                ))}
             </div>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" placeholder="Filtrer les journaux..." className="pl-10 pr-4 py-2 text-xs bg-slate-50 border border-orange-200 rounded-md outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm" />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-50">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horodatage</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Évènement</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sévérité</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {MOCK_LOGS.filter(l => filter === 'Tous' || l.severity === filter).map((log) => (
                      <tr key={log.id} className="group hover:bg-orange-50/30 transition-all">
                         <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-[10px] font-black text-orange-950">{log.timestamp}</p>
                            <span className="text-[8px] font-mono text-slate-300 font-bold uppercase">{log.ip}</span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><User className="w-3.5 h-3.5" /></div>
                               <span className="text-[10px] font-bold text-slate-700 uppercase">{log.user}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-[11px] font-medium text-slate-600 italic leading-tight">{log.action}</p>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase italic">{log.module}</span>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block min-w-[60px]",
                              log.severity === 'Info' ? "bg-emerald-100 text-emerald-600" : log.severity === 'Attention' ? "bg-orange-100 text-orange-600" : "bg-rose-100 text-rose-600"
                            )}>
                               {log.severity}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-200 group-hover:text-orange-600 transition-colors"><Eye className="w-4 h-4" /></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-all flex items-center justify-center gap-2 mx-auto">
                Afficher les archives plus anciennes <ChevronRight className="w-4 h-4" />
             </button>
          </div>
       </div>

       {/* Security Summary & AI Insights */}
       <div className="p-8 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border border-slate-700 shadow-2xl">
          <div className="absolute right-0 top-0 p-8 opacity-5">
             <Layers className="w-40 h-40" />
          </div>
          <div className="max-w-md relative z-10">
             <h4 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                Rapport d'Audit Automatique <ShieldAlert className="w-6 h-6 text-orange-400" />
             </h4>
             <p className="text-xs font-medium text-slate-400 leading-relaxed italic">Intelligence Artificielle en scan constant pour identifier les comportements récurrents malveillants ou les fuites de privilèges.</p>
          </div>
          <div className="flex gap-4 relative z-10">
             <button className="px-6 py-3 bg-white text-slate-950 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/5 border border-slate-200">Générer Rapport Audit</button>
             <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Analyse SOC 2</button>
          </div>
       </div>
    </div>
  );
};
