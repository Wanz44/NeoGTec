import React, { useState } from "react";
import { LocalDB } from "../../lib/localDatabase";
import {
  ScanLine, ScanFace, QrCode, Camera, Stethoscope, FileText, Wallet, Receipt, Bell,
  Settings, ArrowLeft, Search, ChevronRight, ChevronDown, Home, LayoutDashboard,
  ClipboardList, CreditCard, Loader2, Phone, Mail, MapPin, Download, Plus, Trash2,
  UserCheck, Percent, Calendar, Landmark, Smartphone, ShieldCheck, ShieldAlert,
  ThumbsUp, ThumbsDown, MessageSquare, X, Send, RefreshCw, Filter, CircleDollarSign,
  Building2, LogOut, Check, CheckCircle2, AlertTriangle, FileWarning, Lock, UserPlus,
  Users, TrendingUp, Pill, Building, Fingerprint, ClipboardCheck, History, BadgeCheck,
  FlaskConical, Syringe, FileClock, Upload, FileDown, FileCheck, FileX, UserCog, Video,
  TrendingDown, XCircle, Users2, NotebookPen, ScrollText, Zap, SlidersHorizontal,
  FileSpreadsheet, FolderOpen, Activity, Siren, Hash, Tag, CalendarClock,
  CalendarPlus, UserRound, Ticket, Boxes, ScanBarcode, KeyRound, PackageCheck,
  MessageCircle, Coins, Banknote, ArrowLeftRight, Package, AlertOctagon,
  PauseCircle, HandCoins, Maximize, Calculator, MinusCircle, PlusCircle,
  HeartPulse, Thermometer, Ruler, Layers, Heart, Scissors, Dna, Paperclip, PenLine,
  VideoOff, Mic, MicOff, Wifi, PhoneOff, AlertCircle, Clock3, PanelLeftClose, PanelLeftOpen, Eye, EyeOff, ChevronUp, BookOpen,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/* ---------------------------------------------------------------
   TOKENS — cohérents avec l'écosystème NeoGTec HealthCare
------------------------------------------------------------------ */
const C = {
  navy: "#0D2818", navy2: "#1B4A34", gold: "#C6992E", goldSoft: "#EFDFB8",
  ivory: "#F6F3EC", ink: "#1A1B1E", sub: "#6B6F76", line: "#E7E2D6",
  green: "#2F8A5B", greenSoft: "#E7F3EC", amber: "#C0392B", amberSoft: "#FBEAE8",
  red: "#C0392B", redSoft: "#FBEAE8",
};
const serif = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif";
const mono = "ui-monospace,'SF Mono',Menlo,monospace";
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ") + " CDF";

/* ---------------------------------------------------------------
   DONNÉES — établissement, garanties, tarifs, patients, dérogations, règlements
------------------------------------------------------------------ */
const ETABLISSEMENT_DEMO = {
  nom: "Clinique Ngaliema", type: "Hôpital de référence", commune: "Gombe, Kinshasa",
  adresse: "Avenue de la Justice", telephone: "+243 81 500 00 00", email: "facturation@ngaliema-clinique.cd",
  numeroAgrement: "NGT-PREST-2026-004821", responsable: "Dr. Kalonji Mbuyi — Médecin Directeur",
  csuEligible: true,
};

const GARANTIES_TARIF = [
  { nom: "Consultations & Pharmacie", tarifConventionne: 15000 },
  { nom: "Hospitalisation", tarifConventionne: 150000 },
  { nom: "Dentaire", tarifConventionne: 20000 },
  { nom: "Optique", tarifConventionne: 100000 },
  { nom: "Maternité", tarifConventionne: 400000 },
];

/* Catalogue universel des soins — nomenclature standardisée inter-établissements */
function buildCatalogueSoins() {
  return [
    { code: "CONS-001", libelle: "Consultation médecine générale", garantie: "Consultations & Pharmacie", tarifConventionne: 15000, tarifNegocie: 15000, isZeroBon: false },
    { code: "CONS-002", libelle: "Consultation spécialiste", garantie: "Consultations & Pharmacie", tarifConventionne: 25000, tarifNegocie: 25000, isZeroBon: false },
    { code: "CONS-003", libelle: "Consultation d'urgence (nuit/week-end)", garantie: "Consultations & Pharmacie", tarifConventionne: 35000, tarifNegocie: 35000, isZeroBon: false },
    { code: "PHAR-001", libelle: "Délivrance de médicaments sur ordonnance", garantie: "Consultations & Pharmacie", tarifConventionne: 15000, tarifNegocie: 15000, isZeroBon: false },
    { code: "LABO-001", libelle: "Analyse de laboratoire courante", garantie: "Consultations & Pharmacie", tarifConventionne: 20000, tarifNegocie: 20000, isZeroBon: false },
    { code: "IMAG-001", libelle: "Imagerie (radio, échographie)", garantie: "Consultations & Pharmacie", tarifConventionne: 45000, tarifNegocie: 45000, isZeroBon: false },
    { code: "HOSP-001", libelle: "Journée d'hospitalisation (chambre commune)", garantie: "Hospitalisation", tarifConventionne: 150000, tarifNegocie: 150000, isZeroBon: false },
    { code: "HOSP-002", libelle: "Bloc opératoire & anesthésie", garantie: "Hospitalisation", tarifConventionne: 400000, tarifNegocie: 400000, isZeroBon: false },
    { code: "DENT-001", libelle: "Soins dentaires conservateurs", garantie: "Dentaire", tarifConventionne: 20000, tarifNegocie: 20000, isZeroBon: false },
    { code: "DENT-002", libelle: "Extraction dentaire", garantie: "Dentaire", tarifConventionne: 25000, tarifNegocie: 25000, isZeroBon: false },
    { code: "OPHT-001", libelle: "Consultation ophtalmologique + monture/verres", garantie: "Optique", tarifConventionne: 100000, tarifNegocie: 100000, isZeroBon: false },
    { code: "MATE-001", libelle: "Suivi prénatal (CPN)", garantie: "Maternité", tarifConventionne: 40000, tarifNegocie: 40000, isZeroBon: true },
    { code: "MATE-002", libelle: "Accouchement voie basse", garantie: "Maternité", tarifConventionne: 400000, tarifNegocie: 400000, isZeroBon: false },
    { code: "MATE-003", libelle: "Césarienne", garantie: "Maternité", tarifConventionne: 700000, tarifNegocie: 700000, isZeroBon: false },
    { code: "MATE-004", libelle: "Suivi post-partum (jusqu'à 1 mois après l'accouchement)", garantie: "Maternité", tarifConventionne: 25000, tarifNegocie: 25000, isZeroBon: true },
  ];
}

const CASCADE = [
  { ordre: 1, payeur: "CSU — Couverture Santé Universelle", taux: "100% — maternité uniquement (seul volet effectif à ce jour)" },
  { ordre: 2, payeur: "Assurance Privée NeoGTec HealthCare", taux: "90 / 80 / 70% selon grade — 1er payeur hors maternité" },
  { ordre: 3, payeur: "Mutuelle complémentaire", taux: "Variable" },
  { ordre: 4, payeur: "Reste à charge — Assuré", taux: "Solde final" },
];
const AUJOURDHUI = new Date(2026, 6, 15); // 15/07/2026
function parseDateFr(dateStr) {
  const [j, m, a] = dateStr.split("/").map(Number);
  return new Date(a, m - 1, j);
}
const DELAIS_CARENCE = { "Consultations & Pharmacie": 0, "Hospitalisation": 30, "Dentaire": 60, "Optique": 60, "Maternité": 300 };
function statutCarence(garantie, dateActivationStr) {
  const jours = DELAIS_CARENCE[garantie] ?? 0;
  if (jours === 0 || !dateActivationStr) return { enCarence: false, joursRestants: 0 };
  const activation = parseDateFr(dateActivationStr);
  const joursEcoules = Math.floor((AUJOURDHUI - activation) / (1000 * 60 * 60 * 24));
  const joursRestants = jours - joursEcoules;
  return { enCarence: joursRestants > 0, joursRestants: Math.max(0, joursRestants), joursTotal: jours };
}

/* =================================================================
   SYNCHRONISATION INTER-APPS — stockage partagé (window.storage)
   Permet à une dérogation soumise ici d'être vue et traitée par
   l'app Entreprise (RH), et inversement pour le statut retour.
================================================================= */
const CLE_DEROGATIONS_PARTAGEES = "neogtec_eco_derogations_v1";
const CLE_TARIFS_PARTAGES = "neogtec_eco_tarifs_v1";
const CLE_ALERTES_TARIFS = "neogtec_eco_alertes_tarifs_v1";

async function publierTarifsPartages(etablissement, catalogue) {
  try {
    const res = await window.storage.get(CLE_TARIFS_PARTAGES, true);
    const tous = res?.value ? JSON.parse(res.value) : {};
    tous[etablissement] = { catalogue, dateMaj: "07/07/2026" };
    await window.storage.set(CLE_TARIFS_PARTAGES, JSON.stringify(tous), true);
  } catch (e) { /* stockage indisponible — l'app continue de fonctionner localement */ }
}
async function publierAlerteTarif(alerte) {
  try {
    const res = await window.storage.get(CLE_ALERTES_TARIFS, true);
    const toutes = res?.value ? JSON.parse(res.value) : [];
    await window.storage.set(CLE_ALERTES_TARIFS, JSON.stringify([alerte, ...toutes].slice(0, 200)), true);
  } catch (e) { /* stockage indisponible */ }
}
async function chargerTarifsPartages(etablissement) {
  try {
    const res = await window.storage.get(CLE_TARIFS_PARTAGES, true);
    const tous = res?.value ? JSON.parse(res.value) : {};
    return tous[etablissement]?.catalogue || null;
  } catch (e) {
    return null;
  }
}

const CLE_TELECONSULTATIONS_PARTAGEES = "neogtec_eco_teleconsultations_v1";
async function chargerTeleconsultationsPartagees() {
  try {
    const res = await window.storage.get(CLE_TELECONSULTATIONS_PARTAGEES, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}
async function publierStatutTeleconsultation(uid, champs) {
  if (!uid) return;
  try {
    const res = await window.storage.get(CLE_TELECONSULTATIONS_PARTAGEES, true);
    const toutes = res?.value ? JSON.parse(res.value) : [];
    const maj = toutes.map((t) => (t.uid === uid ? { ...t, ...champs } : t));
    await window.storage.set(CLE_TELECONSULTATIONS_PARTAGEES, JSON.stringify(maj), true);
  } catch (e) { /* stockage indisponible */ }
}

const CLE_PEC_PARTAGEES = "neogtec_eco_pec_v1";
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
async function chargerCanalPartage(cle) {
  try {
    const res = await window.storage.get(cle, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}
async function chargerPecPartagees() {
  try {
    const res = await window.storage.get(CLE_PEC_PARTAGEES, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}
async function sauvegarderPecPartagees(liste) {
  try {
    await window.storage.set(CLE_PEC_PARTAGEES, JSON.stringify(liste), true);
  } catch (e) { /* stockage indisponible */ }
}

async function chargerDerogationsPartagees() {
  try {
    const res = await window.storage.get(CLE_DEROGATIONS_PARTAGEES, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}
async function sauvegarderDerogationsPartagees(liste) {
  try {
    await window.storage.set(CLE_DEROGATIONS_PARTAGEES, JSON.stringify(liste), true);
  } catch (e) { /* stockage indisponible — l'app continue de fonctionner localement */ }
}

function computeVentilation(montant, tauxAssurance, zeroBon, garantie, csuEligible = false, franchise = 0) {
  const m = Number(montant) || 0;
  if (zeroBon) return { csu: 0, assurance: m, resteACharge: 0, mutuelle: 0, zeroBon: true, franchiseAppliquee: 0 };
  if (garantie === "Maternité" && csuEligible) {
    // Couverture Santé Universelle : gratuité maternité, effective uniquement dans les établissements
    // sélectionnés par l'État (14 provinces sur 26 à ce jour) — pas dans tous les hôpitaux. Pas de franchise sur la CSU.
    return { csu: m, assurance: 0, resteACharge: 0, mutuelle: 0, csuMaternite: true, franchiseAppliquee: 0 };
  }
  // Hors maternité, ou établissement non sélectionné pour la gratuité CSU — l'assurance/mutuelle et le patient financent.
  // La franchise s'applique par sinistre : le patient la paie intégralement avant toute répartition sur le solde.
  const franchiseAppliquee = Math.min(Math.max(0, Number(franchise) || 0), m);
  const montantApresFranchise = m - franchiseAppliquee;
  const assurance = Math.round(montantApresFranchise * (tauxAssurance / 100));
  const resteACharge = montantApresFranchise - assurance + franchiseAppliquee;
  return { csu: 0, assurance, resteACharge, mutuelle: resteACharge, franchiseAppliquee };
}

/* Patient type retrouvé lors d'un scan (persona cohérente avec l'app Assuré) */
function buildPatientDemo() {
  return {
    nom: "MUKENDI Jean-Paul", carte: "SP-KIN-000482-00", police: "SP-KIN-000482", contrat: "CTR-SP-2026-000482",
    souscripteur: "MUKENDI Jean-Paul (assuré principal)",
    formule: "Confort Famille", taux: 80, photo: "https://i.pravatar.cc/200?img=51",
    grade: "Agent / Employé", statutPolice: "Actif", validite: "01/02/2026 — 31/12/2026",
    garanties: [
      { nom: "Consultations & Pharmacie", plafond: 1800000, consomme: 245000 },
      { nom: "Hospitalisation", plafond: 8000000, consomme: 0 },
      { nom: "Dentaire", plafond: 500000, consomme: 80000 },
      { nom: "Optique", plafond: 300000, consomme: 0 },
      { nom: "Maternité", plafond: 2500000, consomme: 0 },
    ],
  };
}
const AUTRES_PATIENTS = [
  { nom: "NGALULA Grâce", carte: "MC-EMP-0005-00", police: "MC-EMP-0005", contrat: "CTR-ENT-2026-778213", souscripteur: "MININGCO SARL (Entreprise)", formule: "Essentiel", taux: 70, photo: "https://i.pravatar.cc/200?img=32", statutPolice: "Actif", validite: "01/01/2026 — 31/12/2026",
    garanties: [{ nom: "Consultations & Pharmacie", plafond: 900000, consomme: 860000 }, { nom: "Hospitalisation", plafond: 4000000, consomme: 0 }, { nom: "Dentaire", plafond: 200000, consomme: 0 }, { nom: "Optique", plafond: 150000, consomme: 0 }, { nom: "Maternité", plafond: 1000000, consomme: 0 }] },
  { nom: "KABEYA Odette", carte: "MC-EMP-0002-00", police: "MC-EMP-0002", contrat: "CTR-ENT-2026-778213", souscripteur: "MININGCO SARL (Entreprise)", formule: "Confort", taux: 90, photo: "https://i.pravatar.cc/200?img=45", statutPolice: "Suspendu", validite: "01/01/2026 — 31/12/2026",
    garanties: [{ nom: "Consultations & Pharmacie", plafond: 1800000, consomme: 1750000 }, { nom: "Hospitalisation", plafond: 8000000, consomme: 0 }, { nom: "Dentaire", plafond: 500000, consomme: 0 }, { nom: "Optique", plafond: 300000, consomme: 0 }, { nom: "Maternité", plafond: 2500000, consomme: 0 }] },
];

function buildSoins() {
  return [
    { id: 1, patientNom: "MUKENDI Jean-Paul", patientCarte: "SP-KIN-000482-00", date: "28/06/2026", type: "PEC directe", garantie: "Consultations & Pharmacie", montant: 45000, vent: computeVentilation(45000, 80, false, "Consultations & Pharmacie"), statutReglement: "Réglé" },
    { id: 2, patientNom: "NGALULA Grâce", patientCarte: "MC-EMP-0005-00", date: "05/07/2026", type: "PEC directe", garantie: "Consultations & Pharmacie", montant: 85000, vent: computeVentilation(85000, 70, false, "Consultations & Pharmacie"), statutReglement: "En attente" },
    { id: 3, patientNom: "TSHIBANGU Alain", patientCarte: "MC-EMP-0001-00", date: "02/07/2026", type: "PEC directe", garantie: "Hospitalisation", montant: 320000, vent: computeVentilation(320000, 100, false, "Hospitalisation"), statutReglement: "En attente" },
    { id: 4, patientNom: "KALALA Trésor", patientCarte: "MC-EMP-0006-00", date: "20/06/2026", type: "Remboursement", garantie: "Dentaire", montant: 60000, vent: computeVentilation(60000, 70, false, "Dentaire"), statutReglement: "Réglé" },
  ];
}

function buildDerogationsPrestataire() {
  return [
    { id: 1, patientNom: "NGALULA Grâce", destinataire: "Entreprise (RH souscripteur)", souscripteur: "MININGCO SARL (Entreprise)", motif: "Urgence chirurgicale — appendicite", montantDemande: 85000, plafondRestant: 2000, dateEnvoi: "06/07/2026", statut: "En attente" },
    { id: 2, patientNom: "MUKENDI Jean-Paul", destinataire: "Assuré principal (police individuelle/familiale)", souscripteur: "Police individuelle SP-KIN-000482", motif: "Soins dentaires urgents hors plafond restant", montantDemande: 45000, plafondRestant: 15000, dateEnvoi: "01/07/2026", statut: "Approuvée", traitePar: "MUKENDI Jean-Paul (souscripteur)" },
    { id: 3, patientNom: "TSHIBANGU Alain", destinataire: "Entreprise (RH souscripteur)", souscripteur: "MININGCO SARL (Entreprise)", motif: "Bilan de santé complet hors nomenclature conventionnée", montantDemande: 95000, plafondRestant: 60000, dateEnvoi: "29/06/2026", statut: "Refusée", traitePar: "NGOYI Beatrice (RH)" },
  ];
}

function buildReglements() {
  return [
    { id: 1, periode: "Semaine du 30/06 au 06/07/2026", type: "PEC directe", nbActes: 12, montantFacture: 620000, montantCSU: 55800, montantAssurance: 440076, resteACharge: 124124, statut: "En attente", dateEcheancePrevue: "13/07/2026" },
    { id: 2, periode: "Semaine du 23/06 au 29/06/2026", type: "PEC directe", nbActes: 18, montantFacture: 940000, montantCSU: 84600, montantAssurance: 667212, resteACharge: 188188, statut: "Réglé", dateReglement: "02/07/2026" },
    { id: 3, periode: "Semaine du 16/06 au 22/06/2026", type: "Remboursement", nbActes: 15, montantFacture: 780000, montantCSU: 70200, montantAssurance: 553644, resteACharge: 156156, statut: "Réglé", dateReglement: "25/06/2026" },
    { id: 4, periode: "Semaine du 09/06 au 15/06/2026", type: "PEC directe", nbActes: 9, montantFacture: 410000, montantCSU: 36900, montantAssurance: 291018, resteACharge: 82082, statut: "En retard", dateEcheancePrevue: "22/06/2026" },
    { id: 5, periode: "Mai 2026", type: "PEC directe", nbActes: 61, montantFacture: 2870000, montantCSU: 258300, montantAssurance: 2037126, resteACharge: 574574, statut: "Réglé", dateReglement: "05/06/2026" },
    { id: 6, periode: "Avril 2026", type: "PEC directe", nbActes: 54, montantFacture: 2510000, montantCSU: 225900, montantAssurance: 1781598, resteACharge: 502502, statut: "Réglé", dateReglement: "07/05/2026" },
    { id: 7, periode: "Mars 2026", type: "PEC directe", nbActes: 48, montantFacture: 2190000, montantCSU: 197100, montantAssurance: 1554462, resteACharge: 438438, statut: "Réglé", dateReglement: "04/04/2026" },
    { id: 8, periode: "Février 2026", type: "PEC directe", nbActes: 41, montantFacture: 1860000, montantCSU: 167400, montantAssurance: 1320228, resteACharge: 372372, statut: "Réglé", dateReglement: "06/03/2026" },
    { id: 9, periode: "Janvier 2026", type: "PEC directe", nbActes: 37, montantFacture: 1640000, montantCSU: 147600, montantAssurance: 1164072, resteACharge: 328328, statut: "Réglé", dateReglement: "05/02/2026" },
    { id: 10, periode: "Décembre 2025", type: "PEC directe", nbActes: 45, montantFacture: 2050000, montantCSU: 184500, montantAssurance: 1455090, resteACharge: 410410, statut: "Réglé", dateReglement: "08/01/2026" },
    { id: 11, periode: "Novembre 2025", type: "PEC directe", nbActes: 33, montantFacture: 1480000, montantCSU: 133200, montantAssurance: 1050504, resteACharge: 296296, statut: "Réglé", dateReglement: "04/12/2025" },
    { id: 12, periode: "Octobre 2025", type: "PEC directe", nbActes: 29, montantFacture: 1290000, montantCSU: 116100, montantAssurance: 915642, resteACharge: 258258, statut: "Réglé", dateReglement: "06/11/2025" },
    { id: 13, periode: "Septembre 2025", type: "PEC directe", nbActes: 24, montantFacture: 1070000, montantCSU: 96300, montantAssurance: 759486, resteACharge: 214214, statut: "Réglé", dateReglement: "03/10/2025" },
    { id: 14, periode: "Août 2025", type: "PEC directe", nbActes: 19, montantFacture: 840000, montantCSU: 75600, montantAssurance: 596232, resteACharge: 168168, statut: "Réglé", dateReglement: "05/09/2025" },
    { id: 15, periode: "Juillet 2025", type: "PEC directe", nbActes: 14, montantFacture: 610000, montantCSU: 54900, montantAssurance: 432978, resteACharge: 122122, statut: "Réglé", dateReglement: "04/08/2025" },
  ];
}

/* Dossiers patients affiliés — accès rapide plafonds, historique, notes */
function buildPatientsAffilies() {
  const p1 = buildPatientDemo();
  return [
    { ...p1, telemedecine: 2, dossier: {
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
      notes: [{ id: 1, date: "28/06/2026", auteur: "Dr. Kalonji Mbuyi", texte: "Patient stable, contrôle dans 2 semaines." }],
    } },
    { ...AUTRES_PATIENTS[0], telemedecine: 0, dossier: {
      constantesVitales: {},
      allergies: [], maladiesChroniques: [], traitementsEnCours: [], antecedentsChirurgicaux: [], antecedentsFamiliaux: [],
      visites: [{ date: "05/07/2026", motif: "Fièvre persistante", diagnostic: "Paludisme", prescripteur: "Dr. Kalonji Mbuyi", examens: [], imagerie: [], ordonnance: { medicaments: ["Artéméther-Luméfantrine — cure complète"], statut: "Active" }, vaccinations: [], documents: [] }],
      notes: [],
    } },
    { ...AUTRES_PATIENTS[1], telemedecine: 1, dossier: {
      constantesVitales: {},
      allergies: ["Arachides"], maladiesChroniques: [], traitementsEnCours: [], antecedentsChirurgicaux: [], antecedentsFamiliaux: [],
      visites: [],
      notes: [],
    } },
  ];
}

/* Équipe & rôles */
function buildEquipe() {
  return [
    { id: 1, nom: "Dr. Kalonji Mbuyi", role: "Médecin", email: "kalonji@ngaliema-clinique.cd", statut: "Actif" },
    { id: 2, nom: "Mireille Katanga", role: "Comptable", email: "m.katanga@ngaliema-clinique.cd", statut: "Actif" },
    { id: 3, nom: "Patrick Ilunga", role: "Administrateur", email: "p.ilunga@ngaliema-clinique.cd", statut: "Actif" },
  ];
}
const ROLES = [
  { id: "medecin", nom: "Médecin", permissions: "Dossiers patients, PEC, notes médicales" },
  { id: "comptable", nom: "Comptable", permissions: "Règlements, factures, exports" },
  { id: "administrateur", nom: "Administrateur", permissions: "Accès complet, gestion de l'équipe" },
];

function buildJournal() {
  return [
    { id: 1, utilisateur: "Dr. Kalonji Mbuyi", action: "PEC soumise pour MUKENDI Jean-Paul", date: "07/07/2026 09:14" },
    { id: 2, utilisateur: "Mireille Katanga", action: "Relevé du 23/06 consulté", date: "06/07/2026 16:02" },
    { id: 3, utilisateur: "Patrick Ilunga", action: "Nouveau membre ajouté à l'équipe", date: "05/07/2026 11:20" },
  ];
}

const CRENEAUX_TELEMED = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"];

/* Stock pharmacie — médicaments conventionnés */
function buildStockPharmacie() {
  return [
    { id: 1, nom: "Paracétamol 500mg (boîte 20)", code: "PHAR-001", stock: 84, seuilAlerte: 20, prixUnitaire: 3500 },
    { id: 2, nom: "Amoxicilline 500mg (boîte 12)", code: "PHAR-001", stock: 12, seuilAlerte: 15, prixUnitaire: 8500 },
    { id: 3, nom: "Artéméther-Luméfantrine (cure)", code: "PHAR-001", stock: 6, seuilAlerte: 10, prixUnitaire: 12000 },
    { id: 4, nom: "Amlodipine 5mg (boîte 30)", code: "PHAR-001", stock: 41, seuilAlerte: 15, prixUnitaire: 9000 },
    { id: 5, nom: "Sérum physiologique 500ml", code: "PHAR-001", stock: 3, seuilAlerte: 10, prixUnitaire: 4500 },
  ];
}

/* Messagerie — médecin conseil (validations "bon") */
function buildConversations() {
  return [
    { id: 1, sujet: "Validation bon — NGALULA Grâce", contexte: "Dérogation urgence chirurgicale 85 000 CDF", statut: "En cours", messages: [
      { id: 1, auteur: "Dr. Kalonji Mbuyi", moi: true, texte: "Bonjour Docteur, je sollicite une validation rapide pour une appendicite en urgence, plafond patient épuisé.", date: "09:02" },
      { id: 2, auteur: "Médecin conseil NeoGTec", moi: false, texte: "Reçu. Pouvez-vous confirmer le diagnostic et joindre le compte-rendu ?", date: "09:06" },
      { id: 3, auteur: "Dr. Kalonji Mbuyi", moi: true, texte: "Diagnostic confirmé par échographie. Compte-rendu en pièce jointe du dossier patient.", date: "09:09" },
    ] },
    { id: 2, sujet: "Question tarif — Bloc opératoire", contexte: "Code HOSP-002", statut: "Résolu", messages: [
      { id: 1, auteur: "Mireille Katanga", moi: true, texte: "Le tarif négocié HOSP-002 a-t-il changé ce trimestre ?", date: "Hier 14:10" },
      { id: 2, auteur: "Médecin conseil NeoGTec", moi: false, texte: "Non, il reste à 400 000 CDF jusqu'à fin d'année.", date: "Hier 14:22" },
    ] },
  ];
}

function buildTeleconsultations() {
  return [
    { id: 1, patientNom: "MUKENDI Jean-Paul", medecin: "Dr. Kalonji Mbuyi", date: "08/07/2026", heure: "09:00", statut: "Programmée" },
    { id: 2, patientNom: "NGALULA Grâce", medecin: "Dr. Kalonji Mbuyi", date: "05/07/2026", heure: "15:00", statut: "Terminée" },
  ];
}

const CONSO_HEBDO = [
  { semaine: "S1", montant: 620000 }, { semaine: "S2", montant: 780000 }, { semaine: "S3", montant: 940000 },
  { semaine: "S4", montant: 705000 }, { semaine: "S5", montant: 860000 }, { semaine: "S6", montant: 620000 },
];
const CONSO_MENSUELLE = [
  { mois: "Fév", montant: 2450000 }, { mois: "Mar", montant: 2890000 }, { mois: "Avr", montant: 3120000 },
  { mois: "Mai", montant: 2760000 }, { mois: "Juin", montant: 3340000 }, { mois: "Juil", montant: 620000 },
];

/* ---------------------------------------------------------------
   PRIMITIVES (cohérentes avec les apps Assuré & Entreprise)
------------------------------------------------------------------ */
function Ring({ pct, size = 44, stroke = 5, color = C.gold }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c - (Math.min(pct, 100) / 100) * c;
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
  React.useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="absolute left-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{ bottom: 84, background: C.navy, color: "white", fontFamily: sans, fontSize: 13, animation: "riseIn .25s ease" }}>
      <CheckCircle2 size={16} color={C.gold} /><span>{message}</span>
    </div>
  );
}
function StatusPill({ statut }) {
  const map = {
    "Actif": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Réglé": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Approuvée": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Résolu": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Suspendu": { bg: C.redSoft, fg: C.red, icon: Lock },
    "Refusée": { bg: C.redSoft, fg: C.red, icon: X },
    "En attente": { bg: C.amberSoft, fg: C.amber, icon: Loader2 },
    "Ouvert": { bg: C.amberSoft, fg: C.amber, icon: Loader2 },
  };
  const s = map[statut] || map["En attente"], Icon = s.icon;
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: s.bg, color: s.fg, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Icon size={11} /> {statut}</span>;
}
function SectionLabel({ children }) { return <div className="px-5 pt-5 pb-2 font-bold uppercase tracking-widest" style={{ color: C.sub, fontFamily: sans, fontSize: 11 }}>{children}</div>; }
function Card({ children, style, className = "", onClick }) { return <div onClick={onClick} className={`rounded-2xl bg-white ${className}`} style={{ border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,38,68,0.04)", ...style }}>{children}</div>; }
function Field({ label, children }) { return <div><div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>{children}</div>; }
const inputStyle = { width: "100%", fontFamily: sans, fontSize: 13, color: C.ink, background: C.ivory, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", outline: "none", boxSizing: "border-box" };
function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function telechargerDocument(nomFichier, contexte) {
  downloadText(nomFichier, `Document : ${nomFichier}\n${contexte}\n\nCe fichier a été transmis via NeoGTec HealthCare.`);
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
function VentilationBar({ vent, montant }) {
  const total = montant || (vent.csu + vent.assurance + vent.resteACharge) || 1;
  const seg = (v, color) => <div style={{ width: `${(v / total) * 100}%`, background: color, height: "100%" }} />;
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-full" style={{ height: 8, background: C.line }}>
        {seg(vent.csu, C.navy2)}{seg(vent.assurance, C.gold)}{seg(vent.resteACharge, C.red)}
      </div>
      <div className="flex justify-between mt-1.5">
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.navy2 }}>● CSU {fmt(vent.csu)}</span>
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.gold }}>● Assurance {fmt(vent.assurance)}</span>
        <span style={{ fontFamily: sans, fontSize: 9.5, color: C.red }}>● Reste {fmt(vent.resteACharge)}</span>
      </div>
      {vent.franchiseAppliquee > 0 && (
        <div className="flex items-center gap-1 mt-1"><Percent size={9} color={C.sub} /><span style={{ fontFamily: sans, fontSize: 9, color: C.sub }}>Dont franchise contractuelle par sinistre : {fmt(vent.franchiseAppliquee)} (incluse dans le reste à charge)</span></div>
      )}
    </div>
  );
}

/* Photo de profil de l'assuré réutilisable */
function PatientAvatar({ nom, photo, size = 32, className = "" }) {
  const defaultPhoto = photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
  return (
    <div className={`rounded-full overflow-hidden flex-shrink-0 border border-amber-500/30 shadow-xs ${className}`} style={{ width: size, height: size, minWidth: size, minHeight: size }}>
      <img src={defaultPhoto} alt={nom || "Assuré"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

/* Modal Dossier Médical Complet du Patient */
function DossierMedicalCompletModal({ patient, session, setSession, notify, onClose }) {
  const p = patient || {};
  const dossier = p.dossier || {
    constantesVitales: { tension: "120/80", frequenceCardiaque: "72 bpm", temperature: "36.8°C", taille: "175 cm", poids: "70 kg", imc: "22.8", groupeSanguin: "O+" },
    allergies: ["Pénicilline", "Arachides"],
    maladiesChroniques: ["Hypertension Artérielle"],
    traitementsEnCours: [{ nom: "Amlodipine 5mg", posologie: "1 comprimé le matin", depuis: "01/02/2025" }],
    antecedentsChirurgicaux: [{ intervention: "Appendicectomie", etablissement: "Clinique Ngaliema", date: "2018" }],
    antecedentsFamiliaux: ["Diabète type 2 (Père)", "HTA (Mère)"],
    visites: [
      {
        date: "08/07/2026", heure: "09:00", motif: "Consultation générale & Suivi", diagnostic: "Syndrome fébril léger", prescripteur: "Dr. Kalonji Mbuyi",
        examens: [{ nom: "Goutte épaisse (Paludisme)", resultat: "Négatif", statut: "Normal" }],
        imagerie: [{ type: "Radiologie Thoracique", conclusion: "Parenchyme pulmonaire sain", etablissement: "Clinique Ngaliema" }],
        ordonnance: { medicaments: ["Paracétamol 1g (3x/jour pendant 5j)", "Vitamine C 1000mg"], statut: "Active" },
        vaccinations: [{ nom: "Fièvre Jaune" }, { nom: "Hépatite B" }]
      }
    ],
    notes: [{ id: 1, date: "08/07/2026", auteur: "Dr. Kalonji Mbuyi", texte: "Dossier vérifié lors de la téléconsultation. Patient réceptif." }]
  };

  const [noteTexte, setNoteTexte] = useState("");

  const ajouterNote = () => {
    if (!noteTexte.trim()) return;
    const nouvelleNote = { id: Date.now(), date: "Aujourd'hui", auteur: session?.etablissement?.responsable || "Médecin Praticien", texte: noteTexte.trim() };
    if (setSession && session) {
      const pMaj = (session.patientsAffilies || []).map((x) => x.nom === p.nom ? { ...x, dossier: { ...x.dossier, notes: [nouvelleNote, ...(x.dossier?.notes || [])] } } : x);
      setSession({ ...session, patientsAffilies: pMaj });
    }
    setNoteTexte("");
    if (notify) notify("Note médicale ajoutée au dossier");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        <div className="p-5 bg-[#0D2818] text-white flex items-center justify-between sticky top-0 z-20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-stone-300 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <PatientAvatar nom={p.nom} photo={p.photo} size={44} />
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                {p.nom || "Dossier Médical Patient"}
                <BadgeCheck size={16} className="text-[#C6992E]" />
              </h3>
              <p className="text-xs text-stone-300 font-mono">
                Carte N° {p.carte || "SP-KIN-000482"} · {p.age || "38"} ans · {p.sexe || "M"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-stone-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <Card className="p-4 bg-[#F6F3EC] border-amber-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">Souscripteur & Couverture</span>
              <p className="text-xs font-bold text-[#0D2818]">{p.souscripteur || "MININGCO SARL"}</p>
              <p className="text-[11px] text-stone-600">Formule : Confort Tiers-Payant (Plafond rest. 1 850 000 CDF)</p>
            </div>
            <StatusPill statut={p.statut || "Actif"} />
          </Card>

          <div>
            <SectionLabel>Constantes vitales & examens physiques</SectionLabel>
            <Card className="p-4 grid grid-cols-3 gap-3 text-center bg-stone-50">
              <div><HeartPulse size={16} className="text-[#1B4A34] mx-auto" /><div className="text-[10px] text-stone-500 mt-1">Tension</div><div className="font-mono text-xs font-bold text-stone-800">{dossier.constantesVitales?.tension || "120/80"}</div></div>
              <div><Activity size={16} className="text-[#1B4A34] mx-auto" /><div className="text-[10px] text-stone-500 mt-1">Pouls</div><div className="font-mono text-xs font-bold text-stone-800">{dossier.constantesVitales?.frequenceCardiaque || "72 bpm"}</div></div>
              <div><Thermometer size={16} className="text-[#1B4A34] mx-auto" /><div className="text-[10px] text-stone-500 mt-1">Température</div><div className="font-mono text-xs font-bold text-stone-800">{dossier.constantesVitales?.temperature || "36.8 °C"}</div></div>
              <div><Ruler size={16} className="text-[#1B4A34] mx-auto" /><div className="text-[10px] text-stone-500 mt-1">Taille</div><div className="font-mono text-xs font-bold text-stone-800">{dossier.constantesVitales?.taille || "175 cm"}</div></div>
              <div><Layers size={16} className="text-[#1B4A34] mx-auto" /><div className="text-[10px] text-stone-500 mt-1">Poids / IMC</div><div className="font-mono text-xs font-bold text-stone-800">{dossier.constantesVitales?.poids || "72 kg"} ({dossier.constantesVitales?.imc || "23.5"})</div></div>
              <div><Heart size={16} className="text-[#1B4A34] mx-auto" /><div className="text-[10px] text-stone-500 mt-1">Groupe Sanguin</div><div className="font-mono text-xs font-bold text-emerald-700">{dossier.constantesVitales?.groupeSanguin || "O Rh+"}</div></div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-4 border-rose-200 bg-rose-50/50">
              <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle size={14} /> Allergies signalées
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(dossier.allergies?.length > 0 ? dossier.allergies : ["Pénicilline", "Arachides"]).map((a, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    ⚠️ {a}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-4 border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <HeartPulse size={14} /> Maladies chroniques
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(dossier.maladiesChroniques?.length > 0 ? dossier.maladiesChroniques : ["Hypertension Artérielle"]).map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    🩺 {m}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <SectionLabel>Traitements & Médications en cours</SectionLabel>
            <div className="space-y-2">
              {(dossier.traitementsEnCours?.length > 0 ? dossier.traitementsEnCours : [
                { nom: "Amlodipine 5mg", posologie: "1 comprimé/jour le matin", depuis: "01/02/2025" },
                { nom: "Oméprazole 20mg", posologie: "1 gélule le soir au coucher", depuis: "10/06/2026" }
              ]).map((t, i) => (
                <Card key={i} className="p-3.5 flex items-center gap-3">
                  <Pill size={16} className="text-[#1B4A34]" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0D2818]">{t.nom}</p>
                    <p className="text-[11px] text-stone-600">{t.posologie}</p>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Depuis {t.depuis}</span>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Historique des consultations & visites</SectionLabel>
            <div className="space-y-3">
              {(dossier.visites?.length > 0 ? dossier.visites : [
                {
                  date: "28/06/2026", motif: "Suivi HTA & Bilan", diagnostic: "Tension contrôlée", prescripteur: "Dr. Kalonji Mbuyi",
                  ordonnance: { medicaments: ["Amlodipine 5mg — 30 jours", "Contrôle dans 1 mois"], statut: "Active" }
                }
              ]).map((v, i) => (
                <Card key={i} className="p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-mono text-xs font-bold text-[#0D2818]">{v.date} {v.heure ? `à ${v.heure}` : ""}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFDFB8] text-[#0D2818]">{v.motif}</span>
                  </div>
                  {v.diagnostic && <p className="text-xs text-stone-800">Diagnostic : <b>{v.diagnostic}</b></p>}
                  {v.prescripteur && <p className="text-[11px] text-stone-500">Praticien : {v.prescripteur}</p>}
                  {v.ordonnance && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 mt-2 text-xs">
                      <p className="font-bold text-stone-700 mb-1 flex items-center gap-1"><Pill size={12} /> Ordonnance :</p>
                      <ul className="list-disc list-inside text-stone-600 space-y-0.5 text-[11px]">
                        {v.ordonnance.medicaments.map((m, j) => <li key={j}>{m}</li>)}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Notes médicales & remarques du médecin</SectionLabel>
            <Card className="p-3 mb-2">
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={noteTexte} onChange={(e) => setNoteTexte(e.target.value)} placeholder="Ajouter une observation au dossier médical du patient…" />
              <button onClick={ajouterNote} disabled={!noteTexte.trim()} className="w-full rounded-xl py-2 mt-2 flex items-center justify-center gap-2 bg-[#0D2818] text-white text-xs font-bold disabled:opacity-50 cursor-pointer">
                <NotebookPen size={14} /> Ajouter la note au dossier
              </button>
            </Card>
            <div className="space-y-2">
              {(dossier.notes || []).map((n) => (
                <Card key={n.id} className="p-3 bg-stone-50">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0D2818]">
                    <span>{n.auteur}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{n.date}</span>
                  </div>
                  <p className="text-xs text-stone-700 mt-1">{n.texte}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between sticky bottom-0 rounded-b-3xl">
          <span className="text-xs text-stone-500">NeoGTec DME · Dossier Médical Électronique Sécurisé</span>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-[#0D2818] text-white font-bold text-xs cursor-pointer">
            Fermer le dossier
          </button>
        </div>
      </div>
    </div>
  );
}

/* Modal Relevé Détaillé de l'Assuré */
function ModalReleveAssureDetail({ releve, session, onClose, notify }) {
  const r = releve || {};
  const patientNom = r.patientNom || "MUKENDI Jean-Paul";
  const patientObj = (session?.patientsAffilies || []).find((p) => p.nom === patientNom) || {
    nom: patientNom,
    carte: "SP-KIN-000482-00",
    souscripteur: "MININGCO SARL",
    statut: "Actif",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  };

  const actesDetail = r.actesDetail || [
    { date: "23/06/2026", code: "CONS-001", libelle: "Consultation Médecine Générale", montant: 25000, csu: 15000, assurance: 7500, reste: 2500 },
    { date: "24/06/2026", code: "LABO-004", libelle: "NFS + Goutte Épaisse", montant: 35000, csu: 21000, assurance: 10500, reste: 3500 },
    { date: "26/06/2026", code: "PHAR-001", libelle: "Artéméther-Luméfantrine + Paracétamol", montant: 45000, csu: 27000, assurance: 13500, reste: 4500 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        <div className="p-5 bg-[#0D2818] text-white flex items-center justify-between sticky top-0 z-20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-stone-300 cursor-pointer">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                Relevé Détaillé de l'Assuré
                <BadgeCheck size={16} className="text-[#C6992E]" />
              </h3>
              <p className="text-xs text-stone-300 font-mono">Période : {r.periode || "Du 23/06 au 29/06/2026"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-stone-300 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <Card className="p-5 bg-[#F6F3EC] border-[#C6992E]/40 flex flex-col md:flex-row items-center gap-4">
            <PatientAvatar nom={patientObj.nom} photo={patientObj.photo} size={64} />
            <div className="flex-1 text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h4 className="font-serif text-base font-bold text-[#0D2818]">{patientObj.nom}</h4>
                <StatusPill statut={patientObj.statut || "Actif"} />
              </div>
              <p className="font-mono text-xs text-stone-600 font-bold">
                N° Carte : {patientObj.carte || "SP-KIN-000482-00"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-2 border-t border-stone-300/60 mt-2">
                <div>Souscripteur : <b>{patientObj.souscripteur || "MININGCO SARL"}</b></div>
                <div>Formule : <b>Confort (80% Tiers-Payant)</b></div>
                <div>Etablissement : <b>{session?.etablissement?.nom || "Clinique Ngaliema"}</b></div>
                <div>Plafond consommé : <b className="text-amber-800">150 000 CDF / 2 000 000 CDF</b></div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <Card className="p-3 bg-stone-50">
              <span className="text-[10px] font-bold uppercase text-stone-500">Montant Total</span>
              <p className="font-mono text-xs font-extrabold text-[#0D2818] mt-1">{fmt(r.montantFacture || 105000)}</p>
            </Card>
            <Card className="p-3 bg-emerald-50/60 border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Part CSU</span>
              <p className="font-mono text-xs font-extrabold text-emerald-800 mt-1">{fmt(r.montantCSU || 63000)}</p>
            </Card>
            <Card className="p-3 bg-amber-50/60 border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-800">Part Assurance</span>
              <p className="font-mono text-xs font-extrabold text-amber-900 mt-1">{fmt(r.montantAssurance || 31500)}</p>
            </Card>
            <Card className="p-3 bg-rose-50/60 border-rose-200">
              <span className="text-[10px] font-bold uppercase text-rose-700">Reste Patient</span>
              <p className="font-mono text-xs font-extrabold text-rose-800 mt-1">{fmt(r.resteACharge || 10500)}</p>
            </Card>
          </div>

          <div>
            <SectionLabel>Décompte ventilé des actes du relevé</SectionLabel>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0D2818] text-white text-[10px] font-bold uppercase">
                      <th className="p-3">Date</th>
                      <th className="p-3">Acte & Code</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-right text-emerald-300">CSU</th>
                      <th className="p-3 text-right text-amber-300">Assurance</th>
                      <th className="p-3 text-right text-rose-300">Reste</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {actesDetail.map((act, i) => (
                      <tr key={i} className="hover:bg-stone-50">
                        <td className="p-3 text-stone-600 font-sans">{act.date}</td>
                        <td className="p-3 font-sans">
                          <p className="font-bold text-[#0D2818]">{act.libelle}</p>
                          <span className="text-[10px] text-stone-500">{act.code}</span>
                        </td>
                        <td className="p-3 text-right font-bold text-[#0D2818]">{fmt(act.montant)}</td>
                        <td className="p-3 text-right font-bold text-emerald-700">{fmt(act.csu)}</td>
                        <td className="p-3 text-right font-bold text-amber-800">{fmt(act.assurance)}</td>
                        <td className="p-3 text-right font-bold text-rose-700">{fmt(act.reste)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-stone-50 space-y-2 border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Statut de la réconciliation :</span>
              <StatusPill statut={r.statut || "Réglé"} />
            </div>
            <p className="text-[11px] text-stone-600">
              Virement bancaire / Mobile Money exécuté · Réf : <b>VIR-2026-089421-NG</b>
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200 text-[10px] text-stone-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Sceau d'authenticité numérique certifié par le protocole NeoGTec HealthCare.</span>
            </div>
          </Card>
        </div>

        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-wrap gap-2 items-center justify-between sticky bottom-0 rounded-b-3xl">
          <button onClick={() => {
            downloadText(`Releve_Assure_${patientObj.nom.replace(/\s+/g, "_")}.txt`,
              `RELEVÉ DE PRISE EN CHARGE - NEOGTEC HEALTHCARE\n\nAssuré : ${patientObj.nom}\nN° Carte : ${patientObj.carte}\nSouscripteur : ${patientObj.souscripteur}\nPériode : ${r.periode}\n\nTotal Facturé : ${fmt(r.montantFacture)}\nPart CSU : ${fmt(r.montantCSU)}\nPart Assurance : ${fmt(r.montantAssurance)}\nReste Patient : ${fmt(r.resteACharge)}\nStatut : ${r.statut}\n`
            );
            if (notify) notify("Relevé de l'assuré téléchargé en PDF");
          }} className="px-4 py-2 rounded-xl bg-[#0D2818] text-white font-bold text-xs flex items-center gap-2 cursor-pointer">
            <FileDown size={14} /> Télécharger le Relevé (PDF)
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const start = (e) => { e.preventDefault(); drawingRef.current = true; const canvas = canvasRef.current; const ctx = canvas.getContext("2d"); const { x, y } = getPos(e, canvas); ctx.beginPath(); ctx.moveTo(x, y); };
  const move = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d"); const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y); ctx.strokeStyle = C.navy; ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.stroke();
    hasDrawnRef.current = true;
  };
  const end = () => { if (!drawingRef.current) return; drawingRef.current = false; if (hasDrawnRef.current) onChange(true, canvasRef.current.toDataURL()); };
  const clear = () => { canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); hasDrawnRef.current = false; onChange(false, ""); };
  return (
    <div>
      <canvas ref={canvasRef} width={300} height={110} style={{ width: "100%", height: 110, background: "white", borderRadius: 10, border: `1.5px dashed ${C.line}`, touchAction: "none", cursor: "crosshair" }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
      <button type="button" onClick={clear} className="mt-1.5 flex items-center gap-1.5" style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, fontWeight: 700 }}><RefreshCw size={10} /> Effacer la signature</button>
    </div>
  );
}


function SignUp({ onDone, onGoSignIn }) {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", motDePasse: "", confirmation: "" });
  const [erreur, setErreur] = useState("");
  const valider = () => {
    if (!form.nom || !form.email || !form.telephone || !form.motDePasse) { setErreur("Veuillez remplir tous les champs."); return; }
    if (form.motDePasse.length < 6) { setErreur("Le mot de passe doit contenir au moins 6 caractères."); return; }
    if (form.motDePasse !== form.confirmation) { setErreur("Les mots de passe ne correspondent pas."); return; }
    setErreur("");
    try {
      LocalDB.creerCompte({
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        motDePasse: form.motDePasse,
        role: 'prestataire',
        roleLibelle: 'Prestataire de Soins / Hôpital',
        statut: 'Actif',
        carteCode: `PRES-${Math.floor(100000 + Math.random() * 900000)}`,
        biometrieActivee: true,
        biometrieFaceRegistered: false
      });
    } catch (e) {
      console.warn("LocalDB register error", e);
    }
    onDone(form);
  };
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-14 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 60, height: 60, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><Stethoscope size={26} color={C.gold} /></div>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: "white", letterSpacing: 1, marginTop: 12 }}>NEOGTEC HEALTHCARE — PRESTATAIRE</div>
          <div style={{ fontFamily: serif, fontSize: 19, color: "white", marginTop: 8 }}>Créer un compte établissement</div>
        </div>
        <div className="space-y-2.5">
          <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom du responsable / gestionnaire" />
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email professionnel" />
          <input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" />
          <input style={inputStyle} type="password" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} placeholder="Mot de passe (6 caractères min.)" />
          <input style={inputStyle} type="password" value={form.confirmation} onChange={(e) => setForm({ ...form, confirmation: e.target.value })} placeholder="Confirmer le mot de passe" />
          {erreur && <div className="flex items-center gap-1.5" style={{ color: "#FFB4B0" }}><AlertTriangle size={12} /><span style={{ fontFamily: sans, fontSize: 11 }}>{erreur}</span></div>}
        </div>
      </div>
      <div className="w-full space-y-3">
        <button onClick={valider} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}><UserPlus size={16} /> Créer le compte</button>
        <button onClick={onGoSignIn} className="w-full text-center py-2" style={{ fontFamily: sans, fontSize: 12.5, color: "white" }}>Déjà un compte ? <span style={{ color: C.gold, fontWeight: 700 }}>Se connecter</span></button>
      </div>
    </div>
  );
}

async function trouverCompteReelPrestataire(identifiant, motDePasse) {
  try {
    const localAccounts = LocalDB.getComptes();
    const matchLocal = localAccounts.find(c => c.role === 'prestataire' && (c.email.toLowerCase() === identifiant.toLowerCase() || c.id === identifiant) && (!c.motDePasse || c.motDePasse === motDePasse));
    if (matchLocal) {
      return {
        compte: {
          nom: matchLocal.nom,
          telephone: matchLocal.telephone,
          donnees: {
            type: "Hôpital / Clinique", commune: "Kinshasa", adresse: "Adresse Etablissement", telephone: matchLocal.telephone, email: matchLocal.email, numeroAgrement: matchLocal.carteCode, responsable: matchLocal.nom, csuEligible: true
          }
        },
        personne: { email: matchLocal.email, nom: matchLocal.nom, role: matchLocal.roleLibelle },
        estResponsable: true
      };
    }
  } catch (e) {}

  const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
  for (const compte of comptes) {
    if (compte.type !== "prestataire") continue;
    for (const a of (compte.acces || [])) {
      if (a.email && a.email.toLowerCase() === identifiant.toLowerCase() && a.motDePasseProvisoire === motDePasse) {
        return { compte, personne: a, estResponsable: true };
      }
    }
    for (const a of (compte.accesMobile || [])) {
      if (a.email && a.email.toLowerCase() === identifiant.toLowerCase() && a.motDePasseProvisoire === motDePasse) {
        return { compte, personne: a, estResponsable: false };
      }
    }
  }
  return null;
}
function construireSessionReellePrestataire(match) {
  const { compte, personne, estResponsable } = match;
  const d = compte.donnees || {};
  return {
    etablissement: {
      nom: compte.nom, type: d.type || "Hôpital / Clinique", commune: d.commune || "—",
      adresse: d.adresse || "—", telephone: d.telephone || compte.telephone || "—", email: personne.email,
      numeroAgrement: d.numeroAgrement || "—", responsable: d.responsable || personne.nom, csuEligible: !!d.csuEligible,
    },
    soins: buildSoins(), derogations: buildDerogationsPrestataire(), reglements: buildReglements(),
    patientsAffilies: buildPatientsAffilies(), equipe: buildEquipe(), journal: buildJournal(),
    catalogue: buildCatalogueSoins(), teleconsultations: buildTeleconsultations(),
    stockPharmacie: buildStockPharmacie(), conversations: buildConversations(),
    notifPrefs: { sms: true, email: true, push: true }, alertes: [],
    compteReel: true, roleConnexion: estResponsable ? "Administrateur du compte" : (personne.role || "Personnel"),
  };
}

function SignIn({ prefill, onDone, onGoSignUp }) {
  const [form, setForm] = useState({ identifiant: prefill?.email || "", motDePasse: "" });
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  // Mode Mot de Passe Oublié
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const valider = async () => {
    if (!form.identifiant || !form.motDePasse) { setErreur("Veuillez saisir vos identifiants."); return; }
    setErreur(""); setLoading(true);
    const match = await trouverCompteReelPrestataire(form.identifiant, form.motDePasse);
    setLoading(false);
    onDone(match ? construireSessionReellePrestataire(match) : null);
  };

  const handleSendResetCode = (e) => {
    e.preventDefault();
    if (!forgotEmail) { setForgotError("Veuillez saisir votre email d'établissement."); return; }
    setForgotError("");
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep(2);
      setForgotSuccess("Un code de vérification à 6 chiffres a été envoyé à votre adresse hôpital/clinique.");
    }, 800);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length < 4) { setForgotError("Veuillez entrer le code de sécurité reçu."); return; }
    if (!newPassword || newPassword.length < 4) { setForgotError("Le mot de passe doit comporter au moins 4 caractères."); return; }
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
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div className="w-full max-w-4xl bg-[#0D2818]/95 border border-[#C6992E]/40 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col md:flex-row overflow-hidden text-white">
        
        {/* Panneau Latéral Gauche (Aperçu Espace) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#06140B] via-[#0A1F13] to-[#0F2D1C] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C6992E]/30 relative">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center text-[#C6992E] shadow-inner">
                <Stethoscope size={26} color={C.gold} />
              </div>
              <div>
                <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: C.gold, letterSpacing: 1.5, textTransform: "uppercase" }} className="block">
                  NeoGTec insur
                </span>
                <span className="text-xs text-[#B9C3D6] font-medium">Portail Prestataires de Santé</span>
              </div>
            </div>

            <h3 style={{ fontFamily: serif, fontSize: 22, color: "white", fontWeight: 700, lineHeight: 1.3 }} className="mb-4">
              Authentification Prestataire
            </h3>

            <p style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", lineHeight: 1.6 }} className="mb-6">
              Bénéficiez d'un processus de connexion sécurisé, rapide et conforme aux normes d'audit ARCA-RDC les plus strictes.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#C6992E] shrink-0 mt-0.5" />
                <span className="text-xs text-[#E7E2D6]">Vérification Biométrique & QR Code</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#C6992E] shrink-0 mt-0.5" />
                <span className="text-xs text-[#E7E2D6]">Demandes de Prise en Charge (PEC) 1-Clic</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#C6992E] shrink-0 mt-0.5" />
                <span className="text-xs text-[#E7E2D6]">Bordereaux de Facturation & Règlements</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#B9C3D6]">Réseau Agréé Hôpitaux & Cliniques</span>
            <span className="text-[10px] bg-[#C6992E]/20 text-[#C6992E] px-2.5 py-1 rounded-full border border-[#C6992E]/30 font-semibold">ARCA-RDC</span>
          </div>
        </div>

        {/* Panneau Principal Droit (Formulaire & Mot de Passe Oublié) */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-[#0A1F13]/80">
          {!forgotMode ? (
            <div>
              <div className="mb-6">
                <h2 style={{ fontFamily: serif, fontSize: 22, color: "white", fontWeight: 700 }}>
                  Se connecter à Espace Prestataire
                </h2>
                <p style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", marginTop: 4 }}>
                  Connectez votre établissement de santé à l'écosystème NeoGTec insur.
                </p>
              </div>

              {/* Bouton SSO Google Simulation */}
              <button
                type="button"
                onClick={() => fillTestAccount("clinique@sante.cd", "123456")}
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
                  OU UTILISER LE COURRIEL
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
                      placeholder="paul@neogtec.com"
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
                    <AlertTriangle size={15} className="shrink-0" />
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
                      onClick={() => fillTestAccount("clinique@sante.cd", "123456")}
                      className="w-full p-2 rounded-xl bg-white/5 hover:bg-[#C6992E]/20 text-left flex items-center justify-between text-stone-200 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-white">Centre Médical La Grace (Clinique)</div>
                        <div className="text-[11px] text-[#B9C3D6]">clinique@sante.cd</div>
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
                  {loading ? "Connexion en cours…" : "Se connecter à l'Espace Prestataire"}
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
                    Mot de passe oublié Prestataire
                  </h2>
                  <p style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", marginTop: 4 }}>
                    Réinitialisez l'accès sécurisé de votre établissement médical.
                  </p>
                </div>

                {forgotStep === 1 && (
                  <form onSubmit={handleSendResetCode} className="space-y-4">
                    <div>
                      <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                        EMAIL PROFESSIONNEL ÉTABLISSEMENT
                      </label>
                      <div className="relative">
                        <input
                          style={inputStyle}
                          className="pl-9"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="ex : clinique@sante.cd"
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
                      {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Envoyer le code de sécurité"}
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
                        CODE DE SÉCURITÉ (6 CHIFFRES)
                      </label>
                      <input
                        style={inputStyle}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        placeholder="ex: 741829"
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.gold }} className="block mb-1">
                        NOUVEAU MOT DE PASSE ÉTABLISSEMENT
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
                      {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Réinitialiser le mot de passe"}
                    </button>
                  </form>
                )}

                {forgotStep === 3 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Accès Établissement Réinitialisé !</h3>
                    <p className="text-xs text-[#B9C3D6] max-w-xs mx-auto">
                      Le mot de passe de votre compte Prestataire a été mis à jour avec succès.
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
    </div>
  );
}

/* =================================================================
   BIENVENUE
================================================================= */
function Welcome({ onCreer, onDemo, onAccederExistant, hasSession }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div className="w-full max-w-md bg-[#0A1F13]/90 md:bg-[#0D2818]/95 border border-[#C6992E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between items-center text-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 72, height: 72, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><Stethoscope size={34} color={C.gold} /></div>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: C.gold, letterSpacing: 1.5, textTransform: "uppercase" }}>NeoGTec insur</div>
          <div style={{ fontFamily: serif, fontSize: 22, color: "white", marginTop: 8, lineHeight: 1.3, fontWeight: 700 }}>Espace Prestataire</div>
          <div style={{ fontFamily: sans, fontSize: 12.5, color: "#B9C3D6", marginTop: 10, maxWidth: 300 }}>Identifiez vos patients par QR code ou reconnaissance faciale, soumettez vos PEC, suivez vos règlements et vos demandes de dérogation.</div>
        </div>
        <div className="w-full space-y-3 mt-8">
          {hasSession && (
            <button onClick={onAccederExistant} className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg cursor-pointer" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}><LayoutDashboard size={16} /> Accéder à mon espace</button>
          )}
          <button onClick={onCreer} className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors" style={hasSession ? { border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 } : { background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}><Building2 size={16} /> Enregistrer mon établissement</button>
          <button onClick={onDemo} className="w-full rounded-2xl py-3.5 cursor-pointer hover:bg-white/10 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>Voir la démo (Clinique Ngaliema)</button>
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   ONBOARDING — enregistrement de l'établissement
================================================================= */
function OnboardingEtablissement({ onFinish, onCancel }) {
  const [step, setStep] = useState(0);
  const [infos, setInfos] = useState({ nom: "", type: "Hôpital / Clinique", commune: "", adresse: "", telephone: "", email: "", numeroAgrement: "", responsable: "", specialites: "", latitude: "", longitude: "", csuEligible: false });
  const [creating, setCreating] = useState(false);
  const [recherche, setRecherche] = useState("idle"); // idle | loading | trouve | absent
  const titles = ["Établissement", "Confirmation"];

  const rechercherEnregistrement = async () => {
    if (!infos.nom.trim()) return;
    setRecherche("loading");
    const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
    const match = comptes.find((c) => c.type === "prestataire" && c.nom.toLowerCase().trim() === infos.nom.toLowerCase().trim());
    if (match?.donnees) {
      const d = match.donnees;
      setInfos({
        nom: match.nom, type: d.type || infos.type, commune: d.commune || "", adresse: d.adresse || "",
        telephone: d.telephone || "", email: d.email || "", numeroAgrement: d.numeroAgrement || "",
        responsable: d.responsable || "", specialites: d.specialites || "", latitude: String(d.latitude ?? ""), longitude: String(d.longitude ?? ""),
        csuEligible: !!d.csuEligible,
      });
      setRecherche("trouve");
    } else {
      setRecherche("absent");
    }
  };

  const activer = () => {
    setCreating(true);
    setTimeout(() => {
      onFinish({
        etablissement: { ...infos },
        soins: [], derogations: [], reglements: [], patientsAffilies: [], equipe: [], journal: [], notifPrefs: { sms: true, email: true, push: true }, catalogue: buildCatalogueSoins(), teleconsultations: [], stockPharmacie: buildStockPharmacie(), conversations: [],
        alertes: [{ id: 1, type: "info", titre: "Bienvenue chez NeoGTec HealthCare", detail: "Scannez votre premier patient pour commencer", gravite: "info" }],
      });
    }, 1200);
  };

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
        <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Enregistrer l'établissement</div>
        <button onClick={onCancel} style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Annuler</button>
      </div>
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center gap-1.5">{titles.map((t, i) => <div key={i} className="flex-1 rounded-full" style={{ height: 4, background: i <= step ? C.gold : C.line }} />)}</div>
        <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 6 }}>Étape {step + 1} / {titles.length} — {titles[step]}</div>
      </div>

      {step === 0 && (
        <>
          <div className="px-5 space-y-3">
            <Field label="Nom de l'établissement">
              <div className="flex gap-2">
                <input style={{ ...inputStyle, flex: 1 }} value={infos.nom} onChange={(e) => { setInfos({ ...infos, nom: e.target.value }); setRecherche("idle"); }} placeholder="Clinique Ngaliema" />
                <button onClick={rechercherEnregistrement} disabled={!infos.nom.trim() || recherche === "loading"} className="rounded-xl px-3 flex items-center gap-1" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {recherche === "loading" ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />} Vérifier
                </button>
              </div>
            </Field>
            {recherche === "trouve" && <div className="flex items-center gap-1.5 p-2.5 rounded-lg" style={{ background: "#EAF6EF" }}><CheckCircle2 size={13} color={C.green} /><span style={{ fontFamily: sans, fontSize: 11, color: C.green, fontWeight: 700 }}>Établissement déjà pré-enregistré par l'assureur — champs remplis automatiquement.</span></div>}
            {recherche === "absent" && <div className="flex items-center gap-1.5 p-2.5 rounded-lg" style={{ background: C.ivory }}><AlertTriangle size={13} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Aucun enregistrement trouvé chez l'assureur — complétez les champs manuellement.</span></div>}
            <Field label="Type d'établissement">
              <select style={inputStyle} value={infos.type} onChange={(e) => setInfos({ ...infos, type: e.target.value })}>
                <option>Hôpital / Clinique</option><option>Pharmacie</option><option>Cabinet médical</option><option>Laboratoire / Centre d'imagerie</option><option>Centre dentaire</option>
              </select>
            </Field>
            <Field label="Commune / Ville"><input style={inputStyle} value={infos.commune} onChange={(e) => setInfos({ ...infos, commune: e.target.value })} placeholder="Gombe, Kinshasa" /></Field>
            <Field label="Adresse"><input style={inputStyle} value={infos.adresse} onChange={(e) => setInfos({ ...infos, adresse: e.target.value })} placeholder="Avenue de la Justice" /></Field>
            <Field label="N° d'agrément"><input style={inputStyle} value={infos.numeroAgrement} onChange={(e) => setInfos({ ...infos, numeroAgrement: e.target.value })} placeholder="NGT-PREST-2026-..." /></Field>
            <Field label="Responsable"><input style={inputStyle} value={infos.responsable} onChange={(e) => setInfos({ ...infos, responsable: e.target.value })} placeholder="Nom du médecin directeur / gérant" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone"><input style={inputStyle} value={infos.telephone} onChange={(e) => setInfos({ ...infos, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
              <Field label="Email"><input style={inputStyle} type="email" value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })} placeholder="contact@etablissement.cd" /></Field>
            </div>
            <Field label="Spécialités / catégories de soins"><input style={inputStyle} value={infos.specialites} onChange={(e) => setInfos({ ...infos, specialites: e.target.value })} placeholder="Chirurgie, maternité, dentaire…" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude (géolocalisation)"><input style={inputStyle} value={infos.latitude} onChange={(e) => setInfos({ ...infos, latitude: e.target.value.replace(/[^0-9.\-]/g, "") })} placeholder="Ex : -4.3224" /></Field>
              <Field label="Longitude (géolocalisation)"><input style={inputStyle} value={infos.longitude} onChange={(e) => setInfos({ ...infos, longitude: e.target.value.replace(/[^0-9.\-]/g, "") })} placeholder="Ex : 15.3075" /></Field>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: C.ivory }}>
              <MapPin size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Ces coordonnées permettent à l'app Assuré de vous localiser du plus proche au plus éloigné.</span>
            </div>
          </div>
          <div className="px-5 mt-3">
            <button onClick={() => setStep(1)} disabled={!infos.nom || !infos.responsable} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: (!infos.nom || !infos.responsable) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>Continuer <ChevronRight size={15} /></button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="px-5">
            <Card className="p-4 mb-3">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Récapitulatif</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{infos.nom} · {infos.type}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{infos.commune}</div>
            </Card>
            <Card className="p-3.5 mb-3 flex items-start gap-2" style={{ background: infos.csuEligible ? "#EAF6EF" : C.ivory, border: "none" }}>
              {infos.csuEligible ? <CheckCircle2 size={14} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={14} color={C.sub} style={{ flexShrink: 0, marginTop: 1 }} />}
              <span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>
                {infos.csuEligible
                  ? "Établissement sélectionné par l'État pour la gratuité de la maternité (CSU) — les accouchements et CPN y sont pris en charge à 100%."
                  : "Établissement non sélectionné pour la gratuité maternité CSU à ce jour (seuls certains établissements agréés par l'État en bénéficient). Ce statut est vérifié et attribué par l'assureur — contactez votre gestionnaire réseau si votre établissement fait partie du programme."}
              </span>
            </Card>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textAlign: "center" }}>Vous pourrez commencer à scanner vos patients juste après l'activation.</div>
          </div>
          <div className="px-5 mt-3">
            <button onClick={activer} disabled={creating} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={15} color={C.gold} />} {creating ? "Activation…" : "Activer mon espace prestataire"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* =================================================================
   SCANNER — identification du patient (QR code / reconnaissance faciale)
================================================================= */
function Scanner({ session, notify, go, setPatientActif }) {
  const [mode, setMode] = useState("qr");
  const [scanStep, setScanStep] = useState("idle"); // idle | loading | result
  const [patient, setPatient] = useState(null);
  const [qrOuvert, setQrOuvert] = useState(false);
  const [consommationScanner, setConsommationScanner] = useState(null);

  React.useEffect(() => {
    if (!patient?.police) { setConsommationScanner(null); return; }
    (async () => {
      const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
      const compte = comptes.find((c) => c.donnees?.police === patient.police);
      setConsommationScanner(compte?.donnees?.garantiesConsommation || null);
    })();
  }, [patient]);

  const garantiesAffichees = (patient?.garanties || []).map((g) => {
    const reel = consommationScanner?.find((r) => r.nom === g.nom);
    return reel ? { ...g, plafond: reel.plafond ?? g.plafond, consomme: reel.consomme } : g;
  });

  const patientsDemo = session.patientsAffilies?.length > 0 ? session.patientsAffilies : [buildPatientDemo(), ...AUTRES_PATIENTS];

  const scanner = (p) => {
    setScanStep("loading");
    setTimeout(() => {
      setPatient(p);
      setScanStep("result");
      notify(`${p.nom} identifié(e)`);
    }, 1200);
  };
  const nouveauScan = () => { setScanStep("idle"); setPatient(null); setQrOuvert(false); };

  if (scanStep === "result" && patient) {
    return (
      <div className="pb-6">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={nouveauScan} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Patient identifié</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub, display: "flex", alignItems: "center", gap: 4 }}><Lock size={9} color={C.green} /> Couverture & dossier — accès instantané</div></div>
        </div>
        <div className="px-5">
          <Card className="p-4 flex items-center gap-3">
            <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 56, height: 56 }}><img src={patient.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.ink }}>{patient.nom}</div><div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{patient.carte}</div></div>
            <StatusPill statut={patient.statutPolice} />
            <button onClick={() => setQrOuvert(!qrOuvert)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, background: C.navy }}><QrCode size={14} color="white" /></button>
          </Card>
          {qrOuvert && (
            <Card className="p-4 flex flex-col items-center mt-2">
              <QrPlaceholder />
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 8, textAlign: "center" }}>Code d'accès rapide au dossier — à scanner par un confrère autorisé</div>
            </Card>
          )}

          {patient.statutPolice === "Suspendu" && (
            <Card className="p-3.5 flex items-start gap-2 mt-3" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <ShieldAlert size={15} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Police suspendue (cotisation impayée). La prise en charge directe n'est pas disponible — orientez le patient vers un règlement à sa charge ou un remboursement ultérieur.</span>
            </Card>
          )}
          {patient.dossier?.allergies?.length > 0 && (
            <Card className="p-3.5 flex items-start gap-2 mt-3" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <AlertTriangle size={14} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}><b>Allergies :</b> {patient.dossier.allergies.join(", ")}</span>
            </Card>
          )}

          <SectionLabel>Formule & couverture</SectionLabel>
          <Card className="p-4">
            <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{patient.formule}</span><span style={{ fontFamily: mono, fontSize: 12, color: C.gold, fontWeight: 700 }}>{patient.taux || "—"}%</span></div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 2 }}>Police {patient.police} · Validité {patient.validite}</div>
          </Card>

          <SectionLabel>Plafonds par garantie</SectionLabel>
          <div className="space-y-2">
            {garantiesAffichees.map((g, i) => {
              const pct = Math.round((g.consomme / g.plafond) * 100);
              return (
                <Card key={i} className="p-3 flex items-center gap-3">
                  <Ring pct={pct} size={38} stroke={5} color={pct >= 90 ? C.red : pct >= 70 ? C.amber : C.gold} />
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.ink }}>{g.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{fmt(g.consomme)} sur {fmt(g.plafond)}</div></div>
                  <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: pct >= 90 ? C.red : C.navy }}>{pct}%</span>
                </Card>
              );
            })}
          </div>

          {patient.dossier?.traitementsEnCours?.length > 0 && (
            <>
              <SectionLabel>Traitements en cours</SectionLabel>
              <Card className="p-4 space-y-1.5">{patient.dossier.traitementsEnCours.map((t, i) => <div key={i} className="flex items-center gap-2"><Pill size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{t.nom}{t.posologie ? ` — ${t.posologie}` : ""}</span></div>)}</Card>
            </>
          )}

          <Accordion title="Cascade de paiement applicable" right={<Percent size={13} color={C.gold} />}>
            <div className="pt-3 space-y-2">
              {CASCADE.map((c) => (
                <div key={c.ordre} className="flex items-center justify-between">
                  <span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{c.ordre}. {c.payeur}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700 }}>{c.taux}</span>
                </div>
              ))}
            </div>
          </Accordion>

          <div className="space-y-2 mt-2">
            <button onClick={() => { setPatientActif(patient); go("soins", "nouvelle"); }} disabled={patient.statutPolice === "Suspendu"} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: patient.statutPolice === "Suspendu" ? "#C9CDD6" : C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}><Stethoscope size={16} /> Faire une demande de PEC pour ce patient</button>
            <button onClick={() => { setPatientActif(patient); go("derogations", "nouvelle"); }} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><FileWarning size={15} /> Soumettre une dérogation</button>
            <button onClick={nouveauScan} className="w-full text-center py-2" style={{ fontFamily: sans, fontSize: 12, color: C.sub, fontWeight: 600 }}>Scanner un autre patient</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2">
        <div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Scanner un patient</div>
        <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Accueil, admission & vérification de couverture — en un seul geste</div>
      </div>
      <div className="px-5">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode("qr")} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-1.5" style={{ background: mode === "qr" ? C.navy : "white", color: mode === "qr" ? "white" : C.ink, border: `1px solid ${mode === "qr" ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}><QrCode size={14} /> QR Code</button>
          <button onClick={() => setMode("face")} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-1.5" style={{ background: mode === "face" ? C.navy : "white", color: mode === "face" ? "white" : C.ink, border: `1px solid ${mode === "face" ? C.navy : C.line}`, fontFamily: sans, fontSize: 12, fontWeight: 700 }}><ScanFace size={14} /> Reconnaissance faciale</button>
        </div>

        {scanStep === "idle" && (
          <Card className="p-8 flex flex-col items-center text-center" style={{ background: C.navy, border: "none" }}>
            <div className="flex items-center justify-center rounded-2xl" style={{ width: 96, height: 96, border: `2px dashed ${C.gold}` }}>
              {mode === "qr" ? <ScanLine size={40} color={C.gold} /> : <ScanFace size={40} color={C.gold} />}
            </div>
            <div style={{ fontFamily: sans, fontSize: 12, color: "#B9C3D6", marginTop: 14, textAlign: "center", maxWidth: 240 }}>{mode === "qr" ? "Scannez le QR affiché dans l'app mobile du patient, sa version PDF imprimée, ou toute impression de sa carte — aucune carte physique n'est obligatoire" : "Positionnez le visage du patient dans le cadre"}</div>
            <button onClick={() => scanner(patientsDemo[0])} className="mt-5 rounded-xl px-5 py-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13 }}>{mode === "qr" ? <QrCode size={15} /> : <ScanFace size={15} />} Scanner maintenant</button>
          </Card>
        )}
        {scanStep === "loading" && (
          <Card className="p-10 flex flex-col items-center gap-3"><Loader2 size={30} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Identification en cours…</span></Card>
        )}

        <SectionLabel>Patients récents (démo)</SectionLabel>
        <div className="space-y-2">
          {patientsDemo.map((p, i) => (
            <Card key={i} onClick={() => scanner(p)} className="p-3 flex items-center gap-3 cursor-pointer">
              <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 36, height: 36 }}><img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.nom}</div><div style={{ fontFamily: mono, fontSize: 10, color: C.sub }}>{p.carte}</div></div>
              <StatusPill statut={p.statutPolice} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =================================================================
   SOINS — nouvelle PEC / remboursement + historique
================================================================= */
function Soins({ session, setSession, notify, go, patientActif, initialAction, setDerogationPrefill, soinAutorise, setSoinAutorise }) {
  const catalogue = session.catalogue || buildCatalogueSoins();
  const estPharmacie = session.etablissement.type === "Pharmacie";
  const typePecLabel = estPharmacie ? "Dispensation (PEC)" : "PEC directe";
  const [sub, setSub] = useState(initialAction === "nouvelle" ? "nouvelle" : "historique");
  const [form, setForm] = useState({ patientNom: patientActif?.nom || "", patientCarte: patientActif?.carte || "", patientPolice: patientActif?.police || "", patientContrat: patientActif?.contrat || "", patientSouscripteur: patientActif?.souscripteur || "", type: typePecLabel, acteCode: catalogue[0].code, garantie: catalogue[0].garantie, montant: String(catalogue[0].tarifNegocie), diagnostic: "", isZeroBon: !!catalogue[0].isZeroBon });
  const [step, setStep] = useState("form");
  const [documents, setDocuments] = useState([]);
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [tentativeEnvoi, setTentativeEnvoi] = useState(false);
  const [bon, setBon] = useState(null);
  const [surplusPatient, setSurplusPatient] = useState(0);
  const [soinSelectionne, setSoinSelectionne] = useState(null);
  const [soinEdition, setSoinEdition] = useState(null);
  const [syncingReglements, setSyncingReglements] = useState(false);
  const [syncingTarifs, setSyncingTarifs] = useState(false);
  const [dateActivationContrat, setDateActivationContrat] = useState(null);
  const [franchiseContrat, setFranchiseContrat] = useState(0);
  const [consommationReelle, setConsommationReelle] = useState(null);
  const [profilPatientReel, setProfilPatientReel] = useState(null);

  React.useEffect(() => {
    if (!form.patientContrat || form.patientContrat === "—") { setDateActivationContrat(null); setFranchiseContrat(0); setConsommationReelle(null); setProfilPatientReel(null); return; }
    (async () => {
      const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
      const compte = comptes.find((c) => c.donnees?.police === form.patientPolice) || comptes.find((c) => c.donnees?.contrat === form.patientContrat);
      setDateActivationContrat(compte?.donnees?.dateActivation || null);
      setFranchiseContrat(Number(compte?.donnees?.franchise) || 0);
      setConsommationReelle(compte?.donnees?.garantiesConsommation || null);
      setProfilPatientReel(compte ? { sexe: compte.donnees?.sexe || null, dateNaissance: compte.donnees?.dateNaissance || null } : null);
    })();
  }, [form.patientContrat]);

  const synchroniserTarifs = async () => {
    setSyncingTarifs(true);
    const distant = await chargerTarifsPartages(session.etablissement.nom);
    if (distant && distant.length) {
      setSession((s) => ({ ...s, catalogue: distant }));
      const acteMaj = distant.find((a) => a.code === form.acteCode);
      if (acteMaj) setForm((f) => ({ ...f, montant: String(acteMaj.tarifNegocie), garantie: acteMaj.garantie, isZeroBon: !!acteMaj.isZeroBon }));
    }
    setSyncingTarifs(false);
  };
  React.useEffect(() => { synchroniserTarifs(); }, []);

  const synchroniserReglements = async () => {
    setSyncingReglements(true);
    const partagees = await chargerPecPartagees();
    setSession((s) => ({
      ...s,
      soins: s.soins.map((soin) => {
        if (!soin.uid) return soin;
        const maj = partagees.find((p) => p.uid === soin.uid);
        return maj && maj.statutReglement !== soin.statutReglement ? { ...soin, statutReglement: maj.statutReglement, numeroBordereau: maj.numeroBordereau, dateReglement: maj.dateReglement } : soin;
      }),
    }));
    setSyncingReglements(false);
    notify("Statuts de règlement synchronisés avec l'assureur");
  };
  React.useEffect(() => { synchroniserReglements(); }, []);

  React.useEffect(() => {
    if (patientActif && initialAction === "nouvelle") {
      setForm((f) => ({ ...f, patientNom: patientActif.nom, patientCarte: patientActif.carte, patientPolice: patientActif.police, patientContrat: patientActif.contrat, patientSouscripteur: patientActif.souscripteur }));
      setSub("nouvelle");
    }
  }, [patientActif, initialAction]);

  React.useEffect(() => {
    if (soinAutorise) {
      setForm((f) => ({ ...f, ...soinAutorise }));
      setSub("nouvelle");
    }
  }, [soinAutorise]);

  const taux = patientActif?.taux || 80;
  const vent = computeVentilation(form.montant, taux, form.isZeroBon, form.garantie, session.etablissement.csuEligible, franchiseContrat);
  const carence = statutCarence(form.garantie, dateActivationContrat);
  // Seule la gratuité CSU (programme d'État, hors du contrat d'assurance) échappe à la carence.
  // Un acte "zéro bon" négocié avec l'assureur reste soumis à la carence du contrat — sinon la carence
  // maternité (300 j) serait contournable via le suivi prénatal, qui est justement en zéro bon.
  const carenceBloquante = carence.enCarence && !(form.garantie === "Maternité" && session.etablissement.csuEligible);

  const changerActe = (code) => {
    const acte = catalogue.find((a) => a.code === code);
    setForm({ ...form, acteCode: code, garantie: acte.garantie, montant: String(acte.tarifNegocie), isZeroBon: !!acte.isZeroBon });
  };

  const catalogueAffiche = estPharmacie ? catalogue.filter((a) => a.code.startsWith("PHAR") || a.code.startsWith("CONS-001")) : catalogue;
  const documentsRequis = form.type === "Remboursement";
  const formValide = form.patientNom && form.montant && (!documentsRequis || documents.length > 0);

  const garantieReelle = consommationReelle?.find((g) => g.nom === form.garantie);
  const garantieLocale = patientActif?.garanties?.find((g) => g.nom === form.garantie);
  const garantiePatient = garantieReelle
    ? { nom: form.garantie, plafond: garantieReelle.plafond != null ? garantieReelle.plafond : garantieLocale?.plafond, consomme: garantieReelle.consomme }
    : garantieLocale;
  const soldeDisponible = garantiePatient && garantiePatient.plafond != null ? garantiePatient.plafond - garantiePatient.consomme : null;
  const depassement = form.isZeroBon ? 0 : (soldeDisponible !== null ? Math.max(0, Number(form.montant || 0) - soldeDisponible) : 0);

  const finaliserSoumission = (surplus = 0) => {
    setStep("loading");
    setTimeout(async () => {
      const acteLibelle = catalogue.find((a) => a.code === form.acteCode)?.libelle || "";
      const numeroBon = `BON-${Math.floor(100000 + Math.random() * 900000)}`;
      const uid = `PEC-${Date.now()}`;
      const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      const entry = { id: Date.now(), uid, patientNom: form.patientNom, patientCarte: form.patientCarte || "—", patientPolice: form.patientPolice || "—", patientContrat: form.patientContrat || "—", patientSouscripteur: form.patientSouscripteur || "—", date: "07/07/2026", heure, type: form.type, acteCode: form.acteCode, acteLibelle, garantie: form.garantie, montant: Number(form.montant), diagnostic: form.diagnostic, vent: computeVentilation(form.montant, taux, form.isZeroBon, form.garantie, session.etablissement.csuEligible, franchiseContrat), statutReglement: "En attente", documents: documents.length, signature: signatureDrawn, numeroBon: (form.type === "PEC directe" || form.type === "Dispensation (PEC)") ? numeroBon : null, surplusPatient: surplus, isZeroBon: form.isZeroBon };

      // Lien automatique PEC ↔ dossier médical : chaque soin facturé devient une visite dans le dossier du patient
      const estPharmacie = session.etablissement.type === "Pharmacie";
      const nouvelleVisite = {
        date: "07/07/2026", heure, motif: estPharmacie ? "Dispensation en pharmacie" : (acteLibelle || form.type),
        diagnostic: estPharmacie ? null : (form.diagnostic || null), prescripteur: `${session.equipe?.[0]?.nom || session.etablissement.responsable || "Praticien"} — ${session.etablissement.nom}`,
        examens: [], imagerie: [],
        ordonnance: estPharmacie ? { medicaments: [`Ordonnance ${form.diagnostic || "—"}`], statut: "Dispensée" } : null,
        vaccinations: [], documents: [],
        liePecUid: uid, lieActeCode: form.acteCode, lieActeLibelle: acteLibelle, lieMontant: Number(form.montant), lieNumeroBon: numeroBon,
      };
      const dejaConnu = session.patientsAffilies.find((p) => (form.patientCarte && p.carte === form.patientCarte) || p.nom === form.patientNom);
      const patientsMaj = dejaConnu
        ? session.patientsAffilies.map((p) => (p === dejaConnu ? { ...p, dossier: { ...p.dossier, visites: [nouvelleVisite, ...(p.dossier?.visites || [])] } } : p))
        : [...session.patientsAffilies, {
            nom: form.patientNom, carte: form.patientCarte || "—", police: form.patientPolice || "—", contrat: form.patientContrat || "—",
            souscripteur: form.patientSouscripteur || "—", formule: "—", taux, photo: "", grade: "—", statutPolice: "Actif", validite: "—",
            garanties: [], telemedecine: 0,
            dossier: { constantesVitales: {}, allergies: [], maladiesChroniques: [], traitementsEnCours: [], antecedentsChirurgicaux: [], antecedentsFamiliaux: [], visites: [nouvelleVisite], notes: [] },
          }];

      setSession({
        ...session,
        soins: [entry, ...session.soins],
        patientsAffilies: patientsMaj,
        alertes: [{ id: Date.now(), type: "soin", titre: `${form.type} soumise`, detail: `${form.patientNom} — ${fmt(form.montant)}${surplus > 0 ? ` (dont ${fmt(surplus)} réglés directement par le patient)` : ""}`, gravite: "info", actionGo: "soins", actionLabel: "Voir l'historique" }, ...session.alertes],
      });
      const partagees = await chargerPecPartagees();
      await sauvegarderPecPartagees([{ ...entry, etablissement: session.etablissement.nom }, ...partagees]);

      // Le plafond ne se consomme que pour les actes réellement imputés à la garantie de l'assurance —
      // pas les actes zéro bon (hors enveloppe, négociés à part), ni la maternité gratuite CSU (financée par l'État).
      const imputeSurPlafond = !form.isZeroBon && !(form.garantie === "Maternité" && session.etablissement.csuEligible);
      if (imputeSurPlafond && form.patientPolice && form.patientPolice !== "—") {
        const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
        const ciblePresente = comptes.some((c) => c.donnees?.police === form.patientPolice);
        const comptesMaj = comptes.map((c) => {
          // Cible la police individuelle exacte de la personne soignée (pas le contrat, partagé entre plusieurs personnes).
          // Repli sur le contrat uniquement si aucune police individuelle n'est retrouvée (ex. entreprise sans fiche par employé).
          const cible = ciblePresente ? c.donnees?.police === form.patientPolice : c.donnees?.contrat === form.patientContrat;
          if (!cible) return c;
          const garanties = c.donnees.garantiesConsommation || [];
          const existe = garanties.some((g) => g.nom === form.garantie);
          const garantiesMaj = existe
            ? garanties.map((g) => (g.nom === form.garantie ? { ...g, consomme: (Number(g.consomme) || 0) + Number(form.montant) } : g))
            : [...garanties, { nom: form.garantie, plafond: null, consomme: Number(form.montant) }];
          return { ...c, donnees: { ...c.donnees, garantiesConsommation: garantiesMaj } };
        });
        await sauvegarderCanalPartage(CLE_COMPTES_PARTAGES, comptesMaj);
      }

      if (form.type === "PEC directe" || form.type === "Dispensation (PEC)") setBon({ numero: numeroBon, patientNom: form.patientNom, patientCarte: form.patientCarte, acteLibelle, montant: Number(form.montant), vent: computeVentilation(form.montant, taux, form.isZeroBon, form.garantie, session.etablissement.csuEligible, franchiseContrat), date: "07/07/2026", isZeroBon: form.isZeroBon });
      if (form.derogationUid) marquerDerogationFinalisee(form.derogationUid);
      setSurplusPatient(surplus);
      setStep("done");
      notify(`${form.type} enregistrée pour ${form.patientNom} — dossier médical mis à jour`);
    }, 1100);
  };

  const doublonDetecte = session.soins.find((s) =>
    s.date === "07/07/2026" && s.patientNom === form.patientNom && s.acteCode === form.acteCode && Number(s.montant) === Number(form.montant)
  );

  const soumettre = () => {
    setTentativeEnvoi(true);
    if (!formValide) return;
    if (carenceBloquante && !form.derogationUid) { setStep("carence"); return; }
    if (doublonDetecte && !form.derogationUid) { setStep("doublon"); return; }
    if (depassement > 0 && !form.derogationUid) { setStep("depassement"); return; }
    finaliserSoumission(0);
  };

  const marquerDerogationFinalisee = async (uid) => {
    if (!uid) return;
    try {
      const partagees = await chargerDerogationsPartagees();
      await sauvegarderDerogationsPartagees(partagees.map((d) => (d.uid === uid ? { ...d, soinFinalise: true } : d)));
    } catch (e) { /* stockage indisponible */ }
    setSoinAutorise(null);
  };

  const confirmerMalgreDoublon = () => {
    if (depassement > 0) { setStep("depassement"); return; }
    finaliserSoumission(0);
  };

  const mettreEnAttenteCarence = () => {
    const acteLibelle = catalogue.find((a) => a.code === form.acteCode)?.libelle || "";
    setDerogationPrefill({
      patientNom: form.patientNom, motif: `${acteLibelle} — délai de carence non écoulé (${carence.joursRestants} jour(s) restant(s) sur ${carence.joursTotal} pour la garantie ${form.garantie})`,
      montantDemande: form.montant, plafondRestant: "0",
      donneesSoin: { ...form },
    });
    go("derogations", "nouvelle");
  };

  const mettreEnAttente = () => {
    const acteLibelle = catalogue.find((a) => a.code === form.acteCode)?.libelle || "";
    setDerogationPrefill({
      patientNom: form.patientNom, motif: `${acteLibelle} — dépassement de plafond`,
      montantDemande: String(depassement), plafondRestant: String(soldeDisponible || 0),
      donneesSoin: { ...form },
    });
    go("derogations", "nouvelle");
  };

  const reset = () => { setStep("form"); setForm({ patientNom: "", patientCarte: "", patientPolice: "", patientContrat: "", patientSouscripteur: "", type: typePecLabel, acteCode: catalogue[0].code, garantie: catalogue[0].garantie, montant: String(catalogue[0].tarifNegocie), diagnostic: "" }); setDocuments([]); setSignatureDrawn(false); setTentativeEnvoi(false); setBon(null); setSurplusPatient(0); };

  const enregistrerEditionSoin = () => {
    setSession({
      ...session,
      soins: session.soins.map((s) => (s.id === soinSelectionne ? { ...s, montant: Number(soinEdition.montant), diagnostic: soinEdition.diagnostic, vent: computeVentilation(soinEdition.montant, taux, s.isZeroBon, s.garantie, session.etablissement.csuEligible, franchiseContrat) } : s)),
    });
    notify("Soin modifié");
    setSoinEdition(null);
  };

  if (soinSelectionne) {
    const s = session.soins.find((x) => x.id === soinSelectionne);
    if (!s) { setSoinSelectionne(null); return null; }
    return (
      <div className="pb-6">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => { setSoinSelectionne(null); setSoinEdition(null); }} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Détail du soin</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{s.date}</div></div>
        </div>
        <div className="px-5">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{s.patientNom}</span><StatusPill statut={s.statutReglement} /></div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, marginTop: 2 }}>{s.patientCarte}</div>
            {s.patientPolice && s.patientPolice !== "—" && (
              <div className="mt-2 pt-2 space-y-1" style={{ borderTop: `1px solid ${C.line}` }}>
                <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Police</span><span style={{ fontFamily: mono, fontSize: 10.5, color: C.ink }}>{s.patientPolice}</span></div>
                <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Contrat</span><span style={{ fontFamily: mono, fontSize: 10.5, color: C.ink }}>{s.patientContrat}</span></div>
                <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Souscripteur</span><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 600, color: C.ink }}>{s.patientSouscripteur}</span></div>
              </div>
            )}
          </Card>

          <SectionLabel>Acte & montant</SectionLabel>
          {!soinEdition ? (
            <Card className="p-4">
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{s.acteLibelle || s.garantie}</span><span style={{ fontFamily: mono, fontSize: 14, fontWeight: 700, color: C.navy }}>{fmt(s.montant)}</span></div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 2 }}>{s.type} · {s.garantie}</div>
              {s.diagnostic && <div style={{ fontFamily: sans, fontSize: 11.5, color: C.navy2, marginTop: 6 }}>Diagnostic / motif : {s.diagnostic}</div>}
              {s.numeroBon && <div style={{ fontFamily: mono, fontSize: 10.5, color: C.gold, marginTop: 6 }}>Bon : {s.numeroBon}</div>}
              {s.surplusPatient > 0 && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.amber, marginTop: 4 }}>{fmt(s.surplusPatient)} réglés directement par le patient</div>}
            </Card>
          ) : (
            <Card className="p-4 space-y-3">
              <Field label="Montant (CDF)"><input style={inputStyle} value={soinEdition.montant} onChange={(e) => setSoinEdition({ ...soinEdition, montant: e.target.value.replace(/\D/g, "") })} /></Field>
              <Field label="Diagnostic / motif"><input style={inputStyle} value={soinEdition.diagnostic} onChange={(e) => setSoinEdition({ ...soinEdition, diagnostic: e.target.value })} /></Field>
              <div className="flex gap-2">
                <button onClick={() => setSoinEdition(null)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button>
                <button onClick={enregistrerEditionSoin} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Enregistrer</button>
              </div>
            </Card>
          )}

          {s.vent && (
            <>
              <SectionLabel>Ventilation de la cascade</SectionLabel>
              <Card className="p-4"><VentilationBar vent={s.vent} montant={s.montant} /></Card>
            </>
          )}

          <SectionLabel>Justificatifs</SectionLabel>
          <Card className="p-4 space-y-1.5">
            <div className="flex items-center gap-2"><Paperclip size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{s.documents || 0} document(s) joint(s)</span></div>
            <div className="flex items-center gap-2">{s.signature ? <Check size={13} color={C.green} /> : <X size={13} color={C.sub} />}<span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{s.signature ? "Signature électronique enregistrée" : "Aucune signature"}</span></div>
          </Card>

          {!soinEdition && s.statutReglement === "En attente" && (
            <button onClick={() => setSoinEdition({ montant: String(s.montant), diagnostic: s.diagnostic || "" })} className="w-full rounded-xl py-3 mt-2 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><PenLine size={14} /> Modifier ce soin</button>
          )}
          {s.statutReglement !== "En attente" && (
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, textAlign: "center", marginTop: 8 }}>Ce soin est déjà réglé — non modifiable.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Soins</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.soins.length} acte(s) enregistré(s)</div></div>
      </div>
      <div className="px-5 flex gap-2 mb-3">
        {[["nouvelle", "Nouvelle demande"], ["historique", "Historique"]].map(([k, l]) => (
          <button key={k} onClick={() => { setSub(k); reset(); }} className="flex-1 rounded-full py-2" style={{ background: sub === k ? C.navy : "white", color: sub === k ? "white" : C.ink, border: `1px solid ${sub === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{l}</button>
        ))}
      </div>

      {sub === "nouvelle" && step === "form" && (
        <div className="px-5">
          {estPharmacie && (
            <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
              <PackageCheck size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Interface pharmacie — dispensez une ordonnance en quelques clics, avec calcul automatique de la ventilation.</span>
            </Card>
          )}
          <Card className="p-4 space-y-3">
            <div className="flex gap-2 mb-1">
              {[typePecLabel, "Remboursement"].map((t) => (
                <button key={t} onClick={() => setForm({ ...form, type: t })} className="flex-1 rounded-lg py-2" style={{ background: form.type === t ? C.navy : C.ivory, color: form.type === t ? "white" : C.ink, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{t}</button>
              ))}
            </div>
            <Field label="Nom du patient"><input style={inputStyle} value={form.patientNom} onChange={(e) => setForm({ ...form, patientNom: e.target.value })} placeholder="Nom et prénom" /></Field>
            <Field label="N° de carte"><input style={inputStyle} value={form.patientCarte} onChange={(e) => setForm({ ...form, patientCarte: e.target.value })} placeholder="SP-KIN-000482-00" /></Field>
            {patientActif && form.patientCarte === patientActif.carte ? (
              <Card className="p-3.5" style={{ background: C.greenSoft, border: "none" }}>
                <div className="flex items-center gap-1.5 mb-2"><BadgeCheck size={14} color={C.green} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.green }}>Identité vérifiée par scan — remplie automatiquement</span></div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Police</span><span style={{ fontFamily: mono, fontSize: 11, color: C.ink }}>{form.patientPolice}</span></div>
                  <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Contrat</span><span style={{ fontFamily: mono, fontSize: 11, color: C.ink }}>{form.patientContrat}</span></div>
                  <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Souscripteur</span><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: C.ink, textAlign: "right" }}>{form.patientSouscripteur}</span></div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="N° de police"><input style={inputStyle} value={form.patientPolice} onChange={(e) => setForm({ ...form, patientPolice: e.target.value })} placeholder="SP-KIN-000482" /></Field>
                <Field label="Souscripteur"><input style={inputStyle} value={form.patientSouscripteur} onChange={(e) => setForm({ ...form, patientSouscripteur: e.target.value })} placeholder="Nom ou entreprise" /></Field>
              </div>
            )}
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Tarifs conventionnés propres à votre établissement</span>
              <button type="button" onClick={synchroniserTarifs} disabled={syncingTarifs} className="flex items-center gap-1" style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.navy2 }}>{syncingTarifs ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Actualiser</button>
            </div>
            <Field label={estPharmacie ? "Type de délivrance" : "Acte médical (code standard)"}>
              <select style={inputStyle} value={form.acteCode} onChange={(e) => changerActe(e.target.value)}>
                {catalogueAffiche.map((a) => <option key={a.code} value={a.code}>{a.code} — {a.libelle}{a.isZeroBon ? " (Zéro bon)" : ""}</option>)}
              </select>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 3 }}>Garantie : {form.garantie}</div>
            </Field>
            {form.isZeroBon && !carenceBloquante && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#EAF6EF" }}>
                <BadgeCheck size={15} color={C.green} />
                <span style={{ fontFamily: sans, fontSize: 11.5, color: C.green, fontWeight: 700 }}>Zéro bon — acte pris en charge à 100%, le patient ne paie rien. Aucune vérification de plafond ni dérogation nécessaire.</span>
              </div>
            )}
            {form.derogationUid && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#EAF6EF" }}>
                <BadgeCheck size={15} color={C.green} />
                <span style={{ fontFamily: sans, fontSize: 11, color: C.green, fontWeight: 700 }}>Soin autorisé par dérogation approuvée — le blocage habituel (plafond, carence) est levé pour cette demande précise.</span>
              </div>
            )}
            {carenceBloquante && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: C.redSoft }}>
                <Clock3 size={15} color={C.red} />
                <span style={{ fontFamily: sans, fontSize: 11, color: C.red, fontWeight: 700 }}>Délai de carence non écoulé pour « {form.garantie} » — {carence.joursRestants} jour(s) restant(s) avant couverture effective.</span>
              </div>
            )}
            {form.garantie === "Maternité" && profilPatientReel?.sexe === "Masculin" && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: C.redSoft }}>
                <XCircle size={15} color={C.red} />
                <span style={{ fontFamily: sans, fontSize: 11, color: C.red, fontWeight: 700 }}>Garantie non applicable — le titulaire de cette carte est enregistré comme de sexe masculin. Vérifiez qu'il ne s'agit pas d'une déclaration pour une ayant droit (conjointe).</span>
              </div>
            )}
            {!form.isZeroBon && form.garantie === "Maternité" && (
              session.etablissement.csuEligible ? (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#EAF6EF" }}>
                  <ShieldCheck size={15} color={C.green} />
                  <span style={{ fontFamily: sans, fontSize: 11.5, color: C.green, fontWeight: 700 }}>Établissement sélectionné CSU — gratuité à 100% (CPN, accouchement, césarienne, et suivi post-partum jusqu'à 1 mois après l'accouchement). Le patient ne paie rien.</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl" style={{ background: C.ivory }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={15} color={C.sub} />
                    <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Établissement non sélectionné pour la gratuité CSU — la maternité suit le circuit normal (assurance + reste à charge éventuel).</span>
                  </div>
                  <button
                    onClick={() => {
                      const acteLibelle = catalogue.find((a) => a.code === form.acteCode)?.libelle || "";
                      setDerogationPrefill({ patientNom: form.patientNom, motif: `${acteLibelle} — établissement non sélectionné CSU, demande de gratuité exceptionnelle (ex. urgence, absence d'hôpital conventionné à proximité)`, montantDemande: form.montant, plafondRestant: "0", donneesSoin: { ...form } });
                      go("derogations", "nouvelle");
                    }}
                    className="rounded-lg px-3 py-2 flex items-center gap-1.5"
                    style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}
                  >
                    <FileWarning size={12} /> Demander une dérogation exceptionnelle CSU
                  </button>
                </div>
              )
            )}
            {(form.type === "PEC directe" || form.type === "Dispensation (PEC)") ? (
              <Field label="Montant (CDF) — tarif conventionné/négocié">
                <div style={{ ...inputStyle, background: C.ivory, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: mono, fontWeight: 700, color: C.navy }}>{fmt(form.montant)}</span><BadgeCheck size={14} color={C.gold} />
                </div>
              </Field>
            ) : (
              <Field label="Montant (CDF)"><input style={inputStyle} value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 45000" /></Field>
            )}
            <Field label={estPharmacie ? "N° d'ordonnance" : "Diagnostic / motif"}><input style={inputStyle} value={form.diagnostic} onChange={(e) => setForm({ ...form, diagnostic: e.target.value })} placeholder={estPharmacie ? "Ex : ORD-2026-00458" : "Ex : Paludisme simple"} /></Field>

            {form.type === "Remboursement" && (
              <>
                <Field label={`Documents justificatifs (PDF, JPEG) ${documentsRequis ? "*" : ""}`}>
                  <label className="flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer" style={{ ...inputStyle, color: documents.length ? C.ink : C.sub, border: tentativeEnvoi && documents.length === 0 ? `1px solid ${C.red}` : `1px solid ${C.line}` }}>
                    <Upload size={14} color={C.navy2} />{documents.length ? `${documents.length} fichier(s) ajouté(s)` : "Ajouter facture, prescription…"}
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" hidden onChange={(e) => setDocuments([...documents, ...Array.from(e.target.files || []).map((f) => f.name)])} />
                  </label>
                  {documents.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      {documents.map((d, i) => (
                        <div key={i} className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{d}</span><button onClick={() => setDocuments(documents.filter((_, j) => j !== i))}><Trash2 size={11} color={C.red} /></button></div>
                      ))}
                    </div>
                  )}
                  {tentativeEnvoi && documentsRequis && documents.length === 0 && <div className="flex items-center gap-1 mt-1"><AlertTriangle size={10} color={C.red} /><span style={{ fontFamily: sans, fontSize: 10, color: C.red }}>Au moins un justificatif est requis.</span></div>}
                </Field>
                <div>
                  <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Signature électronique (optionnelle)</div>
                  <SignaturePad onChange={(drawn) => setSignatureDrawn(drawn)} />
                  {signatureDrawn && <div className="flex items-center gap-1 mt-1"><Check size={11} color={C.green} /><span style={{ fontFamily: sans, fontSize: 10, color: C.green, fontWeight: 700 }}>Signature enregistrée</span></div>}
                </div>
              </>
            )}

            {Number(form.montant) > 0 && (
              <Card className="p-3" style={{ background: C.ivory, border: "none" }}>
                <div className="flex items-center gap-1.5 mb-2"><Percent size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>Ventilation de la cascade (temps réel)</span></div>
                <VentilationBar vent={vent} montant={Number(form.montant)} />
              </Card>
            )}
            <button onClick={soumettre} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-1" style={{ background: (tentativeEnvoi && !formValide) ? C.redSoft : (formValide ? C.navy : "#C9CDD6"), color: (tentativeEnvoi && !formValide) ? C.red : "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><Send size={14} /> {(form.type === "PEC directe" || form.type === "Dispensation (PEC)") ? (estPharmacie ? "Dispenser ordonnance" : "Envoyer la demande de PEC") : "Soumettre le remboursement"}</button>
          </Card>
        </div>
      )}
      {sub === "nouvelle" && step === "doublon" && (
        <div className="px-5">
          <Card className="p-5" style={{ background: "#FBF1DC", border: `1px solid ${C.amber}` }}>
            <div className="flex items-center gap-2 mb-3"><AlertTriangle size={20} color={C.amber} /><span style={{ fontFamily: serif, fontSize: 16, color: C.amber, fontWeight: 700 }}>Doublon probable détecté</span></div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.ink, marginBottom: 12 }}>
              Un soin identique a déjà été enregistré aujourd'hui pour <b>{form.patientNom}</b> : même acte ({catalogue.find((a) => a.code === form.acteCode)?.libelle}), même montant ({fmt(form.montant)}), à {doublonDetecte?.heure}. Vérifiez qu'il ne s'agit pas d'une double saisie avant de continuer.
            </div>
            <div className="space-y-2">
              <button onClick={() => setStep("form")} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><PenLine size={15} /> Modifier / annuler — c'était une erreur</button>
              <button onClick={confirmerMalgreDoublon} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.amber}`, color: C.amber, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><Check size={15} /> Confirmer — ce sont bien deux soins distincts</button>
            </div>
          </Card>
        </div>
      )}
      {sub === "nouvelle" && step === "carence" && (
        <div className="px-5">
          <Card className="p-5" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
            <div className="flex items-center gap-2 mb-3"><Clock3 size={20} color={C.red} /><span style={{ fontFamily: serif, fontSize: 16, color: C.red, fontWeight: 700 }}>Délai de carence non écoulé</span></div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Garantie</span><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{form.garantie}</span></div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Délai contractuel</span><span style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{carence.joursTotal} jours après activation</span></div>
              <div className="flex items-center justify-between pt-1.5" style={{ borderTop: `1px solid ${C.red}` }}><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.red }}>Jours restants avant couverture</span><span style={{ fontFamily: mono, fontSize: 15, fontWeight: 800, color: C.red }}>{carence.joursRestants} j</span></div>
            </div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginBottom: 12 }}>Ce contrat est trop récent pour que cette garantie soit couverte — la couverture n'a pas encore débuté pour ce type de soin. Deux options : demander une dérogation exceptionnelle, ou faire régler l'intégralité du soin par le patient.</div>
            <div className="space-y-2">
              <button onClick={mettreEnAttenteCarence} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><PauseCircle size={15} /> Mettre en attente — Demander une dérogation</button>
              <button onClick={() => finaliserSoumission(Number(form.montant))} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13 }}><HandCoins size={15} /> Faire payer l'intégralité au patient ({fmt(form.montant)})</button>
              <button onClick={() => setStep("form")} className="w-full text-center py-1" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Modifier la demande</button>
            </div>
          </Card>
        </div>
      )}
      {sub === "nouvelle" && step === "depassement" && (
        <div className="px-5">
          <Card className="p-5" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
            <div className="flex items-center gap-2 mb-3"><AlertOctagon size={20} color={C.red} /><span style={{ fontFamily: serif, fontSize: 16, color: C.red, fontWeight: 700 }}>Dépassement de plafond détecté</span></div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Soin — {catalogue.find((a) => a.code === form.acteCode)?.libelle}</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.ink }}>{fmt(form.montant)}</span></div>
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Solde disponible ({patientActif?.grade || "grade du patient"})</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.green }}>{fmt(soldeDisponible)}</span></div>
              <div className="flex items-center justify-between pt-1.5" style={{ borderTop: `1px solid ${C.red}` }}><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.red }}>Dépassement</span><span style={{ fontFamily: mono, fontSize: 15, fontWeight: 800, color: C.red }}>{fmt(depassement)}</span></div>
            </div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginBottom: 12 }}>Deux options : mettre le soin en attente le temps d'obtenir une dérogation RH, ou faire régler le dépassement directement par le patient.</div>
            <div className="space-y-2">
              <button onClick={mettreEnAttente} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><PauseCircle size={15} /> Mettre en attente — Demander une dérogation RH</button>
              <button onClick={() => finaliserSoumission(depassement)} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13 }}><HandCoins size={15} /> Faire payer le surplus au patient ({fmt(depassement)})</button>
              <button onClick={() => setStep("form")} className="w-full text-center py-1" style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Modifier la demande</button>
            </div>
          </Card>
        </div>
      )}
      {sub === "nouvelle" && step === "loading" && <div className="px-5"><Card className="p-8 flex flex-col items-center gap-3"><Loader2 size={28} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Transmission à l'assureur…</span></Card></div>}
      {sub === "nouvelle" && step === "done" && (
        <div className="px-5">
          <Card className="p-6 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: C.greenSoft }}><Check size={22} color={C.green} /></div>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Demande envoyée</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Le règlement CSU/Assurance apparaîtra dans vos relevés hebdomadaires.</div>
            {surplusPatient > 0 && <div className="flex items-center gap-1.5 mt-1" style={{ color: C.amber }}><HandCoins size={13} /><span style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{fmt(surplusPatient)} réglés directement par le patient (dépassement de plafond)</span></div>}
          </Card>
          {bon && (
            <Card className="p-4 mt-3" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
              <div className="flex items-center gap-2 mb-2"><Ticket size={16} color={C.gold} /><span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: "white" }}>Bon de prise en charge</span></div>
              <div style={{ fontFamily: mono, fontSize: 15, color: C.gold, fontWeight: 800 }}>{bon.numero}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", marginTop: 4 }}>{bon.patientNom} · {bon.acteLibelle}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>{fmt(bon.montant)} · {bon.date}</div>
              <button onClick={() => { downloadText(`Bon_${bon.numero}.txt`, `BON DE PRISE EN CHARGE\nRéférence : ${bon.numero}\nPatient : ${bon.patientNom} (${bon.patientCarte})\nActe : ${bon.acteLibelle}\nMontant : ${fmt(bon.montant)}\nCSU : ${fmt(bon.vent.csu)}  Assurance : ${fmt(bon.vent.assurance)}  Reste : ${fmt(bon.vent.resteACharge)}\nDate : ${bon.date}\nÉtablissement : ${session.etablissement.nom}`); notify("Bon de prise en charge téléchargé"); }} className="w-full rounded-lg py-2.5 mt-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 12.5 }}><FileDown size={13} /> Télécharger le bon</button>
            </Card>
          )}
          <button onClick={reset} className="w-full text-center mt-3" style={{ fontFamily: sans, color: C.navy2, fontWeight: 700, fontSize: 12 }}>Faire une nouvelle demande</button>
        </div>
      )}

      {sub === "historique" && (
        <div className="px-5 space-y-2">
          <button onClick={synchroniserReglements} disabled={syncingReglements} className="w-full rounded-xl py-2.5 mb-1 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
            {syncingReglements ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncingReglements ? "Synchronisation…" : "Synchroniser les règlements (assureur)"}
          </button>
          {session.soins.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun soin enregistré pour l'instant.</span></Card>}
          {session.soins.map((s) => (
            <Card key={s.id} onClick={() => setSoinSelectionne(s.id)} className="p-3.5 cursor-pointer">
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{s.patientNom}</span><StatusPill statut={s.statutReglement} /></div>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 1 }}>{s.type} · {s.garantie} · {s.date}{s.heure ? ` à ${s.heure}` : ""}</div>
              <div className="flex items-center justify-between mt-1.5 mb-2"><span style={{ fontFamily: mono, fontSize: 10, color: C.sub }}>{s.patientCarte}</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.navy }}>{fmt(s.montant)}</span></div>
              {s.vent && <VentilationBar vent={s.vent} montant={s.montant} />}
              {s.numeroBordereau && <div className="flex items-center gap-1.5 mt-2"><FileCheck size={11} color={C.green} /><span style={{ fontFamily: mono, fontSize: 10, color: C.green, fontWeight: 700 }}>Bordereau {s.numeroBordereau} — réglé le {s.dateReglement}</span></div>}
              <div className="flex items-center justify-end gap-1 mt-2"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.navy2, fontWeight: 700 }}>Voir le détail</span><ChevronRight size={12} color={C.navy2} /></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* =================================================================
   DÉROGATIONS — soumission et suivi (validation côté entreprise/assureur)
================================================================= */
function Derogations({ session, setSession, notify, go, patientActif, initialAction, derogationPrefill, setDerogationPrefill, setSoinAutorise }) {
  const [sub, setSub] = useState(initialAction === "nouvelle" ? "nouvelle" : "suivi");
  const [filtre, setFiltre] = useState("Toutes");
  const [form, setForm] = useState({
    patientNom: derogationPrefill?.patientNom || patientActif?.nom || "",
    patientCarte: patientActif?.carte || "",
    destinataire: "Entreprise (RH souscripteur)",
    souscripteur: patientActif?.souscripteur || "",
    motif: derogationPrefill?.motif || "",
    montantDemande: derogationPrefill?.montantDemande || "",
    plafondRestant: derogationPrefill?.plafondRestant || "",
    donneesSoin: derogationPrefill?.donneesSoin || null,
  });
  const [step, setStep] = useState("form");

  React.useEffect(() => {
    if (patientActif && initialAction === "nouvelle" && !derogationPrefill) { setForm((f) => ({ ...f, patientNom: patientActif.nom, patientCarte: patientActif.carte, souscripteur: patientActif.souscripteur || f.souscripteur })); setSub("nouvelle"); }
  }, [patientActif, initialAction, derogationPrefill]);

  React.useEffect(() => { if (derogationPrefill && setDerogationPrefill) setDerogationPrefill(null); }, []);
  React.useEffect(() => { synchroniser(); }, []);

  const [syncing, setSyncing] = useState(false);
  const [derogSelectionnee, setDerogSelectionnee] = useState(null);
  const [derogEdition, setDerogEdition] = useState(null);

  const soumettre = () => {
    if (!form.patientNom || !form.motif || !form.montantDemande) return;
    setStep("loading");
    setTimeout(async () => {
      const uid = `PREST-${Date.now()}`;
      const entry = { id: Date.now(), uid, patientNom: form.patientNom, patientCarte: form.patientCarte || "—", destinataire: form.destinataire, souscripteur: form.souscripteur || "Souscripteur du patient", motif: form.motif, montantDemande: Number(form.montantDemande), plafondRestant: Number(form.plafondRestant) || 0, dateEnvoi: "07/07/2026", statut: "En attente", etablissement: session.etablissement.nom, devise: "CDF", donneesSoin: form.donneesSoin || null, soinFinalise: false };
      setSession({
        ...session,
        derogations: [entry, ...session.derogations],
        alertes: [{ id: Date.now(), type: "derogation", titre: "Dérogation soumise", detail: `${entry.patientNom} — ${fmt(entry.montantDemande)} envoyée à ${entry.destinataire}`, gravite: "warning", actionGo: "derogations", actionLabel: "Voir le suivi" }, ...session.alertes],
      });
      const partagees = await chargerDerogationsPartagees();
      await sauvegarderDerogationsPartagees([entry, ...partagees]);
      setStep("done");
      notify(`Dérogation envoyée à ${form.destinataire} pour ${entry.patientNom}`);
    }, 1100);
  };
  const reset = () => { setStep("form"); setForm({ patientNom: "", patientCarte: "", destinataire: "Entreprise (RH souscripteur)", souscripteur: "", motif: "", montantDemande: "", plafondRestant: "" }); };

  const synchroniser = async () => {
    setSyncing(true);
    const partagees = await chargerDerogationsPartagees();
    setSession((s) => ({
      ...s,
      derogations: s.derogations.map((d) => {
        if (!d.uid) return d;
        const maj = partagees.find((p) => p.uid === d.uid);
        return maj && maj.statut !== d.statut ? { ...d, statut: maj.statut, traitePar: maj.traitePar } : d;
      }),
    }));
    setSyncing(false);
    notify("Statuts synchronisés avec le destinataire");
  };

  const liste = session.derogations.filter((d) => filtre === "Toutes" || d.statut === filtre);

  const enregistrerEditionDerog = () => {
    setSession({
      ...session,
      derogations: session.derogations.map((d) => (d.id === derogSelectionnee ? { ...d, motif: derogEdition.motif, montantDemande: Number(derogEdition.montantDemande), plafondRestant: Number(derogEdition.plafondRestant) || 0, destinataire: derogEdition.destinataire } : d)),
    });
    notify("Dérogation modifiée");
    setDerogEdition(null);
  };

  if (derogSelectionnee) {
    const d = session.derogations.find((x) => x.id === derogSelectionnee);
    if (!d) { setDerogSelectionnee(null); return null; }
    return (
      <div className="pb-6">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => { setDerogSelectionnee(null); setDerogEdition(null); }} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Détail de la dérogation</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{d.dateEnvoi}</div></div>
        </div>
        <div className="px-5">
          <Card className="p-4">
            <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{d.patientNom}</span><StatusPill statut={d.statut} /></div>
            {d.patientCarte && <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, marginTop: 2 }}>{d.patientCarte}</div>}
          </Card>

          <SectionLabel>Motif & montant</SectionLabel>
          {!derogEdition ? (
            <Card className="p-4">
              <div style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{d.motif}</div>
              <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Montant demandé</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(d.montantDemande)}</span></div>
              <div className="flex items-center justify-between mt-1"><span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Plafond restant</span><span style={{ fontFamily: mono, fontSize: 12, color: C.ink }}>{fmt(d.plafondRestant)}</span></div>
              {d.destinataire && <div className="flex items-center gap-1.5 mt-2"><Send size={11} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.navy2 }}>Envoyée à : {d.destinataire}</span></div>}
              {d.traitePar && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 4 }}>Traitée par {d.traitePar}</div>}
            </Card>
          ) : (
            <Card className="p-4 space-y-3">
              <Field label="Motif"><textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={derogEdition.motif || ""} onChange={(e) => setDerogEdition({ ...derogEdition, motif: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Montant demandé"><input style={inputStyle} value={derogEdition.montantDemande || ""} onChange={(e) => setDerogEdition({ ...derogEdition, montantDemande: e.target.value.replace(/\D/g, "") })} /></Field>
                <Field label="Plafond restant"><input style={inputStyle} value={derogEdition.plafondRestant || ""} onChange={(e) => setDerogEdition({ ...derogEdition, plafondRestant: e.target.value.replace(/\D/g, "") })} /></Field>
              </div>
              <Field label="Destinataire">
                <select style={inputStyle} value={derogEdition.destinataire || "Assureur (NeoGTec HealthCare)"} onChange={(e) => setDerogEdition({ ...derogEdition, destinataire: e.target.value })}>
                  <option>Entreprise (RH souscripteur)</option>
                  <option>Assureur (NeoGTec HealthCare)</option>
                  <option>Assuré principal (police individuelle/familiale)</option>
                </select>
              </Field>
              <div className="flex gap-2">
                <button onClick={() => setDerogEdition(null)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button>
                <button onClick={enregistrerEditionDerog} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Enregistrer</button>
              </div>
            </Card>
          )}

          {!derogEdition && d.statut === "En attente" && (
            <button onClick={() => setDerogEdition({ motif: d.motif, montantDemande: String(d.montantDemande), plafondRestant: String(d.plafondRestant), destinataire: d.destinataire || "Entreprise (RH souscripteur)" })} className="w-full rounded-xl py-3 mt-2 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><PenLine size={14} /> Modifier cette dérogation</button>
          )}
          {d.statut !== "En attente" && (
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, textAlign: "center", marginTop: 8 }}>Cette dérogation a déjà été traitée — non modifiable.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Dérogations</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Dépassement de plafond & soins hors contrat</div></div>
      </div>
      <div className="px-5">
        <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
          <FileWarning size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Quand un patient a épuisé son plafond mais nécessite un soin urgent, soumettez une dérogation. Le RH ou le souscripteur reçoit une notification et peut débloquer la PEC.</span>
        </Card>
        <div className="flex gap-2 mb-3">
          {[["nouvelle", "Nouvelle demande"], ["suivi", "Suivi"]].map(([k, l]) => (
            <button key={k} onClick={() => { setSub(k); reset(); }} className="flex-1 rounded-full py-2" style={{ background: sub === k ? C.navy : "white", color: sub === k ? "white" : C.ink, border: `1px solid ${sub === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{l}</button>
          ))}
        </div>

        {sub === "nouvelle" && step === "form" && (
          <Card className="p-4 space-y-3">
            <Field label="Nom du patient"><input style={inputStyle} value={form.patientNom} onChange={(e) => setForm({ ...form, patientNom: e.target.value })} placeholder="Nom et prénom" /></Field>
            <Field label="N° de carte"><input style={inputStyle} value={form.patientCarte} onChange={(e) => setForm({ ...form, patientCarte: e.target.value })} placeholder="SP-KIN-000482-00" /></Field>
            {patientActif && form.patientCarte === patientActif.carte && (
              <div className="flex items-center gap-1.5"><BadgeCheck size={13} color={C.green} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.green }}>Identité et souscripteur vérifiés par scan</span></div>
            )}
            <Field label="Destinataire de la demande">
              <select style={inputStyle} value={form.destinataire} onChange={(e) => setForm({ ...form, destinataire: e.target.value })}>
                <option>Entreprise (RH souscripteur)</option>
                <option>Assureur (NeoGTec HealthCare)</option>
                <option>Assuré principal (police individuelle/familiale)</option>
              </select>
            </Field>
            <Field label="Souscripteur (entreprise ou parent)">
              {patientActif && form.patientCarte === patientActif.carte && form.souscripteur ? (
                <div style={{ ...inputStyle, background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: sans, fontWeight: 600, color: C.ink }}>{form.souscripteur}</span><BadgeCheck size={14} color={C.green} />
                </div>
              ) : (
                <input style={inputStyle} value={form.souscripteur} onChange={(e) => setForm({ ...form, souscripteur: e.target.value })} placeholder="Ex : MININGCO SARL" />
              )}
            </Field>
            <Field label="Motif de la dérogation"><textarea style={{ ...inputStyle, minHeight: 70, resize: "none" }} value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} placeholder="Ex : Urgence chirurgicale — appendicite" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Montant du soin (CDF)"><input style={inputStyle} value={form.montantDemande} onChange={(e) => setForm({ ...form, montantDemande: e.target.value.replace(/\D/g, "") })} placeholder="85000" /></Field>
              <Field label="Plafond restant (CDF)"><input style={inputStyle} value={form.plafondRestant} onChange={(e) => setForm({ ...form, plafondRestant: e.target.value.replace(/\D/g, "") })} placeholder="2000" /></Field>
            </div>
            {Number(form.montantDemande) > 0 && Number(form.plafondRestant) >= 0 && Number(form.montantDemande) > Number(form.plafondRestant) && (
              <Card className="p-3" style={{ background: C.amberSoft }}>
                <div className="flex items-center gap-1.5"><AlertTriangle size={12} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink }}>Dépassement de {fmt(Number(form.montantDemande) - Number(form.plafondRestant))} à faire valider.</span></div>
              </Card>
            )}
            <button onClick={soumettre} disabled={!form.patientNom || !form.motif || !form.montantDemande} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-1" style={{ background: (!form.patientNom || !form.motif || !form.montantDemande) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><Send size={14} /> Envoyer la demande de dérogation</button>
          </Card>
        )}
        {sub === "nouvelle" && step === "loading" && <Card className="p-8 flex flex-col items-center gap-3"><Loader2 size={28} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.sub }}>Envoi au souscripteur…</span></Card>}
        {sub === "nouvelle" && step === "done" && (
          <Card className="p-6 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: C.amberSoft }}><Loader2 size={22} color={C.amber} /></div>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Demande en attente de validation</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Vous serez notifié dès que le RH ou le souscripteur aura statué.</div>
            <button onClick={reset} className="mt-2" style={{ fontFamily: sans, color: C.navy2, fontWeight: 700, fontSize: 12 }}>Faire une nouvelle demande</button>
          </Card>
        )}

        {sub === "suivi" && (
          <>
            <button onClick={synchroniser} disabled={syncing} className="w-full rounded-xl py-2.5 mb-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
              {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncing ? "Synchronisation…" : "Synchroniser les statuts (RH / assureur)"}
            </button>
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
              {["Toutes", "En attente", "Approuvée", "Refusée"].map((f) => (
                <button key={f} onClick={() => setFiltre(f)} className="flex-shrink-0 rounded-full px-2.5 py-1.5" style={{ background: filtre === f ? C.navy : "white", color: filtre === f ? "white" : C.ink, border: `1px solid ${filtre === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {liste.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune dérogation pour ce filtre.</span></Card>}
              {liste.map((d) => {
                const pObj = (session.patientsAffilies || []).find((p) => p.nom === d.patientNom);
                return (
                  <Card key={d.id} onClick={() => setDerogSelectionnee(d.id)} className="p-3.5 cursor-pointer hover:border-amber-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <PatientAvatar nom={d.patientNom} photo={pObj?.photo} size={32} />
                        <div>
                          <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{d.patientNom}</span>
                          {d.patientCarte && <div style={{ fontFamily: mono, fontSize: 9.5, color: C.sub }}>Carte : {d.patientCarte}</div>}
                        </div>
                      </div>
                      <StatusPill statut={d.statut} />
                    </div>

                    <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 4 }}>{d.motif}</div>
                    {d.destinataire && <div className="flex items-center gap-1 mt-1"><Send size={10} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10, color: C.navy2, fontWeight: 700 }}>Envoyée à : {d.destinataire}</span></div>}
                    <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{d.souscripteur} · {d.dateEnvoi}</span><span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.gold }}>{fmt(d.montantDemande)}</span></div>
                    {d.traitePar && <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Traitée par {d.traitePar}</div>}
                    {d.statut === "Approuvée" && d.donneesSoin && !d.soinFinalise && (
                      <button onClick={(e) => { e.stopPropagation(); setSoinAutorise({ ...d.donneesSoin, derogationUid: d.uid }); go("soins", "nouvelle"); }} className="w-full rounded-lg py-2 mt-2 flex items-center justify-center gap-1.5 cursor-pointer" style={{ background: C.green, color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><Check size={13} /> Finaliser ce soin (dérogation approuvée)</button>
                    )}
                    {d.soinFinalise && (
                      <div className="flex items-center gap-1.5 mt-2"><CheckCircle2 size={11} color={C.green} /><span style={{ fontFamily: sans, fontSize: 10, color: C.green, fontWeight: 700 }}>Soin finalisé et transmitted</span></div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-2"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.navy2, fontWeight: 700 }}>Voir le détail</span><ChevronRight size={12} color={C.navy2} /></div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =================================================================
   PATIENTS — dossiers médicaux, plafonds temps réel, notes
================================================================= */
function QrPlaceholder({ size = 92 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 92 92">
      <rect width={92} height={92} fill="white" />
      {Array.from({ length: 8 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => ((r + c) % 3 === 0 || (r === 0 && c === 0) || (r === 0 && c === 7) || (r === 7 && c === 0)) && <rect key={`${r}-${c}`} x={r * 11} y={c * 11} width={10} height={10} fill={C.navy} />))}
    </svg>
  );
}

function Patients({ session, setSession, notify, go }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [noteTexte, setNoteTexte] = useState("");
  const [qrOuvert, setQrOuvert] = useState(false);
  const [filtreDateVisite, setFiltreDateVisite] = useState("Toutes");
  const [consommationPatients, setConsommationPatients] = useState(null);

  const patients = session.patientsAffilies || [];
  const patientSelectionne = patients.find((x) => x.carte === selected);

  React.useEffect(() => {
    if (!patientSelectionne?.police) { setConsommationPatients(null); return; }
    (async () => {
      const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
      const compte = comptes.find((c) => c.donnees?.police === patientSelectionne.police);
      setConsommationPatients(compte?.donnees?.garantiesConsommation || null);
    })();
  }, [selected]);

  const filtered = patients.filter((p) => p.nom.toLowerCase().includes(query.toLowerCase()) || p.carte.toLowerCase().includes(query.toLowerCase()));

  const ajouterNote = (p) => {
    if (!noteTexte.trim()) return;
    const note = { id: Date.now(), date: "07/07/2026", auteur: session.etablissement.responsable || "Praticien", texte: noteTexte };
    setSession({
      ...session,
      patientsAffilies: patients.map((x) => (x.carte === p.carte ? { ...x, dossier: { ...x.dossier, notes: [note, ...x.dossier.notes] } } : x)),
    });
    setNoteTexte("");
    notify("Note médicale ajoutée au dossier");
  };

  if (selected) {
    const p = patients.find((x) => x.carte === selected);
    if (!p) { setSelected(null); return null; }
    const soinsPatient = session.soins.filter((s) => s.patientNom === p.nom);
    return (
      <div className="pb-6">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => { setSelected(null); setQrOuvert(false); }} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Dossier patient</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub, display: "flex", alignItems: "center", gap: 4 }}><Lock size={9} color={C.green} /> Chiffré · Continuité des soins entre établissements</div></div>
        </div>
        <div className="px-5">
          <Card className="p-4 flex items-center gap-3">
            <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 54, height: 54 }}><img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.ink }}>{p.nom}</div><div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{p.carte}</div></div>
            <button onClick={() => setQrOuvert(!qrOuvert)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 34, height: 34, background: C.navy }}><QrCode size={15} color="white" /></button>
          </Card>
          {qrOuvert && (
            <Card className="p-4 flex flex-col items-center mt-2">
              <QrPlaceholder />
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 8, textAlign: "center" }}>Code d'accès rapide au dossier — à scanner par un confrère autorisé</div>
            </Card>
          )}

          <SectionLabel>Plafonds restants (temps réel)</SectionLabel>
          <div className="space-y-2">
            {(p.garanties || []).map((g0, i) => {
              const reel = consommationPatients?.find((r) => r.nom === g0.nom);
              const g = reel ? { ...g0, plafond: reel.plafond ?? g0.plafond, consomme: reel.consomme } : g0;
              const pct = Math.round((g.consomme / g.plafond) * 100);
              return (
                <Card key={i} className="p-3 flex items-center gap-3">
                  <Ring pct={pct} size={36} stroke={5} color={pct >= 90 ? C.red : pct >= 70 ? C.amber : C.gold} />
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.ink }}>{g.nom}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Restant : {fmt(g.plafond - g.consomme)}</div></div>
                  <span style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 700, color: pct >= 90 ? C.red : C.navy }}>{pct}%</span>
                </Card>
              );
            })}
          </div>

          {Object.keys(p.dossier.constantesVitales || {}).length > 0 && (
            <>
              <SectionLabel>Constantes vitales {p.dossier.constantesVitales.dateRelevé && <span style={{ fontWeight: 400, textTransform: "none" }}>· relevées le {p.dossier.constantesVitales.dateRelevé}</span>}</SectionLabel>
              <Card className="p-4 grid grid-cols-3 gap-3 text-center">
                <div><HeartPulse size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Tension</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.dossier.constantesVitales.tension || "—"}</div></div>
                <div><Activity size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Pouls</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.dossier.constantesVitales.frequenceCardiaque || "—"}</div></div>
                <div><Thermometer size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Température</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.dossier.constantesVitales.temperature || "—"}</div></div>
                <div><Ruler size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Taille</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.dossier.constantesVitales.taille || "—"}</div></div>
                <div><Layers size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Poids / IMC</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.dossier.constantesVitales.poids || "—"} {p.dossier.constantesVitales.imc && `(${p.dossier.constantesVitales.imc})`}</div></div>
                <div><Heart size={16} color={C.navy2} className="mx-auto" /><div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Groupe</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.ink }}>{p.dossier.constantesVitales.groupeSanguin || "—"}</div></div>
              </Card>
            </>
          )}

          {p.dossier.allergies.length > 0 && (
            <>
              <SectionLabel>Allergies</SectionLabel>
              <Card className="p-4"><ul className="space-y-1.5">{p.dossier.allergies.map((a, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12, color: C.ink }}><AlertTriangle size={13} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />{a}</li>)}</ul></Card>
            </>
          )}

          {p.dossier.maladiesChroniques?.length > 0 && (
            <>
              <SectionLabel>Maladies chroniques</SectionLabel>
              <Card className="p-4"><ul className="space-y-1.5">{p.dossier.maladiesChroniques.map((a, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12, color: C.ink }}><HeartPulse size={13} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />{a}</li>)}</ul></Card>
            </>
          )}

          {p.dossier.traitementsEnCours.length > 0 && (
            <>
              <SectionLabel>Traitements en cours</SectionLabel>
              <div className="space-y-2">
                {p.dossier.traitementsEnCours.map((t, i) => (
                  <Card key={i} className="p-3.5 flex items-center gap-3">
                    <Pill size={15} color={C.navy2} />
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{t.nom}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{t.posologie}</div></div>
                    {t.depuis && <span style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Depuis {t.depuis}</span>}
                  </Card>
                ))}
              </div>
            </>
          )}

          {p.dossier.antecedentsChirurgicaux?.length > 0 && (
            <>
              <SectionLabel>Antécédents chirurgicaux</SectionLabel>
              <div className="space-y-2">
                {p.dossier.antecedentsChirurgicaux.map((a, i) => (
                  <Card key={i} className="p-3.5 flex items-center gap-3">
                    <Scissors size={15} color={C.navy2} />
                    <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{a.intervention}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{a.etablissement}</div></div>
                    <span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{a.date}</span>
                  </Card>
                ))}
              </div>
            </>
          )}

          {p.dossier.antecedentsFamiliaux?.length > 0 && (
            <>
              <SectionLabel>Antécédents familiaux</SectionLabel>
              <Card className="p-4"><ul className="space-y-1.5">{p.dossier.antecedentsFamiliaux.map((a, i) => <li key={i} className="flex gap-2" style={{ fontFamily: sans, fontSize: 12, color: C.ink }}><Dna size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />{a}</li>)}</ul></Card>
            </>
          )}

          {p.dossier.visites?.length > 0 && (() => {
            const visites = p.dossier.visites;
            const visitesFiltrees = filtreDateVisite === "Toutes" ? visites : visites.filter((v) => v.date === filtreDateVisite);
            return (
              <>
                <SectionLabel>Historique des visites (par date)</SectionLabel>
                <div className="px-0 mb-3">
                  <select value={filtreDateVisite} onChange={(e) => setFiltreDateVisite(e.target.value)} style={inputStyle}>
                    <option value="Toutes">Toutes les dates ({visites.length})</option>
                    {visites.map((v) => <option key={v.date} value={v.date}>{v.date} — {v.motif}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  {visitesFiltrees.map((v, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.navy }}>{v.date}{v.heure ? ` à ${v.heure}` : ""}</span>
                        {v.motif && <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, color: C.navy2, background: C.ivory, padding: "2px 8px", borderRadius: 999 }}>{v.motif}</span>}
                      </div>
                      {v.liePecUid && (
                        <div className="flex items-center gap-1.5 mb-2 p-2 rounded-lg" style={{ background: "#EAF6EF" }}>
                          <Receipt size={12} color={C.green} />
                          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.green, fontWeight: 700 }}>Facturée — {v.lieActeLibelle} · {fmt(v.lieMontant)}{v.lieNumeroBon ? ` · Bon ${v.lieNumeroBon}` : ""}</span>
                        </div>
                      )}
                      {v.diagnostic && <div className="flex items-center gap-2 mb-1"><Stethoscope size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Diagnostic : <b>{v.diagnostic}</b></span></div>}
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
                          <ul className="space-y-1">{v.ordonnance.medicaments.map((m, j) => <li key={j} style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>· {m}</li>)}</ul>
                        </div>
                      )}

                      {v.documents?.length > 0 && (
                        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                          <div className="flex items-center gap-1.5 mb-1.5"><Paperclip size={12} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Documents joints</span></div>
                          {v.documents.map((doc, j) => <div key={j} style={{ fontFamily: sans, fontSize: 12, color: C.ink, padding: "2px 0" }}>{doc.nom}</div>)}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </>
            );
          })()}

          {(!p.dossier.visites || p.dossier.visites.length === 0) && <Card className="p-4 mt-2"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Aucun historique de visite pour l'instant.</span></Card>}

          <SectionLabel>Notes médicales</SectionLabel>
          <Card className="p-3.5 mb-2">
            <textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={noteTexte} onChange={(e) => setNoteTexte(e.target.value)} placeholder="Ajouter une note ou un résultat d'examen…" />
            <button onClick={() => ajouterNote(p)} disabled={!noteTexte.trim()} className="w-full rounded-lg py-2 mt-2 flex items-center justify-center gap-1.5" style={{ background: noteTexte.trim() ? C.navy : "#C9CDD6", color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><NotebookPen size={13} /> Ajouter la note</button>
          </Card>
          <div className="space-y-2">
            {p.dossier.notes.map((n) => (
              <Card key={n.id} className="p-3">
                <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy }}>{n.auteur}</span><span style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{n.date}</span></div>
                <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 3 }}>{n.texte}</div>
              </Card>
            ))}
          </div>

          <button onClick={() => go("soins", "nouvelle")} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-4" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13 }}><Stethoscope size={15} /> Nouvelle demande de PEC pour ce patient</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2">
        <div style={{ fontFamily: serif, fontSize: 20, color: C.navy, fontWeight: 700 }}>Patients</div>
        <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Dossiers médicaux centralisés de vos assurés affiliés</div>
      </div>
      <div className="px-5">
        <div className="relative mb-3">
          <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un patient, une carte…" style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>
        <div className="space-y-2">
          {filtered.map((p) => {
            const pctGlobal = Math.round((p.garanties.reduce((s, g) => s + g.consomme, 0) / p.garanties.reduce((s, g) => s + g.plafond, 0)) * 100);
            return (
              <Card key={p.carte} onClick={() => setSelected(p.carte)} className="p-3.5 flex items-center gap-3 cursor-pointer">
                <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 42, height: 42 }}><img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div className="flex-1">
                  <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{p.nom}</div>
                  <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{p.formule} · {p.carte}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill statut={p.statutPolice} />
                  <span style={{ fontFamily: mono, fontSize: 10, color: pctGlobal >= 90 ? C.red : C.sub }}>{pctGlobal}% conso.</span>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun patient trouvé.</span></Card>}
        </div>
      </div>
    </div>
  );
}


function Accueil({ session, notify, go, onRestart }) {
  const soinsAujourdhui = session.soins.filter((s) => s.date === "07/07/2026").length;
  const montantFacture = session.soins.reduce((s, x) => s + x.montant, 0);
  const montantEnAttente = session.soins.filter((s) => s.statutReglement === "En attente").reduce((s, x) => s + x.montant, 0);
  const derogEnAttente = session.derogations.filter((d) => d.statut === "En attente").length;
  const reglementEnAttente = session.reglements.find((r) => r.statut === "En attente");

  return (
    <div className="pb-6">
      <div className="px-5 pt-2 pb-4 flex items-center justify-between">
        <div><div style={{ fontFamily: sans, fontSize: 13, color: C.sub }}>Espace prestataire</div><div style={{ fontFamily: serif, fontSize: 21, color: C.navy, fontWeight: 700 }}>{session.etablissement.nom}</div>{session.compteReel && <div className="flex items-center gap-1 mt-0.5"><ShieldCheck size={11} color={C.green} /><span style={{ fontFamily: sans, fontSize: 9.5, color: C.green, fontWeight: 700 }}>Connecté avec vos identifiants — {session.roleConnexion}</span></div>}</div>
        <button onClick={onRestart} className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5" style={{ border: `1px solid ${C.line}` }} title="Retour à l'écran de démarrage">
          <RefreshCw size={12} color={C.sub} /><span style={{ fontFamily: sans, fontSize: 10, color: C.sub, fontWeight: 600 }}>Début</span>
        </button>
      </div>

      {(derogEnAttente > 0 || reglementEnAttente) && (
        <div className="px-5 mb-3 space-y-2">
          {derogEnAttente > 0 && (
            <Card onClick={() => go("derogations", "suivi")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.amberSoft }}>
              <FileWarning size={15} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}>{derogEnAttente} dérogation(s) en attente de validation</span><ChevronRight size={14} color={C.amber} />
            </Card>
          )}
          {reglementEnAttente && (
            <Card onClick={() => go("plus", "reglements")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.ivory }}>
              <Wallet size={15} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}>Règlement de {fmt(reglementEnAttente.montantFacture)} en attente ({reglementEnAttente.periode})</span><ChevronRight size={14} color={C.navy2} />
            </Card>
          )}
        </div>
      )}

      <div className="px-5 grid grid-cols-2 gap-3">
        <Card className="p-4"><ClipboardCheck size={18} color={C.navy2} /><div style={{ fontFamily: serif, fontSize: 22, color: C.navy, marginTop: 6 }}>{session.soins.length}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Actes enregistrés</div></Card>
        <Card className="p-4"><FileWarning size={18} color={C.amber} /><div style={{ fontFamily: serif, fontSize: 22, color: C.navy, marginTop: 6 }}>{derogEnAttente}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Dérogations en attente</div></Card>
      </div>

      <div className="px-5 mt-3">
        <Card className="p-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
          <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Montant facturé (cumulé)</div>
          <div style={{ fontFamily: serif, fontSize: 24, color: "white", marginTop: 4 }}>{fmt(montantFacture)}</div>
          <div style={{ fontFamily: sans, fontSize: 11.5, color: "#B9C3D6" }}>dont {fmt(montantEnAttente)} en attente de règlement CSU/Assurance</div>
        </Card>
      </div>

      <SectionLabel>Évolution hebdomadaire (facturé)</SectionLabel>
      <div className="px-5">
        <Card className="p-4">
          <div style={{ width: "100%", height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSO_HEBDO} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="prestConsoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.5} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                <XAxis dataKey="semaine" tick={{ fontSize: 10, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} width={30} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontFamily: sans, fontSize: 11, borderRadius: 8, border: `1px solid ${C.line}` }} />
                <Area type="monotone" dataKey="montant" stroke={C.gold} strokeWidth={2} fill="url(#prestConsoGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <SectionLabel>Actions rapides</SectionLabel>
      <div className="px-5 grid grid-cols-2 gap-3">
        <button onClick={() => go("scanner")} className="text-left"><Card className="p-4" style={{ background: "#EAF2EC", border: "none" }}><ScanLine size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Scanner un patient</div></Card></button>
        <button onClick={() => go("patients")} className="text-left"><Card className="p-4" style={{ background: "#F7EAEA", border: "none" }}><FolderOpen size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Dossiers patients</div></Card></button>
        <button onClick={() => go("soins", "nouvelle")} className="text-left"><Card className="p-4" style={{ background: "#FBEAE8", border: "none" }}>{session.etablissement.type === "Pharmacie" ? <Pill size={19} color={C.navy2} /> : <Stethoscope size={19} color={C.navy2} />}<div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>{session.etablissement.type === "Pharmacie" ? "Dispenser une ordonnance" : "Nouvelle PEC"}</div></Card></button>
        <button onClick={() => go("derogations", "nouvelle")} className="text-left"><Card className="p-4" style={{ background: "#EEF1F8", border: "none" }}><FileWarning size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Soumettre une dérogation</div></Card></button>
        <button onClick={() => go("plus", "reglements")} className="text-left"><Card className="p-4" style={{ background: "#F2EDF6", border: "none" }}><Wallet size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Voir mes règlements</div></Card></button>
        <button onClick={() => go("plus", "equipe")} className="text-left"><Card className="p-4" style={{ background: "#EAF0F2", border: "none" }}><UserCog size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Équipe & rôles</div></Card></button>
        <button onClick={() => go("calculateur")} className="text-left"><Card className="p-4" style={{ background: "#FDF3E7", border: "none" }}><Calculator size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Calculateur PEC</div></Card></button>
        {session.etablissement.type === "Pharmacie" && (
          <button onClick={() => go("stock")} className="text-left"><Card className="p-4" style={{ background: "#E9F1F5", border: "none" }}><Package size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Stock & rendu monnaie</div></Card></button>
        )}
        <button onClick={() => go("messagerie")} className="text-left"><Card className="p-4" style={{ background: "#F4EAF0", border: "none" }}><MessageCircle size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Messagerie médecin conseil</div></Card></button>
      </div>
    </div>
  );
}

/* =================================================================
   PLUS — règlements, tarifs conventionnés, profil, assistance
================================================================= */
/* =================================================================
   ÉQUIPE & RÔLES — gestion des accès et journal d'activité
================================================================= */
/* =================================================================
   CATALOGUE UNIVERSEL DES SOINS — codes standards & tarifs négociés
================================================================= */
function ActeAccordionItem({ acte, onSave }) {
  const [draft, setDraft] = useState(String(acte.tarifNegocie));
  const [zeroBon, setZeroBon] = useState(!!acte.isZeroBon);
  const dirty = Number(draft) !== acte.tarifNegocie || zeroBon !== !!acte.isZeroBon;
  return (
    <Accordion title={`${acte.code} — ${acte.libelle}${acte.isZeroBon ? " · Zéro bon" : ""}`} right={<Tag size={13} color={C.gold} />}>
      <div className="pt-3 space-y-2">
        <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Garantie : {acte.garantie}</div>
        <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Tarif conventionné (référence réseau)</span><span style={{ fontFamily: mono, fontSize: 12, color: C.sub }}>{fmt(acte.tarifConventionne)}</span></div>
        <Field label="Tarif négocié pour cet établissement"><input style={inputStyle} value={draft} onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))} /></Field>
        <label className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: zeroBon ? "#EAF6EF" : C.ivory }}>
          <span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Zéro bon — pris en charge à 100%, patient exonéré</span>
          <input type="checkbox" checked={zeroBon} onChange={(e) => setZeroBon(e.target.checked)} />
        </label>
        <button onClick={() => onSave(acte.code, Number(draft), zeroBon)} disabled={!dirty} className="w-full rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ background: dirty ? C.navy : "#C9CDD6", color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Check size={13} /> Enregistrer</button>
      </div>
    </Accordion>
  );
}

function CatalogueSoins({ session, setSession, notify }) {
  const [query, setQuery] = useState("");
  const [syncing, setSyncing] = useState(false);
  const catalogue = session.catalogue || buildCatalogueSoins();
  const filtered = catalogue.filter((a) => a.code.toLowerCase().includes(query.toLowerCase()) || a.libelle.toLowerCase().includes(query.toLowerCase()));
  const saveActe = (code, tarifNegocie, isZeroBon) => {
    const acteAvant = catalogue.find((a) => a.code === code);
    const catalogueMaj = catalogue.map((a) => (a.code === code ? { ...a, tarifNegocie, isZeroBon } : a));
    setSession({ ...session, catalogue: catalogueMaj });
    publierTarifsPartages(session.etablissement.nom, catalogueMaj);
    if (acteAvant && Number(acteAvant.tarifNegocie) !== Number(tarifNegocie)) {
      publierAlerteTarif({
        id: `${session.etablissement.nom}-${code}-${Date.now()}`, etablissement: session.etablissement.nom,
        code, libelle: acteAvant.libelle, ancienTarif: Number(acteAvant.tarifNegocie), nouveauTarif: Number(tarifNegocie),
        date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), lu: false,
      });
    }
    notify(`Tarif négocié pour ${code} mis à jour et transmis automatiquement à l'assureur`);
  };
  const synchroniser = async () => {
    setSyncing(true);
    const distant = await chargerTarifsPartages(session.etablissement.nom);
    if (distant && distant.length) {
      setSession((s) => ({ ...s, catalogue: distant }));
      notify("Tarifs synchronisés — dernières valeurs configurées par l'assureur récupérées");
    } else {
      notify("Aucun tarif spécifique configuré côté assureur pour l'instant");
    }
    setSyncing(false);
  };
  return (
    <div className="px-5">
      <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
        <Hash size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Nomenclature standardisée inter-établissements : chaque acte porte un code universel (ex. CONS-001 = consultation médecine générale), pour que tous les hôpitaux du réseau parlent le même langage. Le tarif conventionné est la référence réseau ; le tarif négocié est propre à votre établissement. Toute modification — d'un côté comme de l'autre — est transmise automatiquement.</span>
      </Card>
      <button onClick={synchroniser} disabled={syncing} className="w-full rounded-xl py-2.5 mb-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
        {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncing ? "Synchronisation…" : "Synchroniser avec l'assureur"}
      </button>
      <div className="relative mb-3">
        <Search size={13} color={C.sub} style={{ position: "absolute", left: 10, top: 11 }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un code ou un acte…" style={{ ...inputStyle, paddingLeft: 28, fontSize: 12 }} />
      </div>
      <div className="space-y-2">
        {filtered.map((a) => <ActeAccordionItem key={a.code} acte={a} onSave={saveActe} />)}
        {filtered.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun acte trouvé.</span></Card>}
      </div>
    </div>
  );
}

function EquipeEtRoles({ session, setSession, notify }) {
  const [addOpen, setAddOpen] = useState(false);
  const [nouv, setNouv] = useState({ nom: "", role: "Médecin", email: "" });
  const equipe = session.equipe || [];
  const journal = session.journal || [];

  const ajouter = () => {
    if (!nouv.nom || !nouv.email) return;
    setSession({ ...session, equipe: [...equipe, { id: Date.now(), nom: nouv.nom, role: nouv.role, email: nouv.email, statut: "Actif" }], journal: [{ id: Date.now(), utilisateur: session.etablissement.responsable || "Administrateur", action: `${nouv.nom} ajouté(e) à l'équipe (${nouv.role})`, date: "07/07/2026 10:00" }, ...journal] });
    setNouv({ nom: "", role: "Médecin", email: "" });
    setAddOpen(false);
    notify(`${nouv.nom} ajouté(e) à l'équipe`);
  };
  const retirer = (id) => {
    const membre = equipe.find((m) => m.id === id);
    setSession({ ...session, equipe: equipe.filter((m) => m.id !== id), journal: [{ id: Date.now(), utilisateur: session.etablissement.responsable || "Administrateur", action: `${membre?.nom} retiré(e) de l'équipe`, date: "07/07/2026 10:05" }, ...journal] });
    notify("Membre retiré de l'équipe");
  };

  return (
    <div className="px-5">
      <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
        <Fingerprint size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Attribuez des rôles à votre personnel pour protéger la confidentialité des données. Chaque action est journalisée pour l'audit de sécurité.</span>
      </Card>

      <SectionLabel>Rôles disponibles</SectionLabel>
      <div className="space-y-2 mb-2">
        {ROLES.map((r) => (
          <Card key={r.id} className="p-3 flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 30, height: 30, background: C.ivory }}><UserCog size={14} color={C.navy2} /></div>
            <div><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{r.nom}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{r.permissions}</div></div>
          </Card>
        ))}
      </div>

      <SectionLabel>Membres de l'équipe ({equipe.length})</SectionLabel>
      <div className="space-y-2 mb-2">
        {equipe.map((m) => (
          <Card key={m.id} className="p-3 flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, background: C.ivory }}><Users2 size={14} color={C.navy2} /></div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{m.nom}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{m.role} · {m.email}</div></div>
            <button onClick={() => retirer(m.id)}><Trash2 size={14} color={C.red} /></button>
          </Card>
        ))}
      </div>

      {!addOpen ? (
        <button onClick={() => setAddOpen(true)} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mb-3" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Ajouter un membre</button>
      ) : (
        <Card className="p-4 space-y-2 mb-3">
          <input style={inputStyle} placeholder="Nom complet" value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} />
          <select style={inputStyle} value={nouv.role} onChange={(e) => setNouv({ ...nouv, role: e.target.value })}>{ROLES.map((r) => <option key={r.id}>{r.nom}</option>)}</select>
          <input style={inputStyle} type="email" placeholder="Email professionnel" value={nouv.email} onChange={(e) => setNouv({ ...nouv, email: e.target.value })} />
          <div className="flex gap-2"><button onClick={() => setAddOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12, color: C.ink }}>Annuler</button><button onClick={ajouter} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Ajouter</button></div>
        </Card>
      )}

      <SectionLabel>Journal d'activité (audit)</SectionLabel>
      <div className="space-y-2">
        {journal.length === 0 && <Card className="p-4"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Aucune activité enregistrée.</span></Card>}
        {journal.map((j) => (
          <Card key={j.id} className="p-3 flex items-start gap-2">
            <ScrollText size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}><b>{j.utilisateur}</b> — {j.action}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{j.date}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =================================================================
   TÉLÉCONSULTATION — équipe hospitalière ou médecin indépendant
================================================================= */
function SalleTeleconsultationPraticien({ tc, session, setSession, notify, onQuitter }) {
  const [etat, setEtat] = useState("connexion"); // connexion | en-appel | terminee
  const [micActif, setMicActif] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [reseauFaible, setReseauFaible] = useState(false);
  const [dureeSec, setDureeSec] = useState(0);
  const [diagnostic, setDiagnostic] = useState("");
  const [ordonnance, setOrdonnance] = useState("");
  const [patientDossierOuvert, setPatientDossierOuvert] = useState(null);

  const patient = (session.patientsAffilies || []).find((p) => p.nom === tc.patientNom);

  React.useEffect(() => {
    const t1 = setTimeout(() => { setEtat("en-appel"); publierStatutTeleconsultation(tc.uid, { statut: "En cours" }); }, 1300);
    return () => clearTimeout(t1);
  }, []);

  React.useEffect(() => {
    if (etat !== "en-appel") return;
    const iv = setInterval(() => setDureeSec((d) => d + 1), 1000);
    return () => clearInterval(iv);
  }, [etat]);

  const fmtDuree = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const terminer = () => {
    const nouvelleVisite = {
      date: "15/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      motif: "Téléconsultation", diagnostic: diagnostic || "Non renseigné", prescripteur: `${tc.medecin} — ${session.etablissement.nom} (téléconsultation)`,
      examens: [], imagerie: [], vaccinations: [], documents: [],
      ordonnance: ordonnance ? { medicaments: [ordonnance], statut: "Prescrite" } : null,
      teleconsultation: true,
    };
    setSession((s) => ({
      ...s,
      teleconsultations: (s.teleconsultations || []).map((t) => (t.id === tc.id ? { ...t, statut: "Terminée" } : t)),
      patientsAffilies: patient ? (s.patientsAffilies || []).map((p) => (p.nom === tc.patientNom ? { ...p, dossier: { ...p.dossier, visites: [nouvelleVisite, ...(p.dossier?.visites || [])] } } : p)) : s.patientsAffilies,
    }));
    publierStatutTeleconsultation(tc.uid, { statut: "Terminée" });
    if (tc.contrat) {
      (async () => {
        const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
        const comptesMaj = comptes.map((c) => (c.donnees?.contrat === tc.contrat ? { ...c, donnees: { ...c.donnees, telemedecineConsommee: (Number(c.donnees.telemedecineConsommee) || 0) + 1 } } : c));
        await sauvegarderCanalPartage(CLE_COMPTES_PARTAGES, comptesMaj);
      })();
    }
    setEtat("terminee");
    notify(patient ? "Consultation terminée — compte-rendu ajouté au dossier médical du patient" : "Consultation terminée");
  };

  return (
    <div className="pb-6" style={{ minHeight: 600, background: C.navy }}>
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <button onClick={onQuitter} className="flex items-center gap-1.5 cursor-pointer" style={{ fontFamily: sans, fontSize: 12, color: "white", fontWeight: 700 }}><ArrowLeft size={14} /> Quitter la salle</button>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: reseauFaible ? "#5A3B10" : "rgba(255,255,255,0.12)" }}>
          <div className="rounded-full" style={{ width: 6, height: 6, background: reseauFaible ? C.amber : C.green }} />
          <span style={{ fontFamily: sans, fontSize: 9.5, color: "white", fontWeight: 700 }}>{reseauFaible ? "Réseau faible — bascule audio compressé" : "3G / zone rurale compatible"}</span>
        </div>
      </div>

      {etat === "connexion" && (
        <div className="flex flex-col items-center justify-center gap-3" style={{ minHeight: 420 }}>
          <Loader2 size={30} color="white" className="animate-spin" />
          <span style={{ fontFamily: sans, fontSize: 13, color: "white" }}>Ouverture de la salle télémédicale…</span>
          <span style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>Ref : {tc.uid || `CON-${tc.id}`}</span>
        </div>
      )}

      {etat === "en-appel" && (
        <div className="px-4">
          <div className="rounded-2xl relative overflow-hidden mb-3 flex items-center justify-center" style={{ height: 260, background: "#0B1712" }}>
            <div className="flex flex-col items-center gap-2">
              <PatientAvatar nom={tc.patientNom} photo={patient?.photo} size={64} className="border-2 border-emerald-500" />
              <span style={{ fontFamily: sans, fontSize: 13, color: "white", fontWeight: 700 }}>{tc.patientNom}</span>
              <span style={{ fontFamily: sans, fontSize: 10.5, color: "#8896B3" }}>N° Carte : {tc.patientCarte || patient?.carte || "SP-KIN-000482"}</span>
            </div>
            <div className="absolute rounded-full px-2.5 py-1" style={{ top: 10, left: 10, background: "rgba(0,0,0,0.5)" }}><span style={{ fontFamily: mono, fontSize: 10.5, color: "white" }}>{fmtDuree(dureeSec)}</span></div>
            <div className="absolute rounded-xl flex items-center justify-center" style={{ bottom: 10, right: 10, width: 68, height: 90, background: "#1A2A20", border: "1px solid rgba(255,255,255,0.15)" }}>
              {cameraActive ? <span style={{ fontFamily: sans, fontSize: 9, color: "#8896B3" }}>Vous</span> : <VideoOff size={14} color="#8896B3" />}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={() => setMicActif(!micActif)} className="flex items-center justify-center rounded-full cursor-pointer" style={{ width: 46, height: 46, background: micActif ? "rgba(255,255,255,0.15)" : C.red }}>{micActif ? <Mic size={18} color="white" /> : <MicOff size={18} color="white" />}</button>
            <button onClick={() => setReseauFaible(!reseauFaible)} className="flex items-center justify-center rounded-full cursor-pointer" style={{ width: 46, height: 46, background: "rgba(255,255,255,0.15)" }}><Wifi size={18} color="white" /></button>
            <button onClick={() => setCameraActive(!cameraActive)} className="flex items-center justify-center rounded-full cursor-pointer" style={{ width: 46, height: 46, background: cameraActive ? "rgba(255,255,255,0.15)" : C.red }}>{cameraActive ? <Video size={18} color="white" /> : <VideoOff size={18} color="white" />}</button>
          </div>

          <Card className="p-3.5 mb-3 bg-[#F6F3EC]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PatientAvatar nom={tc.patientNom} photo={patient?.photo} size={28} />
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Dossier Médical - {tc.patientNom}</span>
              </div>
              <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.green, background: "#EAF6EF", padding: "2px 7px", borderRadius: 999 }}>CERTIFIÉ SNIS</span>
            </div>
            {patient && (
              <div className="space-y-1 text-xs mb-2 text-stone-700">
                <div className="flex justify-between"><span>Groupe Sanguin : <b>{patient.dossier?.constantesVitales?.groupeSanguin || "O Rh+"}</b></span><span>Sexe : <b>{patient.sexe || "M"}</b></span></div>
                <div>Souscripteur : <b>{patient.souscripteur || "MININGCO SARL"}</b></div>
              </div>
            )}
            <button
              onClick={() => setPatientDossierOuvert(patient || { nom: tc.patientNom, carte: tc.patientCarte || "SP-KIN-000482" })}
              className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 bg-[#0D2818] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              <BookOpen size={14} className="text-[#C6992E]" /> Consulter le Dossier Médical Complet (DME)
            </button>
          </Card>

          <Card className="p-3.5 mb-3">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Compte-rendu de consultation</div>
            <Field label="Diagnostic / observations"><textarea style={{ ...inputStyle, minHeight: 60, resize: "none" }} value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)} placeholder="Ex : Gastrite légère, hydratation recommandée" /></Field>
            <div className="mt-2"><Field label="Ordonnance (optionnel)"><input style={inputStyle} value={ordonnance} onChange={(e) => setOrdonnance(e.target.value)} placeholder="Ex : Oméprazole 20mg — 1x/jour, 7 jours" /></Field></div>
          </Card>

          <button onClick={terminer} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 mb-3 cursor-pointer" style={{ background: C.red, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}><PhoneOff size={16} /> Terminer la consultation</button>
        </div>
      )}

      {etat === "terminee" && (
        <div className="px-5">
          <Card className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: C.greenSoft }}><Check size={24} color={C.green} /></div>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>Consultation terminée</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Durée : {fmtDuree(dureeSec)}{patient ? " · Compte-rendu ajouté au dossier médical du patient" : ""}</div>
            <button onClick={onQuitter} className="w-full rounded-xl py-3 mt-2 cursor-pointer" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>Retour à mes téléconsultations</button>
          </Card>
        </div>
      )}

      {patientDossierOuvert && (
        <DossierMedicalCompletModal
          patient={patientDossierOuvert}
          session={session}
          setSession={setSession}
          notify={notify}
          onClose={() => setPatientDossierOuvert(null)}
        />
      )}
    </div>
  );
}

function Teleconsultation({ session, setSession, notify }) {
  const estIndependant = session.etablissement.type === "Cabinet médical";
  const medecinsEquipe = (session.equipe || []).filter((m) => m.role === "Médecin");
  const [form, setForm] = useState({ patientNom: "", medecin: estIndependant ? (session.etablissement.responsable || "Médecin titulaire") : (medecinsEquipe[0]?.nom || ""), date: "", heure: "" });
  const [salleActive, setSalleActive] = useState(null);
  const [patientDossierOuvert, setPatientDossierOuvert] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const teleconsultations = session.teleconsultations || [];

  const synchroniser = async () => {
    setSyncing(true);
    const partagees = await chargerTeleconsultationsPartagees();
    const nouvelles = partagees.filter((p) => !teleconsultations.some((t) => t.uid === p.uid));
    if (nouvelles.length > 0) {
      setSession((s) => ({
        ...s,
        teleconsultations: [...nouvelles.map((p) => ({ id: Date.now() + Math.random(), uid: p.uid, patientNom: p.patientNom, patientCarte: p.patientCarte, medecin: p.medecin, specialite: p.specialite, date: p.date, heure: p.heure, statut: "En attente" })), ...(s.teleconsultations || [])],
        alertes: [{ id: Date.now(), type: "teleconsultation", titre: `${nouvelles.length} demande(s) de téléconsultation reçue(s)`, detail: nouvelles.map((n) => n.patientNom).join(", "), gravite: "warning" }, ...s.alertes],
      }));
      notify(`${nouvelles.length} nouvelle(s) demande(s) de téléconsultation reçue(s) d'un patient`);
    } else {
      notify("Aucune nouvelle demande");
    }
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const confirmer = (id) => {
    const t = teleconsultations.find((x) => x.id === id);
    setSession({ ...session, teleconsultations: teleconsultations.map((x) => (x.id === id ? { ...x, statut: "Programmée" } : x)) });
    publierStatutTeleconsultation(t?.uid, { statut: "Programmée", medecin: t?.medecin });
    notify("Demande confirmée");
  };

  const programmer = () => {
    if (!form.patientNom || !form.date || !form.heure) return;
    const entry = { id: Date.now(), patientNom: form.patientNom, medecin: form.medecin, date: form.date, heure: form.heure, statut: "Programmée" };
    setSession({ ...session, teleconsultations: [entry, ...teleconsultations], alertes: [{ id: Date.now(), type: "teleconsultation", titre: "Téléconsultation programmée", detail: `${form.patientNom} avec ${form.medecin} — ${form.date} ${form.heure}`, gravite: "info" }, ...session.alertes] });
    setForm({ patientNom: "", medecin: estIndependant ? (session.etablissement.responsable || "Médecin titulaire") : (medecinsEquipe[0]?.nom || ""), date: "", heure: "" });
    notify("Téléconsultation programmée");
  };

  if (salleActive) {
    return <SalleTeleconsultationPraticien tc={salleActive} session={session} setSession={setSession} notify={notify} onQuitter={() => setSalleActive(null)} />;
  }

  return (
    <div className="px-5 pb-6">
      <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
        <Video size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{estIndependant ? "Mode médecin indépendant : gérez votre propre agenda de téléconsultations." : "Mode établissement : assignez un médecin disponible de votre équipe à chaque téléconsultation."}</span>
      </Card>

      <SectionLabel>Programmer une téléconsultation</SectionLabel>
      <Card className="p-4 space-y-2 mb-3">
        <Field label="Patient"><input style={inputStyle} value={form.patientNom} onChange={(e) => setForm({ ...form, patientNom: e.target.value })} placeholder="Nom et prénom" /></Field>
        {estIndependant ? (
          <Field label="Médecin"><div style={{ ...inputStyle, background: C.ivory }}>{form.medecin}</div></Field>
        ) : (
          <Field label="Médecin disponible">
            <select style={inputStyle} value={form.medecin} onChange={(e) => setForm({ ...form, medecin: e.target.value })}>
              {medecinsEquipe.length === 0 && <option>Aucun médecin dans l'équipe</option>}
              {medecinsEquipe.map((m) => <option key={m.id}>{m.nom}</option>)}
            </select>
          </Field>
        )}
        <Field label="Date"><input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        <Field label="Créneau">
          <div className="flex flex-wrap gap-1.5">
            {CRENEAUX_TELEMED.map((c) => <button key={c} onClick={() => setForm({ ...form, heure: c })} className="rounded-lg px-2.5 py-1.5" style={{ background: form.heure === c ? C.navy : C.ivory, color: form.heure === c ? "white" : C.ink, fontFamily: sans, fontSize: 11, fontWeight: 600 }}>{c}</button>)}
          </div>
        </Field>
        <button onClick={programmer} disabled={!form.patientNom || !form.date || !form.heure} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-1 cursor-pointer" style={{ background: (!form.patientNom || !form.date || !form.heure) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><CalendarPlus size={14} /> Programmer</button>
      </Card>

      <div className="flex items-center justify-between pr-5">
        <SectionLabel>Mes téléconsultations</SectionLabel>
        <button onClick={synchroniser} disabled={syncing} className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 cursor-pointer" style={{ border: `1px solid ${C.navy}` }}>
          {syncing ? <Loader2 size={11} color={C.navy} className="animate-spin" /> : <RefreshCw size={11} color={C.navy} />}<span style={{ fontFamily: sans, fontSize: 10, color: C.navy, fontWeight: 700 }}>Synchroniser</span>
        </button>
      </div>

      <div className="space-y-2">
        {teleconsultations.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune téléconsultation programmée.</span></Card>}
        {teleconsultations.map((t) => {
          const patientObj = (session.patientsAffilies || []).find((p) => p.nom === t.patientNom);
          return (
            <Card key={t.id} className="p-3.5" style={{ border: t.statut === "En attente" && t.uid ? `1.5px solid ${C.amber}` : `1px solid ${C.line}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PatientAvatar nom={t.patientNom} photo={patientObj?.photo} size={36} />
                  <div>
                    <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{t.patientNom}</span>
                    <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Carte N° {patientObj?.carte || t.patientCarte || "SP-KIN-000482"}</div>
                  </div>
                </div>
                <StatusPill statut={t.statut === "Terminée" ? "Réglé" : t.statut} />
              </div>

              {t.uid && t.statut === "En attente" && <div className="flex items-center gap-1 mt-2"><Smartphone size={10} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 9.5, color: C.amber, fontWeight: 700 }}>Demande reçue depuis l'app patient</span></div>}
              <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 4 }}>Praticien : {t.medecin} · {t.date} à {t.heure}</div>

              <button
                onClick={() => {
                  const p = patientObj || { nom: t.patientNom, carte: t.patientCarte || "SP-KIN-000482" };
                  setPatientDossierOuvert(p);
                }}
                className="w-full rounded-lg py-2 mt-2 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#0D2818]/5 transition-colors"
                style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}
              >
                <BookOpen size={13} /> Voir le dossier médical complet du patient
              </button>

              {t.statut === "En attente" && t.uid && (
                <button onClick={() => confirmer(t.id)} className="w-full rounded-lg py-2 mt-2 flex items-center justify-center gap-1.5 cursor-pointer" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><Check size={13} /> Confirmer la demande</button>
              )}
              {(t.statut === "Programmée" || t.statut === "En cours") && (
                <button onClick={() => setSalleActive(t)} className="w-full rounded-lg py-2 mt-2 flex items-center justify-center gap-1.5 cursor-pointer" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}><Video size={13} /> Rejoindre la salle WebRTC</button>
              )}
            </Card>
          );
        })}
      </div>

      {patientDossierOuvert && (
        <DossierMedicalCompletModal
          patient={patientDossierOuvert}
          session={session}
          setSession={setSession}
          notify={notify}
          onClose={() => setPatientDossierOuvert(null)}
        />
      )}
    </div>
  );
}

function PlusScreen({ session, setSession, notify, onLogout, initialAction }) {
  const [tab, setTab] = useState(initialAction || "reglements");
  const [queryReg, setQueryReg] = useState("");
  const [filtreStatutReg, setFiltreStatutReg] = useState("Toutes");
  const [filtreTypeReg, setFiltreTypeReg] = useState("Tous");
  const [vueAnalytique, setVueAnalytique] = useState("hebdo");
  const [releveDetailOuvert, setReleveDetailOuvert] = useState(null);

  // L'historique (reglements) couvre les périodes déjà closes jusqu'à hier ; les PEC réelles d'aujourd'hui
  // (session.soins) ne s'y trouvent jamais encore agrégées — on les ajoute donc en complément, sans double compte.
  const soinsReglable = session.soins.filter((s) => !s.isZeroBon);
  const totalRegleReel = soinsReglable.filter((s) => s.statutReglement === "Réglé").reduce((s, x) => s + x.vent.assurance, 0);
  const totalEnAttenteReel = soinsReglable.filter((s) => s.statutReglement === "En attente").reduce((s, x) => s + x.vent.assurance, 0);
  const totalRegle = session.reglements.filter((r) => r.statut === "Réglé").reduce((s, r) => s + r.montantCSU + r.montantAssurance, 0) + totalRegleReel;
  const totalEnAttente = session.reglements.filter((r) => r.statut === "En attente").reduce((s, r) => s + r.montantCSU + r.montantAssurance, 0) + totalEnAttenteReel;
  const totalEnRetard = session.reglements.filter((r) => r.statut === "En retard").reduce((s, r) => s + r.montantCSU + r.montantAssurance, 0);
  const reglementsFiltres = session.reglements.filter((r) =>
    (filtreStatutReg === "Toutes" || r.statut === filtreStatutReg) &&
    (filtreTypeReg === "Tous" || r.type === filtreTypeReg) &&
    r.periode.toLowerCase().includes(queryReg.toLowerCase())
  );

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2"><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Plus</div></div>
      <div className="px-5 flex gap-2 mb-2 overflow-x-auto">
        {[["reglements", "Règlements", Wallet], ["tarifs", "Tarifs", Receipt], ["teleconsultation", "Téléconsultation", Video], ["equipe", "Équipe & rôles", UserCog], ["profil", "Profil", Building2], ["assistance", "Assistance", MessageSquare], ["parametres", "Paramètres", Settings]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="flex-shrink-0 rounded-full py-2 px-3 flex items-center gap-1.5 cursor-pointer" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Icon size={12} /> {l}</button>
        ))}
      </div>

      {tab === "reglements" && (
        <div className="px-5">
          <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
            <History size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Relevé des montants dus par la CSU et l'Assurance Privée pour les soins réalisés en tiers-payant, réconciliés chaque semaine. Synchronisé avec votre module comptable.</span>
          </Card>

          {totalEnRetard > 0 && (
            <Card className="p-3.5 flex items-start gap-2 mb-3" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <Siren size={15} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
              <div><div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.red }}>Paiement en retard — {fmt(totalEnRetard)}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.ink, marginTop: 1 }}>Escalade automatique envoyée au gestionnaire réseau après 7 jours de retard.</div></div>
            </Card>
          )}

          <div className="grid grid-cols-3 gap-2 mb-3">
            <Card className="p-3 text-center"><div style={{ fontFamily: serif, fontSize: 14, color: C.green }}>{fmt(totalRegle)}</div><div style={{ fontFamily: sans, fontSize: 9, color: C.sub }}>Réglé</div></Card>
            <Card className="p-3 text-center"><div style={{ fontFamily: serif, fontSize: 14, color: C.amber }}>{fmt(totalEnAttente)}</div><div style={{ fontFamily: sans, fontSize: 9, color: C.sub }}>En attente</div></Card>
            <Card className="p-3 text-center"><div style={{ fontFamily: serif, fontSize: 14, color: C.red }}>{fmt(totalEnRetard)}</div><div style={{ fontFamily: sans, fontSize: 9, color: C.sub }}>En retard</div></Card>
          </div>

          <SectionLabel>Tendance des règlements</SectionLabel>
          <Card className="p-4 mb-3">
            <div className="flex gap-2 mb-2">
              {[["hebdo", "Hebdomadaire"], ["mensuel", "Mensuel"]].map(([k, l]) => (
                <button key={k} onClick={() => setVueAnalytique(k)} className="rounded-full px-2.5 py-1 cursor-pointer" style={{ background: vueAnalytique === k ? C.navy : C.ivory, color: vueAnalytique === k ? "white" : C.ink, fontFamily: sans, fontSize: 10, fontWeight: 700 }}>{l}</button>
              ))}
            </div>
            <div style={{ width: "100%", height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vueAnalytique === "hebdo" ? CONSO_HEBDO : CONSO_MENSUELLE} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.5} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                  <XAxis dataKey={vueAnalytique === "hebdo" ? "semaine" : "mois"} tick={{ fontSize: 10, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontFamily: sans, fontSize: 11, borderRadius: 8, border: `1px solid ${C.line}` }} />
                  <Area type="monotone" dataKey="montant" stroke={C.gold} strokeWidth={2} fill="url(#regGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <SectionLabel>Relevés & Détails Assurés</SectionLabel>
          <div className="relative mb-2">
            <Search size={13} color={C.sub} style={{ position: "absolute", left: 10, top: 11 }} />
            <input value={queryReg} onChange={(e) => setQueryReg(e.target.value)} placeholder="Rechercher un relevé, période ou assuré…" style={{ ...inputStyle, paddingLeft: 28, fontSize: 12 }} />
          </div>
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto">
            <SlidersHorizontal size={11} color={C.sub} style={{ flexShrink: 0 }} />
            {["Toutes", "Réglé", "En attente", "En retard"].map((f) => (
              <button key={f} onClick={() => setFiltreStatutReg(f)} className="flex-shrink-0 rounded-full px-2 py-1 cursor-pointer" style={{ background: filtreStatutReg === f ? C.navy : "white", color: filtreStatutReg === f ? "white" : C.ink, border: `1px solid ${filtreStatutReg === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 9.5, fontWeight: 700 }}>{f}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
            {["Tous", "PEC directe", "Remboursement"].map((f) => (
              <button key={f} onClick={() => setFiltreTypeReg(f)} className="flex-shrink-0 rounded-full px-2 py-1 cursor-pointer" style={{ background: filtreTypeReg === f ? C.goldSoft : "white", color: C.ink, border: `1px solid ${filtreTypeReg === f ? C.gold : C.line}`, fontFamily: sans, fontSize: 9.5, fontWeight: 700 }}>{f}</button>
            ))}
          </div>

          {soinsReglable.length > 0 && (
            <Card className="p-3.5 mb-4" style={{ background: C.ivory, border: "none" }}>
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Paiements individuels réels (soumis via l'app)</div>
              <div className="space-y-2">
                {soinsReglable.slice(0, 6).map((s) => {
                  const pObj = (session.patientsAffilies || []).find((p) => p.nom === s.patientNom);
                  return (
                    <div key={s.id} className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PatientAvatar nom={s.patientNom} photo={pObj?.photo} size={30} />
                        <div>
                          <p className="font-bold text-xs text-[#0D2818]">{s.patientNom}</p>
                          <p className="text-[10px] text-stone-500">{s.date} · N° Carte : {pObj?.carte || "SP-KIN-000482"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#0D2818]">{fmt(s.vent.assurance)}</span>
                        <StatusPill statut={s.statutReglement} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="space-y-2">
            {reglementsFiltres.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun relevé pour ce filtre.</span></Card>}
            {reglementsFiltres.map((r) => {
              const pNom = r.patientNom || "MUKENDI Jean-Paul";
              const pObj = (session.patientsAffilies || []).find((p) => p.nom === pNom);
              return (
                <Card key={r.id} className="p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <PatientAvatar nom={pNom} photo={pObj?.photo} size={36} />
                      <div>
                        <span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{r.periode}</span>
                        <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Assuré : <b>{pNom}</b></div>
                      </div>
                    </div>
                    <StatusPill statut={r.statut} />
                  </div>

                  <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub, marginTop: 4 }}>{r.type} · {r.nbActes} acte(s){r.dateReglement ? ` · Réglé le ${r.dateReglement}` : r.dateEcheancePrevue ? ` · Échéance prévue le ${r.dateEcheancePrevue}` : ""}</div>

                  <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
                    <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Facturé</span>
                    <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.navy }}>{fmt(r.montantFacture)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 mb-2">
                    <span style={{ fontFamily: sans, fontSize: 10, color: C.navy2 }}>● CSU {fmt(r.montantCSU)}</span>
                    <span style={{ fontFamily: sans, fontSize: 10, color: C.gold }}>● Assurance {fmt(r.montantAssurance)}</span>
                    <span style={{ fontFamily: sans, fontSize: 10, color: C.red }}>● Reste {fmt(r.resteACharge)}</span>
                  </div>

                  <button
                    onClick={() => setReleveDetailOuvert(r)}
                    className="w-full rounded-xl py-2 mb-2 flex items-center justify-center gap-1.5 cursor-pointer bg-[#0D2818] text-white font-bold text-xs"
                  >
                    <Eye size={13} className="text-[#C6992E]" /> Afficher toutes les informations sur le relevé de l'assuré
                  </button>

                  <div className="flex gap-2">
                    <button onClick={() => { downloadText(`Facture_${r.periode.replace(/[^0-9a-zA-Z]/g, "_")}.txt`, `Relevé de facturation\n${r.periode}\nAssuré : ${pNom}\nType : ${r.type}\nActes : ${r.nbActes}\nMontant facturé : ${fmt(r.montantFacture)}\nCSU : ${fmt(r.montantCSU)}\nAssurance : ${fmt(r.montantAssurance)}\nReste à charge : ${fmt(r.resteACharge)}\nStatut : ${r.statut}`); notify("Facture téléchargée (PDF simulé)"); }} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5 cursor-pointer" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.ink }}><FileDown size={11} /> Facture (PDF)</button>
                    <button onClick={() => { downloadText(`Releve_${r.periode.replace(/[^0-9a-zA-Z]/g, "_")}.csv`, `periode;patient;type;actes;facture;csu;assurance;reste;statut\n${r.periode};${pNom};${r.type};${r.nbActes};${r.montantFacture};${r.montantCSU};${r.montantAssurance};${r.resteACharge};${r.statut}`); notify("Relevé exporté (Excel simulé)"); }} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5 cursor-pointer" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.ink }}><FileSpreadsheet size={11} /> Export Excel</button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {releveDetailOuvert && (
        <ModalReleveAssureDetail
          releve={releveDetailOuvert}
          session={session}
          onClose={() => setReleveDetailOuvert(null)}
          notify={notify}
        />
      )}

      {tab === "tarifs" && <CatalogueSoins session={session} setSession={setSession} notify={notify} />}

      {tab === "teleconsultation" && <Teleconsultation session={session} setSession={setSession} notify={notify} />}

      {tab === "equipe" && <EquipeEtRoles session={session} setSession={setSession} notify={notify} />}

      {tab === "profil" && (
        <div className="px-5 space-y-2">
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{session.etablissement.nom}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.etablissement.type}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 2 }}>{session.etablissement.adresse}, {session.etablissement.commune}</div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, marginTop: 4 }}>{session.etablissement.numeroAgrement}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 4 }}>{session.etablissement.responsable}</div>
          </Card>
          <Card className="p-4 space-y-1.5">
            <div className="flex items-center gap-2"><Phone size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{session.etablissement.telephone || "—"}</span></div>
            <div className="flex items-center gap-2"><Mail size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{session.etablissement.email || "—"}</span></div>
          </Card>
        </div>
      )}

      {tab === "assistance" && (
        <div className="px-5 space-y-2">
          <a href="tel:+243843961575"><Card className="p-3.5 flex items-center gap-3"><Phone size={16} color={C.navy2} /><div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Gestionnaire réseau de soins</div><div style={{ fontFamily: mono, fontSize: 11, color: C.sub }}>+243 84 39 615 75</div></div></Card></a>
          <a href="mailto:prestataires@neogtec-healthcare.cd"><Card className="p-3.5 flex items-center gap-3"><Mail size={16} color={C.navy2} /><div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Support prestataires</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Réponse sous 24h</div></div></Card></a>
          <a href="https://wa.me/243843961575"><Card className="p-3.5 flex items-center gap-3"><MessageSquare size={16} color={C.green} /><div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>WhatsApp Business</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Réponse rapide</div></div></Card></a>
        </div>
      )}

      {tab === "parametres" && (
        <div className="px-5 space-y-2">
          <SectionLabel>Notifications</SectionLabel>
          <Card className="p-4 space-y-3">
            {[["sms", "SMS", Smartphone], ["email", "Email", Mail], ["push", "Notification push", Bell]].map(([k, l, Icon]) => (
              <div key={k} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Icon size={15} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{l}</span></div>
                <button onClick={() => { const np = { ...(session.notifPrefs || {}), [k]: !session.notifPrefs?.[k] }; setSession({ ...session, notifPrefs: np }); notify(`${l} ${np[k] ? "activé" : "désactivé"}`); }} className="rounded-full" style={{ width: 40, height: 24, background: session.notifPrefs?.[k] ? C.green : C.line, position: "relative", transition: "background .2s" }}>
                  <div style={{ position: "absolute", top: 3, left: session.notifPrefs?.[k] ? 19 : 3, width: 18, height: 18, borderRadius: 999, background: "white", transition: "left .2s" }} />
                </button>
              </div>
            ))}
            <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Alertes couvertes : paiements validés/rejetés, réclamations, dépassement de plafond.</div>
          </Card>
          <Card className="overflow-hidden">
            {["Mentions légales & convention", "Politique de confidentialité", "À propos (v1.0.0)"].map((t, i, arr) => (
              <button key={t} className="w-full flex items-center justify-between px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{t}</span><ChevronRight size={14} color={C.sub} />
              </button>
            ))}
          </Card>
          <button onClick={onLogout} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><LogOut size={15} /> Se déconnecter</button>
        </div>
      )}
    </div>
  );
}

/* =================================================================
   CALCULATEUR PEC EN CASCADE — simulation instantanée
================================================================= */
function CalculateurPEC({ session, go }) {
  const catalogue = session.catalogue || buildCatalogueSoins();
  const [acteCode, setActeCode] = useState(catalogue[0].code);
  const [montant, setMontant] = useState(String(catalogue[0].tarifNegocie));
  const [taux, setTaux] = useState(80);

  const acte = catalogue.find((a) => a.code === acteCode);
  const changerActe = (code) => {
    const a = catalogue.find((x) => x.code === code);
    setActeCode(code);
    setMontant(String(a.tarifNegocie));
  };
  const vent = computeVentilation(montant, taux, false, acte.garantie, session.etablissement.csuEligible);

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Calculateur PEC</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Cascade de paiement en temps réel</div></div>
      </div>
      <div className="px-5">
        <Card className="p-4 space-y-3">
          <Field label="Acte médical">
            <select style={inputStyle} value={acteCode} onChange={(e) => changerActe(e.target.value)}>
              {catalogue.map((a) => <option key={a.code} value={a.code}>{a.code} — {a.libelle}</option>)}
            </select>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 3 }}>Garantie : {acte.garantie}</div>
          </Field>
          <Field label="Montant (CDF)"><input style={inputStyle} value={montant} onChange={(e) => setMontant(e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Taux de prise en charge assurance">
            <div className="flex flex-wrap gap-1.5">
              {[100, 90, 80, 70].map((t) => <button key={t} onClick={() => setTaux(t)} className="rounded-lg px-3 py-1.5" style={{ background: taux === t ? C.navy : C.ivory, color: taux === t ? "white" : C.ink, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{t}%</button>)}
            </div>
          </Field>
        </Card>

        <SectionLabel>Répartition instantanée</SectionLabel>
        <Card className="p-4">
          <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, textAlign: "center", marginBottom: 12 }}>{fmt(montant)}</div>
          <VentilationBar vent={vent} montant={Number(montant)} />
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: C.ivory }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>1. CSU {acte.garantie === "Maternité" ? "(100% — maternité gratuite)" : "(non applicable hors maternité)"}</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.navy2 }}>{fmt(vent.csu)}</span></div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: C.ivory }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>2. Assurance privée ({taux}% du reste)</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(vent.assurance)}</span></div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: C.redSoft }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>3. Reste à charge</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.red }}>{fmt(vent.resteACharge)}</span></div>
          </div>
        </Card>
        <button onClick={() => go("soins", "nouvelle")} className="w-full rounded-xl py-3.5 mt-3 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}><Send size={15} /> Utiliser pour une demande de PEC</button>
      </div>
    </div>
  );
}

