/**
 * 📄 Fichier : /src/frontend/components/users/BeneficiariesMgmt.tsx
 * 🎯 Objectif : Gestion des Ayants-Droit & Cycles de vie avec contrôle strict d'âge limite (F1, F2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, X, Heart, Shield, Plus, ChevronRight, 
  History as HistoryIcon, Trash2, Camera, User, AlertTriangle, 
  Check, CreditCard, ShieldAlert, ShieldCheck, Mail
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Beneficiary {
  id: string;
  name: string;
  relation: 'Conjoint' | 'Enfant' | 'Parent' | 'Autre';
  age: number;
  status: 'Actif' | 'En attente' | 'Suspendu';
  photo?: string;
  cardCode: string;
}

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { id: 'BEN-WAN-01', name: 'Sabrina Wanzambi', relation: 'Conjoint', age: 28, status: 'Actif', cardCode: 'ADNA-CRD-890214' },
  { id: 'BEN-WAN-02', name: 'Isaac Wanzambi', relation: 'Enfant', age: 6, status: 'Actif', cardCode: 'ADNA-CRD-890215' },
  { id: 'BEN-WAN-03', name: 'Léa Wanzambi', relation: 'Enfant', age: 3, status: 'En attente', cardCode: 'ADNA-CRD-890216' },
];

export const BeneficiariesMgmt: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Beneficiary Form state
  const [formName, setFormName] = useState('');
  const [formRelation, setFormRelation] = useState<'Conjoint' | 'Enfant' | 'Parent' | 'Autre'>('Enfant');
  const [formAge, setFormAge] = useState<number>(12);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Digital card preview state
  const [selectedCardMember, setSelectedCardMember] = useState<Beneficiary | null>(INITIAL_BENEFICIARIES[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAgeChange = (ageVal: number) => {
    setFormAge(ageVal);
    // Strict Child Under 25 Validation (F1 Requirement)
    if (formRelation === 'Enfant' && ageVal > 25) {
      setErrorMessage("La législation d'assurance en RDC stipule que l'âge limite d'un enfant à charge éligible à la couverture familiale est de 25 ans. Un enfant de 26 ans ou plus ne peut pas être rattaché à ce dossier.");
    } else {
      setErrorMessage(null);
    }
  };

  const handleRelationChange = (relVal: 'Conjoint' | 'Enfant' | 'Parent' | 'Autre') => {
    setFormRelation(relVal);
    if (relVal === 'Enfant' && formAge > 25) {
      setErrorMessage("La législation d'assurance en RDC stipule que l'âge limite d'un enfant à charge éligible à la couverture familiale est de 25 ans. Un enfant de 26 ans ou plus ne peut pas être rattaché à ce dossier.");
    } else {
      setErrorMessage(null);
    }
  };

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Reject child > 25 (F1 barrier)
    if (formRelation === 'Enfant' && formAge > 25) {
      setErrorMessage("Soumission bloquée : Limite d'âge de 25 ans dépassée pour un enfant à charge.");
      return;
    }

    const newBen: Beneficiary = {
      id: `BEN-WAN-0${beneficiaries.length + 1}`,
      name: formName,
      relation: formRelation,
      age: formAge,
      status: 'En attente',
      cardCode: `ADNA-CRD-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setBeneficiaries([...beneficiaries, newBen]);
    setShowAddModal(false);
    triggerToast(`Bénéficiaire "${formName}" ajouté avec succès (En attente de contrôle biométrique).`);
    
    // Reset form
    setFormName('');
    setFormRelation('Enfant');
    setFormAge(12);
    setErrorMessage(null);
  };

  const handleToggleStatus = (id: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatusVal = b.status === 'Actif' ? 'Suspendu' : 'Actif';
        triggerToast(`Le statut de ${b.name} est maintenant: ${nextStatusVal}.`);
        return { ...b, status: nextStatusVal as any };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-6">

      {/* Instant Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-rose-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-400">Gestion de Famille</p>
              <p className="text-xs text-slate-350 font-bold mt-1 leading-relaxed">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-550 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left main directory family members (F1, F2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h4 className="text-sm font-black text-slate-1000 uppercase italic">Couverture Familiale de l&apos;Assuré Principal</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sabrina, Isaac, Léa Wanzambi rattachés</p>
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-rose-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Rattacher un membre
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficiaries.map((b) => (
              <div 
                key={b.id}
                onClick={() => setSelectedCardMember(b)}
                className={cn(
                  "p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-48",
                  selectedCardMember?.id === b.id ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-150 hover:border-slate-300"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded text-[8px] font-black uppercase",
                      selectedCardMember?.id === b.id 
                        ? "bg-white/10 text-rose-300" 
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    )}>
                      {b.relation}
                    </span>
                    <h5 className={cn(
                      "text-sm font-black uppercase tracking-tight mt-1.5",
                      selectedCardMember?.id === b.id ? "text-white" : "text-slate-900"
                    )}>{b.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{b.age} ans • {b.id}</p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/50 flex items-center justify-center font-black text-xs text-slate-800">
                    {b.name.substring(0, 1)}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100/10 pt-3">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    b.status === 'Actif' ? "text-emerald-400" : b.status === 'Suspendu' ? "text-rose-400 animate-pulse" : "text-amber-400"
                  )}>
                    ● {b.status}
                  </span>

                  <div className="flex gap-1.5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(b.id);
                      }}
                      className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded text-[8.5px] font-black uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                    >
                      Statut
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Preview Digital NFC QR Card Generator (F2) */}
        <div className="space-y-4">
          {selectedCardMember ? (
            <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-6">
              
              {/* Virtual Badge Container */}
              <div className="bg-gradient-to-br from-indigo-900 via-rose-950 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl space-y-8 relative overflow-hidden border border-white/5">
                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">Adonaï Care Network</span>
                    <h5 className="text-sm font-black tracking-tight mt-1 uppercase">CARTE MUTUELLE DIGITALE</h5>
                  </div>
                  <CreditCard className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>

                <div>
                  <p className="text-[9px] font-bold text-white/40 uppercase">Bénéficiaire Adhérent</p>
                  <p className="text-base font-black uppercase tracking-wider font-mono">{selectedCardMember.name}</p>
                  <p className="text-[10px] font-mono mt-1 text-emerald-400">Réf: {selectedCardMember.cardCode}</p>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[7.5px] font-bold text-white/30 uppercase">Catégorie Parenté</p>
                    <p className="text-[10px] font-black uppercase">{selectedCardMember.relation}</p>
                  </div>
                  
                  {/* Generated QR Code simulator placeholder */}
                  <div className="p-1 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-slate-900 flex items-center justify-center font-black text-[6.5px] text-white">QR CAP</div>
                  </div>
                </div>
              </div>

              {/* Action buttons (F2 digital cards, nfc generator) */}
              <div className="space-y-2">
                <button 
                  onClick={() => triggerToast(`Carte virtuelle synchronisée pour ${selectedCardMember.name}. Code QR mis à jour.`)}
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10"
                >
                  <Check className="w-4 h-4 text-emerald-400" /> Régénérer Code QR NFC
                </button>
                <p className="text-[9px] text-slate-400 font-bold uppercase text-center">Taux d&apos;émission de carte physique évité: 100% (Green-SaaS)</p>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/50 rounded-[2.5rem] p-6 text-center text-slate-400 italic text-xs py-12">
              Cliquez sur un membre de la famille pour générer et prévisualiser sa carte de santé NFC digitale.
            </div>
          )}
        </div>

      </div>

      {/* ======================================= */}
      {/* ADD MEMBER POP-UP DIALOG MODAL (F1)        */}
      {/* ======================================= */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0"
            />

            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 text-rose-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950 uppercase italic">Ajouter un Ayant-Droit</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBeneficiary} className="p-8 space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom Complet Bénéficiaire</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: David Wanzambi"
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Relation</label>
                    <select 
                      value={formRelation}
                      onChange={(e) => handleRelationChange(e.target.value as any)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold"
                    >
                      <option value="Conjoint">Conjoint</option>
                      <option value="Enfant">Enfant</option>
                      <option value="Parent">Parent</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Âge du Bénéficiaire</label>
                    <input 
                      type="number" 
                      value={formAge}
                      onChange={(e) => handleAgeChange(Number(e.target.value))}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                {/* AGE EXCLUSION BARRIER ERROR MESSAGE DISPLAY (F1 Requirement) */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-black uppercase">
                        <AlertTriangle className="w-4 h-4 text-rose-500" /> INFRACTION CONTRAT
                      </div>
                      <p className="text-[11px] font-semibold text-rose-800 leading-normal">
                        {errorMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button 
                    type="submit"
                    disabled={!!errorMessage}
                    className={cn(
                      "flex-1 py-4 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center cursor-pointer shadow-lg",
                      errorMessage ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
                    )}
                  >
                    Valider Rattachement
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
