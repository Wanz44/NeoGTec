/**
 * 📄 Fichier : /src/frontend/components/claims/WorkflowManager.tsx
 * 🎯 Objectif : File d'attente intelligente, Kanban IA Anti-Fraude, et table d'instruction à 3 onglets (G1, G2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitPullRequest, Clock, CheckCircle2, AlertCircle, 
  Search, ShieldAlert, FileText, Check, X, Info,
  Calculator, User, ChevronRight, Play, AlertTriangle, Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClaimItem {
  id: string;
  patientName: string;
  clinic: string;
  treatment: string;
  amount: number;
  requestedAmount: number;
  fraudScore: number;
  slaLeft: string; // e.g. "-1h 45m"
  slaUrgent: boolean;
  status: 'nouveau' | 'instruction' | 'clos';
}

const INITIAL_CLAIMS: ClaimItem[] = [
  { id: 'CLM-0451', patientName: 'Marie Curie Wanzambi', clinic: 'HJ Hospitals Gombe', treatment: 'Radiographie Thoracique face', amount: 50, requestedAmount: 80, fraudScore: 95, slaLeft: '-1h 12m', slaUrgent: true, status: 'nouveau' },
  { id: 'CLM-0452', patientName: 'Isaac Mukendi', clinic: 'Clinique Ngaliema', treatment: 'Consultation Spécialisée Pédiatrie', amount: 30, requestedAmount: 30, fraudScore: 12, slaLeft: '4h 15m', slaUrgent: false, status: 'nouveau' },
  { id: 'CLM-0453', patientName: 'Robert Lelo', clinic: 'Centre de Santé Kisenso', treatment: 'Traitement anti-paludéen Coartem', amount: 15, requestedAmount: 15, fraudScore: 8, slaLeft: '5h 30m', slaUrgent: false, status: 'instruction' },
  { id: 'CLM-0454', patientName: 'Jeanne Kalala', clinic: 'HJ Hospitals Kinshasa', treatment: 'Soin Prothèse Dentaire C01', amount: 50, requestedAmount: 110, fraudScore: 88, slaLeft: '-0h 42m', slaUrgent: true, status: 'instruction' },
];

export const WorkflowManager: React.FC = () => {
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'facture' | 'bareme' | 'historique'>('facture');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [arbitrateToast, setArbitrateToast] = useState<string | null>(null);

  const moveClaim = (claimId: string, newStatus: any) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    if (selectedClaim?.id === claimId) {
      setSelectedClaim(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setArbitrateToast(`Sinistre ${claimId} basculé vers "${newStatus}"`);
    setTimeout(() => setArbitrateToast(null), 3000);
  };

  const handleApprove = (claimId: string) => {
    moveClaim(claimId, 'clos');
    setSelectedClaim(null);
  };

  const handleReject = (claimId: string) => {
    moveClaim(claimId, 'clos');
    setSelectedClaim(null);
  };

  return (
    <div className="space-y-6">

      {/* SLA & Top Statistics Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Sinistres Temps Réel", value: "48 actifs", desc: "Moteur IA en veille", color: "text-indigo-600" },
          { label: "SLA en Souffrance (<2h)", value: "3 dossiers", desc: "Alerte critiques rouges active", color: "text-rose-600" },
          { label: "Fraude Détectée ce jour", value: "2 alertes", desc: "Score Moyen: 84%", color: "text-amber-600" },
          { label: "Taux d'automatisation", value: "81 %", desc: "No-code Rule Engine", color: "text-emerald-600" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-150 rounded-[2rem] p-5 shadow-sm space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">{stat.label}</span>
            <p className={cn("text-xl font-black italic", stat.color)}>{stat.value}</p>
            <p className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">{stat.desc}</p>
          </div>
        ))}
      </div>

      {arbitrateToast && (
        <div className="p-3 bg-indigo-600 text-white font-black text-xs uppercase text-center rounded-xl animate-pulse">
          {arbitrateToast}
        </div>
      )}

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Nouveaux (IA fraud scores analyzed on load) */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-[2.5rem] space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-black text-slate-900 uppercase">1. Nouveaux Sinistres (IA analyze)</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-full font-mono">
              {claims.filter(c => c.status === 'nouveau').length}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {claims.filter(c => c.status === 'nouveau').map((c) => (
              <div 
                key={c.id}
                onClick={() => { setSelectedClaim(c); setActiveInstructionTab('facture'); }}
                className="bg-white border border-slate-150 hover:border-indigo-400 p-4 rounded-2xl shadow-sm cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9.5px] font-semibold text-slate-400 font-mono tracking-tight">{c.id}</span>
                  {c.fraudScore > 80 && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8.5px] font-black uppercase rounded border border-rose-150 animate-pulse">
                      IA Alarme Fraude : {c.fraudScore}%
                    </span>
                  )}
                </div>

                <div>
                  <h5 className="text-[11.5px] font-black text-slate-900 uppercase leading-none group-hover:text-indigo-600 transition-colors">{c.patientName}</h5>
                  <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-1">{c.treatment}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10.5px]">
                  <span className="font-extrabold text-slate-900">{c.requestedAmount} USD</span>
                  
                  {c.slaUrgent ? (
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider animate-pulse">
                      SLA {c.slaLeft}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold font-mono">
                      SLA {c.slaLeft}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Instruction / Workflow */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-[2.5rem] space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-black text-slate-900 uppercase">2. En cours d&apos;instruction</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-full font-mono">
              {claims.filter(c => c.status === 'instruction').length}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {claims.filter(c => c.status === 'instruction').map((c) => (
              <div 
                key={c.id}
                onClick={() => { setSelectedClaim(c); setActiveInstructionTab('facture'); }}
                className="bg-white border border-slate-150 hover:border-indigo-400 p-4 rounded-2xl shadow-sm cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9.5px] font-semibold text-slate-400 font-mono tracking-tight">{c.id}</span>
                  {c.fraudScore > 80 && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8.5px] font-black uppercase rounded border border-rose-150 animate-pulse">
                      IA Alarme : {c.fraudScore}%
                    </span>
                  )}
                </div>

                <div>
                  <h5 className="text-[11.5px] font-black text-slate-900 uppercase leading-none group-hover:text-indigo-600 transition-colors">{c.patientName}</h5>
                  <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-1">{c.treatment}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10.5px]">
                  <span className="font-extrabold text-slate-900">{c.requestedAmount} USD</span>
                  <span className="text-rose-600 font-bold bg-rose-50 px-2自动 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider">
                    SLA {c.slaLeft}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Clos / Arbitrés */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-[2.5rem] space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-black text-slate-900 uppercase">3. Décidés / Clos</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-full font-mono">
              {claims.filter(c => c.status === 'clos').length}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {claims.filter(c => c.status === 'clos').map((c) => (
              <div 
                key={c.id}
                className="bg-slate-100 opacity-60 border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3 pointer-events-none"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9.5px] font-semibold text-slate-400 font-mono tracking-tight">{c.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded">
                    Instruction Terminée
                  </span>
                </div>

                <div>
                  <h5 className="text-[11.5px] font-black text-slate-900 uppercase leading-none">{c.patientName}</h5>
                  <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-1">{c.treatment}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-150 text-[10.5px] text-slate-650">
                  <span className="font-extrabold">{c.requestedAmount} USD</span>
                  <span className="font-bold">Clos ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =================================================== */}
      {/* DRAWER FOR CLAIM INSTRUCTION & 3 TABS (G2)          */}
      {/* =================================================== */}
      <AnimatePresence>
        {selectedClaim && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[150] flex justify-end">
            <div className="absolute inset-0 z-0" onClick={() => setSelectedClaim(null)} />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-xl bg-white h-screen shadow-2xl relative z-10 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-mono text-[8px] rounded uppercase font-black">
                    IA Fraud Alert Level: {selectedClaim.fraudScore}%
                  </span>
                  <h4 className="text-sm font-black text-slate-900 uppercase mt-1 leading-none">Instruction du dossier d&apos;assurance</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">ID: {selectedClaim.id} • Émis par {selectedClaim.clinic}</p>
                </div>
                <button onClick={() => setSelectedClaim(null)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-tabs header */}
              <div className="flex border-b border-slate-100 px-6">
                {[
                  { id: 'facture', label: 'Facture & Reçu' },
                  { id: 'bareme', label: 'Règles barème / Contrat' },
                  { id: 'historique', label: 'Historique Assuré' }
                ].map((tb) => (
                  <button 
                    key={tb.id}
                    onClick={() => setActiveInstructionTab(tb.id as any)}
                    className={cn(
                      "flex-1 py-4 text-[9px] font-black uppercase tracking-wider text-center border-b-2 outline-none cursor-pointer transition-colors",
                      activeInstructionTab === tb.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-400 hover:text-indigo-600"
                    )}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* Sub-tabs content */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6 text-xs text-slate-600 font-medium">
                
                {/* TAB 1: FACTURE */}
                {activeInstructionTab === 'facture' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Lignes de facturation extraites</span>
                    
                    <div className="divide-y divide-slate-100 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="py-2.5 flex justify-between">
                        <span>{selectedClaim.treatment}</span>
                        <span className="font-black text-slate-900">{selectedClaim.requestedAmount} USD</span>
                      </div>
                      <div className="py-2.5 flex justify-between font-mono text-[10px] text-slate-400">
                        <span>Taxes d&apos;officine</span>
                        <span>0.00 USD</span>
                      </div>
                      <div className="py-2.5 flex justify-between text-slate-900 font-black pt-3">
                        <span>Total demandé :</span>
                        <span>{selectedClaim.requestedAmount} USD</span>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl flex items-start gap-3">
                      <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-black text-indigo-700 uppercase">Information de garantie :</span>
                        <p className="text-[11px] font-semibold mt-1 text-slate-700 leading-normal">
                          Les polices pré-clippées de NeoGTec ont déterminé une sur-tarification de {selectedClaim.requestedAmount - selectedClaim.amount} USD sur cet acte comparé aux barèmes ARCA.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: RULES BAREME */}
                {activeInstructionTab === 'bareme' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Garanties &amp; Plafonds applicables</span>
                    
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                      <div className="flex justify-between items-center text-[11.5px]">
                        <span className="font-bold">Code Barème Acte :</span>
                        <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded font-black text-slate-700 text-[10px]">RAD-THORAX-01</span>
                      </div>
                      <div className="flex justify-between items-center text-[11.5px]">
                        <span className="font-bold">Plafond maximum autorisé :</span>
                        <span className="font-black text-emerald-600 font-mono">50.00 USD</span>
                      </div>
                      <div className="flex justify-between items-center text-[11.5px]">
                        <span className="font-bold">Dépassement détecté :</span>
                        <span className="font-black text-rose-600 font-mono">+{selectedClaim.requestedAmount - selectedClaim.amount} USD</span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setShowRuleModal(true)}
                      className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center"
                    >
                      Vérifier "Règles appliquées"
                    </button>
                  </div>
                )}

                {/* TAB 3: HISTORIQUE ASSURE */}
                {activeInstructionTab === 'historique' && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Activité récente du bénéficiaire</span>
                    
                    <div className="space-y-3">
                      {[
                        { date: '12/05/2026', clinic: 'HJ Hospitals', act: 'Consultation Spécialisée', cost: '30 USD', status: 'Payé' },
                        { date: '04/05/2026', clinic: 'Pharmacie Victoire', act: 'Achat Amoxicilline', cost: '12 USD', status: 'Payé' }
                      ].map((item, id) => (
                        <div key={id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] font-mono text-slate-400 font-black uppercase">{item.date} • {item.clinic}</p>
                            <p className="text-[11px] font-black text-slate-800 mt-1 uppercase">{item.act}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-slate-900 text-xs block">{item.cost}</span>
                            <span className="text-[8px] font-black uppercase text-emerald-600">{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer actions footer */}
              <div className="p-8 border-t border-slate-150 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => moveClaim(selectedClaim.id, 'instruction')}
                  className="flex-1 py-4 border border-slate-200 hover:border-slate-350 bg-white text-slate-700 font-black text-[10px] uppercase rounded-xl"
                >
                  Mettre en instruction
                </button>

                <button 
                  onClick={() => handleReject(selectedClaim.id)}
                  className="px-5 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase rounded-xl"
                >
                  Rejeter Sinistre
                </button>

                <button 
                  onClick={() => handleApprove(selectedClaim.id)}
                  className="px-5 py-4 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase rounded-xl"
                >
                  Approuver &amp; Régler
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* MINI MODAL EXPLAINER RULES APPLIED (G2)             */}
      {/* =================================================== */}
      <AnimatePresence>
        {showRuleModal && selectedClaim && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowRuleModal(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-150 p-8 space-y-4"
            >
              <div className="flex items-center gap-2 text-rose-600 pb-2 border-b">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                <h4 className="text-xs font-black uppercase italic">Moteur de tarification contractuel : Règles appliquées</h4>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-755 text-justify">
                <p>
                  Calcul de la régularisation du sinistre <span className="font-mono text-slate-900 font-bold">#{selectedClaim.id}</span>:
                </p>

                <div className="p-3 bg-rose-50 text-rose-800 border-l-4 border-rose-600 rounded">
                  <span className="font-extrabold text-[10.5px]">Platitude de barème ARCA - Acte Plafonné:</span>
                  <p className="text-[11.5px] font-mono mt-1 text-rose-900 font-bold">
                    Barème Contractuel max: 50.00 USD. Montant sollicité par HJ Hospitals: 80.00 USD.
                  </p>
                </div>

                <p className=" leading-relaxed">
                  Le système NeoGTec refuse d&apos;office le dépassement illégal de {selectedClaim.requestedAmount - selectedClaim.amount} USD. L&apos;assuré Marie-Claire Mbika conserve la responsabilité du supplément si sa police n&apos;est pas optionnelle.
                </p>
              </div>

              <button 
                onClick={() => setShowRuleModal(false)}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center cursor-pointer"
              >
                Compris
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
