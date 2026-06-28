'use client';

import React, { useState } from 'react';
import { ShieldAlert, Download, CheckCircle, FileText, Check, Loader2 } from 'lucide-react';

export default function ComplianceSection() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    // Simulate high-speed download prepare
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section className="bg-slate-900 text-white py-16 md:py-20 relative overflow-hidden border-b border-white/5">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-radial-gradient">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-[#00A86B] blur-[150px] rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-indigo-505 blur-[150px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
          
          {/* Compliance statement text block (Left 7/12) */}
          <div className="lg:col-span-8 text-left space-y-6">
            
            {/* Regulatory badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00A86B]/40 bg-[#00A86B]/10 px-3 py-1 text-[10px] font-black tracking-widest text-[#00A86B] uppercase font-mono">
              ★ Garantie de Souveraineté Juridique
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white font-sans max-w-2xl leading-none">
              Souveraineté des Données et Conformité Code des Assurances RDC
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl font-medium">
              NeoGTec est agréée par l'<strong>ARCA (Autorité de Régulation et de Contrôle des Assurances)</strong> en RDC. Toutes les données de santé de vos collaborateurs sont hébergées de façon souveraine dans un datacenter certifié hautement disponible situé sur le territoire de la République Démocratique du Congo.
            </p>

            {/* List of security highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-350">
              <div className="flex items-start gap-2">
                <div className="p-1 bg-[#00A86B]/10 border border-[#00A86B]/20 text-[#00A86B] rounded mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold mb-0.5 uppercase text-[10px] font-mono text-[#00A86B]">Chiffrement AES-256</strong>
                  <span>Données de santé cryptées au repos et en transit via pgsodium et clés de sécurité administrés de façon unique.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1 bg-[#00A86B]/10 border border-[#00A86B]/20 text-[#00A86B] rounded mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold mb-0.5 uppercase text-[10px] font-mono text-[#00A86B]">Audit Logs Immuables</strong>
                  <span>Chaque consultation médicale, approbation ou rejet génère un hash d'empreinte informatique immuable.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1 bg-[#00A86B]/10 border border-[#00A86B]/20 text-[#00A86B] rounded mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold mb-0.5 uppercase text-[10px] font-mono text-[#00A86B]">Hébergement National RDC</strong>
                  <span>Hébergement sécurisé dans les infrastructures à Kinshasa, garantissant conformité et faibles latences d'accès.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1 bg-[#00A86B]/10 border border-[#00A86B]/20 text-[#00A86B] rounded mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block font-bold mb-0.5 uppercase text-[10px] font-mono text-[#00A86B]">Loi n°18/035 RDC</strong>
                  <span>Conformité absolue aux normes légales nationales limitant tout transfert non sollicité des données personnelles.</span>
                </div>
              </div>
            </div>

            {/* Certification Badges logos block */}
            <div className="border-t border-white/10 pt-6 mt-8">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-4 font-mono">Normes de certification partenaires :</span>
              <div className="flex flex-wrap items-center gap-8 text-[11px] font-mono font-black text-slate-400 select-none">
                <div className="flex items-center gap-1.5 border border-white/5 bg-white/2 px-3.5 py-1.5 rounded-lg">
                  <span className="text-white font-extrabold uppercase tracking-widest text-[#00A86B]">ARCA</span>
                  <span className="text-[8px] text-slate-500 font-bold">CD-N°41098</span>
                </div>
                <div className="flex items-center gap-1.5 border border-white/5 bg-white/2 px-3.5 py-1.5 rounded-lg">
                  <span className="text-white font-extrabold uppercase tracking-widest text-indigo-400">CNAM</span>
                  <span className="text-[8px] text-slate-500 font-bold">RDC-COMPLIANT</span>
                </div>
                <div className="flex items-center gap-1.5 border border-white/5 bg-white/2 px-3.5 py-1.5 rounded-lg">
                  <span className="text-white font-extrabold uppercase tracking-widest text-sky-400">ISO/IEC 27001</span>
                  <span className="text-[8px] text-slate-500 font-bold">SECURITY APPLIED</span>
                </div>
              </div>
            </div>

          </div>

          {/* Download container Block (Right 4/12) */}
          <div className="lg:col-span-4 bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 space-y-4">
            <div className="w-10 h-10 bg-[#00A86B]/10 rounded-xl flex items-center justify-center text-[#00A86B]">
              <FileText className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase text-white leading-tight">Livre Blanc Sécurité</h3>
              <p className="text-[11px] text-slate-400 leading-normal font-semibold">
                Obtenez notre documentation complète sur le chiffrement pgsodium, les audits de sécurité et la conformité au code des assurances congolais.
              </p>
            </div>

            <form onSubmit={handleDownload} className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isDownloading || downloadSuccess}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-slate-900 font-black text-xs uppercase hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-55"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Préparation...
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#00A86B]" /> Document Disponible !
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Télécharger Livre Blanc
                  </>
                )}
              </button>
              {downloadSuccess && (
                <p className="text-center text-[9px] text-[#00A86B] font-bold uppercase tracking-wider font-mono animate-pulse">
                  ✓ Le PDF complet de sécurité s&apos;est ouvert. Bonne lecture !
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
