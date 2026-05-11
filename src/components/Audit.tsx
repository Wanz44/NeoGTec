import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileCheck, Search, History, Download, Info } from 'lucide-react';

export const Audit: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Conformité & Audit</h2>
        <p className="text-slate-500 font-medium text-sm">Registre immuable des décisions système et vérification RGPD.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
           <div className="material-mica p-4 rounded-[12px] flex items-center gap-3 border border-white/40">
              <Search className="w-4 h-4 text-slate-400" />
              <input placeholder="Filtrer audit logs par n° de décision, date ou administrateur..." className="bg-transparent border-none outline-none text-sm font-medium text-orange-950 flex-1" />
           </div>

           <div className="material-mica rounded-fluent border border-white/20 overflow-hidden shadow-inner">
              <div className="p-6 border-b border-black/[0.03] flex justify-between items-center bg-white/40">
                 <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-bold text-orange-950 uppercase tracking-widest">Journal des décisions</h3>
                 </div>
                 <button className="flex items-center gap-2 text-[11px] font-black text-orange-600 hover:underline uppercase tracking-tighter">
                    <Download className="w-3.5 h-3.5" /> Exporter Rapport PDF
                 </button>
              </div>
              
              <div className="divide-y divide-black/[0.02]">
                {[
                  { id: 'AUD-0000', action: 'Système en attente', admin: 'Automate', time: '---', status: 'En attente' }
                ].map((log, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-white/40 transition-colors group cursor-default">
                     <div className="flex items-center gap-6">
                        <span className="text-[11px] font-black text-slate-300 w-16 uppercase">{log.id}</span>
                        <div>
                           <p className="text-[13px] font-bold text-orange-950">{log.action}</p>
                           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{log.admin} • {log.time}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                           {log.status}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Info className="w-4 h-4 text-slate-300" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="fluent-card p-6 bg-slate-400 text-white shadow-xl shadow-slate-400/20">
              <ShieldCheck className="w-10 h-10 mb-6 opacity-60" />
              <h4 className="text-lg font-bold mb-2">Score de Conformité</h4>
              <p className="text-[42px] font-black tracking-tighter mb-4">0%</p>
              <p className="text-[10px] uppercase font-bold opacity-70 tracking-[0.2em] mb-4">ISO 27001 • HDS • RGPD</p>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1 }} className="h-full bg-white" />
              </div>
           </div>

           <div className="material-mica p-6 rounded-fluent border border-emerald-100/30">
              <h4 className="text-sm font-bold text-orange-950 mb-4 flex items-center gap-2">
                 <FileCheck className="w-4 h-4 text-emerald-600" />
                 Certifications HDS
              </h4>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed mb-4">
                 Votre instance est hébergée sur un environnement certifié Hébergeur de Données de Santé.
              </p>
              <button className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline">
                 Télécharger BAA →
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
