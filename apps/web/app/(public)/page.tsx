'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  Server, 
  Lock, 
  Clock, 
  CheckCircle, 
  Video, 
  Sparkles,
  AlertOctagon,
  Blocks,
  HelpCircle,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function PublicLandingPage() {
  const handleWatchVideo = () => {
    alert("Vidéo de démonstration de 2 minutes : Comment NeoGTec sécurises vos flux.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <Header />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-slate-100 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            
            {/* Left Column Content */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00A86B]/25 bg-[#00A86B]/5 px-3 py-1 text-[10px] font-black text-[#00A86B] tracking-wider uppercase font-mono">
                <Sparkles className="h-3.5 w-3.5 text-[#00A86B]" />
                <span>Certification ARCA RDC & Conformité Africaine</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-slate-900 leading-[1.05] tracking-tight">
                On paie vos hôpitaux plus vite. <span className="text-[#00A86B]">Zéro papier.</span>
              </h1>
              
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold max-w-xl">
                La plateforme SaaS connectée pour gérer la santé des collaborateurs. 
                <span className="text-slate-950 block font-bold mt-1.5">✓ Agréée ARCA-RDC • Simple d&apos;utilisation • Chiffrement sécurisé des dossiers.</span>
              </p>

              {/* Server data anchors */}
              <div className="flex flex-wrap gap-2.5 pt-2 text-[10px] text-slate-500 font-bold font-mono select-none">
                <span className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-[6px] flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-[#00A86B]" /> Serveur Local Kinshasa
                </span>
                <span className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-[6px] flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#00A86B]" /> Clés de cryptage AES-256
                </span>
              </div>

              {/* Dual CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/affiliation"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00A86B]/15"
                >
                  <span>Demander une démo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                
                <button
                  type="button"
                  onClick={handleWatchVideo}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-900 transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <Video className="h-4 w-4 text-[#00A86B]" />
                  <span>Voir la vidéo 2 min</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column Applet Visualization */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="mx-auto w-full max-w-sm rounded-[8px] bg-slate-900 border border-slate-800 p-5 shadow-xl">
                <div className="flex items-center gap-1 border-b border-slate-800 pb-3 mb-4 font-mono text-[9px] text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-slate-400">validation_soins_neogtec.sh</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-[8px] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Délai Règlement Hôpital</span>
                      <strong className="text-xl text-[#00A86B] block">Sous 48h au total <span className="text-xs text-slate-450 font-semibold">(au lieu de 30j)</span></strong>
                    </div>
                    <Activity className="h-6 w-6 text-[#00A86B] animate-pulse" />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-[8px] border border-white/5 space-y-1 font-mono text-[9.5px] text-[#00ff66] text-left">
                    <p>» CONTROLE IDENTITE: QR CODE VALIDE</p>
                    <p>» VERIFICATION FRAUDE: CONFORME 100%</p>
                    <p>» ACCORD PEC: EXPEDIE AUX RH</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-bold text-white font-mono">
                    <div className="p-2 bg-white/5 rounded-[6px]">
                      <p className="text-[8px] text-slate-400">Clearing</p>
                      <p className="text-[#00A86B]">92% Auto</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-[6px]">
                      <p className="text-[8px] text-slate-400">Fraude</p>
                      <p className="text-amber-500">Zéro</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-[6px]">
                      <p className="text-[8px] text-slate-400">Hébergement</p>
                      <p className="text-sky-400">CONGO</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core navigation index - Quick Cards to other pages */}
      <section className="py-16 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <span className="text-[10px] font-black uppercase text-[#00A86B] tracking-widest font-mono">4 Piliers Essentiels</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight">Explorez notre plateforme</h2>
            <p className="text-sm font-semibold text-slate-500">Parcourez nos dossiers complets pour comprendre comment économiser votre budget.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Risks */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-slate-200 p-6 rounded-[8px] flex flex-col justify-between hover:border-red-500/30 shadow-xs transition-all"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 bg-red-50 text-red-600 rounded-[8px] flex items-center justify-center pb-0.5">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">1. Les 5 Risques</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Découvrez comment la triche et la lenteur détruisent vos finances.
                </p>
              </div>
              <Link 
                href="/risques" 
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-red-600 hover:gap-2 transition-all mt-6"
              >
                <span>Analyser les risques</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Card 2: Solutions */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-slate-200 p-6 rounded-[8px] flex flex-col justify-between hover:border-[#00A86B]/30 shadow-xs transition-all"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 bg-[#F0FDF4] text-[#00A86B] rounded-[8px] flex items-center justify-center pb-0.5">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">2. Nos Solutions</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Notre réponse pour bloquer les fraudes et soigner vos collaborateurs.
                </p>
              </div>
              <Link 
                href="/solutions" 
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#00A86B] hover:gap-2 transition-all mt-6"
              >
                <span>Découvrir l&apos;outil</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Card 3: Modules */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-slate-200 p-6 rounded-[8px] flex flex-col justify-between hover:border-amber-500/30 shadow-xs transition-all"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-[8px] flex items-center justify-center pb-0.5">
                  <Blocks className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">3. 16 Modules</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Payez uniquement pour les fonctions dont vous avez besoin.
                </p>
              </div>
              <Link 
                href="/modules" 
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-amber-600 hover:gap-2 transition-all mt-6"
              >
                <span>Régler ses options</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Card 4: FAQ */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-slate-200 p-6 rounded-[8px] flex flex-col justify-between hover:border-sky-500/30 shadow-xs transition-all"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 bg-sky-50 text-sky-600 rounded-[8px] flex items-center justify-center pb-0.5">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">4. FAQ DRH</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Quelles sont les réponses aux interrogations de vos managers ?
                </p>
              </div>
              <Link 
                href="/faq" 
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-sky-600 hover:gap-2 transition-all mt-6"
              >
                <span>Ouvrir la foire aux questions</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Large visual quote & support banner */}
      <section className="py-16 bg-slate-900 text-white relative border-b border-white/5 select-none">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block border border-[#00A86B]/30 bg-[#00A86B]/10 rounded-full px-3 py-1 text-[10px] font-mono font-black uppercase text-[#00A86B]">
            ★ Réduction Drastique des Lenteurs
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase leading-tight font-sans">
            Garantissez l&apos;accès immédiat aux soins de santé
          </h2>
          <p className="text-slate-350 text-xs md:text-sm font-semibold max-w-2xl mx-auto leading-relaxed">
            Vos collaborateurs n&apos;attendront plus jamais de longues heures à l&apos;accueil clinique. 
            Leur prise en charge est enregistrée et validée de façon 100% digitale.
          </p>

          <div className="pt-4">
            <Link 
              href="/affiliation"
              className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white hover:scale-[1.01] hover:shadow-lg hover:shadow-[#00A86B]/10 transition-all font-sans"
            >
              Demander un devis en 5 min
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
