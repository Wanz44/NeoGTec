/**
 * 📄 Fichier : /src/frontend/components/Reclamation.tsx
 * 🎯 Objectif : Gestion dynamique des réclamations et litiges avec jauge de suivi et modèle de réponse admin.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Filter, FileText, Upload, ShieldCheck, 
  Clock, CheckCircle2, XCircle, AlertTriangle, 
  ChevronRight, Download, BarChart3, TrendingUp, Zap,
  MessageSquare, User, Eye, ArrowLeft, Send, Shield, Check, X, File, FileSpreadsheet
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export type ReclamationStatus = 'Reçue' | "En cours d'analyse" | 'Décision rendue';

export interface ReclamationItem {
  id: string;
  insuredName: string;
  type: 'Remboursement' | 'Accueil Clinique' | 'Délai';
  severity: 'Basse' | 'Moyenne' | 'Haute';
  date: string;
  description: string;
  status: ReclamationStatus;
  attachments: string[];
  replyTemplateUsed?: string;
  decisionComment?: string;
  history: Array<{ date: string; action: string; author: string }>;
}

const INITIAL_RECLAMATIONS: ReclamationItem[] = [
  {
    id: 'REC-2025-001',
    insuredName: 'Jean Valjean Mukendi',
    type: 'Remboursement',
    severity: 'Haute',
    date: '2026-05-12',
    description: 'Mon remboursement du 14 avril pour soins d’orthodontie a été refusé sans motif valable.',
    status: "En cours d'analyse",
    attachments: ['Facture_Dentaire_Moorfields.pdf', 'Ordonnance_Dr_Kalonji.pdf'],
    replyTemplateUsed: '',
    history: [
      { date: '12/05/2026 10:00', action: 'Réclamation reçue', author: 'Jean Valjean Mukendi' },
      { date: '13/05/2026 14:15', action: 'Dossier assigné au service contre-expertise', author: 'Système automatique' }
    ]
  },
  {
    id: 'REC-2025-042',
    insuredName: 'Clara Mpunga',
    type: 'Accueil Clinique',
    severity: 'Moyenne',
    date: '2026-05-18',
    description: 'La clinique partenaire Biamba Marie Mutola a refusé d’appliquer le tiers-payant sur ma consultation.',
    status: 'Reçue',
    attachments: ['Recu_Consultation.png'],
    replyTemplateUsed: '',
    history: [
      { date: '18/05/2026 09:30', action: 'Réclamation enregistrée sur mobile', author: 'Clara Mpunga' }
    ]
  },
  {
    id: 'REC-2025-099',
    insuredName: 'Benoit Lucas',
    type: 'Délai',
    severity: 'Basse',
    date: '2026-04-30',
    description: 'Plus de 10 jours d’attente pour obtenir mon remboursement optique standard.',
    status: 'Décision rendue',
    attachments: [],
    replyTemplateUsed: 'Remboursement validé après contre-expertise',
    decisionComment: 'La contre-expertise technique confirme l&apos;erreur d&apos;indexation OCR de la facture. Remboursement crédité le 03/05.',
    history: [
      { date: '30/04/2026 17:00', action: 'Contestations délais initiée', author: 'Benoit Lucas' },
      { date: '02/05/2026 11:00', action: 'Analyse et validation de réclamation', author: 'Adonïa Lutonadio' },
      { date: '03/05/2026 09:00', action: 'Décision rendue et notifiée', author: 'Service Client' }
    ]
  }
];

export const Reclamation: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'followup' | 'admin'>('followup');
  const [reclamations, setReclamations] = useState<ReclamationItem[]>(INITIAL_RECLAMATIONS);
  const [selectedRec, setSelectedRec] = useState<ReclamationItem | null>(null);

  // Submission Form States
  const [formType, setFormType] = useState<'Remboursement' | 'Accueil Clinique' | 'Délai'>('Remboursement');
  const [formSeverity, setFormSeverity] = useState<'Basse' | 'Moyenne' | 'Haute'>('Moyenne');
  const [formDescription, setFormDescription] = useState('');
  const [formName, setFormName] = useState('Sarah Al-Mansoori');
  const [formFiles, setFormFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Admin Reply Form States
  const [selectedTemplate, setSelectedTemplate] = useState('Remboursement validé après contre-expertise');
  const [adminComment, setAdminComment] = useState('');

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('Toutes');

  // Success Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  useEffect(() => {
    if (subModule === 'reclamation-submit') setActiveTab('submit');
    else if (subModule === 'reclamation-followup') setActiveTab('followup');
    else if (subModule === 'reclamation-dashboard' || subModule === 'reclamation-trace') setActiveTab('admin');
  }, [subModule]);

  // DRAG & DROP Simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setFormFiles(prev => [...prev, 'Facture_Glissée_Soumise.pdf']);
    showToast("Pièce jointe ajoutée avec succès via Drag-and-Drop.");
  };

  const handleManualFileAdd = () => {
    setFormFiles(prev => [...prev, 'Justificatif_Téléversé_Manuel.pdf']);
    showToast("Document ajouté avec succès.");
  };

  // Submit Complaint
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;

    const newClaim: ReclamationItem = {
      id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      insuredName: formName,
      type: formType,
      severity: formSeverity,
      date: new Date().toISOString().split('T')[0],
      description: formDescription,
      status: 'Reçue',
      attachments: formFiles,
      history: [
        { date: new Date().toLocaleString(), action: 'Réclamation soumise et cryptée', author: formName }
      ]
    };

    setReclamations([newClaim, ...reclamations]);
    setFormDescription('');
    setFormFiles([]);
    setActiveTab('followup');
    showToast(`Votre réclamation n° ${newClaim.id} a été transmise aux juristes d'Adonaï.`);
  };

  // Admin submit decision
  const handleSaveAdminDecision = (claimId: string) => {
    setReclamations(prev => prev.map(rec => {
      if (rec.id === claimId) {
        return {
          ...rec,
          status: 'Décision rendue',
          replyTemplateUsed: selectedTemplate,
          decisionComment: adminComment,
          history: [
            ...rec.history,
            { date: new Date().toLocaleString(), action: `Décision rendue : "${selectedTemplate}"`, author: 'Adonïa Lutonadio (Admin)' }
          ]
        };
      }
      return rec;
    }));

    // Update locally too
    if (selectedRec && selectedRec.id === claimId) {
      setSelectedRec(prev => prev ? {
        ...prev,
        status: 'Décision rendue',
        replyTemplateUsed: selectedTemplate,
        decisionComment: adminComment
      } : null);
    }

    setAdminComment('');
    showToast(`Décision enregistrée avec succès pour le ticket ${claimId}. Notification push envoyée à l&apos;assuré.`);
  };

  // Filter computation
  const filteredClaims = reclamations.filter(rec => {
    const matchesSearch = rec.insuredName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterSeverity === 'Toutes') return matchesSearch;
    return matchesSearch && rec.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Dynamic feedback toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Action Réclamations</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 italic uppercase">Module Réclamations &amp; NPS</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Traitement en toute transparence des litiges, remboursements rejetés et délais</p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit shrink-0">
          <button 
            onClick={() => setActiveTab('submit')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
              activeTab === 'submit' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Soumettre Plainte
          </button>
          <button 
            onClick={() => setActiveTab('followup')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
              activeTab === 'followup' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Jauges de Suivi
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
              activeTab === 'admin' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            Console Admin
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* 1. COMPLAINT SUBMISSION FORM (C1) */}
        {activeTab === 'submit' && (
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-8 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 uppercase italic">Formulaire de contestation</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Saisie sécurisée d&apos;un litige</p>
              </div>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Votre Identité (Bénéficiaire)</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Type de Réclamation</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Remboursement">Contestation de Remboursement refusé</option>
                    <option value="Accueil Clinique">Accueil ou comportement en Clinique</option>
                    <option value="Délai">Retards de traitement / Délais</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Niveau de Sévérité</label>
                  <div className="flex gap-1">
                    {['Basse', 'Moyenne', 'Haute'].map((sev) => {
                      const isActive = formSeverity === sev;
                      return (
                        <button
                          type="button"
                          key={sev}
                          onClick={() => setFormSeverity(sev as any)}
                          className={cn(
                            "flex-1 py-3 text-xs font-black rounded-lg border transition-all cursor-pointer",
                            isActive 
                              ? sev === 'Haute' ? "bg-rose-600 text-white border-transparent" : sev === 'Moyenne' ? "bg-amber-500 text-white border-transparent" : "bg-green-600 text-white border-transparent"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          {sev}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Description des faits</label>
                <textarea 
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Expliquez en détail votre contestation ou le problème rencontré..."
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 resize-none transition-all"
                />
              </div>

              {/* Drag-and-drop simulated piéces jointes container */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pièces justificatives (Factures, Ordonnances)</label>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-6 text-center space-y-3 cursor-pointer transition-all",
                    dragOver ? "border-indigo-600 bg-indigo-50/40" : "border-slate-200 bg-slate-50/50 hover:border-slate-400"
                  )}
                >
                  <div className="mx-auto w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-600 shadow-sm border border-slate-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-800">Glisser-déposer le fichier justificatif</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Ou cliquez pour choisir sur votre disque (PDF, JPG, PNG)</p>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={handleManualFileAdd}
                    className="px-4 py-1.5 bg-white border border-slate-250 text-[10px] font-black rounded-lg uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Parcourir les fichiers
                  </button>
                </div>

                {formFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formFiles.map((file, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-150 flex items-center gap-1.5 uppercase">
                        <File className="w-3.5 h-3.5" /> {file}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => { setFormDescription(''); setFormFiles([]); }}
                  className="flex-1 py-4 border border-slate-250 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Réinitialiser
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
                >
                  Envoyer ma réclamation
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 2. FOLLOW-UP PROGRESS GAUGE FOR USERS (C2) */}
        {activeTab === 'followup' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight mb-4">Suivi de vos Contestations</h4>
              
              <div className="divide-y divide-slate-100">
                {reclamations.map((rec) => (
                  <div key={rec.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded uppercase tracking-wider">{rec.id}</span>
                          <span className="text-xs font-black text-slate-800 uppercase italic">{rec.type}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 italic mt-1">&ldquo;{rec.description}&rdquo;</p>
                      </div>

                      <div className="text-right">
                        <span className={cn(
                          "px-2.5 py-0.5 text-[8.5px] font-black uppercase rounded",
                          rec.severity === 'Haute' ? "bg-rose-50 text-rose-600" :
                          rec.severity === 'Moyenne' ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-600"
                        )}>
                          Sévérité: {rec.severity}
                        </span>
                        <p className="text-[10px] text-slate-300 font-extrabold mt-1">Soumise le {rec.date}</p>
                      </div>
                    </div>

                    {/* Stepper gauge */}
                    <div className="grid grid-cols-3 gap-2 py-2 relative">
                      {/* background tracking bar */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
                      
                      {/* steps */}
                      {[
                        { step: 'Reçue', active: rec.status === 'Reçue' || rec.status === "En cours d'analyse" || rec.status === 'Décision rendue' },
                        { step: "En cours d'analyse", active: rec.status === "En cours d'analyse" || rec.status === 'Décision rendue' },
                        { step: 'Décision rendue', active: rec.status === 'Décision rendue' }
                      ].map((item, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-sm",
                            item.active ? "bg-indigo-600 text-white border-transparent" : "bg-white text-slate-400 border-slate-200"
                          )}>
                            {item.active ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider mt-1.5 text-center leading-none",
                            item.active ? "text-indigo-600" : "text-slate-400"
                          )}>{item.step}</span>
                        </div>
                      ))}
                    </div>

                    {rec.status === 'Décision rendue' && rec.decisionComment && (
                      <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl space-y-1">
                        <p className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Décision Finale rendue par les Juristes</p>
                        <p className="text-xs font-bold text-slate-800 italic">&ldquo;{rec.decisionComment}&rdquo;</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. ADMIN RECLAMATIONS BOARD CONSOLE (C3) */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Admin list column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-50">
                  <span className="text-sm font-black text-slate-900 uppercase">File de traitement des plaintes</span>
                  
                  {/* Severity Filter */}
                  <div className="flex gap-1.5">
                    {['Toutes', 'Basse', 'Moyenne', 'Haute'].map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setFilterSeverity(sev)}
                        className={cn(
                          "px-3 py-1 bg-slate-100 text-[10px] font-black uppercase rounded-lg border cursor-pointer",
                          filterSeverity === sev ? "bg-slate-900 text-white border-transparent" : "text-slate-500 border-transparent hover:bg-slate-200"
                        )}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredClaims.map((rec) => (
                    <div 
                      key={rec.id} 
                      onClick={() => setSelectedRec(rec)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4",
                        selectedRec?.id === rec.id ? "bg-slate-50 border-indigo-200 shadow-sm" : "bg-white border-slate-100 hover:border-slate-350"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-black text-slate-400">{rec.id}</span>
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            rec.severity === 'Haute' ? "bg-rose-500" : rec.severity === 'Moyenne' ? "bg-amber-500" : "bg-green-500"
                          )} />
                          <h5 className="text-xs font-black text-slate-900 uppercase">{rec.insuredName}</h5>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 line-clamp-1 italic">&ldquo;{rec.description}&rdquo;</p>
                        <p className="text-[9px] text-indigo-600 font-extrabold uppercase">Type: {rec.type} • Statut actuel: {rec.status}</p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin editor detail column */}
            <div className="space-y-4">
              {selectedRec ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">Traitement du Dossier</span>
                    <h4 className="text-base font-black text-slate-900 uppercase italic mt-1">{selectedRec.insuredName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">ID UNIQUE CONTESTATION: {selectedRec.id}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl space-y-1 font-bold text-slate-700 text-xs">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-bold">Faits exposés par l&apos;adhérent</span>
                    <p className="italic leading-relaxed text-slate-600">&ldquo;{selectedRec.description}&rdquo;</p>
                  </div>

                  {selectedRec.attachments.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-bold">Justificatifs rattachés</span>
                      <div className="flex flex-col gap-1.5">
                        {selectedRec.attachments.map((at, idx) => (
                          <div key={idx} className="p-2 bg-indigo-50/50 rounded-lg flex items-center justify-between border border-indigo-100 text-[10px]">
                            <span className="font-extrabold text-slate-800">{at}</span>
                            <Eye className="w-3.5 h-3.5 text-indigo-600 hover:scale-105 cursor-pointer" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply standard templates dropdown (C3 requirement) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Appliquer un modèle de réponse type</label>
                    <select 
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none text-indigo-700 uppercase"
                    >
                      <option value="Remboursement validé après contre-expertise">Remboursement validé après contre-expertise</option>
                      <option value="Refus de prise en charge confirmé">Refus confirmé pour non-production de justificatif</option>
                      <option value="Demande de pièces complémentaires requises">Demande de pièces complémentaires / Devis signé</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-bold">Commentaire / Justification de décision</label>
                    <textarea 
                      rows={3}
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Saisissez la justification formelle transmise à l&apos;assuré..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    />
                  </div>

                  <button 
                    onClick={() => handleSaveAdminDecision(selectedRec.id)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Enregistrer la décision
                  </button>

                  {/* Trace details timeline logs */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-bold">Traçabilité administrative d&apos;activité</span>
                    <div className="space-y-2">
                      {selectedRec.history.map((log, i) => (
                        <div key={i} className="text-[10px] font-bold text-slate-600 pl-3 border-l-2 border-slate-200">
                          <p className="text-slate-800 uppercase">{log.action}</p>
                          <p className="text-[8.5px] text-slate-405 italic font-medium">Auteur: {log.author} • {log.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-6 text-center text-slate-400 italic font-medium text-xs py-12">
                  Sélectionnez une plainte dans la file pour appliquer les modèles de réponses ou statuer sur la décision.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
