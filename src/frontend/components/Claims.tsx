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
import { PreauthPlafonds } from './PreauthPlafonds';
import { CimaClaimPecForm } from './claims/CimaClaimPecForm';

type ClaimsTab = 'declaration' | 'litigation' | 'workflow' | 'expertise' | 'preauth';

export const Claims: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<ClaimsTab>('declaration');
  const [isCreatingCimaPec, setIsCreatingCimaPec] = useState(false);

  React.useEffect(() => {
    if (subModule === 'claims-declaration') { setActiveTab('declaration'); setIsCreatingCimaPec(false); }
    else if (subModule === 'claims-litigation') { setActiveTab('litigation'); setIsCreatingCimaPec(false); }
    else if (subModule === 'claims-workflow') { setActiveTab('workflow'); setIsCreatingCimaPec(false); }
    else if (subModule === 'claims-expertise') { setActiveTab('expertise'); setIsCreatingCimaPec(false); }
    else if (subModule === 'claims-preauth') { setActiveTab('preauth'); setIsCreatingCimaPec(false); }
  }, [subModule]);

  const tabs = [
    { id: 'declaration', label: 'Déclaration Sinistre', icon: FileText },
    { id: 'litigation', label: 'Contentieux / Litiges', icon: MessageSquare },
    { id: 'workflow', label: 'Suivi Dossier', icon: Workflow },
    { id: 'expertise', label: 'Expertise Médicale', icon: Stethoscope },
    { id: 'preauth', label: 'Pré-autorisations & Plafonds', icon: ShieldCheck },
  ] as const;

  const renderContent = () => {
    if (isCreatingCimaPec) {
      return <CimaClaimPecForm onBackToClaimsList={() => setIsCreatingCimaPec(false)} />;
    }
    switch (activeTab) {
      case 'declaration': return <ClaimDeclaration />;
      case 'litigation': return <LitigationCenter />;
      case 'workflow': return <WorkflowManager />;
      case 'expertise': return <MedicalExpertise />;
      case 'preauth': return <PreauthPlafonds />;
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
                <h3 className="text-sm font-black text-green-950 italic">Sinistres &amp; Contentieux</h3>
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest leading-none">Gestion &amp; Expertise</p>
             </div>
          </div>

          <div className="flex bg-white/50 p-1 rounded-2xl gap-1 overflow-x-auto">
             <button
               onClick={() => setIsCreatingCimaPec(!isCreatingCimaPec)}
               className={cn(
                 "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap border-2 border-[#00A86B]/30 cursor-pointer outline-none",
                 isCreatingCimaPec ? "bg-[#00A86B] text-white shadow-xl shadow-[#00A86B]/20" : "bg-emerald-50 text-[#00A86B] hover:bg-emerald-100"
               )}
             >
                <ShieldCheck className="w-3.5 h-3.5" />
                Formulaire PEC CIMA (6 étapes)
             </button>

             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as ClaimsTab); setIsCreatingCimaPec(false); }}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer outline-none",
                    (!isCreatingCimaPec && activeTab === tab.id) ? "bg-green-600 text-white shadow-xl shadow-green-600/20" : "text-slate-400 hover:text-green-600 hover:bg-green-50"
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
            key={isCreatingCimaPec ? 'cima-pec' : activeTab}
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

