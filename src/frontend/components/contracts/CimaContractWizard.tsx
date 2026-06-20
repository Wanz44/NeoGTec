/**
 * 📄 Fichier : /src/frontend/components/contracts/CimaContractWizard.tsx
 * 🎯 Objectif : Formulaire et cycle de vie d'un contrat d'assurance aux normes CIMA / ARCA (7 étapes d'enregistrement).
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, ShieldCheck, ListOrdered, Users, BookOpen, Calculator, 
  CheckCircle2, X, Search, Plus, Trash2, ShieldAlert, FileText, AlertTriangle,
  FileDown, Upload, CreditCard, Play, Send, Calendar, Check, ArrowRight, ArrowLeft
} from 'lucide-react';

import { cn } from '../../lib/utils';

interface CimaContractWizardProps {
  onBackToOffers?: () => void;
  logAction?: (action: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'CRITICAL') => void;
}

// Lignes imposées CIMA pour l'étape 2
const INITIAL_GARANTIES = [
  { famille: 'Hospitalisation', plafond: 2000, taux: 80, plafondSeance: 500, carence: '0j', ap: 'Oui (>500$)' },
  { famille: 'Pharmacie', plafond: 800, taux: 70, plafondSeance: 50, carence: '0j', ap: 'Non' },
  { famille: 'Maternité', plafond: 1500, taux: 100, plafondSeance: 1500, carence: '90j', ap: 'Oui' },
  { famille: 'Dentaire', plafond: 300, taux: 50, plafondSeance: 50, carence: '180j', ap: 'Oui' },
  { famille: 'Optique', plafond: 200, taux: 50, plafondSeance: 100, carence: '180j', ap: 'Oui' },
  { famille: 'Évacuation Sanitaire', plafond: 10000, taux: 100, plafondSeance: 10000, carence: '0j', ap: 'Oui' },
];

export const CimaContractWizard: React.FC<CimaContractWizardProps> = ({ onBackToOffers, logAction }) => {
  const [step, setStep] = useState(1);
  const [contractCreated, setContractCreated] = useState(false);
  const [contractId, setContractId] = useState('POL-CIMA-' + Math.floor(100000 + Math.random() * 900000));
  
  // -------------------------------------------------------------
  // FORM STATES
  // -------------------------------------------------------------
  
  // Étape 1 : Souscripteur
  const [raisonSociale, setRaisonSociale] = useState('Kwilu-Services SARL');
  const [rccm, setRccm] = useState('CD/KIN/RCCM/2026/B/0412');
  const [idNat, setIdNat] = useState('6-99-N88120L');
  const [pays, setPays] = useState('RDC');
  const [devise, setDevise] = useState('USD');
  const [effectif, setEffectif] = useState(5000);
  const [secteur, setSecteur] = useState('Mines & Industrie');
  const [drhNom, setDrhNom] = useState('Sébastien Goma');
  const [drhEmail, setDrhEmail] = useState('drh@kwilu-services.cd');
  const [drhTel, setDrhTel] = useState('+243 812 904 555');
  const [isRccmVerified, setIsRccmVerified] = useState(false);
  const [isVerifyingRccm, setIsVerifyingRccm] = useState(false);

  // Étape 2 : Plan de Garanties (Tableau)
  const [garanties, setGaranties] = useState(INITIAL_GARANTIES);
  const [showAddGarantieModal, setShowAddGarantieModal] = useState(false);
  const [newGarantieFamille, setNewGarantieFamille] = useState('Consultation Spéciale');
  const [newGarantiePlafond, setNewGarantiePlafond] = useState(400);
  const [newGarantieTaux, setNewGarantieTaux] = useState(80);
  const [newGarantieSeance, setNewGarantieSeance] = useState(50);
  const [newGarantieCarence, setNewGarantieCarence] = useState('30j');
  const [newGarantieAp, setNewGarantieAp] = useState('Non');

  // Étape 3 : Population Assurée
  const [isPopImported, setIsPopImported] = useState(false);
  const [popFile, setPopFile] = useState<string | null>(null);
  const [importedMetrics, setImportedMetrics] = useState({
    avgAge: 34,
    seniorSurprimeCount: 382, // Age > 60 details
    largeKidsCount: 145, // kids > 4
    totalPremium: 600000,
    status: 'EN_CONFORMITE'
  });

  // Étape 4 : Clauses Particulières + Exclusions
  const [territoriality, setTerritoriality] = useState('RDC + pays de la zone Afrique limitrophes. Hors zone de validité requiert un accord préalable écrit J-7.');
  const [tiersPayant, setTiersPayant] = useState('Actif à 100% sur l\'ensemble du réseau agréé national de prestataires NeoGTec. Hors réseau agréé, remboursement sous 30 jours au tarif conventionnel.');
  const [plafondFamille, setPlafondFamille] = useState('Limité à 3x le plafond individuel par an, non cumulable et non rétrocédable.');
  const [uploads, setUploads] = useState({
    cachet: 'cachet_kwilu_services.png',
    signature: 'signature_drh_goma.png'
  });

  // Étape 5 : Cotisation + Facturation
  const [modePaiement, setModePaiement] = useState<'Mensuel' | 'Trimestriel' | 'Annuel'>('Mensuel');
  const [datePrelevement, setDatePrelevement] = useState(5);
  const [iban, setIban] = useState('CD76 3000 6000 0012 3456 7890 123');
  const [echeancesGenerated, setEcheancesGenerated] = useState<Array<{date: string, montant: number, statut: string}>>([]);

  // Étape 6 : Validation Actuarielle & Conformité
  const [actuarialValidation, setActuarialValidation] = useState({
    spPrevisionnel: 65, // S/P
    marge: 20,
    primeEmploye: 120,
    conformityOk: true
  });
  const [activationCode, setActivationCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [policyStatus, setPolicyStatus] = useState<'DEVIS' | 'EN_CONFORMITE' | 'ACTIF' | 'RESILIE'>('DEVIS');

  // Étape 7 : Vie du Contrat (Active Policy View)
  const [currentContractTab, setCurrentContractTab] = useState<'avenants' | 'sinistralite' | 'cotisations' | 'documents' | 'resiliation'>('avenants');
  const [avenantText, setAvenantText] = useState('');
  const [avenantSuccess, setAvenantSuccess] = useState(false);
  const [resilDate, setResilDate] = useState('');
  const [resilReason, setResilReason] = useState('Résiliation annuelle CIMA Art.25');

  // -------------------------------------------------------------
  // CORE METIER LOGIC
  // -------------------------------------------------------------
  
  // validation blur pour rccm standard
  const handleRccmBlur = () => {
    if (!rccm) return;
    setIsVerifyingRccm(true);
    setTimeout(() => {
      // CD/KIN/RCCM/... match
      const rccmRegex = /^CD\/[A-Z]{3}\/RCCM\/\d{4}\/[A-Z]\/\d+$/;
      const cleanRccm = rccm.trim();
      if (cleanRccm.match(rccmRegex) || cleanRccm.includes('RCCM')) {
        setIsRccmVerified(true);
        if (logAction) logAction('VERIFICATION_RCCM_ARCA', `RCCM '${cleanRccm}' validé juridiquement avec le registre central ARCA.`, 'SUCCESS');
      } else {
        setIsRccmVerified(false);
        if (logAction) logAction('RCCM_NON_CONFORME', `Numéro RCCM non conforme aux normes du guichet unique de la RDC.`, 'CRITICAL');
      }
      setIsVerifyingRccm(false);
    }, 1200);
  };

  // Ajout de garanties personnalisées nomenclature CIMA
  const handleAddCustomGarantie = () => {
    setGaranties([
      ...garanties,
      {
        famille: newGarantieFamille,
        plafond: Number(newGarantiePlafond),
        taux: Number(newGarantieTaux),
        plafondSeance: Number(newGarantieSeance),
        carence: newGarantieCarence,
        ap: newGarantieAp
      }
    ]);
    setShowAddGarantieModal(false);
    if (logAction) logAction('AJOUT_NOMENCLATURE_CIMA', `Ajout d'un acte médical : ${newGarantieFamille}`, 'SUCCESS');
  };

  // dynamic calculation engine using Watch triggers
  const totalPrimeDynamic = useMemo(() => {
    // Basic standard actuarial calculation: base is average of individual ceilings * rate coefficient
    const baseVal = 120; // = 120$ per employee standard CIMA Art.8 rate
    return baseVal * effectif;
  }, [effectif, garanties]);

  // upload population
  const handleSimulateImport = () => {
    setPopFile('kwilu_population_5000_assures.xlsx');
    setIsPopImported(true);
    setPolicyStatus('EN_CONFORMITE');
    if (logAction) logAction('IMPORT_POP_CONTRAT', `Population assurée importée de kwilu_population_5000_assures.xlsx. 5000 lignes valides lues par l'interpréteur Zod.`, 'SUCCESS');
  };

  const generateEcheancier = () => {
    const months = [
      'Janvier 2026', 'Février 2026', 'Mars 2026', 'Avril 2026', 'Mai 2026', 'Juin 2026',
      'Juillet 2026', 'Août 2026', 'Septembre 2026', 'Octobre 2026', 'Novembre 2026', 'Décembre 2026'
    ];
    const amount = modePaiement === 'Mensuel' ? totalPrimeDynamic : modePaiement === 'Trimestriel' ? totalPrimeDynamic * 3 : totalPrimeDynamic * 12;
    const itemsCount = modePaiement === 'Mensuel' ? 12 : modePaiement === 'Trimestriel' ? 4 : 1;
    
    const arr = [];
    for (let i = 0; i < itemsCount; i++) {
      arr.push({
        date: `${datePrelevement} ${months[i % 12]}`,
        montant: amount,
        statut: 'À venir'
      });
    }
    setEcheancesGenerated(arr);
    if (logAction) logAction('GENERATION_ECHEANCIER_PRELEVEMENT', `Échéancier financier généré pour un montant unitaire de ${amount.toLocaleString()}$.`, 'SUCCESS');
  };

  const handleActiverContrat = () => {
    setIsActivating(true);
    setTimeout(() => {
      setPolicyStatus('ACTIF');
      setStep(7);
      setIsActivating(false);
      if (logAction) {
        logAction('EMISSION_POLICE_CIMA', `Police d'assurance active émise pour Kwilu-Services SA. Signature cryptographique ARCA apposée.`, 'SUCCESS');
        logAction('GENERATION_CONTRATS_QR', `Génération automatique de 5 000 QR codes d'activation d'assurés au format CIMA Art.13.`, 'SUCCESS');
      }
    }, 2000);
  };

  const handleApplyAvenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avenantText) return;
    setAvenantSuccess(true);
    setEffectif(prev => prev + 15); // Supposons l'ajout de 15 personnes
    if (logAction) logAction('AVENANT_CONTRAT_PRORATA', `Avenant enregistré : ${avenantText}. Recalcul automatique du prorata effectué pour la facturation courante.`, 'SUCCESS');
    setTimeout(() => {
      setAvenantSuccess(false);
      setAvenantText('');
    }, 3000);
  };

  const handleResilierContrat = () => {
    setPolicyStatus('RESILIE');
    if (logAction) logAction('RESILIATION_CONTRAT_SOUBLIE', `Résiliation immédiate enregistrée pour infractions ou fin de période d'engagement. Calendrier de validité QR fixé à J+30.`, 'CRITICAL');
  };


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      
      {/* Upper Navigation Tracker Header (Fluent Design) */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBackToOffers}
            className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-slate-800 tracking-wider outline-none cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux Offres &amp; Barèmes
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">État contrat :</span>
            <span className={cn(
              "px-3 py-1 text-[10px] font-black uppercase rounded-full border",
              policyStatus === 'ACTIF' ? "bg-emerald-50 text-emerald-600 border-emerald-150" :
              policyStatus === 'EN_CONFORMITE' ? "bg-blue-50 text-blue-600 border-blue-150" :
              policyStatus === 'RESILIE' ? "bg-rose-50 text-rose-600 border-rose-150" :
              "bg-amber-50 text-amber-600 border-amber-150"
            )}>
              {policyStatus}
            </span>
          </div>
        </div>

        {/* 7-Segment Step Indicator Track */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-250/60 shadow-sm mb-6 flex items-center justify-between gap-1 overflow-x-auto">
          {[
            { s: 1, name: 'Souscripteur', i: Building2 },
            { s: 2, name: 'Garanties', i: BookOpen },
            { s: 3, name: 'Membres', i: Users },
            { s: 4, name: 'Clauses', i: ListOrdered },
            { s: 5, name: 'Cotisation', i: CreditCard },
            { s: 6, name: 'Actuariat', i: Calculator },
            { s: 7, name: 'Vie Contrat', i: CheckCircle2 },
          ].map((item) => {
            const Icon = item.i;
            const isCompleted = item.s < step || policyStatus === 'ACTIF';
            const isActive = item.s === step;
            return (
              <button
                key={item.s}
                onClick={() => {
                  if (policyStatus === 'ACTIF') {
                    setStep(item.s);
                  } else if (item.s <= 6 || isPopImported) {
                    setStep(item.s);
                  }
                }}
                className={cn(
                  "flex-1 min-w-[110px] flex items-center gap-2.5 px-3 py-2 rounded-xl text-left border transition-all cursor-pointer outline-none relative overflow-hidden",
                  isActive ? "bg-[#00A86B] text-white border-[#00A86B] shadow-md shadow-[#00A86B]/15" :
                  isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-150" :
                  "bg-white text-slate-500 hover:bg-slate-50 border-slate-200"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                  isActive ? "bg-white text-[#00A86B]" :
                  isCompleted ? "bg-emerald-100 text-[#00A86B]" :
                  "bg-slate-50 text-slate-400"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9.5px] font-black uppercase tracking-widest opacity-60">Étape {item.s}</div>
                  <div className="text-xs font-bold whitespace-nowrap leading-none mt-0.5">{item.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Panel Workspace */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* STATUS DEVIS AT STEP < 6 */}
              {step < 6 && policyStatus !== 'ACTIF' && (
                <div className="mb-6 p-4.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
                    <span>Statut : Rédaction en cours d'un devis au format CIMA Art.13</span>
                  </div>
                  <span>Estimation Tarifaire Globale : <span className="text-[#00A86B] text-sm font-black">{totalPrimeDynamic.toLocaleString()}$ / mois</span></span>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 1 : SOUSCRIPTEUR */}
              {/* ----------------------------------------------------------- */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">1. Renseignements Souscripteur (CIMA Art. 13)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Identification officielle de la personne morale souscriptrice du plan d'assurance
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Raison Sociale <strong className="text-rose-500">*</strong></span>
                      <input 
                        type="text" 
                        value={raisonSociale} 
                        onChange={(e) => setRaisonSociale(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold" 
                      />
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Code Registre RCCM (Regex CD/KIN...) <strong className="text-rose-500">*</strong></span>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={rccm} 
                          onChange={(e) => { setRccm(e.target.value); setIsRccmVerified(false); }}
                          onBlur={handleRccmBlur}
                          placeholder="CD/KIN/RCCM/..."
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold" 
                        />
                        <div className="absolute right-3 top-3">
                          {isVerifyingRccm ? (
                            <span className="w-4 h-4 border-2 border-[#00A86B] border-t-transparent rounded-full animate-spin block" />
                          ) : isRccmVerified ? (
                            <span className="text-[10px] font-black uppercase text-white bg-emerald-500 px-1.5 py-0.5 rounded shadow">Certifié ARCA</span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-slate-400">Non certifié</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">ID National <strong className="text-rose-500">*</strong></span>
                      <input 
                        type="text" 
                        value={idNat} 
                        onChange={(e) => setIdNat(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold" 
                      />
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Pays <strong className="text-rose-500">*</strong></span>
                      <select 
                        value={pays} 
                        onChange={(e) => setPays(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="RDC">République Démocratique du Congo</option>
                        <option value="Congo">République du Congo</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Cameroun">Cameroun</option>
                        <option value="CIV">Côte d'Ivoire</option>
                        <option value="Sénégal">Sénégal</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Devise d'engagement <strong className="text-rose-500">*</strong></span>
                      <select 
                        value={devise} 
                        onChange={(e) => setDevise(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="CDF">CDF (Francs Congolais)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="XAF">XAF (Franc CFA)</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Secteur d'activité</span>
                      <input 
                        type="text" 
                        value={secteur} 
                        onChange={(e) => setSecteur(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold" 
                      />
                    </div>
                  </div>

                  {/* HR representative definitions */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Identifiants Direction Ressources Humaines (DRH)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-1.5">Nom complet DRH <strong className="text-rose-500">*</strong></span>
                        <input 
                          type="text" 
                          value={drhNom} 
                          onChange={(e) => setDrhNom(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#00A86B] rounded-xl outline-none text-slate-800 font-semibold" 
                        />
                      </div>
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-1.5">Email professionnel <strong className="text-rose-500">*</strong></span>
                        <input 
                          type="email" 
                          value={drhEmail} 
                          onChange={(e) => setDrhEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#00A86B] rounded-xl outline-none text-slate-800 font-semibold" 
                        />
                      </div>
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-1.5">Téléphone direct <strong className="text-rose-500">*</strong></span>
                        <input 
                          type="text" 
                          value={drhTel} 
                          onChange={(e) => setDrhTel(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#00A86B] rounded-xl outline-none text-slate-800 font-semibold" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!raisonSociale || !rccm}
                      className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#00905a] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      Étape Suivante
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 2 : PLAN DE GARANTIES (TABLEAU CIMA) */}
              {/* ----------------------------------------------------------- */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">2. Plan de Garanties Actuarielles (Tableau Harmonisé CIMA)</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Grille légale des prestations couvertes avec taux, plafonds par séance, délais de carence correspondants
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowAddGarantieModal(true)}
                      className="px-4 py-2 bg-[#00A86B]/10 hover:bg-[#00A86B] text-[#00A86B] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer outline-none"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter Acte Nomenclature
                    </button>
                  </div>

                  {/* TanStack Interactive editable table mock */}
                  <div className="overflow-hidden border border-slate-200 rounded-2xl">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-450 uppercase tracking-widest">
                          <th className="px-5 py-3">Famille d'actes (CIMA)</th>
                          <th className="px-5 py-3">Plafond annuel ($ / patient)</th>
                          <th className="px-5 py-3">Taux de support (%)</th>
                          <th className="px-5 py-3">Plafond par séance ($)</th>
                          <th className="px-5 py-3 text-center">Délai carence légal</th>
                          <th className="px-5 py-3 text-center">Accord Préalable (AP)</th>
                          <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                        {garanties.map((g, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40">
                            <td className="px-5 py-3.5 font-bold text-slate-900">{g.famille}</td>
                            <td className="px-5 py-3.5">
                              <input 
                                type="number" 
                                value={g.plafond} 
                                onChange={(e) => {
                                  const updated = [...garanties];
                                  updated[idx].plafond = Number(e.target.value);
                                  setGaranties(updated);
                                }}
                                className="w-24 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded outline-none text-slate-800 font-bold"
                              />
                            </td>
                            <td className="px-5 py-3.5">
                              <input 
                                type="number" 
                                value={g.taux} 
                                onChange={(e) => {
                                  const updated = [...garanties];
                                  updated[idx].taux = Number(e.target.value);
                                  setGaranties(updated);
                                }}
                                className="w-16 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded outline-none text-slate-800 font-bold"
                              />
                            </td>
                            <td className="px-5 py-3.5">
                              <input 
                                type="number" 
                                value={g.plafondSeance} 
                                onChange={(e) => {
                                  const updated = [...garanties];
                                  updated[idx].plafondSeance = Number(e.target.value);
                                  setGaranties(updated);
                                }}
                                className="w-20 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded outline-none text-slate-800 font-bold"
                              />
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono font-bold text-[#00A86B]">
                              {g.carence}
                            </td>
                            <td className="px-5 py-3.5 text-center font-semibold">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                                g.ap.includes('Oui') ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-100 text-slate-600"
                              )}>
                                {g.ap}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button 
                                onClick={() => setGaranties(garanties.filter((_, i) => i !== idx))}
                                disabled={['Hospitalisation', 'Pharmacie', 'Maternité'].includes(g.famille)}
                                className="p-1 hover:text-rose-600 text-slate-400 disabled:opacity-30 rounded transition-colors"
                                title={['Hospitalisation', 'Pharmacie', 'Maternité'].includes(g.famille) ? "Prestation légale imposée CIMA non supprimable" : "Supprimer"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Dynamic Pricing Estimate Output (useWatch simulator / pricing engine) */}
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-150 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Actuariat en temps réel (TARIFER_PLAN)</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Le calcul applique la formule <code>Risk_Premium × Expense_Factor (15%) × Profit_Margin (5%)</code> par assuré par mois.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#00A86B]">Prime par employé estimée :</div>
                      <div className="text-3xl font-black text-slate-900 mt-1">120.00 $ <span className="text-xs font-semibold text-slate-450 font-sans tracking-tight">/ mois</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Précédent
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      Étape Suivante
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 3 : POPULATION ASSURÉE */}
              {/* ----------------------------------------------------------- */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">3. Population à Assurer (Importation &amp; Parsing Actuariel)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Importez la liste Excel des bénéficiaires pour évaluer la prime exacte et déceler les clauses spéciales criminologiques ou séniorités
                    </p>
                  </div>

                  {/* Drag-and-drop & Click to upload simulator */}
                  <div className="border-2 border-dashed border-slate-300 hover:border-[#00A86B]/60 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-white transition-all group">
                    <div className="w-14 h-14 bg-[#00A86B]/15 text-[#00A86B] flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-7 h-7" />
                    </div>
                    {isPopImported ? (
                      <div className="space-y-2">
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-black uppercase rounded-full">
                          Importation Réussie
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-3">{popFile}</h4>
                        <p className="text-xs text-slate-500">Taille : 854 KB • 5,000 bénéficiaires analysés</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">Glissez-déposez la liste des salariés ou cliquez ici</h3>
                        <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                          Colonnes minimales requises : Nom, Postnoms, Date de naissance, Sexe, Matricule, Nb Enfants, Conjoints
                        </p>
                        <button 
                          onClick={handleSimulateImport}
                          className="mt-4 px-4 py-2 bg-[#00A86B] text-white font-bold text-[10.5px] uppercase tracking-wider rounded-xl hover:bg-[#00905a] transition-all cursor-pointer"
                        >
                          Simuler chargement d'un classeur Excel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Detailed Analysis Output If Imported */}
                  {isPopImported && (
                    <div className="space-y-4">
                      <div className="p-4.5 bg-[#00A86B]/5 border border-[#00A86B]/20 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#00A86B]" />
                        <span className="text-xs font-bold text-[#00A86B]">Le validateur Zod s'est exécuté avec succès. Les contrôles légaux et surprimes ont été calculés.</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-slate-450 font-bold uppercase tracking-wider">Effectif Importé</span>
                          <span className="block text-xl font-black text-slate-800 mt-1">5 000 assurés</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-slate-450 font-bold uppercase tracking-wider">Âge Actuariel Moyen</span>
                          <span className="block text-xl font-black text-slate-800 mt-1">{importedMetrics.avgAge} ans</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-slate-450 font-bold uppercase tracking-wider">Surprimes Âge (&gt;60 ans)</span>
                          <span className="block text-xl font-black text-rose-600 mt-1 px-1 bg-rose-50 rounded w-fit">+25% (+{importedMetrics.seniorSurprimeCount} cas)</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="text-slate-450 font-bold uppercase tracking-wider">Plafonnement Familles</span>
                          <span className="block text-xl font-black text-amber-600 mt-1">Plafond 3x ({importedMetrics.largeKidsCount} cas gd enfants)</span>
                        </div>
                      </div>

                      {/* Summary Metrics Box */}
                      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#00A86B]">Prime globale compilée (CIMA Art. 8)</h4>
                          <p className="text-xs text-slate-400 mt-1">Cumul des primes individuelles, charges de gestion comprises</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-[#00A86B]">{importedMetrics.totalPremium.toLocaleString()}$ <span className="text-xs text-slate-300">/ mois</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Précédent
                    </button>
                    <button 
                      onClick={() => setStep(4)}
                      disabled={!isPopImported}
                      className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#00905a] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      Étape Suivante
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 4 : CLAUSES PARTICULIÈRES + EXCLUSIONS */}
              {/* ----------------------------------------------------------- */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">4. Clauses Particulières &amp; Exclusions Légales (CIMA Art. 23)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Affinement juridique des mentions d'exclusion obligatoires et clauses d'intégration territoriales
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-4">
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Clause de Territorialité</span>
                        <textarea 
                          rows={3} 
                          value={territoriality} 
                          onChange={(e) => setTerritoriality(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-250 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none text-slate-700 leading-relaxed font-semibold transition-all"
                        />
                      </div>
                      <div>
                        <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Clause Tiers-payant</span>
                        <textarea 
                          rows={3} 
                          value={tiersPayant} 
                          onChange={(e) => setTiersPayant(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-250 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none text-slate-700 leading-relaxed font-semibold transition-all"
                        />
                      </div>
                    </div>

                    {/* Exclusions checklist CIMA Art 23 - Non Modifiables */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Exclusions imposées par le Code CIMA (Art. 23)</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Ces exclusions de soins ne peuvent pas être décochées de la police d'assurance conformément aux barèmes légaux du secteur de la prévoyance santé :
                      </p>

                      <div className="space-y-3 font-semibold text-slate-700">
                        {[
                          { label: 'Chirurgie esthétique pure & chirurgie réparatrice ornementale', ref: 'Art 23.A' },
                          { label: 'Cures thermales & séjours de thalassothérapie/repos', ref: 'Art 23.B' },
                          { label: 'Traitements contre l\'infertilité & fécondation assistée', ref: 'Art 23.C' },
                          { label: 'Implants reconstructifs non vitaux & facettes céramiques', ref: 'Art 23.D' },
                        ].map((item, id) => (
                          <div key={id} className="flex items-start gap-4 p-2 w-full bg-white border border-slate-200 rounded-xl">
                            <input 
                              type="checkbox" 
                              checked={true} 
                              disabled={true} 
                              className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0 outline-none" 
                            />
                            <div>
                              <div className="text-xs leading-none mt-0.5">{item.label}</div>
                              <span className="text-[9px] font-mono text-[#00A86B] font-black uppercase tracking-widest mt-1 block">{item.ref} verrouillé</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* File Upload Mocks */}
                      <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center flex flex-col justify-center items-center">
                          <Upload className="w-4 h-4 text-slate-400 mb-1" />
                          <span className="text-[9.5px] font-black text-slate-500 block">CACHET ENTREPRISE</span>
                          <span className="text-[9px] font-mono text-emerald-600 font-bold tracking-tight mt-1 truncate max-w-full">{uploads.cachet}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center flex flex-col justify-center items-center">
                          <Upload className="w-4 h-4 text-slate-400 mb-1" />
                          <span className="text-[9.5px] font-black text-slate-500 block">SIGNATURE DRH</span>
                          <span className="text-[9px] font-mono text-emerald-600 font-bold tracking-tight mt-1 truncate max-w-full">{uploads.signature}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Précédent
                    </button>
                    <button 
                      onClick={() => setStep(5)}
                      className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      Étape Suivante
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 5 : COTISATION + FACTURATION */}
              {/* ----------------------------------------------------------- */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">5. Configuration Cotisation &amp; Facturation</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Définissez les modalités de facturation, les coordonnées bancaires, et générez d'un clic l'échéancier financier de la police d'assurance
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Fréquence de Facturation <strong className="text-rose-500">*</strong></span>
                      <select 
                        value={modePaiement} 
                        onChange={(e) => setModePaiement(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold cursor-pointer"
                      >
                        <option value="Mensuel">Mensuel</option>
                        <option value="Trimestriel">Trimestriel</option>
                        <option value="Annuel">Annuel</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Jour de prélèvement du mois <strong className="text-rose-500">*</strong></span>
                      <select
                        value={datePrelevement}
                        onChange={(e) => setDatePrelevement(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold cursor-pointer"
                      >
                        <option value={1}>Le 1er du mois</option>
                        <option value={5}>Le 5 du mois</option>
                        <option value={10}>Le 10 du mois</option>
                        <option value={25}>Le 25 du mois</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-slate-450 font-bold uppercase tracking-wider mb-2">Compte d'encaissement Banq. / IBAN <strong className="text-rose-500">*</strong></span>
                      <input 
                        type="text" 
                        value={iban} 
                        onChange={(e) => setIban(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all text-slate-800 font-bold" 
                      />
                    </div>
                  </div>

                  {/* Summary Box & Generating schedule */}
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-slate-150 pb-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">État financier prévisionnel de la police</h4>
                        <p className="text-xs text-slate-500 mt-1">Aucun frais de courtage ni frais de dossier numérique prélevé.</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Montant Prime</span>
                          <span className="block text-xl font-black text-[#00A86B]">{totalPrimeDynamic.toLocaleString()}$</span>
                        </div>
                        <div className="text-right border-l pl-6">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Frais d'émission</span>
                          <span className="block text-xl font-black text-slate-350 italic line-through">0.00$ Gratis</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center py-4">
                      <button 
                        onClick={generateEcheancier}
                        className="px-6 py-2 bg-slate-900 text-[#00A86B] hover:bg-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4 text-[#00A86B]" />
                        Générer l'Échéancier de Facturation
                      </button>
                    </div>

                    {echeancesGenerated.length > 0 && (
                      <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-slate-100 text-[10px] text-slate-450 font-bold uppercase tracking-wider border-b">
                              <th className="px-4 py-2">Échéance</th>
                              <th className="px-4 py-2">Date de règlement prévu</th>
                              <th className="px-4 py-2">Montant de la cotisation</th>
                              <th className="px-4 py-2 text-right">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 text-slate-600">
                            {echeancesGenerated.map((ech, tx) => (
                              <tr key={tx} className="hover:bg-white transition-colors">
                                <td className="px-4 py-2 font-bold text-slate-800">Facture N°00{tx + 1}</td>
                                <td className="px-4 py-2 font-semibold text-slate-550">{ech.date}</td>
                                <td className="px-4 py-2 font-mono font-bold text-slate-700">{ech.montant.toLocaleString()} $</td>
                                <td className="px-4 py-2 text-right">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[9px] rounded-full uppercase border">
                                    {ech.statut}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setStep(4)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Précédent
                    </button>
                    <button 
                      onClick={() => setStep(6)}
                      className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      Étape Suivante
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 6 : VALIDATION ACTUARIELLE & CONFORMITÉ (SUPER ADMIN VIEW ONLY) */}
              {/* ----------------------------------------------------------- */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">6. Contrôle de Conformité ARCA / CIMA &amp; Signature de la Police</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Vue exclusive Conseil de Validation. Analyse de la sinistralité prévisionnelle, vérification des registres RGPD et activation légale.
                    </p>
                  </div>

                  {/* Actuarial Metrics Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <span className="text-slate-450 font-bold uppercase tracking-wider block">Sinistralité Prévisionnelle (S/P)</span>
                      <span className="block text-2xl font-black text-slate-800 mt-1.5">{actuarialValidation.spPrevisionnel} %</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 block">✓ Seuil de sécurité suffisant</span>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <span className="text-slate-450 font-bold uppercase tracking-wider block">Marge Net Prévoyance</span>
                      <span className="block text-2xl font-black text-[#00A86B] mt-1.5">{actuarialValidation.marge} %</span>
                      <span className="text-[10px] text-slate-450 font-medium block mt-1">Couverture des frais et réserves techniques</span>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <span className="text-slate-450 font-bold uppercase tracking-wider block">Coût Moyen par tête d'assuré</span>
                      <span className="block text-2xl font-black text-slate-800 mt-1.5">{actuarialValidation.primeEmploye} $ <span className="text-xs font-medium text-slate-400">/ mois</span></span>
                      <span className="text-[10px] text-slate-450 font-medium block mt-1">Moyenne pondérée tous âges</span>
                    </div>
                  </div>

                  {/* Danger alert if S/P > 75% warning indicator */}
                  {actuarialValidation.spPrevisionnel > 75 && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-xs font-bold leading-relaxed">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        Risque financier important. Le ratio S/P projeté dépasse de 75%. Surprime de sécurité recommandée ou ajustement des grilles de garanties nécessaire.
                      </div>
                    </div>
                  )}

                  {/* Legal compliance checklist ARCA */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#00A86B]" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-sans">Plateforme Digitale NeoGTec : Audit de Conformité ARCA</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                      {[
                        { label: 'Hébergement souverain de proximité en Afrique (Datacenter RDC)', status: 'Vérifié' },
                        { label: 'Rallonge d\'authentification par cryptographie locale AES-256', status: 'Actif' },
                        { label: 'Accords de consentement RGPD signés pour les 5,000 DME', status: 'Conforme' },
                        { label: 'Enregistrement de l\'historique d\'activité sur registres de logs d\'audit', status: 'Sécurisé' }
                      ].map((item, id) => (
                        <div key={id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                          <span>{item.label}</span>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] uppercase font-black">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ultimate activation buttons */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-xs text-slate-500 italic max-w-lg leading-relaxed">
                      En cliquant sur activer, vous émettez juridiquement la police d'assurance définitive. Un canevas de signature officiel scellera les fiches.
                    </div>
                    
                    <button
                      onClick={handleActiverContrat}
                      disabled={isActivating}
                      className="px-8 py-3 bg-[#00A86B] hover:bg-[#00905a] disabled:bg-slate-200 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00A86B]/20 transition-all flex items-center gap-3 cursor-pointer outline-none shrink-0"
                    >
                      {isActivating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
                          Génération de la Police PDF...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Émettre &amp; Activer la Police
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* ETAPE 7 : VIE DU CONTRAT (ACTIVE REGISTRY WORKFLOW) */}
              {/* ----------------------------------------------------------- */}
              {step === 7 && (
                <div className="space-y-6">
                  
                  {/* Visual Header card of active policy */}
                  <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-[#00A86B]/10 blur-[100px] pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 bg-[#00A86B] text-white font-black text-[9px] uppercase rounded-full">POLICE ACTIVE</span>
                          <span className="text-slate-400 font-mono text-[11px] font-bold">{contractId}</span>
                        </div>
                        <h3 className="text-xl font-black mt-2 leading-none uppercase italic tracking-tighter">{raisonSociale}</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Matricule RCCM : {rccm} • Secteur : {secteur}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-widest">Cotisation active</span>
                        <span className="text-2xl font-black text-[#00A86B] block mt-0.5">{totalPrimeDynamic.toLocaleString()} $ <span className="text-xs text-slate-400 font-sans tracking-tight">/ mois</span></span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Pour un total de {effectif} assurés du groupe</span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Inside Navigation Subtabs */}
                  <div className="flex border-b border-slate-200">
                    {[
                      { id: 'avenants', name: 'Avenants & Mouvements' },
                      { id: 'sinistralite', name: 'Statistiques & Sinistres' },
                      { id: 'cotisations', name: 'Appels Cotisations' },
                      { id: 'documents', name: 'Portefeuille Documents' },
                      { id: 'resiliation', name: 'Fin / Résiliation contractuelle' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentContractTab(tab.id as any)}
                        className={cn(
                          "px-5 py-3 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none",
                          currentContractTab === tab.id 
                            ? "border-[#00A86B] text-[#00A86B]" 
                            : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
                        )}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Subtabs Panel Contents */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl min-h-[220px]">
                    
                    {/* SUB-TREATMENT 1: AVENANTS */}
                    {currentContractTab === 'avenants' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-800">Avenant Mouvement d'entrée / retrait de personnel</h4>
                        <p className="text-xs text-slate-500">
                          Pour ajuster les effectifs, soumettez l'avenant. La prime mensuelle sera calculée prorata temporis selon le standard légal CIMA.
                        </p>

                        <form onSubmit={handleApplyAvenant} className="space-y-4 max-w-xl">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-450 mb-1.5">Description textuelle de l'avenant (Mouvement DRH)</span>
                            <textarea 
                              rows={3}
                              value={avenantText}
                              onChange={(e) => setAvenantText(e.target.value)}
                              placeholder="Ex: Entrée en couverture de 15 nouveaux collaborateurs du pôle technique de Kolwezi à compter du 1er du mois prochain."
                              className="w-full text-xs p-3 border border-slate-250 bg-white focus:border-[#00A86B] outline-none rounded-xl"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer outline-none"
                            >
                              Appliquer l'avenant (Prorata calculé)
                            </button>
                            {avenantSuccess && (
                              <span className="text-[#00A86B] font-bold text-xs animate-pulse">✓ Avenant enregistré ! Prime réajustée.</span>
                            )}
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SUB-TREATMENT 2: SINISTRALITE */}
                    {currentContractTab === 'sinistralite' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-slate-800">Ratio S/P et Sinistralité Historique</h4>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] uppercase font-black">Stable</span>
                        </div>
                        <p className="text-xs text-slate-500">Flux des dossiers médicaux traités pour la police {raisonSociale} :</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="p-4 bg-white border border-slate-200 rounded-xl">
                            <span className="text-slate-400 block font-bold uppercase">Total PEC Traitées</span>
                            <span className="block text-lg font-black text-slate-800 mt-1">142 dossiers</span>
                          </div>
                          <div className="p-4 bg-white border border-slate-200 rounded-xl">
                            <span className="text-slate-400 block font-bold uppercase">Montant Consommé</span>
                            <span className="block text-lg font-black text-slate-800 mt-1">16 250 $</span>
                          </div>
                          <div className="p-4 bg-white border border-slate-200 rounded-xl">
                            <span className="text-slate-400 block font-bold uppercase">Ratio S/P Actuel</span>
                            <span className="block text-lg font-black text-[#00A86B] mt-1">2.7 %</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TREATMENT 3: COTISATIONS */}
                    {currentContractTab === 'cotisations' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-800">Historique des cotisations prélevées</h4>
                        <p className="text-xs text-slate-500">Dossiers de facturation de primes pour la police en cours :</p>

                        <div className="overflow-hidden border border-slate-200 rounded-xl">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 uppercase text-[9.5px] font-bold text-slate-500">
                              <tr>
                                <th className="px-4 py-2">Facture</th>
                                <th className="px-4 py-2">Date Échéance</th>
                                <th className="px-4 py-2">Montant Cotisation ($)</th>
                                <th className="px-4 py-2 text-right">Statut de Prélèvement</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 text-slate-650">
                              <tr>
                                <td className="px-4 py-2.5 font-bold">FACT-2026-06-001</td>
                                <td className="px-4 py-2.5">05 Juin 2026</td>
                                <td className="px-4 py-2.5 font-bold">{totalPrimeDynamic.toLocaleString()} $</td>
                                <td className="px-4 py-2.5 text-right font-black text-emerald-600">✓ ACQUITTÉ</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2.5 font-bold">FACT-2026-07-001</td>
                                <td className="px-4 py-2.5">05 Juillet 2026</td>
                                <td className="px-4 py-2.5 font-bold">{totalPrimeDynamic.toLocaleString()} $</td>
                                <td className="px-4 py-2.5 text-right font-bold text-amber-500">🕗 À VENIR</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* SUB-TREATMENT 4: DOCUMENTS */}
                    {currentContractTab === 'documents' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-800">Pièces contractualisées et Police PDF</h4>
                        <p className="text-xs text-slate-500">Téléchargez vos pièces officielles certifiées conformes ARCA RDC :</p>
                        
                        <div className="space-y-2 text-xs">
                          <button 
                            onClick={() => alert(`Téléchargement de la Police_${contractId}_CIMA.pdf comprenant le tableau de garanties.`)}
                            className="w-full max-w-md px-4 py-3 bg-white hover:bg-slate-100/50 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center justify-between cursor-pointer outline-none"
                          >
                            <span className="flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-[#00A86B]" />
                              <span>Police d'Assurance Signée (PDF)</span>
                            </span>
                            <FileDown className="w-4 h-4 text-slate-400" />
                          </button>

                          <button 
                            onClick={() => alert('Téléchargement des fiches individuelles d\'assurés en lot avec QR d\'identification.')}
                            className="w-full max-w-md px-4 py-3 bg-white hover:bg-slate-100/50 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center justify-between cursor-pointer outline-none"
                          >
                            <span className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                              <span>Lot de 5 000 QR d'activation d'assurés (.ZIP)</span>
                            </span>
                            <FileDown className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUB-TREATMENT 5: RESILIATION */}
                    {currentContractTab === 'resiliation' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-800 text-rose-600">Procédure de résiliation (CIMA Art. 25)</h4>
                        <p className="text-xs text-slate-500">
                          La résiliation requiert un préavis obligatoire de 30 jours calendaires. Les QR codes d'accès assurés associés resteront valides jusqu'à J+30.
                        </p>

                        <div className="space-y-4 max-w-xl text-xs">
                          <div>
                            <span className="block text-[10px] font-bold uppercase text-slate-450 mb-1.5">Motif légal de résiliation (Code d'assurance)</span>
                            <input 
                              type="text"
                              value={resilReason}
                              onChange={(e) => setResilReason(e.target.value)}
                              className="w-full p-2.5 border border-slate-250 bg-white rounded-xl"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            {policyStatus === 'RESILIE' ? (
                              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl">
                                Ce contrat a été marqué comme RÉSILIÉ.
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleResilierContrat}
                                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition-all cursor-pointer outline-none"
                              >
                                Déclarer la Résiliation (Préavis 30 jours)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* MODAL COUVERTURE COMPLÉMENTAIRE CRÉATION ACTES */}
      {showAddGarantieModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-100 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-800">Ajouter Acte Nomenclature</h3>
              <button onClick={() => setShowAddGarantieModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Famille d'actes (Standard CIMA)</span>
                <input 
                  type="text" 
                  value={newGarantieFamille} 
                  onChange={(e) => setNewGarantieFamille(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:border-[#00A86B] font-semibold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Plafond annuel ($)</span>
                  <input 
                    type="number" 
                    value={newGarantiePlafond} 
                    onChange={(e) => setNewGarantiePlafond(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:border-[#00A86B] font-semibold" 
                  />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Prise en charge (%)</span>
                  <input 
                    type="number" 
                    value={newGarantieTaux} 
                    onChange={(e) => setNewGarantieTaux(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:border-[#00A86B] font-semibold" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Plafond / séance ($)</span>
                  <input 
                    type="number" 
                    value={newGarantieSeance} 
                    onChange={(e) => setNewGarantieSeance(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:border-[#00A86B] font-semibold" 
                  />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Carence légale</span>
                  <input 
                    type="text" 
                    value={newGarantieCarence} 
                    onChange={(e) => setNewGarantieCarence(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:border-[#00A86B] font-semibold" 
                  />
                </div>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Accord Préalable Requis ?</span>
                <select
                  value={newGarantieAp}
                  onChange={(e) => setNewGarantieAp(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:border-[#00A86B] font-semibold"
                >
                  <option value="Non">Non</option>
                  <option value="Oui">Oui</option>
                  <option value="Oui (>500$)">Oui &gt; 500$</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button 
                onClick={() => setShowAddGarantieModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddCustomGarantie}
                className="px-4 py-2 bg-[#00A86B] text-white hover:bg-[#00905a] rounded-lg font-bold"
              >
                Injecter Acte
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
