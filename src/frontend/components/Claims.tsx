/**
 * 📄 Fichier : /src/frontend/components/Claims.tsx
 * 🎯 Objectif : Gestion avancée des sinistres avec transmission sécurisée.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, CheckCircle2, Clock, FileText, Upload, 
  ShieldCheck, History, User, CreditCard, ChevronRight,
  TrendingUp, Search, Filter, Info, X, Zap, Download,
  ExternalLink, MessageSquare, AlertTriangle, Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ClaimTransmission } from './claims/ClaimTransmission';

// --- Types ---

export type ClaimStatus = 'En attente' | 'En cours' | 'Approuvé' | 'Rejeté' | 'Payé';
export type ValidationStage = 'Agent' | 'Superviseur' | 'Finance';

export interface Claim {
  id: string;
  policyId: string;
  insuredName: string;
  type: string;
  amount: number;
  date: string;
  status: ClaimStatus;
  currentStage: ValidationStage;
}

const MOCK_CLAIMS: Claim[] = [
  { id: 'CLM-7821', policyId: 'POL-123456', insuredName: 'Adonaï WANZAMBI', type: 'Santé - Hospitalisation', amount: 1250.00, date: '2024-05-10', status: 'Approuvé', currentStage: 'Finance' },
  { id: 'CLM-7822', policyId: 'POL-654321', insuredName: 'Marie Curie', type: 'Pharmacie', amount: 85.00, date: '2024-05-12', status: 'En cours', currentStage: 'Agent' },
];

export const Claims: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'transmission'>('list');
  const [data] = useState<Claim[]>(MOCK_CLAIMS);

  const renderContent = () => {
    switch (activeTab) {
      case 'transmission': return <ClaimTransmission />;
      default: return (
        <div className="space-y-6">
           {/* Summary Stats */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Sinistres', value: '42', icon: FileText, color: 'blue' },
                { label: 'En cours', value: '18', icon: Clock, color: 'amber' },
                { label: 'Approuvés', value: '22', icon: CheckCircle2, color: 'emerald' },
                { label: 'Montant Total', value: '45,2k $', icon: TrendingUp, color: 'indigo' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className={`p-2 bg-${stat.color}-50 rounded-xl w-fit mb-3`}>
                      <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                   <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
                </div>
              ))}
           </div>

           {/* Table */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-sm font-black text-slate-900 uppercase italic">Liste des Sinistres</h3>
                 <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-300" />
                    <input type="text" placeholder="Recherche..." className="bg-transparent border-none outline-none text-xs w-48 font-medium" />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-50">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">ID Sinistre</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Assuré</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Type</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Montant</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Statut</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {data.map(claim => (
                         <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                           <td className="px-6 py-4 text-xs font-black text-slate-900 italic uppercase underline decoration-indigo-500/30">{claim.id}</td>
                           <td className="px-6 py-4">
                              <p className="text-xs font-black text-slate-700 uppercase leading-none mb-1">{claim.insuredName}</p>
                              <p className="text-[10px] font-bold text-slate-400">{claim.policyId}</p>
                           </td>
                           <td className="px-6 py-4 text-xs font-bold text-slate-500">{claim.type}</td>
                           <td className="px-6 py-4 text-sm font-black text-slate-900">{claim.amount.toLocaleString()} $</td>
                           <td className="px-6 py-4">
                              <span className={cn(
                                "text-[9px] font-black uppercase px-2 py-1 rounded-full",
                                claim.status === 'Approuvé' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                              )}>
                                {claim.status}
                              </span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Sinistres & Remboursements</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Gestion du risque & Indemnisation</p>
             </div>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl">
             <button
               onClick={() => setActiveTab('list')}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                 activeTab === 'list' ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Dashboard
             </button>
             <button
               onClick={() => setActiveTab('transmission')}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                 activeTab === 'transmission' ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                <Send className="w-3.5 h-3.5" />
                Transmission Sécurisée
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
            {renderContent()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
