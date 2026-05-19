/**
 * 📄 Fichier : /src/frontend/components/Admin.tsx
 * 🎯 Objectif : Gestion des privilèges granulaires et des droits d'accès avancés.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldCheck, ShieldAlert, Lock, 
  Key, Globe, Users, Settings, Save,
  Plus, Trash2, Eye, EyeOff, CheckCircle2,
  AlertTriangle, Fingerprint, Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

type AccessRole = 'Administrateur' | 'Gestionnaire' | 'Prestataire' | 'Auditeur';

export const Admin: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<AccessRole>('Gestionnaire');

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Privilèges & Accès <Shield className="w-8 h-8 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Contrôle Granulaire des Permissions & Matrices de Sécurité</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">
             <Fingerprint className="w-4 h-4 text-green-400" /> Audit des Privilèges
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1 space-y-4">
             {(['Administrateur', 'Gestionnaire', 'Prestataire', 'Auditeur'] as AccessRole[]).map((r) => (
                <div 
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                    selectedRole === r ? "bg-green-600 border-green-600 shadow-xl shadow-green-600/20" : "bg-white border-slate-100 hover:border-green-200"
                  )}
                >
                   <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        selectedRole === r ? "bg-white/20 text-white" : "bg-green-50 text-green-600"
                      )}>
                         <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        selectedRole === r ? "text-white" : "text-green-950"
                      )}>{r}</span>
                   </div>
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full",
                     selectedRole === r ? "bg-white animate-pulse" : "bg-slate-200"
                   )} />
                </div>
             ))}
             <button className="w-full py-3 border-2 border-dashed border-green-100 rounded-2xl text-[9px] font-black text-green-300 uppercase tracking-[0.2em] hover:border-green-400 hover:text-green-600 transition-all">
                + Nouveau Rôle
             </button>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-3 fluent-card p-0 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                   <h4 className="text-xs font-black text-green-950 uppercase">Matrice de Permissions : {selectedRole}</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-1">Dernière modification : Il y a 12h par System_Root</p>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Enregistrer</button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-slate-50">
                {[
                  { module: 'Contrats & Polices', permissions: ['Voir', 'Créer', 'Modifier', 'Supprimer'], active: [true, true, true, false] },
                  { module: 'Sinistres & Claims', permissions: ['Voir', 'Valider', 'Rejeter', 'Liquider'], active: [true, true, false, false] },
                  { module: 'Données Médicales', permissions: ['Voir PII', 'Modifier', 'Exporter', 'Anonymiser'], active: [false, false, false, true] },
                  { module: 'Finance & Trésorerie', permissions: ['Accès Flux', 'Rapports', 'Virements', 'Paramètres'], active: [true, true, false, false] },
                  { module: 'Configuration Système', permissions: ['Accès Hub', 'Logs Audit', 'Mises à jour', 'API'], active: [false, true, false, false] },
                ].map((m, i) => (
                   <div key={i} className="p-6 hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                         <Activity className="w-4 h-4 text-green-600" />
                         <span className="text-[11px] font-black text-green-950 uppercase tracking-tight">{m.module}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {m.permissions.map((p, j) => (
                            <label key={j} className="flex items-center gap-3 cursor-pointer group">
                               <div className={cn(
                                 "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                                 m.active[j] ? "bg-green-600 border-green-600 text-white" : "border-slate-200 text-transparent"
                               )}>
                                  <ShieldCheck className="w-3.5 h-3.5" />
                               </div>
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest transition-colors",
                                 m.active[j] ? "text-green-900" : "text-slate-400 group-hover:text-green-400"
                               )}>{p}</span>
                            </label>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Security Contexts */}
       <div className="fluent-card p-0 overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-green-400">
                   <Lock className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-tight">Accès sous Condition & MFA</h4>
                   <p className="text-[10px] font-medium text-slate-400 italic">Forcer le MFA ou la restriction IP pour des rôles spécifiques.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Configurer</button>
             </div>
          </div>
          <div className="p-6 flex flex-wrap gap-4">
             {[
               { id: '1', label: 'Restriction IP', status: 'Actif', icon: Globe },
               { id: '2', label: 'Horaires d\'Accès (9h-18h)', status: 'Inactif', icon: Settings },
               { id: '3', label: 'Approbation Hiérarchique', status: 'Actif', icon: ShieldAlert },
             ].map((ctx) => (
                <div key={ctx.id} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                   <ctx.icon className={cn("w-4 h-4", ctx.status === 'Actif' ? "text-emerald-500" : "text-slate-300")} />
                   <span className="text-[10px] font-black text-slate-700 uppercase">{ctx.label}</span>
                   <span className={cn("text-[8px] font-black uppercase", ctx.status === 'Actif' ? "text-emerald-500" : "text-slate-400")}>{ctx.status}</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};
