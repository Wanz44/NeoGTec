/**
 * 📄 Fichier : /src/frontend/components/Integrations.tsx
 * 🎯 Objectif : Module global d'interopérabilité et intégrations externes.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Globe, Database, Share2, 
  Video, Phone, Landmark, Lock,
  ShieldCheck, ArrowRight, Server, Link2
} from 'lucide-react';
import { cn } from '../lib/utils';

// Import sub-modules
import { RDCConnect } from './integrations/RDCConnect';
import { TeleConsultHub } from './integrations/TeleConsultHub';
import { RegulatoryExport } from './integrations/RegulatoryExport';
import { WebhookAndHRHub } from './integrations/WebhookAndHRHub';

export const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rdc' | 'tele' | 'regulatory' | 'webhooks'>('rdc');

  const tabs = [
    { id: 'rdc', label: 'SNIS & État Civil', icon: Globe },
    { id: 'tele', label: 'Télémédecine', icon: Video },
    { id: 'regulatory', label: 'Régulateurs (ARCA)', icon: Landmark },
    { id: 'webhooks', label: 'Webhooks & SI RH (J)', icon: Zap },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'rdc': return <RDCConnect />;
      case 'tele': return <TeleConsultHub />;
      case 'regulatory': return <RegulatoryExport />;
      case 'webhooks': return <WebhookAndHRHub />;
      default: return <RDCConnect />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-slate-50 p-2 rounded-[32px] border border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4">
             <div className="w-10 h-10 bg-indigo-950 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <Link2 className="w-5 h-5 text-white" />
             </div>
             <div className="hidden md:block">
                <h3 className="text-sm font-black text-indigo-950 italic">Interopérabilité</h3>
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Connecteurs & APIs</p>
             </div>
          </div>

          <div className="flex bg-white/50 p-1 rounded-2xl gap-1 overflow-x-auto">
             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                    activeTab === tab.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
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
