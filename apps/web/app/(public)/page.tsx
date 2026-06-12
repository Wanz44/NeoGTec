import React from 'react';
import HeroSection from '../../components/sections/Hero';
import ProblemsSection from '../../components/sections/Problems';
import SolutionsSection from '../../components/sections/Solutions';
import ComplianceSection from '../../components/sections/Compliance';
import ModulesSection from '../../components/sections/Modules';
import SocialProofSection from '../../components/sections/SocialProof';
import TunnelSection from '../../components/sections/Tunnel';
import FAQSection from '../../components/sections/FAQ';

/**
 * 🌍 Landing Page Publique NeoGTec (B2B RDC)
 * 🎯 Conforme ARCA-RDC & Code des Assurances Congolais
 */
export default function PublicLandingPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* Section 1 : Hero Header */}
      <HeroSection />

      {/* Section 2 : Problématiques du Régime */}
      <ProblemsSection />

      {/* Section 3 : Solutions par Profil d'Acteur */}
      <SolutionsSection />

      {/* Section 4 : Déclarations de Conformité ARCA et RGPD Loi n°18/035 */}
      <ComplianceSection />

      {/* Section 5 : Catalogue de Modules SaaS */}
      <ModulesSection />

      {/* Section 6 : Éléments de Preuve Sociale (Partenaires et Quote RH) */}
      <SocialProofSection />

      {/* Section 7 : Tunnel Étape-par-Étape d'acquisition B2B */}
      <TunnelSection />

      {/* Section 8 : Foire Aux Questions & Mentions Légales Complexe */}
      <FAQSection />
    </main>
  );
}
