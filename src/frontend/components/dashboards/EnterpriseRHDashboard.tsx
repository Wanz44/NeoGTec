/**
 * 🏢 Fichier : /src/frontend/components/dashboards/EnterpriseRHDashboard.tsx
 * 🎯 Objectif : Portail Espace Entreprise - MiningCo SARL & Gestion RH (Données simulées & synchronisées)
 */

import React, { useState, useEffect } from "react";
import {
  Building2, Users, UserPlus, UserMinus, ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
  Wallet, Receipt, TrendingUp, Bell, Settings, ArrowLeft, Search, SlidersHorizontal,
  ChevronRight, Home, LayoutDashboard, ClipboardList, CreditCard, Award, Lock, Unlock,
  Loader2, Camera, Phone, Mail, MapPin, FileText, Download, Plus, Trash2, Ban, UserCheck,
  Percent, Calendar, Landmark, Smartphone, Briefcase, ShieldAlert, ThumbsUp, ThumbsDown,
  MessageSquare, ChevronDown, X, Send, RefreshCw, Filter, CircleDollarSign, Stethoscope,
  ScanFace, LogOut, Check, PieChart, FileWarning, HeartPulse, MessageCircle, Upload, Paperclip,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

/* ---------------------------------------------------------------
   TOKENS — cohérents avec l'app Assuré NeoGTec HealthCare
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
const fmt = (n: any) => "$" + Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ");

/* ---------------------------------------------------------------
   DONNÉES — grades, employés, dérogations, factures, alertes
------------------------------------------------------------------ */
export interface GradeItem {
  id: string;
  nom: string;
  taux: number;
  plafondMensuel: number;
  plafondAnnuel: number;
  couleur: string;
}

const GRADES_DEFAUT: GradeItem[] = [
  { id: "direction", nom: "Direction / Cadre supérieur", taux: 100, plafondMensuel: 500, plafondAnnuel: 6000, couleur: C.navy },
  { id: "cadre", nom: "Cadre / Agent de maîtrise", taux: 90, plafondMensuel: 350, plafondAnnuel: 4200, couleur: C.navy2 },
  { id: "agent", nom: "Agent d'exécution", taux: 80, plafondMensuel: 200, plafondAnnuel: 2400, couleur: C.gold },
  { id: "ouvrier", nom: "Ouvrier / Personnel de terrain", taux: 70, plafondMensuel: 120, plafondAnnuel: 1440, couleur: C.amber },
];
const gradeInfo = (id: string) => GRADES_DEFAUT.find((g) => g.id === id) || GRADES_DEFAUT[2];

/* =================================================================
   SYNCHRONISATION INTER-APPS — stockage partagé (window.storage)
================================================================= */
const CLE_DEROGATIONS_PARTAGEES = "neogtec_eco_derogations_v1";

async function chargerDerogationsPartagees() {
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      const res = await (window as any).storage.get(CLE_DEROGATIONS_PARTAGEES, true);
      return res?.value ? JSON.parse(res.value) : [];
    }
    const local = localStorage.getItem(CLE_DEROGATIONS_PARTAGEES);
    return local ? JSON.parse(local) : [];
  } catch (e) {
    return [];
  }
}
async function sauvegarderDerogationsPartagees(liste: any) {
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      await (window as any).storage.set(CLE_DEROGATIONS_PARTAGEES, JSON.stringify(liste), true);
    }
    localStorage.setItem(CLE_DEROGATIONS_PARTAGEES, JSON.stringify(liste));
  } catch (e) {}
}

const CLE_COTISATIONS_PARTAGEES = "neogtec_eco_cotisations_v1";
const CLE_COMPTES_PARTAGES = "neogtec_eco_comptes_v1";
const CLE_MESSAGERIE_PARTAGEE = "neogtec_eco_messagerie_v1";
const CLE_RECLAMATIONS_PARTAGEES = "neogtec_eco_reclamations_v1";
const TYPES_RECLAMATION = ["Remboursement refusé", "Accueil clinique", "Délai de traitement", "Facturation", "Demande de résiliation", "Autre"];
const ETAPES_RECLAMATION = ["Reçue", "En cours d'analyse", "Décision rendue"];
const couleurSeverite = (s: string) => (s === "Haute" ? { bg: "#FBE2E0", fg: "#C0392B" } : s === "Moyenne" ? { bg: "#FBEBD2", fg: "#C88A1E" } : { bg: "#E3F2E6", fg: "#2F8A5B" });
const CLE_MESSAGES_PREVENTION = "neogtec_eco_messages_prevention_v1";

async function chargerCanalPartage(cle: string) {
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      const res = await (window as any).storage.get(cle, true);
      return res?.value ? JSON.parse(res.value) : [];
    }
    const local = localStorage.getItem(cle);
    return local ? JSON.parse(local) : [];
  } catch (e) {
    return [];
  }
}
async function sauvegarderCanalPartage(cle: string, valeur: any) {
  try {
    if (typeof window !== 'undefined' && (window as any).storage) {
      await (window as any).storage.set(cle, JSON.stringify(valeur), true);
    }
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch (e) {}
}
function whatsappChatUrl(numero: string, texte?: string) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${num}${texte ? `?text=${encodeURIComponent(texte)}` : ""}`;
}
function whatsappCallUrl(numero: string) {
  const num = (numero || "").replace(/[^0-9]/g, "");
  return `whatsapp://call?phone=${num}`;
}
const CONDITIONS_SANTE = [
  { id: "diabete", label: "Diabète (type 1 ou 2)" },
  { id: "hta", label: "Hypertension artérielle" },
  { id: "vih", label: "VIH / SIDA" },
  { id: "cardiaque", label: "Maladie cardiaque" },
  { id: "renale", label: "Insuffisance rénale" },
  { id: "respiratoire", label: "Maladie respiratoire chronique" },
];

