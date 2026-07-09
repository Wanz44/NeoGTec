import React, { useEffect } from 'react';
import { Shield, FileText, Users, Check, Printer, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FamilyMember {
  relation: string;
  name: string;
  birthDate: string;
  gender: 'M' | 'F' | '';
  cardNum?: string;
}

export interface BiaData {
  id: string;
  company: string;
  rccm: string;
  idNat: string;
  adherentNom: string;
  adherentPrenom: string;
  adherentDtn: string;
  adherentLieuNais: string;
  adherentSexe: 'M' | 'F' | '';
  adherentEtatCivil: string;
  adherentMatricule: string;
  adherentProfession: string;
  adherentTel: string;
  adherentEmail: string;
  adherentAdresse: string;
  adherentVille: string;
  formula: string;
  familyMembers: FamilyMember[];
}

interface BiaPrintDocumentProps {
  isVierge: boolean;
  data?: BiaData | null;
  onBack?: () => void;
}

// Default pre-filled data for demonstration (consistent with Kwilu-Services / Goma family)
const DEFAULT_BIA_DATA: BiaData = {
  id: 'BIA-CIMA-2026-00918',
  company: 'KWILU-SERVICES SARL',
  rccm: 'CD/KIN/RCCM/2026/B/0412',
  idNat: '6-99-N88120L',
  adherentNom: 'GOMA',
  adherentPrenom: 'Sébastien',
  adherentDtn: '12/10/1982',
  adherentLieuNais: 'Kinshasa',
  adherentSexe: 'M',
  adherentEtatCivil: 'Marié',
  adherentMatricule: 'KS-88210',
  adherentProfession: 'Superviseur Logistique',
  adherentTel: '+243 812 904 555',
  adherentEmail: 'sebastien.goma@kwilu-services.cd',
  adherentAdresse: 'Avenue de la Paix, Q/ Volcans, Goma, Nord-Kivu',
  adherentVille: 'Goma',
  formula: 'CONFORT FAMILLE',
  familyMembers: [
    { relation: 'Conjointe', name: 'GOMA née MIREILLE Chantal', birthDate: '24/05/1988', gender: 'F', cardNum: 'NGTC-2026-00918-01' },
    { relation: 'Enfant rattaché 1', name: 'GOMA Sarah', birthDate: '05/11/2014', gender: 'F', cardNum: 'NGTC-2026-00918-02' },
    { relation: 'Enfant rattaché 2', name: 'GOMA Kévin', birthDate: '19/09/2017', gender: 'M', cardNum: 'NGTC-2026-00918-03' },
    { relation: 'Enfant rattaché 3', name: 'GOMA Divine', birthDate: '02/01/2021', gender: 'F', cardNum: 'NGTC-2026-00918-04' },
    { relation: 'Enfant rattaché 4', name: '...................................................', birthDate: '..../..../........', gender: '', cardNum: '...................' }
  ]
};

export const BiaPrintDocument: React.FC<BiaPrintDocumentProps> = ({ isVierge, data, onBack }) => {
  const activeData = isVierge ? null : (data || DEFAULT_BIA_DATA);

  useEffect(() => {
    // Inject BIA-specific print styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body {
          background: white !important;
          color: black !important;
          font-family: Arial, sans-serif !important;
          font-size: 10pt !important;
        }
        .no-print {
          display: none !important;
        }
        .page-break {
          page-break-after: always !important;
          break-after: page !important;
          display: block !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
        }
        .printable-sheet {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: none !important;
          height: auto !important;
          min-height: 0 !important;
          background: transparent !important;
        }
        @page {
          size: A4;
          margin: 1.2cm 1.2cm 1.2cm 1.2cm;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Banner - Hidden on print */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 no-print shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          )}
          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Aperçu Impression :</span>
            <h4 className="text-sm font-black text-slate-800">
              {isVierge ? "Bulletin Individuel d'Adhésion Vierge" : `BIA de ${activeData?.adherentPrenom} ${activeData?.adherentNom}`}
            </h4>
          </div>
        </div>

        <button
          onClick={triggerPrint}
          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border-none"
        >
          <Printer className="w-4 h-4" />
          Imprimer le formulaire BIA A4
        </button>
      </div>

      {/* Main Print Container */}
      <div className="bg-slate-100 p-8 min-h-screen overflow-y-auto flex flex-col items-center gap-8 shadow-inner no-print:max-h-[85vh] print:bg-white print:p-0 print:min-h-0 print:shadow-none">
        
        {/* ==========================================
            PAGE 1: ADHÉRENT / EMPLOYEUR / FAMILLE
            ========================================== */}
        <div className="w-[21cm] min-h-[29.7cm] bg-white p-[1.5cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
          <div className="space-y-5">
            
            {/* Header Block */}
            <div className="border border-black p-4 text-center relative">
              <div className="absolute top-2 right-2 border border-black px-2 py-0.5 text-[8px] font-black uppercase font-mono tracking-wider">
                Réglementaire ARCA / CIMA
              </div>
              <h1 className="text-base font-black uppercase tracking-wider text-slate-900 leading-none">
                SANTÉ PLUS ASSURANCES SARL
              </h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1.5 font-sans">
                BULLETIN INDIVIDUEL D'ADHÉSION (BIA)
              </p>
              <p className="text-[8px] font-mono mt-1 text-slate-500">
                FORMULE SOUSCRITE : {isVierge ? "CONFORT INDIVIDUEL / FAMILLE" : activeData?.formula} • RÉF BIA : {isVierge ? "..................................." : activeData?.id}
              </p>
            </div>

            {/* Instruction Warning block */}
            <p className="text-[9.5px] leading-relaxed text-justify text-slate-600">
              <em><strong>Notice explicative :</strong> Ce bulletin d'adhésion est obligatoire pour l'affiliation aux garanties santé collectives ou individuelles régies par le Code des Assurances CIMA. Les renseignements fournis sont confidentiels et font l'objet d'un chiffrement numérique réglementaire (pgsodium). Tout renseignement inexact ou omission volontaire est passible des sanctions prévues par l'article 17 du Code CIMA (nullité de l'adhésion ou réduction proportionnelle des indemnités).</em>
            </p>

            {/* Section 1: Informations Employeur / Souscripteur */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 pb-0.5 tracking-wider">
                1. CADRE RÉSERVÉ À L'EMPLOYEUR (SOUSCRIPTEUR)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-[10.5px] leading-relaxed bg-slate-50/50 p-2.5 border border-slate-250">
                <div className="space-y-1">
                  <p><strong>Nom / Raison Sociale :</strong> {isVierge ? "..........................................................................." : activeData?.company}</p>
                  <p><strong>Numéro de RCCM :</strong> {isVierge ? "..........................................................................." : activeData?.rccm}</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Identifiant National (ID NAT) :</strong> {isVierge ? "..........................................................................." : activeData?.idNat}</p>
                  <p><strong>Formule souscrite par l'entreprise :</strong> {isVierge ? "..........................................................................." : activeData?.formula}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Informations de l'Adhérent (Assuré Principal) */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 pb-0.5 tracking-wider">
                2. RENSEIGNEMENTS CONCERNANT L'ADHÉRENT (ASSURÉ PRINCIPAL)
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10.5px] leading-relaxed bg-slate-50/50 p-2.5 border border-slate-250">
                <div>
                  <p className="py-0.5"><strong>Nom de famille :</strong> {isVierge ? "........................................................................" : activeData?.adherentNom}</p>
                  <p className="py-0.5"><strong>Prénom :</strong> {isVierge ? "........................................................................" : activeData?.adherentPrenom}</p>
                  <p className="py-0.5"><strong>Date de Naissance :</strong> {isVierge ? "J J / M M / A A A A" : activeData?.adherentDtn}</p>
                  <p className="py-0.5"><strong>Lieu de Naissance :</strong> {isVierge ? "................................................" : activeData?.adherentLieuNais}</p>
                  <p className="py-0.5">
                    <strong>Sexe :</strong> &nbsp;
                    <span className="font-mono">
                      [ {activeData?.adherentSexe === 'M' ? 'X' : ' '} ] M &nbsp;&nbsp; 
                      [ {activeData?.adherentSexe === 'F' ? 'X' : ' '} ] F
                    </span>
                  </p>
                  <p className="py-0.5"><strong>État civil :</strong> {isVierge ? "Célibataire / Marié / Veuf / Divorcé" : activeData?.adherentEtatCivil}</p>
                </div>
                <div>
                  <p className="py-0.5"><strong>N° Matricule RH :</strong> {isVierge ? "................................................" : activeData?.adherentMatricule}</p>
                  <p className="py-0.5"><strong>Profession / Fonction :</strong> {isVierge ? "................................................" : activeData?.adherentProfession}</p>
                  <p className="py-0.5"><strong>Téléphone Mobile :</strong> {isVierge ? "................................................" : activeData?.adherentTel}</p>
                  <p className="py-0.5"><strong>E-mail d'activité :</strong> {isVierge ? "................................................" : activeData?.adherentEmail}</p>
                  <p className="py-0.5"><strong>Adresse de Résidence :</strong> {isVierge ? "........................................................................" : activeData?.adherentAdresse}</p>
                  <p className="py-0.5"><strong>Ville / Province :</strong> {isVierge ? "................................................" : activeData?.adherentVille}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Membres de la Famille Bénéficiaires */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-indigo-600 pb-0.5">
                <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                  3. MEMBRES DE LA FAMILLE À LA CHARGE DE L'ADHÉRENT (BÉNÉFICIAIRES)
                </h3>
                <span className="text-[8px] font-black uppercase text-slate-400">Arbre Familial Autorisé</span>
              </div>
              
              <p className="text-[9px] text-slate-500 leading-relaxed italic">
                Inscrire ci-dessous le conjoint et les enfants légitimes à charge éligibles aux prestations d'assurance santé. Fournir un acte de mariage et des extraits d'acte de naissance pour chaque membre déclaré.
              </p>

              <table className="w-full text-left text-[10px] border-collapse border border-black mt-1">
                <thead>
                  <tr className="bg-slate-150 border-b border-black font-bold text-[9px] uppercase tracking-wider">
                    <th className="p-1.5 border-r border-black w-24">Lien de Parenté</th>
                    <th className="p-1.5 border-r border-black">Nom &amp; Prénom du Bénéficiaire</th>
                    <th className="p-1.5 border-r border-black text-center w-24">Né(e) le</th>
                    <th className="p-1.5 border-r border-black text-center w-14">Sexe (M/F)</th>
                    <th className="p-1.5 text-center w-28">N° Carte Assuré</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {isVierge ? (
                    [
                      { relation: 'Conjoint(e)', name: '.........................................................................................', bday: 'J J / M M / A A A A', sex: '....', card: '...................' },
                      { relation: 'Enfant rattaché 1', name: '.........................................................................................', bday: 'J J / M M / A A A A', sex: '....', card: '...................' },
                      { relation: 'Enfant rattaché 2', name: '.........................................................................................', bday: 'J J / M M / A A A A', sex: '....', card: '...................' },
                      { relation: 'Enfant rattaché 3', name: '.........................................................................................', bday: 'J J / M M / A A A A', sex: '....', card: '...................' },
                      { relation: 'Enfant rattaché 4', name: '.........................................................................................', bday: 'J J / M M / A A A A', sex: '....', card: '...................' }
                    ].map((row, index) => (
                      <tr key={index}>
                        <td className="p-1.5 border-r border-black font-bold uppercase text-[8px] text-indigo-600">{row.relation}</td>
                        <td className="p-1.5 border-r border-black font-mono text-[9px]">{row.name}</td>
                        <td className="p-1.5 border-r border-black text-center font-mono">{row.bday}</td>
                        <td className="p-1.5 border-r border-black text-center font-mono">{row.sex}</td>
                        <td className="p-1.5 text-center font-mono text-[9px]">{row.card}</td>
                      </tr>
                    ))
                  ) : (
                    activeData?.familyMembers.map((item, index) => (
                      <tr key={index}>
                        <td className="p-1.5 border-r border-black font-bold uppercase text-[8px] text-indigo-600">{item.relation}</td>
                        <td className="p-1.5 border-r border-black font-bold text-slate-900">{item.name}</td>
                        <td className="p-1.5 border-r border-black text-center font-mono">{item.birthDate}</td>
                        <td className="p-1.5 border-r border-black text-center font-mono font-bold">{item.gender || '-'}</td>
                        <td className="p-1.5 text-center font-mono text-slate-800 text-[9px]">{item.cardNum}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Section 4: Notice des garanties et ticket modérateur */}
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 pb-0.5 tracking-wider">
                4. DISPOSITIONS CONTRACTUELLES - LIMITES ET FRANCHISES
              </h3>
              <div className="grid grid-cols-2 gap-4 text-[9px] leading-relaxed text-justify bg-slate-50/50 p-2 border border-slate-200">
                <div>
                  <p>• <strong>Taux de Prise en Charge :</strong> Consultations de médecine courante (90%), Spécialistes (80%), Analyses et Radiologie (80%), Hospitalisation (100% en chambre standard), Pharmacie (70% sur ordonnance médicale agréée).</p>
                  <p className="mt-1">• <strong>Délais de carence applicables :</strong> Trente (30) jours pour les maladies ordinaires, Dix (10) mois consécutifs d'assurance active pour la maternité (accouchement et examens prénataux).</p>
                </div>
                <div>
                  <p>• <strong>Franchise d'Ambulatoire :</strong> Une franchise fixe obligatoire de <strong>10 000 CDF</strong> par consultation médicale externe reste à la charge exclusive de l'adhérent auprès du réseau tiers-payant.</p>
                  <p className="mt-1">• <strong>Réseau Conventionné :</strong> Accès direct sur présentation de la carte d'assuré numérique biométrique au réseau national NeoGTec Healthcare (127 centres de santé agréés).</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer of Page 1 */}
          <div className="border-t border-slate-200 pt-2 flex justify-between text-[8px] font-mono text-slate-400">
            <span>SANTÉ PLUS ASSURANCES SARL • BULLETIN INDIVIDUEL D'ADHÉSION</span>
            <span>Réf : {isVierge ? "FORMULAIRE_VIERGE" : activeData?.id} • Page 1 / 2</span>
          </div>
        </div>

        <div className="page-break" />

        {/* ==========================================
            PAGE 2: QUESTIONNAIRE MÉDICAL / SIGNATURES
            ========================================== */}
        <div className="w-[21cm] min-h-[29.7cm] bg-white p-[1.5cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
          <div className="space-y-5">
            
            <div className="border border-black p-3 text-center">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                BULLETIN INDIVIDUEL D'ADHÉSION (BIA) — DEUXIÈME PARTIE
              </h2>
              <p className="text-[8px] font-mono text-slate-500 mt-1">
                CONFIDENTIALITÉ ABSOLUE • SECRET MÉDICAL (PROTECTION PAR CRYTOGRAPHIE PGSODIUM)
              </p>
            </div>

            {/* Section 5: Questionnaire Médical Simplifié */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 pb-0.5 tracking-wider">
                5. DECLARATION DE SANTÉ &amp; QUESTIONNAIRE MÉDICAL SIMPLIFIÉ (Obligatoire)
              </h3>
              
              <p className="text-[9px] text-slate-500 leading-relaxed italic text-justify">
                Chaque assuré principal et chaque conjoint déclaré doit répondre aux questions ci-dessous avec sincérité. Cochez <strong>OUI</strong> ou <strong>NON</strong>. Si vous répondez OUI à une ou plusieurs questions, veuillez apporter des précisions claires dans l'encadré prévu ci-dessous (nature de l'affection, date de diagnostic, traitements en cours).
              </p>

              <div className="border border-black">
                {/* Table of questions */}
                <table className="w-full text-left text-[9.5px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-black font-bold text-[9px] uppercase tracking-wider">
                      <th className="p-2 border-r border-black">Questions Médicales Obligatoires</th>
                      <th className="p-2 border-r border-black text-center w-16">OUI</th>
                      <th className="p-2 text-center w-16">NON</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black leading-tight">
                    {[
                      { q: "1. Êtes-vous actuellement sous traitement médical régulier ou prenez-vous des médicaments prescrits quotidiennement ?", isVierge: true },
                      { q: "2. Avez-vous été hospitalisé(e) ou subi une intervention chirurgicale au cours des deux (2) dernières années ?", isVierge: true },
                      { q: "3. Souffrez-vous d'une affection chronique, de longue durée (diabète, hypertension artérielle, insuffisance cardiaque, asthme, hépatite...) ?", isVierge: true },
                      { q: "4. Envisagez-vous une hospitalisation, des soins spécialisés ou une intervention chirurgicale dans les six (6) prochains mois ?", isVierge: true },
                      { q: "5. Pour les femmes : Êtes-vous actuellement enceinte ? Si oui, précisez la date d'accouchement prévue (DPA).", isVierge: true },
                      { q: "6. Souffrez-vous d'une infirmité physique, d'une anomalie congénitale ou d'une limitation de mobilité non déclarée ?", isVierge: true }
                    ].map((row, index) => (
                      <tr key={index} className="h-9">
                        <td className="p-2 border-r border-black font-medium">{row.q}</td>
                        <td className="p-2 border-r border-black text-center font-mono">
                          [ &nbsp;&nbsp;&nbsp; ]
                        </td>
                        <td className="p-2 text-center font-mono">
                          [ &nbsp;&nbsp;&nbsp; ]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Textbox for explanations */}
              <div className="border border-black p-3.5 space-y-1">
                <span className="block text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Détail et explications (En cas de réponse OUI aux questions ci-dessus) :
                </span>
                {isVierge ? (
                  <div className="space-y-3.5 pt-2">
                    <p className="border-b border-dashed border-slate-400 font-mono text-[10px] text-slate-300">
                      ......................................................................................................................................................................................................
                    </p>
                    <p className="border-b border-dashed border-slate-400 font-mono text-[10px] text-slate-300">
                      ......................................................................................................................................................................................................
                    </p>
                    <p className="border-b border-dashed border-slate-400 font-mono text-[10px] text-slate-300">
                      ......................................................................................................................................................................................................
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 border border-slate-150 rounded text-slate-650 italic text-[10px] leading-relaxed">
                    Néant. L'adhérent déclare être en bonne santé générale à la date d'affiliation et ne présenter aucune affection chronique ou infirmité non signalée.
                  </div>
                )}
              </div>
            </div>

            {/* Section 6: Déclaration sur l'honneur et Engagement */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 pb-0.5 tracking-wider">
                6. DÉCLARATION SUR L'HONNEUR, CONSENTEMENT RGPD &amp; AUTORISATION DE SOINS
              </h3>
              <p className="text-[9px] leading-relaxed text-justify text-slate-600">
                Je soussigné(e), adhérent(e) désigné(e) à la section 2 du présent bulletin, certifie exactes et complètes toutes les réponses fournies ci-dessus. 
                Je consens expressément à ce que mes données de santé personnelles ainsi que celles de mes bénéficiaires à charge soient stockées et traitées électroniquement par SANTÉ PLUS ASSURANCES et son prestataire de tiers-payant NeoGTec, sous la forme cryptographique protégée AES-256 (pgsodium). 
                J'autorise tout médecin, établissement de soins ou autorité sanitaire à communiquer à l'Assureur les renseignements médicaux nécessaires à l'évaluation des risques et au règlement direct des prestations dans le strict respect du secret médical et du règlement de conformité ARCA (Art. 24).
              </p>
            </div>

            {/* Section 7: Signatures Block */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 pb-0.5 tracking-wider">
                7. SIGNATURES ET HOMOLOGATION (Mentions manuscrites obligatoires 'Lu et Approuvé')
              </h3>
              
              <div className="grid grid-cols-3 gap-4 pt-1 text-[10.5px]">
                {/* Adherent signature */}
                <div className="border border-black p-3 min-h-[140px] flex flex-col justify-between">
                  <div>
                    <span className="block font-black text-slate-400 text-[8px] uppercase tracking-wider mb-1">L'Adhérent (Assuré)</span>
                    <p className="text-[8.5px] italic text-slate-500">Mention "Lu et approuvé" + Signature :</p>
                  </div>
                  {isVierge ? (
                    <div className="h-16 flex items-end font-mono text-[9px] text-slate-300">
                      .................................................
                    </div>
                  ) : (
                    <div className="pt-2 text-center">
                      <span className="font-serif italic font-bold text-slate-800 text-sm">{activeData?.adherentPrenom} {activeData?.adherentNom}</span>
                      <div className="mt-2 font-mono font-bold text-[#00A86B] text-[8.5px]">[ SIGNÉ NUMÉRIQUEMENT ]</div>
                    </div>
                  )}
                </div>

                {/* Employer signature */}
                <div className="border border-black p-3 min-h-[140px] flex flex-col justify-between">
                  <div>
                    <span className="block font-black text-slate-400 text-[8px] uppercase tracking-wider mb-1">L'Employeur / Souscripteur</span>
                    <p className="text-[8.5px] italic text-slate-500">Signature et Cachet officiel :</p>
                  </div>
                  {isVierge ? (
                    <div className="h-16 flex items-end font-mono text-[9px] text-slate-300">
                      .................................................
                    </div>
                  ) : (
                    <div className="pt-2 text-center relative flex flex-col items-center">
                      {/* Round cachet */}
                      <div className="w-12 h-12 border-2 border-dashed border-indigo-600/50 rounded-full flex flex-col items-center justify-center text-[5px] font-black uppercase tracking-wider text-indigo-600/50 transform rotate-12 absolute -top-1">
                        <span>KS DRH</span>
                        <span>AGRÉÉ</span>
                      </div>
                      <span className="font-serif italic text-slate-800 text-[11px] font-bold mt-4">Sébastien Goma</span>
                      <div className="mt-1 font-mono font-bold text-indigo-600 text-[8.5px]">[ SCEAU CERTIFIÉ ]</div>
                    </div>
                  )}
                </div>

                {/* Company / Assurer signature */}
                <div className="border border-black p-3 min-h-[140px] flex flex-col justify-between">
                  <div>
                    <span className="block font-black text-slate-400 text-[8px] uppercase tracking-wider mb-1">L'Assureur (Santé Plus)</span>
                    <p className="text-[8.5px] italic text-slate-500">Visa et Cachet d'agrément ARCA :</p>
                  </div>
                  {isVierge ? (
                    <div className="h-16 flex items-end font-mono text-[9px] text-slate-300">
                      .................................................
                    </div>
                  ) : (
                    <div className="pt-2 text-center relative flex flex-col items-center">
                      {/* Round red stamp */}
                      <div className="w-14 h-14 border-2 border-dashed border-rose-600/50 rounded-full flex flex-col items-center justify-center text-[5px] font-black uppercase tracking-widest text-rose-600/50 transform rotate-12 absolute -top-2">
                        <span>AGRÉÉ ARCA</span>
                        <span className="text-[7px] font-black">RDC N°001</span>
                      </div>
                      <span className="font-bold text-slate-800 text-[9px] mt-6">Directeur de Souscription</span>
                      <div className="mt-1 font-mono font-bold text-rose-600 text-[8.5px]">[ CACHET ARCA VALIDÉ ]</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Footer of Page 2 */}
          <div className="border-t border-slate-200 pt-2 flex justify-between text-[8px] font-mono text-slate-400">
            <span>SANTÉ PLUS ASSURANCES SARL • BULLETIN INDIVIDUEL D'ADHÉSION</span>
            <span>Réf : {isVierge ? "FORMULAIRE_VIERGE" : activeData?.id} • Page 2 / 2</span>
          </div>
        </div>

      </div>
    </div>
  );
};
