import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "NeoGTec | SaaS Assurance Santé Agréé ARCA-RDC",
  description: "Divisez par 3 vos délais de prise en charge d'assurance santé en RDC. Plateforme de tiers-payant agréée ARCA, conforme Loi n°18/035 et chiffrée AES-256.",
  keywords: ["NeoGTec", "Assurance RDC", "ARCA RDC", "SaaS Santé", "Tiers-Payant Kinshasa", "Prise en charge médicale RDC"],
  authors: [{ name: "NeoGTec SARL" }],
  openGraph: {
    title: "NeoGTec | SaaS Assurance Sante Agréé ARCA-RDC",
    description: "Divisez par 3 vos délais de prise en charge d'assurance santé en RDC. Plateforme de tiers-payant agréée ARCA.",
    url: "https://neogtec.com",
    siteName: "NeoGTec",
    locale: "fr_CD",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NeoGTec SARL",
    "alternateName": "NeoGTec",
    "url": "https://neogtec.com",
    "logo": "https://neogtec.com/logo.png",
    "description": "Plateforme SaaS d'interconnectabilité d'assurances santé collectives en RDC, agréée par l'ARCA RDC.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Immeuble BCC, 4ème Étage, Avenue du Port, Gombe",
      "addressLocality": "Kinshasa",
      "addressCountry": "CD"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@neogtec.com",
      "contactType": "customer support"
    },
    "knowsAbout": ["Health Insurance", "ARCA RDC Regulation", "SaaS Tiers-Payant"]
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans antialiased selection:bg-[#00A86B]/20 selection:text-[#00A86B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </div>
  );
}
