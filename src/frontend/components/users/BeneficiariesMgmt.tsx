/**
 * 📄 Fichier : /src/frontend/components/users/BeneficiariesMgmt.tsx
 * 🎯 Objectif : Gestion des Ayants-Droit & Cycles de vie avec contrôle strict d'âge limite (F1, F2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, X, Heart, Shield, Plus, ChevronRight, 
  History as HistoryIcon, Trash2, Camera, User, AlertTriangle, 
  Check, CreditCard, ShieldAlert, ShieldCheck, Mail, Edit3, Trash, QrCode
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

export const BeneficiariesMgmt: React.FC = () => {
  const { 
    beneficiaries, 
    addFamilyMember, 
    updateFamilyMember, 
    deleteFamilyMember,
    logAction 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEditMember, setSelectedEditMember] = useState<any | null>(null);

  // New Beneficiary Form state
  const [formName, setFormName] = useState('');
  const [formRelation, setFormRelation] = useState<'Conjoint' | 'Enfant' | 'Parent' | 'Autre'>('Enfant');
  const [formAge, setFormAge] = useState<number>(12);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit Beneficiary Form state
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState<'Conjoint' | 'Enfant' | 'Parent' | 'Autre'>('Enfant');
  const [editAge, setEditAge] = useState<number>(12);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);

  // Digital card preview state
  const [selectedCardMember, setSelectedCardMember] = useState<any | null>(beneficiaries[0] || null);
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

  const handleEditAgeChange = (ageVal: number) => {
    setEditAge(ageVal);
    if (editRelation === 'Enfant' && ageVal > 25) {
      setEditErrorMessage("La législation d'assurance en RDC stipule que l'âge limite d'un enfant d'ayant-droit éligible est de 25 ans.");
    } else {
      setEditErrorMessage(null);
    }
  };

  const handleEditRelationChange = (relVal: 'Conjoint' | 'Enfant' | 'Parent' | 'Autre') => {
    setEditRelation(relVal);
    if (relVal === 'Enfant' && editAge > 25) {
      setEditErrorMessage("La législation d'assurance en RDC stipule que l'âge limite d'un enfant d'ayant-droit éligible est de 25 ans.");
    } else {
      setEditErrorMessage(null);
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

    const res = addFamilyMember({
      name: formName,
      relation: formRelation,
      age: formAge,
      status: 'En attente'
    });

    if (res.success) {
      setShowAddModal(false);
      triggerToast(`Bénéficiaire "${formName}" ajouté avec succès.`);
      
      // Select the newly added member
      const newB = beneficiaries[beneficiaries.length - 1];
      if (newB) setSelectedCardMember(newB);

      // Reset form
      setFormName('');
      setFormRelation('Enfant');
      setFormAge(12);
      setErrorMessage(null);
    } else {
      setErrorMessage(res.error || "Une erreur s'est produite.");
    }
  };

  const handleOpenEdit = (b: any) => {
    setSelectedEditMember(b);
    setEditName(b.name);
    setEditRelation(b.relation);
    setEditAge(b.age);
    setEditErrorMessage(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditMember) return;

    if (editRelation === 'Enfant' && editAge > 25) {
      setEditErrorMessage("Sauvegarde bloquée : Limite d'âge de 25 ans Dépassée pour un enfant.");
      return;
    }

    updateFamilyMember(selectedEditMember.id, {
      name: editName,
      relation: editRelation,
      age: editAge
    });

    setShowEditModal(false);
    triggerToast(`Bénéficiaire "${editName}" modifié avec succès.`);
    logAction('MODIFIER_AYANT_DROIT', `Profil d'ayant-droit ${editName} mis à jour avec succès dans le module famille.`);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment détacher le membre de couverture familiale "${name}" d'id ${id} ? Cette action est irréversible.`)) {
      deleteFamilyMember(id);
      triggerToast(`Le membre "${name}" a été détaché de ce dossier d'assurance.`);
      logAction('SUPPRIMER_AYANT_DROIT', `Suppression définitive du bénéficiaire ${name} (${id}) de la couverture familiale.`);
      if (selectedCardMember?.id === id) {
        setSelectedCardMember(beneficiaries[0] || null);
      }
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Actif' ? 'Suspendu' : 'Actif';
    updateFamilyMember(id, { status: nextStatus as any });
    triggerToast(`Statut de l'ayant-droit modifié en : ${nextStatus}`);
    logAction('EDITION_STATUT_AYANT_DROIT', `Passage du membre d'id ${id} au statut ${nextStatus}.`);
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
            <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Gestion de Famille</p>
              <p className="text-xs text-slate-350 font-semibold mt-1 leading-relaxed">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white transition-colors p-1 cursor-pointer">
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
              <h4 className="text-sm font-black text-slate-900 uppercase italic">Membres rattachés à la Couverture Familiale</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {beneficiaries.length} ayants droit déclarés dans le dossier d'assurance
              </p>
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
                  "p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-52",
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

                  <div className="flex flex-col gap-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center font-black text-xs text-slate-800">
                      {b.name.substring(0, 1)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100/10 pt-3 z-10">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest",
                    b.status === 'Actif' ? "text-emerald-400" : b.status === 'Suspendu' ? "text-rose-400 animate-pulse" : "text-amber-400"
                  )}>
                    ● {b.status}
                  </span>

                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(b);
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[8px] font-black uppercase border"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(b.id, b.status);
                      }}
                      className="px-2.5 py-1 bg-slate-950 text-white hover:bg-slate-800 rounded text-[8px] font-black uppercase"
                    >
                      Statut
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(b.id, b.name);
                      }}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded text-[8px] font-black uppercase border border-rose-100"
                    >
                      <Trash className="w-2.5 h-2.5" />
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
                  <p className="text-[9px] font-bold text-white/45">Bénéficiaire Adhérent</p>
                  <p className="text-base font-black uppercase tracking-wider font-mono">{selectedCardMember.name}</p>
                  <p className="text-[10px] font-mono mt-1 text-emerald-400">Réf: {selectedCardMember.cardCode || 'ADNA-67721'}</p>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[7.5px] font-bold text-white/30 uppercase">Catégorie Parenté</p>
                    <p className="text-[10px] font-black uppercase">{selectedCardMember.relation}</p>
                  </div>
                  
                  {/* Generated QR Code simulator placeholder */}
                  <div className="p-1 bg-white rounded-lg">
                    <QrCode className="w-8 h-8 text-slate-950" />
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
                <p className="text-[9px] text-slate-400 font-bold uppercase text-center">Taux d&apos;émission de carte physique évité: 100% (Green-SaaS CD)</p>
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
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
            
            <form 
              onSubmit={handleAddBeneficiary}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-250 z-10 p-8 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 text-rose-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950 uppercase italic">Ajouter un Ayant-Droit</h3>
                </div>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom Complet Bénéficiaire</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: David Wanzambi"
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Relation</label>
                  <select 
                    value={formRelation}
                    onChange={(e) => handleRelationChange(e.target.value as any)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-bold"
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
                    className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              {/* AGE EXCLUSION BARRIER ERROR MESSAGE DISPLAY (F1 Requirement) */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-black uppercase">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> INFRACTION CONTRAT RDC
                  </div>
                  <p className="text-[11px] font-semibold text-rose-800 leading-normal">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={!!errorMessage}
                  className={cn(
                    "flex-1 py-3 text-white rounded-xl font-black text-[10px] uppercase shadow-md cursor-pointer",
                    errorMessage ? "bg-slate-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
                  )}
                >
                  Rattacher Membre
                </button>
              </div>

            </form>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================= */}
      {/* EDIT MEMBER POP-UP DIALOG MODAL           */}
      {/* ======================================= */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowEditModal(false)} />
            
            <form 
              onSubmit={handleSaveEdit}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-250 z-10 p-8 space-y-4 text-slate-800"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 text-indigo-500">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950 uppercase italic">Modifier un Ayant-Droit</h3>
                </div>
                <button type="button" onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom Complet</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Relation</label>
                  <select 
                    value={editRelation}
                    onChange={(e) => handleEditRelationChange(e.target.value as any)}
                    className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-bold"
                  >
                    <option value="Conjoint">Conjoint</option>
                    <option value="Enfant">Enfant</option>
                    <option value="Parent">Parent</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Âge</label>
                  <input 
                    type="number" 
                    value={editAge}
                    onChange={(e) => handleEditAgeChange(Number(e.target.value))}
                    className="w-full h-12 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              {/* AGE EXCLUSION BARRIER ERROR MESSAGE DISPLAY */}
              {editErrorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-600 text-[10px] font-black uppercase">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> INFRACTION CONTRAT RDC
                  </div>
                  <p className="text-[11px] font-semibold text-rose-800 leading-normal">
                    {editErrorMessage}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-black text-[10px] uppercase cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={!!editErrorMessage}
                  className={cn(
                    "flex-1 py-3 text-white rounded-xl font-black text-[10px] uppercase shadow-md cursor-pointer",
                    editErrorMessage ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  Mettre à jour
                </button>
              </div>

            </form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
