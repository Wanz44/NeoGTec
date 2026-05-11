/**
 * 📄 Fichier : /src/App.tsx
 * 🎯 Objectif : Point d'entrée orchestrateur de la plateforme AssurAdvancé.
 * 🔗 Liens : Gère l'état global des modules, la navigation et le rendu des composants Dashboard, Sidebar, Operational.
 * 📅 Version : 1.1.0 | Interface Windows 11 Orange
 */

import React from 'react'; // Bibliothèque cœur de l'UI | 🔗 Fichier lié: package.json
import { motion, AnimatePresence } from 'motion/react'; // Gestion des animations fluides et transitions de routes | 🔗 Fichier lié: package.json
import { 
  Search, // Icône pour la recherche globale | 🔗 Module: lucide-react
  Bell, // Icône pour le centre de notifications | 🔗 Module: lucide-react
  HelpCircle, // Icône pour l'accès FAQ | 🔗 Module: lucide-react
  Info, // Icône d'information système | 🔗 Module: lucide-react
  ChevronDown, // Indication visuelle de déploiement | 🔗 Module: lucide-react
  ExternalLink // Lien vers documentation externe | 🔗 Module: lucide-react
} from 'lucide-react'; // Pack d'icônes standardisé | 🔗 Fichier lié: constants.ts
import { cn } from './lib/utils'; // Utilitaire de concaténation de classes Tailwind | 🔗 Fichier lié: /src/lib/utils.ts
import { Sidebar } from './components/Sidebar'; // Composant de navigation latérale | 🔗 Fichier lié: /src/components/Sidebar.tsx
import { Dashboard } from './components/Dashboard'; // Vue principale des métriques | 🔗 Fichier lié: /src/components/Dashboard.tsx
import { Governance } from './components/Governance'; // Module SaaS & Multi-tenancy | 🔗 Fichier lié: /src/components/Governance.tsx
import { Operational } from './components/Operational'; // Module gestion des sinistres | 🔗 Fichier lié: /src/components/Operational.tsx
import { Pricing } from './components/Pricing';
import { Medical } from './components/Medical';
import { Network } from './components/Network';
import { Financial } from './components/Financial';
import { Telecom } from './components/Telecom';
import { Security } from './components/Security';
import { Audit } from './components/Audit';
import { Alerts } from './components/Alerts';

// Sous-composant pour la section d'aide dynamique (FAQ)
const FAQSection = () => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-orange-950">Questions Fréquentes</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['Comment soumettre un sinistre ?', 'Quels sont les délais de remboursement ?', 'Comment ajouter un bénéficiaire ?', 'Où trouver ma carte de tiers-payant ?'].map((q, i) => (
        <div key={i} className="p-4 bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group">
          <span className="font-semibold text-orange-900">{q}</span>
          <ChevronDown className="w-4 h-4 text-orange-400 group-hover:text-orange-600 transition-colors" />
        </div>
      ))}
    </div>
  </div>
);

// Sous-composant SearchInput : Recherche avancée polices et dossiers
const SearchInput = () => (
  <div className="relative group flex-1 max-w-xl">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 group-focus-within:text-orange-600 transition-colors" />
    <input 
      type="text" 
      placeholder="Rechercher une police, un prestataire ou un dossier..." 
      className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-orange-900/30 text-orange-900 font-medium"
    />
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
      <span className="px-1.5 py-0.5 rounded border border-orange-200 text-[10px] font-bold text-orange-400 bg-orange-50">⌘</span>
      <span className="px-1.5 py-0.5 rounded border border-orange-200 text-[10px] font-bold text-orange-400 bg-orange-50">K</span>
    </div>
  </div>
);

