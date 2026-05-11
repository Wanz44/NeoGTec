/**
 * 📄 Fichier : /src/components/Sidebar.tsx
 * 🎯 Objectif : Barre de navigation latérale dynamique pour la plateforme multi-modulaire.
 * 🔗 Liens : Reçoit l'état actif de /src/App.tsx et utilise les définitions de /src/constants.ts
 */

import React from 'react'; // Bibliothèque UI
import { motion } from 'motion/react'; // Bibliothèque d'animation | 🔗 Fichier lié: package.json
import { cn } from '../lib/utils'; // Utilitaire de classes dynamiques | 🔗 Fichier lié: /src/lib/utils.ts
import { MODULES, Module } from '../constants'; // Liste des 15 modules | 🔗 Fichier lié: /src/constants.ts
import { Shield, ChevronRight } from 'lucide-react'; // Icônes structurales | 🔗 Module: lucide-react

// Interface des propriétés passées au composant Sidebar
interface SidebarProps {
  activeModule: string; // ID du module actuellement sélectionné | 🔗 Provient de: /src/App.tsx
  onModuleChange: (id: string) => void; // Fonction de rappel pour changer de vue | 🔗 Provient de: /src/App.tsx
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  return (
    <aside className="w-64 material-mica border-r border-white/20 flex flex-col h-screen overflow-hidden z-20">
      {/* Zone Branding / Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500 rounded-[10px] flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Shield className="text-white w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-orange-600 to-orange-400 tracking-tight">
          AssurAdvancé
        </h1>
      </div>

      {/* Conteneur des listes de modules avec scroll interne si nécessaire */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4 custom-scrollbar">
        {/* Section 1 : Cœur Métier */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold text-orange-950/30 uppercase tracking-[0.15em]">Cœur de métier</p>
          <div className="space-y-0.5">
            {MODULES.filter(m => m.category === 'core').map(module => (
              <ModuleItem 
                key={module.id} 
                module={module} 
                isActive={activeModule === module.id}
                onClick={() => onModuleChange(module.id)}
              />
            ))}
          </div>
        </div>

        {/* Section 2 : Armure Système */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold text-orange-950/30 uppercase tracking-[0.15em]">Armure Système</p>
          <div className="space-y-0.5">
            {MODULES.filter(m => m.category !== 'core').map(module => (
              <ModuleItem 
                key={module.id} 
                module={module} 
                isActive={activeModule === module.id}
                onClick={() => onModuleChange(module.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Zone Footer Utilisateur */}
      <div className="p-4 material-acrylic border-t border-white/20">
        <div className="flex items-center gap-3 px-2 py-2 rounded-[8px] hover:bg-white/40 transition-all cursor-pointer group active:scale-[0.98]">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs shadow-inner border border-orange-200/50">
            AL
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[11px] font-bold text-orange-950 truncate">Adonai L.</p>
            <p className="text-[9px] text-orange-600/70 font-medium truncate tracking-tight">ID: AS-912</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </aside>
  );
};

// Sous-composant pour un bouton de menu module individuel
const ModuleItem = ({ module, isActive, onClick }: { module: Module; isActive: boolean; onClick: () => void; key?: string }) => {
  const Icon = module.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-[8px] transition-all duration-200 group text-left outline-none relative",
        isActive 
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
          : "text-slate-600 hover:bg-white/50 active:scale-[0.98]"
      )}
    >
      <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-orange-500/80 group-hover:scale-110 transition-transform")} />
      <span className="text-[13px] font-medium tracking-tight">{module.name}</span>
      {isActive && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-[-12px] w-1 h-3 bg-orange-600 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};
