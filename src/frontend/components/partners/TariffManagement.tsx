/**
 * 📄 Fichier : /src/frontend/components/partners/TariffManagement.tsx
 * 🎯 Objectif : Mise à jour centralisée des barèmes d'actes médicaux.
 */
import React, { useState } from 'react';
import { 
  Calculator, Search, Plus, Filter, 
  History as HistoryIcon, TrendingUp, TrendingDown, RefreshCcw, 
  Download, Upload, CheckCircle2, AlertCircle, 
  FileText, ArrowRight, Save
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export interface MedicalAct {
  id: string;
  code: string;
  label: string;
  category: 'Consultation' | 'Hospitalisation' | 'Chirurgie' | 'Laboratoire' | 'Radiologie';
  priceUSD: number;
  lastUpdate: string;
  status: 'Actif' | 'Obsolète' | 'En révision';
}

const MOCK_ACTS: MedicalAct[] = [
  { id: 'ACT-001', code: 'C01', label: 'Consultation Médecine Générale', category: 'Consultation', priceUSD: 15.00, lastUpdate: '2024-01-01', status: 'Actif' },
  { id: 'ACT-002', code: 'H01', label: 'Nuit d\'Hospitalisation (Chambre Simple)', category: 'Hospitalisation', priceUSD: 45.00, lastUpdate: '2024-03-15', status: 'Actif' },
  { id: 'ACT-003', code: 'S01', label: 'Appendicectomie Coelioscopique', category: 'Chirurgie', priceUSD: 1250.00, lastUpdate: '2024-02-10', status: 'En révision' },
  { id: 'ACT-004', code: 'L01', label: 'Bilan Sanguin Complet', category: 'Laboratoire', priceUSD: 25.00, lastUpdate: '2024-05-01', status: 'Actif' },
];

export const TariffManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredActs = MOCK_ACTS.filter(act => 
    (act.label.toLowerCase().includes(searchQuery.toLowerCase()) || act.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory === 'All' || act.category === activeCategory)
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-[24px] border border-indigo-100 flex items-center justify-center shadow-sm">
               <Calculator className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Gestion des Tarifs</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Barèmes d'actes conventionnés</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-3 px-6 py-3 border border-slate-200 bg-white text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-slate-400 transition-all">
               <Upload className="w-4 h-4" /> Import Bulk (CSV)
            </button>
            <button className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
               <Plus className="w-4 h-4" /> Ajouter un Acte
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {['All', 'Consultation', 'Hospitalisation', 'Chirurgie', 'Laboratoire', 'Radiologie'].map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={cn(
               "p-4 rounded-[2rem] border transition-all text-[10px] font-black uppercase tracking-widest text-center",
               activeCategory === cat ? "bg-indigo-950 text-white border-indigo-950 shadow-xl" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
             )}
           >
              {cat === 'All' ? 'Tous les Actes' : cat}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
            <div className="flex items-center gap-4 flex-1 max-w-md">
               <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Filtrer par code ou label..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold outline-none" 
                  />
               </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase italic">
               <HistoryIcon className="w-4 h-4" /> Log de mise à jour: 12 Mai 2024
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/20">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Code ACT</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Libellé de l'acte</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Catégorie</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tarif Conventionné</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredActs.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{act.code}</span>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{act.label}</p>
                          <p className="text-[9px] font-bold text-slate-300 italic mt-0.5">MAJ: {act.lastUpdate}</p>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{act.category}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black text-slate-900">{act.priceUSD.toLocaleString()} $</span>
                             <div className={cn(
                               "w-1.5 h-1.5 rounded-full",
                               act.status === 'Actif' ? "bg-emerald-500" : act.status === 'En révision' ? "bg-amber-400" : "bg-rose-400"
                             )} />
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                <RefreshCcw className="w-4 h-4" />
                             </button>
                             <button className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:opacity-90 transition-all">
                                Éditer
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <div className="p-10 bg-indigo-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group border border-indigo-700">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
         <div className="relative z-10 flex-1 space-y-4">
            <h4 className="text-2xl font-black italic tracking-tighter">Révision Annuelle des Tarifs</h4>
            <p className="text-sm text-white/60 italic leading-relaxed">
              La campagne de mise à jour des barèmes pour l'exercice 2025 est ouverte. 
              Veuillez soumettre vos propositions tarifaires pour validation actuarielle.
            </p>
            <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-xl w-fit border border-white/20">
               <AlertCircle className="w-4 h-4 text-white" />
               <span className="text-[10px] font-black uppercase tracking-widest italic">Date limite: 31 Mars 2025</span>
            </div>
         </div>
         <div className="relative z-10 flex flex-col gap-3 shrink-0">
            <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
               Ouvrir la Campagne
            </button>
            <button className="px-10 py-4 bg-indigo-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
               Exporter le Guide <Download className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};
