import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Home, FileText, CreditCard, Stethoscope, MessageCircle, ChevronRight,
  ChevronDown, ChevronUp, Download, Upload, Check, Clock, Phone, Mail,
  MapPin, ShieldCheck, AlertCircle, X, Send, Trash2, ArrowLeft,
  CheckCircle2, Loader2, Baby, Heart, Smartphone, Landmark,
  PenLine, Sparkles, UserPlus, UserCheck, Camera, ScanFace, Navigation,
  Calendar, Video, ClipboardList, Building2, Route, Fingerprint,
  CalendarCheck, Percent, Layers, Pill, Syringe, Ruler,
  Calculator, FilePlus, Share2, RefreshCw, BadgePercent, CalendarClock,
  Bell, Settings, Globe, Lock, LogOut, Star, TrendingDown, Gift, Wallet,
  Receipt, AlertTriangle, MessageSquare, Award, ChevronLeft, Thermometer,
  HeartPulse, Scissors, FlaskConical, Paperclip, Dna, Link2, Users2,
  FileDown, Activity, TrendingUp, ListChecks, UserRoundCheck, Wifi, WifiOff,
  MessageSquarePlus, UserCog, Ban, Search, SlidersHorizontal, Building, ScanLine, BadgeCheck,
  Mic, MicOff, VideoOff, PhoneOff, XCircle, PanelLeftClose, PanelLeftOpen, Eye, EyeOff, KeyRound,
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
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ") + " CDF";

/* ---------------------------------------------------------------
   PRODUIT — formules, barème, cascade, grades
------------------------------------------------------------------ */
const CATEGORIES = ["Consultations & Pharmacie", "Hospitalisation", "Dentaire", "Optique", "Maternité"];

/* ---------------------------------------------------------------
   BARÈME SPÉCIFIQUE — Mutuelle Lisanga (fidèle au document source)
   Cotisation 65$/personne/an — unité d'adhésion : la famille/le ménage
------------------------------------------------------------------ */
const LISANGA_BAREME = [
  {
    cat: "Soins de santé primaires (jusqu'à 5 épisodes/an, 50% dès le 6ᵉ épisode)", items: [
      ["Consultation générale, examens courants (sang, selles, urines, frottis) et médicaments génériques", "90%", "10%", "Ex : paludisme simple 25$ → 22,5$ / 2,5$"],
    ]
  },
  {
    cat: "Consultations spécialisées", items: [
      ["Médecine interne, Gynécologie, Pédiatrie, Chirurgie, Cardiologie, Ophtalmologie, Dentisterie, Dermatologie, Neurologie, Psychiatrie, Kinésithérapie, ORL", "90%", "10%", "Ex : cardiologie 30$ → 27$ / 3$"],
    ]
  },
  {
    cat: "Examens de laboratoire spécialisés", items: [
      ["Urée, Créatinine, Cholestérol, Lipides, VDRL, LDL, Acide urique, T4, TSH, FSH, LH, PSA, Hémoculture, Uroculture, Coproculture, Ziehl", "60%", "40%", "Ex : cholestérol 30$ → 18$ / 12$"],
    ]
  },
  {
    cat: "Médicaments spécialisés", items: [
      ["Médicaments hors génériques", "60%", "40%", "Ex : Augmentin 20cp 20$ → 12$ / 8$"],
    ]
  },
  {
    cat: "Kinésithérapie (5 séances/mois)", items: [
      ["Séances de rééducation", "90%", "10%", "Ex : 50$ → 45$ / 5$"],
    ]
  },
  {
    cat: "Hospitalisation (3 fois/an, 50% dès la 4ᵉ fois)", items: [
      ["Chambre commune ≤10 jours, tournée médecin généraliste/spécialiste, soins infirmiers, labo, médicaments", "90%", "10%", "Ex : paludisme grave 100$ → 90$ / 10$"],
    ]
  },
  {
    cat: "Imagerie médicale", items: [
      ["Radiologie de routine (membres, colonne, abdomen, thorax, sinus)", "90%", "10%", "Ex : thorax 20$ → 18$ / 2$"],
      ["Radiologie spécialisée (OED, lavement baryté, UIV)", "60%", "40%", "Ex : lavement baryté 150$ → 90$ / 60$"],
      ["Échographie ordinaire (pelvienne, abdominale, masse)", "90%", "10%", "Ex : écho pelvienne 20$ → 18$ / 2$"],
      ["Échographie spécialisée (Doppler)", "60%", "40%", "Ex : Doppler 100$ → 60$ / 40$"],
      ["Mammographie, thyroïdienne, oculaire, vésico-prostatique, EEG, ECG, CT Scanner cérébral", "60%", "40%", "Ex : CT cérébral 180$ → 108$ / 72$"],
    ]
  },
  {
    cat: "Accidents de la route & urgences", items: [
      ["Stabilisation, investigation (hors cause alcoolique/rixe)", "90%", "10%", ""],
    ]
  },
  {
    cat: "Grossesse et maternité", items: [
      ["Consultation prénatale (4 CPN, 1 écho, examens, médicaments)", "90%", "10%", ""],
      ["Accouchement eutocique", "90%", "10%", "100$ → 90$ / 10$"],
      ["Accouchement compliqué", "90%", "10%", "150$ → 135$ / 15$"],
      ["Césarienne", "90%", "10%", "300$ → 270$ / 30$"],
    ]
  },
  {
    cat: "Services pédiatriques", items: [
      ["Soins postnataux, urgences, soins intensifs, vaccination de routine, CPS, consultations", "90%", "10%", ""],
    ]
  },
  {
    cat: "Soins dentaires", items: [
      ["Consultation, douleur, extraction simple, amalgame, composite, détartrage, endodontie, plombage", "90%", "10%", ""],
    ]
  },
  {
    cat: "Soins ophtalmologiques", items: [
      ["Consultation, infection primaire, examens de routine, verres optiques, chirurgie œil unilatérale", "90%", "10%", ""],
      ["Échographie oculaire, réfraction automatique", "60%", "40%", ""],
      ["Monture de lunettes", "Prise en charge unique à vie de 20$", "—", ""],
    ]
  },
  {
    cat: "Pathologies chroniques", items: [
      ["Hypertension, diabète, asthme, ulcère gastroduodénal, arthrite, épilepsie, angine de poitrine, counseling", "90%", "10%", ""],
      ["Drépanocytose (crises uniquement)", "90%", "10%", ""],
      ["Infarctus du myocarde (urgence uniquement)", "90%", "10%", ""],
      ["Tuberculose", "Programme national", "—", ""],
    ]
  },
  {
    cat: "Chirurgies", items: [
      ["Mineures (suture, circoncision, abcès, furoncle, ponction, pansement)", "90%", "10%", ""],
      ["Intermédiaires (appendicectomie, cure herniaire, kystectomie, césarienne)", "90%", "10%", "Ex : appendicectomie 250$ → 225$ / 25$"],
      ["Majeures (myomectomie, laparotomie, prostatectomie, amygdalectomie)", "50%", "50%", "Ex : myomectomie 700$ → 350$ / 350$"],
    ]
  },
  {
    cat: "Prise en charge du VIH", items: [
      ["Dépistage et counseling", "90%", "10%", ""],
      ["Traitement", "Programme national", "—", ""],
    ]
  },
  { cat: "Transfusion sanguine (1 unité)", items: [["Transfusion", "90%", "10%", ""]] },
  { cat: "Décès", items: [["Conservation et mise en bière (3 jours, hors formolisation)", "90%", "10%", "80$ → 72$ / 8$"]] },
];

const LISANGA_LIMITES = [
  "Soins de santé primaires : 5 épisodes/an à 90%, puis 50% dès le 6ᵉ épisode",
  "Hospitalisation : 3 fois/an à 90%, puis 50% dès la 4ᵉ fois",
  "Kinésithérapie : plafonnée à 5 séances par mois",
  "Monture de lunettes : une seule prise en charge à vie (20$)",
  "Période d'observation : 3 mois pour la grossesse/l'accouchement, 6 mois pour la chirurgie",
  "Unité d'adhésion : la famille ou le ménage — cotisation de 65$ par personne et par an",
];

const LISANGA_EXCLUSIONS = [
  "Hospitalisation en chambre privée et frais de nourriture",
  "Cancer et traitement du cancer",
  "Check-up médical de routine (hors laboratoire), contrôle médical",
  "HSG, CT Scanner abdominal (et autres, hors cérébral), IRM",
  "Accouchement par péridurale",
  "Implants et prothèses, traitement orthodontique, blanchiment dentaire, immobilisation",
  "Dialyse (insuffisance rénale), insuffisance hépatique, cirrhose",
  "Parkinson, psychose, dépression",
  "Chirurgie majeure complexe (neurochirurgie, ostéosynthèse, prothèses, hystérectomie, thyroïdectomie, chirurgie cardio-vasculaire, transplantation d'organe)",
  "Examens cliniques de routine hors laboratoire (taille, poids, IMC, tension, signes vitaux)",
  "Ambulance",
  "Tout autre soin ne figurant pas dans le paquet",
];

/* ---------------------------------------------------------------
   BARÈMES DÉTAILLÉS — Essentiel / Confort Famille / Premium
   Même logique que Lisanga : catégories, taux assurance/patient,
   limites de fréquence et spécialités, exemples chiffrés.
------------------------------------------------------------------- */
const ESSENTIEL_BAREME = [
  {
    cat: "Soins de santé primaires (illimité)", items: [
      ["Consultation générale, examens courants et médicaments génériques", "80%", "20%", "Ex : paludisme simple 15$ → 12$ / 3$"],
    ]
  },
  {
    cat: "Consultations spécialisées (6 consultations/an)", items: [
      ["Médecine interne, Gynécologie, Pédiatrie, Cardiologie, ORL, Dermatologie", "80%", "20%", "Ex : cardiologie 25$ → 20$ / 5$"],
    ]
  },
  {
    cat: "Examens de laboratoire", items: [
      ["Analyses courantes (NFS, glycémie, selles, urines)", "80%", "20%", "Ex : bilan courant 15$ → 12$ / 3$"],
      ["Analyses spécialisées (hormonaux, sérologies, marqueurs)", "50%", "50%", "Ex : bilan thyroïdien 25$ → 12,5$ / 12,5$"],
    ]
  },
  {
    cat: "Imagerie médicale", items: [
      ["Radiologie et échographie de routine", "70%", "30%", "Ex : radio thorax 15$ → 10,5$ / 4,5$"],
      ["Imagerie lourde (scanner, IRM)", "Non couvert", "100%", ""],
    ]
  },
  {
    cat: "Hospitalisation (chambre commune, 15 jours/an)", items: [
      ["Séjour, soins infirmiers, médicaments, tournée médicale", "90%", "10%", "Ex : hospitalisation 100$ → 90$ / 10$"],
    ]
  },
  {
    cat: "Grossesse et maternité", items: [
      ["Consultations prénatales (3 CPN) et accouchement voie basse", "80%", "20%", "Ex : accouchement 80$ → 64$ / 16$"],
      ["Césarienne", "70%", "30%", "Ex : césarienne 300$ → 210$ / 90$"],
    ]
  },
  {
    cat: "Soins dentaires", items: [
      ["Soins conservateurs (détartrage, plombage, extraction simple)", "50%", "50%", "Ex : détartrage 20$ → 10$ / 10$"],
      ["Prothèses et actes lourds", "Non couvert", "100%", ""],
    ]
  },
  {
    cat: "Soins ophtalmologiques", items: [
      ["Consultation et examens de routine", "70%", "30%", ""],
      ["Monture et verres (1 prise en charge / 2 ans)", "40%", "60%", "Plafond 100 000 CDF"],
    ]
  },
  {
    cat: "Chirurgies", items: [
      ["Mineures (suture, abcès, circoncision)", "80%", "20%", ""],
      ["Majeures", "40%", "60%", "Ex : appendicectomie 250$ → 100$ / 150$"],
    ]
  },
  {
    cat: "Pathologies chroniques", items: [
      ["Hypertension, diabète, asthme — suivi et médicaments", "80%", "20%", "Plafond mensuel médicaments : 30 000 CDF"],
    ]
  },
];
const ESSENTIEL_LIMITES = [
  "Consultations spécialisées : plafonnées à 6 par an, au-delà tarif plein",
  "Hospitalisation : chambre commune uniquement, 15 jours par an maximum",
  "Optique : une seule prise en charge de monture tous les 2 ans",
  "Période d'observation : 3 mois pour la grossesse, 6 mois pour la chirurgie programmée",
  "Pathologies chroniques : plafond mensuel de 30 000 CDF pour les médicaments",
];
const ESSENTIEL_EXCLUSIONS = [
  "Chambre privée et frais de confort hospitalier",
  "Imagerie lourde (scanner, IRM) et chirurgie majeure complexe",
  "Prothèses dentaires, orthodontie, blanchiment",
  "Cancer et traitements oncologiques",
  "Chirurgie esthétique et de confort",
];

const CONFORT_BAREME = [
  {
    cat: "Soins de santé primaires (illimité)", items: [
      ["Consultation générale, examens courants et médicaments", "90%", "10%", "Ex : consultation 15$ → 13,5$ / 1,5$"],
    ]
  },
  {
    cat: "Consultations spécialisées (illimité)", items: [
      ["Toutes spécialités : médecine interne, gynécologie, pédiatrie, cardiologie, ophtalmologie, dermatologie, neurologie, ORL, psychiatrie", "90%", "10%", "Ex : neurologie 35$ → 31,5$ / 3,5$"],
    ]
  },
  {
    cat: "Examens de laboratoire (courants et spécialisés)", items: [
      ["Toutes analyses, y compris hormonales et sérologiques", "90%", "10%", "Ex : bilan complet 40$ → 36$ / 4$"],
    ]
  },
  {
    cat: "Imagerie médicale", items: [
      ["Radiologie, échographie, scanner", "80%", "20%", "Ex : scanner 150$ → 120$ / 30$"],
      ["IRM", "60%", "40%", "Ex : IRM 300$ → 180$ / 120$"],
    ]
  },
  {
    cat: "Hospitalisation (chambre à 2 lits, 30 jours/an)", items: [
      ["Séjour complet, bloc opératoire, soins intensifs", "100%", "0%", "Ex : hospitalisation 400$ → 400$ / 0$"],
    ]
  },
  {
    cat: "Grossesse et maternité", items: [
      ["Suivi prénatal illimité, accouchement, césarienne", "90%", "10%", "Ex : césarienne 300$ → 270$ / 30$"],
    ]
  },
  {
    cat: "Soins dentaires", items: [
      ["Soins conservateurs et extractions", "80%", "20%", ""],
      ["Prothèses et couronnes simples", "60%", "40%", "Ex : couronne 200$ → 120$ / 80$"],
    ]
  },
  {
    cat: "Soins ophtalmologiques", items: [
      ["Consultation, examens, chirurgie de la cataracte", "80%", "20%", ""],
      ["Monture et verres (1 prise en charge / an)", "60%", "40%", "Plafond 300 000 CDF"],
    ]
  },
  {
    cat: "Chirurgies (mineures à majeures)", items: [
      ["Toutes chirurgies conventionnées", "90%", "10%", "Ex : myomectomie 700$ → 630$ / 70$"],
    ]
  },
  {
    cat: "Pathologies chroniques (illimité)", items: [
      ["Hypertension, diabète, asthme, arthrite — suivi et médicaments", "90%", "10%", ""],
      ["Suivi spécialisé des maladies chroniques", "90%", "10%", ""],
    ]
  },
];
const CONFORT_LIMITES = [
  "Hospitalisation : chambre à 2 lits, 30 jours par an",
  "Optique : une prise en charge de monture par an, plafonnée à 300 000 CDF",
  "IRM soumise à accord préalable du médecin conseil au-delà de 2 examens/an",
  "Période d'observation : 2 mois pour la grossesse, 3 mois pour la chirurgie programmée",
];
const CONFORT_EXCLUSIONS = [
  "Chambre individuelle privée (sauf option spécifique)",
  "Orthodontie et blanchiment dentaire",
  "Cancer et traitements oncologiques lourds (hors dépistage)",
  "Chirurgie esthétique et de confort",
  "Évacuation sanitaire internationale",
];

