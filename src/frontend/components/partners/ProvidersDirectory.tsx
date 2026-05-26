/**
 * 📄 Fichier : /src/frontend/components/partners/ProvidersDirectory.tsx
 * 🎯 Objectif : Référentiel des prestataires hospitaliers avec un stepper d'embauche à 4 étapes (H1).
 */
import React, { useState } from 'react';
import { 
  Building2, Search, MapPin, Phone, Star, ShieldCheck, 
  Plus, Check, ChevronRight, X, AlertTriangle, Coins, FileText, CheckCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface Provider {
  id: string;
  name: string;
  type: string;
  address: string;
  district: string;
  status: string;
  swift: string;
  rating: number;
}

const MOCK_PROVIDERS: Provider[] = [
  { id: 'PROV-101', name: 'HJ Hospitals Kinshasa', type: 'Hôpital', address: '2337 Blvd du 30 Juin', district: 'Gombe', status: 'Conventionné', swift: 'HJHPCDKIXXX', rating: 4.8 },
  { id: 'PROV-102', name: 'Clinique Ngaliema', type: 'Clinique', address: 'Av. de la Clinique', district: 'Ngaliema', status: 'Conventionné', swift: 'NGLMCDKIXXX', rating: 4.5 },
  { id: 'PROV-103', name: 'Centre Médical de Kinshasa (CMK)', type: 'Clinique', address: 'Av. de l\'Équateur', district: 'Gombe', status: 'En attente', swift: 'CMKACDKIXXX', rating: 4.6 }
];

export const ProvidersDirectory: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');

  // Stepper State (H1)
  const [showAddModal, setShowAddModal] = useState(false);
  const [step, setStep] = useState(1);

  // Form Fields
  const [newProvName, setNewProvName] = useState('');
  const [newProvType, setNewProvType] = useState('Hôpital');
  const [newProvDistrict, setNewProvDistrict] = useState('Gombe');
  const [newProvPhone, setNewProvPhone] = useState('');
  const [newProvAddress, setNewProvAddress] = useState('');
  const [newProvSwift, setNewProvSwift] = useState('');
  const [newProvAgreement, setNewProvAgreement] = useState('AGR-ARCA-451');

  // SWIFT evaluation log
  const validateSwift = (swift: string) => {
    if (!swift) return { valid: false, message: 'Le code SWIFT/BIC est obligatoire.' };
    const clean = swift.replace(/\s+/g, '');
    if (clean.length !== 8 && clean.length !== 11) {
      return { valid: false, message: 'Le SWIFT/BIC doit contenir exactement 8 ou 11 caractères.' };
    }
    if (!/^[A-Z0-9]+$/i.test(clean)) {
      return { valid: false, message: 'Le SWIFT ne doit contenir que des lettres et chiffres.' };
    }
    if (!clean.toUpperCase().includes('CD')) {
      return { valid: true, warning: true, message: 'Alerte : Code pays "CD" (RDC) manquant dans le SWIFT. Assurez-vous du compte international.' };
    }
    return { valid: true, message: 'Format SWIFT/BIC conforme' };
  };

  const swiftFeedback = validateSwift(newProvSwift);

  const handleNextStep = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      handleNextStep();
      return;
    }

    const created: Provider = {
      id: `PROV-${Math.floor(Math.random() * 800) + 200}`,
      name: newProvName || 'Nouveau Prestataire',
      type: newProvType,
      address: newProvAddress || 'Adresse Kinshasa',
      district: newProvDistrict,
      status: 'En attente',
      swift: newProvSwift.toUpperCase(),
      rating: 5.0
    };

    setProviders(prev => [created, ...prev]);
    setShowAddModal(false);
    setStep(1);
    // reset
    setNewProvName('');
    setNewProvSwift('');
    setNewProvPhone('');
  };

  const filtered = providers.filter(p => {
    const sMatch = p.name.toLowerCase().includes(search.toLowerCase()) || p.district.toLowerCase().includes(search.toLowerCase());
    const tMatch = typeFilter === 'Tous' || p.type === typeFilter;
    return sMatch && tMatch;
  });

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase italic">H1. Référentiel des Prestataires</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Homologation ARCA et cartographie des cliniques conventionnées</p>
        </div>

        <button 
          onClick={() => { setShowAddModal(true); setStep(1); }}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Enregistrer un hôpital
        </button>
      </div>

      {/* Filters bar */}
      <div className="p-5 bg-white border border-slate-150 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input 
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl outline-none"
            placeholder="Filtrer par nom ou district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['Tous', 'Hôpital', 'Clinique'].map((f) => (
            <button 
              key={f}
              onClick={() => setTypeFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap",
                typeFilter === f ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-150"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabular Directory Grid */}
      <div className="bg-white border border-slate-150 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
                <th className="p-5">ID / Nom du Prestataire</th>
                <th className="p-5">Type / Zone</th>
                <th className="p-5">Adresse Physique</th>
                <th className="p-5">Code SWIFT Associé</th>
                <th className="p-5">Habilitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block uppercase font-black">{p.name}</span>
                        <span className="font-mono text-slate-400 text-[9.5px] font-bold">{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-extrabold text-slate-700 block uppercase">{p.type}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{p.district}</span>
                  </td>
                  <td className="p-5 text-slate-500 font-semibold">{p.address}</td>
                  <td className="p-5">
                    <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded">
                      {p.swift}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider",
                      p.status === 'Conventionné' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================== */}
      {/* 4-STEP ONBOARDING STEPPER MODAL (H1)               */}
      {/* ================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-150 flex flex-col justify-between max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 font-mono text-[8.5px] rounded uppercase font-black">
                    Nouveau Prestataire
                  </span>
                  <h3 className="text-sm font-black text-slate-900 uppercase mt-1 leading-none">Processus d&apos;homologation d&apos;établissement</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-1">
                  <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
                </button>
              </div>

              {/* Stepper Wizard Indicator */}
              <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                {[
                  { n: 1, label: 'Agrément' },
                  { n: 2, label: 'Contacts' },
                  { n: 3, label: 'Plateau & Soins' },
                  { n: 4, label: 'RIB & SWIFT' }
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-1.5">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono",
                      step >= s.n ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {s.n}
                    </span>
                    <span className={cn(step === s.n ? "text-indigo-600 font-bold" : "")}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Step Forms */}
              <form onSubmit={handleSubmit} className="flex-1 p-8 overflow-y-auto space-y-5 text-xs text-slate-600 font-medium select-none">
                
                {/* STEP 1: JURIDIQUE & AGREMENT */}
                {step === 1 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Informations légales d&apos;accréditation</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Raison Sociale</label>
                        <input 
                          type="text"
                          required
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          placeholder="Hôpital du Cinquantenaire"
                          value={newProvName}
                          onChange={(e) => setNewProvName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Type d&apos;établissement</label>
                        <select 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          value={newProvType}
                          onChange={(e) => setNewProvType(e.target.value)}
                        >
                          <option value="Hôpital">Hôpital National / Général de Référence</option>
                          <option value="Clinique">Clinique Privée / Privée Agréée</option>
                          <option value="Centre de Santé">Centre de Santé de Zone d&apos;Afrique</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Numéro d&apos;Agrément ARCA / Ministère RDC</label>
                      <input 
                        type="text"
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold"
                        placeholder="AGR-ARCA-451-CD"
                        value={newProvAgreement}
                        onChange={(e) => setNewProvAgreement(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: CONTACTS */}
                {step === 2 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Points de contact &amp; Adresse physique</span>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase font-bold">District / Commune Kinshasa</label>
                        <select 
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          value={newProvDistrict}
                          onChange={(e) => setNewProvDistrict(e.target.value)}
                        >
                          <option value="Gombe">Gombe</option>
                          <option value="Ngaliema">Ngaliema</option>
                          <option value="Limete">Limete</option>
                          <option value="Masina">Masina</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Téléphone Standard</label>
                        <input 
                          type="text"
                          required
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                          placeholder="+243 812 345 678"
                          value={newProvPhone}
                          onChange={(e) => setNewProvPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Adresse Complète</label>
                      <textarea 
                        rows={2}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                        placeholder="Blvd Lumumba, Quartier Salongo, Commune de Limete"
                        value={newProvAddress}
                        onChange={(e) => setNewProvAddress(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: PLAYGROUND / LIST OF DEPARTMENTS */}
                {step === 3 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Spécialités couvertes &amp; Capacités d&apos;Urgence</span>

                    <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                      <p className="text-[11px] font-bold text-slate-700">Sélectionnez les plateaux techniques installés :</p>
                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        {[
                          'Urgences Réanimation 24h/7',
                          'Scanner & IRM Nucléaire',
                          'Maternité & Clinique d\'Accouchement',
                          'Chirurgie Cardio-Vasculaire',
                          'Laboratoire centralisé PCR'
                        ].map((d, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked={i < 2} className="rounded" />
                            <span className="font-semibold text-slate-700">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: COORDONNEES BANCAIRES RIB / SWIFT */}
                {step === 4 && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">RIB, Banque Réceptrice &amp; Validation SWIFT</span>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Numéro de Compte National / RIB International</label>
                      <input 
                        type="text"
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold"
                        placeholder="CD01-09876-00001234567-90"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase font-bold">Code SWIFT (BIC)</label>
                      <input 
                        type="text"
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold uppercase"
                        placeholder="EXAMPCDKIXXX (8 ou 11 chars)"
                        value={newProvSwift}
                        onChange={(e) => setNewProvSwift(e.target.value)}
                      />
                    </div>

                    {/* SWIFT real-time feedback with flags */}
                    {newProvSwift && (
                      <div className={cn(
                        "p-4 border rounded-2xl flex items-start gap-2.5",
                        swiftFeedback.warning ? "bg-amber-50 border-amber-200 text-amber-800" :
                        swiftFeedback.valid ? "bg-emerald-50 border-emerald-250 text-emerald-800" : "bg-rose-50 border-rose-220 text-rose-800"
                      )}>
                        {swiftFeedback.warning || !swiftFeedback.valid ? (
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        <div>
                          <p className="font-black text-[9.5px] uppercase">
                            {swiftFeedback.warning ? "Avertissement RIB" : swiftFeedback.valid ? "SWIFT Conforme" : "SWIFT Non valide"}
                          </p>
                          <p className="text-[11.5px] font-semibold mt-0.5 leading-normal">{swiftFeedback.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </form>

              {/* Modal footer controls */}
              <div className="p-8 border-t border-slate-150 bg-slate-50 flex justify-between">
                {step > 1 ? (
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3.5 border border-slate-200 hover:border-slate-350 bg-white text-slate-700 font-black text-[10px] uppercase rounded-xl cursor-pointer"
                  >
                    Précédent
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3.5 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase text-center cursor-pointer bg-white"
                  >
                    Annuler
                  </button>

                  {step < 4 ? (
                    <button 
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase text-center cursor-pointer"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      disabled={!swiftFeedback.valid}
                      className="px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-[10px] uppercase text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Sauvegarder
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
