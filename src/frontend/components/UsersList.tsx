/**
 * 📄 Fichier : /src/frontend/components/UsersList.tsx
 * 🎯 Objectif : Gestion des utilisateurs, des rôles et des accès.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, MoreVertical,
  Shield, Key, Ban, CheckCircle2, Mail,
  Clock, Tag, Phone, MapPin, Edit3, Trash2,
  Lock, Calendar, Briefcase, Eye, ChevronRight,
  UserCheck, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserCreateForm } from './UserCreateForm';

type UserRole = 'Administrateur' | 'Gestionnaire' | 'Client' | 'Prestataire' | 'Auditeur';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Actif' | 'Suspendu' | 'En attente';
  lastActivity: string;
}

const MOCK_USERS: User[] = [
  { id: 'USR-001', name: 'Adonaï WANZAMBI', email: 'jean.dupont@afreakcare.com', role: 'Administrateur', status: 'Actif', lastActivity: 'Il y a 2 min' },
  { id: 'USR-002', name: 'Marie Luvuezo', email: 'marie.l@prestataire.cd', role: 'Prestataire', status: 'Actif', lastActivity: 'Hier 14:30' },
  { id: 'USR-003', name: 'Robert Oppen', email: 'robert.o@client.be', role: 'Client', status: 'En attente', lastActivity: 'Jamais' },
  { id: 'USR-004', name: 'Sarah Bernard', email: 's.bernard@gestion.com', role: 'Gestionnaire', status: 'Suspendu', lastActivity: '02/05/2024' },
];

export const UsersList: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Tous');

  const filteredUsers = MOCK_USERS.filter(u => 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedRole === 'Tous' || u.role === selectedRole)
  );

  return (
    <div className="space-y-6">
       {/* Header & Actions */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Utilisateurs <Users className="w-8 h-8 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Comptes, Rôles & Permissions Granulaires</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 hover:scale-105 transition-all"
          >
             <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
          </button>
       </div>

       {/* Create User Modal */}
       <AnimatePresence>
         {showAddModal && (
           <UserCreateForm onClose={() => setShowAddModal(false)} />
         )}
       </AnimatePresence>

       {/* Quick Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs Totaux', val: '1,284', color: 'text-green-600' },
            { label: 'Sessions Actives', val: '42', color: 'text-emerald-600' },
            { label: 'Rôles Définis', val: '5', color: 'text-green-600' },
            { label: 'Tentatives Rejetées', val: '12', color: 'text-rose-600' },
          ].map((s, i) => (
             <div key={i} className="p-4 bg-white border border-green-200 rounded-xl shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className={cn("text-xl font-black mt-1", s.color)}>{s.val}</p>
             </div>
          ))}
       </div>

       {/* Filters */}
       <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
             <input 
               type="text" 
               placeholder="Rechercher par nom, email, ID..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm"
             />
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-green-200 shadow-sm">
             {['Tous', 'Administrateur', 'Gestionnaire', 'Client', 'Prestataire'].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all",
                    selectedRole === role ? "bg-green-100 text-green-600 border border-green-200 shadow-sm" : "text-slate-400 hover:text-green-600"
                  )}
                >
                   {role}
                </button>
             ))}
          </div>
          {/* Users Table-like Cards */}
       <div className="space-y-4">
          {filteredUsers.map((user) => (
             <motion.div 
               layout
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               key={user.id} 
               className="fluent-card p-5 group hover:border-green-400 transition-all cursor-pointer rounded-xl border border-green-200 bg-white shadow-sm"
             >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-green-600 font-black text-xl group-hover:scale-110 transition-transform">
                         {user.name.charAt(0)}
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-green-950 uppercase">{user.name}</h4>
                            <div className={cn(
                               "w-2 h-2 rounded-full",
                               user.status === 'Actif' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : user.status === 'Suspendu' ? "bg-rose-500" : "bg-green-300"
                            )} />
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 italic font-medium">{user.email}</p>
                         <div className="flex items-center gap-4 mt-1">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest font-mono">#{user.id}</span>
                            <span className="text-[8px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full uppercase italic border border-green-100 shadow-sm">{user.role}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="text-center md:text-left">
                         <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Dernière activité</p>
                         <p className="text-[10px] font-bold text-slate-600 italic underline decoration-slate-100 underline-offset-4">{user.lastActivity}</p>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                         <div className="p-2 border border-slate-100 rounded-xl text-slate-300 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></div>
                         <div className="p-2 border border-slate-100 rounded-xl text-slate-300 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"><Lock className="w-4 h-4" /></div>
                         <div className="p-2 border border-slate-100 rounded-xl text-slate-300 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"><Ban className="w-4 h-4" /></div>
                      </div>
                      <button className="hidden lg:flex items-center gap-2 px-4 py-2 border border-green-200 rounded-xl text-[10px] font-black text-green-600 uppercase tracking-widest hover:bg-green-50 transition-all shadow-sm bg-white">
                         Profil <ChevronRight className="w-3 h-3" />
                      </button>
                      <button className="p-2.5 text-slate-300 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                   </div>
                </div>
             </motion.div>
          ))}
       </div>
       </div>

       {/* Role Definition Sidebar / Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="p-8 bg-slate-900 rounded-[16px] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
             <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Shield className="w-24 h-24" />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic underline decoration-white/10 underline-offset-8">Configuration des Rôles</h4>
             <div className="space-y-4">
                {[
                  { role: 'Administrateur', access: 'Accès Total', color: 'text-rose-400' },
                  { role: 'Gestionnaire', access: 'Modules Métiers + Rapports', color: 'text-orange-400' },
                  { role: 'Prestataire', access: 'Dossiers Patients + Prestations', color: 'text-green-400' },
                ].map((r, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                      <div>
                         <p className={cn("text-xs font-black uppercase", r.color)}>{r.role}</p>
                         <p className="text-[10px] font-medium text-slate-400 italic mt-0.5">{r.access}</p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-white/20" />
                   </div>
                ))}
             </div>
          </div>

          <div className="fluent-card p-8 flex flex-col items-center justify-center text-center gap-6 rounded-[16px] border border-orange-200 bg-orange-50/10 shadow-sm">
             <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 border border-orange-200 shadow-inner">
                <Clock className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-xl font-black text-orange-950 uppercase tracking-tight">Accès Temporaires</h4>
                <p className="text-[11px] font-medium text-slate-400 italic mt-2 leading-relaxed max-w-xs">Générez des accès restreints dans le temps pour les intervenants externes ou auditeurs ponctuels.</p>
             </div>
             <button className="px-8 py-3 bg-white border border-orange-200 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-sm">Créer un Accès Provisoire</button>
          </div>
       </div>
    </div>
  );
};
