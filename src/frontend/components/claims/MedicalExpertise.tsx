/**
 * 📄 Fichier : /src/frontend/components/claims/MedicalExpertise.tsx
 * 🎯 Objectif : Expertise médicale et validation par médecins-conseils.
 */
import React from 'react';
import { 
  Stethoscope, ShieldCheck, Microscope, HeartPulse, 
  CheckCircle2, AlertTriangle, FileText, Download,
  Activity, ArrowUpRight, Search, Filter, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const MedicalExpertise: React.FC = () => {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-emerald-50 rounded-[32px] border border-emerald-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                <Stethoscope className="w-8 h-8 text-emerald-600" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Conseil Médical Expert</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Validation clinique & Approbation dossiers complexes</p>
             </div>
          </div>
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all italic">Consulter un Expert</button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Ongoing Medical Reviews */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Expertises en cours</h3>
                <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest bg-emerald-50 px-3 py-1 rounded-full">4 Dossiers Actifs</span>
             </div>
             <div className="space-y-4">
                {[
                  { id: 'EXP-101', patient: 'Lumbila B.', act: 'Chirurgie Spinale', doctor: 'Dr. Ilunga', complexity: 'Critique' },
                  { id: 'EXP-102', patient: 'Kabasele M.', act: 'IRM Neurologie', doctor: 'Dr. Mutamba', complexity: 'Moyenne' },
                ].map((exp, i) => (
                   <div key={i} className="group p-6 bg-slate-50/50 rounded-[2rem] border border-slate-50 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{exp.patient}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{exp.act}</p>
                         </div>
                         <div className={cn(
                           "px-3 py-1 rounded-full text-[8px] font-black uppercase italic tracking-tighter",
                           exp.complexity === 'Critique' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                         )}>
                            {exp.complexity}
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[9px] font-black text-indigo-600">DR</div>
                            <span className="text-[10px] font-bold text-slate-500 italic">{exp.doctor}</span>
                         </div>
                         <button className="text-[10px] font-black text-indigo-600 uppercase italic hover:underline flex items-center gap-2">Consulter <ArrowUpRight className="w-3.5 h-3.5" /></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Expert Metrics */}
          <div className="space-y-8">
             <div className="p-10 bg-slate-950 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                   <Microscope className="w-24 h-24" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="p-4 bg-white/10 rounded-[28px] w-fit border border-white/20">
                      <HeartPulse className="w-8 h-8 text-white" />
                   </div>
                   <h4 className="text-2xl font-black italic tracking-tighter uppercase whitespace-pre-line leading-none">Indice de Précision Clinique</h4>
                   <p className="text-4xl font-black text-emerald-400 italic">98.8% <span className="text-[10px] text-white/30 uppercase tracking-widest align-middle ml-2 italic">Standard ARCA</span></p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Temps Moyen Review</p>
                      <p className="text-xl font-black italic">45 min</p>
                   </div>
                   <div className="w-px h-10 bg-white/10" />
                   <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Opinions Secondaires</p>
                      <p className="text-xl font-black italic">14%</p>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-white border border-slate-100 rounded-[48px] shadow-sm flex flex-col items-center text-center gap-6 group">
                <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center border border-indigo-100 group-hover:rotate-12 transition-transform">
                   <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-900 uppercase italic">Conformité Légale</h4>
                   <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-relaxed italic">
                      Toutes les expertises sont signées numériquement par des médecins agréés par l'Ordre des Médecins de la RDC.
                   </p>
                </div>
                <button className="w-full py-4 border border-slate-200 text-slate-950 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Télécharger le Registre</button>
             </div>
          </div>
       </div>
    </div>
  );
};
