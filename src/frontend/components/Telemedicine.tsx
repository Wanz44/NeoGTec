/**
 * 📄 Fichier : /src/frontend/components/Telemedicine.tsx
 * 🎯 Objectif : Hub de Téléconsultation complet (F1. Consultation Vidéo, F2. DME, F3. Ordonnance, F4. Dashboard Dr).
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
  Heart, Thermometer, Droplets, Trash2, Camera, Check,
  AlertTriangle, UploadCloud, RefreshCw, Send, ShieldAlert, CheckSquare, Eye, Printer, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Types ---
export type ConsultationStatus = 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
export type Specialty = 'Généraliste' | 'Cardiologie' | 'Pédiatrie' | 'Dermatologie' | 'Gynécologie';

export interface MedicalDocument {
  id: string;
  type: 'Radio' | 'Analyse' | 'CR' | 'Autre';
  title: string;
  date: string;
  source: string;
  ocrDetected?: string;
}

export interface ConsultationLog {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: Specialty;
  notes: string;
  meds: string[];
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  age: number;
  bloodType: string;
  allergies: string[];
  history: string[];
  timeline: ConsultationLog[];
  documents: MedicalDocument[];
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
  language: 'FR' | 'Lingala' | 'EN';
}

const INITIAL_CONSULTATIONS: Consultation[] = [
  { id: 'CON-1029', doctorName: 'Dr. Jean-Paul Mbika', patientName: 'Marie Curie Wanzambi', specialty: 'Pédiatrie', date: '2026-05-26', time: '14:30', status: 'Planifiée', urgency: 'Basse', language: 'Lingala' },
  { id: 'CON-1030', doctorName: 'Dr. Sarah Luvuezo', patientName: 'Isaac Mukendi', specialty: 'Cardiologie', date: '2026-05-26', time: '15:15', status: 'Planifiée', urgency: 'Haute', language: 'FR' },
  { id: 'CON-1025', doctorName: 'Dr. David Kabila', patientName: 'Robert Lelo', specialty: 'Dermatologie', date: '2026-05-24', time: '10:00', status: 'Terminée', urgency: 'Basse', language: 'EN' }
];

const INITIAL_DME: MedicalRecord = {
  id: 'DME-8842',
  patientName: 'Marie-Claire Mbika',
  age: 34,
  bloodType: 'O+',
  allergies: ['Pénicilline', 'Lactose'],
  history: ['Appendicectomie (2018)', 'Asthme léger'],
  timeline: [
    { id: 'TL-1', date: '12/05/2026', time: '10:15', doctorName: 'Dr. David Kabila', specialty: 'Généraliste', notes: 'Consultation annuelle. Vitals stables. Légère gêne respiratoire temporaire.', meds: ['Doliprane 1000mg', 'Ventoline'] },
    { id: 'TL-2', date: '13/05/2026', time: '14:00', doctorName: 'Dr. Jean-Paul Mbika', specialty: 'Pédiatrie', notes: 'Ordonnance pédiatrique pour fièvre passagère de l\'enfant.', meds: ['Amoxicilline', 'Paracétamol sirop'] },
    { id: 'TL-3', date: '20/05/2026', time: '09:00', doctorName: 'Dr. Sarah Luvuezo', specialty: 'Cardiologie', notes: 'Bilan d\'effort standard. Excellente réponse respiratoire.', meds: [] }
  ],
  documents: [
    { id: 'DOC-1', type: 'Analyse', title: 'Bilan Sanguin Complet - Clinique Ngaliema', date: '10/05/2026', source: 'Clinique Ngaliema', ocrDetected: 'Hémoglobine stable à 14.1 g/dL' },
    { id: 'DOC-2', type: 'Radio', title: 'Radiographie Thoracique face - HJ Hospitals', date: '04/05/2026', source: 'HJ Hospitals Kinshasa' }
  ]
};

const PHARMACIES = [
  { name: 'Pharmacie Victoire', distance: '1.2 km', rating: '4.8/5', open: '24/7' },
  { name: 'Pharmacie du Gombe', distance: '3.5 km', rating: '4.6/5', open: '7h - 22h' },
  { name: 'Pharmacie du Centre Kinshasa', distance: '4.1 km', rating: '4.5/5', open: '8h - 20h' }
];

export const Telemedicine: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [view, setView] = useState<'schedule' | 'call' | 'epr' | 'dashboard'>('schedule');
  const [consultations, setConsultations] = useState<Consultation[]>(INITIAL_CONSULTATIONS);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [dme, setDme] = useState<MedicalRecord>(INITIAL_DME);

  // F1. States
  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false);
  const [formUrgency, setFormUrgency] = useState<'Basse' | 'Haute' | 'Urgence'>('Basse');
  const [formSpecialty, setFormSpecialty] = useState<Specialty>('Généraliste');
  const [formLanguage, setFormLanguage] = useState<'FR' | 'Lingala' | 'EN'>('FR');
  const [formPatient, setFormPatient] = useState('Marie-Claire Mbika');
  const [conDate, setConDate] = useState('2026-05-26');
  const [conTime, setConTime] = useState('16:00');

  // Network Fallback simulation
  const [networkSpeed, setNetworkSpeed] = useState<number>(850); // kbps
  const [audioOnlyState, setAudioOnlyState] = useState(false);
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);

  // WebRTC Room State
  const [chatMessages, setChatMessages] = useState<{ sender: 'doc' | 'me'; text: string; time: string }[]>([
    { sender: 'doc', text: "Bonjour, je consulte votre DME. Pouvez-vous me décrire le symptôme ?", time: "14:32" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [takePhotoAlert, setTakePhotoAlert] = useState(false);

  // Consultation completed modal
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [consultationDuration, setConsultationDuration] = useState(12);

  // F2. States
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<ConsultationLog | null>(null);
  const [showOCRUpload, setShowOCRUpload] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [ocrForm, setOcrForm] = useState({ type: 'Analyse' as any, date: '2026-05-25', title: '', file: '' });

  // Consent share modal
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [ngaliemaConsent, setNgaliemaConsent] = useState(false);

  // F3. Prescription editor
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({ drugSearch: '', posology: '1 comprimé martin et soir', duration: '5 jours', substitutable: 'Oui' });
  const [addedMeds, setAddedMeds] = useState<string[]>(['Ventoline 100mg']);
  const [drugWarning, setDrugWarning] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPrescriptionSigned, setIsPrescriptionSigned] = useState(false);
  const [prescriptionHash, setPrescriptionHash] = useState<string | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState('Pharmacie Victoire');
  const [prescriptionDispatched, setPrescriptionDispatched] = useState(false);

  // F4. Dashboard filter
  const [dashboardCountry, setDashboardCountry] = useState('RDC');
  const [dashboardSpecialty, setDashboardSpecialty] = useState('Toutes');
  const [malariaTriggered, setMalariaTriggered] = useState(false);

  // Global Toast notifier
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    if (subModule === 'tele-consultation') setView('schedule');
    else if (subModule === 'tele-medical-records') setView('epr');
    else if (subModule === 'tele-prescription') { setView('epr'); setShowPrescriptionModal(true); }
    else if (subModule === 'tele-history') setView('dashboard');
  }, [subModule]);

  // Network monitor simulation
  useEffect(() => {
    if (view === 'call') {
      const interval = setInterval(() => {
        // randomly drop speed below 500kbps to trigger the WebRTC adaptive rule
        const speeds = [900, 780, 420, 850, 480];
        const nextSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        setNetworkSpeed(nextSpeed);

        if (nextSpeed < 500) {
          setNetworkWarning("⚠️ Débit réseau faible détecté (<500kbps). Passage automatique en mode AUDIO dans 5s...");
          const timeout = setTimeout(() => {
            setAudioOnlyState(true);
            setIsVideoOff(true);
            triggerToast("Délai expiré. Vidéo désactivée pour maintenir le flux audio HD WebRTC.");
          }, 5000);
          return () => clearTimeout(timeout);
        } else {
          setNetworkWarning(null);
        }
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [view]);

  // F1 handles
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Consultation = {
      id: `CON-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: formLanguage === 'Lingala' ? 'Dr. Jean-Paul Mbika (Bilingue Lingala)' : 'Dr. Sarah Luvuezo',
      patientName: formPatient,
      specialty: formSpecialty,
      date: conDate,
      time: conTime,
      status: 'Planifiée',
      urgency: formUrgency,
      language: formLanguage
    };

    if (formUrgency === 'Urgence') {
      // Immediate routing to priority video queue
      newAppointment.status = 'En cours';
      setConsultations([newAppointment, ...consultations]);
      setShowAddConsultationModal(false);
      setActiveConsultation(newAppointment);
      setView('call');
      triggerToast("Priorité critique approuvée. Connexion immediate avec la garde d'astreinte ADNA.");
    } else {
      setConsultations([newAppointment, ...consultations]);
      setShowAddConsultationModal(false);
      triggerToast(`Rendez-vous de téléconsultation avec un praticien (${formLanguage}) enregistré.`);
    }
  };

  const simulateSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'me' as const, text: chatInput, time: '14:34' };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');

    // Doctor lazy response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'doc',
        text: "Entendu. Je prépare l'ordonnance électronique que vous recevrez en fin de rendez-vous.",
        time: '14:35'
      }]);
    }, 1500);
  };

  const handleEndCall = () => {
    setShowEndCallModal(true);
  };

  const confirmEndCall = (withPrescription: boolean) => {
    setShowEndCallModal(false);
    setView('schedule');
    if (activeConsultation) {
      setConsultations(prev => prev.map(c => c.id === activeConsultation.id ? { ...c, status: 'Terminée' } : c));
    }
    if (withPrescription) {
      setView('epr');
      setShowPrescriptionModal(true);
      triggerToast("Consultation archivée. Moteur d'ordonnance intelligente initialisé.");
    } else {
      triggerToast("Consultation vidéo terminée. Compte-rendu et traçabilité médico-légale de 12 min stockés.");
    }
    setActiveConsultation(null);
  };

  // F2 handles
  const handleUploadOCR = (e: React.FormEvent) => {
    e.preventDefault();
    setOcrStatus('processing');
    setTimeout(() => {
      setOcrStatus('done');
      setOcrForm(prev => ({
        ...prev,
        title: "CR Laboratoire Lubumbashi - OCR Reconstitué",
        file: "Labo_Hemo_Lshi_Aprob.pdf",
      }));
      // append to records documents
      const newDoc: MedicalDocument = {
        id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
        type: ocrForm.type,
        title: "Analyse Hémoglobine Lubumbashi - Extraction IA",
        date: ocrForm.date,
        source: 'Labo Clinique Externe (Lshi)',
        ocrDetected: 'Contrôles hémoglobine normaux, tension artérielle 13.1'
      };
      setDme(prev => ({
        ...prev,
        documents: [newDoc, ...prev.documents]
      }));
      triggerToast("OCR IA achevé : Champs analysés et rattachés au DME de Marie-Claire Mbika.");
    }, 1500);
  };

  // F3 handles
  const handleDrugSearchChange = (val: string) => {
    setPrescriptionForm(prev => ({ ...prev, drugSearch: val }));
    if (val.toLowerCase().includes('doliprane') || val.toLowerCase().includes('paracetamol')) {
      setDrugWarning("⚠️ Interaction détectée : L'adhérent a déjà une prescription active d'Amoxicilline + Paracétamol. Une double prise de Doliprane risque de saturer la barrière hépatique.");
    } else {
      setDrugWarning(null);
    }
  };

  const handleAddDrug = () => {
    if (!prescriptionForm.drugSearch) return;
    setAddedMeds([...addedMeds, `${prescriptionForm.drugSearch} (${prescriptionForm.posology} - ${prescriptionForm.duration})`]);
    setPrescriptionForm(prev => ({ ...prev, drugSearch: '' }));
    setDrugWarning(null);
  };

  const handleSignPrescription = () => {
    if (!otpSent) {
      setOtpSent(true);
      triggerToast("Code OTP adressé par SMS sécurisé rattaché au certificat QES.");
      return;
    }
    if (otpCode !== '1234' && otpCode !== '') {
      triggerToast("Code de signature OTP invalide.");
      return;
    }
    // Signed
    setIsPrescriptionSigned(true);
    const hash = 'sha256_' + Math.random().toString(16).substring(2, 10) + '9afbf4c8996fb92427ae';
    setPrescriptionHash(hash);
    triggerToast("Ordonnance signée numériquement avec certificat légal QES.");
  };

  const handleDispatchPharmacy = () => {
    setPrescriptionDispatched(true);
    triggerToast(`Ordonnance transférée à la ${selectedPharmacy}. Code de retrait sécurisé généré: ADNA-8821.`);
  };

  // F4 actions
  const handleAlertMinistry = () => {
    setMalariaTriggered(true);
    triggerToast("Alerte sanitaire transmise au Ministère de la Santé de la RDC (Direction d'Épidémiologie).");
  };

  // Top pathologies data helper
  const PATHOLOGY_DATA = [
    { name: 'Paludisme', value: 45, color: '#e11d48' },
    { name: 'Infections Cardio', value: 20, color: '#4ba32c' },
    { name: 'Pédiatrie Fièvres', value: 23, color: '#312e81' },
    { name: 'Dermatites', value: 12, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 border border-white/10 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="p-2 bg-green-500 rounded-xl text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-green-400">Téléconsultation Nationale &amp; Diaspora</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toast}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern navigation sub-tabs bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <Stethoscope className="w-5 h-5 text-green-600" />
          <h2 className="text-sm font-black text-slate-900 uppercase">F. Espace Praticiens &amp; Téléconsultation</h2>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => { setView('schedule'); }}
            className={cn(
              "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
              view === 'schedule' ? "bg-white text-green-800 shadow" : "text-slate-400 hover:text-green-800"
            )}
          >
            Consultations (F1)
          </button>
          <button 
            onClick={() => { setView('epr'); }}
            className={cn(
              "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
              view === 'epr' ? "bg-white text-green-800 shadow" : "text-slate-400 hover:text-green-800"
            )}
          >
            Dossier Patient - DME (F2)
          </button>
          <button 
            onClick={() => { setView('dashboard'); }}
            className={cn(
              "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
              view === 'dashboard' ? "bg-white text-green-800 shadow" : "text-slate-400 hover:text-green-800"
            )}
          >
            TDB Dr. &amp; Épidémies (F4)
          </button>
        </div>
      </div>

      {/* Render selected view */}

      {/* SECTION F1 : CONSULTATIONS & CALENDAR */}
      {view === 'schedule' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left : Active slots and low bandwidth indicator */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase italic">Garde Télémédicale Active (RDC / Diaspora / Rural)</h4>
                  <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Vérification de connectivité automatique active</p>
                </div>

                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-black uppercase rounded-lg flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> 3G / Zone rurale compatible
                  </div>

                  <button 
                    onClick={() => setShowAddConsultationModal(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[9px] font-red font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> + Nouvelle consultation
                  </button>
                </div>
              </div>

              {/* Dynamic weekly calendar slots simulating different global bandwidths */}
              <div className="bg-white border border-slate-150 p-5 rounded-[2rem] space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">Planification de la semaine (Auto local timezone : UTC)</span>
                
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { day: 'Lun', date: '25 Mai', slots: 4, fallback: false },
                    { day: 'Mar', date: '26 Mai', slots: 2, fallback: true }, // Highlight: low débit area
                    { day: 'Mer', date: '27 Mai', slots: 5, fallback: false },
                    { day: 'Jeu', date: '28 Mai', slots: 1, fallback: false },
                    { day: 'Ven', date: '29 Mai', slots: 6, fallback: true }
                  ].map((cell, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "p-4 rounded-2xl border text-center relative",
                        cell.fallback ? "bg-amber-50/50 border-amber-200" : "bg-slate-50 border-slate-150"
                      )}
                    >
                      <p className="text-[10px] font-black text-slate-800 uppercase">{cell.day}</p>
                      <p className="text-xs font-black text-slate-950 mt-0.5">{cell.date}</p>
                      <div className="mt-3 inline-block px-2 py-0.5 bg-slate-900 text-white text-[8px] font-mono rounded font-black">
                        {cell.slots} DISPO
                      </div>

                      {cell.fallback && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Couverture réseau limitée : Recommande l'option Audio uniquement" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider block">Option bas-débit disponible</span>
                    <p className="text-[11px] font-semibold text-amber-700 leading-normal">
                      Détecté: Signal réseau distant temporaire (Lubumbashi 3G). Nos flux basculent automatiquement en audio compressé pour éliminer tout risque de rupture de communication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultation roster */}
              <div className="space-y-3">
                {consultations.map((c) => (
                  <div key={c.id} className="bg-white border border-slate-150 rounded-[2rem] p-5 shadow-sm hover:border-green-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                        c.status === 'Terminée' ? "bg-slate-100 text-slate-400" : "bg-green-50 text-green-600"
                      )}>
                        <Video className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-[13.5px] font-black text-slate-900 uppercase">{c.doctorName}</h5>
                          <span className="text-[8.5px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-150 uppercase tracking-widest">{c.specialty}</span>
                          <span className="text-[8.5px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase">{c.language}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-1.5 text-[10.5px] font-bold text-slate-400">
                          <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {c.date}</p>
                          <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.time}</p>
                          {c.urgency === 'Urgence' && (
                            <span className="text-rose-600 font-extrabold animate-pulse text-[9.5px]">⚠️ Haute Urgence</span>
                          )}
                          <p className="font-mono text-[9px]">Ref: {c.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {c.status === 'Planifiée' ? (
                        <button 
                          onClick={() => { setActiveConsultation(c); setView('call'); }}
                          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow"
                        >
                          <Video className="w-3.5 h-3.5" /> Rejoindre la salle WebRTC
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded text-[9.5px] font-black uppercase">
                          ✓ Consultation achevée
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right side information card for telemedine */}
            <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-6">
              <span className="text-xs font-black text-slate-900 uppercase">Qualité Mondiale de Soin</span>
              
              <div className="space-y-4 text-xs text-slate-600 font-medium">
                <p>
                  Adonaï Care connecte de façon transparente des praticiens certifiés en RDC et à l&apos;étranger (France, Belgique, Inde, Diaspora) avec les collaborateurs d&apos;entreprises locales ou en zones éloignées.
                </p>

                <div className="divide-y divide-slate-100">
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-slate-400">Flux audio/vidéo adaptatif</span>
                    <span className="text-slate-900 font-black">Actif d&apos;office (AVC/HEVC)</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-slate-400">Protection DME cryptée</span>
                    <span className="text-slate-900 font-black">Conforme HIPAA &amp; RGPD</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="font-bold text-slate-400">Match Langue &amp; Culture</span>
                    <span className="text-green-600 font-black">Lingala / Swahili dispo</span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950 text-indigo-300 rounded-2xl">
                  <span className="text-[8.5px] font-black uppercase text-indigo-400">Conseil Pratique :</span>
                  <p className="text-[11px] font-semibold mt-1 leading-normal">
                    Lorsque vous lancez un appel en zone isolée, la passerelle WebRTC réduit dynamiquement la définition vidéo pour privilégier l&apos;intelligibilité parfaite de la voix thérapeutique.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* WEBRTC CALL SCREEN INTEGRATION SIMULATOR */}
      {view === 'call' && activeConsultation && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-950 rounded-[2.5rem] p-6 text-white space-y-6 border border-white/5 shadow-2xl relative"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-green-500/30 bg-green-500/10 rounded-xl text-green-400">
                <Video className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>SALLE VIDÉOPHONE WEBRTC SECURE</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded-full">
                    Garantie HIPAA/RGPD
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest font-mono">
                  Praticien assigné : {activeConsultation.doctorName} • Spécialité : {activeConsultation.specialty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9.5px] font-mono text-emerald-400 font-black animate-pulse">
                KPI Débit: {networkSpeed} kbps
              </div>
              <button 
                onClick={handleEndCall}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-rose-600/15"
              >
                Terminer la Consultation
              </button>
            </div>
          </div>

          {/* Network alert banner */}
          <AnimatePresence>
            {networkWarning && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-3.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{networkWarning}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core call visual partition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Stream simulator panel (2/3 width) */}
            <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6 flex flex-col justify-between aspect-video relative overflow-hidden space-y-12">
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent z-0 pointer-events-none" />

              {/* Top info overlay */}
              <div className="flex justify-between items-start z-10 relative">
                <span className="px-2.5 py-1 bg-slate-950/80 rounded-md text-[8px] font-black tracking-widest uppercase">
                  Canal {activeConsultation.language} Actif
                </span>
                
                {audioOnlyState ? (
                  <span className="px-2.5 py-1 bg-rose-500 text-white rounded-md text-[8px] font-black uppercase tracking-wider animate-pulse">
                    MOTEUR AUDIO SEUL (ÉCONOMIE DÉBIT ACTIVE)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-green-500 text-white rounded-md text-[8px] font-black uppercase tracking-wider">
                    FLUX VIDÉO HD ACTIF
                  </span>
                )}
              </div>

              {/* Video elements simulator */}
              <div className="flex-1 flex items-center justify-center relative z-10">
                {audioOnlyState || isVideoOff ? (
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border border-white/10 mx-auto flex items-center justify-center font-black text-white text-lg text-rose-400">
                      {activeConsultation.doctorName.substring(4, 5)}
                    </div>
                    <p className="text-xs font-black uppercase text-slate-400 italic">Médecin connecté (Audio Compressé Voix HD)</p>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-indigo-700 animate-spin rounded-full mx-auto flex items-center justify-center">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xs font-black uppercase text-slate-350">{activeConsultation.doctorName} (Vidéo Temps Réel)</p>
                  </div>
                )}
              </div>

              {/* Control dock bottom bar */}
              <div className="flex justify-between items-center border-t border-white/5 pt-4 z-10 relative">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isMuted ? "bg-rose-600 text-white" : "bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button 
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isVideoOff ? "bg-rose-600 text-white" : "bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>

                  <button 
                    onClick={() => {
                      setIsScreenSharing(!isScreenSharing);
                      triggerToast(isScreenSharing ? "Partage d'écran interrompu." : "Partage d'écran initialisé.");
                    }}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isScreenSharing ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setTakePhotoAlert(true);
                      setTimeout(() => {
                        setTakePhotoAlert(false);
                        triggerToast("Photo lésion rattachée avec succès au DME en cours d'instruction.");
                      }, 2500);
                    }}
                    className="px-3.5 py-2.5 bg-rose-600/30 text-rose-350 border border-rose-500/20 hover:bg-rose-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                  >
                    <Camera className="w-4 h-4" /> Prendre photo lésion Rép.
                  </button>
                </div>
              </div>

            </div>

            {/* Chat room panel (1/3 width) */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-[360px]">
              <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase block pb-3 border-b border-white/5">
                Messagerie Consultative
              </span>

              {/* Chat thread */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-none text-[11px]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-xl max-w-[85%] leading-relaxed font-medium",
                    msg.sender === 'doc' ? "bg-white/10 text-white rounded-tl-none self-start" : "bg-indigo-600 text-white rounded-tr-none ml-auto"
                  )}>
                    <p>{msg.text}</p>
                    <span className="text-[8px] opacity-60 block text-right mt-1 font-mono">{msg.time}</span>
                  </div>
                ))}

                {takePhotoAlert && (
                  <div className="p-3 bg-rose-600/20 text-rose-300 border border-rose-500/20 rounded-xl">
                    <p className="font-bold flex items-center gap-1 text-[9px] uppercase"><Camera className="w-3.5 h-3.5" /> Cliché Instantané</p>
                    <p className="text-[10px] mt-1">Capture de la webcam transmise au DME...</p>
                  </div>
                )}
              </div>

              {/* Input box */}
              <form onSubmit={simulateSendChat} className="flex gap-2.5 border-t border-white/5 pt-3">
                <input 
                  type="text"
                  placeholder="Écrivez un message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 h-10 px-3.5 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none"
                />
                <button type="submit" className="px-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl h-10 flex items-center justify-center">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>

          </div>

        </motion.div>
      )}

      {/* SECTION F2 : PATIENT RECORDS & TIMELINE */}
      {view === 'epr' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left : Medical File Timeline detail DME */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Profile Card Header */}
              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-50 border border-indigo-150 rounded-2xl flex items-center justify-center font-black text-indigo-700 text-lg">
                    {dme.patientName.substring(0, 2)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-1000 uppercase leading-none">{dme.patientName}</h4>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8.5px] font-black uppercase tracking-wider rounded border border-emerald-150">DME Certifié SNIS</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {dme.id} • {dme.age} ans • Groupe Sanguin {dme.bloodType}</p>
                    
                    <div className="flex gap-3 mt-3">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[8px] font-black uppercase tracking-wider rounded border border-rose-150">Allergies: {dme.allergies.join(', ')}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-wider rounded border border-slate-200">Antécédents: {dme.history.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setNgaliemaConsent(!ngaliemaConsent); setShowConsentModal(true); }}
                    className="px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase cursor-pointer flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Partage inter-hôpitaux
                  </button>

                  <button 
                    onClick={() => triggerToast("Préparation de l'impression du dossier certifié PDF. QR Code rattaché.")}
                    className="p-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer"
                    title="Imprimer QR Code Patient urgences"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Medical timeline history list */}
              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] space-y-4 shadow-sm">
                <span className="text-xs font-black text-slate-1000 uppercase block pb-2 border-b border-slate-50">
                  Dossier Médical Unique : Chronologie de Santé
                </span>

                <div className="space-y-4">
                  {dme.timeline.map((act) => (
                    <div 
                      key={act.id}
                      onClick={() => setSelectedTimelineEvent(act)}
                      className="p-4 bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all cursor-pointer relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider">{act.date} • {act.time}</span>
                          <h5 className="text-xs font-black text-slate-900 mt-1 uppercase">{act.doctorName} ({act.specialty})</h5>
                          <p className="text-[11px] text-slate-500 italic mt-0.5 mt-1.5">{act.notes}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                      </div>

                      {act.meds.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {act.meds.map((med, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 text-[8px] font-black rounded-md">{med}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right block: Documents & upload with OCR simulation F2 & QR code */}
            <div className="space-y-6">

              {/* Printable Medical Emergency QR Card */}
              <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">QR Card Secours DME</span>
                
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 relative overflow-hidden border border-white/5">
                  <div className="flex justify-between items-center text-[7.5px] font-mono opacity-60">
                    <span>EMERGENCY ACCESS</span>
                    <span>ADONAÏ HEALTH SECURE</span>
                  </div>

                  <div className="w-24 h-24 bg-white p-2.5 rounded-xl mx-auto flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-center font-mono">Marie-Claire Mbika</p>
                    <p className="text-[8px] font-mono text-emerald-400">Ref DME: DME-8842</p>
                  </div>
                </div>

                <p className="text-[9.5px] text-slate-500 font-medium leading-relaxed italic">
                  Sans Internet, le personnel hospitalier peut scanner cette carte de secours pour obtenir directement l&apos;historique critique et les allergies prioritaires.
                </p>

                <button 
                  onClick={() => triggerToast("Impression format PDF A4 en cours d'envoi à l'imprimante.")}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer"
                >
                  Imprimer QR Code secours
                </button>
              </div>

              {/* Upload & Simulated OCR block */}
              <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-xs font-black text-slate-900 uppercase">Documents Rattachés</span>
                  <button 
                    onClick={() => setShowOCRUpload(true)}
                    className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Charger
                  </button>
                </div>

                <div className="space-y-3">
                  {dme.documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[7.5px] rounded uppercase font-black">{doc.type}</span>
                          <h6 className="text-[11px] font-black text-slate-900 mt-1">{doc.title}</h6>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">Émis le {doc.date} | {doc.source}</p>
                        </div>
                      </div>

                      {doc.ocrDetected && (
                        <div className="mt-2 text-[9px] text-indigo-700 bg-indigo-50/50 p-2 border border-indigo-150 rounded-lg font-bold">
                          🧠 IA OCR : {doc.ocrDetected}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SECTION F4 : DOCTOR / ADMIN DASHBOARD & EPIDEMIES */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Filters shelf */}
          <div className="bg-white border border-slate-150 p-5 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-black text-slate-1000 uppercase leading-none">Supervision Médicale &amp; Vigilance Sanitaire (F4)</span>
              <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-1">Données sanitaires consolidées en temps réel</p>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={dashboardCountry}
                onChange={(e) => setDashboardCountry(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-black uppercase rounded-xl select-none"
              >
                <option value="RDC">Congo-Kinshasa (RDC)</option>
                <option value="France">Diaspora (France)</option>
                <option value="Congo">Congo Brazzaville</option>
              </select>

              <select 
                value={dashboardSpecialty}
                onChange={(e) => setDashboardSpecialty(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs font-black uppercase rounded-xl"
              >
                <option value="Toutes">Spécialité : Toutes</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Dermatologie">Dermatologie</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left KPIs and Outbreak alerts */}
            <div className="lg:col-span-2 space-y-6">

              {/* KPIs indicators row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Consultations Jour', value: '89 actes', desc: '+12% vs hier', icon: Video, color: 'text-indigo-600' },
                  { label: 'No-show Taux', value: '8 %', desc: 'Sms de relance actif', icon: XCircle, color: 'text-rose-500' },
                  { label: 'Durée Moyenne', value: '11 min', desc: 'Rendement optimum', icon: Clock, color: 'text-emerald-600' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-slate-150 rounded-[2rem] p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">{kpi.label}</span>
                      <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                    </div>

                    <div>
                      <p className="text-xl font-black text-slate-900">{kpi.value}</p>
                      <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{kpi.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Public Health Malaria Warning alert box */}
              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-rose-600 rounded-xl text-white animate-bounce">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[9.5px] font-black text-rose-600 uppercase tracking-widest block">ALERTE MACRO-ÉPIDÉMIQUE SÉLECTIONNÉE</span>
                    <h5 className="text-sm font-black text-slate-900 uppercase">Kinshasa : Évolution anormale de Paludisme (+22%)</h5>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      Notre modèle intelligent de veille d&apos;assurance a détecté une pics de consultations de paludisme d&apos;infanterie de garde de +22% à Gombe et Ngaliema. Transmission d&apos;alerte automatique proactive recommandée aux pouvoirs publics.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div>
                    <span className="text-[9.5px] font-black text-slate-400 uppercase">Statut transmission:</span>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      {malariaTriggered ? "✓ Alerte expédiée au Secrétariat d'État à la Santé de Kinshasa." : "En attente de validation d'arbitrage"}
                    </p>
                  </div>

                  <button 
                    onClick={handleAlertMinistry}
                    disabled={malariaTriggered}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer",
                      malariaTriggered ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
                    )}
                  >
                    <Send className="w-3.5 h-3.5" /> Signaler le Ministère de la Santé
                  </button>
                </div>
              </div>

            </div>

            {/* Right pathologies pie-chart */}
            <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
              <span className="text-xs font-black text-slate-900 uppercase">Top Pathologies Diagnostics (Consultations Répartition)</span>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PATHOLOGY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {PATHOLOGY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                {PATHOLOGY_DATA.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-100 bg-slate-50">
                    <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: entry.color }} />
                    <span className="font-bold text-slate-700 truncate">{entry.name} : {entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =================================================== */}
      {/* LATERAL DME TIMELINE EVENT DRAWER (F2)             */}
      {/* =================================================== */}
      <AnimatePresence>
        {selectedTimelineEvent && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[210] flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md bg-white h-screen shadow-2xl p-8 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Dossier Unique DME rattaché</span>
                  <button onClick={() => setSelectedTimelineEvent(null)} className="p-1 px-2.5 bg-slate-100 font-black rounded-lg text-xs hover:bg-slate-200 cursor-pointer">
                    Fermer
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-150 text-indigo-700 text-[9px] font-black rounded-md uppercase tracking-wider block w-fit">
                    Téléconsultation confirmée {selectedTimelineEvent.date}
                  </span>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider block">Médecin Praticien</h4>
                    <p className="text-sm font-black text-slate-900 mt-1 uppercase">{selectedTimelineEvent.doctorName}</p>
                    <p className="text-xs text-slate-400 font-bold">{selectedTimelineEvent.specialty}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider block">Diagnostics &amp; Observations</h4>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200 mt-1 text-justify">
                      {selectedTimelineEvent.notes}
                    </p>
                  </div>

                  {selectedTimelineEvent.meds.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider block">Traitements Rattachés</h4>
                      <div className="space-y-2 mt-2">
                        {selectedTimelineEvent.meds.map((med, idx) => (
                          <div key={idx} className="p-3 bg-indigo-50 border border-indigo-150 rounded-lg text-indigo-800 text-xs font-black uppercase">
                            💊 {med}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedTimelineEvent(null);
                  triggerToast("Raccordement inter-hôpitaux certifié sur ce document.");
                }}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-center cursor-pointer"
              >
                Approuver l&apos;extrait de santé
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* MODAL F1: APU CREATOR (PLAN / EMERGENCY COHERENCY) */}
      {/* =================================================== */}
      <AnimatePresence>
        {showAddConsultationModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowAddConsultationModal(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 text-green-600">
                    <Video className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-black text-slate-1000 uppercase italic">Nouvelle Téléconsultation</h3>
                </div>
                <button onClick={() => setShowAddConsultationModal(false)} className="text-slate-400 hover:text-slate-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="p-8 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Type de RDV</label>
                    <select 
                      value={formUrgency}
                      onChange={(e) => setFormUrgency(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold"
                    >
                      <option value="Basse">RDV Planifié Standard</option>
                      <option value="Haute">Consultation Haute</option>
                      <option value="Urgence">🚨 Garde Urgence direct</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase block font-bold font-bold">Spécialité requise</label>
                    <select 
                      value={formSpecialty}
                      onChange={(e) => setFormSpecialty(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold"
                    >
                      <option value="Généraliste">Généraliste</option>
                      <option value="Pédiatrie">Pédiatrie</option>
                      <option value="Cardiologie">Cardiologie</option>
                      <option value="Dermatologie">Dermatologie</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase block font-bold font-bold">Langue culturelle</label>
                    <select 
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold"
                    >
                      <option value="FR">Français (FR)</option>
                      <option value="Lingala">Lingala 🇨🇩 de kinshasa</option>
                      <option value="EN">English (EN)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase block font-bold font-bold">Patient affilié</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      value={formPatient}
                      onChange={(e) => setFormPatient(e.target.value)}
                    />
                  </div>
                </div>

                {formUrgency !== 'Urgence' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Date</label>
                      <input 
                        type="date"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={conDate}
                        onChange={(e) => setConDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Heure d&apos;appel</label>
                      <input 
                        type="time"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={conTime}
                        onChange={(e) => setConTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {formUrgency === 'Urgence' && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <p className="text-[9.5px] font-black text-rose-600 uppercase flex items-center gap-1">🚨 COUVERTURE PRIORITAIRE</p>
                    <p className="text-[10.5px] font-semibold text-rose-800 leading-normal">
                      En sélectionnant Garde Urgence, vous serez raccordé d&apos;office au médecin disponible Lingala/FR en &lt; 2 minutes sans passage calendaire.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddConsultationModal(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase text-center cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-[10px] uppercase text-center cursor-pointer"
                  >
                    Confirmer Réserver
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* MODAL F1: CONFIRMATION END CALL VIDEO DIAGNOSTIC   */}
      {/* =================================================== */}
      <AnimatePresence>
        {showEndCallModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[260] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowEndCallModal(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xs font-black text-slate-1000 uppercase italic">F1. Consultation Terminée (12 min)</h3>
                </div>
                <button onClick={() => setShowEndCallModal(false)} className="text-slate-400">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-4">
                <p className="text-xs text-slate-600 font-semibold leading-relaxed text-justify">
                  La liaison WebRTC a duré 12 minutes avec succès. Enregistrement médico-légal et crypté en cours. Souhaitez-vous générer immédiatement l&apos;ordonnance et la prescription numérique d&apos;accompagnement ?
                </p>

                <div className="space-y-2">
                  <button 
                    onClick={() => confirmEndCall(true)}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[9.5px] uppercase tracking-widest cursor-pointer"
                  >
                    Générer Compte-Rendu + Ordonnance (F3)
                  </button>

                  <button 
                    onClick={() => confirmEndCall(false)}
                    className="w-full py-3.5 border border-slate-200 hover:border-slate-350 text-slate-700 rounded-xl font-black text-[9px] uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Oui, sans ordonnance (FMI)
                  </button>

                  <button 
                    onClick={() => setShowEndCallModal(false)}
                    className="w-full py-2 bg-slate-100 font-bold text-slate-500 rounded-lg text-[9px] uppercase text-center"
                  >
                    Reprendre l&apos;appel WebRTC
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* MODAL F2: OCR DOCUMENTS UPLOADER SCREEN            */}
      {/* =================================================== */}
      <AnimatePresence>
        {showOCRUpload && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowOCRUpload(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-150"
            >
              <div className="p-8 border-b border-slate-150 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900 uppercase">Uploader Analyse &amp; OCR Intelligent (F2)</span>
                <button onClick={() => setShowOCRUpload(false)} className="p-1">
                  <XCircle className="w-5 h-5 text-slate-400 hover:text-slate-700" />
                </button>
              </div>

              <form onSubmit={handleUploadOCR} className="p-8 space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Type de Document</label>
                  <div className="flex gap-4">
                    {['Radio', 'Analyse', 'CR'].map((type) => (
                      <label key={type} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="radio" 
                          name="ocr_type" 
                          checked={ocrForm.type === type}
                          onChange={() => setOcrForm(prev => ({ ...prev, type: type as any }))}
                          className="text-pink-600" 
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Fichier d&apos;analyse (Imité)</label>
                  
                  <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer space-y-2 bg-slate-50/50">
                    <UploadCloud className="mx-auto w-10 h-10 text-slate-350" />
                    <p className="text-xs font-bold text-slate-800">Glisser-déposer ou cliquer pour importer</p>
                    <p className="text-[9px] text-slate-400">PDF, JPG (Max 5Mo) • Extraction auto IA</p>
                  </div>
                </div>

                {ocrStatus === 'processing' && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5">
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="text-xs font-black text-indigo-700 uppercase animate-pulse">OCR en cours d&apos;exécution... Extraction automatique</span>
                  </div>
                )}

                {ocrStatus === 'done' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <div className="text-[11.5px] text-emerald-800 font-semibold leading-normal">
                      Extracteur IA : <span className="font-bold underline">{ocrForm.file}</span> décodé. Valeurs d&apos;hémoglobine identifiées à Lubumbashi. Double saisie évitée.
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowOCRUpload(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase text-center"
                  >
                    Fermer
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase text-center"
                  >
                    Lancer l&apos;OCR
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* MODAL F2: INTER-HOSPITALS CONSENT TO DME            */}
      {/* =================================================== */}
      <AnimatePresence>
        {showConsentModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowConsentModal(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-black text-slate-900 uppercase">Consentement RGPD &amp; Partage inter-hôpitaux</span>
                <button onClick={() => setShowConsentModal(false)} className="p-1">
                  <XCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-4 text-xs font-bold text-slate-700">
                <p className="leading-relaxed text-justify">
                  La législation internationale (e.g. RGPD ou HIPAA) vous impose d&apos;obtenir le consentement explicite de l&apos;assuré. Autorisez-vous l&apos;Hôpital Ngaliema (Kinshasa) à consulter l&apos;historique clinique de cet adhérent ?
                </p>

                <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl">
                  <p className="text-[10px] font-black text-indigo-700 uppercase">VALIDITÉ COMPLIANCE :</p>
                  <p className="text-xs text-slate-700 mt-1 font-semibold leading-relaxed">
                    Consentement temporaire actif jusqu&apos;au <span className="font-bold underline text-indigo-600">30/06/2026</span>. Historique des actions de diagnostics copié dans le grand livre immutable.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => { setNgaliemaConsent(false); setShowConsentModal(false); triggerToast("Consentement DME décliné."); }}
                    className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-xl font-black text-[10px] uppercase text-center"
                  >
                    Refuser
                  </button>
                  <button 
                    onClick={() => { setNgaliemaConsent(true); setShowConsentModal(false); triggerToast("Consentement de Marie-Claire accordé pour l'Hôpital Ngaliema jusqu'au 30 Juin."); }}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-black text-[10px] uppercase text-center"
                  >
                    Accorder Partage
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* MODAL F3: SMART PRESCRIPTION EDITOR & DISPATCH     */}
      {/* =================================================== */}
      <AnimatePresence>
        {showPrescriptionModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowOCRUpload(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-150"
            >
              <div className="p-8 border-b border-slate-150 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-600 animate-bounce" />
                  <span className="text-xs font-black text-slate-1000 uppercase italic">F3. Moteur de Prescription Intelligent d’Assurance</span>
                </div>
                <button onClick={() => setShowPrescriptionModal(false)} className="p-1">
                  <XCircle className="w-5 h-5 text-slate-400 hover:text-slate-700" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Product Search and Posology Form */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Ajouter des principes actifs ou DCI</span>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Médicament Recherché / DCI RDC &amp; FR</label>
                    <input 
                      type="text"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      placeholder="Ex: Doliprane 1000mg ou Amoxicilline"
                      value={prescriptionForm.drugSearch}
                      onChange={(e) => handleDrugSearchChange(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Posologie</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={prescriptionForm.posology}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, posology: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase block font-bold">Durée</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                        value={prescriptionForm.duration}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {drugWarning && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-justify"
                      >
                        <div className="flex items-center gap-1.5 text-rose-600 text-[9.5px] font-black uppercase">
                          <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" /> TOXICOLOGIE CROISÉE
                        </div>
                        <p className="text-[10.5px] text-rose-900 font-semibold leading-normal">
                          {drugWarning}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    type="button" 
                    onClick={handleAddDrug}
                    className="w-full py-3 border border-indigo-200 hover:border-indigo-400 bg-indigo-50 text-indigo-700 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center"
                  >
                    + Rattacher au Traitement ordonnancé
                  </button>
                </div>

                {/* Traitement summary and pharmacie dispatching */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Récapitulatif de l&apos;ordonnance légale</span>
                    
                    <div className="space-y-2 max-h-[140px] overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      {addedMeds.length === 0 ? (
                        <p className="text-center italic text-xs text-slate-400 py-6">Aucun médicament ajouté.</p>
                      ) : (
                        addedMeds.map((med, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-800 p-2 bg-white rounded-lg border border-slate-100">
                            <span>💊 {med}</span>
                            <button onClick={() => setAddedMeds(addedMeds.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Certificat de signature QES */}
                    <div className="p-3.5 bg-indigo-950 text-white rounded-2xl relative overflow-hidden space-y-3">
                      <span className="text-[8px] font-black text-indigo-400 uppercase block tracking-wider">CERTIFICATE DE SIGNATURE ÉLECTRONIQUE (QES)</span>

                      {isPrescriptionSigned ? (
                        <div className="space-y-1.5 text-[10.5px] text-indigo-200">
                          <p className="font-extrabold text-white flex items-center gap-1">✓ SIGNÉE CERTIFIÉE CONFORME</p>
                          <p className="font-mono text-[8px] opacity-80 select-all truncate">Hash: {prescriptionHash}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {otpSent ? (
                            <div className="flex gap-2.5">
                              <input 
                                type="text"
                                placeholder="code OTP (1234)"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-24 px-3 py-1 bg-white/10 border border-white/20 text-xs rounded text-white"
                              />
                              <button 
                                onClick={handleSignPrescription}
                                className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white font-black text-[9px] uppercase tracking-wider rounded"
                              >
                                Signer avec OTP (QES)
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={handleSignPrescription}
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-wider rounded-lg"
                            >
                              Signer avec SMS OTP
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dispatch to pharmacies */}
                  {isPrescriptionSigned && (
                    <div className="pt-3 border-t border-slate-150 space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Transférer Tiers-Payant Pharmacie (Moins de 5km)</span>
                      
                      <div className="flex gap-2">
                        <select 
                          value={selectedPharmacy}
                          onChange={(e) => setSelectedPharmacy(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black uppercase text-slate-800"
                        >
                          {PHARMACIES.map((p, idx) => (
                            <option key={idx} value={p.name}>{p.name} ({p.distance} - Taux {p.open})</option>
                          ))}
                        </select>

                        <button 
                          onClick={handleDispatchPharmacy}
                          disabled={prescriptionDispatched}
                          className={cn(
                            "px-4 py-2 text-white font-black text-[9.5px] uppercase tracking-wider rounded-lg",
                            prescriptionDispatched ? "bg-emerald-600 text-white" : "bg-slate-900 hover:bg-slate-800"
                          )}
                        >
                          {prescriptionDispatched ? "Envoyé ✓" : "Dépêcher"}
                        </button>
                      </div>

                      {prescriptionDispatched && (
                        <p className="text-[9.5px] text-emerald-600 font-bold uppercase leading-relaxed mt-1 animate-pulse">
                          ✓ Transfert opéré avec succès. L&apos;assuré ne paie que le ticket modérateur (15%) à l&apos;officine.
                        </p>
                      )}
                    </div>
                  )}

                </div>

              </div>

              <div className="p-8 border-t border-slate-150 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
