/**
 * 📄 Fichier : /src/frontend/components/partners/QualityControl.tsx
 * 🎯 Objectif : Suivi de la qualité, badge Gold Partner d'exception d'audit et déclenchement d'audits inopinés J+0 (H4).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Star, Users, Clock, AlertTriangle, Play, CheckCircle, 
  Settings, XCircle, Search, Flame, Award, HeartHandshake, Eye
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QualityModel {
  name: string;
  score: number; // 1-100 scale
  isGoldPartner: boolean;
  patientsCount: number;
  lastAuditDate: string;
}

const INITIAL_QUALITY_RECORDS: QualityModel[] = [
  { name: 'HJ Hospitals Gombe', score: 96, isGoldPartner: true, patientsCount: 1420, lastAuditDate: '2026-05-12' },
  { name: 'Clinique Ngaliema', score: 88, isGoldPartner: false, patientsCount: 950, lastAuditDate: '2026-04-18' },
  { name: 'Centre de Santé Kisenso', score: 64, isGoldPartner: false, patientsCount: 310, lastAuditDate: '2026-02-10' }
];

export const QualityControl: React.FC = () => {
  const [partners, setPartners] = useState<QualityModel[]>(INITIAL_QUALITY_RECORDS);
  const [selectedPartner, setSelectedPartner] = useState<QualityModel | null>(null);
  
  // H4.3 Audit inopiné states
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [inspectedPartner, setInspectedPartner] = useState<QualityModel | null>(null);
  const [auditsLog, setAuditsLog] = useState<string[]>([]);

  const triggerRandomAudit = (partner: QualityModel) => {
    setInspectedPartner(partner);
    setShowAuditModal(true);
    
    // Append to audits
    const time = new Date().toLocaleTimeString();
    setAuditsLog(prev => [`[${time}] Inspection inopinée J+0 activée à ${partner.name}`, ...prev]);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Moyenne Nationale Qualité", value: "84 %", desc: "Seuil minimal de convention: 70%", color: "text-indigo-650" },
          { label: "Etablissements Gold Partner", value: "1 Hôpital", desc: "Exempt de contrôles systématiques", color: "text-amber-600" },
          { label: "Audits Inopinés Déclenchés (J+0)", value: auditsLog.length + " aujourd'hui", desc: "Astreinte inspecteur temps réel", color: "text-rose-600" }
        ].map((h, idx) => (
          <div key={idx} className="bg-white border border-slate-150 rounded-[2rem] p-5 shadow-sm space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-bold block">{h.label}</span>
            <p className={cn("text-xl font-black italic", h.color)}>{h.value}</p>
            <p className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">{h.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Directory Quality Scoring list Column */}
        <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-50 flex justify-between items-center">
            <span className="text-xs font-black text-slate-900 uppercase">H4. Registre Qualité ARCA</span>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="space-y-3">
            {partners.map((p, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase italic leading-none">{p.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dernier audit : {p.lastAuditDate}</p>
                  </div>

                  {p.isGoldPartner && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-black uppercase rounded border border-amber-250 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 fill-amber-300" /> Gold Partner
                    </span>
                  )}
                </div>

                {/* Score bar 0-100 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400">
                    <span>Score de Qualité :</span>
                    <span className={cn(
                      "font-mono font-black text-[10px]",
                      p.score >= 90 ? "text-emerald-600" : p.score >= 75 ? "text-amber-600" : "text-rose-600"
                    )}>{p.score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        p.score >= 90 ? "bg-emerald-500" : p.score >= 75 ? "bg-amber-400" : "bg-rose-500"
                      )}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>

                {/* Exception Rules Context (H4.2 Gold partner protected against audit system) */}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono font-bold uppercase">{p.patientsCount} Prises</span>
                  
                  {p.isGoldPartner ? (
                    <span className="text-emerald-700 font-bold text-[8.5px] uppercase flex items-center gap-1 font-mono">
                      ✓ Audit system d&apos;office exempt
                    </span>
                  ) : (
                    <button 
                      onClick={() => triggerRandomAudit(p)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                    >
                      Audit inopiné J+0
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Audit Realtime Alert Center logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-[2.5rem] shadow-sm space-y-4">
            <div className="pb-2 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-black text-white uppercase tracking-widest font-mono">Contrôle Inopiné : J+0 Alert Center</span>
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {auditsLog.length === 0 ? (
                <div className="text-center py-10 italic text-slate-500 text-xs font-bold uppercase">
                  Aucun audit inopiné déclenché dans les dernières 24 heures.
                </div>
              ) : (
                auditsLog.map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-800 border border-slate-755 text-slate-200 rounded-xl flex items-start gap-2 text-xs font-mono">
                    <Flame className="w-4 h-4 text-rose-505 shrink-0 mt-0.5 animate-pulse text-rose-500" />
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-755 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-slate-300 text-justify">
              <HeartHandshake className="w-5 h-5 text-indigo-400 shrink-0" />
              <p className="leading-relaxed">
                <span className="font-extrabold text-[#95a3b8] text-[10px] uppercase block mb-1">Concept de confiance et d&apos;allègement (H4.2) :</span>
                Les cliniques atteignant un indice de satisfaction de 95% minimum bénéficient de la désignation <span className="font-bold text-amber-300">Gold Partner</span>. Cette confiance partagée exempte ces établissements des contrôles et re-calculs systématiques de NeoGTec, fluidifiant les flux monétaires sous 48h.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* MODAL INOPINE J+0 AUDIT CONFIRMER (H4.3)            */}
      {/* ================================================== */}
      <AnimatePresence>
        {showAuditModal && inspectedPartner && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowAuditModal(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-150 p-8 space-y-4"
            >
              <div className="flex items-center gap-2 text-rose-600 pb-2 border-b">
                <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
                <h4 className="text-xs font-black uppercase text-slate-900">Ordre d&apos;inspection J+0 déclenché</h4>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-655 text-justify leading-relaxed">
                <p>
                  Félicitations administrative, l&apos;inspecteur en chef a reçu la mission d&apos;audit immédiate (J+0) pour : 
                  <span className="font-extrabold text-slate-900 block mt-1 uppercase italic">{inspectedPartner.name}</span>
                </p>

                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[11px] font-mono leading-none">
                  Astreinte de déplacement : Immédiat J+0.
                </div>

                <p>
                  Toutes les transactions facturées depuis cet établissement passent temporairement en mode d&apos;instruction forcée jusqu&apos;à levée du procès-verbal d&apos;inspection médicale.
                </p>
              </div>

              <button 
                onClick={() => setShowAuditModal(false)}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center cursor-pointer font-black"
              >
                Confirmer l&apos;ordre d&apos;injonction
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
