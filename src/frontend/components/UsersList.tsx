/**
 * 📄 Fichier : /src/frontend/components/UsersList.tsx
 * 🎯 Objectif : Gestion des utilisateurs du système, des rôles et des accès avec profil modifiable & détails complets (RDC-compliance).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, MoreVertical,
  Shield, Key, Ban, CheckCircle2, Mail,
  Clock, Tag, Phone, MapPin, Edit3, Trash2,
  Lock, Calendar, Briefcase, Eye, ChevronRight,
  UserCheck, ShieldCheck, X, Save, ShieldAlert, Camera
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp, UserProfile, UserRole } from '../lib/AppContext';

export const UsersList: React.FC = () => {
  const { users, setUsers, logAction, currentUser } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Tous');
  
  // Selected user for details drawer
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);
  
  // Selected user for profile editor modal
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  
  // Profile Editor Form values
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('SUPER_ADMIN');
  const [editStatus, setEditStatus] = useState<'Actif' | 'Suspendu' | 'En attente'>('Actif');
  const [editContract, setEditContract] = useState('');

  // Filtering users dynamically
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedRoleFilter === 'Tous') return matchesSearch;
    return matchesSearch && u.role === selectedRoleFilter;
  });

  const handleOpenEdit = (user: UserProfile) => {
    setUserToEdit(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditAddress(user.address);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditContract(user.contractName || 'Sans Contrat');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    // Mutate state in global array
    setUsers(prev => prev.map(u => {
      if (u.id === userToEdit.id) {
        return {
          ...u,
          name: editName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          role: editRole,
          status: editStatus,
          contractName: editContract
        };
      }
      return u;
    }));

    logAction(
      'UPDATE_USER_PROFILE', 
      `Profil de ${editName} (${userToEdit.id}) sauvegardé par l'administrateur. Rôle: ${editRole}, Statut: ${editStatus}.`,
      'SUCCESS'
    );

    setUserToEdit(null);
    setSelectedUserDetail(null); // Force sync if open
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (currentUser.id === id) {
      alert("Erreur: Vous ne pouvez pas supprimer votre propre compte en cours de session.");
      return;
    }

    if (window.confirm(`Détacher définitivement l'utilisateur "${name}" (${id}) ?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      logAction('DELETE_USER', `Compte utilisateur ${name} (${id}) révoqué du système.`, 'CRITICAL');
      alert(`L'utilisateur ${name} a été supprimé.`);
    }
  };

  const handleCreateRandomUser = () => {
    let randNum = Math.floor(10 + Math.random() * 90);
    let randomId = `USR-0${randNum}`;
    while (users.some(u => u.id === randomId)) {
      randNum = Math.floor(10 + Math.random() * 900);
      randomId = `USR-0${randNum}`;
    }

    const names = ["Jean-Paul Mpiana", "Sarah Kabedi", "Dieudonné Mwamba", "Glenda Tshibuyi", "Marc Lelo"];
    const emails = ["jp.mpiana@corp.cd", "s.kabedi@afreak.cd", "d.mwamba@med.org", "glenda.t@assurance.com", "m.lelo@gmail.com"];
    const roles: UserRole[] = ["PARTENAIRE_HOPITAL", "GESTIONNAIRE_SINISTRES", "RH_ENTREPRISE", "SUPPORT_CLIENT", "AUDITEUR_EXTERNE"];
    
    const index = Math.floor(Math.random() * names.length);
    const newUser: UserProfile = {
      id: randomId,
      name: names[index],
      email: emails[index],
      phone: `+243 812 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
      address: "Kinshasa, Gombe",
      role: roles[Math.floor(Math.random() * roles.length)],
      status: 'Actif',
      biometricsEnabled: true,
      biometricsLinked: true,
      cardCode: `POL-${Math.floor(100000 + Math.random() * 900000)}-SEC`,
      mfaEnabled: false,
      deviceTrusted: true,
      contractName: "AfreakCare Standard Communautaire",
      creationDate: "28/05/2026"
    };

    setUsers(prev => [...prev, newUser]);
    logAction('CREATE_USER', `Création automatique de l'affilié ${newUser.name} avec contrat.`, 'SUCCESS');
    alert(`Nouvel assuré "${newUser.name}" ajouté avec succès !`);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'GESTIONNAIRE_SINISTRES': return 'Médecin Conseil';
      case 'GESTIONNAIRE_FINANCE': return 'Comptable';
      case 'AUDITEUR_EXTERNE': return 'Auditeur Externe';
      case 'SUPPORT_CLIENT': return 'Support Client';
      case 'RH_ENTREPRISE': return 'RH Entreprise';
      case 'PARTENAIRE_HOPITAL': return 'Partenaire Hôpital';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
       {/* Header & Actions */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Utilisateurs <Users className="w-8 h-8 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Affichage complet, modification du profil &amp; liaison contrats</p>
          </div>
          <button 
            onClick={handleCreateRandomUser}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 transition-all cursor-pointer"
          >
             <UserPlus className="w-4 h-4" /> Nouvel Assuré / Affilié
          </button>
       </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs Totaux', val: users.length, color: 'text-green-600' },
            { label: 'Super Admins Sécurisés', val: users.filter(u => u.role === 'SUPER_ADMIN').length, color: 'text-indigo-600' },
            { label: 'Biométrie Activée', val: users.filter(u => u.biometricsEnabled).length, color: 'text-emerald-600' },
            { label: 'Contrats Liés', val: users.filter(u => u.contractName).length, color: 'text-green-600' },
          ].map((s, i) => (
             <div key={i} className="p-4 bg-white border border-green-200 rounded-xl shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex justify-between items-end">
                  <p className={cn("text-xl font-black mt-1", s.color)}>{s.val}</p>
                  <span className="text-[8px] font-bold text-slate-350">PROD-SYNC</span>
                </div>
             </div>
          ))}
       </div>

       {/* Filters */}
       <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
             <input 
               type="text" 
               placeholder="Filtrer en temps réel par Nom, E-mail ou ID d'affilié..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-green-205 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm font-bold text-slate-850"
             />
          </div>
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-green-200 shadow-sm overflow-x-auto">
             {['Tous', 'SUPER_ADMIN', 'GESTIONNAIRE_SINISTRES', 'GESTIONNAIRE_FINANCE', 'AUDITEUR_EXTERNE'].map((role) => (
                <button
                  key={role}
                  value={role}
                  onClick={() => setSelectedRoleFilter(role)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer",
                    selectedRoleFilter === role ? "bg-green-100 text-green-600 border border-green-200 shadow-sm" : "text-slate-400 hover:text-green-600"
                  )}
                >
                   {role === 'Tous' ? 'Tous' : getRoleLabel(role as any)}
                </button>
             ))}
          </div>
       </div>

       {/* Users Table-like Cards */}
       <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400 bg-white rounded-2xl border">
               Aucun utilisateur trouvé correspondant à ces filtres.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={user.id} 
                className="p-5 group hover:border-green-400 transition-all rounded-2xl border border-green-150 bg-white shadow-sm"
              >
                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-green-700 font-extrabold text-lg group-hover:scale-105 transition-all overflow-hidden shrink-0">
                          {user.photo ? (
                            <img src={user.photo} className="w-full h-full object-cover" alt="User avatar" />
                          ) : (
                            user.name.charAt(0)
                          )}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 flex-wrap">
                             <h4 className="text-xs font-black text-slate-900 uppercase">{user.name}</h4>
                             <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                user.status === 'Actif' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : user.status === 'Suspendu' ? "bg-rose-500" : "bg-green-300"
                             )} />
                             <span className="text-[7.5px] font-black uppercase text-slate-400 font-mono tracking-wider">#{user.id}</span>
                          </div>
                          <p className="text-[10px] font-semibold text-slate-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1 select-none flex-wrap">
                             <span className="text-[7.5px] font-black text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest">{getRoleLabel(user.role)}</span>
                             <span className="text-[7.5px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">{user.contractName}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 flex-wrap">
                       <div className="text-left">
                          <p className="text-[7.5px] font-black text-slate-350 uppercase">Date d'inscription</p>
                          <p className="text-[9.5px] font-bold text-slate-500 italic mt-0.5">{user.creationDate || "28/05/2026"}</p>
                       </div>
                       
                       <div className="flex items-center gap-1.5">
                          {/* VIEW PROFILE BUTTON */}
                          <button 
                            type="button"
                            onClick={() => setSelectedUserDetail(user)}
                            className="px-3.5 py-2 border border-slate-250 hover:bg-slate-50 rounded-xl text-[9.5px] font-black uppercase text-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                             <Eye className="w-3.5 h-3.5 text-slate-400" /> Afficher
                          </button>
                          
                          {/* EDIT PROFILE BUTTON */}
                          <button 
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="p-2 border border-green-150 hover:bg-green-50 text-green-700 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                             <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE USER BUTTON */}
                          <button 
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-2 border border-rose-150 hover:bg-rose-50 text-rose-600 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </div>
                 </div>
              </motion.div>
           ))
          )}
       </div>

       {/* ======================================= */}
       {/* DETAIL DRAWER / POP-UP                  */}
       {/* ======================================= */}
       <AnimatePresence>
         {selectedUserDetail && (
           <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[400] flex justify-end">
             <div className="absolute inset-0" onClick={() => setSelectedUserDetail(null)} />
             
             <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300 text-slate-800">
                <div className="flex justify-between items-center border-b pb-4">
                   <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <h3 className="text-base font-black text-slate-950 uppercase italic">Fiche d'Assuré complète</h3>
                   </div>
                   <button 
                     onClick={() => setSelectedUserDetail(null)}
                     className="font-mono text-xl text-slate-400 hover:text-slate-900 p-2 cursor-pointer outline-none"
                   >
                     ×
                   </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-3 py-4 bg-slate-50 rounded-3xl border border-slate-100">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-2xl font-black text-green-700 overflow-hidden shadow-md">
                      {selectedUserDetail.photo ? (
                        <img src={selectedUserDetail.photo} className="w-full h-full object-cover" alt="User" />
                      ) : (
                        selectedUserDetail.name.charAt(0)
                      )}
                   </div>
                   <div>
                      <h4 className="text-base font-black uppercase text-slate-900">{selectedUserDetail.name}</h4>
                      <p className="text-xs font-semibold text-slate-400 font-mono mt-0.5">{selectedUserDetail.email}</p>
                   </div>
                   <span className="px-3 py-0.5 bg-green-600 text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm">
                      {selectedUserDetail.role}
                   </span>
                </div>

                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Données d'identité &amp; coordonnées</h5>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[8px] font-black text-slate-350 uppercase">Identifiant Unique</p>
                         <p className="text-xs font-black text-slate-800 font-mono italic mt-0.5">{selectedUserDetail.id}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-slate-350 uppercase">Date de création</p>
                         <p className="text-xs font-black text-slate-800 mt-0.5">{selectedUserDetail.creationDate || "28/05/2026"}</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-slate-350 uppercase">Numéro de Téléphone</p>
                         <p className="text-xs font-black text-slate-800 mt-0.5 flex items-center gap-1">
                           <Phone className="w-3 h-3 text-slate-400" /> {selectedUserDetail.phone}
                         </p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-slate-350 uppercase">Adresse physique</p>
                         <p className="text-xs font-black text-slate-800 mt-0.5 flex items-center gap-x-1 truncate max-w-[150px]">
                           <MapPin className="w-3 h-3 text-slate-400" /> {selectedUserDetail.address}
                         </p>
                      </div>
                   </div>

                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1 pt-2">Sécurité &amp; Accréditations digitales</h5>
                   
                   <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <span className="text-xs font-bold text-slate-700">Appairage Biométrique FIDO2</span>
                         <span className={cn(
                           "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                           selectedUserDetail.biometricsLinked ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                         )}>
                            {selectedUserDetail.biometricsLinked ? "Lié & Sécurisé" : "Non Configuré"}
                         </span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <span className="text-xs font-bold text-slate-700">Double Facteur (MFA Code SMS)</span>
                         <span className={cn(
                           "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                           selectedUserDetail.mfaEnabled ? "bg-emerald-500/10 text-emerald-600 animate-pulse" : "bg-amber-500/10 text-amber-600"
                         )}>
                            {selectedUserDetail.mfaEnabled ? "Actif" : "Optionnel"}
                         </span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <span className="text-xs font-bold text-slate-700">Contrat d'assurance rattaché</span>
                         <span className="text-[9.5px] font-black text-green-700 uppercase italic">
                            {selectedUserDetail.contractName || "Aucun Contrat Actif"}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t flex gap-2">
                   <button 
                     onClick={() => handleOpenEdit(selectedUserDetail)}
                     className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black uppercase"
                   >
                     Modifier le Profil
                   </button>
                   <button 
                     onClick={() => setSelectedUserDetail(null)}
                     className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-750 border rounded-xl text-xs font-black uppercase"
                   >
                     Fermer
                   </button>
                </div>
             </div>
           </div>
         )}
       </AnimatePresence>

       {/* ======================================= */}
       {/* PROFILE EDITOR MODAL                       */}
       {/* ======================================= */}
       <AnimatePresence>
         {userToEdit && (
           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[500] flex items-center justify-center p-4">
             <div className="absolute inset-0" onClick={() => setUserToEdit(null)} />
             
             <form 
               onSubmit={handleSaveProfile}
               className="relative bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 z-10 p-8 space-y-4 text-slate-800"
             >
                <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-green-600" />
                      <h3 className="text-base font-black text-slate-950 uppercase italic">Administration - Modifier le Profil</h3>
                   </div>
                   <button type="button" onClick={() => setUserToEdit(null)} className="font-mono text-xl text-slate-400 hover:text-slate-900 p-2 cursor-pointer outline-none">
                     ×
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom Complet</label>
                      <input 
                        type="text" 
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">E-mail</label>
                      <input 
                        type="email" 
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Téléphone</label>
                      <input 
                        type="text" 
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Adresse</label>
                      <input 
                        type="text" 
                        required
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Rôle Système</label>
                      <select 
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as any)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-black uppercase text-slate-800"
                      >
                         <option value="SUPER_ADMIN">👑 Super Admin</option>
                         <option value="GESTIONNAIRE_SINISTRES">🩺 Médecin Conseil</option>
                         <option value="GESTIONNAIRE_FINANCE">📊 Comptable</option>
                         <option value="AUDITEUR_EXTERNE">🔎 Auditeur Externe</option>
                         <option value="SUPPORT_CLIENT">🛠️ Support Client</option>
                         <option value="RH_ENTREPRISE">🏢 RH Entreprise</option>
                         <option value="PARTENAIRE_HOPITAL">🏥 Partenaire Hôpital</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Statut Accréditation</label>
                      <select 
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-black uppercase text-slate-800"
                      >
                         <option value="Actif">Actif</option>
                         <option value="Suspendu">Suspendu</option>
                         <option value="En attente">En attente</option>
                      </select>
                   </div>
                   <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Contrat / Formule rattachée</label>
                      <input 
                        type="text" 
                        required
                        value={editContract}
                        onChange={(e) => setEditContract(e.target.value)}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                      />
                   </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                   <button 
                     type="button" 
                     onClick={() => setUserToEdit(null)}
                     className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-black uppercase"
                   >
                     Annuler
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 py-3 bg-green-650 hover:bg-green-755 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-md"
                   >
                     <Save className="w-4 h-4" /> Enregistrer le profil
                   </button>
                </div>
             </form>
           </div>
         )}
       </AnimatePresence>

       {/* Role Definition Informational Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="p-8 bg-slate-900 rounded-[16px] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
             <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Shield className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic underline decoration-white/10 underline-offset-8">Rôles Métiers Définis (ARCA-compliant)</h4>
             <div className="space-y-4">
                {[
                  { role: '👑 Super Admin', access: 'Contrôle global, audits tracés', color: 'text-rose-400' },
                  { role: '🩺 Médecin Conseil', access: 'Contrôle médical, validation sinistres', color: 'text-indigo-400' },
                  { role: '📊 Comptable / Finance', access: 'Flux financiers, remboursements CDF/USD', color: 'text-emerald-400' },
                  { role: '🔎 Auditeur Externe', access: 'Livre des audits et logs de sécurité 24/7', color: 'text-amber-400' },
                ].map((r, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                      <div>
                         <p className="text-xs font-black uppercase">{r.role}</p>
                         <p className="text-[10px] font-medium text-slate-400 italic mt-0.5">{r.access}</p>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-white/30" />
                   </div>
                ))}
             </div>
          </div>

          <div className="p-8 flex flex-col items-center justify-center text-center gap-6 rounded-[16px] border border-orange-200 bg-orange-50/10 shadow-sm">
             <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 border border-orange-200 shadow-inner">
                <Clock className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-xl font-black text-orange-950 uppercase tracking-tight">Accréditations temporaires</h4>
                <p className="text-[11px] font-semibold text-slate-500 italic mt-2 leading-relaxed max-w-xs">Les accès d'Auditeurs Externes expirent automatiquement selon les mandats officiels de contrôle des assurances.</p>
             </div>
             <button type="button" onClick={handleCreateRandomUser} className="px-8 py-3 bg-white border border-orange-200 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-sm cursor-pointer">
                Générer un affilié temporaire
             </button>
          </div>
       </div>
    </div>
  );
};