// Composant racine de l'application
export default function App() {
  const [activeModule, setActiveModule] = React.useState('dashboard'); // Hook d'état : Module courant | 🔗 Source: constants.ts
  const [showFAQ, setShowFAQ] = React.useState(false); // Hook d'état : Affichage FAQ | 🔗 Déclencheur: Header Button

  // Logique de routage interne simplifiée pour le rendu des modules
  const renderContent = () => {
    if (showFAQ) return <FAQSection />; // Priorité d'affichage à la FAQ si activée
    
    switch (activeModule) {
      case 'dashboard': return <Dashboard />; // Vue par défaut | 🔗 Fichier lié: Dashboard.tsx
      case 'governance': return <Governance />; // Module 1 | 🔗 Fichier lié: Governance.tsx
      case 'pricing': return <Pricing />;
      case 'medical': return <Medical />;
      case 'operational': return <Operational />; // Module 4 | 🔗 Fichier lié: Operational.tsx
      case 'network': return <Network />;
      case 'financial': return <Financial />;
      case 'telecom': return <Telecom />;
      case 'security': return <Security />;
      case 'audit': return <Audit />;
      case 'alerts': return <Alerts />;
      default: return ( // Fallback pour les modules non encore implémentés (Placeholders)
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <Info className="w-10 h-10 text-orange-300" />
          </div>
          <h3 className="text-xl font-bold text-orange-900 mb-2">Module en Développement</h3>
          <p className="text-orange-900/50 max-w-sm">
            Le module <span className="font-bold text-orange-600">"{activeModule}"</span> est en cours de déploiement sécurisé sur l'architecture multi-tenancy.
          </p>
          <button className="mt-8 flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline">
            Voir la documentation technique <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f3f3] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900 overflow-hidden relative">
      {/* Dynamic background accents for Fluent Design 2 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-300/5 blur-[100px] rounded-full" />
      </div>

      <Sidebar activeModule={activeModule} onModuleChange={(id) => { setActiveModule(id); setShowFAQ(false); }} />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Fluent Header (Acrylic) */}
        <header className="h-16 px-8 flex items-center justify-between material-acrylic border-b border-white/40 sticky top-0 z-50">
          <SearchInput />
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFAQ(!showFAQ)}
              className={cn(
                "p-2 rounded-[8px] transition-all border outline-none font-medium text-sm flex items-center gap-2",
                showFAQ ? "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20" : "bg-white/50 text-orange-900/70 border-white/20 hover:bg-white/80 active:scale-95"
              )}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Aide</span>
            </button>

            <div className="relative group">
              <button className="p-2 bg-white/50 rounded-[8px] border border-white/20 text-orange-900/60 hover:bg-white/80 transition-all relative outline-none active:scale-95">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full border-2 border-white" />
              </button>
              {/* Notifications Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-72 material-mica rounded-[12px] p-4 opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all z-50 border border-white/40">
                <h4 className="text-[11px] font-bold text-orange-950/40 uppercase tracking-widest mb-3">Alertes Récentes</h4>
                <div className="space-y-2">
                  <div className="flex gap-3 p-2 rounded-[8px] hover:bg-orange-50/50 transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                    <p className="text-[11px] text-orange-900/80 leading-relaxed font-medium">Contrat GOUV-2024 en attente de signature électronique (Tenant: AS-912).</p>
                  </div>
                  <div className="flex gap-3 p-2 rounded-[8px] hover:bg-orange-50/50 transition-colors cursor-default">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p className="text-[11px] text-orange-900/80 leading-relaxed font-medium">Audit RGPD hebdomadaire : 100% conformité détectée sur le module Operational.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-px h-6 bg-orange-200/20 mx-1" />

            {/* Profile Section */}
            <div className="flex items-center gap-3 bg-white/40 hover:bg-white/60 p-1 pr-3 rounded-[10px] border border-white/20 cursor-pointer transition-all active:scale-95 group">
               <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-orange-500/30 group-hover:shadow-md transition-shadow">
                AL
               </div>
               <div className="hidden lg:block">
                 <p className="text-[10px] font-bold text-orange-950 uppercase tracking-tight leading-none mb-0.5">Adonai L.</p>
                 <p className="text-[9px] font-medium text-orange-600/70 leading-none">Superviseur Cloud</p>
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={showFAQ ? 'faq' : activeModule}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
