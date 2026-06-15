'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TrendingDown, 
  Hourglass, 
  AlertOctagon, 
  Play, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';
import { Header } from '../../../components/Header';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Footer } from '../../../components/Footer';

export default function RisquesPage() {
  const risks = [
    {
      id: 1,
      title: "Fraude Prise En Charge",
      description: "Des personnes utilisent les cartes de vos employés absents pour se soigner.",
      impact: "Fraude : 15% de vos primes partent en faux soins.",
      icon: <ShieldAlert className="h-6 w-6 text-red-600" />
    },
    {
      id: 2,
      title: "Fuite de Données",
      description: "Vos dossiers et listes d'affiliés s'échangent par e-mails simples non protégés.",
      impact: "Fuites : Perdre des secrets médicaux viole la loi n°18/035.",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    {
      id: 3,
      title: "Lenteurs de Validation",
      description: "Les cliniquent attendent des semaines le bon papier pour opérer vos malades.",
      impact: "Lenteurs : 30 jours pour payer un hôpital bloque vos malades.",
      icon: <Hourglass className="h-6 w-6 text-red-600 animate-pulse" />
    },
    {
      id: 4,
      title: "Plaintes des Équipes",
      description: "Vos collaborateurs se font rejeter aux accueils des hôpitaux partenaires.",
      impact: "Plaintes : Des familles refusées aux soins nuisent au climat social.",
      icon: <TrendingDown className="h-6 w-6 text-red-600" />
    },
    {
      id: 5,
      title: "Audit Régulation Raté",
      description: "Vos calculs de cotisations ou déclarations de risques manquent de preuves.",
      impact: "Audits : Les erreurs de calcul coûtent 50 millions FC d'amende.",
      icon: <AlertOctagon className="h-6 w-6 text-red-600" />
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <Breadcrumbs currentPageName="Les Risques Santé" />

      {/* Main Page Area */}
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          
          {/* Header Intro Block */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-black text-red-700 tracking-wider uppercase font-mono">
              ⚠️ Alerte Gaspillage Budget
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-slate-900">
              5 risques qui coûtent cher à votre entreprise
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-semibold">
              Gérer la santé avec du papier ruine votre entreprise. Voici les cinq dangers financiers réels observés en Afrique.
            </p>
          </motion.div>

          {/* Risks list as Bento cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {risks.map((risk, index) => (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex flex-col justify-between rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm hover:border-red-500/30 hover:scale-[1.01] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-red-50 border border-red-100 pb-0.5">
                    {risk.icon}
                  </div>
                  <h3 className="text-base font-black uppercase text-slate-900">{risk.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{risk.description}</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-red-600 font-mono">
                    ★ {risk.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action block with Dual CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#F0FDF4] border border-[#00A86B]/20 rounded-[8px] p-8 md:p-10 text-center max-w-4xl mx-auto space-y-6"
          >
            <h3 className="text-xl md:text-2xl font-extrabold uppercase text-[#0F172A]">
              Supprimez ces pertes financières inutiles dès aujourd&apos;hui
            </h3>
            <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto">
              NeoGTec automatise tout. On sécurise vos cartes et on élimine la paperasse lente.
            </p>

            {/* Dual CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/affiliation"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00A86B]/15"
              >
                <span>Démarrer l&apos;Affiliation rapide</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/solutions"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-900 transition-all hover:bg-slate-50"
              >
                <span>Comment NeoGTec supprime ces risques</span>
                <ArrowRight className="h-4 w-4 text-[#00A86B]" />
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-6 pt-4 text-[10px] font-mono text-slate-500 font-bold">
              <span>✓ ZÉRO COMPLICATION</span>
              <span>✓ SANS ABONNEMENT COMPLIQUÉ</span>
              <span>✓ MULTI-PROGICIEL</span>
            </div>
          </motion.div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
