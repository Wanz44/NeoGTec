/**
 * 📱 Fichier : /src/frontend/components/dashboards/MobileAssureApp.tsx
 * 🎯 Objectif : Application Mobile Assuré - Jean PATIENT (ACME SARL)
 * CONFORMITÉ : RGPD, Cartes Santé Virtuelles, Consommations & Plafonds
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, QrCode, CreditCard, Shield, Heart, Activity, Compass, 
  ChevronRight, Calendar, User, UserPlus, PhoneCall, RefreshCw, X, Check, Eye
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

export const MobileAssureApp: React.FC = () => {
  const { logAction } = useApp();
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Ceilings and Consumptions Mock
  const totalLimit = 500;
  const consumed = 460;
  const remaining = totalLimit - consumed;
  const progressPercent = (consumed / totalLimit) * 100;

  const triggerQRScanSimMessage = () => {
    setShowQRModal(true);
    logAction('GENERATE_HEALTH_QR_MIMIC', "Jean PATIENT a généré un pass QR d'autorisation chiffré à validité temporaire (60 secondes) pour présentation en pharmacie.", "INFO");
  };

  const copyPrescriptionHash = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="flex justify-center items-center py-6 min-h-[400px]">
      
      {/* Smartphone Outer Shell Container Frame */}
      <div className="w-full max-w-[360px] bg-slate-950 p-3 rounded-[3.5rem] shadow-2xl border-4 border-slate-800 relative ring-8 ring-slate-900/40">
        
        {/* Dynamic Island Mimic */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 bg-slate-900 rounded-full absolute left-3" />
          <div className="w-1.5 h-1.5 bg-blue-900 rounded-full absolute right-6 animate-pulse" />
        </div>

        {/* Screen inner content */}
        <div className="w-full bg-slate-50 rounded-[2.8rem] overflow-hidden text-slate-800 font-sans min-h-[600px] flex flex-col justify-between relative select-none">
          
          {/* Header */}
          <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white p-6 pt-10 pb-12 rounded-b-[2rem] space-y-3 shadow-md relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-white font-extrabold text-xs">
                  JP
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight leading-none">Jean PATIENT</h4>
                  <p className="text-[8px] text-indigo-200 mt-1 uppercase font-bold">ACME SARL • Assuré</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500 text-[8px] font-black uppercase rounded">Actif</span>
            </div>

            {/* Virtual virtual Card Mimic slider */}
            <div 
              onClick={triggerQRScanSimMessage}
              className="mt-4 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-white/10 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden active:scale-95 py-6"
            >
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-600/20 rounded-full blur-xl" />
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[7.5px] font-black text-indigo-400 uppercase tracking-widest leading-none">CARTE SANTÉ VIRTUELLE</span>
                  <p className="text-sm font-black tracking-widest mt-1">POL-882-ACME</p>
                </div>
                <QrCode className="w-6 h-6 text-white shrink-0" />
              </div>
              <div className="mt-8 flex justify-between items-end">
                <span className="text-[7px] text-slate-400 font-bold uppercase">PIN Code Sec: ****</span>
                <span className="px-2 py-0.5 bg-indigo-600 rounded text-[7px] font-black tracking-widest uppercase">Tap pour QR Code</span>
              </div>
            </div>
          </div>

          {/* Main Apps widgets scroll */}
          <div className="px-4 -mt-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar pb-8 z-10">
            
            {/* Ceiling consumptions dashboard widget constraint */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-slate-450">Consommation Plafond Annuel</span>
                <span className="text-indigo-600">{consumed} USD / {totalLimit} USD</span>
              </div>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-400">
                <span>Reste disponible : <span className="text-emerald-600 font-extrabold">{remaining} USD</span></span>
                <span className="text-rose-600 font-extrabold">Seuil critique à 90%</span>
              </div>
            </div>

            {/* Micro Quick actions grid */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={triggerQRScanSimMessage}
                className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-col items-center text-center gap-1 cursor-pointer active:scale-95 transition-transform"
              >
                <QrCode className="w-5 h-5 text-indigo-600" />
                <span className="text-[9px] font-black uppercase text-slate-700">Scan pharmacie</span>
              </div>
              <a 
                href="tel:+243812345678"
                onClick={() => logAction('TELEPHONE_URGENCY_PORTABLE', "Jean PATIENT a sollicité le plateau d'astreinte médicale d'urgence d'AssurAdvancé.", 'WARNING')}
                className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center text-center gap-1 active:scale-95 transition-transform"
              >
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <span className="text-[9px] font-black uppercase text-rose-700">Urgence 24h</span>
              </a>
            </div>

            {/* Claims History */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">RELEVÉS DE SOINS RÉCENTS</p>
              
              <div className="space-y-2 divide-y divide-slate-100/70">
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <div>
                    <p className="font-extrabold text-slate-900 leading-none">Clinique Ngaliema</p>
                    <span className="text-[8px] text-slate-400 font-bold">Consultation Générale • 25 mai</span>
                  </div>
                  <span className="font-black text-slate-800">45 USD</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-2">
                  <div>
                    <p className="font-extrabold text-slate-900 leading-none">Pharmacie KinPharma</p>
                    <span className="text-[8px] text-slate-400 font-bold">Amoxicilline + Paracétamol • 20 mai</span>
                  </div>
                  <span className="font-black text-rose-500">25 USD (Plafond)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Micro App bottom tabs menu navigation */}
          <div className="p-3 bg-white border-t border-slate-200 flex justify-around items-center rounded-b-[2.8rem] z-10 shrink-0">
            <button className="flex flex-col items-center text-indigo-600 cursor-pointer">
              <Compass className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase mt-0.5">Explore</span>
            </button>
            <button onClick={triggerQRScanSimMessage} className="flex flex-col items-center text-slate-400 hover:text-indigo-600 cursor-pointer">
              <QrCode className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase mt-0.5">Card QR</span>
            </button>
            <button className="flex flex-col items-center text-slate-400 hover:text-indigo-600 cursor-pointer">
              <User className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase mt-0.5">Compte</span>
            </button>
          </div>

        </div>

      </div>

      {/* BIOMETRIC QR CARD PRESENTATION MODAL DIALOG MOCK */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4"
            >
              <div className="flex justify-between items-center bg-slate-50/50 p-2 border-b border-slate-100 rounded-t-2xl">
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest">TEMPORARY PASS COOPENT</span>
                <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <div className="mx-auto w-40 h-40 bg-indigo-55/40 p-3 rounded-2xl border border-indigo-100 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-indigo-950" />
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 leading-none">Code QR d&apos;Autorisation Unique</h4>
                <p className="text-[10px] text-slate-450 font-bold mt-1 max-w-xs mx-auto">
                  Présentez ce code sécurisé au pharmacien ou au bureau des admissions d&apos;entrée. Expire de manière cryptographique dans 60 secondes.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={copyPrescriptionHash}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider block w-full"
                >
                  {copiedCode ? "Copié !" : "Copier la signature SHA"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
