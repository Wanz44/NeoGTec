/**
 * 📄 Fichier : /src/frontend/components/contracts/ContractConfig.tsx
 * 🎯 Objectif : Gestion, édition et création à 3 étapes des produits d'assurances sans coder.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, ShieldCheck, Target, Zap, ChevronRight, ArrowRight, BarChart3, Plus, 
  Trash2, Info, LayoutDashboard, Database, TrendingDown, Percent, Wallet, X, Check,
  Sparkles, FileSpreadsheet, Copy, Eye, Sliders, AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/LanguageContext';

export interface ContractTier {
  id: string;
  name: string;
  color: string;
  ceiling: number;
  deductible: number;
  premium: number;
  active: boolean;
  ticket: string;
  status: 'Brouillon' | 'Publié' | 'Archivé';
  countryCode: string[];
  target: string;
  rules: string[];
}

const INITIAL_TIERS: ContractTier[] = [
  { 
    id: 'T1', 
    name: 'NeoGold Supreme', 
    color: 'bg-yellow-500', 
    ceiling: 15000, 
    deductible: 0, 
    premium: 850, 
    active: true, 
    ticket: '10%', 
    status: 'Publié',
    countryCode: ['RDC', 'France'],
    target: 'Entreprise >50 employés',
    rules: ['Si âge > 60 alors prime +20%', 'IA Pricing Optionnel']
  },
  { 
    id: 'T2', 
    name: 'Standard Bronze', 
    color: 'bg-amber-600', 
    ceiling: 2000, 
    deductible: 50, 
    premium: 120, 
    active: true, 
    ticket: '20%', 
    status: 'Publié',
    countryCode: ['RDC'],
    target: 'TPE / PME',
    rules: ['IA Pricing Désactivé']
  },
  { 
    id: 'T3', 
    name: 'NeoSilver Star', 
    color: 'bg-slate-400', 
    ceiling: 5000, 
    deductible: 25, 
    premium: 350, 
    active: false, 
    ticket: '15%',
    status: 'Brouillon',
    countryCode: ['France', 'UAE'],
    target: 'Toutes tailles',
    rules: ['Activer IA pricing auto']
  }
];

export const ContractConfig: React.FC = () => {
  const { t } = useLanguage();
  const [tiers, setTiers] = useState<ContractTier[]>(INITIAL_TIERS);
  
  // Create workflow step states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Steps 1, 2, 3
  
  // Guard migration modal state
  const [guardModalOpen, setGuardModalOpen] = useState(false);
  const [impactedTierId, setImpactedTierId] = useState<string | null>(null);
  const [migrationDestinationId, setMigrationDestinationId] = useState('T1');

  // Form step 1: Base info
  const [name, setName] = useState('');
  const [targetEmployee, setTargetEmployee] = useState('Entreprise >50 employés');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['RDC']);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [color, setColor] = useState('bg-indigo-600');
  
  // Form step 2: Barème Table
  const [baremes, setBaremes] = useState([
    { acte: 'Consultation Spécialisée', plafond: 500, ratio: 80, carence: 0 },
    { acte: 'Chambre Hospitalisation', plafond: 1500, ratio: 100, carence: 1 },
    { acte: 'Soins Optiques Réfractives', plafond: 1000, ratio: 80, carence: 6 },
    { acte: 'Plafond Dentaire', plafond: 1200, ratio: 90, carence: 3 },
  ]);
  const [tempCeiling, setTempCeiling] = useState('15000');
  const [tempPremium, setTempPremium] = useState('450');
  const [tempDeductible, setTempDeductible] = useState('20');
  const [tempTicket, setTempTicket] = useState('10%');

  // Form step 3: Rules and AI pricing
  const [ageOverSixtyRule, setAgeOverSixtyRule] = useState(true);
  const [maternityWaitingRule, setMaternityWaitingRule] = useState(false);
  const [iaPricingAuto, setIaPricingAuto] = useState(true);

  // System alert notifications
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleCountryToggle = (code: string) => {
    if (selectedCountries.includes(code)) {
      setSelectedCountries(selectedCountries.filter(c => c !== code));
    } else {
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  const handleDuplicateLastBareme = () => {
    triggerNotification("Copie du barème standard effectuée dans l'éditeur.");
  };

  const handleImportExcel = () => {
    triggerNotification("Simulation d'OCR et d'import du barème Excel (.xlsx). 4 catégories d'actes injectées automatiquement.");
  };

  // Safe Guarded deactivation
  const handleTriggerDésactiver = (tierId: string) => {
    // Open guard warning modal for active members
    setImpactedTierId(tierId);
    setGuardModalOpen(true);
  };

  const confirmDeactivationAndMigrate = () => {
    setTiers(prev => prev.map(t => {
      if (t.id === impactedTierId) {
        return { ...t, active: false, status: 'Archivé' as const };
      }
      return t;
    }));
    setGuardModalOpen(false);
    triggerNotification(`L'offre sélectionnée a été archivée. Les 4,312 assurés actifs ont été migrés avec succès vers l'offre ${tiers.find(tx => tx.id === migrationDestinationId)?.name}.`);
  };

  // Cloner an offer
  const handleCloner = (tier: ContractTier) => {
    const cloned: ContractTier = {
      ...tier,
      id: `T_CLONE_${Date.now()}`,
      name: `${tier.name} (Copie)`,
      status: 'Brouillon'
    };
    setTiers([...tiers, cloned]);
    triggerNotification(`L'offre "${tier.name}" a été clonée en version Brouillon.`);
  };

  // Final creation confirmation
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedRules: string[] = [];
    if (ageOverSixtyRule) generatedRules.push('Si âge > 60 alors prime +20%');
    if (maternityWaitingRule) generatedRules.push('Délai carence maternité: 9 mois');
    if (iaPricingAuto) generatedRules.push('Pricing Dynamique IA Activé');

    const newOffer: ContractTier = {
      id: `T${Date.now()}`,
      name: name.trim(),
      color,
      ceiling: Number(tempCeiling) || 0,
      deductible: Number(tempDeductible) || 0,
      premium: Number(tempPremium) || 0,
      active: true,
      ticket: tempTicket,
      status: 'Publié',
      countryCode: selectedCountries,
      target: targetEmployee,
      rules: generatedRules
    };

    setTiers([...tiers, newOffer]);
    setIsModalOpen(false);
    
    // Reset workflow
    setName('');
    setCurrentStep(1);
    setAgeOverSixtyRule(true);
    setMaternityWaitingRule(false);
    setIaPricingAuto(true);
    
    triggerNotification(`L'offre "${newOffer.name}" a été créée avec succès via l'assistant 3 étapes et déployée au niveau mondial.`);
  };

  const colorsOption = [
    { value: 'bg-yellow-500', label: 'Or Gold' },
    { value: 'bg-slate-400', label: 'Argent Silver' },
    { value: 'bg-amber-600', label: 'Bronze' },
    { value: 'bg-emerald-600', label: 'Émeraude' },
    { value: 'bg-indigo-600', label: 'Indigo Royal' },
    { value: 'bg-rose-600', label: 'Rose Rubis' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative text-slate-900 pb-16">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-green-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-green-400">Notification Système</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm shadow-indigo-100/50">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">{t('contracts.title', 'Offres & Barèmes')}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('contracts.subtitle', 'Configuration sans coder des produits d\'assurances')}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setCurrentStep(1);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all w-fit cursor-pointer outline-none shrink-0"
          id="btn-create-contract-offer"
        >
           <Plus className="w-4 h-4" /> {t('contracts.create_offer', 'Créer une Nouvelle Offre')}
        </button>
      </div>

      {/* Main product catalog list (B1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div key={tier.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden relative">
             <div className={cn("h-2.5 w-full", tier.color)} />
             <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{tier.name}</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{tier.target}</p>
                      </div>
                      
                      {/* Active Status Badge column */}
                      <span className={cn(
                        "px-2.5 py-1 text-[8.5px] font-black rounded-lg uppercase tracking-wider",
                        tier.status === 'Publié' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        tier.status === 'Brouillon' ? "bg-amber-50 text-amber-500 border border-amber-100" : "bg-slate-100 text-slate-500"
                      )}>
                        {tier.status}
                      </span>
                   </div>

                   <p className="text-[10px] font-bold text-indigo-700/80 uppercase tracking-wider mt-3">
                     Régions: {tier.countryCode.join(', ')}
                   </p>

                   <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plafond/an</p>
                            <p className="text-2xl font-black text-slate-900">{tier.ceiling.toLocaleString()} $</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium / Mois</p>
                            <p className="text-lg font-black text-indigo-600">{tier.premium} $</p>
                         </div>
                      </div>

                      {/* Rules builder visualization preview inside card */}
                      <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Règles actives</span>
                        {tier.rules.map((rule, idx) => (
                          <p key={idx} className="text-[10px] font-bold text-slate-600 italic">⚡ {rule}</p>
                        ))}
                      </div>

                      <div className="space-y-2 pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Ticket Modérateur</span>
                            <span className="text-xs font-black text-slate-900">{tier.ticket}</span>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Franchise Fixe</span>
                            <span className="text-xs font-black text-slate-900">{tier.deductible} $</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Actions Section: Modifier, Cloner, Désactiver */}
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => handleCloner(tier)}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors rounded-xl font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Cloner
                  </button>
                  
                  {tier.status === 'Publié' ? (
                    <button 
                      onClick={() => handleTriggerDésactiver(tier.id)}
                      className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors rounded-xl font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Désactiver
                    </button>
                  ) : (
                    <button 
                      onClick={() => triggerNotification('Activation de l\'offre en cours...')}
                      className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors rounded-xl font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Publier
                    </button>
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Decorative / secondary control grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="fluent-card p-10 bg-slate-950 text-white rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                     <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter">Plafonds Dynamiques</h3>
               </div>
               <p className="text-white/40 text-sm leading-relaxed italic">
                 Configurez des règles de plafonnement par spécialité médicale, type d&apos;acte ou période de carence. 
                 Les changements s&apos;appliquent instantanément aux nouvelles polices d&apos;assurances.
               </p>
               <div className="flex gap-4">
                  <button 
                    onClick={() => triggerNotification('Chargement de l\'outil de gestion des barèmes d\'actes médicaux ACT...')}
                    className="flex-1 py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-505 transition-all shadow-lg cursor-pointer"
                  >
                     Gérer les Barèmes ACT
                  </button>
                  <button 
                    onClick={() => triggerNotification('Récupération de l\'historique d\'audit global des polices d\'assurances...')}
                    className="flex-1 py-3 border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
                  >
                     Audit Historique
                  </button>
               </div>
            </div>
         </div>

         <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                     <Zap className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-900 uppercase italic">Algorithme de Calcul Pricing</h4>
                     <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Moteur de cotation cognitif</p>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed italic">
                 Le moteur IA optionnel assiste les assureurs lors de la phase 3 en analysant l&apos;évolution épidémiologique régionale pour suggérer de meilleurs tarifs au lancement.
               </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Certification Actuarielle Active</span>
               </div>
               <button 
                 onClick={() => triggerNotification('Téléchargement du rapport d\'évaluation de risque de la compagnie...')}
                 className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase italic hover:underline cursor-pointer"
               >
                  Rapport de Risque <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* ========================================= */}
      {/* 3-STEP CREATOR MODAL (B1 REQUIREMENT)     */}
      {/* ========================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[165] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-1000 uppercase italic tracking-tight">Nouvelle Offre de Contrat</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                      Assistant de configuration - Étape {currentStep} de 3
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar indicator */}
              <div className="w-full h-1.5 bg-slate-100 flex">
                <div className={cn("h-full transition-all duration-350", 
                  currentStep === 1 ? "w-1/3 bg-indigo-600" :
                  currentStep === 2 ? "w-2/3 bg-indigo-600" : "w-full bg-emerald-500"
                )} />
              </div>

              {/* Step Contents */}
              <div className="p-8 max-h-[450px] overflow-y-auto">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500 italic">Étape 1: Saisissez les caractéristiques fondamentales de la proposition d&apos;offre.</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nom de l&apos;Offre / Formule</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ex: NeoGold Platinum Supreme"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Cible */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Clientèle Cible</label>
                        <select 
                          value={targetEmployee}
                          onChange={(e) => setTargetEmployee(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                        >
                          <option>Entreprise &gt;50 employés</option>
                          <option>PME et Startups</option>
                          <option>Professionnels Libéraux</option>
                          <option>Individuels &amp; Familles</option>
                        </select>
                      </div>

                      {/* Devise par défaut */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Devise du Contrat</label>
                        <select 
                          value={defaultCurrency}
                          onChange={(e) => setDefaultCurrency(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="FC">CDF (FC)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>

                    {/* Pays selection (multi select) */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Pays couverts par l&apos;offre (Multi-select)</label>
                      <div className="flex gap-2">
                        {['RDC', 'France', 'UAE'].map((code) => {
                          const isSel = selectedCountries.includes(code);
                          return (
                            <button
                              type="button"
                              key={code}
                              onClick={() => handleCountryToggle(code)}
                              className={cn(
                                "px-4 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer",
                                isSel ? "bg-indigo-600 text-white border-transparent" : "bg-slate-50 text-slate-600 border-slate-200"
                              )}
                            >
                              {code === 'RDC' ? '🇨🇩 RDC' : code === 'France' ? '🇫🇷 France' : '🇦🇪 UAE'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color selection */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Thématique Couleur de Tag</label>
                      <div className="flex flex-wrap gap-2">
                        {colorsOption.map((c) => (
                          <button
                            type="button"
                            key={c.value}
                            onClick={() => setColor(c.value)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all shrink-0 cursor-pointer border",
                              color === c.value ? `${c.value} text-white border-transparent scale-105` : "bg-slate-100 text-slate-600 border-transparent"
                            )}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 italic">Étape 2: Barème &amp; plafonnement annuel des actes médicaux prioritaires.</p>
                      
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={handleImportExcel}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Importer Excel
                        </button>
                        <button 
                          type="button"
                          onClick={handleDuplicateLastBareme}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-indigo-600" /> Dupliquer barème
                        </button>
                      </div>
                    </div>

                    {/* Bareme list table */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-[8.5px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                            <th className="p-3">Spécialité / Acte</th>
                            <th className="p-3 text-right">Plafond/an</th>
                            <th className="p-3 text-right">% PEC</th>
                            <th className="p-3 text-right">Carence</th>
                          </tr>
                        </thead>
                        <tbody className="text-[10px] font-bold text-slate-700 divide-y divide-slate-150">
                          {baremes.map((b, i) => (
                            <tr key={i}>
                              <td className="p-3 font-extrabold text-slate-900">{b.acte}</td>
                              <td className="p-3 text-right">{b.plafond} USD</td>
                              <td className="p-3 text-right">{b.ratio}%</td>
                              <td className="p-3 text-right">{b.carence} mois</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* General ceiling */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Plafond total annuel ($)</label>
                        <input 
                          type="number"
                          value={tempCeiling}
                          onChange={(e) => setTempCeiling(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      {/* Premium */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Premium mensuel estimé ($)</label>
                        <input 
                          type="number"
                          value={tempPremium}
                          onChange={(e) => setTempPremium(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ticket Modérateur</label>
                        <input 
                          type="text"
                          value={tempTicket}
                          onChange={(e) => setTempTicket(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Franchise fixes ($)</label>
                        <input 
                          type="number"
                          value={tempDeductible}
                          onChange={(e) => setTempDeductible(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500 italic">Étape 3: Builder Visuel de Règles Actuarielles &amp; Options d&apos;Intelligence de tarification.</p>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Règles métier d&apos;affaires</h4>
                      
                      {/* Rule Item 1 */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 uppercase">Ajustement démographique par défaut</p>
                          <p className="text-[10px] text-slate-400 italic font-medium">Si l&apos;âge d&apos;adhésion de l&apos;assuré &gt; 60 alors majoration de la prime de +20%.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={ageOverSixtyRule}
                          onChange={(e) => setAgeOverSixtyRule(e.target.checked)}
                          className="w-4.5 h-4.5 accent-indigo-600 shrink-0 cursor-pointer"
                        />
                      </div>

                      {/* Rule Item 2 */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 uppercase">Carence Standard Maternité</p>
                          <p className="text-[10px] text-slate-400 italic font-medium">Appliquer un délai d&apos;attente obligatoire de 9 mois avant couverture.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={maternityWaitingRule}
                          onChange={(e) => setMaternityWaitingRule(e.target.checked)}
                          className="w-4.5 h-4.5 accent-indigo-600 shrink-0 cursor-pointer"
                        />
                      </div>

                      {/* AI pricing active toggle */}
                      <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                            <p className="text-xs font-black text-indigo-950 uppercase">Activer IA Pricing automatique</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIaPricingAuto(!iaPricingAuto)}
                            className={cn(
                              "w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer outline-none",
                              iaPricingAuto ? "bg-indigo-600 flex justify-end" : "bg-slate-300 flex justify-start"
                            )}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
                          </button>
                        </div>
                        <p className="text-[10px] text-indigo-900 leading-relaxed italic">
                          Le robot actuariel comparera le risque de sinistralité historique de votre portefeuille pour recommander le prix optimum mensuel en RDC / France.
                        </p>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Modal controls footer */}
              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
                {currentStep > 1 && (
                  <button 
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-6 py-4 border border-slate-200 text-slate-700 bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors"
                  >
                    Précédent
                  </button>
                )}

                <div className="flex-1 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 text-center"
                  >
                    Annuler
                  </button>
                  
                  {currentStep < 3 ? (
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-colors text-center"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleFinalSubmit}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Créer le Contrat
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 4312 MEMBERS GUARD DEACTIVATION DIALOG    */}
      {/* ========================================= */}
      <AnimatePresence>
        {guardModalOpen && (
          <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGuardModalOpen(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-rose-100 flex items-center gap-3 bg-rose-50/50">
                <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center border border-rose-200 text-rose-600">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base font-black text-rose-950 uppercase italic tracking-tight">Alerte Migration d&apos;Assurés</h3>
                  <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest leading-none mt-1">Garde de désactivation d&apos;offre</p>
                </div>
              </div>

              <div className="p-8 space-y-4 text-xs font-bold text-slate-700">
                <p className="leading-relaxed italic text-slate-500">
                  Attention, vous demandez la désactivation d&apos;un barème clinique avec des bénéficiaires actifs.
                </p>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-rose-950 space-y-1">
                  <p className="font-extrabold uppercase text-[10px]">🔴 4,312 assurés actifs impactés</p>
                  <p className="text-[10px] font-medium leading-relaxed italic">
                    Pour procéder à la suppression or archivage, vous devez obligatoirement spécifier une formule de destination alternative.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Migrer tous les assurés vers :</label>
                  <select 
                    value={migrationDestinationId}
                    onChange={(e) => setMigrationDestinationId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none text-slate-800 uppercase"
                  >
                    {tiers.filter(t => t.id !== impactedTierId).map(t => (
                      <option key={t.id} value={t.id}>{t.name} (Plafond/an: {t.ceiling}$)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setGuardModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-slate-250 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDeactivationAndMigrate}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 text-center cursor-pointer shadow-lg shadow-rose-600/15"
                >
                  Migrer &amp; Archiver
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
