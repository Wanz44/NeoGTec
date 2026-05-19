/**
 * 📄 Fichier : /src/frontend/components/UsersSecurity.tsx
 * 🎯 Objectif : Politique de mots de passe, MFA & Authentification sécurisée.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Lock, Smartphone, Key, 
  ShieldAlert, RefreshCw, Eye, CheckCircle2,
  AlertTriangle, History as HistoryIcon, Verified, Settings,
  Save, Unlock, Terminal, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';

export const UsersSecurity: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Sécurité & Accès <Lock className="w-8 h-8 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Protocoles d'Authentification & Directives de Sécurité</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
             <ShieldCheck className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] font-black text-emerald-700 uppercase italic">Conformité ISO 27001</span>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Policy */}
          <div className="fluent-card p-6 rounded-lg border border-green-200 bg-white shadow-sm">
             <h4 className="text-sm font-black text-green-950 uppercase mb-8 flex items-center gap-2 italic">
                <Key className="w-5 h-5 text-green-600" /> Politique de Mot de Passe
             </h4>
             <div className="space-y-6">
                {[
                  { label: 'Longueur minimale', val: '12 caractères' },
                  { label: 'Expirations (jours)', val: '90 jours' },
                  { label: 'Historique (non-répétition)', val: '5 derniers' },
                ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg group hover:border-green-400 transition-all shadow-sm">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.label}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-black text-green-950">{p.val}</span>
                         <Settings className="w-4 h-4 text-slate-200 cursor-pointer hover:text-green-600" />
                      </div>
                   </div>
                ))}
                <div className="pt-4 border-t border-slate-50 space-y-3">
                   <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-600 uppercase">Complexité requise (Alpha-Num-Spec)</p>
                      <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                         <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* MFA Activation */}
          <div className={cn(
            "fluent-card p-8 transition-all relative overflow-hidden group rounded-lg border shadow-sm",
            mfaEnabled ? "border-emerald-200 bg-white" : "border-green-200 bg-white"
          )}>
             <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-emerald-600">
                <Smartphone className="w-32 h-32" />
             </div>
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-green-950 uppercase flex items-center gap-2 italic">
                   <Smartphone className={cn("w-5 h-5 transition-colors", mfaEnabled ? "text-emerald-600" : "text-green-600")} /> 
                   Accés sous condition & MFA
                </h4>
                <div 
                   onClick={() => setMfaEnabled(!mfaEnabled)}
                   className={cn("w-14 h-7 rounded-full p-1 cursor-pointer transition-all border border-transparent shadow-inner", mfaEnabled ? "bg-emerald-500" : "bg-slate-300")}
                >
                   <div className={cn("w-5 h-5 bg-white rounded-full transition-all transform shadow-md", mfaEnabled ? "translate-x-7" : "translate-x-0")} />
                </div>
             </div>
             
             <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic mb-8 border-l-4 border-emerald-400 pl-4 py-2 bg-emerald-50/30 rounded-r-md">
                L'accés est conditionné par la double authentification pour les rôles sensibles. Code via SMS (Vodacom/Orange/Airtel) ou APP.
             </p>

             <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white border border-green-200 rounded-lg text-center group hover:border-emerald-400 transition-all shadow-sm">
                   <Smartphone className="w-6 h-6 text-slate-300 mx-auto mb-2 group-hover:text-emerald-600" />
                   <p className="text-[9px] font-black uppercase text-slate-400">Application</p>
                </button>
                <button className="p-4 bg-white border border-green-200 rounded-lg text-center group hover:border-emerald-400 transition-all shadow-sm">
                   <Verified className="w-6 h-6 text-slate-300 mx-auto mb-2 group-hover:text-emerald-600" />
                   <p className="text-[9px] font-black uppercase text-slate-400">SMS / Email</p>
                </button>
             </div>
          </div>
       </div>

       {/* IP Restrictrion & API Keys Settings */}
       <div className="fluent-card p-6">
          <h4 className="text-sm font-black text-green-950 uppercase mb-8 flex items-center gap-2">
             <Globe className="w-5 h-5 text-green-600" /> Restrictions d'Accès & IP
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresses IP Autorisées (Whitelist)</label>
                <div className="space-y-3">
                   {['192.168.1.1 (HQ Office)', '41.242.100.2 (Branch A)'].map((ip, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between group">
                         <span className="text-[11px] font-mono font-bold text-slate-600">{ip}</span>
                         <Unlock className="w-3.5 h-3.5 text-slate-200 hover:text-rose-500 cursor-pointer" />
                      </div>
                   ))}
                   <button className="text-[9px] font-black text-green-600 uppercase italic hover:underline">+ Ajouter une restriction IP</button>
                </div>
             </div>
             <div className="p-6 bg-white rounded-lg text-slate-900 border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                   <Terminal className="w-16 h-16 text-indigo-600" />
                </div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase mb-2">Audit de Sécurité Hebdomadaire (System)</h5>
                <p className="text-xs font-medium text-slate-500 italic mb-6">Dernier scan : <span className="text-emerald-600 font-bold uppercase tracking-tight">Réussi (Vérifié)</span></p>
                <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">Lancer un Audit Manuel</button>
             </div>
          </div>
       </div>

       <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 hover:scale-105 transition-all">
             <Save className="w-4 h-4" /> Appliquer la Politique
          </button>
       </div>
    </div>
  );
};