async function synchroniserEffectifVersAssureur(nomEntreprise: string, employe: any, action: string) {
  const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
  const idx = comptes.findIndex((c: any) => c.type === "entreprise" && c.nom === nomEntreprise);
  if (idx === -1) return false;
  const compte = comptes[idx];
  const effectifs = compte.donnees?.effectifs || [];
  let policeEmploye = employe.police;
  let comptesMaj = [...comptes];

  if (action === "retirer") {
    const effectifsMaj = effectifs.filter((e: any) => e.matricule !== employe.matricule);
    comptesMaj[idx] = { ...compte, donnees: { ...compte.donnees, effectifs: effectifsMaj, nbEmployes: effectifsMaj.length } };
    comptesMaj = comptesMaj.map((c: any) => (c.donnees?.police === employe.police ? { ...c, donnees: { ...c.donnees, statut: "Suspendu" } } : c));
  } else {
    if (!policeEmploye) {
      policeEmploye = `POL-EMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const gabarit = compte.donnees?.garantiesConsommation?.length
        ? compte.donnees.garantiesConsommation.map((g: any) => ({ nom: g.nom, plafond: g.plafond ?? null, consomme: 0 }))
        : ["Consultations & Pharmacie", "Hospitalisation", "Dentaire", "Optique", "Maternité"].map((nom) => ({ nom, plafond: null, consomme: 0 }));
      const garantiesVierges = gabarit;
      const nouveauCompteEmploye = {
        type: "assure", nom: employe.nom,
        acces: employe.telephone ? [{ identifiant: employe.telephone, motDePasseProvisoire: String(Math.floor(1000 + Math.random() * 9000)), statut: "Actif" }] : [],
        accesMobile: true, dateCreation: "15/07/2026",
        donnees: {
          id: Date.now(), statut: "Actif", dateActivation: "15/07/2026", telephone: employe.telephone || "", ville: employe.ville || compte.donnees?.ville || "Kinshasa",
          dateNaissance: employe.naissance || null, sexe: employe.sexe || null, formule: compte.donnees?.formule, nbAyantsDroit: (employe.famille || []).length,
          police: policeEmploye, contrat: compte.donnees?.contrat, rattacheA: nomEntreprise, lienAvecSouscripteur: "Employé titulaire", matricule: employe.matricule,
          conditionsSante: employe.conditionsSante || [], surprimeEnAttenteRevue: (employe.conditionsSante || []).length > 0,
          franchise: compte.donnees?.franchise || 0, garantiesConsommation: garantiesVierges, telemedecineConsommee: 0,
        },
      };
      comptesMaj.push(nouveauCompteEmploye);
      (employe.famille || []).forEach((f: any) => {
        const policeAyant = `POL-AD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        comptesMaj.push({
          type: "assure", nom: f.nom, acces: [], accesMobile: false, dateCreation: "15/07/2026",
          donnees: {
            id: Date.now() + Math.random(), statut: "Actif", dateActivation: "15/07/2026", telephone: f.telephone || "", ville: employe.ville || "Kinshasa",
            dateNaissance: f.naissance || null, sexe: f.sexe || null, formule: compte.donnees?.formule, nbAyantsDroit: 0,
            police: policeAyant, contrat: compte.donnees?.contrat, rattacheA: policeEmploye, lienAvecSouscripteur: `${f.lien} de ${employe.nom}`,
            conditionsSante: f.conditionsSante || [], surprimeEnAttenteRevue: (f.conditionsSante || []).length > 0,
            franchise: compte.donnees?.franchise || 0, garantiesConsommation: garantiesVierges, telemedecineConsommee: 0,
          },
        });
      });
    }
    const entreeEffectif = { nom: employe.nom, matricule: employe.matricule, email: employe.email, grade: employe.grade, police: policeEmploye, ayantsDroit: (employe.famille || []).map((f: any) => ({ nom: f.nom, lien: f.lien, naissance: f.naissance, email: f.telephone || "" })) };
    const effectifsMaj = [...effectifs.filter((e: any) => e.matricule !== employe.matricule), entreeEffectif];
    comptesMaj[idx] = { ...compte, donnees: { ...compte.donnees, effectifs: effectifsMaj, nbEmployes: effectifsMaj.length } };
  }
  await sauvegarderCanalPartage(CLE_COMPTES_PARTAGES, comptesMaj);
  return { synced: true, police: policeEmploye };
}

const COMPANY_DEMO = {
  nom: "MININGCO SARL", secteur: "Mines et industries extractives", rccm: "CD/KIN/RCCM/17-B-05678",
  adresse: "Boulevard Lumumba, Kinshasa", contactRH: "NGOYI Beatrice — Directrice RH",
  telephone: "+243 89 000 00 00", email: "rh@miningco.cd",
  contrat: "CTR-ENT-2026-778213", formule: "Confort Entreprise", validite: "01/07/2025 — 30/06/2027",
  statutContrat: "Actif"
};

const CASCADE_DEFAUT = [
  { ordre: 1, payeur: "CSU — Couverture Santé Universelle", role: "Gratuité intégrale, mais uniquement pour la maternité — seul volet effectif à ce jour en RDC", taux: "100% (maternité uniquement)" },
  { ordre: 2, payeur: "Assurance Privée NeoGTec HealthCare", role: "Premier payeur sur tous les autres soins, selon le grade de l'employé", taux: "90 / 80 / 70%" },
  { ordre: 3, payeur: "Entreprise (reste à charge éventuel)", role: "Couvre le solde final si non pris en charge", taux: "Variable" },
];
const DEPENDANT_TAUX = 70;

