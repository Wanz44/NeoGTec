'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';

export default function SocialProofSection() {
  const partners = [
    { name: "SUNU Assurances", status: "Agréé ARCA" },
    { name: "AXA Assurances RDC", status: "Partenaire Solution" },
    { name: "Ngaliema Medical Center", status: "Hôpital Affilié" },
    { name: "KinPharma Network", status: "Pharmacie Agrée" }
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center select-none">
        
        {/* Section Title */}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block mb-3">La Force du Réseau Connecté</span>
        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest block mb-10">
          Ils nous font confiance
        </h2>

        {/* Partner Logos/Text Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mb-16">
          {partners.map((p, i) => (
            <div 
              key={i} 
              className="px-6 py-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-100/40 hover:border-slate-350 transition-colors duration-250 cursor-default"
            >
              <span className="text-slate-900 font-black tracking-tight uppercase text-xs md:text-sm">
                {p.name}
              </span>
              <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                {p.status}
              </span>
            </div>
          ))}
        </div>

        {/* Main Testimonial Block */}
        <div className="mx-auto max-w-3xl relative">
          
          {/* Quote Decorators SVG */}
          <div className="absolute -top-6 -left-6 text-slate-200 pointer-events-none">
            <Quote className="w-16 h-16 opacity-30 transform -rotate-18" />
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-center space-y-6">
            
            {/* Stars decoration */}
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="text-base md:text-xl text-slate-950 font-medium italic leading-relaxed font-serif max-w-2xl mx-auto">
              &ldquo;L&apos;intégration de la solution SaaS NeoGTec a divisé par 7 le délai d&apos;entrée effective de nos salariés au régime d&apos;assurance collective santé de l&apos;entreprise. Nos bons de prises en charge (PEC) sont validés médicalement en moins de 48 heures au lieu de 15 jours d&apos;attente auparavant. Une révolution administrative pour ACME Corp.&rdquo;
            </blockquote>

            <div className="space-y-1">
              <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wide">
                Marie KAPEND
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block tracking-wider">
                Directrice des Ressources Humaines • ACME Corp RDC
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
