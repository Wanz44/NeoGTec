/**
 * 📄 Fichier : /src/frontend/components/Sidebar.tsx
 * 🎯 Objectif : Barre de navigation latérale dynamique pour la plateforme multi-modulaire.
 * 🔗 Liens : Reçoit l'état actif de /src/App.tsx et utilise les définitions de /src/frontend/constants.ts
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { MODULES, Module } from '../constants';
import { useLanguage } from '../lib/LanguageContext';
import { useApp } from '../lib/AppContext';
import { 
  Shield, ChevronLeft, ChevronRight, Menu, Search, Key, History as HistoryIcon, Settings, Lock, 
  ShieldCheck, ShieldAlert, BarChart3, Users, FileText, AlertCircle, Activity as ActivityIcon, 
  Plus, Clock, LayoutDashboard, Mail, Megaphone, Share2, PhoneCall, TrendingUp, HelpCircle,
  Cpu, Video, ClipboardList, Pill, CreditCard, Heart, Stethoscope,
  Building2, MapPin, FileSignature, TabletSmartphone, Star, Calculator, LogOut
} from 'lucide-react'; 

interface SidebarProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
  onLogout?: () => void;
}

const SUB_MODULES_CONTRACTS = [
  { id: 'contracts-config', name: 'Offres & Barèmes', icon: FileText },
  { id: 'consumption-list', name: 'Consommations', icon: ActivityIcon },
  { id: 'managers-list', name: 'Gestionnaires', icon: Users },
];

const SUB_MODULES_RECLAMATION = [
  { id: 'reclamation-submit', name: 'Soumission', icon: Plus },
  { id: 'reclamation-followup', name: 'Suivie', icon: Clock },
  { id: 'reclamation-dashboard', name: 'Tableau de bord', icon: LayoutDashboard },
];

const SUB_MODULES_CRM = [
  { id: 'crm-marketing', name: 'Marketing & PUB', icon: Megaphone },
  { id: 'crm-performance', name: 'Gestion des performances', icon: TrendingUp },
  { id: 'crm-faq', name: 'FAQ', icon: HelpCircle },
  { id: 'crm-global-perf', name: 'Performance', icon: BarChart3 },
];

const SUB_MODULES_TELEMEDICINE = [
  { id: 'tele-consultation', name: 'Consultation', icon: Video },
  { id: 'tele-medical-records', name: 'Dossiers Patients', icon: ClipboardList },
  { id: 'tele-prescription', name: 'Ordonnances', icon: Pill },
  { id: 'tele-history', name: 'Tableau de bord', icon: ActivityIcon },
];

const SUB_MODULES_BI = [
  { id: 'bi-global', name: 'Activité Globale', icon: LayoutDashboard },
  { id: 'bi-fraud', name: 'Détection Fraude', icon: ShieldAlert },
  { id: 'bi-performance', name: 'Perf. Partenaires', icon: BarChart3 },
  { id: 'bi-forecasting', name: 'Prévisions Coûts', icon: TrendingUp },
];

const SUB_MODULES_BILLING = [
  { id: 'billing-contributions', name: 'Suivi Cotisations', icon: ClipboardList },
  { id: 'billing-mobile-money', name: 'Mobile Money', icon: TabletSmartphone },
  { id: 'billing-reconciliation', name: 'Réconciliation', icon: Calculator },
  { id: 'billing-tax', name: 'Rapports Fiscaux', icon: FileText },
];

const SUB_MODULES_CLAIMS = [
  { id: 'claims-declaration', name: 'Déclaration', icon: Plus },
  { id: 'claims-preauth', name: 'Pré-autorisations & Plafonds', icon: ShieldAlert },
  { id: 'claims-workflow', name: 'Suivi Dossier', icon: Clock },
  { id: 'claims-expertise', name: 'Expertise Médicale', icon: Stethoscope },
  { id: 'claims-litigation', name: 'Contentieux', icon: Mail },
];

const SUB_MODULES_PARTNERS = [
  { id: 'partners-directory', name: 'Référentiel', icon: MapPin },
  { id: 'partners-contracting', name: 'Conventionnement', icon: FileSignature },
  { id: 'partners-portal', name: 'Portail Prestataire', icon: TabletSmartphone },
  { id: 'partners-quality', name: 'Contrôle Qualité', icon: Star },
  { id: 'partners-tariffs', name: 'Gestion des Tarifs', icon: Calculator },
];

const SUB_MODULES_SYSTEM = [
  { id: 'governance', name: 'Paramétrage & Governance', icon: Settings },
  { id: 'team-permissions', name: 'Module K.13 (Équipe & Permissions)', icon: Users },
  { id: 'users-list', name: 'Utilisateurs & Rôles', icon: Users },
  { id: 'users-digital', name: 'Inscription Digitale', icon: Plus },
  { id: 'users-selfcare', name: 'Portail Self-Care', icon: LayoutDashboard },
  { id: 'users-card', name: 'Cartes Virtuelles', icon: CreditCard },
  { id: 'users-beneficiaries', name: 'Ayants-Droit', icon: Heart },
  { id: 'users-security', name: 'Sécurité & MFA', icon: Lock },
  { id: 'users-logs', name: 'Logs & Audits', icon: HistoryIcon },
  { id: 'system-config', name: 'Monitoring & Système', icon: ShieldCheck },
  { id: 'alerts', name: 'Surveillance & Alertes', icon: ShieldAlert },
  { id: 'admin', name: 'Privilèges & Accès', icon: Shield },
];

const SYSTEM_CHILDREN_IDS = SUB_MODULES_SYSTEM.map(s => s.id);
const HIDDEN_IDS = [...SYSTEM_CHILDREN_IDS];

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange, onLogout }) => {
  const { t } = useLanguage();
  const { currentUser } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const handleModuleClick = (moduleId: string) => {
    if (['settings', 'contracts', 'reclamation', 'crm', 'telemedicine', 'bi', 'partners', 'payment', 'claims', 'integrations'].includes(moduleId)) {
      setExpandedModules(prev => ({
        ...prev,
        [moduleId]: !prev[moduleId]
      }));
    }
    if (moduleId === 'settings') {
      onModuleChange('governance');
    } else {
      onModuleChange(moduleId);
    }
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="h-full relative z-20"
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-5 top-8 w-11 h-11 bg-green-600 rounded-md flex items-center justify-center text-white shadow-[0_8px_25px_rgba(17,127,2,0.6)] border-2 border-white z-[150] hover:scale-110 active:scale-95 transition-all group ring-4 ring-green-500/30"
      >
        {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      <div className="h-full material-mica border border-white/20 flex flex-col overflow-hidden rounded-lg shadow-2xl">
        <div className={cn("p-8 flex flex-col items-center gap-4 border-b border-black/5 bg-green-50/10", isCollapsed && "justify-center px-0 py-5")}>
          <div className={cn("rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black shadow-xl shadow-green-500/30 shrink-0 transition-all duration-500 ease-in-out", 
            isCollapsed ? "w-10 h-10 text-[10px] border-2 border-white/50" : "w-[120px] h-[120px] text-4xl border-[6px] border-white/80")}>
            {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AL'}
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center w-full">
              <p className="text-[11px] font-black text-green-950 uppercase tracking-widest leading-none mb-1">{currentUser?.name || 'Utilisateur'}</p>
              <p className="text-[8px] text-green-800 font-bold uppercase tracking-[0.2em] opacity-60 truncate max-w-full px-1">{currentUser?.email || 'admin@neogtec.com'}</p>
            </motion.div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2 py-4 custom-scrollbar overflow-x-hidden">
          {(() => {
            const filteredModules = MODULES.filter(m => !HIDDEN_IDS.includes(m.id));

            return filteredModules.map((module, mIdx) => {
              const letter = String.fromCharCode(65 + mIdx);
              const isSettingsModule = module.id === 'settings';
              const isContractsModule = module.id === 'contracts';
              const isReclamationModule = module.id === 'reclamation';
              const isCRMModule = module.id === 'crm';
              const isTelemedicineModule = module.id === 'telemedicine';
              const isBIModule = module.id === 'bi';
              const isPartnersModule = module.id === 'partners';
              const isPaymentModule = module.id === 'payment';
              const isClaimsModule = module.id === 'claims';
              
              const allSubs = [
                ...(isContractsModule ? SUB_MODULES_CONTRACTS : []),
                ...(isReclamationModule ? SUB_MODULES_RECLAMATION : []),
                ...(isCRMModule ? SUB_MODULES_CRM : []),
                ...(isTelemedicineModule ? SUB_MODULES_TELEMEDICINE : []),
                ...(isBIModule ? SUB_MODULES_BI : []),
                ...(isPartnersModule ? SUB_MODULES_PARTNERS : []),
                ...(isPaymentModule ? SUB_MODULES_BILLING : []),
                ...(isClaimsModule ? SUB_MODULES_CLAIMS : []),
                ...(isSettingsModule ? SUB_MODULES_SYSTEM : [])
              ];

              return (
                <div key={module.id} className="flex flex-col gap-1">
                  <ModuleItem 
                    module={module} 
                    isActive={activeModule === module.id || allSubs.some(s => s.id === activeModule)}
                    isCollapsed={isCollapsed}
                    onClick={() => handleModuleClick(module.id)}
                    letter={letter}
                  />

                  <AnimatePresence>
                    {expandedModules[module.id] && allSubs.length > 0 && !isCollapsed && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-1 mt-1 pl-10"
                      >
                        {allSubs.map((sub, sidx) => (
                          <button
                            key={sub.id}
                            onClick={() => onModuleChange(sub.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all text-left text-[11px] font-medium outline-none",
                              activeModule === sub.id ? "text-green-600 bg-green-50" : "text-slate-500 hover:bg-green-50/50"
                            )}
                          >
                            <span className="text-[9px] font-bold text-green-400 w-4">{sidx + 1}.</span>
                            <sub.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{t('submodules.' + sub.id, sub.name)}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            });
          })()}
        </div>

        {/* Dynamic Sticky Bottom Logout Button for other roles */}
        <div className="p-3 border-t border-black/5 bg-green-50/10 shrink-0">
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-xs font-bold text-rose-600 border border-rose-200/50 bg-rose-50/20 hover:text-rose-700 transition-all text-left outline-none cursor-pointer",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Déconnexion de la plateforme" : ""}
          >
            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
            {!isCollapsed && <span>Déconnexion</span>}
          </motion.button>
        </div>

      </div>
    </motion.aside>
  );
};

const ModuleItem = ({ module, isActive, isCollapsed, onClick, letter }: { module: Module; isActive: boolean; isCollapsed: boolean; onClick: () => void; letter: string }) => {
  const Icon = module.icon;
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? `${letter}. ${t('modules.' + module.id, module.name)}` : ""}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group text-left outline-none relative",
        isActive 
          ? "bg-green-600 text-white shadow-lg shadow-green-600/20" 
          : "text-slate-600 hover:bg-white/50 active:scale-[0.98]",
        isCollapsed && "justify-center px-0"
      )}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn(
          "text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded border",
          isActive ? "border-white/40 text-white/90" : "border-green-200 text-green-400"
        )}>
          {letter}
        </span>
        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-green-600/80 group-hover:scale-110 transition-transform")} />
      </div>
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[13px] font-medium tracking-tight whitespace-nowrap overflow-hidden"
        >
          {t('modules.' + module.id, module.name)}
        </motion.span>
      )}
      {isActive && !isCollapsed && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-[-4px] w-1 h-4 bg-green-600 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};
