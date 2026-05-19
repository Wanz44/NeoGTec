import React from 'react';
import { Smartphone, QrCode, ShieldCheck, User, Users, Globe, Download, Share2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export const VirtualCard: React.FC = () => {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-green-950 italic uppercase tracking-tighter">Votre Carte Digitale</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Identification Universelle AfreakCare</p>
      </div>

      {/* The Card */}
      <div className="relative aspect-[1.6/1] w-full bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 overflow-hidden group">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="space-y-1">
                <h1 className="text-xl font-black italic tracking-tighter text-green-400">AFREAKCARE.</h1>
                <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[7px] font-black uppercase tracking-[0.2em] w-fit">
                   Standard International
                </div>
             </div>
             <div className="flex flex-col items-end">
                <Globe className="w-5 h-5 text-white/20" />
                <span className="text-[8px] font-bold text-white/30 uppercase mt-1">Global Pass / Zone EAC</span>
             </div>
          </div>

          <div className="space-y-4">
             <div>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Titulaire du compte</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                      <User className="w-6 h-6 text-white/20" />
                   </div>
                   <div>
                      <p className="text-lg font-black uppercase tracking-tight">Adonaï WANZAMBI</p>
                      <p className="text-[10px] font-bold text-green-400 font-mono">POL-123456-SEC</p>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex gap-6">
                   <div>
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Expire le</p>
                      <p className="text-[10px] font-black">12 / 2028</p>
                   </div>
                   <div>
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Réseau</p>
                      <p className="text-[10px] font-black uppercase">Premium+</p>
                   </div>
                </div>
                <div className="p-1.5 bg-white rounded-lg shadow-inner">
                   <QrCode className="w-8 h-8 text-black" />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <button className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all shadow-sm group">
            <div className="p-3 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
               <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Télécharger PDF</span>
         </button>
         <button className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all shadow-sm group">
            <div className="p-3 bg-green-600 rounded-2xl group-hover:scale-110 transition-transform">
               <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Partager (Wallet)</span>
         </button>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
         <Info className="w-5 h-5 text-amber-500 shrink-0" />
         <p className="text-[10px] font-bold text-amber-900/60 leading-relaxed italic">
           Présentez ce QR Code dans n'importe quel hôpital partenaire pour une admission instantanée sans paperasse.
         </p>
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
         <ShieldCheck className="w-4 h-4 text-emerald-500" />
         <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Validé par l'autorité de régulation des assurances</span>
      </div>
    </div>
  );
};
