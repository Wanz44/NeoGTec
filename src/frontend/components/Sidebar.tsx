/**
 * 📄 Fichier : /src/components/Sidebar.tsx
 * 🎯 Objectif : Barre de navigation latérale dynamique pour la plateforme multi-modulaire.
 * 🔗 Liens : Reçoit l'état actif de /src/App.tsx et utilise les définitions de /src/constants.ts
 */

import React, { useState } from 'react'; // Bibliothèque UI
import { motion, AnimatePresence } from 'motion/react'; // Bibliothèque d'animation | 🔗 Fichier lié: package.json
import { cn } from '../lib/utils'; // Utilitaire de classes dynamiques | 🔗 Fichier lié: /src/lib/utils.ts
import { MODULES, Module } from '../constants'; // Liste des 15 modules | 🔗 Fichier lié: /src/constants.ts
import { Shield, ChevronLeft, ChevronRight, Menu, Search, Key, History, Settings, Lock, ShieldCheck, ShieldAlert, BarChart3, Users } from 'lucide-react'; // Icônes structurales | 🔗 Module: lucide-react

// Interface des propriétés passées au composant Sidebar
interface SidebarProps {
  activeModule: string; // ID du module actuellement sélectionné | 🔗 Provient de: /src/App.tsx
  onModuleChange: (id: string) => void; // Fonction de rappel pour changer de vue | 🔗 Provient de: /src/App.tsx
}

const SUB_MODULES_USERS = [
  { id: 'users-list', name: 'Consultation des utilisateurs', icon: Search },
  { id: 'users-security', name: 'Modifier le mot de passe et suppression de compte', icon: Key },
  { id: 'users-logs', name: 'Logs des utilisateurs', icon: History },
];

const SUB_MODULES_SETTINGS = [
  { id: 'governance', name: 'Gouvernance & SAAS', icon: Settings },
  { id: 'security', name: 'Sécurité & Accès', icon: Lock },
  { id: 'audit', name: 'Conformité & Audit', icon: ShieldCheck },
  { id: 'alerts', name: 'Alertes Critiques', icon: ShieldAlert },
  { id: 'bi', name: 'Business Intelligence', icon: BarChart3 },
  { id: 'admin', name: 'Administration Système', icon: Shield },
  { id: 'users-mgmt', name: 'Utilisateurs', icon: Users },
  { id: 'privileges', name: 'Privilèges', icon: ShieldCheck },
];

