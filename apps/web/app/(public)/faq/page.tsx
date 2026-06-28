'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Header } from '../../../components/Header';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: "Est-ce conforme ARCA-RDC ?",
      a: "Oui, totalement. Notre solution respecte rigoureusement le code des assurances et les règles de l'organisme de régulation."
    },
    {
      q: "Combien de temps pour démarrer ?",
      a: "Il faut moins de 5 jours. Nous importons votre liste d'employés et tout est prêt immédiatement."
    },
    {
      q: "Mes données restent au Congo ?",
      a: "Oui, vos dossiers médicaux sont conservés en toute sécurité à Kinshasa. Cela respecte parfaitement la loi d'hébergement souverain RDC."
    },
    {
      q: "Et si internet coupe ?",
      a: "Pas d'inquiétude. Nos applications disposent d'un mode hors-ligne pour valider les urgences médicales sans problème."
    },
    {
      q: "Dois-je remplacer nos hôpitaux actuels ?",
      a: "Non. Nous connectons simplement notre outil à vos cliniques habituelles en quelques minutes."
    },
    {
      q: "Y a-t-il une application mobile ?",
      a: "Oui. L'application mobile permet à vos employés de consulter leur budget de soin en temps réel."
    },
    {
      q: "Comment inscrire 500 employés en une fois ?",
      a: "Vous téléchargez votre liste Excel sur l'interface. Les profils se créent tout seuls en deux secondes."
    },
    {
      q: "Quel est le coût de la plateforme ?",
      a: "Le tarif dépend uniquement du nombre d'employés actifs. Vous payez un petit prix par personne sans frais cachés."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <Header />
      <Breadcrumbs currentPageName="FAQ DRH" />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          
          {/* Header intro */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] border border-[#00A86B]/25 px-3 py-1 text-xs font-black text-[#00A86B] tracking-wider uppercase font-mono">
              💬 Réponses Directes
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
              Questions fréquentes des DRH Afrique
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-semibold">
              Des réponses claires pour vous rassurer. Pas de mots compliqués.
            </p>
          </motion.div>

          {/* Accordion container */}
          <div className="mt-12 space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="border border-slate-200 rounded-[8px] overflow-hidden bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <span className="flex items-center gap-3 text-sm font-black uppercase text-slate-900 tracking-tight">
                      <HelpCircle className="h-5 w-5 text-[#00A86B] shrink-0" />
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </button>

                  {/* Answer slide */}
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs md:text-sm font-semibold text-slate-600 border-t border-slate-100/60 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#F0FDF4] border border-[#00A86B]/25 rounded-[8px] p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6"
          >
            <h3 className="text-xl font-extrabold uppercase text-[#0F172A]">
              Vous avez un cas particulier ?
            </h3>
            <p className="text-sm font-semibold text-slate-600 max-w-lg mx-auto">
              Nos spécialistes vous appellent rapidement pour faire une démonstration gratuite du logiciel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/affiliation"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00A86B]/15"
              >
                <span>S&apos;affilier en 5 min</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-900 transition-all hover:bg-slate-50"
              >
                <span>Retour à l&apos;accueil</span>
              </Link>
            </div>
          </motion.div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
