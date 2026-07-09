import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Shield, UserCheck, CreditCard, Users, Clock, AlertCircle, FileSpreadsheet,
  PhoneCall, QrCode, Briefcase, MapPin, Check, FileCheck, DollarSign, Printer, ArrowLeft, ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BiaPrintDocument, BiaData } from './BiaPrintDocument';

export interface ContractItem {
  id: string;
  company: string;
  type: 'Particulier' | 'Famille' | 'Groupe' | 'Individuel' | 'PMI' | 'État';
  status: 'Actif' | 'Devis' | 'Résilié';
  monthlyPremium: number;
}

export interface ContractPDFViewerProps {
  contract?: ContractItem | null;
}

// =========================================================================
// HELPER TO DERIVE DYNAMIC VALUES
// =========================================================================
const getContractDetails = (c?: ContractItem | null) => {
  const defaultId = 'CTR-SP-2026-000482';
  const defaultCompany = 'MININGCO SARL';
  const defaultInsured = 'MUKENDI Jean-Paul';
  const defaultJob = 'Ingénieur';
  const defaultType = 'Famille';
  const defaultFormula = 'CONFORT FAMILLE';
  const defaultPremium = 270833;

  if (!c) {
    return {
      id: defaultId,
      company: defaultCompany,
      insured: defaultInsured,
      job: defaultJob,
      type: defaultType,
      formula: defaultFormula,
      premium: defaultPremium,
    };
  }

  const id = c.id;
  let company = c.company;
  let insured = defaultInsured;
  let job = defaultJob;

  if (c.company.includes('(')) {
    const parts = c.company.split('(');
    company = parts[0].trim();
    const nameInParens = parts[1].replace(')', '').trim();
    insured = nameInParens + ' Jean-Paul';
  } else if (c.type === 'Particulier' || c.type === 'Individuel') {
    insured = c.company;
    company = 'Souscription Individuelle';
    job = 'Particulier';
  } else {
    company = c.company;
    if (c.company.toLowerCase().includes('rawbank')) {
      insured = 'KABULO Marc';
      job = 'Cadre de Banque';
    } else if (c.company.toLowerCase().includes('bralima')) {
      insured = 'MONDONGE Pierre';
      job = 'Technicien de Production';
    } else if (c.company.toLowerCase().includes('kabange')) {
      insured = 'KABANGE Pierre';
      job = 'Chef de Famille';
    } else {
      insured = 'MUKENDI Jean-Paul';
    }
  }

  let formula = defaultFormula;
  if (c.type === 'Particulier' || c.type === 'Individuel') {
    formula = 'CONFORT INDIVIDUEL';
  } else if (c.type === 'Famille') {
    formula = 'CONFORT FAMILLE';
  } else {
    formula = 'CONFORT ENTREPRISE (CIMA)';
  }

  return {
    id,
    company,
    insured,
    job,
    type: c.type,
    formula,
    premium: c.monthlyPremium,
  };
};

