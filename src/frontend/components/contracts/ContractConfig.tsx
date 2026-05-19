import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, Target, Zap, 
  ChevronRight, ArrowRight, BarChart3, Plus, 
  Trash2, Info, LayoutDashboard, Database,
  TrendingDown, Percent, Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ContractTier {
  id: string;
  name: string;
  color: string;
  ceiling: number;
  deductible: number;
  premium: number;
  active: boolean;
}

const MOCK_TIERS: ContractTier[] = [
  { id: 'T1', name: 'Standard Bronze', color: 'bg-amber-600', ceiling: 2000, deductible: 50, premium: 120, active: true },
  { id: 'T2', name: 'Premium Silver', color: 'bg-slate-400', ceiling: 5000, deductible: 25, premium: 350, active: true },
  { id: 'T3', name: 'Exclusive Gold', color: 'bg-yellow-500', ceiling: 15000, deductible: 0, premium: 850, active: true },
];

export const ContractConfig: React.FC = () => {
  const [tiers] = useState<ContractTier[]>(MOCK_TIERS);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm shadow-indigo-100/50">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Offres & Barèmes</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configuration des structures de contrats</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">
           Créer une Nouvelle Offre
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div key={tier.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden relative">
             <div className={cn("h-2 w-full", tier.color)} />
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{tier.name}</h4>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1 italic">Active & Publiée</p>
                   </div>
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plafond Annuel</p>
                         <p className="text-2xl font-black text-slate-900">{tier.ceiling.toLocaleString()} $</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium / Assuré</p>
                         <p className="text-lg font-black text-indigo-600">{tier.premium} $</p>
                      </div>
                   </div>

                   <div className="space-y-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Ticket Modérateur</span>
                         <span className="text-xs font-black text-slate-900">20%</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Franchise Fixe</span>
                         <span className="text-xs font-black text-slate-900">{tier.deductible} $</span>
                      </div>
                   </div>
                </div>

                <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                   Éditer les Règles
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="fluent-card p-10 bg-slate-950 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                     <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter">Plafonds Dynamiques</h3>
               </div>
               <p className="text-white/40 text-sm leading-relaxed italic">
                 Configurez des règles de plafonnement par spécialité médicale, type d'acte ou période de carence. 
                 Les changements s'appliquent instantanément aux nouvelles polices.
               </p>
               <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                     Gérer les Barèmes ACT
                  </button>
                  <button className="flex-1 py-3 border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                     Audit Historique
                  </button>
               </div>
            </div>
         </div>

         <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                     <Zap className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 uppercase italic">Algorithme de Calcul</h4>
                     <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Moteur de cotation v2.0</p>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed italic">
                 Notre moteur IA analyse le risque historique pour suggérer les meilleurs plafonds par segment démographique.
               </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Certification Actuarielle 2024</span>
               </div>
               <button className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase italic hover:underline">
                  Rapport de Risque <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
