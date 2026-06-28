/**
 * 🎨 Fichier : /src/frontend/components/super-admin/SidebarSuperAdmin.tsx
 * 🛠️ Configuration : Navigation de l'administration NeoGTec 240px en mode Clair.
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, BarChart3, Users, FileCheck, Settings, Info, LogOut, HelpCircle, AlertCircle, Shield, Lock, Network,
  LayoutDashboard, FileText, CreditCard, UserCheck, Stethoscope, ShieldCheck, Building2, ShieldAlert, Cpu, Heart, CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

interface SidebarSuperAdminProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExit: () => void;
  onLogout?: () => void;
  godModeActive?: boolean;
}

export const SidebarSuperAdmin: React.FC<SidebarSuperAdminProps> = ({
  activeTab,
  setActiveTab,
  onExit,
  onLogout,
  godModeActive = false
}) => {
  const { currentUser, quickSwitchRole } = useApp();
  const handleNavClick = (id: string) => {
    if (id === 'retour') {
      onExit();
    } else {
      setActiveTab(id);
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const categories = [
    {
      title: 'Modules Métier (Core)',
      items: [
        { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
        { id: 'contracts', label: 'Gestion Polices & Sinistres', icon: FileText },
        { id: 'reclamation', label: 'Module Réclamation', icon: AlertCircle },
        { id: 'payment', label: 'Gestion Financière', icon: CreditCard },
        { id: 'crm', label: 'CRM & Commercial', icon: UserCheck },
        { id: 'telemedicine', label: 'Téléconsultation', icon: Stethoscope },
        { id: 'claims', label: 'Sinistres & Contentieux', icon: ShieldCheck },
        { id: 'partners', label: 'Partenaires de Soins', icon: Building2 },
      ]
    },
    {
      title: 'Modules Système (System)',
      items: [
        { id: 'integrations', label: 'Interopérabilité APIs', icon: Network },
        { id: 'bi', label: 'Business Intelligence & BI', icon: BarChart3 },
        { id: 'system-config', label: 'Paramètres Système', icon: Cpu },
        { id: 'governance', label: 'Gouvernance Multi-Entités', icon: Shield },
        { id: 'alerts', label: 'Alertes Critiques', icon: ShieldAlert },
        { id: 'admin', label: 'Administration Système', icon: Lock },
        { id: 'users-list', label: 'Utilisateurs & Rôles', icon: Users },
      ]
    },
    {
      title: 'Contrôles Système',
      items: [
        { id: 'taches', label: 'Tâches ARCA & Cron', icon: FileCheck },
        { id: 'securite', label: 'Sécurité & Bypass RLS', icon: Lock },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-40 select-none">
      {/* Brand logo */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3 bg-white">
        <div className="w-8 h-8 rounded-lg bg-[#00A86B] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#00A86B]/20 animate-pulse">
          NG
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">NeoGTec</h3>
          <span className="text-[9px] font-mono text-[#00A86B] font-bold uppercase tracking-widest mt-1 block">Super Admin</span>
        </div>
      </div>

      {godModeActive && (
        <div className="m-3 p-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 flex items-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="text-[9.5px] font-bold uppercase font-mono">BYPASS RLS ACTIF</span>
        </div>
      )}

      {/* Main Nav items */}
      <nav className="p-3 space-y-6 flex-1 bg-white overflow-y-auto custom-scrollbar">
        {categories.map((category, catIdx) => (
          <div key={category.title} className="space-y-2">
            <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-widest block px-3 py-1 mb-2">
              {category.title}
            </span>
            {category.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const globalIndex = catIdx * 10 + itemIdx;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: globalIndex * 0.012 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left outline-none cursor-pointer relative",
                    isActive 
                      ? "text-[#00A86B] font-bold" 
                      : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                  )}
                >
                  {/* Sliding active highlight background */}
                  {isActive && (
                    <motion.div
                      layoutId="active-bg-super"
                      className="absolute inset-0 bg-[#00A86B]/10 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  {/* Left green active indicator pin */}
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator-pin"
                      className="absolute left-1.5 top-3.5 bottom-3.5 w-[3px] bg-[#00A86B] rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <Icon className={cn("w-4 h-4 shrink-0 transition-colors z-10", isActive ? "stroke-[#00A86B]" : "text-slate-400")} />
                  <span className="z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Sticky parameters */}
      <div className="mt-auto p-3.5 border-t border-slate-200 space-y-2 bg-white">
        <motion.button
          onClick={() => handleNavClick('settings')}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left outline-none cursor-pointer relative",
            activeTab === 'settings' 
              ? "text-[#00A86B] font-bold" 
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
          )}
        >
          {activeTab === 'settings' && (
            <motion.div
              layoutId="active-bg-super"
              className="absolute inset-0 bg-[#00A86B]/10 rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
          {activeTab === 'settings' && (
            <motion.div
              layoutId="active-indicator-pin"
              className="absolute left-1.5 top-3.5 bottom-3.5 w-[3px] bg-[#00A86B] rounded-full"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            />
          )}
          <Settings className={cn("w-4 h-4 z-10", activeTab === 'settings' ? "stroke-[#00A86B]" : "text-slate-450")} />
          <span className="z-10">Paramètres</span>
        </motion.button>

        <motion.button
          onClick={handleLogoutClick}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(254, 242, 242, 1)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 border border-rose-200/60 bg-rose-50/40 hover:text-rose-700 transition-all text-left outline-none cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Déconnexion</span>
        </motion.button>

        {/* User profile avatar info & switcher */}
        <div className="mt-2 pt-3 border-t border-slate-200 px-2 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00A86B]/15 border border-[#00A86B]/30 flex items-center justify-center font-bold text-xs text-[#00A86B] shrink-0 uppercase">
              {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'AN'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-800 truncate leading-none mb-0.5">
                {currentUser?.name || 'Admin NeoGTec'}
              </p>
              <p className="text-[9px] font-mono text-slate-400 truncate leading-none lowercase">
                {currentUser?.email || 'admin@neogtec.cd'}
              </p>
            </div>
          </div>
          
          <div className="mt-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Passer au rôle :</span>
            <select
              value={currentUser?.role || ''}
              onChange={(e) => {
                if (quickSwitchRole) {
                  quickSwitchRole(e.target.value as any);
                }
              }}
              className="w-full text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded p-1.5 outline-none focus:border-[#00A86B]/50 transition-colors cursor-pointer select-none"
            >
              <option value="SUPER_ADMIN">👑 Paul (Super Admin)</option>
              <option value="RH_ENTREPRISE">🏢 Marie (RH Acme)</option>
              <option value="SUPPORT_CLIENT">📞 Jean (Support)</option>
              <option value="MEDECIN">🩺 Dr. Sarah (Médecin)</option>
              <option value="ADMIN_PRESTATAIRE">🏥 Admin Hôpital Ngaliema</option>
              <option value="PHARMACIEN">💊 Pharmacien KinPharma</option>
              <option value="FINANCE_MANAGER">💰 Fin. Sunu (Finance)</option>
              <option value="AUDITEUR_EXTERNE">🔎 Auditeur CNAM (Audit)</option>
              <option value="ASSURE">📱 Jean PATIENT (Assuré)</option>
              <option value="SUPPORT_NEOGTEC">🛠️ Support NeoGTec N1</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
