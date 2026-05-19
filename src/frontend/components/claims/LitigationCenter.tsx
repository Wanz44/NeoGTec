/**
 * 📄 Fichier : /src/frontend/components/claims/LitigationCenter.tsx
 * 🎯 Objectif : Gestion des litiges et messagerie sécurisée.
 */
import React, { useState } from 'react';
import { 
  MessageSquare, ShieldAlert, Send, Clock, 
  X, CheckCircle2, User, Building2, 
  Search, Filter, AlertCircle,
  Paperclip, Info, ChevronRight, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface Litigation {
  id: string;
  claimId: string;
  subject: string;
  parties: string[];
  status: 'Ouvert' | 'En Médiation' | 'Résolu';
  priority: 'Haute' | 'Normale';
  lastActivity: string;
}

const MOCK_LITIGATIONS: Litigation[] = [
  { id: 'LIT-7721', claimId: 'CLM-0015', subject: 'Désaccord sur montant facturé', parties: ['Hôpital HJ Hospitals', 'Direct Assurance'], status: 'En Médiation', priority: 'Haute', lastActivity: 'Il y a 2h' },
  { id: 'LIT-7722', claimId: 'CLM-0122', subject: 'Preuve d\'éligibilité manquante', parties: ['M. Adonaï W.', 'Direct Assurance'], status: 'Ouvert', priority: 'Normale', lastActivity: 'Hier' },
];

export const LitigationCenter: React.FC = () => {
  const [selectedLitigation, setSelectedLitigation] = useState<Litigation | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto h-[700px]">
       {/* Sidebar: Litigation List */}
       <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-50 space-y-6 bg-slate-50/20">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Centre de Litiges</h3>
                <ShieldAlert className="w-5 h-5 text-rose-500" />
             </div>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="Rechercher..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold outline-none shadow-sm" />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
             {MOCK_LITIGATIONS.map((lit) => (
                <button
                  key={lit.id}
                  onClick={() => setSelectedLitigation(lit)}
                  className={cn(
                    "w-full p-6 text-left hover:bg-slate-50 transition-all group relative",
                    selectedLitigation?.id === lit.id ? "bg-slate-50" : ""
                  )}
                >
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black text-green-600 uppercase italic tracking-widest">{lit.id}</span>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                        lit.priority === 'Haute' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400"
                      )}>{lit.priority}</span>
                   </div>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase italic leading-tight group-hover:text-green-600 transition-colors">{lit.subject}</h4>
                   <div className="flex items-center justify-between mt-4">
                      <p className="text-[9px] font-bold text-slate-400 uppercase italic">{lit.lastActivity}</p>
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[7px] font-black text-slate-400">H</div>
                         <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[7px] font-black text-green-600">A</div>
                      </div>
                   </div>
                   {selectedLitigation?.id === lit.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-600" />}
                </button>
             ))}
          </div>
       </div>

       {/* Chat Area */}
       <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {selectedLitigation ? (
             <>
                {/* Chat Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-950 text-white">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                         <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black italic tracking-tighter uppercase">{selectedLitigation.subject}</h3>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Dossier lié : {selectedLitigation.claimId} • {selectedLitigation.status}</p>
                      </div>
                   </div>
                   <button className="px-6 py-2 border border-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic">Marquer Résolu</button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-slate-50/30">
                   <div className="flex flex-col gap-4 max-w-2xl">
                      <div className="p-5 bg-white rounded-3xl rounded-tl-none border border-slate-100 shadow-sm space-y-2">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-green-600 uppercase italic">Agent Assurance</span>
                            <span className="text-[8px] font-bold text-slate-300">10:45</span>
                         </div>
                         <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                            Nous avons analysé la facture INV-PX-001. Le montant dépasse le barème conventionné pour l'acte 'C01'. Pouvez-vous justifier le supplément ?
                         </p>
                      </div>

                      <div className="p-5 bg-green-600 text-white rounded-3xl rounded-tr-none shadow-xl shadow-green-600/20 space-y-2 self-end">
                         <div className="flex items-center gap-2 mb-1 justify-end">
                            <span className="text-[8px] font-bold text-green-200">11:12</span>
                            <span className="text-[9px] font-black uppercase italic">Hôpital HJ Hospitals</span>
                         </div>
                         <p className="text-xs font-bold leading-relaxed italic text-green-50">
                            L'assuré a sollicité une chambre VIP qui n'est pas incluse dans son plafond standard. Voici l'accord signé de l'assuré en pièce jointe.
                         </p>
                      </div>
                   </div>
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-slate-100 bg-white">
                   <div className="relative flex items-center gap-6">
                      <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                         <Paperclip className="w-5 h-5" />
                      </button>
                      <input 
                        type="text" 
                        placeholder="Rédigez votre réponse ici..." 
                        className="flex-1 py-5 bg-slate-50 border border-slate-100 rounded-3xl px-8 text-sm font-black outline-none focus:ring-2 focus:ring-green-600/5 transition-all" 
                      />
                      <button className="p-5 bg-green-600 text-white rounded-[28px] shadow-2xl shadow-green-600/30 hover:scale-110 active:scale-95 transition-all">
                         <Send className="w-6 h-6" />
                      </button>
                   </div>
                   <div className="flex items-center gap-2 mt-4 px-2">
                      <Lock className="w-3 h-3 text-slate-300" />
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Conversation sécurisée par cryptage de bout en bout</span>
                   </div>
                </div>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center gap-8 animate-in fade-in zoom-in duration-700">
                <div className="w-32 h-32 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-center text-slate-100">
                   <MessageSquare className="w-16 h-16" />
                </div>
                <div className="space-y-3">
                   <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Messagerie Sécurisée</h3>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic max-w-sm">
                      Sélectionnez un litige dans la liste pour démarrer la médiation ou consulter l'historique des échanges.
                   </p>
                </div>
                <div className="p-6 bg-green-50 border border-green-100 rounded-3xl flex items-center gap-4 max-w-md">
                   <Info className="w-10 h-10 text-green-500 shrink-0" />
                   <p className="text-[10px] font-bold text-green-900/60 leading-relaxed text-left italic">
                      Toutes les médiations sont enregistrées et conservées conformément aux exigences réglementaires de l'ARCA.
                   </p>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};
