import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, Target, Zap, 
  ChevronRight, ArrowRight, BarChart3, Plus, 
  Trash2, Info, LayoutDashboard, Database,
  TrendingDown, Percent, Wallet, X, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ContractTier {
  id: string;
  name: string;
  color: string;
  ceiling: number;
  deductible: number;
  premium: number;
  active: boolean;
  ticket?: string;
}

const MOCK_TIERS: ContractTier[] = [
  { id: 'T1', name: 'Standard Bronze', color: 'bg-amber-600', ceiling: 2000, deductible: 50, premium: 120, active: true, ticket: '20%' },
  { id: 'T2', name: 'Premium Silver', color: 'bg-slate-400', ceiling: 5000, deductible: 25, premium: 350, active: true, ticket: '15%' },
  { id: 'T3', name: 'Exclusive Gold', color: 'bg-yellow-500', ceiling: 15000, deductible: 0, premium: 850, active: true, ticket: '10%' },
];

export const ContractConfig: React.FC = () => {
  const [tiers, setTiers] = useState<ContractTier[]>(MOCK_TIERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [ceiling, setCeiling] = useState('10000');
  const [deductible, setDeductible] = useState('100');
  const [premium, setPremium] = useState('250');
  const [ticket, setTicket] = useState('20%');
  const [color, setColor] = useState('bg-green-600');

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newOffer: ContractTier = {
      id: `T${Date.now()}`,
      name: name.trim(),
      color,
      ceiling: Number(ceiling) || 0,
      deductible: Number(deductible) || 0,
      premium: Number(premium) || 0,
      active: true,
      ticket: ticket || '20%'
    };

    setTiers([...tiers, newOffer]);
    setIsModalOpen(false);
    
    // Reset form
    setName('');
    setCeiling('10000');
    setDeductible('100');
    setPremium('250');
    setTicket('20%');
    setColor('bg-green-600');

    triggerNotification(`L'offre "${newOffer.name}" a été créée avec succès et déployée au niveau mondial.`);
  };

  const handleDeleteTier = (id: string, name: string) => {
    setTiers(tiers.filter(t => t.id !== id));
    triggerNotification(`L'offre "${name}" a été archivée avec succès.`);
  };

  const colors = [
    { value: 'bg-amber-600', label: 'Bronze' },
    { value: 'bg-slate-400', label: 'Silver' },
    { value: 'bg-yellow-500', label: 'Gold' },
    { value: 'bg-green-600', label: 'Vert Émeraude' },
    { value: 'bg-blue-600', label: 'Bleu Royal' },
    { value: 'bg-rose-600', label: 'Rose Rubis' },
    { value: 'bg-purple-600', label: 'Violet Améthyste' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative text-slate-900">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="p-2 bg-green-500 rounded-xl text-white shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-green-400">Notification Système</p>
            <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{showNotification}</p>
          </div>
          <button onClick={() => setShowNotification(null)} className="text-slate-500 hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100 shadow-sm shadow-indigo-100/50">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">Offres & Barèmes</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configuration des structures de contrats</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all w-fit cursor-pointer"
          id="btn-create-contract-offer"
        >
           <Plus className="w-4 h-4" /> Créer une Nouvelle Offre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div key={tier.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all overflow-hidden relative">
             <div className={cn("h-2 w-full", tier.color)} />
             <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{tier.name}</h4>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1 italic">Active & Publiée</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteTier(tier.id, tier.name)}
                        className="w-10 h-10 bg-slate-50 hover:bg-rose-50 rounded-xl flex items-center justify-center transition-colors group/del cursor-pointer"
                        title="Archiver l'offre"
                      >
                         <Trash2 className="w-5 h-5 text-slate-300 group-hover/del:text-rose-600 transition-colors" />
                      </button>
                   </div>

                   <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plafond Annuel</p>
                            <p className="text-2xl font-black text-slate-900">{tier.ceiling.toLocaleString()} $</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium / Assuré</p>
                            <p className="text-lg font-black text-indigo-600">{tier.premium} $</p>
                         </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Ticket Modérateur</span>
                            <span className="text-xs font-black text-slate-900">{tier.ticket || '20%'}</span>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Franchise Fixe</span>
                            <span className="text-xs font-black text-slate-900">{tier.deductible} $</span>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => triggerNotification(`Chargement de l'éditeur interactif pour les règles de l'offre "${tier.name}"...`)}
                  className="w-full mt-6 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm cursor-pointer"
                >
                   Éditer les Règles
                </button>
             </div>
          </div>
        ))}

        {tiers.length === 0 && (
          <div className="col-span-full p-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="p-6 bg-slate-50 rounded-full w-fit mx-auto">
                <Database className="w-12 h-12 text-slate-300" />
             </div>
             <h2 className="text-lg font-black text-slate-900 uppercase italic">Aucune Offre Disponible</h2>
             <p className="text-xs text-slate-400 italic">Veuillez cliquer sur "Créer une Nouvelle Offre" pour configurer un barème de contrat.</p>
          </div>
        )}
      </div>

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
                 Configurez des règles de plafonnement par spécialité médicale, type d'acte ou période de carence. 
                 Les changements s'appliquent instantanément aux nouvelles polices.
               </p>
               <div className="flex gap-4">
                  <button 
                    onClick={() => triggerNotification('Chargement de l\'outil de gestion des barèmes d\'actes médicaux ACT...')}
                    className="flex-1 py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                     Gérer les Barèmes ACT
                  </button>
                  <button 
                    onClick={() => triggerNotification('Récupération de l\'historique d\'audit mondial des polices d\'assurances...')}
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
                     <h4 className="text-lg font-black text-slate-900 uppercase italic">Algorithme de Calcul</h4>
                     <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">Moteur de cotation v2.0</p>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed italic">
                 Notre moteur IA analyse le risque historique pour suggérer les meilleurs plafonds par segment démographique.
               </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Certification Actuarielle 2024</span>
               </div>
               <button 
                 onClick={() => triggerNotification('Téléchargement du rapport d\'évaluation de risque au format PDF en cours...')}
                 className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase italic hover:underline cursor-pointer"
               >
                  Rapport de Risque <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight">Nouvelle Offre de Contrat</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Édition des Plafonds & Tarifs</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                id="btn-close-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nom de l'Offre / Formule</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Platinum Indestructible, Standard Santé"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Plafond Annuel ($)</label>
                  <input 
                    type="number" 
                    value={ceiling}
                    onChange={(e) => setCeiling(e.target.value)}
                    placeholder="15000"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Prime Mensuelle ($)</label>
                  <input 
                    type="number" 
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    placeholder="450"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ticket Modérateur</label>
                  <input 
                    type="text" 
                    value={ticket}
                    onChange={(e) => setTicket(e.target.value)}
                    placeholder="20%"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Franchise Fixe ($)</label>
                  <input 
                    type="number" 
                    value={deductible}
                    onChange={(e) => setDeductible(e.target.value)}
                    placeholder="50"
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Couleur de Tag Visuel</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all border shrink-0 cursor-pointer",
                        color === c.value 
                          ? `${c.value} text-white border-transparent scale-105 shadow-md shadow-black/10` 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg cursor-pointer"
                >
                  Créer le Contrat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
