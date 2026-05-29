import React from 'react';
import { Shield, X, Save, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserProfile } from '../../lib/AppContext';

interface PrivilegeDrawerProps {
  user: UserProfile | null;
  onClose: () => void;
  privList: any;
  setPrivList: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
}

export const PrivilegeDrawer: React.FC<PrivilegeDrawerProps> = ({ 
  user, onClose, privList, setPrivList, onSave 
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[500] w-full max-w-md bg-white border-l shadow-2xl flex flex-col h-screen text-slate-800">
      <div className="p-6 border-b flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600 animate-pulse" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">Privilèges &amp; Habilitations</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MODIFIER : {user.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-bold uppercase cursor-pointer border"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-140px)] no-scrollbar">
        
        {/* Sinistres Habilitations Group */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-indigo-650 tracking-wider uppercase font-mono">1. Module Sinistres &amp; Fraude :</p>
          <div className="space-y-2">
            {[
              { key: 'sinistresVoir', label: 'sinistre.read (Dossiers)', desc: 'Autoriser la visualisation en lecture seule des détails des dossiers.' },
              { key: 'sinistresCreer', label: 'sinistre.create (Initiation)', desc: 'Initier un sinistre ou encoder des ordonnances médicales.' },
              { key: 'sinistresApprouveLt500', label: 'sinistre.approve_under_500 (Inférieur 500$)', desc: 'Valider et liquider les pré-autorisations de soins.' },
              { key: 'sinistresApprouveGt500', label: 'sinistre.approve_over_500 (Gros montants)', desc: 'Approbation finale au-delà des plafonds standard.' },
              { key: 'sinistresSupprimer', label: 'sinistre.delete (Révocation)', desc: 'Supprimer définitivement un dossier de la base opérationnelle.' }
            ].map(item => (
              <label 
                key={item.key} 
                className="flex items-start gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl cursor-pointer transition-all shadow-3xs"
              >
                <input
                  type="checkbox"
                  checked={privList[item.key]}
                  onChange={(e) => setPrivList((prev: any) => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-4.5 h-4.5 accent-indigo-600 rounded border-slate-300 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight font-semibold">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Administration Habilitations Group */}
        <div className="space-y-3 pt-4 border-t">
          <p className="text-[10px] font-black text-indigo-650 tracking-wider uppercase font-mono">2. Module Équipe &amp; Workspace :</p>
          <div className="space-y-2">
            {[
              { key: 'employesVoir', label: 'user.read (Visualisation)', desc: 'Lecture de la table des gestionnaires et assurés.' },
              { key: 'employesAjouter', label: 'user.create (Inscriptions)', desc: 'Ajouter des bénéficiaires ou expédier des invitations.' },
              { key: 'employesModifier', label: 'user.update (Privilèges)', desc: 'Éditer les paramètres, adresses ou rôles de l\'équipe.' },
              { key: 'employesExporter', label: 'user.export (Audit-Log CSV)', desc: 'Télécharger les fiches de base de données.' },
              { key: 'employesSuspendre', label: 'user.suspend (Blocages)', desc: 'Bloquer temporairement un membre de la flotte.' }
            ].map(item => (
              <label 
                key={item.key} 
                className="flex items-start gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 border rounded-xl cursor-pointer transition-all shadow-3xs"
              >
                <input
                  type="checkbox"
                  checked={privList[item.key]}
                  onChange={(e) => setPrivList((prev: any) => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-4.5 h-4.5 accent-indigo-600 rounded border-slate-300 mt-0.5"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight font-semibold">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Local Variables */}
        <div className="space-y-4 pt-4 border-t">
          <p className="text-[10px] font-black text-indigo-650 tracking-wider uppercase font-mono">3. Variables Complémentaires :</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Équipe / Département</label>
              <select
                value={privList.departement || 'IT'}
                onChange={(e) => setPrivList((prev: any) => ({ ...prev, departement: e.target.value }))}
                className="w-full h-10 border rounded-xl px-3 text-xs font-semibold bg-white"
              >
                <option value="IT">DSI Africa</option>
                <option value="RH">Ressources Humaines</option>
                <option value="SINISTRES">Validation Médicale</option>
                <option value="FINANCE">Cellule Comptable</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ville d'affectation</label>
              <select
                value={privList.ville || 'Kinshasa'}
                onChange={(e) => setPrivList((prev: any) => ({ ...prev, ville: e.target.value }))}
                className="w-full h-10 border rounded-xl px-3 text-xs font-semibold bg-white"
              >
                <option value="Kinshasa">Kinshasa</option>
                <option value="Lubumbashi">Lubumbashi</option>
                <option value="Paris">Paris</option>
                <option value="Dubai">Dubaï</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      <div className="p-6 bg-slate-50 border-t flex gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 text-slate-600 hover:bg-slate-100 border rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" /> Enregistrer les Droits
        </button>
      </div>
    </div>
  );
};