const PREMIUM_BAREME = [
  {
    cat: "Soins de santé primaires (illimité)", items: [
      ["Consultation générale, examens et médicaments", "100%", "0%", "Ex : consultation 15$ → 15$ / 0$"],
    ]
  },
  {
    cat: "Consultations spécialisées (illimité)", items: [
      ["Toutes spécialités, y compris consultations hors réseau sur accord préalable", "100%", "0%", ""],
    ]
  },
  {
    cat: "Examens de laboratoire (tous, illimité)", items: [
      ["Toutes analyses courantes et spécialisées", "100%", "0%", ""],
    ]
  },
  {
    cat: "Imagerie médicale (toutes, illimité)", items: [
      ["Radiologie, échographie, scanner", "100%", "0%", ""],
      ["IRM, PET-scan", "90%", "10%", "Ex : PET-scan 600$ → 540$ / 60$"],
    ]
  },
  {
    cat: "Hospitalisation (chambre privée, illimité)", items: [
      ["Séjour, bloc opératoire, soins intensifs, chambre individuelle", "100%", "0%", ""],
      ["Évacuation sanitaire internationale (si soin indisponible localement)", "100%", "0%", "Plafond 50 000 000 CDF/an"],
    ]
  },
  {
    cat: "Grossesse et maternité", items: [
      ["Suivi prénatal complet, accouchement, césarienne, complications", "100%", "0%", ""],
    ]
  },
  {
    cat: "Soins dentaires", items: [
      ["Soins conservateurs, prothèses, couronnes", "80%", "20%", ""],
      ["Orthodontie (enfants et adultes)", "60%", "40%", "Plafond 1 500 000 CDF"],
    ]
  },
  {
    cat: "Soins ophtalmologiques", items: [
      ["Consultation, chirurgie réfractive et cataracte", "100%", "0%", ""],
      ["Monture haut de gamme, verres, lentilles (1 prise en charge / an)", "100%", "0%", "Plafond 800 000 CDF"],
    ]
  },
  {
    cat: "Chirurgies (toutes, y compris reconstructrices)", items: [
      ["Chirurgies mineures, majeures et reconstructrices post-traumatiques", "100%", "0%", ""],
    ]
  },
  {
    cat: "Pathologies chroniques et maladies graves", items: [
      ["Hypertension, diabète, asthme — suivi et médicaments illimités", "100%", "0%", ""],
      ["Dialyse, oncologie, maladies graves", "90%", "10%", "Accord préalable du médecin conseil"],
    ]
  },
];
const PREMIUM_LIMITES = [
  "Évacuation sanitaire internationale plafonnée à 50 000 000 CDF par an",
  "Dialyse et oncologie soumises à accord préalable du médecin conseil (pris en charge à 90%)",
  "Orthodontie plafonnée à 1 500 000 CDF sur la durée du traitement",
  "Aucune période d'observation pour les soins courants",
];
const PREMIUM_EXCLUSIONS = [
  "Chirurgie purement esthétique non reconstructrice",
  "Actes de confort sans indication médicale",
  "Cures thermales et médecines non conventionnelles",
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

const LISANGA_RESEAU = [
  {
    cat: 'Réseau des hôpitaux', items: [
      { nom: 'RIVIERA CLINIC', commune: 'BANDALUNGWA', avenue: 'AV.NSENGE N°5116', quartier: 'MAKELELE' },
      { nom: 'CM LA PATIENCE', commune: 'BANDALUNGWA', avenue: 'AV INGA REF, COMMUNE', quartier: 'KIMBONDO' },
      { nom: 'CH LA BORNE', commune: 'NGALIEMA', avenue: 'AV MARINE 28, AUX ENCEINTES DU CH LA BORNE', quartier: 'UPN' },
      { nom: 'CH  BOLINGANI', commune: 'NGALIEMA', avenue: 'AV  SONGE,24363', quartier: 'MUSEY' },
      { nom: 'CLINIQUE DES ANGES', commune: 'NGALIEMA', avenue: 'ROUTE DE MATADI N°5351', quartier: 'BINZA OZONE' },
      { nom: 'YADAH CLINIC', commune: 'GOMBE', avenue: 'REVOLUTION 11', quartier: 'GOMBE' },
      { nom: 'CLINIC CAROLINE', commune: 'GOMBE', avenue: 'AV KAUKA', quartier: 'DERIERE ROYALE' },
      { nom: 'CH MUTUALISTE', commune: 'KASAVUBU', avenue: 'IKELEMBA,52', quartier: 'ANCIEN COMBATTANT' },
      { nom: 'POLYCLINIQUE LIGHT', commune: 'KIMBANSEKE', avenue: 'BLV LUMUMBA', quartier: 'Q3 ARRET VODACOM' },
      { nom: 'CLINIQUE IK', commune: 'KINTAMBO', avenue: 'AV KWANGO N°3', quartier: 'MAGASIN-KINTAMBO' },
      { nom: 'CM GOMBELE', commune: 'LEMBA', avenue: 'AV IKUKU N°8 Réf New-lys', quartier: 'RIGHINI' },
      { nom: 'HOPITAL SAINT GABRIEL', commune: 'LEMBA', avenue: 'AV KILIDJA 6095/9', quartier: 'GOMBELE/LEMBA TERMUNUS' },
      { nom: 'HGR SAINT JOSEPH', commune: 'LIMETE', avenue: 'BlV LUMUMBA 15 EME RUE', quartier: '15 EME RUE-LIMETE' },
      { nom: 'CLINIC PROMEDIS/LIMETE', commune: 'LIMETE', avenue: '10 èm RUE N° 22D', quartier: 'INDUSTRIEL' },
      { nom: 'MOYI MWA TONGO', commune: 'LIMETE', avenue: '4EME RUE INDUSTRIEL', quartier: 'LIMETE' },
      { nom: 'CH BIEN ETRE', commune: 'LIMETE', avenue: 'AV CONGO 8', quartier: 'SALONGO' },
      { nom: 'CENTRE DE MEDECINE SPECIALISEE DE LIMETE', commune: 'LIMETE', avenue: '10EME RUE DALLIAS 582', quartier: 'LIMETE RESIDENTIEL' },
      { nom: 'CH MA PROVIDENCE', commune: 'KALAMU', avenue: 'LOTAS 1029', quartier: 'NZAMBA AVOCAT' },
      { nom: 'CLINIQUE DES ANGES VIP', commune: 'LINGWALA', avenue: 'Crois des AV Costa et Mushi', quartier: 'BEAU VENT' },
      { nom: 'BIOPHARM 2', commune: 'LINGWALA', avenue: 'AV KATO', quartier: 'HUILERIE' },
      { nom: 'CH EMILIA', commune: 'MATETE', avenue: 'KUNDA 1 N°16', quartier: 'KUNDA 1' },
      { nom: 'CLINIC PROMEDIS/ NGALIEMA', commune: 'NGALIEMA', avenue: 'AV MAKUTU N°2', quartier: 'BINZA OZONE' },
      { nom: 'CLINIQUE SAPHIR', commune: 'KINTAMBO', avenue: 'AV TRANSVERSALE 2', quartier: 'JOLIE PARC' },
      { nom: 'CH BONNE FOI', commune: 'NSELE', avenue: 'AV MBULU 44', quartier: 'MPASA I' },
      { nom: 'SAINT LUC DE DAIPAIN', commune: 'N\'SELE', avenue: 'DAIPAIN', quartier: 'DAIPAIN' },
      { nom: 'CH MARIA ANTHONIA DE PARIS', commune: 'N\'SELE', avenue: 'AV COLONEL NZADI 1', quartier: 'NGAMABA/MPASA' },
      { nom: 'CLINIC PROMEDIS/ N\'SELE', commune: 'N\'SELE', avenue: 'AV KAKENZA N°2', quartier: 'COPELA-PLAZA' },
      { nom: 'CLINIQUE OASIS DE VIE', commune: 'BARUMBU', avenue: '6051 KABAMBARE', quartier: 'BEAU MARCHE-NDOLO' },
      { nom: 'CH DAMFER', commune: 'N\'SELE', avenue: 'AV MAKELELE 107', quartier: 'MPASA I' },
      { nom: 'RENE DES HAES', commune: 'MONT NGAFULA', avenue: 'AV LUZIZILA 18', quartier: 'KIMWENZA-MISSION' },
      { nom: 'CH SAINT GILD', commune: 'MONT NGAFULA', avenue: 'AV MONASTERE KINSAHSA-KINDELE', quartier: 'KINDELE' },
      { nom: 'CS ET MATERNITE SAINT VINCENT DE PAUL', commune: 'MONT NGAFULA', avenue: 'AV LEMBI 5  Q/MUSHI/MBUDI', quartier: 'MBUDI' },
      { nom: 'PROMEDIS CITE VERTE', commune: 'MONT NGAFULA', avenue: '12 EME RUE VLLA 3', quartier: 'CITE VERTE' },
    ]
  },
  {
    cat: 'Structures de BDOM', items: [
      { nom: 'CS  NTOMBWA YA  MARIA', commune: 'MASINA', avenue: 'LOLA  II,4', quartier: 'MASINA SANS FIL' },
      { nom: 'CH  LISUNGI', commune: 'MONT NGAFULA', avenue: 'ROUTE DU LAC DE MA VALLEE', quartier: 'MPUMBU' },
      { nom: 'CS  MATER DEI', commune: 'MONT NGAFULA', avenue: 'ROUTE DE MATADI', quartier: 'KIMBONDO' },
    ]
  },
  {
    cat: 'Structures hyperspécialisées', items: [
      { nom: 'CLINIQUE DENTAIRE LA CANINE', commune: 'GOMBE', avenue: 'AV DE LA JUSTICE 44', quartier: 'GOMBE' },
      { nom: 'CDM PHTALMOLOGIQUE ET DENTAIRE', commune: 'GOMBE', avenue: 'AV MONGALA 10 REF MIDEMA', quartier: 'GOMBE' },
      { nom: 'HJ HOSPITALS/EXAMENS SPECIALISES', commune: 'LIMETE', avenue: '1ERE RUE, INDISTRIEL', quartier: '1ERE RUE INDISTRIEL' },
    ]
  },
  {
    cat: 'Structures en cas de transfert', items: [
      { nom: 'HGR SAINT JOSEPH', commune: 'LIMETE', avenue: 'BlV LUMUMBA 15 EME RUE', quartier: 'MOTEL FIKIN' },
      { nom: 'CLINIQUE BONDEKO', commune: 'LIMETE', avenue: 'AV YOLO N°7259', quartier: 'LIMETE-RESIDENTIEL' },
      { nom: 'HGR/PEDIATRIE  KALEMBELEMBE', commune: 'LINGWALA', avenue: 'AV  KALEMBELEMBE', quartier: 'NGONDALOKOMBE' },
      { nom: 'CH  MONKOLE', commune: 'MT NGAFULA', avenue: 'AV MONKOLE', quartier: '' },
    ]
  },
];


const BAREME = [
  { cat: "Consultations", items: [["Consultation généraliste (réseau)", "90%", "15 000 CDF / acte"], ["Consultation spécialiste", "80%", "25 000 CDF / acte"], ["Urgence (nuit / week-end)", "100%", "35 000 CDF / acte"]] },
  { cat: "Hospitalisation", items: [["Chambre standard", "100%", "150 000 CDF / jour"], ["Chambre individuelle (supplément)", "50%", "50 000 CDF / jour"], ["Bloc opératoire & anesthésie", "100%", "Inclus au plafond"]] },
  { cat: "Dentaire", items: [["Soins conservateurs", "70%", "200 000 CDF / an"], ["Prothèses dentaires", "40%", "300 000 CDF / an"]] },
  { cat: "Optique", items: [["Monture", "50%", "100 000 CDF / 2 ans"], ["Verres correcteurs", "50%", "200 000 CDF / 2 ans"]] },
  { cat: "Maternité", items: [["Suivi prénatal", "90%", "400 000 CDF / grossesse"], ["Accouchement (césarienne)", "90%", "2 000 000 CDF / grossesse"]] },
];
const EXCLUSIONS = ["Chirurgie esthétique et de confort", "Traitement de la stérilité et PMA", "Frais engagés à l'étranger (hors option évacuation)", "Cures thermales et médecines non reconnues", "Vaccins de confort hors calendrier national"];

/* Grades / rang social — taux automatique de prise en charge */
const GRADES = [
  { id: "directeur", label: "Directeur / Cadre supérieur", taux: 90 },
  { id: "agent", label: "Agent / Employé", taux: 80 },
  { id: "dependant", label: "Dépendant (conjoint / enfant)", taux: 70 },
];
const tauxFor = (gradeId) => GRADES.find((g) => g.id === gradeId)?.taux ?? 70;
const gradeLabel = (gradeId) => GRADES.find((g) => g.id === gradeId)?.label ?? "Dépendant";

/* Cascade de paiement — ordre des payeurs */
const CONDITIONS_SANTE = [
  { id: "diabete", label: "Diabète (type 1 ou 2)" },
  { id: "hta", label: "Hypertension artérielle" },
  { id: "vih", label: "VIH / SIDA" },
  { id: "cardiaque", label: "Maladie cardiaque" },
  { id: "renale", label: "Insuffisance rénale" },
  { id: "respiratoire", label: "Maladie respiratoire chronique" },
];
const CASCADE = [
  { ordre: 1, payeur: "CSU — Couverture Santé Universelle", role: "Gratuité intégrale, mais uniquement pour la maternité (CPN, accouchement) — seul volet effectif à ce jour en RDC", taux: "100% (maternité uniquement)" },
  { ordre: 2, payeur: "Assurance NeoGTec HealthCare", role: "Premier payeur sur tous les autres soins, selon le taux du bénéficiaire (grade)", taux: "90 / 80 / 70%" },
  { ordre: 3, payeur: "Mutuelle complémentaire", role: "Couvre une partie du solde restant, si l'assuré en dispose", taux: "Variable" },
  { ordre: 4, payeur: "Reste à charge — Assuré", role: "Solde final réglé directement par l'assuré", taux: "Variable" },
];
function computeVentilation(montant, tauxAssurance, garantie) {
  const m = Number(montant) || 0;
  if (garantie === "Maternité") {
    // Couverture Santé Universelle : seule la maternité est effectivement gratuite à ce jour en RDC.
    return { csu: m, assurance: 0, mutuelle: 0, resteACharge: 0, csuMaternite: true };
  }
  // Hors maternité, la CSU n'est pas encore effective — la garantie repose sur l'assurance/mutuelle et l'assuré.
  const assurance = Math.round(m * (tauxAssurance / 100));
  const resteACharge = m - assurance;
  return { csu: 0, assurance, mutuelle: resteACharge, resteACharge };
}

/* Devis — taxe unique sur les contrats d'assurance (CIMA) */
const TAXE_RATE = 0.02;
/* Majoration tarifaire selon l'âge et les antécédents médicaux déclarés */
const ANTECEDENTS_DEVIS = ["Diabète", "Hypertension", "Anémie", "Asthme", "Maladie cardiaque"];
function computeMajorationSante(age, antecedents) {
  let pct = 0;
  const a = Number(age) || 0;
  if (a >= 60) pct += 15;
  else if (a >= 45) pct += 8;
  else if (a >= 36) pct += 3;
  pct += (antecedents?.length || 0) * 5;
  return Math.min(pct, 40);
}

function computeDevis(formule, totalBenef, majorationPct = 0) {
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

/* Échéancier de paiement trimestriel (part salarié) */
function buildEcheancier(partSalarieAnnuelle, dejaPayes = 0) {
  const parTrimestre = Math.round(partSalarieAnnuelle / 4);
  const trimestres = ["T1 — Janvier à Mars", "T2 — Avril à Juin", "T3 — Juillet à Septembre", "T4 — Octobre à Décembre"];
  return trimestres.map((label, i) => ({
    id: i + 1, label, montant: parTrimestre,
    statut: i < dejaPayes ? "Payé" : i === dejaPayes ? "Dû" : "À venir",
  }));
}

/* Notifications */
function buildNotifications() {
  return [
    { id: 1, type: "pec", titre: "PEC validée", detail: "Clinique Ngaliema — 45 000 CDF", date: "Aujourd'hui, 09:14", lue: false },
    { id: 2, type: "rdv", titre: "Rappel de rendez-vous", detail: "Consultation demain à 09:00", date: "Hier, 18:00", lue: false },
    { id: 3, type: "plafond", titre: "Plafond bientôt atteint", detail: "Garantie Dentaire à 80% consommée", date: "Il y a 3 jours", lue: true },
    { id: 4, type: "paiement", titre: "Échéance à venir", detail: "Quote-part T3 à régler avant le 05/07", date: "Il y a 5 jours", lue: true },
    { id: 5, type: "contrat", titre: "Bienvenue chez NeoGTec HealthCare", detail: "Votre contrat est actif", date: "02/02/2026", lue: true },
  ];
}
const NOTIF_ICON = { pec: Stethoscope, rdv: CalendarCheck, plafond: AlertTriangle, paiement: Wallet, contrat: ShieldCheck };

/* Fidélité — bonus-malus */
function buildFidelite() {
  return { moisSansSinistre: 0, bonus: 0, prochainPalier: 6, bonusProchainPalier: 5 };
}

const LANGUES = ["Français", "Lingala", "Swahili", "English"];


/* Répertoire de prestataires — géolocalisation (mock, triés du plus proche au plus loin) */
const PRESTATAIRES = [
  { id: "p1", nom: "Pharmacie Bel Air", type: "Pharmacie conventionnée", ville: "Kinshasa · Gombe", distanceKm: 0.8, ouvert24h: true, tarif: "€" },
  { id: "p5", nom: "Pharmacie Kintambo", type: "Pharmacie conventionnée", ville: "Kinshasa · Kintambo", distanceKm: 6.7, ouvert24h: false, tarif: "€" },
  { id: 'h1', nom: 'RIVIERA CLINIC', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · BANDALUNGWA · MAKELELE', distanceKm: 1.0, ouvert24h: true, tarif: '€€' },
  { id: 'h2', nom: 'CM LA PATIENCE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · BANDALUNGWA · KIMBONDO', distanceKm: 1.3, ouvert24h: false, tarif: '€' },
  { id: 'h3', nom: 'CH LA BORNE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · NGALIEMA · UPN', distanceKm: 1.7, ouvert24h: true, tarif: '€' },
  { id: 'h4', nom: 'CH BOLINGANI', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · NGALIEMA · MUSEY', distanceKm: 2.1, ouvert24h: true, tarif: '€€' },
  { id: 'h5', nom: 'CLINIQUE DES ANGES', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · NGALIEMA · BINZA OZONE', distanceKm: 2.5, ouvert24h: true, tarif: '€' },
  { id: 'h6', nom: 'YADAH CLINIC', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · GOMBE · GOMBE', distanceKm: 2.8, ouvert24h: true, tarif: '€' },
  { id: 'h7', nom: 'CLINIC CAROLINE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · GOMBE · DERIERE ROYALE', distanceKm: 3.2, ouvert24h: true, tarif: '€' },
  { id: 'h8', nom: 'CH MUTUALISTE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · KASAVUBU · ANCIEN COMBATTANT', distanceKm: 3.6, ouvert24h: true, tarif: '€' },
  { id: 'h9', nom: 'POLYCLINIQUE LIGHT', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · KIMBANSEKE · Q3 ARRET VODACOM', distanceKm: 3.9, ouvert24h: true, tarif: '€€' },
  { id: 'h10', nom: 'CLINIQUE IK', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · KINTAMBO · MAGASIN-KINTAMBO', distanceKm: 4.3, ouvert24h: true, tarif: '€' },
  { id: 'h11', nom: 'CM GOMBELE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LEMBA · RIGHINI', distanceKm: 4.7, ouvert24h: false, tarif: '€€' },
  { id: 'h12', nom: 'HOPITAL SAINT GABRIEL', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LEMBA · GOMBELE/LEMBA TERMUNUS', distanceKm: 5.0, ouvert24h: true, tarif: '€€' },
  { id: 'h13', nom: 'HGR SAINT JOSEPH', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LIMETE · 15 EME RUE-LIMETE', distanceKm: 5.4, ouvert24h: true, tarif: '€€' },
  { id: 'h14', nom: 'CLINIC PROMEDIS/LIMETE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LIMETE · INDUSTRIEL', distanceKm: 5.8, ouvert24h: true, tarif: '€' },
  { id: 'h15', nom: 'MOYI MWA TONGO', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LIMETE · LIMETE', distanceKm: 6.1, ouvert24h: false, tarif: '€€' },
  { id: 'h16', nom: 'CH BIEN ETRE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LIMETE · SALONGO', distanceKm: 6.5, ouvert24h: true, tarif: '€' },
  { id: 'h17', nom: 'CENTRE DE MEDECINE SPECIALISEE DE LIMETE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LIMETE · LIMETE RESIDENTIEL', distanceKm: 6.9, ouvert24h: false, tarif: '€' },
  { id: 'h18', nom: 'CH MA PROVIDENCE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · KALAMU · NZAMBA AVOCAT', distanceKm: 7.3, ouvert24h: true, tarif: '€' },
  { id: 'h19', nom: 'CLINIQUE DES ANGES VIP', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LINGWALA · BEAU VENT', distanceKm: 7.6, ouvert24h: true, tarif: '€' },
  { id: 'h20', nom: 'BIOPHARM 2', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · LINGWALA · HUILERIE', distanceKm: 8.0, ouvert24h: false, tarif: '€' },
  { id: 'h21', nom: 'CH EMILIA', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · MATETE · KUNDA 1', distanceKm: 8.4, ouvert24h: true, tarif: '€' },
  { id: 'h22', nom: 'CLINIC PROMEDIS/ NGALIEMA', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · NGALIEMA · BINZA OZONE', distanceKm: 8.7, ouvert24h: true, tarif: '€€' },
  { id: 'h23', nom: 'CLINIQUE SAPHIR', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · KINTAMBO · JOLIE PARC', distanceKm: 9.1, ouvert24h: true, tarif: '€€' },
  { id: 'h24', nom: 'CH BONNE FOI', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · NSELE · MPASA I', distanceKm: 9.5, ouvert24h: true, tarif: '€' },
  { id: 'h25', nom: 'SAINT LUC DE DAIPAIN', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · N\'SELE · DAIPAIN', distanceKm: 9.8, ouvert24h: false, tarif: '€€' },
  { id: 'h26', nom: 'CH MARIA ANTHONIA DE PARIS', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · N\'SELE · NGAMABA/MPASA', distanceKm: 0.7, ouvert24h: true, tarif: '€' },
  { id: 'h27', nom: 'CLINIC PROMEDIS/ N\'SELE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · N\'SELE · COPELA-PLAZA', distanceKm: 1.1, ouvert24h: true, tarif: '€€' },
  { id: 'h28', nom: 'CLINIQUE OASIS DE VIE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · BARUMBU · BEAU MARCHE-NDOLO', distanceKm: 1.5, ouvert24h: true, tarif: '€€' },
  { id: 'h29', nom: 'CH DAMFER', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · N\'SELE · MPASA I', distanceKm: 1.8, ouvert24h: true, tarif: '€€' },
  { id: 'h30', nom: 'RENE DES HAES', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · MONT NGAFULA · KIMWENZA-MISSION', distanceKm: 2.2, ouvert24h: false, tarif: '€€' },
  { id: 'h31', nom: 'CH SAINT GILD', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · MONT NGAFULA · KINDELE', distanceKm: 2.6, ouvert24h: true, tarif: '€' },
  { id: 'h32', nom: 'CS ET MATERNITE SAINT VINCENT DE PAUL', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · MONT NGAFULA · MBUDI', distanceKm: 2.9, ouvert24h: false, tarif: '€' },
  { id: 'h33', nom: 'PROMEDIS CITE VERTE', type: 'Hôpital / Clinique conventionné', ville: 'Kinshasa · MONT NGAFULA · CITE VERTE', distanceKm: 3.3, ouvert24h: false, tarif: '€' },
  { id: 'h34', nom: 'CS NTOMBWA YA MARIA', type: 'Centre de santé (BDOM)', ville: 'Kinshasa · MASINA · MASINA SANS FIL', distanceKm: 3.7, ouvert24h: false, tarif: '€' },
  { id: 'h35', nom: 'CH LISUNGI', type: 'Centre de santé (BDOM)', ville: 'Kinshasa · MONT NGAFULA · MPUMBU', distanceKm: 4.0, ouvert24h: true, tarif: '€' },
  { id: 'h36', nom: 'CS MATER DEI', type: 'Centre de santé (BDOM)', ville: 'Kinshasa · MONT NGAFULA · KIMBONDO', distanceKm: 4.4, ouvert24h: false, tarif: '€' },
  { id: 'h37', nom: 'CLINIQUE DENTAIRE LA CANINE', type: 'Structure hyperspécialisée', ville: 'Kinshasa · GOMBE · GOMBE', distanceKm: 4.8, ouvert24h: false, tarif: '€€€' },
  { id: 'h38', nom: 'CDM PHTALMOLOGIQUE ET DENTAIRE', type: 'Structure hyperspécialisée', ville: 'Kinshasa · GOMBE · GOMBE', distanceKm: 5.2, ouvert24h: false, tarif: '€€€' },
  { id: 'h39', nom: 'HJ HOSPITALS/EXAMENS SPECIALISES', type: 'Structure hyperspécialisée', ville: 'Kinshasa · LIMETE · 1ERE RUE INDISTRIEL', distanceKm: 5.5, ouvert24h: false, tarif: '€€€' },
  { id: 'h40', nom: 'HGR SAINT JOSEPH', type: 'Hôpital de référence (transfert)', ville: 'Kinshasa · LIMETE · MOTEL FIKIN', distanceKm: 5.9, ouvert24h: true, tarif: '€€' },
  { id: 'h41', nom: 'CLINIQUE BONDEKO', type: 'Hôpital de référence (transfert)', ville: 'Kinshasa · LIMETE · LIMETE-RESIDENTIEL', distanceKm: 6.3, ouvert24h: true, tarif: '€€' },
  { id: 'h42', nom: 'HGR/PEDIATRIE KALEMBELEMBE', type: 'Hôpital de référence (transfert)', ville: 'Kinshasa · LINGWALA · NGONDALOKOMBE', distanceKm: 6.6, ouvert24h: true, tarif: '€€' },
  { id: 'h43', nom: 'CH MONKOLE', type: 'Hôpital de référence (transfert)', ville: 'Kinshasa · MT NGAFULA', distanceKm: 7.0, ouvert24h: true, tarif: '€€' },
].sort((a, b) => a.distanceKm - b.distanceKm);

const SPECIALITES = ["Médecine générale", "Pédiatrie", "Gynécologie", "Cardiologie", "Dermatologie"];

/* Tarif conventionné indicatif par garantie — utilisé pour l'estimation automatique en PEC */
const CONVENTION_TARIFS = {
  "Consultations & Pharmacie": 15000,
  "Hospitalisation": 150000,
  "Dentaire": 20000,
  "Optique": 100000,
  "Maternité": 400000,
};

const MOTIFS_CONSULTATION = ["Consultation générale", "Suivi médical / renouvellement", "Bilan ou contrôle", "Vaccination", "Urgence / douleur aiguë", "Autre"];

/* Médecin spécialiste assigné automatiquement en téléconsultation, avec ses créneaux propres */
const SPECIALITE_MEDECINS = {
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

/* Liste positive des soins pris en charge (au-delà des taux/plafonds du barème) */
const SOINS_COUVERTS = [
  { cat: "Soins ambulatoires", items: ["Consultation médecine générale", "Consultation spécialiste", "Analyses de laboratoire courantes", "Imagerie (radio, échographie)", "Petite chirurgie ambulatoire", "Soins infirmiers à domicile sur prescription"] },
  { cat: "Hospitalisation", items: ["Frais de séjour (chambre standard)", "Actes chirurgicaux", "Bloc opératoire et anesthésie", "Réanimation et soins intensifs", "Évacuation sanitaire locale d'urgence"] },
  { cat: "Maternité", items: ["Suivi prénatal", "Accouchement voie basse ou césarienne", "Suivi post-natal (mère et nouveau-né)"] },
  { cat: "Dentaire & Optique", items: ["Soins conservateurs (détartrage, plombage)", "Extractions", "Prothèses dentaires (plafonnées)", "Monture et verres correcteurs (plafonnés)"] },
  { cat: "Prévention", items: ["Vaccins du calendrier national", "Bilan de santé annuel", "Dépistages recommandés selon l'âge"] },
];

/* Consommation mensuelle (mock, pour le graphique d'évolution) */
const CONSO_MENSUELLE = [
  { mois: "Fév", montant: 32000 }, { mois: "Mar", montant: 18000 }, { mois: "Avr", montant: 65000 },
  { mois: "Mai", montant: 24000 }, { mois: "Juin", montant: 91000 }, { mois: "Juil", montant: 45000 },
];

/* Historique complet des paiements (toutes années confondues) */
function buildHistoriquePaiements() {
  return [
    { id: 1, date: "05/07/2026", montant: 650000, methode: "Mobile Money", reference: "TXN-778213", statut: "Réussi" },
    { id: 2, date: "04/04/2026", montant: 650000, methode: "Virement bancaire", reference: "TXN-661094", statut: "Réussi" },
    { id: 3, date: "12/03/2026", montant: 650000, methode: "Carte bancaire", reference: "TXN-590221", statut: "Échoué" },
    { id: 4, date: "06/01/2026", montant: 650000, methode: "Mobile Money", reference: "TXN-552087", statut: "Réussi" },
    { id: 5, date: "03/10/2025", montant: 600000, methode: "Carte bancaire", reference: "TXN-441932", statut: "Réussi" },
    { id: 6, date: "02/07/2025", montant: 600000, methode: "Mobile Money", reference: "TXN-331880", statut: "Réussi" },
  ];
}

/* Moyens de paiement rattachés à l'assuré */
function buildMoyensPaiement() {
  return [
    { id: "mm1", type: "mobile", label: "Mobile Money — Vodacom M-Pesa", detail: "+243 81 000 00 00", parDefaut: true },
    { id: "cb1", type: "carte", label: "Carte bancaire — Visa", detail: "•••• •••• •••• 4821", parDefaut: false },
    { id: "pp1", type: "paypal", label: "PayPal", detail: "jp.mukendi@mail.cd", parDefaut: false },
  ];
}

/* Couvertures multiples liées à la cascade de paiement (CSU, Assurance privée, Mutuelle, Reste à charge) */
function buildCouvertures(session) {
  return [
    { id: "csu", nom: "CSU — Couverture Santé Universelle", numero: `CSU-${session.beneficiaires[0]?.carte?.slice(-6) || "000000"}`, couleur: C.navy, taux: "100% — maternité uniquement" },
    { id: "prive", nom: "Assurance Privée — NeoGTec HealthCare", numero: session.police, couleur: C.gold, taux: `${session.formule?.nom || ""} — 1er rang hors maternité` },
    { id: "mutuelle", nom: "Mutuelle complémentaire", numero: `MUT-${session.contrat?.slice(-6) || "000000"}`, couleur: C.green, taux: "Solde partiel — 3e rang" },
    { id: "reste", nom: "Reste à charge — Assuré", numero: "—", couleur: C.sub, taux: "Part personnelle — 4e rang" },
  ];
}

/* ---------------------------------------------------------------
   SESSION DE DÉMONSTRATION (compte existant)
------------------------------------------------------------------ */
const DEMO_SESSION = {
  compteType: "principal", vueCompteId: "00",
  assure: { nom: "MUKENDI Jean-Paul", profession: "Ingénieur", employeur: "MININGCO SARL", ville: "Kinshasa", telephone: "+243 89 000 12 34" },
  police: "SP-KIN-000482", contrat: "CTR-SP-2026-000482", formule: FORMULES[1],
  validite: "01/07/2025 — 30/06/2027", prime: 3250000, faceRegistered: true, idMethode: "visage",
  paiements: buildEcheancier(650000, 2), paiementsHistorique: buildHistoriquePaiements(), moyensPaiement: buildMoyensPaiement(),
  notifications: buildNotifications(), fidelite: buildFidelite(),
  langue: "Français", verrouillage: true,
  autresContrats: [
    {
      police: "SP-LSH-001120", contrat: "CTR-SP-2025-001120", formule: FORMULES[0], validite: "01/03/2025 — 28/02/2026", prime: 700000, statut: "Actif", ville: "Lubumbashi", note: "Contrat individuel — résidence secondaire",
      beneficiaires: [{ id: "00", lien: "Assuré principal", nom: "MUKENDI Jean-Paul", naissance: "14/03/1985", carte: "SP-LSH-001120-00", icon: ShieldCheck, grade: "agent" }],
      garanties: [
        { nom: "Consultations & Pharmacie", plafond: 900000, consomme: 120000 },
        { nom: "Hospitalisation", plafond: 4000000, consomme: 0 },
        { nom: "Dentaire", plafond: 200000, consomme: 0 },
        { nom: "Optique", plafond: 150000, consomme: 0 },
        { nom: "Maternité", plafond: 1000000, consomme: 0 },
      ],
      paiements: buildEcheancier(175000, 3), histo: [], rdv: [],
    },
  ],
  beneficiaires: [
    { id: "00", lien: "Assuré principal", nom: "MUKENDI Jean-Paul", naissance: "14/03/1985", carte: "SP-KIN-000482-00", icon: ShieldCheck, grade: "agent", statutAffiliation: "Actif", photo: "https://i.pravatar.cc/200?img=51", faceRegistered: true },
    { id: "01", lien: "Conjoint", nom: "MUKENDI née KABEYA Chantal", naissance: "22/07/1988", carte: "SP-KIN-000482-01", icon: Heart, grade: "dependant", statutAffiliation: "Actif", photo: "https://i.pravatar.cc/200?img=47", faceRegistered: true },
    { id: "02", lien: "Enfant", nom: "MUKENDI Grâce", naissance: "05/11/2014", carte: "SP-KIN-000482-02", icon: Baby, grade: "dependant", statutAffiliation: "Actif", photo: "https://i.pravatar.cc/200?img=27", faceRegistered: false },
    { id: "03", lien: "Enfant", nom: "MUKENDI Emmanuel", naissance: "19/09/2017", carte: "SP-KIN-000482-03", icon: Baby, grade: "dependant", statutAffiliation: "Actif", photo: "https://i.pravatar.cc/200?img=12", faceRegistered: false },
    { id: "04", lien: "Enfant", nom: "MUKENDI Divine", naissance: "02/01/2021", carte: "SP-KIN-000482-04", icon: Baby, grade: "dependant", statutAffiliation: "Suspendu", photo: "https://i.pravatar.cc/200?img=32", faceRegistered: false },
  ],
  garanties: [
    { nom: "Consultations & Pharmacie", plafond: 1800000, consomme: 245000 },
    { nom: "Hospitalisation", plafond: 8000000, consomme: 0 },
    { nom: "Dentaire", plafond: 500000, consomme: 80000 },
    { nom: "Optique", plafond: 300000, consomme: 0 },
    { nom: "Maternité", plafond: 2500000, consomme: 0 },
  ],
  histo: [
    { id: 1, date: "28/06/2026", type: "PEC directe", prestataire: "Clinique Ngaliema", montant: 45000, statut: "Validé", vent: computeVentilation(45000, 80, "Consultations & Pharmacie") },
    { id: 2, date: "15/06/2026", type: "Remboursement", prestataire: "Pharmacie Bel Air", montant: 32000, statut: "En cours", vent: computeVentilation(32000, 80, "Consultations & Pharmacie") },
    { id: 3, date: "02/06/2026", type: "PEC directe", prestataire: "Centre Monkole", montant: 18000, statut: "Validé", vent: computeVentilation(18000, 80, "Consultations & Pharmacie") },
    { id: 4, date: "22/05/2026", type: "Remboursement", prestataire: "Cabinet Dentaire Uzima", montant: 60000, statut: "Refusé", vent: computeVentilation(60000, 80, "Dentaire") },
    { id: 5, date: "22/03/2026", type: "Remboursement", prestataire: "Pharmacie Bel Air", montant: 18000, statut: "Validé", vent: computeVentilation(18000, 80, "Consultations & Pharmacie") },
    { id: 6, date: "08/02/2026", type: "PEC directe", prestataire: "Clinique Ngaliema", montant: 27000, statut: "Validé", vent: computeVentilation(27000, 80, "Consultations & Pharmacie") },
    { id: 7, date: "19/11/2025", type: "PEC directe", prestataire: "CH Bien Être", montant: 41000, statut: "Validé", vent: computeVentilation(41000, 80, "Consultations & Pharmacie") },
    { id: 8, date: "14/08/2025", type: "PEC directe", prestataire: "Clinique Ngaliema", montant: 32000, statut: "Validé", vent: computeVentilation(32000, 80, "Consultations & Pharmacie") },
  ],
  rdv: [
    { id: 1, type: "Présentiel", cible: "Clinique Ngaliema", beneficiaire: "MUKENDI Jean-Paul", date: "10/07/2026", heure: "09:00", statut: "Confirmé" },
    { id: 2, uid: "DEMO-TC-001", type: "Téléconsultation", cible: "Cardiologie — Dr. Sarah Luvuezo", beneficiaire: "MUKENDI Jean-Paul", date: "16/07/2026", heure: "14:30", statut: "Confirmé", medecin: "Dr. Sarah Luvuezo", specialite: "Cardiologie" },
  ],
  dossierMedical: {
    constantesVitales: { tension: "12/8", frequenceCardiaque: "76 bpm", temperature: "36,7 °C", saturation: "98%", taille: "178 cm", poids: "76 kg", imc: "24,0", groupeSanguin: "O+", dateRelevé: "28/06/2026" },
    allergies: ["Pénicilline (réaction cutanée)", "Arachides"],
    maladiesChroniques: ["Hypertension artérielle légère (suivi depuis 2022)"],
    traitementsEnCours: [{ nom: "Amlodipine 5 mg", posologie: "1 comprimé/jour, le matin", depuis: "2022" }],
    antecedentsChirurgicaux: [{ intervention: "Appendicectomie", date: "2010", etablissement: "Hôpital Provincial de Kinshasa" }],
    antecedentsFamiliaux: ["Diabète de type 2 (père)", "Hypertension artérielle (mère)"],
    visites: [
      {
        date: "28/06/2026", motif: "Douleurs abdominales", diagnostic: "Gastrite", prescripteur: "Dr. Kalonji — Clinique Ngaliema",
        examens: [
          { nom: "Glycémie à jeun", resultat: "0,92 g/L", reference: "0,70 – 1,10 g/L", statut: "Normal" },
          { nom: "Cholestérol total", resultat: "2,10 g/L", reference: "< 2,00 g/L", statut: "Élevé" },
        ],
        imagerie: [{ type: "Échographie abdominale", conclusion: "Gastrite sans complication", etablissement: "Clinique Ngaliema" }],
        ordonnance: { medicaments: ["Amlodipine 5 mg — 1/jour, le matin", "Oméprazole 20 mg — 2/jour pendant 10 jours"], statut: "Active" },
        vaccinations: [],
        documents: [
          { nom: "Ordonnance_Amlodipine.pdf", type: "Ordonnance" },
          { nom: "Compte_rendu_echographie.pdf", type: "Compte-rendu" },
          { nom: "Resultats_bilan_sanguin.pdf", type: "Analyse" },
        ],
      },
      {
        date: "02/06/2026", motif: "Contrôle de routine", diagnostic: "RAS", prescripteur: "Dr. Mbuyi — Centre Monkole",
        examens: [], imagerie: [],
        ordonnance: { medicaments: ["Paracétamol 1g — si douleur"], statut: "Expirée" },
        vaccinations: [], documents: [],
      },
      {
        date: "03/03/2021", motif: "Vaccination", diagnostic: null, prescripteur: "Centre de santé conventionné",
        examens: [], imagerie: [], ordonnance: null, vaccinations: [{ nom: "Hépatite B" }], documents: [],
      },
      {
        date: "14/01/2020", motif: "Vaccination", diagnostic: null, prescripteur: "Centre de santé conventionné",
        examens: [], imagerie: [], ordonnance: null, vaccinations: [{ nom: "Fièvre jaune" }], documents: [],
      },
    ],
  },
};

/* ---------------------------------------------------------------
   PRIMITIVES
------------------------------------------------------------------ */
function Ring({ pct, size = 54, stroke = 6, color = C.gold }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (pct / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.line} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .8s ease" }} />
    </svg>
  );
}
function Toast({ message, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="absolute left-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{ bottom: 84, background: C.navy, color: "white", fontFamily: sans, fontSize: 13, animation: "riseIn .25s ease" }}>
      <CheckCircle2 size={16} color={C.gold} /><span>{message}</span>
    </div>
  );
}
function StatusPill({ statut }) {
  const map = { "Validé": { bg: C.greenSoft, fg: C.green, icon: Check }, "Confirmé": { bg: C.greenSoft, fg: C.green, icon: Check }, "Réussi": { bg: C.greenSoft, fg: C.green, icon: Check }, "Payé": { bg: C.greenSoft, fg: C.green, icon: Check }, "Résolu": { bg: C.greenSoft, fg: C.green, icon: Check }, "En cours": { bg: "#FBEAE8", fg: C.amber, icon: Clock }, "En attente": { bg: "#FBEAE8", fg: C.amber, icon: Clock }, "Ouvert": { bg: "#FBEAE8", fg: C.amber, icon: Clock }, "Dû": { bg: "#FBEAE8", fg: C.amber, icon: Clock }, "Refusé": { bg: C.redSoft, fg: C.red, icon: X }, "Échoué": { bg: C.redSoft, fg: C.red, icon: X } };
  const s = map[statut] || map["En cours"], Icon = s.icon;
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: s.bg, color: s.fg, fontFamily: sans, fontSize: 11 }}><Icon size={11} /> {statut}</span>;
}
function SectionLabel({ children }) { return <div className="px-5 pt-5 pb-2 font-bold uppercase tracking-widest" style={{ color: C.sub, fontFamily: sans, fontSize: 11 }}>{children}</div>; }
function Card({ children, style, className = "", onClick }) { return <div onClick={onClick} className={`rounded-2xl bg-white ${className}`} style={{ border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,38,68,0.04)", ...style }}>{children}</div>; }
function Field({ label, children }) { return <div><div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>{children}</div>; }
const inputStyle = { width: "100%", fontFamily: sans, fontSize: 13, color: C.ink, background: C.ivory, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", outline: "none", boxSizing: "border-box" };

/* =================================================================
   SYNCHRONISATION INTER-APPS — demandes de téléconsultation
   Publie la demande vers le stockage partagé, lu par l'app Prestataire
   dans ses "téléconsultations en attente".
================================================================= */
const CLE_TELECONSULTATIONS_PARTAGEES = "neogtec_eco_teleconsultations_v1";
async function publierTeleconsultationPartagee(entry) {
  try {
    const res = await window.storage.get(CLE_TELECONSULTATIONS_PARTAGEES, true);
    const liste = res?.value ? JSON.parse(res.value) : [];
    await window.storage.set(CLE_TELECONSULTATIONS_PARTAGEES, JSON.stringify([entry, ...liste]), true);
  } catch (e) { /* stockage indisponible — la demande reste visible localement */ }
}
const CLE_PEC_PARTAGEES = "neogtec_eco_pec_v1";
const CLE_MESSAGES_PREVENTION = "neogtec_eco_messages_prevention_v1";
const CLE_DEROGATIONS_PARTAGEES = "neogtec_eco_derogations_v1";
const CLE_COMPTES_PARTAGES = "neogtec_eco_comptes_v1";
const CLE_MESSAGERIE_PARTAGEE = "neogtec_eco_messagerie_v1";
const CLE_RECLAMATIONS_PARTAGEES = "neogtec_eco_reclamations_v1";
const TYPES_RECLAMATION = ["Remboursement refusé", "Accueil clinique", "Délai de traitement", "Facturation", "Demande de résiliation", "Autre"];
const ETAPES_RECLAMATION = ["Reçue", "En cours d'analyse", "Décision rendue"];
const couleurSeverite = (s) => (s === "Haute" ? { bg: "#FBE2E0", fg: "#C0392B" } : s === "Moyenne" ? { bg: "#FBEBD2", fg: "#C88A1E" } : { bg: "#E3F2E6", fg: "#2F8A5B" });
async function sauvegarderCanalPartage(cle, valeur) {
  try {
    await window.storage.set(cle, JSON.stringify(valeur), true);
  } catch (e) { /* stockage indisponible */ }
}
function whatsappChatUrl(numero, texte) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${num}${texte ? `?text=${encodeURIComponent(texte)}` : ""}`;
}
function whatsappCallUrl(numero) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `whatsapp://call?phone=${num}`;
}
const POSITION_DEMO_ASSURE = { lat: -4.3224, lng: 15.3075 }; // Gombe, Kinshasa — position simulée de l'utilisateur
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
}
async function chargerCanalPartage(cle) {
  try {
    const res = await window.storage.get(cle, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}
function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function telechargerDocument(nomFichier, contexte) {
  downloadText(nomFichier, `Document : ${nomFichier}\n${contexte}\n\nCe fichier a été transmis via NeoGTec HealthCare.`);
}
function VentilationBar({ vent, montant }) {
  const total = montant || (vent.csu + vent.assurance + vent.mutuelle) || 1;
  const seg = (v, color) => <div style={{ width: `${(v / total) * 100}%`, background: color, height: "100%" }} />;
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-full" style={{ height: 8, background: C.line }}>
        {seg(vent.csu, C.navy2)}{seg(vent.assurance, C.gold)}{seg(vent.mutuelle, C.red)}
      </div>
      <div className="flex justify-between mt-1.5">
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.navy2 }}>● CSU {fmt(vent.csu)}</span>
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.gold }}>● Assurance {fmt(vent.assurance)}</span>
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.red }}>● Reste {fmt(vent.mutuelle)}</span>
      </div>
    </div>
  );
}
function Accordion({ title, right, children, defaultOpen = false }) {
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

function BaremeDetail({ bareme, limites, exclusions }) {
  return (
    <>
      {bareme.map((b, i) => (
        <div key={i} className="pt-3">
          <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2, marginBottom: 6 }}>{b.cat}</div>
          {b.items.map((row, j) => (
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

/* =================================================================
   PARCOURS DE SOUSCRIPTION EN LIGNE
================================================================= */
function SignaturePad({ onChange }) {
  const canvasRef = React.useRef(null);
  const drawingRef = React.useRef(false);
  const hasDrawnRef = React.useRef(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const start = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
    if (hasDrawnRef.current) onChange(true, canvasRef.current.toDataURL());
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
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

/* ------------------------------------------------------------------
   Composant partagé: Formulaire d'identité + gestion famille
   Utilisé par Onboarding (souscription) et Devis (simulation)
------------------------------------------------------------------- */
function SubscriberForm({ identite, setIdentite, identitePhoto, setIdentitePhoto, famille, setFamille, addBenef, setAddBenef, addFamille, removeFamille }) {
  const [showWebcam, setShowWebcam] = useState(false);
  const fileInputRef = useRef(null);
  const hasConjoint = famille.some((f) => f.lien === "Conjoint");
  return (
    <>
      <RealCameraFaceModal
        isOpen={showWebcam}
        onClose={() => setShowWebcam(false)}
        onVerified={() => {
          setIdentitePhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
          setShowWebcam(false);
        }}
      />
      <div className="px-5 space-y-3">
        <div className="flex flex-col items-center justify-center mb-1">
          <div className="relative mb-2">
            <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 80, height: 80, background: C.ivory, border: `2px dashed ${identitePhoto ? C.green : C.red}` }}>
              {identitePhoto ? <img src={identitePhoto} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={28} color={C.navy2} />}
            </div>
          </div>
          <div className="flex gap-2 mb-1">
            <button
              type="button"
              onClick={() => setShowWebcam(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2818] text-white text-xs font-bold hover:bg-[#1B4A34] transition-all cursor-pointer"
            >
              <Camera size={13} /> 1. Capture Caméra
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-bold hover:bg-stone-50 transition-all cursor-pointer"
            >
              <Upload size={13} /> 2. Importer Fichier
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setIdentitePhoto(URL.createObjectURL(f)); }} />
          </div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 10.5, color: identitePhoto ? C.green : C.red, textAlign: "center", marginBottom: 6, fontWeight: 600 }}>{identitePhoto ? "✓ Photo de profil enregistrée" : "Photo requise (capture caméra ou import fichier local)"}</div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nom *"><input style={inputStyle} value={identite.nom} onChange={(e) => setIdentite({ ...identite, nom: e.target.value })} placeholder="Nom" /></Field>
          <Field label="Prénom *"><input style={inputStyle} value={identite.prenom} onChange={(e) => setIdentite({ ...identite, prenom: e.target.value })} placeholder="Prénom" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date de naissance *"><input style={inputStyle} type="date" value={identite.naissance} onChange={(e) => setIdentite({ ...identite, naissance: e.target.value })} /></Field>
          <Field label="Sexe"><select style={inputStyle} value={identite.sexe} onChange={(e) => setIdentite({ ...identite, sexe: e.target.value })}><option>Masculin</option><option>Féminin</option></select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Profession"><input style={inputStyle} value={identite.profession} onChange={(e) => setIdentite({ ...identite, profession: e.target.value })} placeholder="Profession" /></Field>
          <Field label="Groupe sanguin"><select style={inputStyle} value={identite.groupeSanguin} onChange={(e) => setIdentite({ ...identite, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
        </div>
        <Field label="Alertes médicales (allergies, etc.)"><input style={inputStyle} value={identite.allergies} onChange={(e) => setIdentite({ ...identite, allergies: e.target.value })} placeholder="Ex : Allergique Pénicilline" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Téléphone *"><input style={inputStyle} value={identite.telephone} onChange={(e) => setIdentite({ ...identite, telephone: e.target.value })} placeholder="+243 81 000 00 00" /></Field>
          <Field label="Ville *"><select style={inputStyle} value={identite.ville} onChange={(e) => setIdentite({ ...identite, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
        </div>
        <Field label="Email"><input style={inputStyle} type="email" value={identite.email} onChange={(e) => setIdentite({ ...identite, email: e.target.value })} placeholder="email@domaine.cd" /></Field>
        <Field label="Adresse"><input style={inputStyle} value={identite.adresse} onChange={(e) => setIdentite({ ...identite, adresse: e.target.value })} placeholder="Adresse" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type de pièce d'identité"><select style={inputStyle} value={identite.typePiece} onChange={(e) => setIdentite({ ...identite, typePiece: e.target.value })}><option>Carte d'électeur</option><option>Passeport</option><option>Carte d'identité</option><option>Permis de conduire</option></select></Field>
          <Field label="N° de la pièce *"><input style={inputStyle} value={identite.numeroPieceIdentite} onChange={(e) => setIdentite({ ...identite, numeroPieceIdentite: e.target.value })} placeholder="N° de pièce" /></Field>
        </div>
        <Field label="Déclaration de santé (antécédents connus)"><textarea style={{ ...inputStyle, minHeight: 50, resize: "none" }} value={identite.declarationSante} onChange={(e) => setIdentite({ ...identite, declarationSante: e.target.value })} placeholder="Ex : Aucun antécédent notable" /></Field>

        <div className="mt-4">
          <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Ajoutez les membres de votre famille à couvrir (optionnel).</div>
          {famille.length > 0 && (
            <div className="space-y-2 mb-3">
              {famille.map((f) => (
                <Card key={f.id} className="p-3 flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-full overflow-hidden flex-shrink-0" style={{ width: 30, height: 30, background: C.ivory }}>
                    {f.photo ? <img src={f.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (f.lien === "Conjoint" ? <Heart size={14} color={C.navy2} /> : <Baby size={14} color={C.navy2} />)}
                  </div>
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{f.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{f.lien} · {f.naissance}</div></div>
                  <button onClick={() => removeFamille(f.id)}><Trash2 size={15} color={C.red} /></button>
                </Card>
              ))}
            </div>
          )}

          <Card className="p-4 space-y-3">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Ajouter un bénéficiaire</div>
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer flex-shrink-0">
                <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 44, height: 44, background: C.ivory, border: `1.5px dashed ${addBenef.photo ? C.green : C.red}` }}>
                  {addBenef.photo ? <img src={addBenef.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={16} color={C.navy2} />}
                </div>
                <input type="file" accept="image/*" capture="user" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) setAddBenef({ ...addBenef, photo: URL.createObjectURL(file) }); }} />
              </label>
              <span style={{ fontFamily: sans, fontSize: 10.5, color: addBenef.photo ? C.sub : C.red }}>Photo recommandée</span>
            </div>
            <Field label="Lien de parenté"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Autre</option></select></Field>
            <Field label="Nom complet"><input style={inputStyle} value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} placeholder="Nom et prénom" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date de naissance"><input style={inputStyle} type="date" value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
              <Field label="Sexe"><select style={inputStyle} value={addBenef.sexe} onChange={(e) => setAddBenef({ ...addBenef, sexe: e.target.value })}><option>Féminin</option><option>Masculin</option></select></Field>
            </div>
            <Field label="Lieu de naissance"><input style={inputStyle} value={addBenef.lieuNaissance} onChange={(e) => setAddBenef({ ...addBenef, lieuNaissance: e.target.value })} placeholder="Lieu" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone (pour son accès)"><input style={inputStyle} value={addBenef.telephone} onChange={(e) => setAddBenef({ ...addBenef, telephone: e.target.value })} placeholder="Téléphone" /></Field>
              <Field label="Groupe sanguin"><select style={inputStyle} value={addBenef.groupeSanguin} onChange={(e) => setAddBenef({ ...addBenef, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
            </div>
            <Field label="Adresse"><input style={inputStyle} value={addBenef.adresse} onChange={(e) => setAddBenef({ ...addBenef, adresse: e.target.value })} placeholder="Même adresse que le souscripteur si vide" /></Field>
            <button onClick={addFamille} disabled={!addBenef.nom || !addBenef.naissance} className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${(!addBenef.nom || !addBenef.naissance) ? C.line : C.navy}`, color: (!addBenef.nom || !addBenef.naissance) ? C.sub : C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter</button>
          </Card>
        </div>
      </div>
    </>
  );
}

const STEP_TITLES = ["Formule", "Identité", "Famille", "Documents", "Biométrie", "Prime", "Paiement", "Signature"];

function ProgressBar({ step }) {
  return (
    <div className="px-5 pt-3 pb-2">
      <div className="flex items-center gap-1.5">
        {STEP_TITLES.map((t, i) => <div key={i} className="flex-1 rounded-full" style={{ height: 4, background: i <= step ? C.gold : C.line, transition: "background .3s" }} />)}
      </div>
      <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 6 }}>Étape {step + 1} / {STEP_TITLES.length} — {STEP_TITLES[step]}</div>
    </div>
  );
}
function WizardNav({ onBack, onNext, nextLabel = "Continuer", disabled }) {
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

function Onboarding({ onFinish, onCancel, initial }) {
  const [step, setStep] = useState(initial?.startStep !== undefined ? initial.startStep : (initial?.formule ? 3 : 0));
  const [formule, setFormule] = useState(initial?.formule || null);
  const [expanded, setExpanded] = useState(null);
  const defaultIdentite = { nom: "", prenom: "", naissance: "", sexe: "Masculin", profession: "", telephone: "", ville: "Kinshasa", adresse: "", email: "", grade: "agent", typePiece: "Carte d'électeur", numeroPieceIdentite: "", declarationSante: "", groupeSanguin: "", allergies: "" };
  const [identite, setIdentite] = useState(initial?.identite ? { ...defaultIdentite, ...initial.identite } : defaultIdentite);
  const [identitePhoto, setIdentitePhoto] = useState("");
  const [famille, setFamille] = useState(initial?.famille || []);
  const [addBenef, setAddBenef] = useState({ lien: "Conjoint", nom: "", naissance: "", photo: "", sexe: "Féminin", lieuNaissance: "", telephone: "", adresse: "", groupeSanguin: "" });
  const [docs, setDocs] = useState({});
  const [faceFile, setFaceFile] = useState("");
  const [facesRegistered, setFacesRegistered] = useState({});
  const [paiement, setPaiement] = useState({ methode: "mobile", telephone: "" });
  const [payStatus, setPayStatus] = useState("idle");
  const [validationStatus, setValidationStatus] = useState("idle");
  const [signature, setSignature] = useState("");
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [signatureImg, setSignatureImg] = useState("");
  const [accepte, setAccepte] = useState(false);
  const [signing, setSigning] = useState(false);
  const [police, setPolice] = useState(null);

  const hasConjoint = famille.some((f) => f.lien === "Conjoint");
  const hasEnfant = famille.some((f) => f.lien === "Enfant");
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

  const addFamille = () => { if (!addBenef.nom || !addBenef.naissance || !addBenef.photo) return; setFamille([...famille, { ...addBenef, id: Date.now() }]); setAddBenef({ lien: "Conjoint", nom: "", naissance: "", photo: "", sexe: "Féminin", lieuNaissance: "", telephone: "", adresse: "", groupeSanguin: "" }); };
  const removeFamille = (id) => setFamille(famille.filter((f) => f.id !== id));
  const payer = () => { setPayStatus("loading"); setTimeout(() => setPayStatus("done"), 1300); };
  const submitForValidation = () => {
    if (validationStatus !== "idle") return;
    setValidationStatus("pending");
    setTimeout(() => setValidationStatus("approved"), 1600);
  };

  const signer = () => {
    if (!accepte || !signature.trim()) return;
    setSigning(true);
    setTimeout(() => {
      const num = Math.floor(100000 + Math.random() * 900000);
      const pol = `SP-KIN-${num}`, ctr = `CTR-SP-2026-${num}`;
      const today = new Date(), end = new Date(today); end.setFullYear(end.getFullYear() + 1);
      const dfmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      const iconFor = (lien) => (lien === "Conjoint" ? Heart : lien === "Enfant" ? Baby : ShieldCheck);
      const genPin = () => String(Math.floor(1000 + Math.random() * 9000));
      const benefsFull = [
        { id: "00", lien: "Assuré principal", nom: `${identite.nom} ${identite.prenom}`.trim() || "Assuré", naissance: identite.naissance || "—", carte: `${pol}-00`, icon: ShieldCheck, grade: identite.grade, photo: identitePhoto, faceRegistered: !!facesRegistered.principal, statutAffiliation: "Actif" },
        ...famille.map((f, i) => ({ id: String(i + 1).padStart(2, "0"), lien: f.lien, nom: f.nom, naissance: f.naissance, carte: `${pol}-${String(i + 1).padStart(2, "0")}`, icon: iconFor(f.lien), grade: "dependant", photo: f.photo || "", faceRegistered: !!facesRegistered[f.id], statutAffiliation: "Actif", sexe: f.sexe, lieuNaissance: f.lieuNaissance, telephone: f.telephone, adresse: f.adresse, groupeSanguin: f.groupeSanguin, acces: { identifiant: f.telephone || `${pol}-${String(i + 1).padStart(2, "0")}`, pin: genPin() } })),
      ];
      const garantiesArr = Object.entries(formule.garanties).map(([nom, plafond]) => ({ nom, plafond, consomme: 0 }));
      setPolice({
        compteType: "principal", vueCompteId: "00",
        assure: { nom: benefsFull[0].nom, profession: identite.profession, email: identite.email, ville: identite.ville, telephone: identite.telephone, sexe: identite.sexe, groupeSanguin: identite.groupeSanguin, allergies: identite.allergies, pieceIdentite: `${identite.typePiece} n° ${identite.numeroPieceIdentite}`, declarationSante: identite.declarationSante || "Aucun antécédent notable déclaré" },
        police: pol, contrat: ctr, formule, validite: `${dfmt(today)} — ${dfmt(end)}`, prime,
        beneficiaires: benefsFull, garanties: garantiesArr, histo: [], rdv: [], autresContrats: [],
        faceRegistered: !!faceFile, idMethode: faceFile ? "visage" : "qr",
        dossierMedical: { constantesVitales: {}, allergies: [], maladiesChroniques: [], traitementsEnCours: [], antecedentsChirurgicaux: [], antecedentsFamiliaux: [], visites: [] },
        paiements: buildEcheancier(partSalarie, 1), paiementsHistorique: [], moyensPaiement: [],
        notifications: [{ id: 1, type: "contrat", titre: "Bienvenue chez NeoGTec HealthCare", detail: "Votre contrat est actif", date: "Aujourd'hui", lue: false }],
        fidelite: { moisSansSinistre: 0, bonus: 0, prochainPalier: 12, bonusProchainPalier: 5 },
        langue: "Français", verrouillage: false,
        reseauSoins: "Ouvert", renouvellementTacite: true, cascadeProfil: "Complet",
        delaisCarence: [{ garantie: "Consultations & Pharmacie", jours: 0 }, { garantie: "Hospitalisation", jours: 30 }, { garantie: "Dentaire", jours: 60 }, { garantie: "Optique", jours: 60 }, { garantie: "Maternité", jours: 300 }],
      });
      setSigning(false); setStep(8);
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
            <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Identification à l'hôpital</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700 }}>{police.faceRegistered ? "Reconnaissance faciale" : "QR code"}</span></div>
          </Card>
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Bénéficiaires inscrits ({police.beneficiaires.length})</div>
            {police.beneficiaires.map((b) => <div key={b.id} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{b.nom} <span style={{ color: C.sub }}>· {gradeLabel(b.grade)}</span></span><span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{b.carte}</span></div>)}
          </Card>
          {police.beneficiaires.length > 1 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2"><MessageSquare size={14} color={C.green} /><span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Comptes ayants droit créés</span></div>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginBottom: 8 }}>Un accès par défaut a été généré pour chaque ayant droit et envoyé par SMS et WhatsApp au numéro du souscripteur.</div>
              {police.beneficiaires.filter((b) => b.id !== "00").map((b) => (
                <div key={b.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}>
                  <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{b.nom}</span>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: C.gold }}>{b.acces?.identifiant} · PIN {b.acces?.pin}</span>
                </div>
              ))}
            </Card>
          )}
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
      {initial && (
        <div className="px-5 pb-1">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: C.goldSoft }}>
            <FilePlus size={13} color={C.navy} /><span style={{ fontFamily: sans, fontSize: 11, color: C.navy, fontWeight: 600 }}>Devis repris — vos informations sont déjà pré-remplies</span>
          </div>
        </div>
      )}
      <ProgressBar step={step} />

      {/* STEP 0 — FORMULE (avec détail complet) */}
      {step === 0 && (
        <>
          <div className="px-5 space-y-3">
            {FORMULES.map((f) => {
              const selected = formule?.id === f.id;
              const exemplePrime = f.primeBase + 4 * f.primeParBenef;
              const isOpen = expanded === f.id;
              return (
                <Card key={f.id} style={{ border: selected ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
                  <button onClick={() => setFormule(f)} className="w-full text-left p-4">
                    <div className="flex items-center justify-between">
                      <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.navy }}>{f.nom}</div>
                      {f.recommande && <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.navy, background: C.goldSoft, padding: "2px 8px", borderRadius: 999 }}>RECOMMANDÉ</span>}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginTop: 2 }}>{f.tagline}</div>
                    <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginTop: 10 }}>À partir de <span style={{ fontFamily: mono, fontWeight: 700, color: C.gold }}>{fmt(f.primeBase)}</span>/an (assuré seul)</div>
                    <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Ex. famille de 5 : {fmt(exemplePrime)}/an</div>
                  </button>
                  <button onClick={() => setExpanded(isOpen ? null : f.id)} className="w-full flex items-center justify-center gap-1.5 py-2.5" style={{ borderTop: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}>
                    {isOpen ? "Masquer le détail complet" : "Voir le détail complet de la formule"} <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 6 }}>Garanties, taux et plafonds détaillés par acte</div>
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

      {/* STEP 1 — IDENTITÉ + FAMILLE (UNIFIÉ via SubscriberForm) */}
      {step === 1 && (
        <>
          <SubscriberForm
            identite={identite}
            setIdentite={setIdentite}
            identitePhoto={identitePhoto}
            setIdentitePhoto={setIdentitePhoto}
            famille={famille}
            setFamille={setFamille}
            addBenef={addBenef}
            setAddBenef={setAddBenef}
            addFamille={addFamille}
            removeFamille={removeFamille}
          />
          <WizardNav onBack={() => setStep(0)} onNext={() => setStep(3)} disabled={!identite.nom || !identite.prenom || !identite.naissance || !identite.telephone || !identite.ville || !identite.numeroPieceIdentite || !identitePhoto} />
        </>
      )}

      {/* STEP 2 — FAMILLE */}
      {step === 2 && (
        <>
          <div className="px-5">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Ajoutez les membres de votre famille à couvrir (taux automatique Dépendant — 70%). Vous pouvez passer cette étape si vous souscrivez seul(e).</div>
            {famille.length > 0 && (
              <div className="space-y-2 mb-3">
                {famille.map((f) => (
                  <Card key={f.id} className="p-3 flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full overflow-hidden flex-shrink-0" style={{ width: 30, height: 30, background: C.ivory }}>
                      {f.photo ? <img src={f.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (f.lien === "Conjoint" ? <Heart size={14} color={C.navy2} /> : <Baby size={14} color={C.navy2} />)}
                    </div>
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{f.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{f.lien} · {f.naissance}</div></div>
                    <button onClick={() => removeFamille(f.id)}><Trash2 size={15} color={C.red} /></button>
                  </Card>
                ))}
              </div>
            )}
            <Card className="p-4 space-y-3">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Ajouter un bénéficiaire</div>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-shrink-0">
                  <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 44, height: 44, background: C.ivory, border: `1.5px dashed ${addBenef.photo ? C.green : C.red}` }}>
                    {addBenef.photo ? <img src={addBenef.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={16} color={C.navy2} />}
                  </div>
                  <input type="file" accept="image/*" capture="user" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) setAddBenef({ ...addBenef, photo: URL.createObjectURL(file) }); }} />
                </label>
                <span style={{ fontFamily: sans, fontSize: 10.5, color: addBenef.photo ? C.sub : C.red }}>Photo obligatoire (utilisée aussi pour sa reconnaissance faciale)</span>
              </div>
              <Field label="Lien de parenté"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Autre</option></select></Field>
              <Field label="Nom complet"><input style={inputStyle} value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} placeholder="Nom et prénom" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date de naissance"><input style={inputStyle} type="date" value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
                <Field label="Sexe"><select style={inputStyle} value={addBenef.sexe} onChange={(e) => setAddBenef({ ...addBenef, sexe: e.target.value })}><option>Féminin</option><option>Masculin</option></select></Field>
              </div>
              <Field label="Lieu de naissance"><input style={inputStyle} value={addBenef.lieuNaissance} onChange={(e) => setAddBenef({ ...addBenef, lieuNaissance: e.target.value })} placeholder="Kinshasa" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Téléphone (pour son accès)"><input style={inputStyle} value={addBenef.telephone} onChange={(e) => setAddBenef({ ...addBenef, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
                <Field label="Groupe sanguin"><select style={inputStyle} value={addBenef.groupeSanguin} onChange={(e) => setAddBenef({ ...addBenef, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
              </div>
              <Field label="Adresse"><input style={inputStyle} value={addBenef.adresse} onChange={(e) => setAddBenef({ ...addBenef, adresse: e.target.value })} placeholder="Même adresse que le souscripteur si vide" /></Field>
              <button onClick={addFamille} disabled={!addBenef.nom || !addBenef.naissance || !addBenef.photo} className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${(!addBenef.nom || !addBenef.naissance || !addBenef.photo) ? C.line : C.navy}`, color: (!addBenef.nom || !addBenef.naissance || !addBenef.photo) ? C.sub : C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter à la police</button>
            </Card>
          </div>
          <WizardNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel={famille.length ? "Continuer" : "Passer cette étape"} />
        </>
      )}

      {/* STEP 3 — DOCUMENTS */}
      {step === 3 && (
        <>
          <div className="px-5">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Téléversez les pièces justificatives nécessaires à l'activation de votre contrat.</div>
            <div className="space-y-2">
              {requiredDocs.map((d) => (
                <Card key={d.key} className="p-3.5 flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: docs[d.key] ? C.greenSoft : C.ivory }}>{docs[d.key] ? <Check size={16} color={C.green} /> : <UserCheck size={16} color={C.navy2} />}</div>
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{d.label}{!d.required && <span style={{ color: C.sub, fontWeight: 400 }}> (optionnel)</span>}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: docs[d.key] ? C.green : C.sub }}>{docs[d.key] || (d.required ? "Requis" : "Facultatif")}</div></div>
                  <label className="flex items-center justify-center rounded-full cursor-pointer flex-shrink-0" style={{ width: 34, height: 34, background: C.navy }}><Upload size={14} color="white" /><input type="file" hidden onChange={(e) => setDocs({ ...docs, [d.key]: e.target.files?.[0]?.name || "Fichier ajouté" })} /></label>
                </Card>
              ))}
            </div>
          </div>
          <WizardNav onBack={() => setStep(2)} onNext={() => setStep(4)} disabled={!docsOk} />
        </>
      )}

      {/* STEP 4 — BIOMÉTRIE FACIALE (souscripteur + ayants droit) */}
      {step === 4 && (
        <>
          <div className="px-5">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Activez la reconnaissance faciale pour vous-même et chaque ayant droit. Elle permet l'identification directe à l'hôpital, sans carte ni QR code.</div>

            {[{ key: "principal", nom: `${identite.prenom} ${identite.nom}`.trim() || "Vous (assuré principal)", photo: identitePhoto }, ...famille.map((f) => ({ key: f.id, nom: f.nom, photo: f.photo }))].map((p) => {
              const registered = !!facesRegistered[p.key];
              return (
                <Card key={p.key} className="p-3.5 flex items-center gap-3 mb-2">
                  <label className="relative cursor-pointer flex-shrink-0">
                    <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 46, height: 46, background: registered ? C.greenSoft : C.ivory, border: `2px dashed ${registered ? C.green : C.line}` }}>
                      {p.photo ? <img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ScanFace size={18} color={registered ? C.green : C.navy2} />}
                    </div>
                    <input type="file" accept="image/*" capture="user" hidden onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      if (p.key === "principal") setIdentitePhoto(url);
                      else setFamille(famille.map((f) => (f.id === p.key ? { ...f, photo: url } : f)));
                    }} />
                  </label>
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{p.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: registered ? C.green : C.sub }}>{registered ? "Visage enregistré" : "Non enregistré"}</div></div>
                  <button onClick={() => { setFacesRegistered({ ...facesRegistered, [p.key]: !registered }); if (p.key === "principal") setFaceFile(!registered ? "selfie.jpg" : ""); }} className="rounded-full px-3 py-1.5" style={{ background: registered ? "white" : C.navy, color: registered ? C.navy : "white", border: registered ? `1px solid ${C.navy}` : "none", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>
                    {registered ? "Désactiver" : "Activer"}
                  </button>
                </Card>
              );
            })}

            <div className="flex items-start gap-2 mt-3"><Fingerprint size={14} color={C.sub} style={{ marginTop: 2 }} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Vos données biométriques sont chiffrées et utilisées uniquement pour la vérification d'identité au sein du réseau conventionné.</span></div>
          </div>
          <WizardNav onBack={() => setStep(3)} onNext={() => setStep(5)} nextLabel={faceFile ? "Continuer" : "Configurer plus tard"} />
        </>
      )}

      {/* STEP 5 — PRIME */}
      {step === 5 && (
        <>
          <div className="px-5">
            <Card className="p-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Prime annuelle estimée</div>
              <div style={{ fontFamily: serif, fontSize: 28, color: "white", marginTop: 4 }}>{fmt(prime)}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: "#B9C3D6", marginTop: 2 }}>{formule?.nom} · {1 + totalBenef} bénéficiaire(s) · vous : {gradeLabel(identite.grade)} ({tauxFor(identite.grade)}%)</div>
            </Card>
            <Card className="p-4 mt-3">
              <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Base assuré principal</span><span style={{ fontFamily: mono, fontSize: 12 }}>{fmt(formule?.primeBase)}</span></div>
              <div className="flex items-center justify-between py-1.5"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{totalBenef} bénéficiaire(s) additionnel(s)</span><span style={{ fontFamily: mono, fontSize: 12 }}>{fmt(totalBenef * (formule?.primeParBenef || 0))}</span></div>
            </Card>
          </div>
          <WizardNav onBack={() => setStep(4)} onNext={() => setStep(6)} nextLabel="Passer au paiement" />
        </>
      )}

      {/* STEP 6 — PAIEMENT */}
      {step === 6 && (
        <>
          <div className="px-5">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Réglez votre quote-part de <b style={{ color: C.ink }}>{fmt(partSalarie)}</b> pour activer le contrat.</div>
            {validationStatus !== "approved" && (
              <Card className="p-4 mb-3 border border-amber-300 bg-amber-50/80">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
                    <Clock size={20} className={validationStatus === "pending" ? "animate-spin" : ""} />
                  </div>
                  <div>
                    <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.navy }}>
                      {validationStatus === "pending" ? "Formulaire sous vérification par un administrateur" : "Validation administrative requise"}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 4 }}>
                      {validationStatus === "pending"
                        ? "Votre dossier est actuellement sous examen par nos services administratifs. L'accès au paiement sera débloqué automatiquement dès la confirmation accordée."
                        : "Votre dossier doit faire l'objet d'une vérification préalable par le service de souscription avant de pouvoir procéder au paiement."}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200 flex flex-col gap-2">
                  {validationStatus === "idle" && (
                    <button
                      onClick={submitForValidation}
                      className="w-full rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs bg-[#0D2818] text-white shadow"
                    >
                      <ShieldCheck size={16} /> Soumettre mon dossier pour validation
                    </button>
                  )}
                  {validationStatus === "pending" && (
                    <button
                      onClick={() => setValidationStatus("approved")}
                      className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs bg-[#C6992E] text-[#0D2818] shadow hover:bg-[#b08726] transition-all"
                    >
                      <CheckCircle2 size={16} /> Simuler l'approbation administrative immédiate
                    </button>
                  )}
                </div>
              </Card>
            )}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[['mobile', 'Mobile Money', Smartphone], ['carte', 'Carte bancaire', CreditCard], ['virement', 'Virement', Landmark]].map(([id, label, Icon]) => (
                <button key={id} onClick={() => setPaiement({ ...paiement, methode: id })}>
                  <Card className="p-3 flex flex-col items-center gap-1.5" style={{ border: paiement.methode === id ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}><Icon size={18} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, color: C.ink, textAlign: "center" }}>{label}</span></Card>
                </button>
              ))}
            </div>
            {paiement.methode === "mobile" && <Field label="Numéro Mobile Money"><input style={inputStyle} value={paiement.telephone} onChange={(e) => setPaiement({ ...paiement, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>}
            {payStatus === "idle" && <button onClick={payer} disabled={validationStatus !== "approved"} className="w-full rounded-xl py-3 mt-3 flex items-center justify-center gap-2" style={{ background: validationStatus !== "approved" ? "#C9CDD6" : C.gold, color: validationStatus !== "approved" ? C.sub : C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}>{validationStatus !== "approved" ? "Paiement disponible après validation" : `Payer ${fmt(partSalarie)}`}</button>}
            {payStatus === "loading" && <Card className="p-6 mt-3 flex flex-col items-center gap-2"><Loader2 size={24} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Confirmation du paiement…</span></Card>}
            {validationStatus !== "approved" && validationStatus !== "pending" && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 10 }}>La validation administrative garantit que les pièces fournies sont conformes avant règlement.</div>}
            {validationStatus === "approved" && payStatus === "idle" && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.green, marginTop: 10 }}>Dossier validé — vous pouvez maintenant procéder au paiement.</div>}
            {payStatus === "done" && (
              <Card className="p-5 flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: C.greenSoft }}><Check size={20} color={C.green} /></div>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Paiement confirmé</div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{fmt(partSalarie)} reçus via {paiement.methode === "mobile" ? "Mobile Money" : paiement.methode === "carte" ? "carte bancaire" : "virement"}</div>
              </Card>
            )}
          </div>
          <WizardNav onBack={() => setStep(5)} onNext={() => setStep(7)} disabled={payStatus !== "done"} nextLabel="Continuer vers la signature" />
        </>
      )}

      {/* STEP 7 — SIGNATURE */}
      {step === 7 && (
        <>
          <div className="px-5">
            <Card className="p-4 mb-3"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Récapitulatif avant signature</div><div style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{identite.prenom} {identite.nom} · {formule?.nom} · {1 + totalBenef} bénéficiaire(s) · {fmt(prime)}/an</div></Card>
            <label className="flex items-start gap-2 mb-3"><input type="checkbox" checked={accepte} onChange={(e) => setAccepte(e.target.checked)} style={{ marginTop: 3 }} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Je certifie l'exactitude des informations fournies et j'accepte les Conditions Générales du Contrat CIMA NeoGTec HealthCare.</span></label>
            <Field label="Signature électronique — tapez votre nom complet"><input style={{ ...inputStyle, fontFamily: serif, fontSize: 16 }} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={`${identite.prenom} ${identite.nom}`} /></Field>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 6, textTransform: "uppercase" }}>Signez ici avec votre doigt ou un stylet *</div>
              <SignaturePad onChange={(drawn, img) => { setSignatureDrawn(drawn); setSignatureImg(img); }} />
              {signatureDrawn && <div className="flex items-center gap-1.5 mt-1.5"><Check size={12} color={C.green} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.green, fontWeight: 700 }}>Signature enregistrée</span></div>}
            </div>
            <div className="flex items-center gap-2 mt-2" style={{ color: C.sub }}><PenLine size={12} /><span style={{ fontFamily: sans, fontSize: 10.5 }}>Valeur juridique équivalente à une signature manuscrite (art. loi RDC sur la signature électronique).</span></div>
          </div>
          <div className="px-5 mt-3">
            <button onClick={signer} disabled={!accepte || !signature.trim() || !signatureDrawn || signing} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: (!accepte || !signature.trim() || !signatureDrawn) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>
              {signing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={15} color={C.gold} />}{signing ? "Activation du contrat…" : "Signer et activer mon contrat"}
            </button>
            <button onClick={() => setStep(6)} className="w-full text-center py-2 mt-1" style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Retour</button>
          </div>
        </>
      )}
    </div>
  );
}

/* =================================================================
   DEVIS EN LIGNE — simulation tarifaire détaillée
================================================================= */
function Devis({ onBack, onSouscrire, notify }) {
  const [step, setStep] = useState(0);
  const [profil, setProfil] = useState({ nom: "", prenom: "", naissance: "", sexe: "Masculin", ville: "Kinshasa", profession: "", email: "", telephone: "", adresse: "", typePiece: "Carte d'électeur", numeroPieceIdentite: "", groupeSanguin: "", allergies: "", declarationSante: "", antecedents: [] });
  const [famille, setFamille] = useState([]);
  const [addBenef, setAddBenef] = useState({ lien: "Conjoint", nom: "", naissance: "" });
  const [formuleChoisie, setFormuleChoisie] = useState(null);
  const [compareSel, setCompareSel] = useState(null);
  const [ref, setRef] = useState(null);

  const addFamille = () => { if (!addBenef.nom || !addBenef.naissance) return; setFamille([...famille, { ...addBenef, id: Date.now() }]); setAddBenef({ lien: "Conjoint", nom: "", naissance: "" }); };
  const removeFamille = (id) => setFamille(famille.filter((f) => f.id !== id));
  const totalBenef = famille.length;
  const ageFromBirth = (d) => {
    if (!d) return 0; const b = new Date(d); const diff = Date.now() - b.getTime(); return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };
  const ageComputed = ageFromBirth(profil.naissance);
  const majorationPct = computeMajorationSante(ageComputed, profil.antecedents);

  const choisirFormule = (f) => {
    const num = Math.floor(100000 + Math.random() * 900000);
    const today = new Date(); const validite = new Date(today); validite.setDate(validite.getDate() + 30);
    const dfmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    setRef({ numero: `DEV-2026-${num}`, emission: dfmt(today), validite: dfmt(validite) });
    setFormuleChoisie(f);
    setStep(3);
  };

  const devis = formuleChoisie ? computeDevis(formuleChoisie, totalBenef, majorationPct) : null;

  const telechargerDevis = () => {
    const lignes = [
      `DEVIS D'ASSURANCE SANTÉ — NEOGTEC HEALTHCARE`,
      `Référence : ${ref.numero}`,
      `Date d'émission : ${ref.emission}     Valable jusqu'au : ${ref.validite}`,
      ``,
      `SOUSCRIPTEUR PRESSENTI`,
      `Nom : ${profil.prenom} ${profil.nom}`,
      `Profession : ${profil.profession || "—"}   Âge : ${ageComputed || "—"}`,
      `Ville : ${profil.ville}   Antécédents médicaux : ${profil.antecedents.length ? profil.antecedents.join(", ") : "Aucun"}`,
      `Contact : ${profil.telephone || "—"} / ${profil.email || "—"}`,
      ``,
      `COMPOSITION FAMILIALE (${1 + totalBenef} bénéficiaire(s))`,
      `- Assuré principal : ${profil.prenom} ${profil.nom}`,
      ...famille.map((f) => `- ${f.lien} : ${f.nom} (${f.naissance}) — Dépendant 70%`),
      ``,
      `FORMULE SIMULÉE : ${formuleChoisie.nom}`,
      `${formuleChoisie.tagline}`,
      ...CATEGORIES.map((c) => `  ${c} : ${formuleChoisie.taux[c]}% — plafond ${fmt(formuleChoisie.garanties[c])}`),
      ``,
      `EXCLUSIONS PRINCIPALES`,
      ...EXCLUSIONS.map((e) => `- ${e}`),
      ``,
      `CASCADE DE PAIEMENT APPLICABLE`,
      ...CASCADE.map((c) => `${c.ordre}. ${c.payeur} — ${c.taux}`),
      ``,
      `CALCUL DE LA PRIME ANNUELLE`,
      `Prime de base (assuré principal) : ${fmt(devis.primeBase)}`,
      `Prime bénéficiaires additionnels (${totalBenef}) : ${fmt(devis.primeBenef)}`,
      ...(devis.majoration > 0 ? [`Majoration état de santé (+${devis.majorationPct}%) : ${fmt(devis.majoration)}`] : []),
      `Sous-total : ${fmt(devis.sousTotal)}`,
      `Taxe unique sur contrats d'assurance (2%) : ${fmt(devis.taxe)}`,
      `PRIME TOTALE ANNUELLE TTC : ${fmt(devis.primeTotale)}`,
      ``,
      `Répartition employeur (80%) : ${fmt(devis.partEmployeur)}`,
      `Quote-part salarié (20%) : ${fmt(devis.partSalarie)}`,
      `Équivalent trimestriel : ${fmt(devis.trimestriel)}   Équivalent mensuel : ${fmt(devis.mensuel)}`,
      ``,
      `Ce devis est une simulation non engageante, valable 30 jours, sous réserve de l'acceptation du dossier et des pièces justificatives. Tarif susceptible d'ajustement selon les déclarations de santé. Régi par le Code des Assurances CIMA.`,
    ];
    downloadText(`Devis_${ref.numero}.txt`, lignes.join("\n"));
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-1 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Faire un devis</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Simulation gratuite et sans engagement</div></div>
      </div>

      {step < 3 && (
        <div className="px-5 pt-3 pb-1">
          <div className="flex items-center gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="flex-1 rounded-full" style={{ height: 4, background: i <= step ? C.gold : C.line }} />)}</div>
          <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 6 }}>{["Votre profil", "Votre famille", "Comparer les formules"][step]}</div>
        </div>
      )}

      {/* STEP 0 — PROFIL (unifié via SubscriberForm) */}
      {step === 0 && (
        <>
          <SubscriberForm
            identite={profil}
            setIdentite={setProfil}
            identitePhoto={null}
            setIdentitePhoto={() => { }}
            famille={famille}
            setFamille={setFamille}
            addBenef={addBenef}
            setAddBenef={setAddBenef}
            addFamille={addFamille}
            removeFamille={removeFamille}
          />

          <Field label="Antécédents médicaux (impacte le tarif)">
            <div className="flex flex-wrap gap-1.5">
              {ANTECEDENTS_DEVIS.map((a) => {
                const checked = profil.antecedents.includes(a);
                return (
                  <button key={a} type="button" onClick={() => setProfil({ ...profil, antecedents: checked ? profil.antecedents.filter((x) => x !== a) : [...profil.antecedents, a] })} className="rounded-full px-2.5 py-1.5" style={{ background: checked ? C.navy : C.ivory, color: checked ? "white" : C.ink, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{a}</button>
                );
              })}
            </div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Aucun antécédent sélectionné = tarif standard.</div>
          </Field>

          <WizardNav onNext={() => setStep(1)} disabled={!profil.nom || !profil.prenom} />
        </>
      )}

      {/* STEP 1 — FAMILLE */}
      {step === 1 && (
        <>
          <div className="px-5 mt-2">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Ajoutez les membres de votre famille pour un devis précis (taux Dépendant automatique — 70%).</div>
            {famille.length > 0 && (
              <div className="space-y-2 mb-3">
                {famille.map((f) => (
                  <Card key={f.id} className="p-3 flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: C.ivory }}>{f.lien === "Conjoint" ? <Heart size={14} color={C.navy2} /> : <Baby size={14} color={C.navy2} />}</div>
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{f.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{f.lien} · {f.naissance}</div></div>
                    <button onClick={() => removeFamille(f.id)}><Trash2 size={15} color={C.red} /></button>
                  </Card>
                ))}
              </div>
            )}
            <Card className="p-4 space-y-3">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Ajouter un bénéficiaire</div>
              <Field label="Lien de parenté"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Autre</option></select></Field>
              <Field label="Nom complet"><input style={inputStyle} value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} placeholder="Nom et prénom" /></Field>
              <Field label="Date de naissance"><input style={inputStyle} type="date" value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
              <button onClick={addFamille} className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter à la simulation</button>
            </Card>
          </div>
          <WizardNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextLabel={famille.length ? "Comparer les formules" : "Passer — comparer les formules"} />
        </>
      )}

      {/* STEP 2 — COMPARATIF DES FORMULES */}
      {step === 2 && (
        <div className="px-5 mt-2 pb-4">
          <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, marginBottom: 10 }}>Choisissez librement la formule à comparer — aucune n'est imposée.</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {FORMULES.map((f) => (
              <button key={f.id} onClick={() => setCompareSel(f.id)} className="rounded-full px-3 py-2" style={{ background: compareSel === f.id ? C.navy : "white", color: compareSel === f.id ? "white" : C.ink, border: `1px solid ${compareSel === f.id ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
                {f.nom}{f.recommande ? " ★" : ""}
              </button>
            ))}
          </div>
          {!compareSel && (
            <Card className="p-6 text-center"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Sélectionnez une formule ci-dessus pour voir son détail et son tarif.</span></Card>
          )}
          {compareSel && (() => {
            const f = FORMULES.find((x) => x.id === compareSel);
            const d = computeDevis(f, totalBenef, majorationPct);
            return (
              <Card className="p-4" style={{ border: `2px solid ${C.gold}` }}>
                <div className="flex items-center justify-between">
                  <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 700, color: C.navy }}>{f.nom}</div>
                  {f.recommande && <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.navy, background: C.goldSoft, padding: "2px 8px", borderRadius: 999 }}>RECOMMANDÉ</span>}
                </div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, marginTop: 2 }}>{f.tagline}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Prime annuelle TTC</div><div style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, color: C.gold }}>{fmt(d.primeTotale)}</div></div>
                  <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Quote-part salarié</div><div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.ink }}>{fmt(d.partSalarie)}</div></div>
                </div>
                <button onClick={() => choisirFormule(f)} className="w-full rounded-xl py-2.5 mt-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>Obtenir le devis détaillé pour {f.nom} <ChevronRight size={14} /></button>
              </Card>
            );
          })()}
          <button onClick={() => setStep(1)} className="w-full text-center py-2 mt-2" style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Retour</button>
        </div>
      )}

      {/* STEP 3 — DOCUMENT DE DEVIS COMPLET */}
      {step === 3 && devis && (
        <div className="px-5 mt-2 pb-4">
          <Card className="p-4 mb-3" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
            <div className="flex items-center justify-between">
              <div><div style={{ fontFamily: sans, fontSize: 10, color: "#B9C3D6", textTransform: "uppercase" }}>Devis n°</div><div style={{ fontFamily: mono, fontSize: 14, color: "white", fontWeight: 700 }}>{ref.numero}</div></div>
              <Calculator size={20} color={C.gold} />
            </div>
            <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>Émis le {ref.emission}</span><span style={{ fontFamily: sans, fontSize: 11, color: C.gold, fontWeight: 700 }}>Valable jusqu'au {ref.validite}</span></div>
          </Card>

          <SectionLabel>Souscripteur pressenti</SectionLabel>
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{profil.prenom} {profil.nom}</div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{profil.profession || "—"} {ageComputed ? `· ${ageComputed} ans` : ""}</div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{profil.ville}</div>
            {profil.antecedents.length > 0 && <div style={{ fontFamily: sans, fontSize: 11, color: C.amber, marginTop: 4 }}>Antécédents déclarés : {profil.antecedents.join(", ")}</div>}
          </Card>

          <SectionLabel>Composition familiale ({1 + totalBenef})</SectionLabel>
          <Card className="p-4 space-y-1.5">
            <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{profil.prenom} {profil.nom} (principal)</span><span style={{ fontFamily: mono, fontSize: 10.5, color: C.gold }}>80%</span></div>
            {famille.map((f) => <div key={f.id} className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{f.nom} ({f.lien})</span><span style={{ fontFamily: mono, fontSize: 10.5, color: C.gold }}>70%</span></div>)}
          </Card>

          <SectionLabel>Formule simulée — {formuleChoisie.nom}</SectionLabel>
          <Card className="p-4">
            {CATEGORIES.map((cat, i) => (
              <div key={cat} className="flex items-center justify-between py-1.5" style={{ borderBottom: i < CATEGORIES.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{cat}</span>
                <span style={{ fontFamily: mono, fontSize: 11.5, color: C.gold, fontWeight: 700 }}>{formuleChoisie.taux[cat]}%</span>
                <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{fmt(formuleChoisie.garanties[cat])}</span>
              </div>
            ))}
          </Card>

          <Accordion title="Exclusions principales" right={<AlertCircle size={13} color={C.red} />}>
            <ul className="pt-3 space-y-1.5">{EXCLUSIONS.map((e, i) => <li key={i} style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>– {e}</li>)}</ul>
          </Accordion>
          <Accordion title="Cascade de paiement applicable">
            <div className="pt-3 space-y-2">{CASCADE.map((c) => <div key={c.ordre} className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{c.ordre}. {c.payeur}</span><span style={{ fontFamily: mono, fontSize: 11, color: C.gold }}>{c.taux}</span></div>)}</div>
          </Accordion>

          <SectionLabel>Calcul détaillé de la prime</SectionLabel>
          <Card className="p-4">
            <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Prime de base (principal)</span><span style={{ fontFamily: mono, fontSize: 12 }}>{fmt(devis.primeBase)}</span></div>
            <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Bénéficiaires additionnels ({totalBenef})</span><span style={{ fontFamily: mono, fontSize: 12 }}>{fmt(devis.primeBenef)}</span></div>
            {devis.majoration > 0 && <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.amber }}>Majoration état de santé (+{devis.majorationPct}%)</span><span style={{ fontFamily: mono, fontSize: 12, color: C.amber }}>{fmt(devis.majoration)}</span></div>}
            <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Sous-total</span><span style={{ fontFamily: mono, fontSize: 12 }}>{fmt(devis.sousTotal)}</span></div>
            <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Taxe unique CIMA (2%)</span><span style={{ fontFamily: mono, fontSize: 12 }}>{fmt(devis.taxe)}</span></div>
            <div className="flex items-center justify-between py-2"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.navy }}>Prime totale annuelle TTC</span><span style={{ fontFamily: mono, fontSize: 15, fontWeight: 800, color: C.gold }}>{fmt(devis.primeTotale)}</span></div>
          </Card>
          <Card className="p-4 mt-2">
            <div className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Part employeur (80%)</span><span style={{ fontFamily: mono, fontSize: 11.5, color: C.green, fontWeight: 700 }}>{fmt(devis.partEmployeur)}</span></div>
            <div className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Quote-part salarié (20%)</span><span style={{ fontFamily: mono, fontSize: 12, color: C.gold, fontWeight: 700 }}>{fmt(devis.partSalarie)}</span></div>
            <div className="flex items-center justify-between py-1" style={{ borderTop: `1px solid ${C.line}`, marginTop: 4, paddingTop: 8 }}><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Équivalent trimestriel</span><span style={{ fontFamily: mono, fontSize: 11, color: C.ink }}>{fmt(devis.trimestriel)}</span></div>
            <div className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Équivalent mensuel</span><span style={{ fontFamily: mono, fontSize: 11, color: C.ink }}>{fmt(devis.mensuel)}</span></div>
          </Card>

          <Card className="p-3 mt-3" style={{ background: C.ivory, border: "none" }}>
            <div className="flex items-start gap-2"><BadgePercent size={14} color={C.sub} style={{ marginTop: 1, flexShrink: 0 }} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Simulation non engageante, valable 30 jours, sous réserve de l'acceptation du dossier et des pièces justificatives. Tarif susceptible d'ajustement selon les déclarations de santé. Régi par le Code des Assurances CIMA.</span></div>
          </Card>

          <div className="space-y-2 mt-4">
            <button onClick={telechargerDevis} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><Download size={15} /> Télécharger le devis</button>
            {profil.email && <button onClick={() => notify(`Devis envoyé à ${profil.email}`)} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.line}`, color: C.ink, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><Share2 size={14} /> Envoyer à {profil.email}</button>}
            {onSouscrire ? (
              <button onClick={() => onSouscrire({ formule: formuleChoisie, identite: { nom: profil.nom, prenom: profil.prenom, naissance: "", profession: profil.profession, telephone: profil.telephone, ville: profil.ville, adresse: "", email: profil.email }, famille })}
                className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}>
                <Sparkles size={15} /> Souscrire avec ce devis
              </button>
            ) : (
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, textAlign: "center", padding: "6px 0" }}>Contactez votre gestionnaire pour convertir cette simulation en avenant.</div>
            )}
            <button onClick={() => { setStep(2); setFormuleChoisie(null); }} className="w-full text-center py-2 flex items-center justify-center gap-1.5" style={{ fontFamily: sans, fontSize: 12, color: C.sub }}><RefreshCw size={12} /> Comparer une autre formule</button>
          </div>
        </div>
      )}
    </div>
  );
}


/* =================================================================
   AUTHENTIFICATION — Sign Up puis Sign In (obligatoire avant l'app)
================================================================= */
function SignUp({ onDone, onGoSignIn }) {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", motDePasse: "", confirmation: "" });
  const [erreur, setErreur] = useState("");
  const valider = () => {
    if (!form.nom || !form.email || !form.telephone || !form.motDePasse) { setErreur("Veuillez remplir tous les champs."); return; }
    if (form.motDePasse.length < 6) { setErreur("Le mot de passe doit contenir au moins 6 caractères."); return; }
    if (form.motDePasse !== form.confirmation) { setErreur("Les mots de passe ne correspondent pas."); return; }
    setErreur("");
    onDone(form);
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)`, fontFamily: sans }}>
      <div className="w-full max-w-lg bg-[#0D2818]/95 border border-[#C6992E]/40 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 overflow-hidden text-white">
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center text-[#C6992E] shadow-inner">
                <ShieldCheck size={22} color={C.gold} />
              </div>
              <div>
                <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: C.gold, letterSpacing: 1.5, textTransform: "uppercase" }} className="block">
                  NeoGTec insur
                </span>
                <span className="text-xs text-[#B9C3D6] font-medium">Espace Assuré & Ayants Droit</span>
              </div>
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 22, color: "white", fontWeight: 700 }}>
              Créer mon compte Assuré
            </h2>
            <p style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", marginTop: 4 }}>
              Accédez à vos garanties, cartes de santé et demandes de remboursement.
            </p>
          </div>

          <div className="space-y-3.5 mb-6">
            <div>
              <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                NOM COMPLET
              </label>
              <div className="relative">
                <input
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(198,153,46,0.3)", color: "white", fontFamily: sans, fontSize: 13, outline: "none" }}
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Jean-Paul Mukendi"
                />
                <ShieldCheck size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                ADRESSE EMAIL
              </label>
              <div className="relative">
                <input
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(198,153,46,0.3)", color: "white", fontFamily: sans, fontSize: 13, outline: "none" }}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jean.paul@email.com"
                />
                <Mail size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                NUMÉRO DE TÉLÉPHONE
              </label>
              <div className="relative">
                <input
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(198,153,46,0.3)", color: "white", fontFamily: sans, fontSize: 13, outline: "none" }}
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  placeholder="+243 81 000 0000"
                />
                <Phone size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                MOT DE PASSE
              </label>
              <div className="relative">
                <input
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(198,153,46,0.3)", color: "white", fontFamily: sans, fontSize: 13, outline: "none" }}
                  type="password"
                  value={form.motDePasse}
                  onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                  placeholder="Mot de passe (6 car. min.)"
                />
                <Lock size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                CONFIRMER LE MOT DE PASSE
              </label>
              <div className="relative">
                <input
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(198,153,46,0.3)", color: "white", fontFamily: sans, fontSize: 13, outline: "none" }}
                  type="password"
                  value={form.confirmation}
                  onChange={(e) => setForm({ ...form, confirmation: e.target.value })}
                  placeholder="Confirmer le mot de passe"
                />
                <Lock size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
              </div>
            </div>

            {erreur && (
              <div className="flex items-center gap-1.5 mt-2" style={{ color: "#FFB4B0" }}>
                <AlertCircle size={14} />
                <span style={{ fontFamily: sans, fontSize: 11 }}>{erreur}</span>
              </div>
            )}
          </div>

          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={valider}
              className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer font-bold text-xs shadow-lg"
              style={{ background: C.gold, color: C.navy }}
            >
              <UserPlus size={16} /> Créer mon compte
            </button>
            <button
              type="button"
              onClick={onGoSignIn}
              className="w-full text-center py-2 cursor-pointer hover:underline text-xs text-stone-300"
            >
              Déjà un compte ? <span style={{ color: C.gold, fontWeight: 700 }}>Se connecter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function trouverCompteReel(identifiant, motDePasse) {
  const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
  for (const compte of comptes) {
    if (compte.type === "prestataire") continue; // accès réservé à l'app Prestataire
    for (const a of (compte.acces || [])) {
      if (a.email && a.email.toLowerCase() === identifiant.toLowerCase() && a.motDePasseProvisoire === motDePasse) {
        return { compte, personne: a, estSouscripteurPrincipal: true };
      }
    }
    for (const a of (compte.accesMobile || [])) {
      if (a.email && a.email.toLowerCase() === identifiant.toLowerCase() && a.motDePasseProvisoire === motDePasse) {
        return { compte, personne: a, estSouscripteurPrincipal: false };
      }
    }
  }
  return null;
}
function construireSessionReelle(match) {
  const { compte, personne, estSouscripteurPrincipal } = match;
  const base = { ...DEMO_SESSION };
  const resoudreFormule = (nomFormule) => {
    if (!nomFormule) return base.formule;
    const trouvee = FORMULES.find((f) => nomFormule.toLowerCase().includes(f.nom.toLowerCase().split(" ")[0]) || f.nom.toLowerCase().includes(nomFormule.toLowerCase().replace(/entreprise|famille/gi, "").trim()));
    return trouvee || base.formule;
  };
  if (compte.type === "assure") {
    const d = compte.donnees || {};
    return {
      ...base,
      assure: { ...base.assure, nom: compte.nom, ville: d.ville || base.assure.ville, profession: d.profession || base.assure.profession, email: d.email || personne.email },
      police: d.police || base.police, contrat: d.contrat || base.contrat, formule: resoudreFormule(d.formule),
      statutContrat: d.statutContrat || "Actif", resiliationContrat: d.resiliation || null,
      compteReel: true, roleConnexion: estSouscripteurPrincipal ? "Souscripteur principal" : "Ayant droit",
    };
  }
  if (compte.type === "entreprise") {
    const d = compte.donnees || {};
    return {
      ...base,
      assure: { ...base.assure, nom: personne.nom || compte.nom, employeur: compte.nom, profession: personne.role || base.assure.profession, ville: d.ville || base.assure.ville, email: personne.email },
      contrat: d.contrat || base.contrat, formule: resoudreFormule(d.formule),
      statutContrat: d.statutContrat || "Actif", resiliationContrat: d.resiliation || null,
      compteReel: true, roleConnexion: estSouscripteurPrincipal ? "Administrateur RH" : (personne.role || "Employé"),
    };
  }
  return { ...base, compteReel: true, roleConnexion: "Assuré" };
}

function SignIn({ prefill, onDone, onGoSignUp }) {
  const [form, setForm] = useState({ identifiant: prefill?.email || "", motDePasse: "" });
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  // Mode Mot de Passe Oublié
  const [forgotMode, setForgotMode] = useState(false); // false | 'input' | 'otp' | 'success'
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const valider = async () => {
    if (!form.identifiant || !form.motDePasse) { setErreur("Veuillez saisir vos identifiants."); return; }
    setErreur("");
    setLoading(true);
    const match = await trouverCompteReel(form.identifiant, form.motDePasse);
    setLoading(false);
    onDone(match ? construireSessionReelle(match) : null);
  };

  const handleSendResetCode = (e) => {
    e.preventDefault();
    if (!forgotEmail) { setForgotError("Veuillez saisir votre email ou téléphone."); return; }
    setForgotError("");
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep(2);
      setForgotSuccess("Code de réinitialisation à 6 chiffres envoyé avec succès.");
    }, 800);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length < 4) { setForgotError("Veuillez entrer le code reçu."); return; }
    if (!newPassword || newPassword.length < 4) { setForgotError("Le nouveau mot de passe doit comporter au moins 4 caractères."); return; }
    setForgotError("");
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep(3);
    }, 900);
  };

  const fillTestAccount = (email, pass = "123456") => {
    setForm({ identifiant: email, motDePasse: pass });
    setErreur("");
    setShowTestAccounts(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)`, fontFamily: sans }}>
      <div className="w-full max-w-lg bg-[#0D2818]/95 border border-[#C6992E]/40 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 overflow-hidden text-white">
        {!forgotMode ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center text-[#C6992E] shadow-inner">
                  <ShieldCheck size={22} color={C.gold} />
                </div>
                <div>
                  <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: C.gold, letterSpacing: 1.5, textTransform: "uppercase" }} className="block">
                    NeoGTec insur
                  </span>
                  <span className="text-xs text-[#B9C3D6] font-medium">Espace Assuré & Ayants Droit</span>
                </div>
              </div>
              <h2 style={{ fontFamily: serif, fontSize: 22, color: "white", fontWeight: 700 }}>
                Se connecter à l'Espace Assuré
              </h2>
              <p style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", marginTop: 4 }}>
                Accédez à vos garanties, cartes de santé et demandes de remboursement.
              </p>
            </div>

              {/* Bouton SSO Google Simulation */}
              <button
                type="button"
                onClick={() => fillTestAccount("jean.paul@domaine.cd", "123456")}
                className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs font-semibold text-white mb-5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Se connecter avec Google
              </button>

              <div className="relative flex items-center justify-center mb-5">
                <div className="border-t border-white/10 w-full"></div>
                <span className="bg-[#0A1F13] px-3 text-[10px] font-bold text-[#C6992E] uppercase tracking-wider whitespace-nowrap">
                  OU UTILISER VOS IDENTIFIANTS
                </span>
                <div className="border-t border-white/10 w-full"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                    NOM OU ADRESSE EMAIL
                  </label>
                  <div className="relative">
                    <input
                      style={inputStyle}
                      className="pl-9"
                      value={form.identifiant}
                      onChange={(e) => setForm({ ...form, identifiant: e.target.value })}
                      placeholder="paul@neogtec.com ou téléphone"
                    />
                    <Mail size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                    MOT DE PASSE
                  </label>
                  <div className="relative">
                    <input
                      style={{ ...inputStyle, paddingRight: 38 }}
                      className="pl-9"
                      type={showPassword ? "text" : "password"}
                      value={form.motDePasse}
                      onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                      placeholder="••••••••••••"
                    />
                    <Lock size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-[#B9C3D6] hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#B9C3D6] hover:text-white select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-[#C6992E] focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Souviens-toi de moi</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setForgotStep(1); setForgotError(""); setForgotSuccess(""); }}
                    className="text-[#C6992E] hover:underline font-semibold cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {erreur && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{erreur}</span>
                  </div>
                )}
              </div>

              {/* Accordéon Comptes de Test */}
              <div className="mt-5 border border-[#C6992E]/30 rounded-2xl bg-[#C6992E]/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTestAccounts(!showTestAccounts)}
                  className="w-full p-2.5 px-3.5 flex items-center justify-between text-xs font-bold text-[#C6992E] hover:bg-[#C6992E]/20 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound size={14} />
                    🔑 Comptes de test & Simulation (Cliquez pour tester)
                  </span>
                  {showTestAccounts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showTestAccounts && (
                  <div className="p-3 border-t border-[#C6992E]/20 space-y-1.5 text-xs bg-[#06140B]/80">
                    <button
                      type="button"
                      onClick={() => fillTestAccount("jean.paul@domaine.cd", "123456")}
                      className="w-full p-2 rounded-xl bg-white/5 hover:bg-[#C6992E]/20 text-left flex items-center justify-between text-stone-200 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-white">Jean-Paul (Assuré Titulaire)</div>
                        <div className="text-[11px] text-[#B9C3D6]">jean.paul@domaine.cd</div>
                      </div>
                      <span className="text-[10px] bg-[#C6992E] text-[#0D2818] font-bold px-2 py-0.5 rounded">Remplir</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={valider}
                  disabled={loading}
                  className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer"
                  style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
                  {loading ? "Connexion en cours…" : "Se connecter à l'Espace Assuré"}
                </button>

                <button
                  type="button"
                  onClick={onGoSignUp}
                  className="w-full text-center py-2 cursor-pointer hover:underline text-xs text-stone-300"
                >
                  Pas encore de compte ? <span style={{ color: C.gold, fontWeight: 700 }}>S'inscrire</span>
                </button>
              </div>
            </div>
          ) : (
            /* Mode Réinitialisation de Mot de Passe */
            <div className="h-full flex flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#B9C3D6] hover:text-white mb-6 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Retour à la connexion
                </button>

                <div className="mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center text-[#C6992E] mb-3">
                    <KeyRound size={24} />
                  </div>
                  <h2 style={{ fontFamily: serif, fontSize: 22, color: "white", fontWeight: 700 }}>
                    Mot de passe oublié
                  </h2>
                  <p style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", marginTop: 4 }}>
                    Réinitialisez facilement l'accès à votre compte Assuré NeoGTec.
                  </p>
                </div>

                {forgotStep === 1 && (
                  <form onSubmit={handleSendResetCode} className="space-y-4">
                    <div>
                      <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                        VOTRE EMAIL OU TÉLÉPHONE ENREGISTRÉ
                      </label>
                      <div className="relative">
                        <input
                          style={inputStyle}
                          className="pl-9"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="ex : paul@neogtec.com"
                        />
                        <Mail size={15} className="absolute left-3 top-3.5 text-[#B9C3D6]" />
                      </div>
                    </div>

                    {forgotError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs shadow-lg mt-4"
                      style={{ background: C.gold, color: C.navy }}
                    >
                      {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Envoyer le code de réinitialisation"}
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {forgotSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                        <span>{forgotSuccess}</span>
                      </div>
                    )}

                    <div>
                      <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                        CODE DE VÉRIFICATION (6 CHIFFRES)
                      </label>
                      <input
                        style={inputStyle}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="ex: 849201"
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                        NOUVEAU MOT DE PASSE
                      </label>
                      <input
                        style={inputStyle}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                      />
                    </div>

                    {forgotError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 cursor-pointer font-bold text-xs shadow-lg mt-4"
                      style={{ background: C.gold, color: C.navy }}
                    >
                      {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Mettre à jour le mot de passe"}
                    </button>
                  </form>
                )}

                {forgotStep === 3 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Mot de passe réinitialisé !</h3>
                    <p className="text-xs text-[#B9C3D6] max-w-xs mx-auto">
                      Votre mot de passe a été mis à jour avec succès. Vous pouvez à présent vous connecter.
                    </p>
                    <button
                      type="button"
                      onClick={() => setForgotMode(false)}
                      className="w-full rounded-2xl py-3.5 cursor-pointer font-bold text-xs shadow-lg mt-4"
                      style={{ background: C.gold, color: C.navy }}
                    >
                      Retour à la connexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function Welcome({ onSubscribe, onDemo, onDevis }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div className="w-full max-w-md bg-[#0A1F13]/90 md:bg-[#0D2818]/95 border border-[#C6992E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between items-center text-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 72, height: 72, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><ShieldCheck size={34} color={C.gold} /></div>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: C.gold, letterSpacing: 1.5, textTransform: "uppercase" }}>NeoGTec insur</div>
          <div style={{ fontFamily: serif, fontSize: 24, color: "white", marginTop: 8, lineHeight: 1.3, fontWeight: 700 }}>Votre assurance santé,<br />entièrement à distance</div>
          <div style={{ fontFamily: sans, fontSize: 12.5, color: "#B9C3D6", marginTop: 10, maxWidth: 300 }}>Souscrivez, gérez vos garanties, demandez une prise en charge et suivez vos remboursements sans jamais vous déplacer.</div>
        </div>
        <div className="w-full space-y-3 mt-8">
          <button onClick={onSubscribe} className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}><Sparkles size={16} /> Souscrire à une police</button>
          <button onClick={onDevis} className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors" style={{ border: `1px solid ${C.gold}`, color: C.gold, fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><Calculator size={15} /> Faire un devis gratuit</button>
          <button onClick={onDemo} className="w-full rounded-2xl py-3.5 cursor-pointer hover:bg-white/10 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>J'ai déjà un compte</button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   ACCUEIL
================================================================= */
function Accueil({ go, notify, session, setSession, onRestart }) {
  const totalPlafond = session.garanties.reduce((s, g) => s + g.plafond, 0);
  const totalConso = session.garanties.reduce((s, g) => s + g.consomme, 0);
  const pct = totalPlafond ? Math.round((totalConso / totalPlafond) * 100) : 0;
  const alertes = session.garanties.filter((g) => g.plafond && g.consomme / g.plafond >= 0.8);
  const dueEcheance = (session.paiements || []).find((p) => p.statut === "Dû");
  const prochainRdv = (session.rdv || [])[0];
  const [messagePrevention, setMessagePrevention] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [faceModalOpen, setFaceModalOpen] = useState(false);

  React.useEffect(() => {
    (async () => {
      const messages = await chargerCanalPartage(CLE_MESSAGES_PREVENTION);
      const pertinent = messages.find((m) => !m.ville || m.ville === "Toutes" || m.ville === session.assure.ville);
      setMessagePrevention(pertinent || null);
    })();
  }, []);

  const actions = [
    { label: "Prendre rendez-vous", icon: CalendarCheck, go: () => go("sinistres", "rdv"), bg: "#EEF1F8" },
    { label: "Prestataires proches", icon: Navigation, go: () => go("sinistres", "prest"), bg: "#F7EFE3" },
    { label: "Déposer un remboursement", icon: ClipboardList, go: () => go("sinistres", "remb"), bg: "#F2EDF6" },
    { label: "Ma carte santé", icon: CreditCard, go: () => go("carte"), bg: "#E8F6FF" },
    { label: "Simuler un devis", icon: Calculator, go: () => go("devis"), bg: "#EFF3EA" },
    { label: "Payer mes cotisations", icon: Wallet, go: () => go("paiement"), bg: "#FBEAE8" },
    { label: "Console d'affiliation", icon: UserCog, go: () => go("affiliation"), bg: "#E9F1F3" },
    { label: "Souscrire à un nouveau contrat", icon: FilePlus, go: () => go("contrats"), bg: "#F7EAEA" },
  ];

  return (
    <div className="pb-6">
      <div className="px-5 pt-2 pb-4 flex items-center justify-between">
        <div>
          <div style={{ fontFamily: sans, fontSize: 13, color: C.sub }}>Bonjour,</div>
          <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, fontWeight: 700 }}>{session.assure.nom}</div>
          {session.compteReel && <div className="flex items-center gap-1 mt-0.5"><ShieldCheck size={11} color={C.green} /><span style={{ fontFamily: sans, fontSize: 9.5, color: C.green, fontWeight: 700 }}>Connecté — {session.roleConnexion}</span></div>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => go("notifications")} title="Alertes / Notifications" className="rounded-full p-2" style={{ border: `1px solid ${C.line}`, background: "white" }}>
            <Bell size={16} color={C.navy} />
          </button>
          <button onClick={() => go("settings")} title="Paramètres" className="rounded-full p-2" style={{ border: `1px solid ${C.line}`, background: "white" }}>
            <Settings size={16} color={C.navy} />
          </button>
          <button onClick={() => setShowProfile(true)} title="Voir / modifier la photo" className="rounded-full overflow-hidden" style={{ width: 44, height: 44, border: `1px solid ${C.line}`, padding: 0 }}>
            <img src={(session.beneficiaires && session.beneficiaires[0] && session.beneficiaires[0].photo) || "https://i.pravatar.cc/200"} alt="Photo profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Photo de profil</div>
              <button onClick={() => setShowProfile(false)} className="text-sm" style={{ color: C.sub }}><X size={18} /></button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div style={{ width: 120, height: 120, borderRadius: 999, overflow: "hidden" }}>
                <img src={(session.beneficiaires && session.beneficiaires[0] && session.beneficiaires[0].photo) || "https://i.pravatar.cc/200"} alt="Profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{session.assure.nom}</div>
              <div style={{ width: "100%" }}>
                <label className="w-full flex items-center justify-center rounded-xl p-3" style={{ background: C.navy, color: "white", cursor: "pointer" }}>
                  Modifier la photo
                  <input type="file" accept="image/*" hidden onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return; const url = URL.createObjectURL(f);
                    setSession({
                      ...session,
                      beneficiaires: (session.beneficiaires || []).map((b, idx) => idx === 0 ? { ...b, photo: url } : b),
                    });
                    setShowProfile(false);
                  }} />
                </label>
                <div className="w-full mt-2">
                  <button onClick={() => setFaceModalOpen(true)} className="w-full rounded-xl p-3 border text-sm font-bold" style={{ background: "#fff" }}>
                    <Camera size={14} /> Prendre une photo avec la caméra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <RealCameraFaceModal
        isOpen={faceModalOpen}
        onClose={() => setFaceModalOpen(false)}
        onVerified={(img) => {
          if (img) {
            setSession({
              ...session,
              beneficiaires: (session.beneficiaires || []).map((b, idx) => idx === 0 ? { ...b, photo: img } : b),
            });
            setShowProfile(false);
            setFaceModalOpen(false);
            notify("Photo de profil enregistrée");
          }
        }}
      />
      {(alertes.length > 0 || dueEcheance) && (
        <div className="px-5 mb-3 space-y-2">
          {alertes.length > 0 && <Card className="p-3 flex items-center gap-2" style={{ background: "#FBEAE8", border: `1px solid ${C.amber}` }}><AlertTriangle size={14} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>{alertes.map((a) => a.nom).join(", ")} — plafond bientôt atteint</span></Card>}
          {dueEcheance && <Card onClick={() => go("paiement")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.goldSoft }}><Wallet size={14} color={C.navy} /><span style={{ fontFamily: sans, fontSize: 11, color: C.navy, fontWeight: 600 }}>Échéance {dueEcheance.label} à régler — {fmt(dueEcheance.montant)}</span></Card>}
        </div>
      )}
      <div className="px-5">
        <Card style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }} className="p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Plafond global — {session.formule.nom}</div>
              <div style={{ fontFamily: serif, fontSize: 26, marginTop: 4 }}>{fmt(totalConso)}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6" }}>consommés sur {fmt(totalPlafond)}</div>
            </div>
            <div className="relative flex items-center justify-center"><Ring pct={pct} size={64} stroke={7} color={C.gold} /><span className="absolute" style={{ fontFamily: sans, fontSize: 13, fontWeight: 700 }}>{pct}%</span></div>
          </div>
          <button onClick={() => go("police")} className="mt-4 flex items-center gap-1" style={{ color: C.gold, fontFamily: sans, fontWeight: 600, fontSize: 12 }}>Voir le détail par garantie <ChevronRight size={14} /></button>
        </Card>
      </div>

      {messagePrevention && (
        <div className="px-5 mt-3">
          <Card className="p-3.5 flex items-start gap-2.5" style={{ background: C.goldSoft, border: "none" }}>
            <HeartPulse size={16} color={C.navy} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy }}>{messagePrevention.type || "Conseil santé"} — NeoGTec HealthCare</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 2 }}>{messagePrevention.contenu}</div></div>
          </Card>
        </div>
      )}

      <SectionLabel>Prochaine consultation</SectionLabel>
      <div className="px-5">
        {prochainRdv ? (
          <Card onClick={() => go("sinistres", "rdv")} className="p-4 flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 42, height: 42, background: C.ivory }}>{prochainRdv.type === "Téléconsultation" ? <Video size={18} color={C.navy2} /> : <Building2 size={18} color={C.navy2} />}</div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{prochainRdv.cible}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{prochainRdv.beneficiaire} · {prochainRdv.date} à {prochainRdv.heure}</div></div>
            <StatusPill statut={prochainRdv.statut} />
          </Card>
        ) : (
          <Card className="p-4 flex items-center justify-between">
            <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun rendez-vous programmé</span>
            <button onClick={() => go("sinistres", "rdv")} style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}>Prendre RDV →</button>
          </Card>
        )}
      </div>

      <SectionLabel>Évolution de mes consommations (mensuelle)</SectionLabel>
      <div className="px-5">
        <Card className="p-4">
          <div style={{ width: "100%", height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSO_MENSUELLE} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="consoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.5} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} width={36} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontFamily: sans, fontSize: 11, borderRadius: 8, border: `1px solid ${C.line}` }} />
                <Area type="monotone" dataKey="montant" stroke={C.gold} strokeWidth={2} fill="url(#consoGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-1.5 mt-1"><TrendingUp size={12} color={C.sub} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Total sur les 6 derniers mois : {fmt(CONSO_MENSUELLE.reduce((s, c) => s + c.montant, 0))}</span></div>
        </Card>
      </div>

      <SectionLabel>Ma famille couverte</SectionLabel>
      <div className="px-5">
        <Card onClick={() => go("carte")} className="p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Users2 size={16} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{session.beneficiaires.length} bénéficiaire(s) couvert(s)</span></div>
            <ChevronRight size={15} color={C.sub} />
          </div>
          <div className="flex -space-x-2">
            {session.beneficiaires.map((b) => (
              <div key={b.id} className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 34, height: 34, background: C.ivory, border: "2px solid white" }}>
                {b.photo ? <img src={b.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <b.icon size={14} color={C.navy2} />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <SectionLabel>Actions rapides</SectionLabel>
      <div className="px-5 grid grid-cols-2 gap-3">
        {actions.map((a, i) => (
          <button key={i} onClick={a.go} className="text-left">
            <Card className="p-4 h-full active:scale-95 transition-transform" style={{ background: a.bg, border: "none" }}><a.icon size={20} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 10, lineHeight: 1.25 }}>{a.label}</div></Card>
          </button>
        ))}
      </div>
      <SectionLabel>Activité récente</SectionLabel>
      <div className="px-5 space-y-2">
        {session.histo.length === 0 && <Card className="p-5 text-center"><div style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucune activité pour le moment.<br />Bienvenue chez NeoGTec HealthCare !</div></Card>}
        {session.histo.slice(0, 3).map((h) => (
          <Card key={h.id} className="p-3 flex items-center justify-between">
            <div><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink }}>{h.prestataire}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{h.type} · {h.date}</div></div>
            <div className="text-right"><div style={{ fontFamily: mono, fontSize: 12, color: C.ink }}>{fmt(h.montant)}</div><StatusPill statut={h.statut} /></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =================================================================
   MA POLICE
================================================================= */
function Police({ notify, session, setSession, go }) {
  const [addOpen, setAddOpen] = useState(false);
  const [addBenef, setAddBenef] = useState({ lien: "Enfant", nom: "", naissance: "", photo: "", sexe: "Féminin", lieuNaissance: "", telephone: "", adresse: "", groupeSanguin: "" });
  const [renouvelOpen, setRenouvelOpen] = useState(false);
  const [renouvelStatus, setRenouvelStatus] = useState("idle"); // idle | loading | done

  React.useEffect(() => {
    if (!session.compteReel) return;
    (async () => {
      const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
      const compte = comptes.find((c) => c.donnees?.police === session.police) || comptes.find((c) => c.donnees?.contrat === session.contrat);
      if (compte?.donnees?.statutContrat && compte.donnees.statutContrat !== session.statutContrat) {
        setSession((s) => ({ ...s, statutContrat: compte.donnees.statutContrat, resiliationContrat: compte.donnees.resiliation || s.resiliationContrat }));
      }
      if (compte?.donnees?.garantiesConsommation?.length) {
        setSession((s) => ({
          ...s,
          garanties: s.garanties.map((g) => {
            const reel = compte.donnees.garantiesConsommation.find((r) => r.nom === g.nom);
            return reel ? { ...g, consomme: reel.consomme } : g;
          }),
        }));
      }
    })();
  }, []);

  const alertes = session.garanties.filter((g) => g.plafond && g.consomme / g.plafond >= 0.8);
  const paiements = session.paiements || [];
  const dueIdx = paiements.findIndex((p) => p.statut === "Dû");
  const fidelite = session.fidelite || { moisSansSinistre: 0, bonus: 0, prochainPalier: 12, bonusProchainPalier: 5 };

  const primeRenouvellement = Math.round(session.prime * (1 - (fidelite.bonus || 0) / 100));
  const confirmerRenouvellement = () => {
    setRenouvelStatus("loading");
    setTimeout(() => {
      const today = new Date();
      const end = new Date(today);
      end.setFullYear(end.getFullYear() + 1);
      const dfmt = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      setSession({
        ...session,
        validite: `${dfmt(today)} — ${dfmt(end)}`,
        prime: primeRenouvellement,
        garanties: session.garanties.map((g) => ({ ...g, consomme: 0 })),
        paiements: buildEcheancier(Math.round(primeRenouvellement * 0.2), 0),
        notifications: [{ id: Date.now(), type: "contrat", titre: "Contrat renouvelé", detail: `Nouvelle validité : ${dfmt(today)} — ${dfmt(end)}`, date: "À l'instant", lue: false }, ...(session.notifications || [])],
      });
      setRenouvelStatus("done");
      notify("Contrat renouvelé avec succès");
      if (session.compteReel) {
        (async () => {
          const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
          const comptesMaj = comptes.map((c) => (c.donnees?.contrat === session.contrat ? { ...c, donnees: { ...c.donnees, garantiesConsommation: (c.donnees.garantiesConsommation || []).map((g) => ({ ...g, consomme: 0 })), telemedecineConsommee: 0 } } : c));
          await sauvegarderCanalPartage(CLE_COMPTES_PARTAGES, comptesMaj);
        })();
      }
    }, 1200);
  };

  const ajouterBenef = () => {
    if (!addBenef.nom || !addBenef.naissance || !addBenef.photo) return;
    const n = session.beneficiaires.length;
    const iconFor = addBenef.lien === "Conjoint" ? Heart : addBenef.lien === "Enfant" ? Baby : ShieldCheck;
    const genPin = () => String(Math.floor(1000 + Math.random() * 9000));
    const nouveau = {
      id: String(n).padStart(2, "0"), lien: addBenef.lien, nom: addBenef.nom, naissance: addBenef.naissance,
      carte: `${session.police}-${String(n).padStart(2, "0")}`, icon: iconFor, grade: "dependant",
      photo: addBenef.photo, sexe: addBenef.sexe, lieuNaissance: addBenef.lieuNaissance, telephone: addBenef.telephone, adresse: addBenef.adresse, groupeSanguin: addBenef.groupeSanguin,
      statutAffiliation: "Actif", faceRegistered: false,
      acces: { identifiant: addBenef.telephone || `${session.police}-${String(n).padStart(2, "0")}`, pin: genPin() },
    };
    setSession({ ...session, beneficiaires: [...session.beneficiaires, nouveau] });
    setAddBenef({ lien: "Enfant", nom: "", naissance: "", photo: "", sexe: "Féminin", lieuNaissance: "", telephone: "", adresse: "", groupeSanguin: "" });
    setAddOpen(false);
    notify(`Avenant enregistré — ${nouveau.nom} ajouté(e) à la police, accès généré`);
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Ma police</div><div style={{ fontFamily: mono, fontSize: 12, color: C.sub }}>{session.police} · rattachée au contrat {session.contrat}</div></div>
      </div>
      <div className="px-5">
        {session.statutContrat === "Résilié" && (
          <Card className="p-4 flex items-start gap-2.5 mb-3" style={{ background: C.redSoft, border: "none" }}>
            <XCircle size={17} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.red }}>Contrat résilié</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 2 }}>
                {session.resiliationContrat ? `Motif : ${session.resiliationContrat.motif} · Effet au ${session.resiliationContrat.dateEffet}.` : "Ce contrat n'est plus actif."} Contactez votre gestionnaire via la messagerie pour toute question.
              </div>
            </div>
          </Card>
        )}
        {alertes.length > 0 && (
          <Card className="p-3.5 flex items-start gap-2 mb-3" style={{ background: "#FBEAE8", border: `1px solid ${C.amber}` }}>
            <AlertTriangle size={16} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{alertes.map((a) => a.nom).join(", ")} — plafond bientôt atteint. Le solde restant devient à votre charge au-delà de 100%.</span>
          </Card>
        )}

        <SectionLabel>Consommation par garantie</SectionLabel>
        <div className="space-y-2 mb-2">
          {session.garanties.map((g, i) => {
            const pct = g.plafond ? Math.round((g.consomme / g.plafond) * 100) : 0;
            return (
              <Card key={i} className="p-3 flex items-center gap-3">
                <Ring pct={pct} size={40} stroke={5} color={pct > 60 ? C.red : pct > 20 ? C.amber : C.gold} />
                <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: C.ink }}>{g.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{fmt(g.consomme)} sur {fmt(g.plafond)}</div></div>
                <div className="text-right">
                  <div style={{ fontFamily: mono, fontSize: 13, color: C.navy, fontWeight: 700 }}>{pct}%</div>
                  {pct >= 80 && <span style={{ fontFamily: sans, fontSize: 9, color: C.amber, fontWeight: 700 }}>À surveiller</span>}
                </div>
              </Card>
            );
          })}
        </div>

        <SectionLabel>Contrat</SectionLabel>
        <Card className="p-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 38, height: 38, background: C.ivory }}><CalendarClock size={18} color={C.navy2} /></div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Validité du contrat</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.validite}</div></div>
            {!renouvelOpen && renouvelStatus !== "done" && (
              <button onClick={() => setRenouvelOpen(true)} className="rounded-lg px-3 py-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Renouveler</button>
            )}
            {renouvelStatus === "done" && <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.green, background: C.greenSoft, padding: "3px 8px", borderRadius: 999 }}>Renouvelé</span>}
          </div>

          {renouvelOpen && renouvelStatus === "idle" && (
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Renouveler pour une année supplémentaire, à la même formule <b>{session.formule.nom}</b>.</div>
              <div className="flex items-center justify-between mt-2">
                <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Prime annuelle{fidelite.bonus > 0 ? ` (bonus fidélité -${fidelite.bonus}% inclus)` : ""}</span>
                <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(primeRenouvellement)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setRenouvelOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button>
                <button onClick={confirmerRenouvellement} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Confirmer le renouvellement</button>
              </div>
            </div>
          )}
          {renouvelOpen && renouvelStatus === "loading" && (
            <div className="mt-3 pt-3 flex items-center justify-center gap-2" style={{ borderTop: `1px solid ${C.line}` }}><Loader2 size={16} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Renouvellement en cours…</span></div>
          )}
          {renouvelStatus === "done" && (
            <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${C.line}` }}><Check size={14} color={C.green} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Nouvelle validité : {session.validite}</span></div>
          )}
        </Card>
        <Card className="p-4 mb-2">
          <div className="flex items-center gap-2 mb-2"><Award size={16} color={C.gold} /><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.navy }}>Bonus fidélité (bonus-malus)</span></div>
          <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{fidelite.moisSansSinistre} mois consécutifs sans sinistre déclaré</div>
          <div className="flex items-center gap-2 mt-1.5"><TrendingDown size={13} color={C.green} /><span style={{ fontFamily: sans, fontSize: 12, color: C.green, fontWeight: 700 }}>-{fidelite.bonus}% sur votre prochaine échéance</span></div>
          <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 4 }}>Encore {Math.max(fidelite.prochainPalier - fidelite.moisSansSinistre, 0)} mois sans sinistre pour atteindre -{fidelite.bonusProchainPalier}%.</div>
        </Card>

        <SectionLabel>Conditions générales</SectionLabel>
        <Card className="p-4 mb-2">
          <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Réseau de soins</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700 }}>{session.reseauSoins || "Ouvert"}</span></div>
          <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Renouvellement</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700 }}>{(session.renouvellementTacite ?? true) ? "Tacite reconduction" : "Non reconductible"}</span></div>
          <div className="flex items-center justify-between py-1.5"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Cascade de paiement</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700, textAlign: "right" }}>{(session.cascadeProfil || "Complet") === "Complet" ? "CSU + Assurance + Mutuelle" : "Assurance seule"}</span></div>
          <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, margin: "10px 0 4px" }}>Délais de carence</div>
          {(session.delaisCarence || [{ garantie: "Consultations & Pharmacie", jours: 0 }, { garantie: "Hospitalisation", jours: 30 }, { garantie: "Dentaire", jours: 60 }, { garantie: "Optique", jours: 60 }, { garantie: "Maternité", jours: 300 }]).map((d) => (
            <div key={d.garantie} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{d.garantie}</span><span style={{ fontFamily: mono, fontSize: 11.5, color: d.jours === 0 ? C.green : C.sub, fontWeight: 700 }}>{d.jours === 0 ? "Immédiat" : `${d.jours} j`}</span></div>
          ))}
          {session.assure?.pieceIdentite && <div className="flex items-center justify-between py-1.5 mt-1" style={{ borderTop: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Pièce d'identité</span><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700 }}>{session.assure.pieceIdentite}</span></div>}
        </Card>

        <SectionLabel>Détails</SectionLabel>

        <Card onClick={() => go("paiement")} className="p-4 flex items-center gap-3 mb-2 cursor-pointer">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 38, height: 38, background: C.goldSoft }}><Wallet size={18} color={C.navy} /></div>
          <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Suivi financier & paiements</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{dueIdx === -1 ? "Toutes vos échéances sont à jour" : `Échéance ${paiements[dueIdx]?.label} à régler`}</div></div>
          <ChevronRight size={16} color={C.sub} />
        </Card>

        <Accordion title="Cascade de paiement (ordre des payeurs)" right={<Layers size={14} color={C.gold} />}>
          <div className="pt-3 space-y-3">
            {CASCADE.map((c) => (
              <div key={c.ordre} className="flex items-start gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 24, height: 24, background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 800 }}>{c.ordre}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{c.payeur}</span><span style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700 }}>{c.taux}</span></div>
                  <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{c.role}</div>
                </div>
              </div>
            ))}
            <Card className="p-3" style={{ background: C.ivory, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, fontStyle: "italic" }}>Exemple : pour une facture de 100 000 CDF, la CSU règle 70 000 CDF, l'Assurance complète 20 000 CDF selon le taux du bénéficiaire, et 10 000 CDF restent couverts par la mutuelle ou à charge.</div>
            </Card>
          </div>
        </Accordion>

        <Accordion title={`Barème détaillé — ${session.formule.nom} (par acte médical)`} right={<ListChecks size={14} color={C.green} />}>
          <BaremeDetail bareme={session.formule.bareme} limites={session.formule.limites} exclusions={session.formule.exclusions} />
        </Accordion>

        {session.formule.mutuelle ? (
          <>
            <Accordion title="Réseau des hôpitaux conventionnés (Lisanga)" right={<MapPin size={14} color={C.gold} />}>
              <div className="pt-3">
                {LISANGA_RESEAU.map((g, i) => (
                  <div key={i} className="mb-3">
                    <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2, marginBottom: 5 }}>{g.cat}</div>
                    {g.items.map((h, j) => (
                      <div key={j} className="flex items-start gap-2 py-1">
                        <MapPin size={12} color={C.gold} style={{ marginTop: 2, flexShrink: 0 }} />
                        <div><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.ink }}>{h.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{h.commune} · {h.avenue} · {h.quartier}</div></div>
                      </div>
                    ))}
                  </div>
                ))}
                <Card className="p-3 mt-2" style={{ background: C.ivory, border: "none" }}>
                  <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Siège social : Aux enceintes de l'Hôpital Pédiatrique Kalembelembe, C/Lingwala, Kinshasa. Gestionnaire : +243 84 39 615 75 · Médecin conseil : +243 84 39 615 77.</div>
                </Card>
              </div>
            </Accordion>
          </>
        ) : (
          <>
            <Accordion title="Exclusions et limitations" right={<AlertCircle size={14} color={C.red} />}>
              <ul className="pt-3 space-y-2">{EXCLUSIONS.map((e, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}><span style={{ color: C.red }}>–</span>{e}</li>)}</ul>
            </Accordion>

            <div className="px-5 mt-3">
              <Card className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Ma carte santé et mes ayants droit</div>
                  <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 4 }}>Accédez à votre carte numérique, à vos QR codes et à l'accès des bénéficiaires en un clic.</div>
                </div>
                <button onClick={() => go("carte")} className="rounded-xl py-2.5 px-4" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12 }}>Voir ma carte</button>
              </Card>
            </div>
            <Accordion title="Liste des soins pris en charge" right={<ListChecks size={14} color={C.green} />}>
              <div className="pt-3">
                {SOINS_COUVERTS.map((s, i) => (
                  <div key={i} className="mb-3">
                    <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy2, marginBottom: 5 }}>{s.cat}</div>
                    {s.items.map((it, j) => <div key={j} className="flex items-center gap-2 py-0.5"><Check size={12} color={C.green} style={{ flexShrink: 0 }} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{it}</span></div>)}
                  </div>
                ))}
              </div>
            </Accordion>
          </>
        )}

        <Accordion title={`Bénéficiaires (${session.beneficiaires.length})`} defaultOpen={addOpen}>
          <div className="pt-3 space-y-3">
            {session.beneficiaires.map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 30, height: 30, background: C.ivory }}>{b.photo ? <img src={b.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <b.icon size={14} color={C.navy2} />}</div>
                <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{b.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{b.lien} · {b.naissance}</div></div>
                <div className="text-right"><span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, display: "block" }}>{b.carte}</span><span style={{ fontFamily: sans, fontSize: 10, color: C.gold, fontWeight: 700 }}>{tauxFor(b.grade)}% · {gradeLabel(b.grade).split(" ")[0].replace(/[(),]/g, "")}</span></div>
              </div>
            ))}
          </div>
          {!addOpen ? (
            <button onClick={() => setAddOpen(true)} className="w-full rounded-xl py-2.5 mt-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter un bénéficiaire (avenant)</button>
          ) : (
            <Card className="p-3.5 mt-3 space-y-2.5" style={{ background: C.ivory, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>Nouvel avenant</div>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-shrink-0">
                  <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 44, height: 44, background: "white", border: `1.5px dashed ${addBenef.photo ? C.green : C.red}` }}>
                    {addBenef.photo ? <img src={addBenef.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={16} color={C.navy2} />}
                  </div>
                  <input type="file" accept="image/*" capture="user" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setAddBenef({ ...addBenef, photo: URL.createObjectURL(f) }); }} />
                </label>
                <span style={{ fontFamily: sans, fontSize: 10.5, color: addBenef.photo ? C.sub : C.red }}>Photo obligatoire (utilisée aussi pour sa reconnaissance faciale)</span>
              </div>
              <Field label="Lien de parenté"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Autre</option></select></Field>
              <Field label="Nom complet"><input style={inputStyle} placeholder="Nom complet" value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Date de naissance"><input style={inputStyle} type="date" value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
                <Field label="Sexe"><select style={inputStyle} value={addBenef.sexe} onChange={(e) => setAddBenef({ ...addBenef, sexe: e.target.value })}><option>Féminin</option><option>Masculin</option></select></Field>
              </div>
              <Field label="Lieu de naissance"><input style={inputStyle} value={addBenef.lieuNaissance} onChange={(e) => setAddBenef({ ...addBenef, lieuNaissance: e.target.value })} placeholder="Kinshasa" /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Téléphone (pour son accès)"><input style={inputStyle} value={addBenef.telephone} onChange={(e) => setAddBenef({ ...addBenef, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
                <Field label="Groupe sanguin"><select style={inputStyle} value={addBenef.groupeSanguin} onChange={(e) => setAddBenef({ ...addBenef, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
              </div>
              <Field label="Adresse"><input style={inputStyle} value={addBenef.adresse} onChange={(e) => setAddBenef({ ...addBenef, adresse: e.target.value })} placeholder="Même adresse que le souscripteur si vide" /></Field>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setAddOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button>
                <button onClick={ajouterBenef} disabled={!addBenef.nom || !addBenef.naissance || !addBenef.photo} className="flex-1 rounded-lg py-2" style={{ background: (!addBenef.nom || !addBenef.naissance || !addBenef.photo) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Confirmer l'avenant</button>
              </div>
            </Card>
          )}
        </Accordion>
        <Accordion title="Mon dossier médical" right={<ClipboardList size={14} color={C.navy2} />}>
          <div className="pt-3">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.ink, marginBottom: 8 }}>Antécédents, consultations et vaccinations enregistrés par le réseau conventionné.</div>
            <button onClick={() => go("dossier")} className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>Ouvrir mon dossier médical <ChevronRight size={14} /></button>
          </div>
        </Accordion>
        <SectionLabel>Documents officiels</SectionLabel>
        <div className="space-y-2">
          {DOCUMENTS.map((d) => (
            <Card key={d.id} className="p-3.5 flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 38, height: 38, background: C.ivory }}><FileText size={18} color={C.navy} /></div>
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{d.titre}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.contrat} · {d.pages} pages · maj {d.maj}</div></div>
              <button onClick={() => { downloadText(`${d.titre.replace(/ /g, "_")}_${session.police}.txt`, `${d.titre}\nPolice : ${session.police}\nAssuré : ${session.assure.nom}\n\n(Document simulé — export texte de la maquette)`); notify(`${d.titre} téléchargé`); }} className="flex items-center justify-center rounded-full active:scale-95 transition-transform" style={{ width: 34, height: 34, background: C.navy }}><Download size={15} color="white" /></button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   MA CARTE (+ biométrie faciale)
================================================================= */
/* =================================================================
   MES CONTRATS — multi-contrats et nouvelle souscription
================================================================= */
/* =================================================================
   PAIEMENT — cotisations, moyens de paiement, historique complet
================================================================= */
const METHOD_ICONS = { mobile: Smartphone, carte: CreditCard, paypal: Wallet, virement: Landmark };
function Paiement({ session, setSession, notify, go }) {
  const [sub, setSub] = useState("payer");
  const [methode, setMethode] = useState(null);
  const [champ, setChamp] = useState("");
  const [payStatus, setPayStatus] = useState("idle");
  const [filtreHisto, setFiltreHisto] = useState("Tous");
  const [addMoyenOpen, setAddMoyenOpen] = useState(false);
  const [nouveauMoyen, setNouveauMoyen] = useState({ type: "mobile", detail: "" });

  const paiements = session.paiements || [];
  const histo = session.paiementsHistorique || [];
  const moyens = session.moyensPaiement || [];
  const due = paiements.find((p) => p.statut === "Dû");
  const reussis = histo.filter((h) => h.statut === "Réussi").length;
  const enAttente = paiements.filter((p) => p.statut === "Dû").length;
  const totalPaye = histo.filter((h) => h.statut === "Réussi").reduce((s, h) => s + h.montant, 0);

  const payer = () => {
    if (!due || !methode) return;
    setPayStatus("loading");
    setTimeout(() => {
      const label = { mobile: "Mobile Money", carte: "Carte bancaire", paypal: "PayPal", virement: "Virement bancaire" }[methode];
      setSession({
        ...session,
        paiements: paiements.map((p) => (p.id === due.id ? { ...p, statut: "Payé" } : p)),
        paiementsHistorique: [{ id: Date.now(), date: "06/07/2026", montant: due.montant, methode: label, reference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`, statut: "Réussi" }, ...histo],
        notifications: [{ id: Date.now(), type: "paiement", titre: "Paiement réussi", detail: `${fmt(due.montant)} réglés via ${label}`, date: "À l'instant", lue: false }, ...(session.notifications || [])],
      });
      setPayStatus("done");
      notify(`Quote-part réglée avec succès via ${label}`);
    }, 1200);
  };
  const resetPay = () => { setPayStatus("idle"); setMethode(null); setChamp(""); };

  const ajouterMoyen = () => {
    if (!nouveauMoyen.detail) return;
    const labelType = { mobile: "Mobile Money", carte: "Carte bancaire", paypal: "PayPal" }[nouveauMoyen.type];
    setSession({ ...session, moyensPaiement: [...moyens, { id: `m${Date.now()}`, type: nouveauMoyen.type, label: labelType, detail: nouveauMoyen.detail, parDefaut: false }] });
    setNouveauMoyen({ type: "mobile", detail: "" });
    setAddMoyenOpen(false);
    notify("Moyen de paiement ajouté");
  };
  const definirParDefaut = (id) => { setSession({ ...session, moyensPaiement: moyens.map((m) => ({ ...m, parDefaut: m.id === id })) }); notify("Moyen de paiement par défaut mis à jour"); };
  const supprimerMoyen = (id) => setSession({ ...session, moyensPaiement: moyens.filter((m) => m.id !== id) });

  const histoFiltre = histo.filter((h) => filtreHisto === "Tous" || h.statut === filtreHisto);

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Paiement</div><div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Cotisations, moyens de paiement et reçus — 100% en ligne</div></div>
      </div>

      <div className="px-5">
        <Card className="p-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
          <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Prochaine échéance</div>
          {due ? (
            <>
              <div style={{ fontFamily: serif, fontSize: 26, color: "white", marginTop: 4 }}>{fmt(due.montant)}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6" }}>{due.label}</div>
            </>
          ) : (
            <div style={{ fontFamily: sans, fontSize: 14, color: C.green, marginTop: 6, fontWeight: 700 }}>✓ Toutes vos cotisations sont à jour</div>
          )}
          <div className="grid grid-cols-3 gap-2 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 12 }}>
            <div><div style={{ fontFamily: serif, fontSize: 16, color: "white" }}>{reussis}</div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6" }}>Réussis</div></div>
            <div><div style={{ fontFamily: serif, fontSize: 16, color: C.gold }}>{enAttente}</div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6" }}>En attente</div></div>
            <div><div style={{ fontFamily: serif, fontSize: 13, color: "white" }}>{fmt(totalPaye)}</div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6" }}>Total réglé</div></div>
          </div>
        </Card>
      </div>

      <div className="px-5 flex gap-2 mt-3 mb-1 overflow-x-auto">
        {[["payer", "Payer"], ["moyens", "Mes moyens"], ["echeancier", "Échéancier"], ["histo", "Historique"]].map(([k, l]) => (
          <button key={k} onClick={() => { setSub(k); resetPay(); }} className="flex-shrink-0 rounded-full py-2 px-3.5" style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, background: sub === k ? C.navy : "white", color: sub === k ? "white" : C.ink, border: `1px solid ${sub === k ? C.navy : C.line}` }}>{l}</button>
        ))}
      </div>

      <div className="px-5 mt-2">
        {/* PAYER */}
        {sub === "payer" && (
          !due ? (
            <Card className="p-6 flex flex-col items-center gap-2 text-center">
              <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: C.greenSoft }}><Check size={20} color={C.green} /></div>
              <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Aucune échéance à régler</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Votre prochaine cotisation apparaîtra ici dès qu'elle sera due.</div>
            </Card>
          ) : payStatus === "done" ? (
            <Card className="p-6 flex flex-col items-center gap-2 text-center">
              <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: C.greenSoft }}><Check size={22} color={C.green} /></div>
              <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Paiement réussi</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Un reçu est disponible dans l'historique.</div>
              <button onClick={resetPay} className="mt-1" style={{ fontFamily: sans, fontSize: 12, color: C.navy2, fontWeight: 700 }}>Retour</button>
            </Card>
          ) : payStatus === "loading" ? (
            <Card className="p-8 flex flex-col items-center gap-3"><Loader2 size={28} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Transaction en cours…</span></Card>
          ) : (
            <>
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>Choisissez un moyen de paiement</div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[["mobile", "Mobile Money", Smartphone], ["carte", "Carte bancaire", CreditCard], ["paypal", "PayPal", Wallet], ["virement", "Virement bancaire", Landmark]].map(([id, label, Icon]) => (
                  <button key={id} onClick={() => setMethode(id)}>
                    <Card className="p-3.5 flex flex-col items-center gap-1.5" style={{ border: methode === id ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}><Icon size={19} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink, textAlign: "center" }}>{label}</span></Card>
                  </button>
                ))}
              </div>
              {methode === "mobile" && <Field label="Numéro Mobile Money"><input style={inputStyle} value={champ} onChange={(e) => setChamp(e.target.value)} placeholder="+243 8X XXX XXXX" /></Field>}
              {methode === "carte" && <Field label="Numéro de carte"><input style={inputStyle} value={champ} onChange={(e) => setChamp(e.target.value)} placeholder="•••• •••• •••• ••••" /></Field>}
              {methode === "paypal" && <Field label="Email PayPal"><input style={inputStyle} value={champ} onChange={(e) => setChamp(e.target.value)} placeholder="vous@exemple.com" /></Field>}
              {methode === "virement" && <Card className="p-3 mt-1" style={{ background: C.ivory, border: "none" }}><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>IBAN NeoGTec HealthCare : CD00 0000 0000 0000 0000 — communiquez la référence {session.police}.</span></Card>}
              {methode && (
                <button onClick={payer} className="w-full rounded-xl py-3.5 mt-4 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}>Payer {fmt(due.montant)}</button>
              )}
              {due && payStatus === "idle" && (
                <button onClick={() => {
                  downloadText(`Facture_${due.id}.txt`, `Facture NeoGTec HealthCare\nRéférence : ${due.id}\nDate d'échéance : ${due.date}\nMontant : ${fmt(due.montant)}\nMéthode : ${due.methode || "À définir"}\nStatut : ${due.statut}\nAssuré : ${session.assure.nom}`);
                  notify("Facture téléchargée");
                }} className="w-full rounded-xl py-3.5 mt-3 border border-dashed" style={{ background: "white", color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>Télécharger la facture</button>
              )}
            </>
          )
        )}

        {/* MES MOYENS DE PAIEMENT */}
        {sub === "moyens" && (
          <>
            <div className="space-y-2 mb-3">
              {moyens.map((m) => {
                const Icon = METHOD_ICONS[m.type] || Wallet;
                return (
                  <Card key={m.id} className="p-3.5 flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-lg" style={{ width: 38, height: 38, background: C.ivory }}><Icon size={17} color={C.navy2} /></div>
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{m.label}</div><div style={{ fontFamily: mono, fontSize: 11, color: C.sub }}>{m.detail}</div></div>
                    {m.parDefaut ? <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.navy, background: C.goldSoft, padding: "2px 7px", borderRadius: 999 }}>Par défaut</span> : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => definirParDefaut(m.id)} style={{ fontFamily: sans, fontSize: 10, color: C.navy2, fontWeight: 700 }}>Défaut</button>
                        <button onClick={() => supprimerMoyen(m.id)}><Trash2 size={14} color={C.red} /></button>
                      </div>
                    )}
                  </Card>
                );
              })}
              {moyens.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun moyen de paiement enregistré.</span></Card>}
            </div>
            {!addMoyenOpen ? (
              <button onClick={() => setAddMoyenOpen(true)} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><UserPlus size={14} /> Ajouter un moyen de paiement</button>
            ) : (
              <Card className="p-4 space-y-2">
                <select style={inputStyle} value={nouveauMoyen.type} onChange={(e) => setNouveauMoyen({ ...nouveauMoyen, type: e.target.value })}>
                  <option value="mobile">Mobile Money</option><option value="carte">Carte bancaire</option><option value="paypal">PayPal</option>
                </select>
                <input style={inputStyle} placeholder={nouveauMoyen.type === "carte" ? "Numéro de carte" : nouveauMoyen.type === "paypal" ? "Email PayPal" : "Numéro de téléphone"} value={nouveauMoyen.detail} onChange={(e) => setNouveauMoyen({ ...nouveauMoyen, detail: e.target.value })} />
                <div className="flex gap-2">
                  <button onClick={() => setAddMoyenOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button>
                  <button onClick={ajouterMoyen} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Enregistrer</button>
                </div>
              </Card>
            )}
          </>
        )}

        {/* ÉCHÉANCIER */}
        {sub === "echeancier" && (
          <div className="space-y-2">
            {paiements.map((p) => (
              <Card key={p.id} className="p-3.5 flex items-center justify-between">
                <div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{p.label}</div><div style={{ fontFamily: mono, fontSize: 11, color: C.sub }}>{fmt(p.montant)}</div></div>
                <StatusPill statut={p.statut} />
              </Card>
            ))}
          </div>
        )}

        {/* HISTORIQUE */}
        {sub === "histo" && (
          <>
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
              {["Tous", "Réussi", "En attente", "Échoué"].map((f) => (
                <button key={f} onClick={() => setFiltreHisto(f)} className="flex-shrink-0 rounded-full px-2.5 py-1" style={{ background: filtreHisto === f ? C.navy : "white", color: filtreHisto === f ? "white" : C.ink, border: `1px solid ${filtreHisto === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {histoFiltre.map((p) => (
                <Card key={p.id} className="p-3.5 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.ink }}>{fmt(p.montant)}</span><StatusPill statut={p.statut} /></div>
                    <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 2 }}>{p.date} · {p.methode} · {p.reference}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { downloadText(`Facture_${p.reference}.txt`, `Facture NeoGTec HealthCare\nRéférence : ${p.reference}\nDate : ${p.date}\nMontant : ${fmt(p.montant)}\nMéthode : ${p.methode}\nStatut : ${p.statut}\nAssuré : ${session.assure.nom}`); notify("Facture téléchargée"); }} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: C.ivory }}><Download size={13} color={C.navy2} /></button>
                    {p.statut === "Réussi" && <button onClick={() => { downloadText(`Recu_${p.reference}.txt`, `Reçu de paiement\nRéférence : ${p.reference}\nDate : ${p.date}\nMontant : ${fmt(p.montant)}\nMéthode : ${p.methode}\nAssuré : ${session.assure.nom}`); notify("Reçu téléchargé"); }} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: C.ivory }}><FileDown size={13} color={C.navy2} /></button>}
                  </div>
                </Card>
              ))}
              {histoFiltre.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun paiement pour ce filtre.</span></Card>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MesContrats({ session, onBack, onSouscrireNouveau, onActiver }) {
  const contrats = [
    { ...session, actif: true },
    ...(session.autresContrats || []).map((c) => ({ ...c, actif: false })),
  ];
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Mes contrats</div>
      </div>
      <div className="px-5 mt-2 space-y-2">
        {contrats.map((c, i) => (
          <Card key={c.police} className="p-4" style={{ border: c.actif ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
            <div className="flex items-center justify-between">
              <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 700, color: C.navy }}>{c.formule.nom}</div>
              {c.actif ? <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.navy, background: C.goldSoft, padding: "2px 8px", borderRadius: 999 }}>ACTIF</span> : <StatusPill statut={c.statut || "Actif"} />}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.sub, marginTop: 4 }}>{c.police}</div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, marginTop: 2 }}>{c.validite}</div>
            {c.note && <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginTop: 4, fontStyle: "italic" }}>{c.note}</div>}
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Prime annuelle</span>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(c.prime)}</span>
            </div>
            <button onClick={() => {
              const contenu = `CONTRAT D'ASSURANCE NEOGTEC\nPolice : ${c.police}\nContrat : ${c.contrat}\nFormule : ${c.formule.nom}\nValidité : ${c.validite}\nPrime annuelle : ${fmt(c.prime)}\nAssuré : ${session.assure.nom}`;
              downloadText(`Contrat_${c.police}.txt`, contenu);
              notify("Contrat téléchargé");
            }} className="w-full rounded-lg py-2 mt-3 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.line}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Download size={13} /> Télécharger le contrat</button>
            {!c.actif && <button onClick={() => onActiver(i - 1)} className="w-full rounded-lg py-2 mt-3 flex items-center justify-center gap-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Link2 size={13} /> Basculer sur ce contrat</button>}
          </Card>
        ))}
      </div>
      <div className="px-5 mt-4">
        <button onClick={onSouscrireNouveau} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}><FilePlus size={16} /> Souscrire à un nouveau contrat</button>
        <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, textAlign: "center", marginTop: 8 }}>Utile pour une couverture individuelle complémentaire, un second lieu de résidence, ou une entreprise distincte.</div>
      </div>
    </div>
  );
}

