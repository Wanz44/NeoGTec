/**
 * 📄 Fichier : /src/frontend/components/integrations/RegulatoryExport.tsx
 * 🎯 Objectif : Exports réglementaires vers ARCA et Ministère de la Santé.
 */
import React from 'react';
import { 
  FileText, Landmark, Download, ShieldCheck, 
  Send, History, Search, Filter, Eye,
  Lock, CheckCircle2, AlertTriangle, FileSignature
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const RegulatoryExport: React.FC = () => {
  const reports = [
    { name: 'Rapport Trimestriel de Solvabilité', code: 'ARCA-SOLV-01', period: 'Q1 2024', status: 'Soumis', date: '15/04/2024' },
    { name: 'Statistiques Sanitaires Digitales', code: 'MIN-SANTE-99', period: 'Mensuel Mai', status: 'Prêt', date: '-' },
    { name: 'Audit des Sinistres Majeurs', code: 'ARCA-AUD-02', period: 'Semestriel', status: 'Draft', date: '-' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
       <div className="p-12 bg-white border border-slate-100 rounded-[64px] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="flex items-center gap-10">
             <div className="w-24 h-24 bg-indigo-950 rounded-[40px] flex items-center justify-center shadow-2xl shadow-indigo-900/40 relative group-hover:-rotate-6 transition-transform">
                <Landmark className="w-12 h-12 text-white" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Exports Réglementaires</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Conformité ARCA & Ministère de la Santé de la RDC</p>
             </div>
          </div>
          <button className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 transition-all italic shrink-0">Générer Nouveau Rapport</button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-8 border-b border-slate-50 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Journal des Transmissions</h3>
                   <div className="flex gap-2">
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all"><Filter className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>
             <div className="divide-y divide-slate-50 overflow-y-auto">
                {reports.map((report, i) => (
                   <div key={i} className="p-8 flex items-center justify-between hover:bg-indigo-50/20 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white transition-all">
                            <FileText className="w-6 h-6 text-slate-300 group-hover:text-indigo-600" />
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{report.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{report.code} • {report.period}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                            <span className={cn(
                               "text-[10px] font-black uppercase italic tracking-widest px-3 py-1 rounded-full",
                               report.status === 'Soumis' ? "text-emerald-500 bg-emerald-50" : report.status === 'Prêt' ? "text-indigo-600 bg-indigo-50" : "text-amber-500 bg-amber-50"
                            )}>
                               {report.status}
                            </span>
                            <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase italic">{report.date}</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="space-y-8">
             <div className="p-10 bg-slate-950 rounded-[48px] text-white shadow-2xl space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                   <FileSignature className="w-24 h-24" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="p-4 bg-white/10 rounded-3xl w-fit border border-white/20">
                      <ShieldCheck className="w-8 h-8 text-white" />
                   </div>
                   <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Certification ARCA</h4>
                   <p className="text-xs font-bold text-white/50 leading-relaxed italic">
                      Votre système est synchronisé avec les standards de reporting v.2024. Toutes les transmissions sont conformes à la loi n°001/2022.
                   </p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">Prochain Export Obligatoire</p>
                      <p className="text-xl font-black italic text-amber-500">30 Juin 2024</p>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-emerald-600 rounded-[56px] text-white shadow-xl shadow-emerald-500/20 flex flex-col items-center text-center gap-6 group overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center border border-white/20 group-hover:rotate-6 transition-transform relative z-10">
                   <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div className="relative z-10">
                   <h4 className="text-sm font-black uppercase italic tracking-tighter">Conformité à 100%</h4>
                   <p className="text-[10px] font-bold text-white/60 mt-3 leading-relaxed italic">
                      Aucune anomalie détectée sur les rapports financiers transmis.
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
