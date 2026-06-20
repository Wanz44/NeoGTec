/**
 * 📄 Fichier : /src/frontend/components/Contracts.tsx
 * 🎯 Objectif : Module complet de gestion des contrats et offres d'assurance.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, LayoutDashboard, Target, Zap, 
  Users, Settings, Lock, 
  BarChart3, FileText, Plus, BellRing
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ContractConfig } from './contracts/ContractConfig';
import { CimaContractWizard } from './contracts/CimaContractWizard';
import { useApp } from '../lib/AppContext';

export const Contracts: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'offers' | 'history'>('config');
  const { logAction } = useApp();

  React.useEffect(() => {
    if (!subModule) return;
    const mapping: Record<string, 'config' | 'offers' | 'history'> = {
      'contracts-config': 'config',
      'contracts-offers': 'offers'
    };
    if (mapping[subModule]) {
      setActiveTab(mapping[subModule]);
    }
  }, [subModule]);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#00A86B] rounded-2xl flex items-center justify-center shadow-xl shadow-[#00A86B]/20">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Gestion des Contrats</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Offres, Plafonds &amp; Barèmes</p>
             </div>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl">
             <button
               onClick={() => setActiveTab('config')}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer outline-none",
                 activeTab === 'config' ? "bg-white text-slate-800 shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Offres &amp; Barèmes
             </button>
             <button
               onClick={() => setActiveTab('offers')}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer outline-none",
                 activeTab === 'offers' ? "bg-white text-[#00A86B] shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Contrat CIMA (7 étapes)
             </button>
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'config' ? <ContractConfig /> : (
              <CimaContractWizard 
                onBackToOffers={() => setActiveTab('config')} 
                logAction={(act, dt, st) => logAction && logAction(act, dt, st)} 
              />
            )}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
