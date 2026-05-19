/**
 * 📄 Fichier : /src/frontend/components/billing/ContributionsTracker.tsx
 * 🎯 Objectif : Suivi des cotisations périodiques (mensuelles, trimestrielles, annuelles).
 */
import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Clock, AlertTriangle, 
  Filter, Search, Download, ArrowUpRight, 
  BarChart3, RefreshCcw, BellRing
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface Contribution {
  id: string;
  insuredName: string;
  plan: string;
  period: string; // e.g., "Mai 2024"
  amount: number;
  status: 'Payé' | 'En attente' | 'En retard';
  dueDate: string;
}

const MOCK_CONTRIBUTIONS: Contribution[] = [
  { id: 'COT-001', insuredName: 'Adonaï WANZAMBI', plan: 'Premium Gold', period: 'Mai 2024', amount: 120.00, status: 'Payé', dueDate: '2024-05-05' },
  { id: 'COT-002', insuredName: 'Marie Curie', plan: 'Standard Silver', period: 'Mai 2024', amount: 45.00, status: 'En retard', dueDate: '2024-05-01' },
  { id: 'COT-003', insuredName: 'Kabasele Mwamba', plan: 'Elite Black', period: 'Trimestre 2', amount: 850.00, status: 'En attente', dueDate: '2024-06-01' },
];

export const ContributionsTracker: React.FC = () => {
  const [data] = useState<Contribution[]>(MOCK_CONTRIBUTIONS);

  return (
    <div className="space-y-8">
       {/* Stats Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Calendar className="w-24 h-24" /></div>
             <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Recouvrement du mois</p>
                <div className="flex items-end gap-2">
                   <p className="text-3xl font-black text-slate-900">82.4%</p>
                   <span className="text-[10px] font-bold text-emerald-500 mb-1 italic">↑ +4%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                   <div className="w-[82.4%] h-full bg-emerald-500 rounded-full" />
                </div>
             </div>
          </div>

          <div className="p-8 bg-slate-950 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform"><RefreshCcw className="w-24 h-24" /></div>
             <div className="relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1 italic">Total Encaissé</p>
                <p className="text-3xl font-black text-white">45,200 $</p>
                <p className="text-[10px] font-bold text-white/40 mt-2 italic flex items-center gap-2"><BarChart3 className="w-3 h-3" /> Basé sur 342 cotisations</p>
             </div>
          </div>

          <div className="p-8 bg-white border border-rose-100 rounded-[32px] shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5"><AlertTriangle className="w-24 h-24" /></div>
             <div className="relative z-10">
                <p className="text-[10px] font-black text-rose-400/60 uppercase tracking-widest mb-1 italic">Arriérés / Retards</p>
                <p className="text-3xl font-black text-rose-600">3,120 $</p>
                <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline italic">
                   <BellRing className="w-3 h-3" /> Relancer les retardataires
                </button>
             </div>
          </div>
       </div>

       {/* List Table */}
       <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Registre des Cotisations</h3>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                   <input type="text" placeholder="Rechercher un assuré..." className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold outline-none" />
                </div>
             </div>
             <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                <Download className="w-4 h-4 text-slate-400" />
             </button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-slate-50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Assuré / Contrat</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Période</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Montant</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Échéance</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Statut</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                         <td className="px-8 py-6">
                            <p className="text-xs font-black text-slate-900 uppercase italic">{item.insuredName}</p>
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.plan}</span>
                         </td>
                         <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{item.period}</td>
                         <td className="px-8 py-6 text-sm font-black text-slate-900">{item.amount.toLocaleString()} $</td>
                         <td className="px-8 py-6 text-xs font-black text-slate-400 italic">{item.dueDate}</td>
                         <td className="px-8 py-6">
                            <span className={cn(
                               "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tight italic",
                               item.status === 'Payé' ? "bg-emerald-50 text-emerald-600" :
                               item.status === 'En retard' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                            )}>
                               {item.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="px-4 py-2 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                               Détails
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};
