/**
 * 📄 Fichier : /src/frontend/components/billing/ContributionsTracker.tsx
 * 🎯 Objectif : Suivi des cotisations par entreprise, relances d'arriérés et enregistrement de paiements (D1).
 */
import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Clock, AlertTriangle, 
  Filter, Search, Download, ArrowUpRight, 
  BarChart3, RefreshCcw, BellRing, Mail, Check, X, CreditCard, Landmark, DollarSign
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface CompanyContribution {
  id: string;
  companyName: string;
  plan: string;
  period: string; // e.g. "Mai 2026"
  amount: number;
  currency: 'USD' | 'CDF' | 'EUR';
  status: 'Payé' | 'Retard' | 'Facturé';
  dueDate: string;
  overdueDays: number;
}

const INITIAL_COMPANY_CONTRIBUTIONS: CompanyContribution[] = [
  { id: 'COT-RAW-101', companyName: 'Rawbank SARL', plan: 'NeoGold Enterprise', period: 'Mai 2026', amount: 12450, currency: 'USD', status: 'Payé', dueDate: '2026-05-05', overdueDays: 0 },
  { id: 'COT-VOD-402', companyName: 'Vodacom RDC', plan: 'NeoGold Supreme', period: 'Mai 2026', amount: 35000, currency: 'USD', status: 'Retard', dueDate: '2026-05-01', overdueDays: 24 },
  { id: 'COT-BRA-909', companyName: 'Bralima SARL', plan: 'Standard Bronze', period: 'Mai 2026', amount: 8200, currency: 'USD', status: 'Facturé', dueDate: '2026-06-01', overdueDays: 0 },
  { id: 'COT-OME-303', companyName: 'Sarl Omega Kinshasa', plan: 'Standard Bronze', period: 'Avril 2026', amount: 4120, currency: 'USD', status: 'Retard', dueDate: '2026-04-10', overdueDays: 45 },
];

export const ContributionsTracker: React.FC = () => {
  const [contributions, setContributions] = useState<CompanyContribution[]>(INITIAL_COMPANY_CONTRIBUTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [compName, setCompName] = useState('Vodacom RDC');
  const [payAmount, setPayAmount] = useState('35000');
  const [payCurrency, setPayCurrency] = useState<'USD' | 'CDF' | 'EUR'>('USD');
  const [payRef, setPayRef] = useState('CHQ-RAW-90223');

  // Interactive Live Toasts
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Reminder trigger
  const handleSendReminder = (company: string, amount: number) => {
    showToast(`Relance récursive envoyée avec succès par Email & SMS au contact RH de "${company}" concernant les ${amount.toLocaleString()} $ d'arriérés.`);
  };

  // Record a payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount) return;

    // Simulate update on corresponding retard company
    setContributions(prev => prev.map(rec => {
      if (rec.companyName.toLowerCase() === compName.toLowerCase() && rec.status !== 'Payé') {
        return { ...rec, status: 'Payé', amount: Number(payAmount), currency: payCurrency, overdueDays: 0 };
      }
      return rec;
    }));

    setIsPayModalOpen(false);
    showToast(`Paiement de ${Number(payAmount).toLocaleString()} ${payCurrency} enregistré avec succès pour l&apos;entreprise ${compName}. Journal comptable balancé.`);
  };

  const filteredCont = contributions.filter(item => 
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-green-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-green-400">Paiement &amp; Relance</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toastMsg}</p>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Taux de Recouvrement (Mai)</p>
            <h4 className="text-3xl font-black text-slate-900 mt-2">82.4%</h4>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="w-[82.4%] h-full bg-green-500 rounded-full" />
          </div>
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Encaissé Échéance</p>
          <h4 className="text-3xl font-black text-green-400 mt-2">124,500 USD</h4>
          <p className="text-[9px] text-slate-400 mt-1 italic">Journal ledger certifié</p>
        </div>

        {/* Alarm thresholds alert widget */}
        <div className="p-6 bg-white border border-rose-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase tracking-widest rounded">
              Arriérés Critiques &gt;30j
            </span>
            <h4 className="text-2xl font-black text-rose-600 mt-2">39,120 USD</h4>
          </div>
          <button 
            onClick={() => showToast("Envoi global d'emails de mise en demeure à 2 entreprises en situation d'impayés...")}
            className="text-[9px] font-black text-rose-600 uppercase tracking-widest hover:underline text-left mt-3 flex items-center gap-1.5"
          >
            <BellRing className="w-3.5 h-3.5" /> Lancer relances globales
          </button>
        </div>
      </div>

      {/* Corporate billing list (D1 requirement) */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Registre des Cotisations par Entreprise</h3>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrer par entreprise..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <button 
            onClick={() => setIsPayModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer outline-none"
          >
            Enregistrer Paiement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans col-auto">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <th className="py-4 px-6">Cotisation par Entreprise</th>
                <th className="py-4 px-6">Formule Contrat</th>
                <th className="py-4 px-6">Période</th>
                <th className="py-4 px-6 text-right">Montant Exigible</th>
                <th className="py-4 px-6">Échéance</th>
                <th className="py-4 px-6">Délai / Seuil</th>
                <th className="py-4 px-6">Statut actif</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredCont.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-extrabold text-slate-900 uppercase">
                    {tx.companyName}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-500">
                    {tx.plan}
                  </td>
                  <td className="py-4 px-6 font-bold uppercase text-[10px] text-slate-400">
                    {tx.period}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-900">
                    {tx.amount.toLocaleString()} {tx.currency}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-400">
                    {tx.dueDate}
                  </td>
                  <td className="py-4 px-6">
                    {tx.overdueDays > 0 ? (
                      <span className="text-rose-600 font-black text-[10px] inline-flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        ⚠️ Retard {tx.overdueDays} jours
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold italic">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border",
                      tx.status === 'Payé' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      tx.status === 'Retard' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-100 text-slate-500 border-slate-200"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {tx.status === 'Retard' && (
                      <button 
                        onClick={() => handleSendReminder(tx.companyName, tx.amount)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                        title="Envoyer une relance par mail et SMS"
                      >
                        <Mail className="w-3.5 h-3.5" /> Relancer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* RECORD PAYMENT MANUAL MODAL (D1)          */}
      {/* ========================================= */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPayModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-1000 uppercase italic">Enregistrer un Paiement</h3>
                </div>
                <button onClick={() => setIsPayModalOpen(false)} className="p-2 text-slate-450 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="p-8 space-y-4">
                <p className="text-xs text-slate-500 italic pb-2">Enregistrement manuel de chèques, virements bancaires reçus ou fonds compensés.</p>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Entreprise débitrice</label>
                  <select 
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-medium"
                  >
                    <option value="Vodacom RDC">Vodacom RDC (Retard de 35,000 $)</option>
                    <option value="Sarl Omega Kinshasa">Sarl Omega Kinshasa (Retard de 4,120 $)</option>
                    <option value="Bralima SARL">Bralima SARL (Facturé - 8,200 $)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Montant payé</label>
                    <input 
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Devise</label>
                    <select 
                      value={payCurrency}
                      onChange={(e) => setPayCurrency(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="CDF">CDF (FC)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Référence du versement (Chèque, Swift, TRSF)</label>
                  <input 
                    type="text"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsPayModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    Enregistrer paiement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
