import React from 'react';
import { 
  ShieldAlert, LayoutDashboard, Database, 
  Settings, Radio, HelpCircle, ArrowLeft, 
  Terminal, ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarSuperAdminProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExit: () => void;
  godModeActive: boolean;
}

export const SidebarSuperAdmin: React.FC<SidebarSuperAdminProps> = ({
  activeTab,
  setActiveTab,
  onExit,
  godModeActive
}) => {
  const menuItems = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'tenants', name: 'Locataires & MRR', icon: Database },
    { id: 'alerts', name: 'Alertes & Syslog', icon: ShieldAlert },
    { id: 'compliance', name: 'Régulateur ARCA', icon: ShieldCheck },
  ];

  return (
    <aside id="sidebar-super-admin" className="col-span-12 lg:col-span-3 xl:col-span-2 flex flex-col bg-slate-950 border border-slate-800 rounded-3xl p-6 text-slate-300 relative overflow-hidden h-[calc(100vh-2rem)] select-none">
      {/* Dynamic ambient glowing backing */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-indigo-600" />
      {/* Background radial soft light */}
      <div className="absolute -top-24 -left-20 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

      {/* Brand Title */}
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          <Terminal className="w-5 h-5 shrink-0" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none">NeoGTec</h3>
          <span className="text-[9px] font-mono font-bold text-red-500 tracking-widest uppercase">Super Admin</span>
        </div>
      </div>

      {/* Security Status Box */}
      <div className={cn(
        "p-4 rounded-2xl mb-6 border transition-all shrink-0",
        godModeActive 
          ? "bg-red-950/40 border-red-500/30 text-red-200" 
          : "bg-slate-900/50 border-slate-800 text-slate-400"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <Radio className={cn("w-3.5 h-3.5 shrink-0", godModeActive ? "text-red-400 animate-pulse" : "text-emerald-400")} />
          <span className="text-[10px] font-black uppercase tracking-wider">État RLS &amp; Audits</span>
        </div>
        <p className="text-[9.5px] font-medium leading-relaxed">
          {godModeActive ? 'GOD MODE ACTIF - RLS Outrepassé' : 'Sécurité Standard active'}
        </p>
      </div>

      {/* Main Nav */}
      <nav id="super-admin-nav" className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
        <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block px-2 mb-2 font-mono">Consoles</span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left outline-none relative group cursor-pointer",
                isActive 
                  ? "bg-slate-900 border border-slate-800 text-white shadow-xl" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-red-500" : "text-slate-500")} />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom control */}
      <div className="mt-auto space-y-2 shrink-0 pt-6 border-t border-slate-900">
        <button
          onClick={onExit}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-350 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-150 active:scale-98 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>Espace Assuré</span>
        </button>
        <div className="text-center text-[8.5px] text-slate-600 font-mono">
          Nerve v2.6.14-prod
        </div>
      </div>
    </aside>
  );
};
