declare global {
  interface Window {
    storage: any;
  }
}

import React, { useState } from "react";
import {
  Home, FileText, CreditCard, Stethoscope, MessageCircle, ChevronRight,
  ChevronDown, Download, Upload, Check, Clock, Phone, Mail,
  MapPin, ShieldCheck, AlertCircle, X, Send, Trash2, ArrowLeft,
  CheckCircle2, Loader2, Baby, Heart, Smartphone, Landmark,
  PenLine, Sparkles, UserPlus, UserCheck, Camera, ScanFace, Navigation,
  Calendar, Video, ClipboardList, Building2, Route, Fingerprint,
  CalendarCheck, Percent, Layers, Pill, Syringe, Ruler,
  Calculator, FilePlus, Share2, RefreshCw, BadgePercent, CalendarClock,
  Bell, Settings, Lock, LogOut, Star, TrendingDown, Wallet,
  Receipt, AlertTriangle, MessageSquare, Award, Thermometer,
  HeartPulse, Scissors, FlaskConical, Paperclip, Dna, Link2, Users2,
  FileDown, Activity, TrendingUp, ListChecks, UserRoundCheck, WifiOff,
  MessageSquarePlus, UserCog, Ban, Search, SlidersHorizontal, ScanLine, BadgeCheck,
  Mic, MicOff, VideoOff, PhoneOff, XCircle
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/* ---------------------------------------------------------------
   TOKENS
------------------------------------------------------------------ */
const C = {
  navy: "#0D2818", navy2: "#1B4A34", gold: "#C6992E", goldSoft: "#EFDFB8",
  ivory: "#F6F3EC", ink: "#1A1B1E", sub: "#6B6F76", line: "#E7E2D6",
  green: "#2F8A5B", greenSoft: "#E7F3EC", amber: "#C0392B", red: "#C0392B", redSoft: "#FBEAE8",
};
const serif = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif";
const mono = "ui-monospace,'SF Mono',Menlo,monospace";
const fmt = (n: number | string) => Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ") + " CDF";

const CATEGORIES = ["Consultations & Pharmacie", "Hospitalisation", "Dentaire", "Optique", "Maternité"];

/* ---------------------------------------------------------------
   BAREME SPÉCIFIQUE — Mutuelle Lisanga
------------------------------------------------------------------ */
const LISANGA_BAREME = [
  { cat: "Soins de santé primaires (jusqu'à 5 épisodes/an, 50% dès le 6ᵉ épisode)", items: [
    ["Consultation générale, examens courants et médicaments génériques", "90%", "10%", "Ex : paludisme simple 25$ → 22,5$ / 2,5$"],
  ]},
  { cat: "Consultations spécialisées", items: [
    ["Médecine interne, Gynécologie, Pédiatrie, Chirurgie, Cardiologie, Ophtalmologie, Dentisterie, Dermatologie, Neurologie, Psychiatrie, Kinésithérapie, ORL", "90%", "10%", "Ex : cardiologie 30$ → 27$ / 3$"],
  ]},
  { cat: "Examens de laboratoire spécialisés", items: [
    ["Urée, Créatinine, Cholestérol, Lipides, VDRL, LDL, Acide urique, T4, TSH, FSH, LH, PSA, Hémoculture, Uroculture, Coproculture, Ziehl", "60%", "40%", "Ex : cholestérol 30$ → 18$ / 12$"],
  ]},
  { cat: "Médicaments spécialisés", items: [
    ["Médicaments hors génériques", "60%", "40%", "Ex : Augmentin 20cp 20$ → 12$ / 8$"],
  ]},
  { cat: "Kinésithérapie (5 séances/mois)", items: [
    ["Séances de rééducation", "90%", "10%", "Ex : 50$ → 45$ / 5$"],
  ]},
  { cat: "Hospitalisation (3 fois/an, 50% dès la 4ᵉ fois)", items: [
    ["Chambre commune ≤10 jours, tournée médecin, soins infirmiers, labo, médicaments", "90%", "10%", "Ex : paludisme grave 100$ → 90$ / 10$"],
  ]},
  { cat: "Imagerie médicale", items: [
    ["Radiologie de routine (membres, colonne, abdomen, thorax, sinus)", "90%", "10%", "Ex : thorax 20$ → 18$ / 2$"],
    ["Radiologie spécialisée (OED, lavement baryté, UIV)", "60%", "40%", "Ex : lavement baryté 150$ → 90$ / 60$"],
    ["Échographie ordinaire (pelvienne, abdominale, masse)", "90%", "10%", "Ex : écho pelvienne 20$ → 18$ / 2$"],
    ["Échographie spécialisée (Doppler)", "60%", "40%", "Ex : Doppler 100$ → 60$ / 40$"],
    ["Mammographie, thyroïdienne, oculaire, EEG, ECG, CT Scanner cérébral", "60%", "40%", "Ex : CT cérébral 180$ → 108$ / 72$"],
  ]},
  { cat: "Accidents de la route & urgences", items: [
    ["Stabilisation, investigation (hors cause alcoolique/rixe)", "90%", "10%", ""],
  ]},
  { cat: "Grossesse et maternité", items: [
    ["Consultation prénatale (4 CPN, 1 écho, examens, médicaments)", "90%", "10%", ""],
    ["Accouchement eutocique", "90%", "10%", "100$ → 90$ / 10$"],
    ["Accouchement compliqué", "90%", "10%", "150$ → 135$ / 15$"],
    ["Césarienne", "90%", "10%", "300$ → 270$ / 30$"],
  ]},
  { cat: "Services pédiatriques", items: [
    ["Soins postnataux, urgences, soins intensifs, vaccination de routine, CPS, consultations", "90%", "10%", ""],
  ]},
  { cat: "Soins dentaires", items: [
    ["Consultation, douleur, extraction simple, amalgame, composite, détartrage, endodontie, plombage", "90%", "10%", ""],
  ]},
  { cat: "Soins ophtalmologiques", items: [
    ["Consultation, infection primaire, examens de routine, verres optiques, chirurgie œil unilatérale", "90%", "10%", ""],
    ["Échographie oculaire, réfraction automatique", "60%", "40%", ""],
    ["Monture de lunettes", "Prise en charge unique à vie de 20$", "—", ""],
  ]},
  { cat: "Pathologies chroniques", items: [
    ["Hypertension, diabète, asthme, ulcère gastroduodénal, arthrite, épilepsie, counseling", "90%", "10%", ""],
    ["Drépanocytose (crises uniquement)", "90%", "10%", ""],
    ["Infarctus du myocarde (urgence uniquement)", "90%", "10%", ""],
    ["Tuberculose", "Programme national", "—", ""],
  ]},
  { cat: "Chirurgies", items: [
    ["Mineures (suture, circoncision, abcès, furoncle, ponction, pansement)", "90%", "10%", ""],
    ["Intermédiaires (appendicectomie, cure herniaire, kystectomie, césarienne)", "90%", "10%", "Ex : appendicectomie 250$ → 225$ / 25$"],
    ["Majeures (myomectomie, laparotomie, prostatectomie, amygdalectomie)", "50%", "50%", "Ex : myomectomie 700$ → 350$ / 350$"],
  ]},
  { cat: "Prise en charge du VIH", items: [
    ["Dépistage et counseling", "90%", "10%", ""],
    ["Traitement", "Programme national", "—", ""],
  ]},
  { cat: "Transfusion sanguine (1 unité)", items: [["Transfusion", "90%", "10%", ""]] },
  { cat: "Décès", items: [["Conservation et mise en bière (3 jours, hors formolisation)", "90%", "10%", "80$ → 72$ / 8$"]] },
];

const LISANGA_LIMITES = [
  "Soins de santé primaires : 5 épisodes/an à 90%, puis 50% dès le 6ᵉ épisode",
  "Hospitalisation : 3 fois/an à 90%, puis 50% dès la 4ᵉ fois",
  "Kinésithérapie : plafonnée à 5 séances par mois",
  "Monture de lunettes : une seule prise en charge à vie (20$)",
  "Période d'observation : 3 mois pour la grossesse, 6 mois pour la chirurgie",
  "Unité d'adhésion : la famille ou le ménage — cotisation de 65$ par personne et par an",
];

const LISANGA_EXCLUSIONS = [
  "Hospitalisation en chambre privée et frais de nourriture",
  "Cancer et traitement du cancer",
  "Check-up médical de routine (hors laboratoire), contrôle médical",
  "HSG, CT Scanner abdominal (hors cérébral), IRM",
  "Accouchement par péridurale",
  "Implants et prothèses, traitement orthodontique, blanchiment dentaire",
  "Dialyse, insuffisance hépatique, cirrhose",
  "Parkinson, psychose, dépression",
  "Chirurgie majeure complexe (neurochirurgie, ostéosynthèse, prothèses, etc.)",
  "Examens cliniques de routine hors laboratoire",
  "Ambulance",
  "Tout autre soin ne figurant pas dans le paquet",
];

/* ---------------------------------------------------------------
   BARÈMES DÉTAILLÉS
------------------------------------------------------------------- */
const ESSENTIEL_BAREME = [
  { cat: "Soins de santé primaires (illimité)", items: [["Consultation générale, examens courants et médicaments génériques", "80%", "20%", "Ex : 15$ → 12$ / 3$"]] },
  { cat: "Consultations spécialisées (6/an)", items: [["Médecine interne, Gynécologie, Pédiatrie, Cardiologie, ORL, Dermatologie", "80%", "20%", "Ex : 25$ → 20$ / 5$"]] },
  { cat: "Examens de laboratoire", items: [["Analyses courantes", "80%", "20%", "Ex : 15$ → 12$ / 3$"], ["Analyses spécialisées", "50%", "50%", "Ex : 25$ → 12,5$ / 12,5$"]] },
  { cat: "Imagerie médicale", items: [["Radiologie et échographie de routine", "70%", "30%", "Ex : 15$ → 10,5$ / 4,5$"], ["Imagerie lourde", "Non couvert", "100%", ""]] },
  { cat: "Hospitalisation (chambre commune, 15 j/an)", items: [["Séjour, soins infirmiers, médicaments, tournée médicale", "90%", "10%", "Ex : 100$ → 90$ / 10$"]] },
  { cat: "Grossesse et maternité", items: [["CPN (3 CPN) et accouchement voie basse", "80%", "20%", "Ex : 80$ → 64$ / 16$"], ["Césarienne", "70%", "30%", "Ex : 300$ → 210$ / 90$"]] },
  { cat: "Soins dentaires", items: [["Soins conservateurs", "50%", "50%", "Ex : 20$ → 10$ / 10$"], ["Prothèses", "Non couvert", "100%", ""]] },
  { cat: "Soins ophtalmologiques", items: [["Consultation et examens de routine", "70%", "30%", ""], ["Monture et verres (1/2 ans)", "40%", "60%", "Plafond 100 000 CDF"]] },
  { cat: "Chirurgies", items: [["Mineures (suture, abcès, circoncision)", "80%", "20%", ""], ["Majeures", "40%", "60%", "Ex : 250$ → 100$ / 150$"]] },
  { cat: "Pathologies chroniques", items: [["Hypertension, diabète, asthme — suivi et médicaments", "80%", "20%", "Plafond mensuel : 30 000 CDF"]] },
];
const ESSENTIEL_LIMITES = [
  "Consultations spécialisées : limitées à 6 par an",
  "Hospitalisation : chambre commune, 15 jours par an max",
  "Optique : une monture tous les 2 ans",
  "Observation : 3 mois grossesse, 6 mois chirurgie",
  "Chroniques : max 30 000 CDF / mois pour médicaments",
];
const ESSENTIEL_EXCLUSIONS = [
  "Chambre privée et confort hospitalier",
  "Imagerie lourde et chirurgie majeure complexe",
  "Prothèses dentaires, orthodontie, blanchiment",
  "Cancer et oncologie",
  "Chirurgie esthétique et de confort",
];

const CONFORT_BAREME = [
  { cat: "Soins de santé primaires (illimité)", items: [["Consultation générale, examens courants et médicaments", "90%", "10%", "Ex : 15$ → 13,5$ / 1,5$"]] },
  { cat: "Consultations spécialisées (illimité)", items: [["Toutes spécialités", "90%", "10%", "Ex : 35$ → 31,5$ / 3,5$"]] },
  { cat: "Examens de laboratoire", items: [["Toutes analyses (courantes & spécialisées)", "90%", "10%", "Ex : 40$ → 36$ / 4$"]] },
  { cat: "Imagerie médicale", items: [["Radiologie, échographie, scanner", "80%", "20%", "Ex : 150$ → 120$ / 30$"], ["IRM", "60%", "40%", "Ex : 300$ → 180$ / 120$"]] },
  { cat: "Hospitalisation (chambre à 2 lits, 30 j/an)", items: [["Séjour complet, bloc opératoire, soins intensifs", "100%", "0%", "Ex : 400$ → 400$ / 0$"]] },
  { cat: "Grossesse et maternité", items: [["Suivi prénatal, accouchement, césarienne", "90%", "10%", "Ex : 300$ → 270$ / 30$"]] },
  { cat: "Soins dentaires", items: [["Soins conservateurs et extractions", "80%", "20%", ""], ["Prothèses simples", "60%", "40%", "Ex : 200$ → 120$ / 80$"]] },
  { cat: "Soins ophtalmologiques", items: [["Consultation, examens, cataracte", "80%", "20%", ""], ["Monture et verres (1/an)", "60%", "40%", "Plafond 300 000 CDF"]] },
  { cat: "Chirurgies", items: [["Toutes chirurgies conventionnées", "90%", "10%", "Ex : myomectomie 700$ → 630$ / 70$"]] },
  { cat: "Pathologies chroniques", items: [["Suivi et médicaments", "90%", "10%", ""]] },
];
const CONFORT_LIMITES = [
  "Hospitalisation : chambre 2 lits, 30 jours par an",
  "Optique : une monture par an, plafond 300 000 CDF",
  "IRM soumise à accord préalable au-delà de 2/an",
  "Observation : 2 mois grossesse, 3 mois chirurgie",
];
const CONFORT_EXCLUSIONS = [
  "Chambre individuelle privée",
  "Orthodontie et blanchiment dentaire",
  "Cancer (hors dépistage)",
  "Chirurgie esthétique",
];

const PREMIUM_BAREME = [
  { cat: "Soins de santé primaires", items: [["Consultation générale, examens et médicaments", "100%", "0%", "Ex : 15$ → 15$ / 0$"]] },
  { cat: "Consultations spécialisées", items: [["Toutes spécialités", "100%", "0%", ""]] },
  { cat: "Examens de laboratoire", items: [["Toutes analyses courantes & spécialisées", "100%", "0%", ""]] },
  { cat: "Imagerie médicale", items: [["Radio, échographie, scanner", "100%", "0%", ""], ["IRM, PET-scan", "90%", "10%", "Ex : 600$ → 540$ / 60$"]] },
  { cat: "Hospitalisation", items: [["Chambre privée, bloc, soins intensifs", "100%", "0%", ""], ["Évacuation sanitaire internationale", "100%", "0%", "Plafond 50 000 000 CDF/an"]] },
  { cat: "Grossesse et maternité", items: [["Suivi prénatal complet, accouchement, césarienne", "100%", "0%", ""]] },
  { cat: "Soins dentaires", items: [["Soins conservateurs, prothèses, couronnes", "80%", "20%", ""], ["Orthodontie", "60%", "40%", "Plafond 1 500 000 CDF"]] },
  { cat: "Soins ophtalmologiques", items: [["Consultation, cataracte, chirurgie réfractive", "100%", "0%", ""], ["Monture, verres, lentilles (1/an)", "100%", "0%", "Plafond 800 000 CDF"]] },
  { cat: "Chirurgies", items: [["Toutes, y compris reconstructrice post-traumatique", "100%", "0%", ""]] },
  { cat: "Maladies graves", items: [["Diabète, hypertension, suivi et médicaments", "100%", "0%", ""], ["Dialyse, oncologie", "90%", "10%", "Accord préalable"]] },
];
const PREMIUM_LIMITES = [
  "Évacuation sanitaire internationale max 50 000 000 CDF / an",
  "Oncologie & dialyse à 90% sur accord préalable",
  "Orthodontie max 1 500 000 CDF",
  "Aucun délai de carence pour soins courants",
];
const PREMIUM_EXCLUSIONS = [
  "Chirurgie purement esthétique non reconstructrice",
  "Actes de confort",
  "Cures thermales & médecines alternatives",
];

const FORMULES = [
  {
    id: "essentiel", nom: "Essentiel", primeBase: 700000, primeParBenef: 350000,
    tagline: "Soins courants et hospitalisation de base",
    garanties: { "Consultations & Pharmacie": 900000, "Hospitalisation": 4000000, "Dentaire": 200000, "Optique": 150000, "Maternité": 1000000 },
    taux: { "Consultations & Pharmacie": 80, "Hospitalisation": 90, "Dentaire": 50, "Optique": 40, "Maternité": 80 },
    bareme: ESSENTIEL_BAREME, limites: ESSENTIEL_LIMITES, exclusions: ESSENTIEL_EXCLUSIONS,
  },
  {
    id: "confort", nom: "Confort Famille", primeBase: 1200000, primeParBenef: 512500,
    tagline: "Couverture complète recommandée pour les familles",
    garanties: { "Consultations & Pharmacie": 1800000, "Hospitalisation": 8000000, "Dentaire": 500000, "Optique": 300000, "Maternité": 2500000 },
    taux: { "Consultations & Pharmacie": 90, "Hospitalisation": 100, "Dentaire": 60, "Optique": 50, "Maternité": 90 },
    bareme: CONFORT_BAREME, limites: CONFORT_LIMITES, exclusions: CONFORT_EXCLUSIONS,
    recommande: true,
  },
  {
    id: "premium", nom: "Premium", primeBase: 2200000, primeParBenef: 900000,
    tagline: "Chambre privée, évacuation sanitaire, plafonds élevés",
    garanties: { "Consultations & Pharmacie": 3000000, "Hospitalisation": 15000000, "Dentaire": 900000, "Optique": 500000, "Maternité": 4000000 },
    taux: { "Consultations & Pharmacie": 100, "Hospitalisation": 100, "Dentaire": 80, "Optique": 70, "Maternité": 100 },
    bareme: PREMIUM_BAREME, limites: PREMIUM_LIMITES, exclusions: PREMIUM_EXCLUSIONS,
  },
  {
    id: "lisanga", nom: "Lisanga 65$", primeBase: 182000, primeParBenef: 182000,
    tagline: "Mutuelle de santé — 65$/personne/an, adhésion familiale, prise en charge par acte",
    garanties: { "Consultations & Pharmacie": 700000, "Hospitalisation": 2500000, "Dentaire": 300000, "Optique": 200000, "Maternité": 900000 },
    taux: { "Consultations & Pharmacie": 90, "Hospitalisation": 90, "Dentaire": 90, "Optique": 90, "Maternité": 90 },
    bareme: LISANGA_BAREME, limites: LISANGA_LIMITES, exclusions: LISANGA_EXCLUSIONS,
    mutuelle: true,
  },
];

const DEMO_SESSION = {
  compteType: "principal",
  vueCompteId: "00",
  assure: {
    nom: "MUKENDI Jean-Paul",
    profession: "Ingénieur",
    email: "jeanpaul.mukendi@example.com",
    telephone: "+243 81 234 5678",
    sexe: "Masculin",
    groupeSanguin: "A+",
    allergies: "Pénicilline",
    pieceIdentite: "Carte d'électeur n° 12-234-5678",
    declarationSante: "Aucun antécédent majeur",
  },
  police: "SP-KIN-882104",
  contrat: "CTR-SP-2026-882104",
  formule: {
    id: "confort", nom: "Confort Famille", primeBase: 1200000, primeParBenef: 512500,
    tagline: "Couverture complète recommandée pour les familles",
    garanties: { "Consultations & Pharmacie": 1800000, "Hospitalisation": 8000000, "Dentaire": 500000, "Optique": 300000, "Maternité": 2500000 },
    taux: { "Consultations & Pharmacie": 90, "Hospitalisation": 100, "Dentaire": 60, "Optique": 50, "Maternité": 90 },
  },
  validite: "19/07/2026 — 19/07/2027",
  prime: 1712500,
  beneficiaires: [
    { id: "00", lien: "Assuré principal", nom: "MUKENDI Jean-Paul", carte: "SP-KIN-882104-00", grade: "agent", statutAffiliation: "Actif" },
  ],
  garanties: [
    { nom: "Consultations & Pharmacie", plafond: 1800000, consomme: 240000 },
    { nom: "Hospitalisation", plafond: 8000000, consomme: 150000 },
    { nom: "Dentaire", plafond: 500000, consomme: 0 },
    { nom: "Optique", plafond: 300000, consomme: 0 },
    { nom: "Maternité", plafond: 2500000, consomme: 0 },
  ],
  rdv: [],
  dossierMedical: {
    constantesVitales: { groupeSanguin: "A+", tension: "12/8" },
    allergies: ["Pénicilline"],
  },
  paiements: [
    { id: 1, label: "T1 — Janvier à Mars", montant: 85625, statut: "Payé" },
    { id: 2, label: "T2 — Avril à Juin", montant: 85625, statut: "Dû" },
    { id: 3, label: "T3 — Juillet à Septembre", montant: 85625, statut: "À venir" },
    { id: 4, label: "T4 — Octobre à Décembre", montant: 85625, statut: "À venir" },
  ],
};

const LISANGA_RESEAU = [
  { cat: "Réseau des hôpitaux", items: [
    { nom: "RIVIERA CLINIC", commune: "BANDALUNGWA", avenue: "AV.NSENGE N°5116", quartier: "MAKELELE" },
    { nom: "CM LA PATIENCE", commune: "BANDALUNGWA", avenue: "AV INGA REF", quartier: "KIMBONDO" },
    { nom: "CH LA BORNE", commune: "NGALIEMA", avenue: "AV MARINE 28", quartier: "UPN" },
    { nom: "CH BOLINGANI", commune: "NGALIEMA", avenue: "AV SONGE, 24363", quartier: "MUSEY" },
    { nom: "CLINIQUE DES ANGES", commune: "NGALIEMA", avenue: "ROUTE DE MATADI", quartier: "BINZA OZONE" },
    { nom: "YADAH CLINIC", commune: "GOMBE", avenue: "REVOLUTION 11", quartier: "GOMBE" },
    { nom: "CLINIC CAROLINE", commune: "GOMBE", avenue: "AV KAUKA", quartier: "DERIERE ROYALE" },
    { nom: "CH MUTUALISTE", commune: "KASAVUBU", avenue: "IKELEMBA, 52", quartier: "ANCIEN COMBATTANT" },
    { nom: "POLYCLINIQUE LIGHT", commune: "KIMBANSEKE", avenue: "BLV LUMUMBA", quartier: "Q3 ARRET VODACOM" },
    { nom: "CLINIQUE IK", commune: "KINTAMBO", avenue: "AV KWANGO N°3", quartier: "MAGASIN-KINTAMBO" },
    { nom: "CM GOMBELE", commune: "LEMBA", avenue: "AV IKUKU N°8", quartier: "RIGHINI" },
    { nom: "HOPITAL SAINT GABRIEL", commune: "LEMBA", avenue: "AV KILIDJA 6095/9", quartier: "GOMBELE" },
    { nom: "HGR SAINT JOSEPH", commune: "LIMETE", avenue: "BlV LUMUMBA 15 EME RUE", quartier: "15 EME RUE" },
    { nom: "CLINIC PROMEDIS/LIMETE", commune: "LIMETE", avenue: "10 èm RUE N° 22D", quartier: "INDUSTRIEL" },
    { nom: "MOYI MWA TONGO", commune: "LIMETE", avenue: "4EME RUE INDUSTRIEL", quartier: "LIMETE" },
    { nom: "CH BIEN ETRE", commune: "LIMETE", avenue: "AV CONGO 8", quartier: "SALONGO" },
    { nom: "CENTRE DE MEDECINE SPECIALISEE", commune: "LIMETE", avenue: "10EME RUE DALLIAS 582", quartier: "LIMETE RESIDENTIEL" },
    { nom: "CH MA PROVIDENCE", commune: "KALAMU", avenue: "LOTAS 1029", quartier: "NZAMBA AVOCAT" },
    { nom: "CLINIQUE DES ANGES VIP", commune: "LINGWALA", avenue: "Crois. Costa & Mushi", quartier: "BEAU VENT" },
    { nom: "BIOPHARM 2", commune: "LINGWALA", avenue: "AV KATO", quartier: "HUILERIE" },
    { nom: "CH EMILIA", commune: "MATETE", avenue: "KUNDA 1 N°16", quartier: "KUNDA 1" },
    { nom: "CLINIC PROMEDIS/ NGALIEMA", commune: "NGALIEMA", avenue: "AV MAKUTU N°2", quartier: "BINZA OZONE" },
    { nom: "CLINIQUE SAPHIR", commune: "KINTAMBO", avenue: "AV TRANSVERSALE 2", quartier: "JOLIE PARC" },
    { nom: "CH BONNE FOI", commune: "NSELE", avenue: "AV MBULU 44", quartier: "MPASA I" },
    { nom: "SAINT LUC DE DAIPAIN", commune: "N'SELE", avenue: "DAIPAIN", quartier: "DAIPAIN" },
    { nom: "CH MARIA ANTHONIA", commune: "N'SELE", avenue: "AV COLONEL NZADI 1", quartier: "NGAMABA/MPASA" },
    { nom: "CLINIC PROMEDIS/ N'SELE", commune: "N'SELE", avenue: "AV KAKENZA N°2", quartier: "COPELA-PLAZA" },
    { nom: "CLINIQUE OASIS DE VIE", commune: "BARUMBU", avenue: "6051 KABAMBARE", quartier: "BEAU MARCHE" },
    { nom: "CH DAMFER", commune: "N'SELE", avenue: "AV MAKELELE 107", quartier: "MPASA I" },
    { nom: "RENE DES HAES", commune: "MONT NGAFULA", avenue: "AV LUZIZILA 18", quartier: "KIMWENZA" },
    { nom: "CH SAINT GILD", commune: "MONT NGAFULA", avenue: "AV MONASTERE", quartier: "KINDELE" },
    { nom: "CS SAINT VINCENT", commune: "MONT NGAFULA", avenue: "AV LEMBI 5", quartier: "MBUDI" },
    { nom: "PROMEDIS CITE VERTE", commune: "MONT NGAFULA", avenue: "12 EME RUE", quartier: "CITE VERTE" },
  ]},
  { cat: "Structures de BDOM", items: [
    { nom: "CS NTOMBWA YA MARIA", commune: "MASINA", avenue: "LOLA II, 4", quartier: "SANS FIL" },
    { nom: "CH LISUNGI", commune: "MONT NGAFULA", avenue: "ROUTE DU LAC", quartier: "MPUMBU" },
    { nom: "CS MATER DEI", commune: "MONT NGAFULA", avenue: "ROUTE DE MATADI", quartier: "KIMBONDO" },
  ]},
  { cat: "Structures hyperspécialisées", items: [
    { nom: "CLINIQUE DENTAIRE LA CANINE", commune: "GOMBE", avenue: "AV DE LA JUSTICE 44", quartier: "GOMBE" },
    { nom: "CDM PHTALMOLOGIQUE ET DENTAIRE", commune: "GOMBE", avenue: "AV MONGALA 10", quartier: "GOMBE" },
    { nom: "HJ HOSPITALS EXAMENS", commune: "LIMETE", avenue: "1ERE RUE, INDUSTRIEL", quartier: "INDUSTRIEL" },
  ]},
  { cat: "Structures en cas de transfert", items: [
    { nom: "HGR SAINT JOSEPH", commune: "LIMETE", avenue: "BlV LUMUMBA 15 EME RUE", quartier: "MOTEL FIKIN" },
    { nom: "CLINIQUE BONDEKO", commune: "LIMETE", avenue: "AV YOLO N°7259", quartier: "LIMETE" },
    { nom: "HGR/PEDIATRIE KALEMBELEMBE", commune: "LINGWALA", avenue: "AV KALEMBELEMBE", quartier: "NGONDALOKOMBE" },
    { nom: "CH MONKOLE", commune: "MT NGAFULA", avenue: "AV MONKOLE", quartier: "" },
  ]},
];

const PRESTATAIRES = [
  { id: "p1", nom: "Pharmacie Bel Air", type: "Pharmacie conventionnée", ville: "Kinshasa · Gombe", distanceKm: 0.8, ouvert24h: true, tarif: "€" },
  { id: "p5", nom: "Pharmacie Kintambo", type: "Pharmacie conventionnée", ville: "Kinshasa · Kintambo", distanceKm: 6.7, ouvert24h: false, tarif: "€" },
  ...LISANGA_RESEAU[0].items.map((it, idx) => ({ id: `lis-${idx}`, nom: it.nom, type: "Hôpital conventionné", ville: `Kinshasa · ${it.commune}`, distanceKm: Math.round((1.2 + idx * 0.3) * 10) / 10, ouvert24h: true, tarif: "€€" }))
].sort((a, b) => a.distanceKm - b.distanceKm);

const SPECIALITES = ["Médecine générale", "Pédiatrie", "Gynécologie", "Cardiologie", "Dermatologie"];
const CONVENTION_TARIFS: Record<string, number> = {
  "Consultations & Pharmacie": 15000,
  "Hospitalisation": 150000,
  "Dentaire": 20000,
  "Optique": 100000,
  "Maternité": 400000,
};
const MOTIFS_CONSULTATION = ["Consultation générale", "Suivi médical / renouvellement", "Bilan ou contrôle", "Vaccination", "Urgence / douleur aiguë", "Autre"];
const SPECIALITE_MEDECINS: Record<string, { nom: string; creneaux: string[] }> = {
  "Médecine générale": { nom: "Dr. Kalonji Mbuyi", creneaux: ["08:00", "10:00", "14:00", "16:00"] },
  "Pédiatrie": { nom: "Dr. Aline Nzuzi", creneaux: ["09:00", "11:00", "15:00"] },
  "Gynécologie": { nom: "Dr. Odette Kabeya", creneaux: ["08:00", "09:00", "14:00", "17:00"] },
  "Cardiologie": { nom: "Dr. Patrick Tshibangu", creneaux: ["10:00", "11:00", "16:00"] },
  "Dermatologie": { nom: "Dr. Grace Ilunga", creneaux: ["09:00", "14:00", "15:00", "17:00"] },
};
const CRENEAUX = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const DOCUMENTS = [
  { id: "contrat", titre: "Contrat d'assurance santé", pages: 7, maj: "02/01/2026" },
  { id: "police", titre: "Police d'assurance santé", pages: 11, maj: "05/02/2026" },
];
const SOINS_COUVERTS = [
  { cat: "Soins ambulatoires", items: ["Consultation médecine générale", "Consultation spécialiste", "Analyses courantes", "Radio & Écho", "Petite chirurgie ambulatoire"] },
  { cat: "Hospitalisation", items: ["Frais de séjour (chambre standard)", "Bloc & Anesthésie", "Réanimation", "Urgence locale"] },
  { cat: "Maternité", items: ["Suivi prénatal", "Accouchement simple/césarienne", "Suivi post-natal"] },
];
const CONSO_MENSUELLE = [
  { mois: "Fév", montant: 32000 }, { mois: "Mar", montant: 18000 }, { mois: "Avr", montant: 65000 },
  { mois: "Mai", montant: 24000 }, { mois: "Juin", montant: 91000 }, { mois: "Juil", montant: 45000 },
];

function buildHistoriquePaiements() {
  return [
    { id: 1, date: "05/07/2026", montant: 650000, methode: "Mobile Money", reference: "TXN-778213", statut: "Réussi" },
    { id: 2, date: "04/04/2026", montant: 650000, methode: "Virement bancaire", reference: "TXN-661094", statut: "Réussi" },
    { id: 3, date: "06/01/2026", montant: 650000, methode: "Mobile Money", reference: "TXN-552087", statut: "Réussi" },
  ];
}
function buildMoyensPaiement() {
  return [
    { id: "mm1", type: "mobile", label: "Mobile Money — Vodacom M-Pesa", detail: "+243 81 000 00 00", parDefaut: true },
    { id: "cb1", type: "carte", label: "Carte bancaire — Visa", detail: "•••• •••• •••• 4821", parDefaut: false },
  ];
}
function buildCouvertures(session: any) {
  return [
    { id: "csu", nom: "CSU — Couverture Santé Universelle", numero: `CSU-${session.beneficiaires[0]?.carte?.slice(-6) || "000000"}`, couleur: C.navy, taux: "100% — maternité uniquement" },
    { id: "prive", nom: "Assurance Privée — NeoGTec HealthCare", numero: session.police, couleur: C.gold, taux: `${session.formule?.nom || ""} — 1er rang` },
    { id: "mutuelle", nom: "Mutuelle complémentaire", numero: `MUT-${session.contrat?.slice(-6) || "000000"}`, couleur: C.green, taux: "Solde partiel — 3e rang" },
  ];
}

const GRADES = [
  { id: "directeur", label: "Directeur / Cadre supérieur", taux: 90 },
  { id: "agent", label: "Agent / Employé", taux: 80 },
  { id: "dependant", label: "Dépendant (conjoint / enfant)", taux: 70 },
];
const tauxFor = (gradeId: string) => GRADES.find((g) => g.id === gradeId)?.taux ?? 70;
const gradeLabel = (gradeId: string) => GRADES.find((g) => g.id === gradeId)?.label ?? "Dépendant";

const CONDITIONS_SANTE = [
  { id: "diabete", label: "Diabète (type 1 ou 2)" },
  { id: "hta", label: "Hypertension artérielle" },
  { id: "vih", label: "VIH / SIDA" },
  { id: "cardiaque", label: "Maladie cardiaque" },
  { id: "renale", label: "Insuffisance rénale" },
];

const CASCADE = [
  { ordre: 1, payeur: "CSU — Couverture Santé Universelle", role: "Gratuité maternité — volet effectif à ce jour en RDC", taux: "100% (maternité uniquement)" },
  { ordre: 2, payeur: "Assurance NeoGTec", role: "Premier payeur autres soins, selon grade", taux: "90 / 80 / 70%" },
  { ordre: 3, payeur: "Mutuelle complémentaire", role: "Couvre le solde restant si applicable", taux: "Variable" },
];

function computeVentilation(montant: number | string, tauxAssurance: number, garantie: string) {
  const m = Number(montant) || 0;
  if (garantie === "Maternité") {
    return { csu: m, assurance: 0, mutuelle: 0, resteACharge: 0, csuMaternite: true };
  }
  const assurance = Math.round(m * (tauxAssurance / 100));
  const resteACharge = m - assurance;
  return { csu: 0, assurance, mutuelle: resteACharge, resteACharge };
}

const TAXE_RATE = 0.02;
const ANTECEDENTS_DEVIS = ["Diabète", "Hypertension", "Anémie", "Asthme", "Maladie cardiaque"];

function computeMajorationSante(age: number | string, antecedents: string[]) {
  let pct = 0;
  const a = Number(age) || 0;
  if (a >= 60) pct += 15;
  else if (a >= 45) pct += 8;
  else if (a >= 36) pct += 3;
  pct += (antecedents?.length || 0) * 5;
  return Math.min(pct, 40);
}

function computeDevis(formule: any, totalBenef: number, majorationPct = 0) {
  const primeBase = formule.primeBase;
  const primeBenef = totalBenef * formule.primeParBenef;
  const sousTotalBrut = primeBase + primeBenef;
  const majoration = Math.round(sousTotalBrut * (majorationPct / 100));
  const sousTotal = sousTotalBrut + majoration;
  const taxe = Math.round(sousTotal * TAXE_RATE);
  const primeTotale = sousTotal + taxe;
  const partEmployeur = Math.round(primeTotale * 0.8);
  const partSalarie = primeTotale - partEmployeur;
  return {
    primeBase, primeBenef, majoration, majorationPct, sousTotal, taxe, primeTotale, partEmployeur, partSalarie,
    mensuel: Math.round(primeTotale / 12), trimestriel: Math.round(primeTotale / 4),
  };
}

function buildEcheancier(partSalarieAnnuelle: number, dejaPayes = 0) {
  const parTrimestre = Math.round(partSalarieAnnuelle / 4);
  const trimestres = ["T1 — Janvier à Mars", "T2 — Avril à Juin", "T3 — Juillet à Septembre", "T4 — Octobre à Décembre"];
  return trimestres.map((label, i) => ({
    id: i + 1, label, montant: parTrimestre,
    statut: i < dejaPayes ? "Payé" : i === dejaPayes ? "Dû" : "À venir",
  }));
}

function buildNotifications() {
  return [
    { id: 1, type: "pec", titre: "PEC validée", detail: "Clinique Ngaliema — 45 000 CDF", date: "Aujourd'hui, 09:14", lue: false },
    { id: 2, type: "rdv", titre: "Rappel de RDV", detail: "Consultation demain à 09:00", date: "Hier, 18:00", lue: false },
    { id: 3, type: "plafond", titre: "Plafond proche", detail: "Garantie Dentaire à 80% consommée", date: "Il y a 3 jours", lue: true },
  ];
}
const NOTIF_ICON: Record<string, React.ComponentType<any>> = { pec: Stethoscope, rdv: CalendarCheck, plafond: AlertTriangle, paiement: Wallet, contrat: ShieldCheck };

const LANGUES = ["Français", "Lingala", "Swahili", "English"];
const POSITION_DEMO_ASSURE = { lat: -4.3224, lng: 15.3075 };

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
}