function buildEmployes() {
  return [
    { id: 1, matricule: "MC-0001", nom: "TSHIBANGU Alain", poste: "Directeur Général", grade: "direction", statut: "Actif", photo: "https://i.pravatar.cc/200?img=68", plafondMensuel: 500, consomme: 320, telephone: "+243 81 000 01 01", email: "a.tshibangu@miningco.cd", dateEmbauche: "12/03/2015", famille: [{ nom: "TSHIBANGU épouse Nadine", lien: "Conjoint", naissance: "18/05/1988", sexe: "Féminin", groupeSanguin: "A+", telephone: "+243 81 000 01 02", photo: "https://i.pravatar.cc/200?img=48", plafond: 350, consomme: 210 }] },
    { id: 2, matricule: "MC-0002", nom: "KABEYA Odette", poste: "Chef Comptable", grade: "cadre", statut: "Actif", photo: "https://i.pravatar.cc/200?img=45", plafondMensuel: 350, consomme: 310, telephone: "+243 81 000 02 02", email: "o.kabeya@miningco.cd", dateEmbauche: "04/09/2018", famille: [] },
    {
      id: 3, matricule: "MC-0003", nom: "MUKENDI Jean-Paul", poste: "Ingénieur", grade: "cadre", statut: "Actif", photo: "https://i.pravatar.cc/200?img=51", plafondMensuel: 350, consomme: 245, telephone: "+243 81 000 00 00", email: "jp.mukendi@miningco.cd", dateEmbauche: "02/02/2016", famille: [
        { nom: "MUKENDI née KABEYA Chantal", lien: "Conjoint", naissance: "22/07/1988", sexe: "Féminin", groupeSanguin: "O+", telephone: "+243 81 000 00 01", photo: "https://i.pravatar.cc/200?img=47", plafond: 245, consomme: 140 },
        { nom: "MUKENDI Grâce", lien: "Enfant", naissance: "05/11/2014", sexe: "Féminin", groupeSanguin: "", telephone: "", photo: "https://i.pravatar.cc/200?img=27", plafond: 150, consomme: 40 },
        { nom: "MUKENDI Emmanuel", lien: "Enfant", naissance: "19/09/2017", sexe: "Masculin", groupeSanguin: "", telephone: "", photo: "https://i.pravatar.cc/200?img=12", plafond: 150, consomme: 15 },
        { nom: "MUKENDI Divine", lien: "Enfant", naissance: "02/01/2021", sexe: "Féminin", groupeSanguin: "", telephone: "", photo: "https://i.pravatar.cc/200?img=32", plafond: 150, consomme: 5 },
      ]
    },
    { id: 4, matricule: "MC-0004", nom: "ILUNGA Patrick", poste: "Agent de maintenance", grade: "agent", statut: "Suspendu", motifSuspension: "Facture impayée", photo: "https://i.pravatar.cc/200?img=13", plafondMensuel: 200, consomme: 40, telephone: "+243 81 000 04 04", email: "p.ilunga@miningco.cd", dateEmbauche: "22/01/2020", famille: [] },
    { id: 5, matricule: "MC-0005", nom: "NGALULA Grâce", poste: "Ouvrière", grade: "ouvrier", statut: "Actif", photo: "https://i.pravatar.cc/200?img=32", plafondMensuel: 120, consomme: 118, telephone: "+243 81 000 05 05", email: "g.ngalula@miningco.cd", dateEmbauche: "10/06/2021", famille: [] },
    { id: 6, matricule: "MC-0006", nom: "KALALA Trésor", poste: "Chauffeur", grade: "ouvrier", statut: "Actif", photo: "https://i.pravatar.cc/200?img=14", plafondMensuel: 120, consomme: 22, telephone: "+243 81 000 06 06", email: "t.kalala@miningco.cd", dateEmbauche: "05/11/2022", famille: [] },
  ];
}

function buildDerogations() {
  return [
    { id: 1, employeId: 5, employeNom: "NGALULA Grâce", motif: "Urgence chirurgicale — appendicite", montantDemande: 85, plafondRestant: 2, hopital: "Clinique Ngaliema", date: "06/07/2026", statut: "En attente" },
    { id: 2, employeId: 4, employeNom: "ILUNGA Patrick", motif: "Consultation hors réseau (zone reculée)", montantDemande: 30, plafondRestant: 160, hopital: "Cabinet local Kolwezi", date: "03/07/2026", statut: "Approuvée", traitePar: "NGOYI Beatrice" },
    { id: 3, employeId: 2, employeNom: "KABEYA Odette", motif: "Dépassement plafond dentaire", montantDemande: 120, plafondRestant: 40, hopital: "Clinique Dentaire La Canine", date: "28/06/2026", statut: "Refusée", traitePar: "NGOYI Beatrice" },
  ];
}

function buildFactures() {
  return [
    { id: 13, mois: "Juillet 2026", montant: 14250, dateEcheance: "31/07/2026", statut: "En attente" },
    { id: 12, mois: "Juin 2026", montant: 14250, dateEcheance: "30/06/2026", statut: "Payée", datePaiement: "28/06/2026" },
    { id: 11, mois: "Mai 2026", montant: 14250, dateEcheance: "31/05/2026", statut: "En retard" },
    { id: 10, mois: "Avril 2026", montant: 14250, dateEcheance: "30/04/2026", statut: "Payée", datePaiement: "29/04/2026" },
    { id: 9, mois: "Mars 2026", montant: 14250, dateEcheance: "31/03/2026", statut: "Payée", datePaiement: "31/03/2026" },
  ];
}