const SETTINGS_CHILDREN_IDS = SUB_MODULES_SETTINGS.map(s => s.id);

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'users-mgmt' || moduleId === 'settings') {
      setExpandedModules(prev => ({
        ...prev,
        [moduleId]: !prev[moduleId]
      }));
    } else if (!SETTINGS_CHILDREN_IDS.includes(moduleId) && !SUB_MODULES_USERS.map(s => s.id).includes(moduleId)) {
      // Reset only if it's a main module click that's NOT users or settings
      setExpandedModules({});
    }
    onModuleChange(moduleId);
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="h-full relative z-20"
    >
      {/* Bouton de réduction/agrandissement - Bien visible au premier plan, tout en haut */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-5 top-8 w-11 h-11 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-[0_8px_25px_rgba(234,88,12,0.6)] border-2 border-white z-[150] hover:scale-110 active:scale-95 transition-all group ring-4 ring-orange-500/30"
      >
        {isCollapsed ? <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />}
      </button>

      <div className="h-full material-mica border border-white/20 flex flex-col overflow-hidden rounded-2xl shadow-2xl">
        {/* Zone Profil Utilisateur - Agrandie Image, mais Texte réduit x3 sur demande */}
        <div className={cn("p-8 flex flex-col items-center gap-4 border-b border-black/5 bg-orange-50/10", isCollapsed && "justify-center px-0 py-5")}>
          <div className={cn("rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-black shadow-xl shadow-orange-500/30 shrink-0 transition-all duration-500 ease-in-out", 
            isCollapsed ? "w-10 h-10 text-[10px] border-2 border-white/50" : "w-[120px] h-[120px] text-4xl border-[6px] border-white/80")}>
            AL
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center w-full"
            >
              <p className="text-[11px] font-black text-orange-950 uppercase tracking-widest leading-none mb-1">Adonai Lutonadio</p>
              <p className="text-[8px] text-orange-800 font-bold uppercase tracking-[0.2em] opacity-60">adonai@cloud.com</p>
            </motion.div>
          )}
        </div>

        {/* Conteneur des listes de modules avec scroll interne si nécessaire */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4 custom-scrollbar overflow-x-hidden">
          {(() => {
            const categories = Object.entries(
              MODULES.reduce((acc, m) => {
                if (SETTINGS_CHILDREN_IDS.includes(m.id)) return acc;
                if (!acc[m.category]) acc[m.category] = [];
                acc[m.category].push(m);
                return acc;
              }, {} as Record<string, Module[]>)
            );

            return categories.map(([category, modules], catIdx) => {
              const previousModulesCount = categories
                .slice(0, catIdx)
                .reduce((sum, [_, modArr]) => sum + modArr.length, 0);

              return (
                <div key={category}>
                  {!isCollapsed ? (
                    <p className="px-3 mb-2 text-[10px] font-bold text-orange-950/30 uppercase tracking-[0.15em] whitespace-nowrap">
                      {category === 'core' ? 'Cœur de métier' : 'Armure Système'}
                    </p>
                  ) : (
                    <div className="h-4 flex items-center justify-center mb-2">
                      <div className="w-4 h-0.5 bg-orange-500/20 rounded-full" />
                    </div>
                  )}
                  <div className="space-y-1">
                    {modules.map((module, mIdx) => {
                      const letter = String.fromCharCode(65 + previousModulesCount + mIdx);
                      const isUsersModule = module.id === 'users-mgmt';
                      const isSettingsModule = module.id === 'settings';
                      
                      return (
                        <div key={module.id} className="flex flex-col gap-1">
                          <ModuleItem 
                            module={module} 
                            isActive={activeModule === module.id || (isUsersModule && SUB_MODULES_USERS.some(s => s.id === activeModule)) || (isSettingsModule && SETTINGS_CHILDREN_IDS.includes(activeModule))}
                            isCollapsed={isCollapsed}
                            onClick={() => handleModuleClick(module.id)}
                            letter={letter}
                          />

                          <AnimatePresence>
                            {isUsersModule && expandedModules['users-mgmt'] && !isCollapsed && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col gap-1 mt-1 pl-10"
                              >
                                {SUB_MODULES_USERS.map((sub, sidx) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => onModuleChange(sub.id)}
                                    className={cn(
                                      "w-full flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all text-left text-[11px] font-medium outline-none",
                                      activeModule === sub.id ? "text-orange-600 bg-orange-50" : "text-slate-500 hover:bg-orange-50/50"
                                    )}
                                  >
                                    <span className="text-[9px] font-bold text-orange-400 w-4">{sidx + 1}.</span>
                                    <sub.icon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{sub.name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <AnimatePresence>
                            {isSettingsModule && expandedModules['settings'] && !isCollapsed && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col gap-1 mt-1 pl-10"
                              >
                                {SUB_MODULES_SETTINGS.map((sub, sidx) => (
                                  <div key={sub.id} className="flex flex-col gap-1">
                                    <button
                                      onClick={() => handleModuleClick(sub.id)}
                                      className={cn(
                                        "w-full flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all text-left text-[11px] font-medium outline-none",
                                        (activeModule === sub.id || (sub.id === 'users-mgmt' && SUB_MODULES_USERS.some(s => s.id === activeModule))) ? "text-orange-600 bg-orange-50" : "text-slate-500 hover:bg-orange-50/50"
                                      )}
                                    >
                                      <span className="text-[9px] font-bold text-orange-400 w-4">{sidx + 1}.</span>
                                      <sub.icon className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{sub.name}</span>
                                    </button>
                                    
                                    <AnimatePresence>
                                      {sub.id === 'users-mgmt' && expandedModules['users-mgmt'] && (
                                        <motion.div 
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="flex flex-col gap-1 pl-6"
                                        >
                                          {SUB_MODULES_USERS.map((userSub, uidx) => (
                                            <button
                                              key={userSub.id}
                                              onClick={() => onModuleChange(userSub.id)}
                                              className={cn(
                                                "w-full flex items-center gap-2 px-3 py-1 rounded-sm transition-all text-left text-[10px] font-medium outline-none",
                                                activeModule === userSub.id ? "text-orange-500" : "text-slate-400 hover:text-orange-400"
                                              )}
                                            >
                                              <span className="text-[8px] opacity-40">•</span>
                                              <userSub.icon className="w-3 h-3 shrink-0" />
                                              <span className="truncate">{userSub.name}</span>
                                            </button>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </motion.aside>
  );
};

// Sous-composant pour un bouton de menu module individuel
const ModuleItem = ({ module, isActive, isCollapsed, onClick, letter }: { module: Module; isActive: boolean; isCollapsed: boolean; onClick: () => void; letter: string }) => {
  const Icon = module.icon;
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? `${letter}. ${module.name}` : ""}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group text-left outline-none relative",
        isActive 
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
          : "text-slate-600 hover:bg-white/50 active:scale-[0.98]",
        isCollapsed && "justify-center px-0"
      )}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn(
          "text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded border",
          isActive 
            ? "border-white/40 text-white/90" 
            : "border-orange-200 text-orange-400"
        )}>
          {letter}
        </span>
        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-orange-500/80 group-hover:scale-110 transition-transform")} />
      </div>
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[13px] font-medium tracking-tight whitespace-nowrap overflow-hidden"
        >
          {module.name}
        </motion.span>
      )}
      {isActive && !isCollapsed && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-[-4px] w-1 h-4 bg-orange-600 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};