const CLE_TELECONSULTATIONS_PARTAGEES = "neogtec_eco_teleconsultations_v1";
const CLE_PEC_PARTAGEES = "neogtec_eco_pec_v1";
const CLE_MESSAGES_PREVENTION = "neogtec_eco_messages_prevention_v1";
const CLE_COMPTES_PARTAGES = "neogtec_eco_comptes_v1";
const CLE_MESSAGERIE_PARTAGEE = "neogtec_eco_messagerie_v1";
const CLE_RECLAMATIONS_PARTAGEES = "neogtec_eco_reclamations_v1";

const TYPES_RECLAMATION = ["Remboursement refusé", "Accueil clinique", "Délai de traitement", "Facturation", "Autre"];
const ETAPES_RECLAMATION = ["Reçue", "En cours d'analyse", "Décision rendue"];

async function publierTeleconsultationPartagee(entry: any) {
  try {
    const res = await window.storage.get(CLE_TELECONSULTATIONS_PARTAGEES, true);
    const liste = res?.value ? JSON.parse(res.value) : [];
    await window.storage.set(CLE_TELECONSULTATIONS_PARTAGEES, JSON.stringify([entry, ...liste]), true);
  } catch (e) {}
}

async function sauvegarderCanalPartage(cle: string, valeur: any) {
  try {
    await window.storage.set(cle, JSON.stringify(valeur), true);
  } catch (e) {}
}