function buildSurplus() {
  return [
    { id: 1, derogationId: 2, employeNom: "ILUNGA Patrick", motif: "Consultation hors réseau (zone reculée)", hopital: "Cabinet local Kolwezi", montant: 30, date: "03/07/2026", statut: "À payer" },
  ];
}

const CONSO_MENSUELLE = [
  { mois: "Fév", montant: 8200 }, { mois: "Mar", montant: 9600 }, { mois: "Avr", montant: 11400 },
  { mois: "Mai", montant: 10100 }, { mois: "Juin", montant: 12800 }, { mois: "Juil", montant: 7500 },
];

/* =================================================================
   COMPOSANTS UI REUTILISABLES
================================================================= */
function Ring({ pct, size = 44, stroke = 5, color = C.gold }: { pct: number; size?: number; stroke?: number; color?: string }) {
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

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="absolute left-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{ bottom: 84, background: C.navy, color: "white", fontFamily: sans, fontSize: 13, animation: "riseIn .25s ease" }}>
      <CheckCircle2 size={16} color={C.gold} /><span>{message}</span>
    </div>
  );
}

function StatusPill({ statut }: { statut: string }) {
  const map: Record<string, { bg: string; fg: string; icon: any }> = {
    "Actif": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Payée": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Approuvée": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Résolu": { bg: C.greenSoft, fg: C.green, icon: Check },
    "Suspendu": { bg: C.redSoft, fg: C.red, icon: Ban },
    "En retard": { bg: C.redSoft, fg: C.red, icon: AlertTriangle },
    "Refusée": { bg: C.redSoft, fg: C.red, icon: XCircle },
    "En attente": { bg: C.amberSoft, fg: C.amber, icon: Loader2 },
    "Ouvert": { bg: C.amberSoft, fg: C.amber, icon: Loader2 },
  };
  const s = map[statut] || map["En attente"], Icon = s.icon;
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: s.bg, color: s.fg, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Icon size={11} /> {statut}</span>;
}

function SectionLabel({ children }: { children: React.ReactNode }) { return <div className="px-5 pt-5 pb-2 font-bold uppercase tracking-widest" style={{ color: C.sub, fontFamily: sans, fontSize: 11 }}>{children}</div>; }
function Card({ children, style, className = "", onClick }: { children: React.ReactNode; style?: React.CSSProperties; className?: string; onClick?: () => void }) { return <div onClick={onClick} className={`rounded-2xl bg-white ${className}`} style={{ border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,38,68,0.04)", ...style }}>{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>{children}</div>; }
const inputStyle: React.CSSProperties = { width: "100%", fontFamily: sans, fontSize: 13, color: C.ink, background: C.ivory, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", outline: "none", boxSizing: "border-box" };

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

/* =================================================================
   SUB-VUES DASHBOARD
================================================================= */
function GradeAccordionItem({ g, nb, onSave }: { g: GradeItem; nb: number; onSave: (id: string, draft: any) => void }) {
  const [draft, setDraft] = useState({ taux: g.taux, plafondMensuel: g.plafondMensuel, plafondAnnuel: g.plafondAnnuel });
  const [dirty, setDirty] = useState(false);
  const change = (field: string, val: string) => { setDraft({ ...draft, [field]: val.replace(/\D/g, "") }); setDirty(true); };
  return (
    <Accordion title={g.nom} right={<span style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{nb} employé(s)</span>}>
      <div className="pt-3 space-y-2">
        <Field label="Taux de prise en charge (%)"><input style={inputStyle} value={draft.taux} onChange={(e) => change("taux", e.target.value)} /></Field>
        <Field label="Plafond mensuel ($)"><input style={inputStyle} value={draft.plafondMensuel} onChange={(e) => change("plafondMensuel", e.target.value)} /></Field>
        <Field label="Plafond annuel ($)"><input style={inputStyle} value={draft.plafondAnnuel} onChange={(e) => change("plafondAnnuel", e.target.value)} /></Field>
        <button onClick={() => { onSave(g.id, draft); setDirty(false); }} disabled={!dirty} className="w-full rounded-lg py-2 mt-1 flex items-center justify-center gap-1.5" style={{ background: dirty ? C.navy : "#C9CDD6", color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><Check size={13} /> Enregistrer</button>
      </div>
    </Accordion>
  );
}

function GradesEtCouvertures({ session, setSession, notify }: any) {
  const saveGrade = (id: string, draft: any) => {
    setSession({ ...session, grades: session.grades.map((g: any) => (g.id === id ? { ...g, taux: Number(draft.taux) || g.taux, plafondMensuel: Number(draft.plafondMensuel) || g.plafondMensuel, plafondAnnuel: Number(draft.plafondAnnuel) || g.plafondAnnuel } : g)) });
    notify(`Couverture "${session.grades.find((g: any) => g.id === id)?.nom}" enregistrée`);
  };
  return (
    <>
      <SectionLabel>Grades & couvertures</SectionLabel>
      <div className="px-5 space-y-2">
        {session.grades.map((g: any) => (
          <GradeAccordionItem key={g.id} g={g} nb={session.employes.filter((e: any) => e.grade === g.id).length} onSave={saveGrade} />
        ))}
        <Card className="p-3.5 flex items-center gap-3" style={{ background: C.ivory, border: "none" }}>
          <div className="rounded-full" style={{ width: 10, height: 10, background: C.sub }} />
          <div className="flex-1">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Ayants droit (Dépendant)</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Taux automatique appliqué à tout conjoint/enfant, quel que soit le grade de l'employé rattaché.</div>
          </div>
          <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.navy }}>{DEPENDANT_TAUX}%</span>
        </Card>
      </div>
    </>
  );
}

function ReglesDuContrat({ session, setSession, notify }: any) {
  const [validite, setValidite] = useState(session.entreprise.validite || "");
  const monter = (i: number) => {
    if (i === 0) return;
    const c = [...session.cascade];
    [c[i - 1], c[i]] = [c[i], c[i - 1]];
    c.forEach((x, j) => (x.ordre = j + 1));
    setSession({ ...session, cascade: c });
    notify("Ordre des payeurs mis à jour");
  };
  return (
    <>
      <SectionLabel>Cascade de paiement — ordre des payeurs</SectionLabel>
      <div className="px-5">
        <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
          <FileText size={13} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Définit qui règle un soin en premier. La CSU ne couvre à 100% que la maternité ; pour tous les autres soins, c'est l'Assurance Privée qui paie en premier.</span>
        </Card>
        <div className="space-y-2">
          {(session.cascade || []).map((c: any, i: number) => (
            <Card key={c.ordre} className="p-3.5 flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 800 }}>{c.ordre}</div>
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{c.payeur}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{c.role}</div></div>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.gold, fontWeight: 700, marginRight: 4 }}>{c.taux}</span>
              {i > 0 && <button onClick={() => monter(i)} style={{ fontFamily: sans, fontSize: 9, color: C.navy2, fontWeight: 700 }}>▲</button>}
            </Card>
          ))}
        </div>
      </div>

      <SectionLabel>Validité du contrat</SectionLabel>
      <div className="px-5">
        <Card className="p-4">
          <Field label="Période de validité"><input style={inputStyle} value={validite} onChange={(e) => setValidite(e.target.value)} placeholder="01/01/2026 — 31/12/2026" /></Field>
          <button onClick={() => { setSession({ ...session, entreprise: { ...session.entreprise, validite } }); notify("Validité du contrat mise à jour"); }} className="w-full rounded-lg py-2 mt-3" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}>Enregistrer</button>
        </Card>
      </div>
    </>
  );
}

