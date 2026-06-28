'use client';

import React from 'react';
import { ShieldCheck, Activity, ArrowRight, Server, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSection() {
  const handleScrollToTunnel = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('demande-contrat');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-20 md:pt-32 md:pb-28 border-b border-slate-100">
      {/* Background radial effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00A86B]/20 to-[#00A86B]/5 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Text block (Left column - 7/12) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Compliance Batch and Trust labels */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#00A86B]/25 bg-[#00A86B]/5 px-3.5 py-1 text-xs font-black text-[#00A86B] tracking-wider uppercase font-mono mb-2">
              <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
              <span>Agréateur Institutionnel RDC : Agréé ARCA-RDC</span>
            </div>

            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1] font-sans">
              NeoGTec : La plateforme SaaS qui divise par <span className="text-[#00A86B]">3</span> le délai des prises en charge santé en RDC
            </h1>
            
            <p className="text-base text-slate-600 font-semibold max-w-2xl leading-relaxed">
              La solution d'assurance santé connectée pour l'Afrique de l'Est et Centrale. 
              <span className="text-slate-900 block font-bold mt-1">✓ Agréée ARCA-RDC • 100% traçable • Données hébergées localement en RDC • Chiffrement de niveau National AES-256.</span>
            </p>

            {/* Quick trust flags */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 font-mono">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <Server className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Datacenter Souverain RDC</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <Lock className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Chiffrement AES-256</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#demande-contrat"
                onClick={handleScrollToTunnel}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#00A86B] px-6 text-xs font-black uppercase text-white shadow-lg shadow-[#00A86B]/20 hover:bg-[#008d59] active:scale-[0.98] transition-all cursor-pointer border border-[#00A86B]/15"
              >
                Démarrer ma demande de contrat
              </a>
              <a
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                Portail Client / Espace Admin
              </a>
            </div>
          </div>

          {/* Visual Mockup Dashboard (Right column - 5/12) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-slate-900 p-4 shadow-2xl">
              
              {/* Window Controls */}
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4 text-[10px] font-mono text-slate-500">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2">neogtec_agent_tri_rdc.sh</span>
              </div>

              {/* Graphic Simulator Content */}
              <div className="space-y-4">
                
                {/* Simulated Triage Metric */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-mono">Délai moyen Prise en Charge</span>
                    <span className="text-xl font-extrabold text-[#00A86B] block">48 heures <span className="text-[10.5px] text-slate-400 font-semibold">(au lieu de 15 jours)</span></span>
                  </div>
                  <div className="p-2 bg-[#00A86B]/10 rounded-lg text-[#00A86B]">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                </div>

                {/* Simulated Security Ledger */}
                <div className="p-3 bg-slate-950/80 rounded-xl space-y-2 border border-white/5">
                  <span className="text-[9px] uppercase font-mono font-black text-rose-500 block">✓ Registre Cryptographique Décentralisé</span>
                  
                  <div className="text-[9px] font-mono space-y-1 text-slate-350">
                    <p className="text-[#00ff66]">* SECURE BOOT: pgsodium v1.6 is ACTIVE</p>
                    <p>* CIPHER ALGO: AES-GCM-256 bits verified</p>
                    <p>* ARCA TELEMETRY: 200 OK (Kinshasa DC)</p>
                    <p className="opacity-60">* AUDIT HASH: CD-281-a2f98e6cdbd65c71bbf6e52c8...</p>
                  </div>
                </div>

                {/* Graphical Card Bar */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-300">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider block mb-0.5">Clearing</p>
                    <p className="font-extrabold text-[#00A86B]">Auto 92%</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider block mb-0.5">Fraude</p>
                    <p className="font-extrabold text-amber-500">Bloqué 99%</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[8px] text-slate-400 uppercase tracking-wider block mb-0.5">Données</p>
                    <p className="font-extrabold text-indigo-400">100% RDC</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
