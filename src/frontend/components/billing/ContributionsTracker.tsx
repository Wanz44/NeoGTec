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
  period: string;
  amount: number;
  currency: 'USD' | 'CDF' | 'EUR';
  status: 'Payé' | 'Retard' | 'Facturé';
  dueDate: string;
  overdueDays: number;
}

export interface CotisationItem {
  id: string;
  entreprise: string;
  periode: string;
  montantDu: number;
  montantPaye: number;
  statut: 'DUE' | 'PAYEE';
  clientAssure: string;
}

export interface PaiementItem {
  id: string;
  cotisationId: string;
  entreprise: string;
  montant: number;
  date: string;
}

const INITIAL_COMPANY_CONTRIBUTIONS: CompanyContribution[] = [
  { id: 'COT-RAW-101', companyName: 'Rawbank SARL', plan: 'NeoGold Enterprise', period: 'Mai 2026', amount: 12450, currency: 'USD', status: 'Payé', dueDate: '2026-05-05', overdueDays: 0 },
  { id: 'COT-VOD-402', companyName: 'Vodacom RDC', plan: 'NeoGold Supreme', period: 'Mai 2026', amount: 35000, currency: 'USD', status: 'Retard', dueDate: '2026-05-01', overdueDays: 24 },
  { id: 'COT-BRA-909', companyName: 'Bralima SARL', plan: 'Standard Bronze', period: 'Mai 2026', amount: 8200, currency: 'USD', status: 'Facturé', dueDate: '2026-06-01', overdueDays: 0 },
  { id: 'COT-OME-303', companyName: 'Sarl Omega Kinshasa', plan: 'Standard Bronze', period: 'Avril 2026', amount: 4120, currency: 'USD', status: 'Retard', dueDate: '2026-04-10', overdueDays: 45 },
];

const INITIAL_COTISATIONS: CotisationItem[] = [
  { id: 'COT-001', entreprise: 'Rawbank SARL', periode: 'Mai 2026', montantDu: 12450, montantPaye: 12450, statut: 'PAYEE', clientAssure: 'Jean-Pierre Bemba' },
  { id: 'COT-002', entreprise: 'Vodacom RDC', periode: 'Mai 2026', montantDu: 35000, montantPaye: 0, statut: 'DUE', clientAssure: 'Marie-Claire Mbika' },
  { id: 'COT-003', entreprise: 'Bralima SARL', periode: 'Mai 2026', montantDu: 8200, montantPaye: 8200, statut: 'PAYEE', clientAssure: 'Albert Tshimanga' },
  { id: 'COT-004', entreprise: 'Sarl Omega Kinshasa', periode: 'Avril 2026', montantDu: 4120, montantPaye: 0, statut: 'DUE', clientAssure: 'Sarah Luzolo' },
];

const INITIAL_PAIEMENTS: PaiementItem[] = [
  { id: 'PAY-001', cotisationId: 'COT-001', entreprise: 'Rawbank SARL', montant: 12450, date: '2026-05-05' },
  { id: 'PAY-003', cotisationId: 'COT-003', entreprise: 'Bralima SARL', montant: 8200, date: '2026-05-15' },
];