function PlusScreen({ session, setSession, notify, onLogout, go }: any) {
  const [tab, setTab] = useState("grades");
  const [alerteDetail, setAlerteDetail] = useState<any>(null);
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2">
        <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Plus</div>
      </div>
      <div className="px-5 flex gap-2 mb-2 overflow-x-auto">
        {[["grades", "Grades", Award], ["contrat", "Règles du contrat", FileText], ["alertes", "Alertes", Bell], ["parametres", "Paramètres", Settings]].map(([k, l, Icon]: any) => (
          <button key={k} onClick={() => setTab(k)} className="flex-shrink-0 rounded-full py-2 px-3 flex items-center gap-1.5 cursor-pointer" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Icon size={12} /> {l}</button>
        ))}
      </div>

      {tab === "grades" && <GradesEtCouvertures session={session} setSession={setSession} notify={notify} />}
      {tab === "contrat" && <ReglesDuContrat session={session} setSession={setSession} notify={notify} />}

      {tab === "alertes" && (
        <div className="px-5 space-y-2">
          {session.alertes.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune alerte.</span></Card>}
          {session.alertes.map((a: any) => (
            <Card key={a.id} className="p-3.5 flex items-start gap-3" style={{ background: C.ivory, border: "none" }}>
              <Bell size={15} color={C.navy2} style={{ marginTop: 1, flexShrink: 0 }} />
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{a.titre}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{a.detail}</div></div>
            </Card>
          ))}
        </div>
      )}

      {tab === "parametres" && (
        <div className="px-5 space-y-2">
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{session.entreprise.nom}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.entreprise.secteur}</div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, marginTop: 4 }}>{session.entreprise.rccm}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 4 }}>{session.entreprise.contactRH}</div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{session.entreprise.contrat} · {session.entreprise.formule}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

