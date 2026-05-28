import React, { useState } from 'react';
import { 
  History as HistoryIcon, ShieldCheck, FileText, Download, TrendingUp, 
  Wallet, User, Activity, AlertCircle, Sparkles, 
  ArrowRight, Globe, Lock, Info, X, Save, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

export const SelfCarePortal: React.FC = () => {
  const { currentUser, updateUserProfile, setActiveModule } = useApp();
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Configuration Form State initialized with currentUser details
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [mfaEnabled, setMfaEnabled] = useState(currentUser.mfaEnabled);
  const [biometricsEnabled, setBiometricsEnabled] = useState(currentUser.biometricsEnabled);
  const [configSuccess, setConfigSuccess] = useState(false);

  const handleOpenConfig = () => {
    // Sync with maybe updated state on open
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setAddress(currentUser.address);
    setMfaEnabled(currentUser.mfaEnabled);
    setBiometricsEnabled(currentUser.biometricsEnabled);
    setConfigSuccess(false);
    setShowConfigModal(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      address,
      mfaEnabled,
      biometricsEnabled,
      biometricsLinked: biometricsEnabled ? true : currentUser.biometricsLinked
    });
    
    setConfigSuccess(true);
    setTimeout(() => {
      setConfigSuccess(false);
      setShowConfigModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative p-8 bg-green-950 rounded-[40px] overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-3xl border-4 border-white/10 overflow-hidden ring-8 ring-white/5 bg-slate-800 flex items-center justify-center text-white">
               {currentUser.photo ? (
                 <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
               ) : (
                 <User className="w-12 h-12 text-slate-350" />
               )}
            </div>
            <div className="flex-1 space-y-2">
               <h1 className="text-3xl font-black text-white italic tracking-tighter">Bienvenue, {currentUser.name}.</h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                     <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentUser.role}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full backdrop-blur-md border border-green-500/20">
                     <Activity className="w-3.5 h-3.5 text-green-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Statut : {currentUser.status}</span>
                  </div>
                  {currentUser.mfaEnabled && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full backdrop-blur-md border border-emerald-500/10">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-bold text-white uppercase tracking-widest">MFA Activé</span>
                    </div>
                  )}
               </div>
            </div>
            <button 
              onClick={() => setActiveModule('users-card')}
              className="px-8 py-3 bg-white text-green-950 hover:bg-slate-50 active:scale-95 text-xs font-black uppercase tracking-widest shadow-xl rounded-2xl transition-all cursor-pointer"
            >
               Voir Ma Carte Virtuelle
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* My Rights & Limits */}
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="p-2 bg-green-50 rounded-xl">
                        <Wallet className="w-5 h-5 text-green-600" />
                     </div>
                     <span className="text-[10px] font-black text-slate-300 uppercase italic">Formule ACTIVE : {currentUser.contractName}</span>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Consommation du Plafond</p>
                     <div className="flex justify-between items-end mb-2">
                        <h4 className="text-2xl font-black text-slate-900">1,450 <span className="text-xs">$</span></h4>
                        <span className="text-sm font-black text-slate-300">/ {currentUser.role === 'SUPER_ADMIN' ? '150,000' : '15,000'} $</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: currentUser.role === 'SUPER_ADMIN' ? '1.5%' : '10%' }} />
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4 text-center">
                  <div className="flex items-center justify-center p-3 bg-amber-50 rounded-2xl w-fit mx-auto">
                     <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 italic">Offres Exclusives</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vous avez 2 bilans cliniques offerts</p>
                  </div>
                  <button className="w-full py-2.5 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                     En profiter <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { label: 'Attestations', icon: FileText, color: 'green' },
                  { label: 'Remboursements', icon: HistoryIcon, color: 'emerald' },
                  { label: 'Urgences', icon: AlertCircle, color: 'rose' },
                  { label: 'Téléchargements', icon: Download, color: 'green' },
               ].map((item, i) => (
                  <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-50 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
                     <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", `bg-${item.color}-50`)}>
                        <item.icon className={cn("w-6 h-6", `text-${item.color}-600`)} />
                     </div>
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</span>
                  </button>
               ))}
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h4 className="text-sm font-black text-slate-900 uppercase italic">Historique de vos soins</h4>
                  <button className="text-[10px] font-black text-green-600 uppercase italic underline cursor-pointer">Tout voir</button>
               </div>
               <div className="divide-y divide-slate-50">
                  {[
                     { desc: 'Consultation Clinique HJ', date: 'Hier, 14:20', amount: '-45.00 $', type: 'Health' },
                     { desc: 'Facture Pharm. Gombe', date: '15 Mai 2026', amount: '-22.50 $', type: 'Med' },
                     { desc: 'Remboursement Sinistre Certifié', date: '10 Mai 2026', amount: '+340.00 $', type: 'Refund' },
                  ].map((act, i) => (
                     <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-slate-400">
                              {act.type[0]}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900">{act.desc}</p>
                              <p className="text-[10px] font-bold text-slate-400">{act.date}</p>
                           </div>
                        </div>
                        <span className={cn("text-sm font-black", act.amount.startsWith('+') ? "text-emerald-500" : "text-slate-900")}>
                           {act.amount}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar: Digital Services */}
         <div className="space-y-6">
            <div className="p-6 bg-green-650 rounded-[2.5rem] text-white shadow-xl shadow-green-600/20 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10 space-y-4">
                  <div className="p-3 bg-white/10 rounded-2xl w-fit border border-white/20">
                     <Lock className="w-6 h-6 text-green-200" />
                  </div>
                  <div>
                     <h4 className="text-xl font-black italic tracking-tighter">Accès Sécurisé &amp; Profil</h4>
                     <p className="text-xs font-bold text-white/70 leading-relaxed mt-2 italic">Configurez vos coordonnées, gérez la biométrie faciale et sécurisez vos informations.</p>
                  </div>
                  <button 
                    onClick={handleOpenConfig}
                    className="w-full py-3 bg-white text-green-700 hover:bg-slate-55 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg cursor-pointer active:scale-95"
                  >
                     Configurer mon profil
                  </button>
               </div>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6 text-center">
               <div className="w-20 h-20 bg-white shadow-xl rounded-2xl mx-auto flex items-center justify-center">
                  <Globe className="w-10 h-10 text-slate-900 animate-spin" style={{ animationDuration: '20s' }} />
               </div>
               <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">Assistance 24/7</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Conseillers AfreakCare à votre écoute</p>
               </div>
               <button className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-900 bg-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-slate-350 transition-all cursor-pointer">
                  Ouvrir un Chat d'assistance
               </button>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center gap-4">
               <Info className="w-10 h-10 text-green-600/25 shrink-0" />
               <p className="text-[9px] font-bold text-slate-400 leading-relaxed italic uppercase">
                  Vos informations d'assuré sont protégées par le secret médical strict et conformes au RGPD / HDS de RDC.
               </p>
            </div>
         </div>
      </div>

      {/* --- CONFIGURATION MODAL --- */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[500] flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveConfig}
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-slate-800 shadow-2xl relative animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-black uppercase text-slate-800 italic">Configuration du Profil</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors font-bold font-mono text-xl p-1 outline-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {configSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-950">Profil mis à jour !</h4>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Synchronisation globale avec les serveurs d'accréditation...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nom Complet</label>
                    <input 
                      type="text" 
                      required
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-green-600" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Adresse E-mail</label>
                    <input 
                      type="email" 
                      required
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-green-600" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Téléphone</label>
                    <input 
                      type="text" 
                      required
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-green-600" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Adresse Physique</label>
                    <input 
                      type="text" 
                      required
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-green-600" 
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Sécurité d'identité digitale</span>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <p className="text-xs font-black text-slate-800">Validation en deux étapes (MFA)</p>
                      <p className="text-[9px] text-slate-400 font-bold leading-normal uppercase">SMS ou clé de sécurité Yubikey sur connexion</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={mfaEnabled} 
                        onChange={(e) => setMfaEnabled(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <p className="text-xs font-black text-slate-800">Biométrie Faciale / Iris active</p>
                      <p className="text-[9px] text-slate-400 font-bold leading-normal uppercase">Autoriser l'authentification forte pour dossiers de santé</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={biometricsEnabled} 
                        onChange={(e) => setBiometricsEnabled(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 hover:bg-green-750 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-green-600/10 flex items-center justify-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Enregistrer le profil
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
