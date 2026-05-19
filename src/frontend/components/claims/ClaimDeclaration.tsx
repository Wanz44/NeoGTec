/**
 * 📄 Fichier : /src/frontend/components/claims/ClaimDeclaration.tsx
 * 🎯 Objectif : Formulaire digital de déclaration de sinistre avec upload.
 */
import React, { useState } from 'react';
import { 
  FilePlus, Camera, Upload, ShieldCheck, 
  CheckCircle2, X, Info, Calendar, 
  MapPin, Stethoscope, AlertCircle, FileText,
  RefreshCcw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ClaimDeclaration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const addMockPhoto = () => setPhotos([...photos, 'captured-img.jpg']);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
       {/* Minimalist Stepper */}
       <div className="flex items-center justify-center gap-12 px-8">
          {[1, 2, 3].map((s) => (
             <div key={s} className="flex flex-col items-center gap-3">
                <div className={cn(
                   "w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-500",
                   step === s ? "bg-green-600 text-white shadow-xl shadow-green-600/30 scale-110" :
                   step > s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-300"
                )}>
                   {step > s ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-black text-sm">{s}</span>}
                </div>
                <span className={cn(
                   "text-[8px] font-black uppercase tracking-[0.2em] italic",
                   step >= s ? "text-slate-900" : "text-slate-300"
                )}>
                   {s === 1 ? 'Incident' : s === 2 ? 'Preuves' : 'Validation'}
                </span>
             </div>
          ))}
       </div>

       <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-bl-full -z-10" />
          
          {step === 1 && (
             <div className="p-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-indigo-50 rounded-[28px] border border-indigo-100 shadow-sm">
                      <Stethoscope className="w-8 h-8 text-indigo-600" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">Détails du Sinistre</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Informations médicales de base</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Nature de l'acte</label>
                      <select className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-6 text-sm font-black outline-none focus:ring-2 focus:ring-green-600/5 transition-all">
                         <option>Consultation Spécialisée</option>
                         <option>Hospitalisation</option>
                         <option>Pharmacie / Pharmacopée</option>
                         <option>Chirurgie / Intervention</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Établissement</label>
                      <div className="relative">
                         <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                         <input type="text" placeholder="Rechercher l'hôpital..." className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-black outline-none focus:ring-2 focus:ring-green-600/5 transition-all" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Date de l'Incident</label>
                      <div className="relative">
                         <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                         <input type="date" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 text-sm font-black outline-none focus:ring-2 focus:ring-green-600/5 transition-all" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Montant Estimé (USD)</label>
                      <input type="number" placeholder="0.00" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-6 text-xl font-black outline-none focus:ring-2 focus:ring-green-600/5 text-right transition-all" />
                   </div>
                </div>

                <div className="pt-8">
                   <button onClick={nextStep} className="w-full h-20 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-slate-950/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Continuer : Pièces Justificatives
                   </button>
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="p-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-emerald-50 rounded-[28px] border border-emerald-100 shadow-sm">
                      <Camera className="w-8 h-8 text-emerald-600" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">Transmission des Preuves</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Factures, Ordonnances, Rapports</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <button 
                     onClick={addMockPhoto}
                     className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-slate-100 transition-all group"
                   >
                      <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                         <PlusIcon className="w-6 h-6 text-slate-300" />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ajouter</span>
                   </button>
                   {photos.map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-[2rem] border border-slate-200 relative group overflow-hidden">
                         <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                            <FileText className="w-10 h-10 text-white opacity-40" />
                         </div>
                         <button className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                         </button>
                      </div>
                   ))}
                </div>

                <div className="p-8 bg-green-600 rounded-[2.5rem] text-white flex items-start gap-6 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                   <Info className="w-6 h-6 text-green-200 shrink-0 mt-1" />
                   <p className="text-[11px] font-bold text-green-50 leading-relaxed italic relative z-10">
                      Les documents doivent être clairs et lisibles. Maximum de 10 Mo par fichier. 
                      Tous les formats courants (JPEG, PNG, PDF) sont acceptés.
                   </p>
                </div>

                <div className="flex gap-6 pt-4">
                   <button onClick={() => setStep(1)} className="flex-1 h-20 border border-slate-200 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Retour</button>
                   <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-[2] h-20 bg-green-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-2xl shadow-green-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                   >
                      {isSubmitting ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <SendIcon className="w-6 h-6" />}
                      Déclarer le Sinistre
                   </button>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="p-20 text-center space-y-10 animate-in zoom-in-95 duration-700">
                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-[24px] ring-emerald-50/50 shadow-2xl">
                   <ShieldCheck className="w-16 h-16" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-4xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">Déclaration Enregistrée !</h2>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] italic">Dossier de Sinistre #CLM-2024-00154</p>
                </div>
                <div className="max-w-md mx-auto p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-left space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut Initial</span>
                      <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-[8px] font-black uppercase italic tracking-widest shadow-lg shadow-amber-500/20">En Attente de Revue</span>
                   </div>
                   <div className="flex justify-between items-center border-t border-slate-200/50 pt-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Délai estimé</span>
                      <span className="text-xs font-black text-slate-900 italic">24 à 48 heures</span>
                   </div>
                </div>
                <div className="flex gap-6 max-w-xl mx-auto">
                   <button onClick={() => setStep(1)} className="flex-1 py-5 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Nouveau Sinistre</button>
                   <button className="flex-1 py-5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Suivre Dossier</button>
                </div>
             </div>
          )}
       </div>

       <div className="flex items-center justify-center gap-3">
          <Lock className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Transmission cryptée AES-256 SSL certifiée par l'ARCA</span>
       </div>
    </div>
  );
};

// Internal minimal icons for this file
const PlusIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SendIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
