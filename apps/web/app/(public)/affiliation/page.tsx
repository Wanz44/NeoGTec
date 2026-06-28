'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  Contact, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  ShieldAlert,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Header } from '../../../components/Header';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Footer } from '../../../components/Footer';

export default function AffiliationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      raison_sociale: '',
      nb_employes: '',
      assureur_actuel: '',
      besoins: [] as string[],
      nom: '',
      email_pro: '',
      phone: '',
      message: '',
      website_url_field: ''
    }
  });

  const selectedBesoins = watch('besoins') || [];

  const handleBesoinToggle = (besoinName: string) => {
    const current = [...selectedBesoins];
    const idx = current.indexOf(besoinName);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(besoinName);
    }
    setValue('besoins', current);
    trigger('besoins');
  };

  const handleNextStep = async () => {
    setServerError(null);
    if (currentStep === 1) {
      const step1Valid = await trigger(['raison_sociale', 'nb_employes', 'assureur_actuel']);
      if (step1Valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const step2Valid = await trigger(['nom', 'email_pro', 'phone']);
      if (step2Valid) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: any) => {
    setServerError(null);
    if (data.besoins.length === 0) {
      setServerError("Veuillez sélectionner au moins un besoin prioritaire à l'étape 3.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Une erreur s'est produite lors de la soumission.");
      }
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.message || "Impossible d'envoyer votre demande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <Header />
      <Breadcrumbs currentPageName="Affilier votre entreprise" />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-xl mx-auto space-y-4 mb-10"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 text-xs font-black text-[#00A86B] tracking-wider uppercase font-mono">
              ⚡ Démarche Gratuite
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
              Affilier votre entreprise en 5 min
            </h1>
            <p className="text-slate-600 text-sm font-semibold">
              Remplissez ce formulaire d&apos;évaluation. Paul de NeoGTec vous rappelle sous 24h pour finaliser.
            </p>
          </motion.div>

          <div className="bg-white border border-slate-200 rounded-[8px] p-6 md:p-10 shadow-sm relative">
            
            {/* Stepper visual indicator */}
            {!isSuccess && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8 text-[11px] font-mono font-black select-none">
                <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-[#00A86B]' : 'text-slate-400'}`}>
                  <Building2 className="h-4 w-4" />
                  <span>1. Entreprise</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-4" />
                <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-[#00A86B]' : 'text-slate-400'}`}>
                  <Contact className="h-4 w-4" />
                  <span>2. Contact RH</span>
                </div>
                <div className="h-px bg-slate-200 flex-1 mx-4" />
                <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-[#00A86B]' : 'text-slate-400'}`}>
                  <CheckSquare className="h-4 w-4" />
                  <span>3. Vos Besoins</span>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] text-red-800 text-xs font-bold flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Success panel */}
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-[#00A86B] rounded-full flex items-center justify-center mx-auto border border-emerald-100 pb-0.5">
                  <CheckCircle2 className="h-10 w-10 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold uppercase text-slate-900">
                    Demande de contrat enregistrée !
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 max-w-md mx-auto">
                    Merci. Notre conseiller <strong className="text-[#00A86B]">Paul</strong> a bien reçu votre demande d&apos;affiliation. <strong>Paul vous appelle sous 24h.</strong>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-[8px] p-4 max-w-sm mx-auto text-xs font-mono font-bold text-slate-600 border border-slate-100">
                  ⚡ Statut de signature : Prêt pour DocuSign
                </div>
                <div>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex h-10 items-center justify-center rounded-[8px] border border-slate-200 bg-white px-5 text-xs font-black uppercase text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Retour à l&apos;accueil
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Honeypot field */}
                <input type="text" {...register('website_url_field')} className="hidden" />

                {/* Step 1 : Company details */}
                {currentStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                        Raison Sociale de l&apos;Entreprise (RCCM RDC / National)
                      </label>
                      <input 
                        type="text" 
                        {...register('raison_sociale', { 
                          required: "La raison sociale est requise." 
                        })}
                        placeholder="Ex: ACME AFRICA SARL" 
                        className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:border-[#00A86B]"
                      />
                      {errors.raison_sociale && (
                        <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.raison_sociale.message}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                          Nombre d&apos;employés prévus
                        </label>
                        <select 
                          {...register('nb_employes', { 
                            required: "L'effectif est obligatoire." 
                          })}
                          className="w-full h-11 px-3 border border-slate-200 rounded-[8px] text-xs font-bold bg-white focus:outline-none focus:border-[#00A86B]"
                        >
                          <option value="">Sélectionnez un volume</option>
                          <option value="1-10">1 à 10 salariés</option>
                          <option value="11-50">11 à 50 salariés</option>
                          <option value="51-200">51 à 200 salariés</option>
                          <option value="250+">Plus de 200 salariés</option>
                        </select>
                        {errors.nb_employes && (
                          <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.nb_employes.message}</span>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                          Assureur Santé Actuel (Si existant)
                        </label>
                        <input 
                          type="text" 
                          {...register('assureur_actuel', { 
                            required: "Veuillez spécifier votre couverture actuelle ou 'Aucune'." 
                          })}
                          placeholder="Ex: Sunu, AXA ou Aucune" 
                          className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:border-[#00A86B]"
                        />
                        {errors.assureur_actuel && (
                          <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.assureur_actuel.message}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 : HR Contact info */}
                {currentStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                        Nom complet du signataire mandataire
                      </label>
                      <input 
                        type="text" 
                        {...register('nom', { 
                          required: "Le nom du contact est requis." 
                        })}
                        placeholder="Ex: Paul MUKENDI" 
                        className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:border-[#00A86B]"
                      />
                      {errors.nom && (
                        <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.nom.message}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                          E-mail Professionnel (Pas de Gmail gratuit)
                        </label>
                        <input 
                          type="email" 
                          {...register('email_pro', { 
                            required: "E-mail professionnel obligatoire." 
                          })}
                          placeholder="Ex: p.mukendi@acme.cd" 
                          className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:border-[#00A86B]"
                        />
                        {errors.email_pro && (
                          <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.email_pro.message}</span>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                          Téléphone RDC (+243...) ou 0...
                        </label>
                        <input 
                          type="text" 
                          {...register('phone', { 
                            required: "Téléphone de contact obligatoire.",
                            pattern: {
                              value: /^(\+243|0)[89][0-9]{8}$/,
                              message: "Numéro de téléphone RDC incorrect (Ex: +243 812 345 678)"
                            }
                          })}
                          placeholder="Ex: +243 812 345 678 ou 0812345678" 
                          className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:border-[#00A86B] font-mono"
                        />
                        {errors.phone && (
                          <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.phone.message}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 : Core Needs Selection */}
                {currentStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <label className="text-[11px] font-mono font-black uppercase text-slate-500 block">
                      Sélectionnez vos besoins prioritaires (Cocher au moins un)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { val: 'PEC', lab: "Validation de Prises en Charge rapides (moins de 48h)" },
                        { val: 'QR', lab: "Système de Tiers-Payant Dématérialisé (QR Patient)" },
                        { val: 'BI', lab: "Analyse des Fraudes & Audit de dépenses" },
                        { val: 'MOBILE', lab: "Application Mobiles pour nos Affiliés" }
                      ].map((m) => {
                        const isSel = selectedBesoins.includes(m.val);
                        return (
                          <button
                            type="button"
                            key={m.val}
                            onClick={() => handleBesoinToggle(m.val)}
                            className={`p-4 border rounded-[8px] text-left hover:bg-slate-50/50 transition-colors cursor-pointer text-xs flex flex-col justify-between min-h-[5.5rem] font-bold ${
                              isSel 
                                ? 'border-[#00A86B] bg-[#F0FDF4] text-slate-900' 
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{m.lab}</span>
                            <span className="text-[9px] font-mono text-slate-400 block mt-2">
                              {isSel ? '✓ Sélectionné' : 'Cliquer pour cocher'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">
                        Message ou Observations complémentaires (Optionnel)
                      </label>
                      <textarea 
                        rows={2} 
                        {...register('message')}
                        placeholder="Racontez-nous brièvement votre situation..." 
                        className="w-full p-3 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:border-[#00A86B]"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Navigation actions footer */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8 select-none">
                  {currentStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={handlePrevStep}
                      className="inline-flex h-10 items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Précédent</span>
                    </button>
                  ) : <div />}

                  {currentStep < 3 ? (
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      className="inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-[#00A86B] px-5 text-xs font-black uppercase text-white hover:scale-[1.01] hover:shadow-md cursor-pointer ml-auto"
                    >
                      <span>Suivant</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#00A86B] px-6 text-xs font-black uppercase text-white hover:scale-[1.01] hover:shadow-md cursor-pointer disabled:opacity-50 min-w-32 ml-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Envoi...</span>
                        </>
                      ) : (
                        <span>Envoyer ma Demande</span>
                      )}
                    </button>
                  )}
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