// =========================================================================
// INTERACTIVE & PRINT CONTROLLER COMPONENT
// =========================================================================
export const ContractPDFViewer: React.FC<ContractPDFViewerProps> = ({ contract }) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'printPreview'>('interactive');
  const [activeSection, setActiveSection] = useState<'general' | 'particular' | 'bia'>('general');
  const [activeArticleTab, setActiveArticleTab] = useState<number>(1);
  const [activePolicePoint, setActivePolicePoint] = useState<number>(1);

  const details = getContractDetails(contract);
  const surname = details.insured.split(' ')[0] || 'MUKENDI';

  // Construct BIA data based on active contract details
  const biaData: BiaData = {
    id: `BIA-${details.id}`,
    company: details.company,
    rccm: 'CD/KIN/RCCM/2026/B/0412',
    idNat: '6-99-N88120L',
    adherentNom: surname,
    adherentPrenom: details.insured.split(' ').slice(1).join(' ') || 'Jean-Paul',
    adherentDtn: '12/10/1982',
    adherentLieuNais: 'Kinshasa',
    adherentSexe: 'M',
    adherentEtatCivil: 'Marié',
    adherentMatricule: 'KS-88210',
    adherentProfession: details.job,
    adherentTel: '+243 812 904 555',
    adherentEmail: `${surname.toLowerCase()}@gmail.com`,
    adherentAdresse: 'Avenue de la Paix, Q/ Volcans, Goma, Nord-Kivu',
    adherentVille: 'Goma',
    formula: details.formula,
    familyMembers: [
      { relation: 'Conjointe', name: `${surname} Mireille`, birthDate: '24/05/1988', gender: 'F', cardNum: `NGTC-${details.id}-01` },
      { relation: 'Enfant rattaché 1', name: `${surname} Sarah`, birthDate: '05/11/2014', gender: 'F', cardNum: `NGTC-${details.id}-02` },
      { relation: 'Enfant rattaché 2', name: `${surname} Kévin`, birthDate: '19/09/2017', gender: 'M', cardNum: `NGTC-${details.id}-03` },
      { relation: 'Enfant rattaché 3', name: '...................................................', birthDate: '..../..../........', gender: '', cardNum: '...................' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* View Mode Switcher and Print Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-150 no-print shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Visualisation :</span>
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('interactive')}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                viewMode === 'interactive'
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              📱 Navigation Interactif
            </button>
            <button
              onClick={() => setViewMode('printPreview')}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                viewMode === 'printPreview'
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              📄 Format A4 PDF Complet
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            if (viewMode !== 'printPreview') {
              setViewMode('printPreview');
              setTimeout(() => {
                window.print();
              }, 400);
            } else {
              window.print();
            }
          }}
          className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border-none"
        >
          <Printer className="w-4 h-4" />
          {activeSection === 'bia' ? "Imprimer le BIA complet A4" : "Imprimer le contrat complet A4"}
        </button>
      </div>

      {viewMode === 'printPreview' ? (
        activeSection === 'bia' ? (
          <BiaPrintDocument isVierge={false} data={biaData} />
        ) : (
          <ContractPrintDocument isVierge={false} contract={contract} />
        )
      ) : (
        <div className="space-y-6">
          {/* Selector with Glassmorphism styling */}
          <div className="flex bg-slate-900/10 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 max-w-3xl mx-auto shadow-sm">
            <button
              onClick={() => { setActiveSection('general'); setViewMode('interactive'); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 outline-none cursor-pointer ${
                activeSection === 'general' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              Conditions Générales (Contrat)
            </button>
            <button
              onClick={() => { setActiveSection('particular'); setViewMode('interactive'); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 outline-none cursor-pointer ${
                activeSection === 'particular' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Conditions Particulières (Police)
            </button>
            <button
              onClick={() => { setActiveSection('bia'); setViewMode('interactive'); }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 outline-none cursor-pointer ${
                activeSection === 'bia' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Users className="w-4 h-4" />
              Bulletin d'Adhésion (BIA)
            </button>
          </div>

          {activeSection === 'general' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              {/* Header Card */}
              <div className="relative p-8 bg-slate-950 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#00A86B]/15 blur-[100px] pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 bg-[#00A86B] text-white font-black text-[9px] uppercase rounded-full tracking-widest">
                      CONTRAT D'ASSURANCE SANTÉ
                    </span>
                    <h2 className="text-2xl font-black mt-3 tracking-tight">{details.id}</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">
                      Conditions Générales • République Démocratique du Congo
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Statut Juridique</span>
                    <span className="text-lg font-extrabold text-[#00A86B] block">Conforme Code CIMA</span>
                  </div>
                </div>
              </div>

              {/* Préambule Card with Glassmorphism */}
              <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-md space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/60">
                  <Shield className="w-5 h-5 text-slate-800" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    PRÉAMBULE — LES PARTIES AU CONTRAT
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Le présent contrat d'assurance santé (ci-après « le Contrat ») est conclu entre les parties suivantes, conformément au Code des Assurances de la Conférence Interafricaine des Marchés d'Assurances (CIMA) applicable en République Démocratique du Congo :
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/50 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">L'Assureur</span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      <strong>Dénomination :</strong> SANTÉ PLUS ASSURANCES SARL<br />
                      <strong>Siège social :</strong> Avenue de la Justice, Commune de la Gombe, Kinshasa, RDC<br />
                      <strong>Agrément ARCA n° :</strong> ARCA/AGR/2019/0147<br />
                      <strong>RCCM :</strong> CD/KIN/RCCM/19-B-01234<br />
                      <strong>Représenté par :</strong> Monsieur TSHIBANGU Alain, Directeur Général
                    </p>
                  </div>

                  <div className="bg-slate-50/70 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/50 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Le Souscripteur</span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      <strong>Dénomination :</strong> {details.company} {details.type === 'Groupe' ? '(souscription collective entreprise)' : '(souscription individuelle)'}<br />
                      <strong>Siège social :</strong> Boulevard Lumumba, Kinshasa, RDC<br />
                      <strong>RCCM :</strong> CD/KIN/RCCM/17-B-05678<br />
                      <strong>Représenté par :</strong> Madame NGOYI Beatrice, Directrice des Ressources Humaines
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Articles Navigation & Content with Glassmorphism */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigator */}
                <div className="space-y-2 lg:col-span-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-1">
                    Articles du Contrat
                  </span>
                  {[
                    "Article 1 — Objet",
                    "Article 2 — Définitions",
                    "Article 3 — Garanties",
                    "Article 4 — Exclusions",
                    "Article 5 — Carence",
                    "Article 6 — Cotisations",
                    "Article 7 — Durée & Résiliation",
                    "Article 8 — Prise en charge",
                    "Article 9 — Obligations",
                    "Article 10 — Droit & Litiges",
                    "Article 11 — Signatures"
                  ].map((title, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveArticleTab(idx + 1)}
                      className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-black transition-all border outline-none cursor-pointer flex items-center justify-between ${
                        activeArticleTab === idx + 1
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white/65 hover:bg-slate-100 border-slate-200/50 text-slate-600'
                      }`}
                    >
                      <span>{title}</span>
                      <Check className={`w-3.5 h-3.5 transition-opacity ${activeArticleTab === idx + 1 ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>

                {/* Content Glassmorphic Viewer */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-md min-h-[380px] flex flex-col justify-between">
                  <div>
                    {activeArticleTab === 1 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 1 — OBJET DU CONTRAT
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Le présent Contrat a pour objet de garantir, dans les conditions et limites fixées ci-après, le remboursement ou la prise en charge directe (mécanisme de tiers-payant / PEC) des frais médicaux, chirurgicaux, pharmaceutiques et d'hospitalisation engagés par l'Assuré principal et les bénéficiaires inscrits, à la suite d'une maladie, d'un accident ou d'une maternité, survenus pendant la période de validité du Contrat sur le territoire de la République Démocratique du Congo, sauf extension expresse convenue aux Conditions Particulières.
                        </p>
                      </div>
                    )}

                    {activeArticleTab === 2 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 2 — DÉFINITIONS JURIDIQUES
                        </h4>
                        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Assuré principal :</strong>
                            personne physique salariée de l'entreprise souscriptrice, titulaire du contrat de travail et inscrite nominativement à la police.
                          </p>
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Bénéficiaire :</strong>
                            conjoint et enfants à charge de l'Assuré principal, régulièrement déclarés et inscrits sur la police.
                          </p>
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Prise en Charge (PEC) :</strong>
                            autorisation délivrée par l'Assureur ou son gestionnaire permettant à l'Assuré de bénéficier de soins sans avance de frais auprès d'un prestataire conventionné.
                          </p>
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Plafond :</strong>
                            montant maximal remboursable par bénéficiaire et par an, toutes garanties ou par garantie, selon les Conditions Particulières.
                          </p>
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Délai de carence :</strong>
                            période suivant la prise d'effet du Contrat pendant laquelle certaines garanties ne sont pas encore mobilisables.
                          </p>
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Réseau conventionné :</strong>
                            ensemble des formations médicales (hôpitaux, cliniques, cabinets, pharmacies) ayant signé une convention de tiers-payant avec l'Assureur.
                          </p>
                          <p>
                            <strong className="text-slate-800 uppercase block tracking-wider text-[10px]">Ticket modérateur :</strong>
                            quote-part des frais restant à la charge de l'Assuré après intervention de l'Assureur.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeArticleTab === 3 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 3 — GARANTIES ET NIVEAUX DE PRISE EN CHARGE
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Sous réserve du paiement intégral des cotisations et dans la limite des plafonds fixés aux Conditions Particulières, les garanties suivantes sont accordées :
                        </p>
                        <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                                <th className="py-2.5 px-4">Garantie</th>
                                <th className="py-2.5 px-4 text-center">Taux de Prise en Charge</th>
                                <th className="py-2.5 px-4 text-right">Plafond annuel (CDF)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {[
                                { name: "Consultations médicales générales", rate: "90%", cap: "800 000" },
                                { name: "Consultations spécialisées", rate: "80%", cap: "1 200 000" },
                                { name: "Analyses de laboratoire et imagerie médicale", rate: "80%", cap: "1 500 000" },
                                { name: "Hospitalisation (chirurgie, médecine générale)", rate: "100%", cap: "8 000 000" },
                                { name: "Pharmacie sur prescription", rate: "70%", cap: "1 000 000" },
                                { name: "Soins dentaires", rate: "60%", cap: "500 000" },
                                { name: "Optique (verres, montures)", rate: "50%", cap: "300 000" },
                                { name: "Maternité (accouchement, césarienne, suivi prénatal)", rate: "90%", cap: "2 500 000" },
                                { name: "Évacuation sanitaire d'urgence (dans le pays)", rate: "100%", cap: "1 500 000" }
                              ].map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-4 font-bold text-slate-800">{row.name}</td>
                                  <td className="py-2 px-4 text-center font-black text-indigo-600">{row.rate}</td>
                                  <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">{row.cap} CDF</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                          Les montants ci-dessus sont exprimés en Francs Congolais (CDF) et s'entendent par bénéficiaire et par année d'assurance, sauf mention contraire aux Conditions Particulières.
                        </p>
                      </div>
                    )}

                    {activeArticleTab === 4 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 4 — EXCLUSIONS GÉNÉRALES
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Sont exclus de la garantie, sauf convention contraire expresse :
                        </p>
                        <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5">
                          <li>Les actes de médecine esthétique et de confort non prescrits médicalement ;</li>
                          <li>Les cures thermales, cures de sommeil et de rajeunissement ;</li>
                          <li>Les frais résultant de la pratique de sports à titre professionnel ou de sports extrêmes non déclarés ;</li>
                          <li>Les conséquences d'actes de guerre, d'émeutes ou de troubles civils, sauf si l'Assuré y est étranger et n'y prend pas une part active ;</li>
                          <li>Les maladies et infirmités déjà déclarées ou diagnostiquées antérieurement à la prise d'effet du Contrat et non signalées lors de la souscription ;</li>
                          <li>Les traitements de fertilité et de procréation médicalement assistée, sauf option spécifique souscrite ;</li>
                          <li>Les frais engagés hors du réseau conventionné sans autorisation préalable de l'Assureur, au-delà des plafonds de remboursement hors réseau.</li>
                        </ul>
                      </div>
                    )}

                    {activeArticleTab === 5 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 5 — DÉLAI DE CARENCE
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Les garanties prennent effet immédiatement pour les accidents et les urgences vitales.
                        </p>
                        <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs text-amber-800 space-y-1.5">
                          <p><strong> consultations &amp; hospitalisation pour maladie ordinaire :</strong> Un délai de carence de trente (30) jours s'applique.</p>
                          <p><strong>Garantie maternité :</strong> Un délai de carence de dix (10) mois s'applique, à compter de la date de prise d'effet individuelle de chaque bénéficiaire.</p>
                        </div>
                      </div>
                    )}

                    {activeArticleTab === 6 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 6 — COTISATIONS ET MODALITÉS DE PAIEMENT
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          La cotisation annuelle est calculée sur la base de la formule de garantie choisie et du nombre de bénéficiaires inscrits. Elle est payable trimestriellement d'avance par le Souscripteur, par virement bancaire, au plus tard le 5 du premier mois de chaque trimestre.
                        </p>
                        <div className="p-4 bg-rose-50 border border-rose-150 rounded-2xl text-xs text-rose-800">
                          <strong>Suspension légale pour retard :</strong> Tout retard de paiement supérieur à trente (30) jours entraîne la suspension des garanties après mise en demeure restée sans effet, conformément aux dispositions du Code CIMA.
                        </div>
                      </div>
                    )}

                    {activeArticleTab === 7 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 7 — DURÉE, RENOUVELLEMENT ET RÉSILIATION
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Le Contrat est conclu pour une durée d'un (1) an, du 1er janvier au 31 décembre, renouvelable par tacite reconduction sauf dénonciation par l'une des parties par lettre recommandée ou tout moyen écrit avec accusé de réception, adressée au moins deux (2) mois avant l'échéance annuelle.
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Il peut également être résilié en cours d'année en cas de non-paiement des cotisations, de fausse déclaration intentionnelle, ou de cessation d'activité du Souscripteur.
                        </p>
                      </div>
                    )}

                    {activeArticleTab === 8 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 8 — MODALITÉS DE PRISE EN CHARGE ET DE SINISTRE
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Deux mécanismes clairs de gestion des prestations sont prévus :
                        </p>
                        <div className="space-y-3.5 text-xs text-slate-700">
                          <div className="p-4.5 bg-slate-50 border border-slate-150 rounded-2xl">
                            <strong className="text-[#00A86B] block uppercase tracking-wider text-[10px] mb-1">1. Tiers-payant (PEC directe)</strong>
                            Auprès des prestataires du réseau conventionné, sur présentation de la carte d'assuré et après vérification biométrique ou par code QR ; l'Assureur règle directement le prestataire, déduction faite du ticket modérateur éventuel.
                          </div>
                          <div className="p-4.5 bg-slate-50 border border-slate-150 rounded-2xl">
                            <strong className="text-indigo-600 block uppercase tracking-wider text-[10px] mb-1">2. Remboursement différé</strong>
                            Pour les soins reçus hors réseau ou en cas d'urgence, l'Assuré avance les frais et transmet le dossier de remboursement (facture originale, prescription, compte-rendu médical) dans un délai de quatre-vingt-dix (90) jours suivant la date des soins.
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 italic">
                          Tout dépassement de plafond fait l'objet d'une demande de dérogation motivée, soumise à validation par la Direction Médicale de l'Assureur.
                        </p>
                      </div>
                    )}

                    {activeArticleTab === 9 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 9 — OBLIGATIONS DES PARTIES
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <span className="font-black text-slate-700 uppercase text-[10px] block border-b pb-1">Souscripteur / Assuré</span>
                            <ul className="space-y-2 text-slate-600 list-disc pl-4 leading-relaxed">
                              <li>Déclarer avec exactitude l'état de santé et la composition familiale des bénéficiaires à la souscription ;</li>
                              <li>Signaler tout changement de situation (naissance, mariage, départ d'un bénéficiaire) dans un délai de trente (30) jours ;</li>
                              <li>Payer les cotisations aux échéances convenues.</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <span className="font-black text-slate-700 uppercase text-[10px] block border-b pb-1">L'Assureur</span>
                            <ul className="space-y-2 text-slate-600 list-disc pl-4 leading-relaxed">
                              <li>Délivrer les cartes d'assuré et gérer le réseau de prestataires conventionnés ;</li>
                              <li>Traiter les demandes de PEC et de remboursement dans un délai maximal de quinze (15) jours ouvrables ;</li>
                              <li>Informer le Souscripteur de toute modification des Conditions Générales.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeArticleTab === 10 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 10 — DROIT APPLICABLE ET JURIDITION COMPÉTENTE
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Le présent Contrat est régi par le Code des Assurances CIMA et, à titre supplétif, par le droit congolais des assurances.
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Tout litige relatif à son interprétation ou à son exécution qui ne pourrait être résolu à l'amiable sera soumis aux tribunaux compétents de Kinshasa/Gombe, sans préjudice du recours à l'Autorité de Régulation et de Contrôle des Assurances (ARCA).
                        </p>
                      </div>
                    )}

                    {activeArticleTab === 11 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                          ARTICLE 11 — SIGNATURES ET HOMOLOGATIONS
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Fait à Kinshasa, en deux exemplaires originaux, le 02 janvier 2026.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
                          <div className="border-t border-slate-300 pt-3">
                            <span className="font-black uppercase text-slate-400 block text-[9px] mb-1">Pour l'Assureur</span>
                            <strong className="text-slate-800">TSHIBANGU Alain</strong>
                            <span className="text-slate-500 block">Directeur Général</span>
                            <div className="mt-4 text-[10px] font-mono text-[#00A86B] font-bold">[ SIGNÉ ÉLECTRONIQUEMENT ]</div>
                          </div>
                          <div className="border-t border-slate-300 pt-3">
                            <span className="font-black uppercase text-slate-400 block text-[9px] mb-1">Pour le Souscripteur</span>
                            <strong className="text-slate-800">NGOYI Beatrice</strong>
                            <span className="text-slate-500 block">Directrice RH</span>
                            <div className="mt-4 text-[10px] font-mono text-[#00A86B] font-bold">[ SIGNÉ ÉLECTRONIQUEMENT ]</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Glassmorphic Footer Controls */}
                  <div className="mt-8 pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>RÉF : {details.id}</span>
                    <span>Page {activeArticleTab} / 11</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'particular' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              {/* Policy Title Header */}
              <div className="relative p-8 bg-slate-950 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-600/10 blur-[100px] pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 bg-indigo-600 text-white font-black text-[9px] uppercase rounded-full tracking-widest">
                      POLICE D'ASSURANCE SANTÉ
                    </span>
                    <h2 className="text-2xl font-black mt-3 tracking-tight">{details.id}</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">
                      Conditions Particulières • Document nominatif rattaché au Contrat
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Formule Souscrite</span>
                    <span className="text-lg font-black text-[#00A86B] block">{details.formula}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/75 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assuré Principal</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1.5">{details.insured}</span>
                  <span className="text-xs text-slate-500 block">{details.job} — {details.company}</span>
                </div>
                <div className="bg-white/75 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Période de Validité</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1.5">01/02/2026 — 31/12/2026</span>
                  <span className="text-xs text-slate-500 block">Date d'effet : 01/02/2026</span>
                </div>
                <div className="bg-white/75 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Réseau de soins</span>
                  <span className="text-sm font-bold text-slate-800 block mt-1.5">Réseau National NeoGTec</span>
                  <span className="text-xs text-slate-500 block">127 formations médicales (Kinshasa, Lubumbashi, Goma)</span>
                </div>
              </div>

              {/* Points Navigation for Conditions Particulières */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Nav Column */}
                <div className="lg:col-span-1 space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-1">
                    Clauses de la Police
                  </span>
                  {[
                    "1. Identification",
                    "2. Assuré principal",
                    "3. Arbre familial",
                    "4. Garanties de Formule",
                    "5. Barème détaillé",
                    "6. Franchises & Ticket",
                    "7. Délais de carence",
                    "8. Exclusions Spécifiques",
                    "9. Réseau de soins",
                    "10. Procédure PEC",
                    "11. Suivi Consommation",
                    "12. Renouvellement",
                    "13. Clauses & Dérogations",
                    "14. Assistance & Contacts",
                    "15. Prime & Échéancier",
                    "16. Modèle de Carte",
                    "17. Avenants",
                    "18. Visa & Délivrance"
                  ].map((point, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePolicePoint(idx + 1)}
                      className={`w-full text-left py-2 px-3.5 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer flex items-center justify-between ${
                        activePolicePoint === idx + 1
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white/65 hover:bg-slate-100 border-slate-200/50 text-slate-600'
                      }`}
                    >
                      <span>{point}</span>
                      <Check className={`w-3 h-3 transition-opacity ${activePolicePoint === idx + 1 ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>

                {/* Content Display Card */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-md min-h-[480px] flex flex-col justify-between">
                  <div>
                    {activePolicePoint === 1 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          1. IDENTIFICATION DE LA POLICE
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 pt-2 leading-relaxed">
                          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-150 space-y-2">
                            <p><strong>N° de police :</strong> <span className="font-mono font-bold text-indigo-600">{details.id}</span></p>
                            <p><strong>Contrat de rattachement :</strong> {details.id}</p>
                            <p><strong>Souscripteur principal :</strong> {details.company}</p>
                            <p><strong>Formule souscrite :</strong> {details.formula}</p>
                          </div>
                          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-150 space-y-2">
                            <p><strong>Date de prise d'effet :</strong> 01/02/2026</p>
                            <p><strong>Date d'échéance :</strong> 31/12/2026</p>
                            <p><strong>Réseau conventionné :</strong> Réseau national NeoGTec HealthCare (127 formations médicales à Kinshasa, Lubumbashi, Goma)</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 2 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          2. ASSURÉ PRINCIPAL
                        </h4>
                        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-150 text-xs text-slate-700 space-y-3 leading-relaxed">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-sm text-slate-900 block">{details.insured}</strong>
                              <span className="text-slate-500">{details.job} chez {details.company}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <p><strong>Date de naissance :</strong> 14/03/1985</p>
                            <p><strong>N° carte d'assuré :</strong> {details.id}-00</p>
                            <p><strong>Adresse de résidence :</strong> Avenue Kasa-Vubu, Q/ Bandalungwa, Kinshasa</p>
                            <p><strong>Contact d'urgence :</strong> +243 81 000 00 00</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 3 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          3. BÉNÉFICIAIRES INSCRITS (ARBRE FAMILIAL)
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          La composition familiale déclarée et autorisée aux prestations sous la présente formule comprend :
                        </p>
                        <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                                <th className="py-2.5 px-4">Lien de parenté</th>
                                <th className="py-2.5 px-4">Nom &amp; Prénom</th>
                                <th className="py-2.5 px-4 text-center">Date de naissance</th>
                                <th className="py-2.5 px-4 text-center">N° Carte d'Assuré</th>
                                <th className="py-2.5 px-4 text-right">Statut Prestataire</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {[
                                { relation: "Assuré principal", name: details.insured, bday: "14/03/1985", card: `${details.id}-00`, state: "Actif" },
                                { relation: "Conjoint", name: `${surname} née KABEYA Chantal`, bday: "22/07/1988", card: `${details.id}-01`, state: "Actif" },
                                { relation: "Enfant 1", name: `${surname} Grâce`, bday: "05/11/2014", card: `${details.id}-02`, state: "Actif" },
                                { relation: "Enfant 2", name: `${surname} Emmanuel`, bday: "19/09/2017", card: `${details.id}-03`, state: "Actif" },
                                { relation: "Enfant 3", name: `${surname} Divine`, bday: "02/01/2021", card: `${details.id}-04`, state: "Actif" }
                              ].map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/50">
                                  <td className="py-2.5 px-4 font-black uppercase text-[10px] text-indigo-600">{item.relation}</td>
                                  <td className="py-2.5 px-4 font-bold text-slate-900">{item.name}</td>
                                  <td className="py-2.5 px-4 text-center">{item.bday}</td>
                                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">{item.card}</td>
                                  <td className="py-2.5 px-4 text-right">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase">
                                      {item.state}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 4 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          4. TABLEAU DE GARANTIES PERSONNALISÉ — {details.formula}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Ces taux et plafonds s'appliquent à chaque assuré individuel de l'arbre familial, par année contractuelle d'assurance.
                        </p>
                        <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                                <th className="py-2.5 px-4">Garantie Spécifique</th>
                                <th className="py-2.5 px-4 text-center">Taux de Prise en Charge</th>
                                <th className="py-2.5 px-4 text-right">Plafond annuel nominatif</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {[
                                { name: "Consultations médicales générales", rate: "90%", cap: "800 000 CDF" },
                                { name: "Consultations spécialisées", rate: "80%", cap: "1 200 000 CDF" },
                                { name: "Analyses et imagerie médicale", rate: "80%", cap: "1 500 000 CDF" },
                                { name: "Hospitalisation", rate: "100%", cap: "8 000 000 CDF" },
                                { name: "Pharmacie", rate: "70%", cap: "1 000 000 CDF" },
                                { name: "Dentaire", rate: "60%", cap: "500 000 CDF" },
                                { name: "Optique", rate: "50%", cap: "300 000 CDF" },
                                { name: "Maternité", rate: "90%", cap: "2 500 000 CDF" }
                              ].map((row, index) => (
                                <tr key={index} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-4 font-bold text-slate-800">{row.name}</td>
                                  <td className="py-2 px-4 text-center font-black text-[#00A86B]">{row.rate}</td>
                                  <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">{row.cap}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl flex justify-between items-center text-xs">
                          <span className="font-black text-slate-700 uppercase tracking-wider text-[10px]">
                            Plafond global annuel toutes garanties confondues, par bénéficiaire :
                          </span>
                          <strong className="text-indigo-700 font-mono text-sm">12 000 000 CDF</strong>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 5 && (
                      <div className="space-y-6">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          5. BARÈME DÉTAILLÉ DES PRESTATIONS (SOUS-GARANTIES ET SOUS-PLAFONDS)
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Barème précis des sous-plafonds et limitations par acte applicable sous la formule {details.formula} :
                        </p>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block border-b pb-1">
                              5.1 Consultations et actes médicaux
                            </span>
                            <div className="overflow-x-auto border border-slate-150 rounded-xl">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400">
                                    <th className="py-2 px-4">Acte</th>
                                    <th className="py-2 px-4 text-center">Taux</th>
                                    <th className="py-2 px-4 text-right">Sous-plafond de remboursement</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  <tr>
                                    <td className="py-2 px-4 font-semibold">Consultation généraliste (réseau conventionné)</td>
                                    <td className="py-2 px-4 text-center font-bold">90%</td>
                                    <td className="py-2 px-4 text-right font-mono">15 000 CDF / acte</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-4 font-semibold">Consultation généraliste (hors réseau, avec autorisation)</td>
                                    <td className="py-2 px-4 text-center font-bold">70%</td>
                                    <td className="py-2 px-4 text-right font-mono">15 000 CDF / acte</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-4 font-semibold">Consultation spécialiste</td>
                                    <td className="py-2 px-4 text-center font-bold">80%</td>
                                    <td className="py-2 px-4 text-right font-mono">25 000 CDF / acte</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block border-b pb-1">
                              5.2 Examens complémentaires
                            </span>
                            <div className="overflow-x-auto border border-slate-150 rounded-xl">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400">
                                    <th className="py-2 px-4">Acte / Prestation</th>
                                    <th className="py-2 px-4 text-center">Taux</th>
                                    <th className="py-2 px-4 text-right">Sous-plafond annuel</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  <tr>
                                    <td className="py-2 px-4 font-semibold">Analyses de laboratoire courantes</td>
                                    <td className="py-2 px-4 text-center font-bold">80%</td>
                                    <td className="py-2 px-4 text-right font-mono">300 000 CDF / an</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 px-4 font-semibold font-bold">Imagerie lourde (scanner, IRM)</td>
                                    <td className="py-2 px-4 text-center font-bold">70%</td>
                                    <td className="py-2 px-4 text-right font-mono">900 000 CDF / an, avec accord préalable</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 6 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          6. FRANCHISES ET TICKET MODÉRATEUR
                        </h4>
                        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/50 space-y-3.5 text-xs text-amber-900 leading-relaxed">
                          <p>
                            <strong className="text-amber-950 uppercase text-[10px] tracking-wider block mb-1">Franchise Ambulatoire Fixe :</strong>
                            Une franchise fixe de <span className="font-bold">10 000 CDF</span> est appliquée par consultation ambulatoire, déduite avant calcul du taux de remboursement.
                          </p>
                          <p>
                            <strong className="text-amber-950 uppercase text-[10px] tracking-wider block mb-1">Exception Urgences &amp; Hospis :</strong>
                            Aucune franchise n'est appliquée en cas d'hospitalisation ou d'urgence vitale.
                          </p>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 7 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          7. DÉLAIS DE CARENCE SPÉCIFIQUES À LA POLICE
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Période d'attente minimale requise à compter de la date de prise d'effet de l'inscription pour chaque catégorie de soin :
                        </p>
                        <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                                <th className="py-2.5 px-4">Garantie d'Assurance</th>
                                <th className="py-2.5 px-4 text-right">Délai de Carence Obligatoire</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                              <tr>
                                <td className="py-2.5 px-4 font-bold">Accidents et urgences vitales</td>
                                <td className="py-2.5 px-4 text-right text-emerald-600 font-extrabold uppercase text-[10px]">Aucun (effet immédiat)</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-4">Consultations et pharmacie</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold">30 jours</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-4">Maternité</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold">10 mois</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 8 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          8. EXCLUSIONS ET LIMITATIONS SPÉCIFIQUES
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5 leading-relaxed">
                          <li><strong>Chirurgie esthétique et de confort :</strong> exclue, sauf reconstruction consécutive à un accident garanti ;</li>
                          <li><strong>Prothèses auditives et appareillage orthopédique :</strong> sous-plafond spécifique de 400 000 CDF/an, uniquement sur devis préalable ;</li>
                          <li><strong>Affections psychiatriques et prise en charge psychologique :</strong> plafond limité à 250 000 CDF/an, et limité à 10 séances maximum par an ;</li>
                        </ul>
                      </div>
                    )}

                    {activePolicePoint === 9 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          9. RÉSEAU DE SOINS CONVENTIONNÉ APPLICABLE
                        </h4>
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs space-y-2 leading-relaxed">
                          <strong className="text-slate-900 block uppercase tracking-wider text-[10px]">Hôpitaux Généraux de Référence</strong>
                          <p>Clinique Ngaliema, Centre Hospitalier Monkole, HJ Hospitals Kinshasa, Hôpital Biamba Marie Mutombo (et équivalents en province).</p>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 10 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          10. PROCÉDURE DE PRISE EN CHARGE (PEC) ET DE REMBOURSEMENT
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Présentation de la carte d'assuré physique ou numérique avec code QR au guichet du prestataire, vérification d'éligibilité en temps réel via la plateforme NeoGTec, validation biométrique et émission de l'accord de PEC directe (tiers-payant 90% ou 80%), et paiement du ticket modérateur restant.
                        </p>
                      </div>
                    )}

                    {activePolicePoint === 11 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          11. SUIVI DE CONSOMMATION DU PLAFOND
                        </h4>
                        <div className="overflow-x-auto border border-slate-150 rounded-2xl">
                          <table className="w-full text-left text-xs border-collapse font-mono">
                            <thead>
                              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 font-sans">
                                <th className="py-2.5 px-4">Garantie</th>
                                <th className="py-2.5 px-4 text-right">Plafond annuel (CDF)</th>
                                <th className="py-2.5 px-4 text-right text-emerald-600">Solde disponible (CDF)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              <tr>
                                <td className="py-2.5 px-4 font-sans font-bold">Consultations / Pharmacie</td>
                                <td className="py-2.5 px-4 text-right">1 800 000</td>
                                <td className="py-2.5 px-4 text-right text-emerald-600 font-bold">1 555 000 CDF</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 px-4 font-sans font-bold">Hospitalisation</td>
                                <td className="py-2.5 px-4 text-right">8 000 000</td>
                                <td className="py-2.5 px-4 text-right text-emerald-600 font-bold">8 000 000 CDF</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 12 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          12. CONDITIONS DE RENOUVELLEMENT ET DE RÉSILIATION
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          La police est renouvelée tacitement à la date d'anniversaire du contrat d'assurance de groupe de l'employeur, ou résiliée de plein droit en cas de rupture de contrat de travail, d'exclusion décidée par l'assureur pour fausse déclaration, ou de non-paiement de primes par l'employeur.
                        </p>
                      </div>
                    )}

                    {activePolicePoint === 13 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          13. CLAUSES PARTICULIÈRES ET DÉROGATIONS
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Néant à la date d'émission de la présente police d'assurance. Toutes les clauses générales du contrat CTR-SP-2026-000482 restent pleinement applicables.
                        </p>
                      </div>
                    )}

                    {activePolicePoint === 14 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          14. ASSISTANCE ET CONTACTS UTILES
                        </h4>
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-700 leading-relaxed space-y-1.5">
                          <p><strong>Centre d'appel NeoGTec Assistance (24h/24) :</strong> +243 81 234 5678</p>
                          <p><strong>Support médical d'urgence :</strong> +243 99 000 1111</p>
                          <p><strong>E-mail :</strong> sinistres@neogtec-healthcare.cd</p>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 15 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          15. PRIME ET ÉCHÉANCIER
                        </h4>
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs space-y-2">
                          <p><strong>Prime mensuelle nette calculée :</strong> <strong className="font-mono text-slate-900">{details.premium.toLocaleString()} CDF / mois</strong></p>
                          <p><strong>Prise en charge par l'Employeur (80%) :</strong> {(details.premium * 0.8).toLocaleString()} CDF / mois</p>
                          <p><strong>Quote-part Salarié (20%) :</strong> {(details.premium * 0.2).toLocaleString()} CDF / mois (retenue à la source)</p>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 16 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          16. CARTE D'ASSURÉ — MODÈLE SPÉCIMEN
                        </h4>
                        <div className="max-w-md mx-auto p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden border border-slate-700 shadow-xl">
                          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-[#00A86B]/20 blur-3xl pointer-events-none" />
                          <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                            <div>
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">NEOGTEC HEALTHCARE</span>
                              <span className="text-[8px] text-slate-400 block">République Démocratique du Congo</span>
                            </div>
                            <span className="px-2 py-0.5 bg-indigo-600 text-white font-bold text-[8px] uppercase rounded">CARTE D'ASSURÉ</span>
                          </div>
                          <div className="space-y-2 text-xs font-medium">
                            <p><span className="text-slate-400">Nom :</span> <strong className="text-white">{details.insured}</strong></p>
                            <p><span className="text-slate-400">N° Carte :</span> <strong className="font-mono text-white">{details.id}-00</strong></p>
                            <p><span className="text-slate-400">Formule :</span> <strong className="text-[#00A86B]">{details.formula}</strong></p>
                          </div>
                          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <QrCode className="w-8 h-8 text-white" />
                              <span className="text-[8.5px] text-slate-400 font-mono">CODE VERIF BIOMÉTRIQUE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePolicePoint === 17 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          17. AVENANTS À LA POLICE
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Néant à la date d'émission. Tout avenant ultérieur (modification d'arbre familial ou de garanties) sera rédigé en la forme officielle, daté et signé par les deux parties d'un commun accord.
                        </p>
                      </div>
                    )}

                    {activePolicePoint === 18 && (
                      <div className="space-y-4">
                        <h4 className="text-base font-black text-indigo-600 uppercase tracking-tight">
                          18. VISA ET DÉLIVRANCE
                        </h4>
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs space-y-3 leading-relaxed">
                          <p>Fait à Kinshasa, en double exemplaire original, le 05/02/2026.</p>
                          <div className="border-t border-slate-200 pt-2.5">
                            <strong className="text-indigo-600">Le Gestionnaire Médical — NeoGTec HealthCare</strong>
                            <div className="text-[9px] text-slate-400 font-mono mt-1">[ SCELLÉ PAR CLÉ DE SIGNATURE ÉLECTRONIQUE ]</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Glassmorphic Footer Controls */}
                  <div className="mt-8 pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>POLICE : {details.id}</span>
                    <span>Clause {activePolicePoint} / 18</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'bia' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <BiaPrintDocument isVierge={false} data={biaData} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================================================
// UNIFIED PRINT / CONTINUOUS PREVIEW COMPONENT
// =========================================================================
interface ContractPrintDocumentProps {
  isVierge: boolean;
  contract?: ContractItem | null;
}

export const ContractPrintDocument: React.FC<ContractPrintDocumentProps> = ({ isVierge, contract }) => {
  const details = getContractDetails(isVierge ? null : contract);
  const surname = isVierge ? "..................." : (details.insured.split(' ')[0] || 'MUKENDI');

  useEffect(() => {
    // Inject print styles when printing/previewing
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
          margin: 1.5cm 1.5cm 1.5cm 1.5cm;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-slate-100 p-8 min-h-screen overflow-y-auto flex flex-col items-center gap-8 shadow-inner no-print:max-h-[85vh] print:bg-white print:p-0 print:min-h-0 print:shadow-none">
      
      {/* ===================================================================
          PART 1: CONDITIONS GÉNÉRALES (11 PAGES)
          =================================================================== */}
      
      {/* PAGE 1: PRÉAMBULE & ARTICLE 1 */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <div className="border border-black p-4 text-center">
            <h1 className="text-lg font-bold uppercase tracking-widest text-slate-900">SANTÉ PLUS ASSURANCES SARL</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#00A86B] mt-1">CONTRAT D'ASSURANCE SANTÉ - CONDITIONS GÉNÉRALES</p>
            <p className="text-[8px] font-mono mt-1 text-slate-500">RÉF CONTRAT : {isVierge ? "..................................." : details.id}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">PRÉAMBULE — LES PARTIES AU CONTRAT</h3>
            <p className="text-justify leading-relaxed text-[11px]">
              Le présent contrat d'assurance santé (ci-après « le Contrat ») est conclu entre les parties suivantes, conformément au Code des Assurances de la Conférence Interafricaine des Marchés d'Assurances (CIMA) applicable en République Démocratique du Congo :
            </p>
            <div className="space-y-3 pl-2 border-l border-slate-300 text-[11px]">
              <p>
                <strong>L'Assureur :</strong> SANTÉ PLUS ASSURANCES SARL, société d'assurance agréée par l'ARCA RDC sous le numéro ARCA/AGR/2019/0147, ayant son siège social au 12, Avenue de la Justice, Gombe, Kinshasa.
              </p>
              <p>
                <strong>Le Souscripteur :</strong> {isVierge ? "..................................................................................................................." : details.company}, ayant déclaré toutes les informations requises à la souscription de la présente police.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 1 — OBJET DU CONTRAT</h3>
            <p className="text-justify leading-relaxed text-[11px]">
              Le présent Contrat a pour objet de garantir, dans les conditions et limites fixées ci-après, le remboursement ou la prise en charge directe (mécanisme de tiers-payant / PEC) des frais médicaux, chirurgicaux, pharmaceutiques et d'hospitalisation engagés par l'Assuré principal et les bénéficiaires inscrits, à la suite d'une maladie, d'un accident ou d'une maternité, survenus pendant la période de validité du Contrat sur le territoire de la République Démocratique du Congo, sauf extension expresse convenue aux Conditions Particulières.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 1 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 2: ARTICLE 2 (DÉFINITIONS) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 2 — DÉFINITIONS JURIDIQUES</h3>
            <div className="space-y-3 text-justify text-[11px] leading-relaxed">
              <p>
                <strong>Assuré principal :</strong> La personne physique salariée de l'entreprise souscriptrice ou souscripteur individuel de la présente police, régulièrement inscrite et éligible aux garanties prévues.
              </p>
              <p>
                <strong>Bénéficiaire :</strong> Conjoint et enfants à charge de l'Assuré principal, déclarés nominativement lors de la souscription et dont l'éligibilité a été formellement acceptée par l'Assureur.
              </p>
              <p>
                <strong>Prise en Charge (PEC) :</strong> Accord de règlement direct émis par l'Assureur permettant de dispenser l'Assuré d'une avance totale de frais auprès des formations médicales conventionnées (mécanisme de tiers-payant).
              </p>
              <p>
                <strong>Plafond annuel :</strong> Le montant annuel cumulé maximum de prise en charge financière par assuré au cours d'une année d'assurance, toutes garanties d'assurance confondues.
              </p>
              <p>
                <strong>Délai de carence :</strong> Période de latence débutant le jour d'effet de la souscription durant laquelle le bénéficiaire ne peut mobiliser certaines garanties spécifiques, hors accidents.
              </p>
              <p>
                <strong>Ticket modérateur :</strong> La part financière relative à chaque consultation médicale ou acte restant légalement à la charge exclusive de l'assuré (quote-part non remboursable).
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 2 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 3: ARTICLE 3 (GARANTIES & PLAFONDS TABLE) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 3 — GARANTIES ET NIVEAUX DE PRISE EN CHARGE</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Sous réserve du paiement intégral des cotisations d'assurance et de la conformité aux règlements CIMA, l'Assureur garantit les prestations suivantes avec les taux de prise en charge mentionnés ci-dessous :
            </p>
            
            <table className="w-full text-left text-[11px] border-collapse border border-black mt-4">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-bold">
                  <th className="p-2 border-r border-black">Nature de la Garantie d'Assurance</th>
                  <th className="p-2 border-r border-black text-center">Taux de Remboursement</th>
                  <th className="p-2 text-right">Plafond Annuel Maximal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                <tr>
                  <td className="p-2 border-r border-black">Consultations médicales de médecine générale</td>
                  <td className="p-2 border-r border-black text-center font-bold">90%</td>
                  <td className="p-2 text-right">800 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Consultations de médecins spécialistes</td>
                  <td className="p-2 border-r border-black text-center font-bold">80%</td>
                  <td className="p-2 text-right">1 200 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Analyses de laboratoire, examens radiologiques et imagerie médicale</td>
                  <td className="p-2 border-r border-black text-center font-bold">80%</td>
                  <td className="p-2 text-right">1 500 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Hospitalisations chirurgicales et médicales (hors confort)</td>
                  <td className="p-2 border-r border-black text-center font-bold">100%</td>
                  <td className="p-2 text-right">8 000 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Pharmacie sur prescription légale médicale</td>
                  <td className="p-2 border-r border-black text-center font-bold">70%</td>
                  <td className="p-2 text-right">1 000 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Soins conservateurs et extractions dentaires</td>
                  <td className="p-2 border-r border-black text-center font-bold">60%</td>
                  <td className="p-2 text-right">500 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Optique médicale (verres correcteurs prescrits)</td>
                  <td className="p-2 border-r border-black text-center font-bold">50%</td>
                  <td className="p-2 text-right">300 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Maternité (suivi, accouchement par voie basse ou césarienne)</td>
                  <td className="p-2 border-r border-black text-center font-bold">90%</td>
                  <td className="p-2 text-right">2 500 000 CDF</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Évacuation sanitaire d'urgence nationale d'une province à une autre</td>
                  <td className="p-2 border-r border-black text-center font-bold">100%</td>
                  <td className="p-2 text-right">1 500 000 CDF</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 3 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 4: ARTICLE 4 (EXCLUSIONS) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 4 — EXCLUSIONS GÉNÉRALES DE GARANTIE</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Sont expressément exclus de l'ensemble des garanties d'assurance, sauf stipulation contraire convenue d'un commun accord aux Conditions Particulières :
            </p>
            <ul className="space-y-2.5 text-[11px] text-justify list-disc pl-5 leading-relaxed">
              <li>Les interventions chirurgicales ou traitements de nature purement esthétique ou plastique sans justification fonctionnelle.</li>
              <li>Les cures thermales, séjours de repos ou traitements contre le vieillissement non prescrits par une autorité médicale agréée.</li>
              <li>Les affections consécutives à la participation volontaire à des émeutes, mouvements populaires ou guerres civiles, ou la pratique sportive professionnelle non déclarée.</li>
              <li>Les maladies ou infirmités d'origine congénitale déjà déclarées ou diagnostiquées avant la date d'effet du contrat et dissimulées de mauvaise foi.</li>
              <li>Les frais de consultations ou de soins prescrits hors du réseau médical conventionné sans accord écrit préalable de l'Assureur.</li>
              <li>Les compléments nutritionnels, cosmétiques ou médicaments d'hygiène et de confort exclus du barème pharmaceutique national.</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 4 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 5: ARTICLE 5 (CARENCE) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 5 — DÉLAIS DE CARENCE ET LATENCE</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Le délai de carence correspond à la période transitoire débutant au jour de la souscription ou d'admission de l'affilié, durant laquelle ce dernier ne peut prétendre aux prestations de remboursement ou de tiers-payant :
            </p>
            <ul className="space-y-3.5 text-[11px] list-disc pl-5 text-justify leading-relaxed">
              <li><strong>Maladies courantes et ordinaires :</strong> Un délai de carence ferme de trente (30) jours francs est appliqué sur toute nouvelle inscription d'un bénéficiaire.</li>
              <li><strong>Maternité et soins obstétriques :</strong> Un délai de carence de dix (10) mois consécutifs d'assurance active et ininterrompue est opposable à compter du jour d'effet de la police pour toute prestation liée à la grossesse, aux examens prénataux et à l'accouchement.</li>
              <li><strong>Accidents corporels :</strong> Aucun délai de carence ne s'applique en cas d'accident corporel dument constaté survenu postérieurement à la prise d'effet de la police d'assurance.</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 5 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 6: ARTICLE 6 (COTISATIONS) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 6 — COTISATIONS, PRIMES ET PAIEMENTS</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Le paiement des cotisations d'assurance santé est de la responsabilité exclusive du Souscripteur. Les cotisations sont payables d'avance, trimestriellement ou selon la périodicité convenue aux Conditions Particulières, au plus tard le 5 de chaque trimestre échu.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              Conformément aux dispositions impératives du Code des Assurances CIMA, à défaut de paiement d'une cotisation ou d'une fraction de cotisation dans les dix (10) jours de son échéance, la garantie ne peut être suspendue que trente (30) jours après la mise en demeure du souscripteur.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              L'Assureur a le droit de résilier le Contrat dix (10) jours après l'expiration du délai de suspension de trente (30) jours si les cotisations dues restent impayées.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 6 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 7: ARTICLE 7 (DURÉE & RÉSILIATION) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 7 — DURÉE, PRISE D'EFFET ET RÉSILIATION</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Le présent Contrat d'assurance est conclu pour une durée d'un (1) an, à compter du jour de sa prise d'effet mentionnée aux Conditions Particulières jusqu'au 31 décembre de la même année. Il est renouvelable par tacite reconduction d'année en année, sauf dénonciation par l'une ou l'autre des parties.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              La résiliation annuelle à l'échéance s'effectue en respectant un préavis minimum de deux (2) mois calendaires avant la date d'échéance annuelle, par lettre recommandée avec accusé de réception ou tout autre moyen écrit contre décharge.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              De plus, le contrat peut être résilié de plein droit en cas de retrait d'agrément de la compagnie d'assurance par l'ARCA ou en cas de cessation définitive d'activité de l'entité souscriptrice.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 7 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 8: ARTICLE 8 (PRISE EN CHARGE) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 8 — MODALITÉS DE PRISE EN CHARGE DIRECTE (PEC)</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Les prestations d'assurance s'effectuent prioritairement sous la forme de tiers-payant direct, également appelé Prise en Charge (PEC), auprès des hôpitaux, cliniques et pharmacies conventionnés du réseau national de l'Assureur.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              Pour bénéficier du tiers-payant, chaque Assuré doit obligatoirement présenter sa carte d'assuré numérique biométrique au guichet d'accueil du prestataire de soins agréé avant tout acte médical, hors cas d'urgence vitale manifeste dument constatée.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              En cas de recours à des soins hors réseau conventionné ou en l'absence de délivrance d'une Prise en Charge directe, l'Assuré fait l'avance intégrale des frais et soumet une demande de remboursement sur présentation des pièces justificatives originales dans les quatre-vingt-dix (90) jours calendaires suivant les soins, sous peine de déchéance de garantie.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 8 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 9: ARTICLE 9 (OBLIGATIONS DES PARTIES) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 9 — OBLIGATIONS DES PARTIES</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              <strong>Obligations du Souscripteur :</strong> Le Souscripteur s'engage à déclarer en toute bonne foi l'état civil exact et le profil médical complet de tous les affiliés lors de l'adhésion initiale, à signaler par écrit toute modification d'effectif ou de situation familiale des assurés dans un délai de trente (30) jours francs, et à s'acquitter ponctuellement des primes d'assurance dues.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              <strong>Obligations de l'Assureur :</strong> L'Assureur s'engage à émettre des cartes d'assurance individuelles biométriques opérationnelles, à maintenir et à auditer de manière permanente la qualité du réseau national de prestataires médicaux agréés, et à instruire et liquider les dossiers de remboursement complets dans un délai maximum de quinze (15) jours ouvrés suivant leur réception.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 9 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 10: ARTICLE 10 (LOI ET JURIDICTION) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 10 — LOI APPLICABLE ET JURIDICTION COMPETENTE</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Le présent Contrat d'assurance est régi, interprété et appliqué conformément aux dispositions du Code des Assurances de la Conférence Interafricaine des Marchés d'Assurances (CIMA) ainsi qu'aux lois et règlements applicables en République Démocratique du Congo.
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              Tout litige ou différend relatif à la validité, l'interprétation, l'exécution ou la résiliation du présent contrat fera obligatoirement l'objet d'une tentative de résolution amiable entre les parties ou d'une médiation sous l'égide de l'Autorité de Régulation et de Contrôle des Assurances (ARCA).
            </p>
            <p className="text-[11px] leading-relaxed text-justify">
              À défaut d'entente ou de conciliation amiable dans les trente (30) jours suivant sa notification par écrit, le litige sera soumis à la compétence exclusive du Tribunal de Commerce de Kinshasa/Gombe.
            </p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 10 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 11: ARTICLE 11 (SIGNATURES) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS GÉNÉRALES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b border-black pb-1">ARTICLE 11 — VALIDATION ET SIGNATURES DES PARTIES</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              En foi de quoi, les parties approuvent et ratifient de manière expresse et irrévocable l'ensemble des conditions et clauses figurant aux présentes Conditions Générales.
            </p>
            <p className="text-[11px] text-slate-650 font-medium">
              Fait en double exemplaire original à Kinshasa, le 02 janvier 2026.
            </p>
            
            <div className="grid grid-cols-2 gap-12 pt-12 text-[11px]">
              <div className="border-t border-black pt-4">
                <span className="block font-bold uppercase text-slate-500 text-[9px] mb-1">Pour l'Assureur</span>
                <strong>TSHIBANGU Alain</strong><br />
                <span>Directeur Général</span>
                <div className="mt-4 font-mono font-bold text-[#00A86B] text-[10px]">[ SIGNÉ ÉLECTRONIQUEMENT ]</div>
              </div>
              <div className="border-t border-black pt-4">
                <span className="block font-bold uppercase text-slate-500 text-[9px] mb-1">Pour le Souscripteur</span>
                <strong>NGOYI Beatrice</strong><br />
                <span>Directrice RH</span>
                <div className="mt-4 font-mono font-bold text-[#00A86B] text-[10px]">[ SIGNÉ ÉLECTRONIQUEMENT ]</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Générales - Page 11 / 11</span>
        </div>
      </div>
      <div className="page-break" />

      {/* ===================================================================
          PART 2: CONDITIONS PARTICULIÈRES (CLAUSES 1 TO 18)
          =================================================================== */}

      {/* PAGE 9: CLAUSE 1 & 2 (IDENTIFICATION & ASSURE PRINCIPAL) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <div className="border border-black p-4 text-center">
            <h1 className="text-base font-bold uppercase text-slate-900">SANTÉ PLUS ASSURANCES SARL</h1>
            <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 mt-1">CONTRAT D'ASSURANCE SANTÉ - CONDITIONS PARTICULIÈRES</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">1. IDENTIFICATION DE LA POLICE</h3>
            <div className="grid grid-cols-2 gap-4 text-[11px] leading-relaxed bg-slate-50 p-3 border border-slate-200">
              <div>
                <p><strong>N° de police :</strong> {isVierge ? "..................................................." : details.id}</p>
                <p><strong>Contrat principal :</strong> {isVierge ? "..................................................." : details.id}</p>
                <p><strong>Souscripteur principal :</strong> {isVierge ? "..................................................." : details.company}</p>
              </div>
              <div>
                <p><strong>Date d'effet :</strong> 01/02/2026</p>
                <p><strong>Date d'échéance :</strong> 31/12/2026</p>
                <p><strong>Formule active :</strong> {isVierge ? "..................................................." : details.formula}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">2. ASSURÉ PRINCIPAL</h3>
            <div className="grid grid-cols-2 gap-4 text-[11px] leading-relaxed bg-slate-50 p-3 border border-slate-200">
              <div>
                <p><strong>Nom et Prénom :</strong> {isVierge ? "..................................................." : details.insured}</p>
                <p><strong>Date de naissance :</strong> {isVierge ? "J J | M M | A A A A" : "14/03/1985"}</p>
                <p><strong>Profession / Métier :</strong> {isVierge ? "..................................................." : details.job}</p>
              </div>
              <div>
                <p><strong>N° de carte assuré :</strong> {isVierge ? "..................................................." : `${details.id}-00`}</p>
                <p><strong>Employeur :</strong> {isVierge ? "..................................................." : details.company}</p>
                <p><strong>Lieu de résidence :</strong> Avenue de l'Équateur, Kinshasa Gombe, RDC</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Particulières - Page 1 / 5</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 10: CLAUSE 3 & 4 (ARBRE FAMILIAL & GARANTIES) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS PARTICULIÈRES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">3. ASSURÉS ET BÉNÉFICIAIRES (ARBRE FAMILIAL)</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Liste exhaustive des membres de la famille bénéficiant de la couverture santé sous la présente police :
            </p>
            
            <table className="w-full text-left text-[11px] border-collapse border border-black mt-2">
              <thead>
                <tr className="bg-slate-100 border-b border-black font-bold">
                  <th className="p-2 border-r border-black">Qualité</th>
                  <th className="p-2 border-r border-black">Nom &amp; Prénom de l'affilié</th>
                  <th className="p-2 border-r border-black text-center">Né(e) le</th>
                  <th className="p-2 text-center">N° Carte Assuré</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                <tr>
                  <td className="p-2 border-r border-black font-bold">Assuré principal</td>
                  <td className="p-2 border-r border-black">{isVierge ? "..................................................." : details.insured}</td>
                  <td className="p-2 border-r border-black text-center">{isVierge ? "..................." : "14/03/1985"}</td>
                  <td className="p-2 text-center font-mono">{isVierge ? "..................." : `${details.id}-00`}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Conjoint(e)</td>
                  <td className="p-2 border-r border-black">{isVierge ? "..................................................." : `${surname} née KABEYA Chantal`}</td>
                  <td className="p-2 border-r border-black text-center">{isVierge ? "..................." : "22/07/1988"}</td>
                  <td className="p-2 text-center font-mono">{isVierge ? "..................." : `${details.id}-01`}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Enfant rattaché 1</td>
                  <td className="p-2 border-r border-black">{isVierge ? "..................................................." : `${surname} Grâce`}</td>
                  <td className="p-2 border-r border-black text-center">{isVierge ? "..................." : "05/11/2014"}</td>
                  <td className="p-2 text-center font-mono">{isVierge ? "..................." : `${details.id}-02`}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Enfant rattaché 2</td>
                  <td className="p-2 border-r border-black">{isVierge ? "..................................................." : `${surname} Emmanuel`}</td>
                  <td className="p-2 border-r border-black text-center">{isVierge ? "..................." : "19/09/2017"}</td>
                  <td className="p-2 text-center font-mono">{isVierge ? "..................." : `${details.id}-03`}</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-black">Enfant rattaché 3</td>
                  <td className="p-2 border-r border-black">{isVierge ? "..................................................." : `${surname} Divine`}</td>
                  <td className="p-2 border-r border-black text-center">{isVierge ? "..................." : "02/01/2021"}</td>
                  <td className="p-2 text-center font-mono">{isVierge ? "..................." : `${details.id}-04`}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">4. TABLEAU DE COUVERTURES DE FORMULE</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Les garanties s'appliquent par année et par bénéficiaire inscrit, selon le barème de la formule active :
            </p>
            <div className="bg-slate-50 p-3 border border-slate-200 text-[11px] flex justify-between items-center font-bold">
              <span>Formule active : {isVierge ? "..................................." : details.formula}</span>
              <span>Plafond annuel global : 12 000 000 CDF / assuré</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Particulières - Page 2 / 5</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 11: CLAUSE 5 (BARÈME DÉTAILLÉ) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS PARTICULIÈRES</h2>
          
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">5. BARÈME DÉTAILLÉ DES PRESTATIONS MÉDICALES</h3>
            <p className="text-[11px] leading-relaxed text-justify">
              Ce tableau indique les limitations d'actes et sous-plafonds applicables sous la formule :
            </p>
            
            <div className="space-y-4 text-[10px]">
              <div>
                <span className="font-bold uppercase tracking-wider block border-b border-slate-200 pb-0.5">5.1 Consultations de médecine courante</span>
                <p className="mt-1">Consultation de généraliste : 90% de prise en charge, sous-plafond de 15 000 CDF par acte.</p>
                <p>Consultation de spécialiste : 80% de prise en charge, sous-plafond de 25 000 CDF par acte.</p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider block border-b border-slate-200 pb-0.5">5.2 Analyses biologiques et examens cliniques</span>
                <p className="mt-1">Analyses de sang, urine : 80% de prise en charge, sous-plafond annuel de 300 000 CDF.</p>
                <p>Imagerie médicale (Scanner/IRM) : 70% de prise en charge, sous-plafond de 900 000 CDF, accord préalable obligatoire.</p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider block border-b border-slate-200 pb-0.5">5.3 Hospitalisations et actes chirurgicaux</span>
                <p className="mt-1">Séjour hospitalier (Chambre standard) : 100% de couverture, sous-plafond de 150 000 CDF par jour, max 30 jours/an.</p>
                <p>Réanimation / Soins intensifs d'urgence : 100% de prise en charge, sous-plafond de 2 000 000 CDF par année d'assurance.</p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider block border-b border-slate-200 pb-0.5">5.4 Maternité et obstétrique</span>
                <p className="mt-1">Accouchement par voie basse : 90% de prise en charge, sous-plafond de 1 200 000 CDF par grossesse.</p>
                <p>Accouchement par césarienne : 90% de prise en charge, sous-plafond de 2 000 000 CDF par grossesse.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Particulières - Page 3 / 5</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 12: CLAUSES 6 À 13 */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS PARTICULIÈRES</h2>
          
          <div className="grid grid-cols-2 gap-6 text-[10.5px] leading-relaxed text-justify">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">6. FRANCHISES ET TICKETS</h3>
                <p className="mt-1">Franchise ambulatoire fixe : 10 000 CDF par consultation externe.</p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">7. CARENCE OBLIGATOIRE</h3>
                <p className="mt-1">Général &amp; Pharmacie : 30 jours francs.</p>
                <p>Maternité : 10 mois consécutifs d'assurance active.</p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">8. EXCLUSIONS SPÉCIFIQUES</h3>
                <p className="mt-1">Prothèses, soins psychiatriques au-delà des plafonds, cliniques hors réseau.</p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">9. RÉSEAU DE PRESTATAIRES</h3>
                <p className="mt-1">Accès exclusif aux cliniques partenaires du réseau national conventionné NeoGTec Healthcare.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">10. PROCÉDURE ACCORDS PEC</h3>
                <p className="mt-1">Présentation de la carte biométrique d'assuré obligatoire au guichet de l'hôpital avant admission.</p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">11. RELEVÉ DE CONSOMMATION</h3>
                <p className="mt-1">Suivi automatisé du solde disponible en temps réel via l'espace assuré NeoGTec.</p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">12. RENOUVELLEMENT DE POLICE</h3>
                <p className="mt-1">Tacite reconduction de la police d'assurance sous condition de contrat de travail actif.</p>
              </div>

              <div>
                <h3 className="font-bold uppercase text-indigo-600 border-b border-indigo-600 pb-0.5">13. CLAUSES PARTICULIÈRES</h3>
                <p className="mt-1">Néant à la date d'émission.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Particulières - Page 4 / 5</span>
        </div>
      </div>
      <div className="page-break" />

      {/* PAGE 13: CLAUSES 14 À 18 (SIGNATURES & VISA) */}
      <div className="w-[21cm] min-h-[29.7cm] bg-white p-[2cm] shadow-lg border border-slate-200 text-slate-800 text-xs flex flex-col justify-between relative printable-sheet">
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">SANTÉ PLUS ASSURANCES • CONDITIONS PARTICULIÈRES</h2>
          
          <div className="space-y-4 text-[11px] leading-relaxed">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">14. ASSISTANCE &amp; CONTACTS UTILES</h3>
            <p>Centre d'appel NeoGTec Assistance 24/7 : <strong>+243 81 234 5678</strong> • Urgences : <strong>+243 99 000 1111</strong></p>
          </div>

          <div className="space-y-4 pt-2 text-[11px] leading-relaxed">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">15. PRIME ET COTISATIONS DE GARANTIE</h3>
            <p>Prime d'assurance globale nette : <strong>{isVierge ? "..................................." : `${details.premium.toLocaleString()} CDF`} / mois</strong></p>
            <p>Frais d'administration et taxes d'agrément ARCA inclus.</p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">16. CARTE BIOMÉTRIQUE NUMÉRIQUE</h3>
            <p className="text-[11px] leading-relaxed">Une carte individuelle avec QR code unique est délivrée à chaque bénéficiaire pour garantir l'accès au tiers-payant.</p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">17. SÉQUENCE DES AVENANTS</h3>
            <p className="text-[11px] leading-relaxed">Néant à la date d'émission initiale de la police d'assurance.</p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-600 pb-1">18. VISA ET SIGNATURE DE CERTIFICATION</h3>
            <p className="text-[11px] leading-relaxed">Rédigé et certifié à Kinshasa, le 05 février 2026.</p>
            
            <div className="grid grid-cols-2 gap-12 pt-6 text-[11px]">
              <div className="border-t border-slate-300 pt-3">
                <span className="block font-bold uppercase text-slate-400 text-[9px] mb-1">Pour la Compagnie d'Assurance</span>
                <strong>Le Directeur de Souscription</strong>
                <div className="mt-4 font-mono font-bold text-indigo-600 text-[9px]">[ CACHET NUMÉRIQUE ARCA CERTIFIÉ ]</div>
              </div>
              <div className="border-t border-slate-300 pt-3">
                <span className="block font-bold uppercase text-slate-400 text-[9px] mb-1">Pour l'Assuré / Représentant</span>
                <strong>{isVierge ? "..................................................." : details.insured}</strong>
                <div className="mt-4 font-mono font-bold text-indigo-600 text-[9px]">[ SCELLÉ NUMÉRIQUEMENT ]</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-2 flex justify-between text-[9px] font-mono text-slate-400">
          <span>RÉF : {isVierge ? "VIERGE" : details.id}</span>
          <span>Conditions Particulières - Page 5 / 5</span>
        </div>
      </div>

    </div>
  );
};
