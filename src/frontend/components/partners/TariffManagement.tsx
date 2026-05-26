/**
 * 📄 Fichier : /src/frontend/components/partners/TariffManagement.tsx
 * 🎯 Objectif : Mise à jour des barèmes, importation Excel simulée, et simulateur d'impact actuariel par curseur (H5).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, Search, Plus, Filter, RefreshCw, Upload, Download, 
  CheckCircle, ArrowRight, Save, Sliders, TrendingUp, Sparkles, FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MedicalAct {
  id: string;
  code: string;
  label: string;
  category: 'Consultation' | 'Hospitalisation' | 'Laboratoire';
  priceUSD: number;
}

const INITIAL_ACTS: MedicalAct[] = [
  { id: 'ACT-001', code: 'C01', label: 'Consultation Généraliste', category: 'Consultation', priceUSD: 15.00 },
  { id: 'ACT-002', code: 'H01', label: 'Nuitee Hospitalisation Standard', category: 'Hospitalisation', priceUSD: 45.00 },
  { id: 'ACT-003', code: 'L01', label: 'Numération Formule Sanguine (NFS)', category: 'Laboratoire', priceUSD: 25.00 }
];

export const TariffManagement: React.FC = () => {
  const [acts, setActs] = useState<MedicalAct[]>(INITIAL_ACTS);
  const [search, setSearch] = useState('');
  
  // H5.2 Excel Simulator states
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState<string | null>(null);

  // H5.3 Actuarial Slider states
  const [consultationBaseCost, setConsultationBaseCost] = useState<number>(15);
  const totalSubscribers = 152340; // from cockpit DG KPI list
  const averageConsultationsPerYear = 3.5;

  // Formula: Projection = Cost * average visits * total subscribers
  const projectedAnnualBudget = Math.round(consultationBaseCost * averageConsultationsPerYear * totalSubscribers);

  const simulateExcelImport = () => {
    setIsImporting(true);
    setImportReport(null);

    setTimeout(() => {
      setIsImporting(false);
      setImportReport('✓ Importation de Barème Excel réussie ! 42 tarifs d\'actes mis à jour avec simulation d\'impact actuariel de +3.4% à l\'échelle nationale RDC.');
    }, 1500);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Directory pricing grid Column */}
        <div className="lg:col-span-2 bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-xs font-black text-slate-900 uppercase">H5. Barème d&apos;Actes Médicaux Officiels</span>
            <Calculator className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>

          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-indigo-50 text-[10px] font-black uppercase text-slate-400 bg-slate-50/50">
                <th className="p-3">Code CCAM</th>
                <th className="p-3">Libellé</th>
                <th className="p-3">Tarif Unitaire (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {acts.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <span className="font-mono bg-indigo-55 bg-indigo-50/50 text-indigo-700 px-2 py-0.5 rounded font-black text-[10.5px]">
                      {act.code}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 uppercase text-[11px]">{act.label}</td>
                  <td className="p-3 font-mono font-black text-slate-950">
                    {act.code === 'C01' ? consultationBaseCost : act.priceUSD} USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Excel Importer & Actuarial Simulator Slider Column */}
        <div className="space-y-6">
          
          {/* Importer Simulation Box */}
          <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
            <div className="pb-2 border-b">
              <span className="text-xs font-black text-slate-900 uppercase">H5.2 Import Doublon Excel / CSV</span>
            </div>

            <div 
              onClick={simulateExcelImport}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 p-6 text-center cursor-pointer space-y-1.5 bg-slate-50/50 rounded-2xl transition-colors select-none"
            >
              <Upload className="mx-auto w-8 h-8 text-slate-400 animate-bounce" />
              <p className="text-xs font-black text-slate-800 uppercase">Glisser-déposer le barème Excel</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Formats supportés : .xlsx, .csv</p>
            </div>

            {isImporting && (
              <div className="p-2 bg-indigo-50 text-indigo-700 text-center font-black text-[10px] uppercase rounded-lg animate-pulse tracking-wide">
                Calibration des coefficients de risque...
              </div>
            )}

            <AnimatePresence>
              {importReport && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-emerald-800 text-xs font-semibold"
                >
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                  <p className="leading-relaxed">{importReport}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actuarial Price Impact Slider */}
          <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">H5.3 Simulateur d&apos;Impact Actuariel</span>
              <Sliders className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="font-extrabold text-[#94a3b8] uppercase">Coût Consultation Généraliste :</span>
                <span className="font-black text-indigo-400">{consultationBaseCost} USD</span>
              </div>
              <input 
                type="range"
                min="10"
                max="50"
                step="1"
                className="w-full cursor-pointer accent-indigo-550"
                value={consultationBaseCost}
                onChange={(e) => setConsultationBaseCost(Number(e.target.value))}
              />
            </div>

            {/* Calculations metrics output */}
            <div className="p-4 bg-slate-800 border border-slate-755 rounded-2xl space-y-3 font-mono text-[10px]">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Nombre d&apos;assurés cockpit :</span>
                <span className="text-white font-extrabold">{totalSubscribers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-800">
                <span className="text-slate-400">Arbitrage de visites Moyen/an :</span>
                <span className="text-white font-extrabold">{averageConsultationsPerYear} consultations/an</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-800 text-[11px] font-black">
                <span className="text-indigo-300 uppercase">Budget Consultations Annuel :</span>
                <span className="text-emerald-400">{projectedAnnualBudget.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-xl flex items-start gap-1.5 text-[11px] text-justify text-slate-335 text-slate-300 leading-normal">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
              <p>
                La variation de 1 USD sur le coût unitaire de consultation induit un impact mécanique de <span className="font-bold font-mono text-emerald-400">{(totalSubscribers * averageConsultationsPerYear).toLocaleString()} USD</span> de dépenses d&apos;indemnités par an.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
