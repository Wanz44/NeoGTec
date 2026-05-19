import React, { useState } from 'react';
import { UserPlus, Camera, Fingerprint, ShieldCheck, Upload, CheckCircle2, User, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

export const DigitalEnrollment: React.FC = () => {
  const [step, setStep] = useState(1);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [biometricsLinked, setBiometricsLinked] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between px-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all",
              step >= s ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "bg-slate-100 text-slate-400"
            )}>
              {s}
            </div>
            {s < 3 && <div className={cn("h-px w-24", step > s ? "bg-green-600" : "bg-slate-200")} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {step === 1 && (
          <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-50 rounded-2xl">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic">Informations de Base</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Étape 01 - Identité de l'assuré</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom Complet</label>
                <input type="text" placeholder="Ex: Jean Mukendi" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Numéro de Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="tel" placeholder="+243 ..." className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="email" placeholder="client@domaine.com" className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Adresse Physqiue</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" placeholder="Kinshasa, Gombe..." className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                </div>
              </div>
            </div>

            <button onClick={nextStep} className="w-full h-14 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-95 transition-all">
              Suivant: Biométrie & Photo
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-50 rounded-2xl">
                <Fingerprint className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic">Validation Biométrique</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Étape 02 - Sécurité Renforcée</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Photo Capture */}
              <div className="space-y-4">
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group overflow-hidden relative">
                  {photoCaptured ? (
                    <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center">
                       <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-slate-400 uppercase text-center px-8">Prendre une photo d'identité claire</p>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setPhotoCaptured(true)}
                  className={cn(
                    "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                    photoCaptured ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                  )}
                >
                  {photoCaptured ? "Photo Capturée" : "Activer la Caméra"}
                </button>
              </div>

              {/* Fingerprint / Biometrics */}
              <div className="space-y-4">
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group">
                  <Fingerprint className={cn("w-12 h-12 transition-all", biometricsLinked ? "text-emerald-500 animate-pulse" : "text-slate-300")} />
                  <p className="text-[10px] font-black text-slate-400 uppercase text-center px-8">Scanner biometric (Empreinte/Iris)</p>
                </div>
                <button 
                   onClick={() => setBiometricsLinked(true)}
                   className={cn(
                    "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                    biometricsLinked ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                  )}
                >
                  {biometricsLinked ? "Biométrie Couplée" : "Initier l'Appairage"}
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 h-14 border border-slate-200 rounded-2xl font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Retour</button>
              <button 
                onClick={nextStep} 
                disabled={!photoCaptured || !biometricsLinked}
                className="flex-[2] h-14 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/20 disabled:opacity-50 transition-all"
              >
                Générer le Profil
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
               <ShieldCheck className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 italic">Profil Assuré Créé !</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2 italic">Dossier #AFK-2024-00982-SECURE</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Identifiant Unique</span>
                  <span className="text-xs font-black text-slate-900">ID-67741-XA</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Statut Validation</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black uppercase">Vérifié Digitale</span>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="flex-1 py-4 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Nouvelle Inscription</button>
               <button className="flex-1 py-4 bg-green-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-950/30">Imprimer la Fiche</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
