import React, { useState, useEffect } from 'react';
import { 
  Search, RefreshCw, Edit3, Ban, Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp, UserProfile } from '../../lib/AppContext';
import { PrivilegeDrawer } from './PrivilegeDrawer';
import { SuspensionModal } from './SuspensionModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface UsersConsultationProps {
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
}

const TENANTS = [
  { id: 'acme', name: 'ACME SARL', domain: 'acme.cd' },
  { id: 'sunu', name: 'Sunu Assurances', domain: 'sunu.cd' },
  { id: 'ngaliema', name: 'Hôpital Ngaliema', domain: 'ngaliema.cd' }
];

export const UsersConsultation: React.FC<UsersConsultationProps> = ({ triggerToast }) => {
  const { users, setUsers, logAction, currentUser } = useApp();
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const [consultTenant, setConsultTenant] = useState('acme');
  const [consultSearchQuery, setConsultSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Deletion modals state
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [deleteEmailConfirm, setDeleteEmailConfirm] = useState('');

  // Privilege modal / drawers state
  const [privilegeUser, setPrivilegeUser] = useState<UserProfile | null>(null);
  const [privList, setPrivList] = useState({
    sinistresVoir: true, sinistresCreer: false, sinistresApprouveLt500: false, sinistresApprouveGt500: false, sinistresSupprimer: false,
    employesVoir: true, employesAjouter: false, employesModifier: false, employesExporter: false, employesSuspendre: false,
    financeVoir: false, financeVirement: false,
    departement: 'IT', ville: 'Kinshasa'
  });

  // Suspension states
  const [userToSuspend, setUserToSuspend] = useState<UserProfile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("Départ de l'entreprise");
  const [bulkSuspension, setBulkSuspension] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      setConsultTenant('acme');
    }
  }, [isSuperAdmin]);

  const getVisibleUsersForConsultation = () => {
    return users.filter(u => {
      // In multi-tenancy, non-superadmin (ACME admin) only sees ACME users
      const matchCompany = !isSuperAdmin 
        ? u.contractName.toLowerCase().includes('acme')
        : u.contractName.toLowerCase().includes(consultTenant.toLowerCase());
      
      const matchSearch = u.name.toLowerCase().includes(consultSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(consultSearchQuery.toLowerCase());
      return matchCompany && matchSearch;
    });
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const visibleIds = getVisibleUsersForConsultation().map(u => u.id);
      setSelectedUsers(visibleIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleResetPassword = (user: UserProfile) => {
    logAction(
      'INITIATE_PASSWORD_RESET',
      `Audit sécurité : Réinitialisation forcée du mot de passe requise pour ${user.name}. Code à usage unique envoyé par SMS/E-mail.`,
      'WARNING'
    );
    triggerToast(`Demande de réinitialisation de mot de passe lancée pour ${user.name}.`);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    logAction(
      'DELETE_USER_AUDIT',
      `Audit de révocation critique : Compte ${userToDelete.name} (${userToDelete.email}) révoqué par ${currentUser.name}.`,
      'CRITICAL'
    );

    triggerToast(`Compte de ${userToDelete.name} révoqué définitivement.`);
    setUserToDelete(null);
    setDeleteEmailConfirm('');
  };

  const handleSetSuspension = () => {
    if (bulkSuspension) {
      setUsers(prev => prev.map(u => {
        if (selectedUsers.includes(u.id)) {
          return { ...u, status: 'Suspendu' as const };
        }
        return u;
      }));
      logAction(
        'BATCH_SUSPEND_USERS',
        `Suspension globale de ${selectedUsers.length} comptes. Motif invoqué : ${suspensionReason}. Opération lancée par ${currentUser.name}.`,
        'CRITICAL'
      );
      triggerToast(`${selectedUsers.length} utilisateurs suspendus simultanément.`);
      setSelectedUsers([]);
      setBulkSuspension(false);
    } else if (userToSuspend) {
      setUsers(prev => prev.map(u => {
        if (u.id === userToSuspend.id) {
          return { ...u, status: 'Suspendu' as const };
        }
        return u;
      }));
      logAction(
        'SUSPEND_USER_COGNITIVE',
        `Compte temporairement suspendu pour ${userToSuspend.name} (${userToSuspend.id}). Motif : ${suspensionReason}.`,
        'WARNING'
      );
      triggerToast(`Le compte de ${userToSuspend.name} est maintenant suspendu.`);
      setUserToSuspend(null);
    }
  };

  const handleExportCSV = (count: number) => {
    logAction(
      'RGPD_DATA_EXPORT_CSV',
      `Exportation RGPD : ${currentUser.name} a exporté un fichier CSV contenant ${count} fiches utilisateurs.`,
      'SUCCESS'
    );
    triggerToast(`Exportation du fichier CSV complétée. ${count} lignes encodées.`);
    setSelectedUsers([]);
  };

  const handleSendMFAReminder = () => {
    logAction(
      'BULK_MFA_ALERT',
      `Rappel global de sécurité : Alerte SMS & Email MFA envoyé à ${selectedUsers.length} utilisateurs par ${currentUser.name}.`,
      'SUCCESS'
    );
    triggerToast(`Rappel MFA envoyé à ${selectedUsers.length} bénéficiaires avec succès.`);
    setSelectedUsers([]);
  };

  const handleOpenPrivileges = (u: UserProfile) => {
    const isIT = u.id === 'USR-001' || u.role === 'SUPER_ADMIN';
    const initPrivs = {
      sinistresVoir: true,
      sinistresCreer: isIT,
      sinistresApprouveLt500: isIT,
      sinistresApprouveGt500: false,
      sinistresSupprimer: false,
      employesVoir: true,
      employesAjouter: !isIT,
      employesModifier: !isIT,
      employesExporter: false,
      employesSuspendre: false,
      financeVoir: false,
      financeVirement: false,
      departement: isIT ? 'IT' : 'RH',
      ville: 'Kinshasa'
    };
    setPrivilegeUser(u);
    setPrivList(initPrivs);
  };

  const savePrivileges = () => {
    if (!privilegeUser) return;
    const givenPermissions: string[] = [];
    if (privList.sinistresCreer) givenPermissions.push('sinistre.create');
    if (privList.sinistresApprouveLt500) givenPermissions.push('sinistre.approve_under_500');
    if (privList.sinistresApprouveGt500) givenPermissions.push('sinistre.approve_over_500');
    if (privList.financeVirement) givenPermissions.push('finance.transfer');

    const permString = givenPermissions.join(', ') || 'aucun privilège particulier';
    
    logAction(
      'PRIVILEGE_MODIFIED',
      `Privilèges de données mis à jour : ${currentUser.name} a accordé [${permString}] à l'utilisateur ${privilegeUser.name} (${privilegeUser.id}).`,
      'SUCCESS'
    );

    triggerToast(`Privilèges de ${privilegeUser.name} mis à jour.`);
    setPrivilegeUser(null);
  };

  const visibleUsers = getVisibleUsersForConsultation();

  return (
    <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-sm">
      
      {/* Section 1 : Filtre Tenant & Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Filtrer par locataire d'établissement</label>
          <select
            disabled={!isSuperAdmin}
            value={consultTenant}
            onChange={(e) => setConsultTenant(e.target.value)}
            className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20"
          >
            {isSuperAdmin ? (
              TENANTS.map(t => (
                <option key={t.id} value={t.id}>{t.name} (domain: {t.domain})</option>
              ))
            ) : (
              <option value="acme">ACME SARL (Grise &amp; Bloisonné)</option>
            )}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">Recherche rapide</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom complet ou e-mail..."
              value={consultSearchQuery}
              onChange={(e) => setConsultSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2 : Table section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Tableau Général des Utilisateurs : <span className="font-mono text-xs text-green-600">({visibleUsers.length} trouvés)</span>
          </h3>

          {/* Bulk operations bar displayed when checked */}
          {selectedUsers.length > 0 && (
            <div className="flex bg-slate-50 border p-2 rounded-xl items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest px-2.5">{selectedUsers.length} SÉLECTIONNÉS :</span>
              <button
                type="button"
                onClick={() => {
                  setBulkSuspension(true);
                  setUserToSuspend(null);
                  setSuspensionReason('Départ de l\'entreprise');
                }}
                className="p-1 px-3 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[9px] font-black uppercase rounded-lg cursor-pointer animate-pulse"
              >
                Suspendre
              </button>
              <button
                type="button"
                onClick={() => handleExportCSV(selectedUsers.length)}
                className="p-1 px-3 bg-[#e6f4ea] border border-[#217346]/20 text-[#217346] hover:bg-emerald-50 text-[9px] font-black uppercase rounded-lg cursor-pointer"
              >
                Exporter CSV
              </button>
              <button
                type="button"
                onClick={handleSendMFAReminder}
                className="p-1 px-3 bg-white border text-indigo-600 hover:bg-slate-50 text-[9px] font-black uppercase rounded-lg cursor-pointer"
              >
                Rappel MFA
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto border rounded-3xl bg-white max-h-[420px] overflow-y-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b sticky top-0 z-10">
              <tr className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length > 0 && selectedUsers.length === visibleUsers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-slate-300 rounded"
                  />
                </th>
                <th className="p-4">Photo de profil</th>
                <th className="p-4">Nom de famille</th>
                <th className="p-4">Niveau d'accès</th>
                <th className="p-4">Langue</th>
                <th className="p-4">État de sécurité</th>
                <th className="p-4 text-center">Mot de passe</th>
                <th className="p-4 text-right">Actions administratives</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              {visibleUsers
                .sort((a,b) => {
                  const lNameA = a.name.split(' ').pop() || '';
                  const lNameB = b.name.split(' ').pop() || '';
                  return lNameA.localeCompare(lNameB);
                })
                .map(u => {
                  const splitName = u.name.split(' ');
                  const lastName = (splitName.pop() || '').toUpperCase();
                  const firstName = splitName.join(' ');
                  
                  const isUserSelected = selectedUsers.includes(u.id);

                  return (
                    <tr key={u.id} className={cn("hover:bg-slate-50/50 transition-colors", isUserSelected && "bg-green-50/20")}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isUserSelected}
                          onChange={() => toggleSelectUser(u.id)}
                          className="w-4 h-4 text-green-600 border-slate-300 rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border flex items-center justify-center font-extrabold text-[12px] uppercase text-slate-600 overflow-hidden shadow-xs">
                          {u.photo ? <img src={u.photo} className="w-full h-full object-cover" /> : u.name.substring(0,2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-extrabold text-slate-950 uppercase">{lastName}</p>
                        <p className="text-[10.5px] text-slate-400 font-semibold">{firstName} ({u.email})</p>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-lg border",
                          u.role === 'SUPER_ADMIN' ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-blue-50 text-blue-600 border-blue-200"
                        )}>
                          {u.role === 'SUPER_ADMIN' ? '👑 Admin' : '🏢 Employé'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[9px] font-mono font-black uppercase text-slate-600 bg-slate-100 p-1 px-2 rounded">
                          {u.address.includes('France') ? 'FR' : 'FR LIN'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-wider text-center py-0.5 px-2 rounded-lg border w-fit",
                            u.status === 'Actif' ? "bg-emerald-50 text-emerald-650 border-emerald-200" : 
                            u.status === 'Suspendu' ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-orange-50 text-orange-600 border-orange-200"
                          )}>
                            {u.status}
                          </span>
                          {!u.mfaEnabled && (
                            <span className="text-[7.5px] font-black uppercase text-amber-600 bg-amber-50 rounded px-1.5 py-0.2 border border-amber-250 w-fit">
                              ⚠️ MFA OFF
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono">
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u)}
                          className="px-3 py-1.5 hover:bg-slate-100 border text-slate-800 text-[9.5px] font-black uppercase tracking-wider rounded-lg shadow-2xs whitespace-nowrap cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <RefreshCw className="w-3" /> Réinitialiser
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenPrivileges(u)}
                            className="p-2 border hover:bg-slate-50 text-slate-705 bg-white rounded-xl cursor-pointer shadow-3xs"
                            title="Modifier permissions &amp; privilèges"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setBulkSuspension(false);
                              setUserToSuspend(u);
                              setSuspensionReason('Départ de l\'entreprise');
                            }}
                            className="p-2 border border-rose-150 hover:bg-rose-50 bg-white text-rose-600 rounded-xl cursor-pointer shadow-3xs"
                            title="Suspendre l'utilisateur"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setUserToDelete(u);
                              setDeleteEmailConfirm('');
                            }}
                            className="p-2 border border-slate-200 hover:bg-rose-50 bg-white text-slate-400 hover:text-rose-600 rounded-xl cursor-pointer shadow-3xs"
                            title="Révoquer définitivement de la base"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">Aucun gestionnaire actif enregistré.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popovers, Drawer side sheets */}
      <PrivilegeDrawer
        user={privilegeUser}
        onClose={() => setPrivilegeUser(null)}
        privList={privList}
        setPrivList={setPrivList}
        onSave={savePrivileges}
      />

      <SuspensionModal
        user={userToSuspend}
        bulk={bulkSuspension}
        selectedCount={selectedUsers.length}
        isOpen={!!userToSuspend || bulkSuspension}
        onClose={() => {
          setUserToSuspend(null);
          setBulkSuspension(false);
        }}
        reason={suspensionReason}
        setReason={setSuspensionReason}
        onConfirm={handleSetSuspension}
      />

      <DeleteConfirmModal
        user={userToDelete}
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        confirmEmailText={deleteEmailConfirm}
        setConfirmEmailText={setDeleteEmailConfirm}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
