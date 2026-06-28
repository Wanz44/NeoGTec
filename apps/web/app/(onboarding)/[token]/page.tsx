'use client';

/**
 * 🛰️ Fichier : /apps/web/app/(onboarding)/[token]/page.tsx
 * 🎯 Objectif : Page d'Affiliation d'employé individuel via Jeton d'invitation mail
 * CONFORMITÉ : ARCA-RDC, Securisation de questionnaire chiffré en coffre-fort
 */

import React from 'react';
import { AdhesionForm } from '../../../components/AdhesionForm';
import { ShieldAlert, Sparkles, Building, Lock } from 'lucide-react';

interface OnboardingPageProps {
  params: {
    token: string;
  };
}

export default function OnboardingTokenPage({ params }: OnboardingPageProps) {
  // En Next.js 14, params est injecté directement
  const decodedToken = params?.token || 'SBOX-TOKEN-8812';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-between py-10 px-4">
      
      {/* Decorative top header */}
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-lg gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[9px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Portail d&apos;Affiliation Salariés
            </div>
            <h1 className="text-xl font-black uppercase mt-1">Onboarding Complémentaire Maladie</h1>
            <p className="text-[10px] text-slate-300 mt-1 font-semibold leading-normal">
              Veuillez compléter votre dossier de souscription obligatoire réglementé par l&apos;ARCA en République Démocratique du Congo.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs font-semibold shrink-0">
            <Building className="w-4 h-4 text-indigo-400" />
            <div className="text-left font-mono leading-none">
              <span className="text-[9px] text-slate-400 block font-normal uppercase">Adhérent de Groupe</span>
              <span className="text-white text-[10px] font-bold">ACME Corp RDC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto py-8">
        {/* Render the compliant multi-step paper-to-digital form */}
        <AdhesionForm token={decodedToken} />
      </div>

      {/* Footer copyright compliance details */}
      <footer className="w-full max-w-4xl mx-auto border-t border-slate-200 pt-6 text-[10px] text-slate-400 font-semibold flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-emerald-550 shrink-0" />
          <span>NeoGTec SaaS • Chiffrement Hybride pgsodium Vault & Autoguidage d&apos;Audit</span>
        </div>
        <div className="text-left md:text-right">
          <span>Licence ARCA Autorisation Régulation N° ARCA/RDC/88-04 • Certifié Conforme V2</span>
        </div>
      </footer>

    </div>
  );
}
