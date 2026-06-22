/**
 * 🎨 Fichier : /src/frontend/components/super-admin/SidebarSuperAdmin.tsx
 * 🛠️ Configuration : Navigation de l'administration NeoGTec 240px en mode Clair.
 */

import React from 'react';
import { 
  Home, BarChart3, Users, FileCheck, Settings, Info, LogOut, HelpCircle, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

interface SidebarSuperAdminProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExit: () => void;
  godModeActive?: boolean;
}

export const SidebarSuperAdmin: React.FC<SidebarSuperAdminProps> = ({
  activeTab,
  setActiveTab,
  onExit,
  godModeActive = false
}) => {
  const { currentUser } = useApp();
  const handleNavClick = (id: string) => {
    if (id === 'retour') {
      onExit();
    } else {
      setActiveTab(id);
    }
  };

  const navItems = [
    { id: 'maison', label: 'Espace Maison', icon: Home },
    { id: 'analytics', label: 'Analytique Réseau', icon: BarChart3 },
    { id: 'tenants', label: 'Clients / Tenants', icon: Users },
    { id: 'taches', label: 'Tâches ARCA', icon: FileCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-40 select-none">
      {/* Brand logo */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3 bg-white">
        <div className="w-8 h-8 rounded-lg bg-[#00A86B] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#00A86B]/20">
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
      <nav className="p-3 space-y-1 flex-1 bg-white">
        <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-widest block px-3 py-1 mb-1">
          Principal
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left outline-none cursor-pointer",
                isActive 
                  ? "bg-[#00A86B]/10 text-[#00A86B] font-bold" 
                  : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "stroke-[#00A86B]" : "text-slate-400")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Sticky parameters */}
      <div className="mt-auto p-3 border-t border-slate-200 space-y-1 bg-white">
        <button
          onClick={() => handleNavClick('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left outline-none cursor-pointer",
            activeTab === 'settings' 
              ? "bg-[#00A86B]/10 text-[#00A86B] font-bold" 
              : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
          )}
        >
          <Settings className={cn("w-4 h-4", activeTab === 'settings' ? "stroke-[#00A86B]" : "text-slate-400")} />
          <span>Paramètres</span>
        </button>

        <button
          onClick={() => handleNavClick('retour')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left outline-none cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Retour</span>
        </button>

        {/* User profile avatar info */}
        <div className="mt-2 pt-3 border-t border-slate-200 px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00A86B]/15 border border-[#00A86B]/30 flex items-center justify-center font-bold text-xs text-[#00A86B] shrink-0 uppercase">
            {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'AN'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-800 truncate leading-none mb-0.5">
              {currentUser?.name || 'Admin NeoGTec'}
            </p>
            <p className="text-[9px] font-mono text-slate-450 truncate leading-none lowercase">
              {currentUser?.email || 'admin@neogtec.cd'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
