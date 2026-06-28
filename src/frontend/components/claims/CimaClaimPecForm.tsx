/**
 * 📄 Fichier : /src/frontend/components/claims/CimaClaimPecForm.tsx
 * 🎯 Objectif : Formulaire médical de Prise en Charge (PEC) & de Liquidation CIMA (Art 17-19) en 6 étapes.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, ClipboardList, ShieldAlert, Award, CreditCard, BarChart4,
  Check, X, Search, Plus, Calendar, AlertTriangle, FileDown, HeartPulse, Sparkles,
  ChevronRight, ArrowRight, ArrowLeft, RefreshCw, Layers
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { cn } from '../../lib/utils';

interface CimaClaimPecFormProps {
  onBackToClaimsList?: () => void;
}

// Diagnostic CIM-10 nomenclature pour l'autocomplétion
const CIM10_NOME = [
  { code: 'B50.9', label: 'B50.9 - Paludisme / Malaria grave à Plasmodium falciparum', apRequis: false },
  { code: 'A01.0', label: 'A01.0 - Fièvre typhoïde', apRequis: false },
  { code: 'O80.9', label: 'O80.9 - Accouchement par voie basse (Maternité)', apRequis: true },
  { code: 'H52.1', label: 'H52.1 - Myopie réfractive (Soins Optiques)', apRequis: true },
  { code: 'K02.9', label: 'K02.9 - Carie dentaire avec exposition pulpaire (Dentaire)', apRequis: true },
  { code: 'I10', label: 'I10 - Hypertension artérielle essentielle', apRequis: false }
];

export const CimaClaimPecForm: React.FC<CimaClaimPecFormProps> = ({ onBackToClaimsList }) => {
  const { logAction } = useApp();
  const [step, setStep] = useState(1);
  const [pecId, setPecId] = useState('PEC-' + Math.floor(100000 + Math.random() * 900000));
  
  // -------------------------------------------------------------
  // STATE VARIABLE DECLARATIONS
  // -------------------------------------------------------------
  
  // Étape 1 : Scan QR & Identification Assuré
  const [barcodeSearch, setBarcodeSearch] = useState('CD-NG-0001-S'); // Adonai Lutonadio
  const [isValidatingBarcode, setIsValidatingBarcode] = useState(false);
  const [scannedBeneficiary, setScannedBeneficiary] = useState<any>(null);
  const [qrValidBadge, setQrValidBadge] = useState(false);

  // Étape 2 : Diagnostic CIM-10 & Prestataire
  const [diagSearch, setDiagSearch] = useState('');
  const [selectedDiag, setSelectedDiag] = useState<any>(null);
  const [clinique, setClinique] = useState('Hôpital CMK Gombe Kinshasa');
  const [medecin, setMedecin] = useState('Dr. Michel Kabeya');
  const [dateSoin, setDateSoin] = useState(new Date().toISOString().split('T')[0]);
  const [billAmount, setBillAmount] = useState(650);
  const [dateAlertHorseDelai, setDateAlertHorseDelai] = useState(false);

  // Étape 3 : Accord Préalable (AP) Actuariel
  const [medecinConseilOk, setMedecinConseilOk] = useState(false);
  const [medecinConseilNom, setMedecinConseilNom] = useState('Dr. Jean-Jacques Muyembe');
  const [medecinConseilComment, setMedecinConseilComment] = useState('Diagnostic validé cliniquement. Factures honoraires conformes.');
  const [isAPRequired, setIsAPRequired] = useState(false);

  // Étape 4 : Calculateur & Liquidation Métier (Plafonds / Tickets modérateurs)
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [logsInserted, setLogsInserted] = useState<any[]>([]);

  // Étape 5 : Règlement Clearing J+1
  const [paymentChannel, setPaymentChannel] = useState<'M-Pesa' | 'AirtelMoney' | 'OrangeMoney' | 'ClearingBank'>('ClearingBank');
  const [clearingBatchId, setClearingBatchId] = useState('');
  const [isClearingDispatched, setIsClearingDispatched] = useState(false);

  // Étape 6 : Suivi SLA 48h & Recours
  const [slaCountdownHours, setSlaCountdownHours] = useState(48); // SLA 48h ticking countdown

  // -------------------------------------------------------------
  // CORE METIER LOGIC INTERPRETER (CIMA Art. 17-19)
  // -------------------------------------------------------------

  // Étape 1 : Simulation de scans de QR codes
  const handleValidateBeneficiary = () => {
    if (!barcodeSearch) return;
    setIsValidatingBarcode(true);
    setTimeout(() => {
      // Find or simulate beneficiary Adonai or Sabrina
      if (barcodeSearch.toLowerCase().includes('0001') || barcodeSearch.toLowerCase().includes('adonai')) {
        setScannedBeneficiary({
          name: 'Adonai Lutonadio',
          matricule: 'CD-NG-0001-S',
          plan: 'Gold Plus',
          company: 'NeoGTec SA',
          cumulativeCons: 2450, // Cumulative yearly consumption
          ceilingYear: 15000,
          status: 'ACTIF'
        });
        setQrValidBadge(true);
        if (logAction) logAction('VALIDATION_QR_CODE_PEC', `QR code de CD-NG-0001-S d'Adonai Lutonadio validé via protocole de cryptage.`, 'SUCCESS');
      } else {
        setScannedBeneficiary({
          name: 'Sabrina Wanzambi',
          matricule: 'CD-NG-9820-A',
          plan: 'Premium Policy',
          company: 'Acme Congo',
          cumulativeCons: 1210,
          ceilingYear: 5000,
          status: 'ACTIF'
        });
        setQrValidBadge(true);
        if (logAction) logAction('VALIDATION_QR_CODE_PEC', `QR code de CD-NG-9820-A de Sabrina Wanzambi validé.`, 'SUCCESS');
      }
      setIsValidatingBarcode(false);
    }, 1000);
  };

  // Étape 2 : CIM-10 Diagnostic trigger
  const handleSelectDiag = (diag: any) => {
    setSelectedDiag(diag);
    setDiagSearch(diag.label);
    
    // Check if diagnostic or bill total requires automatic Medical Prior Accord (AP)
    const needsAP = diag.apRequis || billAmount > 500;
    setIsAPRequired(needsAP);
    
    if (logAction) logAction('DIAGNOSTIC_CIM10_SELECTIONNE', `Nomenclature CIM-10 : ${diag.code} sélectionnée pour la PEC.`, 'SUCCESS');
  };

  // Validation restriction date - si date soin > 5 jours, alors HORS_DELAI (Art. 17 CIMA)
  const handleDateSoinChange = (valStr: string) => {
    setDateSoin(valStr);
    const chosenDate = new Date(valStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - chosenDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 5) {
      setDateAlertHorseDelai(true);
      if (logAction) logAction('DATE_SOIN_HORS_DELAI', `Alerte: La date de soin introduite remonte à plus de 5 jours. Flag automatique HORS_DELAI.`, 'WARNING');
    } else {
      setDateAlertHorseDelai(false);
    }
  };

  // Étape 4: Calcul et validation de liquidation de la PEC
  const handleComputeLiquidation = () => {
    if (!scannedBeneficiary || !selectedDiag) return;
    
    // Core engine: Part Assureur & Ticket modérateur
    const supportRate = scannedBeneficiary.plan === 'Gold Plus' ? 0.8 : 0.7; // Part assureur standard de 80% ou 70%
    const chargeAssureur = billAmount * supportRate;
    const ticketModerateurPart = billAmount * (1 - supportRate);
    
    // Check remaining ceiling cap
    const remainingCap = scannedBeneficiary.ceilingYear - scannedBeneficiary.cumulativeCons;
    const finalPartAssureur = chargeAssureur > remainingCap ? remainingCap : chargeAssureur;
    const isExceededOvercap = chargeAssureur > remainingCap;

    const data = {
      billAmount,
      supportPercent: supportRate * 100,
      partAssureur: finalPartAssureur,
      partPatient: ticketModerateurPart + (isExceededOvercap ? (chargeAssureur - remainingCap) : 0),
      exceeded: isExceededOvercap,
      remainingCeiling: remainingCap - finalPartAssureur,
      status: dateAlertHorseDelai ? 'HORS_DELAI' : 'APPROUVE_CONFORME'
    };

    setSimulationData(data);

    // Audit trace logging setup - CRITICAL rule: inserting automated audit trail on each liquidation
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      pecId,
      beneficiaire: scannedBeneficiary.name,
      montantFacture: billAmount,
      partAssureur: finalPartAssureur,
      status: data.status
    };
    setLogsInserted([newLog, ...logsInserted]);

    if (logAction) {
      logAction('LOG_PEC_INSERTION', `INSERT INTO pec_logs (pec_id, date, montant, part_assureur, status) VALUES ('${pecId}', today, ${billAmount}, ${finalPartAssureur}, '${data.status}')`, 'SUCCESS');
    }
  };

  // Étape 5: Clearing J+1 simulation triggering
  const handleDispatchClearing = () => {
    setIsClearingDispatched(true);
    const mockBatch = 'CLR-BATCH-' + Math.floor(10000 + Math.random() * 90000);
    setClearingBatchId(mockBatch);
    if (logAction) {
      logAction('CLEARING_DISPATCH_PEC', `Clearing financier J+1 regroupé pour le batch ${mockBatch} envoyé au concentrateur bancaire de Kinshasa.`, 'SUCCESS');
    }
  };


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation Tab */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={onBackToClaimsList}
            className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-slate-800 tracking-wider outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'Administration
          </button>
          
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Référence PEC CIMA :</span>
            <span className="text-xs font-mono font-bold text-slate-800 ml-2">{pecId}</span>
          </div>
        </div>

        {/* 6-Step Stepper Component */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm mb-6 flex overflow-x-auto justify-between gap-1">
          {[
            { s: 1, name: 'RFID / QR Scan', i: QrCode },
            { s: 2, name: 'Diagnostic CLIN', i: HeartPulse },
            { s: 3, name: 'Contrôleur AP', i: ShieldAlert },
            { s: 4, name: 'Liquidation CIMA', i: ClipboardList },
            { s: 5, name: 'Règlement J+1', i: CreditCard },
            { s: 6, name: 'Suivi SLA 48h', i: BarChart4 },
          ].map((item) => {
            const Icon = item.i;
            const isCompleted = item.s < step || isPaid;
            const isActive = item.s === step;
            return (
              <button
                key={item.s}
                onClick={() => {
                  if (item.s <= 4 || scannedBeneficiary) {
                    setStep(item.s);
                  }
                }}
                className={cn(
                  "flex-1 min-w-[120px] flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all outline-none cursor-pointer",
                  isActive ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/10" :
                  isCompleted ? "bg-emerald-50 text-[#00A86B] border-emerald-150" :
                  "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded flex items-center justify-center font-bold text-[10px]",
                  isActive ? "bg-white text-green-600" :
                  isCompleted ? "bg-emerald-100 text-[#00A86B]" :
                  "bg-slate-50 text-slate-400"
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[8px] font-black uppercase opacity-60">Étape {item.s}</div>
                  <div className="text-[10.5px] font-bold leading-none mt-0.5 whitespace-nowrap">{item.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Step Panels Workspace */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* ------------------------------------------------------------- */}
              {/* ETAPE 1 : QR CODE SCAN MOCK */}
              {/* ------------------------------------------------------------- */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900">1. Identification &amp; Validation Carte Assuré (CIMA Art. 13)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Scannez le code QR de la carte d'assuré numérique ou introduisez le matricule d'enrôlement CIMA
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2 text-xs">
                        <span className="block text-slate-450 font-bold uppercase tracking-wider">Scanneur / Matricule CIMA CD-NG-*</span>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={barcodeSearch} 
                            onChange={(e) => setBarcodeSearch(e.target.value)}
                            placeholder="CD-NG-XXXX-X"
                            className="flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:border-green-600 focus:bg-white text-slate-800 font-bold text-xs"
                          />
                          <button 
                            onClick={handleValidateBeneficiary}
                            disabled={isValidatingBarcode}
                            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                          >
                            {isValidatingBarcode ? 'Validation...' : 'Valider'}
                          </button>
                        </div>
                      </div>

                      {/* Display information if scanned */}
                      {scannedBeneficiary && (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4 text-xs">
                          <div className="flex justify-between items-center border-b pb-2.5">
                            <span className="text-slate-400 font-bold uppercase">Assuré identifié :</span>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 font-black rounded-full border border-emerald-150 uppercase text-[9px]">
                              CARTE ACTIVE
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-slate-400 block font-bold uppercase text-[10px]">Nom Complet</span>
                              <span className="block text-slate-800 font-bold text-sm">{scannedBeneficiary.name}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-bold uppercase text-[10px]">Matricule d'enrôlement</span>
                              <span className="block text-slate-800 font-mono font-bold">{scannedBeneficiary.matricule}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-bold uppercase text-[10px]">Police affiliée</span>
                              <span className="block text-slate-800 font-semibold">{scannedBeneficiary.company} ({scannedBeneficiary.plan})</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-bold uppercase text-[10px]">Plafond Annuel consommé</span>
                              <span className="block text-slate-850 font-semibold">{scannedBeneficiary.cumulativeCons.toLocaleString()}$ / {scannedBeneficiary.ceilingYear.toLocaleString()}$</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR scanner visual placeholder */}
                    <div className="w-full md:w-60 h-60 border-2 border-dashed border-slate-350 rounded-2xl bg-slate-50/50 flex flex-col justify-center items-center text-center p-6 shrink-0 relative overflow-hidden group">
                      <QrCode className="w-16 h-16 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Simulateur Caméra QR</span>
                      <span className="text-[9px] text-[#00A86B] font-mono mt-1 font-bold">Protocole de contact AES crypté</span>
                      
                      {/* Laser scanner line simulator */}
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 opacity-60 animate-bounce top-1/2" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!scannedBeneficiary}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                    >
                      Étape Suivante
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* ETAPE 2 : CLINICAL DIAGNOSTIC CIM-10 */}
              {/* ------------------------------------------------------------- */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900">2. Prescription Médicale &amp; Codification CIM-10</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Spécifiez l'Hôpital partenaire, le médecin traitant, et le code de pathologie CIM-10 pour l'autorisation instantanée
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-4">
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Hôpital émetteur de la facture <strong className="text-rose-500">*</strong></span>
                        <input 
                          type="text" 
                          value={clinique} 
                          onChange={(e) => setClinique(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:border-green-600 text-slate-800 font-bold"
                        />
                      </div>
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Médecin signataire <strong className="text-rose-500">*</strong></span>
                        <input 
                          type="text" 
                          value={medecin} 
                          onChange={(e) => setMedecin(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:border-green-600 text-slate-800 font-bold"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Date de l'acte de soin <strong className="text-rose-500">*</strong></span>
                          <input 
                            type="date" 
                            value={dateSoin} 
                            onChange={(e) => handleDateSoinChange(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:border-green-600 text-slate-800 font-bold"
                          />
                        </div>
                        <div>
                          <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Montant de l'ordonnance ($) <strong className="text-rose-500">*</strong></span>
                          <input 
                            type="number" 
                            value={billAmount} 
                            onChange={(e) => setBillAmount(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:border-green-600 text-slate-850 font-bold text-right font-mono"
                          />
                        </div>
                      </div>

                      {/* Flag notification if > 5 days (CIMA constraint) */}
                      {dateAlertHorseDelai && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-start gap-2 leading-relaxed">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            Alerte délai : La déclaration dépasse 5 jours (CIMA Art.17). Le dossier sera marqué AUTOMATIQUEMENT "HORS_DELAI" par l'arbitre.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CIM-10 nomenclature lookup */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                      <span className="block text-slate-450 font-bold uppercase tracking-wider text-[11px]">Codification Pathologie CIM-10 <strong className="text-rose-500">*</strong></span>
                      
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400">
                          <Search className="w-4 h-4" />
                        </span>
                        <input 
                          type="text" 
                          placeholder="Filtre CIM-10 (Malaria, Myopie, Dentaire...)" 
                          value={diagSearch}
                          onChange={(e) => setDiagSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white border rounded-xl text-slate-800 font-semibold outline-none focus:border-green-600"
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {CIM10_NOME.filter(d => d.label.toLowerCase().includes(diagSearch.toLowerCase())).map((diag) => (
                          <button
                            type="button"
                            key={diag.code}
                            onClick={() => handleSelectDiag(diag)}
                            className={cn(
                              "w-full p-2.5 rounded-xl text-left border text-[11px] font-semibold transition-all cursor-pointer block outline-none",
                              selectedDiag?.code === diag.code 
                                ? "bg-white border-green-600 text-slate-900 shadow" 
                                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600"
                            )}
                          >
                            <div>{diag.label}</div>
                            {diag.apRequis && (
                              <span className="text-[9px] text-amber-600 font-mono font-black uppercase tracking-widest mt-1 block">Accord préalable obligatoire par l'Article 18</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase cursor-pointer">Précédent</button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!selectedDiag}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                    >
                      Étape Suivante
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* ETAPE 3 : ACCORD PREALABLE / MEDICAL ADVICE VERIFICATION */}
              {/* ------------------------------------------------------------- */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900">3. Instruction de l'Accord Préalable (Arbitre Médical)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Validation obligatoire des soins optiques, dentaires, maternités, ou factures supérieures à 500$ par le Conseil Clinique
                    </p>
                  </div>

                  {isAPRequired ? (
                    <div className="space-y-6 text-xs">
                      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl flex items-start gap-3 font-semibold leading-relaxed">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          L'acte d'ordonnance requis ({selectedDiag?.label}) ou le montant brut ({billAmount}$) nécessite légalement un ACCORD PRÉALABLE du Contrôleur (Article 18 CIMA).
                          La liquidation est BLOQUÉE tant que l'autorisation médicale n'est pas scellée par l'arbitre conseil.
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Interface de visa médecin Conseil de garde</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Médecin instructeur conseil</span>
                            <input 
                              type="text" 
                              value={medecinConseilNom} 
                              onChange={(e) => setMedecinConseilNom(e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border rounded-xl outline-none focus:border-amber-500 text-slate-800 font-bold"
                            />
                          </div>

                          <div className="flex items-end pb-1.5">
                            <label className="flex items-center gap-2.5 p-2 bg-white border border-slate-250 rounded-xl cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={medecinConseilOk} 
                                onChange={(e) => setMedecinConseilOk(e.target.checked)}
                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 outline-none" 
                              />
                              <span className="font-extrabold text-slate-750 uppercase text-[10.5px]">Apposer le VISA de Prise en charge (Accord Accordé)</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Décision Motivant l'Autorisation</span>
                          <textarea 
                            rows={2} 
                            value={medecinConseilComment} 
                            onChange={(e) => setMedecinConseilComment(e.target.value)}
                            className="w-full text-xs p-3 bg-white border rounded-xl outline-none focus:border-amber-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs space-y-4 max-w-md mx-auto">
                      <div className="p-4 bg-emerald-50 rounded-full w-fit mx-auto">
                        <Check className="w-8 h-8 text-[#00A86B]" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">Accord Préalable non requis</h4>
                      <p className="text-slate-500 leading-relaxed">
                        L'acte choisi ({selectedDiag?.code}) est classé en accès direct à 100% au standard CIMA. Aucune restriction ou validation clinique arbitrale requise.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase cursor-pointer">Précédent</button>
                    <button 
                      onClick={() => setStep(4)}
                      disabled={isAPRequired && !medecinConseilOk}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                    >
                      Étape Suivante
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* ETAPE 4 : CALCUL & LIQUIDATION REPORT OUT */}
              {/* ------------------------------------------------------------- */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900">4. Calcul Actuariel &amp; Arbitrage de Liquidation</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Calculez instantanément la part remboursée par l'assurance et la contribution (ticket modérateur) à réclamer au patient
                    </p>
                  </div>

                  <div className="flex justify-center py-4">
                    <button 
                      onClick={handleComputeLiquidation}
                      className="px-6 py-3 bg-slate-950 hover:bg-black text-[#00A86B] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5 cursor-pointer outline-none"
                    >
                      <Layers className="w-4 h-4" />
                      Calculer la Prise en Charge
                    </button>
                  </div>

                  {simulationData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                        <div className="p-5 bg-slate-50 border rounded-2xl">
                          <span className="text-slate-400 block font-bold uppercase tracking-wider">Montant Ordonnance Brut</span>
                          <span className="block text-2.5xl font-black text-slate-900 mt-1.5 font-mono">{simulationData.billAmount.toLocaleString()} $</span>
                        </div>

                        <div className="p-5 bg-emerald-50/50 border border-emerald-150 rounded-2xl">
                          <span className="text-[#00A86B] block font-black uppercase tracking-wider">Part Assureur (Pris en Charge)</span>
                          <span className="block text-2.5xl font-black text-emerald-600 mt-1.5 font-mono">{simulationData.partAssureur.toLocaleString()} $</span>
                          <span className="text-[10px] text-[#00A86B] font-bold block mt-1">Sera liquidée au réseau CMK Gombe</span>
                        </div>

                        <div className="p-5 bg-slate-50 border rounded-2xl">
                          <span className="text-slate-400 block font-bold uppercase tracking-wider">Ticket Modérateur (Part Patient)</span>
                          <span className="block text-2.5xl font-black text-slate-800 mt-1.5 font-mono">{simulationData.partPatient.toLocaleString()} $</span>
                          <span className="text-[10px] text-slate-450 font-semibold block mt-1">À encaisser lors de l'admission directe</span>
                        </div>
                      </div>

                      {/* Rule audit trace list - Shows simulated DB actions logs on screen */}
                      <div className="bg-slate-900 text-slate-400 p-5 rounded-2xl font-mono text-[10px] space-y-2">
                        <div className="text-white font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
                          <span>REGISTRE DE TRANSACTION D'AUDIT (TRIGGER AUTOMATIQUE)</span>
                          <span className="px-2 py-0.5 bg-[#00A86B]/15 text-[#00A86B] rounded uppercase text-[8px]">Logs persistés</span>
                        </div>
                        <div className="text-emerald-400 font-bold">// Insertion immédiate de la transaction dans le registre central (CD-PEC-LOGS) :</div>
                        <div>
                          [TRANSACTION] Status : <span className="text-emerald-400 font-bold">{simulationData.status}</span> | 
                          PEC ID : <span className="text-white">{pecId}</span> | 
                          Part Assureur : <span className="text-emerald-400">{simulationData.partAssureur}$</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase cursor-pointer">Précédent</button>
                    <button 
                      onClick={() => setStep(5)}
                      disabled={!simulationData}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                    >
                      Étape Suivante
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* ETAPE 5 : REGLEMENT & BANK DISPATCH CLEARING */}
              {/* ------------------------------------------------------------- */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900">5. Règlement de la PEC &amp; Clearing Compensatoire</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Définissez l'adresse de virement du prestataire médical ou émettez une transaction immédiate de compensation Mobile Money ou Virement RDC
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Canal de Liquidation instantané <strong className="text-rose-500">*</strong></span>
                      <select 
                        value={paymentChannel} 
                        onChange={(e) => setPaymentChannel(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border rounded-xl font-bold cursor-pointer"
                      >
                        <option value="ClearingBank">Virement Bancaire Standard RDC</option>
                        <option value="M-Pesa">M-Pesa instantané</option>
                        <option value="OrangeMoney">Orange Money RDC</option>
                        <option value="AirtelMoney">Airtel Money RDC</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Coordonnées de compensation (Compte Prestataire)</span>
                      <input 
                        type="text" 
                        disabled={true}
                        value="BANQUE RAW_BANK RDC • COMPTE prest_cmk_9901"
                        className="w-full px-4 py-2.5 bg-slate-100 border rounded-xl text-slate-600 font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center text-xs space-y-4 max-w-lg mx-auto">
                    <h4 className="font-extrabold text-slate-800">Clearing Compensatoire J+1 Légis CIMA</h4>
                    <p className="text-slate-500 leading-relaxed">
                      En activant le virement, le concentrateur consolide et envoie la compensation en lot aux prestataires pour assurer un règlement optimal sous 24h.
                    </p>

                    <button
                      onClick={handleDispatchClearing}
                      disabled={isClearingDispatched}
                      className="px-6 py-2 bg-slate-950 hover:bg-black text-[#00A86B] font-black uppercase rounded-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-[#00A86B]" />
                      {isClearingDispatched ? 'Clearing Envoyé !' : 'Déclencher Clearing Compensatoire'}
                    </button>
                    
                    {isClearingDispatched && (
                      <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-600 font-mono font-bold rounded-xl truncate">
                        Batch d'encaissement dispatché : {clearingBatchId}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setStep(4)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase cursor-pointer">Précédent</button>
                    <button 
                      onClick={() => setStep(6)}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase"
                    >
                      Étape Suivante
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* ETAPE 6 : SLA COUNTDOWN TRACKING AND PDF */}
              {/* ------------------------------------------------------------- */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-slate-900">6. Contrôle du SLA 48h CIMA &amp; Impression du Bon de PEC</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Visualisation des temps de réponse administratif et archivage numérique du bon de prise en charge certifié
                    </p>
                  </div>

                  {/* SLA progress indicator */}
                  <div className="p-6 bg-slate-50 rounded-2xl border space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-slate-500 uppercase tracking-widest">Temps de réponse de la console NeoGTec :</span>
                      <span className="text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                        SLA Conforme (2 mins écoulées)
                      </span>
                    </div>
                    {/* Progress Slider Bar Mock */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-[4%] h-full bg-[#00A86B]" /> {/* Super fast processing */}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
                      <span>Émission de la demande : J-0 14:02</span>
                      <span>Décision arbitrée : J-0 14:04</span>
                      <span>Limite légale CIMA : J+2 14:02 (SLA 48h)</span>
                    </div>
                  </div>

                  {/* Certificate Print Layout */}
                  <div className="border border-slate-200 rounded-3xl p-8 bg-white max-w-md mx-auto relative overflow-hidden text-xs text-slate-700 shadow-xl space-y-6">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-9xl font-black text-[#00A86B] rotate-12">
                      CIMA
                    </div>

                    <div className="flex justify-between border-b pb-4 items-center">
                      <div className="w-8 h-8 rounded bg-emerald-500 text-white flex items-center justify-center font-black">
                        GT
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Identité Bon</span>
                        <span className="font-mono text-xs font-extrabold text-slate-900">{pecId}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Bénéficiaire :</span>
                        <span className="font-bold text-slate-900">{scannedBeneficiary?.name || 'Adonai Lutonadio'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Matricule :</span>
                        <span className="font-mono font-bold text-slate-700">{scannedBeneficiary?.matricule || 'CD-NG-0001-S'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase">Diagnostic :</span>
                        <span className="font-bold text-slate-700 truncate max-w-[200px]">{selectedDiag?.label || 'B50.9 Paludisme'}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-slate-400 font-bold uppercase">Part d'indemnité :</span>
                        <span className="font-extrabold text-[#00A86B] text-[13px]">{simulationData?.partAssureur?.toLocaleString() || '520'} $ (Approuvé)</span>
                      </div>
                    </div>

                    {/* QR and Download button */}
                    <div className="flex items-center gap-4 border-t pt-4">
                      <div className="w-14 h-14 bg-slate-50 border rounded flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-slate-600" />
                      </div>
                      <button 
                        onClick={() => alert(`Téléchargement de l'attestation_PEC_${pecId}.pdf avec sceau officiel et certificat CIMA.`)}
                        className="flex-1 px-4 py-2.5 bg-[#00A86B]/15 hover:bg-[#00A86B] text-[#00A86B] hover:text-white font-black uppercase rounded-xl transition-all flex items-center gap-2 justify-center cursor-pointer outline-none"
                      >
                        <FileDown className="w-4 h-4" />
                        Télécharger le Bon PDF
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <button 
                      onClick={onBackToClaimsList} 
                      className="px-6 py-2.5 bg-slate-900 text-[#00A86B] font-extrabold rounded-xl text-xs uppercase cursor-pointer outline-none"
                    >
                      Terminer &amp; Retourner au Dashboard
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
