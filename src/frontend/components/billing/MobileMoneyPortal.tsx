/**
 * 📄 Fichier : /src/frontend/components/billing/MobileMoneyPortal.tsx
 * 🎯 Objectif : Gestion des encaissements via Mobile Money (M-Pesa, Orange, Airtel).
 */
import React, { useState } from 'react';
import { 
  Smartphone, SmartphoneIcon, CreditCard, 
  Zap, ArrowRight, ShieldCheck, 
  Send, RefreshCcw, CheckCircle2, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const MobileMoneyPortal: React.FC = () => {
  const [operator, setOperator] = useState<'MPesa' | 'Orange' | 'Airtel'>('MPesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-black text-slate-950 italic uppercase tracking-tighter">Paiement Mobile Money</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Encaissement sécurisé en temps réel</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10" />
             
             <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Choix de l'Opérateur</label>
                <div className="grid grid-cols-3 gap-4">
                   {[
                     { id: 'MPesa', label: 'M-Pesa', color: 'bg-red-600' },
                     { id: 'Orange', label: 'Orange', color: 'bg-orange-500' },
                     { id: 'Airtel', label: 'Airtel', color: 'bg-rose-600' }
                   ].map((op) => (
                      <button
                        key={op.id}
                        onClick={() => setOperator(op.id as any)}
                        className={cn(
                          "relative aspect-square rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 group overflow-hidden",
                          operator === op.id ? "border-slate-950 scale-105 shadow-xl" : "border-slate-50 grayscale hover:grayscale-0 hover:border-slate-200"
                        )}
                      >
                         <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[10px]", op.color)}>
                            {op.id === 'MPesa' ? 'M' : op.id === 'Orange' ? 'O' : 'A'}
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-tighter">{op.label}</span>
                         {operator === op.id && <div className="absolute top-2 right-2 w-2 h-2 bg-slate-950 rounded-full" />}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Numéro de Téléphone</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-100 pr-3">
                      <span className="text-xs font-black text-slate-400">+243</span>
                   </div>
                   <input 
                     type="tel" 
                     placeholder="8xxxxxxxxx" 
                     className="w-full py-4 pl-20 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-slate-950/5 transition-all"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Montant à Encaisser</label>
                <div className="relative">
                   <input 
                     type="number" 
                     placeholder="0.00" 
                     className="w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-2xl font-black outline-none focus:ring-2 focus:ring-slate-950/5 text-right transition-all"
                   />
                   <div className="absolute left-1 top-1/2 -translate-y-1/2 p-4">
                      <span className="text-xs font-black text-slate-950 bg-white shadow-sm border border-slate-100 px-3 py-1 rounded-lg">USD $</span>
                   </div>
                </div>
                <p className="text-[10px] font-bold text-slate-300 italic px-1">Taux du jour: 1 USD = 2800 CDF</p>
             </div>

             <button 
               onClick={handlePay}
               disabled={isProcessing}
               className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-slate-950/20 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
             >
                <AnimatePresence mode="wait">
                   {isProcessing ? (
                      <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                         <RefreshCcw className="w-5 h-5 animate-spin" />
                         <span>Traitement...</span>
                      </motion.div>
                   ) : success ? (
                      <motion.div key="succ" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                         <CheckCircle2 className="w-5 h-5" />
                         <span>Succès !</span>
                      </motion.div>
                   ) : (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
                         <Smartphone className="w-5 h-5" />
                         <span>Initier la Transaction</span>
                      </motion.div>
                   )}
                </AnimatePresence>
             </button>
          </div>

          {/* Info Card */}
          <div className="flex flex-col justify-center space-y-8">
             <div className="p-8 bg-indigo-600 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                   <Lock className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="p-4 bg-white/10 rounded-3xl w-fit border border-white/20 shadow-xl">
                      <ShieldCheck className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-2xl font-black italic tracking-tighter">Passerelle Certifiée</h3>
                   <p className="text-sm font-bold text-indigo-100/60 leading-relaxed italic">
                     Nos transactions sont cryptées et vérifiées par les autorités financières locales. 
                     Recevez une confirmation SMS instantanée à chaque encaissement.
                   </p>
                   <div className="flex gap-4">
                      <div className="flex flex-col">
                         <span className="text-[7px] font-black text-indigo-200 uppercase tracking-widest mb-1">Standard</span>
                         <span className="text-[10px] font-black uppercase">AES-256 Bit</span>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex flex-col">
                         <span className="text-[7px] font-black text-indigo-200 uppercase tracking-widest mb-1">Status API</span>
                         <span className="flex items-center gap-1.5 text-[10px] font-black uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Opérationnel
                         </span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-white border border-slate-100 rounded-[48px] shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Dernières Activités</h4>
                <div className="space-y-4">
                   {[
                     { num: '+243 82x xxx x12', amount: '45.00 $', time: 'Il y a 2 min' },
                     { num: '+243 81x xxx x44', amount: '120.00 $', time: 'Il y a 15 min' }
                   ].map((at, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div>
                            <p className="text-[11px] font-black text-slate-900">{at.num}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase italic">{at.time}</p>
                         </div>
                         <span className="text-xs font-black text-emerald-600">+{at.amount}</span>
                      </div>
                   ))}
                </div>
                <button className="w-full py-4 border border-slate-200 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                   Historique Complet
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};
