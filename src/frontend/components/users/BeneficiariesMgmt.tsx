import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, X, Heart, Shield, Plus, ChevronRight, History as HistoryIcon, Trash2, Camera, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Beneficiary {
  id: string;
  name: string;
  relation: 'Conjoint' | 'Enfant' | 'Parent' | 'Autre';
  age: number;
  status: 'Actif' | 'En attente' | 'Suspendu';
  photo?: string;
}

const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: 'B1', name: 'Sabrina WANZAMBI', relation: 'Conjoint', age: 28, status: 'Actif' },
  { id: 'B2', name: 'Isaac WANZAMBI', relation: 'Enfant', age: 6, status: 'Actif' },
  { id: 'B3', name: 'Léa WANZAMBI', relation: 'Enfant', age: 3, status: 'En attente' },
];

export const BeneficiariesMgmt: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(MOCK_BENEFICIARIES);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-50 rounded-3xl border border-rose-100 shadow-sm shadow-rose-100/50">
            <Heart className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Ayants-Droit</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestion de la couverture familiale</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Ajouter un Membre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiaries.map((b) => (
          <div key={b.id} className="group relative bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-slate-200 transition-all overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[60px] -z-10 group-hover:scale-110 transition-transform" />
             
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                   <div className="w-24 h-24 bg-slate-100 rounded-3xl border-4 border-white flex items-center justify-center p-1 shadow-lg ring-1 ring-slate-100">
                      <User className="w-12 h-12 text-slate-300" />
                   </div>
                   <div className={cn(
                     "absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white shadow-sm font-black text-[10px]",
                     b.status === 'Actif' ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
                   )} title={b.status}>
                      {b.status === 'Actif' ? '✓' : '?'}
                   </div>
                </div>

                <div>
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{b.name}</h4>
                   <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{b.relation}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{b.age} Ans</span>
                   </div>
                </div>

                <div className="w-full flex gap-2 pt-2">
                   <button className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                      <HistoryIcon className="w-3.5 h-3.5" /> Dossier
                   </button>
                   <button className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        ))}

        {/* Empty Placeholder / Add Card */}
        <button 
           onClick={() => setShowAddModal(true)}
           className="border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-slate-300 hover:bg-slate-50/50 transition-all group min-h-[300px]"
        >
           <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
           </div>
           <p className="text-xs font-black uppercase tracking-widest">Nouveau Bénéficiaire</p>
        </button>
      </div>

      <div className="p-6 bg-slate-950 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
               <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
               <h4 className="text-xl font-black italic tracking-tighter">Protection Familiale Intégrale</h4>
               <p className="text-xs text-white/40 italic leading-relaxed mt-1">Tous vos ayants-droit bénéficient du même niveau de service Premium que l'assuré principal.</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/10 hover:scale-105 transition-all relative z-10 shrink-0">
            Détails de la Police
         </button>
      </div>

      {/* Modal Mockup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white rounded-[3rem] w-full max-w-xl p-10 relative shadow-2xl"
           >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                 <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="space-y-8">
                 <div>
                    <h2 className="text-2xl font-black text-slate-950 italic uppercase tracking-tighter">Nouveau Membre</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ajouter un bénéficiaire à votre couverture</p>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100 border-dashed group cursor-pointer">
                       <div className="w-20 h-20 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <Camera className="w-8 h-8 text-slate-300" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900 uppercase">Prendre une photo</p>
                          <p className="text-[10px] font-bold text-slate-400 italic">Obligatoire pour identification bio</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lien de Parenté</label>
                          <select className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-black focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                             <option>Conjoint</option>
                             <option>Enfant</option>
                             <option>Parent</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Âge</label>
                          <input type="number" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-black focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom Complet</label>
                       <input type="text" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black focus:outline-none focus:ring-2 focus:ring-rose-500/20" placeholder="Entrez le nom complet" />
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowAddModal(false)}
                   className="w-full h-16 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-rose-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    Confirmer l'Ajout
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};