/* =================================================================
   CONSOLE D'AFFILIATION — gestion de la flotte / famille
================================================================= */
function ConsoleAffiliation({ session, setSession, onBack, notify }) {
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [nouv, setNouv] = useState({ lien: "Enfant", nom: "", naissance: "", photo: "", sexe: "Féminin", telephone: "", adresse: "", groupeSanguin: "", pieceIdentite: "", conditionsSante: [] });

  const toggleStatut = (id) => {
    setSession({ ...session, beneficiaires: session.beneficiaires.map((b) => (b.id === id ? { ...b, statutAffiliation: b.statutAffiliation === "Actif" ? "Suspendu" : "Actif" } : b)) });
    notify("Statut d'affiliation mis à jour");
  };

  const ajouter = async () => {
    if (!nouv.nom || !nouv.naissance || !nouv.photo) return;
    const n = session.beneficiaires.length;
    const iconFor = nouv.lien === "Conjoint" ? Heart : nouv.lien === "Enfant" ? Baby : ShieldCheck;
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    // Chaque ayant droit reçoit sa propre police et sa propre carte, distinctes de celles du souscripteur —
    // un seul contrat relie toute la famille, mais aucune "carte familiale" partagée.
    const suffixe = { Conjoint: "CONJ", Enfant: "ENF", Ascendant: "ASC", Autre: "AYD" }[nouv.lien] || "AYD";
    const numeroPoliceIndividuelle = `POL-${suffixe}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const b = { id: String(n).padStart(2, "0"), lien: nouv.lien, nom: nouv.nom, naissance: nouv.naissance, photo: nouv.photo, sexe: nouv.sexe, telephone: nouv.telephone, adresse: nouv.adresse, groupeSanguin: nouv.groupeSanguin, conditionsSante: nouv.conditionsSante, carte: numeroPoliceIndividuelle, numeroPolice: numeroPoliceIndividuelle, icon: iconFor, grade: "dependant", statutAffiliation: "Actif", faceRegistered: false, acces: { identifiant: nouv.telephone || numeroPoliceIndividuelle, pin } };
    setSession({ ...session, beneficiaires: [...session.beneficiaires, b] });
    setNouv({ lien: "Enfant", nom: "", naissance: "", photo: "", sexe: "Féminin", telephone: "", adresse: "", groupeSanguin: "", pieceIdentite: "", conditionsSante: [] });
    setAddOpen(false);
    notify(`${b.nom} affilié(e) — police individuelle ${numeroPoliceIndividuelle} matérialisée, accès envoyé au ${nouv.telephone || "numéro du souscripteur"} (SMS/WhatsApp)`);
    // Transmis à l'assureur pour matérialisation officielle de la police individuelle et revue de la surprime santé si nécessaire.
    try {
      const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
      const compteSouscripteur = comptes.find((c) => c.donnees?.police === session.police) || comptes.find((c) => c.donnees?.contrat === session.contrat);
      const nouveauCompteAyantDroit = {
        type: "assure", nom: b.nom, acces: [{ identifiant: b.acces.identifiant, motDePasseProvisoire: pin, statut: "Actif" }], accesMobile: true, dateCreation: "15/07/2026",
        donnees: {
          id: Date.now(), statut: "Actif", dateActivation: "15/07/2026", telephone: b.telephone, ville: compteSouscripteur?.donnees?.ville || "Kinshasa",
          dateNaissance: b.naissance, sexe: b.sexe, formule: session.formule?.nom || compteSouscripteur?.donnees?.formule, nbAyantsDroit: 0,
          police: numeroPoliceIndividuelle, contrat: session.contrat, rattacheA: session.police, lienAvecSouscripteur: nouv.lien,
          conditionsSante: nouv.conditionsSante, surprimeEnAttenteRevue: nouv.conditionsSante.length > 0,
          garantiesConsommation: (compteSouscripteur?.donnees?.garantiesConsommation || []).map((g) => ({ nom: g.nom, consomme: 0 })), telemedecineConsommee: 0,
        },
      };
      await sauvegarderCanalPartage(CLE_COMPTES_PARTAGES, [nouveauCompteAyantDroit, ...comptes]);
    } catch (e) { /* stockage indisponible — l'ayant droit reste actif localement, à synchroniser plus tard */ }
  };

  const liste = session.beneficiaires.filter((b) => b.nom.toLowerCase().includes(query.toLowerCase()));
  const actifs = session.beneficiaires.filter((b) => b.statutAffiliation !== "Suspendu").length;

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Console d'affiliation</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.assure.employeur || "Gestion familiale"}</div></div>
      </div>

      <div className="px-5 mt-2">
        <Card className="p-4 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
          <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 10.5, color: "#B9C3D6", textTransform: "uppercase" }}>Affiliés actifs</div><div style={{ fontFamily: serif, fontSize: 24, color: "white" }}>{actifs} / {session.beneficiaires.length}</div></div>
          <Users2 size={28} color={C.gold} />
        </Card>

        <div className="relative mt-3 mb-2">
          <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un affilié…" style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>

        <div className="space-y-2">
          {liste.map((b) => (
            <Card key={b.id} className="p-3.5 flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: b.statutAffiliation === "Suspendu" ? C.redSoft : C.ivory }}><b.icon size={15} color={b.statutAffiliation === "Suspendu" ? C.red : C.navy2} /></div>
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>{b.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{b.lien} · {gradeLabel(b.grade)} · {b.carte}</div></div>
              {b.id !== "00" && (
                <button onClick={() => toggleStatut(b.id)} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: b.statutAffiliation === "Suspendu" ? C.greenSoft : C.redSoft, fontFamily: sans, fontSize: 10, fontWeight: 700, color: b.statutAffiliation === "Suspendu" ? C.green : C.red }}>
                  {b.statutAffiliation === "Suspendu" ? <UserCheck size={11} /> : <Ban size={11} />} {b.statutAffiliation === "Suspendu" ? "Réactiver" : "Suspendre"}
                </button>
              )}
            </Card>
          ))}
        </div>

        {!addOpen ? (
          <button onClick={() => setAddOpen(true)} className="w-full rounded-xl py-3 mt-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><UserPlus size={15} /> Affilier un nouveau membre</button>
        ) : (
          <Card className="p-4 mt-3 space-y-2">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Nouvel affilié — création de sa propre police</div>
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer flex-shrink-0">
                <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 46, height: 46, background: C.ivory, border: `1.5px dashed ${nouv.photo ? C.green : C.red}` }}>
                  {nouv.photo ? <img src={nouv.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={17} color={C.navy2} />}
                </div>
                <input type="file" accept="image/*" capture="user" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setNouv({ ...nouv, photo: URL.createObjectURL(f) }); }} />
              </label>
              <span style={{ fontFamily: sans, fontSize: 10.5, color: nouv.photo ? C.sub : C.red }}>Photo obligatoire (reconnaissance faciale)</span>
            </div>
            <select style={inputStyle} value={nouv.lien} onChange={(e) => setNouv({ ...nouv, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Employé</option><option>Autre</option></select>
            <input style={inputStyle} placeholder="Nom complet" value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input style={inputStyle} type="date" value={nouv.naissance} onChange={(e) => setNouv({ ...nouv, naissance: e.target.value })} />
              <select style={inputStyle} value={nouv.sexe} onChange={(e) => setNouv({ ...nouv, sexe: e.target.value })}><option>Féminin</option><option>Masculin</option></select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input style={inputStyle} placeholder="Téléphone (son accès)" value={nouv.telephone} onChange={(e) => setNouv({ ...nouv, telephone: e.target.value })} />
              <select style={inputStyle} value={nouv.groupeSanguin} onChange={(e) => setNouv({ ...nouv, groupeSanguin: e.target.value })}><option value="">Groupe sanguin</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select>
            </div>
            <input style={inputStyle} placeholder="Adresse" value={nouv.adresse} onChange={(e) => setNouv({ ...nouv, adresse: e.target.value })} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Conditions médicales connues (optionnel)</div>
              <div className="grid grid-cols-2 gap-1.5">
                {CONDITIONS_SANTE.map((c) => (
                  <label key={c.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: nouv.conditionsSante.includes(c.id) ? "#FBEAE8" : C.ivory }}>
                    <input type="checkbox" checked={nouv.conditionsSante.includes(c.id)} onChange={(e) => setNouv({ ...nouv, conditionsSante: e.target.checked ? [...nouv.conditionsSante, c.id] : nouv.conditionsSante.filter((id) => id !== c.id) })} />
                    <span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink }}>{c.label}</span>
                  </label>
                ))}
              </div>
              {nouv.conditionsSante.length > 0 && <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Ces informations seront transmises à l'assureur pour ajuster, si nécessaire, la prime individuelle de ce bénéficiaire.</div>}
            </div>
            <label className="flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer" style={{ ...inputStyle, color: nouv.pieceIdentite ? C.ink : C.sub }}>
              <Upload size={14} color={C.navy2} />{nouv.pieceIdentite || "Pièce d'identité / acte de naissance"}
              <input type="file" hidden onChange={(e) => setNouv({ ...nouv, pieceIdentite: e.target.files?.[0]?.name || "" })} />
            </label>
            <div className="flex gap-2">
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button>
              <button onClick={ajouter} disabled={!nouv.nom || !nouv.naissance || !nouv.photo} className="flex-1 rounded-lg py-2" style={{ background: (!nouv.nom || !nouv.naissance || !nouv.photo) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Créer sa police</button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function QRCodeJPEGGenerator({ value, size = 120, filename = "QRCode_Assure" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value || "NEOGTEC-HEALTHCARE", {
        width: size,
        margin: 1,
        color: { dark: "#0D2818", light: "#FFFFFF" }
      });
    }
  }, [value, size]);

  const downloadJPEG = (e) => {
    if (e) e.stopPropagation();
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} className="rounded-lg shadow-sm border border-stone-200" />
      <button
        onClick={downloadJPEG}
        className="px-3 py-1.5 rounded-lg bg-[#0D2818] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#1B4A34] transition-all cursor-pointer"
      >
        <Download size={13} /> Télécharger QR (.Jpeg)
      </button>
    </div>
  );
}

function RealCameraQRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    if (isOpen) {
      setError(null);
      navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setError("Impossible d'accéder à la caméra. Vérifiez les autorisations dans votre navigateur.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const captureAndScan = () => {
    onScanSuccess?.({
      carte: "SP-KIN-000482-00",
      nom: "MUKENDI Jean-Paul",
      police: "SP-KIN-000482",
      statut: "Actif",
      formule: "Confort Famille"
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-stone-100 cursor-pointer">
          <X size={18} />
        </button>
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-[#0D2818]">Scanner un QR Code (Caméra)</div>
          <div className="text-xs text-stone-500">Pointez la caméra vers le code QR de l'assuré</div>
        </div>

        {error ? (
          <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl mb-4 text-center">{error}</div>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-black mb-4 h-64 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-emerald-400 border-dashed m-10 rounded-lg animate-pulse pointer-events-none" />
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" /> Caméra Active
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold cursor-pointer">
            Annuler
          </button>
          <button onClick={captureAndScan} className="flex-1 py-2.5 rounded-xl bg-[#0D2818] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
            <ScanLine size={14} /> Détecter & Valider
          </button>
        </div>
      </div>
    </div>
  );
}

function RealCameraFaceModal({ isOpen, onClose, onVerified }) {
  const videoRef = useRef(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matched, setMatched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    if (isOpen) {
      setError(null);
      setMatched(false);
      setAnalyzing(false);
      navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: "user" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setError("Impossible d'accéder à la caméra frontale.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const capturePhoto = () => {
    if (!videoRef.current) return null;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const verifyFace = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setMatched(true);
      const img = capturePhoto();
      setTimeout(() => {
        onVerified?.(img);
        onClose();
      }, 1000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-stone-100 cursor-pointer">
          <X size={18} />
        </button>
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-[#0D2818]">Reconnaissance Faciale Temps Réel</div>
          <div className="text-xs text-stone-500">Centrez votre visage dans l'ovale de détection</div>
        </div>

        {error ? (
          <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl mb-4 text-center">{error}</div>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-black mb-4 h-64 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-40 h-52 border-2 ${matched ? 'border-emerald-500 bg-emerald-500/10' : analyzing ? 'border-amber-400' : 'border-white/80'} border-dashed rounded-[50%] transition-all`} />
            </div>
            {matched && (
              <div className="absolute bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 size={16} /> Identité Vérifiée (99.8%)
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold cursor-pointer">
            Fermer
          </button>
          <button
            onClick={verifyFace}
            disabled={analyzing || matched}
            className="flex-1 py-2.5 rounded-xl bg-[#0D2818] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {analyzing ? <Loader2 size={14} className="animate-spin" /> : <ScanFace size={14} />}
            {analyzing ? "Analyse faciale..." : "Scanner le Visage"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CarteFlip({ session, setSession, notify, go }) {
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const [qrToken, setQrToken] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [scannerOpen, setScannerOpen] = useState(false);
  const [faceModalOpen, setFaceModalOpen] = useState(false);

  React.useEffect(() => {
    const t = setInterval(() => setQrToken(Math.floor(100000 + Math.random() * 900000)), 30000);
    return () => clearInterval(t);
  }, []);
  const b = session.beneficiaires[idx];
  const chefDeFamille = session.beneficiaires[0];
  const couvertures = buildCouvertures(session);
  const setMethode = (m) => { setSession({ ...session, idMethode: m }); notify(`Identification par défaut : ${m === "visage" ? "reconnaissance faciale" : "QR code"}`); };
  const partagerQr = () => notify(`Code QR de ${chefDeFamille.nom} partagé`);
  const telechargerQr = () => downloadText(`Carte_${chefDeFamille.carte}.txt`, `NEOGTEC HEALTHCARE — Carte du chef de famille\nNom : ${chefDeFamille.nom}\nN° Carte : ${chefDeFamille.carte}\nPolice : ${session.police}\nValidité : ${session.validite}\nJeton dynamique : ${qrToken}`);

  return (
    <div className="px-5 pt-4">
      <RealCameraQRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(data) => notify(`Carte ${data.carte} scanned — Patient ${data.nom} authentifié !`)}
      />
      <RealCameraFaceModal
        isOpen={faceModalOpen}
        onClose={() => setFaceModalOpen(false)}
        onVerified={() => notify("Visage numérisé et authentifié avec succès !")}
      />

      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Ma carte d'assuré</div></div>
        </div>
        <button
          onClick={() => setScannerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2818] text-white text-xs font-bold cursor-pointer hover:bg-[#1B4A34] transition-all"
        >
          <Camera size={14} /> Tester Caméra
        </button>
      </div>

      <div onClick={() => setFlipped(!flipped)} style={{ perspective: 1000 }} className="cursor-pointer">
        <div style={{ position: "relative", width: "100%", minHeight: 220, transition: "transform .6s", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 20, background: `linear-gradient(135deg, ${C.navy}, ${C.navy2} 60%, #0F1C33)`, padding: 20, color: "white", boxShadow: "0 8px 24px rgba(20,38,68,0.25)" }}>
            <div className="flex items-center justify-between"><div style={{ fontFamily: sans, fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>NEOGTEC HEALTHCARE</div><ShieldCheck size={18} color={C.gold} /></div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.gold, marginTop: 2, fontStyle: "italic" }}>Carte d'Assuré Santé</div>
            <div style={{ marginTop: 22, fontFamily: serif, fontSize: 17 }}>{b.nom}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: "#C7D0DF" }}>{b.lien}</div>
            <div className="flex items-center justify-between" style={{ marginTop: 18 }}>
              <div><div style={{ fontFamily: sans, fontSize: 9, color: "#9AA6BC", textTransform: "uppercase" }}>N° Carte</div><div style={{ fontFamily: mono, fontSize: 13 }}>{b.carte}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontFamily: sans, fontSize: 9, color: "#9AA6BC", textTransform: "uppercase" }}>Validité</div><div style={{ fontFamily: sans, fontSize: 11 }}>{session.validite}</div></div>
            </div>
          </div>

          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 20, background: "white", border: `1px solid ${C.line}`, padding: 16, display: "flex", flexDirection: "column", items: "center", justify: "center", boxShadow: "0 8px 24px rgba(20,38,68,0.12)" }}>
            {session.idMethode === "visage" ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center rounded-full" style={{ width: 80, height: 80, background: C.ivory }}><ScanFace size={40} color={C.navy} /></div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textAlign: "center" }}>Reconnaissance faciale activée</div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFaceModalOpen(true); }}
                  className="px-3 py-1.5 rounded-lg bg-[#0D2818] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#1B4A34] transition-all"
                >
                  <Camera size={13} /> Lancer la Caméra Faciale
                </button>
              </div>
            ) : (
              <QRCodeJPEGGenerator value={`NEOGTEC:${b.carte}:${b.nom}:${qrToken}`} filename={`Carte_${b.carte}`} />
            )}
            <div style={{ fontFamily: mono, fontSize: 10, color: C.gold, marginTop: 4 }}>{b.carte}</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textAlign: "center", marginTop: 10 }}>Touchez la carte pour afficher le QR code ou tester la caméra</div>

      <Card className="p-3.5 flex items-start gap-2 mt-3" style={{ background: C.goldSoft, border: "none" }}>
        <BadgeCheck size={15} color={C.navy} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 11, color: C.navy }}>Aucune carte physique n'est nécessaire. Présentez le QR code téléchargeable en .JPEG ou votre visage via caméra réelle.</span>
      </Card>

      <SectionLabel>Code QR du chef de famille — dynamique hors-ligne</SectionLabel>
      <Card className="p-4 flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-2 rounded-full px-2.5 py-1" style={{ background: C.greenSoft }}>
          <WifiOff size={11} color={C.green} /><span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.green }}>Disponible sans connexion internet</span>
        </div>
        <QRCodeJPEGGenerator value={`NEOGTEC:${chefDeFamille.carte}:${chefDeFamille.nom}:${qrToken}`} filename={`ChefFamille_${chefDeFamille.carte}`} />
        <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink, marginTop: 10 }}>{chefDeFamille.nom}</div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{chefDeFamille.carte}</div>
        <div className="flex items-center gap-1.5 mt-2" style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700 }}><RefreshCw size={11} /> Jeton {qrToken} · se régénère toutes les 30s</div>
        <div className="flex gap-2 w-full mt-3">
          <button onClick={partagerQr} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.ink }}><Share2 size={13} /> Partager</button>
          <button onClick={telechargerQr} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ background: C.navy, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: "white" }}><FileDown size={13} /> Fiche TXT</button>
        </div>
      </Card>

      <SectionLabel>Mes couvertures</SectionLabel>
      <div className="space-y-2">
        {couvertures.map((cv) => (
          <Card key={cv.id} className="p-3.5 flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 40, height: 40, background: cv.couleur }}><ShieldCheck size={18} color="white" /></div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{cv.nom}</div><div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{cv.numero}</div></div>
            <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: cv.couleur, textAlign: "right" }}>{cv.taux}</span>
          </Card>
        ))}
      </div>

      <SectionLabel>Identification biométrique</SectionLabel>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: session.faceRegistered ? C.greenSoft : C.redSoft }}>{session.faceRegistered ? <UserCheck size={18} color={C.green} /> : <ScanFace size={18} color={C.red} />}</div>
          <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{session.faceRegistered ? "Visage enregistré" : "Visage non enregistré"}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{session.faceRegistered ? "Reconnaissable dans le réseau conventionné" : "Enregistrez votre visage pour vous passer de carte"}</div></div>
        </div>
        {session.faceRegistered && (
          <div className="mt-3">
            <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 6 }}>Méthode par défaut à l'hôpital</div>
            <div className="flex gap-2">
              <button onClick={() => setMethode("visage")} className="flex-1 rounded-xl py-2 flex items-center justify-center gap-1.5" style={{ background: session.idMethode === "visage" ? C.navy : "white", color: session.idMethode === "visage" ? "white" : C.ink, border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><ScanFace size={13} /> Visage</button>
              <button onClick={() => setMethode("qr")} className="flex-1 rounded-xl py-2 flex items-center justify-center gap-1.5" style={{ background: session.idMethode === "qr" ? C.navy : "white", color: session.idMethode === "qr" ? "white" : C.ink, border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>QR code</button>
            </div>
          </div>
        )}
      </Card>

      <SectionLabel>Membres de la famille</SectionLabel>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {session.beneficiaires.map((m, i) => (
          <button key={m.id} onClick={() => setIdx(i)} className="flex-shrink-0 cursor-pointer">
            <Card className="p-3 flex flex-col items-center" style={{ width: 84, border: idx === i ? `1.5px solid ${C.gold}` : `1px solid ${C.line}` }}>
              <div className="flex items-center justify-center rounded-full overflow-hidden relative" style={{ width: 32, height: 32, background: idx === i ? C.goldSoft : C.ivory }}>
                {m.photo ? <img src={m.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <m.icon size={15} color={C.navy2} />}
                {m.faceRegistered && <div className="absolute flex items-center justify-center rounded-full" style={{ width: 12, height: 12, background: C.green, bottom: -1, right: -1, border: "1.5px solid white" }}><ScanFace size={7} color="white" /></div>}
              </div>
              <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 600, color: C.ink, marginTop: 6, textAlign: "center", lineHeight: 1.2 }}>{m.nom.split(" ")[0]}</div>
            </Card>
          </button>
        ))}
      </div>

      {idx > 0 && (
        <Card className="p-4 mt-3">
          <div className="flex items-center gap-2 mb-2"><Link2 size={14} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Compte ayant droit</span></div>
          <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{b.nom} peut disposer de son propre accès à l'application, rattaché au contrat de <b>{session.beneficiaires[0].nom}</b> ({session.assure.employeur || "souscripteur"}).</div>
          {session.vueCompteId === b.id ? (
            <div className="flex items-center gap-2 mt-3">
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: C.goldSoft, fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.navy }}><UserRoundCheck size={11} /> Compte actif : {b.nom}</span>
              <button onClick={() => { setSession({ ...session, vueCompteId: "00" }); notify("Retour au compte principal"); }} className="rounded-full px-2.5 py-1 cursor-pointer" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.ink }}>Revenir au principal</button>
            </div>
          ) : (
            <button onClick={() => { setSession({ ...session, vueCompteId: b.id }); notify(`Compte ayant droit activé pour ${b.nom}`); }} className="w-full rounded-lg py-2 mt-3 flex items-center justify-center gap-1.5 cursor-pointer" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><UserRoundCheck size={13} /> Activer un accès pour {b.nom.split(" ")[0]}</button>
          )}
        </Card>
      )}

      <Card className="p-4 mt-3" style={{ background: C.ivory, border: "none" }}><div className="flex items-center gap-2"><Phone size={14} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>En cas de perte, bloquez la carte depuis Assistance en un tap.</span></div></Card>
    </div>
  );
}

