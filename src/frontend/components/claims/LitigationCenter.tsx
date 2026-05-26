/**
 * 📄 Fichier : /src/frontend/components/claims/LitigationCenter.tsx
 * 🎯 Objectif : Gestion juridique des contentieux, attribution d'avocats (Dupont J+15) et moteur de jurisprudence IA (G3, G4).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, ShieldAlert, Send, Clock, XCircle, CheckCircle2, 
  User, Search, Filter, AlertCircle, Paperclip, Info, ChevronRight, 
  Lock, FolderOpen, Scale, FileSignature, Copy, Check, UploadCloud
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Litigation {
  id: string;
  claimId: string;
  subject: string;
  parties: string[];
  lawyerAssigned: string;
  status: 'Brouillon' | 'Assigné' | 'Tribunal' | 'Gagné';
  priority: 'Haute' | 'Normale';
  deadline: string; // e.g. "J+15"
}

const INITIAL_LITIGATIONS: Litigation[] = [
  { id: 'LIT-4560', claimId: 'CLM-0451', subject: 'Dépassement arbitraire clinique HJ', parties: ['HJ Hospitals', 'Marie-Claire Mbika'], lawyerAssigned: 'Non assigné', status: 'Brouillon', priority: 'Haute', deadline: 'J+15' },
  { id: 'LIT-7721', claimId: 'CLM-0122', subject: 'Désaccord sur remboursement prothèse', parties: ['Hôpital Ngaliema', 'Isaac Mukendi'], lawyerAssigned: 'Me. Dupont', status: 'Assigné', priority: 'Haute', deadline: '2026-06-10' },
];

const PREBUILT_JURISPRUDENCE = [
  { term: 'rejet prothese dentaire', title: 'Arrêt Cour de Cassation Kinshasa #224-R RDC', outcome: 'Gagné (Exclusion d\'esthétique invalide)', summary: 'La Cour a annulé le rejet d\'assurance car la prothèse dentaire faisait suite à un traumatisme certifié d\'accident de la route, et non à un soin de confort esthétique.' },
  { term: 'plafond depasse', title: 'Décision Tribunal de Paix Gombe #1029', outcome: 'Gagné (Souveraineté des limites contractuelles)', summary: 'L\'assuré a été débouté de sa demande de sur-tarification : les plafonds de garantie de 500 USD insérés de façon visible et lisible sont opposables s\'ils respectent la notice explicative.' },
  { term: 'acte hors nomenclature', title: 'Règlement Arbitral ARCA - Mai 2025', outcome: 'Gagné (Substitution DCI légitime)', summary: 'La substitution d\'un générique DCI du panier réglementé est reconnue comme obligatoire sous astreinte de réduction du remboursement.' }
];

export const LitigationCenter: React.FC = () => {
  const [litigations, setLitigations] = useState<Litigation[]>(INITIAL_LITIGATIONS);
  const [selectedLit, setSelectedLit] = useState<Litigation | null>(null);

  // G3 States
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [lawyerName, setLawyerName] = useState('Me. Dupont');
  const [rejectionReason, setRejectionReason] = useState('Facture injustifiée par rapport aux barèmes ARCA RDC.');
  const [advocateMemoire, setAdvocateMemoire] = useState<string | null>(null);
  const [isAssigningLawyer, setIsAssigningLawyer] = useState(false);

  // G4 Jurisprudence States
  const [jurisprudenceSearch, setJurisprudenceSearch] = useState('rejet prothèse dentaire');
  const [foundDecisions, setFoundDecisions] = useState<typeof PREBUILT_JURISPRUDENCE>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleJurisprudenceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = jurisprudenceSearch.toLowerCase().trim();
    // fuzzy match prebuilt
    const matches = PREBUILT_JURISPRUDENCE.filter(j => 
      j.term.includes(query) || query.includes('prothèse') || j.title.toLowerCase().includes(query)
    );
    setFoundDecisions(matches);
  };

  const handleCopyArgument = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3050);
  };

  const executeAssignLawyer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssigningLawyer(true);

    setTimeout(() => {
      if (selectedLit) {
        setLitigations(prev => prev.map(l => l.id === selectedLit.id ? {
          ...l,
          lawyerAssigned: lawyerName,
          status: 'Assigné',
          deadline: 'J+15 (10 Juin 2026)'
        } : l));
        // Update local object to reflect right away
        setSelectedLit(prev => prev ? {
          ...prev,
          lawyerAssigned: lawyerName,
          status: 'Assigné',
          deadline: 'J+15 (10 Juin 2026)'
        } : null);
      }
      setIsAssigningLawyer(false);
      setShowLawyerModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Disputes list */}
        <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs font-black text-slate-900 uppercase italic">G3. File Juridique Active</span>
            <Scale className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-3">
            {litigations.map((lit) => (
              <div 
                key={lit.id}
                onClick={() => setSelectedLit(lit)}
                className={cn(
                  "p-4 rounded-2xl border cursor-pointer transition-all space-y-3",
                  selectedLit?.id === lit.id ? "border-indigo-600 bg-indigo-50/20" : "border-slate-150 hover:border-slate-350 bg-slate-50/50"
                )}
              >
                <div className="flex justify-between items-center text-[9.5px]">
                  <span className="font-bold text-slate-400 font-mono">ID: {lit.id}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                    lit.status === 'Assigné' ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {lit.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase leading-normal">{lit.subject}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest leading-none">Dossier: {lit.claimId}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-550">Avocat: {lit.lawyerAssigned}</span>
                  <span className="text-rose-600 font-mono">Délai: {lit.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Legal adjudication panel (Marie-Claire assignment and deadline G3) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLit ? (
            <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[9.5px] font-black text-indigo-600 uppercase tracking-widest font-mono">Dossier Litigation en cours</span>
                  <h3 className="text-sm font-black text-slate-1000 uppercase leading-none mt-1">{selectedLit.subject}</h3>
                  <p className="text-[10.5px] text-slate-400 font-bold mt-1 uppercase">Contestataires : {selectedLit.parties.join(' ↔ ')}</p>
                </div>

                {selectedLit.status === 'Brouillon' && (
                  <button 
                    onClick={() => setShowLawyerModal(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                  >
                    <FileSignature className="w-3.5 h-3.5" /> Assigner Avocat (Dupont J+15)
                  </button>
                )}
              </div>

              {selectedLit.status === 'Assigné' && (
                <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-indigo-700 uppercase">✓ TRANSMIS AU TRIBUNAL / CABINET JURIDIQUE</p>
                  <p className="text-[11.5px] font-semibold text-slate-700 leading-normal">
                    Dossier assigné d&apos;office à l&apos;avocat conseil <span className="font-bold underline">{selectedLit.lawyerAssigned}</span>. 
                    Délai légal maximum configuré à <span className="font-bold text-rose-650 font-mono">J+15 (Limite action J+15)</span>.
                  </p>
                </div>
              )}

              {/* G4: Jurisprudence and argumentation machine */}
              <div className="border border-slate-150 p-5 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <span className="text-xs font-black text-slate-900 uppercase italic">G4. Moteur de Jurisprudence d&apos;assurances NeoGTec (IA)</span>
                </div>

                <form onSubmit={handleJurisprudenceSearch} className="flex gap-2.5">
                  <input 
                    type="text"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl outline-none"
                    placeholder="Tapez un mot-clé (ex: rejet prothèse dentaire)"
                    value={jurisprudenceSearch}
                    onChange={(e) => setJurisprudenceSearch(e.target.value)}
                  />
                  <button type="submit" className="px-5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800">
                    Calculer Matches
                  </button>
                </form>

                <div className="space-y-3">
                  {foundDecisions.length === 0 ? (
                    <p className="text-center italic text-slate-400 text-xs py-4">Cliquez sur &quot;Calculer Matches&quot; pour rechercher dans la base de jurisprudence ARCA/CIMA.</p>
                  ) : (
                    foundDecisions.map((dec, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-2">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="font-bold text-indigo-700">{dec.title}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8.5px] font-black rounded font-mono uppercase italic">
                            {dec.outcome}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-normal font-semibold text-justify italic font-serif">
                          {dec.summary}
                        </p>

                        <button 
                          onClick={() => handleCopyArgument(dec.summary, idx)}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 text-[8.5px] font-black uppercase tracking-wider text-slate-600 hover:text-indigo-600 hover:border-indigo-150 rounded flex items-center gap-1 cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Argumentaire Copié !
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copier l&apos;argumentaire
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Scale className="w-12 h-12 text-slate-300 animate-bounce" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-400 uppercase">Aucun litige sélectionné</h4>
                <p className="text-[11px] text-slate-400 leading-normal max-w-xs font-semibold">
                  Choisissez un dossier juridique de rejets contentieux dans la liste active de gauche pour assigner un avocat conseil ou explorer la jurisprudence.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* =================================================== */}
      {/* MODAL G3: ASSIGN LAWYER & LAUNCH PROCEDURE DUPONT */}
      {/* =================================================== */}
      <AnimatePresence>
        {showLawyerModal && selectedLit && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowLawyerModal(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-150"
            >
              <div className="p-8 border-b border-slate-150 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900 uppercase">Attribuer à un avocat conseil (G3)</span>
                <button onClick={() => setShowLawyerModal(false)} className="p-1">
                  <XCircle className="w-5 h-5 text-slate-400 hover:text-slate-700" />
                </button>
              </div>

              <form onSubmit={executeAssignLawyer} className="p-8 space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Avocat sélectionné</label>
                  <select 
                    value={lawyerName}
                    onChange={(e) => setLawyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs font-black uppercase text-slate-800"
                  >
                    <option value="Me. Dupont">Me. Dupont (Cabinet d&apos;Arbitrage Gombe)</option>
                    <option value="Me. Kabeya">Me. Kabeya (Avocat conseil Cour d&apos;appel)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Mémoire d&apos;avocat consolidé (FMI)</label>
                  
                  <div className="border-2 border-dashed border-slate-200 p-6 text-center cursor-pointer space-y-1.5 bg-slate-50/50 rounded-2xl">
                    <UploadCloud className="mx-auto w-8 h-8 text-slate-350" />
                    <p className="text-xs font-bold text-slate-800">Uploader Mémoire.pdf</p>
                    <p className="text-[8.5px] text-slate-400 font-mono hover:underline">Format requis format CIMA/ARCA RDC</p>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-justify">
                  <p className="text-[9px] font-black text-rose-600 uppercase flex items-center gap-1">🚨 DEADLINE CRITIQUE IMPOSÉE</p>
                  <p className="text-[10.5px] font-semibold text-rose-800 leading-normal">
                    La procédure sera datée du jour. Me. Dupont disposera d&apos;une astreinte stricte de <span className="font-bold underline text-rose-600">J+15 (Limite action J+15)</span> pour contester le dossier sans risque d&apos;expiration de prescription.
                  </p>
                </div>

                {isAssigningLawyer && (
                  <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-center uppercase tracking-wide font-black text-[9.5px] rounded-lg">
                    Raccordement légal... attribution en cours
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowLawyerModal(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase text-center cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase text-center cursor-pointer"
                  >
                    Assigner Me. Dupont
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
