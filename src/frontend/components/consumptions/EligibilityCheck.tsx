import React, { useState } from 'react';
import { ShieldCheck, User, Search, Fingerprint, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const EligibilityCheck: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'idle' | 'eligible' | 'denied'>('idle');

  const handleVerify = () => {
    setChecking(true);
    setResult('idle');
    setTimeout(() => {
      setChecking(false);
      setResult(patientId.includes('001') ? 'eligible' : 'denied');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-50 rounded-2xl">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-black text-green-950">Vérification d'éligibilité</h2>
          <p className="text-xs font-bold text-green-900/40 uppercase tracking-widest italic">Temps Réel • Connexion sécurisée</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-green-900/40 uppercase tracking-widest block mb-2 px-1">ID Assuré / Numéro de Carte</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-900/40 group-focus-within:text-green-600 transition-colors" />
            <input 
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Ex: AFK-12345678"
              className="w-full h-14 pl-12 pr-4 bg-green-50/50 border-2 border-transparent border-dashed rounded-2xl focus:bg-white focus:border-green-500/20 focus:outline-none text-green-950 font-black transition-all placeholder:text-green-900/20"
            />
          </div>
        </div>

        <button 
          onClick={handleVerify}
          disabled={!patientId || checking}
          className={cn(
            "w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all",
            checking ? "bg-green-100 text-green-400 cursor-wait" : "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {checking ? <Activity className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {checking ? "Interrogation base de données..." : "Vérifier l'éligibilité"}
        </button>

        {result === 'eligible' && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-black text-emerald-950">Assuré Éligible</span>
            </div>
            <p className="text-xs text-emerald-900/60 leading-relaxed">
              La police est active. Plafond annuel disponible : <span className="font-bold text-emerald-600">4,500 $</span>. 
              Prise en charge à 80% confirmée.
            </p>
          </div>
        )}

        {result === 'denied' && (
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span className="text-sm font-black text-rose-950">Vérification Échouée</span>
            </div>
            <p className="text-xs text-rose-900/60 leading-relaxed">
              Impossible de confirmer l'éligibilité. Motif : <span className="font-bold text-rose-600 italic">Cotisations impayées ou contrat suspendu</span>.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-green-50">
        <div className="flex items-center gap-2 text-[10px] font-black text-green-900/20 uppercase tracking-tighter">
          <Fingerprint className="w-3 h-3" />
          Authentification Biométrique Disponible pour ce client
        </div>
      </div>
    </div>
  );
};
