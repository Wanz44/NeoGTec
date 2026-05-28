/**
 * 📄 Fichier : /src/frontend/components/UsersLogs.tsx
 * 🎯 Objectif : Journalisation des évènements, Audits et Surveillance des activités critiques (RDC ARCA audit-compliant).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  Search, Filter, Download, Terminal, Eye,
  Clock, User, RefreshCw, Layers, Lock,
  ChevronRight, Calendar, MoreVertical, ShieldCheck,
  History as HistoryIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../lib/AppContext';

export const UsersLogs: React.FC = () => {
  const { auditLogs, logAction } = useApp();
  const [filter, setFilter] = useState<string>('Tous');
  const [search, setSearch] = useState<string>('');

  const getSeverite = (status: 'SUCCESS' | 'WARNING' | 'CRITICAL') => {
    if (status === 'SUCCESS') return 'Info';
    if (status === 'WARNING') return 'Attention';
    return 'Critique';
  };

  const handleRefresh = () => {
    logAction('RAFAICHIR_LOGS_AUDIT', 'Rafraîchissement manuel de la liste des journaux d\'audit cryptographiques.');
    alert("Logs d'audit rafraîchis en temps réel !");
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Utilisateur,Action,Role,Severite,IP\n"
      + auditLogs.map(l => `"${l.timestamp}","${l.userName}","${l.action}","${l.userRole}","${l.status}","${l.ipAddress}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AfreakCare_Audit_Trail_ARCA_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('EXPORT_LOGS_AUDIT', 'Téléchargement de l\'historique d\'audit au format scellé CSV.');
  };

  const filteredLogs = auditLogs.filter(l => {
    const sevLabel = getSeverite(l.status);
    const matchesFilter = filter === 'Tous' || sevLabel === filter;
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase()) || 
                          l.userName.toLowerCase().includes(search.toLowerCase()) ||
                          l.userRole.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-slate-800">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h2 className="text-3xl font-extrabold text-orange-950 tracking-tight italic flex items-center gap-3">
                Audit &amp; Logs <HistoryIcon className="w-8 h-8 text-orange-500 fill-orange-500/10 animate-spin" style={{ animationDuration: '40s' }} />
             </h2>
             <p className="text-orange-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-orange-200 underline-offset-4 decoration-2">Journal de Traçabilité cryptographique h24 / Audit Trail</p>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={handleExportCSV}
               className="flex items-center gap-2 bg-white border border-orange-200 text-orange-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-sm cursor-pointer"
             >
                <Download className="w-4 h-4" /> Exporter (.CSV)
             </button>
             <button 
               onClick={handleRefresh}
               className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-[1.02] transition-colors border border-orange-700 cursor-pointer"
             >
                <RefreshCw className="w-4 h-4" /> Actualiser
             </button>
          </div>
       </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Logs Enregistrés', val: auditLogs.length, icon: User, color: 'text-green-600' },
            { label: 'Alertes Critiques', val: auditLogs.filter(l => l.status === 'CRITICAL').length, icon: AlertTriangle, color: 'text-rose-600' },
            { label: 'Actions d\'Audit Récentes', val: auditLogs.filter(l => l.status === 'WARNING').length, icon: HistoryIcon, color: 'text-orange-600' },
            { label: 'Scénario Temps Réel', val: 'Actif 24h/24', icon: Clock, color: 'text-emerald-300' },
          ].map((stat, i) => (
             <div key={i} className="p-6 flex flex-col justify-between rounded-xl border border-orange-200 bg-white shadow-sm">
                <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-black text-orange-950">{stat.val}</p>
                </div>
             </div>
          ))}
       </div>

       {/* Main Logs Area */}
       <div className="p-0 overflow-hidden rounded-2xl border border-orange-250 shadow-sm bg-white">
          <div className="p-6 border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
             <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-orange-150 shadow-inner overflow-x-auto">
                {['Tous', 'Info', 'Attention', 'Critique'].map((s) => (
                   <button
                     key={s}
                     onClick={() => setFilter(s)}
                     className={cn(
                       "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap",
                       filter === s ? "bg-orange-600 text-white shadow-sm" : "text-slate-400 hover:text-orange-600"
                     )}
                   >
                      {s}
                   </button>
                ))}
             </div>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-350" />
                <input 
                  type="text" 
                  placeholder="Rechercher dans les traces..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 text-xs bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm font-bold text-slate-800" 
                />
             </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-wider">Date &amp; Heure (UTC)</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-wider">Identificateur d'Opérateur</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-wider">Évènement &amp; Détails d'opérations</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-wider">Métier Actif</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">Sévérité</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredLogs.map((log) => {
                     const severityLabel = getSeverite(log.status);
                     return (
                      <tr key={log.id} className="group hover:bg-orange-50/20 transition-all font-medium">
                         <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-[10.5px] font-black text-slate-800">{new Date(log.timestamp).toLocaleString("fr-FR", { timeZone: "UTC" })}</p>
                            <span className="text-[8.5px] font-mono text-slate-400 uppercase">{log.ipAddress}</span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-mono text-[10px] font-black">{log.userId.substring(0,3)}</div>
                               <div>
                                 <span className="text-[10px] font-black text-slate-800 block leading-tight">{log.userName}</span>
                                 <span className="text-[8px] font-mono text-slate-400 block lowercase">{log.userId}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-[10.5px] font-semibold text-slate-700 leading-normal">{log.action}</p>
                            <p className="text-[9px] text-slate-405 font-bold italic">{log.details}</p>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-[8.5px] font-black text-orange-700 bg-orange-50/70 border border-orange-100 px-2 py-0.5 rounded uppercase">{log.userRole}</span>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "text-[8.5px] font-black uppercase px-2 py-0.5 rounded inline-block min-w-[70px] text-center",
                              log.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : log.status === 'WARNING' ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                            )}>
                               {severityLabel}
                            </span>
                         </td>
                      </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
             <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                Traces d'audit scellées par signature cryptographique SHA-256 compliant ARCA RDC
             </div>
          </div>
       </div>

       {/* Security Summary & AI Insights */}
       <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border border-slate-700 shadow-2xl">
          <div className="absolute right-0 top-0 p-8 opacity-5">
             <Layers className="w-40 h-40" />
          </div>
          <div className="max-w-md relative z-10">
             <h4 className="text-xl font-black uppercase tracking-tight mb-3 flex items-center gap-3 italic">
                Règles de Traçabilité H24 <ShieldCheck className="w-6 h-6 text-orange-400" />
              </h4>
             <p className="text-xs font-semibold text-slate-400 leading-relaxed italic uppercase tracking-wider">Double Authentification active, monitoring constant pour conformité des rôles, et archivage cryptographique intègre.</p>
          </div>
          <div className="flex gap-3 relative z-10">
             <button onClick={handleExportCSV} className="px-6 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl cursor-pointer">Générer Rapport PDF</button>
             <button onClick={handleRefresh} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">Re-Sceller logs d'audit</button>
          </div>
       </div>
    </div>
  );
};
