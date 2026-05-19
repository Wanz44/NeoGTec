/**
 * 📄 Fichier : /src/frontend/components/Telemedicine.tsx
 * 🎯 Objectif : Hub de Télémédecine complet (Consultations Vidéo, DME, Ordonnances, Planification).
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, Calendar, FileText, ClipboardList, Activity, 
  User, Shield, Search, Filter, Plus, ChevronRight, 
  Clock, CheckCircle2, XCircle, AlertCircle, Zap,
  Download, Share2, MessageSquare, Phone, MapPin,
  Stethoscope, Pill, CreditCard, QrCode, ArrowLeft,
  VideoOff, Mic, MicOff, Monitor, MoreVertical,
  Heart, Thermometer, Droplets
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- Types ---

export type ConsultationStatus = 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
export type Specialty = 'Généraliste' | 'Cardiologie' | 'Pédiatrie' | 'Dermatologie' | 'Gynécologie';

export interface VitalSign {
  date: string;
  value: number;
  unit: string;
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  age: number;
  bloodType: string;
  allergies: string[];
  history: string[];
  vitals: {
    tension: VitalSign[];
    glucose: VitalSign[];
    weight: VitalSign[];
  };
}

export interface Consultation {
  id: string;
  doctorName: string;
  patientName: string;
  specialty: Specialty;
  date: string;
  time: string;
  status: ConsultationStatus;
  urgency: 'Basse' | 'Haute' | 'Urgence';
  meetingUrl?: string;
  diagnosis?: string;
  prescriptionId?: string;
}

// --- Mock Data ---

const VITALS_HISTORY = [
  { date: '01/05', tension: 12.8, glucose: 0.95 },
  { date: '05/05', tension: 13.2, glucose: 0.98 },
  { date: '10/05', tension: 12.1, glucose: 0.92 },
  { date: '15/05', tension: 12.5, glucose: 0.94 },
];

const MOCK_CONSULTATIONS: Consultation[] = [
  { id: 'CON-1029', doctorName: 'Dr. Adonaï WANZAMBI', patientName: 'Marie Curie', specialty: 'Généraliste', date: '2024-05-15', time: '14:30', status: 'Planifiée', urgency: 'Basse' },
  { id: 'CON-1030', doctorName: 'Dr. Sarah Luvuezo', patientName: 'Robert Oppenheimer', specialty: 'Cardiologie', date: '2024-05-15', time: '15:15', status: 'Planifiée', urgency: 'Haute' },
  { id: 'CON-1025', doctorName: 'Dr. Amstrong', patientName: 'Marie Curie', specialty: 'Dermatologie', date: '2024-05-12', time: '10:00', status: 'Terminée', urgency: 'Basse', diagnosis: 'Dermatite atopique légère.' }
];

const MOCK_RECORD: MedicalRecord = {
  id: 'DME-8842',
  patientName: 'Marie Curie',
  age: 34,
  bloodType: 'O+',
  allergies: ['Pénicilline', 'Lactose'],
  history: ['Appendicectomie (2018)', 'Asthme léger'],
  vitals: {
    tension: [{ date: '2024-05-01', value: 12.8, unit: 'cmHg' }, { date: '2024-05-15', value: 12.5, unit: 'cmHg' }],
    glucose: [{ date: '2024-05-01', value: 0.95, unit: 'g/L' }],
    weight: [{ date: '2024-05-01', value: 62, unit: 'kg' }]
  }
};

export const Telemedicine: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [view, setView] = useState<'schedule' | 'call' | 'epr' | 'dashboard'>('schedule');
  const [selectedCons, setSelectedCons] = useState<Consultation | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (subModule === 'tele-consultation') setView('schedule');
    else if (subModule === 'tele-medical-records') setView('epr');
    else if (subModule === 'tele-prescription') setView('epr');
    else if (subModule === 'tele-history') setView('dashboard');
  }, [subModule]);

  // --- Views ---

  const renderSchedule = () => (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
             <input type="text" placeholder="Spécialité, Médecin, Disponibilité..." className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-green-200 rounded-md outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm" />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 hover:scale-105 transition-all border border-green-700">
                <Plus className="w-4 h-4" /> Réserver un créneau
             </button>
             <button className="p-2.5 border border-green-200 rounded-md text-green-600 hover:bg-green-50 transition-all shadow-sm"><Calendar className="w-4 h-4" /></button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-3">
             <h4 className="text-[10px] font-black text-green-950/30 uppercase tracking-widest px-2">Filtres intelligents</h4>
             {['Tous', 'Généraliste', 'Cardiologie', 'Pédiatrie', 'Dermatologie'].map((s) => (
               <button key={s} className="w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-green-50 hover:text-green-600 transition-all border border-transparent hover:border-green-100">
                  {s}
               </button>
             ))}
             <div className="p-4 bg-green-950 rounded-lg text-white mt-6 relative overflow-hidden group border border-green-800 shadow-xl">
                <Zap className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 group-hover:scale-125 transition-transform" />
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">File d'attente Urgente</h5>
                <p className="text-[9px] font-medium leading-relaxed italic opacity-40 mb-4">Besoin d'un avis immédiat ? Connectez-vous à la garde active.</p>
                <button className="w-full py-2 bg-green-600 rounded-md text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-600/30 transition-all hover:bg-green-500 text-white border border-green-700">Lancer l'Urgence</button>
             </div>
          </div>

          <div className="md:col-span-3 space-y-4">
             {MOCK_CONSULTATIONS.map((cons) => (
                <div key={cons.id} className="fluent-card p-5 group hover:border-green-400 transition-all cursor-pointer">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                           cons.status === 'Planifiée' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"
                         )}>
                            <Stethoscope className="w-7 h-7" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="text-sm font-black text-green-950 uppercase">{cons.doctorName}</h4>
                               <span className="text-[8px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{cons.specialty}</span>
                               {cons.urgency === 'Haute' && <span className="text-[8px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase italic animate-pulse">Haute Urgence</span>}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                               <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {cons.date}</p>
                               <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {cons.time}</p>
                               <p className="text-[10px] font-mono font-black text-slate-200">#{cons.id}</p>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         {cons.status === 'Planifiée' ? (
                           <button 
                             onClick={() => { setSelectedCons(cons); setView('call'); }}
                             className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                           >
                              <Video className="w-4 h-4" /> Rejoindre
                           </button>
                         ) : (
                           <div className="flex gap-2">
                              <button className="p-2 border border-green-100 rounded-xl text-green-600 hover:bg-green-50 transition-all"><FileText className="w-4 h-4" /></button>
                              <button className="px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Compte-Rendu</button>
                           </div>
                         )}
                         <button className="p-2.5 text-slate-200 hover:text-green-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>
             ))}
             <button className="w-full py-4 border-2 border-dashed border-green-100 rounded-2xl text-[10px] font-black text-green-300 uppercase tracking-widest hover:border-green-500 hover:text-green-600 transition-all bg-white/50 shadow-sm italic">
                Afficher l'historique complet
             </button>
          </div>
       </div>
    </div>
  );

  const renderCall = () => selectedCons && (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="fixed inset-0 z-[60] bg-slate-950 p-6 flex flex-col gap-6"
    >
       <div className="flex items-center justify-between text-white/50">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <Video className="w-5 h-5" />
             </div>
             <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Consultation avec {selectedCons.doctorName}</h4>
                <p className="text-[10px] font-medium tracking-widest italic flex items-center gap-1.5">
                   <Shield className="w-3 h-3 text-emerald-400" /> Cryptage AES-256 actif
                </p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase italic text-white">00:14:32</span>
             </div>
             <button onClick={() => setView('schedule')} className="p-2 border border-white/10 rounded-xl hover:bg-white/10 transition-all"><XCircle className="w-6 h-6 text-rose-500" /></button>
          </div>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                   <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10">
                      <User className="w-12 h-12 text-white/20" />
                   </div>
                   <p className="text-[11px] font-black text-white/10 uppercase tracking-[0.3em] font-mono italic">Connexion au flux vidéo...</p>
                </div>
             </div>
             <div className="absolute bottom-6 right-6 w-48 aspect-video bg-slate-800 rounded-xl border-2 border-white/10 shadow-2xl overflow-hidden shadow-black/50">
                <div className="absolute inset-0 flex items-center justify-center">
                   <User className="w-8 h-8 text-white/10" />
                </div>
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-widest">VOUS</div>
             </div>
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                <button onClick={() => setIsMuted(!isMuted)} className={cn("p-4 rounded-2xl transition-all", isMuted ? "bg-rose-600 text-white" : "bg-white/10 text-white hover:bg-white/20")}>
                   {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button onClick={() => setIsVideoOff(!isVideoOff)} className={cn("p-4 rounded-2xl transition-all", isVideoOff ? "bg-rose-600 text-white" : "bg-white/10 text-white hover:bg-white/20")}>
                   {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
                <button className="p-4 bg-white/10 text-white hover:bg-white/20 rounded-2xl transition-all"><Monitor className="w-6 h-6" /></button>
                <div className="w-px h-8 bg-white/10 mx-2" />
                <button onClick={() => setView('schedule')} className="p-4 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl transition-all shadow-xl shadow-rose-600/30">
                   <Phone className="w-6 h-6 rotate-[135deg]" />
                </button>
             </div>
          </div>

          <div className="space-y-6 flex flex-col min-h-0">
             <div className="fluent-card p-6 bg-white/5 border-white/10 text-white flex-1 flex flex-col min-h-0">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 flex items-center justify-between">
                   <span>Partage de Documents</span>
                   <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
                </h4>
                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                   {MOCK_RECORD.history.map((h, i) => (
                     <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                           <FileText className="w-4 h-4 text-green-400" />
                           <p className="text-[10px] font-bold truncate max-w-[120px]">{h}</p>
                        </div>
                        <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors" />
                     </div>
                   ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                   <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Tout Télécharger</button>
                </div>
             </div>
             <div className="fluent-card p-6 bg-white/5 border-white/10 text-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-rose-500" /> Données Critiques
                </h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-black text-center">O+</div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-black text-center">34 ans</div>
                </div>
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                   <p className="text-[8px] font-black text-rose-400 uppercase">Allergies</p>
                   <p className="text-[10px] font-bold mt-1">Pénicilline, Lactose</p>
                </div>
             </div>
          </div>
       </div>
    </motion.div>
  );

  const renderEPR = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="fluent-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-8 opacity-5">
                   <QrCode className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-8 relative z-10">
                   <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 border-4 border-white shadow-xl">
                      <User className="w-12 h-12" />
                   </div>
                   <div>
                      <div className="flex items-center gap-3">
                         <h3 className="text-2xl font-black text-green-950">{MOCK_RECORD.patientName}</h3>
                         <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase italic rounded-full">DME Certifié</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest italic">{MOCK_RECORD.id} • 34 ANS</p>
                      <div className="flex gap-4 mt-4">
                         <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> <span className="text-[10px] font-black text-slate-900">{MOCK_RECORD.bloodType}</span></div>
                         <div className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-green-500" /> <span className="text-[10px] font-black text-slate-900">72 BPM</span></div>
                      </div>
                   </div>
                </div>
                <div className="relative z-10 w-32 aspect-square bg-white p-2 rounded-lg border border-green-200 shadow-sm flex items-center justify-center">
                   <QrCode className="w-full h-full text-green-950" />
                </div>
             </div>

             <div className="fluent-card p-6">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-sm font-black text-green-950 uppercase tracking-tight flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" /> Suivi Clinique
                   </h4>
                </div>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={VITALS_HISTORY}>
                         <defs>
                            <linearGradient id="colorVit" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#117F02" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#117F02" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                         <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                         <Tooltip />
                         <Area type="monotone" dataKey="tension" stroke="#117F02" strokeWidth={3} fill="url(#colorVit)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="fluent-card p-6">
                <h4 className="text-sm font-black text-green-950 uppercase mb-6 flex items-center gap-2">
                   <Pill className="w-4 h-4 text-indigo-600" /> Ordonnances
                </h4>
                <div className="space-y-3">
                   {[
                     { drug: 'Ventoline 100mg', plan: '1 bouffée / jour', status: 'Active' },
                     { drug: 'Amoxicilline', plan: '3x / jour (10 jrs)', status: 'Terminé' }
                   ].map((p, i) => (
                     <div key={i} className="p-4 rounded-md border border-green-200 bg-green-50/10 flex items-center justify-between shadow-sm">
                        <div>
                           <p className="text-xs font-black text-green-950">{p.drug}</p>
                           <p className="text-[10px] font-bold text-slate-400 italic">{p.plan}</p>
                        </div>
                        <div className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase italic", p.status === 'Active' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>{p.status}</div>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-2.5 bg-green-600 text-white rounded-md text-[10px] font-black uppercase shadow-xl shadow-green-600/30 text-white border border-green-700">Nouvelle Prescription</button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Télémédecine <Stethoscope className="w-8 h-8 text-green-500" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase italic underline decoration-green-200 underline-offset-4 decoration-2">Plateforme de soins virtuels sécurisée</p>
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             {view === 'schedule' && renderSchedule()}
             {view === 'call' && renderCall()}
             {view === 'epr' && renderEPR()}
             {view === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Consultations', val: '156', color: 'text-green-600', icon: Video },
                     { label: 'Satisfaction', val: '98.5%', color: 'text-green-600', icon: Heart },
                     { label: 'Temps Moyen', val: '18m', color: 'text-green-600', icon: Clock },
                     { label: 'Alertes Vitals', val: '03', color: 'text-rose-600', icon: AlertCircle }
                   ].map((kpi, i) => (
                     <div key={i} className="fluent-card p-6 flex items-center justify-between rounded-lg border border-green-200 bg-white shadow-sm">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                           <p className={cn("text-2xl font-black", kpi.color)}>{kpi.val}</p>
                        </div>
                        <kpi.icon className={cn("w-8 h-8 opacity-10", kpi.color)} />
                     </div>
                   ))}
                </div>
             )}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
