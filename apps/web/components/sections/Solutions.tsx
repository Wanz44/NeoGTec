'use client';

import React, { useState } from 'react';
import { ShieldAlert, Cpu, Heart, CheckCircle, Hospital, Building2, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SolutionsSection() {
  const [activeTab, setActiveTab] = useState<'assureurs' | 'hopitaux' | 'entreprises'>('assureurs');

  const tabs = [
    { id: 'assureurs', label: 'DSI & Assureurs', icon: <Cpu className="w-4 h-4" /> },
    { id: 'hopitaux', label: 'Établissements & Hôpitaux', icon: <Hospital className="w-4 h-4" /> },
    { id: 'entreprises', label: 'Espace RH Entreprises', icon: <Building2 className="w-4 h-4" /> },
  ] as const;

  const solutionsContent = {
    assureurs: {
      badge: "Infrastructures assureurs connectées",
      title: "Optimisation de la tarification et contrôle de solvabilité",
      description: "Pour les assureurs et mutuelles opérant en République Démocratique du Congo, NeoGTec unifie et accélère les processus d'acceptation de sinistres.",
      pillars: [
        { title: "Clearing auto", desc: "Traitement algorithmique de 92% des factures médicales et routage financier instantané." },
        { title: "Détection fraude IA", desc: "Identification intelligente des chevauchements de soins, surfacturation ou ordonnances doublons." },
        { title: "Dashboard ARCA", desc: "Génération automatique des extraits et bilans requis pour vos rapports d'audits trimestriels." }
      ]
    },
    hopitaux: {
      badge: "Réseau hospitalier connecté",
      title: "Zéro papier, zéro attente au comptoir d'admission",
      description: "Offrez à vos patients une expérience fluide et prévenez les risques financiers liés aux impayés ou rachet de garanties erronés.",
      pillars: [
        { title: "QR Patient", desc: "Vérification du statut d'éligibilité et du tiers-payant en 2 secondes via scan du code QR dynamique." },
        { title: "Signature digitale", desc: "Consentements et protocoles cliniques certifiés cryptographiquement sur tablette tactile." },
        { title: "Téléconsultation intégrée", desc: "Connectez vos médecins spécialistes aux dispensaires éloignés n'importe où en RDC." }
      ]
    },
    entreprises: {
      badge: "Gestion RH simplifiée",
      title: "Automatisation de votre couverture santé collective",
      description: "Donnez à vos directeurs RH le plein contrôle sur le volume de collaborateurs affilés en toute légalité et conforme ARCA.",
      pillars: [
        { title: "Portail RH autonome", desc: "Incorporez, suspendez ou gérez les ayants-droits de vos salariés sans aucun formulaire papier." },
        { title: "Cotisations auto", desc: "Calcul automatisé des parts salariales/patronales mensuelles et génération d'effets de paiement." },
        { title: "Alertes impayés", desc: "Suivi proactif des plafonds de consommation par salarié pour de parfaits arbitrages budgétaires." }
      ]
    }
  };

  const activeContent = solutionsContent[activeTab];

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00A86B] font-mono block">Plateforme Unifiée</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-950 sm:text-4xl">
            La Réponse SaaS pour Chaque Acteur de l&apos;Écosystème
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto">
            NeoGTec relie instantanément les Directions RH, les Assureurs agrées ARCA et les Hôpitaux prestataires dans un canal de données chiffré unique.
          </p>
        </div>

        {/* Custom Shadcn Tabs Design wrapper */}
        <div className="flex flex-col items-center space-y-8">
          
          {/* Tabs header container */}
          <div className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 p-1 border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wide cursor-pointer outline-none focus:ring-0",
                  activeTab === tab.id
                    ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Content Card */}
          <div className="w-full max-w-5xl bg-slate-50/50 rounded-3xl border border-slate-200/85 p-8 md:p-12 shadow-sm transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Product value prop (Left 5/12 grid) */}
              <div className="lg:col-span-5 text-left space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00A86B]/20 bg-[#00A86B]/5 px-3 py-1 text-[9.5px] font-black text-[#00A86B] tracking-wider uppercase font-mono">
                  {activeContent.badge}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold uppercase text-slate-900 leading-tight font-sans">
                  {activeContent.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                  {activeContent.description}
                </p>
              </div>

              {/* Pillars (Right 7/12 grid) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {activeContent.pillars.map((pil, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-3xs flex flex-col justify-between hover:border-[#00a86b]/40 hover:shadow-md transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[#00A86B] font-black text-xs uppercase mb-2 font-mono">
                        <CheckCircle className="w-4 h-4 text-[#00A86B] shrink-0" />
                        <span>{pil.title}</span>
                      </div>
                      <p className="text-slate-650 text-[11.5px] leading-relaxed font-semibold">
                        {pil.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