export const ContributionsTracker: React.FC = () => {
  const [contributions, setContributions] = useState<CompanyContribution[]>(INITIAL_COMPANY_CONTRIBUTIONS);
  const [cotisations, setCotisations] = useState<CotisationItem[]>(INITIAL_COTISATIONS);
  const [paiements, setPaiements] = useState<PaiementItem[]>(INITIAL_PAIEMENTS);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters for Cotisations
  const [entrepriseFilter, setEntrepriseFilter] = useState('Toutes');
  const [clientFilter, setClientFilter] = useState('Tous');

  // Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedCotisation, setSelectedCotisation] = useState<CotisationItem | null>(null);
  
  // Modal Inputs
  const [payAmount, setPayAmount] = useState('35000');
  const [payDate, setPayDate] = useState('2026-05-24');

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

  // Open modal for specific cotisation
  const openPaymentModal = (cot: CotisationItem) => {
    setSelectedCotisation(cot);
    setPayAmount((cot.montantDu - cot.montantPaye).toString());
    setPayDate(new Date().toISOString().split('T')[0]);
    setIsPayModalOpen(true);
  };

  // Submit recorded payment
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCotisation || !payAmount || !payDate) return;

    const amountNum = Number(payAmount);

    // Update cotisations state
    setCotisations(prev => prev.map(c => {
      if (c.id === selectedCotisation.id) {
        const nextPay = c.montantPaye + amountNum;
        const nextStatut = nextPay >= c.montantDu ? 'PAYEE' : 'DUE';
        return {
          ...c,
          montantPaye: nextPay,
          statut: nextStatut
        };
      }
      return c;
    }));

    // Create a line in payments log
    const newPaiement: PaiementItem = {
      id: 'PAY-' + Math.floor(1000 + Math.random() * 9000),
      cotisationId: selectedCotisation.id,
      entreprise: selectedCotisation.entreprise,
      montant: amountNum,
      date: payDate
    };
    setPaiements(prev => [newPaiement, ...prev]);

    setIsPayModalOpen(false);
    showToast(`Paiement de ${amountNum.toLocaleString()} $ enregistré pour l'entreprise ${selectedCotisation.entreprise}. Cotisation mise à jour.`);
  };

  // Filter cotisations list
  const filteredCotisations = cotisations.filter(c => {
    const matchesEntreprise = entrepriseFilter === 'Toutes' || c.entreprise === entrepriseFilter;
    const matchesClient = clientFilter === 'Tous' || c.clientAssure === clientFilter;
    return matchesEntreprise && matchesClient;
  });

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

      {/* ======================================================= */}
      {/* SECTION : SUIVI DE COTISATIONS (Point 2.1 & 2.2)         */}
      {/* ======================================================= */}
      <div className="bg-white border border-slate-150 rounded-[2.5rem] shadow-sm overflow-hidden space-y-4">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase italic">Suivi de cotisations</h3>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Filtres et registre des paiements échus</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filtre Entreprise */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Entreprise:</span>
              <select
                value={entrepriseFilter}
                onChange={(e) => setEntrepriseFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Toutes">Toutes</option>
                {Array.from(new Set(cotisations.map(c => c.entreprise))).map(ent => (
                  <option key={ent} value={ent}>{ent}</option>
                ))}
              </select>
            </div>

            {/* Filtre Client/Assuré */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Client/Assuré:</span>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="Tous">Tous</option>
                {Array.from(new Set(cotisations.map(c => c.clientAssure))).map(cli => (
                  <option key={cli} value={cli}>{cli}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <th className="py-4 px-6">Entreprise</th>
                <th className="py-4 px-6">Client / Assuré</th>
                <th className="py-4 px-6">Période</th>
                <th className="py-4 px-6 text-right">Montant dû</th>
                <th className="py-4 px-6 text-right">Montant payé</th>
                <th className="py-4 px-6 text-center">Statut</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCotisations.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-extrabold text-slate-900 uppercase">{c.entreprise}</td>
                  <td className="py-4 px-6 font-semibold text-slate-600">{c.clientAssure}</td>
                  <td className="py-4 px-6 font-bold text-slate-400 uppercase text-[10px]">{c.periode}</td>
                  <td className="py-4 px-6 text-right font-black text-slate-900">{c.montantDu.toLocaleString()} $</td>
                  <td className="py-4 px-6 text-right font-black text-green-600">{c.montantPaye.toLocaleString()} $</td>
                  <td className="py-4 px-6 text-center">
                    <span className={cn(
                      "px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border",
                      c.statut === 'PAYEE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {c.statut === 'PAYEE' ? 'PAYÉE' : 'DUE'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {c.statut !== 'PAYEE' && (
                      <button 
                        onClick={() => openPaymentModal(c)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Enregistrer paiement
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================= */}
      {/* HISTORIQUE DES PAIEMENTS LOGS (Point 2.4)                */}
      {/* ======================================================= */}
      <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Journal des Paiements</h4>
          <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Historique des transactions d'encaissement de cotisations</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <th className="py-3 px-4">Ref Paiement</th>
                <th className="py-3 px-4">Entreprise</th>
                <th className="py-3 px-4 text-right">Montant Encaissé</th>
                <th className="py-3 px-4 text-center">Date versement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {paiements.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                  <td className="py-3 px-4 font-extrabold uppercase text-slate-800">{p.entreprise}</td>
                  <td className="py-3 px-4 text-right font-black text-[#00A86B]">{p.montant.toLocaleString()} $</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* RECORD PAYMENT MANUAL MODAL (Point 2.3)   */}
      {/* ========================================= */}
      <AnimatePresence>
        {isPayModalOpen && selectedCotisation && (
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
              className="relative bg-white rounded-[2.5rem] border border-slate-150 w-full max-w-md overflow-hidden shadow-2xl"
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

              <form onSubmit={handleRecordPaymentSubmit} className="p-8 space-y-4">
                <p className="text-xs text-slate-500 italic pb-2">Veuillez renseigner le montant perçu et la date effective pour clôturer la cotisation de <strong>{selectedCotisation.entreprise}</strong>.</p>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Montant payé ($)</label>
                  <input 
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Date de versement</label>
                  <input 
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white"
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
                    Valider le Paiement
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
