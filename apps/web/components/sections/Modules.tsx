'use client';

import React from 'react';
import { 
  Heart, 
  Video, 
  BarChart3, 
  FolderSync, 
  QrCode, 
  MapPin, 
  FileSignature, 
  Smartphone 
} from 'lucide-react';

export default function ModulesSection() {
  const modules = [
    {
      id: 'm1',
      icon: <Heart className="w-5 h-5 text-[#00A86B]" />,
      title: "Prise en Charge (PEC)",
      benefit: "Bons numérisés et validation des soins hôpitaux en moins de 48h.",
      lead: "Divise par 3 l'attente administrative de vos équipes à l'admission."
    },
    {
      id: 'm2',
      icon: <Video className="w-5 h-5 text-[#00A86B]" />,
      title: "Téléconsultation",
      benefit: "Médecine connectée sécurisée pour joindre les soignants spécialisés.",
      lead: "Solution optimale d'orientation médicale pour les chantiers ou zones isolées."
    },
    {
      id: 'm3',
      icon: <BarChart3 className="w-5 h-5 text-[#00A86B]" />,
      title: "Business Intelligence",
      benefit: "Dashboards d'analyse des coûts de prescription et fréquence de sinistres.",
      lead: "Pilotage proactif des plafonds de consommation par filiale ou poste."
    },
    {
      id: 'm4',
      icon: <FolderSync className="w-5 h-5 text-[#00A86B]" />,
      title: "Clearing médical",
      benefit: "Triage algorithmique automatique de 92% des factures cliniques.",
      lead: "Réduction drastique des fraudes à la facturation et chevauchements de soins."
    },
    {
      id: 'm5',
      icon: <QrCode className="w-5 h-5 text-[#00A86B]" />,
      title: "QR Code Patient",
      benefit: "Identifiant de tiers-payant dématérialisé avec validité de 24h.",
      lead: "Vérification infalsifiable du statut d'éligibilité actif en quelques secondes."
    },
    {
      id: 'm6',
      icon: <MapPin className="w-5 h-5 text-[#00A86B]" />,
      title: "Géolocalisation GPS",
      benefit: "Annuaire cartographique temps réel des centres médicaux agréés.",
      lead: "Orientation instantanée vers les hôpitaux ou pharmacies du réseau conventionné."
    },
    {
      id: 'm7',
      icon: <FileSignature className="w-5 h-5 text-[#00A86B]" />,
      title: "DocuSign (Signature)",
      benefit: "Validation juridique et légale de contrats d'adhesion collective.",
      lead: "Signature numérique sécurisée, conforme Loi n°18/035 et réglementation ARCA."
    },
    {
      id: 'm8',
      icon: <Smartphone className="w-5 h-5 text-[#00A86B]" />,
      title: "Application Mobile",
      benefit: "Portail collaboratif autonome de l'assuré pour ses ayants-droits.",
      lead: "Téléchargement d'attestations et consultation directe des plafonds autorisés."
    }
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00A86B] font-mono block">Fonctionnalités avancées du SaaS</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-950 sm:text-4xl">
            Un Écosystème Modulaire Complet à Votre Service
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto">
            Sélectionnez et activez uniquement les fonctionnalités adaptées à la taille de votre entreprise, de votre mutuelle, ou de votre clinique.
          </p>
        </div>

        {/* 4x2 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <div 
              key={mod.id}
              className="bg-white border border-slate-200 hover:border-[#00A86B]/45 p-6 rounded-2xl shadow-3xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 bg-[#00A86B]/10 rounded-xl flex items-center justify-center text-[#00A86B] border border-[#00A86B]/10 transition-colors group-hover:bg-[#00A86B]/20">
                  {mod.icon}
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="font-extrabold uppercase text-slate-900 text-xs tracking-wide">
                    {mod.title}
                  </h3>
                  <p className="text-slate-700 font-bold text-[11.5px] leading-relaxed">
                    {mod.benefit}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 text-[10.5px] text-slate-450 font-medium leading-normal">
                {mod.lead}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