async function chargerCanalPartage(cle: string) {
  try {
    const res = await window.storage.get(cle, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}

function whatsappChatUrl(numero: string, texte?: string) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${num}${texte ? `?text=${encodeURIComponent(texte)}` : ""}`;
}
function whatsappCallUrl(numero: string) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `whatsapp://call?phone=${num}`;
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function telechargerDocument(nomFichier: string, contexte: string) {
  downloadText(nomFichier, `Document : ${nomFichier}\n${contexte}\n\nCe fichier a été transmis via NeoGTec HealthCare.`);
}

/* ---------------------------------------------------------------
   SUB-COMPONENTS
------------------------------------------------------------------ */
function VentilationBar({ vent, montant }: { vent: any; montant: number }) {
  const total = montant || (vent.csu + vent.assurance + vent.mutuelle) || 1;
  const seg = (v: number, color: string) => <div style={{ width: `${(v / total) * 100}%`, background: color, height: "100%" }} />;
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-full" style={{ height: 8, background: C.line }}>
        {seg(vent.csu, C.navy2)}
        {seg(vent.assurance, C.gold)}
        {seg(vent.mutuelle, C.red)}
      </div>
      <div className="flex justify-between mt-1.5">
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.navy2 }}>● CSU {fmt(vent.csu)}</span>
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.gold }}>● Assurance {fmt(vent.assurance)}</span>
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.red }}>● Reste {fmt(vent.mutuelle)}</span>
      </div>
    </div>
  );
}

