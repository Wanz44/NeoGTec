import React from 'react';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm space-y-8 text-left">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-extrabold uppercase text-slate-900 tracking-tight">Politique de confidentialité NeoGTec</h1>
          <p className="text-xs text-[#00A86B] font-mono font-bold uppercase mt-1">Conformité Loi n°18/035 & Régulation ARCA-RDC</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed font-semibold">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Hébergement des données</h2>
            <p className="text-slate-650">
              Toutes les données de santé de nos assurés et entreprises partenaires sont stockées souverainement au sein de notre infrastructure physique à Kinshasa, Gombe (Serveur principal IP: <code className="font-mono bg-slate-100 text-[#00A86B] px-1.5 py-0.5 rounded">41.243.12.8</code>). Ce centre d&apos;hébergement est certifié aux standards de sécurité ISO 27001.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. DPO Contact</h2>
            <p className="text-slate-650">
              Notre délégué à la protection des données (DPO) veille à la parfaite application de la régulation de confidentialité. Vous pouvez le contacter à l&apos;adresse email dédiée : <a href="mailto:dpo@neogtec.cd" className="text-[#00A86B] underline font-bold">dpo@neogtec.cd</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. Vos droits Loi 18/035</h2>
            <p className="text-slate-650">
              Conformément aux dispositions de la Loi n°18/035, chaque collaborateur d&apos;entreprise rattaché dispose d&apos;un droit d&apos;accès, de rectification et d&apos;opposition. Vous pouvez soumettre une demande de suppression définitive de vos logs de consommation et documents médicaux via l&apos;onglet <strong className="text-slate-900">Profil &gt; Confidentialité</strong> de votre espace client.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Gestion des cookies</h2>
            <p className="text-slate-650">
              NeoGTec n&apos;utilise que des traceurs d&apos;authentification et de routage technique strictement indispensables au bon fonctionnement de l&apos;espace de courtage B2B de santé. Aucun traceur publicitaire ou commercial externe n&apos;est toléré.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">5. ARCA-RDC</h2>
            <p className="text-slate-650">
              En qualité de courtier d&apos;assurance technologique agréé sous la licence nationale officielle n°ARCA/2025/0127, NeoGTec transmet des audits trimestriels sécurisés de Tiers-Payant directement à l&apos;autorité de tutelle ARCA-RDC dans un canal de cryptage de bout en bout.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t font-sans">
          <a href="/">
            <button className="h-11 px-5 bg-[#00A86B] hover:bg-[#007D4C] text-white text-xs font-black uppercase rounded-[6px] transition-colors cursor-pointer select-none">
              Retourner à l&apos;accueil
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
