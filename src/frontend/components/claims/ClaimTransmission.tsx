import React, { useState } from 'react';
import { Send, ShieldCheck, Lock, Activity, CheckCircle2, AlertCircle, FileStack } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ClaimTransmission: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'sending' | 'success'>('idle');
  const [claimId, setClaimId] = useState('SIN-2024-551');

  const startTransmission = () => {
    setStatus('encrypting');
    setTimeout(() => {
      setStatus('sending');
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 p-6 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
          <Send className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-tight">Transmission de Demande</h2>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Passerelle sécurisée AES-256</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence Dossier</span>
          <span className="text-xs font-black text-slate-900">{claimId}</span>
        </div>
        
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-4">
          <FileStack className="w-8 h-8 text-slate-300" />
          <div className="flex-1">
            <p className="text-xs font-black text-slate-700">Lot d'actes rattachés (3)</p>
            <p className="text-[10px] font-medium text-slate-400 italic">Preuve électronique incluse</p>
          </div>
          <Lock className="w-4 h-4 text-slate-300" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
           <div className="flex justify-between items-center px-1">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut Transmission</span>
             <span className={cn(
               "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
               status === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
             )}>
               {status === 'idle' && "Prêt"}
               {status === 'encrypting' && "Chiffrement..."}
               {status === 'sending' && "Envoi en cours..."}
               {status === 'success' && "Transmis"}
             </span>
           </div>
           
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className={cn(
               "h-full bg-indigo-500 transition-all duration-500",
               status === 'idle' ? "w-0" : 
               status === 'encrypting' ? "w-1/3" :
               status === 'sending' ? "w-2/3" : "w-full bg-emerald-500"
             )} />
           </div>
        </div>

        {status === 'success' ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4 animate-in fade-in zoom-in-95 duration-500">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="space-y-1">
               <p className="text-xs font-black text-emerald-950 uppercase tracking-tight">Réception Confirmée</p>
               <p className="text-[10px] text-emerald-900/60 font-medium italic">
                 Dossier enregistré sur les serveurs de traitement. Numéro de suivi : <span className="font-bold underline">TR-9981-XX</span>
               </p>
            </div>
          </div>
        ) : (
          <button
            onClick={startTransmission}
            disabled={status !== 'idle'}
            className={cn(
              "w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-95",
              status === 'idle' 
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20" 
                : "bg-slate-100 text-slate-400 cursor-wait"
            )}
          >
            {status === 'idle' ? <Send className="w-4 h-4" /> : <Activity className="w-4 h-4 animate-spin" />}
            {status === 'idle' ? "Transmettre le dossier" : "Transmission en cours"}
          </button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
         <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Conformité RGPD & Sécurité Health-Data</span>
         </div>
      </div>
    </div>
  );
};