/* =================================================================
   PHARMACIE — stock conventionné & rendu de monnaie
================================================================= */
function StockPharmacie({ session, setSession, notify, go }) {
  const [sub, setSub] = useState("stock");
  const [montantDu, setMontantDu] = useState("");
  const [montantRecu, setMontantRecu] = useState("");
  const stock = session.stockPharmacie || buildStockPharmacie();
  const rendu = Math.max(0, Number(montantRecu || 0) - Number(montantDu || 0));
  const insuffisant = Number(montantRecu || 0) > 0 && Number(montantRecu) < Number(montantDu || 0);

  const ajusterStock = (id, delta) => {
    setSession({ ...session, stockPharmacie: stock.map((s) => (s.id === id ? { ...s, stock: Math.max(0, s.stock + delta) } : s)) });
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Pharmacie</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Stock conventionné & rendu de monnaie</div></div>
      </div>
      <div className="px-5 flex gap-2 mb-3">
        {[["stock", "Stock"], ["monnaie", "Rendu monnaie"]].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} className="flex-1 rounded-full py-2" style={{ background: sub === k ? C.navy : "white", color: sub === k ? "white" : C.ink, border: `1px solid ${sub === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{l}</button>
        ))}
      </div>

      {sub === "stock" && (
        <div className="px-5 space-y-2">
          {stock.filter((s) => s.stock <= s.seuilAlerte).length > 0 && (
            <Card className="p-3 flex items-center gap-2" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <AlertTriangle size={14} color={C.red} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{stock.filter((s) => s.stock <= s.seuilAlerte).length} médicament(s) sous le seuil d'alerte</span>
            </Card>
          )}
          {stock.map((s) => (
            <Card key={s.id} className="p-3.5 flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 36, height: 36, background: s.stock <= s.seuilAlerte ? C.redSoft : C.ivory }}><Package size={16} color={s.stock <= s.seuilAlerte ? C.red : C.navy2} /></div>
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{s.nom}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{s.code} · {fmt(s.prixUnitaire)}</div></div>
              <div className="flex items-center gap-2">
                <button onClick={() => ajusterStock(s.id, -1)} className="flex items-center justify-center"><MinusCircle size={18} color={C.sub} /></button>
                <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: s.stock <= s.seuilAlerte ? C.red : C.navy, minWidth: 24, textAlign: "center" }}>{s.stock}</span>
                <button onClick={() => ajusterStock(s.id, 1)} className="flex items-center justify-center"><PlusCircle size={18} color={C.green} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {sub === "monnaie" && (
        <div className="px-5">
          <Card className="p-4 space-y-3">
            <Field label="Montant dû (reste à charge patient)"><input style={inputStyle} value={montantDu} onChange={(e) => setMontantDu(e.target.value.replace(/\D/g, ""))} placeholder="Ex : 15000" /></Field>
            <Field label="Montant reçu du patient"><input style={inputStyle} value={montantRecu} onChange={(e) => setMontantRecu(e.target.value.replace(/\D/g, ""))} placeholder="Ex : 20000" /></Field>
          </Card>
          <Card className="p-5 mt-3 flex flex-col items-center" style={{ background: insuffisant ? C.redSoft : C.greenSoft, border: "none" }}>
            <Coins size={26} color={insuffisant ? C.red : C.green} />
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 8, textTransform: "uppercase" }}>{insuffisant ? "Montant reçu insuffisant" : "Monnaie à rendre"}</div>
            <div style={{ fontFamily: serif, fontSize: 28, color: insuffisant ? C.red : C.green, fontWeight: 700, marginTop: 4 }}>{insuffisant ? fmt(Number(montantDu) - Number(montantRecu)) : fmt(rendu)}</div>
            {insuffisant && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.red, marginTop: 4 }}>Il manque ce montant pour couvrir le dû</div>}
          </Card>
        </div>
      )}
    </div>
  );
}

/* =================================================================
   MESSAGERIE — chat sécurisé avec le médecin conseil (validations "bon")
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

function ReclamationsPrestataire({ session, notify }) {
  const [sousVue, setSousVue] = useState("suivi");
  const [reclamations, setReclamations] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ beneficiaire: "", type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" });
  const monRef = session.etablissement.nom;

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanalPartage(CLE_RECLAMATIONS_PARTAGEES);
    setReclamations(toutes.filter((r) => r.initiateurType === "prestataire" && r.initiateurRef === monRef));
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const soumettre = async () => {
    if (!form.description.trim()) return;
    const toutes = await chargerCanalPartage(CLE_RECLAMATIONS_PARTAGEES);
    const numero = `REC-2026-${String(toutes.length + 1).padStart(3, "0")}`;
    const reclamation = {
      id: numero, initiateurType: "prestataire", initiateurNom: session.etablissement.responsable || "Praticien", initiateurRef: monRef,
      beneficiaire: form.beneficiaire || session.etablissement.nom, contexte: `${session.etablissement.nom} · Agrément ${session.etablissement.numeroAgrement || "—"}`,
      type: form.type, severite: form.severite, description: form.description, document: form.document || null,
      etape: "Reçue", decision: null, dateSoumission: "15/07/2026", derniereActivite: "15/07/2026",
      historique: [{ action: "Réclamation enregistrée sur l'app Prestataire", auteur: session.etablissement.responsable || "Praticien", date: "15/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
    };
    const maj = [reclamation, ...toutes];
    await sauvegarderCanalPartage(CLE_RECLAMATIONS_PARTAGEES, maj);
    setReclamations([reclamation, ...reclamations]);
    setForm({ beneficiaire: "", type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" });
    setSousVue("suivi");
    notify(`Réclamation ${numero} envoyée — vous pouvez suivre son traitement`);
  };

  return (
    <div>
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
          <Field label="Patient concerné (optionnel)"><input style={inputStyle} value={form.beneficiaire} onChange={(e) => setForm({ ...form, beneficiaire: e.target.value })} placeholder="Nom du patient si applicable" /></Field>
          <div className="mt-2.5"><Field label="Type de réclamation"><select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES_RECLAMATION.map((t) => <option key={t}>{t}</option>)}</select></Field></div>
          <div className="mt-2.5">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Niveau de sévérité</div>
            <div className="grid grid-cols-3 gap-2">
              {["Basse", "Moyenne", "Haute"].map((s) => (
                <button key={s} onClick={() => setForm({ ...form, severite: s })} className="rounded-lg py-2" style={{ background: form.severite === s ? couleurSeverite(s).fg : "white", color: form.severite === s ? "white" : C.ink, border: `1px solid ${form.severite === s ? couleurSeverite(s).fg : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mt-2.5"><Field label="Description des faits"><textarea style={{ ...inputStyle, minHeight: 90, resize: "none" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Expliquez en détail la contestation ou le problème rencontré (ex : tarif contesté, dérogation refusée, délai de règlement)…" /></Field></div>
          <div className="mt-2.5">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Pièces justificatives</div>
            <label className="rounded-xl flex flex-col items-center justify-center gap-2 py-6 cursor-pointer" style={{ border: `2px dashed ${C.line}`, background: C.ivory }}>
              <Upload size={18} color={C.navy2} />
              <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}>{form.document ? form.document : "Glisser-déposer le fichier justificatif"}</span>
              <span style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>Ou cliquez pour choisir sur votre disque (PDF, JPG, PNG)</span>
              <input type="file" hidden onChange={(e) => setForm({ ...form, document: e.target.files?.[0]?.name || "" })} />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setForm({ beneficiaire: "", type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" })} className="flex-1 rounded-xl py-3" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Réinitialiser</button>
            <button onClick={soumettre} disabled={!form.description.trim()} className="flex-1 rounded-xl py-3" style={{ background: !form.description.trim() ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}>Envoyer ma réclamation</button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>Suivi des contestations</SectionLabel>
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

function Messagerie({ session, setSession, notify, go }) {
  const [vue, setVue] = useState("messagerie");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [composeOuvert, setComposeOuvert] = useState(false);
  const [nouveauSujet, setNouveauSujet] = useState("");
  const [nouveauTexte, setNouveauTexte] = useState("");
  const [nouveauDocument, setNouveauDocument] = useState("");
  const [texte, setTexte] = useState("");
  const [fichierReponse, setFichierReponse] = useState("");

  const monIdentifiant = session.etablissement.nom;

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    setConversations(toutes.filter((c) => (c.initiateurType === "prestataire" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "prestataire" && c.destinataireNom === monIdentifiant)));
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const demarrerConversation = async () => {
    if (!nouveauSujet.trim() || !nouveauTexte.trim()) return;
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    const conv = {
      id: `MSG-${Date.now()}`, sujet: nouveauSujet, statut: "Ouvert",
      initiateurType: "prestataire", initiateurNom: session.etablissement.responsable || "Praticien", initiateurRef: monIdentifiant, initiateurTelephone: session.etablissement.telephone,
      contexte: `${session.etablissement.nom} · Agrément ${session.etablissement.numeroAgrement || "—"}`,
      messages: [{ id: 1, auteurType: "prestataire", auteurNom: session.etablissement.responsable || "Praticien", texte: nouveauTexte, document: nouveauDocument || null, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
      derniereActivite: "07/07/2026",
    };
    const maj = [conv, ...toutes];
    await sauvegarderCanalPartage(CLE_MESSAGERIE_PARTAGEE, maj);
    setConversations(maj.filter((c) => (c.initiateurType === "prestataire" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "prestataire" && c.destinataireNom === monIdentifiant)));
    setNouveauSujet(""); setNouveauTexte(""); setNouveauDocument(""); setComposeOuvert(false);
    notify("Message envoyé au médecin conseil / gestionnaire réseau — transmis directement, sans email");
  };

  const envoyer = async (convId) => {
    if (!texte.trim() && !fichierReponse) return;
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    const msg = { id: Date.now(), auteurType: "prestataire", auteurNom: session.etablissement.responsable || "Praticien", texte, document: fichierReponse || null, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
    const maj = toutes.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, msg], derniereActivite: "07/07/2026" } : c));
    await sauvegarderCanalPartage(CLE_MESSAGERIE_PARTAGEE, maj);
    setConversations(maj.filter((c) => (c.initiateurType === "prestataire" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "prestataire" && c.destinataireNom === monIdentifiant)));
    setTexte(""); setFichierReponse("");
  };

  if (selected) {
    const c = conversations.find((x) => x.id === selected);
    if (!c) { setSelected(null); return null; }
    return (
      <div className="pb-6 flex flex-col" style={{ minHeight: "100%" }}>
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>{c.sujet}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{c.contexte}</div></div>
        </div>
        <div className="px-5 flex gap-2 mb-2">
          <a href={whatsappChatUrl("+243843961577", `Bonjour, à propos de : ${c.sujet}`)} target="_blank" rel="noreferrer" className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><MessageSquare size={12} /> WhatsApp</a>
          <a href={whatsappCallUrl("+243843961577")} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Phone size={12} /> Appel WhatsApp</a>
        </div>
        <div className="px-5 space-y-2 flex-1">
          {c.messages.map((m) => (
            <div key={m.id} className="flex" style={{ justifyContent: m.auteurType === "prestataire" ? "flex-end" : "flex-start" }}>
              <div className="rounded-2xl px-3.5 py-2.5" style={{ maxWidth: "78%", background: m.auteurType === "prestataire" ? C.navy : "white", border: m.auteurType === "prestataire" ? "none" : `1px solid ${C.line}` }}>
                {m.auteurType !== "prestataire" && <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.gold, marginBottom: 2 }}>{m.auteurNom} (Assureur)</div>}
                {m.texte && <div style={{ fontFamily: sans, fontSize: 12.5, color: m.auteurType === "prestataire" ? "white" : C.ink }}>{m.texte}</div>}
                {m.document && (
                  <button onClick={() => telechargerDocument(m.document, `Message de ${m.auteurNom} — ${m.date} ${m.heure}`)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mt-1.5" style={{ background: m.auteurType === "prestataire" ? "rgba(255,255,255,0.15)" : C.ivory }}>
                    <Paperclip size={11} color={m.auteurType === "prestataire" ? "white" : C.navy2} />
                    <span style={{ fontFamily: sans, fontSize: 10.5, color: m.auteurType === "prestataire" ? "white" : C.ink, fontWeight: 600 }}>{m.document}</span>
                    <Download size={11} color={m.auteurType === "prestataire" ? "white" : C.navy2} style={{ marginLeft: 2 }} />
                  </button>
                )}
                <div style={{ fontFamily: sans, fontSize: 9, color: m.auteurType === "prestataire" ? "#B9C3D6" : C.sub, marginTop: 2, textAlign: "right" }}>{m.date} {m.heure}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pt-3">
          {fichierReponse && (
            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mb-2" style={{ background: C.ivory, width: "fit-content" }}>
              <Paperclip size={11} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.ink }}>{fichierReponse}</span>
              <button onClick={() => setFichierReponse("")}><X size={11} color={C.sub} /></button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer" style={{ width: 40, height: 40, border: `1px solid ${C.line}` }}>
              <Paperclip size={16} color={C.navy2} />
              <input type="file" hidden onChange={(e) => setFichierReponse(e.target.files?.[0]?.name || "")} />
            </label>
            <input style={{ ...inputStyle, flex: 1 }} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Écrire un message…" />
            <button onClick={() => envoyer(c.id)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: C.navy }}><Send size={15} color="white" /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Messagerie</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Avec l'assureur — sans email</div></div>
      </div>
      <div className="px-5 flex gap-2 mb-3">
        <button onClick={() => setVue("messagerie")} className="flex-1 rounded-xl py-2" style={{ background: vue === "messagerie" ? C.navy : "white", color: vue === "messagerie" ? "white" : C.ink, border: `1px solid ${vue === "messagerie" ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Messagerie</button>
        <button onClick={() => setVue("reclamations")} className="flex-1 rounded-xl py-2" style={{ background: vue === "reclamations" ? C.navy : "white", color: vue === "reclamations" ? "white" : C.ink, border: `1px solid ${vue === "reclamations" ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Réclamations</button>
      </div>

      {vue === "reclamations" ? (
        <div className="px-5"><ReclamationsPrestataire session={session} notify={notify} /></div>
      ) : (
        <>
      <div className="px-5 flex gap-2 mb-3">
        <button onClick={synchroniser} disabled={syncing} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Synchroniser</button>
        <button onClick={() => setComposeOuvert(!composeOuvert)} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><MessageCircle size={13} /> Nouveau message</button>
      </div>
      {composeOuvert && (
        <div className="px-5 mb-3">
          <Card className="p-3.5 space-y-2" style={{ background: C.ivory, border: "none" }}>
            <input style={inputStyle} value={nouveauSujet} onChange={(e) => setNouveauSujet(e.target.value)} placeholder="Objet (ex : Question sur un règlement)" />
            <textarea style={{ ...inputStyle, minHeight: 70, resize: "none" }} value={nouveauTexte} onChange={(e) => setNouveauTexte(e.target.value)} placeholder="Votre message…" />
            <label className="flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer" style={{ background: "white", border: `1px solid ${C.line}` }}>
              <Paperclip size={13} color={C.navy2} />
              <span style={{ fontFamily: sans, fontSize: 11.5, color: nouveauDocument ? C.ink : C.sub }}>{nouveauDocument || "Joindre un document (optionnel)"}</span>
              <input type="file" hidden onChange={(e) => setNouveauDocument(e.target.files?.[0]?.name || "")} />
            </label>
            <button onClick={demarrerConversation} disabled={!nouveauSujet.trim() || !nouveauTexte.trim()} className="w-full rounded-lg py-2.5" style={{ background: (!nouveauSujet.trim() || !nouveauTexte.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}>Envoyer à l'assureur</button>
          </Card>
        </div>
      )}
      <div className="px-5 space-y-2">
        {conversations.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun message pour l'instant.</span></Card>}
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
   APP SHELL
================================================================= */
export default function App() {
  const [view, setView] = useState("signup"); // signup | signin | welcome | onboarding | app
  const [signupData, setSignupData] = useState(null);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [tabAction, setTabAction] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patientActif, setPatientActif] = useState(null);
  const [derogationPrefill, setDerogationPrefill] = useState(null);
  const [soinAutorise, setSoinAutorise] = useState(null);
  const [toast, setToast] = useState(null);
  const notify = (m) => setToast(m);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("neogtec_active_session_prestataire");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.etablissement) {
          setSession(parsed);
          setView("app");
        }
      }
    } catch (e) {
      console.warn("Restore session error", e);
    }
  }, []);

  React.useEffect(() => {
    if (session && view === "app") {
      try {
        localStorage.setItem("neogtec_active_session_prestataire", JSON.stringify(session));
      } catch (e) {
        console.warn("Save session error", e);
      }
    }
  }, [session, view]);

  const startApp = (s) => { 
    setSession(s); 
    setView("app"); 
    setTab("dashboard"); 
    try {
      localStorage.setItem("neogtec_active_session_prestataire", JSON.stringify(s));
    } catch (e) {}
    notify("Espace prestataire activé"); 
  };
  const startDemo = () => startApp({
    etablissement: ETABLISSEMENT_DEMO, soins: buildSoins(), derogations: buildDerogationsPrestataire(), reglements: buildReglements(),
    patientsAffilies: buildPatientsAffilies(), equipe: buildEquipe(), journal: buildJournal(),
    catalogue: buildCatalogueSoins(), teleconsultations: buildTeleconsultations(),
    stockPharmacie: buildStockPharmacie(), conversations: buildConversations(),
    notifPrefs: { sms: true, email: true, push: true },
    alertes: [
      { id: 1, type: "derogation", titre: "1 dérogation en attente de validation", detail: "NGALULA Grâce — 85 000 CDF", gravite: "warning", actionGo: "derogations", actionLabel: "Voir le suivi" },
      { id: 2, type: "reglement", titre: "Relevé hebdomadaire disponible", detail: "620 000 CDF en attente de règlement", gravite: "info", actionGo: "plus", actionLabel: "Voir les règlements" },
      { id: 3, type: "reglement", titre: "Paiement en retard détecté", detail: "410 000 CDF — escalade envoyée au gestionnaire réseau", gravite: "critique", actionGo: "plus", actionLabel: "Voir le relevé" },
    ],
  });
  const logout = () => { 
    try {
      localStorage.removeItem("neogtec_active_session_prestataire");
    } catch (e) {}
    setSession(null); 
    setTab("dashboard"); 
    setView("signin"); 
  };
  const restartFromScratch = () => { 
    try {
      localStorage.removeItem("neogtec_active_session_prestataire");
    } catch (e) {}
    setSession(null); 
    setSignupData(null); 
    setTab("dashboard"); 
    setView("signup"); 
  };

  const go = (target, action) => { setTab(target); setTabAction(action || null); };

  const tabs = [
    { id: "dashboard", label: "Accueil", icon: LayoutDashboard },
    { id: "scanner", label: "Scanner", icon: ScanLine },
    { id: "patients", label: "Dossiers Patients", icon: FolderOpen },
    { id: "teleconsultation", label: "Téléconsultation", icon: Video },
    { id: "soins", label: "Soins", icon: Stethoscope },
    { id: "derogations", label: "Dérogations", icon: FileWarning },
    { id: "plus", label: "Plus", icon: Settings },
  ];
  const derogEnAttente = session?.derogations?.filter((d) => d.statut === "En attente").length || 0;

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row h-screen max-h-screen overflow-hidden" style={{ background: C.ivory, fontFamily: sans }}>
      <style>{`@keyframes riseIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} } ::-webkit-scrollbar { display:none; }`}</style>
      
      {/* Desktop Navigation Sidebar */}
      {view === "app" && (
        <aside 
          className="hidden md:flex flex-col border border-[#1B4A34] bg-[#0D2818] text-white shrink-0 justify-between p-3 my-3 ml-3 rounded-2xl shadow-xl z-20 transition-all duration-300 ease-in-out sticky top-3 h-[calc(100vh-24px)]"
          style={{ width: sidebarCollapsed ? 72 : 256 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 py-1 border-b border-[#1B4A34]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-xs shrink-0">
                  PRES
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <span className="font-serif text-sm font-bold tracking-wider text-white block truncate">NeoGTec insur</span>
                    {session?.etablissement?.nom && (
                      <p className="text-[11px] text-[#EFDFB8] font-medium truncate">{session.etablissement.nom}</p>
                    )}
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

            <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
              {tabs.map((t) => {
                const isActive = tab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => go(t.id)}
                    title={sidebarCollapsed ? t.label : undefined}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'} rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1B4A34] text-[#EFDFB8] shadow-md font-bold border-l-4 border-[#C6992E]'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-[#C6992E]' : 'text-stone-400'} />
                      {!sidebarCollapsed && <span>{t.label}</span>}
                    </div>
                    {t.id === "derogations" && derogEnAttente > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white ${sidebarCollapsed ? 'absolute top-1 right-1' : ''}`}>
                        {derogEnAttente}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className={`p-2.5 bg-[#1B4A34]/40 border border-[#2F8A5B]/30 rounded-xl space-y-2 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Établissement</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Agréé
                </span>
              </div>
            )}
            <button onClick={logout} title={sidebarCollapsed ? "Déconnexion" : undefined} className="w-full py-2 text-xs text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold cursor-pointer border border-rose-800/20">
              <LogOut size={14} /> {!sidebarCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main App Container */}
      <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-white shadow-sm border-x border-stone-200/80 h-full">
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-200/80 relative z-20 flex-shrink-0 sticky top-0" style={{ background: C.ivory, color: C.ink, fontFamily: sans, fontSize: 13 }}>
          <div className="flex items-center gap-3">
            <span style={{ letterSpacing: 1, fontWeight: 700, color: C.navy, fontSize: 14 }}>NEOGTEC PRESTATAIRE</span>
            {view === "app" && session?.etablissement?.nom && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#142644]/10 text-[#142644]">
                {session.etablissement.nom}
              </span>
            )}
          </div>
          {view === "app" && (
            <div className="flex items-center gap-3">
              <button onClick={() => go("plus")} className="relative p-1.5 rounded-lg hover:bg-stone-200 transition-all cursor-pointer">
                <Bell size={18} color={C.navy} />
                {derogEnAttente > 0 ? <span className="absolute rounded-full" style={{ top: 2, right: 2, width: 8, height: 8, background: C.red }}></span> : null}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 max-w-7xl w-full mx-auto">
          {view === "signup" && <SignUp onDone={(data) => { setSignupData(data); setView("signin"); }} onGoSignIn={() => setView("signin")} />}
          {view === "signin" && <SignIn prefill={signupData} onDone={(sessionReelle) => (sessionReelle ? startApp(sessionReelle) : setView(session ? "app" : "welcome"))} onGoSignUp={() => setView("signup")} />}
          {view === "welcome" && <Welcome onCreer={() => setView("onboarding")} onDemo={startDemo} onAccederExistant={() => { setView("app"); setTab("dashboard"); }} hasSession={!!session} />}
          {view === "onboarding" && <OnboardingEtablissement onFinish={startApp} onCancel={() => setView("welcome")} />}
          {view === "app" && tab === "dashboard" && <Accueil session={session} notify={notify} go={go} onRestart={restartFromScratch} />}
          {view === "app" && tab === "scanner" && <Scanner session={session} notify={notify} go={go} setPatientActif={setPatientActif} />}
          {view === "app" && tab === "patients" && <Patients session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && tab === "teleconsultation" && <Teleconsultation session={session} setSession={setSession} notify={notify} />}
          {view === "app" && tab === "soins" && <Soins session={session} setSession={setSession} notify={notify} go={go} patientActif={patientActif} initialAction={tabAction} setDerogationPrefill={setDerogationPrefill} soinAutorise={soinAutorise} setSoinAutorise={setSoinAutorise} />}
          {view === "app" && tab === "derogations" && <Derogations session={session} setSession={setSession} notify={notify} go={go} patientActif={patientActif} initialAction={tabAction} derogationPrefill={derogationPrefill} setDerogationPrefill={setDerogationPrefill} setSoinAutorise={setSoinAutorise} />}
          {view === "app" && tab === "plus" && <PlusScreen session={session} setSession={setSession} notify={notify} onLogout={logout} initialAction={tabAction} />}
          {view === "app" && tab === "calculateur" && <CalculateurPEC session={session} go={go} />}
          {view === "app" && tab === "stock" && <StockPharmacie session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && tab === "messagerie" && <Messagerie session={session} setSession={setSession} notify={notify} go={go} />}
        </div>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}

        {/* Mobile Bottom Navigation Bar */}
        {view === "app" && (
          <div className="md:hidden sticky bottom-0 left-0 right-0 flex items-center justify-around z-20 shadow-md" style={{ height: 64, background: "white", borderTop: `1px solid ${C.line}` }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => go(t.id)} className="flex items-center flex-col gap-1 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-all cursor-pointer relative">
                <t.icon size={20} color={tab === t.id ? C.navy : C.sub} strokeWidth={tab === t.id ? 2.4 : 2} />
                {t.id === "derogations" && derogEnAttente > 0 && <span className="absolute rounded-full" style={{ top: 2, right: 2, width: 8, height: 8, background: C.red }} />}
                <span style={{ fontFamily: sans, fontSize: 11, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.navy : C.sub }}>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
