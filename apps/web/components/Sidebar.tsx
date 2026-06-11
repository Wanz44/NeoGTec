/**
 * 🛰️ Fichier : /apps/web/components/Sidebar.tsx
 * 🎯 Objectif : Navigation latérale enrichie par permissions (Anti-Bypass de Boutons)
 * CONFORMITÉ : ARCA-RDC, usePermission() pour le masquage adaptatif du menu
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { 
  Shield, ChevronLeft, ChevronRight, Settings, Lock, Users, CreditCard,
  LayoutDashboard, Video, ClipboardList, Pill, Calculator, Activity,
  AlertTriangle, ShieldCheck, HelpCircle, TrendingUp, BarChart3, Key
} from "lucide-react";
import { usePermission, PERMISSIONS } from "../lib/permissions";

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Charger les permissions requises pour les différents onglets de navigation
  const canViewSaaS = usePermission(PERMISSIONS.SAAS_TENANTS_VIEW);
  const canViewFinance = usePermission(PERMISSIONS.FINANCE_PAY) || usePermission(PERMISSIONS.FINANCE_AUDIT);
  const canViewHôpital = usePermission(PERMISSIONS.PEC_VIEW) || usePermission(PERMISSIONS.MEDECIN_RECORD_ACCESS);
  const canViewBI = usePermission(PERMISSIONS.BI_VIEW);
  const canConfigureSystem = usePermission(PERMISSIONS.SYSTEM_CONFIG_VIEW);

  const menuItems = [
    {
      id: "dashboard",
      name: "Tableau de Bord",
      icon: LayoutDashboard,
      path: "/dashboard",
      allowed: true, // Toujours visible
    },
    {
      id: "saas",
      name: "Console Admin SaaS",
      icon: Shield,
      path: "/saas/tenants",
      allowed: canViewSaaS, // Masqué si pas les permissions d'administration globale
    },
    {
      id: "hopital",
      name: "Gestion des PEC (Hôpital)",
      icon: ClipboardList,
      path: "/hopital/pec",
      allowed: canViewHôpital, // Masqué pour les non-praticiens
    },
    {
      id: "finance",
      name: "Trésorerie & Cotisations",
      icon: Calculator,
      path: "/finance/cotisations",
      allowed: canViewFinance, // Masqué pour les assurés simples
    },
    {
      id: "bi",
      name: "Business Intelligence",
      icon: BarChart3,
      path: "/bi/reports",
      allowed: canViewBI,
    },
    {
      id: "settings",
      name: "Configuration K.12/K.13",
      icon: Settings,
      path: "/settings/governance",
      allowed: canConfigureSystem,
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-full bg-slate-900 border-r border-white/10 text-slate-350 flex flex-col relative shrink-0"
      id="app-navigation-sidebar"
    >
      {/* Bouton Collapse */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center border border-white/20 z-50 shadow-md transition-all cursor-pointer"
        id="sidebar-toggle-btn"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Header Logo */}
      <div className={cn("p-6 flex items-center gap-3 border-b border-white/10", isCollapsed && "justify-center px-0")}>
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-md font-black shrink-0 shadow-lg shadow-indigo-500/30">
          NG
        </div>
        {!isCollapsed && (
          <div className="flex flex-col text-left">
            <span className="text-white font-black text-xs uppercase tracking-wider">NeoGTec Cloud</span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">ARCA RDC V2</span>
          </div>
        )}
      </div>

      {/* Menu Principal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          // Si l'utilisateur n'a pas les droits, le bouton n'est PAS rendu du tout
          if (!item.allowed) return null;

          const isActive = activePath === item.path || activePath.startsWith(item.path);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-xs outline-none cursor-pointer",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
              id={`sidebar-link-${item.id}`}
            >
              <item.icon className={cn("w-4 h-4 shrink-0ID", isActive ? "text-white" : "text-slate-400")} />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer / Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 text-[9px] font-bold text-slate-500 text-center">
          Système Sécurisé Multi-Tenant
        </div>
      )}
    </motion.aside>
  );
};
export default Sidebar;
