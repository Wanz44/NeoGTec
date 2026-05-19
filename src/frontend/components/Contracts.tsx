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

export const Contracts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'offers' | 'history'>('config');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Gestion des Contrats</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Offres, Plafonds & Barèmes</p>
             </div>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl">
             <button
               onClick={() => setActiveTab('config')}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                 activeTab === 'config' ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Configuration
             </button>
             <button
               onClick={() => setActiveTab('offers')}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                 activeTab === 'offers' ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Catalogue Offres
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
              <div className="p-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-200">
                 <div className="p-6 bg-slate-50 rounded-full w-fit mx-auto">
                    <FileText className="w-12 h-12 text-slate-200" />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 uppercase italic">Catalogue des Offres</h2>
                 <p className="text-sm text-slate-400 italic">Cette vue est en cours de déploiement.</p>
              </div>
            )}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