function Accordion({ title, right, children, defaultOpen = false }: { title: string; right?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5">
        <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
        <div className="flex items-center gap-2">{right}<ChevronDown size={16} color={C.sub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} /></div>
      </button>
      {open && <div className="px-4 pb-4" style={{ borderTop: `1px solid ${C.line}` }}>{children}</div>}
    </Card>
  );
}

function BaremeDetail({ bareme, limites, exclusions }: { bareme: any[]; limites: string[]; exclusions: string[] }) {
  return (
    <>
      {bareme.map((b, i) => (
        <div key={i} className="pt-3">
          <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2, marginBottom: 6 }}>{b.cat}</div>
          {b.items.map((row: any, j: number) => (
            <div key={j} className="py-1.5" style={{ borderBottom: j < b.items.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: sans, fontSize: 12, color: C.ink, maxWidth: "60%" }}>{row[0]}</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700 }}>{row[1]}{row[2] !== "—" && row[2] ? ` / ${row[2]}` : ""}</span>
              </div>
              {row[3] && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, fontStyle: "italic", marginTop: 1 }}>{row[3]}</div>}
            </div>
          ))}
        </div>
      ))}
      <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", margin: "12px 0 6px" }}>Limites et règles particulières</div>
      <ul className="space-y-1.5">{limites.map((l, i) => <li key={i} style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>· {l}</li>)}</ul>
      <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", margin: "12px 0 6px" }}>Soins non couverts</div>
      <ul className="space-y-1.5">{exclusions.map((e, i) => <li key={i} style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>– {e}</li>)}</ul>
    </>
  );
}

function SignaturePad({ onChange }: { onChange: (drawn: boolean, img: string) => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawingRef = React.useRef(false);
  const hasDrawnRef = React.useRef(false);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const start = (e: any) => {
    e.preventDefault();
    drawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: any) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = C.navy;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.stroke();
    hasDrawnRef.current = true;
  };
  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (hasDrawnRef.current && canvasRef.current) {
      onChange(true, canvasRef.current.toDataURL());
    }
  };
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    onChange(false, "");
  };

  return (
    <div>
      <canvas
        ref={canvasRef} width={320} height={140}
        style={{ width: "100%", height: 140, background: "white", borderRadius: 12, border: `1.5px dashed ${C.line}`, touchAction: "none", cursor: "crosshair" }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <button type="button" onClick={clear} className="mt-2 flex items-center gap-1.5" style={{ fontFamily: sans, fontSize: 11, color: C.sub, fontWeight: 700 }}><RefreshCw size={11} /> Effacer la signature</button>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="px-5 pt-3 pb-2">
      <div className="flex items-center gap-1.5">
        {STEP_TITLES.map((t, i) => <div key={i} className="flex-1 rounded-full" style={{ height: 4, background: i <= step ? C.gold : C.line, transition: "background .3s" }} />)}
      </div>
      <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 6 }}>Étape {step + 1} / {STEP_TITLES.length} — {STEP_TITLES[step]}</div>
    </div>
  );
}

