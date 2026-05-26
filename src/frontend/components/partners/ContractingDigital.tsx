/**
 * 📄 Fichier : /src/frontend/components/partners/ContractingDigital.tsx
 * 🎯 Objectif : Conventionnement digital, négociation des délais de paiement, analyse d'abus d'office par IA et signature OTP (H2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSignature, CheckCircle, Clock, AlertTriangle, Play, FileText, 
  Settings, Key, Check, X, ShieldAlert, Coins, Sparkles, Building2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Agreement {
  id: string;
  providerName: string;
  type: string;
  paymentDelay: number; // e.g. 45 (days)
  status: 'Draft' | 'Sent' | 'Signed';
  abusiveClausesCount: number;
}

const MOCK_AGREEMENTS: Agreement[] = [
  { id: 'AGR-101', providerName: 'HJ Hospitals Gombe', type: 'Offre Premium Tier-1', paymentDelay: 45, status: 'Signed', abusiveClausesCount: 0 },
  { id: 'AGR-102', providerName: 'Clinique Ngaliema', type: 'Offre Standard Régulée', paymentDelay: 60, status: 'Sent', abusiveClausesCount: 1 },
  { id: 'AGR-103', providerName: 'Centre Médical de Kinshasa (CMK)', type: 'Barèmes Actes Fixes', paymentDelay: 30, status: 'Draft', abusiveClausesCount: 2 }
];

export const ContractingDigital: React.FC = () => {
  const [agreements, setAgreements] = useState<Agreement[]>(MOCK_AGREEMENTS);
  const [selectedAgr, setSelectedAgr] = useState<Agreement | null>(null);

  // Negotiation states
  const [currentDelay, setCurrentDelay] = useState<number>(45);
  const [showOtpSignature, setShowOtpSignature] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Signing flow triggered
  const handleStartSignature = () => {
    setShowOtpSignature(true);
    setEnteredOtp('');
    setOtpError('');
    setOtpSuccess(false);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === '123456') {
      setOtpSuccess(true);
      setTimeout(() => {
        if (selectedAgr) {
          setAgreements(prev => prev.map(a => a.id === selectedAgr.id ? { 
            ...a, 
            status: 'Signed',
            paymentDelay: currentDelay 
          } : a));
          setSelectedAgr(prev => prev ? { ...prev, status: 'Signed', paymentDelay: currentDelay } : null);
        }
        setShowOtpSignature(false);
      }, 1500);
    } else {
      setOtpError('Code OTP invalide. Veuillez saisir "123456" de démonstration.');
    }
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Conventions nègociées", value: "48 hôpitaux", desc: "Signés via plateforme", color: "text-emerald-700" },
          { label: "Délai Payement Moyen", value: "42.4 jours", desc: "Cible contractuelle 45j", color: "text-indigo-700" },
          { label: "Contrôles clauses AI active", value: "100%", desc: "Scan automatique des PDF", color: "text-amber-700" }
        ].map((c, idx) => (
          <div key={idx} className="bg-white border border-slate-150 rounded-[2rem] p-5 shadow-sm space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-bold block">{c.label}</span>
            <p className={cn("text-xl font-black italic", c.color)}>{c.value}</p>
            <p className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Directory/Agreements List */}
        <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-50 flex justify-between items-center">
            <span className="text-xs font-black text-slate-900 uppercase">H2. Liste de Négociations</span>
            <FileSignature className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>

          <div className="space-y-3">
            {agreements.map((a) => (
              <div 
                key={a.id}
                onClick={() => { setSelectedAgr(a); setCurrentDelay(a.paymentDelay); }}
                className={cn(
                  "p-4 rounded-2xl border cursor-pointer transition-all space-y-3",
                  selectedAgr?.id === a.id ? "border-indigo-600 bg-indigo-50/20 shadow-sm" : "border-slate-150 bg-slate-50/40 hover:border-slate-350"
                )}
              >
                <div className="flex justify-between items-center text-[9.5px]">
                  <span className="font-mono text-slate-400 font-black">{a.id}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                    a.status === 'Signed' ? "bg-emerald-100 text-emerald-800" :
                    a.status === 'Sent' ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-650"
                  )}>
                    {a.status === 'Signed' ? 'Sceau Apposé' : a.status === 'Sent' ? 'Envoyé' : 'Brouillon'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase leading-none font-black">{a.providerName}</h4>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">{a.type}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] font-black text-indigo-700">
                  <span>Délai cible: {a.paymentDelay} jours</span>
                  {a.abusiveClausesCount > 0 && (
                    <span className="text-rose-600 flex items-center gap-1 font-bold text-[9px] uppercase">
                      ⚠️ Abus AI: {a.abusiveClausesCount}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Adjudication Panel */}
        <div className="lg:col-span-2">
          {selectedAgr ? (
            <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-6">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[9.5px] font-mono text-indigo-600 font-extrabold uppercase uppercase">Convention active d&apos;établissement</span>
                  <h3 className="text-sm font-black text-slate-1000 uppercase leading-none mt-1">{selectedAgr.providerName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Sceau Digital : Contract {selectedAgr.id}</p>
                </div>

                <div className="flex gap-2">
                  {selectedAgr.status !== 'Signed' && (
                    <button 
                      onClick={handleStartSignature}
                      className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Signer via OTP (QES)
                    </button>
                  )}
                  <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                    Télécharger Accord.pdf
                  </button>
                </div>
              </div>

              {/* H2.2 Payment Delays Negotiations */}
              <div className="space-y-3.5 border p-5 rounded-3xl bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-xs font-black text-slate-900 uppercase">H2.2 Négociation des Délais de Règlement</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 60, 90].map((d) => (
                    <button 
                      disabled={selectedAgr.status === 'Signed'}
                      type="button" 
                      key={d}
                      onClick={() => setCurrentDelay(d)}
                      className={cn(
                        "py-3 rounded-xl border text-[10px] font-black uppercase font-mono tracking-wider transition-all cursor-pointer",
                        currentDelay === d ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                        selectedAgr.status === 'Signed' ? "opacity-60 cursor-not-allowed" : ""
                      )}
                    >
                      {d} Jours Delay
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 font-bold leading-normal uppercase">
                  * Note: Le code de déontologie ARCA préconise 45 jours maximum pour les prestataires de santé RDC.
                </p>
              </div>

              {/* H2.3 AI Clause Analyzer module */}
              <div className="space-y-3.5 border p-5 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-black text-slate-900 uppercase">H2.3 Analyseur de Clauses Légales (IA)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[8.5px] font-mono rounded font-black uppercase tracking-wider">
                    Model: Gemini-Flash-Pro
                  </span>
                </div>

                {selectedAgr.abusiveClausesCount > 0 ? (
                  <div className="p-4 bg-rose-50 border border-rose-220 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-700">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <span className="font-black text-[9.5px] uppercase">🚨 AVERTISSEMENT : CLAUSE ABUSIVE IDENTIFIÉE</span>
                    </div>

                    <div className="text-[11.5px] font-semibold text-rose-900 text-justify leading-relaxed">
                      <p>
                        <span className="font-extrabold text-[12px] underline block mb-1">Clause 14 (Abus de tarification de d&apos;office):</span>
                        &quot;L&apos;établissement de santé s&apos;octroie un droit unilatéral d&apos;outrepasser les limites d&apos;indemnités fixes ARCA sous peine d&apos;un contentieux immédiat.&quot;
                      </p>
                      <p className="mt-2 text-[10.5px] text-rose-800 font-bold italic uppercase">
                        Action Recommandée: Amender la clause avant de signer le document.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-emerald-800 text-[11.5px]">Aucune clause abusive détectée</p>
                      <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed">
                        Le contrat est conforme aux directives contractuelles standards de la Fédération d&apos;Assurances RDC.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 animate-bounce" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-400 uppercase">Aucune convention sélectionnée</h4>
                <p className="text-[11px] text-slate-400 leading-normal max-w-xs font-semibold">
                  Sélectionnez un établissement hospitalier répertorié dans la colonne gauche pour entamer les négociations tarifaires.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ================================================== */}
      {/* OVERLAY SIGNATURE OTP (H2.1)                       */}
      {/* ================================================== */}
      <AnimatePresence>
        {showOtpSignature && selectedAgr && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowOtpSignature(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-150 p-8 space-y-5"
            >
              <div className="flex items-center gap-2 pb-2 border-b">
                <Key className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h4 className="text-xs font-black uppercase text-slate-900">Double Signature OTP de confiance</h4>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700 leading-relaxed text-justify">
                  Afin de signer électroniquement l&apos;accord <span className="font-mono font-bold text-slate-900">{selectedAgr.id}</span> avec un délai de paiement négocié à <span className="font-extrabold text-slate-900">{currentDelay} jours</span>, un code de validation de démonstration a été envoyé.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase font-bold block">Saisir le Code OTP de démo</label>
                    <input 
                      type="text"
                      className="w-full text-center py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-black tracking-[0.3em] outline-none"
                      placeholder="123456"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <span className="text-[9.5px] text-slate-400 italic mt-1 block">Renseignez &quot;123456&quot; pour valider.</span>
                  </div>

                  {otpError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-220 text-rose-800 text-[10.5px] font-bold rounded">
                      {otpError}
                    </div>
                  )}

                  {otpSuccess && (
                     <div className="p-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 text-[10.5px] font-black text-center uppercase tracking-wider rounded">
                       ✓ Signature Apposée avec Succès !
                     </div>
                  )}

                  <div className="pt-3 border-t flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowOtpSignature(false)}
                      className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-black text-[9.5px] uppercase"
                    >
                      Bannir
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[9.5px] uppercase"
                    >
                      Certifier l&apos;accord
                    </button>
                  </div>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
