/**
 * 📄 Fichier : /src/frontend/components/Partners.tsx
 * 🎯 Objectif : Module global de gestion des partenaires hospitaliers.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, MapPin, TabletSmartphone, Star, 
  Calculator, ShieldCheck, Search,
  Navigation, CheckCircle2, LayoutDashboard, FileSignature
} from 'lucide-react';
import { cn } from '../lib/utils';

// Import sub-modules
import { ProvidersDirectory } from './partners/ProvidersDirectory';
import { ContractingDigital } from './partners/ContractingDigital';
import { ProviderPortal } from './partners/ProviderPortal';
import { QualityControl } from './partners/QualityControl';
import { TariffManagement } from './partners/TariffManagement';

export const Partners: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'contracting' | 'portal' | 'quality' | 'tariffs'>('directory');

  const tabs = [
    { id: 'directory', label: 'Référentiel', icon: MapPin },
    { id: 'contracting', label: 'Conventionnement', icon: FileSignature },
    { id: 'portal', label: 'Portail Prestataire', icon: TabletSmartphone },
    { id: 'quality', label: 'Contrôle Qualité', icon: Star },
    { id: 'tariffs', label: 'Gestion Tarifs', icon: Calculator },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'directory': return <ProvidersDirectory />;
      case 'contracting': return <ContractingDigital />;
      case 'portal': return <ProviderPortal />;
      case 'quality': return <QualityControl />;
      case 'tariffs': return <TariffManagement />;
      default: return <ProvidersDirectory />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-slate-50 p-2 rounded-[32px] border border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4">
             <div className="w-10 h-10 bg-green-950 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <Building2 className="w-5 h-5 text-white" />
             </div>
             <div className="hidden md:block">
                <h3 className="text-sm font-black text-green-950 italic">Partenaires Hospitaliers</h3>
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest leading-none">Réseau & Qualité</p>
             </div>
          </div>

          <div className="flex bg-white/50 p-1 rounded-2xl gap-1 overflow-x-auto">
             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                    activeTab === tab.id ? "bg-green-600 text-white shadow-xl shadow-green-600/20" : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                  )}
                >
                   <tab.icon className="w-3.5 h-3.5" />
                   {tab.label}
                </button>
             ))}
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
