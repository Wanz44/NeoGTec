/**
 * 📄 Fichier : /src/frontend/components/partners/ProviderPortal.tsx
 * 🎯 Objectif : Portail prestataire hospitalier, vérification de QR d'éligibilité, feuille de soins CCAM et calculs de ticket modérateur (H3).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, QrCode, Search, CheckCircle, Scale, Coins, Sparkles,
  LayoutDashboard, FileSpreadsheet, PlusCircle, AlertCircle, RefreshCw, XCircle, FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface InvoiceModel {
  id: string;
  patient: string;
  date: string;
  ccamCode: string;
  totalCost: number;
  ticketModerateur: number; // 10% paid by patient
  status: 'Approuvé' | 'En attente' | 'Sous Revue';
}

const INITIAL_INSTRUCTS: InvoiceModel[] = [
  { id: 'FAC-7811', patient: 'Marie-Claire Mbika', date: '2026-05-25', ccamCode: 'HBQK389', totalCost: 120, ticketModerateur: 12, status: 'Approuvé' },
  { id: 'FAC-7812', patient: 'Isaac Mukendi', date: '2026-05-24', ccamCode: 'ZAAQ002', totalCost: 80, ticketModerateur: 8, status: 'En attente' }
];

export const ProviderPortal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'eligibility' | 'ccam' | 'history'>('overview');
  
  // H3.1 Eligibility Checker states
  const [qrQuery, setQrQuery] = useState('PAT-QR-2026');
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // H3.2 CCAM states
  const [ccamCodeInput, setCcamCodeInput] = useState('HBQK389 (Radiologie Thorax)');
  const [careActCost, setCareActCost] = useState<number>(100);
  const [patientFormName, setPatientFormName] = useState('Marie-Claire Mbika');
  const [sheetSubmitted, setSheetSubmitted] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceModel[]>(INITIAL_INSTRUCTS);

  // Real-time calculations: 10% co-pay ("ticket modérateur" in standard policies)
  const calculatedCoPay = Number((careActCost * 0.1).toFixed(2));
  const calculatedReimbursement = Number((careActCost * 0.9).toFixed(2));

  const handleVerifyEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setEligibilityResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (qrQuery.trim().length > 3) {
        setEligibilityResult({
          valid: true,
          patientName: 'Marie-Claire Mbika',
          policyLimitRemaining: 450, // 450$ left
          copayRatio: '10%',
          insuranceStatus: 'Bénéficiaire Actif',
          msg: 'Éligibilité confirmée. Plafond restant : 450 USD. Quote-part ticket modérateur standard : 10%.'
        });
      } else {
        setEligibilityResult({
          valid: false,
          msg: 'Code QR ou matricule introuvable. Veuillez vérifier l\'accréditation auprès de NeoGTec.'
        });
      }
    }, 1200);
  };

  const handleCcamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: InvoiceModel = {
      id: `FAC-${Math.floor(Math.random() * 9000) + 1000}`,
      patient: patientFormName,
      date: new Date().toISOString().split('T')[0],
      ccamCode: ccamCodeInput,
      totalCost: careActCost,
      ticketModerateur: calculatedCoPay,
      status: 'En attente'
    };

    setInvoices(prev => [created, ...prev]);
    setSheetSubmitted(true);
    setTimeout(() => setSheetSubmitted(false), 3000);

    // reset
    setCareActCost(100);
  };

  return (
    <div className="space-y-6">

      {/* Hospital details cover header */}
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center">
            <Building2 className="w-9 h-9 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-black italic tracking-tight uppercase leading-none">Hôpital HJ Hospitals Gombe</h2>
            <p className="text-[9.5px] text-white/40 font-mono font-black uppercase mt-1">ID Prestataire : PREST-55102 • Agrément ARCA valide</p>
          </div>
        </div>

        <div className="relative z-10 flex gap-2">
          <button 
            onClick={() => setActiveSubTab('ccam')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9.5px] font-black uppercase tracking-wider transition-all"
          >
            Saisie Feuille de Soins (CCAM)
          </button>
        </div>
      </div>

      {/* Inner Subtabs structure */}
      <div className="flex border-b border-slate-150 gap-4">
        {[
          { id: 'overview', label: 'Dashboard Prestataire', icon: LayoutDashboard },
          { id: 'eligibility', label: 'Vérifier Droits Assurés (QR)', icon: QrCode },
          { id: 'ccam', label: 'Saisie CCAM & Calculateur TM', icon: FileSpreadsheet },
          { id: 'history', label: 'Historique Factures', icon: FileText }
        ].map((sb) => (
          <button 
            key={sb.id}
            onClick={() => setActiveSubTab(sb.id as any)}
            className={cn(
              "py-3.5 px-2.5 text-[9.5px] font-black uppercase tracking-wider flex items-center gap-2 border-b-2 hover:text-indigo-600 transition-all",
              activeSubTab === sb.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-400"
            )}
          >
            <sb.icon className="w-4 h-4" />
            {sb.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE DETAILS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >

          {/* VIEW 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-150 p-6 rounded-[2rem] shadow-sm space-y-2">
                <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Encours Factures Reçues</p>
                <p className="text-xl font-black text-slate-900 italic">14,250.00 USD</p>
                <span className="text-[8px] text-[9.5px] text-indigo-600 font-mono font-bold uppercase block">* En attente d&apos;ordonnancement</span>
              </div>
              <div className="bg-white border border-slate-150 p-6 rounded-[2rem] shadow-sm space-y-2">
                <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Quote-part Assuré Globale</p>
                <p className="text-xl font-black text-slate-950 italic">1,425.00 USD</p>
                <span className="text-[9.5px] text-rose-500 font-mono font-bold uppercase block">* 10% de Ticket Modérateur recouvré</span>
              </div>
              <div className="bg-white border border-slate-150 p-6 rounded-[2rem] shadow-sm space-y-2">
                <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Contrôles Qualité NeoGTec</p>
                <p className="text-xl font-black text-emerald-600 italic">Score : 9.8 / 10</p>
                <span className="text-[9.5px] text-emerald-600 font-mono font-bold uppercase block">✓ Statut Gold Partner Actif</span>
              </div>
            </div>
          )}

          {/* VIEW 2: ELIGIBILITY CHECKER */}
          {activeSubTab === 'eligibility' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="pb-2 border-b">
                  <span className="text-xs font-black text-slate-900 uppercase">H3.1 Scan Code QR d&apos;éligibilité</span>
                </div>

                <form onSubmit={handleVerifyEligibility} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Matricule ou Identifiant du Patient</label>
                    <input 
                      type="text"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                      placeholder="PAT-QR-2026"
                      value={qrQuery}
                      onChange={(e) => setQrQuery(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Analyse des droits de l&apos;adhérent...
                      </>
                    ) : (
                      <>
                        Détecter Droits via QR
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2">
                {eligibilityResult ? (
                  <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-xs font-black text-slate-900 uppercase">Diagnostic d&apos;Éligibilité NeoGTec</span>
                      
                      {eligibilityResult.valid ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[8.5px] font-black rounded border border-emerald-150 uppercase tracking-widest">
                          Adhérent Éligible ✓
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[8.5px] font-black rounded border border-rose-150 uppercase tracking-widest">
                          Refus d&apos;éligibilité ✗
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-600 leading-normal space-y-3">
                      {eligibilityResult.valid ? (
                        <>
                          <div className="p-4 bg-slate-50 border rounded-2xl grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[8.5px] font-black text-slate-400 uppercase">Bénéficiaire</p>
                              <p className="text-xs font-black text-slate-900 mt-1 uppercase italic">{eligibilityResult.patientName}</p>
                            </div>
                            <div>
                              <p className="text-[8.5px] font-black text-slate-400 uppercase">Plafond Actuel de Prise en Charge</p>
                              <p className="text-xs font-black text-emerald-600 mt-1">{eligibilityResult.policyLimitRemaining} USD Restant</p>
                            </div>
                          </div>

                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-emerald-800 leading-normal font-semibold">
                              {eligibilityResult.msg} Le dossier de soins peut être édité sans requérir de pré-aut préalable pour les actes courants.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 bg-rose-50 border border-rose-150 rounded-2xl flex items-start gap-2.5 text-rose-800">
                          <XCircle className="w-5 h-5 shrink-0" />
                          <p className="text-[11px] leading-normal font-semibold">
                            {eligibilityResult.msg} L&apos;assuré a épuisé sa marge de prise en charge ou le profil d&apos;accréditation a expiré.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <QrCode className="w-10 h-10 text-slate-350" />
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase">En attente de diagnostic</h4>
                      <p className="text-[10.5px] text-slate-400 max-w-xs font-semibold mt-1">Une fois l&apos;identifiant QR validé, le plateau technique verra les droits de l&apos;adhérent.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* VIEW 3: CCAM SHEET GENERATOR WITH 10% TICKET MODERATEUR */}
          {activeSubTab === 'ccam' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="pb-2 border-b">
                  <span className="text-xs font-black text-slate-900 uppercase">H3.2 Saisie d&apos;actes conventionnés CCAM</span>
                </div>

                <form onSubmit={handleCcamSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase font-bold block">Nom de l&apos;assuré d&apos;éligibilité</label>
                    <input 
                      type="text"
                      className="w-full p-2.5 bg-slate-50 border text-xs font-black text-slate-800 uppercase"
                      value={patientFormName}
                      onChange={(e) => setPatientFormName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase font-bold block">Acte de soin certifié CCAM</label>
                    <select 
                      value={ccamCodeInput}
                      onChange={(e) => setCcamCodeInput(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      <option value="HBQK389 (Radiologie Thorax)">HBQK389 (Radiographie Thorax, face et prothèse)</option>
                      <option value="ZAAQ002 (Consultation Généraliste)">ZAAQ002 (Prise en charge Consultation de Consultation)</option>
                      <option value="ACT-DENTAL-01 (Soins odontologiques)">ACT-DENTAL-01 (Soins Odontologiques et Restauration)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase text-slate-400">
                      <span>Tarif Brut (USD)</span>
                      <span>Modérateur standard : 10%</span>
                    </div>
                    <input 
                      type="number"
                      className="w-full p-2.5 bg-slate-50 border text-xs font-black font-mono text-slate-900 text-right"
                      value={careActCost}
                      onChange={(e) => setCareActCost(Math.max(0, Number(e.target.value)))}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center cursor-pointer"
                  >
                    Soumettre la feuille de soins
                  </button>
                </form>
              </div>

              {/* Real-time split panel (Calculation logic 10%) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                  <div className="pb-2 border-b">
                    <span className="text-xs font-black text-slate-900 uppercase">Quote-part &amp; Ticket Modérateur en Direct (CCAM)</span>
                  </div>

                  {sheetSubmitted && (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 text-center font-black text-xs uppercase rounded-xl animate-pulse">
                      ✓ Feuille de soins CCAM transmise au gestionnaire NeoGTec !
                    </div>
                  )}

                  <div className="space-y-4 text-xs font-semibold text-slate-600 leading-normal">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-3">
                      <div className="flex justify-between items-center py-1">
                        <span>Total brut de l&apos;intervenant :</span>
                        <span className="font-mono text-slate-900 font-extrabold text-xs">{careActCost} USD</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-1 border-t border-dashed">
                        <span className="font-bold flex items-center gap-1.5 text-rose-700">
                          <Coins className="w-4 h-4" /> Quote-part Patient (10% Ticket modérateur) :
                        </span>
                        <span className="font-mono font-black text-rose-600 text-xs">{calculatedCoPay} USD</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-t border-dashed">
                        <span className="font-bold text-slate-900">Total garanti par charge d&apos;assurance (90%) :</span>
                        <span className="font-mono font-extrabold text-indigo-700 text-xs">{calculatedReimbursement} USD</span>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl flex items-start gap-2.5">
                      <Sparkles className="text-indigo-600 w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                      <div>
                        <p className="font-black text-[9.5px] uppercase text-indigo-700">Répartition des Coûts calculés en temps réel :</p>
                        <p className="text-[11px] text-slate-705 font-medium mt-1">
                          Le code CCAM sélectionné applique d&apos;office le barème homologué conventionnel de {careActCost} USD. L&apos;hôpital HJ Hospitals doit collecter immédiatement la quote-part modératrice de {calculatedCoPay} USD auprès du détenteur du QR Code.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 4: HISTORY */}
          {activeSubTab === 'history' && (
            <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-xs font-black text-slate-900 uppercase">H3.3 Journal des facturations envoyées</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {invoices.map((inv) => (
                  <div key={inv.id} className="py-4 flex justify-between items-center hover:bg-slate-50/40 p-2 rounded-xl transition-all">
                    <div>
                      <p className="font-bold text-slate-900 block font-black uppercase text-xs">{inv.patient}</p>
                      <p className="text-[9.5px] font-mono text-slate-400 font-bold uppercase mt-1">Acte: {inv.ccamCode} • Date: {inv.date} • ID: {inv.id}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-slate-900 block text-xs">{inv.totalCost} USD</p>
                      <span className={cn(
                        "text-[8.5px] font-black uppercase tracking-wider",
                        inv.status === 'Approuvé' ? "text-emerald-600" : "text-amber-600"
                      )}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
