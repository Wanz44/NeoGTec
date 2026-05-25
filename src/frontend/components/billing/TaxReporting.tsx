/**
 * 📄 Fichier : /src/frontend/components/billing/TaxReporting.tsx
 * 🎯 Objectif : Rapports fiscaux conformes multi-devises et multi-juridictions (D4).
 */
import React, { useState } from 'react';
import { 
  FileText, Landmark, ShieldCheck, Scale, Download, Filter, ArrowUpRight, Calculator,
  TrendingDown, Info, Lock, CheckCircle2, ChevronDown, Check, X, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface TaxLog {
  id: string;
  country: string;
  currency: string;
  period: string;
  taxAmount: number;
  generatedAt: string;
  status: 'Certifié' | 'En attente';
}

const INITIAL_TAX_LOGS: TaxLog[] = [
  { id: 'TAX-RDC-901', country: 'République Démocratique du Congo', currency: 'USD', period: 'Avril 2026', taxAmount: 18400, generatedAt: '02/05/2026 14:10', status: 'Certifié' },
  { id: 'TAX-FR-202', country: 'France', currency: 'EUR', period: 'Q1 2026', taxAmount: 12500, generatedAt: '15/04/2026 10:30', status: 'Certifié' },
  { id: 'TAX-RDC-804', country: 'République Démocratique du Congo', currency: 'CDF', period: 'Mars 2026', taxAmount: 48500000, generatedAt: '01/04/2026 09:00', status: 'Certifié' }
];

export const TaxReporting: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<'RDC' | 'France' | 'Congo-Brazza'>('RDC');
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'CDF' | 'EUR'>('USD');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Mai 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<TaxLog[]>(INITIAL_TAX_LOGS);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Generate simulated fiscal report (D4 Action)
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const countryName = selectedCountry === 'RDC' 
        ? 'République Démocratique du Congo' 
        : selectedCountry === 'France' ? 'France' : 'République du Congo';

      const mockTaxAmount = selectedCurrency === 'CDF' ? 38200000 : 14500;

      const newLog: TaxLog = {
        id: `TAX-${selectedCountry}-${Math.floor(100 + Math.random() * 900)}`,
        country: countryName,
        currency: selectedCurrency,
        period: selectedPeriod,
        taxAmount: mockTaxAmount,
        generatedAt: new Date().toLocaleString(),
        status: 'Certifié'
      };

      setLogs([newLog, ...logs]);
      showToast(`Rapport Fiscal PDF généré avec succès pour la juridiction "${countryName}" en ${selectedCurrency}. Archivé sur l'IPFS.`);
    }, 2000);
  };

  return (
    <div className="space-y-6">

      {/* Internal interactive success Feedback toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Générateur Fiscal</p>
              <p className="text-xs text-slate-350 font-bold mt-1 leading-relaxed">{toast}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Selector Left (D4 country dropdown + currencies) */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Landmark className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase italic">Configuration Regimes</h4>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Territoire Juridictionnel</label>
              <select 
                value={selectedCountry}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSelectedCountry(val);
                  if (val === 'RDC') setSelectedCurrency('USD');
                  else if (val === 'France') setSelectedCurrency('EUR');
                  else setSelectedCurrency('CDF');
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black"
              >
                <option value="RDC">République Démocratique du Congo (ARCA-DGI)</option>
                <option value="France">France (TVA / IPR Union Européenne)</option>
                <option value="Congo-Brazza">République du Congo (Brazzaville)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Devise du Rapport</label>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black"
                >
                  <option value="USD">USD ($)</option>
                  <option value="CDF">CDF (FC)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Période Fiscale</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black"
                >
                  <option value="Mai 2026">Mai 2026</option>
                  <option value="Avril 2026">Avril 2026</option>
                  <option value="Q1 2026">1er Trimestre 2026</option>
                  <option value="Exercice Fiscal 2025">Annuel Complet 2025</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-slate-900/15 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validation compliance...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Générer rapport fiscal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Previous fiscal document list right (D4 logs) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50">
            <span className="text-xs font-black text-slate-900 uppercase">Registre d&apos;archivage des Rapports Fiscaux</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest p-1 bg-slate-50 rounded border border-slate-150">DGI-ARCA compliant Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans col-auto">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[8.5px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-3 px-4">Référence</th>
                  <th className="py-3 px-4">Territoire Juridictionnel</th>
                  <th className="py-3 px-4">Période</th>
                  <th className="py-3 px-4 text-right">Impôt / Redevance Calculé</th>
                  <th className="py-3 px-4">Généré le</th>
                  <th className="py-3 px-4">Statut de validation</th>
                  <th className="py-3 px-4 text-center">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-800">{log.id}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 uppercase">{log.country}</td>
                    <td className="py-3 px-4 font-semibold text-slate-500 uppercase text-[10px]">{log.period}</td>
                    <td className="py-3 px-4 text-right font-black text-indigo-600">
                      {log.taxAmount.toLocaleString()} {log.currency}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 font-bold">{log.generatedAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-150 rounded text-[9px] font-black uppercase">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => showToast(`Téléchargement de l&apos;archive fiscale ${log.id}.pdf signé cryptographiquement...`)}
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Télécharger l'attestation signée"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
