import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, CreditCard, DollarSign, PieChart } from 'lucide-react';
import { cn } from '../lib/utils';

export const Financial: React.FC = () => {
  const transactions = [
    { id: 'TX-0001', user: 'Attente Flux', amount: '0.00 $', type: 'Credit', date: 'Aujourd\'hui' },
    { id: 'TX-0002', user: 'Attente Flux', amount: '0.00 $', type: 'Debit', date: 'Hier' },
    { id: 'TX-0003', user: 'Attente Flux', amount: '0.00 $', type: 'Credit', date: '---' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Financier</h2>
        <p className="text-slate-500 font-medium text-sm">Gestion de la trésorerie et des flux de remboursement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="material-mica p-6 rounded-fluent bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-xl shadow-orange-500/20">
               <div className="flex justify-between items-start mb-8">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                     <Wallet className="w-6 h-6" />
                  </div>
                  <DollarSign className="w-5 h-5 opacity-50" />
               </div>
               <p className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-1">Trésorerie Consolidée</p>
               <h3 className="text-3xl font-black tracking-tight">0.00 $</h3>
               <div className="mt-8 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
                  <ArrowUpCircle className="w-3 h-3" />
                  0.0% vs mois dernier
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="fluent-card p-6 border-slate-200">
               <div className="flex justify-between items-start mb-8">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                     <CreditCard className="w-6 h-6" />
                  </div>
                  <PieChart className="w-5 h-5 text-slate-300" />
               </div>
               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Remboursements</p>
               <h3 className="text-3xl font-black tracking-tight text-orange-950">0.00 $</h3>
               <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-rose-500 bg-rose-50 w-fit px-2 py-1 rounded-full border border-rose-100">
                  <ArrowDownCircle className="w-3 h-3" />
                  0.0% de sinistralité
               </div>
            </motion.div>
          </div>

          <div className="material-mica rounded-fluent border border-white/20 overflow-hidden shadow-inner">
             <div className="p-6 border-b border-black/[0.03]">
                <h3 className="text-sm font-bold text-orange-950 uppercase tracking-widest">Transactions Récentes</h3>
             </div>
             <div className="divide-y divide-black/[0.02]">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-4 hover:bg-white/40 transition-all flex items-center justify-between cursor-default group">
                     <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === 'Credit' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                        )}>
                           {tx.type === 'Credit' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                        </div>
                        <div>
                           <p className="text-[13px] font-bold text-orange-950">{tx.user}</p>
                           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{tx.id} • {tx.date}</p>
                        </div>
                     </div>
                     <span className={cn(
                       "text-[14px] font-black tracking-tight",
                       tx.type === 'Credit' ? "text-emerald-600" : "text-rose-600"
                     )}>
                        {tx.amount}
                     </span>
                  </div>
                ))}
             </div>
             <button className="w-full py-4 text-[11px] font-bold text-orange-600 bg-black/[0.01] hover:bg-black/[0.03] transition-colors border-t border-black/[0.03]">
                Exporter au format CSV / SEPA
             </button>
          </div>
        </div>

        <div className="space-y-6">
           <div className="fluent-card p-6 bg-slate-900 border-none">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Budget Commission</h3>
              <div className="mb-6">
                 <div className="flex justify-between items-end mb-2">
                    <p className="text-2xl font-black text-white">0 $ <span className="text-[12px] font-medium text-slate-500">restant</span></p>
                 </div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1.5 }} className="h-full bg-orange-500" />
                 </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                 Le budget de commission courtage est consommé à 0%. Une alerte sera envoyée à 85%.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
