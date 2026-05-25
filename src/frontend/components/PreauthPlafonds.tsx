/**
 * 📄 Fichier : /src/frontend/components/PreauthPlafonds.tsx
 * 🎯 Objectif : Module central de gestion des demandes de pré-autorisation et d'alerte sur plafonds d'entreprise (G1, G2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Mail, Plus, Check, X, AlertTriangle, 
  Stethoscope, Send, Building2, HelpCircle, Layers, ArrowUpRight, Clock, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface PreauthRequest {
  id: string;
  actName: string;
  clinic: string;
  doctor: string;
  patientName: string;
  estimatedCost: number;
  status: 'Approuvé' | 'Rejeté' | 'Arbitrage Complémentaire';
  requestedAt: string;
}

export interface CompanyCeiling {
  id: string;
  name: string;
  spent: number;
  limit: number;
  hrEmail: string;
}

const INITIAL_REQUESTS: PreauthRequest[] = [
  { id: 'AUTH-9082', actName: 'Scanner Thoracique Haute Résolution', clinic: 'HJ Hospitals Kinshasa', doctor: 'Dr. Kabongo', patientName: 'Samba Ndongo', estimatedCost: 350, status: 'Arbitrage Complémentaire', requestedAt: '25/05/2026 10:30' },
  { id: 'AUTH-8921', actName: 'Chirurgie Orthopédique Standard', clinic: 'Hôpital du Cinquantenaire', doctor: 'Dr. Mutombo', patientName: 'Marie-Noël Mpunga', estimatedCost: 2800, status: 'Approuvé', requestedAt: '24/05/2026 15:00' },
  { id: 'AUTH-7711', actName: 'Fécondation In Vitro (FIV)', clinic: 'Clinique Ngaliema', doctor: 'Dr. Ilunga', patientName: 'Therese Kanyama', estimatedCost: 4500, status: 'Rejeté', requestedAt: '21/05/2026 09:12' }
];

const INITIAL_CEILINGS: CompanyCeiling[] = [
  { id: 'CMP-KAT', name: 'Katanga Mining Solutions', spent: 12500, limit: 50000, hrEmail: 'hr@katangamining.cd' },
  { id: 'CMP-RAW', name: 'Rawbank RDC Staff', spent: 46200, limit: 50000, hrEmail: 'rh@rawbank.cd' },
  { id: 'CMP-ITM', name: 'IT African Services', spent: 8500, limit: 10000, hrEmail: 'contact.hr@it-africa.cd' }
];

export const PreauthPlafonds: React.FC = () => {
  const [requests, setRequests] = useState<PreauthRequest[]>(INITIAL_REQUESTS);
  const [ceilings, setCeilings] = useState<CompanyCeiling[]>(INITIAL_CEILINGS);

  // Form states
  const [act, setAct] = useState('Scanner Thoracique Haute Résolution');
  const [clinic, setClinic] = useState('HJ Hospitals Kinshasa');
  const [doctor, setDoctor] = useState('');
  const [patient, setPatient] = useState('');
  const [cost, setCost] = useState('400');
  const [statusVal, setStatusVal] = useState<'Approuvé' | 'Rejeté' | 'Arbitrage Complémentaire'>('Arbitrage Complémentaire');

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (desc: string) => {
    setToast(desc);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Submit Preauth (G1)
  const handleSubmitPreauth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor.trim() || !patient.trim()) {
      showToast("Veuillez renseigner le nom du praticien et du patient.");
      return;
    }

    const newReq: PreauthRequest = {
      id: `AUTH-${Math.floor(1000 + Math.random() * 9000)}`,
      actName: act,
      clinic,
      doctor,
      patientName: patient,
      estimatedCost: Number(cost),
      status: statusVal,
      requestedAt: new Date().toLocaleString()
    };

    setRequests([newReq, ...requests]);
    showToast(`Demande de pré-autorisation ${newReq.id} enregistrée avec statut: ${newReq.status}.`);
    setDoctor('');
    setPatient('');
  };

  // Send Alert to Corporate HR (G2)
  const handleAlertHR = (company: CompanyCeiling) => {
    showToast(`Alerte de dépassement envoyée à ${company.hrEmail} pour l&apos;entreprise "${company.name}". Alerte 90% active.`);
  };

  return (
    <div className="space-y-6">

      {/* Floating toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-1000 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Pré-autorisations &amp; Plafonds</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toast}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Pre-authorization request submission form left (G1) */}
        <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Stethoscope className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h4 className="text-xs font-black text-slate-900 uppercase italic">Nouvelle Demande de Pré-autorisation</h4>
          </div>

          <form onSubmit={handleSubmitPreauth} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom du Patient Bénéficiaire</label>
              <input 
                type="text"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                placeholder="Ex: Jean-Paul M&apos;bika"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nature de l&apos;Acte Médical</label>
              <select 
                value={act}
                onChange={(e) => setAct(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold"
              >
                <option value="Scanner Thoracique Haute Résolution">Scanner Thoracique Haute Résolution</option>
                <option value="Chirurgie Orthopédique Standard">Chirurgie Orthopédique Standard</option>
                <option value="IRM Cérébral de Précision">IRM Cérébral de Précision</option>
                <option value="Bilan d&apos;expertise oncologique">Bilan d&apos;expertise oncologique</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Médecin Praticien</label>
                <input 
                  type="text"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="Dr. Kabila"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Établissement</label>
                <select 
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold"
                >
                  <option value="HJ Hospitals Kinshasa">HJ Hospitals Kinshasa</option>
                  <option value="Hôpital du Cinquantenaire">Hôpital du Cinquantenaire</option>
                  <option value="Clinique Ngaliema">Clinique Ngaliema</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Coût Estimatif ($)</label>
                <input 
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Statut Consenti d&apos;Office</label>
                <select 
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-indigo-600"
                >
                  <option value="Arbitrage Complémentaire">Arbitrage Complémentaire (Medical Check)</option>
                  <option value="Approuvé">Approuvé d&apos;office (Vert)</option>
                  <option value="Rejeté">Rejeté d&apos;office (Rouge)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-center cursor-pointer shadow-lg shadow-slate-900/10"
            >
              Soumettre la Demande
            </button>
          </form>
        </div>

        {/* 2. Corporate spendings vs allocated balance GAUGE lists (G2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <span className="text-xs font-black text-slate-900 uppercase">Plafonds &amp; Dotations Consulaires des Entreprises (G2)</span>
            
            <div className="space-y-6">
              {ceilings.map((company) => {
                const ratioPercent = Math.round((company.spent / company.limit) * 100);
                const isOver90 = ratioPercent >= 90;

                return (
                  <div key={company.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8.5px] font-black text-indigo-600 uppercase tracking-wider font-mono">{company.id}</span>
                        <h5 className="text-xs font-black text-slate-900 uppercase mt-0.5">{company.name}</h5>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">{company.spent.toLocaleString()}$ / {company.limit.toLocaleString()}$</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Dotation globale consommée</p>
                      </div>
                    </div>

                    {/* Visual bar graph progress bar gauge */}
                    <div className="space-y-1">
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            isOver90 ? "bg-rose-600 animate-pulse" : "bg-indigo-600"
                          )} 
                          style={{ width: `${ratioPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono tracking-tight font-extrabold text-slate-400">
                        <span>0%</span>
                        <span className={cn(isOver90 ? "text-rose-600 font-black animate-pulse" : "text-indigo-600")}>
                          {ratioPercent}% consommé
                        </span>
                        <span>100% (Limite critique)</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[9px] font-bold italic text-slate-400 uppercase font-mono">HR Contact: {company.hrEmail}</span>
                      
                      {isOver90 && (
                        <button 
                          onClick={() => handleAlertHR(company)}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Mail className="w-3 h-3 text-white" /> Alerter RH client
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Pre-authorizations list (D1) */}
          <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <span className="text-xs font-black text-slate-900 uppercase">Journal de Suivi des Actes Sollicités</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans col-auto">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Patient séléctionné</th>
                    <th className="py-3 px-4">Spécialité acte sollicité</th>
                    <th className="py-3 px-4">Établissement</th>
                    <th className="py-3 px-4 text-right">Coût</th>
                    <th className="py-3 px-4 text-center">Décision d&apos;arbitrage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-black text-slate-800">{req.id}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 uppercase">{req.patientName}</td>
                      <td className="py-3 px-4 font-medium text-slate-500 italic">{req.actName}</td>
                      <td className="py-3 px-4 font-bold text-slate-700">{req.clinic}</td>
                      <td className="py-3 px-4 text-right font-black text-slate-900">{req.estimatedCost.toLocaleString()} $</td>
                      <td className="py-3 px-4 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8.5px] font-black uppercase",
                          req.status === 'Approuvé' 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-150" 
                            : req.status === 'Rejeté' ? "bg-rose-50 text-rose-600 border border-rose-150" : "bg-amber-50 text-amber-600 border border-amber-150"
                        )}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