const STEP_TITLES = ["Formule", "Identité", "Famille", "Documents", "Biométrie", "Prime", "Paiement", "Signature"];

function WizardNav({ onBack, onNext, nextLabel = "Continuer", disabled }: { onBack?: () => void; onNext: () => void; nextLabel?: string; disabled?: boolean }) {
  return (
    <div className="px-5 flex gap-3 mt-2 pb-2">
      {onBack && <button onClick={onBack} className="flex items-center justify-center rounded-xl" style={{ width: 46, height: 46, border: `1px solid ${C.line}`, background: "white" }}><ArrowLeft size={17} color={C.ink} /></button>}
      <button onClick={onNext} disabled={disabled} className="flex-1 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{ background: disabled ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5, height: 46 }}>
        {nextLabel} <ChevronRight size={15} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   WIZARDS, DASHBOARD, SECTIONS
------------------------------------------------------------------ */
function Onboarding({ onFinish, onCancel, initial }: { onFinish: (police: any) => void; onCancel: () => void; initial?: any }) {
  const [step, setStep] = useState(initial ? 3 : 0);
  const [formule, setFormule] = useState<any>(initial?.formule || null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [identite, setIdentite] = useState<any>(initial?.identite || { nom: "", prenom: "", naissance: "", sexe: "Masculin", profession: "", telephone: "", ville: "Kinshasa", adresse: "", email: "", grade: "agent", typePiece: "Carte d'électeur", numeroPieceIdentite: "", declarationSante: "", groupeSanguin: "", allergies: "" });
  const [identitePhoto, setIdentitePhoto] = useState("");
  const [famille, setFamille] = useState<any[]>(initial?.famille || []);
  const [addBenef, setAddBenef] = useState<any>({ lien: "Conjoint", nom: "", naissance: "", photo: "", sexe: "Féminin", lieuNaissance: "", telephone: "", adresse: "", groupeSanguin: "" });
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [faceFile, setFaceFile] = useState("");
  const [facesRegistered, setFacesRegistered] = useState<Record<string, boolean>>({});
  const [paiement, setPaiement] = useState({ methode: "mobile", telephone: "" });
  const [payStatus, setPayStatus] = useState("idle");
  const [signature, setSignature] = useState("");
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [accepte, setAccepte] = useState(false);
  const [signing, setSigning] = useState(false);
  const [police, setPolice] = useState<any>(null);

  const hasConjoint = famille.some((f) => f.lien === "Conjoint");
  const requiredDocs = [
    { key: "cni", label: "Pièce d'identité (CNI / Passeport)", required: true },
    { key: "attestation", label: "Attestation d'emploi ou de revenus", required: true },
    { key: "mariage", label: "Acte de mariage", required: hasConjoint },
    ...famille.flatMap((f) => [
      { key: `piece-${f.id}`, label: `Pièce d'identité de ${f.nom}`, required: true },
      { key: `naissance-${f.id}`, label: `Acte de naissance de ${f.nom}`, required: true },
    ]),
  ];
  const docsOk = requiredDocs.filter((d) => d.required).every((d) => docs[d.key]);
  const totalBenef = famille.length;
  const prime = formule ? formule.primeBase + totalBenef * formule.primeParBenef : 0;
  const partEmployeur = Math.round(prime * 0.8);
  const partSalarie = prime - partEmployeur;

  const addFamille = () => {
    if (!addBenef.nom || !addBenef.naissance || !addBenef.photo) return;
    setFamille([...famille, { ...addBenef, id: Date.now() }]);
    setAddBenef({ lien: "Conjoint", nom: "", naissance: "", photo: "", sexe: "Féminin", lieuNaissance: "", telephone: "", adresse: "", groupeSanguin: "" });
  };
  const removeFamille = (id: any) => setFamille(famille.filter((f) => f.id !== id));
  const payer = () => {
    setPayStatus("loading");
    setTimeout(() => setPayStatus("done"), 1300);
  };

  const signer = () => {
    if (!accepte || !signature.trim()) return;
    setSigning(true);
    setTimeout(() => {
      const num = Math.floor(100000 + Math.random() * 900000);
      const pol = `SP-KIN-${num}`, ctr = `CTR-SP-2026-${num}`;
      const today = new Date(), end = new Date(today);
      end.setFullYear(end.getFullYear() + 1);
      const dfmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      const iconFor = (l: string) => (l === "Conjoint" ? Heart : l === "Enfant" ? Baby : ShieldCheck);
      const genPin = () => String(Math.floor(1000 + Math.random() * 9000));
      const benefsFull = [
        { id: "00", lien: "Assuré principal", nom: `${identite.nom} ${identite.prenom}`.trim() || "Assuré", naissance: identite.naissance || "—", carte: `${pol}-00`, icon: ShieldCheck, grade: identite.grade, photo: identitePhoto, faceRegistered: !!facesRegistered.principal, statutAffiliation: "Actif" },
        ...famille.map((f, i) => ({ id: String(i + 1).padStart(2, "0"), lien: f.lien, nom: f.nom, naissance: f.naissance, carte: `${pol}-${String(i + 1).padStart(2, "0")}`, icon: iconFor(f.lien), grade: "dependant", photo: f.photo || "", faceRegistered: !!facesRegistered[f.id], statutAffiliation: "Actif", sexe: f.sexe, lieuNaissance: f.lieuNaissance, telephone: f.telephone, adresse: f.adresse, groupeSanguin: f.groupeSanguin, acces: { identifiant: f.telephone || `${pol}-${String(i + 1).padStart(2, "0")}`, pin: genPin() } })),
      ];
      const garantiesArr = Object.entries(formule.garanties).map(([nom, plafond]) => ({ nom, plafond: Number(plafond), consomme: 0 }));
      setPolice({
        compteType: "principal", vueCompteId: "00",
        assure: { nom: benefsFull[0].nom, profession: identite.profession, email: identite.email, ville: identite.ville, telephone: identite.telephone, sexe: identite.sexe, groupeSanguin: identite.groupeSanguin, allergies: identite.allergies, pieceIdentite: `${identite.typePiece} n° ${identite.numeroPieceIdentite}`, declarationSante: identite.declarationSante || "Aucun antécédent notable déclaré" },
        police: pol, contrat: ctr, formule, validite: `${dfmt(today)} — ${dfmt(end)}`, prime,
        beneficiaires: benefsFull, garanties: garantiesArr, histo: [], rdv: [], autresContrats: [],
        faceRegistered: !!faceFile, idMethode: faceFile ? "visage" : "qr",
        dossierMedical: { constantesVitales: {}, allergies: [], maladiesChroniques: [], traitementsEnCours: [], antecedentsChirurgicaux: [], antecedentsFamiliaux: [], visites: [] },
        paiements: buildEcheancier(partSalarie, 1), paiementsHistorique: [], moyensPaiement: [],
        notifications: [{ id: Date.now(), type: "contrat", titre: "Bienvenue chez NeoGTec HealthCare", detail: "Votre contrat est actif", date: "Aujourd'hui", lue: false }],
        fidelite: { moisSansSinistre: 0, bonus: 0, prochainPalier: 12, bonusProchainPalier: 5 },
        langue: "Français", verrouillage: false,
        reseauSoins: "Ouvert", renouvellementTacite: true, cascadeProfil: "Complet",
        delaisCarence: [{ guarantee: "Consultations & Pharmacie", jours: 0 }, { guarantee: "Hospitalisation", jours: 30 }, { guarantee: "Dentaire", jours: 60 }, { guarantee: "Optique", jours: 60 }, { guarantee: "Maternité", jours: 300 }],
      });
      setSigning(false);
      setStep(8);
    }, 1400);
  };

  if (step === 8 && police) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-10 flex flex-col items-center text-center">
          <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: C.greenSoft }}><CheckCircle2 size={32} color={C.green} /></div>
          <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, fontWeight: 700, marginTop: 16 }}>Contrat activé</div>
          <div style={{ fontFamily: sans, fontSize: 12.5, color: C.sub, marginTop: 4 }}>Votre police est effective immédiatement pour les urgences.<br />Un exemplaire du contrat vous a été envoyé par email.</div>
        </div>
        <div className="px-5 mt-5 space-y-2">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>N° de police</span><span style={{ fontFamily: mono, fontSize: 13, color: C.navy, fontWeight: 700 }}>{police.police}</span></div>
            <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Formule</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700 }}>{police.formule.nom}</span></div>
            <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Validité</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{police.validite}</span></div>
          </Card>
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Bénéficiaires inscrits ({police.beneficiaires.length})</div>
            {police.beneficiaires.map((b: any) => <div key={b.id} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{b.nom} <span style={{ color: C.sub }}>· {gradeLabel(b.grade)}</span></span><span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{b.carte}</span></div>)}
          </Card>
        </div>
        <div className="px-5 mt-4">
          <button onClick={() => onFinish(police)} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>Accéder à mon espace assuré <ChevronRight size={15} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
        <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Souscrire en ligne</div>
        <button onClick={onCancel} style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Annuler</button>
      </div>
      <ProgressBar step={step} />

      {step === 0 && (
        <>
          <div className="px-5 space-y-3">
            {FORMULES.map((f) => {
              const selected = formule?.id === f.id;
              const isOpen = expanded === f.id;
              return (
                <Card key={f.id} style={{ border: selected ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
                  <button onClick={() => setFormule(f)} className="w-full text-left p-4">
                    <div className="flex items-center justify-between">
                      <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.navy }}>{f.nom}</div>
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginTop: 2 }}>{f.tagline}</div>
                    <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginTop: 10 }}>À partir de <span style={{ fontFamily: mono, fontWeight: 700, color: C.gold }}>{fmt(f.primeBase)}</span>/an</div>
                  </button>
                  <button onClick={() => setExpanded(isOpen ? null : f.id)} className="w-full flex items-center justify-center gap-1.5 py-2" style={{ borderTop: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}>
                    {isOpen ? "Masquer le détail" : "Voir le détail complet"}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <BaremeDetail bareme={f.bareme} limites={f.limites} exclusions={f.exclusions} />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          <WizardNav onNext={() => setStep(1)} disabled={!formule} />
        </>
      )}

      {step === 1 && (
        <>
          <div className="px-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom *"><input style={inputStyle} value={identite.nom} onChange={(e) => setIdentite({ ...identite, nom: e.target.value })} placeholder="MUKENDI" /></Field>
              <Field label="Prénom *"><input style={inputStyle} value={identite.prenom} onChange={(e) => setIdentite({ ...identite, prenom: e.target.value })} placeholder="Jean-Paul" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date de naissance *"><input style={inputStyle} type="date" value={identite.naissance} onChange={(e) => setIdentite({ ...identite, naissance: e.target.value })} /></Field>
              <Field label="Sexe"><select style={inputStyle} value={identite.sexe} onChange={(e) => setIdentite({ ...identite, sexe: e.target.value })}><option>Masculin</option><option>Féminin</option></select></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone *"><input style={inputStyle} value={identite.telephone} onChange={(e) => setIdentite({ ...identite, telephone: e.target.value })} placeholder="+243 81 000 00 00" /></Field>
              <Field label="Ville *"><select style={inputStyle} value={identite.ville} onChange={(e) => setIdentite({ ...identite, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type de pièce"><select style={inputStyle} value={identite.typePiece} onChange={(e) => setIdentite({ ...identite, typePiece: e.target.value })}><option>Carte d'électeur</option><option>Passeport</option></select></Field>
              <Field label="N° pièce *"><input style={inputStyle} value={identite.numeroPieceIdentite} onChange={(e) => setIdentite({ ...identite, numeroPieceIdentite: e.target.value })} placeholder="12-234-5678" /></Field>
            </div>
          </div>
          <WizardNav onBack={() => setStep(0)} onNext={() => { setStep(2); setIdentitePhoto("https://i.pravatar.cc/200?img=51"); }} disabled={!identite.nom || !identite.prenom || !identite.naissance || !identite.telephone || !identite.ville || !identite.numeroPieceIdentite} />
        </>
      )}

      {step === 2 && (
        <>
          <div className="px-5 mt-2">
            {famille.length > 0 && (
              <div className="space-y-2 mb-3">
                {famille.map((f) => (
                  <Card key={f.id} className="p-3 flex items-center gap-3">
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{f.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{f.lien} · {f.naissance}</div></div>
                    <button onClick={() => removeFamille(f.id)}><Trash2 size={15} color={C.red} /></button>
                  </Card>
                ))}
              </div>
            )}
            <Card className="p-4 space-y-3">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Ajouter un membre de famille</div>
              <Field label="Lien"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option></select></Field>
              <Field label="Nom complet"><input style={inputStyle} value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} placeholder="Nom et prénom" /></Field>
              <Field label="Naissance"><input style={inputStyle} type="date" value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
              <button onClick={addFamille} className="w-full rounded-xl py-2 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter à la simulation</button>
            </Card>
          </div>
          <WizardNav onBack={() => setStep(1)} onNext={() => { setStep(3); setDocs({ cni: "CNI_Jean.pdf", attestation: "Attestation_ACME.pdf" }); }} />
        </>
      )}

      {step === 3 && (
        <>
          <div className="px-5">
            <div className="space-y-2">
              {requiredDocs.map((d) => (
                <Card key={d.key} className="p-3 flex items-center gap-3">
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{d.label}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: docs[d.key] ? C.green : C.sub }}>{docs[d.key] || "Requis"}</div></div>
                  <label className="flex items-center justify-center rounded-full cursor-pointer flex-shrink-0" style={{ width: 34, height: 34, background: C.navy }}><Upload size={14} color="white" /><input type="file" hidden onChange={(e) => setDocs({ ...docs, [d.key]: e.target.files?.[0]?.name || "Fichier_charge.pdf" })} /></label>
                </Card>
              ))}
            </div>
          </div>
          <WizardNav onBack={() => setStep(2)} onNext={() => { setStep(4); setFacesRegistered({ principal: true }); setFaceFile("selfie.jpg"); }} disabled={!docsOk} />
        </>
      )}

      {step === 4 && (
        <>
          <div className="px-5">
            {[{ key: "principal", nom: "Vous (Assuré principal)" }, ...famille.map((f) => ({ key: f.id, nom: f.nom }))].map((p) => {
              const registered = !!facesRegistered[p.key];
              return (
                <Card key={p.key} className="p-3 flex items-center gap-3 mb-2">
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{p.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: registered ? C.green : C.sub }}>{registered ? "Visage enregistré" : "Non enregistré"}</div></div>
                  <button onClick={() => setFacesRegistered({ ...facesRegistered, [p.key]: !registered })} className="rounded-full px-3 py-1.5" style={{ background: registered ? "white" : C.navy, color: registered ? C.navy : "white", border: registered ? `1px solid ${C.navy}` : "none", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>
                    {registered ? "Désactiver" : "Activer"}
                  </button>
                </Card>
              );
            })}
          </div>
          <WizardNav onBack={() => setStep(3)} onNext={() => setStep(5)} />
        </>
      )}

      {step === 5 && (
        <>
          <div className="px-5">
            <Card className="p-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase" }}>Prime annuelle estimée</div>
              <div style={{ fontFamily: serif, fontSize: 28, color: "white", marginTop: 4 }}>{fmt(prime)}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: "#B9C3D6", marginTop: 2 }}>{formule?.nom} · {1 + totalBenef} bénéficiaire(s)</div>
            </Card>
          </div>
          <WizardNav onBack={() => setStep(4)} onNext={() => setStep(6)} />
        </>
      )}

      {step === 6 && (
        <>
          <div className="px-5">
            {payStatus === "done" ? (
              <Card className="p-5 flex flex-col items-center gap-2 text-center">
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Paiement confirmé</div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{fmt(partSalarie)} reçus avec succès.</div>
              </Card>
            ) : payStatus === "loading" ? (
              <Card className="p-6 flex flex-col items-center gap-2"><Loader2 className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12 }}>Confirmation du paiement…</span></Card>
            ) : (
              <button onClick={payer} className="w-full rounded-xl py-3 mt-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}>Payer ma quote-part {fmt(partSalarie)}</button>
            )}
          </div>
          <WizardNav onBack={() => setStep(5)} onNext={() => setStep(7)} disabled={payStatus !== "done"} nextLabel="Continuer vers la signature" />
        </>
      )}

      {step === 7 && (
        <>
          <div className="px-5">
            <label className="flex items-start gap-2 mb-3"><input type="checkbox" checked={accepte} onChange={(e) => setAccepte(e.target.checked)} style={{ marginTop: 3 }} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Je certifie l'exactitude des informations fournies et j'accepte les CGU.</span></label>
            <Field label="Signature électronique — tapez votre nom complet"><input style={{ ...inputStyle, fontFamily: serif, fontSize: 16 }} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Nom et Prénom" /></Field>
            <div className="mt-3">
              <SignaturePad onChange={(drawn) => setSignatureDrawn(drawn)} />
            </div>
          </div>
          <div className="px-5 mt-3">
            <button onClick={signer} disabled={!accepte || !signature.trim() || !signatureDrawn || signing} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: (!accepte || !signature.trim() || !signatureDrawn) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>
              {signing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={15} color={C.gold} />}{signing ? "Activation du contrat…" : "Signer et activer mon contrat"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Devis({ onBack, onSouscrire, notify }: { onBack: () => void; onSouscrire?: (data: any) => void; notify: (m: string) => void }) {
  const [step, setStep] = useState(0);
  const [profil, setProfil] = useState({ nom: "", prenom: "", ville: "Kinshasa", profession: "", email: "", telephone: "", age: "", antecedents: [] as string[] });
  const [famille, setFamille] = useState<any[]>([]);
  const [addBenef, setAddBenef] = useState({ lien: "Conjoint", nom: "", naissance: "" });
  const [compareSel, setCompareSel] = useState<string | null>(null);
  const [ref, setRef] = useState<any>(null);

  const addFamille = () => {
    if (!addBenef.nom || !addBenef.naissance) return;
    setFamille([...famille, { ...addBenef, id: Date.now() }]);
    setAddBenef({ lien: "Conjoint", nom: "", naissance: "" });
  };
  const removeFamille = (id: any) => setFamille(famille.filter((f) => f.id !== id));
  const totalBenef = famille.length;
  const majorationPct = computeMajorationSante(profil.age, profil.antecedents);

  const choisirFormule = (f: any) => {
    const num = Math.floor(100000 + Math.random() * 900000);
    const today = new Date();
    const validite = new Date(today);
    validite.setDate(validite.getDate() + 30);
    const dfmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    setRef({ numero: `DEV-2026-${num}`, emission: dfmt(today), validite: dfmt(validite) });
    setCompareSel(f.id);
    setStep(3);
  };

  const formulaToSimulate = FORMULES.find((x) => x.id === compareSel) || FORMULES[1];
  const devis = computeDevis(formulaToSimulate, totalBenef, majorationPct);

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-1 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Faire un devis</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Simulation gratuite et sans engagement</div></div>
      </div>

      {step < 3 && (
        <div className="px-5 pt-3 pb-1">
          <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Étape {step + 1} / 3</div>
        </div>
      )}

      {step === 0 && (
        <>
          <div className="px-5 space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nom"><input style={inputStyle} value={profil.nom} onChange={(e) => setProfil({ ...profil, nom: e.target.value })} placeholder="MUKENDI" /></Field>
              <Field label="Prénom"><input style={inputStyle} value={profil.prenom} onChange={(e) => setProfil({ ...profil, prenom: e.target.value })} placeholder="Jean-Paul" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Âge"><input style={inputStyle} value={profil.age} onChange={(e) => setProfil({ ...profil, age: e.target.value.replace(/\D/g, "") })} placeholder="41" /></Field>
              <Field label="Profession"><input style={inputStyle} value={profil.profession} onChange={(e) => setProfil({ ...profil, profession: e.target.value })} placeholder="Ingénieur" /></Field>
            </div>
          </div>
          <WizardNav onNext={() => setStep(1)} disabled={!profil.nom || !profil.prenom} />
        </>
      )}

      {step === 1 && (
        <>
          <div className="px-5 mt-2">
            {famille.length > 0 && (
              <div className="space-y-2 mb-3">
                {famille.map((f) => (
                  <Card key={f.id} className="p-3 flex items-center gap-3">
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{f.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{f.lien}</div></div>
                    <button onClick={() => removeFamille(f.id)}><Trash2 size={15} color={C.red} /></button>
                  </Card>
                ))}
              </div>
            )}
            <Card className="p-4 space-y-3">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Ajouter un bénéficiaire</div>
              <Field label="Lien"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option></select></Field>
              <Field label="Nom complet"><input style={inputStyle} value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} placeholder="Nom" /></Field>
              <Field label="Date de naissance"><input style={inputStyle} type="date" value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
              <button onClick={addFamille} className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter</button>
            </Card>
          </div>
          <WizardNav onBack={() => setStep(0)} onNext={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <div className="px-5 mt-2 pb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {FORMULES.map((f) => (
              <button key={f.id} onClick={() => setCompareSel(f.id)} className="rounded-full px-3 py-2" style={{ background: compareSel === f.id ? C.navy : "white", color: compareSel === f.id ? "white" : C.ink, border: `1px solid ${compareSel === f.id ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
                {f.nom}
              </button>
            ))}
          </div>
          {compareSel && (() => {
            const f = FORMULES.find((x) => x.id === compareSel)!;
            const d = computeDevis(f, totalBenef, majorationPct);
            return (
              <Card className="p-4" style={{ border: `2px solid ${C.gold}` }}>
                <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.navy }}>{f.nom}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Prime annuelle TTC</div><div style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, color: C.gold }}>{fmt(d.primeTotale)}</div></div>
                </div>
                <button onClick={() => choisirFormule(f)} className="w-full rounded-xl py-2.5 mt-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>Obtenir le devis <ChevronRight size={14} /></button>
              </Card>
            );
          })()}
        </div>
      )}

      {step === 3 && devis && (
        <div className="px-5 mt-2 pb-4 space-y-3">
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Devis {ref?.numero}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Émis le {ref?.emission} · Valable jusqu'au {ref?.validite}</div>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between py-1"><span style={{ fontFamily: sans, fontSize: 12 }}>Prime totale annuelle TTC</span><span style={{ fontFamily: mono, fontSize: 15, fontWeight: 800, color: C.gold }}>{fmt(devis.primeTotale)}</span></div>
            <div className="flex justify-between py-1"><span style={{ fontFamily: sans, fontSize: 11 }}>Quote-part salarié</span><span style={{ fontFamily: mono, fontSize: 12, color: C.gold, fontWeight: 700 }}>{fmt(devis.partSalarie)}</span></div>
          </Card>
          {onSouscrire && (
            <button onClick={() => onSouscrire({ formule: formulaToSimulate, identite: profil, famille })} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}>
              Souscrire avec ce devis
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SignUp({ onDone, onGoSignIn }: { onDone: (data: any) => void; onGoSignIn: () => void }) {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", motDePasse: "", confirmation: "" });
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-14 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div>
        <div style={{ fontFamily: serif, fontSize: 20, color: "white", textAlign: "center", marginBottom: 20 }}>Créer mon compte</div>
        <div className="space-y-2.5">
          <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom complet" />
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" />
          <input style={inputStyle} type="password" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} placeholder="Mot de passe" />
          <input style={inputStyle} type="password" value={form.confirmation} onChange={(e) => setForm({ ...form, confirmation: e.target.value })} placeholder="Confirmer mot de passe" />
        </div>
      </div>
      <button onClick={() => onDone(form)} className="w-full rounded-xl py-3.5 mt-4" style={{ background: C.gold, color: C.navy, fontWeight: 800 }}>Créer mon compte</button>
    </div>
  );
}

function SignIn({ prefill, onDone, onGoSignUp }: { prefill: any; onDone: (session: any) => void; onGoSignUp: () => void }) {
  const [form, setForm] = useState({ identifiant: prefill?.email || "", motDePasse: "" });
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-14 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div>
        <div style={{ fontFamily: serif, fontSize: 20, color: "white", textAlign: "center", marginBottom: 20 }}>Connexion</div>
        <div className="space-y-2.5">
          <input style={inputStyle} value={form.identifiant} onChange={(e) => setForm({ ...form, identifiant: e.target.value })} placeholder="Email ou téléphone" />
          <input style={inputStyle} type="password" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} placeholder="Mot de passe" />
        </div>
      </div>
      <button onClick={() => onDone(DEMO_SESSION)} className="w-full rounded-xl py-3.5 mt-4" style={{ background: C.gold, color: C.navy, fontWeight: 800 }}>Se connecter</button>
    </div>
  );
}

function Welcome({ onSubscribe, onDemo, onDevis }: { onSubscribe: () => void; onDemo: () => void; onDevis: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-between px-6 pt-16 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div className="text-center text-white">
        <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700 }}>NeoGTec HealthCare</h2>
        <p className="text-sm text-slate-300 mt-2">Votre assurance santé, entièrement à distance</p>
      </div>
      <div className="w-full space-y-3">
        <button onClick={onSubscribe} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontWeight: 800 }}><Sparkles size={16} /> Souscrire en ligne</button>
        <button onClick={onDevis} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-white border border-white" style={{ fontFamily: sans, fontWeight: 700 }}><Calculator size={15} /> Devis gratuit</button>
        <button onClick={onDemo} className="w-full rounded-xl py-3 text-white" style={{ background: "rgba(255,255,255,0.1)", fontFamily: sans, fontWeight: 700 }}>Accéder directement</button>
      </div>
    </div>
  );
}

function Ring({ pct, size = 54, stroke = 6, color = C.gold }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(pct, 100) / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .8s ease" }} />
    </svg>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="absolute left-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{ bottom: 84, background: C.navy, color: "white", fontFamily: sans, fontSize: 13 }}>
      <CheckCircle2 size={16} color={C.gold} /><span>{message}</span>
    </div>
  );
}

function StatusPill({ statut }: { statut: string }) {
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: C.greenSoft, color: C.green, fontFamily: sans, fontSize: 11 }}>{statut}</span>;
}
function SectionLabel({ children }: { children: React.ReactNode }) { return <div className="px-5 pt-5 pb-2 font-bold uppercase tracking-widest" style={{ color: C.sub, fontFamily: sans, fontSize: 11 }}>{children}</div>; }
function Card({ children, style, className = "", onClick }: { children: React.ReactNode; style?: React.CSSProperties; className?: string; onClick?: () => void }) { return <div onClick={onClick} className={`rounded-2xl bg-white ${className}`} style={{ border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,38,68,0.04)", ...style }}>{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: "uppercase" }}>{label}</div>{children}</div>; }
const inputStyle = { width: "100%", fontFamily: sans, fontSize: 13, color: C.ink, background: C.ivory, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", outline: "none", boxSizing: "border-box" as const };

/* ---------------------------------------------------------------
   MAIN ACCUEIL VIEW
------------------------------------------------------------------ */
function Accueil({ go, session }: { go: (target: string, sub?: string) => void; notify: (m: string) => void; session: any; onRestart: () => void }) {
  const totalPlafond = session.garanties.reduce((s: number, g: any) => s + g.plafond, 0);
  const totalConso = session.garanties.reduce((s: number, g: any) => s + g.consomme, 0);
  const pct = totalPlafond ? Math.round((totalConso / totalPlafond) * 100) : 0;

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2">
        <div style={{ fontFamily: sans, fontSize: 13, color: C.sub }}>Bonjour,</div>
        <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, fontWeight: 700 }}>{session.assure.nom}</div>
      </div>
      <div className="px-5">
        <Card style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }} className="p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase" }}>Plafond global — {session.formule.nom}</div>
              <div style={{ fontFamily: serif, fontSize: 26, marginTop: 4 }}>{fmt(totalConso)}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6" }}>consommés sur {fmt(totalPlafond)}</div>
            </div>
            <div className="relative flex items-center justify-center"><Ring pct={pct} size={64} stroke={7} color={C.gold} /><span className="absolute text-xs" style={{ fontFamily: sans, fontWeight: 700 }}>{pct}%</span></div>
          </div>
        </Card>
      </div>

      <SectionLabel>Actions rapides</SectionLabel>
      <div className="px-5 grid grid-cols-2 gap-3">
        <button onClick={() => go("sinistres", "rdv")} className="text-left"><Card className="p-4" style={{ background: "#EEF1F8", border: "none" }}><CalendarCheck size={20} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 10 }}>Rendez-vous</div></Card></button>
        <button onClick={() => go("sinistres", "prest")} className="text-left"><Card className="p-4" style={{ background: "#F7EFE3", border: "none" }}><Navigation size={20} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 10 }}>Prestataires proches</div></Card></button>
        <button onClick={() => go("dossier")} className="text-left"><Card className="p-4" style={{ background: "#F2EDF6", border: "none" }}><ClipboardList size={20} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 10 }}>Mon dossier médical</div></Card></button>
        <button onClick={() => go("devis")} className="text-left"><Card className="p-4" style={{ background: "#EFF3EA", border: "none" }}><Calculator size={20} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 10 }}>Faire un devis</div></Card></button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   POLICE & CARTE
------------------------------------------------------------------ */
function Police({ session, go }: { notify: (m: string) => void; session: any; setSession: React.Dispatch<React.SetStateAction<any>>; go: (target: string, sub?: string) => void }) {
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Ma police</div><div style={{ fontFamily: mono, fontSize: 12, color: C.sub }}>{session.police}</div></div>
      </div>
      <div className="px-5 space-y-2">
        {session.garanties.map((g: any, i: number) => {
          const pct = g.plafond ? Math.round((g.consomme / g.plafond) * 100) : 0;
          return (
            <Card key={i} className="p-3 flex items-center gap-3">
              <Ring pct={pct} size={40} stroke={5} color={C.gold} />
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink }}>{g.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{fmt(g.consomme)} sur {fmt(g.plafond)}</div></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function QrPlaceholder() {
  return (
    <svg width={92} height={92} viewBox="0 0 92 92">
      <rect width={92} height={92} fill="white" />
      {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => ((r + c) % 3 === 0 || (r === 0 && c === 0) || (r === 0 && c === 7) || (r === 7 && c === 0)) && <rect key={`${r}-${c}`} x={r * 11} y={c * 11} width={10} height={10} fill={C.navy} />))}
    </svg>
  );
}

function CarteFlip({ session, go }: { session: any; setSession: React.Dispatch<React.SetStateAction<any>>; notify: (m: string) => void; go: (target: string, sub?: string) => void }) {
  const [flipped, setFlipped] = useState(false);
  const b = session.beneficiaires[0];

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Ma carte d'assuré</div>
      </div>
      <div onClick={() => setFlipped(!flipped)} style={{ perspective: 1000 }} className="cursor-pointer">
        <div style={{ position: "relative", width: "100%", height: 200, transition: "transform .6s", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 20, background: `linear-gradient(135deg, ${C.navy}, ${C.navy2} 60%, #0F1C33)`, padding: 20, color: "white" }}>
            <div className="flex items-center justify-between"><div style={{ fontFamily: sans, fontWeight: 800, fontSize: 14 }}>NEOGTEC HEALTHCARE</div></div>
            <div style={{ marginTop: 22, fontFamily: serif, fontSize: 17 }}>{b.nom}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: "#C7D0DF" }}>{b.lien}</div>
            <div className="flex items-center justify-between" style={{ marginTop: 18 }}>
              <div><div style={{ fontFamily: sans, fontSize: 9, color: "#9AA6BC" }}>N° Carte</div><div style={{ fontFamily: mono, fontSize: 13 }}>{b.carte}</div></div>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 20, background: "white", border: `1px solid ${C.line}`, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <QrPlaceholder />
            <div style={{ fontFamily: mono, fontSize: 10, color: C.gold, marginTop: 6 }}>{b.carte}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SINISTRES
------------------------------------------------------------------ */
function Sinistres({ notify, session, setSession, sub, setSub, go }: { notify: (m: string) => void; session: any; setSession: React.Dispatch<React.SetStateAction<any>>; sub: string; setSub: (s: string) => void; go: (target: string, sub?: string) => void }) {
  const [rdvForm, setRdvForm] = useState({ type: "Présentiel", cible: PRESTATAIRES[0].nom, specialite: SPECIALITES[0], beneficiaireId: session.beneficiaires[0]?.id, date: "", heure: "", garantie: session.garanties[0]?.nom || "", motif: MOTIFS_CONSULTATION[0], premiereVisite: false, notes: "", rappel: "1h", montantEstime: String(CONVENTION_TARIFS[session.garanties[0]?.nom] || "") });
  const [rdvStep, setRdvStep] = useState("form");

  const submitRdv = () => {
    if (!rdvForm.date || !rdvForm.heure) return;
    setRdvStep("loading");
    setTimeout(() => {
      const medecin = SPECIALITE_MEDECINS[rdvForm.specialite];
      const beneficiaire = session.beneficiaires.find((b: any) => b.id === rdvForm.beneficiaireId);
      const entry = {
        id: Date.now(), type: rdvForm.type,
        cible: rdvForm.type === "Présentiel" ? rdvForm.cible : `${rdvForm.specialite} — ${medecin?.nom || ""}`,
        beneficiaire: beneficiaire?.nom, date: rdvForm.date, heure: rdvForm.heure, statut: "Confirmé"
      };
      setSession({ ...session, rdv: [entry, ...(session.rdv || [])] });
      setRdvStep("done");
      notify("Rendez-vous programmé !");
    }, 1000);
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Rendez-vous & Soins</div></div>
      </div>
      <div className="px-5 flex gap-2 mb-3">
        <button onClick={() => setSub("rdv")} className="flex-1 rounded-full py-1.5" style={{ background: sub === "rdv" ? C.navy : "white", color: sub === "rdv" ? "white" : C.ink, border: `1px solid ${C.line}` }}>Prendre RDV</button>
        <button onClick={() => setSub("prest")} className="flex-1 rounded-full py-1.5" style={{ background: sub === "prest" ? C.navy : "white", color: sub === "prest" ? "white" : C.ink, border: `1px solid ${C.line}` }}>Prestataires</button>
      </div>

      <div className="px-5">
        {sub === "rdv" && (
          <>
            {rdvStep === "form" && (
              <Card className="p-4 space-y-3">
                <Field label="Bénéficiaire"><select style={inputStyle} value={rdvForm.beneficiaireId} onChange={(e) => setRdvForm({ ...rdvForm, beneficiaireId: e.target.value })}>{session.beneficiaires.map((b: any) => <option key={b.id} value={b.id}>{b.nom}</option>)}</select></Field>
                <Field label="Spécialité/Établissement"><select style={inputStyle} value={rdvForm.cible} onChange={(e) => setRdvForm({ ...rdvForm, cible: e.target.value })}>{PRESTATAIRES.map((p) => <option key={p.id} value={p.nom}>{p.nom} — {p.distanceKm} km</option>)}</select></Field>
                <Field label="Date"><input type="date" style={inputStyle} value={rdvForm.date} onChange={(e) => setRdvForm({ ...rdvForm, date: e.target.value })} /></Field>
                <Field label="Heure"><select style={inputStyle} value={rdvForm.heure} onChange={(e) => setRdvForm({ ...rdvForm, heure: e.target.value })}><option value="">Sélectionner</option>{CRENEAUX.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
                <button onClick={submitRdv} className="w-full rounded-xl py-3 mt-1" style={{ background: C.navy, color: "white", fontWeight: 750 }}>Confirmer</button>
              </Card>
            )}
            {rdvStep === "loading" && <Card className="p-6 text-center">Réservation du créneau…</Card>}
            {rdvStep === "done" && <Card className="p-6 text-center">✓ Rendez-vous programmé et synchronisé.</Card>}
          </>
        )}

        {sub === "prest" && (
          <div className="space-y-2">
            {PRESTATAIRES.map((p) => (
              <Card key={p.id} className="p-3.5">
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{p.nom}</div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{p.type} · {p.ville}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: C.gold, marginTop: 4 }}>{p.distanceKm} km</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   DOSSIER MEDICAL
------------------------------------------------------------------ */
function DossierMedical({ session, onBack }: { session: any; onBack: () => void }) {
  const d = session.dossierMedical || {};
  const cv = d.constantesVitales || {};

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Dossier médical</div></div>
      </div>
      <div className="px-5 space-y-3">
        <Card className="p-4 grid grid-cols-2 gap-3 text-center">
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Groupe Sanguin</div><div style={{ fontFamily: mono, fontSize: 14, fontWeight: 700 }}>{cv.groupeSanguin || "O+"}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Tension</div><div style={{ fontFamily: mono, fontSize: 14, fontWeight: 700 }}>{cv.tension || "12/8"}</div></div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAIEMENT
------------------------------------------------------------------ */
function Paiement({ session, setSession, notify, go }: { session: any; setSession: React.Dispatch<React.SetStateAction<any>>; notify: (m: string) => void; go: (target: string, sub?: string) => void }) {
  const paiements = session.paiements || [];
  const due = paiements.find((p: any) => p.statut === "Dû");

  const payer = () => {
    if (!due) return;
    setSession({
      ...session,
      paiements: paiements.map((p: any) => (p.id === due.id ? { ...p, statut: "Payé" } : p))
    });
    notify("Facture réglée !");
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Cotisations</div></div>
      </div>
      <div className="px-5">
        {due ? (
          <Card className="p-4 space-y-3 text-center">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Prochaine échéance due</div>
            <div style={{ fontFamily: serif, fontSize: 24, color: C.navy, fontWeight: 700 }}>{fmt(due.montant)}</div>
            <button onClick={payer} className="w-full rounded-xl py-3" style={{ background: C.gold, color: C.navy, fontWeight: 800 }}>Régulariser par Mobile Money</button>
          </Card>
        ) : (
          <Card className="p-6 text-center">✓ Toutes vos cotisations sont à jour</Card>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ASSISTANCE
------------------------------------------------------------------ */
function Assistance({ session, go }: { notify: (m: string) => void; session: any; go: (target: string, sub?: string) => void }) {
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Assistance</div></div>
      </div>
      <div className="px-5 space-y-2">
        <Card className="p-4">
          <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Centre de support PEC 24/7</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: C.sub, marginTop: 4 }}>+243 81 234 5678</div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   APP ENTRY POINT
------------------------------------------------------------------ */
export const MobileAssureApp: React.FC = () => {
  const [view, setView] = useState("welcome");
  const [signupData, setSignupData] = useState<any>(null);
  const [session, setSession] = useState<any>(DEMO_SESSION);
  const [tab, setTab] = useState("accueil");
  const [sinistresSub, setSinistresSub] = useState("rdv");
  const [subScreen, setSubScreen] = useState<string | null>(null);
  const [devisPrefill, setDevisPrefill] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const notify = (m: string) => setToast(m);

  const startApp = (s: any) => { setSession(s); setView("app"); setTab("accueil"); setDevisPrefill(null); notify("Bienvenue dans votre espace assuré"); };
  const passerALaSouscription = (data: any) => { setDevisPrefill(data); setView("onboarding"); };
  const logout = () => { setSession(null); setSubScreen(null); setTab("accueil"); setView("welcome"); };

  const go = (target: string, sub?: string) => {
    if (["dossier", "devis"].includes(target)) { setSubScreen(target); return; }
    setSubScreen(null);
    setTab(target);
    if (target === "sinistres" && sub) setSinistresSub(sub);
  };

  const tabs = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "police", label: "Police", icon: FileText },
    { id: "carte", label: "Carte", icon: CreditCard },
    { id: "sinistres", label: "Soins", icon: Stethoscope },
    { id: "paiement", label: "Paiement", icon: Wallet },
    { id: "assistance", label: "Aide", icon: MessageCircle },
  ];

  return (
    <div className="flex items-center justify-center min-h-[500px]" style={{ fontFamily: sans }}>
      <div className="relative overflow-hidden" style={{ width: 390, height: 800, background: C.ivory, borderRadius: 44, boxShadow: "0 30px 60px rgba(20,38,68,0.25)", border: "10px solid #0B0F17" }}>
        
        <div className="overflow-y-auto" style={{ height: view === "app" ? 800 - 78 : 800 }}>
          {view === "signup" && <SignUp onDone={(data) => { setSignupData(data); setView("signin"); }} onGoSignIn={() => setView("signin")} />}
          {view === "signin" && <SignIn prefill={signupData} onDone={(s) => startApp(s || DEMO_SESSION)} onGoSignUp={() => setView("signup")} />}
          {view === "welcome" && <Welcome onSubscribe={() => setView("onboarding")} onDemo={() => startApp(DEMO_SESSION)} onDevis={() => setView("devis")} />}
          {view === "devis" && <Devis notify={notify} onBack={() => setView("welcome")} onSouscrire={passerALaSouscription} />}
          {view === "onboarding" && <Onboarding onFinish={startApp} onCancel={() => setView("welcome")} initial={devisPrefill} />}
          
          {view === "app" && subScreen === "dossier" && <DossierMedical session={session} onBack={() => setSubScreen(null)} />}
          {view === "app" && subScreen === "devis" && <Devis notify={notify} onBack={() => setSubScreen(null)} />}
          
          {view === "app" && !subScreen && tab === "accueil" && <Accueil go={go} notify={notify} session={session} onRestart={logout} />}
          {view === "app" && !subScreen && tab === "police" && <Police notify={notify} session={session} setSession={setSession} go={go} />}
          {view === "app" && !subScreen && tab === "carte" && <CarteFlip session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && !subScreen && tab === "sinistres" && <Sinistres notify={notify} session={session} setSession={setSession} sub={sinistresSub} setSub={setSinistresSub} go={go} />}
          {view === "app" && !subScreen && tab === "paiement" && <Paiement session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && !subScreen && tab === "assistance" && <Assistance notify={notify} session={session} go={go} />}
        </div>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}

        {view === "app" && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-white border-t border-slate-200" style={{ height: 78, paddingBottom: 14 }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => go(t.id)} className="flex flex-col items-center gap-1">
                <t.icon size={20} color={tab === t.id && !subScreen ? C.navy : C.sub} strokeWidth={tab === t.id && !subScreen ? 2.4 : 2} />
                <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: tab === t.id && !subScreen ? 700 : 500, color: tab === t.id && !subScreen ? C.navy : C.sub }}>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