/* =================================================================
   SOINS (PEC / Remboursement / Rendez-vous / Prestataires / Historique)
================================================================= */
function SalleTeleconsultationPatient({ rdv, session, setSession, notify, onQuitter }) {
  const [etat, setEtat] = useState("connexion"); // connexion | salle-attente | en-appel | terminee
  const [micActif, setMicActif] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [dureeSec, setDureeSec] = useState(0);
  const [reseauFaible, setReseauFaible] = useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setEtat("salle-attente"), 1400);
    return () => clearTimeout(t1);
  }, []);

  React.useEffect(() => {
    if (etat !== "en-appel") return;
    const iv = setInterval(() => setDureeSec((d) => d + 1), 1000);
    return () => clearInterval(iv);
  }, [etat]);

  const rejoindre = () => {
    setEtat("en-appel");
    setSession((s) => ({ ...s, rdv: (s.rdv || []).map((r) => (r.id === rdv.id ? { ...r, statut: "En cours" } : r)) }));
    if (rdv.uid) chargerCanalPartage(CLE_TELECONSULTATIONS_PARTAGEES).then((toutes) => sauvegarderCanalPartage(CLE_TELECONSULTATIONS_PARTAGEES, toutes.map((t) => (t.uid === rdv.uid ? { ...t, statut: "En cours" } : t))));
    notify("Connecté à la salle de téléconsultation");
  };

  const terminer = () => {
    setEtat("terminee");
    setSession((s) => ({ ...s, rdv: (s.rdv || []).map((r) => (r.id === rdv.id ? { ...r, statut: "Terminée" } : r)) }));
    if (rdv.uid) chargerCanalPartage(CLE_TELECONSULTATIONS_PARTAGEES).then((toutes) => sauvegarderCanalPartage(CLE_TELECONSULTATIONS_PARTAGEES, toutes.map((t) => (t.uid === rdv.uid ? { ...t, statut: "Terminée" } : t))));
    notify("Consultation terminée");
  };

  const fmtDuree = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="pb-6" style={{ minHeight: 600, background: C.navy }}>
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <button onClick={onQuitter} className="flex items-center gap-1.5" style={{ fontFamily: sans, fontSize: 12, color: "white", fontWeight: 700 }}><ArrowLeft size={14} /> Quitter</button>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: reseauFaible ? "#5A3B10" : "rgba(255,255,255,0.12)" }}>
          <div className="rounded-full" style={{ width: 6, height: 6, background: reseauFaible ? C.amber : C.green }} />
          <span style={{ fontFamily: sans, fontSize: 9.5, color: "white", fontWeight: 700 }}>{reseauFaible ? "Réseau faible — audio compressé" : "Connexion stable"}</span>
        </div>
      </div>

      {etat === "connexion" && (
        <div className="flex flex-col items-center justify-center gap-3" style={{ minHeight: 420 }}>
          <Loader2 size={30} color="white" className="animate-spin" />
          <span style={{ fontFamily: sans, fontSize: 13, color: "white" }}>Connexion à la salle sécurisée…</span>
          <span style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>Vérification de la connectivité (3G / zone rurale compatible)</span>
        </div>
      )}

      {etat === "salle-attente" && (
        <div className="px-5">
          <Card className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: C.ivory }}><Video size={28} color={C.navy} /></div>
            <div><div style={{ fontFamily: serif, fontSize: 17, color: C.navy, fontWeight: 700 }}>{rdv.cible}</div><div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>{rdv.medecin} · {rdv.date} à {rdv.heure}</div></div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Salle d'attente virtuelle — le praticien vous rejoindra sous peu.</div>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => setMicActif(!micActif)} className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: micActif ? C.ivory : C.redSoft }}>{micActif ? <Mic size={18} color={C.navy} /> : <MicOff size={18} color={C.red} />}</button>
              <button onClick={() => setCameraActive(!cameraActive)} className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: cameraActive ? C.ivory : C.redSoft }}>{cameraActive ? <Video size={18} color={C.navy} /> : <VideoOff size={18} color={C.red} />}</button>
            </div>
            <button onClick={rejoindre} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 mt-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><Video size={15} /> Rejoindre maintenant</button>
            <button onClick={() => setReseauFaible(!reseauFaible)} style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Simuler un réseau faible (démo)</button>
          </Card>
        </div>
      )}

      {etat === "en-appel" && (
        <div className="px-4">
          <div className="rounded-2xl relative overflow-hidden mb-3 flex items-center justify-center" style={{ height: 320, background: "#0B1712" }}>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: "#1B4A34" }}><UserCheck size={32} color="white" /></div>
              <span style={{ fontFamily: sans, fontSize: 13, color: "white", fontWeight: 700 }}>{rdv.medecin}</span>
              <span style={{ fontFamily: sans, fontSize: 10.5, color: "#8896B3" }}>{rdv.specialite || "Consultation"}</span>
            </div>
            <div className="absolute rounded-full px-2.5 py-1" style={{ top: 10, left: 10, background: "rgba(0,0,0,0.5)" }}><span style={{ fontFamily: mono, fontSize: 10.5, color: "white" }}>{fmtDuree(dureeSec)}</span></div>
            <div className="absolute rounded-xl flex items-center justify-center" style={{ bottom: 10, right: 10, width: 76, height: 100, background: "#1A2A20", border: "1px solid rgba(255,255,255,0.15)" }}>
              {cameraActive ? <span style={{ fontFamily: sans, fontSize: 9, color: "#8896B3" }}>Vous</span> : <VideoOff size={16} color="#8896B3" />}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={() => setMicActif(!micActif)} className="flex items-center justify-center rounded-full" style={{ width: 50, height: 50, background: micActif ? "rgba(255,255,255,0.15)" : C.red }}>{micActif ? <Mic size={19} color="white" /> : <MicOff size={19} color="white" />}</button>
            <button onClick={terminer} className="flex items-center justify-center rounded-full" style={{ width: 58, height: 58, background: C.red }}><PhoneOff size={22} color="white" /></button>
            <button onClick={() => setCameraActive(!cameraActive)} className="flex items-center justify-center rounded-full" style={{ width: 50, height: 50, background: cameraActive ? "rgba(255,255,255,0.15)" : C.red }}>{cameraActive ? <Video size={19} color="white" /> : <VideoOff size={19} color="white" />}</button>
          </div>
        </div>
      )}

      {etat === "terminee" && (
        <div className="px-5">
          <Card className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: C.greenSoft }}><Check size={24} color={C.green} /></div>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Consultation terminée</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Durée : {fmtDuree(dureeSec)} · Le compte-rendu du praticien sera ajouté à votre dossier médical.</div>
            <button onClick={onQuitter} className="w-full rounded-xl py-3 mt-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>Retour à mes rendez-vous</button>
          </Card>
        </div>
      )}
    </div>
  );
}

