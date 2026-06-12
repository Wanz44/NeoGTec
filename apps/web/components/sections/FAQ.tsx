'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: "Quel est le coût d'acquisition de la solution SaaS NeoGTec ?",
      a: "NeoGTec se rémunère principalement sur la base d'un abonnement mensuel calculé par salarié affilié actif (SaaS Pricing). Pour les grands groupes de plus de 250 collaborateurs, nous proposons des grilles de tarifs de courtage dégressives très avantageuses, négociées en partenariat direct avec les assureurs agréés ARCA."
    },
    {
      q: "Quel est le délai de déploiement effectif (setup) ?",
      a: "Grâce à notre moteur d'intégration de listes d'adhérents rh par import Excel et à l'interconnexion instantanée des cliniques, une entreprise standard de 100 salariés peut déployer NeoGTec en moins de 5 jours ouvrés. Les formations utilisateurs RH et agents d'admissions cliniques sont dispensées à distance ou sur site."
    },
    {
      q: "Comment NeoGTec garantit-elle la stricte conformité réglementaire ARCA-RDC ?",
      a: "NeoGTec travaille exclusivement avec des assureurs habilités et agréés par l'Autorité de Régulation (ARCA), garantissant que toutes les opérations de prélèvements de taxes d'assurances de l'État congolais (code de l'ARCA RDC) sont parfaitement perçues, tracées, et auditables instantanément dans le registre de la plateforme."
    },
    {
      q: "Les données médicales de nos salariés sont-elles sécurisées et hébergées en RDC ?",
      a: "Absolument. Conformément aux dispositions juridiques nationales limitant l'hébergement des données régaliennes à l'étranger, NeoGTec héberge l'ensemble de ses bases de données au sein d'un Datacenter souverain hautement disponible situé à Kinshasa (Gombe). Les secrets industriels et dossiers d'examens médicaux y sont encryptés via AES-256."
    },
    {
      q: "Fournissez-vous des sessions de formation pour le personnel des hôpitaux ?",
      a: "Oui, un plan d'accompagnement de 48 heures est inclus d'office dans notre pack de setup. Nos formateurs qualifiés interviennent directement auprès des agents d'admission et des médecins de vos cliniques partenaires pour les accréditer à l'utilisation du scanner QR Code Patient et au clearing automatisé de factures."
    },
    {
      q: "Quels sont les niveaux de support et d&apos;assistance technique disponibles ?",
      a: "Nous assurons un support technique permanent de Niveau 1, 2, et 3 opérationnel 24h/24 et 7j/7 pour toutes les réclamations liées à d'éventuelles suspicions de fraude au tiers-payant ou à l'accessibilité de la plateforme. Nos équipes sont basées à Kinshasa pour une réactivité immédiate sur le terrain."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAlertPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Politique de Confidentialité Conforme Loi n°18/035 RDC : Toutes les données à caractère personnel collectées sont exclusivement traitées à des fins d'évaluation de sinistre d'assurance santé et ne font l'objet d'aucune vente ou cession commerciale tierce.");
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      
      {/* 1. FAQ Section Block */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 md:py-24 border-b border-slate-100">
        
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00A86B] font-mono block">FAQ NeoGTec</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-950 sm:text-4xl">
            Des Réponses Claires à Vos Questions
          </h2>
          <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
            Trouvez les détails techniques et réglementaires sur la gestion de vos prises en charge d&apos;assurances santé en République Démocratique du Congo.
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/30 hover:bg-slate-50/80"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-black text-xs uppercase tracking-wide text-slate-900 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#00A86B] shrink-0" />
                    {item.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-550" /> : <ChevronDown className="w-4 h-4 text-slate-550" />}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-[12px] leading-relaxed text-slate-600 font-semibold border-t border-slate-100/80 animate-slideDown">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. Legally Compliant Footer Block */}
      <div className="bg-slate-50 py-12 text-slate-600 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Identity & Legal Info columns (6/12) */}
            <div className="md:col-span-6 space-y-4 text-left">
              <div className="flex items-center gap-1.5 text-[#00A86B] font-black text-lg uppercase tracking-wide">
                <span className="p-1 bg-[#00A86B]/10 rounded border border-[#00A86B]/10 block">N</span>
                <span>NeoGTec</span>
              </div>
              
              <p className="text-[10.5px] leading-relaxed text-slate-500 font-semibold max-w-sm">
                NeoGTec SARL est une plateforme d&apos;agrégation et courtage digital de prestations médicales, agrée par l&apos;<strong>ARCA RDC</strong> (Autorité de Régulation et de Contrôle des Assurances) et œuvrant pour l&apos;interconnectabilité hospitalière directe au Congo.
              </p>

              {/* Company Registration Legal numbers */}
              <div className="text-[9.5px] font-mono leading-relaxed space-y-0.5 text-slate-450 font-medium">
                <p>👤 RAISON SOCIALE : NeoGTec SARL</p>
                <p>📂 RCCMCD : CD/KIN/RCCM/24-B-08310</p>
                <p>🛡️ IDENTIFICATION NATIONALE : ID. NAT. 01-18-N93011B</p>
                <p>📃 AUTORISATION ARCA : CD/KIN/ARCA/DECISION-2026-10492</p>
              </div>
            </div>

            {/* Address Column (3/12) */}
            <div className="md:col-span-3 text-left space-y-3">
              <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block font-mono">Siège Social RDC</span>
              
              <div className="flex items-start gap-2 text-xs font-semibold text-slate-505 leading-relaxed">
                <MapPin className="w-5 h-5 text-[#00A86B] shrink-0 mt-0.5" />
                <p>
                  Immeuble BCC, 4ème Étage<br />
                  Avenue du Port, Gombe<br />
                  Kinshasa, République Démocratique du Congo
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-505 font-mono pt-1">
                <Mail className="w-4 h-4 text-[#00A86B]" />
                <span>contact@neogtec.com</span>
              </div>
            </div>

            {/* Links Column (3/12) */}
            <div className="md:col-span-3 text-left space-y-3">
              <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block font-mono">Mentions Légales</span>
              
              <ul className="space-y-2 text-xs font-bold text-slate-505">
                <li>
                  <a 
                    href="#terms" 
                    onClick={handleAlertPrivacy}
                    className="hover:text-[#00A86B] flex items-center gap-1 transition-colors"
                  >
                    <span>Loi n°18/035 (Confidentialité)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a 
                    href="#privacy" 
                    onClick={handleAlertPrivacy}
                    className="hover:text-[#00A86B] flex items-center gap-1 transition-colors"
                  >
                    <span>Politique de protection des données</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-[#00A86B] transition-colors">Portail Client Administration</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-200 mt-10 pt-6 text-center text-[10px] font-mono text-slate-400 font-bold">
            <p>© {new Date().getFullYear()} NeoGTec SARL. Tous droits réservés. Agréé ARCA-RDC CD-41098. Données hébergées en RDC.</p>
          </div>
        </div>
      </div>

    </footer>
  );
}
