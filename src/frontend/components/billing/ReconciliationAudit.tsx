/**
 * 📄 Fichier : /src/frontend/components/billing/ReconciliationAudit.tsx
 * 🎯 Objectif : Interface side-by-side d'audit et réconciliation des factures cliniques vs actes médicaux (D3).
 */
import React, { useState } from 'react';
import { 
  BookOpen, FileText, RefreshCcw, CheckCircle2, AlertCircle, 
  Search, Download, Calculator, ShieldCheck, ClipboardCheck,
  Check, X, AlertTriangle, ArrowRight, ShieldAlert, FileSpreadsheet
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface ReconciliationItem {
  id: string;
  clinicName: string;
  patientName: string;
  invoiceAmount: number;
  invoiceActName: string;
  physicalActAmount: number;
  physicalActName: string;
  isMismatched: boolean;
  status: 'En suspens' | 'Réconcilié' | 'Ajusté';
  explanation?: string;
}

const INITIAL_RECON_ITEMS: ReconciliationItem[] = [
  {
    id: 'REC-HJ-2021',
    clinicName: 'HJ Hospitals Kinshasa',
    patientName: 'Kabasele Mwamba',
    invoiceAmount: 450,
    invoiceActName: 'Scanner Cérébral + Contraste Multi-coupes',
    physicalActAmount: 250,
    physicalActName: 'Scanner Cérébral Standard Sans Contraste',
    isMismatched: true,
    status: 'En suspens',
    explanation: 'Le médecin de garde confirme avoir annulé le produit de contraste suite à allergie patient.'
  },
  {
    id: 'REC-CINQ-344',
    clinicName: 'Hôpital du Cinquantenaire',
    patientName: 'Marie-Claire Mpunga',
    invoiceAmount: 3500,
    invoiceActName: 'Chirurgie Gynécologique Majeure A',
    physicalActAmount: 1800,
    physicalActName: 'Chirurgie Gynécologique Standard Mineure B',
    isMismatched: true,
    status: 'En suspens',
    explanation: 'Gonflage de code d&apos;intervention suspecté après examen du livret d&apos;anesthésie.'
  },
  {
    id: 'REC-NGAL-091',
    clinicName: 'Clinique Ngaliema',
    patientName: 'Adonaï Wanzambi',
    invoiceAmount: 120,
    invoiceActName: 'Consultation Spécialisée Cardiologie',
    physicalActAmount: 120,
    physicalActName: 'Consultation Spécialisée Cardiologie',
    isMismatched: false,
    status: 'Réconcilié'
  },
  {
    id: 'REC-HJ-3051',
    clinicName: 'HJ Hospitals Kinshasa',
    patientName: 'Therese Bakutu',
    invoiceAmount: 85,
    invoiceActName: 'Bilan Sanguin Complet Hémogramme',
    physicalActAmount: 85,
    physicalActName: 'Bilan Sanguin Complet Hémogramme',
    isMismatched: false,
    status: 'Réconcilié'
  }
];

export const ReconciliationAudit: React.FC = () => {
  const [items, setItems] = useState<ReconciliationItem[]>(INITIAL_RECON_ITEMS);
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(INITIAL_RECON_ITEMS[0]);
  
  // Local Audit States
  const [activeAdjustmentAmount, setActiveAdjustmentAmount] = useState<string>('250');
  const [auditComment, setAuditComment] = useState('Ajustement sur la base du rapport physique du médecin assistant.');

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Perform Reconciliation (D3 Action)
  const handleValidateReconciliation = (itemId: string, forceMatch = false) => {
    setItems(prev => prev.map(rec => {
      if (rec.id === itemId) {
        return {
          ...rec,
          status: forceMatch ? 'Réconcilié' : 'Ajusté',
          invoiceAmount: forceMatch ? rec.invoiceAmount : Number(activeAdjustmentAmount),
          explanation: auditComment,
          isMismatched: false
        };
      }
      return rec;
    }));

    // Update details panel
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? {
        ...prev,
        status: forceMatch ? 'Réconcilié' : 'Ajusté',
        invoiceAmount: forceMatch ? prev.invoiceAmount : Number(activeAdjustmentAmount),
        isMismatched: false,
        explanation: auditComment
      } : null);
    }

    showToast(`Rapprochement validé avec succès pour le ticket ${itemId}. Prestataire notifié de l&apos;ajustement budgétaire.`);
  };

  return (
    <div className="space-y-6">

      {/* Interactive feedback Toast banner */}
      <AnimatePresence>
        {toast && (
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
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Rapprochement de Comptes</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toast}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-200/50 flex items-start gap-4">
        <div className="p-3 bg-white rounded-xl text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <h4 className="text-sm font-black text-amber-950 uppercase italic tracking-tight">Vérification de Surcharges (Anti-Surchauffe Tarifaire)</h4>
          <p className="text-xs text-amber-800 font-medium leading-relaxed mt-1">
            Les écarts entre la <strong>Facturation Clinique (Débit réclamé)</strong> et l&apos;<strong>Acte physique enregistré par le médecin</strong> sont identifiés numériquement. Surlignés en rouge, ces litiges menacent les marges de la mutuelle. Les rapprochements ajustés déclenchent automatiquement un émetteur d&apos;avis de crédit aux établissements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Side-by-side matching screen (D3 requirement) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <span className="text-xs font-black text-slate-900 uppercase">Litiges Cliniques Détectés</span>
            <span className="text-[10px] text-slate-400 font-mono">Bilateral matching gateway active</span>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const selectedStyle = selectedItem?.id === item.id ? "ring-2 ring-indigo-600" : "hover:bg-slate-50/50";
              const errorHighlight = item.isMismatched ? "border-rose-200 bg-rose-50/10" : "border-slate-150";

              return (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setActiveAdjustmentAmount(item.physicalActAmount.toString());
                  }}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 justify-between",
                    selectedStyle,
                    errorHighlight
                  )}
                >
                  {/* Left clinic invoice panel */}
                  <div className="flex-1 space-y-1 sm:border-r sm:border-slate-100 sm:pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black text-slate-400">{item.id}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[8.5px] font-black uppercase rounded">FACTURE CLINIQUE</span>
                    </div>
                    <p className="text-xs font-black text-slate-900 uppercase mt-1">{item.clinicName}</p>
                    <p className="text-[11px] font-bold text-slate-500 font-sans">{item.invoiceActName}</p>
                    <p className="text-sm font-black text-slate-900 mt-2">{item.invoiceAmount.toLocaleString()} $</p>
                  </div>

                  {/* Matching Divider arrow */}
                  <div className="hidden sm:flex items-center justify-center">
                    <ArrowRight className={cn("w-5 h-5", item.isMismatched ? "text-rose-400 animate-pulse" : "text-green-400")} />
                  </div>

                  {/* Right medical physical acts registered */}
                  <div className="flex-1 space-y-1 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-slate-900 text-white text-[8.5px] font-black uppercase rounded">ACTE MEDICAL PHYSIQUE</span>
                      
                      {item.isMismatched && (
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-[8.5px] font-black uppercase rounded animate-pulse inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Écart important
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-slate-800 uppercase mt-1">Patient: {item.patientName}</p>
                    <p className="text-[11px] font-bold text-slate-500 font-mono italic">{item.physicalActName}</p>
                    <p className="text-sm font-black text-slate-900 mt-2">{item.physicalActAmount.toLocaleString()} $</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel right (D3 verification & adjustments) */}
        <div className="space-y-4">
          {selectedItem ? (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-5">
              <div>
                <span className="text-[8.5px] font-black text-indigo-600 uppercase tracking-widest block">Audit de Matching</span>
                <h4 className="text-base font-black text-slate-900 uppercase italic mt-1">{selectedItem.clinicName}</h4>
                <p className="text-[10px] text-slate-400 font-mono">CODE DOSSIER: {selectedItem.id}</p>
              </div>

              {selectedItem.isMismatched ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase">
                    <BookOpen className="w-4 h-4" /> Surchurcharge Tarifaire Détectée
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-normal">
                    La clinique réclame <strong className="text-slate-950 font-black">{selectedItem.invoiceAmount} $</strong> pour des actes valorisés à seulement <strong className="text-slate-950 font-black">{selectedItem.physicalActAmount} $</strong> par les rapports d&apos;activités physiques du service interne.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-bold leading-none">
                  <Check className="w-4 h-4 shrink-0" /> Écarts de facturation comblés (Réconcilié).
                </div>
              )}

              {selectedItem.isMismatched && (
                <>
                  <div className="space-y-1 px-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Ajuster le montant consenti ($)</label>
                    <input 
                      type="number"
                      value={activeAdjustmentAmount}
                      onChange={(e) => setActiveAdjustmentAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-indigo-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1 px-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Note / Justification des juristes</label>
                    <textarea 
                      rows={3}
                      value={auditComment}
                      onChange={(e) => setAuditComment(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button 
                      onClick={() => handleValidateReconciliation(selectedItem.id, false)}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Valider le rapprochement (Ajustement)
                    </button>

                    <button 
                      onClick={() => handleValidateReconciliation(selectedItem.id, true)}
                      className="w-full py-3 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Autoriser montant d&apos;origine clinicien
                    </button>
                  </div>
                </>
              )}

              {selectedItem.explanation && !selectedItem.isMismatched && (
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Ressources archivées de rapprochement</span>
                  <p className="text-[11px] font-medium italic text-slate-600 leading-relaxed">
                    &ldquo;{selectedItem.explanation}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-6 text-center text-slate-400 italic font-medium text-xs py-12">
              Sélectionnez une facture bilatérale à vérifier pour lancer les processus d&apos;ajustements de rapprochements.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
