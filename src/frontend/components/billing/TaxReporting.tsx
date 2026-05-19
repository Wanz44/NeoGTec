/**
 * 📄 Fichier : /src/frontend/components/billing/TaxReporting.tsx
 * 🎯 Objectif : Rapports fiscaux conformes à la législation congolaise (RDC).
 */
import React from 'react';
import { 
  FileText, Landmark, ShieldCheck, Scale, 
  Download, Filter, ArrowUpRight, Calculator,
  TrendingDown, Info, Lock, CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const TaxReporting: React.FC = () => {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
       {/* Compliance Shield */}
       <div className="bg-emerald-600 p-10 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="flex items-center gap-8 relative z-10 w-full max-w-2xl">
             <div className="w-20 h-20 bg-white/20 rounded-[28px] border border-white/20 flex items-center justify-center ring-8 ring-white/5 shadow-2xl shrink-0 group-hover:rotate-6 transition-transform">
                <Landmark className="w-10 h-10 text-white" />
             </div>
             <div className="space-y-3">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Fiscalité Congolaise</h2>
                <p className="text-sm font-bold text-white/70 italic leading-relaxed">
                   Génération automatisée des déclarations fiscales (TVA, IPR, Cotisations Spéciales) conformes aux exigences de la DGI et de l'ARCA.
                </p>
                <div className="flex items-center gap-3 py-1 px-3 bg-white/10 rounded-full border border-white/10 w-fit">
                   <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Update Tax Law 2024</span>
                </div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 shrink-0">
             <button className="px-10 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Gérer mes Certificats
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Periodic Declarations */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Déclarations Périodiques</h3>
                <Scale className="w-5 h-5 text-indigo-400" />
             </div>
             
             <div className="space-y-4">
                {[
                  { name: 'Déclaration TVA (Mensuelle)', code: 'FRM-701', status: 'Prêt', color: 'indigo' },
                  { name: 'IPR / Impôt sur le Revenu', code: 'FRM-201', status: 'Vérifié', color: 'emerald' },
                  { name: 'Redevance ARCA (Annuelle)', code: 'REG-88', status: 'En Calcul', color: 'amber' },
                  { name: 'CNSS / Onem (Cotisations)', code: 'SOC-902', status: 'Soumis', color: 'slate' }
                ].map((form, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex items-center gap-5">
                         <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs italic shadow-sm", `bg-${form.color}-50 text-${form.color}-600`)}>
                            {form.code.split('-')[0]}
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 uppercase italic">{form.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{form.code}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest italic",
                           form.status === 'Prêt' ? "text-indigo-600" : form.status === 'Vérifié' ? "text-emerald-500" : "text-slate-400"
                         )}>
                            {form.status}
                         </span>
                         <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Tax Metrics & Savings */}
          <div className="space-y-8">
             <div className="bg-slate-950 p-10 rounded-[48px] text-white shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                   <Calculator className="w-32 h-32" />
                </div>
                <div className="space-y-2 relative z-10">
                   <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">Projection Fiscale (Q2)</h4>
                   <p className="text-4xl font-black text-white tracking-widest">128,500 <span className="text-xs font-bold italic">$</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Droit d'accises</p>
                      <p className="text-lg font-black italic">14.2k $</p>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Provision IBP</p>
                      <p className="text-lg font-black italic">45.0k $</p>
                   </div>
                </div>
                <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest relative z-10 shadow-xl shadow-white/5 hover:scale-[1.02] transition-all">
                   Simuler ma Déclaration IBP
                </button>
             </div>

             <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[48px] flex items-start gap-5 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-2xl border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                   <Info className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest italic">Note de Vigilance</h4>
                   <p className="text-[11px] font-bold text-amber-900/60 italic leading-relaxed">
                      La nouvelle circulaire n°234 sur la taxation des plateformes digitales est active. Assurez-vous d'avoir paramétré vos commissions conformement aux nouvelles directives.
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
