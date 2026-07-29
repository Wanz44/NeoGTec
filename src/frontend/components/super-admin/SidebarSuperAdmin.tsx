/**
 * 🎨 Fichier : /src/frontend/components/super-admin/SidebarSuperAdmin.tsx
 * 🛠️ Configuration : Navigation de l'administration NeoGTec 240px en mode Clair.
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, Users, FileText, ClipboardCheck, Database, AlertCircle,
  Wallet, FileCheck, Video, CircleDot, MessageSquare, Radio, UserCheck,
  Shield, ShieldCheck, Settings, LogOut, Network, Building2, Stethoscope,
  TrendingUp, Cpu, Clock, Sliders, Mail, Lock, AlertTriangle
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

  const menuSections = [
    {
      title: "PILOTAGE & ESPACES",
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutGrid },
        { id: 'comptes-reseau', label: 'Comptes réseau', icon: Network },
        { id: 'entreprise', label: 'Espace Entreprise', icon: Building2 },
        { id: 'prestataire', label: 'Espace Prestataire', icon: Stethoscope },
        { id: 'assure', label: 'Espace Assuré', icon: UserCheck },
      ]
    },
    {
      title: "GESTION MÉTIER",
      items: [
        { id: 'contracts', label: 'Contrats & Polices', icon: FileText },
        { id: 'claims', label: 'Sinistres', icon: ClipboardCheck },
        { id: 'pec', label: 'Prises en charge (PEC)', icon: FileCheck },
        { id: 'derogations', label: 'Dérogations', icon: AlertCircle },
        { id: 'reclamation', label: 'Réclamations', icon: MessageSquare },
        { id: 'referentiel', label: 'Référentiel médical', icon: Database },
      ]
    },
    {
      title: "FINANCE & PARTENAIRES",
      items: [
        { id: 'payment', label: 'Finance & Cotisations', icon: Wallet },
        { id: 'partners', label: 'Partenaires de soins', icon: Users },
        { id: 'crm', label: 'CRM & Commercial', icon: CircleDot },
        { id: 'telemedicine', label: 'Téléconsultations', icon: Video },
      ]
    },
    {
      title: "COMMUNICATION & INTEL",
      items: [
        { id: 'messagerie', label: 'Messagerie', icon: Mail },
        { id: 'controle', label: 'Contrôle & Comms', icon: Radio },
        { id: 'bi', label: 'Business Intelligence', icon: TrendingUp },
        { id: 'integrations', label: 'Interopérabilité APIs', icon: Cpu },
      ]
    },
    {
      title: "SÉCURITÉ & CONFIG",
      items: [
        { id: 'governance', label: 'Gouvernance', icon: Shield },
        { id: 'securite', label: 'Sécurité & Audit', icon: Lock },
        { id: 'alerts', label: 'Surveillance & Alertes', icon: AlertTriangle },
        { id: 'taches', label: 'Tâches planifiées', icon: Clock },
        { id: 'system-config', label: 'Paramètres système', icon: Sliders },
        { id: 'users-mgmt', label: 'Utilisateurs & Rôles', icon: ShieldCheck },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#061A10] flex flex-col z-40 select-none text-white border-r border-[#0E2E1D]">
      {/* Brand logo header exact as screenshot */}
      <div className="p-5 border-b border-[#0E2E1D] bg-[#061A10]">
        <h3 className="text-sm font-serif font-bold text-[#E5D298] tracking-tight">NeoGTec Assureur</h3>
        <span className="text-[11px] text-[#7A9887] font-medium block mt-0.5">Back-office Portale</span>
      </div>

      {/* Main Nav items */}
      <nav className="p-2.5 space-y-4 flex-1 bg-[#061A10] overflow-y-auto custom-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#7A9887] mb-1">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all text-left outline-none cursor-pointer relative",
                    isActive 
                      ? "bg-[#1B3626] text-[#E5D298] font-bold shadow-2xs" 
                      : "text-[#B0C4B8] hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-colors z-10", isActive ? "text-[#E5D298]" : "text-[#7A9887]")} />
                  <span className="z-10 truncate">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User profile avatar info exact as screenshot */}
      <div className="p-4 border-t border-[#0E2E1D] bg-[#061A10] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#D4C385] text-[#061A10] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs font-serif">
          A
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate leading-tight">
            Admin User
          </p>
          <p className="text-[10.5px] text-[#7A9887] truncate leading-tight font-medium mt-0.5">
            Administrator
          </p>
        </div>
      </div>
    </aside>
  );
};
