'use client';

import React from 'react';
import { Clock, Key, AlertOctagon } from 'lucide-react';

export default function ProblemsSection() {
  const problems = [
    {
      id: 'p1',
      icon: <Clock className="w-8 h-8 text-rose-600" />,
      title: "30j de délai PEC",
      description: "Le délai moyen de traitement manuel des fiches d'adhesion et des bons de prise en charge (PEC) oscille entre 15 et 30 jours, paralysant l'accès immédiat aux soins hospitaliers des collaborateurs.",
      regulatoryImpact: "Conséquence : Retards critiques de dispensation médicale, et réclamations constantes auprès des équipes RH."
    },
    {
      id: 'p2',
      icon: <Key className="w-8 h-8 text-rose-600" />,
      title: "Fichiers Excel = Fuite",
      description: "L'échange de dossiers médicaux et de listes d'affiliés par e-mails orphelins ou fichiers Excel non chiffrés expose l'entreprise à des fuites massives de données de santé hautement sensibles.",
      regulatoryImpact: "Hautement non-conforme : Infraction directe aux dispositions de confidentialité de la Loi n°18/035 de protection des données."
    },
    {
      id: 'p3',
      icon: <AlertOctagon className="w-8 h-8 text-rose-600" />,
      title: "Amende ARCA jusqu’à 50M FC",
      description: "Le non-respect du code des assurances, l'utilisation d'intermédiaires non agréés ou le défaut de traçabilité des cotisations et sinistres déclenche des audits punitifs de l'ARCA-RDC.",
      regulatoryImpact: "Sanctions : Amendes financières administratives s'élevant jusqu'à 50 000 000 FC et suspension d'activité."
    }
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 font-mono block">Le Statu Quo de la Santé en RDC</span>
          <h2 className="text-3xl font-extrabold uppercase text-slate-950 sm:text-4xl">
            Les Trois Risques Majeurs de la Gestion Traditionnelle
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto">
            Gérer la couverture médicale via des outils cloisonnés, manuels ou non réglementés nuit à la productivité de vos équipes et vous met en infraction avec la loi congolaise.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((prob) => (
            <div 
              key={prob.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:border-rose-200 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 transition-colors group-hover:bg-rose-100/50">
                  {prob.icon}
                </div>
                <h3 className="text-lg font-black uppercase text-slate-900 leading-tight">
                  {prob.title}
                </h3>
                <p className="text-slate-600 text-[12.5px] leading-relaxed font-semibold">
                  {prob.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6">
                <span className="text-[9.5px] font-mono font-black text-rose-700 uppercase block tracking-wider">
                  ⚠️ {prob.regulatoryImpact}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
