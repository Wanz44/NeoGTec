'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // fallback to manual safeParse if needed, but let's build it highly resilient
import { leadSchema, type LeadInput } from '../../lib/validators/lead';
import { 
  Building2, 
  Users, 
  Layers, 
  CheckSquare, 
  Contact, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';

export default function TunnelSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Configure react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<LeadInput>({
    defaultValues: {
      raison_sociale: '',
      nb_employes: '',
      assureur_actuel: '',
      besoins: [],
      nom: '',
      email_pro: '',
      phone: '',
      message: '',
      website_url_field: ''
    }
  });

  const selectedBesoins = watch('besoins') || [];

  // Handle checking/unchecking checkboxes
  const handleBesoinToggle = (besoinName: string) => {
    const fresh = [...selectedBesoins];
    const idx = fresh.indexOf(besoinName);
    if (idx > -1) {
      fresh.splice(idx, 1);
    } else {
      fresh.push(besoinName);
    }
    setValue('besoins', fresh);
    trigger('besoins');
  };

  // Navigating through steps with strict step-by-step trigger fields validation
  const handleNextStep = async () => {
    setServerError(null);
    if (currentStep === 1) {
      const step1FieldsValid = await trigger(['raison_sociale', 'nb_employes', 'assureur_actuel']);
      if (step1FieldsValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const step2FieldsValid = await trigger('besoins');
      if (step2FieldsValid) {
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Handle Form Submission
  const processLeadSubmission = async (data: LeadInput) => {
    setIsSubmittingForm(true);
    setServerError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Une erreur est survenue lors du traitement réglementaire.");
      }

      setSubmissionCompleted(true);
    } catch (err: any) {
      console.error("🔥 Error posting lead:", err);
      setServerError(err.message || "Impossible d'enregistrer votre devis pour le moment.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const employeeOptions = [
    { value: '1-10', label: "1 à 10 salariés" },
    { value: '11-50', label: "11 à 50 salariés" },
    { value: '51-200', label: "51 à 200 salariés" },
    { value: '250+', label: "Plus de 250 salariés" }
  ];

  const needsOptions = [
    { value: 'PEC_AUTOMATION', label: "Validation des Bons (Prises en charge rapides)" },
    { value: 'TELECONSULT', label: "Plateforme de Téléconsultation médicale" },
    { value: 'TIERS_PAYANT_QR', label: "Système de Tiers-Payant Dématérialisé (QR Patient)" },
    { value: 'BI_REPORTING', label: "Outil de BI & Reporting pour d&apos;audits budgétaires" },
    { value: 'FRAUD_PREVENTION', label: "Rapprochement bancaire et filtres anti-fraude" },
    { value: 'APP_MOBILE_COL', label: "Accès Application Mobile pour nos salariés" }
  ];

  return (
    <section id="demande-contrat" className="bg-slate-900 border-b border-white/5 text-white py-16 md:py-24 relative overflow-hidden scroll-mt-10">
      
      {/* Decorative vectors */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#00A86B] blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00A86B] font-mono block">Simulation Devis d&apos;Affiliation Collective</span>
          <h2 className="text-3xl font-extrabold uppercase sm:text-4xl">
            Simuler Ma Souscription NeoGTec
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Configurez votre offre d&apos;assurance collective à taux de commission réduit, et recevez votre devis certifié ARCA-RDC instantanément.
          </p>
        </div>

        {/* Lead Tunnel Card container */}
        <div className="bg-white text-slate-900 rounded-[2.5rem] border border-slate-200/40 shadow-2xl p-6 sm:p-10 md:p-12 relative overflow-hidden">
          
          {submissionCompleted ? (
            <div className="text-center py-10 space-y-6">
              <div className="mx-auto w-16 h-16 bg-[#00A86B]/10 rounded-full flex items-center justify-center text-[#00A86B]">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00A86B] font-mono block">Envoi validé par NeoGTec Broker</span>
                <h3 className="text-xl font-extrabold uppercase text-slate-950">Demande de Devis Transmise</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                  Votre opportunité de couverture commerciale a été sécurisée. <strong>Un expert conseil vous contacte par e-mail et téléphone sous 24h ouvrées.</strong>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 text-left text-[11px] rounded-2xl max-w-md mx-auto font-bold space-y-1">
                <p className="text-[#00A86B] uppercase font-black text-[9.5px]">🛡️ Prochaines Étapes Réglementaires :</p>
                <p>• Génération provisoire de vos tarifs d&apos;adhésion.</p>
                <p>• Rédaction du contrat collectif conforme au code des assurances.</p>
                <p>• Intégration de vos fiches d&apos;adhésion salariés (BIA) pgsodium.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Step indicator bar */}
              <div className="flex items-center justify-between border-b pb-6 text-[10.5px] uppercase font-black font-mono">
                {/* Step 1 indicator */}
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    currentStep === 1 ? 'bg-[#00A86B] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    1
                  </span>
                  <span className={currentStep === 1 ? 'text-slate-900' : 'text-slate-400'}>Entreprise</span>
                </div>

                <div className="w-10 h-px bg-slate-200 flex-1 hidden sm:block mx-4" />

                {/* Step 2 indicator */}
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    currentStep === 2 ? 'bg-[#00A86B] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    2
                  </span>
                  <span className={currentStep === 2 ? 'text-slate-900' : 'text-slate-400'}>Besoins</span>
                </div>

                <div className="w-10 h-px bg-slate-200 flex-1 hidden sm:block mx-4" />

                {/* Step 3 indicator */}
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    currentStep === 3 ? 'bg-[#00A86B] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    3
                  </span>
                  <span className={currentStep === 3 ? 'text-slate-900' : 'text-slate-400'}>Contact</span>
                </div>
              </div>

              {/* Server errors badge */}
              {serverError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex gap-2.5 items-start">
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-650 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Interactive Form content */}
              <form onSubmit={handleSubmit(processLeadSubmission)} className="space-y-6 text-left">
                
                {/* Honeypot anti-spam bot field */}
                <div className="hidden">
                  <input
                    type="text"
                    {...register('website_url_field')}
                    placeholder="Laissez ce champ vide"
                  />
                </div>

                {/* STEP 1: Entreprise */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-1.5 font-mono">
                        <Building2 className="w-4.5 h-4.5 text-[#00A86B]" /> Raison Sociale de l&apos;Établissement
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold mb-2 uppercase">Identité d&apos;enregistrement légale RFC / RCCM</p>
                      <input
                        type="text"
                        {...register('raison_sociale')}
                        placeholder="Ex: ACME CONGO SARL"
                        className="w-full h-11 px-4 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-[#00A86B]/10 focus:border-[#00A86B]"
                      />
                      {errors.raison_sociale && (
                        <span className="text-[10px] text-rose-600 font-bold block">{errors.raison_sociale.message}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5 font-mono">
                          <Users className="w-4.5 h-4.5 text-[#00A86B]" /> Effectif de Collaborateurs
                        </h4>
                        <p className="text-[9px] text-slate-400 font-bold mb-2 uppercase">Volume total de salariés en RDC</p>
                        <select
                          {...register('nb_employes')}
                          className="w-full h-11 px-3 border border-slate-300 bg-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-[#00A86B]/10"
                        >
                          <option value="">Sélectionnez l&apos;effectif</option>
                          {employeeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {errors.nb_employes && (
                          <span className="text-[10px] text-rose-600 font-bold block">{errors.nb_employes.message}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5 font-mono">
                          <Layers className="w-4.5 h-4.5 text-[#00A86B]" /> Assureur / Courtier Actuel
                        </h4>
                        <p className="text-[9px] text-slate-400 font-bold mb-2 uppercase">Spécifiez l&apos;opérateur actuel de prise en charge</p>
                        <input
                          type="text"
                          {...register('assureur_actuel')}
                          placeholder="Ex: AXA, Sunu, ou Aucun"
                          className="w-full h-11 px-4 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-[#00A86B]/10"
                        />
                        {errors.assureur_actuel && (
                          <span className="text-[10px] text-rose-600 font-bold block">{errors.assureur_actuel.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Besoins */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-1.5 font-mono">
                        <CheckSquare className="w-4.5 h-4.5 text-[#00A86B]" /> Modules SaaS Prioritaires
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold mb-4 uppercase">Cochez les applications requises pour l&apos;organisation</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {needsOptions.map((opt) => {
                        const isChecked = selectedBesoins.includes(opt.value);
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => handleBesoinToggle(opt.value)}
                            className={`p-4 border rounded-2xl text-left transition-all relative flex flex-col justify-between font-semibold text-xs min-h-24 ${
                              isChecked 
                                ? 'border-[#00A86B] bg-[#00A86B]/5 text-slate-950' 
                                : 'border-slate-200 hover:border-slate-350 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span>{opt.label}</span>
                            <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider block mt-2 text-slate-400">
                              {isChecked ? '✓ Sélectionné' : 'cliquer pour cocher'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.besoins && (
                      <span className="text-[10px] text-rose-600 font-bold block">{errors.besoins.message}</span>
                    )}
                  </div>
                )}

                {/* STEP 3: Contact */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-1.5 font-mono">
                        <Contact className="w-4.5 h-4.5 text-[#00A86B]" /> Coordonnées du Signataire Mandataire
                      </h3>
                      <p className="text-[10.5px] text-slate-400 font-bold mb-4 uppercase">Informations de vérification anti-spam B2B</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase font-bold text-slate-450 block font-mono">Nom complet du demandeur</label>
                        <input
                          type="text"
                          {...register('nom')}
                          placeholder="Ex: Paul MUKENDI"
                          className="w-full h-11 px-4 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none"
                        />
                        {errors.nom && (
                          <span className="text-[10px] text-rose-600 font-bold block">{errors.nom.message}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-bold text-slate-450 block font-mono">E-mail de contact professionnel (Pas de Gmail)</label>
                          <input
                            type="email"
                            {...register('email_pro')}
                            placeholder="Ex: p.mukendi@acme-congo.cd"
                            className="w-full h-11 px-4 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none"
                          />
                          {errors.email_pro && (
                            <span className="text-[10px] text-rose-600 font-bold block">{errors.email_pro.message}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-bold text-slate-450 block font-mono">Téléphone (RDC format national ou +243)</label>
                          <input
                            type="text"
                            {...register('phone')}
                            placeholder="Ex: +243 812 345 678"
                            className="w-full h-11 px-4 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none font-mono"
                          />
                          {errors.phone && (
                            <span className="text-[10px] text-rose-600 font-bold block">{errors.phone.message}</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase font-bold text-slate-450 block font-mono">Message optionnel à l&apos;expert d&apos;assistance</label>
                        <textarea
                          rows={2}
                          {...register('message')}
                          placeholder="Détaillez vos besoins d&apos;interconnectabilité hospitalière ou délais visés..."
                          className="w-full p-4 border border-slate-300 bg-slate-50 rounded-2xl text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation actions bar */}
                <div className="flex items-center justify-between pt-6 border-t mt-8">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex h-11 items-center justify-center gap-1 px-4 rounded-xl border border-slate-200 bg-white text-xs font-black uppercase text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Précédent
                    </button>
                  ) : <div />}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex h-11 items-center justify-center gap-1 px-5 rounded-xl bg-[#00A86B] hover:bg-[#008d59] text-xs font-black uppercase text-white shadow-md cursor-pointer"
                    >
                      Suivant Étape <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="inline-flex h-11 items-center justify-center gap-1.5 px-6 rounded-xl bg-[#00A86B] hover:bg-[#008d59] text-xs font-black uppercase text-white shadow-lg shadow-[#00A86B]/20 cursor-pointer disabled:opacity-55"
                    >
                      {isSubmittingForm ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Transmission...
                        </>
                      ) : (
                        <>
                          Soumettre ma demande de contrat
                        </>
                      )}
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
