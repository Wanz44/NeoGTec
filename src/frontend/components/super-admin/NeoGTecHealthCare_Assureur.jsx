import React, { useState } from "react";
import {
  LayoutDashboard, Building2, Stethoscope, Users, ShieldCheck, UserCog, Landmark,
  PieChart, KeyRound, Database, BarChart3, ListFilter, Eye, EyeOff, Copy, Network,
  Globe2, ShieldAlert, Menu, Search, Filter, Bell, Settings, LogOut, Lock, Loader2,
  ChevronRight, ChevronDown, Plus, Trash2, Check, X, AlertTriangle, CheckCircle2,
  FileText, Wallet, Receipt, Send, RefreshCw, ArrowLeft, Percent, Hash, Tag,
  MessageCircle, Video, CalendarClock, TrendingUp, Users2, MapPin, Phone, Mail,
  ClipboardList, Gauge, Boxes, FileWarning, UserPlus, Ban, UserCheck,
  SlidersHorizontal, Download, ScrollText, Activity, ShieldQuestion,
  FileSignature, Archive, Key, Webhook, TrendingDown, Star, Gift, Megaphone,
  HelpCircle, Server, UploadCloud, DownloadCloud, Timer, Handshake, Target,
  ArchiveRestore, FilePlus2, ClipboardCheck, Paperclip, KeySquare, HardDrive,
  UsersRound, PhoneCall, Award, History, GitCommit, Workflow, Sliders, CloudUpload, Camera,
  Siren, Radar, FileDown, FileCheck, CreditCard, Smartphone, ReceiptText, Clock3, Upload, AlertCircle, ScanFace, MessageSquare, ListChecks, PenLine, Gavel, XCircle, Shield, ArrowLeftRight, HeartPulse, UserRound, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/* ---------------------------------------------------------------
   TOKENS — identité NeoGTec HealthCare, densité desktop
------------------------------------------------------------------ */
const C = {
  navy: "#0D2818", navy2: "#1B4A34", gold: "#C6992E", goldSoft: "#EFDFB8",
  ivory: "#F6F3EC", ink: "#1A1B1E", sub: "#6B6F76", line: "#E7E2D6",
  green: "#2F8A5B", greenSoft: "#E7F3EC", amber: "#C0392B", amberSoft: "#FBEAE8",
  red: "#C0392B", redSoft: "#FBEAE8", panel: "#FFFFFF", bg: "#F1EFE8",
};
const serif = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif";
const mono = "ui-monospace,'SF Mono',Menlo,monospace";
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ") + " CDF";
const DELAI_GRACE_MOIS = 3;
const MOTIFS_RESILIATION = ["Non-paiement persistant", "Demande du souscripteur", "Fraude avérée", "Cessation d'activité de l'entreprise", "Fin de collaboration avec l'assureur", "Autre"];
const AUJOURDHUI = new Date(2026, 6, 7); // 07/07/2026
function parseDateFr(str) {
  const [j, m, a] = String(str).split("/").map(Number);
  return new Date(a, m - 1, j);
}
function moisDeRetard(dateEcheance) {
  const d = parseDateFr(dateEcheance);
  let mois = (AUJOURDHUI.getFullYear() - d.getFullYear()) * 12 + (AUJOURDHUI.getMonth() - d.getMonth());
  if (AUJOURDHUI.getDate() < d.getDate()) mois -= 1;
  return Math.max(0, mois);
}
function joursAvantEcheance(dateStr) {
  const d = parseDateFr(dateStr);
  return Math.round((d - AUJOURDHUI) / (1000 * 60 * 60 * 24));
}

/* ---------------------------------------------------------------
   SYNCHRONISATION RÉSEAU — mêmes canaux partagés que les 3 apps
------------------------------------------------------------------ */
const CLE_DEROGATIONS_PARTAGEES = "neogtec_eco_derogations_v1";
const CLE_TARIFS_PARTAGES = "neogtec_eco_tarifs_v1";
const CLE_ALERTES_TARIFS = "neogtec_eco_alertes_tarifs_v1";
const CLE_TELECONSULTATIONS_PARTAGEES = "neogtec_eco_teleconsultations_v1";
const CLE_COMPTES_PARTAGES = "neogtec_eco_comptes_v1";
const CLE_MESSAGERIE_PARTAGEE = "neogtec_eco_messagerie_v1";
const CLE_RECLAMATIONS_PARTAGEES = "neogtec_eco_reclamations_v1";
const TYPES_RECLAMATION = ["Remboursement refusé", "Accueil clinique", "Délai de traitement", "Facturation", "Demande de résiliation", "Autre"];
const ETAPES_RECLAMATION = ["Reçue", "En cours d'analyse", "Décision rendue"];
const couleurSeverite = (s) => (s === "Haute" ? { bg: "#FBE2E0", fg: "#C0392B" } : s === "Moyenne" ? { bg: "#FBEBD2", fg: "#C88A1E" } : { bg: "#E3F2E6", fg: "#2F8A5B" });
const MODELES_REPONSE_RECLAMATION = [
  "Nous accusons réception de votre réclamation et l'avons transmise à notre service juridique pour instruction.",
  "Après vérification, votre remboursement a été validé et sera crédité sous 48h.",
  "Une contre-expertise technique est en cours — nous revenons vers vous sous 5 jours ouvrés.",
  "Le prestataire concerné a été notifié et le tiers-payant a été rétabli pour votre dossier.",
];
const CLE_PEC_PARTAGEES = "neogtec_eco_pec_v1";
const CLE_COTISATIONS_PARTAGEES = "neogtec_eco_cotisations_v1";

async function chargerCanal(cle) {
  try {
    const res = await window.storage.get(cle, true);
    return res?.value ? JSON.parse(res.value) : (cle === CLE_TARIFS_PARTAGES ? {} : []);
  } catch (e) {
    return cle === CLE_TARIFS_PARTAGES ? {} : [];
  }
}
async function sauvegarderCanal(cle, valeur) {
  try {
    await window.storage.set(cle, JSON.stringify(valeur), true);
  } catch (e) { /* stockage indisponible — l'app continue de fonctionner localement */ }
}
function whatsappChatUrl(numero, texte) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${num}${texte ? `?text=${encodeURIComponent(texte)}` : ""}`;
}
function whatsappCallUrl(numero) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `whatsapp://call?phone=${num}`;
}

/* ---------------------------------------------------------------
   DONNÉES DE RÉFÉRENCE — référentiel maître géré par l'assureur
------------------------------------------------------------------ */
const GRADES_MAITRE = [
  { id: "direction", nom: "Direction / Cadre supérieur", taux: 100 },
  { id: "cadre", nom: "Cadre / Agent de maîtrise", taux: 90 },
  { id: "agent", nom: "Agent d'exécution", taux: 80 },
  { id: "ouvrier", nom: "Ouvrier / Personnel de terrain", taux: 70 },
  { id: "dependant", nom: "Ayants droit (Dépendant)", taux: 70 },
];

const CASCADE_MAITRE = [
  { ordre: 1, payeur: "CSU — Couverture Santé Universelle", role: "Gratuité intégrale, mais uniquement pour la maternité — seul volet effectif à ce jour en RDC", taux: "100% (maternité uniquement)" },
  { ordre: 2, payeur: "Assurance Privée NeoGTec HealthCare", role: "Premier payeur sur tous les autres soins, selon le grade de l'assuré", taux: "90 / 80 / 70%" },
  { ordre: 3, payeur: "Mutuelle complémentaire", role: "Couvre une partie du solde restant si l'assuré en dispose", taux: "Variable" },
  { ordre: 4, payeur: "Reste à charge — Assuré", role: "Solde final réglé directement par l'assuré", taux: "Variable" },
];

const CATALOGUE_MAITRE = [
  { code: "CONS-001", libelle: "Consultation médecine générale", garantie: "Consultations & Pharmacie", tarifReference: 15000 },
  { code: "CONS-002", libelle: "Consultation spécialiste", garantie: "Consultations & Pharmacie", tarifReference: 25000 },
  { code: "CONS-003", libelle: "Consultation d'urgence (nuit/week-end)", garantie: "Consultations & Pharmacie", tarifReference: 35000 },
  { code: "PHAR-001", libelle: "Délivrance de médicaments sur ordonnance", garantie: "Consultations & Pharmacie", tarifReference: 15000 },
  { code: "LABO-001", libelle: "Analyse de laboratoire courante", garantie: "Consultations & Pharmacie", tarifReference: 20000 },
  { code: "IMAG-001", libelle: "Imagerie (radio, échographie)", garantie: "Consultations & Pharmacie", tarifReference: 45000 },
  { code: "HOSP-001", libelle: "Journée d'hospitalisation (chambre commune)", garantie: "Hospitalisation", tarifReference: 150000 },
  { code: "HOSP-002", libelle: "Bloc opératoire & anesthésie", garantie: "Hospitalisation", tarifReference: 400000 },
  { code: "DENT-001", libelle: "Soins dentaires conservateurs", garantie: "Dentaire", tarifReference: 20000 },
  { code: "DENT-002", libelle: "Extraction dentaire", garantie: "Dentaire", tarifReference: 25000 },
  { code: "OPHT-001", libelle: "Consultation ophtalmologique + monture/verres", garantie: "Optique", tarifReference: 100000 },
  { code: "MATE-001", libelle: "Suivi prénatal (CPN)", garantie: "Maternité", tarifReference: 40000 },
  { code: "MATE-002", libelle: "Accouchement voie basse", garantie: "Maternité", tarifReference: 400000 },
  { code: "MATE-003", libelle: "Césarienne", garantie: "Maternité", tarifReference: 700000 },
];

function buildEntreprises() {
  return [
    { id: 1, nom: "MININGCO SARL", secteur: "Mines et industries extractives", contrat: "CTR-ENT-2026-778213", nbEmployes: 6, statut: "Actif", contact: "NGOYI Beatrice — Directrice RH", email: "rh@miningco.cd", dateActivation: "01/07/2025" },
  ];
}
const RESEAU_HOPITAUX_RDC = [
  { cat: 'Réseau des hôpitaux', items: [
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
  ]},
  { cat: 'Structures de BDOM', items: [
    { nom: 'CS  NTOMBWA YA  MARIA', commune: 'MASINA', avenue: 'LOLA  II,4', quartier: 'MASINA SANS FIL' },
    { nom: 'CH  LISUNGI', commune: 'MONT NGAFULA', avenue: 'ROUTE DU LAC DE MA VALLEE', quartier: 'MPUMBU' },
    { nom: 'CS  MATER DEI', commune: 'MONT NGAFULA', avenue: 'ROUTE DE MATADI', quartier: 'KIMBONDO' },
  ]},
  { cat: 'Structures hyperspécialisées', items: [
    { nom: 'CLINIQUE DENTAIRE LA CANINE', commune: 'GOMBE', avenue: 'AV DE LA JUSTICE 44', quartier: 'GOMBE' },
    { nom: 'CDM PHTALMOLOGIQUE ET DENTAIRE', commune: 'GOMBE', avenue: 'AV MONGALA 10 REF MIDEMA', quartier: 'GOMBE' },
    { nom: 'HJ HOSPITALS/EXAMENS SPECIALISES', commune: 'LIMETE', avenue: '1ERE RUE, INDISTRIEL', quartier: '1ERE RUE INDISTRIEL' },
  ]},
  { cat: 'Structures en cas de transfert', items: [
    { nom: 'HGR SAINT JOSEPH', commune: 'LIMETE', avenue: 'BlV LUMUMBA 15 EME RUE', quartier: 'MOTEL FIKIN' },
    { nom: 'CLINIQUE BONDEKO', commune: 'LIMETE', avenue: 'AV YOLO N°7259', quartier: 'LIMETE-RESIDENTIEL' },
    { nom: 'HGR/PEDIATRIE  KALEMBELEMBE', commune: 'LINGWALA', avenue: 'AV  KALEMBELEMBE', quartier: 'NGONDALOKOMBE' },
    { nom: 'CH  MONKOLE', commune: 'MT NGAFULA', avenue: 'AV MONKOLE', quartier: '' },
  ]},
];

function buildPrestataires() {
  const demo = { id: 1, nom: "Clinique Ngaliema", type: "Hôpital de référence", commune: "Gombe, Kinshasa", adresse: "Avenue de la Justice", quartier: "Gombe", categorieReseau: "Réseau des hôpitaux", numeroAgrement: "NGT-PREST-2026-004821", statut: "Actif", responsable: "Dr. Kalonji Mbuyi", dateActivation: "01/07/2025", csuEligible: true };
  const typeSelon = (nom) => {
    if (nom.includes("DENTAIRE") || nom.includes("CANINE")) return "Centre dentaire";
    if (nom.includes("EXAMENS SPECIALISES") || nom.includes("HJ HOSPITALS")) return "Laboratoire / Centre d'imagerie";
    return "Hôpital / Clinique";
  };
  // Sélection CSU réaliste : seuls les hôpitaux généraux de référence (HGR) et structures de transfert
  // publiques figurent typiquement sur la liste retenue par l'État — pas les cliniques/cabinets privés non sélectionnés.
  const estEligibleCSU = (nom, categorie) => nom.includes("HGR") || nom.includes("HOPITAL") || nom.includes("HÔPITAL") || categorie === "Structures en cas de transfert";
  let n = 1;
  const reseau = RESEAU_HOPITAUX_RDC.flatMap((groupe) => groupe.items
    .filter((h) => h.nom !== demo.nom)
    .map((h) => {
      n++;
      return {
        id: n, nom: h.nom, type: typeSelon(h.nom), commune: `${h.commune}, Kinshasa`, adresse: h.avenue, quartier: h.quartier, categorieReseau: groupe.cat,
        numeroAgrement: `NGT-PREST-2026-${String(200000 + n)}`, statut: "Actif", responsable: "Direction médicale de l'établissement", dateActivation: "01/07/2026",
        csuEligible: estEligibleCSU(h.nom, groupe.cat),
      };
    }));
  return [demo, ...reseau];
}
function buildAssuresIndividuels() {
  return [
    { id: 1, nom: "MUKENDI Jean-Paul", police: "SP-KIN-000482", contrat: "CTR-SP-2026-000482", formule: "Confort Famille", nbAyantsDroit: 4, statut: "Actif", dateActivation: "01/07/2025" },
  ];
}

const CRM_ETAPES = ["Nouveau", "Contacté", "Devis envoyé", "Négociation", "Gagné", "Perdu"];
function buildProspects() {
  return [
    { id: 7, nom: "MININGCO SARL", type: "Entreprise", contact: "NGOYI Beatrice — Directrice RH", telephone: "+243 81 111 0022", email: "rh@miningco.cd", ville: "Kinshasa", source: "Courtier", courtierNom: "Congo Assurance Courtage SARL", statut: "Gagné", formuleInteret: "Confort Famille", valeurEstimee: 25000000, commercial: "Ilunga Patrick", dateCreation: "02/06/2025", prochainSuivi: "—", commissionPayee: true, activites: [
      { id: 1, type: "Appel", texte: "Premier contact via courtier partenaire, recherche couverture santé pour le personnel minier", date: "02/06/2025", auteur: "Ilunga Patrick" },
      { id: 2, type: "Réunion", texte: "Présentation de l'offre Confort Famille sur site à Kolwezi", date: "12/06/2025", auteur: "Ilunga Patrick" },
      { id: 3, type: "Devis envoyé", texte: "Devis final accepté pour 6 employés + ayants droit", date: "25/06/2025", auteur: "Ilunga Patrick" },
      { id: 4, type: "Note", texte: "Contrat signé — compte créé dans Comptes réseau, activation au 01/07/2025", date: "30/06/2025", auteur: "Ilunga Patrick" },
    ], compteConverti: true },
    { id: 8, nom: "KASONGO Nadège", type: "Assuré simple", contact: "KASONGO Nadège", telephone: "+243 89 777 4411", email: "n.kasongo@gmail.com", ville: "Kinshasa", source: "Site web", statut: "Perdu", formuleInteret: "Essentiel", valeurEstimee: 700000, commercial: "Ngoyi Sarah", dateCreation: "18/09/2025", prochainSuivi: "—", motifPerte: "N'a plus donné suite après le devis", activites: [
      { id: 1, type: "Email", texte: "Demande d'information reçue via le site", date: "18/09/2025", auteur: "Système" },
      { id: 2, type: "Devis envoyé", texte: "Devis Essentiel individuel envoyé", date: "22/09/2025", auteur: "Ngoyi Sarah" },
      { id: 3, type: "Note", texte: "Relancée deux fois sans réponse — dossier clos", date: "10/11/2025", auteur: "Ngoyi Sarah" },
    ] },
    { id: 1, nom: "SOMIKI SARL", type: "Entreprise", contact: "Kabongo Alphonse — DRH", telephone: "+243 81 222 3344", email: "rh@somiki.cd", ville: "Lubumbashi", source: "Démarchage", statut: "Négociation", formuleInteret: "Confort Famille", valeurEstimee: 18000000, commercial: "Ilunga Patrick", dateCreation: "12/06/2026", prochainSuivi: "16/07/2026", activites: [
      { id: 1, type: "Appel", texte: "Premier contact, intéressés par une couverture pour 40 employés", date: "12/06/2026", auteur: "Ilunga Patrick" },
      { id: 2, type: "Réunion", texte: "Présentation de l'offre Confort Famille sur site", date: "25/06/2026", auteur: "Ilunga Patrick" },
      { id: 3, type: "Devis envoyé", texte: "Devis transmis pour 40 employés + ayants droit — 18 000 000 CDF/an", date: "02/07/2026", auteur: "Ilunga Patrick" },
    ] },
    { id: 2, nom: "KALALA Espérance", type: "Chef de famille", contact: "KALALA Espérance", telephone: "+243 89 555 1122", email: "e.kalala@gmail.com", ville: "Kinshasa", source: "Recommandation", statut: "Devis envoyé", formuleInteret: "Premium", valeurEstimee: 3800000, commercial: "Ngoyi Sarah", dateCreation: "28/06/2026", prochainSuivi: "17/07/2026", activites: [
      { id: 1, type: "Appel", texte: "Recommandée par un client existant, famille de 5 personnes", date: "28/06/2026", auteur: "Ngoyi Sarah" },
      { id: 2, type: "Devis envoyé", texte: "Devis Premium famille de 5 envoyé par WhatsApp", date: "05/07/2026", auteur: "Ngoyi Sarah" },
    ] },
    { id: 3, nom: "Cabinet BONDO & Associés", type: "Entreprise", contact: "Bondo Michel — Gérant", telephone: "+243 82 444 7788", email: "contact@bondo-associes.cd", ville: "Kinshasa", source: "Site web", statut: "Contacté", formuleInteret: "Essentiel", valeurEstimee: 4200000, commercial: "Ilunga Patrick", dateCreation: "05/07/2026", prochainSuivi: "18/07/2026", activites: [
      { id: 1, type: "Email", texte: "Demande d'information reçue via le site — cabinet de 8 personnes", date: "05/07/2026", auteur: "Système" },
      { id: 2, type: "Appel", texte: "Premier échange, envoi de la documentation en cours", date: "08/07/2026", auteur: "Ilunga Patrick" },
    ] },
    { id: 4, nom: "MBUYI Grâce", type: "Assuré simple", contact: "MBUYI Grâce", telephone: "+243 84 333 9900", email: "grace.mbuyi@yahoo.fr", ville: "Goma", source: "Salon", statut: "Nouveau", formuleInteret: "Lisanga 65$", valeurEstimee: 182000, commercial: "Ngoyi Sarah", dateCreation: "10/07/2026", prochainSuivi: "15/07/2026", activites: [
      { id: 1, type: "Note", texte: "Rencontrée au salon santé de Goma, intéressée par la mutuelle Lisanga", date: "10/07/2026", auteur: "Ngoyi Sarah" },
    ] },
    { id: 5, nom: "TransCongo Logistique", type: "Entreprise", contact: "Wamba Julie — RH", telephone: "+243 81 999 4455", email: "j.wamba@transcongo.cd", ville: "Kinshasa", source: "Courtier", courtierNom: "Congo Assurance Courtage SARL", statut: "Gagné", formuleInteret: "Confort Famille", valeurEstimee: 32000000, commercial: "Ilunga Patrick", dateCreation: "02/05/2026", prochainSuivi: "—", commissionPayee: false, activites: [
      { id: 1, type: "Appel", texte: "Introduit par un courtier partenaire", date: "02/05/2026", auteur: "Ilunga Patrick" },
      { id: 2, type: "Réunion", texte: "Négociation des grades et plafonds", date: "20/05/2026", auteur: "Ilunga Patrick" },
      { id: 3, type: "Devis envoyé", texte: "Devis final accepté pour 85 employés", date: "10/06/2026", auteur: "Ilunga Patrick" },
      { id: 4, type: "Note", texte: "Contrat signé — compte créé dans Comptes réseau", date: "01/07/2026", auteur: "Ilunga Patrick" },
    ], compteConverti: true },
    { id: 6, nom: "PHARMAKIN Sprl", type: "Entreprise", contact: "Tshisola Robert", telephone: "+243 85 111 2233", email: "r.tshisola@pharmakin.cd", ville: "Kinshasa", source: "Démarchage", statut: "Perdu", formuleInteret: "Essentiel", valeurEstimee: 6000000, commercial: "Ngoyi Sarah", dateCreation: "15/05/2026", prochainSuivi: "—", motifPerte: "A choisi un concurrent moins cher", activites: [
      { id: 1, type: "Appel", texte: "Premier contact, 12 employés", date: "15/05/2026", auteur: "Ngoyi Sarah" },
      { id: 2, type: "Devis envoyé", texte: "Devis Essentiel envoyé", date: "22/05/2026", auteur: "Ngoyi Sarah" },
      { id: 3, type: "Note", texte: "A choisi un concurrent proposant un tarif plus bas — dossier clos", date: "10/06/2026", auteur: "Ngoyi Sarah" },
    ] },
  ];
}

function buildCourtiers() {
  return [
    { id: 1, nom: "Congo Assurance Courtage SARL", contact: "Mbala Ferdinand — Directeur général", telephone: "+243 81 456 7890", email: "contact@cac-courtage.cd", ville: "Kinshasa", numeroAgrementARCA: "ARCA/COURT/2022-0134", tauxCommission: 10, statut: "Actif", datePartenariat: "15/03/2025", specialite: "Grandes entreprises & mines" },
    { id: 2, nom: "Assur'Plus RDC", contact: "Kanku Estelle — Gérante", telephone: "+243 82 334 5566", email: "info@assurplus-rdc.cd", ville: "Lubumbashi", numeroAgrementARCA: "ARCA/COURT/2023-0287", tauxCommission: 8, statut: "Actif", datePartenariat: "02/09/2025", specialite: "PME & assurés individuels" },
    { id: 3, nom: "Katanga Risk Brokers", contact: "Mwamba Joseph — Associé principal", telephone: "+243 84 112 2334", email: "j.mwamba@katangarisk.cd", ville: "Lubumbashi", numeroAgrementARCA: "ARCA/COURT/2021-0056", tauxCommission: 12, statut: "Inactif", datePartenariat: "10/01/2024", specialite: "Secteur minier & industriel" },
  ];
}
function buildCommissionsConfig() {
  return [
    { nom: "Ilunga Patrick", type: "Commercial interne", taux: 5 },
    { nom: "Ngoyi Sarah", type: "Commercial interne", taux: 5 },
  ];
}

function buildEquipeInterne() {
  return [
    { id: 1, nom: "Dr. Mbala Ngoy", role: "Médecin conseil", email: "mbala.ngoy@neogtec-healthcare.cd", statut: "Actif" },
    { id: 2, nom: "Kalombo Faustin", role: "Gestionnaire réseau", email: "kalombo.f@neogtec-healthcare.cd", statut: "Actif" },
    { id: 3, nom: "Odia Grace", role: "Responsable financier", email: "odia.grace@neogtec-healthcare.cd", statut: "Actif" },
  ];
}
const ROLES_ASSUREUR = [
  { id: "medecin_conseil", nom: "Médecin conseil", permissions: "Validation des dérogations, avis médicaux, messagerie prestataires" },
  { id: "gestionnaire_reseau", nom: "Gestionnaire réseau", permissions: "Comptes entreprises/prestataires, référentiel, catalogue" },
  { id: "responsable_financier", nom: "Responsable financier", permissions: "Règlements, cotisations, reporting financier" },
  { id: "administrateur", nom: "Administrateur système", permissions: "Accès complet, gestion des accès et rôles" },
];

const CONSO_RESEAU = [
  { mois: "Juil'25", montant: 3800000 }, { mois: "Août'25", montant: 4500000 }, { mois: "Sept'25", montant: 5100000 },
  { mois: "Oct'25", montant: 5800000 }, { mois: "Nov'25", montant: 6400000 }, { mois: "Déc'25", montant: 7900000 },
  { mois: "Jan'26", montant: 6900000 }, { mois: "Fév", montant: 8200000 }, { mois: "Mar", montant: 9600000 }, { mois: "Avr", montant: 11400000 },
  { mois: "Mai", montant: 10100000 }, { mois: "Juin", montant: 12800000 }, { mois: "Juil", montant: 3200000 },
];

/* ---------------------------------------------------------------
   PRIMITIVES — desktop
------------------------------------------------------------------ */
function Toast({ message, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg" style={{ bottom: 24, right: 24, background: C.navy, color: "white", fontFamily: sans, fontSize: 13, animation: "riseIn .25s ease" }}>
      <CheckCircle2 size={16} color={C.gold} /><span>{message}</span>
    </div>
  );
}
function StatusPill({ statut }) {
  const map = {
    "Actif": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Réglé": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Payée": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Approuvée": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Résolu": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Suspendu": { bg: C.redSoft, fg: C.red, icon: Ban },
    "Résilié": { bg: C.redSoft, fg: C.red, icon: Ban },
    "Refusée": { bg: C.redSoft, fg: C.red, icon: X },
    "En attente": { bg: C.amberSoft, fg: C.amber, icon: Loader2 },
    "Ouvert": { bg: C.amberSoft, fg: C.amber, icon: Loader2 },
    "En retard": { bg: C.redSoft, fg: C.red, icon: AlertTriangle },
  };
  const s = map[statut] || map["En attente"], Icon = s.icon;
  return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: s.bg, color: s.fg, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><Icon size={11} /> {statut}</span>;
}
function Card({ children, style, className = "", onClick }) { return <div onClick={onClick} className={`rounded-2xl bg-white ${className}`} style={{ border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,38,68,0.04)", ...style }}>{children}</div>; }
function Field({ label, children }) { return <div><div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>{children}</div>; }
const inputStyle = { width: "100%", fontFamily: sans, fontSize: 13.5, color: C.ink, background: C.ivory, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", outline: "none", boxSizing: "border-box" };
function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function telechargerDocument(nomFichier, contexte) {
  downloadText(nomFichier, `Document : ${nomFichier}\n${contexte}\n\nCe fichier a été transmis via NeoGTec HealthCare.`);
}
function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 38, height: 38, background: (color || C.navy) + "18" }}><Icon size={18} color={color || C.navy} /></div>
      </div>
      <div style={{ fontFamily: serif, fontSize: 26, color: C.navy, fontWeight: 700 }}>{value}</div>
      <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontFamily: sans, fontSize: 10.5, color: color || C.green, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </Card>
  );
}
function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>{children}</h2>
      {action}
    </div>
  );
}
function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white" style={{ border: `1px solid ${C.line}` }}>
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: C.ivory }}>
            {columns.map((c, i) => <th key={i} style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: 0.4, textAlign: c.align || "left", padding: "10px 14px", borderBottom: `1px solid ${C.line}` }}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Td({ children, align, style }) { return <td style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, padding: "12px 14px", textAlign: align || "left", ...style }}>{children}</td>; }

/* =================================================================
   CONNEXION — accès interne (staff assureur)
================================================================= */
function Connexion({ onDone }) {
  const [form, setForm] = useState({ email: "", motDePasse: "", role: "administrateur" });
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  const valider = () => {
    if (!form.email || !form.motDePasse) { setErreur("Veuillez saisir vos identifiants."); return; }
    setErreur(""); setLoading(true);
    setTimeout(() => { setLoading(false); onDone(form.role); }, 900);
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)`, fontFamily: sans }}>
      <div className="w-full flex items-center justify-center px-6" style={{ maxWidth: 1100 }}>
        <div className="hidden md:flex flex-col justify-center flex-1 pr-16" style={{ color: "white" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><Network size={26} color={C.gold} /></div>
            <div><div style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, letterSpacing: 1.5 }}>NEOGTEC HEALTHCARE</div><div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>Back-office Assureur</div></div>
          </div>
          <div style={{ fontFamily: serif, fontSize: 34, lineHeight: 1.25, maxWidth: 480 }}>Le centre névralgique de l'écosystème NeoGTec HealthCare.</div>
          <div style={{ fontFamily: sans, fontSize: 13.5, color: "#B9C3D6", marginTop: 16, maxWidth: 460, lineHeight: 1.6 }}>Référentiel maître, comptes réseau, dérogations, règlements et pilotage financier — interconnecté en temps réel avec les espaces Assuré, Entreprise et Prestataire.</div>
          <div className="flex items-center gap-6 mt-10">
            <div><div style={{ fontFamily: serif, fontSize: 22, color: C.gold }}>3</div><div style={{ fontFamily: sans, fontSize: 10.5, color: "#B9C3D6" }}>Espaces connectés</div></div>
            <div><div style={{ fontFamily: serif, fontSize: 22, color: C.gold }}>24/7</div><div style={{ fontFamily: sans, fontSize: 10.5, color: "#B9C3D6" }}>Supervision réseau</div></div>
          </div>
        </div>
        <Card className="p-9" style={{ width: 400, flexShrink: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, fontWeight: 700, marginBottom: 4 }}>Connexion</div>
          <div style={{ fontFamily: sans, fontSize: 12.5, color: C.sub, marginBottom: 24 }}>Accès réservé au personnel NeoGTec HealthCare</div>
          <div className="space-y-3">
            <Field label="Email professionnel"><input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="prenom.nom@neogtec-healthcare.cd" /></Field>
            <Field label="Mot de passe">
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: 38 }} type={voir ? "text" : "password"} value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} placeholder="••••••••" />
                <button type="button" onClick={() => setVoir(!voir)} style={{ position: "absolute", right: 10, top: 9 }}>{voir ? <EyeOff size={16} color={C.sub} /> : <Eye size={16} color={C.sub} />}</button>
              </div>
            </Field>
            <Field label="Rôle"><select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES_ASSUREUR.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}</select></Field>
            {erreur && <div className="flex items-center gap-1.5" style={{ color: C.red }}><AlertTriangle size={12} /><span style={{ fontFamily: sans, fontSize: 11 }}>{erreur}</span></div>}
          </div>
          <button onClick={valider} disabled={loading} className="w-full rounded-xl py-3 mt-6 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />} {loading ? "Connexion…" : "Se connecter"}
          </button>
          <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 16, textAlign: "center" }}>Accès de démonstration — toute combinaison valide fonctionne.</div>
        </Card>
      </div>
    </div>
  );
}

/* =================================================================
   TABLEAU DE BORD — vue globale du réseau
================================================================= */
function TableauDeBord({ session, setSession, setPage, roleUtilisateur, notify }) {
  const [syncGlobal, setSyncGlobal] = useState(false);

  const synchroniserTout = async () => {
    setSyncGlobal(true);
    const [derogations, teleconsultations, tarifs, pec, cotisations, comptes, alertesTarifs] = await Promise.all([
      chargerCanal(CLE_DEROGATIONS_PARTAGEES),
      chargerCanal(CLE_TELECONSULTATIONS_PARTAGEES),
      chargerCanal(CLE_TARIFS_PARTAGES),
      chargerCanal(CLE_PEC_PARTAGEES),
      chargerCanal(CLE_COTISATIONS_PARTAGEES),
      chargerCanal(CLE_COMPTES_PARTAGES),
      chargerCanal(CLE_ALERTES_TARIFS),
    ]);
    setSession((s) => ({
      ...s,
      derogationsReseau: derogations.length ? derogations : s.derogationsReseau,
      teleconsultationsReseau: teleconsultations.length ? teleconsultations : s.teleconsultationsReseau,
      tarifsReseau: Object.keys(tarifs || {}).length ? { ...s.tarifsReseau, ...tarifs } : s.tarifsReseau,
      pecReseau: pec.length ? pec : s.pecReseau,
      cotisationsReseau: cotisations.length ? cotisations : s.cotisationsReseau,
      alertesTarifs: alertesTarifs.length ? alertesTarifs : s.alertesTarifs,
      surprimesEnAttente: comptes.filter((c) => c.donnees?.surprimeEnAttenteRevue),
      entreprises: s.entreprises.map((e) => {
        const compte = comptes.find((c) => c.type === "entreprise" && c.nom === e.nom);
        const nbReel = compte?.donnees?.effectifs?.length;
        return nbReel != null && nbReel !== e.nbEmployes ? { ...e, nbEmployes: nbReel } : e;
      }),
    }));
    setSyncGlobal(false);
  };
  React.useEffect(() => { synchroniserTout(); }, []);

  const totalEntreprises = session.entreprises.length;
  const totalPrestataires = session.prestataires.length;
  const totalAssures = session.assuresIndividuels.length + session.entreprises.reduce((s, e) => s + e.nbEmployes, 0);
  const derogEnAttente = session.derogationsReseau.filter((d) => d.statut === "En attente").length;
  const teleconsultationsEnAttente = session.teleconsultationsReseau.filter((t) => t.statut === "En attente").length;
  const tarifsMisAJour = Object.keys(session.tarifsReseau || {}).length;
  const cotEnRetardHorsGrace = session.cotisationsReseau.filter((c) => c.statut === "En retard" && c.dateEcheance && moisDeRetard(c.dateEcheance) > DELAI_GRACE_MOIS);
  const contratsARenouveler = (session.contrats || []).filter((c) => c.statut === "Actif" && c.dateExpiration && joursAvantEcheance(c.dateExpiration) >= 0 && joursAvantEcheance(c.dateExpiration) <= 60);
  const tarifsModifiesNonLus = (session.alertesTarifs || []).filter((a) => !a.lu && a.auteur !== "Assureur");
  const suivisEnRetard = (session.prospects || []).filter((p) => p.statut !== "Gagné" && p.statut !== "Perdu" && p.prochainSuivi && p.prochainSuivi !== "—" && p.prochainSuivi < "2026-07-15");
  const surprimesEnAttente = session.surprimesEnAttente || [];
  const [alerteSelectionnee, setAlerteSelectionnee] = useState(null);
  const [revueSurprimesOuverte, setRevueSurprimesOuverte] = useState(false);

  const alertes = [
    ...(cotEnRetardHorsGrace.length > 0 ? [{ id: "cot", icon: ShieldAlert, titre: `${cotEnRetardHorsGrace.length} entreprise(s) suspendue(s) pour impayé`, detail: `Le délai de grâce de ${DELAI_GRACE_MOIS} mois est dépassé pour : ${cotEnRetardHorsGrace.map((c) => `${c.entreprise} (${c.mois})`).join(", ")}. Le compte a été automatiquement suspendu.`, gravite: "critique", couleur: C.red, roleRequis: ["responsable_financier", "administrateur"], page: "finance", actionLabel: "Aller aux cotisations" }] : []),
    ...(contratsARenouveler.length > 0 ? [{ id: "renouv", icon: CalendarClock, titre: `${contratsARenouveler.length} contrat(s) arrivent à échéance sous 60 jours`, detail: `Concerne : ${contratsARenouveler.map((c) => `${c.client} (${c.dateExpiration})`).join(", ")}. Vérifiez le renouvellement tacite ou préparez une nouvelle négociation.`, gravite: "warning", couleur: C.amber, roleRequis: ["gestionnaire_reseau", "administrateur"], page: "contrats", actionLabel: "Voir les contrats" }] : []),
    ...(derogEnAttente > 0 ? [{ id: "derog", icon: FileWarning, titre: `${derogEnAttente} dérogation(s) en attente d'arbitrage`, detail: "Des prestataires ont soumis des demandes de dérogation nécessitant un avis médical avant validation.", gravite: "warning", couleur: C.amber, roleRequis: ["medecin_conseil", "administrateur"], page: "derogations", actionLabel: "Traiter les dérogations" }] : []),
    ...(teleconsultationsEnAttente > 0 ? [{ id: "telec", icon: Video, titre: `${teleconsultationsEnAttente} demande(s) de téléconsultation en attente`, detail: "Des assurés ont programmé une téléconsultation qui attend encore une confirmation prestataire.", gravite: "info", couleur: C.navy2, roleRequis: ["gestionnaire_reseau", "administrateur"], page: "teleconsultations", actionLabel: "Voir les téléconsultations" }] : []),
    ...(tarifsModifiesNonLus.length > 0 ? [{ id: "tarifsmodif", icon: Tag, titre: `${tarifsModifiesNonLus.length} tarif(s) négocié(s) modifié(s) par le réseau`, detail: tarifsModifiesNonLus.map((a) => `${a.etablissement} — ${a.libelle} (${a.code}) : ${fmt(a.ancienTarif)} → ${fmt(a.nouveauTarif)} le ${a.date} à ${a.heure}`).join(" · "), gravite: "warning", couleur: C.amber, roleRequis: ["gestionnaire_reseau", "administrateur"], page: "referentiel", actionLabel: "Vérifier dans le référentiel" }] : []),
    ...(suivisEnRetard.length > 0 ? [{ id: "suivicrm", icon: Target, titre: `${suivisEnRetard.length} suivi(s) commercial(aux) en retard`, detail: `Concerne : ${suivisEnRetard.map((p) => `${p.nom} (prévu le ${p.prochainSuivi}, commercial : ${p.commercial})`).join(", ")}.`, gravite: "warning", couleur: C.amber, roleRequis: ["gestionnaire_reseau", "administrateur"], page: "crm", actionLabel: "Voir le pipeline" }] : []),
    ...(surprimesEnAttente.length > 0 ? [{ id: "surprimes", icon: HeartPulse, titre: `${surprimesEnAttente.length} déclaration(s) de santé en attente de revue`, detail: `Des ayants droit ajoutés depuis l'app mobile ont déclaré des conditions médicales : ${surprimesEnAttente.map((c) => c.nom).join(", ")}. Vérifiez et appliquez la surprime au contrat si nécessaire.`, gravite: "warning", couleur: C.amber, roleRequis: ["gestionnaire_reseau", "administrateur"], actionSpeciale: () => setRevueSurprimesOuverte(true), actionLabel: "Revoir les déclarations" }] : []),
    ...(tarifsMisAJour > 0 ? [{ id: "tarifs", icon: Tag, titre: `${tarifsMisAJour} établissement(s) ont transmis leurs tarifs négociés`, detail: "De nouveaux tarifs négociés ont été reçus du réseau de prestataires et doivent être vérifiés dans le référentiel.", gravite: "info", couleur: C.green, roleRequis: ["gestionnaire_reseau", "administrateur"], page: "referentiel", actionLabel: "Voir le référentiel" }] : []),
  ];
  const alerte = alertes.find((a) => a.id === alerteSelectionnee);
  const autorise = alerte && alerte.roleRequis.includes(roleUtilisateur);

  const marquerAlertesTarifsLues = async () => {
    const majLocal = (session.alertesTarifs || []).map((a) => (a.auteur !== "Assureur" ? { ...a, lu: true } : a));
    setSession((s) => ({ ...s, alertesTarifs: majLocal }));
    await sauvegarderCanal(CLE_ALERTES_TARIFS, majLocal);
  };

  const traiterSurprime = async (compteDeclarant, appliquer) => {
    const surp = calculerSurprime(compteDeclarant.donnees.conditionsSante, compteDeclarant.donnees.dateNaissance);
    if (appliquer) {
      const contratLie = session.contrats.find((ct) => ct.numero === compteDeclarant.donnees.contrat);
      if (!contratLie) { notify("Contrat non retrouvé — synchronisez la page Contrats puis réessayez"); return; }
      const primeParBenef = FORMULES_SANTE.find((f) => f.nom === contratLie.formule)?.primeParBenef || 0;
      const supplement = Math.round(primeParBenef * (surp.surprimeTotal / 100));
      setSession((s) => ({
        ...s,
        contrats: s.contrats.map((ct) => (ct.numero === contratLie.numero ? { ...ct, primeMensuelle: (ct.primeMensuelle || 0) + Math.round(supplement / 12), versions: [...ct.versions, { version: ct.versions.length + 1, date: "15/07/2026", auteur: "Gestionnaire réseau", note: `Surprime santé appliquée pour ${compteDeclarant.nom} (+${surp.surprimeTotal}%, +${fmt(supplement)}/an) suite à déclaration transmise depuis l'app mobile` }] } : ct)),
      }));
    }
    const comptes = await chargerCanal(CLE_COMPTES_PARTAGES);
    const comptesMaj = comptes.map((c) => (c.donnees?.police === compteDeclarant.donnees.police ? { ...c, donnees: { ...c.donnees, surprimeEnAttenteRevue: false } } : c));
    await sauvegarderCanal(CLE_COMPTES_PARTAGES, comptesMaj);
    setSession((s) => ({ ...s, surprimesEnAttente: (s.surprimesEnAttente || []).filter((c) => c.donnees.police !== compteDeclarant.donnees.police) }));
    notify(appliquer ? `Surprime de +${surp.surprimeTotal}% appliquée au contrat de ${compteDeclarant.nom}` : `Déclaration de ${compteDeclarant.nom} classée sans surprime`);
  };

  return (
    <div>
      <SectionTitle action={
        <button onClick={synchroniserTout} disabled={syncGlobal} className="rounded-xl px-4 py-2 flex items-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12 }}>
          {syncGlobal ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncGlobal ? "Synchronisation du réseau…" : "Synchroniser tout le réseau"}
        </button>
      }>Vue d'ensemble du réseau</SectionTitle>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Building2} label="Entreprises souscriptrices" value={totalEntreprises} color={C.navy} />
        <KpiCard icon={Stethoscope} label="Prestataires conventionnés" value={totalPrestataires} color={C.navy2} />
        <KpiCard icon={ShieldCheck} label="Assurés couverts" value={totalAssures} color={C.green} />
        <KpiCard icon={FileWarning} label="Dérogations en attente" value={derogEnAttente} color={derogEnAttente > 0 ? C.amber : C.green} sub={derogEnAttente > 0 ? "Nécessite un arbitrage" : "Réseau à jour"} />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card className="p-5 col-span-2">
          <SectionTitle>Consommation réseau (13 derniers mois)</SectionTitle>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSO_RESEAU} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs><linearGradient id="reseauGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.5} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontFamily: sans, fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }} />
                <Area type="monotone" dataKey="montant" stroke={C.gold} strokeWidth={2.5} fill="url(#reseauGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle>Alertes réseau</SectionTitle>
          {alerte ? (
            <div>
              <button onClick={() => setAlerteSelectionnee(null)} className="flex items-center gap-1.5 mb-3" style={{ fontFamily: sans, fontSize: 11, color: C.sub, fontWeight: 700 }}><ArrowLeft size={12} /> Retour</button>
              <div className="flex items-start gap-2 p-3 rounded-xl mb-3" style={{ background: alerte.couleur + "18" }}>
                <alerte.icon size={15} color={alerte.couleur} style={{ flexShrink: 0, marginTop: 1 }} />
                <div><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{alerte.titre}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 3 }}>{alerte.detail}</div></div>
              </div>
              {autorise ? (
                <button onClick={() => (alerte.actionSpeciale ? alerte.actionSpeciale() : setPage(alerte.page))} className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12 }}>{alerte.actionLabel} <ChevronRight size={13} /></button>
              ) : (
                <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: C.redSoft }}>
                  <Lock size={13} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: sans, fontSize: 10.5, color: C.red }}>Votre rôle ({ROLES_ASSUREUR.find((r) => r.id === roleUtilisateur)?.nom}) n'autorise pas le traitement de cette alerte. Rôles autorisés : {alerte.roleRequis.map((r) => ROLES_ASSUREUR.find((x) => x.id === r)?.nom).join(", ")}.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {alertes.map((a) => (
                <button key={a.id} onClick={() => { setAlerteSelectionnee(a.id); if (a.id === "tarifsmodif") marquerAlertesTarifsLues(); }} className="w-full text-left">
                  <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: a.couleur + "18" }}>
                    <a.icon size={14} color={a.couleur} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, flex: 1 }}>{a.titre}</span>
                    <ChevronRight size={13} color={a.couleur} />
                  </div>
                </button>
              ))}
              {alertes.length === 0 && <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune alerte active — réseau à jour.</div>}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card className="p-5">
          <SectionTitle>Taux de recouvrement des primes</SectionTitle>
          {(() => {
            const total = session.cotisationsReseau.reduce((s, c) => s + c.montant, 0);
            const payees = session.cotisationsReseau.filter((c) => c.statut === "Payée").reduce((s, c) => s + c.montant, 0);
            const taux = total ? Math.round((payees / total) * 100) : 100;
            return (
              <div className="flex flex-col items-center">
                <div style={{ fontFamily: serif, fontSize: 34, color: taux >= 70 ? C.green : C.red, fontWeight: 700 }}>{taux}%</div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{fmt(payees)} recouvrés sur {fmt(total)}</div>
                <div className="rounded-full overflow-hidden w-full mt-3" style={{ height: 8, background: C.line }}><div style={{ width: `${taux}%`, height: "100%", background: taux >= 70 ? C.green : C.red }} /></div>
              </div>
            );
          })()}
        </Card>
        <Card className="p-5">
          <SectionTitle>Sinistralité (montants)</SectionTitle>
          {(() => {
            const approuves = session.sinistres.filter((s) => s.statut === "Approuvé").reduce((s, x) => s + x.montant, 0);
            const rejetes = session.sinistres.filter((s) => s.statut === "Rejeté").reduce((s, x) => s + x.montant, 0);
            const enAttente = session.sinistres.filter((s) => s.statut === "En attente" || s.statut === "En cours de validation").reduce((s, x) => s + x.montant, 0);
            const total = approuves + rejetes + enAttente || 1;
            return (
              <div className="space-y-2.5">
                {[["Approuvés", approuves, C.green], ["En attente", enAttente, C.amber], ["Rejetés", rejetes, C.red]].map(([label, val, color]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{label}</span><span style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 700, color }}>{fmt(val)}</span></div>
                    <div className="rounded-full overflow-hidden" style={{ height: 6, background: C.line }}><div style={{ width: `${(val / total) * 100}%`, height: "100%", background: color }} /></div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Card>
        <Card className="p-5">
          <SectionTitle>Score anti-fraude réseau</SectionTitle>
          {(() => {
            const critiques = session.sinistres.filter((s) => (s.scoreFraude || 0) >= 50).length;
            return (
              <div className="flex flex-col items-center">
                <Siren size={28} color={critiques > 0 ? C.red : C.green} />
                <div style={{ fontFamily: serif, fontSize: 24, color: critiques > 0 ? C.red : C.green, fontWeight: 700, marginTop: 6 }}>{critiques}</div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textAlign: "center" }}>alerte(s) critique(s) — voir Contrôle & communication</div>
              </div>
            );
          })()}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle>Réseau de prestataires</SectionTitle>
          <div className="space-y-2">
            {session.prestataires.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{p.nom}</span>
                <StatusPill statut={p.statut} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle>Entreprises souscriptrices</SectionTitle>
          <div className="space-y-2">
            {session.entreprises.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.nom}</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: C.sub }}>{e.nbEmployes} employés</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {revueSurprimesOuverte && (
        <div className="fixed inset-0 flex items-center justify-center p-6" style={{ background: "rgba(13,40,24,0.55)", zIndex: 50 }}>
          <Card className="p-5" style={{ maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Déclarations de santé en attente de revue</div>
              <button onClick={() => setRevueSurprimesOuverte(false)}><X size={18} color={C.sub} /></button>
            </div>
            {surprimesEnAttente.length === 0 && <span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucune déclaration en attente.</span>}
            <div className="space-y-3">
              {surprimesEnAttente.map((c) => {
                const surp = calculerSurprime(c.donnees.conditionsSante, c.donnees.dateNaissance);
                const contratLie = session.contrats.find((ct) => ct.numero === c.donnees.contrat);
                return (
                  <Card key={c.donnees.police} className="p-3.5" style={{ background: C.ivory, border: "none" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{c.nom}</span>
                      <span style={{ fontFamily: mono, fontSize: 10, color: C.sub }}>{c.donnees.police}</span>
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginBottom: 4 }}>Rattaché(e) au contrat {c.donnees.contrat} — {c.donnees.lienAvecSouscripteur || "Ayant droit"}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(c.donnees.conditionsSante || []).map((id) => (
                        <span key={id} style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.red, background: "#FBEAE8", padding: "2px 8px", borderRadius: 999 }}>{CONDITIONS_SANTE.find((cs) => cs.id === id)?.label || id}</span>
                      ))}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 11.5, color: C.amber, fontWeight: 700, marginBottom: 8 }}>Surprime calculée : +{surp.surprimeTotal}%{!contratLie ? " — contrat non retrouvé localement, synchronisez la page Contrats" : ""}</div>
                    <div className="flex gap-2">
                      <button onClick={() => traiterSurprime(c, false)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, color: C.ink }}>Ignorer (pas de surprime)</button>
                      <button onClick={() => traiterSurprime(c, true)} disabled={!contratLie} className="rounded-lg px-3 py-1.5" style={{ background: !contratLie ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Appliquer au contrat</button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* =================================================================
   COMPTES — création et gestion des accès Entreprise / Prestataire / Assuré
================================================================= */
function FormulaireCompte({ type, onCreer, onAnnuler, prefill }) {
  const [form, setForm] = useState({
    nom: prefill?.nom || "", secteur: "", rccm: "", adresse: "", ville: prefill?.ville || "Kinshasa", telephone: prefill?.telephone || "", email: prefill?.email || "", contact: prefill?.contact || "",
    nbEmployesEstime: "", formule: prefill?.formule || "Essentiel", dateDebut: "",
    typeEtablissement: "Hôpital / Clinique", numeroAgrement: "", responsable: prefill?.contact || "", specialites: "", latitude: "", longitude: "", csuEligible: false,
    dateNaissance: "", sexe: "Masculin", nbAyantsDroit: "",
  });
  const [importAuto, setImportAuto] = useState(false);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [nouvUtilisateur, setNouvUtilisateur] = useState({ nom: "", role: "Administrateur du compte", email: "" });
  const [addUtilisateurOuvert, setAddUtilisateurOuvert] = useState(false);
  const [tentative, setTentative] = useState(false);

  const importerDepuisAppMobile = () => {
    setImportAuto(true);
    setForm({ ...form, nom: "MUKENDI Jean-Paul", dateNaissance: "14/03/1985", sexe: "Masculin", adresse: "Avenue Kasa-Vubu, Bandalungwa", ville: "Kinshasa", telephone: "+243 81 000 00 00", email: "jp.mukendi@mail.cd", formule: "Confort", nbAyantsDroit: "4" });
  };

  const ajouterUtilisateur = () => {
    if (!nouvUtilisateur.nom || !nouvUtilisateur.email) return;
    setUtilisateurs([...utilisateurs, { ...nouvUtilisateur, id: Date.now() }]);
    setNouvUtilisateur({ nom: "", role: "Administrateur du compte", email: "" });
    setAddUtilisateurOuvert(false);
  };

  const rolesDisponibles = { entreprise: ["Administrateur du compte", "Gestionnaire RH", "Comptable"], prestataire: ["Administrateur du compte", "Médecin", "Comptable", "Réceptionniste"], assure: ["Souscripteur principal", "Ayant droit avec accès"] }[type];

  const champsObligatoires = type === "entreprise"
    ? [form.nom, form.secteur, form.telephone, form.email, form.contact, form.formule]
    : type === "prestataire"
    ? [form.nom, form.typeEtablissement, form.ville, form.numeroAgrement, form.responsable, form.telephone, form.email, form.latitude, form.longitude]
    : [form.nom, form.telephone, form.email, form.formule];
  const formValide = champsObligatoires.every((c) => c && String(c).trim());

  const valider = () => {
    setTentative(true);
    if (!formValide) return;
    onCreer({ ...form, utilisateurs });
  };

  const err = (v) => tentative && !v ? { border: `1px solid ${C.red}` } : {};

  return (
    <Card className="p-5 mb-4">
      <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Nouveau compte — {{ entreprise: "Entreprise", prestataire: "Prestataire", assure: "Assuré individuel" }[type]}</div>
      <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginBottom: 16 }}>Les champs marqués * sont obligatoires.</div>

      {prefill && (
        <Card className="p-3 flex items-start gap-2 mb-4" style={{ background: "#EAF6EF", border: "none" }}>
          <CheckCircle2 size={13} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 11, color: C.green }}>Champs pré-remplis depuis le prospect converti dans le CRM — vérifiez et complétez les informations manquantes.</span>
        </Card>
      )}

      {type === "assure" && (
        <Card className="p-3.5 flex items-center justify-between mb-4" style={{ background: C.ivory, border: "none" }}>
          <div className="flex items-center gap-2"><Network size={14} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Les 4 espaces sont liés — vous pouvez importer directement les informations depuis un compte déjà créé dans l'app mobile Assuré.</span></div>
          <button onClick={importerDepuisAppMobile} className="flex-shrink-0 rounded-lg px-3 py-2 flex items-center gap-1.5" style={{ background: importAuto ? C.greenSoft : C.navy, color: importAuto ? C.green : "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{importAuto ? <><Check size={12} /> Importé</> : "Importer depuis l'app mobile"}</button>
        </Card>
      )}

      {type === "entreprise" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Raison sociale *"><input style={{ ...inputStyle, ...err(form.nom) }} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom de la structure" /></Field>
          <Field label="Secteur d'activité *"><input style={{ ...inputStyle, ...err(form.secteur) }} value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} placeholder="Mines, banque, industrie…" /></Field>
          <Field label="RCCM"><input style={inputStyle} value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} placeholder="CD/KIN/RCCM/…" /></Field>
          <Field label="Adresse du siège"><input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></Field>
          <Field label="Ville"><select style={inputStyle} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
          <Field label="Contact principal *"><input style={{ ...inputStyle, ...err(form.contact) }} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Nom du responsable RH" /></Field>
          <Field label="Téléphone *"><input style={{ ...inputStyle, ...err(form.telephone) }} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
          <Field label="Email *"><input style={{ ...inputStyle, ...err(form.email) }} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rh@entreprise.cd" /></Field>
          <Field label="Nombre d'employés estimé"><input style={inputStyle} value={form.nbEmployesEstime} onChange={(e) => setForm({ ...form, nbEmployesEstime: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 50" /></Field>
          <Field label="Formule proposée *"><select style={{ ...inputStyle, ...err(form.formule) }} value={form.formule} onChange={(e) => setForm({ ...form, formule: e.target.value })}><option>Essentiel</option><option>Confort</option><option>Premium</option></select></Field>
          <Field label="Date de début du contrat"><input type="date" style={inputStyle} value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} /></Field>
        </div>
      )}

      {type === "prestataire" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom de l'établissement *"><input style={{ ...inputStyle, ...err(form.nom) }} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Clinique, pharmacie…" /></Field>
          <Field label="Type d'établissement *"><select style={{ ...inputStyle, ...err(form.typeEtablissement) }} value={form.typeEtablissement} onChange={(e) => setForm({ ...form, typeEtablissement: e.target.value })}><option>Hôpital / Clinique</option><option>Pharmacie</option><option>Cabinet médical</option><option>Laboratoire / Centre d'imagerie</option><option>Centre dentaire</option></select></Field>
          <Field label="Ville / Commune *"><input style={{ ...inputStyle, ...err(form.ville) }} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} placeholder="Gombe, Kinshasa" /></Field>
          <Field label="Adresse"><input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></Field>
          <Field label="N° d'agrément *"><input style={{ ...inputStyle, ...err(form.numeroAgrement) }} value={form.numeroAgrement} onChange={(e) => setForm({ ...form, numeroAgrement: e.target.value })} placeholder="NGT-PREST-2026-…" /></Field>
          <Field label="Responsable *"><input style={{ ...inputStyle, ...err(form.responsable) }} value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })} placeholder="Médecin directeur / gérant" /></Field>
          <Field label="Téléphone *"><input style={{ ...inputStyle, ...err(form.telephone) }} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
          <Field label="Email *"><input style={{ ...inputStyle, ...err(form.email) }} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@etablissement.cd" /></Field>
          <Field label="Spécialités / catégories de soins"><input style={inputStyle} value={form.specialites} onChange={(e) => setForm({ ...form, specialites: e.target.value })} placeholder="Chirurgie, maternité, dentaire…" /></Field>
          <Field label="Latitude (géolocalisation) *"><input style={{ ...inputStyle, ...err(form.latitude) }} value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value.replace(/[^0-9.\-]/g, "") })} placeholder="Ex : -4.3224" /></Field>
          <Field label="Longitude (géolocalisation) *"><input style={{ ...inputStyle, ...err(form.longitude) }} value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value.replace(/[^0-9.\-]/g, "") })} placeholder="Ex : 15.3075" /></Field>
          <div className="col-span-2 flex items-start gap-2 p-3 rounded-xl" style={{ background: C.ivory }}>
            <MapPin size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Ces coordonnées permettent à l'app mobile Assuré de localiser automatiquement cet établissement et de le classer du plus proche au plus éloigné pour chaque utilisateur.</span>
          </div>
          <label className="col-span-2 flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: form.csuEligible ? "#EAF6EF" : C.ivory }}>
            <div>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Établissement sélectionné par l'État pour la gratuité maternité (CSU)</div>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 2 }}>À cocher uniquement si cet établissement figure sur la liste officielle retenue par l'autorité de régulation sanitaire (14 provinces couvertes à ce jour). Détermine si la maternité y est gratuite à 100% ou suit le circuit normal.</div>
            </div>
            <input type="checkbox" checked={!!form.csuEligible} onChange={(e) => setForm({ ...form, csuEligible: e.target.checked })} style={{ flexShrink: 0, marginLeft: 10 }} />
          </label>
        </div>
      )}

      {type === "assure" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom complet *"><input style={{ ...inputStyle, ...err(form.nom) }} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom et prénom" disabled={importAuto} /></Field>
          <Field label="Date de naissance"><input type="date" style={inputStyle} value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} disabled={importAuto} /></Field>
          <Field label="Sexe"><select style={inputStyle} value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })} disabled={importAuto}><option>Masculin</option><option>Féminin</option></select></Field>
          <Field label="Ville"><select style={inputStyle} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} disabled={importAuto}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
          <Field label="Adresse"><input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} disabled={importAuto} /></Field>
          <Field label="Nombre d'ayants droit"><input style={inputStyle} value={form.nbAyantsDroit} onChange={(e) => setForm({ ...form, nbAyantsDroit: e.target.value.replace(/\D/g, "") })} disabled={importAuto} /></Field>
          <Field label="Téléphone *"><input style={{ ...inputStyle, ...err(form.telephone) }} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" disabled={importAuto} /></Field>
          <Field label="Email *"><input style={{ ...inputStyle, ...err(form.email) }} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={importAuto} /></Field>
          <Field label="Formule *"><select style={{ ...inputStyle, ...err(form.formule) }} value={form.formule} onChange={(e) => setForm({ ...form, formule: e.target.value })}><option>Essentiel</option><option>Confort</option><option>Confort Famille</option><option>Premium</option><option>Lisanga 65$</option></select></Field>
        </div>
      )}

      <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
        <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Utilisateurs & accès</div>
        <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginBottom: 10 }}>Un compte peut avoir plusieurs utilisateurs, chacun avec ses propres accès.</div>
        {utilisateurs.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {utilisateurs.map((u, i) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: C.ivory }}>
                <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{u.nom} <span style={{ color: C.sub }}>— {u.role}</span></span>
                <div className="flex items-center gap-2"><span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{u.email}</span><button onClick={() => setUtilisateurs(utilisateurs.filter((x) => x.id !== u.id))}><Trash2 size={12} color={C.red} /></button></div>
              </div>
            ))}
          </div>
        )}
        {!addUtilisateurOuvert ? (
          <button onClick={() => setAddUtilisateurOuvert(true)} className="rounded-lg px-3 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}><Plus size={13} /> Ajouter un utilisateur</button>
        ) : (
          <Card className="p-3 space-y-2" style={{ background: C.ivory, border: "none" }}>
            <div className="grid grid-cols-3 gap-2">
              <input style={inputStyle} placeholder="Nom complet" value={nouvUtilisateur.nom} onChange={(e) => setNouvUtilisateur({ ...nouvUtilisateur, nom: e.target.value })} />
              <select style={inputStyle} value={nouvUtilisateur.role} onChange={(e) => setNouvUtilisateur({ ...nouvUtilisateur, role: e.target.value })}>{rolesDisponibles.map((r) => <option key={r}>{r}</option>)}</select>
              <input style={inputStyle} type="email" placeholder="Email" value={nouvUtilisateur.email} onChange={(e) => setNouvUtilisateur({ ...nouvUtilisateur, email: e.target.value })} />
            </div>
            <div className="flex gap-2"><button onClick={() => setAddUtilisateurOuvert(false)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11 }}>Annuler</button><button onClick={ajouterUtilisateur} className="rounded-lg px-3 py-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Ajouter</button></div>
          </Card>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <button onClick={onAnnuler} className="rounded-xl px-4 py-2.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5, color: C.ink }}>Annuler</button>
        <button onClick={valider} className="rounded-xl px-5 py-2.5 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Créer le compte & générer les accès</button>
      </div>
    </Card>
  );
}

function IdentifiantsGeneres({ compte, onFermer }) {
  return (
    <Card className="p-5 mb-4" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
      <div className="flex items-center gap-2 mb-3"><KeyRound size={18} color={C.gold} /><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: "white" }}>Compte créé — accès générés</span></div>
      <div className="space-y-2 mb-3">
        {compte.acces.map((a, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6", textTransform: "uppercase" }}>Utilisateur</div><div style={{ fontFamily: sans, fontSize: 12, color: "white", fontWeight: 700 }}>{a.nom}</div><div style={{ fontFamily: sans, fontSize: 10, color: "#B9C3D6" }}>{a.role}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6", textTransform: "uppercase" }}>Identifiant</div><div style={{ fontFamily: mono, fontSize: 11.5, color: "white" }}>{a.email}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6", textTransform: "uppercase" }}>Mot de passe provisoire</div><div style={{ fontFamily: mono, fontSize: 12, color: C.gold, fontWeight: 700 }}>{a.motDePasseProvisoire}</div></div>
          </div>
        ))}
      </div>
      {compte.accesMobile && compte.accesMobile.length > 0 && (
        <div className="rounded-lg p-3 mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-2"><Smartphone size={13} color={C.gold} /><span style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: "white" }}>{compte.accesMobile.length} accès individuels générés pour l'app mobile ({compte.type === "entreprise" ? "employés + ayants droit" : "personnel"})</span></div>
          <div style={{ fontFamily: sans, fontSize: 10.5, color: "#B9C3D6" }}>Chaque individu peut se connecter dès maintenant avec les informations pré-remplies conformes à son contrat — le récapitulatif complet a été téléchargé automatiquement (fichier des accès).</div>
        </div>
      )}
      <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", marginBottom: 12 }}>Ces identifiants permettent la première connexion sur l'app {{ entreprise: "Entreprise", prestataire: "Prestataire", assure: "Assuré" }[compte.type]}. Le compte et tous ses utilisateurs sont immédiatement actifs dans la base réseau.</div>
      <button onClick={onFermer} className="rounded-lg px-4 py-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12 }}>Fermer</button>
    </Card>
  );
}

/* =================================================================
   DIAGNOSTIC RÉSEAU — tests automatisés de cohérence entre canaux partagés
   Remplace l'audit manuel répété par des règles exécutables à la demande.
================================================================= */
const REGLES_COHERENCE = [
  {
    id: "police-unique", label: "Chaque police individuelle est unique", gravite: "critique",
    description: "Deux personnes ne doivent jamais partager le même numéro de police — sinon leurs plafonds, franchises et consommations se mélangent.",
    run: (d) => {
      const vues = new Map();
      const problemes = [];
      d.comptes.forEach((c) => {
        const pol = c.donnees?.police;
        if (!pol) return;
        if (vues.has(pol) && vues.get(pol) !== c.nom) problemes.push({ ref: pol, detail: `Police ${pol} partagée entre « ${vues.get(pol)} » et « ${c.nom} »` });
        else vues.set(pol, c.nom);
      });
      return problemes;
    },
  },
  {
    id: "plafond-connu", label: "Chaque garantie suivie a un plafond connu", gravite: "avertissement",
    description: "Une consommation sans plafond associé rend impossible tout calcul de solde disponible ou de dépassement.",
    run: (d) => d.comptes.flatMap((c) => (c.donnees?.garantiesConsommation || [])
      .filter((g) => g.plafond == null)
      .map((g) => ({ ref: c.donnees?.police || c.nom, detail: `« ${c.nom} » — garantie « ${g.nom} » sans plafond connu` }))),
  },
  {
    id: "pec-police-existe", label: "Chaque PEC référence une police individuelle existante", gravite: "critique",
    description: "Une PEC orpheline (police introuvable) ne peut être imputée à aucun plafond ni suivie correctement.",
    run: (d) => d.pec.filter((p) => p.patientPolice && p.patientPolice !== "—" && !d.comptes.some((c) => c.donnees?.police === p.patientPolice))
      .map((p) => ({ ref: p.uid, detail: `PEC de « ${p.patientNom} » référence la police ${p.patientPolice}, introuvable` })),
  },
  {
    id: "pec-regle-bordereau", label: "Toute PEC réglée a un numéro de bordereau", gravite: "avertissement",
    description: "Un règlement sans bordereau ne peut pas être justifié en cas de contestation.",
    run: (d) => d.pec.filter((p) => p.statutReglement === "Réglé" && !p.numeroBordereau)
      .map((p) => ({ ref: p.uid, detail: `PEC de « ${p.patientNom} » réglée sans numéro de bordereau` })),
  },
  {
    id: "derogation-orpheline", label: "Dérogation approuvée sans soin finalisé", gravite: "avertissement",
    description: "Une dérogation approuvée mais jamais finalisée signifie que le patient attend toujours son soin malgré l'accord donné.",
    run: (d) => d.derogations.filter((x) => x.statut === "Approuvée" && x.donneesSoin && !x.soinFinalise)
      .map((x) => ({ ref: x.uid, detail: `Dérogation de « ${x.patientNom} » approuvée le ${x.dateEnvoi || "—"}, soin jamais finalisé` })),
  },
  {
    id: "consomme-depasse-plafond", label: "Aucune consommation ne dépasse son plafond sans dérogation", gravite: "critique",
    description: "Un dépassement non couvert par une dérogation approuvée signale une faille de contrôle au point de soin.",
    run: (d) => d.comptes.flatMap((c) => (c.donnees?.garantiesConsommation || [])
      .filter((g) => g.plafond != null && g.consomme > g.plafond)
      .map((g) => ({ ref: c.donnees?.police || c.nom, detail: `« ${c.nom} » — « ${g.nom} » : consommé ${fmt(g.consomme)} pour un plafond de ${fmt(g.plafond)}` }))),
  },
  {
    id: "surprime-en-attente", label: "Aucune déclaration de santé oubliée en revue", gravite: "avertissement",
    description: "Une déclaration jamais traitée signifie une prime potentiellement sous-évaluée par rapport au risque réel.",
    run: (d) => d.comptes.filter((c) => c.donnees?.surprimeEnAttenteRevue)
      .map((c) => ({ ref: c.donnees?.police || c.nom, detail: `Déclaration de « ${c.nom} » toujours en attente de revue` })),
  },
  {
    id: "compte-contrat-introuvable", label: "Chaque compte assuré référence un contrat existant", gravite: "info",
    description: "Un contrat introuvable localement empêche l'application de la franchise, de la carence ou de la cascade correcte.",
    run: (d, session) => d.comptes.filter((c) => c.type === "assure" && c.donnees?.contrat && !session.contrats.some((ct) => ct.numero === c.donnees.contrat))
      .map((c) => ({ ref: c.donnees?.police || c.nom, detail: `« ${c.nom} » rattaché(e) au contrat ${c.donnees.contrat}, introuvable dans la liste locale` })),
  },
  {
    id: "tarif-alerte-non-lue", label: "Aucune alerte tarifaire ignorée", gravite: "info",
    description: "Un tarif modifié jamais consulté peut fausser les prochains calculs de ventilation si l'écart n'est pas volontaire.",
    run: (d) => d.alertesTarifs.filter((a) => !a.lu && a.auteur !== "Assureur")
      .map((a) => ({ ref: `${a.etablissement} / ${a.code}`, detail: `« ${a.etablissement} » — ${a.libelle} modifié le ${a.date}, jamais consulté` })),
  },
  {
    id: "compte-sans-dateactivation", label: "Chaque compte assuré a une date d'activation connue", gravite: "avertissement",
    description: "Sans date d'activation, le délai de carence ne peut jamais être vérifié à l'ouverture d'un soin.",
    run: (d) => d.comptes.filter((c) => c.type === "assure" && !c.donnees?.dateActivation)
      .map((c) => ({ ref: c.donnees?.police || c.nom, detail: `« ${c.nom} » — aucune date d'activation enregistrée` })),
  },
];

function DiagnosticCoherence({ session, notify }) {
  const [resultats, setResultats] = useState(null);
  const [testing, setTesting] = useState(false);
  const [derniereExecution, setDerniereExecution] = useState(null);
  const [regleOuverte, setRegleOuverte] = useState(null);

  const executerTests = async () => {
    setTesting(true);
    const [comptes, pec, derogations, alertesTarifs] = await Promise.all([
      chargerCanal(CLE_COMPTES_PARTAGES),
      chargerCanal(CLE_PEC_PARTAGEES),
      chargerCanal(CLE_DEROGATIONS_PARTAGEES),
      chargerCanal(CLE_ALERTES_TARIFS),
    ]);
    const d = { comptes, pec, derogations, alertesTarifs };
    const resultatsRegles = REGLES_COHERENCE.map((regle) => {
      const problemes = regle.run(d, session);
      return { ...regle, problemes, ok: problemes.length === 0 };
    });
    setResultats(resultatsRegles);
    setDerniereExecution(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    setTesting(false);
    const nbEchecs = resultatsRegles.filter((r) => !r.ok).length;
    notify(nbEchecs === 0 ? "Diagnostic terminé — aucune incohérence détectée" : `Diagnostic terminé — ${nbEchecs} règle(s) en écart`);
  };
  React.useEffect(() => { executerTests(); }, []);

  const nbOk = resultats?.filter((r) => r.ok).length || 0;
  const nbCritiques = resultats?.filter((r) => !r.ok && r.gravite === "critique").length || 0;
  const nbAvertissements = resultats?.filter((r) => !r.ok && r.gravite === "avertissement").length || 0;
  const nbInfo = resultats?.filter((r) => !r.ok && r.gravite === "info").length || 0;
  const couleurGravite = { critique: C.red, avertissement: C.amber, info: C.navy2 };

  return (
    <div>
      <SectionTitle action={
        <button onClick={executerTests} disabled={testing} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
          {testing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} {testing ? "Test en cours…" : "Relancer tous les tests"}
        </button>
      }>Diagnostic réseau — cohérence entre canaux partagés</SectionTitle>

      <Card className="p-4 flex items-start gap-2 mb-5" style={{ background: C.ivory, border: "none" }}>
        <ShieldCheck size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Vérifie automatiquement, à la demande, que les données restent cohérentes entre tous les canaux partagés du réseau (comptes, PEC, dérogations, tarifs) — pour détecter une faille avant qu'elle ne cause un vrai dysfonctionnement, plutôt que de la découvrir au hasard d'un audit manuel.{derniereExecution && ` Dernière exécution : ${derniereExecution}.`}</span>
      </Card>

      {resultats && (
        <div className="grid grid-cols-4 gap-4 mb-5">
          <KpiCard icon={CheckCircle2} label="Règles conformes" value={`${nbOk}/${resultats.length}`} color={C.green} />
          <KpiCard icon={XCircle} label="Écarts critiques" value={nbCritiques} color={nbCritiques > 0 ? C.red : C.green} />
          <KpiCard icon={AlertTriangle} label="Avertissements" value={nbAvertissements} color={nbAvertissements > 0 ? C.amber : C.green} />
          <KpiCard icon={FileWarning} label="Informations" value={nbInfo} color={C.navy2} />
        </div>
      )}

      {!resultats && testing && (
        <Card className="p-8 flex flex-col items-center gap-3"><Loader2 size={26} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Exécution des règles de cohérence sur les canaux partagés…</span></Card>
      )}

      <div className="space-y-2.5">
        {resultats?.map((r) => (
          <Card key={r.id} className="p-0 overflow-hidden">
            <button onClick={() => setRegleOuverte(regleOuverte === r.id ? null : r.id)} className="w-full text-left p-4 flex items-center gap-3">
              {r.ok ? <CheckCircle2 size={18} color={C.green} style={{ flexShrink: 0 }} /> : <XCircle size={18} color={couleurGravite[r.gravite]} style={{ flexShrink: 0 }} />}
              <div className="flex-1">
                <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{r.label}</div>
                <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 1 }}>{r.description}</div>
              </div>
              {!r.ok && <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: "white", background: couleurGravite[r.gravite], padding: "3px 9px", borderRadius: 999, flexShrink: 0 }}>{r.problemes.length} écart{r.problemes.length > 1 ? "s" : ""}</span>}
              {!r.ok && <ChevronDown size={14} color={C.sub} style={{ transform: regleOuverte === r.id ? "rotate(180deg)" : "none", flexShrink: 0 }} />}
            </button>
            {regleOuverte === r.id && !r.ok && (
              <div className="px-4 pb-4 space-y-1.5" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
                {r.problemes.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ fontFamily: mono, fontSize: 9.5, color: C.sub, flexShrink: 0, marginTop: 1 }}>{p.ref}</span>
                    <span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>{p.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Reassurance({ session, setSession, notify }) {
  const [editConfig, setEditConfig] = useState(false);
  const [draftConfig, setDraftConfig] = useState(session.reassuranceConfig);
  const config = session.reassuranceConfig || { seuilCession: 300000, tauxCession: 60, reassureur: "—" };
  const cessions = session.cessionsReassurance || {};

  const grosRisques = session.sinistres.filter((s) => s.montant >= config.seuilCession && s.statut === "Approuvé");
  const totalExpose = grosRisques.reduce((s, x) => s + x.montant, 0);
  const totalCede = Math.round(totalExpose * config.tauxCession / 100);
  const totalConserve = totalExpose - totalCede;
  const totalRembourse = grosRisques.filter((s) => cessions[s.numero]?.statut === "Remboursée").reduce((s, x) => s + Math.round(x.montant * config.tauxCession / 100), 0);

  const enregistrerConfig = () => {
    setSession({ ...session, reassuranceConfig: draftConfig });
    setEditConfig(false);
    notify("Traité de réassurance mis à jour");
  };

  const declarer = (numero) => {
    setSession({ ...session, cessionsReassurance: { ...cessions, [numero]: { statut: "Déclarée", dateDeclaration: "15/07/2026" } } });
    notify(`Sinistre ${numero} déclaré au réassureur`);
  };
  const marquerRembourse = (numero) => {
    setSession({ ...session, cessionsReassurance: { ...cessions, [numero]: { ...cessions[numero], statut: "Remboursée", dateRemboursement: "15/07/2026" } } });
    notify(`Remboursement du réassureur enregistré pour ${numero}`);
  };

  return (
    <div>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <Shield size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Les sinistres dépassant le seuil de cession sont partagés avec le réassureur selon le taux convenu, afin de limiter l'exposition de l'assureur sur les gros risques (hospitalisations lourdes, maladies graves).</span>
      </Card>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon={ShieldAlert} label="Gros risques identifiés" value={grosRisques.length} color={C.navy2} />
        <KpiCard icon={ArrowLeftRight} label="Exposition cédée" value={fmt(totalCede)} color={C.gold} />
        <KpiCard icon={ShieldCheck} label="Conservé par l'assureur" value={fmt(totalConserve)} color={C.navy} />
        <KpiCard icon={CheckCircle2} label="Remboursé par le réassureur" value={fmt(totalRembourse)} color={C.green} />
      </div>

      <Card className="p-5 mb-5" style={{ maxWidth: 640 }}>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Traité de réassurance</SectionTitle>
          {!editConfig && <button onClick={() => { setDraftConfig(config); setEditConfig(true); }} className="rounded-lg px-3 py-1.5 flex items-center gap-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><SlidersHorizontal size={12} /> Modifier</button>}
        </div>
        {editConfig ? (
          <>
            <Field label="Réassureur partenaire"><input style={inputStyle} value={draftConfig.reassureur} onChange={(e) => setDraftConfig({ ...draftConfig, reassureur: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label="Seuil de cession (CDF)"><input style={inputStyle} value={draftConfig.seuilCession} onChange={(e) => setDraftConfig({ ...draftConfig, seuilCession: Number(e.target.value.replace(/\D/g, "")) || 0 })} /></Field>
              <Field label="Taux de cession (%)"><input style={inputStyle} value={draftConfig.tauxCession} onChange={(e) => setDraftConfig({ ...draftConfig, tauxCession: Number(e.target.value.replace(/\D/g, "")) || 0 })} /></Field>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditConfig(false)} className="rounded-lg px-4 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button>
              <button onClick={enregistrerConfig} className="rounded-lg px-4 py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Enregistrer</button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Réassureur</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{config.reassureur}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Seuil de cession</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{fmt(config.seuilCession)}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Taux de cession</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{config.tauxCession}%</div></div>
          </div>
        )}
      </Card>

      <SectionTitle>Gros risques cédés en réassurance</SectionTitle>
      <Table columns={[{ label: "Sinistre" }, { label: "Patient" }, { label: "Montant total", align: "right" }, { label: "Part cédée", align: "right" }, { label: "Part conservée", align: "right" }, { label: "Statut", align: "center" }, { label: "" }]}>
        {grosRisques.map((s) => {
          const cede = Math.round(s.montant * config.tauxCession / 100);
          const conserve = s.montant - cede;
          const statutCession = cessions[s.numero]?.statut || "Non déclarée";
          return (
            <tr key={s.numero} style={{ borderTop: `1px solid ${C.line}` }}>
              <Td style={{ fontFamily: mono, fontWeight: 700 }}>{s.numero}</Td>
              <Td>{s.patient}</Td>
              <Td align="right" style={{ fontFamily: mono }}>{fmt(s.montant)}</Td>
              <Td align="right" style={{ fontFamily: mono, fontWeight: 700, color: C.gold }}>{fmt(cede)}</Td>
              <Td align="right" style={{ fontFamily: mono }}>{fmt(conserve)}</Td>
              <Td align="center"><StatusPill statut={statutCession === "Remboursée" ? "Payée" : statutCession === "Déclarée" ? "En attente" : "Refusée"} /></Td>
              <Td align="right">
                {statutCession === "Non déclarée" && <button onClick={() => declarer(s.numero)} className="rounded-lg px-3 py-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Déclarer</button>}
                {statutCession === "Déclarée" && <button onClick={() => marquerRembourse(s.numero)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Marquer remboursée</button>}
              </Td>
            </tr>
          );
        })}
        {grosRisques.length === 0 && <tr><td colSpan={7} style={{ padding: 16, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun sinistre ne dépasse le seuil de cession actuel.</td></tr>}
      </Table>
    </div>
  );
}

function CourtiersRegistre({ session, setSession, notify }) {
  const [selection, setSelection] = useState(null);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [nouv, setNouv] = useState({ nom: "", contact: "", telephone: "", email: "", ville: "Kinshasa", numeroAgrementARCA: "", tauxCommission: "10", specialite: "" });
  const courtiers = session.courtiers || [];
  const prospects = session.prospects || [];

  const ajouterCourtier = () => {
    if (!nouv.nom.trim() || !nouv.numeroAgrementARCA.trim()) return;
    const c = { id: Date.now(), ...nouv, tauxCommission: Number(nouv.tauxCommission) || 0, statut: "Actif", datePartenariat: "15/07/2026" };
    setSession({ ...session, courtiers: [c, ...courtiers] });
    setNouv({ nom: "", contact: "", telephone: "", email: "", ville: "Kinshasa", numeroAgrementARCA: "", tauxCommission: "10", specialite: "" });
    setAjoutOuvert(false);
    notify(`Courtier ${c.nom} ajouté au registre`);
  };

  const toggleStatutCourtier = (id) => {
    setSession({ ...session, courtiers: courtiers.map((c) => (c.id === id ? { ...c, statut: c.statut === "Actif" ? "Inactif" : "Actif" } : c)) });
  };

  const courtier = courtiers.find((c) => c.id === selection);

  if (courtier) {
    const dossiers = prospects.filter((p) => p.courtierNom === courtier.nom);
    const gagnes = dossiers.filter((p) => p.statut === "Gagné");
    const valeurApportee = gagnes.reduce((s, p) => s + p.valeurEstimee, 0);
    return (
      <div>
        <button onClick={() => setSelection(null)} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour au registre</button>
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>{courtier.nom}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{courtier.contact} — {courtier.ville}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill statut={courtier.statut} />
              <button onClick={() => toggleStatutCourtier(courtier.id)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}>{courtier.statut === "Actif" ? "Désactiver" : "Réactiver"}</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Agrément ARCA</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{courtier.numeroAgrementARCA}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Taux de commission</div><div style={{ fontFamily: mono, fontSize: 13, color: C.gold, fontWeight: 700 }}>{courtier.tauxCommission}%</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Partenaire depuis</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{courtier.datePartenariat}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Spécialité</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{courtier.specialite || "—"}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Téléphone</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{courtier.telephone}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Email</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{courtier.email}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Dossiers apportés</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{dossiers.length}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Valeur affaires gagnées</div><div style={{ fontFamily: mono, fontSize: 13, color: C.green, fontWeight: 700 }}>{fmt(valeurApportee)}</div></div>
          </div>
        </Card>
        <Table columns={[{ label: "Dossier" }, { label: "Statut", align: "center" }, { label: "Valeur estimée", align: "right" }, { label: "Date" }]}>
          {dossiers.map((p) => (
            <tr key={p.id} style={{ borderTop: `1px solid ${C.line}` }}>
              <Td style={{ fontWeight: 700 }}>{p.nom}</Td>
              <Td align="center"><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: "white", background: p.statut === "Gagné" ? C.green : p.statut === "Perdu" ? C.red : C.navy2, padding: "2px 9px", borderRadius: 999 }}>{p.statut}</span></Td>
              <Td align="right" style={{ fontFamily: mono, fontWeight: 700 }}>{fmt(p.valeurEstimee)}</Td>
              <Td>{p.dateCreation}</Td>
            </tr>
          ))}
          {dossiers.length === 0 && <tr><td colSpan={4} style={{ padding: 16, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun dossier apporté par ce courtier pour l'instant.</td></tr>}
        </Table>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <ShieldCheck size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Registre des cabinets de courtage partenaires, agréés par l'Autorité de Régulation et de Contrôle des Assurances (ARCA). Chaque courtier dispose de son propre taux de commission, appliqué automatiquement sur les dossiers qu'il apporte.</span>
      </Card>
      <div className="flex justify-end mb-4">
        <button onClick={() => setAjoutOuvert(!ajoutOuvert)} className="rounded-xl px-4 py-2 flex items-center gap-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Plus size={13} /> Ajouter un courtier</button>
      </div>

      {ajoutOuvert && (
        <Card className="p-4 mb-4" style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Nouveau courtier partenaire</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Nom du cabinet *"><input style={inputStyle} value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} placeholder="Ex : Congo Assurance Courtage SARL" /></Field>
            <Field label="N° agrément ARCA *"><input style={inputStyle} value={nouv.numeroAgrementARCA} onChange={(e) => setNouv({ ...nouv, numeroAgrementARCA: e.target.value })} placeholder="ARCA/COURT/2026-…" /></Field>
            <Field label="Personne de contact"><input style={inputStyle} value={nouv.contact} onChange={(e) => setNouv({ ...nouv, contact: e.target.value })} /></Field>
            <Field label="Téléphone"><input style={inputStyle} value={nouv.telephone} onChange={(e) => setNouv({ ...nouv, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
            <Field label="Email"><input style={inputStyle} value={nouv.email} onChange={(e) => setNouv({ ...nouv, email: e.target.value })} /></Field>
            <Field label="Ville"><select style={inputStyle} value={nouv.ville} onChange={(e) => setNouv({ ...nouv, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
            <Field label="Taux de commission (%)"><input style={inputStyle} value={nouv.tauxCommission} onChange={(e) => setNouv({ ...nouv, tauxCommission: e.target.value.replace(/\D/g, "") })} /></Field>
            <Field label="Spécialité"><input style={inputStyle} value={nouv.specialite} onChange={(e) => setNouv({ ...nouv, specialite: e.target.value })} placeholder="Ex : PME, secteur minier…" /></Field>
          </div>
          <div className="flex gap-2"><button onClick={() => setAjoutOuvert(false)} className="rounded-lg px-4 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button><button onClick={ajouterCourtier} disabled={!nouv.nom.trim() || !nouv.numeroAgrementARCA.trim()} className="rounded-lg px-4 py-2" style={{ background: (!nouv.nom.trim() || !nouv.numeroAgrementARCA.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter au registre</button></div>
        </Card>
      )}

      <Table columns={[{ label: "Cabinet de courtage" }, { label: "Agrément ARCA" }, { label: "Taux", align: "center" }, { label: "Dossiers apportés", align: "center" }, { label: "Statut", align: "center" }, { label: "" }]}>
        {courtiers.map((c) => {
          const dossiers = prospects.filter((p) => p.courtierNom === c.nom);
          return (
            <tr key={c.id} onClick={() => setSelection(c.id)} className="cursor-pointer" style={{ borderTop: `1px solid ${C.line}` }}>
              <Td style={{ fontWeight: 700 }}>{c.nom}</Td>
              <Td style={{ fontFamily: mono }}>{c.numeroAgrementARCA}</Td>
              <Td align="center">{c.tauxCommission}%</Td>
              <Td align="center">{dossiers.length}</Td>
              <Td align="center"><StatusPill statut={c.statut} /></Td>
              <Td><ChevronRight size={13} color={C.sub} /></Td>
            </tr>
          );
        })}
        {courtiers.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun courtier enregistré pour l'instant.</td></tr>}
      </Table>
    </div>
  );
}

function CommissionsCourtiers({ session, setSession, notify }) {
  const [selection, setSelection] = useState(null);
  const [editTaux, setEditTaux] = useState(null);
  const config = session.commissionsConfig || [];
  const courtiers = session.courtiers || [];
  const gagnes = session.prospects.filter((p) => p.statut === "Gagné");

  const beneficiaires = [
    ...config.map((cfg) => ({ nom: cfg.nom, type: "Commercial interne", taux: cfg.taux, arca: null, statut: "Actif" })),
    ...courtiers.map((c) => ({ nom: c.nom, type: "Courtier externe", taux: c.tauxCommission, arca: c.numeroAgrementARCA, statut: c.statut })),
  ];

  const parCommercial = beneficiaires.map((b) => {
    const contrats = gagnes.filter((p) => (b.type === "Commercial interne" ? p.commercial === b.nom : p.courtierNom === b.nom));
    const valeurTotale = contrats.reduce((s, p) => s + p.valeurEstimee, 0);
    const commissionTotale = Math.round(valeurTotale * b.taux / 100);
    const commissionPayee = contrats.filter((p) => p.commissionPayee).reduce((s, p) => s + Math.round(p.valeurEstimee * b.taux / 100), 0);
    const commissionDue = commissionTotale - commissionPayee;
    return { ...b, contrats, valeurTotale, commissionTotale, commissionPayee, commissionDue };
  });

  const totalDu = parCommercial.reduce((s, c) => s + c.commissionDue, 0);
  const totalVerse = parCommercial.reduce((s, c) => s + c.commissionPayee, 0);

  const marquerPayee = (prospectId) => {
    setSession({ ...session, prospects: session.prospects.map((p) => (p.id === prospectId ? { ...p, commissionPayee: true } : p)) });
    notify("Commission marquée comme versée");
  };

  const modifierTaux = (nom, type, valeur) => {
    const v = Number(valeur) || 0;
    if (type === "Commercial interne") setSession({ ...session, commissionsConfig: config.map((c) => (c.nom === nom ? { ...c, taux: v } : c)) });
    else setSession({ ...session, courtiers: courtiers.map((c) => (c.nom === nom ? { ...c, tauxCommission: v } : c)) });
    setEditTaux(null);
    notify(`Taux de commission de ${nom} mis à jour — ${v}%`);
  };

  const detail = parCommercial.find((c) => c.nom === selection);

  if (detail) {
    return (
      <div>
        <button onClick={() => setSelection(null)} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour aux commissions</button>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontFamily: serif, fontSize: 17, color: C.navy, fontWeight: 700 }}>{detail.nom}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{detail.type} — taux {detail.taux}%{detail.arca ? ` — Agrément ${detail.arca}` : ""}</div>
            </div>
            <div className="text-right"><div style={{ fontFamily: mono, fontSize: 18, color: C.gold, fontWeight: 800 }}>{fmt(detail.commissionDue)}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Commission due</div></div>
          </div>
          <Table columns={[{ label: "Contrat" }, { label: "Date de gain" }, { label: "Valeur contrat", align: "right" }, { label: "Commission", align: "right" }, { label: "Statut", align: "center" }, { label: "" }]}>
            {detail.contrats.map((p) => {
              const com = Math.round(p.valeurEstimee * detail.taux / 100);
              return (
                <tr key={p.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <Td style={{ fontWeight: 700 }}>{p.nom}</Td>
                  <Td>{p.dateCreation}</Td>
                  <Td align="right" style={{ fontFamily: mono }}>{fmt(p.valeurEstimee)}</Td>
                  <Td align="right" style={{ fontFamily: mono, fontWeight: 700, color: C.gold }}>{fmt(com)}</Td>
                  <Td align="center"><StatusPill statut={p.commissionPayee ? "Payée" : "En attente"} /></Td>
                  <Td align="right">{!p.commissionPayee && <button onClick={() => marquerPayee(p.id)} className="rounded-lg px-3 py-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Marquer payée</button>}</Td>
                </tr>
              );
            })}
            {detail.contrats.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun contrat gagné pour ce commercial.</td></tr>}
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <Percent size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Rémunération des commerciaux internes et courtiers externes agréés, calculée automatiquement sur la valeur des contrats gagnés dans le pipeline.</span>
      </Card>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <KpiCard icon={Wallet} label="Commissions dues" value={fmt(totalDu)} color={totalDu > 0 ? C.amber : C.green} />
        <KpiCard icon={CheckCircle2} label="Commissions versées" value={fmt(totalVerse)} color={C.green} />
      </div>
      <Table columns={[{ label: "Commercial / Courtier" }, { label: "Type" }, { label: "Taux", align: "center" }, { label: "Contrats gagnés", align: "center" }, { label: "Commission due", align: "right" }, { label: "" }]}>
        {parCommercial.map((c) => (
          <tr key={c.nom} style={{ borderTop: `1px solid ${C.line}` }}>
            <Td style={{ fontWeight: 700 }}>{c.nom}</Td>
            <Td>{c.type}</Td>
            <Td align="center">
              {editTaux === c.nom ? (
                <input autoFocus defaultValue={c.taux} onBlur={(e) => modifierTaux(c.nom, c.type, e.target.value)} onKeyDown={(e) => e.key === "Enter" && modifierTaux(c.nom, c.type, e.target.value)} style={{ ...inputStyle, width: 60, padding: "4px 6px", textAlign: "center" }} />
              ) : (
                <button onClick={() => setEditTaux(c.nom)} style={{ fontFamily: mono, fontSize: 12, color: C.navy2, fontWeight: 700 }}>{c.taux}%</button>
              )}
            </Td>
            <Td align="center">{c.contrats.length}</Td>
            <Td align="right" style={{ fontFamily: mono, fontWeight: 700, color: c.commissionDue > 0 ? C.amber : C.green }}>{fmt(c.commissionDue)}</Td>
            <Td align="right"><button onClick={() => setSelection(c.nom)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Détail</button></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function CRM({ session, setSession, notify, setPage }) {
  const [vue, setVue] = useState("pipeline"); // pipeline | liste
  const [selection, setSelection] = useState(null);
  const [composeOuvert, setComposeOuvert] = useState(false);
  const [filtreCommercial, setFiltreCommercial] = useState("Tous");
  const [rechercheListe, setRechercheListe] = useState("");
  const [nouveauTexteActivite, setNouveauTexteActivite] = useState("");
  const [typeActivite, setTypeActivite] = useState("Appel");
  const [prochainSuiviEdit, setProchainSuiviEdit] = useState(null);
  const [motifPerteOuvert, setMotifPerteOuvert] = useState(false);
  const [motifPerteTexte, setMotifPerteTexte] = useState("");
  const [alerteDoublon, setAlerteDoublon] = useState(null);
  const commerciauxInternes = (session.commissionsConfig || []).map((c) => c.nom);
  const [nouv, setNouv] = useState({ nom: "", type: "Entreprise", contact: "", telephone: "", email: "", ville: "Kinshasa", source: "Démarchage", courtierNom: "", formuleInteret: "Confort Famille", valeurEstimee: "", prochainSuivi: "", commercial: commerciauxInternes[0] || "" });

  const commerciaux = [...new Set(session.prospects.map((p) => p.commercial))];
  const liste = session.prospects.filter((p) =>
    (filtreCommercial === "Tous" || p.commercial === filtreCommercial) &&
    (rechercheListe.trim() === "" || p.nom.toLowerCase().includes(rechercheListe.toLowerCase()) || p.contact.toLowerCase().includes(rechercheListe.toLowerCase()) || p.telephone.includes(rechercheListe))
  );
  const prospect = session.prospects.find((p) => p.id === selection);

  const actifs = session.prospects.filter((p) => p.statut !== "Gagné" && p.statut !== "Perdu");
  const valeurPipeline = actifs.reduce((s, p) => s + p.valeurEstimee, 0);
  const gagnes = session.prospects.filter((p) => p.statut === "Gagné");
  const perdus = session.prospects.filter((p) => p.statut === "Perdu");
  const tauxConversion = (gagnes.length + perdus.length) > 0 ? Math.round((gagnes.length / (gagnes.length + perdus.length)) * 100) : 0;
  const valeurGagnee = gagnes.reduce((s, p) => s + p.valeurEstimee, 0);

  const creerProspect = () => {
    if (!nouv.nom.trim() || !nouv.contact.trim() || !nouv.telephone.trim()) return;
    const doublon = session.prospects.find((p) => p.nom.trim().toLowerCase() === nouv.nom.trim().toLowerCase() || p.telephone.replace(/\s/g, "") === nouv.telephone.replace(/\s/g, ""));
    if (doublon && !alerteDoublon) { setAlerteDoublon(doublon); return; }
    const p = { id: Date.now(), ...nouv, valeurEstimee: Number(nouv.valeurEstimee) || 0, prochainSuivi: nouv.prochainSuivi || "—", statut: "Nouveau", dateCreation: "15/07/2026", activites: [] };
    setSession({ ...session, prospects: [p, ...session.prospects] });
    setNouv({ nom: "", type: "Entreprise", contact: "", telephone: "", email: "", ville: "Kinshasa", source: "Démarchage", courtierNom: "", formuleInteret: "Confort Famille", valeurEstimee: "", prochainSuivi: "", commercial: nouv.commercial });
    setComposeOuvert(false);
    setAlerteDoublon(null);
    notify(`Prospect ${p.nom} ajouté au pipeline`);
  };

  const changerStatut = (statut) => {
    if (statut === "Perdu" && prospect.statut !== "Perdu") { setMotifPerteOuvert(true); setMotifPerteTexte(""); return; }
    setSession({ ...session, prospects: session.prospects.map((p) => (p.id === prospect.id ? { ...p, statut, activites: [...p.activites, { id: Date.now(), type: "Note", texte: `Statut changé en « ${statut} »`, date: "15/07/2026", auteur: "Vous" }] } : p)) });
    notify(`${prospect.nom} déplacé vers « ${statut} »`);
  };

  const confirmerPerte = () => {
    if (!motifPerteTexte.trim()) return;
    setSession({ ...session, prospects: session.prospects.map((p) => (p.id === prospect.id ? { ...p, statut: "Perdu", motifPerte: motifPerteTexte, activites: [...p.activites, { id: Date.now(), type: "Note", texte: `Statut changé en « Perdu » — motif : ${motifPerteTexte}`, date: "15/07/2026", auteur: "Vous" }] } : p)) });
    notify(`${prospect.nom} marqué comme perdu`);
    setMotifPerteOuvert(false);
  };

  const modifierProchainSuivi = (date) => {
    setSession({ ...session, prospects: session.prospects.map((p) => (p.id === prospect.id ? { ...p, prochainSuivi: date || "—" } : p)) });
    setProchainSuiviEdit(null);
    notify("Prochain suivi mis à jour");
  };

  const ajouterActivite = () => {
    if (!nouveauTexteActivite.trim()) return;
    const act = { id: Date.now(), type: typeActivite, texte: nouveauTexteActivite, date: "15/07/2026", auteur: "Vous" };
    setSession({ ...session, prospects: session.prospects.map((p) => (p.id === prospect.id ? { ...p, activites: [...p.activites, act] } : p)) });
    setNouveauTexteActivite("");
    notify("Activité enregistrée");
  };

  const convertirEnCompte = () => {
    const typeCompte = prospect.type === "Entreprise" ? "entreprise" : prospect.type === "Prestataire" ? "prestataire" : "assure";
    const formulePrefill = typeCompte === "assure" ? prospect.formuleInteret : (prospect.formuleInteret?.split(" ")[0] || "Confort");
    setSession({
      ...session,
      prospects: session.prospects.map((p) => (p.id === prospect.id ? { ...p, compteConverti: true } : p)),
      crmPrefill: {
        type: typeCompte, nom: prospect.nom, contact: prospect.contact, telephone: prospect.telephone, email: prospect.email,
        ville: prospect.ville, formule: formulePrefill,
      },
    });
    notify(`${prospect.nom} marqué converti — informations transmises au formulaire de création de compte`);
    setPage("comptes");
  };

  const couleurEtape = { "Nouveau": C.sub, "Contacté": C.navy2, "Devis envoyé": C.amber, "Négociation": C.gold, "Gagné": C.green, "Perdu": C.red };

  if (prospect) {
    return (
      <Card className="p-5">
        <button onClick={() => setSelection(null)} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour au pipeline</button>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2"><div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>{prospect.nom}</div><span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.navy2, background: C.ivory, padding: "2px 8px", borderRadius: 999 }}>{prospect.type}</span></div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{prospect.contact} — {prospect.ville}</div>
          </div>
          <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: "white", background: couleurEtape[prospect.statut], padding: "4px 12px", borderRadius: 999 }}>{prospect.statut}</span>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-5">
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Téléphone</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{prospect.telephone}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Email</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{prospect.email}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Source</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{prospect.source}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Commercial</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{prospect.commercial}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Formule d'intérêt</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{prospect.formuleInteret}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Valeur estimée</div><div style={{ fontFamily: mono, fontSize: 14, color: C.gold, fontWeight: 700 }}>{fmt(prospect.valeurEstimee)}/an</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Créé le</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{prospect.dateCreation}</div></div>
          <div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Prochain suivi</div>
            {prochainSuiviEdit === prospect.id ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <input autoFocus type="date" defaultValue={prospect.prochainSuivi !== "—" ? prospect.prochainSuivi : ""} onBlur={(e) => modifierProchainSuivi(e.target.value)} style={{ ...inputStyle, padding: "4px 8px", fontSize: 11.5 }} />
              </div>
            ) : (
              <button onClick={() => setProchainSuiviEdit(prospect.id)} className="flex items-center gap-1" style={{ fontFamily: sans, fontSize: 12.5, color: prospect.prochainSuivi !== "—" && prospect.prochainSuivi < "2026-07-15" ? C.red : C.ink, fontWeight: 600 }}>
                {prospect.prochainSuivi} <PenLine size={10} color={C.sub} />
              </button>
            )}
          </div>
        </div>

        {motifPerteOuvert && (
          <Card className="p-4 mb-5" style={{ background: C.redSoft, border: "none" }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>Motif de la perte de ce prospect</div>
            <textarea autoFocus style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={motifPerteTexte} onChange={(e) => setMotifPerteTexte(e.target.value)} placeholder="Ex : a choisi un concurrent, budget insuffisant, projet reporté…" />
            <div className="flex gap-2 mt-2">
              <button onClick={() => setMotifPerteOuvert(false)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5 }}>Annuler</button>
              <button onClick={confirmerPerte} disabled={!motifPerteTexte.trim()} className="rounded-lg px-3 py-1.5" style={{ background: !motifPerteTexte.trim() ? "#C9CDD6" : C.red, color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Confirmer la perte</button>
            </div>
          </Card>
        )}

        {prospect.motifPerte && <Card className="p-3 mb-4 flex items-center gap-2" style={{ background: C.redSoft, border: "none" }}><X size={14} color={C.red} /><span style={{ fontFamily: sans, fontSize: 12, color: C.red }}>Motif de perte : {prospect.motifPerte}</span></Card>}

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {CRM_ETAPES.map((e) => (
            <button key={e} onClick={() => changerStatut(e)} disabled={prospect.statut === e} className="rounded-lg px-3 py-1.5" style={{ background: prospect.statut === e ? couleurEtape[e] : "white", color: prospect.statut === e ? "white" : C.ink, border: `1px solid ${prospect.statut === e ? couleurEtape[e] : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{e}</button>
          ))}
        </div>

        {prospect.statut === "Gagné" && (
          <Card className="p-4 mb-5 flex items-center justify-between" style={{ background: prospect.compteConverti ? "#EAF6EF" : C.ivory, border: "none" }}>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} color={prospect.compteConverti ? C.green : C.navy2} />
              <span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{prospect.compteConverti ? "Déjà converti en compte client." : "Ce prospect est gagné — prêt à devenir un client dans Comptes réseau."}</span>
            </div>
            {!prospect.compteConverti && <button onClick={convertirEnCompte} className="rounded-lg px-4 py-2 flex items-center gap-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><UserPlus size={13} /> Convertir en compte</button>}
          </Card>
        )}

        <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Journal d'activité</div>
        <div className="flex gap-2 mb-3">
          <select style={{ ...inputStyle, width: 140 }} value={typeActivite} onChange={(e) => setTypeActivite(e.target.value)}><option>Appel</option><option>Email</option><option>Réunion</option><option>Devis envoyé</option><option>Note</option></select>
          <input style={{ ...inputStyle, flex: 1 }} value={nouveauTexteActivite} onChange={(e) => setNouveauTexteActivite(e.target.value)} placeholder="Détail de l'échange…" />
          <button onClick={ajouterActivite} disabled={!nouveauTexteActivite.trim()} className="rounded-lg px-4" style={{ background: nouveauTexteActivite.trim() ? C.navy : "#C9CDD6", color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter</button>
        </div>
        <div className="space-y-2">
          {[...prospect.activites].reverse().map((a) => (
            <Card key={a.id} className="p-3 flex items-start gap-2.5" style={{ background: C.ivory, border: "none" }}>
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: "white" }}>
                {a.type === "Appel" ? <Phone size={12} color={C.navy2} /> : a.type === "Email" ? <Mail size={12} color={C.navy2} /> : a.type === "Réunion" ? <Users size={12} color={C.navy2} /> : a.type === "Devis envoyé" ? <FileText size={12} color={C.gold} /> : <PenLine size={12} color={C.sub} />}
              </div>
              <div className="flex-1"><div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy }}>{a.type}</span><span style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{a.date} — {a.auteur}</span></div><div style={{ fontFamily: sans, fontSize: 12, color: C.ink, marginTop: 2 }}>{a.texte}</div></div>
            </Card>
          ))}
          {prospect.activites.length === 0 && <Card className="p-4 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune activité enregistrée pour l'instant.</span></Card>}
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard label="Prospects actifs" value={actifs.length} icon={Target} />
        <KpiCard label="Valeur du pipeline" value={fmt(valeurPipeline)} icon={TrendingUp} color={C.gold} />
        <KpiCard label="Taux de conversion" value={`${tauxConversion}%`} icon={CheckCircle2} color={tauxConversion >= 50 ? C.green : C.amber} />
        <KpiCard label="Valeur gagnée" value={fmt(valeurGagnee)} icon={Award} color={C.green} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          <button onClick={() => setVue("pipeline")} className="px-4 py-2" style={{ background: vue === "pipeline" ? C.navy : "white", color: vue === "pipeline" ? "white" : C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Pipeline</button>
          <button onClick={() => setVue("liste")} className="px-4 py-2" style={{ background: vue === "liste" ? C.navy : "white", color: vue === "liste" ? "white" : C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Liste</button>
          <button onClick={() => setVue("commissions")} className="px-4 py-2" style={{ background: vue === "commissions" ? C.navy : "white", color: vue === "commissions" ? "white" : C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Commissions</button>
          <button onClick={() => setVue("courtiers")} className="px-4 py-2" style={{ background: vue === "courtiers" ? C.navy : "white", color: vue === "courtiers" ? "white" : C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Courtiers</button>
        </div>
        <select style={{ ...inputStyle, width: 200 }} value={filtreCommercial} onChange={(e) => setFiltreCommercial(e.target.value)}><option value="Tous">Tous les commerciaux</option>{commerciaux.map((c) => <option key={c}>{c}</option>)}</select>
        <div className="relative" style={{ width: 220 }}>
          <Search size={13} color={C.sub} style={{ position: "absolute", left: 10, top: 10 }} />
          <input value={rechercheListe} onChange={(e) => setRechercheListe(e.target.value)} placeholder="Rechercher un prospect…" style={{ ...inputStyle, paddingLeft: 30, fontSize: 12 }} />
        </div>
        <button onClick={() => setComposeOuvert(!composeOuvert)} className="rounded-xl px-4 py-2 flex items-center gap-1.5 ml-auto" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Plus size={13} /> Nouveau prospect</button>
      </div>

      {composeOuvert && (
        <Card className="p-4 mb-4" style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Ajouter un prospect</div>
          {alerteDoublon && (
            <Card className="p-3 mb-3 flex items-start gap-2" style={{ background: "#FBEAE8", border: `1px solid ${C.red}` }}>
              <AlertTriangle size={14} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <span style={{ fontFamily: sans, fontSize: 11.5, color: C.red, fontWeight: 700 }}>Doublon probable : « {alerteDoublon.nom} » existe déjà dans le pipeline (statut : {alerteDoublon.statut}, commercial : {alerteDoublon.commercial}).</span>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setAlerteDoublon(null)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11 }}>Annuler</button>
                  <button onClick={creerProspect} className="rounded-lg px-3 py-1.5" style={{ background: C.red, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Créer quand même</button>
                </div>
              </div>
            </Card>
          )}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Type de souscripteur"><select style={inputStyle} value={nouv.type} onChange={(e) => setNouv({ ...nouv, type: e.target.value })}><option>Entreprise</option><option>Assuré simple</option><option>Chef de famille</option><option>Prestataire (recrutement réseau)</option></select></Field>
            <Field label="Nom (raison sociale ou nom complet)"><input style={inputStyle} value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} /></Field>
            <Field label="Personne de contact"><input style={inputStyle} value={nouv.contact} onChange={(e) => setNouv({ ...nouv, contact: e.target.value })} /></Field>
            <Field label="Téléphone"><input style={inputStyle} value={nouv.telephone} onChange={(e) => setNouv({ ...nouv, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
            <Field label="Email"><input style={inputStyle} value={nouv.email} onChange={(e) => setNouv({ ...nouv, email: e.target.value })} /></Field>
            <Field label="Ville"><select style={inputStyle} value={nouv.ville} onChange={(e) => setNouv({ ...nouv, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
            <Field label="Source"><select style={inputStyle} value={nouv.source} onChange={(e) => setNouv({ ...nouv, source: e.target.value, courtierNom: e.target.value === "Courtier" ? (session.courtiers?.[0]?.nom || "") : "" })}><option>Démarchage</option><option>Recommandation</option><option>Site web</option><option>Salon</option><option>Courtier</option></select></Field>
            {nouv.source === "Courtier" && (
              <Field label="Courtier apporteur"><select style={inputStyle} value={nouv.courtierNom} onChange={(e) => setNouv({ ...nouv, courtierNom: e.target.value })}>{(session.courtiers || []).map((c) => <option key={c.id}>{c.nom}</option>)}</select></Field>
            )}
            <Field label="Formule d'intérêt"><select style={inputStyle} value={nouv.formuleInteret} onChange={(e) => setNouv({ ...nouv, formuleInteret: e.target.value })}>{FORMULES_SANTE.map((f) => <option key={f.id}>{f.nom}</option>)}</select></Field>
            <Field label="Valeur estimée (CDF/an)"><input style={inputStyle} value={nouv.valeurEstimee} onChange={(e) => setNouv({ ...nouv, valeurEstimee: e.target.value.replace(/\D/g, "") })} /></Field>
            <Field label="Commercial assigné"><select style={inputStyle} value={nouv.commercial} onChange={(e) => setNouv({ ...nouv, commercial: e.target.value })}>{commerciauxInternes.length === 0 && <option value="">Aucun commercial configuré</option>}{commerciauxInternes.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Prochain suivi prévu"><input type="date" style={inputStyle} value={nouv.prochainSuivi} onChange={(e) => setNouv({ ...nouv, prochainSuivi: e.target.value })} /></Field>
          </div>
          <div className="flex gap-2"><button onClick={() => { setComposeOuvert(false); setAlerteDoublon(null); }} className="rounded-lg px-4 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button><button onClick={creerProspect} disabled={!nouv.nom.trim() || !nouv.contact.trim() || !nouv.telephone.trim()} className="rounded-lg px-4 py-2" style={{ background: (!nouv.nom.trim() || !nouv.contact.trim() || !nouv.telephone.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter au pipeline</button></div>
        </Card>
      )}

      {vue === "pipeline" ? (
        <div className="grid grid-cols-6 gap-3">
          {CRM_ETAPES.map((etape) => (
            <div key={etape}>
              <div className="flex items-center gap-1.5 mb-2"><div className="rounded-full" style={{ width: 8, height: 8, background: couleurEtape[etape] }} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>{etape}</span><span style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>({liste.filter((p) => p.statut === etape).length})</span></div>
              <div className="space-y-2">
                {liste.filter((p) => p.statut === etape).map((p) => (
                  <Card key={p.id} onClick={() => setSelection(p.id)} className="p-3 cursor-pointer">
                    <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.ink }}>{p.nom}</div>
                    <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{p.type}</div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700, marginTop: 4 }}>{fmt(p.valeurEstimee)}</div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : vue === "liste" ? (
        <Table columns={[{ label: "Prospect" }, { label: "Type" }, { label: "Commercial" }, { label: "Valeur estimée", align: "right" }, { label: "Statut", align: "center" }, { label: "" }]}>
          {liste.map((p) => (
            <tr key={p.id} onClick={() => setSelection(p.id)} className="cursor-pointer" style={{ borderTop: `1px solid ${C.line}` }}>
              <Td style={{ fontWeight: 700 }}>{p.nom}</Td>
              <Td>{p.type}</Td>
              <Td>{p.commercial}</Td>
              <Td align="right" style={{ fontFamily: mono, fontWeight: 700 }}>{fmt(p.valeurEstimee)}</Td>
              <Td align="center"><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: "white", background: couleurEtape[p.statut], padding: "2px 9px", borderRadius: 999 }}>{p.statut}</span></Td>
              <Td><ChevronRight size={13} color={C.sub} /></Td>
            </tr>
          ))}
        </Table>
      ) : vue === "commissions" ? (
        <CommissionsCourtiers session={session} setSession={setSession} notify={notify} />
      ) : (
        <CourtiersRegistre session={session} setSession={setSession} notify={notify} />
      )}
    </div>
  );
}

function Comptes({ session, setSession, notify }) {
  const [tab, setTab] = useState(session.crmPrefill?.type || "entreprise");
  const [creation, setCreation] = useState(!!session.crmPrefill);
  const [genere, setGenere] = useState(null);
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState(null);
  const [prefillConsomme, setPrefillConsomme] = useState(false);
  const prefill = !prefillConsomme ? session.crmPrefill : null;

  React.useEffect(() => {
    if (session.crmPrefill && !prefillConsomme) {
      setPrefillConsomme(true);
      setSession((s) => ({ ...s, crmPrefill: null }));
    }
    // eslint-disable-next-line
  }, []);

  const listes = { entreprise: session.entreprises, prestataire: session.prestataires, assure: session.assuresIndividuels };
  const liste = listes[tab].filter((c) => c.nom.toLowerCase().includes(query.toLowerCase()));
  const cleSession = (t) => (t === "entreprise" ? "entreprises" : t === "prestataire" ? "prestataires" : "assuresIndividuels");

  const enregistrerModif = (t, draft) => {
    setSession({ ...session, [cleSession(t)]: listes[t].map((c) => (c.id === draft.id ? draft : c)) });
    notify(`Informations de ${draft.nom} mises à jour`);
  };
  const toggleStatut = (t, id) => {
    const c = listes[t].find((x) => x.id === id);
    const nouveauStatut = c.statut === "Actif" ? "Suspendu" : "Actif";
    setSession({ ...session, [cleSession(t)]: listes[t].map((x) => (x.id === id ? { ...x, statut: nouveauStatut } : x)) });
    notify(nouveauStatut === "Suspendu" ? `Compte ${c.nom} suspendu — accès désactivés` : `Compte ${c.nom} réactivé`);
  };

  const genererMotDePasse = () => Math.random().toString(36).slice(-4).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

  const NOMS_RDC = ["Mbuyi", "Kalonji", "Tshibangu", "Kabeya", "Ilunga", "Ngoyi", "Mukendi", "Kasongo", "Lukusa", "Mwamba", "Kanku", "Nsimba", "Bakajika", "Muteba", "Kabongo"];
  const PRENOMS_RDC = ["Jean", "Grâce", "Odette", "Patrick", "Beatrice", "Christian", "Nadège", "Emmanuel", "Chantal", "Serge", "Aline", "Prosper", "Rachel", "David", "Bijou"];
  const nomAlea = () => `${NOMS_RDC[Math.floor(Math.random() * NOMS_RDC.length)]} ${PRENOMS_RDC[Math.floor(Math.random() * PRENOMS_RDC.length)]}`;

  const genererEffectifsEntreprise = (form) => {
    const n = Math.min(Number(form.nbEmployesEstime) || 5, 25);
    const effectifs = [];
    for (let i = 0; i < n; i++) {
      const nom = nomAlea();
      const grade = session.gradesMaitre[i % session.gradesMaitre.length];
      const emailEmploye = `${nom.toLowerCase().replace(/\s+/g, ".")}${i}@${form.nom.toLowerCase().replace(/\s+/g, "")}.cd`;
      const nbAyants = Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0;
      const ayants = Array.from({ length: nbAyants }).map((__, j) => ({ nom: nomAlea(), lien: j === 0 ? "Conjoint" : "Enfant", email: `${emailEmploye.split("@")[0]}.dep${j}@${form.nom.toLowerCase().replace(/\s+/g, "")}.cd` }));
      effectifs.push({ nom, matricule: `EMP-${1000 + i}`, grade: grade?.nom || "Agent", email: emailEmploye, ayantsDroit: ayants });
    }
    return effectifs;
  };
  const genererEquipePrestataire = (form) => {
    const roles = form.typeEtablissement === "Pharmacie" ? ["Pharmacien titulaire", "Pharmacien assistant", "Caissier"] : ["Médecin responsable", "Médecin", "Infirmier(ère)", "Caissier / Accueil"];
    return roles.map((role, i) => ({ nom: nomAlea(), role, email: `${role.toLowerCase().replace(/[^a-z]+/g, ".")}${i}@${form.nom.toLowerCase().replace(/\s+/g, "")}.cd` }));
  };

  const creerCompte = async (form) => {
    const base = { id: Date.now(), nom: form.nom, statut: "Actif", dateActivation: "07/07/2026", email: form.email, telephone: form.telephone, adresse: form.adresse, ville: form.ville };
    let entree;
    let effectifs = [];
    let equipe = [];
    if (tab === "entreprise") {
      entree = { ...base, secteur: form.secteur, rccm: form.rccm, contact: form.contact, nbEmployesEstime: form.nbEmployesEstime, formule: form.formule, dateDebut: form.dateDebut, contrat: `CTR-ENT-2026-${Math.floor(100000 + Math.random() * 900000)}`, nbEmployes: 0 };
      effectifs = genererEffectifsEntreprise(form);
      entree.nbEmployes = effectifs.length;
      entree.effectifs = effectifs;
    } else if (tab === "prestataire") {
      entree = { ...base, type: form.typeEtablissement, numeroAgrement: form.numeroAgrement, responsable: form.responsable, specialites: form.specialites, commune: form.ville, latitude: Number(form.latitude), longitude: Number(form.longitude), csuEligible: !!form.csuEligible };
      equipe = genererEquipePrestataire(form);
      entree.equipeGeneree = equipe;
    }
    else {
      const formuleChoisie = FORMULES_SANTE.find((f) => f.id === form.formule || f.nom === form.formule);
      const garantiesConsommation = formuleChoisie ? Object.entries(formuleChoisie.garanties).map(([nom, plafond]) => ({ nom, plafond, consomme: 0 })) : [];
      entree = { ...base, dateNaissance: form.dateNaissance, sexe: form.sexe, formule: form.formule, nbAyantsDroit: form.nbAyantsDroit || 0, police: `SP-KIN-${Math.floor(100000 + Math.random() * 900000)}`, contrat: `CTR-SP-2026-${Math.floor(100000 + Math.random() * 900000)}`, garantiesConsommation, telemedecineConsommee: 0 };
    }

    const responsablePrincipal = { nom: form.contact || form.responsable || form.nom, role: tab === "entreprise" ? "Administrateur du compte" : tab === "prestataire" ? "Administrateur du compte" : "Souscripteur principal", email: form.email };
    const tousUtilisateurs = [responsablePrincipal, ...(form.utilisateurs || [])];
    const acces = tousUtilisateurs.map((u) => ({ ...u, motDePasseProvisoire: genererMotDePasse() }));
    entree.acces = acces;

    // Accès individuels générés automatiquement pour l'app mobile (employés + ayants droit, ou personnel prestataire)
    let accesMobile = [];
    if (tab === "entreprise") {
      effectifs.forEach((e) => {
        accesMobile.push({ nom: e.nom, role: `Employé — ${e.grade}`, email: e.email, motDePasseProvisoire: genererMotDePasse(), contexte: `${entree.contrat} · matricule ${e.matricule}` });
        e.ayantsDroit.forEach((a) => accesMobile.push({ nom: a.nom, role: `Ayant droit (${a.lien}) de ${e.nom}`, email: a.email, motDePasseProvisoire: genererMotDePasse(), contexte: entree.contrat }));
      });
    } else if (tab === "prestataire") {
      accesMobile = equipe.map((e) => ({ nom: e.nom, role: e.role, email: e.email, motDePasseProvisoire: genererMotDePasse(), contexte: entree.numeroAgrement || form.nom }));
    } else if (tab === "assure" && Number(form.nbAyantsDroit) > 0) {
      accesMobile = Array.from({ length: Number(form.nbAyantsDroit) }).map((_, i) => ({ nom: nomAlea(), role: i === 0 ? "Ayant droit (Conjoint)" : "Ayant droit (Enfant)", email: `ayant.droit${i}.${form.nom.toLowerCase().replace(/\s+/g, ".")}@neogtec.cd`, motDePasseProvisoire: genererMotDePasse(), contexte: entree.contrat }));
    }
    entree.accesMobile = accesMobile;

    setSession({ ...session, [tab === "entreprise" ? "entreprises" : tab === "prestataire" ? "prestataires" : "assuresIndividuels"]: [entree, ...listes[tab]] });

    const comptesPartages = await chargerCanal(CLE_COMPTES_PARTAGES);
    await sauvegarderCanal(CLE_COMPTES_PARTAGES, [{ type: tab, nom: form.nom, acces, accesMobile, dateCreation: "07/07/2026", donnees: entree }, ...comptesPartages]);

    if (accesMobile.length > 0) {
      const entete = tab === "entreprise" ? `ACCÈS APP MOBILE — ${form.nom}\nContrat ${entree.contrat} — ${effectifs.length} employé(s) + ayants droit\n` : `ACCÈS APP MOBILE — PERSONNEL DE ${form.nom}\n`;
      const lignes = [entete, "=".repeat(60), ""];
      accesMobile.forEach((a) => lignes.push(`${a.nom}\n  Rôle : ${a.role}\n  Identifiant : ${a.email}\n  Mot de passe provisoire : ${a.motDePasseProvisoire}\n  Référence : ${a.contexte}\n`));
      downloadText(`Acces_App_Mobile_${form.nom.replace(/\s+/g, "_")}.txt`, lignes.join("\n"));
    }

    setCreation(false);
    setGenere({ type: tab, acces, accesMobile, nomCompte: form.nom });
    notify(`Compte ${form.nom} créé avec ${acces.length + accesMobile.length} accès générés${accesMobile.length > 0 ? " — PDF des accès individuels téléchargé" : ""}`);
  };

  const tabs = [["entreprise", "Entreprises", Building2], ["prestataire", "Prestataires", Stethoscope], ["assure", "Assurés individuels", ShieldCheck]];

  return (
    <div>
      <SectionTitle action={<button onClick={() => { setCreation(true); setGenere(null); setSelection(null); }} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Plus size={14} /> Créer un compte</button>}>Gestion des comptes réseau</SectionTitle>

      <div className="flex gap-2 mb-4">
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => { setTab(k); setCreation(false); setGenere(null); setSelection(null); }} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}><Icon size={14} /> {l} ({listes[k].length})</button>
        ))}
      </div>

      {genere && <IdentifiantsGeneres compte={genere} onFermer={() => setGenere(null)} />}
      {creation && <FormulaireCompte type={tab} onCreer={creerCompte} onAnnuler={() => setCreation(false)} prefill={prefill} />}

      {selection ? (
        <DetailCompte type={tab} compte={liste.find((c) => c.id === selection)} onRetour={() => setSelection(null)} onEnregistrer={enregistrerModif} onSuspendre={toggleStatut} />
      ) : (
        <>
          <div className="relative mb-4" style={{ maxWidth: 340 }}>
            <Search size={14} color={C.sub} style={{ position: "absolute", left: 12, top: 12 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" style={{ ...inputStyle, paddingLeft: 34 }} />
          </div>

          <Table columns={
            tab === "entreprise" ? [{ label: "Raison sociale" }, { label: "Secteur" }, { label: "Contrat" }, { label: "Employés", align: "center" }, { label: "Statut", align: "center" }]
            : tab === "prestataire" ? [{ label: "Établissement" }, { label: "Type" }, { label: "N° agrément" }, { label: "CSU maternité", align: "center" }, { label: "Statut", align: "center" }]
            : [{ label: "Assuré" }, { label: "Police" }, { label: "Formule" }, { label: "Ayants droit", align: "center" }, { label: "Statut", align: "center" }]
          }>
            {liste.map((c) => (
              <tr key={c.id} onClick={() => setSelection(c.id)} className="cursor-pointer" style={{ borderBottom: `1px solid ${C.line}` }}>
                <Td><span style={{ fontWeight: 700 }}>{c.nom}</span></Td>
                {tab === "entreprise" && <><Td>{c.secteur || "—"}</Td><Td style={{ fontFamily: mono }}>{c.contrat}</Td><Td align="center">{c.nbEmployes}</Td></>}
                {tab === "prestataire" && <><Td>{c.type}</Td><Td style={{ fontFamily: mono }}>{c.numeroAgrement}</Td><Td align="center">{c.csuEligible ? <CheckCircle2 size={14} color={C.green} style={{ margin: "0 auto" }} /> : <span style={{ color: C.sub }}>—</span>}</Td></>}
                {tab === "assure" && <><Td style={{ fontFamily: mono }}>{c.police}</Td><Td>{c.formule}</Td><Td align="center">{c.nbAyantsDroit}</Td></>}
                <Td align="center"><StatusPill statut={c.statut} /></Td>
              </tr>
            ))}
            {liste.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun compte pour l'instant.</td></tr>}
          </Table>
        </>
      )}
    </div>
  );
}

function DetailCompte({ type, compte, onRetour, onEnregistrer, onSuspendre }) {
  const [edition, setEdition] = useState(false);
  const [draft, setDraft] = useState(compte);
  if (!compte) { onRetour(); return null; }

  const champs = type === "entreprise"
    ? [["secteur", "Secteur d'activité"], ["contrat", "N° de contrat"], ["rccm", "RCCM"], ["adresse", "Adresse"], ["telephone", "Téléphone"], ["email", "Email"], ["formule", "Formule"]]
    : type === "prestataire"
    ? [["type", "Type d'établissement"], ["numeroAgrement", "N° d'agrément"], ["responsable", "Responsable"], ["commune", "Ville / Commune"], ["telephone", "Téléphone"], ["email", "Email"], ["specialites", "Spécialités"]]
    : [["police", "N° de police"], ["contrat", "N° de contrat"], ["formule", "Formule"], ["telephone", "Téléphone"], ["email", "Email"], ["nbAyantsDroit", "Ayants droit"]];

  return (
    <Card className="p-5">
      <button onClick={onRetour} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour à la liste</button>
      <div className="flex items-center justify-between mb-4">
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>{compte.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Compte actif depuis le {compte.dateActivation}</div></div>
        <StatusPill statut={compte.statut} />
      </div>

      {!edition ? (
        <div className="grid grid-cols-2 gap-4 mb-5">
          {champs.map(([key, label]) => (
            <div key={key}><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>{label}</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{compte[key] || "—"}</div></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-5">
          {champs.map(([key, label]) => (
            <Field key={key} label={label}><input style={inputStyle} value={draft[key] || ""} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /></Field>
          ))}
        </div>
      )}

      {type === "prestataire" && (
        <label className="flex items-center justify-between rounded-xl px-3.5 py-3 mb-5" style={{ background: compte.csuEligible ? "#EAF6EF" : C.ivory }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Établissement sélectionné par l'État pour la gratuité maternité (CSU)</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 2 }}>Détermine si les accouchements et CPN y sont gratuits à 100% ou suivent le circuit normal (assurance + reste à charge éventuel).</div>
          </div>
          <input type="checkbox" checked={!!compte.csuEligible} onChange={(e) => onEnregistrer(type, { ...compte, csuEligible: e.target.checked })} style={{ flexShrink: 0, marginLeft: 10 }} />
        </label>
      )}

      {compte.acces?.length > 0 && (
        <>
          <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Utilisateurs & accès ({compte.acces.length})</div>
          <div className="space-y-1.5 mb-5">
            {compte.acces.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: C.ivory }}>
                <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{a.nom} <span style={{ color: C.sub }}>— {a.role}</span></span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{a.email}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {compte.accesMobile?.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy }}>
              Accès app mobile — {type === "entreprise" ? "employés & ayants droit" : "personnel"} ({compte.accesMobile.length})
            </div>
            <button onClick={() => {
              const entete = type === "entreprise" ? `ACCÈS APP MOBILE — ${compte.nom}\nContrat ${compte.contrat} — ${compte.nbEmployes} employé(s) + ayants droit\n` : `ACCÈS APP MOBILE — PERSONNEL DE ${compte.nom}\n`;
              const lignes = [entete, "=".repeat(60), ""];
              compte.accesMobile.forEach((a) => lignes.push(`${a.nom}\n  Rôle : ${a.role}\n  Identifiant : ${a.email}\n  Mot de passe provisoire : ${a.motDePasseProvisoire}\n  Référence : ${a.contexte}\n`));
              downloadText(`Acces_App_Mobile_${compte.nom.replace(/\s+/g, "_")}.txt`, lignes.join("\n"));
            }} className="rounded-lg px-3 py-1.5 flex items-center gap-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><FileDown size={12} /> Retélécharger le fichier des accès</button>
          </div>
          <div className="space-y-1.5 mb-5" style={{ maxHeight: 260, overflowY: "auto" }}>
            {compte.accesMobile.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: C.ivory }}>
                <div><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, fontWeight: 600 }}>{a.nom}</span><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}> — {a.role}</span></div>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.sub }}>{a.email}</span>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: C.gold, fontWeight: 700 }}>{a.motDePasseProvisoire}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-2">
        {!edition ? (
          <button onClick={() => { setDraft(compte); setEdition(true); }} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><SlidersHorizontal size={13} /> Modifier les informations</button>
        ) : (
          <>
            <button onClick={() => setEdition(false)} className="rounded-xl px-4 py-2.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5 }}>Annuler</button>
            <button onClick={() => { onEnregistrer(type, draft); setEdition(false); }} className="rounded-xl px-4 py-2.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>Enregistrer</button>
          </>
        )}
        <button onClick={() => onSuspendre(type, compte.id)} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${compte.statut === "Actif" ? C.red : C.green}`, color: compte.statut === "Actif" ? C.red : C.green, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
          {compte.statut === "Actif" ? <Ban size={13} /> : <UserCheck size={13} />} {compte.statut === "Actif" ? "Suspendre le compte" : "Réactiver le compte"}
        </button>
      </div>
    </Card>
  );
}

/* =================================================================
   RÉFÉRENTIEL — catalogue maître, grades, cascade de paiement
================================================================= */
function Referentiel({ session, setSession, notify }) {
  const [tab, setTab] = useState("catalogue");
  const [syncing, setSyncing] = useState(false);
  const etablissements = Object.keys(session.tarifsReseau || {});
  const catalogue = session.catalogueMaitre;
  const grades = session.gradesMaitre;

  const synchroniserTarifs = async () => {
    setSyncing(true);
    const tarifs = await chargerCanal(CLE_TARIFS_PARTAGES);
    setSession((s) => ({ ...s, tarifsReseau: { ...s.tarifsReseau, ...tarifs } }));
    setSyncing(false);
    notify("Tarifs négociés synchronisés depuis les prestataires");
  };

  return (
    <div>
      <SectionTitle>Référentiel maître</SectionTitle>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[["catalogue", "Catalogue universel des soins", Hash], ["parametrage", "Paramétrage des tarifs", SlidersHorizontal], ["negocies", "Tarifs négociés reçus", Tag], ["baremes", "Barèmes détaillés par formule", ListChecks], ["grades", "Grades & barème", Percent], ["plafonds", "Plafonds par entreprise", Gauge], ["plafondsAssures", "Plafonds & barème assurés", ShieldCheck], ["cascade", "Cascade de paiement", Landmark]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-xl px-3.5 py-2.5 flex items-center gap-2" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Icon size={13} /> {l}</button>
        ))}
      </div>

      {tab === "catalogue" && <CatalogueEditable session={session} setSession={setSession} notify={notify} />}
      {tab === "parametrage" && <ParametrageTarifs session={session} setSession={setSession} notify={notify} />}

      {tab === "negocies" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <Card className="p-4 flex items-start gap-2 flex-1 mr-3" style={{ background: C.ivory, border: "none" }}>
              <Tag size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Chaque prestataire peut négocier son propre tarif par acte. Toute modification est transmise automatiquement ici.</span>
            </Card>
            <button onClick={synchroniserTarifs} disabled={syncing} className="rounded-xl px-4 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Synchroniser
            </button>
          </div>
          {etablissements.length === 0 && <Card className="p-6 text-center"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucun tarif négocié reçu pour l'instant. Cliquez sur "Synchroniser".</span></Card>}
          {etablissements.map((etab) => {
            const data = session.tarifsReseau[etab];
            return (
              <Card key={etab} className="p-4 mb-3">
                <div className="flex items-center justify-between mb-3"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.navy }}>{etab}</span><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Mis à jour le {data.dateMaj}</span></div>
                <Table columns={[{ label: "Code" }, { label: "Acte" }, { label: "Tarif référence", align: "right" }, { label: "Tarif négocié", align: "right" }, { label: "Zéro bon", align: "center" }]}>
                  {(data.catalogue || []).filter((a) => a.tarifNegocie !== a.tarifConventionne || a.isZeroBon).map((a) => {
                    const ref = CATALOGUE_MAITRE.find((m) => m.code === a.code)?.tarifReference || a.tarifConventionne;
                    return (
                      <tr key={a.code} style={{ borderBottom: `1px solid ${C.line}` }}>
                        <Td style={{ fontFamily: mono, color: C.navy }}>{a.code}</Td>
                        <Td>{a.libelle}</Td>
                        <Td align="right" style={{ color: C.sub }}>{fmt(ref)}</Td>
                        <Td align="right" style={{ fontFamily: mono, fontWeight: 700, color: a.tarifNegocie > ref ? C.red : C.green }}>{fmt(a.tarifNegocie)}</Td>
                        <Td align="center">{a.isZeroBon ? <CheckCircle2 size={14} color={C.green} style={{ margin: "0 auto" }} /> : <span style={{ color: C.sub }}>—</span>}</Td>
                      </tr>
                    );
                  })}
                  {(data.catalogue || []).filter((a) => a.tarifNegocie !== a.tarifConventionne || a.isZeroBon).length === 0 && <tr><td colSpan={5} style={{ padding: 14, textAlign: "center", fontFamily: sans, fontSize: 11.5, color: C.sub }}>Tous les tarifs sont alignés sur la convention réseau.</td></tr>}
                </Table>
              </Card>
            );
          })}
        </>
      )}

      {tab === "baremes" && <BaremesDetailles session={session} />}
      {tab === "grades" && <GradesEditables session={session} setSession={setSession} notify={notify} />}
      {tab === "plafonds" && <PlafondsEntreprise session={session} setSession={setSession} notify={notify} />}
      {tab === "plafondsAssures" && <PlafondsAssures session={session} setSession={setSession} notify={notify} />}

      {tab === "cascade" && <CascadeEditable session={session} setSession={setSession} notify={notify} />}
    </div>
  );
}

/* ---- Catalogue universel — ajout & modification ---- */
function CatalogueEditable({ session, setSession, notify }) {
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [nouv, setNouv] = useState({ code: "", libelle: "", garantie: "Consultations & Pharmacie", tarifReference: "" });
  const [editionCode, setEditionCode] = useState(null);
  const [draft, setDraft] = useState(null);
  const catalogue = session.catalogueMaitre;

  const ajouter = () => {
    if (!nouv.code || !nouv.libelle || !nouv.tarifReference) return;
    setSession({ ...session, catalogueMaitre: [...catalogue, { ...nouv, tarifReference: Number(nouv.tarifReference) }] });
    setNouv({ code: "", libelle: "", garantie: "Consultations & Pharmacie", tarifReference: "" });
    setAjoutOuvert(false);
    notify(`Acte ${nouv.code} ajouté au catalogue universel — diffusé au réseau`);
  };
  const enregistrerEdition = () => {
    setSession({ ...session, catalogueMaitre: catalogue.map((a) => (a.code === editionCode ? { ...draft, tarifReference: Number(draft.tarifReference) } : a)) });
    setEditionCode(null);
    notify(`Acte ${editionCode} mis à jour`);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Card className="p-4 flex items-start gap-2 flex-1 mr-3" style={{ background: C.ivory, border: "none" }}>
          <Hash size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Nomenclature standardisée diffusée à tout le réseau de prestataires — chaque acte médical porte un code universel pour que tous les établissements parlent le même langage.</span>
        </Card>
        <button onClick={() => setAjoutOuvert(true)} className="rounded-xl px-4 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Plus size={14} /> Ajouter un acte</button>
      </div>

      {ajoutOuvert && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-4 gap-3 mb-3">
            <Field label="Code"><input style={inputStyle} value={nouv.code} onChange={(e) => setNouv({ ...nouv, code: e.target.value.toUpperCase() })} placeholder="CONS-004" /></Field>
            <Field label="Libellé"><input style={inputStyle} value={nouv.libelle} onChange={(e) => setNouv({ ...nouv, libelle: e.target.value })} /></Field>
            <Field label="Garantie"><select style={inputStyle} value={nouv.garantie} onChange={(e) => setNouv({ ...nouv, garantie: e.target.value })}><option>Consultations & Pharmacie</option><option>Hospitalisation</option><option>Dentaire</option><option>Optique</option><option>Maternité</option></select></Field>
            <Field label="Tarif de référence (CDF)"><input style={inputStyle} value={nouv.tarifReference} onChange={(e) => setNouv({ ...nouv, tarifReference: e.target.value.replace(/\D/g, "") })} /></Field>
          </div>
          <div className="flex gap-2"><button onClick={() => setAjoutOuvert(false)} className="rounded-lg px-3 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button><button onClick={ajouter} className="rounded-lg px-3 py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter au catalogue</button></div>
        </Card>
      )}

      <Table columns={[{ label: "Code" }, { label: "Acte" }, { label: "Garantie" }, { label: "Tarif de référence", align: "right" }, { label: "Action", align: "right" }]}>
        {catalogue.map((a) => (
          <tr key={a.code} style={{ borderBottom: `1px solid ${C.line}` }}>
            {editionCode === a.code ? (
              <>
                <Td style={{ fontFamily: mono, fontWeight: 700, color: C.navy }}>{a.code}</Td>
                <Td><input style={{ ...inputStyle, padding: "5px 8px" }} value={draft.libelle} onChange={(e) => setDraft({ ...draft, libelle: e.target.value })} /></Td>
                <Td><select style={{ ...inputStyle, padding: "5px 8px" }} value={draft.garantie} onChange={(e) => setDraft({ ...draft, garantie: e.target.value })}><option>Consultations & Pharmacie</option><option>Hospitalisation</option><option>Dentaire</option><option>Optique</option><option>Maternité</option></select></Td>
                <Td align="right"><input style={{ ...inputStyle, padding: "5px 8px", textAlign: "right" }} value={draft.tarifReference} onChange={(e) => setDraft({ ...draft, tarifReference: e.target.value.replace(/\D/g, "") })} /></Td>
                <Td align="right"><button onClick={enregistrerEdition} className="rounded-lg px-3 py-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Enregistrer</button></Td>
              </>
            ) : (
              <>
                <Td style={{ fontFamily: mono, fontWeight: 700, color: C.navy }}>{a.code}</Td>
                <Td>{a.libelle}</Td>
                <Td style={{ color: C.sub }}>{a.garantie}</Td>
                <Td align="right" style={{ fontFamily: mono, fontWeight: 700, color: C.gold }}>{fmt(a.tarifReference)}</Td>
                <Td align="right"><button onClick={() => { setEditionCode(a.code); setDraft(a); }} style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy2 }}>Modifier</button></Td>
              </>
            )}
          </tr>
        ))}
      </Table>
    </>
  );
}

/* ---- Paramétrage direct des tarifs par prestataire ---- */
function Accordion({ title, right, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5">
        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.navy }}>{title}</span>
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
          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy2, marginBottom: 6 }}>{b.cat}</div>
          {b.items.map((row, j) => (
            <div key={j} className="py-1.5" style={{ borderBottom: j < b.items.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, maxWidth: "60%" }}>{row[0]}</span>
                <span style={{ fontFamily: mono, fontSize: 11.5, color: C.gold, fontWeight: 700 }}>{row[1]}{row[2] !== "—" && row[2] ? ` / ${row[2]}` : ""}</span>
              </div>
              {row[3] && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, fontStyle: "italic", marginTop: 1 }}>{row[3]}</div>}
            </div>
          ))}
        </div>
      ))}
      <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", margin: "12px 0 6px" }}>Limites et règles particulières</div>
      <ul className="space-y-1.5">{limites.map((l, i) => <li key={i} style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>· {l}</li>)}</ul>
      <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", margin: "12px 0 6px" }}>Soins non couverts</div>
      <ul className="space-y-1.5">{exclusions.map((e, i) => <li key={i} style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>– {e}</li>)}</ul>
    </>
  );
}

function BaremesDetailles({ session }) {
  return (
    <>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <ListChecks size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Grille complète de prise en charge par acte médical pour chaque formule — identique à ce que voit l'assuré dans son app mobile. C'est ce barème qui doit s'appliquer lors de l'instruction d'un sinistre ou d'une dérogation, au-delà du simple taux global par garantie.</span>
      </Card>
      {FORMULES_SANTE.map((f) => (
        <Accordion key={f.id} title={`${f.nom}${f.mutuelle ? " — Mutuelle" : ""}`} right={<span style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700 }}>{fmt(f.primeBase)} /an (base)</span>}>
          <BaremeDetail bareme={f.bareme} limites={f.limites} exclusions={f.exclusions} />
        </Accordion>
      ))}
    </>
  );
}

function ParametrageTarifs({ session, setSession, notify }) {
  const [prestataireSel, setPrestataireSel] = useState("");
  const [recherche, setRecherche] = useState("");
  const fileInputRef = React.useRef(null);

  const catalogueDe = (nomPrestataire) => {
    const data = session.tarifsReseau[nomPrestataire];
    return data?.catalogue || session.catalogueMaitre.map((a) => ({ ...a, tarifConventionne: a.tarifReference, tarifNegocie: a.tarifReference, isZeroBon: false }));
  };

  const enregistrerActe = async (code, tarifNegocie, isZeroBon) => {
    const actuel = catalogueDe(prestataireSel);
    const acteAvant = actuel.find((a) => a.code === code);
    const catalogueMaj = actuel.map((a) => (a.code === code ? { ...a, tarifNegocie, isZeroBon } : a));
    const nouveauTarifsReseau = { ...session.tarifsReseau, [prestataireSel]: { catalogue: catalogueMaj, dateMaj: "07/07/2026" } };
    setSession({ ...session, tarifsReseau: nouveauTarifsReseau });
    await sauvegarderCanal(CLE_TARIFS_PARTAGES, nouveauTarifsReseau);
    if (acteAvant && Number(acteAvant.tarifNegocie) !== Number(tarifNegocie)) {
      const alertes = await chargerCanal(CLE_ALERTES_TARIFS);
      await sauvegarderCanal(CLE_ALERTES_TARIFS, [{
        id: `${prestataireSel}-${code}-${Date.now()}`, etablissement: prestataireSel, code, libelle: acteAvant.libelle,
        ancienTarif: Number(acteAvant.tarifNegocie), nouveauTarif: Number(tarifNegocie), date: "07/07/2026",
        heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), lu: false, auteur: "Assureur",
      }, ...alertes].slice(0, 200));
    }
    notify(`Tarif ${code} négocié avec ${prestataireSel} mis à jour — ${fmt(tarifNegocie)}${isZeroBon ? " (Zéro bon)" : ""}`);
  };

  const exporterExcel = () => {
    const lignes = ["Prestataire;Code;Acte;Tarif reference;Tarif negocie;Zero bon"];
    session.prestataires.forEach((p) => {
      catalogueDe(p.nom).forEach((a) => lignes.push(`${p.nom};${a.code};${a.libelle};${a.tarifConventionne ?? a.tarifReference};${a.tarifNegocie};${a.isZeroBon ? "Oui" : "Non"}`));
    });
    downloadText("Tarifs_negocies_reseau.csv", lignes.join("\n"));
    notify("Export Excel (CSV) généré avec les tarifs de tout le réseau");
  };

  const importerExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const lignes = String(ev.target.result).split("\n").slice(1).filter((l) => l.trim());
      let nouveauTarifsReseau = { ...session.tarifsReseau };
      let nbLignes = 0;
      lignes.forEach((ligne) => {
        const [prestataire, code, , , tarifNegocie, zeroBonTxt] = ligne.split(";");
        if (!prestataire || !code || !tarifNegocie) return;
        const actuel = nouveauTarifsReseau[prestataire] || { catalogue: catalogueDe(prestataire), dateMaj: "07/07/2026" };
        nouveauTarifsReseau = { ...nouveauTarifsReseau, [prestataire]: { catalogue: actuel.catalogue.map((a) => (a.code === code.trim() ? { ...a, tarifNegocie: Number(tarifNegocie) || a.tarifNegocie, isZeroBon: (zeroBonTxt || "").trim().toLowerCase() === "oui" } : a)), dateMaj: "07/07/2026" } };
        nbLignes++;
      });
      setSession((s) => ({ ...s, tarifsReseau: nouveauTarifsReseau }));
      await sauvegarderCanal(CLE_TARIFS_PARTAGES, nouveauTarifsReseau);
      notify(`Import Excel traité — ${nbLignes} tarif(s) mis à jour`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!prestataireSel) {
    return (
      <>
        <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
          <SlidersHorizontal size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Un tarif conventionné résulte toujours d'un accord avec <b>un</b> prestataire précis — jamais du réseau entier. Sélectionnez d'abord l'établissement concerné pour configurer sa propre grille de prix négociés.</span>
        </Card>

        <div className="flex gap-2 mb-4">
          <button onClick={exporterExcel} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}><DownloadCloud size={14} /> Exporter tous les tarifs (Excel)</button>
          <button onClick={() => fileInputRef.current.click()} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}><UploadCloud size={14} /> Importer un fichier Excel</button>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx" hidden onChange={importerExcel} />
        </div>

        <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 10 }}>Choisir un prestataire</div>
        <div className="grid grid-cols-3 gap-3">
          {session.prestataires.map((p) => {
            const nbNegocies = catalogueDe(p.nom).filter((a) => a.tarifNegocie !== a.tarifConventionne || a.isZeroBon).length;
            return (
              <Card key={p.id} onClick={() => setPrestataireSel(p.nom)} className="p-4 cursor-pointer">
                <div className="flex items-center justify-between mb-2"><Building2 size={16} color={C.navy2} /><StatusPill statut={p.statut} /></div>
                <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{p.nom}</div>
                <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{p.type || p.commune}</div>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: nbNegocies > 0 ? C.gold : C.sub, marginTop: 6 }}>{nbNegocies > 0 ? `${nbNegocies} tarif(s) négocié(s)` : "Aucun tarif spécifique — référence réseau"}</div>
              </Card>
            );
          })}
          {session.prestataires.length === 0 && <Card className="p-6 text-center col-span-3"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucun prestataire enregistré — créez d'abord un compte dans Comptes réseau.</span></Card>}
        </div>
      </>
    );
  }

  const catalogue = catalogueDe(prestataireSel);
  const filtered = catalogue.filter((a) => a.code.toLowerCase().includes(recherche.toLowerCase()) || a.libelle.toLowerCase().includes(recherche.toLowerCase()));
  const prestataireInfo = session.prestataires.find((p) => p.nom === prestataireSel);

  return (
    <>
      <button onClick={() => setPrestataireSel("")} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Changer de prestataire</button>

      <Card className="p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: C.ivory }}><Building2 size={18} color={C.navy2} /></div>
          <div><div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>{prestataireSel}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{prestataireInfo?.type || prestataireInfo?.commune} — grille de tarifs conventionnés propre à cet établissement</div></div>
        </div>
        <StatusPill statut={prestataireInfo?.statut || "Actif"} />
      </Card>

      <div className="flex gap-2 mb-4">
        <input style={{ ...inputStyle, flex: 1 }} value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un acte (code ou libellé)…" />
        <button onClick={exporterExcel} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}><DownloadCloud size={14} /> Exporter</button>
        <button onClick={() => fileInputRef.current.click()} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}><UploadCloud size={14} /> Importer</button>
        <input ref={fileInputRef} type="file" accept=".csv,.xlsx" hidden onChange={importerExcel} />
      </div>

      <div className="space-y-2">
        {filtered.map((a) => <ActeTarifItemAssureur key={a.code} acte={a} onSave={enregistrerActe} />)}
        {filtered.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun acte ne correspond à cette recherche.</span></Card>}
      </div>
    </>
  );
}

function ActeTarifItemAssureur({ acte, onSave }) {
  const [draft, setDraft] = useState(String(acte.tarifNegocie));
  const [zeroBon, setZeroBon] = useState(!!acte.isZeroBon);
  const ref = acte.tarifConventionne ?? acte.tarifReference;
  const dirty = Number(draft) !== acte.tarifNegocie || zeroBon !== !!acte.isZeroBon;
  const negocieDifferent = acte.tarifNegocie !== ref;
  return (
    <Accordion title={`${acte.code} — ${acte.libelle}${acte.isZeroBon ? " · Zéro bon" : ""}`} right={negocieDifferent || acte.isZeroBon ? <Tag size={13} color={C.gold} /> : null}>
      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Tarif de référence réseau</span><span style={{ fontFamily: mono, fontSize: 12, color: C.sub }}>{fmt(ref)}</span></div>
        <Field label="Tarif négocié avec cet établissement"><input style={inputStyle} value={draft} onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))} /></Field>
        <label className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: zeroBon ? "#EAF6EF" : C.ivory }}>
          <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Zéro bon — pris en charge à 100%, patient exonéré</span>
          <input type="checkbox" checked={zeroBon} onChange={(e) => setZeroBon(e.target.checked)} />
        </label>
        <button onClick={() => onSave(acte.code, Number(draft), zeroBon)} disabled={!dirty} className="w-full rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ background: dirty ? C.navy : "#C9CDD6", color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Check size={13} /> Enregistrer & transmettre au prestataire</button>
      </div>
    </Accordion>
  );
}

/* ---- Grades & barème — modifiable + accords spécifiques ---- */
function GradesEditables({ session, setSession, notify }) {
  const grades = session.gradesMaitre;
  const [draftTaux, setDraftTaux] = useState({});
  const [ajoutAccordOuvert, setAjoutAccordOuvert] = useState(false);
  const [nouvAccord, setNouvAccord] = useState({ cible: session.entreprises[0]?.nom || "", grade: grades[0]?.id || "", taux: "" });

  const enregistrerTaux = (id) => {
    const v = Number(draftTaux[id]);
    if (!v) return;
    setSession({ ...session, gradesMaitre: grades.map((g) => (g.id === id ? { ...g, taux: v } : g)) });
    notify(`Taux du grade mis à jour (${v}%)`);
  };

  const ajouterAccord = () => {
    if (!nouvAccord.cible || !nouvAccord.taux) return;
    setSession({ ...session, accordsGrades: [{ id: Date.now(), ...nouvAccord, taux: Number(nouvAccord.taux) }, ...session.accordsGrades] });
    setNouvAccord({ cible: session.entreprises[0]?.nom || "", grade: grades[0]?.id || "", taux: "" });
    setAjoutAccordOuvert(false);
    notify("Accord spécifique enregistré");
  };
  const retirerAccord = (id) => setSession({ ...session, accordsGrades: session.accordsGrades.filter((a) => a.id !== id) });

  return (
    <>
      <Table columns={[{ label: "Grade" }, { label: "Taux de prise en charge", align: "right" }, { label: "", align: "right" }]}>
        {grades.map((g) => (
          <tr key={g.id} style={{ borderBottom: `1px solid ${C.line}` }}>
            <Td style={{ fontWeight: 700 }}>{g.nom}</Td>
            <Td align="right"><input style={{ ...inputStyle, width: 70, textAlign: "right", display: "inline-block", padding: "5px 8px" }} defaultValue={g.taux} onChange={(e) => setDraftTaux({ ...draftTaux, [g.id]: e.target.value.replace(/\D/g, "") })} />%</Td>
            <Td align="right"><button onClick={() => enregistrerTaux(g.id)} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Enregistrer</button></Td>
          </tr>
        ))}
      </Table>

      <div className="flex items-center justify-between mt-6 mb-3">
        <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.navy }}>Accords spécifiques (entreprise ou assuré famille)</div>
        <button onClick={() => setAjoutAccordOuvert(true)} className="rounded-lg px-3 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}><Plus size={13} /> Nouvel accord</button>
      </div>
      {ajoutAccordOuvert && (
        <Card className="p-4 mb-3">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field label="Entreprise ou assuré"><select style={inputStyle} value={nouvAccord.cible} onChange={(e) => setNouvAccord({ ...nouvAccord, cible: e.target.value })}>{[...session.entreprises, ...session.assuresIndividuels].map((c) => <option key={c.id}>{c.nom}</option>)}</select></Field>
            <Field label="Grade concerné"><select style={inputStyle} value={nouvAccord.grade} onChange={(e) => setNouvAccord({ ...nouvAccord, grade: e.target.value })}>{grades.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}</select></Field>
            <Field label="Taux négocié (%)"><input style={inputStyle} value={nouvAccord.taux} onChange={(e) => setNouvAccord({ ...nouvAccord, taux: e.target.value.replace(/\D/g, "") })} /></Field>
          </div>
          <div className="flex gap-2"><button onClick={() => setAjoutAccordOuvert(false)} className="rounded-lg px-3 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button><button onClick={ajouterAccord} className="rounded-lg px-3 py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Enregistrer l'accord</button></div>
        </Card>
      )}
      <div className="space-y-2">
        {session.accordsGrades.map((a) => (
          <Card key={a.id} className="p-3.5 flex items-center gap-3">
            <div className="flex-1"><span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{a.cible}</span><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}> — {grades.find((g) => g.id === a.grade)?.nom}</span></div>
            <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{a.taux}%</span>
            <button onClick={() => retirerAccord(a.id)}><Trash2 size={13} color={C.red} /></button>
          </Card>
        ))}
        {session.accordsGrades.length === 0 && <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun accord spécifique pour l'instant — le barème standard s'applique.</div>}
      </div>
    </>
  );
}

/* ---- Plafonds par entreprise ---- */
function PlafondsEntreprise({ session, setSession, notify }) {
  const [entrepriseSel, setEntrepriseSel] = useState(session.entreprises[0]?.nom || "");
  const grades = session.gradesMaitre;
  const plafondsActuels = session.plafondsEntreprise[entrepriseSel] || {};
  const [draft, setDraft] = useState(plafondsActuels);

  React.useEffect(() => { setDraft(session.plafondsEntreprise[entrepriseSel] || {}); }, [entrepriseSel]);

  const enregistrer = () => {
    setSession({ ...session, plafondsEntreprise: { ...session.plafondsEntreprise, [entrepriseSel]: draft } });
    notify(`Plafonds mis à jour pour ${entrepriseSel}`);
  };

  return (
    <>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <Gauge size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Chaque entreprise peut avoir des plafonds mensuels spécifiques par grade, selon son contrat négocié.</span>
      </Card>
      <Field label="Entreprise"><select style={{ ...inputStyle, maxWidth: 320 }} value={entrepriseSel} onChange={(e) => setEntrepriseSel(e.target.value)}>{session.entreprises.map((e) => <option key={e.id}>{e.nom}</option>)}</select></Field>

      <Table columns={[{ label: "Grade" }, { label: "Plafond mensuel (CDF)", align: "right" }]}>
        {grades.map((g) => (
          <tr key={g.id} style={{ borderBottom: `1px solid ${C.line}` }}>
            <Td style={{ fontWeight: 700 }}>{g.nom}</Td>
            <Td align="right"><input style={{ ...inputStyle, width: 160, textAlign: "right", display: "inline-block", padding: "6px 10px" }} value={draft[g.id] || ""} onChange={(e) => setDraft({ ...draft, [g.id]: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 900000" /></Td>
          </tr>
        ))}
      </Table>
      <button onClick={enregistrer} className="rounded-xl px-5 py-2.5 mt-4 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Check size={14} /> Enregistrer les plafonds pour {entrepriseSel}</button>
    </>
  );
}

/* ---- Plafonds & barème pour assurés individuels (simple ou chef de famille) ---- */
const GARANTIES_INDIVIDUELLES = ["Consultations & Pharmacie", "Hospitalisation", "Dentaire", "Optique", "Maternité"];
function PlafondsAssures({ session, setSession, notify }) {
  const [assureSel, setAssureSel] = useState(session.assuresIndividuels[0]?.nom || "");
  const assure = session.assuresIndividuels.find((a) => a.nom === assureSel);
  const estChefDeFamille = Number(assure?.nbAyantsDroit || 0) > 0;
  const plafondsActuels = session.plafondsAssures[assureSel] || {};
  const [draftPlafonds, setDraftPlafonds] = useState(plafondsActuels);
  const baremeActuel = session.baremeAssures[assureSel] || { principal: 100, ayantDroit: 70 };
  const [draftBareme, setDraftBareme] = useState(baremeActuel);

  React.useEffect(() => { setDraftPlafonds(session.plafondsAssures[assureSel] || {}); setDraftBareme(session.baremeAssures[assureSel] || { principal: 100, ayantDroit: 70 }); }, [assureSel]);

  const enregistrer = () => {
    setSession({ ...session, plafondsAssures: { ...session.plafondsAssures, [assureSel]: draftPlafonds }, baremeAssures: { ...session.baremeAssures, [assureSel]: draftBareme } });
    notify(`Plafonds et barème mis à jour pour ${assureSel}`);
  };

  if (!assure) return <Card className="p-6 text-center"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucun assuré individuel enregistré pour l'instant.</span></Card>;

  return (
    <>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <ShieldCheck size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Paramétrez le plafond par garantie et le taux de prise en charge, que l'assuré soit une personne simple ou un chef de famille avec ayants droit.</span>
      </Card>
      <div className="flex items-center gap-3 mb-4">
        <Field label="Assuré individuel"><select style={{ ...inputStyle, minWidth: 260 }} value={assureSel} onChange={(e) => setAssureSel(e.target.value)}>{session.assuresIndividuels.map((a) => <option key={a.id}>{a.nom}</option>)}</select></Field>
        <span className="rounded-full px-3 py-1.5 flex-shrink-0" style={{ background: estChefDeFamille ? C.goldSoft : C.ivory, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginTop: 18 }}>{estChefDeFamille ? `Chef de famille — ${assure.nbAyantsDroit} ayant(s) droit` : "Assuré simple"}</span>
      </div>

      <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Plafonds par garantie (CDF/an)</div>
      <Table columns={[{ label: "Garantie" }, { label: "Plafond annuel", align: "right" }]}>
        {GARANTIES_INDIVIDUELLES.map((g) => (
          <tr key={g} style={{ borderBottom: `1px solid ${C.line}` }}>
            <Td style={{ fontWeight: 700 }}>{g}</Td>
            <Td align="right"><input style={{ ...inputStyle, width: 160, textAlign: "right", display: "inline-block", padding: "6px 10px" }} value={draftPlafonds[g] || ""} onChange={(e) => setDraftPlafonds({ ...draftPlafonds, [g]: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 1800000" /></Td>
          </tr>
        ))}
      </Table>

      <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, margin: "20px 0 8px" }}>Barème de prise en charge</div>
      <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 480 }}>
        <Field label="Taux — souscripteur principal (%)"><input style={inputStyle} value={draftBareme.principal} onChange={(e) => setDraftBareme({ ...draftBareme, principal: e.target.value.replace(/\D/g, "") })} /></Field>
        <Field label="Taux — ayants droit / famille (%)"><input style={inputStyle} value={draftBareme.ayantDroit} onChange={(e) => setDraftBareme({ ...draftBareme, ayantDroit: e.target.value.replace(/\D/g, "") })} disabled={!estChefDeFamille} /></Field>
      </div>
      {!estChefDeFamille && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 4 }}>Cet assuré n'a pas d'ayant droit déclaré — seul le taux du souscripteur principal s'applique.</div>}

      <button onClick={enregistrer} className="rounded-xl px-5 py-2.5 mt-5 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Check size={14} /> Enregistrer pour {assureSel}</button>
    </>
  );
}

/* ---- Cascade de paiement — ajout & modification de chaque étape ---- */
function CascadeEditable({ session, setSession, notify }) {
  const cascade = session.cascadeMaitre;
  const [editionOrdre, setEditionOrdre] = useState(null);
  const [draft, setDraft] = useState(null);
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [nouv, setNouv] = useState({ payeur: "", role: "", taux: "" });

  const enregistrerEdition = () => {
    setSession({ ...session, cascadeMaitre: cascade.map((c) => (c.ordre === editionOrdre ? draft : c)) });
    setEditionOrdre(null);
    notify(`Étape ${editionOrdre} de la cascade mise à jour`);
  };
  const ajouterEtape = () => {
    if (!nouv.payeur || !nouv.taux) return;
    const ordre = cascade.length + 1;
    setSession({ ...session, cascadeMaitre: [...cascade, { ordre, ...nouv }] });
    setNouv({ payeur: "", role: "", taux: "" });
    setAjoutOuvert(false);
    notify(`Nouvelle étape "${nouv.payeur}" ajoutée à la cascade`);
  };
  const retirerEtape = (ordre) => {
    const restante = cascade.filter((c) => c.ordre !== ordre).map((c, i) => ({ ...c, ordre: i + 1 }));
    setSession({ ...session, cascadeMaitre: restante });
    notify("Étape retirée de la cascade — ordre renuméroté");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Card className="p-4 flex items-start gap-2 flex-1 mr-3" style={{ background: C.ivory, border: "none" }}>
          <Landmark size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Ceci est le <b>modèle de référence</b> repris automatiquement dans le profil de cascade « Complet » à chaque nouveau contrat créé. Les contrats déjà signés gardent la cascade telle qu'elle était au moment de leur création — modifiez-la directement dans le détail de ce contrat si besoin (onglet Contrats).</span>
        </Card>
        <button onClick={() => setAjoutOuvert(true)} className="rounded-xl px-4 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Plus size={14} /> Ajouter une étape</button>
      </div>

      {ajoutOuvert && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field label="Payeur"><input style={inputStyle} value={nouv.payeur} onChange={(e) => setNouv({ ...nouv, payeur: e.target.value })} placeholder="Ex : Fonds social entreprise" /></Field>
            <Field label="Rôle"><input style={inputStyle} value={nouv.role} onChange={(e) => setNouv({ ...nouv, role: e.target.value })} placeholder="Description du rôle" /></Field>
            <Field label="Taux"><input style={inputStyle} value={nouv.taux} onChange={(e) => setNouv({ ...nouv, taux: e.target.value })} placeholder="Ex : 10% ou Variable" /></Field>
          </div>
          <div className="flex gap-2"><button onClick={() => setAjoutOuvert(false)} className="rounded-lg px-3 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button><button onClick={ajouterEtape} className="rounded-lg px-3 py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter à la cascade</button></div>
        </Card>
      )}

      <div className="space-y-3">
        {cascade.map((c) => (
          <Card key={c.ordre} className="p-4">
            {editionOrdre === c.ordre ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, background: C.navy, color: "white", fontFamily: sans, fontSize: 13, fontWeight: 800 }}>{c.ordre}</div>
                <input style={{ ...inputStyle, flex: 1 }} value={draft.payeur} onChange={(e) => setDraft({ ...draft, payeur: e.target.value })} />
                <input style={{ ...inputStyle, flex: 1 }} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                <input style={{ ...inputStyle, width: 100 }} value={draft.taux} onChange={(e) => setDraft({ ...draft, taux: e.target.value })} />
                <button onClick={enregistrerEdition} className="rounded-lg px-3 py-2 flex-shrink-0" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Enregistrer</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, background: C.navy, color: "white", fontFamily: sans, fontSize: 13, fontWeight: 800 }}>{c.ordre}</div>
                <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{c.payeur}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{c.role}</div></div>
                <span style={{ fontFamily: mono, fontSize: 13, color: C.gold, fontWeight: 700 }}>{c.taux}</span>
                <button onClick={() => { setEditionOrdre(c.ordre); setDraft(c); }}><SlidersHorizontal size={14} color={C.navy2} /></button>
                <button onClick={() => retirerEtape(c.ordre)}><Trash2 size={14} color={C.red} /></button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

/* =================================================================
   DÉROGATIONS RÉSEAU — vue globale, arbitrage assureur
================================================================= */
function DerogationsReseau({ session, setSession, notify }) {
  const [syncing, setSyncing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState("Toutes");
  const [selection, setSelection] = useState(null);
  const [commentaire, setCommentaire] = useState("");

  const synchroniser = async () => {
    setSyncing(true);
    const partagees = await chargerCanal(CLE_DEROGATIONS_PARTAGEES);
    setSession((s) => ({ ...s, derogationsReseau: partagees }));
    setSyncing(false);
    notify("Dérogations synchronisées depuis le réseau");
  };
  React.useEffect(() => { synchroniser(); }, []);

  const traiter = async (statut) => {
    const d = session.derogationsReseau.find((x) => x.uid === selection);
    const maj = session.derogationsReseau.map((x) => (x.uid === selection ? { ...x, statut, traitePar: "Médecin conseil NeoGTec HealthCare", commentaire } : x));
    setSession({ ...session, derogationsReseau: maj });
    await sauvegarderCanal(CLE_DEROGATIONS_PARTAGEES, maj);
    notify(`Dérogation ${statut.toLowerCase()} — statut renvoyé au prestataire`);
    setSelection(null); setCommentaire("");
  };

  const liste = session.derogationsReseau.filter((d) => filtreStatut === "Toutes" || d.statut === filtreStatut);
  const d = session.derogationsReseau.find((x) => x.uid === selection);

  return (
    <div>
      <SectionTitle action={
        <button onClick={synchroniser} disabled={syncing} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Synchroniser le réseau
        </button>
      }>Dérogations — vue réseau</SectionTitle>

      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <ShieldQuestion size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Vue consolidée de toutes les dérogations soumises par les prestataires, quel que soit leur destinataire. L'assureur peut arbitrer directement celles qui lui sont adressées, et superviser celles envoyées aux entreprises ou aux assurés principaux.</span>
      </Card>

      {selection && d ? (
        <Card className="p-5 mb-4">
          <button onClick={() => setSelection(null)} className="flex items-center gap-1.5 mb-3" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour à la liste</button>
          <div className="flex items-center justify-between mb-3"><span style={{ fontFamily: serif, fontSize: 17, color: C.navy, fontWeight: 700 }}>{d.patientNom}</span><StatusPill statut={d.statut} /></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Établissement</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{d.etablissement}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Destinataire</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{d.destinataire}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Montant demandé</div><div style={{ fontFamily: mono, fontSize: 15, color: C.gold, fontWeight: 800 }}>{fmt(d.montantDemande)}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Plafond restant</div><div style={{ fontFamily: mono, fontSize: 13, color: C.ink }}>{fmt(d.plafondRestant)}</div></div>
          </div>
          <div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, marginBottom: 4 }}>{d.motif}</div>
          <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Soumise le {d.dateEnvoi}</div>
          {d.traitePar && <div style={{ fontFamily: sans, fontSize: 11, color: C.green, marginTop: 8 }}>Traitée par {d.traitePar}{d.commentaire ? ` — ${d.commentaire}` : ""}</div>}

          {d.statut === "En attente" && (
            <>
              <Field label="Commentaire du médecin conseil (optionnel)"><textarea style={{ ...inputStyle, minHeight: 70, resize: "none", marginTop: 12 }} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Avis médical, justification…" /></Field>
              <div className="flex gap-2 mt-4">
                <button onClick={() => traiter("Refusée")} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><X size={14} /> Refuser</button>
                <button onClick={() => traiter("Approuvée")} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.green, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><Check size={14} /> Approuver</button>
              </div>
            </>
          )}
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            {["Toutes", "En attente", "Approuvée", "Refusée"].map((f) => (
              <button key={f} onClick={() => setFiltreStatut(f)} className="rounded-full px-3 py-1.5" style={{ background: filtreStatut === f ? C.navy : "white", color: filtreStatut === f ? "white" : C.ink, border: `1px solid ${filtreStatut === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{f}</button>
            ))}
          </div>
          <Table columns={[{ label: "Patient" }, { label: "Établissement" }, { label: "Destinataire" }, { label: "Montant", align: "right" }, { label: "Statut", align: "center" }]}>
            {liste.map((x) => (
              <tr key={x.uid} onClick={() => setSelection(x.uid)} className="cursor-pointer" style={{ borderBottom: `1px solid ${C.line}` }}>
                <Td style={{ fontWeight: 700 }}>{x.patientNom}</Td>
                <Td>{x.etablissement}</Td>
                <Td style={{ color: C.sub }}>{x.destinataire}</Td>
                <Td align="right" style={{ fontFamily: mono, fontWeight: 700, color: C.gold }}>{fmt(x.montantDemande)}</Td>
                <Td align="center"><StatusPill statut={x.statut} /></Td>
              </tr>
            ))}
            {liste.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune dérogation pour ce filtre.</td></tr>}
          </Table>
        </>
      )}
    </div>
  );
}

/* =================================================================
   TÉLÉCONSULTATIONS RÉSEAU — supervision globale
================================================================= */
function TeleconsultationsReseau({ session, setSession, notify }) {
  const [syncing, setSyncing] = useState(false);
  const synchroniser = async () => {
    setSyncing(true);
    const partagees = await chargerCanal(CLE_TELECONSULTATIONS_PARTAGEES);
    setSession((s) => ({ ...s, teleconsultationsReseau: partagees }));
    setSyncing(false);
    notify("Téléconsultations synchronisées depuis le réseau");
  };
  React.useEffect(() => { synchroniser(); }, []);

  const liste = session.teleconsultationsReseau || [];

  return (
    <div>
      <SectionTitle action={
        <button onClick={synchroniser} disabled={syncing} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Synchroniser
        </button>
      }>Téléconsultations — vue réseau</SectionTitle>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <KpiCard icon={Video} label="Demandes en attente" value={liste.filter((t) => t.statut === "En attente").length} color={C.amber} />
        <KpiCard icon={CalendarClock} label="Programmées" value={liste.filter((t) => t.statut === "Programmée").length} color={C.navy2} />
        <KpiCard icon={CheckCircle2} label="Terminées" value={liste.filter((t) => t.statut === "Terminée").length} color={C.green} />
      </div>

      <Table columns={[{ label: "Patient" }, { label: "Établissement" }, { label: "Médecin" }, { label: "Date" }, { label: "Statut", align: "center" }]}>
        {liste.map((t, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${C.line}` }}>
            <Td style={{ fontWeight: 700 }}>{t.patientNom}</Td>
            <Td>{t.etablissement || "—"}</Td>
            <Td style={{ color: C.sub }}>{t.medecin || "Non assigné"}</Td>
            <Td style={{ fontFamily: mono }}>{t.date} {t.heure}</Td>
            <Td align="center"><StatusPill statut={t.statut === "Programmée" || t.statut === "Terminée" ? "Approuvée" : t.statut} /></Td>
          </tr>
        ))}
        {liste.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune téléconsultation dans le réseau pour l'instant.</td></tr>}
      </Table>
    </div>
  );
}

/* =================================================================
   MESSAGERIE INTERNE — communication directe entre les 4 apps,
   sans passer par l'email
================================================================= */
function buildReclamationsDemo() {
  return [
    {
      id: "REC-2025-004", initiateurType: "assure", initiateurNom: "MUKENDI Jean-Paul", initiateurRef: "SP-KIN-000482",
      beneficiaire: "MUKENDI Jean-Paul", contexte: "Police SP-KIN-000482 · Contrat CTR-SP-2026-000482",
      type: "Remboursement refusé", severite: "Haute", description: "Mon remboursement du 20 août pour des soins dentaires a été refusé sans motif valable.",
      document: "Facture_Dentaire_Aout2025.pdf", etape: "Décision rendue",
      decision: "Après contre-vérification, l'acte était bien couvert par la formule Confort Famille. Remboursement validé et crédité.",
      dateSoumission: "22/08/2025", derniereActivite: "02/09/2025",
      historique: [
        { action: "Réclamation enregistrée sur mobile", auteur: "MUKENDI Jean-Paul", date: "22/08/2025", heure: "11:15" },
        { action: "Dossier passé à l'étape « En cours d'analyse »", auteur: "Gestionnaire réseau", date: "25/08/2025", heure: "09:40" },
        { action: "Décision finale enregistrée et transmise à l'adhérent", auteur: "Gestionnaire réseau", date: "02/09/2025", heure: "14:20" },
      ],
    },
    {
      id: "REC-2025-018", initiateurType: "entreprise", initiateurNom: "NGOYI Beatrice", initiateurRef: "MININGCO SARL",
      beneficiaire: "KALALA Trésor", contexte: "MININGCO SARL · Contrat CTR-ENT-2026-778213",
      type: "Délai de traitement", severite: "Basse", description: "Plus de 12 jours d'attente pour le remboursement optique standard d'un de nos employés.",
      document: null, etape: "Décision rendue",
      decision: "Le délai était dû à un volume exceptionnel en fin de trimestre. Remboursement traité et crédité sous 48h supplémentaires.",
      dateSoumission: "14/11/2025", derniereActivite: "20/11/2025",
      historique: [
        { action: "Réclamation enregistrée sur l'app Entreprise", auteur: "NGOYI Beatrice", date: "14/11/2025", heure: "08:50" },
        { action: "Dossier passé à l'étape « En cours d'analyse »", auteur: "Gestionnaire réseau", date: "16/11/2025", heure: "10:05" },
        { action: "Décision finale enregistrée et transmise à l'adhérent", auteur: "Gestionnaire réseau", date: "20/11/2025", heure: "16:30" },
      ],
    },
    {
      id: "REC-2026-011", initiateurType: "prestataire", initiateurNom: "Dr. Kalonji Mbuyi", initiateurRef: "Clinique Ngaliema",
      beneficiaire: "Clinique Ngaliema", contexte: "Clinique Ngaliema · Agrément NGT-PREST-2026-004821",
      type: "Facturation", severite: "Moyenne", description: "Écart de tarif constaté sur trois bons de prise en charge de janvier — tarif conventionné non appliqué.",
      document: "Releve_Ecarts_Janvier2026.pdf", etape: "Décision rendue",
      decision: "Erreur confirmée côté paramétrage réseau. Grille tarifaire corrigée et régularisation versée sur le règlement de février.",
      dateSoumission: "05/02/2026", derniereActivite: "14/02/2026",
      historique: [
        { action: "Réclamation enregistrée sur l'app Prestataire", auteur: "Dr. Kalonji Mbuyi", date: "05/02/2026", heure: "09:00" },
        { action: "Dossier passé à l'étape « En cours d'analyse »", auteur: "Gestionnaire réseau", date: "07/02/2026", heure: "11:20" },
        { action: "Décision finale enregistrée et transmise à l'adhérent", auteur: "Gestionnaire réseau", date: "14/02/2026", heure: "15:10" },
      ],
    },
    {
      id: "REC-2026-031", initiateurType: "assure", initiateurNom: "MUKENDI Jean-Paul", initiateurRef: "SP-KIN-000482",
      beneficiaire: "MUKENDI Grâce", contexte: "Police SP-KIN-000482 · Contrat CTR-SP-2026-000482",
      type: "Accueil clinique", severite: "Moyenne", description: "La clinique partenaire CH Bien Être a refusé d'appliquer le tiers-payant lors de la consultation de ma fille.",
      document: "Recu_Consultation_Mai2026.png", etape: "En cours d'analyse", decision: null,
      dateSoumission: "18/05/2026", derniereActivite: "22/05/2026",
      historique: [
        { action: "Réclamation enregistrée sur mobile", auteur: "MUKENDI Jean-Paul", date: "18/05/2026", heure: "09:30" },
        { action: "Dossier passé à l'étape « En cours d'analyse »", auteur: "Gestionnaire réseau", date: "22/05/2026", heure: "10:15" },
      ],
    },
    {
      id: "REC-2026-052", initiateurType: "entreprise", initiateurNom: "NGOYI Beatrice", initiateurRef: "MININGCO SARL",
      beneficiaire: "NGALULA Grâce", contexte: "MININGCO SARL · Contrat CTR-ENT-2026-778213",
      type: "Remboursement refusé", severite: "Haute", description: "Le remboursement d'hospitalisation de juin pour une de nos employées a été rejeté au motif de plafond dépassé, alors que le grade Cadre n'a jamais été appliqué.",
      document: "Bon_PEC_Juin2026.pdf", etape: "Reçue", decision: null,
      dateSoumission: "03/07/2026", derniereActivite: "03/07/2026",
      historique: [
        { action: "Réclamation enregistrée sur l'app Entreprise", auteur: "NGOYI Beatrice", date: "03/07/2026", heure: "14:05" },
      ],
    },
  ];
}

function ReclamationsConsoleAdmin({ session, notify }) {
  const [reclamations, setReclamations] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [filtreSeverite, setFiltreSeverite] = useState("Toutes");
  const [selection, setSelection] = useState(null);
  const [decisionTexte, setDecisionTexte] = useState("");
  const [modeleSel, setModeleSel] = useState("");

  const synchroniser = async () => {
    setSyncing(true);
    let toutes = await chargerCanal(CLE_RECLAMATIONS_PARTAGEES);
    if (toutes.length === 0) {
      toutes = buildReclamationsDemo();
      await sauvegarderCanal(CLE_RECLAMATIONS_PARTAGEES, toutes);
    }
    setReclamations(toutes);
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const liste = reclamations.filter((r) => filtreSeverite === "Toutes" || r.severite === filtreSeverite);
  const rec = reclamations.find((r) => r.id === selection);
  const libelleType = { assure: "Assuré", entreprise: "Entreprise", prestataire: "Prestataire" };
  const couleurPoint = (s) => (s === "Haute" ? C.red : s === "Moyenne" ? C.amber : C.green);

  const majReclamation = async (champs, actionLog) => {
    if (!rec) return;
    const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const nouvelleEntree = actionLog ? [{ action: actionLog, auteur: "Gestionnaire réseau", date: "15/07/2026", heure }] : [];
    const maj = reclamations.map((r) => (r.id === rec.id ? { ...r, ...champs, derniereActivite: "15/07/2026", historique: [...(r.historique || []), ...nouvelleEntree] } : r));
    setReclamations(maj);
    await sauvegarderCanal(CLE_RECLAMATIONS_PARTAGEES, maj);
  };

  const avancerEtape = async () => {
    const idx = ETAPES_RECLAMATION.indexOf(rec.etape);
    if (idx < ETAPES_RECLAMATION.length - 1) {
      const suivante = ETAPES_RECLAMATION[idx + 1];
      await majReclamation({ etape: suivante }, `Dossier passé à l'étape « ${suivante} »`);
      notify(`Réclamation ${rec.id} passée à l'étape « ${suivante} »`);
    }
  };

  const statuerDecision = async () => {
    if (!decisionTexte.trim()) return;
    await majReclamation({ etape: "Décision rendue", decision: decisionTexte }, "Décision finale enregistrée et transmise à l'adhérent");
    notify(`Décision finale enregistrée pour ${rec.id} — transmise directement à l'app du réclamant`);
    setDecisionTexte(""); setModeleSel("");
  };

  const voirJustificatif = () => {
    telechargerDocument(rec.document, `Justificatif de la réclamation ${rec.id} — fourni par ${rec.initiateurNom}`);
  };

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-5">
        <div className="flex items-center justify-between mb-3">
          <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.navy }}>File de traitement des plaintes</div>
          <button onClick={synchroniser} disabled={syncing} className="rounded-lg px-2.5 py-1.5 flex items-center gap-1" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{syncing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}</button>
        </div>
        <div className="flex gap-1.5 mb-3">
          {["Toutes", "Basse", "Moyenne", "Haute"].map((s) => (
            <button key={s} onClick={() => setFiltreSeverite(s)} className="rounded-lg px-3 py-1.5" style={{ background: filtreSeverite === s ? C.navy : C.ivory, color: filtreSeverite === s ? "white" : C.ink, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{s}</button>
          ))}
        </div>
        {liste.length === 0 && <Card className="p-6 text-center"><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucune réclamation pour l'instant.</span></Card>}
        <div className="space-y-2">
          {liste.map((r) => (
            <Card key={r.id} onClick={() => { setSelection(r.id); setDecisionTexte(""); setModeleSel(""); }} className="p-3.5 cursor-pointer" style={{ border: r.id === selection ? `1.5px solid ${C.green}` : `1px solid ${C.line}`, background: r.id === selection ? "#F3FAF5" : "white" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.sub }}>{r.id}</span>
                  <div className="rounded-full" style={{ width: 7, height: 7, background: couleurPoint(r.severite) }} />
                  <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{r.initiateurNom}</span>
                </div>
                <ChevronRight size={13} color={C.sub} />
              </div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontStyle: "italic", marginTop: 3 }}>« {r.description.length > 70 ? r.description.slice(0, 70) + "…" : r.description} »</div>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.green, fontWeight: 700, marginTop: 4 }}>TYPE : {r.type.toUpperCase()} · STATUT ACTUEL : {r.etape.toUpperCase()}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="col-span-7">
        {!rec ? (
          <Card className="p-6 flex items-center justify-center text-center" style={{ minHeight: 300 }}>
            <span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub, fontStyle: "italic" }}>Sélectionnez une plainte dans la file pour appliquer les modèles de réponses ou statuer sur la décision.</span>
          </Card>
        ) : (
          <Card className="p-5">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Traitement du dossier</div>
            <div className="flex items-center justify-between mb-1">
              <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>{rec.initiateurNom}</div>
              <span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: couleurSeverite(rec.severite).fg, background: couleurSeverite(rec.severite).bg, padding: "3px 10px", borderRadius: 999 }}>SÉVÉRITÉ : {rec.severite.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.sub, marginBottom: 14 }}>ID UNIQUE CONTESTATION : {rec.id} · {libelleType[rec.initiateurType]} · CONCERNE {rec.beneficiaire}</div>

            <div className="flex items-center gap-2 mb-4">
              {ETAPES_RECLAMATION.map((e, i) => {
                const idxActuel = ETAPES_RECLAMATION.indexOf(rec.etape);
                return <span key={e} className="rounded-full px-3 py-1.5" style={{ background: i <= idxActuel ? C.green : C.ivory, color: i <= idxActuel ? "white" : C.sub, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}>{i + 1}. {e}</span>;
              })}
              {rec.etape !== "Décision rendue" && (
                <button onClick={avancerEtape} className="rounded-full px-3 py-1.5 flex items-center gap-1" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}><ChevronRight size={12} /> Avancer</button>
              )}
            </div>

            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 6 }}>Faits exposés par l'adhérent</div>
            <Card className="p-3.5 mb-4" style={{ background: C.ivory, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 13, color: C.navy, fontStyle: "italic", fontWeight: 600 }}>« {rec.description} »</div>
            </Card>

            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 6 }}>Justificatifs rattachés</div>
            {rec.document ? (
              <button onClick={voirJustificatif} className="w-full rounded-lg px-3.5 py-2.5 mb-4 flex items-center justify-between" style={{ background: "#EAF6EF" }}>
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{rec.document}</span>
                <Eye size={15} color={C.green} />
              </button>
            ) : (
              <div className="mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontStyle: "italic" }}>Aucun justificatif joint.</div>
            )}

            {rec.etape === "Décision rendue" && rec.decision ? (
              <Card className="p-4 mb-4" style={{ background: "#EAF6EF", border: "none" }}>
                <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.green, textTransform: "uppercase" }}>Décision finale rendue</div>
                <div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontStyle: "italic", marginTop: 4 }}>« {rec.decision} »</div>
              </Card>
            ) : (
              <>
                <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 6 }}>Appliquer un modèle de réponse type</div>
                <select style={{ ...inputStyle, marginBottom: 14 }} value={modeleSel} onChange={(e) => { setModeleSel(e.target.value); setDecisionTexte(e.target.value); }}>
                  <option value="">Choisir un modèle…</option>
                  {MODELES_REPONSE_RECLAMATION.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
                <Field label="Commentaire / justification de décision"><textarea style={{ ...inputStyle, minHeight: 90, resize: "none" }} value={decisionTexte} onChange={(e) => setDecisionTexte(e.target.value)} placeholder="Saisissez la justification formelle transmise à l'assuré…" /></Field>
                <button onClick={statuerDecision} disabled={!decisionTexte.trim()} className="w-full rounded-xl py-3 mt-3 flex items-center justify-center gap-2" style={{ background: !decisionTexte.trim() ? "#C9CDD6" : C.green, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><CheckCircle2 size={15} /> Enregistrer la décision</button>
              </>
            )}

            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", margin: "20px 0 8px" }}>Traçabilité administrative d'activité</div>
            <div className="space-y-2.5">
              {(rec.historique || []).slice().reverse().map((h, i) => (
                <div key={i} className="pl-3" style={{ borderLeft: `2px solid ${C.line}` }}>
                  <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{h.action.toUpperCase()}</div>
                  <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Auteur : {h.auteur} · {h.date} {h.heure}</div>
                </div>
              ))}
              {(!rec.historique || rec.historique.length === 0) && <span style={{ fontFamily: sans, fontSize: 11, color: C.sub, fontStyle: "italic" }}>Aucune activité enregistrée.</span>}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function MessagerieInterne({ session, setSession, notify }) {
  const [vue, setVue] = useState("messagerie");
  const [conversations, setConversations] = useState([]);
  const [selection, setSelection] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState("Toutes");
  const [filtreType, setFiltreType] = useState("Tous");
  const [texte, setTexte] = useState("");
  const [fichierReponse, setFichierReponse] = useState("");
  const [composeOuvert, setComposeOuvert] = useState(false);
  const [nouveau, setNouveau] = useState({ destinataireType: "entreprise", destinataireNom: "", sujet: "", texte: "" });

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanal(CLE_MESSAGERIE_PARTAGEE);
    setConversations(toutes);
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const libelleType = { assure: "Assuré", entreprise: "Entreprise", prestataire: "Prestataire", assureur: "Assureur" };

  const liste = conversations.filter((c) =>
    (filtreStatut === "Toutes" || c.statut === filtreStatut) &&
    (filtreType === "Tous" || c.initiateurType === filtreType)
  );
  const conv = conversations.find((c) => c.id === selection);

  const envoyer = async () => {
    if (!texte.trim() && !fichierReponse || !conv) return;
    const msg = { id: Date.now(), auteurType: "assureur", auteurNom: "Gestionnaire réseau", texte, document: fichierReponse || null, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
    const maj = conversations.map((c) => (c.id === conv.id ? { ...c, messages: [...c.messages, msg], derniereActivite: "07/07/2026" } : c));
    setConversations(maj);
    await sauvegarderCanal(CLE_MESSAGERIE_PARTAGEE, maj);
    setTexte(""); setFichierReponse("");
    notify("Réponse transmise directement dans l'app du destinataire");
  };

  const marquerResolu = async () => {
    if (!conv) return;
    const maj = conversations.map((c) => (c.id === conv.id ? { ...c, statut: c.statut === "Résolu" ? "Ouvert" : "Résolu" } : c));
    setConversations(maj);
    await sauvegarderCanal(CLE_MESSAGERIE_PARTAGEE, maj);
    notify(conv.statut === "Résolu" ? "Conversation rouverte" : "Conversation marquée résolue");
  };

  const demarrerConversation = async () => {
    if (!nouveau.destinataireNom.trim() || !nouveau.sujet.trim() || !nouveau.texte.trim()) return;
    const newConv = {
      id: `MSG-${Date.now()}`, sujet: nouveau.sujet, statut: "Ouvert",
      initiateurType: "assureur", initiateurNom: "Gestionnaire réseau",
      initiateurRef: nouveau.destinataireNom, // l'assureur cible le compte du destinataire via sa référence
      destinataireType: nouveau.destinataireType, destinataireNom: nouveau.destinataireNom,
      contexte: `Message initié par l'assureur vers ${libelleType[nouveau.destinataireType]} — ${nouveau.destinataireNom}`,
      messages: [{ id: 1, auteurType: "assureur", auteurNom: "Gestionnaire réseau", texte: nouveau.texte, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
      derniereActivite: "07/07/2026",
    };
    const maj = [newConv, ...conversations];
    setConversations(maj);
    await sauvegarderCanal(CLE_MESSAGERIE_PARTAGEE, maj);
    setNouveau({ destinataireType: "entreprise", destinataireNom: "", sujet: "", texte: "" });
    setComposeOuvert(false);
    notify(`Message envoyé à ${libelleType[newConv.destinataireType]} — ${newConv.destinataireNom}`);
  };

  const optionsDestinataire = nouveau.destinataireType === "entreprise" ? session.entreprises.map((e) => e.nom)
    : nouveau.destinataireType === "prestataire" ? session.prestataires.map((p) => p.nom)
    : session.assuresIndividuels.map((a) => a.nom);

  if (vue === "reclamations") {
    return (
      <div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setVue("messagerie")} className="rounded-xl px-4 py-2" style={{ border: `1px solid ${C.line}`, color: C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Messagerie</button>
          <button onClick={() => setVue("reclamations")} className="rounded-xl px-4 py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Réclamations</button>
        </div>
        <ReclamationsConsoleAdmin session={session} notify={notify} />
      </div>
    );
  }

  if (conv) {
    return (
      <Card className="p-5">
        <button onClick={() => setSelection(null)} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour à la messagerie</button>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontFamily: serif, fontSize: 17, color: C.navy, fontWeight: 700 }}>{conv.sujet}</div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{conv.contexte}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill statut={conv.statut} />
            <button onClick={marquerResolu} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy2 }}>{conv.statut === "Résolu" ? "Rouvrir" : "Marquer résolu"}</button>
          </div>
        </div>
        {conv.initiateurTelephone && conv.initiateurType !== "assureur" && (
          <div className="flex gap-2 mb-4">
            <a href={whatsappChatUrl(conv.initiateurTelephone, `Bonjour, à propos de : ${conv.sujet}`)} target="_blank" rel="noreferrer" className="rounded-lg px-3.5 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><MessageSquare size={13} /> WhatsApp — {conv.initiateurTelephone}</a>
            <a href={whatsappCallUrl(conv.initiateurTelephone)} className="rounded-lg px-3.5 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><Phone size={13} /> Appel WhatsApp</a>
          </div>
        )}
        <div className="space-y-3 mb-5" style={{ maxHeight: 420, overflowY: "auto" }}>
          {conv.messages.map((m) => (
            <div key={m.id} className="flex" style={{ justifyContent: m.auteurType === "assureur" ? "flex-end" : "flex-start" }}>
              <div className="rounded-2xl px-4 py-2.5" style={{ maxWidth: "70%", background: m.auteurType === "assureur" ? C.navy : C.ivory }}>
                {m.auteurType !== "assureur" && <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.gold, marginBottom: 2 }}>{m.auteurNom} ({libelleType[m.auteurType]})</div>}
                {m.texte && <div style={{ fontFamily: sans, fontSize: 13, color: m.auteurType === "assureur" ? "white" : C.ink }}>{m.texte}</div>}
                {m.document && (
                  <button onClick={() => telechargerDocument(m.document, `Message de ${m.auteurNom} — ${m.date} ${m.heure}`)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mt-1.5" style={{ background: m.auteurType === "assureur" ? "rgba(255,255,255,0.15)" : "white" }}>
                    <Paperclip size={11} color={m.auteurType === "assureur" ? "white" : C.navy2} />
                    <span style={{ fontFamily: sans, fontSize: 10.5, color: m.auteurType === "assureur" ? "white" : C.ink, fontWeight: 600 }}>{m.document}</span>
                    <Download size={11} color={m.auteurType === "assureur" ? "white" : C.navy2} style={{ marginLeft: 2 }} />
                  </button>
                )}
                <div style={{ fontFamily: sans, fontSize: 9.5, color: m.auteurType === "assureur" ? "#B9C3D6" : C.sub, marginTop: 3, textAlign: "right" }}>{m.date} {m.heure}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center justify-center rounded-xl flex-shrink-0 cursor-pointer" style={{ width: 42, height: 42, border: `1px solid ${C.line}` }}>
            <Paperclip size={16} color={C.navy2} />
            <input type="file" hidden onChange={(e) => setFichierReponse(e.target.files?.[0]?.name || "")} />
          </label>
          <input style={{ ...inputStyle, flex: 1 }} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Répondre…" />
          <button onClick={envoyer} className="rounded-xl px-4 py-2.5 flex items-center gap-1.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Send size={13} /> Envoyer</button>
        </div>
        {fichierReponse && (
          <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mt-2" style={{ background: C.ivory, width: "fit-content" }}>
            <Paperclip size={11} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink }}>{fichierReponse}</span>
            <button onClick={() => setFichierReponse("")}><X size={11} color={C.sub} /></button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setVue("messagerie")} className="rounded-xl px-4 py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Messagerie</button>
        <button onClick={() => setVue("reclamations")} className="rounded-xl px-4 py-2" style={{ border: `1px solid ${C.line}`, color: C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Réclamations</button>
      </div>

      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <MessageCircle size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Communication directe avec les assurés, entreprises et prestataires du réseau — sans passer par l'email. Toute demande envoyée depuis une app mobile arrive ici en temps réel.</span>
      </Card>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={synchroniser} disabled={syncing} className="rounded-xl px-4 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncing ? "Synchronisation…" : "Synchroniser"}</button>
        <select style={{ ...inputStyle, width: 160 }} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}><option>Toutes</option><option>Ouvert</option><option>Résolu</option></select>
        <select style={{ ...inputStyle, width: 160 }} value={filtreType} onChange={(e) => setFiltreType(e.target.value)}><option value="Tous">Tous les expéditeurs</option><option value="assure">Assurés</option><option value="entreprise">Entreprises</option><option value="prestataire">Prestataires</option></select>
        <button onClick={() => setComposeOuvert(!composeOuvert)} className="rounded-xl px-4 py-2 flex items-center gap-1.5 ml-auto" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><MessageCircle size={13} /> Nouveau message</button>
      </div>

      {composeOuvert && (
        <Card className="p-4 mb-4" style={{ maxWidth: 560 }}>
          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Contacter un acteur du réseau</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Destinataire"><select style={inputStyle} value={nouveau.destinataireType} onChange={(e) => setNouveau({ ...nouveau, destinataireType: e.target.value, destinataireNom: "" })}><option value="entreprise">Entreprise</option><option value="prestataire">Prestataire</option><option value="assure">Assuré individuel</option></select></Field>
            <Field label="Nom"><select style={inputStyle} value={nouveau.destinataireNom} onChange={(e) => setNouveau({ ...nouveau, destinataireNom: e.target.value })}><option value="">Sélectionner…</option>{optionsDestinataire.map((n) => <option key={n}>{n}</option>)}</select></Field>
          </div>
          <Field label="Objet"><input style={inputStyle} value={nouveau.sujet} onChange={(e) => setNouveau({ ...nouveau, sujet: e.target.value })} placeholder="Ex : Régularisation de facture" /></Field>
          <div className="mt-3"><Field label="Message"><textarea style={{ ...inputStyle, minHeight: 80, resize: "none" }} value={nouveau.texte} onChange={(e) => setNouveau({ ...nouveau, texte: e.target.value })} /></Field></div>
          <button onClick={demarrerConversation} disabled={!nouveau.destinataireNom || !nouveau.sujet.trim() || !nouveau.texte.trim()} className="rounded-xl px-5 py-2.5 mt-3 flex items-center gap-2" style={{ background: (!nouveau.destinataireNom || !nouveau.sujet.trim() || !nouveau.texte.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Send size={13} /> Envoyer</button>
        </Card>
      )}

      {liste.length === 0 && <Card className="p-8 text-center"><MessageCircle size={22} color={C.sub} style={{ margin: "0 auto 8px" }} /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucun message pour l'instant.</span></Card>}

      <Table columns={[{ label: "Expéditeur" }, { label: "Type" }, { label: "Objet" }, { label: "Dernière activité" }, { label: "Statut", align: "center" }, { label: "" }]}>
        {liste.map((c) => (
          <tr key={c.id} onClick={() => setSelection(c.id)} className="cursor-pointer" style={{ borderTop: `1px solid ${C.line}` }}>
            <Td>{c.initiateurType === "assureur" ? c.destinataireNom : c.initiateurNom}</Td>
            <Td>{libelleType[c.initiateurType === "assureur" ? c.destinataireType : c.initiateurType]}</Td>
            <Td>{c.sujet}</Td>
            <Td>{c.derniereActivite}</Td>
            <Td align="center"><StatusPill statut={c.statut} /></Td>
            <Td><ChevronRight size={13} color={C.sub} /></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

/* =================================================================
   FINANCE & RÈGLEMENTS — pilotage financier réseau
================================================================= */
function buildCotisationsReseau() {
  return [
    { id: 1, entreprise: "MININGCO SARL", mois: "Juillet 2025", dateEcheance: "31/07/2025", montant: 14250, statut: "Payée", datePaiement: "28/07/2025" },
    { id: 2, entreprise: "MININGCO SARL", mois: "Août 2025", dateEcheance: "31/08/2025", montant: 14250, statut: "Payée", datePaiement: "30/08/2025" },
    { id: 3, entreprise: "MININGCO SARL", mois: "Septembre 2025", dateEcheance: "30/09/2025", montant: 14250, statut: "Payée", datePaiement: "29/09/2025" },
    { id: 4, entreprise: "MININGCO SARL", mois: "Octobre 2025", dateEcheance: "31/10/2025", montant: 14250, statut: "Payée", datePaiement: "31/10/2025" },
    { id: 5, entreprise: "MININGCO SARL", mois: "Novembre 2025", dateEcheance: "30/11/2025", montant: 14250, statut: "Payée", datePaiement: "27/11/2025" },
    { id: 6, entreprise: "MININGCO SARL", mois: "Décembre 2025", dateEcheance: "31/12/2025", montant: 14250, statut: "Payée", datePaiement: "22/12/2025" },
    { id: 7, entreprise: "MININGCO SARL", mois: "Janvier 2026", dateEcheance: "31/01/2026", montant: 14250, statut: "Payée", datePaiement: "30/01/2026" },
    { id: 8, entreprise: "MININGCO SARL", mois: "Février 2026", dateEcheance: "28/02/2026", montant: 14250, statut: "En retard" },
    { id: 9, entreprise: "MININGCO SARL", mois: "Mars 2026", dateEcheance: "31/03/2026", montant: 14250, statut: "Payée", datePaiement: "31/03/2026" },
    { id: 10, entreprise: "MININGCO SARL", mois: "Avril 2026", dateEcheance: "30/04/2026", montant: 14250, statut: "Payée", datePaiement: "29/04/2026" },
    { id: 11, entreprise: "MININGCO SARL", mois: "Mai 2026", dateEcheance: "31/05/2026", montant: 14250, statut: "En retard" },
    { id: 12, entreprise: "MININGCO SARL", mois: "Juin 2026", dateEcheance: "30/06/2026", montant: 14250, statut: "Payée", datePaiement: "28/06/2026" },
    { id: 13, entreprise: "MININGCO SARL", mois: "Juillet 2026", dateEcheance: "31/07/2026", montant: 14250, statut: "En attente" },
  ];
}
function buildReglementsPrestataires() {
  return [
    { id: 1, prestataire: "Clinique Ngaliema", periode: "Semaine du 30/06 au 06/07/2026", montant: 620000, statut: "En attente" },
    { id: 2, prestataire: "Clinique Ngaliema", periode: "Semaine du 23/06 au 29/06/2026", montant: 940000, statut: "Réglé" },
  ];
}

function Finance({ session, setSession, notify, setPage }) {
  const [tab, setTab] = useState("vue360");

  const totalCotisationsEnRetard = session.cotisationsReseau.filter((c) => c.statut === "En retard").reduce((s, c) => s + c.montant, 0);
  const totalCotisationsPayees = session.cotisationsReseau.filter((c) => c.statut === "Payée").reduce((s, c) => s + c.montant, 0);
  const totalReglementsEnAttente = session.pecReseau.filter((p) => p.statutReglement === "En attente").reduce((s, p) => s + p.montant, 0);
  const totalReglementsRegles = session.pecReseau.filter((p) => p.statutReglement === "Réglé").reduce((s, p) => s + p.montant, 0);

  // Blocage automatique : toute entreprise avec une cotisation en retard depuis plus de 3 mois (délai de grâce) voit son compte suspendu
  React.useEffect(() => {
    const entreprisesHorsGrace = new Set(
      session.cotisationsReseau
        .filter((c) => c.statut === "En retard" && c.dateEcheance && moisDeRetard(c.dateEcheance) > DELAI_GRACE_MOIS)
        .map((c) => c.entreprise)
    );
    const misAJour = session.entreprises.map((e) => {
      if (entreprisesHorsGrace.has(e.nom) && e.statut === "Actif") return { ...e, statut: "Suspendu", suspensionAuto: true };
      if (!entreprisesHorsGrace.has(e.nom) && e.statut === "Suspendu" && e.suspensionAuto) return { ...e, statut: "Actif", suspensionAuto: false };
      return e;
    });
    if (JSON.stringify(misAJour) !== JSON.stringify(session.entreprises)) setSession((s) => ({ ...s, entreprises: misAJour }));
    // eslint-disable-next-line
  }, [session.cotisationsReseau]);

  // Diffusion des cotisations vers l'app Entreprise à chaque changement de statut
  React.useEffect(() => { sauvegarderCanal(CLE_COTISATIONS_PARTAGEES, session.cotisationsReseau); }, [session.cotisationsReseau]);

  const payerCotisation = (id) => {
    const maj = session.cotisationsReseau.map((c) => (c.id === id ? { ...c, statut: "Payée", datePaiement: "07/07/2026" } : c));
    setSession({ ...session, cotisationsReseau: maj });
    notify("Cotisation réglée — statut mis à jour automatiquement, compte réactivé");
  };

  return (
    <div>
      <SectionTitle>Finance & règlements réseau</SectionTitle>
      <div className="flex gap-2 mb-4">
        {[["vue360", "Vue d'ensemble", Gauge], ["cotisations", "Cotisations entreprises", Building2], ["reglements", "Règlements prestataires", Stethoscope]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}><Icon size={13} /> {l}</button>
        ))}
      </div>

      {tab === "vue360" && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-5">
            <KpiCard icon={TrendingUp} label="Cotisations collectées" value={fmt(totalCotisationsPayees)} color={C.green} />
            <KpiCard icon={ShieldAlert} label="Cotisations en retard" value={fmt(totalCotisationsEnRetard)} color={totalCotisationsEnRetard > 0 ? C.red : C.green} sub={totalCotisationsEnRetard > 0 ? "Comptes suspendus automatiquement" : "À jour"} />
            <KpiCard icon={CheckCircle2} label="Règlements versés" value={fmt(totalReglementsRegles)} color={C.green} />
            <KpiCard icon={Wallet} label="Règlements dus" value={fmt(totalReglementsEnAttente)} color={totalReglementsEnAttente > 0 ? C.amber : C.green} />
          </div>
          <Card className="p-5 mb-5">
            <SectionTitle>Ratio de sinistralité par entreprise (primes encaissées vs sinistres payés)</SectionTitle>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginBottom: 12 }}>Indicateur actuariel central : un ratio durablement supérieur à 100% signifie que l'entreprise coûte plus cher en soins qu'elle ne rapporte en cotisations.</div>
            {session.entreprises.map((e) => {
              const primesEncaissees = session.cotisationsReseau.filter((c) => c.entreprise === e.nom && c.statut === "Payée").reduce((s, c) => s + c.montant, 0);
              const sinistresPayes = session.sinistres.filter((s) => s.contrat === e.contrat && (s.statut === "Approuvé")).reduce((s, x) => s + x.montant, 0);
              const ratio = primesEncaissees > 0 ? Math.round((sinistresPayes / primesEncaissees) * 100) : (sinistresPayes > 0 ? 999 : 0);
              const couleur = ratio >= 100 ? C.red : ratio >= 70 ? C.amber : C.green;
              return (
                <div key={e.id} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{e.nom}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{fmt(sinistresPayes)} / {fmt(primesEncaissees)}</span>
                      <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: couleur }}>{ratio}%</span>
                    </div>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 7, background: C.line }}><div style={{ width: `${Math.min(100, ratio)}%`, height: "100%", background: couleur }} /></div>
                </div>
              );
            })}
            {session.entreprises.length === 0 && <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune entreprise souscriptrice.</span>}
          </Card>

          <Card className="p-5">
            <SectionTitle>Consommation réseau (tendance)</SectionTitle>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CONSO_RESEAU} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontFamily: sans, fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }} />
                  <Bar dataKey="montant" fill={C.gold} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      {tab === "cotisations" && (
        <>
          <Card className="p-3.5 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
            <CalendarClock size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Un délai de grâce de {DELAI_GRACE_MOIS} mois est accordé après l'échéance avant la suspension automatique du compte entreprise.</span>
          </Card>
          <Table columns={[{ label: "Entreprise" }, { label: "Période" }, { label: "Échéance" }, { label: "Montant", align: "right" }, { label: "Statut", align: "center" }, { label: "Action", align: "right" }]}>
            {session.cotisationsReseau.map((c) => {
              const retard = c.dateEcheance ? moisDeRetard(c.dateEcheance) : 0;
              const horsGrace = c.statut === "En retard" && retard > DELAI_GRACE_MOIS;
              return (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <Td style={{ fontWeight: 700 }}>{c.entreprise}</Td>
                  <Td>{c.mois}</Td>
                  <Td style={{ fontFamily: mono, fontSize: 11.5 }}>{c.dateEcheance || "—"}</Td>
                  <Td align="right" style={{ fontFamily: mono, fontWeight: 700 }}>{fmt(c.montant)}</Td>
                  <Td align="center">
                    <StatusPill statut={c.statut} />
                    {c.statut === "En retard" && <div style={{ fontFamily: sans, fontSize: 9.5, color: horsGrace ? C.red : C.amber, fontWeight: 700, marginTop: 3 }}>{horsGrace ? `Compte suspendu (${retard} mois)` : `Délai de grâce — ${DELAI_GRACE_MOIS - retard} mois restant(s)`}</div>}
                  </Td>
                  <Td align="right">{c.statut === "En retard" && <button onClick={() => payerCotisation(c.id)} className="rounded-lg px-3 py-1.5" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Enregistrer le paiement</button>}</Td>
                </tr>
              );
            })}
          </Table>
        </>
      )}

      {tab === "reglements" && (() => {
        const bordereaux = {};
        session.pecReseau.forEach((p) => {
          if (!bordereaux[p.etablissement]) bordereaux[p.etablissement] = { prestataire: p.etablissement, nbPec: 0, montantTotal: 0, montantRegle: 0, montantEnAttente: 0 };
          const b = bordereaux[p.etablissement];
          b.nbPec++; b.montantTotal += p.montant;
          if (p.statutReglement === "Réglé") b.montantRegle += p.montant; else b.montantEnAttente += p.montant;
        });
        const liste = Object.values(bordereaux);
        return (
          <>
            <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
              <ReceiptText size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Synthèse comptable par prestataire, calculée en temps réel à partir des PEC du réseau. Le règlement d'une PEC individuelle (avec vérification du sinistre associé) se fait dans <b>PEC & Règlements Prestataires</b> — cette vue sert au suivi global, pas au paiement direct.</span>
            </Card>
            <Table columns={[{ label: "Prestataire" }, { label: "Nb. PEC", align: "center" }, { label: "Montant total", align: "right" }, { label: "Réglé", align: "right" }, { label: "En attente", align: "right" }, { label: "" }]}>
              {liste.map((b) => (
                <tr key={b.prestataire} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <Td style={{ fontWeight: 700 }}>{b.prestataire}</Td>
                  <Td align="center">{b.nbPec}</Td>
                  <Td align="right" style={{ fontFamily: mono, fontWeight: 700 }}>{fmt(b.montantTotal)}</Td>
                  <Td align="right" style={{ fontFamily: mono, color: C.green }}>{fmt(b.montantRegle)}</Td>
                  <Td align="right" style={{ fontFamily: mono, color: b.montantEnAttente > 0 ? C.amber : C.sub, fontWeight: b.montantEnAttente > 0 ? 700 : 400 }}>{fmt(b.montantEnAttente)}</Td>
                  <Td align="right"><button onClick={() => setPage("pec")} style={{ fontFamily: sans, fontSize: 11, color: C.navy2, fontWeight: 700 }}>Voir dans PEC & Règlements →</button></Td>
                </tr>
              ))}
              {liste.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune PEC synchronisée pour l'instant — allez dans « PEC & Règlements Prestataires » pour synchroniser depuis le réseau.</td></tr>}
            </Table>
          </>
        );
      })()}
    </div>
  );
}

/* =================================================================
   PEC & RÈGLEMENTS PRESTATAIRES — vue réseau croisée, paiement en ligne
   avec retour automatique de bordereau vers l'app Prestataire
================================================================= */
function PecReglements({ session, setSession, notify }) {
  const [syncing, setSyncing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState("Toutes");
  const [filtrePrestataire, setFiltrePrestataire] = useState("Tous");
  const [selection, setSelection] = useState(null);
  const [methode, setMethode] = useState(null);

  const synchroniser = async () => {
    setSyncing(true);
    const distant = await chargerCanal(CLE_PEC_PARTAGEES);
    setSession((s) => {
      // Chaque PEC directe constitue un sinistre — on matérialise automatiquement le dossier de validation
      // interne (Agent → Superviseur → Finance) associé à toute PEC pas encore reliée à un sinistre.
      // Les actes "zéro bon" sont pris en charge à 100% sans validation — pas de sinistre fantôme pour eux.
      const nouveauxSinistres = distant
        .filter((p) => !p.isZeroBon && !s.sinistres.some((sin) => sin.pecUid === p.uid))
        .map((p) => ({
          id: Date.now() + Math.random(), numero: `SIN-2026-${String(Math.floor(10000 + Math.random() * 90000))}`,
          pecUid: p.uid, patient: p.patientNom, contrat: p.patientContrat, type: "PEC directe",
          montant: p.montant, dateSoumission: p.date, documents: [], statut: "En attente", etape: "Agent",
          scoreFraude: Math.floor(Math.random() * 30), historique: [],
        }));
      return { ...s, pecReseau: distant, sinistres: [...nouveauxSinistres, ...s.sinistres] };
    });
    setSyncing(false);
    notify("PEC synchronisées depuis les établissements du réseau — sinistres associés créés");
  };
  React.useEffect(() => { synchroniser(); }, []);

  const liste = session.pecReseau.filter((p) =>
    (filtreStatut === "Toutes" || p.statutReglement === filtreStatut) &&
    (filtrePrestataire === "Tous" || p.etablissement === filtrePrestataire)
  );
  const pec = session.pecReseau.find((p) => p.uid === selection);
  const prestatairesListe = [...new Set(session.pecReseau.map((p) => p.etablissement))];
  const sinistreLie = pec ? session.sinistres.find((s) => s.pecUid === pec.uid) : null;
  const sinistreValide = pec?.isZeroBon || sinistreLie?.statut === "Approuvé";

  const payerEnLigne = async (m) => {
    const numeroBordereau = `BDR-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateReglement = "07/07/2026";
    const nouvelleListe = session.pecReseau.map((p) => (p.uid === pec.uid ? { ...p, statutReglement: "Réglé", numeroBordereau, dateReglement, modePaiement: m } : p));
    setSession((s) => ({ ...s, pecReseau: nouvelleListe, journal: [{ id: Date.now(), utilisateur: "Responsable financier", action: `Règlement en ligne (${m}) — ${fmt(pec.montant)} versés à ${pec.etablissement} pour ${pec.patientNom} — bordereau ${numeroBordereau}`, date: `${dateReglement} ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` }, ...s.journal] }));
    await sauvegarderCanal(CLE_PEC_PARTAGEES, nouvelleListe);
    notify(`Paiement effectué — bordereau ${numeroBordereau} transmis automatiquement à ${pec.etablissement}`);
    setMethode(null);
  };

  if (pec) {
    return (
      <Card className="p-5">
        <button onClick={() => { setSelection(null); setMethode(null); }} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour à la liste</button>
        <div className="flex items-center justify-between mb-4">
          <div><div style={{ fontFamily: serif, fontSize: 17, color: C.navy, fontWeight: 700 }}>{pec.patientNom}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{pec.etablissement} — {pec.type}</div></div>
          <div className="flex items-center gap-2">{pec.isZeroBon && <span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.green, background: "#EAF6EF", padding: "2px 8px", borderRadius: 999 }}>ZÉRO BON</span>}<StatusPill statut={pec.statutReglement} /></div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Date & heure</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 700 }}>{pec.date} à {pec.heure || "—"}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>N° bon / PEC</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.ink, fontWeight: 700 }}>{pec.numeroBon || pec.uid}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Acte médical</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 700 }}>{pec.acteCode} — {pec.acteLibelle}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Garantie</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 700 }}>{pec.garantie}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Police / Contrat</div><div style={{ fontFamily: mono, fontSize: 12, color: C.ink, fontWeight: 700 }}>{pec.patientPolice} / {pec.patientContrat}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Souscripteur</div><div style={{ fontFamily: sans, fontSize: 12, color: C.ink, fontWeight: 700 }}>{pec.patientSouscripteur}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Diagnostic</div><div style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{pec.diagnostic || "—"}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Montant total</div><div style={{ fontFamily: mono, fontSize: 15, color: C.navy, fontWeight: 700 }}>{fmt(pec.montant)}</div></div>
          {pec.surplusPatient > 0 && <div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Réglé directement par le patient</div><div style={{ fontFamily: mono, fontSize: 12.5, color: C.amber, fontWeight: 700 }}>{fmt(pec.surplusPatient)}</div></div>}
        </div>

        {pec.vent && (
          <Card className="p-4 mb-5" style={{ background: C.ivory, border: "none" }}>
            <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Ventilation de la cascade de paiement</div>
            {Object.entries(pec.vent).filter(([, v]) => v > 0).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink, textTransform: "capitalize" }}>{k}</span><span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.gold }}>{fmt(v)}</span></div>
            ))}
          </Card>
        )}

        {sinistreLie && (
          <Card className="p-4 mb-5 flex items-center justify-between" style={{ background: sinistreValide ? "#EAF6EF" : C.ivory, border: "none" }}>
            <div className="flex items-center gap-2.5">
              {sinistreValide ? <ClipboardCheck size={16} color={C.green} /> : <FileWarning size={16} color={C.amber} />}
              <div>
                <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: sinistreValide ? C.green : C.amber }}>Sinistre {sinistreLie.numero} — {sinistreLie.statut}{pec.isZeroBon ? " (zéro bon, validation automatique)" : ` — étape ${sinistreLie.etape}`}</div>
                <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Le règlement d'une PEC directe nécessite la validation préalable de son sinistre associé.</div>
              </div>
            </div>
            {!sinistreValide && <button onClick={() => notify("Rendez-vous dans le module Sinistres pour instruire ce dossier")} className="rounded-lg px-3 py-1.5 flex-shrink-0" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy2 }}>Voir dans Sinistres</button>}
          </Card>
        )}

        {pec.statutReglement === "Réglé" ? (
          <Card className="p-4 flex items-center gap-3" style={{ background: "#EAF6EF", border: "none" }}>
            <FileCheck size={18} color={C.green} />
            <div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.green }}>Bordereau {pec.numeroBordereau} — réglé le {pec.dateReglement} ({pec.modePaiement})</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Le reçu a été transmis automatiquement à l'app du prestataire et journalisé.</div></div>
          </Card>
        ) : !sinistreValide ? (
          <button disabled className="rounded-xl px-5 py-2.5 flex items-center gap-2" style={{ background: "#C9CDD6", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Lock size={14} /> Paiement verrouillé — sinistre non validé</button>
        ) : !methode ? (
          <button onClick={() => setMethode("choix")} className="rounded-xl px-5 py-2.5 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><CreditCard size={14} /> Payer en ligne</button>
        ) : (
          <Card className="p-4" style={{ maxWidth: 420 }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Choisir le mode de règlement</div>
            <div className="grid grid-cols-3 gap-2">
              {["Mobile Money", "Virement bancaire", "Carte"].map((m) => (
                <button key={m} onClick={() => payerEnLigne(m)} className="rounded-xl p-3 flex flex-col items-center gap-1.5" style={{ border: `1px solid ${C.line}` }}>
                  {m === "Mobile Money" ? <Smartphone size={16} color={C.navy2} /> : m === "Carte" ? <CreditCard size={16} color={C.navy2} /> : <Landmark size={16} color={C.navy2} />}
                  <span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.ink }}>{m}</span>
                </button>
              ))}
            </div>
          </Card>
        )}
      </Card>
    );
  }

  const enAttente = session.pecReseau.filter((p) => p.statutReglement === "En attente").reduce((s, p) => s + p.montant, 0);
  const regles = session.pecReseau.filter((p) => p.statutReglement === "Réglé").reduce((s, p) => s + p.montant, 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <KpiCard label="PEC reçues du réseau" value={session.pecReseau.length} icon={ReceiptText} />
        <KpiCard label="En attente de règlement" value={fmt(enAttente)} icon={Clock3} color={C.amber} />
        <KpiCard label="Réglées" value={fmt(regles)} icon={CheckCircle2} color={C.green} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={synchroniser} disabled={syncing} className="rounded-xl px-4 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncing ? "Synchronisation…" : "Synchroniser depuis le réseau"}</button>
        <select style={{ ...inputStyle, width: 200 }} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}><option>Toutes</option><option>En attente</option><option>Réglé</option></select>
        <select style={{ ...inputStyle, width: 220 }} value={filtrePrestataire} onChange={(e) => setFiltrePrestataire(e.target.value)}><option>Tous</option>{prestatairesListe.map((p) => <option key={p}>{p}</option>)}</select>
      </div>

      {liste.length === 0 && <Card className="p-8 text-center"><ReceiptText size={22} color={C.sub} style={{ margin: "0 auto 8px" }} /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Aucune PEC transmise par le réseau pour l'instant. Cliquez sur « Synchroniser » après une soumission côté prestataire.</span></Card>}

      <Table columns={[{ label: "Patient" }, { label: "Établissement" }, { label: "Acte" }, { label: "Date / heure" }, { label: "Montant" }, { label: "Statut", align: "center" }, { label: "" }]}>
        {liste.map((p) => (
          <tr key={p.uid} onClick={() => setSelection(p.uid)} className="cursor-pointer" style={{ borderTop: `1px solid ${C.line}` }}>
            <Td>{p.patientNom}</Td>
            <Td>{p.etablissement}</Td>
            <Td>{p.acteCode}</Td>
            <Td>{p.date} {p.heure}</Td>
            <Td><span style={{ fontFamily: mono, fontWeight: 700 }}>{fmt(p.montant)}</span></Td>
            <Td><StatusPill statut={p.statutReglement} /></Td>
            <Td><ChevronRight size={13} color={C.sub} /></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

/* =================================================================
   ÉQUIPE INTERNE — rôles & journal d'activité
================================================================= */
function EquipeInterne({ session, setSession, notify }) {
  const [addOpen, setAddOpen] = useState(false);
  const [nouv, setNouv] = useState({ nom: "", role: "Médecin conseil", email: "", telephone: "", dateEntree: "", departement: "", niveauAcces: "Standard" });
  const [tentative, setTentative] = useState(false);

  const ajouter = () => {
    setTentative(true);
    if (!nouv.nom || !nouv.email || !nouv.telephone) return;
    setSession({ ...session, equipeInterne: [{ id: Date.now(), ...nouv, statut: "Actif" }, ...session.equipeInterne], journal: [{ id: Date.now(), utilisateur: "Administrateur", action: `${nouv.nom} ajouté(e) à l'équipe (${nouv.role})`, date: "07/07/2026 10:00" }, ...session.journal] });
    setNouv({ nom: "", role: "Médecin conseil", email: "", telephone: "", dateEntree: "", departement: "", niveauAcces: "Standard" });
    setTentative(false);
    setAddOpen(false);
    notify(`${nouv.nom} ajouté(e) à l'équipe interne`);
  };
  const retirer = (id) => {
    const m = session.equipeInterne.find((x) => x.id === id);
    setSession({ ...session, equipeInterne: session.equipeInterne.filter((x) => x.id !== id), journal: [{ id: Date.now(), utilisateur: "Administrateur", action: `${m?.nom} retiré(e) de l'équipe`, date: "07/07/2026 10:05" }, ...session.journal] });
    notify("Membre retiré");
  };
  const err = (v) => (tentative && !v ? { border: `1px solid ${C.red}` } : {});

  return (
    <div>
      <SectionTitle action={<button onClick={() => setAddOpen(true)} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter un membre</button>}>Équipe interne & rôles</SectionTitle>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 10 }}>Rôles disponibles</div>
          <div className="space-y-2 mb-5">
            {ROLES_ASSUREUR.map((r) => (
              <Card key={r.id} className="p-3.5 flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, background: C.ivory }}><UserCog size={15} color={C.navy2} /></div>
                <div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{r.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{r.permissions}</div></div>
              </Card>
            ))}
          </div>

          {addOpen && (
            <Card className="p-4 space-y-2 mb-4">
              <input style={{ ...inputStyle, ...err(nouv.nom) }} placeholder="Nom complet *" value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} />
              <select style={inputStyle} value={nouv.role} onChange={(e) => setNouv({ ...nouv, role: e.target.value })}>{ROLES_ASSUREUR.map((r) => <option key={r.id}>{r.nom}</option>)}</select>
              <Field label="Département / service"><input style={inputStyle} placeholder="Ex : Médical, RH, Finance" value={nouv.departement} onChange={(e) => setNouv({ ...nouv, departement: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <input style={{ ...inputStyle, ...err(nouv.email) }} type="email" placeholder="Email professionnel *" value={nouv.email} onChange={(e) => setNouv({ ...nouv, email: e.target.value })} />
                <input style={{ ...inputStyle, ...err(nouv.telephone) }} placeholder="Téléphone *" value={nouv.telephone} onChange={(e) => setNouv({ ...nouv, telephone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Date d'entrée"><input type="date" style={inputStyle} value={nouv.dateEntree} onChange={(e) => setNouv({ ...nouv, dateEntree: e.target.value })} /></Field>
                <Field label="Niveau d'accès"><select style={inputStyle} value={nouv.niveauAcces} onChange={(e) => setNouv({ ...nouv, niveauAcces: e.target.value })}><option>Standard</option><option>Étendu</option><option>Administrateur</option></select></Field>
              </div>
              <div className="flex gap-2"><button onClick={() => setAddOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button><button onClick={ajouter} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter</button></div>
            </Card>
          )}

          <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 10 }}>Membres ({session.equipeInterne.length})</div>
          <div className="space-y-2">
            {session.equipeInterne.map((m) => (
              <Card key={m.id} className="p-3 flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: C.ivory }}><Users2 size={14} color={C.navy2} /></div>
                <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{m.nom}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{m.role} · {m.email}</div></div>
                <button onClick={() => retirer(m.id)}><Trash2 size={14} color={C.red} /></button>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 10 }}>Journal d'activité (audit)</div>
          <div className="space-y-2">
            {session.journal.length === 0 && <Card className="p-4"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Aucune activité enregistrée.</span></Card>}
            {session.journal.map((j) => (
              <Card key={j.id} className="p-3 flex items-start gap-2">
                <ScrollText size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
                <div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}><b>{j.utilisateur}</b> — {j.action}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{j.date}</div></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   PARAMÈTRES
================================================================= */
function Parametres({ session, setSession, notify, onLogout }) {
  const [tab, setTab] = useState("general");
  const [config, setConfig] = useState(session.configSysteme);

  const enregistrerConfig = () => {
    setSession({ ...session, configSysteme: config });
    notify("Paramètres système enregistrés");
  };
  const toggleSecu = (cle) => {
    const c = { ...session.configSysteme.securite, [cle]: !session.configSysteme.securite[cle] };
    setSession({ ...session, configSysteme: { ...session.configSysteme, securite: c } });
    setConfig({ ...config, securite: c });
  };
  const lancerSauvegarde = () => {
    setSession({ ...session, configSysteme: { ...session.configSysteme, derniereSauvegarde: "07/07/2026 06:00" }, journal: [{ id: Date.now(), utilisateur: "Système", action: "Sauvegarde manuelle déclenchée et chiffrée", date: "07/07/2026 " + new Date().toLocaleTimeString("fr-FR") }, ...session.journal] });
    notify("Sauvegarde chiffrée effectuée et stockée");
  };

  return (
    <div>
      <SectionTitle>Administration système</SectionTitle>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[["general", "Paramétrage général", Sliders], ["securite", "Sécurité", ShieldCheck], ["logs", "Logs & audits", ScrollText], ["sauvegardes", "Sauvegardes & données", HardDrive], ["compte", "Mon compte", UserCog]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-xl px-3.5 py-2.5 flex items-center gap-2" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Icon size={13} /> {l}</button>
        ))}
      </div>

      {tab === "general" && (
        <Card className="p-5" style={{ maxWidth: 560 }}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom du réseau"><input style={inputStyle} value={config.nomReseau} onChange={(e) => setConfig({ ...config, nomReseau: e.target.value })} /></Field>
            <Field label="Fuseau horaire"><select style={inputStyle} value={config.fuseauHoraire} onChange={(e) => setConfig({ ...config, fuseauHoraire: e.target.value })}><option>Afrique/Kinshasa (UTC+1)</option><option>Afrique/Lubumbashi (UTC+2)</option></select></Field>
            <Field label="Délai de grâce cotisations (mois)"><input style={inputStyle} value={config.delaiGrace} onChange={(e) => setConfig({ ...config, delaiGrace: e.target.value.replace(/\D/g, "") })} /></Field>
            <Field label="Seuil d'alerte plafond (%)"><input style={inputStyle} value={config.seuilAlertePlafond} onChange={(e) => setConfig({ ...config, seuilAlertePlafond: e.target.value.replace(/\D/g, "") })} /></Field>
          </div>
          <button onClick={enregistrerConfig} className="rounded-xl px-5 py-2.5 mt-4 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Check size={14} /> Enregistrer</button>
        </Card>
      )}

      {tab === "securite" && (
        <Card className="p-5" style={{ maxWidth: 560 }}>
          <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Politique de mot de passe</div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <Field label="Longueur minimale"><input style={inputStyle} value={config.securite?.longueurMin || session.configSysteme.securite.longueurMin} onChange={(e) => setConfig({ ...config, securite: { ...config.securite, longueurMin: e.target.value.replace(/\D/g, "") } })} /></Field>
            <Field label="Expiration (jours)"><input style={inputStyle} value={config.securite?.expirationJours || session.configSysteme.securite.expirationJours} onChange={(e) => setConfig({ ...config, securite: { ...config.securite, expirationJours: e.target.value.replace(/\D/g, "") } })} /></Field>
          </div>
          <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Contrôles d'accès</div>
          <div className="space-y-3">
            {[["mfa", "Authentification multi-facteurs (MFA)"], ["complexiteMdp", "Exiger un mot de passe complexe"], ["blocageIpSuspecte", "Blocage automatique des IP suspectes"]].map(([cle, label]) => (
              <div key={cle} className="flex items-center justify-between">
                <span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{label}</span>
                <button onClick={() => toggleSecu(cle)} className="rounded-full" style={{ width: 40, height: 24, background: session.configSysteme.securite[cle] ? C.green : C.line, position: "relative" }}>
                  <div style={{ position: "absolute", top: 3, left: session.configSysteme.securite[cle] ? 19 : 3, width: 18, height: 18, borderRadius: 999, background: "white" }} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "logs" && (
        <>
          <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
            <ScrollText size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Journalisation complète des actions critiques du réseau pour audit interne ou réglementaire.</span>
          </Card>
          <Table columns={[{ label: "Utilisateur" }, { label: "Action" }, { label: "Date" }]}>
            {session.journal.map((j) => (
              <tr key={j.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                <Td style={{ fontWeight: 700 }}>{j.utilisateur}</Td>
                <Td>{j.action}</Td>
                <Td style={{ fontFamily: mono, color: C.sub }}>{j.date}</Td>
              </tr>
            ))}
          </Table>
        </>
      )}

      {tab === "sauvegardes" && (
        <Card className="p-5" style={{ maxWidth: 560 }}>
          <div className="flex items-center gap-2 mb-2"><HardDrive size={16} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>Sauvegardes automatiques</span></div>
          <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, marginBottom: 16 }}>Dernière sauvegarde : {session.configSysteme.derniereSauvegarde} — chiffrée et stockée sur serveurs sécurisés.</div>
          <Field label="Fréquence"><select style={inputStyle} value={config.frequenceSauvegarde} onChange={(e) => setConfig({ ...config, frequenceSauvegarde: e.target.value })}><option>Quotidienne</option><option>Hebdomadaire</option></select></Field>
          <div className="flex gap-2 mt-4">
            <button onClick={lancerSauvegarde} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><CloudUpload size={14} /> Lancer une sauvegarde</button>
            <button onClick={() => notify("Restauration de la dernière sauvegarde lancée")} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontWeight: 700, fontSize: 12.5, color: C.ink }}><ArchiveRestore size={14} /> Restaurer</button>
          </div>
          <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Import / Export de données</div>
            <div className="flex gap-2">
              <button onClick={() => notify("Export généré (CSV)")} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}><Download size={13} /> Exporter (CSV/XLSX/JSON)</button>
              <button onClick={() => notify("Fichier d'import validé et traité")} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}><UploadCloud size={13} /> Importer des données</button>
            </div>
          </div>
        </Card>
      )}

      {tab === "compte" && (
        <Card className="p-5" style={{ maxWidth: 480 }}>
          <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>NeoGTec HealthCare — Back-office Assureur</div>
          <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, marginTop: 2 }}>Version 1.0.0 — Environnement de démonstration</div>
          <div className="mt-4 pt-4 space-y-2" style={{ borderTop: `1px solid ${C.line}` }}>
            {["Mentions légales", "Politique de confidentialité", "Conditions du réseau conventionné"].map((t) => (
              <button key={t} className="w-full flex items-center justify-between py-2">
                <span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{t}</span><ChevronRight size={14} color={C.sub} />
              </button>
            ))}
          </div>
          <button onClick={onLogout} className="w-full rounded-xl py-3 mt-4 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><LogOut size={15} /> Se déconnecter</button>
        </Card>
      )}
    </div>
  );
}

/* =================================================================
   APP SHELL — layout desktop (sidebar + header)
================================================================= */
export default function App() {
  const [connecte, setConnecte] = useState(false);
  const [roleUtilisateur, setRoleUtilisateur] = useState("administrateur");
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = (m) => setToast(m);

  const [session, setSession] = useState({
    entreprises: buildEntreprises(),
    prestataires: buildPrestataires(),
    assuresIndividuels: buildAssuresIndividuels(),
    prospects: buildProspects(),
    courtiers: buildCourtiers(),
    commissionsConfig: buildCommissionsConfig(),
    reassuranceConfig: { seuilCession: 300000, tauxCession: 60, reassureur: "Africa Reinsurance Corporation (Africa Re)" },
    cessionsReassurance: {},
    equipeInterne: buildEquipeInterne(),
    journal: [
      { id: 1, utilisateur: "Système", action: "Réseau initialisé — 1 entreprise, 1 prestataire, 1 assuré individuel", date: "01/01/2026 08:00" },
    ],
    derogationsReseau: [],
    teleconsultationsReseau: [],
    pecReseau: [],
    tarifsReseau: {},
    alertesTarifs: [],
    surprimesEnAttente: [],
    cotisationsReseau: buildCotisationsReseau(),
    reglementsPrestataires: buildReglementsPrestataires(),
    catalogueMaitre: CATALOGUE_MAITRE.map((a) => ({ ...a })),
    gradesMaitre: GRADES_MAITRE.map((g) => ({ ...g })),
    accordsGrades: [],
    plafondsEntreprise: {},
    plafondsAssures: {},
    baremeAssures: {},
    cascadeMaitre: CASCADE_MAITRE.map((c) => ({ ...c })),
    contrats: buildContrats(),
    sinistres: buildSinistres(),
    messagesPrevention: buildMessagesPrevention(),
    configSysteme: {
      nomReseau: "NeoGTec HealthCare", fuseauHoraire: "Afrique/Kinshasa (UTC+1)", delaiGrace: "3", seuilAlertePlafond: "80",
      securite: { mfa: false, complexiteMdp: true, blocageIpSuspecte: true, longueurMin: "8", expirationJours: "90" },
      derniereSauvegarde: "07/07/2026 06:00", frequenceSauvegarde: "Quotidienne",
    },
  });

  if (!connecte) return <Connexion onDone={(role) => { setRoleUtilisateur(role); setConnecte(true); }} />;

  const nav = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "comptes", label: "Comptes réseau", icon: Users },
    { id: "contrats", label: "Contrats", icon: FileSignature },
    { id: "sinistres", label: "Sinistres", icon: ClipboardCheck },
    { id: "referentiel", label: "Référentiel", icon: Database },
    { id: "derogations", label: "Dérogations", icon: FileWarning },
    { id: "finance", label: "Finance & règlements", icon: Wallet },
    { id: "pec", label: "PEC & Règlements Prestataires", icon: ReceiptText },
    { id: "teleconsultations", label: "Téléconsultations", icon: Video },
    { id: "crm", label: "CRM commercial", icon: Target },
    { id: "messagerie", label: "Messagerie interne", icon: MessageCircle },
    { id: "controle", label: "Contrôle & communication", icon: Radar },
    { id: "equipe", label: "Équipe interne", icon: UserCog },
    { id: "reassurance", label: "Réassurance", icon: Shield },
    { id: "diagnostic", label: "Diagnostic réseau", icon: ShieldCheck },
    { id: "parametres", label: "Administration", icon: Settings },
  ];
  const titres = { dashboard: "Tableau de bord", crm: "CRM commercial", comptes: "Comptes réseau", contrats: "Contrats", sinistres: "Sinistres", referentiel: "Référentiel", derogations: "Dérogations", finance: "Finance & règlements", pec: "PEC & Règlements Prestataires", teleconsultations: "Téléconsultations", messagerie: "Messagerie interne", controle: "Contrôle & communication", equipe: "Équipe interne", reassurance: "Réassurance", parametres: "Administration système" };
  const derogEnAttente = session.derogationsReseau.filter((d) => d.statut === "En attente").length;

  return (
    <div className="flex h-screen max-h-screen overflow-hidden" style={{ background: C.bg, fontFamily: sans }}>
      <style>{`@keyframes riseIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }`}</style>

      {/* SIDEBAR FLOOTTANTE & RETRACTABLE */}
      <div 
        className="flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out my-3 ml-3 rounded-2xl shadow-xl border border-[#1B4A34] z-30 justify-between p-3 sticky top-3 h-[calc(100vh-24px)]" 
        style={{ width: sidebarCollapsed ? 72 : 250, background: C.navy, color: "white" }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 py-2 border-b border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 34, height: 34, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}>
                <Network size={17} color={C.gold} />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 11.5, letterSpacing: 1, whiteSpace: "nowrap" }}>NEOGTEC HEALTHCARE</div>
                  <div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6" }}>Back-office Assureur</div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title={sidebarCollapsed ? "Afficher le menu" : "Masquer le menu"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          <nav className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {!sidebarCollapsed && (
              <p className="text-[10px] font-bold text-[#C6992E] uppercase tracking-wider px-2 mb-2">Navigation Assureur</p>
            )}
            {nav.map((n) => (
              <button 
                key={n.id} 
                onClick={() => setPage(n.id)} 
                title={sidebarCollapsed ? n.label : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'} rounded-xl relative transition-all cursor-pointer`}
                style={{ background: page === n.id ? "rgba(198,153,46,0.15)" : "transparent", color: page === n.id ? C.gold : "#D7DCE6" }}
              >
                <n.icon size={18} className="flex-shrink-0" />
                {!sidebarCollapsed && <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: page === n.id ? 700 : 500, whiteSpace: "nowrap" }}>{n.label}</span>}
                {n.id === "derogations" && derogEnAttente > 0 && (
                  <span className={`absolute rounded-full flex items-center justify-center ${sidebarCollapsed ? 'top-1 right-1' : 'right-2.5'}`} style={{ width: 17, height: 17, background: C.red, fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: "white" }}>{derogEnAttente}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className={`p-2.5 bg-[#1B4A34]/40 border border-[#2F8A5B]/30 rounded-xl ${sidebarCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 12 }}>GN</div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0"><div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: "white" }}>{ROLES_ASSUREUR.find((r) => r.id === roleUtilisateur)?.nom}</div><div style={{ fontFamily: sans, fontSize: 9.5, color: "#B9C3D6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>NeoGTec HealthCare</div></div>
            )}
            <button onClick={() => setConnecte(false)} title="Déconnexion"><LogOut size={15} color="#B9C3D6" /></button>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ minWidth: 0 }}>
        <div className="flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-20" style={{ height: 68, background: C.panel, borderBottom: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>{titres[page]}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: C.greenSoft }}>
              <div className="rounded-full" style={{ width: 7, height: 7, background: C.green }} />
              <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.green }}>Réseau connecté</span>
            </div>
            <button className="relative"><Bell size={18} color={C.navy} />{derogEnAttente > 0 && <span className="absolute rounded-full" style={{ top: -2, right: -2, width: 8, height: 8, background: C.red }} />}</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {page === "dashboard" && <TableauDeBord session={session} setSession={setSession} setPage={setPage} roleUtilisateur={roleUtilisateur} notify={notify} />}
          {page === "crm" && <CRM session={session} setSession={setSession} notify={notify} setPage={setPage} />}
          {page === "comptes" && <Comptes session={session} setSession={setSession} notify={notify} />}
          {page === "contrats" && <Contrats session={session} setSession={setSession} notify={notify} />}
          {page === "sinistres" && <Sinistres session={session} setSession={setSession} notify={notify} />}
          {page === "referentiel" && <Referentiel session={session} setSession={setSession} notify={notify} />}
          {page === "derogations" && <DerogationsReseau session={session} setSession={setSession} notify={notify} />}
          {page === "finance" && <Finance session={session} setSession={setSession} notify={notify} setPage={setPage} />}
          {page === "pec" && <PecReglements session={session} setSession={setSession} notify={notify} />}
          {page === "teleconsultations" && <TeleconsultationsReseau session={session} setSession={setSession} notify={notify} />}
          {page === "messagerie" && <MessagerieInterne session={session} setSession={setSession} notify={notify} />}
          {page === "controle" && <ControleCommunication session={session} setSession={setSession} notify={notify} />}
          {page === "equipe" && <EquipeInterne session={session} setSession={setSession} notify={notify} />}
          {page === "reassurance" && <Reassurance session={session} setSession={setSession} notify={notify} />}
          {page === "diagnostic" && <DiagnosticCoherence session={session} notify={notify} />}
          {page === "parametres" && <Parametres session={session} setSession={setSession} notify={notify} onLogout={() => setConnecte(false)} />}
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
/* =================================================================
   CONTRATS — création personnalisée & gestion des polices existantes
================================================================= */
function buildContrats() {
  return [
    { id: 1, numero: "CTR-SP-2026-000482", type: "Familiale", client: "MUKENDI Jean-Paul", dateActivation: "01/07/2025", dateExpiration: "30/06/2027", statut: "Actif", plafondGlobal: 8000000, franchise: 0, exclusions: "Chirurgie esthétique, Cures thermales", beneficiaires: 5,
      versions: [{ version: 1, date: "01/02/2026", auteur: "Système", note: "Création initiale du contrat" }] },
    { id: 2, numero: "CTR-ENT-2026-778213", type: "Entreprise", client: "MININGCO SARL", dateActivation: "01/07/2025", dateExpiration: "30/06/2027", statut: "Actif", plafondGlobal: 25000000, franchise: 0, exclusions: "Actes non conventionnés", beneficiaires: 6,
      versions: [{ version: 1, date: "01/01/2026", auteur: "Système", note: "Création initiale du contrat" }] },
  ];
}
// Surprime santé — questionnaire médical déclaratif, applicable individuellement au souscripteur et à chaque ayant droit.
// Reflète le principe actuariel de base : un risque aggravé déclaré justifie une prime individuelle plus élevée.
const CONDITIONS_SANTE = [
  { id: "diabete", label: "Diabète (type 1 ou 2)", surprimePct: 15 },
  { id: "hta", label: "Hypertension artérielle", surprimePct: 10 },
  { id: "vih", label: "VIH / SIDA", surprimePct: 20 },
  { id: "cardiaque", label: "Maladie cardiaque", surprimePct: 25 },
  { id: "renale", label: "Insuffisance rénale", surprimePct: 20 },
  { id: "respiratoire", label: "Maladie respiratoire chronique (asthme sévère, BPCO)", surprimePct: 12 },
];
function ageDepuisNaissance(dateNaissanceStr) {
  if (!dateNaissanceStr) return null;
  const [a, m, j] = dateNaissanceStr.split("-").map(Number); // input type=date -> YYYY-MM-DD
  if (!a) return null;
  const naissance = new Date(a, m - 1, j);
  let age = AUJOURDHUI.getFullYear() - naissance.getFullYear();
  if (AUJOURDHUI < new Date(AUJOURDHUI.getFullYear(), naissance.getMonth(), naissance.getDate())) age -= 1;
  return age;
}
function calculerSurprime(conditionsIds, dateNaissanceStr) {
  const surprimeConditions = (conditionsIds || []).reduce((s, id) => s + (CONDITIONS_SANTE.find((c) => c.id === id)?.surprimePct || 0), 0);
  const age = ageDepuisNaissance(dateNaissanceStr);
  const surprimeAge = age != null && age >= 60 ? 15 : age != null && age >= 50 ? 8 : 0;
  return { surprimeConditions, surprimeAge, surprimeTotal: surprimeConditions + surprimeAge, age };
}

const MODELES_CONTRAT = {
  Individuelle: { plafondGlobal: 3000000, franchise: 0, exclusions: "Chirurgie esthétique, Cures thermales, Actes non conventionnés" },
  Familiale: { plafondGlobal: 8000000, franchise: 0, exclusions: "Chirurgie esthétique, Cures thermales" },
  Entreprise: { plafondGlobal: 25000000, franchise: 0, exclusions: "Actes non conventionnés" },
};
const LISANGA_BAREME = [
  { cat: "Soins de santé primaires (jusqu'à 5 épisodes/an, 50% dès le 6ᵉ épisode)", items: [
    ["Consultation générale, examens courants (sang, selles, urines, frottis) et médicaments génériques", "90%", "10%", "Ex : paludisme simple 25$ → 22,5$ / 2,5$"],
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
    ["Chambre commune ≤10 jours, tournée médecin généraliste/spécialiste, soins infirmiers, labo, médicaments", "90%", "10%", "Ex : paludisme grave 100$ → 90$ / 10$"],
  ]},
  { cat: "Imagerie médicale", items: [
    ["Radiologie de routine (membres, colonne, abdomen, thorax, sinus)", "90%", "10%", "Ex : thorax 20$ → 18$ / 2$"],
    ["Radiologie spécialisée (OED, lavement baryté, UIV)", "60%", "40%", "Ex : lavement baryté 150$ → 90$ / 60$"],
    ["Échographie ordinaire (pelvienne, abdominale, masse)", "90%", "10%", "Ex : écho pelvienne 20$ → 18$ / 2$"],
    ["Échographie spécialisée (Doppler)", "60%", "40%", "Ex : Doppler 100$ → 60$ / 40$"],
    ["Mammographie, thyroïdienne, oculaire, vésico-prostatique, EEG, ECG, CT Scanner cérébral", "60%", "40%", "Ex : CT cérébral 180$ → 108$ / 72$"],
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
    ["Hypertension, diabète, asthme, ulcère gastroduodénal, arthrite, épilepsie, angine de poitrine, counseling", "90%", "10%", ""],
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
  { cat: "Soins de santé primaires (illimité)", items: [
    ["Consultation générale, examens courants et médicaments génériques", "80%", "20%", "Ex : paludisme simple 15$ → 12$ / 3$"],
  ]},
  { cat: "Consultations spécialisées (6 consultations/an)", items: [
    ["Médecine interne, Gynécologie, Pédiatrie, Cardiologie, ORL, Dermatologie", "80%", "20%", "Ex : cardiologie 25$ → 20$ / 5$"],
  ]},
  { cat: "Examens de laboratoire", items: [
    ["Analyses courantes (NFS, glycémie, selles, urines)", "80%", "20%", "Ex : bilan courant 15$ → 12$ / 3$"],
    ["Analyses spécialisées (hormonaux, sérologies, marqueurs)", "50%", "50%", "Ex : bilan thyroïdien 25$ → 12,5$ / 12,5$"],
  ]},
  { cat: "Imagerie médicale", items: [
    ["Radiologie et échographie de routine", "70%", "30%", "Ex : radio thorax 15$ → 10,5$ / 4,5$"],
    ["Imagerie lourde (scanner, IRM)", "Non couvert", "100%", ""],
  ]},
  { cat: "Hospitalisation (chambre commune, 15 jours/an)", items: [
    ["Séjour, soins infirmiers, médicaments, tournée médicale", "90%", "10%", "Ex : hospitalisation 100$ → 90$ / 10$"],
  ]},
  { cat: "Grossesse et maternité", items: [
    ["Consultations prénatales (3 CPN) et accouchement voie basse", "80%", "20%", "Ex : accouchement 80$ → 64$ / 16$"],
    ["Césarienne", "70%", "30%", "Ex : césarienne 300$ → 210$ / 90$"],
  ]},
  { cat: "Soins dentaires", items: [
    ["Soins conservateurs (détartrage, plombage, extraction simple)", "50%", "50%", "Ex : détartrage 20$ → 10$ / 10$"],
    ["Prothèses et actes lourds", "Non couvert", "100%", ""],
  ]},
  { cat: "Soins ophtalmologiques", items: [
    ["Consultation et examens de routine", "70%", "30%", ""],
    ["Monture et verres (1 prise en charge / 2 ans)", "40%", "60%", "Plafond 100 000 CDF"],
  ]},
  { cat: "Chirurgies", items: [
    ["Mineures (suture, abcès, circoncision)", "80%", "20%", ""],
    ["Majeures", "40%", "60%", "Ex : appendicectomie 250$ → 100$ / 150$"],
  ]},
  { cat: "Pathologies chroniques", items: [
    ["Hypertension, diabète, asthme — suivi et médicaments", "80%", "20%", "Plafond mensuel médicaments : 30 000 CDF"],
  ]},
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
  { cat: "Soins de santé primaires (illimité)", items: [
    ["Consultation générale, examens courants et médicaments", "90%", "10%", "Ex : consultation 15$ → 13,5$ / 1,5$"],
  ]},
  { cat: "Consultations spécialisées (illimité)", items: [
    ["Toutes spécialités : médecine interne, gynécologie, pédiatrie, cardiologie, ophtalmologie, dermatologie, neurologie, ORL, psychiatrie", "90%", "10%", "Ex : neurologie 35$ → 31,5$ / 3,5$"],
  ]},
  { cat: "Examens de laboratoire (courants et spécialisés)", items: [
    ["Toutes analyses, y compris hormonales et sérologiques", "90%", "10%", "Ex : bilan complet 40$ → 36$ / 4$"],
  ]},
  { cat: "Imagerie médicale", items: [
    ["Radiologie, échographie, scanner", "80%", "20%", "Ex : scanner 150$ → 120$ / 30$"],
    ["IRM", "60%", "40%", "Ex : IRM 300$ → 180$ / 120$"],
  ]},
  { cat: "Hospitalisation (chambre à 2 lits, 30 jours/an)", items: [
    ["Séjour complet, bloc opératoire, soins intensifs", "100%", "0%", "Ex : hospitalisation 400$ → 400$ / 0$"],
  ]},
  { cat: "Grossesse et maternité", items: [
    ["Suivi prénatal illimité, accouchement, césarienne", "90%", "10%", "Ex : césarienne 300$ → 270$ / 30$"],
  ]},
  { cat: "Soins dentaires", items: [
    ["Soins conservateurs et extractions", "80%", "20%", ""],
    ["Prothèses et couronnes simples", "60%", "40%", "Ex : couronne 200$ → 120$ / 80$"],
  ]},
  { cat: "Soins ophtalmologiques", items: [
    ["Consultation, examens, chirurgie de la cataracte", "80%", "20%", ""],
    ["Monture et verres (1 prise en charge / an)", "60%", "40%", "Plafond 300 000 CDF"],
  ]},
  { cat: "Chirurgies (mineures à majeures)", items: [
    ["Toutes chirurgies conventionnées", "90%", "10%", "Ex : myomectomie 700$ → 630$ / 70$"],
  ]},
  { cat: "Pathologies chroniques (illimité)", items: [
    ["Hypertension, diabète, asthme, arthrite — suivi et médicaments", "90%", "10%", ""],
    ["Suivi spécialisé des maladies chroniques", "90%", "10%", ""],
  ]},
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
  { cat: "Soins de santé primaires (illimité)", items: [
    ["Consultation générale, examens et médicaments", "100%", "0%", "Ex : consultation 15$ → 15$ / 0$"],
  ]},
  { cat: "Consultations spécialisées (illimité)", items: [
    ["Toutes spécialités, y compris consultations hors réseau sur accord préalable", "100%", "0%", ""],
  ]},
  { cat: "Examens de laboratoire (tous, illimité)", items: [
    ["Toutes analyses courantes et spécialisées", "100%", "0%", ""],
  ]},
  { cat: "Imagerie médicale (toutes, illimité)", items: [
    ["Radiologie, échographie, scanner", "100%", "0%", ""],
    ["IRM, PET-scan", "90%", "10%", "Ex : PET-scan 600$ → 540$ / 60$"],
  ]},
  { cat: "Hospitalisation (chambre privée, illimité)", items: [
    ["Séjour, bloc opératoire, soins intensifs, chambre individuelle", "100%", "0%", ""],
    ["Évacuation sanitaire internationale (si soin indisponible localement)", "100%", "0%", "Plafond 50 000 000 CDF/an"],
  ]},
  { cat: "Grossesse et maternité", items: [
    ["Suivi prénatal complet, accouchement, césarienne, complications", "100%", "0%", ""],
  ]},
  { cat: "Soins dentaires", items: [
    ["Soins conservateurs, prothèses, couronnes", "80%", "20%", ""],
    ["Orthodontie (enfants et adultes)", "60%", "40%", "Plafond 1 500 000 CDF"],
  ]},
  { cat: "Soins ophtalmologiques", items: [
    ["Consultation, chirurgie réfractive et cataracte", "100%", "0%", ""],
    ["Monture haut de gamme, verres, lentilles (1 prise en charge / an)", "100%", "0%", "Plafond 800 000 CDF"],
  ]},
  { cat: "Chirurgies (toutes, y compris reconstructrices)", items: [
    ["Chirurgies mineures, majeures et reconstructrices post-traumatiques", "100%", "0%", ""],
  ]},
  { cat: "Pathologies chroniques et maladies graves", items: [
    ["Hypertension, diabète, asthme — suivi et médicaments illimités", "100%", "0%", ""],
    ["Dialyse, oncologie, maladies graves", "90%", "10%", "Accord préalable du médecin conseil"],
  ]},
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

const FORMULES_SANTE = [
  {
    id: "essentiel", nom: "Essentiel", primeBase: 700000, primeParBenef: 350000,
    description: "Soins courants et hospitalisation de base",
    garanties: { "Consultations & Pharmacie": 900000, "Hospitalisation": 4000000, "Dentaire": 200000, "Optique": 150000, "Maternité": 1000000 },
    taux: { "Consultations & Pharmacie": 80, "Hospitalisation": 90, "Dentaire": 50, "Optique": 40, "Maternité": 80 },
    bareme: ESSENTIEL_BAREME, limites: ESSENTIEL_LIMITES, exclusions: ESSENTIEL_EXCLUSIONS,
  },
  {
    id: "confort", nom: "Confort Famille", primeBase: 1200000, primeParBenef: 512500,
    description: "Couverture complète recommandée pour les familles",
    garanties: { "Consultations & Pharmacie": 1800000, "Hospitalisation": 8000000, "Dentaire": 500000, "Optique": 300000, "Maternité": 2500000 },
    taux: { "Consultations & Pharmacie": 90, "Hospitalisation": 100, "Dentaire": 60, "Optique": 50, "Maternité": 90 },
    bareme: CONFORT_BAREME, limites: CONFORT_LIMITES, exclusions: CONFORT_EXCLUSIONS,
  },
  {
    id: "premium", nom: "Premium", primeBase: 2200000, primeParBenef: 900000,
    description: "Chambre privée, évacuation sanitaire, plafonds élevés",
    garanties: { "Consultations & Pharmacie": 3000000, "Hospitalisation": 15000000, "Dentaire": 900000, "Optique": 500000, "Maternité": 4000000 },
    taux: { "Consultations & Pharmacie": 100, "Hospitalisation": 100, "Dentaire": 80, "Optique": 70, "Maternité": 100 },
    bareme: PREMIUM_BAREME, limites: PREMIUM_LIMITES, exclusions: PREMIUM_EXCLUSIONS,
  },
  {
    id: "lisanga", nom: "Lisanga 65$", primeBase: 182000, primeParBenef: 182000,
    description: "Mutuelle de santé — 65$/personne/an, adhésion familiale, prise en charge par acte",
    garanties: { "Consultations & Pharmacie": 700000, "Hospitalisation": 2500000, "Dentaire": 300000, "Optique": 200000, "Maternité": 900000 },
    taux: { "Consultations & Pharmacie": 90, "Hospitalisation": 90, "Dentaire": 90, "Optique": 90, "Maternité": 90 },
    bareme: LISANGA_BAREME, limites: LISANGA_LIMITES, exclusions: LISANGA_EXCLUSIONS,
    mutuelle: true,
  },
];
const DELAIS_CARENCE = [
  { garantie: "Consultations & Pharmacie", jours: 0 },
  { garantie: "Hospitalisation", jours: 30 },
  { garantie: "Dentaire", jours: 60 },
  { garantie: "Optique", jours: 60 },
  { garantie: "Maternité", jours: 300 },
];

function CreationContrat({ session, setSession, notify }) {
  const [form, setForm] = useState({
    type: "Individuelle", entrepriseLiee: session.entreprises[0]?.nom || "",
    nom: "", prenom: "", dateNaissance: "", sexe: "Masculin", telephone: "", email: "", ville: "Kinshasa", adresse: "", profession: "", groupeSanguin: "", allergies: "", photo: "",
    typePiece: "Carte d'électeur", numeroPieceIdentite: "",
    formule: "confort",
    dateActivation: "", dateExpiration: "", plafondGlobal: MODELES_CONTRAT.Individuelle.plafondGlobal, plafondMensuel: "", franchise: 0, exclusions: MODELES_CONTRAT.Individuelle.exclusions,
    grade: "agent", statutSignature: "Brouillon", cascadeProfil: "Complet",
    periodicitePaiement: "Mensuelle", renouvellementTacite: true, reseauSoins: "Ouvert",
    declarationSante: "Aucun antécédent notable déclaré", conditionsSante: [],
    quotePartEmployeur: 80, quotePartEmploye: 20,
  });
  const [employesContrat, setEmployesContrat] = useState([]);
  const [addEmploye, setAddEmploye] = useState({ nom: "", matricule: "", email: "", dateNaissance: "", grade: "agent", conditionsSante: [], ayantsDroit: [] });
  const [addEmployeOuvert, setAddEmployeOuvert] = useState(false);
  const [addAyantTemp, setAddAyantTemp] = useState({ nom: "", lien: "Conjoint", naissance: "", conditionsSante: [] });
  const [addAyantPour, setAddAyantPour] = useState(null);
  const [addAyant, setAddAyant] = useState({ nom: "", lien: "Conjoint", naissance: "", conditionsSante: [] });
  const [docsFournis, setDocsFournis] = useState({});
  const [biometrieActivee, setBiometrieActivee] = useState({});
  const [modePaiement, setModePaiement] = useState("Mobile Money");
  const [accepteConditions, setAccepteConditions] = useState(false);
  const [signatureNom, setSignatureNom] = useState("");
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [addBenef, setAddBenef] = useState({ lien: "Conjoint", nom: "", naissance: "", sexe: "Féminin", lieuNaissance: "", telephone: "", groupeSanguin: "", adresse: "", photo: "", conditionsSante: [] });
  const [addBenefOuvert, setAddBenefOuvert] = useState(false);
  const [tentative, setTentative] = useState(false);

  const appliquerModele = (type) => {
    const m = MODELES_CONTRAT[type];
    setForm({ ...form, type, plafondGlobal: m.plafondGlobal, franchise: m.franchise, exclusions: m.exclusions });
  };

  const selectionnerEntreprise = (nom) => {
    const ent = session.entreprises.find((e) => e.nom === nom);
    setForm({ ...form, entrepriseLiee: nom });
    setEmployesContrat((ent?.effectifs || []).map((e) => ({ id: `${e.matricule}-${e.email}`, nom: e.nom, matricule: e.matricule, email: e.email, grade: session.gradesMaitre.find((g) => g.nom === e.grade)?.id || "agent", ayantsDroit: (e.ayantsDroit || []).map((a, i) => ({ id: `${e.matricule}-ad${i}`, ...a })), inclus: true })));
  };

  const ajouterEmploye = () => {
    if (!addEmploye.nom) return;
    setEmployesContrat([...employesContrat, { id: Date.now(), ...addEmploye, matricule: addEmploye.matricule || `EMP-${1000 + employesContrat.length}`, inclus: true }]);
    setAddEmploye({ nom: "", matricule: "", email: "", dateNaissance: "", grade: "agent", conditionsSante: [], ayantsDroit: [] });
    setAddAyantTemp({ nom: "", lien: "Conjoint", naissance: "", conditionsSante: [] });
    setAddEmployeOuvert(false);
  };
  const ajouterAyantDroitTemp = () => {
    if (!addAyantTemp.nom) return;
    setAddEmploye({ ...addEmploye, ayantsDroit: [...addEmploye.ayantsDroit, { id: Date.now(), ...addAyantTemp }] });
    setAddAyantTemp({ nom: "", lien: "Conjoint", naissance: "", conditionsSante: [] });
  };
  const retirerAyantDroitTemp = (id) => setAddEmploye({ ...addEmploye, ayantsDroit: addEmploye.ayantsDroit.filter((a) => a.id !== id) });
  const retirerEmploye = (id) => setEmployesContrat(employesContrat.filter((e) => e.id !== id));
  const toggleInclusionEmploye = (id) => setEmployesContrat(employesContrat.map((e) => (e.id === id ? { ...e, inclus: !e.inclus } : e)));
  const ajouterAyantDroitEmploye = () => {
    if (!addAyant.nom || !addAyantPour) return;
    setEmployesContrat(employesContrat.map((e) => (e.id === addAyantPour ? { ...e, ayantsDroit: [...e.ayantsDroit, { id: Date.now(), ...addAyant }] } : e)));
    setAddAyant({ nom: "", lien: "Conjoint", naissance: "", conditionsSante: [] });
    setAddAyantPour(null);
  };
  const retirerAyantDroitEmploye = (empId, adId) => setEmployesContrat(employesContrat.map((e) => (e.id === empId ? { ...e, ayantsDroit: e.ayantsDroit.filter((a) => a.id !== adId) } : e)));

  const ajouterBeneficiaire = () => {
    if (!addBenef.nom || !addBenef.naissance) return;
    setBeneficiaires([...beneficiaires, { ...addBenef, id: Date.now() }]);
    setAddBenef({ lien: "Conjoint", nom: "", naissance: "", sexe: "Féminin", lieuNaissance: "", telephone: "", groupeSanguin: "", adresse: "", photo: "", conditionsSante: [] });
    setAddBenefOuvert(false);
  };
  const retirerBeneficiaire = (id) => setBeneficiaires(beneficiaires.filter((b) => b.id !== id));

  const hasConjoint = beneficiaires.some((b) => b.lien === "Conjoint");
  const documentsRequis = form.type === "Entreprise" ? [] : [
    { key: "cni", label: "Pièce d'identité du souscripteur (CNI / Passeport)", required: true },
    { key: "attestation", label: "Attestation d'emploi ou de revenus", required: true },
    { key: "mariage", label: "Acte de mariage", required: hasConjoint },
    ...beneficiaires.flatMap((b) => [
      { key: `piece-${b.id}`, label: `Pièce d'identité de ${b.nom}`, required: true },
      { key: `naissance-${b.id}`, label: `Acte de naissance de ${b.nom}`, required: true },
    ]),
  ];
  const docsOk = documentsRequis.filter((d) => d.required).every((d) => docsFournis[d.key]);

  const champsOk = form.type === "Entreprise"
    ? (form.entrepriseLiee && form.dateActivation && form.dateExpiration && form.plafondGlobal)
    : (form.nom && form.prenom && form.dateNaissance && form.telephone && form.email && form.ville && form.numeroPieceIdentite && form.dateActivation && form.dateExpiration && form.plafondGlobal && docsOk && accepteConditions && signatureNom.trim());

  // Calculées ici (niveau rendu) pour alimenter en direct le récapitulatif de prime affiché dans le formulaire —
  // creer() en dessous garde ses propres constantes locales (même nom, portée interne) pour la soumission finale.
  const formuleChoisiePourApercu = FORMULES_SANTE.find((f) => f.id === form.formule);
  const nbPersonnesEntrepriseApercu = employesContrat.filter((e) => e.inclus).reduce((s, e) => s + 1 + e.ayantsDroit.length, 0);
  const nbPersonnes = form.type === "Entreprise" ? nbPersonnesEntrepriseApercu : 1 + beneficiaires.length;
  const diviseurPeriodeApercu = { Mensuelle: 12, Trimestrielle: 4, Semestrielle: 2, Annuelle: 1 }[form.periodicitePaiement] || 12;
  const surprimeSouscripteur = calculerSurprime(form.conditionsSante, form.dateNaissance);
  const primeAnnuelle = form.type === "Entreprise"
    ? employesContrat.filter((e) => e.inclus).reduce((s, e) => {
        const surpEmp = calculerSurprime(e.conditionsSante, e.dateNaissance);
        const primeEmp = Math.round((formuleChoisiePourApercu?.primeBase || 0) * (1 + surpEmp.surprimeTotal / 100));
        const primeAyants = (e.ayantsDroit || []).reduce((s2, a) => {
          const surpAyant = calculerSurprime(a.conditionsSante, a.naissance);
          return s2 + Math.round((formuleChoisiePourApercu?.primeParBenef || 0) * (1 + surpAyant.surprimeTotal / 100));
        }, 0);
        return s + primeEmp + primeAyants;
      }, 0)
    : Math.round((formuleChoisiePourApercu?.primeBase || 0) * (1 + surprimeSouscripteur.surprimeTotal / 100))
      + beneficiaires.reduce((s, b) => {
          const surp = calculerSurprime(b.conditionsSante, b.naissance);
          return s + Math.round((formuleChoisiePourApercu?.primeParBenef || 0) * (1 + surp.surprimeTotal / 100));
        }, 0);
  const primeMensuelle = Math.round(primeAnnuelle / diviseurPeriodeApercu);

  const creer = () => {
    setTentative(true);
    if (!champsOk) return;
    const numero = `CTR-${form.type === "Entreprise" ? "ENT" : "SP"}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const numeroPolice = `POL-${form.type === "Entreprise" ? "ENT" : "SP"}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const client = form.type === "Entreprise" ? form.entrepriseLiee : `${form.nom} ${form.prenom}`.trim();
    const tauxSouscripteur = session.gradesMaitre.find((g) => g.id === form.grade)?.taux || 80;
    const cascadeEtapes = form.cascadeProfil === "Complet"
      ? session.cascadeMaitre.map((c) => `${c.payeur} (${c.taux}${c.role ? ` — ${c.role}` : ""})`)
      : [`Assurance NeoGTec HealthCare (${tauxSouscripteur}%)`, "Reste à charge — Assuré"];
    const formuleChoisie = FORMULES_SANTE.find((f) => f.id === form.formule);
    const nbPersonnesEntreprise = employesContrat.filter((e) => e.inclus).reduce((s, e) => s + 1 + e.ayantsDroit.length, 0);
    const nbPersonnes = form.type === "Entreprise" ? nbPersonnesEntreprise : 1 + beneficiaires.length;
    const diviseurPeriode = { Mensuelle: 12, Trimestrielle: 4, Semestrielle: 2, Annuelle: 1 }[form.periodicitePaiement] || 12;
    const surprimeSouscripteur = calculerSurprime(form.conditionsSante, form.dateNaissance);
    const primeAnnuelle = form.type === "Entreprise"
      ? employesContrat.filter((e) => e.inclus).reduce((s, e) => {
          const surpEmp = calculerSurprime(e.conditionsSante, e.dateNaissance);
          const primeEmp = Math.round((formuleChoisie?.primeBase || 0) * (1 + surpEmp.surprimeTotal / 100));
          const primeAyants = (e.ayantsDroit || []).reduce((s2, a) => {
            const surpAyant = calculerSurprime(a.conditionsSante, a.naissance);
            return s2 + Math.round((formuleChoisie?.primeParBenef || 0) * (1 + surpAyant.surprimeTotal / 100));
          }, 0);
          return s + primeEmp + primeAyants;
        }, 0)
      : Math.round((formuleChoisie?.primeBase || 0) * (1 + surprimeSouscripteur.surprimeTotal / 100))
        + beneficiaires.reduce((s, b) => {
            const surp = calculerSurprime(b.conditionsSante, b.naissance);
            return s + Math.round((formuleChoisie?.primeParBenef || 0) * (1 + surp.surprimeTotal / 100));
          }, 0);
    const primeMensuelle = Math.round(primeAnnuelle / diviseurPeriode);
    const garantiesFormule = () => Object.entries(formuleChoisie?.garanties || {}).map(([nom, plafond]) => ({ nom, plafond, tauxCouverture: formuleChoisie?.taux?.[nom] }));

    const genererPoliceIndividuelle = (titulaireInfo, lienAvec, grade, prefixe, conditionsSante, sexe) => {
      const tx = session.gradesMaitre.find((g) => g.id === grade)?.taux || 70;
      return {
        numeroPolice: `POL-${prefixe}-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        numeroContrat: numero, dateEmission: "07/07/2026", rattacheePoliceMaitre: numeroPolice,
        titulaire: titulaireInfo, lienAvecSouscripteur: lienAvec, conditionsSante: conditionsSante || [], sexe: sexe || null,
        grade: session.gradesMaitre.find((g) => g.id === grade)?.nom, tauxAffiliation: tx,
        garanties: garantiesFormule(),
        formule: formuleChoisie?.nom, bareme: formuleChoisie?.bareme, baremeLimites: formuleChoisie?.limites, baremeExclusions: formuleChoisie?.exclusions,
        periode: { activation: form.dateActivation, expiration: form.dateExpiration },
        statutSignature: form.statutSignature, statut: "Actif",
      };
    };

    let policesIndividuelles = [];
    if (form.type === "Entreprise") {
      employesContrat.filter((e) => e.inclus).forEach((emp) => {
        policesIndividuelles.push(genererPoliceIndividuelle({ nom: emp.nom, matricule: emp.matricule, email: emp.email }, "Employé titulaire", emp.grade, "EMP", emp.conditionsSante, null));
        emp.ayantsDroit.forEach((ad) => {
          policesIndividuelles.push(genererPoliceIndividuelle({ nom: ad.nom, naissance: ad.naissance }, `${ad.lien} de ${emp.nom}`, "dependant", "AD", ad.conditionsSante, null));
        });
      });
    } else if (form.type === "Familiale") {
      beneficiaires.forEach((b) => {
        policesIndividuelles.push(genererPoliceIndividuelle({ nom: b.nom, naissance: b.naissance, lieuNaissance: b.lieuNaissance, groupeSanguin: b.groupeSanguin }, `${b.lien} de ${form.nom} ${form.prenom}`, "dependant", "AD", b.conditionsSante, b.sexe));
      });
    }

    const police = {
      numeroPolice, numeroContrat: numero, dateEmission: "07/07/2026",
      typeSouscripteur: form.type === "Entreprise" ? "Entreprise" : form.type === "Familiale" ? "Chef de famille" : "Assuré simple",
      souscripteur: form.type === "Entreprise" ? { raisonSociale: form.entrepriseLiee } : { nom: form.nom, prenom: form.prenom, dateNaissance: form.dateNaissance, sexe: form.sexe, telephone: form.telephone, email: form.email, ville: form.ville, adresse: form.adresse, profession: form.profession, groupeSanguin: form.groupeSanguin, allergies: form.allergies, pieceIdentite: form.type !== "Entreprise" ? `${form.typePiece} n° ${form.numeroPieceIdentite}` : undefined },
      beneficiaires: beneficiaires.map((b) => ({ ...b, taux: 70 })),
      periode: { activation: form.dateActivation, expiration: form.dateExpiration },
      garanties: garantiesFormule(),
      plafondGlobal: Number(form.plafondGlobal), plafondMensuel: Number(form.plafondMensuel) || 0, franchise: Number(form.franchise) || 0,
      exclusions: form.exclusions, grade: session.gradesMaitre.find((g) => g.id === form.grade)?.nom, tauxAffiliation: tauxSouscripteur,
      cascadeProfil: form.cascadeProfil, cascadeEtapes,
      optionDerogation: true, optionResteAChargePatient: true,
      statutSignature: form.statutSignature,
      formule: formuleChoisie?.nom, primeMensuelle, periodicitePaiement: form.periodicitePaiement, nbPersonnesCouvertes: nbPersonnes,
      bareme: formuleChoisie?.bareme, baremeLimites: formuleChoisie?.limites, baremeExclusions: formuleChoisie?.exclusions,
      delaisCarence: DELAIS_CARENCE, renouvellementTacite: form.renouvellementTacite, reseauSoins: form.reseauSoins,
      declarationSante: form.type !== "Entreprise" ? form.declarationSante : undefined,
      quotePartEmployeur: form.type === "Entreprise" ? Number(form.quotePartEmployeur) : undefined,
      quotePartEmploye: form.type === "Entreprise" ? Number(form.quotePartEmploye) : undefined,
      nbPolicesIndividuelles: policesIndividuelles.length,
      documentsVerifies: form.type !== "Entreprise" ? documentsRequis.map((d) => d.label) : undefined,
      biometrieActivee: form.type !== "Entreprise" ? Object.values(biometrieActivee).filter(Boolean).length : undefined,
      modePaiement: form.type !== "Entreprise" ? modePaiement : undefined,
      signature: form.type !== "Entreprise" ? { nom: signatureNom, accepteConditions, date: "07/07/2026" } : undefined,
    };

    const contrat = {
      id: Date.now(), numero, type: form.type, client,
      souscripteur: police.souscripteur,
      beneficiaires: form.type === "Entreprise" ? nbPersonnesEntreprise : beneficiaires.length + 1,
      beneficiairesDetail: beneficiaires,
      employesDetail: form.type === "Entreprise" ? employesContrat.filter((e) => e.inclus) : undefined,
      dateActivation: form.dateActivation, dateExpiration: form.dateExpiration, statut: "Actif", statutSignature: form.statutSignature,
      plafondGlobal: Number(form.plafondGlobal), plafondMensuel: Number(form.plafondMensuel) || 0, franchise: Number(form.franchise) || 0, exclusions: form.exclusions,
      grade: form.grade, tauxAffiliation: tauxSouscripteur,
      cascade: session.cascadeMaitre.map((c) => c.payeur), cascadeProfil: form.cascadeProfil,
      formule: formuleChoisie?.nom, primeMensuelle, periodicitePaiement: form.periodicitePaiement,
      police, policesIndividuelles,
      versions: [{ version: 1, date: "07/07/2026", auteur: "Gestionnaire réseau", note: `Création initiale du contrat — police matérialisée automatiquement${policesIndividuelles.length > 0 ? ` avec ${policesIndividuelles.length} police(s) individuelle(s) rattachée(s)` : ""}` }],
    };
    setSession({ ...session, contrats: [contrat, ...session.contrats], journal: [{ id: Date.now(), utilisateur: "Gestionnaire réseau", action: `Police ${numeroPolice} matérialisée pour ${client}${policesIndividuelles.length > 0 ? ` (+ ${policesIndividuelles.length} police(s) individuelle(s))` : ""}`, date: "07/07/2026" }, ...session.journal] });
    (async () => {
      const comptes = await chargerCanal(CLE_COMPTES_PARTAGES);
      const garantiesVierges = () => garantiesFormule().map((g) => ({ nom: g.nom, plafond: g.plafond, consomme: 0 }));
      const comptesSouscripteurMaj = comptes.map((cpt) => (cpt.donnees?.contrat === numero ? { ...cpt, donnees: { ...cpt.donnees, dateActivation: form.dateActivation, franchise: Number(form.franchise) || 0, plafondGlobal: Number(form.plafondGlobal), garantiesConsommation: cpt.donnees.garantiesConsommation?.length ? cpt.donnees.garantiesConsommation : garantiesVierges() } } : cpt));
      // Chaque police individuelle (ayant droit ou employé) reçoit son propre compte de suivi — pas de traçabilité
      // partagée entre plusieurs personnes d'un même contrat familial ou entreprise.
      const nouveauxComptesIndividuels = policesIndividuelles.map((p) => ({
        type: "assure", nom: p.titulaire.nom, acces: [], accesMobile: false, dateCreation: "15/07/2026",
        donnees: {
          id: Date.now() + Math.random(), statut: "Actif", dateActivation: form.dateActivation, telephone: "", ville: form.ville || "Kinshasa",
          dateNaissance: p.titulaire.naissance || null, sexe: p.sexe, formule: formuleChoisie?.nom, nbAyantsDroit: 0,
          police: p.numeroPolice, contrat: numero, rattacheA: numeroPolice, lienAvecSouscripteur: p.lienAvecSouscripteur,
          conditionsSante: p.conditionsSante || [], franchise: Number(form.franchise) || 0, plafondGlobal: Number(form.plafondGlobal),
          garantiesConsommation: garantiesVierges(), telemedecineConsommee: 0,
        },
      }));
      await sauvegarderCanal(CLE_COMPTES_PARTAGES, [...nouveauxComptesIndividuels, ...comptesSouscripteurMaj]);
    })();
    notify(`Contrat ${numero} créé — police ${numeroPolice} matérialisée${policesIndividuelles.length > 0 ? ` avec ${policesIndividuelles.length} police(s) individuelle(s)` : ""}`);
    setForm({ type: "Individuelle", entrepriseLiee: session.entreprises[0]?.nom || "", nom: "", prenom: "", dateNaissance: "", sexe: "Masculin", telephone: "", email: "", ville: "Kinshasa", adresse: "", profession: "", groupeSanguin: "", allergies: "", photo: "", typePiece: "Carte d'électeur", numeroPieceIdentite: "", formule: "confort", dateActivation: "", dateExpiration: "", plafondGlobal: MODELES_CONTRAT.Individuelle.plafondGlobal, plafondMensuel: "", franchise: 0, exclusions: MODELES_CONTRAT.Individuelle.exclusions, grade: "agent", statutSignature: "Brouillon", cascadeProfil: "Complet", periodicitePaiement: "Mensuelle", renouvellementTacite: true, reseauSoins: "Ouvert", declarationSante: "Aucun antécédent notable déclaré", conditionsSante: [], quotePartEmployeur: 80, quotePartEmploye: 20 });
    setBeneficiaires([]);
    setEmployesContrat([]);
    setDocsFournis({});
    setBiometrieActivee({});
    setModePaiement("Mobile Money");
    setAccepteConditions(false);
    setSignatureNom("");
    setTentative(false);
  };
  const err = (v) => (tentative && !v ? { border: `1px solid ${C.red}` } : {});

  return (
    <>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <FileSignature size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Formulaire conforme à celui de l'app mobile Assuré — mêmes champs d'identité et de famille, avec les paramètres contractuels en plus.</span>
      </Card>

      <Card className="p-5 mb-4" style={{ maxWidth: 820 }}>
        <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>Type de souscripteur</div>
        <div className="flex gap-2 mb-5">
          {[["Entreprise", "Entreprise"], ["Individuelle", "Assuré simple"], ["Familiale", "Chef de famille"]].map(([t, label]) => (
            <button key={t} onClick={() => appliquerModele(t)} className="rounded-xl px-4 py-2.5 flex-1" style={{ background: form.type === t ? C.navy : C.ivory, color: form.type === t ? "white" : C.ink, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>{label}</button>
          ))}
        </div>

        <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", margin: "16px 0 8px" }}>Formule</div>
        <div className="grid grid-cols-4 gap-3 mb-2">
          {FORMULES_SANTE.map((f) => (
            <button key={f.id} onClick={() => setForm({ ...form, formule: f.id })} className="rounded-xl p-3.5 text-left" style={{ border: form.formule === f.id ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
              <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{f.nom}{f.mutuelle && <span style={{ fontFamily: sans, fontSize: 8.5, fontWeight: 700, color: C.navy2, background: C.ivory, padding: "1px 5px", borderRadius: 999, marginLeft: 4 }}>MUTUELLE</span>}</div>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 2 }}>{f.description}</div>
              <div style={{ fontFamily: mono, fontSize: 12, color: C.gold, fontWeight: 700, marginTop: 6 }}>{fmt(f.primeBase)} /an (base)</div>
              <div style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>+ {fmt(f.primeParBenef)} /an par personne additionnelle</div>
            </button>
          ))}
        </div>

        {form.type === "Entreprise" ? (
          <>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "16px 0 10px" }}>Entreprise souscriptrice</div>
            <Field label="Entreprise *">
              <select style={{ ...inputStyle, ...err(form.entrepriseLiee) }} value={form.entrepriseLiee} onChange={(e) => selectionnerEntreprise(e.target.value)}>
                {session.entreprises.length === 0 && <option value="">Aucune entreprise enregistrée — créez d'abord un compte</option>}
                {session.entreprises.map((e) => <option key={e.id}>{e.nom}</option>)}
              </select>
            </Field>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 6, marginBottom: 14 }}>Les effectifs déjà provisionnés pour cette entreprise (via Comptes réseau) sont préchargés ci-dessous — décochez ceux à exclure du contrat, ou ajoutez-en manuellement.</div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Quote-part employeur (%)"><input style={inputStyle} value={form.quotePartEmployeur} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setForm({ ...form, quotePartEmployeur: v, quotePartEmploye: String(100 - Number(v || 0)) }); }} /></Field>
              <Field label="Quote-part employé (%)"><input style={inputStyle} value={form.quotePartEmploye} onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setForm({ ...form, quotePartEmploye: v, quotePartEmployeur: String(100 - Number(v || 0)) }); }} /></Field>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Employés à couvrir ({employesContrat.filter((e) => e.inclus).length} inclus sur {employesContrat.length})</div>
              <button onClick={() => setAddEmployeOuvert(!addEmployeOuvert)} className="rounded-lg px-3 py-1.5 flex items-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy2 }}><Plus size={12} /> Ajouter un employé</button>
            </div>

            {addEmployeOuvert && (
              <Card className="p-3.5 mb-3" style={{ background: C.ivory, border: "none" }}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input style={inputStyle} placeholder="Nom complet" value={addEmploye.nom} onChange={(e) => setAddEmploye({ ...addEmploye, nom: e.target.value })} />
                  <input style={inputStyle} placeholder="Matricule (auto si vide)" value={addEmploye.matricule} onChange={(e) => setAddEmploye({ ...addEmploye, matricule: e.target.value })} />
                  <input style={inputStyle} placeholder="Email professionnel" value={addEmploye.email} onChange={(e) => setAddEmploye({ ...addEmploye, email: e.target.value })} />
                  <select style={inputStyle} value={addEmploye.grade} onChange={(e) => setAddEmploye({ ...addEmploye, grade: e.target.value })}>{session.gradesMaitre.filter((g) => g.id !== "dependant").map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}</select>
                  <input type="date" style={inputStyle} value={addEmploye.dateNaissance} onChange={(e) => setAddEmploye({ ...addEmploye, dateNaissance: e.target.value })} title="Date de naissance" />
                </div>
                <div style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 4 }}>Conditions médicales connues de l'employé (optionnel)</div>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {CONDITIONS_SANTE.map((c) => (
                    <label key={c.id} className="flex items-center gap-1 rounded-lg px-1.5 py-1" style={{ background: (addEmploye.conditionsSante || []).includes(c.id) ? "#FBEAE8" : "white" }}>
                      <input type="checkbox" checked={(addEmploye.conditionsSante || []).includes(c.id)} onChange={(e) => setAddEmploye({ ...addEmploye, conditionsSante: e.target.checked ? [...(addEmploye.conditionsSante || []), c.id] : addEmploye.conditionsSante.filter((id) => id !== c.id) })} />
                      <span style={{ fontFamily: sans, fontSize: 9.5, color: C.ink }}>{c.label} (+{c.surprimePct}%)</span>
                    </label>
                  ))}
                </div>
                {(addEmploye.conditionsSante?.length > 0 || calculerSurprime(addEmploye.conditionsSante, addEmploye.dateNaissance).surprimeAge > 0) && (
                  <div className="flex items-center gap-1.5 mb-2"><TrendingUp size={11} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 10, color: C.amber, fontWeight: 700 }}>Surprime individuelle : +{calculerSurprime(addEmploye.conditionsSante, addEmploye.dateNaissance).surprimeTotal}% sur la prime de cet employé — comptabilisée dans le total du contrat.</span></div>
                )}

                <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                  <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Ayants droit rattachés à cet employé {addEmploye.ayantsDroit.length > 0 && `(${addEmploye.ayantsDroit.length})`}</div>
                  {addEmploye.ayantsDroit.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {addEmploye.ayantsDroit.map((ad) => (
                        <div key={ad.id} className="flex items-center justify-between rounded-lg px-2.5 py-1.5" style={{ background: "white" }}>
                          <span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>{ad.nom} <span style={{ color: C.sub }}>— {ad.lien}{ad.naissance ? ` · né(e) le ${ad.naissance}` : ""}</span></span>
                          <button onClick={() => retirerAyantDroitTemp(ad.id)}><Trash2 size={11} color={C.red} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2 mb-1.5">
                    <input style={inputStyle} placeholder="Nom complet" value={addAyantTemp.nom} onChange={(e) => setAddAyantTemp({ ...addAyantTemp, nom: e.target.value })} />
                    <select style={inputStyle} value={addAyantTemp.lien} onChange={(e) => setAddAyantTemp({ ...addAyantTemp, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Ascendant</option></select>
                    <input type="date" style={inputStyle} value={addAyantTemp.naissance} onChange={(e) => setAddAyantTemp({ ...addAyantTemp, naissance: e.target.value })} />
                    <button onClick={ajouterAyantDroitTemp} disabled={!addAyantTemp.nom} className="rounded-lg px-3 py-2" style={{ background: !addAyantTemp.nom ? "#C9CDD6" : C.navy2, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Plus size={12} style={{ display: "inline", marginRight: 2 }} /> Ajouter</button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {CONDITIONS_SANTE.map((c) => (
                      <label key={c.id} className="flex items-center gap-1 rounded-lg px-1.5 py-1" style={{ background: (addAyantTemp.conditionsSante || []).includes(c.id) ? "#FBEAE8" : "white" }}>
                        <input type="checkbox" checked={(addAyantTemp.conditionsSante || []).includes(c.id)} onChange={(e) => setAddAyantTemp({ ...addAyantTemp, conditionsSante: e.target.checked ? [...(addAyantTemp.conditionsSante || []), c.id] : addAyantTemp.conditionsSante.filter((id) => id !== c.id) })} />
                        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.ink }}>{c.label} (+{c.surprimePct}%)</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-3"><button onClick={() => { setAddEmployeOuvert(false); setAddEmploye({ nom: "", matricule: "", email: "", dateNaissance: "", grade: "agent", conditionsSante: [], ayantsDroit: [] }); }} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11 }}>Annuler</button><button onClick={ajouterEmploye} disabled={!addEmploye.nom} className="rounded-lg px-3 py-1.5" style={{ background: !addEmploye.nom ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Ajouter l'employé{addEmploye.ayantsDroit.length > 0 ? ` + ${addEmploye.ayantsDroit.length} ayant(s) droit` : ""}</button></div>
              </Card>
            )}

            {employesContrat.length === 0 && <Card className="p-4 text-center mb-4"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Aucun employé pour l'instant — ajoutez-en un ou sélectionnez une entreprise avec des effectifs déjà provisionnés.</span></Card>}

            <div className="space-y-2 mb-4">
              {employesContrat.map((emp) => (
                <Card key={emp.id} className="p-3" style={{ opacity: emp.inclus ? 1 : 0.5 }}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={emp.inclus} onChange={() => toggleInclusionEmploye(emp.id)} />
                    <div className="flex-1">
                      <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{emp.nom} <span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, fontWeight: 400 }}>{emp.matricule}</span></div>
                      <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{session.gradesMaitre.find((g) => g.id === emp.grade)?.nom} · {emp.email}</div>
                    </div>
                    <button onClick={() => setAddAyantPour(addAyantPour === emp.id ? null : emp.id)} className="rounded-lg px-2.5 py-1.5 flex items-center gap-1" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.navy2 }}><Plus size={11} /> Ayant droit</button>
                    <button onClick={() => retirerEmploye(emp.id)}><Trash2 size={13} color={C.red} /></button>
                  </div>
                  {emp.ayantsDroit.length > 0 && (
                    <div className="mt-2 pt-2 space-y-1" style={{ borderTop: `1px solid ${C.line}` }}>
                      {emp.ayantsDroit.map((ad) => (
                        <div key={ad.id} className="flex items-center justify-between pl-6">
                          <span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>{ad.nom} <span style={{ color: C.sub }}>— {ad.lien}{ad.naissance ? ` · né(e) le ${ad.naissance}` : ""}</span></span>
                          <button onClick={() => retirerAyantDroitEmploye(emp.id, ad.id)}><Trash2 size={11} color={C.red} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {addAyantPour === emp.id && (
                    <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                      <div className="grid grid-cols-4 gap-2 mb-1.5">
                        <input style={inputStyle} placeholder="Nom complet" value={addAyant.nom} onChange={(e) => setAddAyant({ ...addAyant, nom: e.target.value })} />
                        <select style={inputStyle} value={addAyant.lien} onChange={(e) => setAddAyant({ ...addAyant, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Ascendant</option></select>
                        <input type="date" style={inputStyle} value={addAyant.naissance} onChange={(e) => setAddAyant({ ...addAyant, naissance: e.target.value })} />
                        <button onClick={ajouterAyantDroitEmploye} disabled={!addAyant.nom} className="rounded-lg px-3 py-2" style={{ background: !addAyant.nom ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Ajouter</button>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {CONDITIONS_SANTE.map((c) => (
                          <label key={c.id} className="flex items-center gap-1 rounded-lg px-1.5 py-1" style={{ background: (addAyant.conditionsSante || []).includes(c.id) ? "#FBEAE8" : C.ivory }}>
                            <input type="checkbox" checked={(addAyant.conditionsSante || []).includes(c.id)} onChange={(e) => setAddAyant({ ...addAyant, conditionsSante: e.target.checked ? [...(addAyant.conditionsSante || []), c.id] : addAyant.conditionsSante.filter((id) => id !== c.id) })} />
                            <span style={{ fontFamily: sans, fontSize: 9.5, color: C.ink }}>{c.label} (+{c.surprimePct}%)</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl mb-4" style={{ background: C.ivory }}>
              <Users2 size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Une <b>police d'assurance individuelle sera matérialisée pour chaque employé inclus et chacun de ses ayants droit</b>, rattachée au contrat maître de l'entreprise, avec son propre numéro et ses propres plafonds selon son grade.</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Identité du souscripteur</div>
            <div className="flex items-center gap-3 mb-4">
              <label className="relative cursor-pointer flex-shrink-0">
                <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 56, height: 56, background: C.ivory, border: `2px dashed ${form.photo ? C.green : C.line}` }}>
              {form.photo ? <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={20} color={C.navy2} />}
            </div>
            <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, photo: URL.createObjectURL(f) }); }} />
          </label>
          <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Photo du souscripteur (utilisée pour le QR code et la reconnaissance faciale sur l'app mobile)</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Field label="Nom *"><input style={{ ...inputStyle, ...err(form.nom) }} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="MUKENDI" /></Field>
          <Field label="Prénom *"><input style={{ ...inputStyle, ...err(form.prenom) }} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Jean-Paul" /></Field>
          <Field label="Date de naissance *"><input type="date" style={{ ...inputStyle, ...err(form.dateNaissance) }} value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} /></Field>
          <Field label="Sexe"><select style={inputStyle} value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })}><option>Masculin</option><option>Féminin</option></select></Field>
          <Field label="Téléphone *"><input style={{ ...inputStyle, ...err(form.telephone) }} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+243 81 000 00 00" /></Field>
          <Field label="Ville *"><select style={{ ...inputStyle, ...err(form.ville) }} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
          <Field label="Email *"><input style={{ ...inputStyle, ...err(form.email) }} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jp.mukendi@mail.cd" /></Field>
          <Field label="Adresse"><input style={inputStyle} value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Avenue Kasa-Vubu, Bandalungwa" /></Field>
          <Field label="Profession"><input style={inputStyle} value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} placeholder="Ingénieur" /></Field>
          <Field label="Groupe sanguin"><select style={inputStyle} value={form.groupeSanguin} onChange={(e) => setForm({ ...form, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
          <Field label="Type de pièce d'identité"><select style={inputStyle} value={form.typePiece} onChange={(e) => setForm({ ...form, typePiece: e.target.value })}><option>Carte d'électeur</option><option>Passeport</option><option>Carte d'identité</option><option>Permis de conduire</option></select></Field>
          <Field label="N° de la pièce *"><input style={{ ...inputStyle, ...err(form.numeroPieceIdentite) }} value={form.numeroPieceIdentite} onChange={(e) => setForm({ ...form, numeroPieceIdentite: e.target.value })} placeholder="Ex : 12-234-567890" /></Field>
          <div className="col-span-2"><Field label="Alertes médicales (allergies, etc.)"><input style={inputStyle} value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="Ex : Allergique Pénicilline" /></Field></div>
          <div className="col-span-2">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Questionnaire médical — conditions connues (souscripteur)</div>
            <div className="grid grid-cols-3 gap-1.5">
              {CONDITIONS_SANTE.map((c) => (
                <label key={c.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: (form.conditionsSante || []).includes(c.id) ? "#FBEAE8" : C.ivory }}>
                  <input type="checkbox" checked={(form.conditionsSante || []).includes(c.id)} onChange={(e) => setForm({ ...form, conditionsSante: e.target.checked ? [...(form.conditionsSante || []), c.id] : form.conditionsSante.filter((id) => id !== c.id) })} />
                  <span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink }}>{c.label} (+{c.surprimePct}%)</span>
                </label>
              ))}
            </div>
            {(form.conditionsSante?.length > 0 || calculerSurprime(form.conditionsSante, form.dateNaissance).surprimeAge > 0) && (
              <div className="flex items-center gap-1.5 mt-2"><TrendingUp size={12} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.amber, fontWeight: 700 }}>Surprime individuelle appliquée : +{calculerSurprime(form.conditionsSante, form.dateNaissance).surprimeTotal}% sur la prime de base du souscripteur{calculerSurprime(form.conditionsSante, form.dateNaissance).surprimeAge > 0 ? ` (dont +${calculerSurprime(form.conditionsSante, form.dateNaissance).surprimeAge}% lié à l'âge)` : ""}.</span></div>
            )}
          </div>
          <div className="col-span-2"><Field label="Déclaration de santé (détails libres, antécédents connus du souscripteur)"><textarea style={{ ...inputStyle, minHeight: 50, resize: "none" }} value={form.declarationSante} onChange={(e) => setForm({ ...form, declarationSante: e.target.value })} placeholder="Ex : Hypertension traitée depuis 2022" /></Field></div>
        </div>
          </>
        )}

        {form.type !== "Entreprise" && (
          <>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "16px 0 10px" }}>Bénéficiaires / ayants droit</div>
            {beneficiaires.length > 0 && (
              <div className="space-y-2 mb-3">
                {beneficiaires.map((b) => (
                  <Card key={b.id} className="p-3 flex items-center gap-3">
                    <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 32, height: 32, background: C.ivory }}>{b.photo ? <img src={b.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Users2 size={14} color={C.navy2} style={{ margin: 9 }} />}</div>
                    <div className="flex-1"><span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{b.nom}</span><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}> — {b.lien} · {b.naissance}</span></div>
                    <button onClick={() => retirerBeneficiaire(b.id)}><Trash2 size={13} color={C.red} /></button>
                  </Card>
                ))}
              </div>
            )}
            {!addBenefOuvert ? (
              <button onClick={() => setAddBenefOuvert(true)} className="rounded-lg px-3 py-2 flex items-center gap-1.5 mb-4" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}><Plus size={13} /> Ajouter un bénéficiaire</button>
            ) : (
              <Card className="p-4 mb-4" style={{ background: C.ivory, border: "none" }}>
                <div className="flex items-center gap-3 mb-3">
                  <label className="relative cursor-pointer flex-shrink-0">
                    <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 40, height: 40, background: "white", border: `1.5px dashed ${addBenef.photo ? C.green : C.line}` }}>
                      {addBenef.photo ? <img src={addBenef.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={15} color={C.navy2} />}
                    </div>
                    <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setAddBenef({ ...addBenef, photo: URL.createObjectURL(f) }); }} />
                  </label>
                  <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Photo du bénéficiaire</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <Field label="Lien de parenté"><select style={inputStyle} value={addBenef.lien} onChange={(e) => setAddBenef({ ...addBenef, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Ascendant</option><option>Autre</option></select></Field>
                  <div className="col-span-2"><Field label="Nom complet"><input style={inputStyle} value={addBenef.nom} onChange={(e) => setAddBenef({ ...addBenef, nom: e.target.value })} placeholder="Nom et prénom" /></Field></div>
                  <Field label="Date de naissance"><input type="date" style={inputStyle} value={addBenef.naissance} onChange={(e) => setAddBenef({ ...addBenef, naissance: e.target.value })} /></Field>
                  <Field label="Sexe"><select style={inputStyle} value={addBenef.sexe} onChange={(e) => setAddBenef({ ...addBenef, sexe: e.target.value })}><option>Féminin</option><option>Masculin</option></select></Field>
                  <Field label="Lieu de naissance"><input style={inputStyle} value={addBenef.lieuNaissance} onChange={(e) => setAddBenef({ ...addBenef, lieuNaissance: e.target.value })} placeholder="Kinshasa" /></Field>
                  <Field label="Téléphone"><input style={inputStyle} value={addBenef.telephone} onChange={(e) => setAddBenef({ ...addBenef, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
                  <Field label="Groupe sanguin"><select style={inputStyle} value={addBenef.groupeSanguin} onChange={(e) => setAddBenef({ ...addBenef, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
                  <Field label="Adresse"><input style={inputStyle} value={addBenef.adresse} onChange={(e) => setAddBenef({ ...addBenef, adresse: e.target.value })} placeholder="Même adresse si vide" /></Field>
                </div>
                <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Questionnaire médical — conditions connues de ce bénéficiaire</div>
                <div className="grid grid-cols-3 gap-1.5 mb-1">
                  {CONDITIONS_SANTE.map((c) => (
                    <label key={c.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5" style={{ background: (addBenef.conditionsSante || []).includes(c.id) ? "#FBEAE8" : C.ivory }}>
                      <input type="checkbox" checked={(addBenef.conditionsSante || []).includes(c.id)} onChange={(e) => setAddBenef({ ...addBenef, conditionsSante: e.target.checked ? [...(addBenef.conditionsSante || []), c.id] : addBenef.conditionsSante.filter((id) => id !== c.id) })} />
                      <span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink }}>{c.label} (+{c.surprimePct}%)</span>
                    </label>
                  ))}
                </div>
                {(addBenef.conditionsSante?.length > 0 || calculerSurprime(addBenef.conditionsSante, addBenef.naissance).surprimeAge > 0) && (
                  <div className="flex items-center gap-1.5 mb-1"><TrendingUp size={12} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.amber, fontWeight: 700 }}>Surprime individuelle : +{calculerSurprime(addBenef.conditionsSante, addBenef.naissance).surprimeTotal}% sur la prime de ce bénéficiaire.</span></div>
                )}
                <div className="flex gap-2 mt-2"><button onClick={() => setAddBenefOuvert(false)} className="rounded-lg px-3 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5 }}>Annuler</button><button onClick={ajouterBeneficiaire} disabled={!addBenef.nom || !addBenef.naissance} className="rounded-lg px-3 py-2" style={{ background: (!addBenef.nom || !addBenef.naissance) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Ajouter</button></div>
              </Card>
            )}
            {form.type === "Familiale" && beneficiaires.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-xl mb-4" style={{ background: C.ivory }}>
                <Users2 size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Une <b>police d'assurance individuelle sera matérialisée pour chacun des {beneficiaires.length} bénéficiaire(s)</b>, rattachée à la police du chef de famille.</span>
              </div>
            )}
          </>
        )}

        <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "6px 0 10px" }}>Paramètres du contrat</div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Date d'activation *"><input type="date" style={{ ...inputStyle, ...err(form.dateActivation) }} value={form.dateActivation} onChange={(e) => setForm({ ...form, dateActivation: e.target.value })} /></Field>
          <Field label="Date d'expiration *"><input type="date" style={{ ...inputStyle, ...err(form.dateExpiration) }} value={form.dateExpiration} onChange={(e) => setForm({ ...form, dateExpiration: e.target.value })} /></Field>
          <Field label="Statut de signature"><select style={inputStyle} value={form.statutSignature} onChange={(e) => setForm({ ...form, statutSignature: e.target.value })}><option>Brouillon</option><option>Signé</option></select></Field>
          <Field label="Grade / taux d'affiliation"><select style={inputStyle} value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>{session.gradesMaitre.map((g) => <option key={g.id} value={g.id}>{g.nom} — {g.taux}%</option>)}</select></Field>
          <Field label="Plafond global (CDF) *"><input style={{ ...inputStyle, ...err(form.plafondGlobal) }} value={form.plafondGlobal} onChange={(e) => setForm({ ...form, plafondGlobal: e.target.value.replace(/\D/g, "") })} /></Field>
          <Field label="Plafond mensuel (CDF)"><input style={inputStyle} value={form.plafondMensuel} onChange={(e) => setForm({ ...form, plafondMensuel: e.target.value.replace(/\D/g, "") })} /></Field>
          <Field label="Franchise (CDF)"><input style={inputStyle} value={form.franchise} onChange={(e) => setForm({ ...form, franchise: e.target.value.replace(/\D/g, "") })} /></Field>
          <Field label="Périodicité de paiement"><select style={inputStyle} value={form.periodicitePaiement} onChange={(e) => setForm({ ...form, periodicitePaiement: e.target.value })}><option>Mensuelle</option><option>Trimestrielle</option><option>Semestrielle</option><option>Annuelle</option></select></Field>
          <Field label="Réseau de soins"><select style={inputStyle} value={form.reseauSoins} onChange={(e) => setForm({ ...form, reseauSoins: e.target.value })}><option>Ouvert</option><option>Fermé</option></select></Field>
          <Field label="Renouvellement"><select style={inputStyle} value={form.renouvellementTacite ? "oui" : "non"} onChange={(e) => setForm({ ...form, renouvellementTacite: e.target.value === "oui" })}><option value="oui">Tacite reconduction</option><option value="non">Non reconductible</option></select></Field>
        </div>
        <div className="mt-4"><Field label="Exclusions"><textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} /></Field></div>

        <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "16px 0 10px" }}>Délais de carence appliqués</div>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {DELAIS_CARENCE.map((d) => (
            <div key={d.garantie} className="rounded-lg p-2.5 text-center" style={{ background: C.ivory }}>
              <div style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>{d.garantie}</div>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: d.jours === 0 ? C.green : C.navy }}>{d.jours === 0 ? "Immédiat" : `${d.jours} j`}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "16px 0 10px" }}>Profil de cascade de paiement</div>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <button onClick={() => setForm({ ...form, cascadeProfil: "Complet" })} className="rounded-xl p-3.5 text-left" style={{ border: form.cascadeProfil === "Complet" ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>CSU + Assurance + Mutuelle + Assuré</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 2 }}>Pour la maternité : CSU gratuite à 100%. Pour tout le reste : l'assurance paie en premier, puis la mutuelle si affiliée, le solde restant à l'assuré.</div>
          </button>
          <button onClick={() => setForm({ ...form, cascadeProfil: "Direct" })} className="rounded-xl p-3.5 text-left" style={{ border: form.cascadeProfil === "Direct" ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Assureur seul + reste à charge</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 2 }}>Pas de CSU ni de mutuelle — l'assurance paie directement selon le taux, le solde à l'assuré.</div>
          </button>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: C.ivory }}>
          <ShieldQuestion size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Dans les deux profils, si la prise en charge est rejetée ou dépasse le plafond, l'assuré peut soit <b>soumettre une demande de dérogation</b>, soit <b>régler directement le solde restant</b> auprès du prestataire.</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3"><Landmark size={12} color={C.sub} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Étapes appliquées : {(form.cascadeProfil === "Complet" ? ["CSU", "Assurance", "Mutuelle", "Assuré"] : ["Assurance", "Assuré"]).join(" → ")}</span></div>

        <Card className="p-4 mt-5 flex items-center justify-between" style={{ background: C.goldSoft ? C.goldSoft : C.ivory, border: "none" }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textTransform: "uppercase" }}>Prime estimée ({form.periodicitePaiement.toLowerCase()})</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{(form.type === "Entreprise" ? employesContrat.filter((e) => e.inclus).reduce((s, e) => s + 1 + e.ayantsDroit.length, 0) : 1 + beneficiaires.length)} personne(s) couverte(s) — formule {FORMULES_SANTE.find((f) => f.id === form.formule)?.nom}</div>
          </div>
          <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, fontWeight: 700 }}>
            {(() => {
              const f = FORMULES_SANTE.find((x) => x.id === form.formule);
              const diviseur = { Mensuelle: 12, Trimestrielle: 4, Semestrielle: 2, Annuelle: 1 }[form.periodicitePaiement] || 12;
              const primeAn = form.type === "Entreprise"
                ? employesContrat.filter((e) => e.inclus).reduce((s, e) => s + (f?.primeBase || 0) + e.ayantsDroit.length * (f?.primeParBenef || 0), 0)
                : (f?.primeBase || 0) + beneficiaires.length * (f?.primeParBenef || 0);
              return fmt(Math.round(primeAn / diviseur));
            })()}
          </div>
        </Card>

        {form.type !== "Entreprise" && (
          <>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "16px 0 10px" }}>Pièces justificatives (identiques à l'app mobile Assuré)</div>
            <div className="space-y-1.5 mb-2">
              {documentsRequis.map((d) => (
                <div key={d.key} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: docsFournis[d.key] ? "#EAF6EF" : C.ivory }}>
                  <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{d.label}{!d.required && <span style={{ color: C.sub }}> (optionnel)</span>}</span>
                  <button onClick={() => setDocsFournis({ ...docsFournis, [d.key]: !docsFournis[d.key] })} className="rounded-lg px-2.5 py-1 flex items-center gap-1" style={{ background: docsFournis[d.key] ? C.green : "white", color: docsFournis[d.key] ? "white" : C.navy2, border: `1px solid ${docsFournis[d.key] ? C.green : C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}>{docsFournis[d.key] ? <Check size={11} /> : <Upload size={11} />} {docsFournis[d.key] ? "Reçu" : "Marquer reçu"}</button>
                </div>
              ))}
            </div>
            {tentative && !docsOk && <div className="flex items-center gap-1.5 mb-3" style={{ color: C.red }}><AlertCircle size={12} /><span style={{ fontFamily: sans, fontSize: 10.5 }}>Toutes les pièces obligatoires doivent être marquées comme reçues.</span></div>}

            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "16px 0 10px" }}>Biométrie faciale (souscripteur et ayants droit)</div>
            <div className="space-y-1.5 mb-4">
              {[{ key: "principal", nom: `${form.nom} ${form.prenom}`.trim() || "Souscripteur" }, ...beneficiaires.map((b) => ({ key: String(b.id), nom: b.nom }))].map((p) => (
                <div key={p.key} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: biometrieActivee[p.key] ? "#EAF6EF" : C.ivory }}>
                  <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{p.nom}</span>
                  <button onClick={() => setBiometrieActivee({ ...biometrieActivee, [p.key]: !biometrieActivee[p.key] })} className="rounded-lg px-2.5 py-1 flex items-center gap-1" style={{ background: biometrieActivee[p.key] ? C.green : "white", color: biometrieActivee[p.key] ? "white" : C.navy2, border: `1px solid ${biometrieActivee[p.key] ? C.green : C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}><ScanFace size={11} /> {biometrieActivee[p.key] ? "Activée" : "Activer"}</button>
                </div>
              ))}
            </div>

            <Card className="p-4 mb-4" style={{ background: C.ivory, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Récapitulatif de la prime — {form.periodicitePaiement.toLowerCase()}</div>
              {form.type === "Entreprise" ? (
                <div className="space-y-1 mb-2">
                  {employesContrat.filter((e) => e.inclus).map((e) => {
                    const surp = calculerSurprime(e.conditionsSante, e.dateNaissance);
                    if (surp.surprimeTotal === 0 && (e.ayantsDroit || []).every((a) => calculerSurprime(a.conditionsSante, a.naissance).surprimeTotal === 0)) return null;
                    return (
                      <div key={e.id} style={{ fontFamily: sans, fontSize: 10.5, color: C.amber }}>{e.nom} — surprime +{surp.surprimeTotal}%{surp.age >= 50 ? ` (dont âge)` : ""}</div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1 mb-2">
                  {surprimeSouscripteur.surprimeTotal > 0 && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.amber }}>{form.nom || "Souscripteur"} {form.prenom} — surprime +{surprimeSouscripteur.surprimeTotal}%</div>}
                  {beneficiaires.map((b) => {
                    const surp = calculerSurprime(b.conditionsSante, b.naissance);
                    return surp.surprimeTotal > 0 ? <div key={b.id} style={{ fontFamily: sans, fontSize: 10.5, color: C.amber }}>{b.nom} — surprime +{surp.surprimeTotal}%</div> : null;
                  })}
                </div>
              )}
              <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Total à cotiser ({nbPersonnes} personne{nbPersonnes > 1 ? "s" : ""})</span>
                <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 800, color: C.navy }}>{fmt(primeMensuelle)}</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textAlign: "right" }}>Soit {fmt(primeAnnuelle)} / an — surprimes santé/âge déjà intégrées au total.</div>
            </Card>

            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "6px 0 10px" }}>Mode de paiement retenu</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {["Mobile Money", "Carte bancaire", "Virement"].map((m) => (
                <button key={m} onClick={() => setModePaiement(m)} className="rounded-xl p-3 flex items-center justify-center gap-1.5" style={{ border: modePaiement === m ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}>
                  {m === "Mobile Money" ? <Smartphone size={14} color={C.navy2} /> : m === "Carte bancaire" ? <CreditCard size={14} color={C.navy2} /> : <Landmark size={14} color={C.navy2} />}
                  <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}>{m}</span>
                </button>
              ))}
            </div>

            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, margin: "6px 0 10px" }}>Signature électronique</div>
            <label className="flex items-start gap-2 mb-3"><input type="checkbox" checked={accepteConditions} onChange={(e) => setAccepteConditions(e.target.checked)} style={{ marginTop: 3 }} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Le souscripteur certifie l'exactitude des informations fournies et accepte les Conditions Générales du Contrat CIMA NeoGTec HealthCare.</span></label>
            <Field label="Signature — nom complet *"><input style={{ ...inputStyle, ...err(signatureNom.trim()), fontFamily: serif, fontSize: 15 }} value={signatureNom} onChange={(e) => setSignatureNom(e.target.value)} placeholder={`${form.nom} ${form.prenom}`} /></Field>
          </>
        )}

        <button onClick={creer} className="rounded-xl px-5 py-2.5 mt-5 flex items-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><FilePlus2 size={14} /> Créer le contrat</button>
      </Card>
    </>
  );
}

function GestionPolices({ session, setSession, notify }) {
  const [query, setQuery] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Toutes");
  const [selection, setSelection] = useState(null);
  const [edition, setEdition] = useState(false);
  const [draft, setDraft] = useState(null);
  const [noteVersion, setNoteVersion] = useState("");
  const [policeIndivSel, setPoliceIndivSel] = useState(null);

  const liste = session.contrats.filter((c) =>
    (filtreStatut === "Toutes" || c.statut === filtreStatut) &&
    (c.numero.toLowerCase().includes(query.toLowerCase()) || c.client.toLowerCase().includes(query.toLowerCase()))
  );
  const contrat = session.contrats.find((c) => c.id === selection);

  const texteBareme = (p) => {
    if (!p.bareme) return [];
    const lignes = ["", "BARÈME DÉTAILLÉ PAR ACTE MÉDICAL (annexe technique de la police) :"];
    p.bareme.forEach((b) => {
      lignes.push(`  ${b.cat}`);
      b.items.forEach((row) => lignes.push(`    - ${row[0]} : ${row[1]}${row[2] && row[2] !== "—" ? ` / ${row[2]}` : ""}${row[3] ? ` (${row[3]})` : ""}`));
    });
    if (p.baremeLimites?.length) { lignes.push("", "  Limites et règles particulières :"); p.baremeLimites.forEach((l) => lignes.push(`    · ${l}`)); }
    if (p.baremeExclusions?.length) { lignes.push("", "  Soins non couverts :"); p.baremeExclusions.forEach((e) => lignes.push(`    – ${e}`)); }
    return lignes;
  };

  const telechargerPolice = (p, individuelle) => {
    const nomTitulaire = individuelle ? p.titulaire?.nom : (p.typeSouscripteur === "Entreprise" ? p.souscripteur.raisonSociale : `${p.souscripteur.nom} ${p.souscripteur.prenom}`);
    const lignes = individuelle ? [
      `POLICE D'ASSURANCE INDIVIDUELLE — ${p.numeroPolice}`, `Rattachée à la police maître : ${p.rattacheePoliceMaitre}`, `Contrat associé : ${p.numeroContrat}`, `Émise le ${p.dateEmission}`, "",
      `TITULAIRE : ${nomTitulaire}${p.titulaire?.matricule ? ` (matricule ${p.titulaire.matricule})` : ""}`, `Lien avec le souscripteur : ${p.lienAvecSouscripteur}`,
      p.titulaire?.naissance ? `Né(e) le ${p.titulaire.naissance}` : "", "",
      `PÉRIODE DE VALIDITÉ : du ${p.periode.activation} au ${p.periode.expiration}`, `Statut : ${p.statut} · Signature : ${p.statutSignature}`, "",
      `FORMULE : ${p.formule || "—"}`, `GRADE / TAUX D'AFFILIATION : ${p.grade} (${p.tauxAffiliation}%)`, "",
      `GARANTIES ET PLAFONDS :`, ...p.garanties.map((g) => `  - ${g.nom} : ${fmt(g.plafond)}`),
      ...texteBareme(p),
    ] : [
      `POLICE D'ASSURANCE — ${p.numeroPolice}`, `Contrat associé : ${p.numeroContrat}`, `Émise le ${p.dateEmission}`, "",
      `TYPE DE SOUSCRIPTEUR : ${p.typeSouscripteur}`,
      p.typeSouscripteur === "Entreprise" ? `Raison sociale : ${p.souscripteur.raisonSociale}${p.quotePartEmployeur ? `\nQuote-part employeur : ${p.quotePartEmployeur}% · Quote-part employé : ${p.quotePartEmploye}%` : ""}` : `Souscripteur : ${p.souscripteur.nom} ${p.souscripteur.prenom} — né(e) le ${p.souscripteur.dateNaissance}\nPièce d'identité : ${p.souscripteur.pieceIdentite || "—"}\nTéléphone : ${p.souscripteur.telephone} · Email : ${p.souscripteur.email}\nGroupe sanguin : ${p.souscripteur.groupeSanguin || "—"} · Alertes : ${p.souscripteur.allergies || "Aucune"}\nDéclaration de santé : ${p.declarationSante || "—"}`,
      "", `FORMULE : ${p.formule || "—"} · Prime ${p.periodicitePaiement?.toLowerCase() || "mensuelle"} : ${fmt(p.primeMensuelle || 0)} · ${p.nbPersonnesCouvertes || 1} personne(s) couverte(s)`,
      `PÉRIODE DE VALIDITÉ : du ${p.periode.activation} au ${p.periode.expiration}`, `Statut de signature : ${p.statutSignature}`, `Réseau de soins : ${p.reseauSoins || "Ouvert"} · Renouvellement : ${p.renouvellementTacite ? "Tacite reconduction" : "Non reconductible"}`, "",
      `GARANTIES ET PLAFONDS (synthèse par catégorie) :`, ...p.garanties.map((g) => `  - ${g.nom} : ${fmt(g.plafond)}`),
      `Plafond global : ${fmt(p.plafondGlobal)}`, `Plafond mensuel : ${p.plafondMensuel ? fmt(p.plafondMensuel) : "Non plafonné"}`, `Franchise : ${fmt(p.franchise)}`,
      ...texteBareme(p),
      "", `GRADE / TAUX D'AFFILIATION : ${p.grade || "—"} (${p.tauxAffiliation}%)`, "",
      `CASCADE DE PAIEMENT (profil ${p.cascadeProfil === "Direct" ? "Assureur seul" : "Complet"}) :`, ...p.cascadeEtapes.map((c, i) => `  ${i + 1}. ${c}`),
      `Option dérogation en cas de rejet ou dépassement : ${p.optionDerogation ? "Oui" : "Non"}`, `Option règlement du reste par l'assuré : ${p.optionResteAChargePatient ? "Oui" : "Non"}`, "",
      `EXCLUSIONS GÉNÉRALES DU CONTRAT : ${p.exclusions}`, "",
      p.beneficiaires.length > 0 ? `BÉNÉFICIAIRES / AYANTS DROIT (taux ${p.beneficiaires[0]?.taux || 70}%) :\n${p.beneficiaires.map((b) => `  - ${b.nom} (${b.lien}) — né(e) le ${b.naissance}`).join("\n")}` : (p.nbPolicesIndividuelles > 0 ? `${p.nbPolicesIndividuelles} police(s) individuelle(s) rattachée(s) — voir liste séparée.` : "Aucun bénéficiaire déclaré."),
    ];
    downloadText(`Police_${p.numeroPolice}.txt`, lignes.filter((l) => l !== "").join("\n"));
    notify("Police téléchargée avec son barème détaillé par acte");
  };

  const enregistrerModif = async () => {
    const nouvelleVersion = { version: contrat.versions.length + 1, date: "07/07/2026", auteur: "Gestionnaire réseau", note: noteVersion || "Modification des informations contractuelles" };
    const policeMaj = contrat.police ? { ...contrat.police, plafondGlobal: draft.plafondGlobal, franchise: draft.franchise, exclusions: draft.exclusions, periode: { ...contrat.police.periode, expiration: draft.dateExpiration }, garanties: (contrat.police.garanties || []).map((g) => ({ ...g, plafond: draft.plafondGlobal })), statutSignature: draft.statutSignature, cascadeProfil: draft.cascadeProfil, reseauSoins: draft.reseauSoins, renouvellementTacite: draft.renouvellementTacite } : contrat.police;
    setSession({ ...session, contrats: session.contrats.map((c) => (c.id === contrat.id ? { ...draft, police: policeMaj, versions: [...c.versions, nouvelleVersion] } : c)) });
    const comptes = await chargerCanal(CLE_COMPTES_PARTAGES);
    const comptesMaj = comptes.map((cpt) => (cpt.donnees?.contrat === contrat.numero ? { ...cpt, donnees: { ...cpt.donnees, franchise: Number(draft.franchise) || 0, plafondGlobal: Number(draft.plafondGlobal) } } : cpt));
    await sauvegarderCanal(CLE_COMPTES_PARTAGES, comptesMaj);
    notify(`Contrat ${contrat.numero} modifié — police mise à jour automatiquement`);
    setEdition(false); setNoteVersion("");
  };
  const archiver = () => {
    const statut = contrat.statut === "Archivé" ? "Actif" : "Archivé";
    setSession({ ...session, contrats: session.contrats.map((c) => (c.id === contrat.id ? { ...c, statut, versions: [...c.versions, { version: c.versions.length + 1, date: "07/07/2026", auteur: "Gestionnaire réseau", note: statut === "Archivé" ? "Contrat archivé" : "Contrat restauré" }] } : c)) });
    notify(statut === "Archivé" ? `Contrat ${contrat.numero} archivé` : `Contrat ${contrat.numero} restauré`);
  };
  const toggleStatutPoliceIndividuelle = (numeroPolice) => {
    const policesMaj = contrat.policesIndividuelles.map((p) => (p.numeroPolice === numeroPolice ? { ...p, statut: p.statut === "Actif" ? "Suspendu" : "Actif" } : p));
    setSession({ ...session, contrats: session.contrats.map((c) => (c.id === contrat.id ? { ...c, policesIndividuelles: policesMaj, versions: [...c.versions, { version: c.versions.length + 1, date: "07/07/2026", auteur: "Gestionnaire réseau", note: `Police individuelle ${numeroPolice} — statut modifié` }] } : c)) });
  };
  const [resiliationOuverte, setResiliationOuverte] = useState(false);
  const [motifResiliation, setMotifResiliation] = useState(MOTIFS_RESILIATION[0]);
  const [dateEffetResiliation, setDateEffetResiliation] = useState("");
  const resilierContrat = async () => {
    if (!dateEffetResiliation) return;
    const resiliationInfo = { motif: motifResiliation, dateEffet: dateEffetResiliation, dateDemande: "07/07/2026", auteur: "Gestionnaire réseau" };
    setSession({
      ...session,
      contrats: session.contrats.map((c) => (c.id === contrat.id ? {
        ...c, statut: "Résilié", resiliation: resiliationInfo,
        versions: [...c.versions, { version: c.versions.length + 1, date: "07/07/2026", auteur: "Gestionnaire réseau", note: `Contrat résilié — motif : ${motifResiliation} — effet au ${dateEffetResiliation}` }],
      } : c)),
    });
    const comptes = await chargerCanal(CLE_COMPTES_PARTAGES);
    const comptesMaj = comptes.map((cpt) => (cpt.donnees?.contrat === contrat.numero ? { ...cpt, donnees: { ...cpt.donnees, statutContrat: "Résilié", resiliation: resiliationInfo } } : cpt));
    await sauvegarderCanal(CLE_COMPTES_PARTAGES, comptesMaj);
    notify(`Contrat ${contrat.numero} résilié — effet au ${dateEffetResiliation} — statut transmis à l'app du souscripteur`);
    setResiliationOuverte(false);
  };

  if (contrat) {
    return (
      <Card className="p-5">
        <button onClick={() => { setSelection(null); setEdition(false); setPoliceIndivSel(null); }} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour à la liste</button>
        <div className="flex items-center justify-between mb-4">
          <div><div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>{contrat.numero}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{contrat.client} — {contrat.type}</div></div>
          <StatusPill statut={contrat.statut === "Archivé" ? "Suspendu" : contrat.statut} />
        </div>

        {contrat.police && (
          <Card className="p-4 flex items-center justify-between mb-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
            <div>
              <div className="flex items-center gap-2"><FileSignature size={15} color={C.gold} /><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: "white" }}>Police {contrat.police.numeroPolice}</span></div>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: "#B9C3D6", marginTop: 2 }}>{contrat.police.typeSouscripteur} · émise le {contrat.police.dateEmission} · profil {contrat.cascadeProfil === "Direct" ? "Assureur seul" : "CSU + Assurance + Mutuelle"} · formule {contrat.police.formule}</div>
            </div>
            <button onClick={() => telechargerPolice(contrat.police, false)} className="rounded-lg px-3.5 py-2 flex items-center gap-1.5 flex-shrink-0" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><FileDown size={13} /> Télécharger la police</button>
          </Card>
        )}

        {contrat.police?.bareme && (
          <Accordion title={`Barème détaillé par acte — ${contrat.police.formule}`} right={<ListChecks size={13} color={C.gold} />}>
            <BaremeDetail bareme={contrat.police.bareme} limites={contrat.police.baremeLimites} exclusions={contrat.police.baremeExclusions} />
          </Accordion>
        )}

        {!edition ? (
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Activation</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{contrat.dateActivation}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Expiration</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{contrat.dateExpiration}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Bénéficiaires</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{contrat.beneficiaires}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Plafond global</div><div style={{ fontFamily: mono, fontSize: 13, color: C.gold, fontWeight: 700 }}>{fmt(contrat.plafondGlobal)}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Franchise</div><div style={{ fontFamily: mono, fontSize: 13, color: C.ink }}>{fmt(contrat.franchise)}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Prime {contrat.periodicitePaiement?.toLowerCase() || "mensuelle"}</div><div style={{ fontFamily: mono, fontSize: 13, color: C.ink, fontWeight: 700 }}>{fmt(contrat.primeMensuelle || 0)}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Statut de signature</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{contrat.statutSignature}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Profil de cascade</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{contrat.cascadeProfil === "Direct" ? "Assureur seul" : "CSU + Assurance + Mutuelle"}</div></div>
            <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Réseau de soins</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{contrat.police?.reseauSoins || "Ouvert"}</div></div>
            <div className="col-span-3"><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Exclusions</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{contrat.exclusions}</div></div>
          </div>
        ) : null}

        {!edition && contrat.cascadeEtapes?.length > 0 && (
          <Card className="p-4 mb-5" style={{ background: C.ivory, border: "none" }}>
            <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Cascade de paiement appliquée au contrat {contrat.numero}</div>
            <div className="space-y-1.5">
              {contrat.cascadeEtapes.map((etape, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 18, height: 18, background: C.navy, color: "white", fontFamily: mono, fontSize: 9.5, fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{etape}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {edition && (
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Field label="Bénéficiaires"><input style={inputStyle} value={draft.beneficiaires ?? ""} onChange={(e) => setDraft({ ...draft, beneficiaires: Number(e.target.value.replace(/\D/g, "")) })} /></Field>
            <Field label="Statut de signature"><select style={inputStyle} value={draft.statutSignature || "Brouillon"} onChange={(e) => setDraft({ ...draft, statutSignature: e.target.value })}><option>Brouillon</option><option>Signé</option></select></Field>
            <Field label="Profil de cascade"><select style={inputStyle} value={draft.cascadeProfil || "Complet"} onChange={(e) => setDraft({ ...draft, cascadeProfil: e.target.value })}><option value="Complet">CSU + Assurance + Mutuelle</option><option value="Direct">Assureur seul</option></select></Field>
            <Field label="Réseau de soins"><select style={inputStyle} value={draft.police?.reseauSoins || "Ouvert"} onChange={(e) => setDraft({ ...draft, police: { ...draft.police, reseauSoins: e.target.value } })}><option>Ouvert</option><option>Fermé</option></select></Field>
            <Field label="Renouvellement"><select style={inputStyle} value={draft.police?.renouvellementTacite ? "oui" : "non"} onChange={(e) => setDraft({ ...draft, police: { ...draft.police, renouvellementTacite: e.target.value === "oui" } })}><option value="oui">Tacite reconduction</option><option value="non">Non reconductible</option></select></Field>
            <div className="col-span-2"><Field label="Exclusions"><textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={draft.exclusions || ""} onChange={(e) => setDraft({ ...draft, exclusions: e.target.value })} /></Field></div>
            <div className="col-span-2"><Field label="Note de modification (journalisée)"><input style={inputStyle} value={noteVersion} onChange={(e) => setNoteVersion(e.target.value)} placeholder="Motif de la modification" /></Field></div>
          </div>
        )}

        <div className="flex gap-2 mb-5">
          {!edition ? (
            <button onClick={() => { setDraft(contrat); setEdition(true); }} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><SlidersHorizontal size={13} /> Modifier</button>
          ) : (
            <>
              <button onClick={() => setEdition(false)} className="rounded-xl px-4 py-2.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5 }}>Annuler</button>
              <button onClick={enregistrerModif} className="rounded-xl px-4 py-2.5" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>Enregistrer</button>
            </>
          )}
          <button onClick={archiver} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${contrat.statut === "Archivé" ? C.green : C.amber}`, color: contrat.statut === "Archivé" ? C.green : C.amber, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
            {contrat.statut === "Archivé" ? <ArchiveRestore size={13} /> : <Archive size={13} />} {contrat.statut === "Archivé" ? "Restaurer" : "Archiver"}
          </button>
          {contrat.statut !== "Résilié" && (
            <button onClick={() => setResiliationOuverte(!resiliationOuverte)} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
              <XCircle size={13} /> Résilier le contrat
            </button>
          )}
        </div>

        {contrat.statut === "Résilié" && contrat.resiliation && (
          <Card className="p-4 mb-4" style={{ background: C.redSoft, border: "none" }}>
            <div className="flex items-center gap-2 mb-1"><XCircle size={15} color={C.red} /><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.red }}>Contrat résilié</span></div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Motif : {contrat.resiliation.motif} · Effet au {contrat.resiliation.dateEffet} · Demandée le {contrat.resiliation.dateDemande} par {contrat.resiliation.auteur}</div>
          </Card>
        )}

        {resiliationOuverte && (
          <Card className="p-4 mb-4" style={{ maxWidth: 480 }}>
            <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.red, marginBottom: 10 }}>Résilier ce contrat — action définitive</div>
            <Field label="Motif de résiliation"><select style={inputStyle} value={motifResiliation} onChange={(e) => setMotifResiliation(e.target.value)}>{MOTIFS_RESILIATION.map((m) => <option key={m}>{m}</option>)}</select></Field>
            <div className="mt-3"><Field label="Date d'effet"><input type="date" style={inputStyle} value={dateEffetResiliation} onChange={(e) => setDateEffetResiliation(e.target.value)} /></Field></div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setResiliationOuverte(false)} className="rounded-lg px-4 py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12 }}>Annuler</button>
              <button onClick={resilierContrat} disabled={!dateEffetResiliation} className="rounded-lg px-4 py-2" style={{ background: !dateEffetResiliation ? "#C9CDD6" : C.red, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Confirmer la résiliation</button>
            </div>
          </Card>
        )}

        {contrat.policesIndividuelles?.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy }}>Polices individuelles rattachées ({contrat.policesIndividuelles.length})</div>
              <button onClick={() => {
                const lignes = [`RÉCAPITULATIF DES POLICES INDIVIDUELLES — Contrat ${contrat.numero}`, "=".repeat(60), ""];
                contrat.policesIndividuelles.forEach((p) => lignes.push(`${p.numeroPolice} — ${p.titulaire.nom} (${p.lienAvecSouscripteur}) — ${p.grade} — statut ${p.statut}`));
                downloadText(`Polices_individuelles_${contrat.numero}.txt`, lignes.join("\n"));
              }} className="rounded-lg px-3 py-1.5 flex items-center gap-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><FileDown size={12} /> Récapitulatif complet</button>
            </div>
            {policeIndivSel ? (
              (() => {
                const pi = contrat.policesIndividuelles.find((p) => p.numeroPolice === policeIndivSel);
                return (
                  <Card className="p-4 mb-4">
                    <button onClick={() => setPoliceIndivSel(null)} className="flex items-center gap-1.5 mb-3" style={{ fontFamily: sans, fontSize: 11, color: C.sub, fontWeight: 700 }}><ArrowLeft size={12} /> Retour à la liste des polices individuelles</button>
                    <div className="flex items-center justify-between mb-3">
                      <div><div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.navy }}>{pi.numeroPolice}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{pi.titulaire.nom} — {pi.lienAvecSouscripteur}</div></div>
                      <StatusPill statut={pi.statut} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Grade</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{pi.grade} ({pi.tauxAffiliation}%)</div></div>
                      <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Validité</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{pi.periode.activation} → {pi.periode.expiration}</div></div>
                      {pi.formule && <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Formule</div><div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{pi.formule}</div></div>}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Garanties et plafonds</div>
                    {pi.garanties.map((g) => <div key={g.nom} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{g.nom}</span><span style={{ fontFamily: mono, fontSize: 11.5, color: C.gold, fontWeight: 700 }}>{fmt(g.plafond)}</span></div>)}
                    {pi.bareme && (
                      <div className="mt-3">
                        <Accordion title="Voir le barème détaillé par acte">
                          <BaremeDetail bareme={pi.bareme} limites={pi.baremeLimites} exclusions={pi.baremeExclusions} />
                        </Accordion>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => telechargerPolice(pi, true)} className="rounded-lg px-3 py-2 flex items-center gap-1.5" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><FileDown size={12} /> Télécharger</button>
                      <button onClick={() => toggleStatutPoliceIndividuelle(pi.numeroPolice)} className="rounded-lg px-3 py-2 flex items-center gap-1.5" style={{ border: `1px solid ${pi.statut === "Actif" ? C.red : C.green}`, color: pi.statut === "Actif" ? C.red : C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{pi.statut === "Actif" ? <Ban size={12} /> : <UserCheck size={12} />} {pi.statut === "Actif" ? "Suspendre" : "Réactiver"}</button>
                    </div>
                  </Card>
                );
              })()
            ) : (
              <div className="space-y-1.5 mb-5" style={{ maxHeight: 280, overflowY: "auto" }}>
                {contrat.policesIndividuelles.map((p) => (
                  <div key={p.numeroPolice} onClick={() => setPoliceIndivSel(p.numeroPolice)} className="flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer" style={{ background: C.ivory }}>
                    <div><span style={{ fontFamily: mono, fontSize: 11, color: C.navy, fontWeight: 700 }}>{p.numeroPolice}</span><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}> — {p.titulaire.nom} <span style={{ color: C.sub }}>({p.lienAvecSouscripteur})</span></span></div>
                    <div className="flex items-center gap-2"><StatusPill statut={p.statut} /><ChevronRight size={13} color={C.sub} /></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Historique des versions (audit)</div>
        <div className="space-y-2">
          {[...contrat.versions].reverse().map((v) => (
            <Card key={v.version} className="p-3 flex items-start gap-2" style={{ background: C.ivory, border: "none" }}>
              <History size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}><b>v{v.version}</b> — {v.note}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{v.auteur} · {v.date}</div></div>
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <KpiCard icon={FileCheck} label="Total contrats" value={session.contrats.length} color={C.navy} />
        <KpiCard icon={ShieldCheck} label="Actifs" value={session.contrats.filter((c) => c.statut === "Actif").length} color={C.green} />
        <KpiCard icon={Building2} label="Entreprise" value={session.contrats.filter((c) => c.type === "Entreprise").length} color={C.navy2} />
        <KpiCard icon={UserRound} label="Individuels" value={session.contrats.filter((c) => c.type !== "Entreprise").length} color={C.gold} />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1" style={{ maxWidth: 320 }}>
          <Search size={14} color={C.sub} style={{ position: "absolute", left: 12, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="N° police ou client…" style={{ ...inputStyle, paddingLeft: 34 }} />
        </div>
        {["Toutes", "Actif", "Archivé", "Résilié"].map((f) => (
          <button key={f} onClick={() => setFiltreStatut(f)} className="rounded-full px-3 py-2" style={{ background: filtreStatut === f ? C.navy : "white", color: filtreStatut === f ? "white" : C.ink, border: `1px solid ${filtreStatut === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{f}</button>
        ))}
      </div>
      <Table columns={[{ label: "N° police" }, { label: "Client" }, { label: "Type" }, { label: "Expiration" }, { label: "Statut", align: "center" }]}>
        {liste.map((c) => (
          <tr key={c.id} onClick={() => setSelection(c.id)} className="cursor-pointer" style={{ borderBottom: `1px solid ${C.line}` }}>
            <Td style={{ fontFamily: mono, fontWeight: 700, color: C.navy }}>{c.numero}</Td>
            <Td>{c.client}</Td>
            <Td style={{ color: C.sub }}>{c.type}</Td>
            <Td>{c.dateExpiration}</Td>
            <Td align="center"><StatusPill statut={c.statut === "Archivé" ? "Suspendu" : c.statut} /></Td>
          </tr>
        ))}
        {liste.length === 0 && <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun contrat pour ce filtre.</td></tr>}
      </Table>
    </>
  );
}

function Contrats({ session, setSession, notify }) {
  const [tab, setTab] = useState("gestion");
  return (
    <div>
      <SectionTitle>Contrats</SectionTitle>
      <div className="flex gap-2 mb-4">
        {[["gestion", "Polices existantes", ClipboardList], ["creation", "Créer un contrat", FilePlus2]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}><Icon size={13} /> {l}</button>
        ))}
      </div>
      {tab === "creation" && <CreationContrat session={session} setSession={setSession} notify={notify} />}
      {tab === "gestion" && <GestionPolices session={session} setSession={setSession} notify={notify} />}
    </div>
  );
}

/* =================================================================
   SINISTRES — validation multi-étapes (agent → superviseur → finance)
================================================================= */
function buildSinistres() {
  return [
    { id: 1, numero: "SIN-2026-00147", patient: "MUKENDI Jean-Paul", contrat: "CTR-SP-2026-000482", type: "PEC directe", montant: 45000, dateSoumission: "28/06/2026", documents: ["Facture Clinique Ngaliema.pdf", "Ordonnance.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 8, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "28/06/2026" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "29/06/2026" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "30/06/2026" },
    ] },
    { id: 2, numero: "SIN-2026-00152", patient: "NGALULA Grâce", contrat: "CTR-ENT-2026-778213", type: "PEC directe", montant: 85000, dateSoumission: "06/07/2026", documents: ["Bon de prise en charge.pdf"], statut: "En attente", etape: "Agent", scoreFraude: 22, historique: [] },
    { id: 3, numero: "SIN-2026-00149", patient: "KALALA Trésor", contrat: "CTR-ENT-2026-778213", type: "Remboursement", montant: 60000, dateSoumission: "20/06/2026", documents: ["Facture.pdf", "Prescription.pdf"], statut: "En cours de validation", etape: "Superviseur", scoreFraude: 15, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "21/06/2026" },
    ] },
    { id: 4, numero: "SIN-2026-00161", patient: "KABEYA Odette", contrat: "CTR-ENT-2026-778213", type: "Remboursement", montant: 340000, dateSoumission: "05/07/2026", documents: ["Facture.pdf"], statut: "En attente", etape: "Agent", scoreFraude: 87, historique: [] },
    { id: 5, numero: "SIN-2025-00012", patient: "MUKENDI Jean-Paul", contrat: "CTR-SP-2026-000482", type: "PEC directe", montant: 32000, dateSoumission: "14/08/2025", documents: ["Facture Clinique Ngaliema.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 5, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "14/08/2025" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "15/08/2025" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "18/08/2025" },
    ] },
    { id: 6, numero: "SIN-2025-00034", patient: "ILUNGA Prisca", contrat: "CTR-ENT-2026-778213", type: "Remboursement", montant: 78000, dateSoumission: "02/10/2025", documents: ["Facture.pdf", "Ordonnance.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 11, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "03/10/2025" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "05/10/2025" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "07/10/2025" },
    ] },
    { id: 7, numero: "SIN-2025-00058", patient: "KABEYA Odette", contrat: "CTR-ENT-2026-778213", type: "PEC directe", montant: 410000, dateSoumission: "19/11/2025", documents: ["Bon de prise en charge.pdf", "Compte-rendu opératoire.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 18, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "19/11/2025" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "21/11/2025" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "25/11/2025" },
    ] },
    { id: 8, numero: "SIN-2025-00071", patient: "KALALA Trésor", contrat: "CTR-ENT-2026-778213", type: "Remboursement", montant: 25000, dateSoumission: "12/12/2025", documents: ["Facture.pdf"], statut: "Rejeté", etape: "Terminé", scoreFraude: 64, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "12/12/2025" },
      { etape: "Superviseur", statut: "Rejeté", auteur: "Odia Grace", date: "15/12/2025" },
    ] },
    { id: 9, numero: "SIN-2026-00089", patient: "NGALULA Grâce", contrat: "CTR-ENT-2026-778213", type: "PEC directe", montant: 52000, dateSoumission: "08/02/2026", documents: ["Bon de prise en charge.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 9, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "08/02/2026" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "10/02/2026" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "12/02/2026" },
    ] },
    { id: 10, numero: "SIN-2026-00104", patient: "MUKENDI Jean-Paul", contrat: "CTR-SP-2026-000482", type: "Remboursement", montant: 18000, dateSoumission: "22/03/2026", documents: ["Facture pharmacie.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 4, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "22/03/2026" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "23/03/2026" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "25/03/2026" },
    ] },
    { id: 11, numero: "SIN-2026-00121", patient: "ILUNGA Prisca", contrat: "CTR-ENT-2026-778213", type: "PEC directe", montant: 96000, dateSoumission: "17/05/2026", documents: ["Bon de prise en charge.pdf"], statut: "Approuvé", etape: "Terminé", scoreFraude: 13, historique: [
      { etape: "Agent", statut: "Approuvé", auteur: "Kalombo Faustin", date: "17/05/2026" },
      { etape: "Superviseur", statut: "Approuvé", auteur: "Odia Grace", date: "19/05/2026" },
      { etape: "Finance", statut: "Approuvé", auteur: "Odia Grace", date: "22/05/2026" },
    ] },
  ];
}

function Sinistres({ session, setSession, notify }) {
  const [filtreStatut, setFiltreStatut] = useState("Toutes");
  const [selection, setSelection] = useState(null);

  const liste = session.sinistres.filter((s) => filtreStatut === "Toutes" || s.statut === filtreStatut);
  const sinistre = session.sinistres.find((s) => s.id === selection);

  const ETAPES = ["Agent", "Superviseur", "Finance"];

  const traiter = (decision) => {
    const idxEtape = ETAPES.indexOf(sinistre.etape);
    const entreeHistorique = { etape: sinistre.etape, statut: decision === "approuver" ? "Approuvé" : "Rejeté", auteur: "Gestionnaire réseau", date: "07/07/2026" };
    let nouvelleEtape = sinistre.etape;
    let nouveauStatut = sinistre.statut;
    if (decision === "rejeter") { nouveauStatut = "Rejeté"; nouvelleEtape = "Terminé"; }
    else if (idxEtape < ETAPES.length - 1) { nouvelleEtape = ETAPES[idxEtape + 1]; nouveauStatut = "En cours de validation"; }
    else { nouvelleEtape = "Terminé"; nouveauStatut = "Approuvé"; }

    setSession({ ...session, sinistres: session.sinistres.map((s) => (s.id === sinistre.id ? { ...s, etape: nouvelleEtape, statut: nouveauStatut, historique: [...s.historique, entreeHistorique] } : s)) });
    notify(decision === "approuver" ? `Sinistre ${sinistre.numero} validé à l'étape ${sinistre.etape} — transmis à ${nouvelleEtape === "Terminé" ? "clôture" : nouvelleEtape}` : `Sinistre ${sinistre.numero} rejeté`);
    setSelection(null);
  };

  if (sinistre) {
    return (
      <Card className="p-5">
        <button onClick={() => setSelection(null)} className="flex items-center gap-1.5 mb-4" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour à la liste</button>
        <div className="flex items-center justify-between mb-4">
          <div><div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>{sinistre.numero}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{sinistre.patient} — {sinistre.contrat}</div></div>
          <StatusPill statut={sinistre.statut} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Type</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{sinistre.type}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Montant</div><div style={{ fontFamily: mono, fontSize: 15, color: C.gold, fontWeight: 800 }}>{fmt(sinistre.montant)}</div></div>
          <div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>Soumis le</div><div style={{ fontFamily: sans, fontSize: 13, color: C.ink, fontWeight: 600 }}>{sinistre.dateSoumission}</div></div>
        </div>

        {sinistre.pecUid && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ background: C.ivory }}>
            <ReceiptText size={14} color={C.navy2} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Ce sinistre correspond à la <b>PEC directe {sinistre.pecUid}</b> — le règlement se fait dans « PEC & Règlements Prestataires » une fois ce sinistre approuvé.</span>
          </div>
        )}

        <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Workflow de validation</div>
        <div className="flex items-center gap-2 mb-5">
          {ETAPES.map((e, i) => {
            const passe = sinistre.historique.some((h) => h.etape === e && h.statut === "Approuvé");
            const actuelle = sinistre.etape === e;
            return (
              <div key={e} className="flex items-center flex-1">
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: passe ? C.greenSoft : actuelle ? C.amberSoft : C.ivory }}>
                  <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: passe ? C.green : actuelle ? C.amber : C.sub }}>{e}</div>
                  {passe && <CheckCircle2 size={13} color={C.green} style={{ margin: "4px auto 0" }} />}
                </div>
                {i < ETAPES.length - 1 && <ChevronRight size={14} color={C.sub} style={{ flexShrink: 0, margin: "0 2px" }} />}
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Pièces justificatives</div>
        <div className="space-y-1.5 mb-5">
          {sinistre.documents.map((d, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: C.ivory }}><Paperclip size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{d}</span></div>
          ))}
        </div>

        {sinistre.historique.length > 0 && (
          <>
            <div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Historique horodaté</div>
            <div className="space-y-2 mb-5">
              {sinistre.historique.map((h, i) => (
                <Card key={i} className="p-3 flex items-start gap-2" style={{ background: C.ivory, border: "none" }}>
                  <GitCommit size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Étape <b>{h.etape}</b> — {h.statut} par {h.auteur}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{h.date}</div></div>
                </Card>
              ))}
            </div>
          </>
        )}

        {sinistre.etape !== "Terminé" && (
          <div className="flex gap-2">
            <button onClick={() => traiter("rejeter")} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><X size={14} /> Rejeter</button>
            <button onClick={() => traiter("approuver")} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.green, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><Check size={14} /> Valider l'étape {sinistre.etape}</button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div>
      <SectionTitle>Validation des sinistres</SectionTitle>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon={ClipboardCheck} label="En attente" value={session.sinistres.filter((s) => s.statut === "En attente").length} color={C.amber} />
        <KpiCard icon={Workflow} label="En cours de validation" value={session.sinistres.filter((s) => s.statut === "En cours de validation").length} color={C.navy2} />
        <KpiCard icon={CheckCircle2} label="Approuvés" value={session.sinistres.filter((s) => s.statut === "Approuvé").length} color={C.green} />
        <KpiCard icon={X} label="Rejetés" value={session.sinistres.filter((s) => s.statut === "Rejeté").length} color={C.red} />
      </div>
      <div className="flex gap-2 mb-4">
        {["Toutes", "En attente", "En cours de validation", "Approuvé", "Rejeté"].map((f) => (
          <button key={f} onClick={() => setFiltreStatut(f)} className="rounded-full px-3 py-2" style={{ background: filtreStatut === f ? C.navy : "white", color: filtreStatut === f ? "white" : C.ink, border: `1px solid ${filtreStatut === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{f}</button>
        ))}
      </div>
      <Table columns={[{ label: "N° sinistre" }, { label: "Patient" }, { label: "Type" }, { label: "Montant", align: "right" }, { label: "Étape" }, { label: "Statut", align: "center" }]}>
        {liste.map((s) => (
          <tr key={s.id} onClick={() => setSelection(s.id)} className="cursor-pointer" style={{ borderBottom: `1px solid ${C.line}` }}>
            <Td style={{ fontFamily: mono, fontWeight: 700, color: C.navy }}>{s.numero}</Td>
            <Td>{s.patient}</Td>
            <Td style={{ color: C.sub }}>{s.type}</Td>
            <Td align="right" style={{ fontFamily: mono, fontWeight: 700 }}>{fmt(s.montant)}</Td>
            <Td>{s.etape}</Td>
            <Td align="center"><StatusPill statut={s.statut} /></Td>
          </tr>
        ))}
        {liste.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun sinistre pour ce filtre.</td></tr>}
      </Table>
    </div>
  );
}

/* =================================================================
   CONTRÔLE & COMMUNICATION — anti-fraude + console de prévention
================================================================= */
const CLE_MESSAGES_PREVENTION = "neogtec_eco_messages_prevention_v1";
function buildMessagesPrevention() {
  return [
    { id: 1, type: "Prévention", contenu: "Pensez à vacciner vos enfants contre la polio ce mois-ci.", audience: "Chefs de famille — Kinshasa", date: "01/07/2026", statut: "Envoyé" },
  ];
}

function ControleCommunication({ session, setSession, notify }) {
  const [tab, setTab] = useState("fraude");
  return (
    <div>
      <SectionTitle>Contrôle & communication</SectionTitle>
      <div className="flex gap-2 mb-4">
        {[["fraude", "Centre anti-fraude", Radar], ["prevention", "Console de prévention", Megaphone]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}><Icon size={13} /> {l}</button>
        ))}
      </div>
      {tab === "fraude" && <CentreAntiFraude session={session} setSession={setSession} notify={notify} />}
      {tab === "prevention" && <ConsolePrevention session={session} setSession={setSession} notify={notify} />}
    </div>
  );
}

function CentreAntiFraude({ session, setSession, notify }) {
  const suspects = [...session.sinistres].filter((s) => (s.scoreFraude || 0) >= 50).sort((a, b) => b.scoreFraude - a.scoreFraude);
  const surveilles = [...session.sinistres].filter((s) => (s.scoreFraude || 0) >= 20 && (s.scoreFraude || 0) < 50);

  const marquerVerifie = (id) => {
    setSession({ ...session, sinistres: session.sinistres.map((s) => (s.id === id ? { ...s, scoreFraude: 0 } : s)), journal: [{ id: Date.now(), utilisateur: "Gestionnaire réseau", action: `Sinistre ${session.sinistres.find((s) => s.id === id)?.numero} vérifié — aucune anomalie confirmée`, date: "07/07/2026" }, ...session.journal] });
    notify("Alerte levée — sinistre marqué comme vérifié");
  };

  return (
    <>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <Radar size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Score de risque calculé automatiquement sur chaque sinistre (montants inhabituels, fréquence suspecte). Les scores ≥ 50 nécessitent une vérification prioritaire.</span>
      </Card>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <KpiCard icon={Siren} label="Alertes critiques (≥50)" value={suspects.length} color={suspects.length > 0 ? C.red : C.green} />
        <KpiCard icon={AlertTriangle} label="Sous surveillance (20-49)" value={surveilles.length} color={C.amber} />
        <KpiCard icon={ShieldCheck} label="Sinistres sains" value={session.sinistres.length - suspects.length - surveilles.length} color={C.green} />
      </div>

      {suspects.length > 0 && (
        <>
          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>Alertes critiques</div>
          <div className="space-y-2 mb-5">
            {suspects.map((s) => (
              <Card key={s.id} className="p-4" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
                <div className="flex items-center justify-between mb-1"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{s.numero} — {s.patient}</span><span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.red }}>Score {s.scoreFraude}</span></div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{s.type} · {fmt(s.montant)} · soumis le {s.dateSoumission}</div>
                <div style={{ fontFamily: sans, fontSize: 10.5, color: C.red, marginTop: 4 }}>Motif : montant significativement supérieur à la moyenne du profil de cet assuré.</div>
                <button onClick={() => marquerVerifie(s.id)} className="rounded-lg px-3 py-1.5 mt-3" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Marquer comme vérifié</button>
              </Card>
            ))}
          </div>
        </>
      )}

      {surveilles.length > 0 && (
        <>
          <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.amber, marginBottom: 8 }}>Sous surveillance</div>
          <div className="space-y-2">
            {surveilles.map((s) => (
              <Card key={s.id} className="p-3.5 flex items-center gap-3">
                <div className="flex-1"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{s.numero} — {s.patient}</span><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{fmt(s.montant)} · {s.dateSoumission}</div></div>
                <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.amber }}>Score {s.scoreFraude}</span>
              </Card>
            ))}
          </div>
        </>
      )}
      {suspects.length === 0 && surveilles.length === 0 && <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune anomalie détectée sur le réseau actuellement.</div>}
    </>
  );
}

function ConsolePrevention({ session, setSession, notify }) {
  const [form, setForm] = useState({ type: "Prévention", contenu: "", ville: "Toutes", ageMin: "", statut: "Tous" });
  const messages = session.messagesPrevention || [];

  const envoyer = async () => {
    if (!form.contenu) return;
    const audience = `${form.statut !== "Tous" ? form.statut + " — " : ""}${form.ville === "Toutes" ? "Tout le réseau" : form.ville}${form.ageMin ? ` · ${form.ageMin}+ ans` : ""}`;
    const message = { id: Date.now(), type: form.type, contenu: form.contenu, audience, ville: form.ville, date: "07/07/2026", statut: "Envoyé" };
    setSession({ ...session, messagesPrevention: [message, ...messages] });
    const partages = await chargerCanal(CLE_MESSAGES_PREVENTION);
    await sauvegarderCanal(CLE_MESSAGES_PREVENTION, [message, ...partages]);
    notify("Message diffusé sur l'app mobile des assurés ciblés");
    setForm({ type: "Prévention", contenu: "", ville: "Toutes", ageMin: "", statut: "Tous" });
  };

  return (
    <>
      <Card className="p-4 flex items-start gap-2 mb-4" style={{ background: C.ivory, border: "none" }}>
        <Megaphone size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Éditeur de contenu pour diffuser des messages de prévention, d'alerte santé ou des offres directement sur l'app mobile Assuré.</span>
      </Card>
      <Card className="p-5 mb-5" style={{ maxWidth: 640 }}>
        <div className="flex gap-2 mb-4">
          {["Prévention", "Alerte santé", "Publicité"].map((t) => (
            <button key={t} onClick={() => setForm({ ...form, type: t })} className="rounded-xl px-3.5 py-2 flex-1" style={{ background: form.type === t ? C.navy : C.ivory, color: form.type === t ? "white" : C.ink, fontFamily: sans, fontWeight: 700, fontSize: 12 }}>{t}</button>
          ))}
        </div>
        <Field label="Contenu du message"><textarea style={{ ...inputStyle, minHeight: 80, resize: "none" }} value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })} placeholder="Ex : Pensez à vacciner vos enfants contre la polio ce mois-ci." /></Field>
        <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, margin: "16px 0 8px" }}>Audience ciblée</div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Ville"><select style={inputStyle} value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })}><option>Toutes</option><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
          <Field label="Âge minimum"><input style={inputStyle} value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 18" /></Field>
          <Field label="Statut"><select style={inputStyle} value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}><option>Tous</option><option>Chefs de famille</option><option>Assurés entreprise</option></select></Field>
        </div>
        <button onClick={envoyer} disabled={!form.contenu} className="rounded-xl px-5 py-2.5 mt-4 flex items-center gap-2" style={{ background: form.contenu ? C.navy : "#C9CDD6", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><Send size={14} /> Diffuser sur l'app mobile</button>
      </Card>

      <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Messages diffusés</div>
      <div className="space-y-2">
        {messages.map((m) => (
          <Card key={m.id} className="p-3.5">
            <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }}>{m.type}</span><span style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{m.date}</span></div>
            <div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, marginTop: 3 }}>{m.contenu}</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 4 }}>Audience : {m.audience}</div>
          </Card>
        ))}
        {messages.length === 0 && <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun message diffusé pour l'instant.</div>}
      </div>
    </>
  );
}
