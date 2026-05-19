import React, { useState, useEffect } from 'react';
import { Calculator, Percent, Wallet, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PricingCalculator: React.FC = () => {
  const [baseAmount, setBaseAmount] = useState<number>(100);
  const [coverageRate, setCoverageRate] = useState<number>(80);
  const [deductible, setDeductible] = useState<number>(10); // Franchise fixe

  // Calculs auto
  const carrierShare = (baseAmount * coverageRate) / 100;
  const patientShare = baseAmount - carrierShare + deductible;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 border border-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
          <Calculator className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black italic">Calculateur de Frais</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Moteur de tarification v4.2</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input: Montant de base */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Total de l'Acte</label>
            <span className="text-xs font-black text-indigo-400">{baseAmount} $</span>
          </div>
          <input 
            type="range"
            min="10"
            max="2000"
            step="10"
            value={baseAmount}
            onChange={(e) => setBaseAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Info Box: Barème Conventionné */}
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Taux de couverture</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <Percent className="w-3 h-3" />
                <span className="text-xs font-black">{coverageRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Franchise (Fixe)</span>
              <span className="text-xs font-black text-blue-400">{deductible} $</span>
            </div>
          </div>
          <div className="w-px bg-slate-700 h-full" />
          <div className="flex flex-col justify-center items-center px-2">
            <Info className="w-4 h-4 text-slate-500 mb-1" />
            <span className="text-[8px] font-bold text-slate-600 uppercase text-center">Règles<br/>Police</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Part Assureur</span>
            </div>
            <p className="text-2xl font-black text-emerald-500">{carrierShare.toFixed(2)} $</p>
          </div>
          
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-tighter">Reste à charge</span>
            </div>
            <p className="text-2xl font-black text-amber-500">{patientShare.toFixed(2)} $</p>
          </div>
        </div>

        <div className="relative pt-4 overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent group-hover:scale-x-110 transition-transform duration-700" />
          <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
            * Le reste à charge inclut le ticket modérateur (20%) et la franchise contractuelle de {deductible}$.
          </p>
        </div>
      </div>
    </div>
  );
};
