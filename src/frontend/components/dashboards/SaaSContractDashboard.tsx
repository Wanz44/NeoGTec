/**
 * 🛰️ Fichier : /src/frontend/components/dashboards/SaaSContractDashboard.tsx
 * 🎯 Objectif : Espace SaaS Contrat & Licences - Paul / Super Admin (NeoGTec)
 * CONFORMITÉ : ARCA-RDC Regulation, Licenciement Saas & Gestion de Clauses
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Percent, Check, RefreshCw, Eye, Download, Users, FileText, 
  ToggleLeft, ToggleRight, Sparkles, ShieldCheck, Mail, Siren, Settings, Plus,
  AlertTriangle, Key, ExternalLink, Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

interface TenantContract {
  id: string;
  name: string;
  plan: 'Silver' | 'Gold' | 'Custom';
  employeesCount: number;
  status: 'active' | 'suspended';
  mrr: number;
  contractFile: string;
  isSignedByArca: boolean;
  isTeleconsultationActive: boolean;
  isSnisActive: boolean;
}

export const SaaSContractDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null);

  // Prompt 5 requirements: SaaS Contracts registry state
  const [contracts, setContracts] = useState<TenantContract[]>([
    { 
      id: 'acme-tenant', 
      name: 'ACME SARL RDC', 
      plan: 'Gold', 
      employeesCount: 1102, 
      status: 'active', 
      mrr: 4200, 
      contractFile: 'CONTRAT_SAAS_ACME_2026.pdf', 
      isSignedByArca: true, 
      isTeleconsultationActive: true, 
      isSnisActive: false 
    },
    { 
      id: 'beta-tenant', 
      name: 'BETA SA (UAE)', 
      plan: 'Silver', 
      employeesCount: 450, 
      status: 'active', 
      mrr: 900, 
      contractFile: 'CONTRAT_SAAS_BETA_2026.pdf', 
      isSignedByArca: false, // ARCA signature check needed!
      isTeleconsultationActive: false, 
      isSnisActive: false 
    },
    { 
      id: 'delta-tenant', 
      name: 'DELTA INDUSTRIAL (FR)', 
      plan: 'Custom', 
      employeesCount: 3000, 
      status: 'suspended', 
      mrr: 10500, 
      contractFile: 'CONTRAT_SAAS_DELTA_2026.pdf', 
      isSignedByArca: true, 
      isTeleconsultationActive: true, 
      isSnisActive: true 
    }
  ]);

  const triggerToast = (title: string, desc: string) => {
    setToast({ title, desc });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Toggle addons with instant auditing (Prompt 5 requirement)
  const handleToggleAddon = (tenantId: string, addonKey: 'isTeleconsultationActive' | 'isSnisActive', currentVal: boolean) => {
    const addonLabel = addonKey === 'isTeleconsultationActive' ? 'Licence Téléconsultation (+500/mois)' : 'Interopérabilité SNIS (+200/mois)';
    const nextVal = !currentVal;

    setContracts(prev => prev.map(c => {
      if (c.id === tenantId) {
        // Adjust MRR accordingly
        const mrrDiff = addonKey === 'isTeleconsultationActive' ? 500 : 200;
        const nextMrr = nextVal ? c.mrr + mrrDiff : c.mrr - mrrDiff;
        return {
          ...c,
          [addonKey]: nextVal,
          mrr: nextMrr
        };
      }
      return c;
    }));

    // Audit logs
    logAction(
      'UPDATE_SAAS_ADDON_LICENSE', 
      `Super Admin Paul a ${nextVal ? 'activé' : 'désactivé'} l'addon de contrat "${addonLabel}" pour le tenant ID "${tenantId}" (Valeur précédente: ${currentVal}, Nouvelle: ${nextVal}).`,
      'WARNING'
    );

    triggerToast(
      "Avenant Contrat Modifié",
      `L'option "${addonLabel}" a été mise à jour. Le nouveau MRR récurrent de facturation SaaS a été recalculé.`
    );
  };

  const handleSignArcaGate = (tenantId: string) => {
    setContracts(prev => prev.map(c => c.id === tenantId ? { ...c, isSignedByArca: true } : c));
    logAction('ARCA_CONTRACT_SIGN', `Super Admin Paul a apposé le certificat légal de signature ARCA RDC pour la convention du locataire ID ${tenantId}.`, 'SUCCESS');
    triggerToast("Signature ARCA validée !", "Le contrat de Tiers Payant est validé au niveau national. L'établissement bénéficie de la tarification légale.");
  };

  return (
    <div className="space-y-6">
      
      {/* Toast popup alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 border border-white/10 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">{toast.title}</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toast.desc}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <span className="text-xs font-black">✕</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero SaaS Accent */}
      <div className="p-6 bg-gradient-to-r from-indigo-700 to-slate-900 rounded-[2.2rem] text-white shadow-lg space-y-1">
        <span className="bg-indigo-500/30 border border-indigo-400/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-100">
          Système Administration SaaS
        </span>
        <h1 className="text-2xl font-black tracking-tight mt-1">Console Cloud &amp; Licences Contrats — NeoGTec</h1>
        <p className="text-xs text-indigo-100 font-medium">Contrôlez les statuts de signature ARCA RDC, modulez les addons interopérables, auditez les MRR.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase uppercase">MRR SaaS Global</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">15,600 USD</h3>
          </div>
          <span className="text-[9px] text-indigo-500 font-bold mt-4">Calculé en temps-réel</span>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase">Locataires Actifs</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-2">3 Multi-Tenants</h3>
          </div>
          <span className="text-[9px] text-emerald-600 font-bold mt-4">100% Containers healthy</span>
        </div>
        <div className="p-6 bg-slate-900 text-white rounded-[2rem]">
          <p className="text-[10px] font-bold text-slate-450 uppercase">Régulation RDC</p>
          <h3 className="text-md font-black text-emerald-400 mt-2">Certificat ARCA V2</h3>
          <span className="text-[9px] text-slate-400 mt-4 block">Chiffrement cryptographique activé</span>
        </div>
      </div>

      {/* Prompt 5 Requirements Section: Contract & Licenses tables */}
      <div className="p-6 bg-white border border-slate-100 rounded-[2.2rem] shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase">Registre de Conventionnement &amp; Addons SaaS</h3>
          <p className="text-xs text-slate-400 font-bold mt-1 max-w-2xl leading-relaxed">
            Configurez les clauses de services de vos locataires au niveau national. L&apos;octroi d&apos;addon (Téléconsultation ou SNIS) est soumis à un avenant numérique validé. Toute modification réactive une ligne d&apos;audit légale.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Locataire (Tenant)</th>
                <th className="py-4 px-6">Formule / Plan</th>
                <th className="py-4 px-6 text-center">Assurés Actifs</th>
                <th className="py-4 px-6 text-center">Statut Signature ARCA</th>
                <th className="py-4 px-6 text-center">Addon : Téléconsultation (+500$)</th>
                <th className="py-4 px-6 text-center">Addon : Interopérabilité SNIS (+200$)</th>
                <th className="py-4 px-6 text-right">Abonnement MRR</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-950 font-black uppercase">
                    {c.name}
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8.5px] font-black border uppercase",
                      c.plan === 'Gold' ? "bg-amber-50 text-amber-700 border-amber-200" :
                      c.plan === 'Silver' ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    )}>
                      {c.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-mono">
                    {c.employeesCount}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {c.isSignedByArca ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8.5px] font-extrabold rounded">
                        ✓ CERTIFIÉ ARCA
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSignArcaGate(c.id)}
                        className="px-2.5 py-1 bg-amber-5 text-amber-800 border border-amber-200 hover:bg-amber-600 hover:text-white rounded text-[8px] font-black uppercase transition-all"
                      >
                        Signer ARCA RDC
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      type="button"
                      onClick={() => handleToggleAddon(c.id, 'isTeleconsultationActive', c.isTeleconsultationActive)}
                      className="inline-block p-1 text-slate-400 hover:text-slate-900 cursor-pointer outline-none"
                    >
                      {c.isTeleconsultationActive ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <ToggleRight className="w-8 h-8 font-black" />
                          <span className="text-[8px] font-black">Actif</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-405">
                          <ToggleLeft className="w-8 h-8 font-black" />
                          <span className="text-[8px] font-bold">Inactif</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      type="button"
                      onClick={() => handleToggleAddon(c.id, 'isSnisActive', c.isSnisActive)}
                      className="inline-block p-1 text-slate-400 hover:text-slate-900 cursor-pointer outline-none"
                    >
                      {c.isSnisActive ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <ToggleRight className="w-8 h-8" />
                          <span className="text-[8px] font-black">Actif</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <ToggleLeft className="w-8 h-8" />
                          <span className="text-[8px] font-bold">Inactif</span>
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-indigo-650">
                    {c.mrr} USD / mois
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg p-1.5">
                      <FileText className="w-3.5 h-3.5" /> {c.contractFile}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
