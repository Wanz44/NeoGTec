'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  ArrowRight, 
  QrCode, 
  Lock, 
  Zap, 
  Smartphone, 
  ShieldCheck,
  Video 
} from 'lucide-react';
import { Header } from '../../../components/Header';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Footer } from '../../../components/Footer';

export default function SolutionsPage() {
  const solutions = [
    {
      id: 1,
      title: "QR Code intelligent",
      risk: "Fraude : 15% de vos primes partent en faux soins.",
      desc: "Chaque employé possède un code unique sur son téléphone. L'hôpital le scanne en une seconde. Personne d'autre ne peut utiliser ses droits.",
      techName: "Tiers-payant dématérialisé",
      icon: <QrCode className="h-6 w-6 text-[#00A86B]" />
    },
    {
      id: 2,
      title: "Sécurité totale des données",
      risk: "Fuite : Perdre des secrets médicaux viole la loi n°18/035.",
      desc: "Nous cryptons tous les dossiers médicaux dans une base sécurisée. Vos données restent privées. Pas de fuite de listes par e-mail.",
      techName: "RLS Postgres de Supabase",
      icon: <Lock className="h-6 w-6 text-[#00A86B]" />
    },
    {
      id: 3,
      title: "Clearing automatique sous 24h",
      risk: "Lenteurs : 30 jours pour payer un hôpital bloque vos malades.",
      desc: "Fini la paperasse postale. L'ordinateur vérifie et valide automatiquement 92% des factures médicales. L'hôpital reçoit son argent tout de suite.",
      techName: "Rapprochement algorithmique",
      icon: <Zap className="h-6 w-6 text-[#00A86B] animate-pulse" />
    },
    {
      id: 4,
      title: "Application mobile pour l'assuré",
      risk: "Plaintes : Des familles refusées aux soins nuisent au climat social.",
      desc: "L'employé voit son budget en direct sur son téléphone. Il sait où aller se soigner sans mauvaise surprise.",
      techName: "Espace assuré mobile",
      icon: <Smartphone className="h-6 w-6 text-[#00A86B]" />
    },
    {
      id: 5,
      title: "Rapports d’audits clairs",
      risk: "Audits : Les erreurs de calcul coûtent 50 millions FC d'amende.",
      desc: "Vos cotisations sont calculées sans aucune erreur de formule. Un rapport simple est prêt à tout moment pour la douane ou l'autorité.",
      techName: "Registres immuables",
      icon: <ShieldCheck className="h-6 w-6 text-[#00A86B]" />
    }
  ];

  const handleDemoVideo = () => {
    alert("Vidéo de démonstration de 2 minutes : Comment NeoGTec sécurise vos flux en direct.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <Header />
      <Breadcrumbs currentPageName="Nos Solutions" />

      <main className="flex-1">
        {/* Solutions intro Section */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 text-xs font-black text-[#00A86B] tracking-wider uppercase font-mono">
              🛡️ Zéro Risque
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
              NeoGTec supprime ces 5 risques
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-semibold">
              On paie vos hôpitaux plus vite. Zéro papier. Voici comment nous protégeons votre argent.
            </p>
          </motion.div>

          {/* Solutions display */}
          <div className="space-y-8 mt-12 max-w-5xl mx-auto">
            {solutions.map((sol, index) => (
              <motion.div
                key={sol.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group border border-slate-200 rounded-[8px] bg-white p-6 md:p-8 hover:border-[#00A86B]/30 shadow-xs flex flex-col md:flex-row md:items-start gap-6 transition-all"
              >
                {/* Sol Icon */}
                <div className="flex-shrink-0 h-12 w-12 rounded-[8px] bg-[#F0FDF4] border border-[#00A86B]/10 flex items-center justify-center">
                  {sol.icon}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold uppercase text-slate-900">
                      {sol.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-500">
                      ⚙️ {sol.techName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {sol.desc}
                  </p>

                  <div className="bg-red-50/50 border border-red-100/50 rounded-[6px] p-3 text-xs text-red-700 font-bold font-mono">
                    ⚠️ Risque bloqué : {sol.risk}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Dual CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#F0FDF4] border border-[#00A86B]/25 rounded-[8px] p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6"
          >
            <h3 className="text-xl md:text-2xl font-extrabold uppercase text-[#0F172A]">
              Prêt pour un système simple ?
            </h3>
            <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto">
              Nous avons 16 modules prêts à l&apos;emploi. Activez seulement ce dont vous avez besoin.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/modules"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00A86B]/15"
              >
                <span>Voir tous les modules</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <button
                onClick={handleDemoVideo}
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-900 transition-all hover:bg-slate-50 cursor-pointer"
              >
                <Video className="h-4 w-4 text-[#00A86B]" />
                <span>Voir la vidéo 2 min</span>
              </button>
            </div>
          </motion.div>

        </section>
      </main>

      <Footer />
    </div>
  );
}

import Link from 'next/link';
