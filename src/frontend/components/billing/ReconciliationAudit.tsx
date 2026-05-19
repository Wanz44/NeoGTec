/**
 * 📄 Fichier : /src/frontend/components/billing/ReconciliationAudit.tsx
 * 🎯 Objectif : Réconciliation bancaire automatisée et états comptables.
 */
import React, { useState } from 'react';
import { 
  HistoryIcon, BookOpen, FileText, 
  RefreshCcw, CheckCircle2, AlertCircle, 
  TrendingUp, TrendingDown, Search, Download,
  Filter, Calculator, ShieldCheck, ClipboardCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const ReconciliationAudit: React.FC = () => {
  const [isReconciling, setIsReconciling] = useState(false);

  const triggerRecon = () => {
    setIsReconciling(true);
    setTimeout(() => setIsReconciling(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-950 rounded-[28px] flex items-center justify-center shadow-xl shadow-indigo-900/40">
                <ClipboardCheck className="w-7 h-7 text-white" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Audit & Réconciliation</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Conformité Trésorerie & États Comptables</p>
             </div>
          </div>
          <button 
            onClick={triggerRecon}
            disabled={isReconciling}
            className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
             {isReconciling ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
             Lancer la Réconciliation
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Accounting Status */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Statut du Grand Livre</h4>
                   <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 text-[8px] font-black text-emerald-600 tracking-widest uppercase italic">
                      <CheckCircle2 className="w-3 h-3" /> Équilibre Parfait
                   </span>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Débit (Prestations)</p>
                      <p className="text-3xl font-black text-rose-600">1.2M <span className="text-xs font-bold italic">$</span></p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Crédit (Encaissements)</p>
                      <p className="text-3xl font-black text-emerald-600">1.4M <span className="text-xs font-bold italic">$</span></p>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                         <Calculator className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 italic">Balance de Vérification</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Générée automatiquement il y a 2h</p>
                      </div>
                   </div>
                   <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Factures Non Réconciliées', value: '12', color: 'rose', icon: AlertCircle },
                  { label: 'Ecarts de Trésorerie', value: '0.00 $', color: 'emerald', icon: ShieldCheck }
                ].map((stat, i) => (
                   <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group">
                      <div>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">{stat.label}</p>
                         <p className={cn("text-xl font-black", `text-${stat.color}-600`)}>{stat.value}</p>
                      </div>
                      <div className={cn("p-3 rounded-xl", `bg-${stat.color}-50`)}>
                         <stat.icon className={cn("w-5 h-5", `text-${stat.color}-600`)} />
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Right Sidebar: Reports */}
          <div className="space-y-6">
             <div className="p-8 bg-slate-950 rounded-[48px] text-white shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[60px] -z-10 group-hover:scale-110 transition-transform" />
                <div className="space-y-4 relative z-10">
                   <div className="p-3 bg-white/10 rounded-2xl w-fit border border-white/20">
                      <BookOpen className="w-6 h-6 text-white" />
                   </div>
                   <h4 className="text-xl font-black italic tracking-tighter uppercase">États Comptables</h4>
                   <p className="text-xs font-bold text-white/50 leading-relaxed italic">
                      Exportez vos états réglementaires (Bilans, Compte de Résultat) en un clic. 
                      Prêts pour audit fiscal.
                   </p>
                </div>
                <div className="space-y-3 relative z-10">
                   {[
                     { label: 'Journal des Ventes', format: 'PDF/XLS' },
                     { label: 'Grand Livre Auxiliaire', format: 'PDF' },
                     { label: 'Balance de Clôture', format: 'XLS' }
                   ].map((doc, i) => (
                      <button key={i} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all text-left">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">{doc.label}</p>
                            <p className="text-[8px] font-bold text-white/30 italic uppercase">{doc.format}</p>
                         </div>
                         <Download className="w-3.5 h-3.5 text-white/40" />
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-8 bg-white border border-slate-100 rounded-[48px] shadow-sm flex flex-col items-center text-center gap-6 group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:rotate-12 transition-transform">
                   <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Rapports d'Audit</h4>
                   <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] leading-relaxed">
                      Dernier Audit externe validé:<br/>
                      <span className="text-slate-900">15 Avril 2024</span>
                   </p>
                </div>
                <button className="w-full py-4 border border-slate-200 text-slate-950 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                   Historique des Audits
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