function ContratConsommation({ session, setSession, notify, go }: any) {
  const [query, setQuery] = useState("");
  const rows: any[] = [];
  const derogationsApprouvees = (session.derogations || []).filter((d: any) => d.statut === "Approuvée");
  
  session.employes.forEach((e: any) => {
    const g = gradeInfo(e.grade);
    const derogE = derogationsApprouvees.filter((d: any) => d.employeId === e.id);
    rows.push({ key: `e${e.id}`, type: "employe", employeId: e.id, nom: e.nom, gradeOrRelation: g.nom, gradeId: e.grade, couleur: g.couleur, rattacheA: "—", consomme: e.consomme, plafond: e.plafondMensuel, statut: e.statut, photo: e.photo, derogations: derogE });
    (e.famille || []).forEach((f: any, i: number) => {
      rows.push({ key: `e${e.id}-f${i}`, type: "ayant_droit", employeId: e.id, nom: f.nom, gradeOrRelation: f.lien, couleur: C.sub, rattacheA: e.nom, consomme: f.consomme || 0, plafond: f.plafond || 0, statut: e.statut, photo: null, derogations: [] });
    });
  });

  const filtered = rows.filter((r) => r.nom.toLowerCase().includes(query.toLowerCase()) || r.rattacheA.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Consommation police</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{rows.length} lignes — employés et ayants droit</div></div>
      </div>
      <div className="px-5">
        <div className="relative mb-3">
          <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un nom…" style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>

        {filtered.map((r) => {
          const pct = r.plafond ? Math.round((r.consomme / r.plafond) * 100) : 0;
          return (
            <Card key={r.key} className="p-3 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{r.nom}</div>
                  <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{r.gradeOrRelation} · Rattaché à : {r.rattacheA}</div>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: pct >= 90 ? C.red : C.navy }}>{pct}%</div>
                  <div style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>{fmt(r.consomme)} / {fmt(r.plafond)}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Finance({ session, setSession, notify, go, initialAction }: any) {
  const [sub, setSub] = useState(initialAction || "cotisations");
  const [payStatus, setPayStatus] = useState("idle");
  const [methode, setMethode] = useState<string | null>(null);

  const factureEnRetard = session.factures.find((f: any) => f.statut === "En retard");
  const surplusAPayer = (session.surplus || []).filter((s: any) => s.statut === "À payer");

  const payerFacture = () => {
    if (!factureEnRetard || !methode) return;
    setPayStatus("loading");
    setTimeout(() => {
      setSession({
        ...session,
        factures: session.factures.map((f: any) => (f.id === factureEnRetard.id ? { ...f, statut: "Payée", datePaiement: "07/07/2026" } : f)),
        employes: session.employes.map((e: any) => (e.motifSuspension === "Facture impayée" ? { ...e, statut: "Actif", motifSuspension: undefined } : e)),
      });
      setPayStatus("done");
      notify(`Facture ${factureEnRetard.mois} réglée — QR codes réactivés`);
    }, 1200);
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Finance & Cotisations</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Suivi des factures et règlements</div></div>
      </div>

      <div className="px-5">
        {factureEnRetard ? (
          <Card className="p-4 mb-3" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
            <div className="flex items-center gap-2 mb-2"><ShieldAlert size={16} color={C.red} /><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.red }}>Facture {factureEnRetard.mois} en retard</span></div>
            <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Montant dû : <b>{fmt(factureEnRetard.montant)}</b></div>
          </Card>
        ) : (
          <Card className="p-4 mb-3 flex items-center gap-2" style={{ background: C.greenSoft, border: "none" }}><CheckCircle2 size={16} color={C.green} /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>Cotisations à jour</span></Card>
        )}

        {factureEnRetard && payStatus !== "done" && (
          <Card className="p-4 mb-3">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[["mobile", "Mobile Money", Smartphone], ["carte", "Carte", CreditCard], ["virement", "Banque", Landmark]].map(([id, label, Icon]: any) => (
                <button key={id} onClick={() => setMethode(id)} className="cursor-pointer"><Card className="p-2.5 flex flex-col items-center gap-1" style={{ border: methode === id ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}><Icon size={16} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 600, color: C.ink }}>{label}</span></Card></button>
              ))}
            </div>
            <button onClick={payerFacture} disabled={!methode} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer" style={{ background: methode ? C.gold : "#C9CDD6", color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13 }}>
              Payer {fmt(factureEnRetard.montant)}
            </button>
          </Card>
        )}

        <SectionLabel>Historique des factures</SectionLabel>
        <div className="space-y-2">
          {session.factures.map((f: any) => (
            <Card key={f.id} className="p-3.5 flex items-center justify-between">
              <div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{f.mois}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Échéance {f.dateEcheance}</div></div>
              <div className="text-right"><div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, color: C.navy }}>{fmt(f.montant)}</div><StatusPill statut={f.statut} /></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Derogations({ session, setSession, notify, go, initialAction }: any) {
  const [detail, setDetail] = useState<any>(initialAction || null);

  const traiter = (id: number, statut: string) => {
    const d = session.derogations.find((x: any) => x.id === id);
    setSession({
      ...session,
      derogations: session.derogations.map((x: any) => (x.id === id ? { ...x, statut, traitePar: session.entreprise.contactRH } : x)),
    });
    notify(`Dérogation ${statut.toLowerCase()} pour ${d?.employeNom}`);
    setDetail(null);
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Dérogations & Accord RH</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Autorisations exceptionnelles</div></div>
      </div>

      <div className="px-5 space-y-2">
        {session.derogations.map((d: any) => (
          <Card key={d.id} className="p-3.5">
            <div className="flex items-center justify-between mb-1"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{d.employeNom}</span><StatusPill statut={d.statut} /></div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{d.motif}</div>
            <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{d.hopital} · {d.date}</span><span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.gold }}>{fmt(d.montantDemande)}</span></div>
            {d.statut === "En attente" && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => traiter(d.id, "Refusée")} className="flex-1 rounded-lg py-2 border border-red-300 text-red-600 font-bold text-xs cursor-pointer">Refuser</button>
                <button onClick={() => traiter(d.id, "Approuvée")} className="flex-1 rounded-lg py-2 bg-[#2F8A5B] text-white font-bold text-xs cursor-pointer">Approuver</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Employes({ session, setSession, notify, go, initialAction }: any) {
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(initialAction === "add");
  const [nouv, setNouv] = useState({ nom: "", poste: "", grade: "agent", telephone: "", email: "", photo: "https://i.pravatar.cc/200?img=33" });

  const liste = session.employes.filter((e: any) => e.nom.toLowerCase().includes(query.toLowerCase()));

  const ajouterEmploye = async () => {
    if (!nouv.nom || !nouv.poste) return;
    const g = gradeInfo(nouv.grade);
    const num = session.employes.length + 1;
    const employe = {
      id: Date.now(), matricule: `MC-${String(num).padStart(4, "0")}`, nom: nouv.nom, poste: nouv.poste, grade: nouv.grade,
      statut: "Actif", photo: nouv.photo, plafondMensuel: g.plafondMensuel, consomme: 0,
      telephone: nouv.telephone, email: nouv.email, dateEmbauche: "25/07/2026",
      famille: [],
    };
    setSession({ ...session, employes: [...session.employes, employe] });
    setNouv({ nom: "", poste: "", grade: "agent", telephone: "", email: "", photo: "https://i.pravatar.cc/200?img=33" });
    setAddOpen(false);
    notify(`${employe.nom} affilié(e) avec succès !`);
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
          <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Employés & Affiliés</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.employes.length} employé(s) sur la police</div></div>
        </div>
        <button onClick={() => setAddOpen(!addOpen)} className="p-2 bg-[#C6992E] text-[#0D2818] rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer">
          <UserPlus size={14} /> Ajouter
        </button>
      </div>

      <div className="px-5">
        {addOpen && (
          <Card className="p-4 mb-4 space-y-3" style={{ background: C.ivory }}>
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy }}>Nouvel affilié RH</div>
            <Field label="Nom complet"><input style={inputStyle} value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} placeholder="Nom et Prénom" /></Field>
            <Field label="Poste"><input style={inputStyle} value={nouv.poste} onChange={(e) => setNouv({ ...nouv, poste: e.target.value })} placeholder="Titre professionnel" /></Field>
            <Field label="Grade">
              <select style={inputStyle} value={nouv.grade} onChange={(e) => setNouv({ ...nouv, grade: e.target.value })}>
                {session.grades.map((g: any) => <option key={g.id} value={g.id}>{g.nom} — {g.taux}% · {fmt(g.plafondMensuel)}/mois</option>)}
              </select>
            </Field>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-xl py-2.5 text-xs font-semibold border border-slate-300 cursor-pointer">Annuler</button>
              <button onClick={ajouterEmploye} disabled={!nouv.nom || !nouv.poste} className="flex-1 rounded-xl py-2.5 bg-[#0D2818] text-white text-xs font-bold cursor-pointer">Confirmer l'affiliation</button>
            </div>
          </Card>
        )}

        <div className="relative mb-3">
          <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un collaborateur..." style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>

        <div className="space-y-2">
          {liste.map((e: any) => {
            const g = gradeInfo(e.grade);
            const pct = Math.round((e.consomme / (e.plafondReel ?? e.plafondMensuel)) * 100);
            return (
              <Card key={e.id} className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={e.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{e.nom}</div>
                    <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{e.poste} · <span style={{ color: g.couleur, fontWeight: 700 }}>{g.nom.split(" ")[0]}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusPill statut={e.statut} />
                  <div style={{ fontFamily: mono, fontSize: 10, color: pct >= 90 ? C.red : C.sub, marginTop: 2 }}>{pct}% consommé</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardMain({ session, setSession, notify, go }: any) {
  const { employes, derogations, factures, entreprise } = session;
  const actifs = employes.filter((e: any) => e.statut === "Actif").length;
  const suspendus = employes.filter((e: any) => e.statut === "Suspendu").length;
  const totalFamille = employes.reduce((s: number, e: any) => s + (e.famille?.length || 0), 0);
  const consoTotal = employes.reduce((s: number, e: any) => s + e.consomme, 0);
  const plafondTotal = employes.reduce((s: number, e: any) => s + (e.plafondReel ?? e.plafondMensuel), 0);
  const pctGlobal = plafondTotal ? Math.round((consoTotal / plafondTotal) * 100) : 0;
  const derogEnAttente = derogations.filter((d: any) => d.statut === "En attente").length;
  const factureEnRetard = factures.find((f: any) => f.statut === "En retard");

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-3">
        <div style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Espace Entreprise RH</div>
        <div style={{ fontFamily: serif, fontSize: 22, color: C.navy, fontWeight: 700 }}>{entreprise.nom}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <ShieldCheck size={13} color={C.green} />
          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.green, fontWeight: 700 }}>Contrat N° {entreprise.contrat} ({entreprise.formule})</span>
        </div>
      </div>

      {(factureEnRetard || derogEnAttente > 0) && (
        <div className="px-5 mb-3 space-y-2">
          {factureEnRetard && (
            <Card onClick={() => go("finance")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <ShieldAlert size={15} color={C.red} />
              <span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}><b>Facture {factureEnRetard.mois} en retard</b> — régulariser la cotisation</span>
              <ChevronRight size={14} color={C.red} />
            </Card>
          )}
          {derogEnAttente > 0 && (
            <Card onClick={() => go("derogations")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.amberSoft }}>
              <FileText size={15} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}>{derogEnAttente} dérogation(s) en attente d'accord RH</span><ChevronRight size={14} color={C.amber} />
            </Card>
          )}
        </div>
      )}

      <div className="px-5 grid grid-cols-2 gap-3 mb-3">
        <Card className="p-4"><Users size={18} color={C.navy2} /><div style={{ fontFamily: serif, fontSize: 22, color: C.navy, marginTop: 4 }}>{employes.length}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Collaborateurs affiliés</div></Card>
        <Card className="p-4"><ShieldCheck size={18} color={C.green} /><div style={{ fontFamily: serif, fontSize: 22, color: C.navy, marginTop: 4 }}>{totalFamille}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Ayants droit couverts</div></Card>
      </div>

      <div className="px-5 mb-4">
        <Card className="p-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily: sans, fontSize: 10.5, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Consommation globale du mois</div>
              <div style={{ fontFamily: serif, fontSize: 24, color: "white", marginTop: 4 }}>{fmt(consoTotal)}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>sur {fmt(plafondTotal)} de budget accordé</div>
            </div>
            <div className="relative flex items-center justify-center"><Ring pct={pctGlobal} size={58} stroke={6} color={pctGlobal > 85 ? C.red : C.gold} /><span className="absolute" style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: "white" }}>{pctGlobal}%</span></div>
          </div>
        </Card>
      </div>

      <SectionLabel>Évolution de la consommation médicale</SectionLabel>
      <div className="px-5 mb-4">
        <Card className="p-4">
          <div style={{ width: "100%", height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSO_MENSUELLE} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="entConsoGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.5} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: C.sub }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: C.sub }} axisLine={false} tickLine={false} width={30} />
                <Tooltip formatter={(v: any) => fmt(v)} />
                <Area type="monotone" dataKey="montant" stroke={C.gold} strokeWidth={2} fill="url(#entConsoGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <SectionLabel>Actions de pilotage RH</SectionLabel>
      <div className="px-5 grid grid-cols-2 gap-3">
        <button onClick={() => go("employes", "add")} className="text-left cursor-pointer"><Card className="p-4" style={{ background: "#EAF2EC", border: "none" }}><UserPlus size={18} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>Affilier collaborateur</div></Card></button>
        <button onClick={() => go("derogations")} className="text-left cursor-pointer"><Card className="p-4" style={{ background: "#FBEAE8", border: "none" }}><FileText size={18} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>Voir dérogations</div></Card></button>
        <button onClick={() => go("finance")} className="text-left cursor-pointer"><Card className="p-4" style={{ background: "#EEF1F8", border: "none" }}><Wallet size={18} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>Cotisations & Paie</div></Card></button>
        <button onClick={() => go("plus")} className="text-left cursor-pointer"><Card className="p-4" style={{ background: "#F2EDF6", border: "none" }}><Award size={18} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 6 }}>Grades & Plafonds</div></Card></button>
      </div>
    </div>
  );
}

/* =================================================================
   COMPOSANT PRINCIPAL EXPORTÉ
================================================================= */
export const EnterpriseRHDashboard: React.FC<{ onNavigateToModule?: (id: string) => void }> = ({ onNavigateToModule }) => {
  const [session, setSession] = useState<any>({
    entreprise: COMPANY_DEMO,
    grades: GRADES_DEFAUT.map((g) => ({ ...g })),
    cascade: CASCADE_DEFAUT.map((c) => ({ ...c })),
    employes: buildEmployes(),
    derogations: buildDerogations(),
    factures: buildFactures(),
    surplus: buildSurplus(),
    alertes: [
      { id: 1, type: "paiement", titre: "Facture de Mai impayée", detail: "Régularisation recommandée", gravite: "critique" },
      { id: 2, type: "plafond", titre: "NGALULA Grâce à 98% du plafond", detail: "118$ / 120$", gravite: "warning" },
    ]
  });

  const [tab, setTab] = useState("dashboard");
  const [tabAction, setTabAction] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const notify = (m: string) => setToast(m);

  const go = (target: string, action?: string) => { setTab(target); setTabAction(action || null); };

  const tabs = [
    { id: "dashboard", label: "Accueil", icon: LayoutDashboard },
    { id: "employes", label: "Employés", icon: Users },
    { id: "derogations", label: "Dérogations", icon: FileText },
    { id: "finance", label: "Finance", icon: Wallet },
    { id: "plus", label: "Plus", icon: Settings },
  ];

  const derogEnAttente = session.derogations.filter((d: any) => d.statut === "En attente").length;

  return (
    <div className="w-full min-h-screen bg-[#F6F3EC] flex flex-col items-center justify-start py-4 px-2 sm:px-4" style={{ fontFamily: sans }}>
      <style>{`@keyframes riseIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }`}</style>
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-[#E7E2D6] overflow-hidden min-h-[750px] flex flex-col justify-between">
        {/* Top Header */}
        <div className="bg-[#0D2818] text-white px-6 py-4 flex items-center justify-between border-b border-[#1B4A34]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C6992E] text-[#0D2818] flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white leading-tight">
                {session.entreprise.nom}
              </h1>
              <p className="font-sans text-xs text-[#EFDFB8]">
                Portail RH & Gestionnaire de Santé Salariés
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => go("plus")}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
              title="Alertes & Notifications"
            >
              <Bell size={18} />
              {derogEnAttente > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {derogEnAttente}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {tab === "dashboard" && <DashboardMain session={session} setSession={setSession} notify={notify} go={go} />}
          {tab === "employes" && <Employes session={session} setSession={setSession} notify={notify} go={go} initialAction={tabAction} />}
          {tab === "derogations" && <Derogations session={session} setSession={setSession} notify={notify} go={go} initialAction={tabAction} />}
          {tab === "finance" && <Finance session={session} setSession={setSession} notify={notify} go={go} initialAction={tabAction} />}
          {tab === "contrat" && <ContratConsommation session={session} setSession={setSession} notify={notify} go={go} />}
          {tab === "plus" && <PlusScreen session={session} setSession={setSession} notify={notify} onLogout={() => {}} go={go} />}
        </div>

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}

        {/* Bottom Tab Bar */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E7E2D6] px-4 py-3 flex items-center justify-around z-20 shadow-md">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => go(t.id)} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${tab === t.id ? "text-[#0D2818]" : "text-[#6B6F76]"}`}
            >
              <t.icon size={20} strokeWidth={tab === t.id ? 2.5 : 2} />
              <span className={`text-[10px] ${tab === t.id ? "font-bold text-[#0D2818]" : "font-medium"}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseRHDashboard;
