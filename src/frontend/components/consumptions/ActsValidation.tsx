import React, { useState } from 'react';
import { ClipboardCheck, FileText, Zap, Plus, X, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Act {
  id: string;
  name: string;
  code: string;
  cost: number;
}

const AVAILABLE_ACTS: Act[] = [
  { id: '1', name: 'Consultation Spécialisée', code: 'C01', cost: 45 },
  { id: '2', name: 'Analyses Sanguines (NFS)', code: 'B12', cost: 15 },
  { id: '3', name: 'Radiographie Thorax', code: 'R45', cost: 80 },
  { id: '4', name: 'Échographie Abdominale', code: 'E10', cost: 120 },
];

export const ActsValidation: React.FC = () => {
  const [selectedActs, setSelectedActs] = useState<Act[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const addAct = (act: Act) => {
    if (!selectedActs.find(a => a.id === act.id)) {
      setSelectedActs([...selectedActs, act]);
    }
  };

  const removeAct = (id: string) => {
    setSelectedActs(selectedActs.filter(a => a.id !== id));
  };

  const total = selectedActs.reduce((sum, a) => sum + a.cost, 0);

  const handleValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidated(true);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-2xl">
            <ClipboardCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Validation des Actes</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Contrôle électronique immédiat</p>
          </div>
        </div>
        {validated && (
          <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-3 h-3" /> Validé
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Liste des actes disponibles */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Catalogue des actes</label>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {AVAILABLE_ACTS.map((act) => (
              <button
                key={act.id}
                onClick={() => addAct(act)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all group"
              >
                <div className="text-left">
                  <p className="text-sm font-black text-slate-700">{act.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">Code: {act.code}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-900">{act.cost} $</span>
                  <Plus className="w-4 h-4 text-slate-300 group-hover:text-green-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panier des actes à valider */}
        <div className="flex flex-col">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Sélection (Prestation en cours)</label>
          <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-4 min-h-[150px]">
            {selectedActs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 opacity-50">
                <FileText className="w-8 h-8" />
                <span className="text-[10px] font-black uppercase">Aucun acte sélectionné</span>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedActs.map((act) => (
                  <div key={act.id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                    <span className="text-xs font-black text-slate-700">{act.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-green-600">{act.cost} $</span>
                      <button onClick={() => removeAct(act.id)} className="p-1 hover:bg-rose-50 rounded text-rose-400 hover:text-rose-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-slate-400">Total estimé</span>
              <span className="text-xl font-black text-slate-900">{total} $</span>
            </div>
            
            <button
               onClick={handleValidation}
               disabled={selectedActs.length === 0 || isValidating}
               className={cn(
                 "w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                 validated 
                  ? "bg-emerald-500 text-white cursor-default" 
                  : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
               )}
            >
              {isValidating ? <Zap className="w-4 h-4 animate-spin text-white" /> : <ClipboardCheck className="w-4 h-4" />}
              {isValidating ? "Validation..." : validated ? "Session Validée" : "Demander Validation"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
        <ShieldAlert className="w-4 h-4 text-amber-500" />
        <p className="text-[10px] font-bold text-amber-700 italic">
          Cette action verrouille les plafonds de l'assuré pour la durée de la prestation.
        </p>
      </div>
    </div>
  );
};
