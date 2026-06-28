import React from 'react';
import { ShieldCheck, ArrowRight, Play } from 'lucide-react';

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 🌌 HERO SECTION WITH HIGH-PERFORMANCE AMBIENT BG VIDEO */}
      <section className="relative pt-36 pb-32 md:pt-44 md:pb-40 overflow-hidden select-none bg-slate-950">
        {/* High performance video with poster placeholder for tight 3G budgets */}
        <video 
          poster="/src/assets/images/phare_poster_1781707154568.jpg" 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="none" 
          className="absolute inset-0 w-full h-full object-cover opacity-45 select-none pointer-events-none" 
        />
        
        {/* Clean mathematical overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00A86B]/40 bg-[#00A86B]/10 px-3.5 py-1 text-[10px] font-black tracking-wider text-green-300 uppercase font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
              <span>Agrément ARCA-RDC n°ARCA/2025/0127 | Conforme v2.1</span>
            </div>
            
            {/* H1 48px: Action-oriented, 11 words */}
            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-black uppercase text-white leading-[1.05] tracking-tight">
              L’assurance santé qui fait gagner <span className="text-[#00A86B]">70% de temps</span> à vos RH
            </h1>
            
            {/* H2 20px: zero jargon */}
            <h2 className="text-lg sm:text-[20px] font-bold text-slate-350 leading-relaxed max-w-2xl">
              Zéro papier. 100% traçable ARCA-RDC. Paiement hôpitaux en 24h.
            </h2>

            {/* Double CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/affiliation" className="h-12 px-6 rounded-full bg-[#00A86B] hover:bg-[#007D4C] text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 transition-colors duration-150 select-none">
                <span>Demander une démo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <button className="h-12 px-6 rounded-full border border-white/30 hover:border-white text-white hover:bg-white/5 text-xs font-extrabold uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-colors duration-150 select-none bg-transparent">
                <Play className="w-4 h-4 fill-current text-white shrink-0" />
                <span>Voir la vidéo 2min</span>
              </button>
            </div>

            {/* Social Proof: Bralima, TFM, Rawbank with N&B logos */}
            <div className="pt-6 space-y-2 select-none">
              <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block font-bold">Utilisé par Bralima, TFM, Rawbank</p>
              <div className="flex items-center gap-6 opacity-70 grayscale">
                <div className="text-white text-xs font-mono font-black border border-white/20 px-2.5 py-1 tracking-tighter rounded">BRALIMA S.A.</div>
                <div className="text-white text-xs font-mono font-black border border-white/20 px-2.5 py-1 tracking-tighter rounded">TENKE FUNGURUME</div>
                <div className="text-white text-xs font-mono font-black border border-white/20 px-2.5 py-1 tracking-tighter rounded">RAWBANK RDC</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