function Sinistres({ notify, session, setSession, sub, setSub, go }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ prestataire: "", garantie: session.garanties[0]?.nom || "", montant: "", beneficiaireId: session.beneficiaires[0]?.id });
  const [fileName, setFileName] = useState("");
  const [rdvForm, setRdvForm] = useState({ type: "Présentiel", cible: PRESTATAIRES[0].nom, specialite: SPECIALITES[0], beneficiaireId: session.beneficiaires[0]?.id, date: "", heure: "", garantie: session.garanties[0]?.nom || "", motif: MOTIFS_CONSULTATION[0], premiereVisite: false, notes: "", rappel: "1h", montantEstime: String(CONVENTION_TARIFS[session.garanties[0]?.nom] || "") });
  const [rdvStep, setRdvStep] = useState("form");
  const [sim, setSim] = useState({ beneficiaireId: session.beneficiaires[0]?.id, garantie: session.garanties[0]?.nom || "", montant: "" });
  const [notes, setNotes] = useState({});
  const [prestQuery, setPrestQuery] = useState("");
  const [prestTri, setPrestTri] = useState("proximite"); // 'proximite' | 'prix'
  const [prestTarif, setPrestTarif] = useState("Tous");
  const [pecReseau, setPecReseau] = useState([]);
  const [syncingPec, setSyncingPec] = useState(false);
  const [prestatairesReseau, setPrestatairesReseau] = useState([]);
  const [salleActive, setSalleActive] = useState(null);
  const [syncingRdv, setSyncingRdv] = useState(false);

  const synchroniserRdv = async () => {
    setSyncingRdv(true);
    const toutes = await chargerCanalPartage(CLE_TELECONSULTATIONS_PARTAGEES);
    setSession((s) => ({
      ...s,
      rdv: (s.rdv || []).map((r) => {
        if (!r.uid) return r;
        const maj = toutes.find((t) => t.uid === r.uid);
        if (!maj) return r;
        const statutAffiche = maj.statut === "Programmée" ? "Confirmé" : maj.statut === "En cours" ? "En cours" : maj.statut === "Terminée" ? "Terminée" : r.statut;
        return { ...r, statut: statutAffiche, medecin: maj.medecin || r.medecin };
      }),
    }));
    setSyncingRdv(false);
  };
  React.useEffect(() => { if (sub === "rdv") synchroniserRdv(); }, [sub]);

  const synchroniserPec = async () => {
    setSyncingPec(true);
    const toutesLesPec = await chargerCanalPartage(CLE_PEC_PARTAGEES);
    const numerosBenef = session.beneficiaires.map((b) => b.carte);
    const mesPec = toutesLesPec.filter((p) => p.patientPolice === session.police || p.patientContrat === session.contrat || numerosBenef.includes(p.patientCarte));
    setPecReseau(mesPec);
    setSyncingPec(false);
  };
  React.useEffect(() => { if (sub === "histo") synchroniserPec(); }, [sub]);

  const synchroniserPrestatairesReseau = async () => {
    const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
    const prestataires = comptes
      .filter((c) => c.type === "prestataire" && c.donnees?.latitude && c.donnees?.longitude)
      .map((c) => ({
        id: `reseau-${c.donnees.id}`, nom: c.donnees.nom, type: `${c.donnees.type} conventionné`, ville: `${c.donnees.commune || ""}`,
        distanceKm: distanceKm(POSITION_DEMO_ASSURE.lat, POSITION_DEMO_ASSURE.lng, c.donnees.latitude, c.donnees.longitude),
        ouvert24h: false, tarif: "€€", nouveauSurLeReseau: true,
      }));
    setPrestatairesReseau(prestataires);
  };
  React.useEffect(() => { if (sub === "prest") synchroniserPrestatairesReseau(); }, [sub]);

  const selectedBenef = session.beneficiaires.find((b) => b.id === form.beneficiaireId) || session.beneficiaires[0];
  const taux = tauxFor(selectedBenef?.grade);
  const vent = computeVentilation(form.montant, taux, form.garantie);
  const rdvBenef = session.beneficiaires.find((b) => b.id === rdvForm.beneficiaireId) || session.beneficiaires[0];
  const rdvTaux = tauxFor(rdvBenef?.grade);
  const rdvVent = computeVentilation(rdvForm.montantEstime, rdvTaux, rdvForm.garantie);
  const simBenef = session.beneficiaires.find((b) => b.id === sim.beneficiaireId) || session.beneficiaires[0];
  const simTaux = tauxFor(simBenef?.grade);
  const simVent = computeVentilation(sim.montant, simTaux, sim.garantie);
  const simGarantie = session.garanties.find((g) => g.nom === sim.garantie);
  const simSoldeDispo = simGarantie ? simGarantie.plafond - simGarantie.consomme : 0;

  const submit = (type) => {
    if (!form.prestataire || !form.montant) return;
    setStep("loading");
    setTimeout(() => {
      const entry = { id: Date.now(), date: "06/07/2026", type, prestataire: form.prestataire, montant: Number(form.montant), statut: "En cours", vent: computeVentilation(form.montant, taux, form.garantie) };
      setSession({ ...session, histo: [entry, ...session.histo] });
      setStep("done");
      notify("Dossier de remboursement soumis");
    }, 1100);
  };
  const reset = () => {
    setStep("form");
    setForm({ prestataire: "", garantie: session.garanties[0]?.nom || "", montant: "", beneficiaireId: session.beneficiaires[0]?.id });
    setFileName("");
  };

  const submitRdv = () => {
    if (!rdvForm.date || !rdvForm.heure) return;
    setRdvStep("loading");
    setTimeout(() => {
      const medecin = SPECIALITE_MEDECINS[rdvForm.specialite];
      const beneficiaire = session.beneficiaires.find((b) => b.id === rdvForm.beneficiaireId);
      const uid = rdvForm.type === "Téléconsultation" ? `ASSURE-${Date.now()}` : null;
      const entry = {
        id: Date.now(), uid, type: rdvForm.type,
        cible: rdvForm.type === "Présentiel" ? rdvForm.cible : `${rdvForm.specialite} — ${medecin?.nom || ""}`,
        beneficiaire: beneficiaire?.nom, date: rdvForm.date, heure: rdvForm.heure, statut: rdvForm.type === "Téléconsultation" ? "Demande envoyée" : "Confirmé", medecin: medecin?.nom || "À assigner", specialite: rdvForm.specialite,
        garantie: rdvForm.type === "Présentiel" ? rdvForm.garantie : null, montantEstime: rdvForm.type === "Présentiel" && rdvForm.montantEstime ? Number(rdvForm.montantEstime) : null,
        motif: rdvForm.type === "Présentiel" ? rdvForm.motif : null, premiereVisite: rdvForm.type === "Présentiel" ? rdvForm.premiereVisite : false, notes: rdvForm.type === "Présentiel" ? rdvForm.notes : "", rappel: rdvForm.rappel,
      };
      setSession({ ...session, rdv: [entry, ...(session.rdv || [])] });
      if (rdvForm.type === "Téléconsultation") {
        publierTeleconsultationPartagee({
          uid, patientNom: beneficiaire?.nom || session.assure?.nom, patientCarte: beneficiaire?.carte || `${session.police}-00`,
          souscripteur: session.assure?.nom, police: session.police, contrat: session.contrat,
          medecin: medecin?.nom || "À assigner", specialite: rdvForm.specialite, date: rdvForm.date, heure: rdvForm.heure, statut: "Demande patient",
        });
      }
      setRdvStep("done");
      notify("Rendez-vous confirmé");
    }, 1000);
  };
  const resetRdv = () => { setRdvStep("form"); setRdvForm({ type: "Présentiel", cible: PRESTATAIRES[0].nom, specialite: SPECIALITES[0], beneficiaireId: session.beneficiaires[0]?.id, date: "", heure: "", garantie: session.garanties[0]?.nom || "", motif: MOTIFS_CONSULTATION[0], premiereVisite: false, notes: "", rappel: "1h", montantEstime: String(CONVENTION_TARIFS[session.garanties[0]?.nom] || "") }); };

  const pills = [["rdv", "Rendez-vous"], ["remb", "Rembours."], ["prest", "Prestataires"], ["sim", "Simuler"], ["histo", "Historique"]];

  if (salleActive) {
    return <SalleTeleconsultationPatient rdv={salleActive} session={session} setSession={setSession} notify={notify} onQuitter={() => setSalleActive(null)} />;
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Soins & sinistres</div><div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Tout se fait à distance — aucun passage au bureau requis</div></div>
      </div>
      <div className="px-5 flex gap-2 mb-3 overflow-x-auto">
        {pills.map(([k, l]) => (
          <button key={k} onClick={() => { setSub(k); reset(k); resetRdv(); }} className="flex-shrink-0 rounded-full py-2 px-3.5 text-center" style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, background: sub === k ? C.navy : "white", color: sub === k ? "white" : C.ink, border: `1px solid ${sub === k ? C.navy : C.line}` }}>{l}</button>
        ))}
      </div>

      <div className="px-5">
        {/* PEC / REMBOURSEMENT */}
        {sub === "remb" && step === "form" && (
          <Card className="p-4 space-y-3">
            <Field label="Bénéficiaire concerné">
              <select value={form.beneficiaireId} onChange={(e) => setForm({ ...form, beneficiaireId: e.target.value })} style={inputStyle}>
                {session.beneficiaires.map((b) => <option key={b.id} value={b.id}>{b.nom} — {gradeLabel(b.grade)} ({tauxFor(b.grade)}%)</option>)}
              </select>
            </Field>
            <Field label="Prestataire">
              <select value={form.prestataire} onChange={(e) => setForm({ ...form, prestataire: e.target.value })} style={inputStyle}>
                <option value="">Sélectionner un prestataire…</option>
                {PRESTATAIRES.map((p) => <option key={p.id} value={p.nom}>{p.nom} — {p.distanceKm} km</option>)}
              </select>
            </Field>
            <Field label="Garantie concernée">
              <select
                value={form.garantie}
                onChange={(e) => {
                  const g = e.target.value;
                  setForm({ ...form, garantie: g });
                }}
                style={inputStyle}
              >
                {session.garanties.map((g) => <option key={g.nom}>{g.nom}</option>)}
              </select>
            </Field>
            <Field label="Montant estimé (CDF) *"><input value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 45000" style={{ ...inputStyle, border: !form.montant ? `1px solid ${C.red}` : `1px solid ${C.line}` }} /></Field>
            <Field label="Pièces justificatives *"><label className="flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer" style={{ ...inputStyle, color: fileName ? C.ink : C.sub, border: !fileName ? `1px solid ${C.red}` : `1px solid ${C.line}` }}><Upload size={14} color={C.navy2} />{fileName || "Ajouter facture et prescription (obligatoire)"}<input type="file" hidden onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} /></label></Field>
            {Number(form.montant) > 0 && (
              <Card className="p-3" style={{ background: C.ivory, border: "none" }}>
                <div className="flex items-center gap-1.5 mb-2"><Percent size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>Ventilation de la cascade (temps réel)</span></div>
                <VentilationBar vent={vent} montant={Number(form.montant)} />
              </Card>
            )}
            <button onClick={() => submit("Remboursement")} disabled={!form.prestataire || !form.montant || !fileName} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-1 active:scale-95 transition-transform" style={{ background: (!form.prestataire || !form.montant || !fileName) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><Send size={14} /> Soumettre le dossier</button>
          </Card>
        )}
        {sub === "remb" && step === "loading" && <Card className="p-8 flex flex-col items-center gap-3"><Loader2 size={28} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Transmission au gestionnaire…</span></Card>}
        {sub === "remb" && step === "done" && (
          <Card className="p-6 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: C.greenSoft }}><Check size={22} color={C.green} /></div>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Demande envoyée</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Suivi disponible dans l'onglet Historique. Délai de traitement estimé : 15 jours ouvrables.</div>
            <button onClick={reset} className="mt-2" style={{ fontFamily: sans, color: C.navy2, fontWeight: 700, fontSize: 12 }}>Faire une nouvelle demande</button>
          </Card>
        )}

        {/* RENDEZ-VOUS */}
        {sub === "rdv" && (
          <>
            {rdvStep === "form" && (
              <Card className="p-4 space-y-3 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setRdvForm({ ...rdvForm, type: "Présentiel" })} className="rounded-xl py-3 flex flex-col items-center gap-1" style={{ border: rdvForm.type === "Présentiel" ? `2px solid ${C.gold}` : `1px solid ${C.line}`, background: "white" }}><Building2 size={17} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Présentiel</span></button>
                  <button onClick={() => setRdvForm({ ...rdvForm, type: "Téléconsultation" })} className="rounded-xl py-3 flex flex-col items-center gap-1" style={{ border: rdvForm.type === "Téléconsultation" ? `2px solid ${C.gold}` : `1px solid ${C.line}`, background: "white" }}><Video size={17} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Téléconsultation</span></button>
                </div>
                <Field label="Bénéficiaire"><select style={inputStyle} value={rdvForm.beneficiaireId} onChange={(e) => setRdvForm({ ...rdvForm, beneficiaireId: e.target.value })}>{session.beneficiaires.map((b) => <option key={b.id} value={b.id}>{b.nom}</option>)}</select></Field>
                {rdvForm.type === "Présentiel" ? (
                  <>
                    <Field label="Prestataire (du plus proche au plus loin)"><select style={inputStyle} value={rdvForm.cible} onChange={(e) => setRdvForm({ ...rdvForm, cible: e.target.value })}>{PRESTATAIRES.map((p) => <option key={p.id} value={p.nom}>{p.nom} — {p.distanceKm} km</option>)}</select></Field>
                    <Field label="Motif de consultation"><select style={inputStyle} value={rdvForm.motif} onChange={(e) => setRdvForm({ ...rdvForm, motif: e.target.value })}>{MOTIFS_CONSULTATION.map((m) => <option key={m}>{m}</option>)}</select></Field>
                    <Field label="Garantie concernée">
                      <select style={inputStyle} value={rdvForm.garantie} onChange={(e) => { const g = e.target.value; setRdvForm({ ...rdvForm, garantie: g, montantEstime: String(CONVENTION_TARIFS[g] || "") }); }}>
                        {session.garanties.map((g) => <option key={g.nom}>{g.nom}</option>)}
                      </select>
                    </Field>
                    <label className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: C.ivory }}>
                      <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Première visite chez ce prestataire</span>
                      <input type="checkbox" checked={rdvForm.premiereVisite} onChange={(e) => setRdvForm({ ...rdvForm, premiereVisite: e.target.checked })} />
                    </label>
                    <Field label="Date"><input type="date" style={inputStyle} value={rdvForm.date} onChange={(e) => setRdvForm({ ...rdvForm, date: e.target.value })} /></Field>
                    <Field label="Créneau horaire">
                      <div className="flex flex-wrap gap-1.5">
                        {CRENEAUX.map((c) => <button key={c} onClick={() => setRdvForm({ ...rdvForm, heure: c })} className="rounded-lg px-2.5 py-1.5" style={{ background: rdvForm.heure === c ? C.navy : C.ivory, color: rdvForm.heure === c ? "white" : C.ink, fontFamily: sans, fontSize: 11.5, fontWeight: 600 }}>{c}</button>)}
                      </div>
                    </Field>
                    <Field label="Notes pour le praticien (symptômes, contexte) — optionnel"><textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={rdvForm.notes} onChange={(e) => setRdvForm({ ...rdvForm, notes: e.target.value })} placeholder="Ex : douleur récurrente depuis 3 jours, déjà sous traitement pour…" /></Field>
                    <Field label="Rappel avant le rendez-vous">
                      <div className="grid grid-cols-3 gap-1.5">
                        {[["1h", "1h avant"], ["24h", "24h avant"], ["aucun", "Aucun"]].map(([v, l]) => (
                          <button key={v} onClick={() => setRdvForm({ ...rdvForm, rappel: v })} className="rounded-lg py-2" style={{ background: rdvForm.rappel === v ? C.navy : C.ivory, color: rdvForm.rappel === v ? "white" : C.ink, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{l}</button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Montant estimé de la consultation (CDF)">
                      <div style={{ ...inputStyle, background: C.ivory, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: mono, fontWeight: 700, color: C.navy }}>{rdvForm.montantEstime ? fmt(Number(rdvForm.montantEstime)) : "—"}</span>
                        <BadgePercent size={14} color={C.gold} />
                      </div>
                      <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 3 }}>Tarif conventionné pré-rempli automatiquement selon la garantie — modifiable si vous connaissez un montant différent.</div>
                      <input value={rdvForm.montantEstime} onChange={(e) => setRdvForm({ ...rdvForm, montantEstime: e.target.value.replace(/\D/g, "") })} placeholder="Modifier le montant si besoin" style={{ ...inputStyle, marginTop: 6 }} />
                    </Field>
                    {Number(rdvForm.montantEstime) > 0 && (
                      <Card className="p-3" style={{ background: C.ivory, border: "none" }}>
                        <div className="flex items-center gap-1.5 mb-2"><Percent size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>Ventilation estimée de la cascade</span></div>
                        <VentilationBar vent={rdvVent} montant={Number(rdvForm.montantEstime)} />
                      </Card>
                    )}
                  </>
                ) : (
                  <>
                    <Field label="Spécialité"><select style={inputStyle} value={rdvForm.specialite} onChange={(e) => setRdvForm({ ...rdvForm, specialite: e.target.value, heure: "" })}>{SPECIALITES.map((s) => <option key={s}>{s}</option>)}</select></Field>
                    <Field label="Date"><input type="date" style={inputStyle} value={rdvForm.date} onChange={(e) => setRdvForm({ ...rdvForm, date: e.target.value, heure: "" })} /></Field>
                    {rdvForm.specialite && rdvForm.date && (
                      <>
                        <Card className="p-3 flex items-center gap-2" style={{ background: C.goldSoft, border: "none" }}>
                          <UserRoundCheck size={15} color={C.navy} />
                          <span style={{ fontFamily: sans, fontSize: 11.5, color: C.navy, fontWeight: 700 }}>Dr {SPECIALITE_MEDECINS[rdvForm.specialite]?.nom} disponible le {rdvForm.date}</span>
                        </Card>
                        <Field label="Créneaux disponibles de ce médecin ce jour-là">
                          <div className="flex flex-wrap gap-1.5">
                            {(SPECIALITE_MEDECINS[rdvForm.specialite]?.creneaux || []).map((c) => <button key={c} onClick={() => setRdvForm({ ...rdvForm, heure: c })} className="rounded-lg px-2.5 py-1.5" style={{ background: rdvForm.heure === c ? C.navy : C.ivory, color: rdvForm.heure === c ? "white" : C.ink, fontFamily: sans, fontSize: 11.5, fontWeight: 600 }}>{c}</button>)}
                          </div>
                        </Field>
                      </>
                    )}
                  </>
                )}
                <button onClick={submitRdv} disabled={!rdvForm.date || !rdvForm.heure} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-1" style={{ background: (!rdvForm.date || !rdvForm.heure) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><CalendarCheck size={14} /> Confirmer le rendez-vous</button>
              </Card>
            )}
            {rdvStep === "loading" && <Card className="p-8 flex flex-col items-center gap-3 mb-3"><Loader2 size={28} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Réservation du créneau…</span></Card>}
            {rdvStep === "done" && (
              <Card className="p-6 flex flex-col items-center gap-2 text-center mb-3">
                <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: C.greenSoft }}><Check size={22} color={C.green} /></div>
                <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Rendez-vous confirmé</div>
                <button onClick={resetRdv} className="mt-1" style={{ fontFamily: sans, color: C.navy2, fontWeight: 700, fontSize: 12 }}>Prendre un autre rendez-vous</button>
              </Card>
            )}
            <div className="flex items-center justify-between mb-1">
              <SectionLabel>Mes rendez-vous</SectionLabel>
              <button onClick={synchroniserRdv} disabled={syncingRdv} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ border: `1px solid ${C.navy}` }}>{syncingRdv ? <Loader2 size={10} className="animate-spin" color={C.navy} /> : <RefreshCw size={10} color={C.navy} />}<span style={{ fontFamily: sans, fontSize: 9.5, color: C.navy, fontWeight: 700 }}>Actualiser</span></button>
            </div>
            <div className="space-y-2">
              {(session.rdv || []).length === 0 && <Card className="p-4 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun rendez-vous programmé.</span></Card>}
              {(session.rdv || []).map((r) => (
                <Card key={r.id} className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 36, height: 36, background: C.ivory }}>{r.type === "Téléconsultation" ? <Video size={16} color={C.navy2} /> : <Building2 size={16} color={C.navy2} />}</div>
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{r.cible}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{r.beneficiaire} · {r.date} à {r.heure}</div></div>
                    <StatusPill statut={r.statut} />
                  </div>
                  {r.type === "Présentiel" && r.garantie && (
                    <div className="mt-2">
                      {r.motif && <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginBottom: 3 }}>{r.motif}{r.premiereVisite && " · Première visite"}</div>}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.navy2, background: C.ivory, padding: "2px 8px", borderRadius: 999 }}>{r.garantie}</span>
                        {r.montantEstime > 0 && <span style={{ fontFamily: mono, fontSize: 10.5, color: C.gold, fontWeight: 700 }}>{fmt(r.montantEstime)} estimé</span>}
                      </div>
                    </div>
                  )}
                  {r.type === "Téléconsultation" && (r.statut === "Confirmé" || r.statut === "En cours") && (
                    <button onClick={() => setSalleActive(r)} className="w-full rounded-lg py-2.5 mt-2.5 flex items-center justify-center gap-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Video size={13} /> Rejoindre la salle de téléconsultation</button>
                  )}
                  {r.type === "Téléconsultation" && r.statut === "Demande envoyée" && (
                    <div className="flex items-center gap-1.5 mt-2"><Clock size={12} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.amber, fontWeight: 700 }}>En attente de confirmation par le praticien</span></div>
                  )}
                  {r.type === "Téléconsultation" && r.statut === "Terminée" && (
                    <div className="flex items-center gap-1.5 mt-2"><CheckCircle2 size={12} color={C.green} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.green, fontWeight: 700 }}>Consultation terminée — compte-rendu ajouté à votre dossier médical</span></div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {/* PRESTATAIRES GPS — GPS Santé */}
        {sub === "prest" && (
          <>
            <div className="relative mb-2">
              <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
              <input value={prestQuery} onChange={(e) => setPrestQuery(e.target.value)} placeholder="Rechercher un hôpital, une pharmacie…" style={{ ...inputStyle, paddingLeft: 30 }} />
            </div>
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto">
              <SlidersHorizontal size={12} color={C.sub} style={{ flexShrink: 0 }} />
              {[["proximite", "Plus proche"], ["prix", "Prix conventionné"]].map(([k, l]) => (
                <button key={k} onClick={() => setPrestTri(k)} className="flex-shrink-0 rounded-full px-2.5 py-1" style={{ background: prestTri === k ? C.navy : "white", color: prestTri === k ? "white" : C.ink, border: `1px solid ${prestTri === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}>{l}</button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
              {["Tous", "€", "€€", "€€€"].map((t) => (
                <button key={t} onClick={() => setPrestTarif(t)} className="flex-shrink-0 rounded-full px-2.5 py-1" style={{ background: prestTarif === t ? C.goldSoft : "white", color: C.ink, border: `1px solid ${prestTarif === t ? C.gold : C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}>{t}</button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mb-3"><Navigation size={13} color={C.gold} /><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{prestTri === "proximite" ? "Triés du plus proche au plus éloigné" : "Triés du tarif conventionné le plus bas au plus élevé"}</span></div>
            <div className="space-y-2">
              {[...prestatairesReseau, ...PRESTATAIRES]
                .filter((p) => (p.nom + p.type + p.ville).toLowerCase().includes(prestQuery.toLowerCase()))
                .filter((p) => prestTarif === "Tous" || p.tarif === prestTarif)
                .slice()
                .sort((a, b) => prestTri === "proximite" ? a.distanceKm - b.distanceKm : a.tarif.length - b.tarif.length)
                .map((p) => (
                  <Card key={p.id} className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 40, height: 40, background: C.ivory }}>{p.type.includes("Pharmacie") ? <Pill size={17} color={C.navy2} /> : <Building2 size={17} color={C.navy2} />}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{p.nom}</span>{p.nouveauSurLeReseau && <span style={{ fontFamily: sans, fontSize: 8.5, fontWeight: 700, color: C.green, background: C.greenSoft, padding: "1px 5px", borderRadius: 999 }}>NOUVEAU</span>}</div>
                        <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{p.type} · {p.ville}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: C.gold, background: C.goldSoft, padding: "1px 6px", borderRadius: 999 }}>{p.tarif} conventionné</span>
                          {p.ouvert24h && <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.green, background: C.greenSoft, padding: "1px 6px", borderRadius: 999 }}>Ouvert 24h/24</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0"><div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.navy }}>{p.distanceKm} km</div></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => notify(`Itinéraire vers ${p.nom} ouvert`)} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.ink }}><Route size={13} /> Itinéraire</button>
                      <button onClick={() => { setSub("rdv"); setRdvForm({ ...rdvForm, type: "Présentiel", cible: p.nom }); }} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ background: C.navy, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: "white" }}><CalendarCheck size={13} /> Prendre RDV</button>
                    </div>
                  </Card>
                ))}
            </div>
          </>
        )}

        {/* SIMULATEUR DE REMBOURSEMENT */}
        {sub === "sim" && (
          <>
            <Card className="p-3 mb-3 flex items-start gap-2" style={{ background: C.ivory, border: "none" }}>
              <Calculator size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Estimez votre remboursement avant une consultation. Simulation informative, aucune demande n'est envoyée.</span>
            </Card>
            <Card className="p-4 space-y-3">
              <Field label="Bénéficiaire concerné"><select value={sim.beneficiaireId} onChange={(e) => setSim({ ...sim, beneficiaireId: e.target.value })} style={inputStyle}>{session.beneficiaires.map((b) => <option key={b.id} value={b.id}>{b.nom} — {tauxFor(b.grade)}%</option>)}</select></Field>
              <Field label="Garantie concernée"><select value={sim.garantie} onChange={(e) => setSim({ ...sim, garantie: e.target.value })} style={inputStyle}>{session.garanties.map((g) => <option key={g.nom}>{g.nom}</option>)}</select></Field>
              <Field label="Montant estimé de l'acte (CDF)"><input value={sim.montant} onChange={(e) => setSim({ ...sim, montant: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 60000" style={inputStyle} /></Field>
            </Card>
            {Number(sim.montant) > 0 && (
              <Card className="p-4 mt-3">
                <div className="flex items-center gap-1.5 mb-2"><Percent size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>Estimation de la ventilation</span></div>
                <VentilationBar vent={simVent} montant={Number(sim.montant)} />
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                  <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Solde disponible sur cette garantie</span>
                  <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: simSoldeDispo >= Number(sim.montant) ? C.green : C.red }}>{fmt(simSoldeDispo)}</span>
                </div>
                {simSoldeDispo < Number(sim.montant) && <div className="flex items-center gap-1.5 mt-2"><AlertTriangle size={12} color={C.red} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.red }}>Ce montant dépasse le solde restant sur cette garantie.</span></div>}
              </Card>
            )}
          </>
        )}

        {/* HISTORIQUE */}
        {sub === "histo" && (
          <div className="space-y-3">
            <button onClick={synchroniserPec} disabled={syncingPec} className="w-full rounded-2xl py-3 mb-1 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm" style={{ border: `1.5px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12.5, fontWeight: 700, background: "white" }}>
              {syncingPec ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} {syncingPec ? "Synchronisation en cours…" : "Synchroniser le réseau de soins"}
            </button>
            {pecReseau.length > 0 && (
              <div className="mb-3">
                <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 800, color: C.navy, textTransform: "uppercase", letterSpacing: 0.5, margin: "6px 2px" }}> Confirmées par le réseau de soins</div>
                {pecReseau.map((p) => (
                  <Card key={p.uid} className="p-4 mb-2 border border-stone-200 shadow-sm">
                    <div className="flex items-center justify-between"><div style={{ fontFamily: sans, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{p.etablissement}</div><StatusPill statut={p.statutReglement} /></div>
                    <div className="flex items-center justify-between mt-1 mb-2"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{p.acteLibelle} · {p.date}{p.heure ? ` à ${p.heure}` : ""}</span><span style={{ fontFamily: mono, fontSize: 13, color: C.navy, fontWeight: 700 }}>{fmt(p.montant)}</span></div>
                    {p.vent && <VentilationBar vent={p.vent} montant={p.montant} />}
                    {p.numeroBordereau && (
                      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-stone-100">
                        <CheckCircle2 size={13} color={C.green} />
                        <span style={{ fontFamily: mono, fontSize: 10.5, color: C.green, fontWeight: 700 }}>Réglé par l'assureur — Bordereau N° {p.numeroBordereau}</span>
                      </div>
                    )}
                  </Card>
                ))}
                <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 800, color: C.navy, textTransform: "uppercase", letterSpacing: 0.5, margin: "12px 2px 6px" }}> Declarées en ligne par l'assuré</div>
              </div>
            )}
            {session.histo.length === 0 && <Card className="p-6 text-center"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucun demande de soins/sinistre enregistrée.</span></Card>}
            {session.histo.map((h) => (
              <Card key={h.id} className="p-4 border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-amber-700" />
                    <span style={{ fontFamily: sans, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{h.prestataire}</span>
                  </div>
                  <StatusPill statut={h.statut} />
                </div>
                <div className="flex items-center justify-between mt-1 mb-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>{h.type}</span>
                    <span>•</span>
                    <span>{h.date}</span>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 13.5, color: C.navy, fontWeight: 800 }}>{fmt(h.montant)}</span>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Paperclip size={10} /> Facture & Prescription
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                    <FileText size={10} /> Référence : SIN-{h.id}
                  </span>
                </div>
                {h.vent && <VentilationBar vent={h.vent} montant={h.montant} />}
                {h.statut === "Validé" && (
                  <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                    {notes[h.id]?.envoye ? (
                      <div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} color={notes[h.id].rating >= n ? C.gold : C.line} fill={notes[h.id].rating >= n ? C.gold : "none"} />)}
                          <span style={{ fontFamily: sans, fontSize: 10, color: C.green, fontWeight: 700, marginLeft: 4 }}>Avis publié</span>
                        </div>
                        {notes[h.id].comment && <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 4, fontStyle: "italic" }}>« {notes[h.id].comment} »</div>}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 mb-2">
                          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginRight: 4 }}>Noter ce prestataire :</span>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button key={n} onClick={() => setNotes({ ...notes, [h.id]: { ...(notes[h.id] || {}), rating: n } })}><Star size={14} color={(notes[h.id]?.rating || 0) >= n ? C.gold : C.line} fill={(notes[h.id]?.rating || 0) >= n ? C.gold : "none"} /></button>
                          ))}
                        </div>
                        {notes[h.id]?.rating > 0 && (
                          <div className="flex items-center gap-2">
                            <input value={notes[h.id]?.comment || ""} onChange={(e) => setNotes({ ...notes, [h.id]: { ...notes[h.id], comment: e.target.value } })} placeholder="Ajouter un commentaire (optionnel)" style={{ ...inputStyle, fontSize: 11.5, padding: "8px 10px" }} />
                            <button onClick={() => setNotes({ ...notes, [h.id]: { ...notes[h.id], envoye: true } })} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: C.navy }}><MessageSquarePlus size={13} color="white" /></button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =================================================================
   DOSSIER MÉDICAL
================================================================= */
function DossierMedical({ session, onBack }) {
  const d = session.dossierMedical || {};
  const cv = d.constantesVitales || {};
  const visites = d.visites || [];
  const [filtreDate, setFiltreDate] = useState("Toutes");
  const visitesFiltrees = filtreDate === "Toutes" ? visites : visites.filter((v) => v.date === filtreDate);
  const hasData = Object.keys(cv).length || d.allergies?.length || d.maladiesChroniques?.length || d.traitementsEnCours?.length || d.antecedentsChirurgicaux?.length || d.antecedentsFamiliaux?.length || visites.length;
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Dossier médical</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{session.assure.nom}</div></div>
      </div>
      <div className="px-5">
        {!hasData && <Card className="p-6 text-center mt-2"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Votre dossier médical est vide pour l'instant.<br />Il se remplira automatiquement après vos consultations dans le réseau conventionné.</span></Card>}

        {Object.keys(cv).length > 0 && (
          <>
            <SectionLabel>Constantes vitales {cv.dateRelevé && <span style={{ fontWeight: 400, textTransform: "none" }}>· relevées le {cv.dateRelevé}</span>}</SectionLabel>
            <Card className="p-4 grid grid-cols-3 gap-3 text-center">
              <div><HeartPulse size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Tension</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{cv.tension || "—"}</div></div>
              <div><Activity size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Pouls</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{cv.frequenceCardiaque || "—"}</div></div>
              <div><Thermometer size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Température</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{cv.temperature || "—"}</div></div>
              <div><Ruler size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Taille</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{cv.taille || "—"}</div></div>
              <div><Layers size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Poids / IMC</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{cv.poids || "—"} {cv.imc && `(${cv.imc})`}</div></div>
              <div><Heart size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Groupe</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{cv.groupeSanguin || "—"}</div></div>
            </Card>
          </>
        )}

        {d.allergies?.length > 0 && (
          <>
            <SectionLabel>Allergies</SectionLabel>
            <Card className="p-4"><ul className="space-y-2">{d.allergies.map((a, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}><AlertTriangle size={14} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />{a}</li>)}</ul></Card>
          </>
        )}

        {d.maladiesChroniques?.length > 0 && (
          <>
            <SectionLabel>Maladies chroniques</SectionLabel>
            <Card className="p-4"><ul className="space-y-2">{d.maladiesChroniques.map((a, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}><HeartPulse size={14} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />{a}</li>)}</ul></Card>
          </>
        )}

        {d.traitementsEnCours?.length > 0 && (
          <>
            <SectionLabel>Traitements en cours</SectionLabel>
            <div className="space-y-2">
              {d.traitementsEnCours.map((t, i) => (
                <Card key={i} className="p-3.5 flex items-center gap-3">
                  <Pill size={16} color={C.navy2} />
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{t.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{t.posologie}</div></div>
                  <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Depuis {t.depuis}</span>
                </Card>
              ))}
            </div>
          </>
        )}

        {d.antecedentsChirurgicaux?.length > 0 && (
          <>
            <SectionLabel>Antécédents chirurgicaux</SectionLabel>
            <div className="space-y-2">
              {d.antecedentsChirurgicaux.map((a, i) => (
                <Card key={i} className="p-3.5 flex items-center gap-3">
                  <Scissors size={16} color={C.navy2} />
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{a.intervention}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{a.etablissement}</div></div>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.sub }}>{a.date}</span>
                </Card>
              ))}
            </div>
          </>
        )}

        {d.antecedentsFamiliaux?.length > 0 && (
          <>
            <SectionLabel>Antécédents familiaux</SectionLabel>
            <Card className="p-4"><ul className="space-y-2">{d.antecedentsFamiliaux.map((a, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}><Dna size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />{a}</li>)}</ul></Card>
          </>
        )}

        {visites.length > 0 && (
          <>
            <SectionLabel>Historique de mes visites (par date)</SectionLabel>
            <div className="px-0 mb-3">
              <select value={filtreDate} onChange={(e) => setFiltreDate(e.target.value)} style={inputStyle}>
                <option value="Toutes">Toutes les dates ({visites.length})</option>
                {visites.map((v) => <option key={v.date} value={v.date}>{v.date} — {v.motif}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {visitesFiltrees.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune visite pour cette date.</span></Card>}
              {visitesFiltrees.map((v, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.navy }}>{v.date}</span>
                    {v.motif && <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.navy2, background: C.ivory, padding: "2px 8px", borderRadius: 999 }}>{v.motif}</span>}
                  </div>

                  {v.diagnostic && (
                    <div className="flex items-center gap-2 mb-1"><Stethoscope size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Diagnostic : <b>{v.diagnostic}</b></span></div>
                  )}
                  {v.prescripteur && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginLeft: 20 }}>{v.prescripteur}</div>}

                  {v.examens?.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="flex items-center gap-1.5 mb-1.5"><FlaskConical size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Examens biologiques</span></div>
                      {v.examens.map((e, j) => (
                        <div key={j} className="flex items-center justify-between py-1">
                          <span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.nom}</span>
                          <span style={{ fontFamily: mono, fontSize: 11.5, color: e.statut === "Normal" ? C.green : C.amber, fontWeight: 700 }}>{e.resultat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {v.imagerie?.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="flex items-center gap-1.5 mb-1.5"><ScanLine size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Imagerie médicale</span></div>
                      {v.imagerie.map((im, j) => (
                        <div key={j}>
                          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.ink }}>{im.type}</div>
                          <div style={{ fontFamily: sans, fontSize: 11, color: C.navy2 }}>{im.conclusion}</div>
                          <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{im.etablissement}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {v.vaccinations?.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="flex items-center gap-1.5"><Syringe size={12} color={C.green} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Vaccination : {v.vaccinations.map((vc) => vc.nom).join(", ")}</span></div>
                    </div>
                  )}

                  {v.ordonnance && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5"><Pill size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Ordonnance</span></div>
                        <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: v.ordonnance.statut === "Active" ? C.green : C.sub, background: v.ordonnance.statut === "Active" ? C.greenSoft : C.line, padding: "1px 7px", borderRadius: 999 }}>{v.ordonnance.statut}</span>
                      </div>
                      <ul className="space-y-1 mb-2">{v.ordonnance.medicaments.map((m, j) => <li key={j} style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>· {m}</li>)}</ul>
                      <div className="flex gap-2">
                        <button onClick={() => downloadText(`Ordonnance_${v.date.replace(/\//g, "-")}.txt`, `Ordonnance du ${v.date}\n${v.prescripteur || ""}\n\n${v.ordonnance.medicaments.join("\n")}`)} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}><FileDown size={12} /> Télécharger</button>
                        <button className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}><ScanLine size={12} /> QR pharmacie</button>
                      </div>
                    </div>
                  )}

                  {v.documents?.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="flex items-center gap-1.5 mb-1.5"><Paperclip size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Documents joints</span></div>
                      {v.documents.map((doc, j) => (
                        <div key={j} className="flex items-center gap-2 py-1">
                          <span style={{ fontFamily: sans, fontSize: 12, color: C.ink, flex: 1 }}>{doc.nom}</span>
                          <button onClick={() => downloadText(doc.nom.replace(/\.pdf$/, ".txt"), `${doc.type}\n${doc.nom}\nDate : ${v.date}\nAssuré : ${session.assure.nom}\n\n(Document simulé — export texte de la maquette)`)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: C.ivory }}><FileDown size={12} color={C.navy2} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =================================================================
   ASSISTANCE
================================================================= */
function TrackerReclamation({ r }) {
  const idxActuel = ETAPES_RECLAMATION.indexOf(r.etape);
  return (
    <div className="mt-3">
      <div className="flex items-center">
        {ETAPES_RECLAMATION.map((e, i) => (
          <React.Fragment key={e}>
            <div className="flex flex-col items-center" style={{ flex: "0 0 auto" }}>
              <div className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: i <= idxActuel ? C.green : "white", border: `2px solid ${i <= idxActuel ? C.green : C.line}` }}>
                {i <= idxActuel ? <Check size={16} color="white" /> : <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.sub }}>{i + 1}</span>}
              </div>
              <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: i <= idxActuel ? C.green : C.sub, textAlign: "center", marginTop: 4, maxWidth: 70 }}>{e.toUpperCase()}</span>
            </div>
            {i < ETAPES_RECLAMATION.length - 1 && <div className="flex-1" style={{ height: 2, background: i < idxActuel ? C.green : C.line, marginBottom: 16 }} />}
          </React.Fragment>
        ))}
      </div>
      {r.document && (
        <button onClick={() => telechargerDocument(r.document, `Justificatif de la réclamation ${r.id}`)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mt-3" style={{ background: C.ivory }}>
          <Paperclip size={11} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink, fontWeight: 600 }}>{r.document}</span><Download size={11} color={C.navy2} style={{ marginLeft: 2 }} />
        </button>
      )}
      {r.etape === "Décision rendue" && r.decision && (
        <div className="rounded-xl p-3 mt-3" style={{ background: "#EAF6EF" }}>
          <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.green, textTransform: "uppercase" }}>Décision finale rendue par les juristes</div>
          <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, fontStyle: "italic", marginTop: 3 }}>« {r.decision} »</div>
        </div>
      )}
    </div>
  );
}

