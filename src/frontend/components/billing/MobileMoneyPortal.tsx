/**
 * 📄 Fichier : /src/frontend/components/billing/MobileMoneyPortal.tsx
 * 🎯 Objectif : Panel de contrôle temps réel des flux M-Pesa / Orange Money, relances et échecs (D2).
 */
import React, { useState } from 'react';
import { 
  Smartphone, CreditCard, Zap, ArrowRight, ShieldCheck, 
  Send, RefreshCcw, CheckCircle2, Lock, X, Play, RefreshCw, AlertOctagon, Info, Eye
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface MobileMoneyTx {
  id: string;
  phone: string;
  operator: 'M-Pesa' | 'Orange Money' | 'Airtel Money';
  amountUsd: number;
  amountCdf: number;
  timestamp: string;
  status: 'Succès' | 'Échec' | 'En attente';
  payloadDump?: string;
}

const INITIAL_TXS: MobileMoneyTx[] = [
  { id: 'MOMO-77218', phone: '+243 812 458 909', operator: 'M-Pesa', amountUsd: 150, amountCdf: 420000, timestamp: '2026-05-25 15:30', status: 'Succès' },
  { id: 'MOMO-11928', phone: '+243 973 112 400', operator: 'Orange Money', amountUsd: 45, amountCdf: 126000, timestamp: '2026-05-25 16:15', status: 'Échec', payloadDump: '{"error": "AUTHENTICATION_TIMEOUT", "vendor_code": "503", "gateway": "OrangeCD"}' },
  { id: 'MOMO-90221', phone: '+243 821 990 041', operator: 'Airtel Money', amountUsd: 1200, amountCdf: 3360000, timestamp: '2026-05-25 16:32', status: 'En attente' },
  { id: 'MOMO-40422', phone: '+243 811 042 331', operator: 'M-Pesa', amountUsd: 50, amountCdf: 140000, timestamp: '2026-05-25 14:00', status: 'Échec', payloadDump: '{"error": "INSUFFICIENT_FUNDS", "vendor_code": "402", "gateway": "MpesaVodacomCD"}' }
];

export const MobileMoneyPortal: React.FC = () => {
  const [operator, setOperator] = useState<'M-Pesa' | 'Orange Money' | 'Airtel Money'>('M-Pesa');
  const [phoneInput, setPhoneInput] = useState('812458909');
  const [amountInput, setAmountInput] = useState('45');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mobile Money transaction logs state
  const [transactions, setTransactions] = useState<MobileMoneyTx[]>(INITIAL_TXS);
  
  // Details Modal
  const [selectedTxForAudit, setSelectedTxForAudit] = useState<MobileMoneyTx | null>(null);

  // Success Feedback
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Pay initiation
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !amountInput) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newTx: MobileMoneyTx = {
        id: `MOMO-${Math.floor(10000 + Math.random() * 90000)}`,
        phone: `+243 ${phoneInput}`,
        operator,
        amountUsd: Number(amountInput),
        amountCdf: Number(amountInput) * 2800,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Succès'
      };
      setTransactions([newTx, ...transactions]);
      showToast(`Push USSD envoyé avec succès au numéro ${newTx.phone}. Transaction acceptée par la passerelle ${operator}.`);
    }, 1500);
  };

  // Retry failed payment
  const handleRetryTransaction = (txId: string) => {
    showToast(`Re-tentative d'envoi du push USSD pour la transaction ${txId}...`);
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        return { ...tx, status: 'Succès' }; // transition safely to Success after retry
      }
      return tx;
    }));
  };

  return (
    <div className="space-y-6">

      {/* Floating Alert Messages */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Mobile Money Gateway</p>
              <p className="text-xs text-slate-350 font-bold mt-1 leading-relaxed">{toast}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form panel left */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase italic">Initier USSD Push</h4>
          </div>

          <form onSubmit={handleInitiatePayment} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Réseau Opérateur</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'M-Pesa', color: 'border-red-500 text-red-600' },
                  { name: 'Orange Money', color: 'border-orange-500 text-orange-600' },
                  { name: 'Airtel Money', color: 'border-rose-500 text-rose-600' }
                ].map(op => (
                  <button
                    type="button"
                    key={op.name}
                    onClick={() => setOperator(op.name as any)}
                    className={cn(
                      "py-2 text-[9px] font-black text-center rounded-xl border-2 transition-all cursor-pointer",
                      operator === op.name ? op.color : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                    )}
                  >
                    {op.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Numéro de Mobile (+243)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">+243</span>
                <input 
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="812458909"
                  className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Montant USD ($)</label>
              <input 
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="45"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none"
                required
              />
              <p className="text-[8px] text-slate-400 font-bold italic">Équivaut à: {(Number(amountInput) * 2800).toLocaleString('fr-CD')} CDF (Taux standard 2800)</p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-slate-900/15 cursor-pointer"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-indigo-400" />}
              <span>Lancer le débit mobile</span>
            </button>
          </form>
        </div>

        {/* Real-time transaction list right column (D2 requirement) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50">
            <span className="text-xs font-black text-slate-900 uppercase">File des Transactions Mobile Money</span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black italic border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> GATEWAY LIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans col-auto">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[8.5px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-3 px-4">ID Transaction</th>
                  <th className="py-3 px-4">Opérateur</th>
                  <th className="py-3 px-4">N° Téléphone</th>
                  <th className="py-3 px-4 text-right">Montant USD</th>
                  <th className="py-3 px-4 text-right">Montant CDF</th>
                  <th className="py-3 px-4">Horodatage</th>
                  <th className="py-3 px-4">Statut actif</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-800">{tx.id}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8.5px] font-black text-white uppercase",
                        tx.operator === 'M-Pesa' ? "bg-red-600" : tx.operator === 'Orange Money' ? "bg-orange-500" : "bg-rose-600"
                      )}>
                        {tx.operator}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600 font-mono">{tx.phone}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">{tx.amountUsd.toLocaleString()}$</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-450 font-mono">{(tx.amountCdf).toLocaleString()} CDF</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{tx.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                        tx.status === 'Succès' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        tx.status === 'Échec' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1.5 justify-center">
                        {tx.status === 'Échec' && (
                          <>
                            <button 
                              onClick={() => handleRetryTransaction(tx.id)}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer"
                              title="Réessayer l'envoi USSD push"
                            >
                              Réessayer
                            </button>
                            {tx.payloadDump && (
                              <button 
                                onClick={() => setSelectedTxForAudit(tx)}
                                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                                title="Inspecter l'erreur d'API opérateur"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                        {tx.status === 'En attente' && (
                          <button 
                            onClick={() => showToast(`Vérification du statut de la transaction ${tx.id} auprès du tiers payant...`)}
                            className="p-1 text-indigo-600 animate-spin"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================= */}
      {/* MOBILE MONEY ERRORS INSPECT DIALOG        */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedTxForAudit && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTxForAudit(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-rose-100 flex items-center gap-3 bg-rose-50/50">
                <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center border border-rose-200 text-rose-600 shadow-sm shrink-0">
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-rose-950 uppercase italic tracking-tight">Audit Payload Opérateur</h3>
                  <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest leading-none mt-1">Sondage technique API (D2)</p>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-1 font-bold text-slate-700 text-xs">
                  <p className="uppercase text-[9px] text-slate-400">Détails de transaction</p>
                  <p>Transaction ID : <span className="font-mono">{selectedTxForAudit.id}</span></p>
                  <p>Numéro : {selectedTxForAudit.phone}</p>
                  <p>Montant : {selectedTxForAudit.amountUsd} $ ({selectedTxForAudit.amountCdf.toLocaleString()} CDF)</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl text-left border border-slate-800 space-y-2">
                  <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest block">API raw payload response JSON</span>
                  <pre className="text-[10px] font-mono font-medium text-amber-500 overflow-x-auto whitespace-pre">
                    {selectedTxForAudit.payloadDump}
                  </pre>
                </div>

                <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
                  Cet audit d’erreur est obligatoire pour les enquêtes de compliance technique d&apos;Adonai. S&apos;il s&apos;agit d&apos;un manque de provision client, celui-ci doit abonder son portefeuille.
                </p>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedTxForAudit(null)}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer"
                >
                  Fermer l&apos;inspecteur
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
