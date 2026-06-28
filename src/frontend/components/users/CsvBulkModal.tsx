import React, { useState } from 'react';
import { FileSpreadsheet, Download, Upload, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../lib/AppContext';

interface CsvBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  formTenant: string;
}

export const CsvBulkModal: React.FC<CsvBulkModalProps> = ({ isOpen, onClose, formTenant }) => {
  const { registerNewUser, logAction } = useApp();
  const [csvStep, setCsvStep] = useState<1 | 2 | 3 | 4>(1);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  const handleNextStep1 = () => {
    setCsvStep(2);
  };

  const handleNextStep2 = () => {
    setCsvStep(3);
    setImportedCount(12); // Simulated count
  };

  const handleConfirmImport = () => {
    // Register simulated bulk users
    for (let i = 0; i < 12; i++) {
      registerNewUser({
        name: `User Bulk ${i + 1}`,
        email: `bulk.user${i + 1}@${formTenant}.cd`,
        contractName: `Contract ${formTenant.toUpperCase()}`,
        phone: `+243 812 345 ${String(100 + i)}`,
        address: 'Importé en masse',
        biometricsEnabled: false,
        biometricsLinked: false,
      });
    }
    logAction('IMPORT_MASS_UTILISATEURS', `Importation en masse réussie de 12 gestionnaires affectés à ${formTenant.toUpperCase()}.`);
    setCsvStep(4);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl w-full max-w-xl border overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 text-slate-800">
        <div className="border-b pb-4">
          <span className="text-[10px] font-black tracking-widest text-[#059669] uppercase font-mono">
            Processus d'importation en masse
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            CSV Bulk Matricules (4 ÉTAPES)
          </h3>
          <p className="text-xs text-slate-400">Associez un fichier tabulaire à l'établissement "{formTenant.toUpperCase()}".</p>
        </div>

        {/* Dynamic mini-stepper horizontal gauge */}
        <div className="flex justify-between items-center bg-slate-50 border rounded-2xl p-3 font-semibold text-[10px] font-mono text-slate-500">
          <span className={csvStep >= 1 ? "text-green-650 font-black" : ""}>1. Matrice {csvStep > 1 && "✓"}</span>
          <span className="text-slate-300">→</span>
          <span className={csvStep >= 2 ? "text-green-650 font-black" : ""}>2. Fichier {csvStep > 2 && "✓"}</span>
          <span className="text-slate-300">→</span>
          <span className={csvStep >= 3 ? "text-green-650 font-black" : ""}>3. Rapport {csvStep > 3 && "✓"}</span>
          <span className="text-slate-300">→</span>
          <span className={csvStep >= 4 ? "text-green-650 font-black" : ""}>4. Succès</span>
        </div>

        {csvStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-2xl flex gap-3 text-[11px] leading-relaxed">
              <Download className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold">Télécharger la matrice de structure (Excel/CSV) :</p>
                <p>
                  Veuillez utiliser notre modèle officiel pré-configuré avec les colonnes attendues (Nom complet, Email, Téléphone, Sexe, RBAC) pour éviter tout rejet lors du mappage.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("modèle_admin_neogtec_RDC_v2.csv téléchargé.")}
              className="w-full h-11 border border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2 font-black text-[10.5px] uppercase tracking-wider rounded-xl cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" /> modèle_admin_neogtec_RDC_v2.csv (3.1 Kb)
            </button>
            <div className="flex gap-2 justify-end border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleNextStep1}
                className="py-2.5 px-6 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Passer au chargement
              </button>
            </div>
          </div>
        )}

        {csvStep === 2 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center space-y-3 bg-slate-50 hover:bg-slate-100/50 transition cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-bold text-slate-800 text-center">Déposez votre fichier .CSV ici, ou parcourez</p>
              <p className="text-[10px] text-slate-400 text-center leading-none">Format supporté : UTF-8 Separated by Semicolon (;) uniquement (Max 5Mo)</p>
            </div>
            <div className="flex gap-2 justify-between border-t pt-4">
              <button
                type="button"
                onClick={() => setCsvStep(1)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="py-2.5 px-6 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Maper &amp; Valider
              </button>
            </div>
          </div>
        )}

        {csvStep === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-[#e6f4ea] border border-[#217346]/20 text-[#217346] rounded-2xl flex gap-3 text-[11px] leading-relaxed font-semibold">
              <Check className="w-5 h-5 text-emerald-700 shrink-0 animate-bounce" />
              <div className="space-y-1">
                <p className="font-extrabold uppercase">Rapport de structure valide !</p>
                <p>Aucune anomalie détectée sur l'analyse automatique.</p>
                <p className="border-t pt-1.5 mt-1.5 font-bold">Lignes lues : 12 | Erreurs : 0 | Succès estimé : 100%</p>
              </div>
            </div>
            <div className="flex gap-2 justify-between border-t pt-4">
              <button
                type="button"
                onClick={() => setCsvStep(2)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Mettre à plat
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Ranger définitivement {importedCount} users
              </button>
            </div>
          </div>
        )}

        {csvStep === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner border border-emerald-200">
              <Check className="w-8 h-8 shrink-0" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold uppercase">Importation complétée !</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Les 12 collaborateurs ont été importés dans la base, leurs e-mails d'invitation sécurisés ont été générés.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCsvStep(1);
                onClose();
              }}
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-black text-[10.5px] uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Fermer le dialogue central
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
