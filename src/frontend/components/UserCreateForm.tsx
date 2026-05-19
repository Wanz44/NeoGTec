/**
 * 📄 Fichier : /src/frontend/components/UserCreateForm.tsx
 * 🎯 Objectif : Formulaire de création d'utilisateur
 */
import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, ShieldCheck, Lock, Search, X } from 'lucide-react';

interface UserCreateFormProps {
  onClose: () => void;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-green-950/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-200"
      >
         <div className="p-8 border-b border-green-100 flex justify-between items-center bg-green-50/30">
            <div>
               <h3 className="text-xl font-black text-green-950 uppercase italic">Création de Compte</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nouveau collaborateur système</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg border border-transparent hover:border-rose-100 transition-all">
              <X className="w-5 h-5" />
            </button>
         </div>

         <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Personal Info */}
            <div className="space-y-4">
               <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                 <UserCheck className="w-4 h-4" /> Informations Personnelles
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-1">Nom Complet</label>
                     <input type="text" placeholder="ex: Marc Antoine" className="w-full px-4 py-3 bg-slate-50 border border-green-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-1">Email Professionnel</label>
                     <input type="email" placeholder="m.antoine@assuradvance.com" className="w-full px-4 py-3 bg-slate-50 border border-green-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-1">Téléphone</label>
                     <input type="tel" placeholder="+243 ..." className="w-full px-4 py-3 bg-slate-50 border border-green-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-500 uppercase px-1">Département / Équipe</label>
                     <select className="w-full px-4 py-3 bg-slate-50 border border-green-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm">
                        <option>Opérations Métiers</option>
                        <option>Audit & Fraude</option>
                        <option>Relation Clients</option>
                        <option>Direction Médicale</option>
                        <option>DSI / IT Africa</option>
                     </select>
                  </div>
               </div>
            </div>

            {/* Roles Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Attribution de Rôle Système
               </p>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'admin', label: 'Administrateur', desc: 'Accès Master' },
                    { id: 'gest', label: 'Gestionnaire', desc: 'Flux Sinistres' },
                    { id: 'audit', label: 'Auditeur', desc: 'Lecture Seule' },
                    { id: 'prest', label: 'Prestataire', desc: 'Hôpital / Labo' },
                    { id: 'support', label: 'Support L1/L2', desc: 'Assistance' }
                  ].map(role => (
                     <button key={role.id} className="p-4 border border-slate-100 rounded-lg text-left hover:border-indigo-400 hover:bg-slate-50 transition-all group shadow-sm bg-white">
                        <p className="text-[10px] font-black text-slate-900 uppercase">{role.label}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{role.desc}</p>
                     </button>
                  ))}
               </div>
            </div>

            {/* Granular Privileges */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                 <Lock className="w-4 h-4" /> Privilèges Étendus
               </p>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    'Approbation Sinistres > 5M',
                    'Accès Coordonnées Médicales',
                    'Exportation Bases de Données',
                    'Gestion Utilisateurs & Rôles',
                    'Paramétrage SaaS Hôpitaux',
                    'Accès Console Développeur'
                  ].map(priv => (
                    <label key={priv} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-white transition-all cursor-pointer group shadow-sm">
                       <div className="w-4 h-4 rounded border-2 border-slate-200 group-hover:border-rose-400 transition-colors" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{priv}</span>
                    </label>
                  ))}
               </div>
            </div>

            <div className="p-4 bg-green-50/50 rounded-lg border border-green-200 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-green-600" />
                  <div>
                     <p className="text-[10px] font-black text-green-950 uppercase italic">Multi-Factor Auth (MFA)</p>
                     <p className="text-[9px] font-medium text-green-600 italic">Activation automatique pour la sécurité</p>
                  </div>
               </div>
               <div className="w-10 h-5 bg-green-600 rounded-full relative shadow-inner">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
               </div>
            </div>
         </div>

         <div className="p-8 bg-slate-50/50 flex gap-4 border-t border-slate-100">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:border-slate-300 transition-all">Annuler</button>
            <button className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-600/20 hover:bg-green-700 hover:scale-[1.02] transition-all border border-green-700">Finaliser Création</button>
         </div>
      </motion.div>
    </div>
  );
};
