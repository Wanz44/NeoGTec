'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Smartphone, 
  Video, 
  Users, 
  Clipboard, 
  Building, 
  Coins, 
  ShieldCheck, 
  AlertOctagon, 
  Mail, 
  PenTool, 
  BarChart, 
  UploadCloud, 
  MapPin, 
  Lock, 
  FileSpreadsheet,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Header } from '../../../components/Header';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';

export default function ModulesPage() {
  const modulesList = [
    {
      id: 1,
      name: "Prises en Charge (PEC)",
      benefit: "Demandez vos fiches d'admission en une minute.",
      badge: "Inclus Silver",
      icon: <Heart className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 2,
      name: "QR Code Patient",
      benefit: "Prouvez votre identité à l'hôpital d'un simple scan.",
      badge: "Inclus Silver",
      icon: <Smartphone className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 3,
      name: "Téléconsultation",
      benefit: "Vos employés voient un médecin en 5 min.",
      badge: "Add-on Gold",
      icon: <Video className="h-5 w-5 text-amber-600" />
    },
    {
      id: 4,
      name: "Espace RH d'Entreprise",
      benefit: "Gérez vos employés et adaptez vos listes sans papier.",
      badge: "Inclus Silver",
      icon: <Users className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 5,
      name: "Espace Médecin",
      benefit: "Les praticiens rédigent leurs ordonnances plus vite.",
      badge: "Inclus Silver",
      icon: <Clipboard className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 6,
      name: "Espace Hôpital",
      benefit: "Les cliniques suivent leurs remboursements de soins.",
      badge: "Inclus Silver",
      icon: <Building className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 7,
      name: "Multi-devises Nationales",
      benefit: "Calculez vos paiements en USD, FC, NGN, KES.",
      badge: "Add-on Gold",
      icon: <Coins className="h-5 w-5 text-amber-600" />
    },
    {
      id: 8,
      name: "Calculateur de Cotisations",
      benefit: "Vos comptes d'assurance sans aucune erreur de calcul.",
      badge: "Inclus Silver",
      icon: <ShieldCheck className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 9,
      name: "Détection des Fraudes",
      benefit: "Bloquez sur-le-champ les rachets de soins.",
      badge: "Add-on Gold",
      icon: <AlertOctagon className="h-5 w-5 text-amber-600" />
    },
    {
      id: 10,
      name: "Alertes Instantanées",
      benefit: "Vos salariés sont prévenus par SMS ou WhatsApp.",
      badge: "Add-on Gold",
      icon: <Mail className="h-5 w-5 text-amber-600" />
    },
    {
      id: 11,
      name: "DocuSign Électronique",
      benefit: "Signez tous vos contrats de santé en ligne.",
      badge: "Add-on Gold",
      icon: <PenTool className="h-5 w-5 text-amber-600" />
    },
    {
      id: 12,
      name: "Tableaux de Bord RH",
      benefit: "Regardez vos dépenses totales en temps réel.",
      badge: "Inclus Silver",
      icon: <BarChart className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 13,
      name: "Importateur de Fichiers Excel",
      benefit: "Ajoutez 500 employés en deux clics seulement.",
      badge: "Inclus Silver",
      icon: <UploadCloud className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 14,
      name: "Géolocalisation des Centres",
      benefit: "Trouvez tout de suite un hôpital agréé proche.",
      badge: "Inclus Silver",
      icon: <MapPin className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 15,
      name: "Dossiers de Soin Cryptés",
      benefit: "Les données médicales restent secrètes et à l'abri.",
      badge: "Inclus Silver",
      icon: <Lock className="h-5 w-5 text-[#00A86B]" />
    },
    {
      id: 16,
      name: "Facturation Standardisée",
      benefit: "Limitez les erreurs d'encaissement et de prix.",
      badge: "Inclus Silver",
      icon: <FileSpreadsheet className="h-5 w-5 text-[#00A86B]" />
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <Header />
      <Breadcrumbs currentPageName="16 Modules SaaS" />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          
          {/* Header intro */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] border border-[#00A86B]/25 px-3 py-1 text-xs font-black text-[#00A86B] tracking-wider uppercase font-mono">
              <Sparkles className="h-3.5 w-3.5 text-[#00A86B]" /> Modules à la carte
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
              16 modules. Payez ce que vous utilisez.
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-semibold">
              Pas de package forcé. Choisissez les fonctionnalités adaptées à la taille de votre entreprise.
            </p>
          </motion.div>

          {/* Grid list 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
            {modulesList.map((m, index) => {
              const isGold = m.badge === "Add-on Gold";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex flex-col justify-between border border-slate-200 rounded-[8px] bg-white p-5 hover:border-[#00A86B]/30 hover:scale-[1.01] transition-all group shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-50 border border-slate-100 group-hover:bg-[#F0FDF4] transition-colors pb-0.5">
                        {m.icon}
                      </div>

                      {/* Badge styling */}
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-[6px] border ${
                        isGold 
                          ? 'bg-amber-55/10 border-amber-500/20 text-amber-700' 
                          : 'bg-emerald-55/10 border-emerald-500/20 text-[#00A86B]'
                      }`}>
                        {m.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">
                      {m.name}
                    </h3>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {m.benefit}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] font-mono font-bold text-slate-400">
                    ID MODULE: 0{m.id} • SECURE CODE
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#F0FDF4] border border-[#00A86B]/25 rounded-[8px] p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6"
          >
            <h3 className="text-xl md:text-2xl font-extrabold uppercase text-[#0F172A]">
              Sélectionnez vos modules personnalisés
            </h3>
            <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto">
              Dites-nous ce dont vous avez besoin. Vos cartes de santé d&apos;entreprise prêtes en 5 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/affiliation"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00A86B]/15"
              >
                <span>Démarrer l&apos;affiliation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="/faq"
                className="w-full sm:w-auto inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-900 transition-all hover:bg-slate-50"
              >
                <span>Des questions ? Voir la FAQ</span>
              </Link>
            </div>
          </motion.div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
