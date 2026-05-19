/**
 * 📄 Fichier : /src/frontend/components/Privileges.tsx
 * 🎯 Objectif : Gestion fine des privilèges par rôle (RBAC Matrix).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, Lock, Unlock, 
  Settings, Users, Eye, Edit3, Trash2,
  CheckCircle2, AlertTriangle, Zap, Info,
  ChevronRight, Save, RefreshCw, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

type PermissionLevel = 'none' | 'read' | 'write' | 'full';

interface ModulePermission {
  moduleId: string;
  moduleName: string;
  level: PermissionLevel;
}

interface RoleConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: ModulePermission[];
}

const MODULES_LIST = [
  { id: 'contracts', name: 'Contrats' },
  { id: 'claims', name: 'Sinistres' },
  { id: 'crm', name: 'CRM' },
  { id: 'financial', name: 'Finances' },
  { id: 'medical', name: 'Médical' },
  { id: 'telemedicine', name: 'Télémédecine' },
  { id: 'bi', name: 'Business Intelligence' },
  { id: 'system', name: 'Système & Config' },
];

const INITIAL_ROLES: RoleConfig[] = [
  {
    id: 'ROLE-01',
    name: 'Super Admin',
    description: 'Accès sans restriction à l\'ensemble de l\'écosystème AssurAdvancé.',
    color: 'bg-rose-500',
    permissions: MODULES_LIST.map(m => ({ moduleId: m.id, moduleName: m.name, level: 'full' }))
  },
  {
    id: 'ROLE-02',
    name: 'Gestionnaire Sinistres',
    description: 'Gestion opérationnelle des dossiers et validation des remboursements.',
    color: 'bg-emerald-500',
    permissions: MODULES_LIST.map(m => ({ 
      moduleId: m.id, 
      moduleName: m.name, 
      level: m.id === 'claims' ? 'full' : m.id === 'contracts' ? 'write' : 'read' 
    }))
  },
  {
    id: 'ROLE-03',
    name: 'Auditeur Externe',
    description: 'Consultation des logs et rapports de conformité uniquement.',
    color: 'bg-indigo-500',
    permissions: MODULES_LIST.map(m => ({ 
      moduleId: m.id, 
      moduleName: m.name, 
      level: m.id === 'system' || m.id === 'bi' ? 'read' : 'none' 
    }))
  }
];

export const Privileges: React.FC = () => {
  const [roles, setRoles] = useState<RoleConfig[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<RoleConfig>(INITIAL_ROLES[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handlePermissionChange = (moduleId: string, level: PermissionLevel) => {
    const updatedRole = {
      ...selectedRole,
      permissions: selectedRole.permissions.map(p => 
        p.moduleId === moduleId ? { ...p, level } : p
      )
    };
    setSelectedRole(updatedRole);
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const getPermissionBadgeStyle = (level: PermissionLevel) => {
    switch (level) {
      case 'full': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'write': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'read': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-400 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
              Privilèges & Rôles <ShieldCheck className="w-8 h-8 text-green-500 fill-green-500/10" />
           </h2>
           <p className="text-green-900/50 font-medium tracking-tight uppercase italic underline decoration-green-200 underline-offset-4 decoration-2">Contrôle d'Accès Basé sur les Rôles (RBAC)</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white border border-green-100 text-green-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-green-50 transition-all">
              <RefreshCw className="w-4 h-4" /> Réinitialiser
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
           >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Synchronisation...' : 'Sauvegarder Matrice'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roles Sidebar */}
        <div className="lg:col-span-4 space-y-4">
           {roles.map(role => (
             <div 
               key={role.id}
               onClick={() => setSelectedRole(role)}
               className={cn(
                 "p-5 rounded-[24px] border-2 transition-all cursor-pointer relative overflow-hidden group",
                 selectedRole.id === role.id ? "bg-white border-green-500 shadow-xl" : "bg-white/50 border-transparent hover:border-green-100"
               )}
             >
                <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-5 -mr-8 -mt-8 rounded-full", role.color)} />
                <div className="flex items-center justify-between mb-2">
                   <h4 className="text-sm font-black text-green-950 uppercase">{role.name}</h4>
                   <div className={cn("w-2 h-2 rounded-full", role.color)} />
                </div>
                <p className="text-[10px] font-medium text-slate-400 italic mb-4 leading-relaxed">{role.description}</p>
                <div className="flex items-center gap-3">
                   <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">#{role.id}</span>
                   <span className="text-[9px] font-black text-green-600 uppercase flex items-center gap-1"><Users className="w-3 h-3" /> 12 Membres</span>
                </div>
             </div>
           ))}
           <button className="w-full py-4 border-2 border-dashed border-green-100 rounded-[28px] text-[10px] font-black text-green-300 uppercase tracking-widest hover:border-green-400 hover:text-green-600 transition-all">
              + Définir un Nouveau Rôle
           </button>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-8">
           <div className="fluent-card overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", selectedRole.color)}>
                       <Lock className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-green-950 uppercase tracking-tight">Permissions : {selectedRole.name}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase italic">Configuration granulaire par module</p>
                    </div>
                 </div>
                 <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span className="text-[9px] font-black text-indigo-600 uppercase">AI-Suggested Profile</span>
                 </div>
              </div>

              <div className="divide-y divide-slate-50">
                 {selectedRole.permissions.map((perm) => (
                   <div key={perm.moduleId} className="p-5 flex items-center justify-between group hover:bg-green-50/20 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors">
                            <Layers className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-xs font-black text-green-950 uppercase">{perm.moduleName}</p>
                            <span className="text-[9px] font-mono text-slate-300 uppercase">SYS_MOD_{perm.moduleId}</span>
                         </div>
                      </div>

                      <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-100">
                         {(['none', 'read', 'write', 'full'] as PermissionLevel[]).map((lv) => (
                            <button
                              key={lv}
                              onClick={() => handlePermissionChange(perm.moduleId, lv)}
                              className={cn(
                                "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                perm.level === lv ? getPermissionBadgeStyle(lv) + " shadow-sm border" : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                               {lv === 'none' ? 'Aucun' : lv === 'read' ? 'Lecture' : lv === 'write' ? 'Gestion' : 'Total'}
                            </button>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm relative overflow-hidden group">
                 <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-12 h-12 text-rose-500" />
                 </div>
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <Info className="w-5 h-5 text-indigo-500" />
                       <p className="text-[10px] font-medium italic opacity-90 max-w-sm leading-relaxed text-slate-500">
                          La modification de ces droits impactera instantanément les utilisateurs actifs. Assurez-vous d'avoir validé cette politique avec l'administrateur système (HQ Kinshasa).
                       </p>
                    </div>
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap border border-indigo-700">
                       Historique des Modifs
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
