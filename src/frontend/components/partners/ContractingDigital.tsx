/**
 * 📄 Fichier : /src/frontend/components/partners/ContractingDigital.tsx
 * 🎯 Objectif : Conventionnement digital avec signature électronique.
 */
import React, { useState } from 'react';
import { 
  ShieldCheck, FileText, PenTool, CheckCircle2, 
  Clock, Download, Send, Lock, UserCheck, 
  AlertCircle, ChevronRight, FileSignature
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export interface Agreement {
  id: string;
  providerName: string;
  type: 'Offre Standard' | 'Offre Premium' | 'Tarification Actes';
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired';
  sentDate: string;
  signedDate?: string;
  expirationDate: string;
}

const MOCK_AGREEMENTS: Agreement[] = [
  { id: 'AGR-101', providerName: 'Hôpital HJ Hospitals', type: 'Offre Premium', status: 'Signed', sentDate: '2024-01-15', signedDate: '2024-01-16', expirationDate: '2025-01-15' },
  { id: 'AGR-102', providerName: 'Clinique Ngaliema', type: 'Offre Standard', status: 'Sent', sentDate: '2024-05-10', expirationDate: '2025-05-10' },
  { id: 'AGR-103', providerName: 'Centre de Santé Roi Baudouin', type: 'Tarification Actes', status: 'Draft', sentDate: '-', expirationDate: '2025-12-31' },
];

export const ContractingDigital: React.FC = () => {
  const [agreements] = useState<Agreement[]>(MOCK_AGREEMENTS);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-[24px] border border-emerald-100 flex items-center justify-center shadow-sm">
               <FileSignature className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Conventionnement Digital</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accords tarifaires & Prestations</p>
            </div>
         </div>
         <button className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
            <FileText className="w-4 h-4" /> Nouvel Accord
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Accords Actifs', value: '124', icon: CheckCircle2, color: 'emerald' },
           { label: 'En attente signature', value: '12', icon: PenTool, color: 'amber' },
           { label: 'Accords Expiring (30j)', value: '5', icon: Clock, color: 'rose' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl", `bg-${stat.color}-50`)}>
                 <stat.icon className={cn("w-6 h-6", `text-${stat.color}-600`)} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                 <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase italic">Suivi des Conventions</h3>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all italic">Filtrer par statut</button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Prestataire</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type d'accord</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Signature</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {agreements.map((agreement) => (
                    <tr key={agreement.id} className="hover:bg-slate-50/30 transition-colors group">
                       <td className="px-8 py-6">
                          <p className="text-xs font-black text-slate-900 uppercase italic mb-1">{agreement.providerName}</p>
                          <span className="text-[9px] font-mono font-bold text-slate-300 uppercase">{agreement.id}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <FileText className="w-3.5 h-3.5 text-indigo-400" />
                             <span className="text-xs font-bold text-slate-500">{agreement.type}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-tighter",
                            agreement.status === 'Signed' ? "bg-emerald-50 text-emerald-600" :
                            agreement.status === 'Sent' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                          )}>
                             {agreement.status === 'Signed' ? 'Accord Signé' : agreement.status === 'Sent' ? 'En Signature' : 'Brouillon'}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-slate-900">{agreement.signedDate || '-'}</span>
                             <span className="text-[9px] font-bold text-slate-300 uppercase italic">Expire le: {agreement.expirationDate}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <Download className="w-4 h-4" />
                             </button>
                             <button className={cn(
                               "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                               agreement.status === 'Sent' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-slate-950 text-white"
                             )}>
                                {agreement.status === 'Signed' ? 'Visualiser' : agreement.status === 'Sent' ? 'Relancer' : 'Éditer'}
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <div className="p-8 bg-slate-950 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group border border-slate-800">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
         
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
               <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
               <h4 className="text-xl font-black italic tracking-tighter">Signature Électronique Certifiée</h4>
               <p className="text-xs text-white/40 italic leading-relaxed mt-1">Conforme au standard eIDAS pour une validité juridique internationale.</p>
            </div>
         </div>
         
         <div className="flex gap-4 relative z-10 shrink-0">
            <button className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
               Vérifier un Document
            </button>
            <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
               Politique de Confidentialité
            </button>
         </div>
      </div>
    </div>
  );
};