function ReclamationsAssure({ session, notify }) {
  const [sousVue, setSousVue] = useState("suivi"); // suivi | soumettre
  const [reclamations, setReclamations] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ concerne: session.assure.nom, type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" });
  const monRef = session.police;
  const personnesFoyer = [session.assure.nom, ...session.beneficiaires.map((b) => b.nom)];

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanalPartage(CLE_RECLAMATIONS_PARTAGEES);
    setReclamations(toutes.filter((r) => r.initiateurType === "assure" && r.initiateurRef === monRef));
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const soumettre = async () => {
    if (!form.description.trim()) return;
    const toutes = await chargerCanalPartage(CLE_RECLAMATIONS_PARTAGEES);
    const numero = `REC-2026-${String(toutes.length + 1).padStart(3, "0")}`;
    const reclamation = {
      id: numero, initiateurType: "assure", initiateurNom: session.assure.nom, initiateurRef: monRef,
      beneficiaire: form.concerne, contexte: `Police ${session.police} · Contrat ${session.contrat}`,
      type: form.type, severite: form.severite, description: form.description, document: form.document || null,
      etape: "Reçue", decision: null, dateSoumission: "15/07/2026", derniereActivite: "15/07/2026",
      historique: [{ action: "Réclamation enregistrée sur mobile", auteur: session.assure.nom, date: "15/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
    };
    const maj = [reclamation, ...toutes];
    await sauvegarderCanalPartage(CLE_RECLAMATIONS_PARTAGEES, maj);
    setReclamations([reclamation, ...reclamations]);
    setForm({ concerne: session.assure.nom, type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" });
    setSousVue("suivi");
    notify(`Réclamation ${numero} envoyée — vous pouvez suivre son traitement`);
  };

  return (
    <div className="px-5">
      <div className="flex gap-2 mb-3">
        <button onClick={() => setSousVue("soumettre")} className="flex-1 rounded-xl py-2" style={{ background: sousVue === "soumettre" ? C.gold : C.ivory, color: sousVue === "soumettre" ? C.navy : C.ink, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Soumettre plainte</button>
        <button onClick={() => setSousVue("suivi")} className="flex-1 rounded-xl py-2" style={{ background: sousVue === "suivi" ? C.gold : C.ivory, color: sousVue === "suivi" ? C.navy : C.ink, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Jauges de suivi</button>
      </div>

      {sousVue === "soumettre" ? (
        <Card className="p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 34, height: 34, background: C.redSoft }}><AlertTriangle size={16} color={C.red} /></div>
            <div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Formulaire de contestation</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Saisie sécurisée d'un litige</div></div>
          </div>
          <Field label="Votre identité (bénéficiaire concerné)"><select style={inputStyle} value={form.concerne} onChange={(e) => setForm({ ...form, concerne: e.target.value })}>{personnesFoyer.map((n) => <option key={n}>{n}</option>)}</select></Field>
          <div className="mt-2.5"><Field label="Type de réclamation"><select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES_RECLAMATION.map((t) => <option key={t}>{t}</option>)}</select></Field></div>
          <div className="mt-2.5">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Niveau de sévérité</div>
            <div className="grid grid-cols-3 gap-2">
              {["Basse", "Moyenne", "Haute"].map((s) => (
                <button key={s} onClick={() => setForm({ ...form, severite: s })} className="rounded-lg py-2" style={{ background: form.severite === s ? couleurSeverite(s).fg : "white", color: form.severite === s ? "white" : C.ink, border: `1px solid ${form.severite === s ? couleurSeverite(s).fg : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mt-2.5"><Field label="Description des faits"><textarea style={{ ...inputStyle, minHeight: 90, resize: "none" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Expliquez en détail votre contestation ou le problème rencontré…" /></Field></div>
          <div className="mt-2.5">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Pièces justificatives (factures, ordonnances)</div>
            <label className="rounded-xl flex flex-col items-center justify-center gap-2 py-6 cursor-pointer" style={{ border: `2px dashed ${C.line}`, background: C.ivory }}>
              <Upload size={18} color={C.navy2} />
              <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}>{form.document ? form.document : "Glisser-déposer le fichier justificatif"}</span>
              <span style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>Ou cliquez pour choisir sur votre disque (PDF, JPG, PNG)</span>
              <input type="file" hidden onChange={(e) => setForm({ ...form, document: e.target.files?.[0]?.name || "" })} />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setForm({ type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" })} className="flex-1 rounded-xl py-3" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Réinitialiser</button>
            <button onClick={soumettre} disabled={!form.description.trim()} className="flex-1 rounded-xl py-3" style={{ background: !form.description.trim() ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}>Envoyer ma réclamation</button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>Suivi de vos contestations</SectionLabel>
            <button onClick={synchroniser} disabled={syncing} className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ border: `1px solid ${C.navy}` }}>{syncing ? <Loader2 size={10} className="animate-spin" color={C.navy} /> : <RefreshCw size={10} color={C.navy} />}<span style={{ fontFamily: sans, fontSize: 9.5, color: C.navy, fontWeight: 700 }}>Actualiser</span></button>
          </div>
          {reclamations.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune réclamation soumise pour l'instant.</span></Card>}
          <div className="space-y-3">
            {reclamations.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2"><span style={{ fontFamily: mono, fontSize: 10, color: C.navy2, background: C.ivory, padding: "2px 7px", borderRadius: 6 }}>{r.id}</span><span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{r.type}</span></div>
                  <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: couleurSeverite(r.severite).fg, background: couleurSeverite(r.severite).bg, padding: "2px 8px", borderRadius: 999 }}>SÉVÉRITÉ : {r.severite.toUpperCase()}</span>
                </div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontStyle: "italic" }}>« {r.description.length > 90 ? r.description.slice(0, 90) + "…" : r.description} »</div>
                <div style={{ fontFamily: sans, fontSize: 9.5, color: C.sub, marginTop: 2 }}>Soumise le {r.dateSoumission}</div>
                <TrackerReclamation r={r} />
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Assistance({ notify, session, go }) {
  const [vue, setVue] = useState("messagerie");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [nouveauSujet, setNouveauSujet] = useState("");
  const [nouveauTexte, setNouveauTexte] = useState("");
  const [composeOuvert, setComposeOuvert] = useState(false);
  const [texte, setTexte] = useState("");

  const monIdentifiant = session.police;

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    setConversations(toutes.filter((c) => (c.initiateurType === "assure" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "assure" && c.destinataireNom === monIdentifiant)));
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const demarrerConversation = async () => {
    if (!nouveauSujet.trim() || !nouveauTexte.trim()) return;
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    const conv = {
      id: `MSG-${Date.now()}`, sujet: nouveauSujet, statut: "Ouvert",
      initiateurType: "assure", initiateurNom: session.assure.nom, initiateurRef: monIdentifiant, initiateurTelephone: session.assure.telephone,
      contexte: `Police ${session.police} · Contrat ${session.contrat}`,
      messages: [{ id: 1, auteurType: "assure", auteurNom: session.assure.nom, texte: nouveauTexte, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
      derniereActivite: "07/07/2026",
    };
    const maj = [conv, ...toutes];
    await sauvegarderCanalPartage(CLE_MESSAGERIE_PARTAGEE, maj);
    setConversations(maj.filter((c) => (c.initiateurType === "assure" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "assure" && c.destinataireNom === monIdentifiant)));
    setNouveauSujet(""); setNouveauTexte(""); setComposeOuvert(false);
    notify("Message envoyé à l'assureur — transmis directement, sans email");
  };

  const envoyer = async (convId) => {
    if (!texte.trim()) return;
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    const msg = { id: Date.now(), auteurType: "assure", auteurNom: session.assure.nom, texte, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
    const maj = toutes.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, msg], derniereActivite: "07/07/2026" } : c));
    await sauvegarderCanalPartage(CLE_MESSAGERIE_PARTAGEE, maj);
    setConversations(maj.filter((c) => (c.initiateurType === "assure" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "assure" && c.destinataireNom === monIdentifiant)));
    setTexte("");
  };

  if (selected) {
    const c = conversations.find((x) => x.id === selected);
    if (!c) { setSelected(null); return null; }
    return (
      <div className="pb-6 flex flex-col" style={{ minHeight: 500 }}>
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>{c.sujet}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{c.contexte}</div></div>
        </div>
        <div className="px-5 flex gap-2 mb-2">
          <a href={whatsappChatUrl("+243812345678", `Bonjour, à propos de : ${c.sujet}`)} target="_blank" rel="noreferrer" className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><MessageSquare size={12} /> WhatsApp</a>
          <a href={whatsappCallUrl("+243812345678")} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Phone size={12} /> Appel WhatsApp</a>
        </div>
        <div className="px-5 space-y-2 flex-1">
          {c.messages.map((m) => (
            <div key={m.id} className="flex" style={{ justifyContent: m.auteurType === "assure" ? "flex-end" : "flex-start" }}>
              <div className="rounded-2xl px-3.5 py-2.5" style={{ maxWidth: "78%", background: m.auteurType === "assure" ? C.navy : "white", border: m.auteurType === "assure" ? "none" : `1px solid ${C.line}` }}>
                {m.auteurType !== "assure" && <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.gold, marginBottom: 2 }}>{m.auteurNom} (Assureur)</div>}
                <div style={{ fontFamily: sans, fontSize: 12.5, color: m.auteurType === "assure" ? "white" : C.ink }}>{m.texte}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: m.auteurType === "assure" ? "#B9C3D6" : C.sub, marginTop: 2, textAlign: "right" }}>{m.date} {m.heure}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pt-3 flex items-center gap-2">
          <input style={{ ...inputStyle, flex: 1 }} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Écrire un message…" />
          <button onClick={() => envoyer(c.id)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: C.navy }}><Send size={15} color="white" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 flex flex-col" style={{ minHeight: 500 }}>
      <div className="px-5 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => go("accueil")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Assistance</div><div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Messagerie directe avec l'assureur</div></div>
      </div>
      <div className="px-5 grid grid-cols-2 gap-3 mb-2">
        <a href="tel:+243812345678" onClick={() => notify("Appel vers le centre PEC")}><Card className="p-3.5"><Phone size={17} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>Centre PEC 24/7</div><div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>+243 81 234 5678</div></Card></a>
        <a href="https://wa.me/243812345678" onClick={() => notify("Ouverture de WhatsApp")}><Card className="p-3.5"><MessageSquare size={17} color={C.green} /><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>WhatsApp</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Réponse rapide</div></Card></a>
      </div>

      <div className="px-5 flex gap-2 mb-3">
        <button onClick={() => setVue("messagerie")} className="flex-1 rounded-xl py-2.5" style={{ background: vue === "messagerie" ? C.navy : "white", color: vue === "messagerie" ? "white" : C.ink, border: `1px solid ${vue === "messagerie" ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Messagerie</button>
        <button onClick={() => setVue("reclamations")} className="flex-1 rounded-xl py-2.5" style={{ background: vue === "reclamations" ? C.navy : "white", color: vue === "reclamations" ? "white" : C.ink, border: `1px solid ${vue === "reclamations" ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Réclamations</button>
      </div>

      {vue === "reclamations" ? (
        <ReclamationsAssure session={session} notify={notify} />
      ) : (
        <>
          <div className="px-5 flex items-center justify-between mb-2">
            <SectionLabel>Messagerie interne (avec l'assureur)</SectionLabel>
          </div>
          <div className="px-5 flex gap-2 mb-3">
            <button onClick={synchroniser} disabled={syncing} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Synchroniser</button>
            <button onClick={() => setComposeOuvert(!composeOuvert)} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><MessageCircle size={13} /> Nouveau message</button>
          </div>

          {composeOuvert && (
            <div className="px-5 mb-3">
              <Card className="p-3.5 space-y-2" style={{ background: C.ivory, border: "none" }}>
                <input style={inputStyle} value={nouveauSujet} onChange={(e) => setNouveauSujet(e.target.value)} placeholder="Objet (ex : Question sur un remboursement)" />
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "none" }} value={nouveauTexte} onChange={(e) => setNouveauTexte(e.target.value)} placeholder="Votre message…" />
                <button onClick={demarrerConversation} disabled={!nouveauSujet.trim() || !nouveauTexte.trim()} className="w-full rounded-lg py-2.5" style={{ background: (!nouveauSujet.trim() || !nouveauTexte.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}>Envoyer à l'assureur</button>
              </Card>
            </div>
          )}

          <div className="px-5 space-y-2">
            {conversations.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun message pour l'instant. Écrivez directement à l'assureur — plus besoin d'email.</span></Card>}
            {conversations.map((c) => (
              <Card key={c.id} onClick={() => setSelected(c.id)} className="p-3.5 flex items-center gap-3 cursor-pointer">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 38, height: 38, background: C.ivory }}><MessageCircle size={17} color={C.navy2} /></div>
                <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{c.sujet}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{c.messages[c.messages.length - 1]?.texte.slice(0, 40)}…</div></div>
                <StatusPill statut={c.statut} />
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =================================================================
   NOTIFICATIONS
================================================================= */
function NotificationCenter({ session, setSession, onBack }) {
  const notifs = session.notifications || [];
  const marquerLues = () => setSession({ ...session, notifications: notifs.map((n) => ({ ...n, lue: true })) });
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
          <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Notifications</div>
        </div>
        {notifs.some((n) => !n.lue) && <button onClick={marquerLues} style={{ fontFamily: sans, fontSize: 11, color: C.navy2, fontWeight: 700 }}>Tout marquer lu</button>}
      </div>
      <div className="px-5 space-y-2 mt-2">
        {notifs.length === 0 && <Card className="p-6 text-center"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucune notification.</span></Card>}
        {notifs.map((n) => {
          const Icon = NOTIF_ICON[n.type] || Bell;
          return (
            <Card key={n.id} className="p-3.5 flex items-start gap-3" style={{ background: n.lue ? "white" : C.goldSoft, border: n.lue ? `1px solid ${C.line}` : `1px solid ${C.gold}` }}>
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 34, height: 34, background: "white" }}><Icon size={15} color={C.navy2} /></div>
              <div className="flex-1">
                <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{n.titre}</div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{n.detail}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 3 }}>{n.date}</div>
              </div>
              {!n.lue && <div className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: C.gold, marginTop: 4 }} />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* =================================================================
   PROFIL & PARAMÈTRES
================================================================= */
function ProfilParams({ session, setSession, onBack, onLogout, notify }) {
  const toggleVerrou = () => setSession({ ...session, verrouillage: !session.verrouillage });
  const setLangue = (l) => { setSession({ ...session, langue: l }); notify(`Langue de l'application : ${l}`); };
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
        <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Profil & paramètres</div>
      </div>
      <div className="px-5 mt-2">
        <Card className="p-4 flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: C.navy }}><span style={{ fontFamily: serif, color: "white", fontSize: 17 }}>{session.assure.nom.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span></div>
          <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.ink }}>{session.assure.nom}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{session.assure.profession} · {session.police}</div></div>
        </Card>

        <SectionLabel>Sécurité</SectionLabel>
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><Lock size={16} color={C.navy2} /><div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink }}>Verrouillage de l'app</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Code PIN ou biométrie à l'ouverture</div></div></div>
          <button onClick={toggleVerrou} className="rounded-full" style={{ width: 44, height: 26, background: session.verrouillage ? C.green : C.line, position: "relative", transition: "background .2s" }}>
            <div style={{ position: "absolute", top: 3, left: session.verrouillage ? 21 : 3, width: 20, height: 20, borderRadius: 999, background: "white", transition: "left .2s" }} />
          </button>
        </Card>

        <SectionLabel>Langue de l'application</SectionLabel>
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {LANGUES.map((l) => (
              <button key={l} onClick={() => setLangue(l)} className="rounded-xl py-2" style={{ background: session.langue === l ? C.navy : C.ivory, color: session.langue === l ? "white" : C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{l}</button>
            ))}
          </div>
        </Card>

        <SectionLabel>Informations</SectionLabel>
        <Card className="overflow-hidden">
          {["Mentions légales & CGU", "Politique de confidentialité", "À propos (v2.4.0)"].map((t, i, arr) => (
            <button key={t} className="w-full flex items-center justify-between px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{t}</span><ChevronRight size={14} color={C.sub} />
            </button>
          ))}
        </Card>

        <button onClick={onLogout} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-4" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><LogOut size={15} /> Se déconnecter</button>
      </div>
    </div>
  );
}


export default function App() {
  const [view, setView] = useState("signup");
  const [signupData, setSignupData] = useState(null);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("accueil");
  const [sinistresSub, setSinistresSub] = useState("rdv");
  const [subScreen, setSubScreen] = useState(null);
  const [devisPrefill, setDevisPrefill] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState("compte"); // 'compte' | 'contrat'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = (m) => setToast(m);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("neogtec_active_session_assure");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          setSession(parsed);
          setView("app");
        }
      }
    } catch (e) {
      console.warn("Restore Assure session error", e);
    }
  }, []);

  React.useEffect(() => {
    if (session && view === "app") {
      try {
        localStorage.setItem("neogtec_active_session_assure", JSON.stringify(session));
      } catch (e) {
        console.warn("Save Assure session error", e);
      }
    }
  }, [session, view]);

  const startApp = (s) => {
    setSession(s);
    setView("app");
    setTab("accueil");
    setDevisPrefill(null);
    try {
      localStorage.setItem("neogtec_active_session_assure", JSON.stringify(s));
    } catch (e) { }
    notify("Bienvenue dans votre espace assuré");
  };
  const passerALaSouscription = (data) => { setDevisPrefill(data); setOnboardingMode("compte"); setView("onboarding"); };
  const logout = () => {
    try {
      localStorage.removeItem("neogtec_active_session_assure");
    } catch (e) { }
    setSession(null);
    setSubScreen(null);
    setTab("accueil");
    setView("signin");
  };
  const restartFromScratch = () => {
    try {
      localStorage.removeItem("neogtec_active_session_assure");
    } catch (e) { }
    setSession(null);
    setSubScreen(null);
    setTab("accueil");
    setSignupData(null);
    setView("signup");
  };

  const ajouterContrat = (nouveau) => {
    const ancienResume = { police: session.police, contrat: session.contrat, formule: session.formule, validite: session.validite, prime: session.prime, statut: "Actif", beneficiaires: session.beneficiaires, garanties: session.garanties, paiements: session.paiements, histo: session.histo, rdv: session.rdv };
    setSession({
      ...session,
      police: nouveau.police, contrat: nouveau.contrat, formule: nouveau.formule, validite: nouveau.validite, prime: nouveau.prime,
      beneficiaires: nouveau.beneficiaires, garanties: nouveau.garanties, paiements: nouveau.paiements, histo: [], rdv: [],
      autresContrats: [...(session.autresContrats || []), ancienResume],
    });
    setView("app"); setSubScreen(null); setTab("accueil"); notify("Nouveau contrat activé");
  };
  const activerContrat = (idx) => {
    const autres = [...(session.autresContrats || [])];
    const selected = autres[idx];
    const ancienResume = { police: session.police, contrat: session.contrat, formule: session.formule, validite: session.validite, prime: session.prime, statut: "Actif", beneficiaires: session.beneficiaires, garanties: session.garanties, paiements: session.paiements, histo: session.histo, rdv: session.rdv };
    autres[idx] = ancienResume;
    setSession({ ...session, police: selected.police, contrat: selected.contrat, formule: selected.formule, validite: selected.validite, prime: selected.prime, beneficiaires: selected.beneficiaires, garanties: selected.garanties, paiements: selected.paiements, histo: selected.histo || [], rdv: selected.rdv || [], autresContrats: autres });
    notify(`Contrat ${selected.police} activé`);
  };

  const go = (target, sub) => {
    if (["dossier", "devis", "notifications", "profil", "settings", "contrats", "affiliation"].includes(target)) { setSubScreen(target === "settings" ? "profil" : target); return; }
    if (target === "prestataires") { setSubScreen(null); setTab("sinistres"); setSinistresSub("prest"); return; }
    if (target === "remboursements") { setSubScreen(null); setTab("sinistres"); setSinistresSub("remb"); return; }
    setSubScreen(null);
    setTab(target);
    if (target === "sinistres" && sub) setSinistresSub(sub);
  };
  const unread = session?.notifications?.filter((n) => !n.lue).length || 0;
  const vuePrincipale = !session || session.vueCompteId === "00" || !session.vueCompteId;
  const vueBenef = session && !vuePrincipale ? session.beneficiaires.find((b) => b.id === session.vueCompteId) : null;

  const tabs = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "police", label: "Police", icon: FileText },
    { id: "carte", label: "Carte", icon: CreditCard },
    { id: "sinistres", label: "Soins", icon: Stethoscope },
    { id: "prestataires", label: "Prestataires", icon: Navigation },
    { id: "remboursements", label: "Remboursements", icon: ClipboardList },
    { id: "paiement", label: "Paiement", icon: Wallet },
    { id: "assistance", label: "Aide", icon: MessageCircle },
  ];

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row h-screen max-h-screen overflow-hidden" style={{ background: C.ivory, fontFamily: sans }}>
      <style>{`@keyframes riseIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} } ::-webkit-scrollbar { display:none; }`}</style>

      {/* Desktop Floating Collapsible Navigation Sidebar */}
      {view === "app" && (
        <aside className={`hidden md:flex flex-col border border-[#1B4A34] bg-[#0D2818] text-white shrink-0 justify-between z-20 shadow-xl rounded-2xl my-2 ml-2 transition-all duration-300 h-[calc(100vh-16px)] sticky top-2 ${sidebarCollapsed ? 'w-20 p-2.5' : 'w-64 p-4'}`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1 py-2 border-b border-[#1B4A34]">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-xs shrink-0">
                    ASS
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-serif text-sm font-bold tracking-wider text-white block truncate">NEOGTEC ASSURÉ</span>
                    {session?.nom && (
                      <p className="text-[11px] text-[#EFDFB8] font-medium truncate">{session.nom}</p>
                    )}
                  </div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="w-9 h-9 mx-auto rounded-xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-xs shrink-0">
                  ASS
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title={sidebarCollapsed ? "Afficher le menu" : "Masquer le menu"}
              >
                {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </button>
            </div>

            <nav className="space-y-1">
              {tabs.map((t) => {
                const isActive = tab === t.id && !subScreen;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => go(t.id)}
                    title={sidebarCollapsed ? t.label : undefined}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-2.5'} rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-[#1B4A34] text-[#EFDFB8] shadow-md font-bold border-l-4 border-[#C6992E]'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Icon size={18} className={isActive ? 'text-[#C6992E]' : 'text-stone-400'} />
                    {!sidebarCollapsed && <span>{t.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className={`p-3 bg-[#1B4A34]/40 border border-[#2F8A5B]/30 rounded-xl space-y-2 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Police Santé</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              </div>
            )}
            <button
              onClick={logout}
              title={sidebarCollapsed ? "Déconnexion" : undefined}
              className={`w-full py-2 text-xs text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold cursor-pointer border border-rose-800/20`}
            >
              <LogOut size={14} />
              {!sidebarCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main App Container */}
      <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-white shadow-sm border-x border-stone-200/80 h-full">


        {view === "app" && !subScreen && !vuePrincipale && (
          <div className="px-5 pt-3 pb-1">
            <div className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: C.goldSoft }}>
              <div className="flex items-center gap-1.5"><Link2 size={12} color={C.navy} /><span style={{ fontFamily: sans, fontSize: 11, color: C.navy, fontWeight: 700 }}>Ayant droit : {vueBenef?.nom} — rattaché à {session.beneficiaires[0].nom}</span></div>
              <button onClick={() => setSession({ ...session, vueCompteId: "00" })} style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, textDecoration: "underline" }}>Quitter</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 max-w-7xl w-full mx-auto">
          {view === "signup" && (
            <SignUp
              onDone={(data) => {
                setSignupData(data);
                const nameParts = (data.nom || "").trim().split(" ");
                const prenom = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                const nom = nameParts[0] || data.nom || "";
                const prefillData = {
                  startStep: 0,
                  identite: {
                    nom: nom,
                    prenom: prenom,
                    email: data.email || "",
                    telephone: data.telephone || "",
                  }
                };
                setDevisPrefill(prefillData);
                setOnboardingMode("compte");
                setView("onboarding");
                notify("Compte créé avec succès ! Poursuivez les 8 étapes de votre souscription.");
              }}
              onGoSignIn={() => setView("signin")}
            />
          )}
          {view === "signin" && <SignIn prefill={signupData} onDone={(sessionReelle) => (sessionReelle ? startApp(sessionReelle) : setView("welcome"))} onGoSignUp={() => setView("signup")} />}
          {view === "welcome" && <Welcome onSubscribe={() => { setOnboardingMode("compte"); setView("onboarding"); }} onDemo={() => startApp(DEMO_SESSION)} onDevis={() => setView("devis")} />}
          {view === "devis" && <Devis notify={notify} onBack={() => setView("welcome")} onSouscrire={passerALaSouscription} />}
          {view === "onboarding" && <Onboarding onFinish={onboardingMode === "contrat" ? ajouterContrat : startApp} onCancel={() => { if (onboardingMode === "contrat") { setView("app"); setSubScreen("contrats"); } else { setView("welcome"); } }} initial={devisPrefill} />}
          {view === "app" && subScreen === "dossier" && <DossierMedical session={session} onBack={() => setSubScreen(null)} />}
          {view === "app" && subScreen === "devis" && <Devis notify={notify} onBack={() => setSubScreen(null)} />}
          {view === "app" && subScreen === "notifications" && <NotificationCenter session={session} setSession={setSession} onBack={() => setSubScreen(null)} />}
          {view === "app" && subScreen === "profil" && <ProfilParams session={session} setSession={setSession} onBack={() => setSubScreen(null)} onLogout={logout} notify={notify} />}
          {view === "app" && subScreen === "contrats" && <MesContrats session={session} onBack={() => setSubScreen(null)} onSouscrireNouveau={() => { setOnboardingMode("contrat"); setView("onboarding"); }} onActiver={activerContrat} />}
          {view === "app" && subScreen === "affiliation" && <ConsoleAffiliation session={session} setSession={setSession} onBack={() => setSubScreen(null)} notify={notify} />}
          {view === "app" && !subScreen && tab === "accueil" && <Accueil go={go} notify={notify} session={session} setSession={setSession} onRestart={restartFromScratch} />}
          {view === "app" && !subScreen && tab === "police" && <Police notify={notify} session={session} setSession={setSession} go={go} />}
          {view === "app" && !subScreen && tab === "carte" && <CarteFlip session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && !subScreen && tab === "sinistres" && <Sinistres notify={notify} session={session} setSession={setSession} sub={sinistresSub} setSub={setSinistresSub} go={go} />}
          {view === "app" && !subScreen && tab === "paiement" && <Paiement session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && !subScreen && tab === "assistance" && <Assistance notify={notify} session={session} go={go} />}
        </div>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}

        {/* Mobile Bottom Navigation Bar */}
        {view === "app" && (
          <div className="md:hidden sticky bottom-0 left-0 right-0 flex items-center justify-around z-20 shadow-md" style={{ height: 64, background: "white", borderTop: `1px solid ${C.line}` }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => go(t.id)} className="flex items-center flex-col gap-1 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-all cursor-pointer">
                <t.icon size={20} color={tab === t.id && !subScreen ? C.navy : C.sub} strokeWidth={tab === t.id && !subScreen ? 2.4 : 2} />
                <span style={{ fontFamily: sans, fontSize: 11, fontWeight: tab === t.id && !subScreen ? 700 : 500, color: tab === t.id && !subScreen ? C.navy : C.sub }}>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
