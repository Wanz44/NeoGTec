import React, { useState } from 'react';
import { UserPlus, Camera, Fingerprint, ShieldCheck, Upload, CheckCircle2, User, Phone, Mail, MapPin, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

export const DigitalEnrollment: React.FC = () => {
  const { registerNewUser } = useApp();
  const [step, setStep] = useState(1);
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contractName, setContractName] = useState('AfreakCare Platinum Plus');

  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [biometricsLinked, setBiometricsLinked] = useState(false);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setStep(2);
  };

  const handleGenerateProfile = () => {
    if (!photoCaptured || !biometricsLinked) return;
    
    registerNewUser({
      name,
      phone,
      email,
      address,
      contractName,
      biometricsEnabled: true,
      biometricsLinked: true
    });
    setStep(3);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setContractName('AfreakCare Platinum Plus');
    setPhotoCaptured(false);
    setBiometricsLinked(false);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between px-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4 animate-in fade-in transition-all">
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
          <form onSubmit={handleNextStep1} className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-50 rounded-2xl">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic">Informations de Base &amp; Contrat</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Étape 01 - Identité &amp; Formule d'assurance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nom Complet *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Jean Mukendi" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Numéro de Téléphone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="tel" 
                    required
                    placeholder="Ex: +243 821 555 101" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email professionnel *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" 
                    required
                    placeholder="Ex: mukendi@afreakcare.cd" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Adresse Physique *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    required
                    placeholder="Kinshasa, Gombe, Blvd du 30 Juin" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20" 
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Sélection du Contrat &amp; Couverture d'Assurance</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="AfreakCare Platinum Plus">AfreakCare Platinum Plus (Plafond Annuel: $150,000)</option>
                    <option value="AfreakCare Gold Access">AfreakCare Gold Access (Plafond Annuel: $75,000)</option>
                    <option value="AfreakCare Standard Communautaire">AfreakCare Standard Communautaire (Plafond Annuel: $15,000)</option>
                    <option value="AfreakCare Corporate Elite">AfreakCare Corporate Elite (Plafond Annuel: $250,000)</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full h-14 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/20 hover:scale-[1.01] active:scale-95 transition-all">
              Suivant: Biométrie &amp; Photo
            </button>
          </form>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo Capture */}
              <div className="space-y-4">
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group overflow-hidden relative">
                  {photoCaptured ? (
                    <div className="absolute inset-0 bg-emerald-500/5 flex flex-col items-center justify-center gap-2">
                       <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                       <span className="text-xs font-bold text-emerald-600">PHOTO CAPTURÉE (.PNG)</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-slate-400 uppercase text-center px-8">Prendre une photo d'identité claire (Caméra 2K intégrée)</p>
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
                <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group overflow-hidden relative">
                  {biometricsLinked ? (
                    <div className="absolute inset-0 bg-emerald-500/5 flex flex-col items-center justify-center gap-2">
                       <Fingerprint className="w-16 h-16 text-emerald-500 animate-pulse" />
                       <span className="text-xs font-bold text-emerald-600">EMPREINTE LIÉE &amp; CRYPTÉE</span>
                    </div>
                  ) : (
                    <>
                      <Fingerprint className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-slate-400 uppercase text-center px-8">Scanner biométrique externe (Empreinte/Iris compliant FIDO2)</p>
                    </>
                  )}
                </div>
                <button 
                   onClick={() => setBiometricsLinked(true)}
                   className={cn(
                    "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                    biometricsLinked ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                  )}
                >
                  {biometricsLinked ? "Biométrie Couplée" : "Initier l'Appairage usb"}
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 h-14 border border-slate-200 rounded-2xl font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Retour</button>
              <button 
                onClick={handleGenerateProfile} 
                disabled={!photoCaptured || !biometricsLinked}
                className="flex-[2] h-14 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/20 disabled:opacity-50 transition-all hover:bg-green-700"
              >
                Générer le Profil &amp; Lier le Contrat
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
              <h2 className="text-3xl font-black text-slate-950 italic">Profil Assuré Créé avec Succès !</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2 italic">Dossier #AFK-2026-{Math.floor(10000 + Math.random() * 90000)}-SECURE</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Bénéficiaire Principal</span>
                  <span className="text-xs font-black text-slate-900">{name}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Contrat d'assurance</span>
                  <span className="text-xs font-black text-slate-900 italic text-green-700">{contractName}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Statut d'inscription</span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black uppercase">Actif dans la Liste Globale</span>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={handleReset} className="flex-1 py-4 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Nouvelle Inscription</button>
               <button onClick={handleReset} className="flex-1 py-4 bg-green-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-950/30">Fermer &amp; Suivant</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
