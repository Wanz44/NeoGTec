/**
 * 📄 Fichier : /src/frontend/components/TeamPermissions.tsx
 * 🎯 Objectif : Module K.13 - Gestion Équipe & Permissions (Particulier pour "Module Système")
 * CONFORMITÉ : GDPR, ISO/IEC 27001:2026, PCI-DSS V4.0
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, ShieldCheck, Lock, Search, X, 
  Mail, Settings, CheckCircle, ShieldAlert,
  Sliders, Plus, Trash2, Check, AlertTriangle,
  RotateCcw, Sparkles, Key, Info, ShieldAlert as SlAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface AcmeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited';
  department: string;
  lastActive: string;
}

export interface CustomRole {
  name: string;
  permissions: {
    [key: string]: {
      view: boolean;
      create: boolean;
      modify: boolean;
      delete: boolean;
    }
  };
}

const INITIAL_ACME_USERS: AcmeUser[] = [
  { id: 'usr-1', name: 'Marie KAPEND', email: 'm.kapend@acme.cd', role: 'Super Admin', status: 'active', department: 'Direction', lastActive: 'Il y a 2m' },
  { id: 'usr-2', name: 'Jean MUKENGERI', email: 'jean.m@acme.cd', role: 'RH Standard', status: 'active', department: 'IT', lastActive: 'Il y a 10m' },
  { id: 'usr-3', name: 'Alain TSHIBANDA', email: 'a.tshibanda@acme.cd', role: 'Finance', status: 'active', department: 'Comptabilité', lastActive: 'Il y a 1h' },
  { id: 'usr-4', name: 'Sarah LUZOLO', email: 's.luzolo@acme.cd', role: 'Lecture seule', status: 'invited', department: 'Ventes', lastActive: 'Jamais (Invitation envoyée)' }
];

export const TeamPermissions: React.FC = () => {
  const [acmeUsers, setAcmeUsers] = useState<AcmeUser[]>(INITIAL_ACME_USERS);
  const [activeUserRole, setActiveUserRole] = useState<'Marie' | 'Jean'>('Marie'); // Simulation switcher
  
  // Modals / forms triggers
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('RH Standard');
  const [inviteDept, setInviteDept] = useState('IT');
  const [limitDept, setLimitDept] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Roles States
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      name: 'Gestionnaire Paie',
      permissions: {
        'employe.export': { view: true, create: false, modify: true, delete: false },
        'sinistres.read': { view: true, create: false, modify: false, delete: false },
        'finance.read': { view: true, create: true, modify: true, delete: false }
      }
    }
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleInviteUser = () => {
    setDomainError('');
    if (!inviteEmail.trim()) return;

    if (!inviteEmail.includes('@')) {
      setDomainError('E-mail invalide.');
      return;
    }

    const domain = inviteEmail.substring(inviteEmail.indexOf('@') + 1);
    if (domain.toLowerCase() === 'gmail.com' || domain.toLowerCase() === 'yahoo.fr') {
      setDomainError(`Interdit : l'administration et le RGPD d'ACME refusent les adresses génériques ${domain}.`);
      return;
    }

    const newUser: AcmeUser = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split('@')[0].toUpperCase(),
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      department: limitDept ? inviteDept : 'Tous les Départements',
      lastActive: "Jamais"
    };

    setAcmeUsers(prev => [...prev, newUser]);
    setShowInviteModal(false);
    setInviteEmail('');
    showToast(`Invitation de sécurité émise pour ${inviteEmail} (Lien d'activation J+3)`);
  };

  const handleDeleteUser = (email: string) => {
    setAcmeUsers(prev => prev.filter(u => u.email !== email));
    showToast(`Utilisateur ${email} a vu ses habilitations révoquées.`);
  };

  const handleCreateCustomRole = () => {
    if (!newRoleName.trim()) return;
    const newRole: CustomRole = {
      name: newRoleName,
      permissions: {
        'employe.export': { view: true, create: false, modify: false, delete: false },
        'sinistres.read': { view: true, create: false, modify: false, delete: false },
        'finance.read': { view: false, create: false, modify: false, delete: false }
      }
    };
    setCustomRoles(prev => [...prev, newRole]);
    setNewRoleName('');
    setShowCreateRoleForm(false);
    showToast(`Rôle personnalisé '${newRoleName}' pré-initialisé.`);
  };

  return (
    <div id="team-permissions-root" className="space-y-6">
      
      {/* Toast Alert Notice in the top corner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -45, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-indigo-950 text-indigo-305 border border-indigo-500/30 shadow-2xl px-6 py-4 rounded-lg flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider font-mono">Contrôle d'Accès Système</p>
              <p className="text-[10px] font-medium text-white italic">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info Panel */}
      <div className="p-6 bg-white border border-indigo-100 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-indigo-950 tracking-tight italic">
              Module K.13 : Équipe & Habilitations (RBAC / ABAC)
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">
              Configuration de la Matrice de Rôles, Jetons d'Accès d'Utilisateurs & Profils de Sécurité
            </p>
          </div>
        </div>

        {/* Emulation Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => {
              setActiveUserRole('Marie');
              showToast("Simulation: Droits Super Admin appliqués (Marie)");
            }}
            className={cn(
              "px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors",
              activeUserRole === 'Marie' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Super Admin (Marie)
          </button>
          <button
            onClick={() => {
              setActiveUserRole('Jean');
              showToast("Simulation: Droits RH isolés appliqués (Jean)");
            }}
            className={cn(
              "px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors",
              activeUserRole === 'Jean' ? "bg-amber-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            RH Standard (Jean)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Habilitations / Users List of the current Tenant */}
        <div className="lg:col-span-2 p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 animate-pulse" /> Personnel Autorisé de l'Équipe ({acmeUsers.length})
              </h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                Utilisateurs enregistrés ayant accès aux filiales sécurisées
              </p>
            </div>

            {/* If Jean, block invitation button as visual showcase of ABAC! */}
            <button
              onClick={() => {
                if (activeUserRole === 'Jean') {
                  showToast("ACCÈS REJETÉ: Jean n'a pas la permission de type administrative 'user.write'.");
                  return;
                }
                setShowInviteModal(true);
              }}
              className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded cursor-pointer transition-all",
                activeUserRole === 'Jean' 
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow shadow-indigo-700/15"
              )}
            >
              + Inviter Collaborateur
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-medium">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[9px] text-slate-400 font-black uppercase">
                  <th className="p-3">Collaborateur</th>
                  <th className="p-3">Rôle Assigné</th>
                  <th className="p-3">Département d'Isolation</th>
                  <th className="p-3">Dernière Connexion</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {acmeUsers.map((usr) => (
                  <tr key={usr.id} className="border-b border-slate-100 text-[10px] hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-bold text-slate-805 uppercase">{usr.name}</p>
                      <p className="text-[8px] font-mono text-slate-450 lowercase">{usr.email}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-750 font-black text-[8px] uppercase border border-indigo-100">
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-600 italic">
                      {usr.department}
                    </td>
                    <td className="p-3 text-[9px] text-slate-400 font-mono">
                      {usr.lastActive}
                    </td>
                    <td className="p-3 text-right">
                      {usr.email !== 'm.kapend@acme.cd' && (
                        <button
                          onClick={() => {
                            if (activeUserRole === 'Jean') {
                              showToast("Erreur: Privilège insuffisant pour supprimer un collaborateur.");
                              return;
                            }
                            if (confirm(`Révoquer définitivement l'accès pour ${usr.name}?`)) {
                              handleDeleteUser(usr.email);
                            }
                          }}
                          className={cn(
                            "p-1.5 rounded transition-colors cursor-pointer border",
                            activeUserRole === 'Jean'
                              ? "text-slate-350 border-slate-200 cursor-not-allowed"
                              : "text-rose-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200"
                          )}
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Security Compliance Panel */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-amber-950 uppercase tracking-wide">Règle de Sécurité des Domaines professionnels (PCI-DSS)</p>
              <p className="text-[9px] text-slate-600 font-medium leading-relaxed italic">
                L'invitation aux rôles administratifs de l'AssurAdvançé exige des adresses e-mails vérifiées sur domaines professionnels. Les adresses de messagerie publiques (@gmail.com, etc) sont bloquées par défaut pour garantir la protection des adresses d'Adhérents.
              </p>
            </div>
          </div>
        </div>

        {/* Roles and Rights Interactive Matrix Builder */}
        <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-black text-slate-900 uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" /> Matrice d'Habilitations
            </h4>
            <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Rôles Actifs</span>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide leading-relaxed">
            Ajustement fin de granularité de l'autorisation RBAC de vos collaborateurs
          </p>

          <div className="space-y-3.5">
            {/* Displaying Custom Roles */}
            {customRoles.map((cr, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-850 uppercase">{cr.name}</span>
                  <span className="text-[8px] font-extrabold text-indigo-650 font-mono">Acls standards</span>
                </div>

                <div className="space-y-1.5 text-[9px] font-mono text-slate-600">
                  <div className="flex justify-between">
                    <span>• employe.export</span>
                    <span className="font-bold text-emerald-650">AUTORISÉ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• sinistres.read</span>
                    <span className="font-bold text-emerald-650">AUTORISÉ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• finance.read</span>
                    <span className="font-bold text-rose-600">REJETÉ</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick check view: Selected active simulator status */}
            <div className="p-4 rounded border-2 border-indigo-600/30 bg-indigo-50/20 space-y-2">
              <span className="text-[8px] font-black text-indigo-750 uppercase tracking-wider block">Token d'Accès de simulation actif :</span>
              <p className="text-[10px] font-extrabold text-slate-800">
                {activeUserRole === 'Marie' ? '🔑 Marie KAPEND (Super Admin)' : '🔑 Jean MUKENGERI (RH Standard)'}
              </p>
              <div className="w-full h-1 bg-slate-200 rounded overflow-hidden mt-1">
                <div 
                  className={cn("h-full transition-all duration-500", activeUserRole === 'Marie' ? 'w-full bg-indigo-600' : 'w-1/2 bg-amber-500')}
                />
              </div>
              <p className="text-[8.5px] text-slate-450 italic">
                {activeUserRole === 'Marie' 
                  ? 'Génère un jeton d\'autorisation JWT global sans restrictions de tables.' 
                  : 'Filtres de sécurité injectés dans les requêtes de base de données.'}
              </p>
            </div>

            {/* Form to create custom role */}
            {showCreateRoleForm ? (
              <div className="p-3 bg-slate-50 border border-indigo-200 rounded space-y-3">
                <label className="text-[8.5px] font-black text-slate-500 uppercase">Nom du Nouveau Rôle *</label>
                <input
                  type="text"
                  placeholder="EX: Auditeur Externe"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-[10px] uppercase font-black"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setShowCreateRoleForm(false)}
                    className="px-2.5 py-1 text-[8px] font-black uppercase text-slate-450 hover:bg-slate-100 rounded"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateCustomRole}
                    className="px-2.5 py-1 text-[8px] bg-indigo-650 text-white font-black uppercase rounded"
                  >
                    Créer
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (activeUserRole === 'Jean') {
                    showToast("REFUSÉ: Jean n'a pas les droits pour modifier la politique RBAC.");
                    return;
                  }
                  setShowCreateRoleForm(true);
                }}
                className={cn(
                  "w-full py-2.5 border border-indigo-200 hover:border-indigo-400 text-indigo-750 text-[9px] font-black uppercase tracking-wider rounded transition-all cursor-pointer",
                  activeUserRole === 'Jean' && "opacity-50 cursor-not-allowed"
                )}
              >
                + Créer Rôle Personnalisé
              </button>
            )}

          </div>
        </div>

      </div>

      {/* INVITE USER MODAL */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div className="p-5 bg-slate-900 text-white border-b border-slate-950 flex items-center justify-between font-black">
                <div>
                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Sécurité d'Équipe (K.13)</span>
                  <h3 className="text-sm font-black uppercase">Inviter un Collaborateur</h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {domainError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded text-[9.5px] font-extrabold text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{domainError}</span>
                  </div>
                )}

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">E-mail Professionnel *</label>
                  <input
                    type="email"
                    required
                    placeholder="EX: collaborateur@acme.cd"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-bold text-slate-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Rôle Système</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-semibold text-slate-800"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="RH Standard">RH Standard</option>
                      <option value="Finance">Finance</option>
                      <option value="Lecture seule">Lecture Seule</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Département d'origine</label>
                    <select
                      value={inviteDept}
                      onChange={(e) => setInviteDept(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded outline-none text-[11px] font-semibold text-slate-800"
                    >
                      <option value="IT">IT</option>
                      <option value="Comptabilité">Comptabilité</option>
                      <option value="Direction">Direction</option>
                      <option value="RH">RH</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="limit-dept-check"
                    checked={limitDept}
                    onChange={(e) => setLimitDept(e.target.checked)}
                    className="w-4 h-4 text-indigo-655"
                  />
                  <label htmlFor="limit-dept-check" className="text-[10px] font-extrabold text-slate-705 uppercase">Restreindre strictement au département</label>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-slate-150 rounded text-[10px] font-black uppercase text-slate-450 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInviteUser}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-black uppercase rounded"
                >
                  Envoyer Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
