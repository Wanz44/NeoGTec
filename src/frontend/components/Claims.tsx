/**
 * 📄 Fichier : /src/frontend/components/Claims.tsx
 * 🎯 Objectif : Gestion avancée des sinistres avec transmission sécurisée.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, FileText, MessageSquare, 
  Workflow, Stethoscope, Search, Info,
  AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

// Import sub-modules
import { ClaimDeclaration } from './claims/ClaimDeclaration';
import { LitigationCenter } from './claims/LitigationCenter';
import { WorkflowManager } from './claims/WorkflowManager';
import { MedicalExpertise } from './claims/MedicalExpertise';

type ClaimsTab = 'declaration' | 'litigation' | 'workflow' | 'expertise';

export const Claims: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<ClaimsTab>('declaration');

  React.useEffect(() => {
    if (subModule === 'claims-declaration') setActiveTab('declaration');
    else if (subModule === 'claims-litigation') setActiveTab('litigation');
    else if (subModule === 'claims-workflow') setActiveTab('workflow');
    else if (subModule === 'claims-expertise') setActiveTab('expertise');
  }, [subModule]);

  const tabs = [
    { id: 'declaration', label: 'Déclaration Sinistre', icon: FileText },
    { id: 'litigation', label: 'Contentieux / Litiges', icon: MessageSquare },
    { id: 'workflow', label: 'Suivi Dossier', icon: Workflow },
    { id: 'expertise', label: 'Expertise Médicale', icon: Stethoscope },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'declaration': return <ClaimDeclaration />;
      case 'litigation': return <LitigationCenter />;
      case 'workflow': return <WorkflowManager />;
      case 'expertise': return <MedicalExpertise />;
      default: return <ClaimDeclaration />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-slate-50 p-2 rounded-[32px] border border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3 px-4">
             <div className="w-10 h-10 bg-green-950 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <ShieldCheck className="w-5 h-5 text-white" />
             </div>
             <div className="hidden md:block">
                <h3 className="text-sm font-black text-green-950 italic">Sinistres & Contentieux</h3>
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest leading-none">Gestion & Expertise</p>
             </div>
          </div>

          <div className="flex bg-white/50 p-1 rounded-2xl gap-1 overflow-x-auto">
             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ClaimsTab)}
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

