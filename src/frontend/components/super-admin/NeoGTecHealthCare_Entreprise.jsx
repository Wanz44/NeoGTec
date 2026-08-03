import React, { useState } from "react";
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
const fmt = (n) => "$" + Number(n || 0).toLocaleString("fr-FR").replace(/,/g, " ");

/* ---------------------------------------------------------------
   DONNÉES — grades, employés, dérogations, factures, alertes
------------------------------------------------------------------ */
const GRADES_DEFAUT = [
  { id: "direction", nom: "Direction / Cadre supérieur", taux: 100, plafondMensuel: 500, plafondAnnuel: 6000, couleur: C.navy },
  { id: "cadre", nom: "Cadre / Agent de maîtrise", taux: 90, plafondMensuel: 350, plafondAnnuel: 4200, couleur: C.navy2 },
  { id: "agent", nom: "Agent d'exécution", taux: 80, plafondMensuel: 200, plafondAnnuel: 2400, couleur: C.gold },
  { id: "ouvrier", nom: "Ouvrier / Personnel de terrain", taux: 70, plafondMensuel: 120, plafondAnnuel: 1440, couleur: C.amber },
];
const gradeInfo = (id) => GRADES_DEFAUT.find((g) => g.id === id) || GRADES_DEFAUT[2];

/* =================================================================
   SYNCHRONISATION INTER-APPS — stockage partagé (window.storage)
   Reçoit les dérogations soumises depuis l'app Prestataire, et
   renvoie le statut (approuvée/refusée) une fois traité par le RH.
================================================================= */
const CLE_DEROGATIONS_PARTAGEES = "neogtec_eco_derogations_v1";

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

const CLE_COTISATIONS_PARTAGEES = "neogtec_eco_cotisations_v1";
const CLE_COMPTES_PARTAGES = "neogtec_eco_comptes_v1";
const CLE_MESSAGERIE_PARTAGEE = "neogtec_eco_messagerie_v1";
const CLE_RECLAMATIONS_PARTAGEES = "neogtec_eco_reclamations_v1";
const TYPES_RECLAMATION = ["Remboursement refusé", "Accueil clinique", "Délai de traitement", "Facturation", "Demande de résiliation", "Autre"];
const ETAPES_RECLAMATION = ["Reçue", "En cours d'analyse", "Décision rendue"];
const couleurSeverite = (s) => (s === "Haute" ? { bg: "#FBE2E0", fg: "#C0392B" } : s === "Moyenne" ? { bg: "#FBEBD2", fg: "#C88A1E" } : { bg: "#E3F2E6", fg: "#2F8A5B" });
const CLE_PEC_PARTAGEES = "neogtec_eco_pec_v1";
const CLE_MESSAGES_PREVENTION = "neogtec_eco_messages_prevention_v1";
async function chargerCanalPartage(cle) {
  try {
    const res = await window.storage.get(cle, true);
    return res?.value ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}
async function sauvegarderCanalPartage(cle, valeur) {
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
const CONDITIONS_SANTE = [
  { id: "diabete", label: "Diabète (type 1 ou 2)" },
  { id: "hta", label: "Hypertension artérielle" },
  { id: "vih", label: "VIH / SIDA" },
  { id: "cardiaque", label: "Maladie cardiaque" },
  { id: "renale", label: "Insuffisance rénale" },
  { id: "respiratoire", label: "Maladie respiratoire chronique" },
];
async function synchroniserEffectifVersAssureur(nomEntreprise, employe, action) {
  const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
  const idx = comptes.findIndex((c) => c.type === "entreprise" && c.nom === nomEntreprise);
  if (idx === -1) return false; // entreprise pas encore enregistrée côté Assureur — rien à synchroniser
  const compte = comptes[idx];
  const effectifs = compte.donnees?.effectifs || [];
  let policeEmploye = employe.police;
  let comptesMaj = [...comptes];

  if (action === "retirer") {
    const effectifsMaj = effectifs.filter((e) => e.matricule !== employe.matricule);
    comptesMaj[idx] = { ...compte, donnees: { ...compte.donnees, effectifs: effectifsMaj, nbEmployes: effectifsMaj.length } };
    // Le compte individuel de la personne retirée est désactivé, pas supprimé (conservation de l'historique).
    comptesMaj = comptesMaj.map((c) => (c.donnees?.police === employe.police ? { ...c, donnees: { ...c.donnees, statut: "Suspendu" } } : c));
  } else {
    if (!policeEmploye) {
      // Nouvel employé : génère sa propre police individuelle, distincte du contrat de l'entreprise.
      policeEmploye = `POL-EMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      // Reprend le vrai gabarit de garanties (avec leurs plafonds annuels réels) déjà déposé sur le compte
      // entreprise par l'assureur à la création du contrat — pas de plafond arbitraire ou local.
      const gabarit = compte.donnees?.garantiesConsommation?.length
        ? compte.donnees.garantiesConsommation.map((g) => ({ nom: g.nom, plafond: g.plafond ?? null, consomme: 0 }))
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
      // Chaque ayant droit de l'employé reçoit lui aussi sa propre police, distincte — pas de carte familiale.
      (employe.famille || []).forEach((f) => {
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
    const entreeEffectif = { nom: employe.nom, matricule: employe.matricule, email: employe.email, grade: employe.grade, police: policeEmploye, ayantsDroit: (employe.famille || []).map((f) => ({ nom: f.nom, lien: f.lien, naissance: f.naissance, email: f.telephone || "" })) };
    const effectifsMaj = [...effectifs.filter((e) => e.matricule !== employe.matricule), entreeEffectif];
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
};

/* Cascade de paiement — ordre des payeurs du contrat entreprise */
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
    { id: 8, mois: "Février 2026", montant: 14250, dateEcheance: "28/02/2026", statut: "En retard" },
    { id: 7, mois: "Janvier 2026", montant: 14250, dateEcheance: "31/01/2026", statut: "Payée", datePaiement: "30/01/2026" },
    { id: 6, mois: "Décembre 2025", montant: 14250, dateEcheance: "31/12/2025", statut: "Payée", datePaiement: "22/12/2025" },
    { id: 5, mois: "Novembre 2025", montant: 14250, dateEcheance: "30/11/2025", statut: "Payée", datePaiement: "27/11/2025" },
    { id: 4, mois: "Octobre 2025", montant: 14250, dateEcheance: "31/10/2025", statut: "Payée", datePaiement: "31/10/2025" },
    { id: 3, mois: "Septembre 2025", montant: 14250, dateEcheance: "30/09/2025", statut: "Payée", datePaiement: "29/09/2025" },
    { id: 2, mois: "Août 2025", montant: 14250, dateEcheance: "31/08/2025", statut: "Payée", datePaiement: "30/08/2025" },
    { id: 1, mois: "Juillet 2025", montant: 14250, dateEcheance: "31/07/2025", statut: "Payée", datePaiement: "28/07/2025" },
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
   AUTHENTIFICATION ENTREPRISE
================================================================= */
function SignUp({ onDone, onGoSignIn }) {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", motDePasse: "", confirmation: "" });
  const [erreur, setErreur] = useState("");
  const valider = () => {
    if (!form.nom || !form.email || !form.telephone || !form.motDePasse) { setErreur("Veuillez remplir tous les champs."); return; }
    if (form.motDePasse.length < 6) { setErreur("Le mot de passe doit contenir au moins 6 caractères."); return; }
    if (form.motDePasse !== form.confirmation) { setErreur("Les mots de passe ne correspondent pas."); return; }
    setErreur(""); onDone(form);
  };
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-14 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 60, height: 60, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><Building2 size={26} color={C.gold} /></div>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: "white", letterSpacing: 1, marginTop: 12 }}>NEOGTEC HEALTHCARE — ENTREPRISE</div>
          <div style={{ fontFamily: serif, fontSize: 19, color: "white", marginTop: 8 }}>Créer un compte gestionnaire</div>
        </div>
        <div className="space-y-2.5">
          <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom du responsable RH" />
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

async function trouverCompteReelEntreprise(identifiant, motDePasse) {
  const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
  for (const compte of comptes) {
    if (compte.type !== "entreprise") continue;
    for (const a of (compte.acces || [])) {
      if (a.email && a.email.toLowerCase() === identifiant.toLowerCase() && a.motDePasseProvisoire === motDePasse) {
        return { compte, personne: a };
      }
    }
  }
  return null;
}
function construireSessionReelleEntreprise(match) {
  const { compte, personne } = match;
  const d = compte.donnees || {};
  return {
    entreprise: {
      nom: compte.nom, secteur: d.secteur || "—", rccm: d.rccm || "—", adresse: d.adresse || "—",
      contactRH: personne.nom, telephone: d.telephone || compte.telephone || "—", email: personne.email,
      contrat: d.contrat || `CTR-ENT-2026-${String(compte.nom || "").length}00000`, formule: d.formule || "Confort Entreprise",
      validite: `${d.dateDebut || "01/01/2026"} — 31/12/2026`, statutContrat: d.statutContrat || "Actif", resiliation: d.resiliation || null,
    },
    grades: GRADES_DEFAUT.map((g) => ({ ...g })), cascade: CASCADE_DEFAUT.map((c) => ({ ...c })),
    employes: buildEmployes(), derogations: buildDerogations(), factures: buildFactures(), surplus: buildSurplus(),
    alertes: [], compteReel: true, roleConnexion: personne.role || "Administrateur du compte",
  };
}

function SignIn({ prefill, onDone, onGoSignUp }) {
  const [form, setForm] = useState({ identifiant: prefill?.email || "", motDePasse: "" });
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const valider = async () => {
    if (!form.identifiant || !form.motDePasse) { setErreur("Veuillez saisir vos identifiants."); return; }
    setErreur(""); setLoading(true);
    const match = await trouverCompteReelEntreprise(form.identifiant, form.motDePasse);
    setLoading(false);
    onDone(match ? construireSessionReelleEntreprise(match) : null);
  };
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-14 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 60, height: 60, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><Lock size={24} color={C.gold} /></div>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 13, color: "white", letterSpacing: 1, marginTop: 12 }}>NEOGTEC HEALTHCARE — ENTREPRISE</div>
          <div style={{ fontFamily: serif, fontSize: 19, color: "white", marginTop: 8 }}>Connexion gestionnaire</div>
        </div>
        <div className="space-y-2.5">
          <input style={inputStyle} value={form.identifiant} onChange={(e) => setForm({ ...form, identifiant: e.target.value })} placeholder="Email professionnel" />
          <input style={inputStyle} type="password" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} placeholder="Mot de passe" />
          {erreur && <div className="flex items-center gap-1.5" style={{ color: "#FFB4B0" }}><AlertTriangle size={12} /><span style={{ fontFamily: sans, fontSize: 11 }}>{erreur}</span></div>}
        </div>
      </div>
      <div className="w-full space-y-3">
        <button onClick={valider} disabled={loading} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />} {loading ? "Connexion…" : "Se connecter"}
        </button>
        <button onClick={onGoSignUp} className="w-full text-center py-2" style={{ fontFamily: sans, fontSize: 12.5, color: "white" }}>Pas encore de compte ? <span style={{ color: C.gold, fontWeight: 700 }}>S'inscrire</span></button>
      </div>
    </div>
  );
}

/* =================================================================
   PLUS — grades & couvertures, alertes, assistance, paramètres
================================================================= */
function GradeAccordionItem({ g, nb, onSave }) {
  const [draft, setDraft] = useState({ taux: g.taux, plafondMensuel: g.plafondMensuel, plafondAnnuel: g.plafondAnnuel });
  const [dirty, setDirty] = useState(false);
  const change = (field, val) => { setDraft({ ...draft, [field]: val.replace(/\D/g, "") }); setDirty(true); };
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

function GradesEtCouvertures({ session, setSession, notify }) {
  const saveGrade = (id, draft) => {
    setSession({ ...session, grades: session.grades.map((g) => (g.id === id ? { ...g, taux: Number(draft.taux) || g.taux, plafondMensuel: Number(draft.plafondMensuel) || g.plafondMensuel, plafondAnnuel: Number(draft.plafondAnnuel) || g.plafondAnnuel } : g)) });
    notify(`Couverture "${session.grades.find((g) => g.id === id)?.nom}" enregistrée`);
  };
  return (
    <>
      <SectionLabel>Grades & couvertures</SectionLabel>
      <div className="px-5 space-y-2">
        {session.grades.map((g) => (
          <GradeAccordionItem key={g.id} g={g} nb={session.employes.filter((e) => e.grade === g.id).length} onSave={saveGrade} />
        ))}
        <Card className="p-3.5 flex items-center gap-3" style={{ background: C.ivory, border: "none" }}>
          <div className="rounded-full" style={{ width: 10, height: 10, background: C.sub }} />
          <div className="flex-1">
            <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Ayants droit (Dépendant)</div>
            <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Taux automatique appliqué à tout conjoint/enfant, quel que soit le grade de l'employé rattaché — le plafond est calculé en proportion du plafond de l'employé (70% conjoint, 40% enfant).</div>
          </div>
          <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.navy }}>{DEPENDANT_TAUX}%</span>
        </Card>
      </div>
    </>
  );
}

/* =================================================================
   RÈGLES DU CONTRAT — cascade de paiement & validité
================================================================= */
function ReglesDuContrat({ session, setSession, notify }) {
  const [validite, setValidite] = useState(session.entreprise.validite || "");
  const monter = (i) => {
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
          <span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Définit qui règle un soin en premier. La CSU ne couvre à 100% que la maternité (seul volet effectif à ce jour) ; pour tous les autres soins, c'est l'Assurance Privée qui paie en premier.</span>
        </Card>
        <div className="space-y-2">
          {(session.cascade || []).map((c, i) => (
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

function PlusScreen({ session, setSession, notify, onLogout, go }) {
  const [tab, setTab] = useState("grades");
  const [alerteDetail, setAlerteDetail] = useState(null);
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2">
        <div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Plus</div>
      </div>
      <div className="px-5 flex gap-2 mb-2 overflow-x-auto">
        {[["grades", "Grades", Award], ["contrat", "Règles du contrat", FileText], ["alertes", "Alertes", Bell], ["assistance", "Assistance", MessageSquare], ["parametres", "Paramètres", Settings]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className="flex-shrink-0 rounded-full py-2 px-3 flex items-center gap-1.5" style={{ background: tab === k ? C.navy : "white", color: tab === k ? "white" : C.ink, border: `1px solid ${tab === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Icon size={12} /> {l}</button>
        ))}
      </div>

      {tab === "grades" && <GradesEtCouvertures session={session} setSession={setSession} notify={notify} />}

      {tab === "contrat" && <ReglesDuContrat session={session} setSession={setSession} notify={notify} />}

      {tab === "alertes" && (
        <div className="px-5 space-y-2">
          {session.alertes.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune alerte.</span></Card>}
          {alerteDetail ? (() => {
            const a = session.alertes.find((x) => x.id === alerteDetail);
            if (!a) { setAlerteDetail(null); return null; }
            const cfg = { critique: { bg: C.redSoft, fg: C.red, icon: ShieldAlert }, warning: { bg: C.amberSoft, fg: C.amber, icon: AlertTriangle }, info: { bg: C.ivory, fg: C.navy2, icon: Bell } }[a.gravite] || { bg: C.ivory, fg: C.navy2, icon: Bell };
            const Icon = cfg.icon;
            return (
              <Card className="p-4">
                <button onClick={() => setAlerteDetail(null)} className="flex items-center gap-1.5 mb-3" style={{ fontFamily: sans, fontSize: 11, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour aux alertes</button>
                <div className="flex items-start gap-3 p-3 rounded-xl mb-3" style={{ background: cfg.bg }}>
                  <Icon size={18} color={cfg.fg} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div><div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{a.titre}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub, marginTop: 2 }}>{a.detail}</div></div>
                </div>
                {a.actionGo ? (
                  <button onClick={() => go(a.actionGo, a.refId)} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>{a.actionLabel || "Voir le détail"} <ChevronRight size={14} /></button>
                ) : (
                  <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textAlign: "center" }}>Aucune action associée à cette alerte.</div>
                )}
              </Card>
            );
          })() : (
            session.alertes.map((a) => {
              const cfg = { critique: { bg: C.redSoft, fg: C.red, icon: ShieldAlert }, warning: { bg: C.amberSoft, fg: C.amber, icon: AlertTriangle }, info: { bg: C.ivory, fg: C.navy2, icon: Bell } }[a.gravite] || { bg: C.ivory, fg: C.navy2, icon: Bell };
              const Icon = cfg.icon;
              return (
                <Card key={a.id} onClick={() => setAlerteDetail(a.id)} className="p-3.5 flex items-start gap-3 cursor-pointer" style={{ background: cfg.bg, border: "none" }}>
                  <Icon size={15} color={cfg.fg} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{a.titre}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{a.detail}</div></div>
                  <ChevronRight size={14} color={cfg.fg} />
                </Card>
              );
            })
          )}
        </div>
      )}

      {tab === "assistance" && <MessagerieEntreprise session={session} notify={notify} />}

      {tab === "parametres" && (
        <div className="px-5 space-y-2">
          <Card className="p-4">
            <div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{session.entreprise.nom}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{session.entreprise.secteur}</div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub, marginTop: 4 }}>{session.entreprise.rccm}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 4 }}>{session.entreprise.contactRH}</div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{session.entreprise.contrat} · {session.entreprise.formule}</div>
          </Card>
          <button onClick={onLogout} className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><LogOut size={15} /> Se déconnecter</button>
        </div>
      )}
    </div>
  );
}

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

function ReclamationsEntreprise({ session, notify }) {
  const [sousVue, setSousVue] = useState("suivi");
  const [reclamations, setReclamations] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({ beneficiaire: "", type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" });
  const monRef = session.entreprise.nom;

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanalPartage(CLE_RECLAMATIONS_PARTAGEES);
    setReclamations(toutes.filter((r) => r.initiateurType === "entreprise" && r.initiateurRef === monRef));
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const soumettre = async () => {
    if (!form.description.trim() || !form.beneficiaire.trim()) return;
    const toutes = await chargerCanalPartage(CLE_RECLAMATIONS_PARTAGEES);
    const numero = `REC-2026-${String(toutes.length + 1).padStart(3, "0")}`;
    const reclamation = {
      id: numero, initiateurType: "entreprise", initiateurNom: session.entreprise.contactRH, initiateurRef: monRef,
      beneficiaire: form.beneficiaire, contexte: `${session.entreprise.nom} · Contrat ${session.entreprise.contrat}`,
      type: form.type, severite: form.severite, description: form.description, document: form.document || null,
      etape: "Reçue", decision: null, dateSoumission: "15/07/2026", derniereActivite: "15/07/2026",
      historique: [{ action: "Réclamation enregistrée sur l'app Entreprise", auteur: session.entreprise.contactRH, date: "15/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
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
          <Field label="Bénéficiaire concerné (employé ou ayant droit)"><input style={inputStyle} value={form.beneficiaire} onChange={(e) => setForm({ ...form, beneficiaire: e.target.value })} placeholder="Nom complet" /></Field>
          <div className="mt-2.5"><Field label="Type de réclamation"><select style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{TYPES_RECLAMATION.map((t) => <option key={t}>{t}</option>)}</select></Field></div>
          <div className="mt-2.5">
            <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 5 }}>Niveau de sévérité</div>
            <div className="grid grid-cols-3 gap-2">
              {["Basse", "Moyenne", "Haute"].map((s) => (
                <button key={s} onClick={() => setForm({ ...form, severite: s })} className="rounded-lg py-2" style={{ background: form.severite === s ? couleurSeverite(s).fg : "white", color: form.severite === s ? "white" : C.ink, border: `1px solid ${form.severite === s ? couleurSeverite(s).fg : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mt-2.5"><Field label="Description des faits"><textarea style={{ ...inputStyle, minHeight: 90, resize: "none" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Expliquez en détail la contestation ou le problème rencontré…" /></Field></div>
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
            <button onClick={() => setForm({ beneficiaire: "", type: TYPES_RECLAMATION[0], severite: "Moyenne", description: "", document: "" })} className="flex-1 rounded-xl py-3" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Réinitialiser</button>
            <button onClick={soumettre} disabled={!form.description.trim() || !form.beneficiaire.trim()} className="flex-1 rounded-xl py-3" style={{ background: (!form.description.trim() || !form.beneficiaire.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}>Envoyer ma réclamation</button>
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
                <div style={{ fontFamily: sans, fontSize: 10.5, color: C.navy2, fontWeight: 700 }}>Concerne : {r.beneficiaire}</div>
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

function MessagerieEntreprise({ session, notify }) {
  const [vue, setVue] = useState("messagerie");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [composeOuvert, setComposeOuvert] = useState(false);
  const [nouveauSujet, setNouveauSujet] = useState("");
  const [nouveauTexte, setNouveauTexte] = useState("");
  const [texte, setTexte] = useState("");

  const monIdentifiant = session.entreprise.nom;

  const synchroniser = async () => {
    setSyncing(true);
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    setConversations(toutes.filter((c) => (c.initiateurType === "entreprise" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "entreprise" && c.destinataireNom === monIdentifiant)));
    setSyncing(false);
  };
  React.useEffect(() => { synchroniser(); }, []);

  const demarrerConversation = async () => {
    if (!nouveauSujet.trim() || !nouveauTexte.trim()) return;
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    const conv = {
      id: `MSG-${Date.now()}`, sujet: nouveauSujet, statut: "Ouvert",
      initiateurType: "entreprise", initiateurNom: session.entreprise.contactRH, initiateurRef: monIdentifiant, initiateurTelephone: session.entreprise.telephone,
      contexte: `${session.entreprise.nom} · Contrat ${session.entreprise.contrat}`,
      messages: [{ id: 1, auteurType: "entreprise", auteurNom: session.entreprise.contactRH, texte: nouveauTexte, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
      derniereActivite: "07/07/2026",
    };
    const maj = [conv, ...toutes];
    await sauvegarderCanalPartage(CLE_MESSAGERIE_PARTAGEE, maj);
    setConversations(maj.filter((c) => (c.initiateurType === "entreprise" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "entreprise" && c.destinataireNom === monIdentifiant)));
    setNouveauSujet(""); setNouveauTexte(""); setComposeOuvert(false);
    notify("Message envoyé à l'assureur — transmis directement, sans email");
  };

  const envoyer = async (convId) => {
    if (!texte.trim()) return;
    const toutes = await chargerCanalPartage(CLE_MESSAGERIE_PARTAGEE);
    const msg = { id: Date.now(), auteurType: "entreprise", auteurNom: session.entreprise.contactRH, texte, date: "07/07/2026", heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
    const maj = toutes.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, msg], derniereActivite: "07/07/2026" } : c));
    await sauvegarderCanalPartage(CLE_MESSAGERIE_PARTAGEE, maj);
    setConversations(maj.filter((c) => (c.initiateurType === "entreprise" && c.initiateurRef === monIdentifiant) || (c.destinataireType === "entreprise" && c.destinataireNom === monIdentifiant)));
    setTexte("");
  };

  if (selected) {
    const c = conversations.find((x) => x.id === selected);
    if (!c) { setSelected(null); return null; }
    return (
      <div className="px-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 mb-3" style={{ fontFamily: sans, fontSize: 11, color: C.sub, fontWeight: 700 }}><ArrowLeft size={13} /> Retour</button>
        <div className="mb-2"><div style={{ fontFamily: serif, fontSize: 16, color: C.navy, fontWeight: 700 }}>{c.sujet}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{c.contexte}</div></div>
        <div className="flex gap-2 mb-3">
          <a href={whatsappChatUrl("+243843961575", `Bonjour, à propos de : ${c.sujet}`)} target="_blank" rel="noreferrer" className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><MessageSquare size={12} /> WhatsApp</a>
          <a href={whatsappCallUrl("+243843961575")} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.green}`, color: C.green, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Phone size={12} /> Appel WhatsApp</a>
        </div>
        <div className="space-y-2 mb-3">
          {c.messages.map((m) => (
            <div key={m.id} className="flex" style={{ justifyContent: m.auteurType === "entreprise" ? "flex-end" : "flex-start" }}>
              <div className="rounded-2xl px-3.5 py-2.5" style={{ maxWidth: "78%", background: m.auteurType === "entreprise" ? C.navy : "white", border: m.auteurType === "entreprise" ? "none" : `1px solid ${C.line}` }}>
                {m.auteurType !== "entreprise" && <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.gold, marginBottom: 2 }}>{m.auteurNom} (Assureur)</div>}
                <div style={{ fontFamily: sans, fontSize: 12.5, color: m.auteurType === "entreprise" ? "white" : C.ink }}>{m.texte}</div>
                <div style={{ fontFamily: sans, fontSize: 9, color: m.auteurType === "entreprise" ? "#B9C3D6" : C.sub, marginTop: 2, textAlign: "right" }}>{m.date} {m.heure}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input style={{ ...inputStyle, flex: 1 }} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Écrire un message…" />
          <button onClick={() => envoyer(c.id)} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: C.navy }}><Send size={15} color="white" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 space-y-2">
      <a href="tel:+243843961575"><Card className="p-3.5 flex items-center gap-3"><Phone size={16} color={C.navy2} /><div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Gestionnaire de compte</div><div style={{ fontFamily: mono, fontSize: 11, color: C.sub }}>+243 84 39 615 75</div></div></Card></a>
      <a href="https://wa.me/243843961575"><Card className="p-3.5 flex items-center gap-3"><MessageSquare size={16} color={C.green} /><div><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>WhatsApp Business</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Réponse rapide</div></div></Card></a>

      <div className="flex gap-2 pt-2">
        <button onClick={() => setVue("messagerie")} className="flex-1 rounded-xl py-2" style={{ background: vue === "messagerie" ? C.navy : "white", color: vue === "messagerie" ? "white" : C.ink, border: `1px solid ${vue === "messagerie" ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Messagerie</button>
        <button onClick={() => setVue("reclamations")} className="flex-1 rounded-xl py-2" style={{ background: vue === "reclamations" ? C.navy : "white", color: vue === "reclamations" ? "white" : C.ink, border: `1px solid ${vue === "reclamations" ? C.navy : C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Réclamations</button>
      </div>

      {vue === "reclamations" ? (
        <ReclamationsEntreprise session={session} notify={notify} />
      ) : (
        <>
          <div className="flex items-center justify-between pt-2"><SectionLabel>Messagerie interne (avec l'assureur)</SectionLabel></div>
          <div className="flex gap-2 mb-2">
            <button onClick={synchroniser} disabled={syncing} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>{syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Synchroniser</button>
            <button onClick={() => setComposeOuvert(!composeOuvert)} className="flex-1 rounded-xl py-2.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 12, fontWeight: 700 }}><MessageCircle size={13} /> Nouveau message</button>
          </div>

          {composeOuvert && (
            <Card className="p-3.5 space-y-2 mb-2" style={{ background: C.ivory, border: "none" }}>
              <input style={inputStyle} value={nouveauSujet} onChange={(e) => setNouveauSujet(e.target.value)} placeholder="Objet (ex : Question sur une facture)" />
              <textarea style={{ ...inputStyle, minHeight: 70, resize: "none" }} value={nouveauTexte} onChange={(e) => setNouveauTexte(e.target.value)} placeholder="Votre message…" />
              <button onClick={demarrerConversation} disabled={!nouveauSujet.trim() || !nouveauTexte.trim()} className="w-full rounded-lg py-2.5" style={{ background: (!nouveauSujet.trim() || !nouveauTexte.trim()) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 12.5, fontWeight: 700 }}>Envoyer à l'assureur</button>
            </Card>
          )}

          {conversations.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun message pour l'instant.</span></Card>}
          {conversations.map((c) => (
            <Card key={c.id} onClick={() => setSelected(c.id)} className="p-3.5 flex items-center gap-3 cursor-pointer">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 38, height: 38, background: C.ivory }}><MessageCircle size={17} color={C.navy2} /></div>
              <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{c.sujet}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{c.messages[c.messages.length - 1]?.texte.slice(0, 40)}…</div></div>
              <StatusPill statut={c.statut} />
            </Card>
          ))}
        </>
      )}
    </div>
  );
}


/* =================================================================
   CONTRAT & CONSOMMATION — employés + ayants droit, ligne par ligne
================================================================= */
function ContratConsommation({ session, setSession, notify, go }) {
  const [query, setQuery] = useState("");
  const [edit, setEdit] = useState(null);
  const [draft, setDraft] = useState({});

  const rows = [];
  const derogationsApprouvees = (session.derogations || []).filter((d) => d.statut === "Approuvée");
  session.employes.forEach((e) => {
    const g = gradeInfo(e.grade);
    const derogE = derogationsApprouvees.filter((d) => d.employeId === e.id);
    rows.push({ key: `e${e.id}`, type: "employe", employeId: e.id, famIndex: null, nom: e.nom, gradeOrRelation: g.nom, gradeId: e.grade, couleur: g.couleur, rattacheA: "—", consomme: e.consomme, plafond: e.plafondMensuel, statut: e.statut, photo: e.photo, derogations: derogE });
    (e.famille || []).forEach((f, i) => {
      rows.push({ key: `e${e.id}-f${i}`, type: "ayant_droit", employeId: e.id, famIndex: i, nom: f.nom, gradeOrRelation: f.lien, couleur: C.sub, rattacheA: e.nom, consomme: f.consomme || 0, plafond: f.plafond || 0, statut: e.statut, photo: null, derogations: [] });
    });
  });
  const filtered = rows.filter((r) => r.nom.toLowerCase().includes(query.toLowerCase()) || r.rattacheA.toLowerCase().includes(query.toLowerCase()));

  const ouvrirEdition = (r) => {
    setEdit(r.key);
    setDraft(r.type === "employe" ? { grade: r.gradeId, plafond: r.plafond } : { plafond: r.plafond });
  };
  const enregistrerEdition = (r) => {
    setSession({
      ...session,
      employes: session.employes.map((e) => {
        if (e.id !== r.employeId) return e;
        if (r.type === "employe") return { ...e, grade: draft.grade, plafondMensuel: Number(draft.plafond) || e.plafondMensuel };
        return { ...e, famille: e.famille.map((f, i) => (i === r.famIndex ? { ...f, plafond: Number(draft.plafond) || f.plafond } : f)) };
      }),
    });
    notify(`Contrat de ${r.nom} mis à jour`);
    setEdit(null);
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Voir consommation police</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>{rows.length} lignes — employés et ayants droit</div></div>
      </div>
      <div className="px-5">
        <div className="relative mb-3">
          <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un nom…" style={{ ...inputStyle, paddingLeft: 30 }} />
        </div>

        <div className="flex items-center px-1 pb-1.5" style={{ borderBottom: `1px solid ${C.line}` }}>
          <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.sub, textTransform: "uppercase", flex: 1.6 }}>Employé / Ayant droit</span>
          <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.sub, textTransform: "uppercase", flex: 1.1, textAlign: "center" }}>Grade / Relation</span>
          <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.sub, textTransform: "uppercase", flex: 1, textAlign: "center" }}>%</span>
          <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 700, color: C.sub, textTransform: "uppercase", flex: 0.6, textAlign: "right" }}>Actions</span>
        </div>

        {filtered.map((r) => {
          const pct = r.plafond ? Math.round((r.consomme / r.plafond) * 100) : 0;
          const isEditing = edit === r.key;
          return (
            <div key={r.key} className="py-2.5" style={{ borderBottom: `1px solid ${C.line}` }}>
              <div className="flex items-center">
                <div className="flex items-center gap-2" style={{ flex: 1.6 }}>
                  {r.photo ? (
                    <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 24, height: 24, opacity: r.statut === "Suspendu" ? 0.5 : 1 }}><img src={r.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  ) : (
                    <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 24, height: 24, background: C.ivory }}><Users size={11} color={C.navy2} /></div>
                  )}
                  <div>
                    <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.ink }}>{r.nom}</div>
                    <div style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>Rattaché à : {r.rattacheA}</div>
                    {r.derogations?.length > 0 && (
                      <div className="flex items-center gap-1 mt-0.5"><ShieldAlert size={9} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 9, color: C.amber, fontWeight: 700 }}>{r.derogations.length} dérogation(s) — plafond dépassé (hors contrat)</span></div>
                    )}
                  </div>
                </div>
                <span style={{ fontFamily: sans, fontSize: 9.5, color: r.couleur, fontWeight: 700, flex: 1.1, textAlign: "center" }}>{r.gradeOrRelation.split(" ")[0]}</span>
                <span style={{ fontFamily: mono, fontSize: 10.5, color: pct >= 90 ? C.red : C.ink, fontWeight: 700, flex: 1, textAlign: "center" }}>{pct}%</span>
                <button onClick={() => (isEditing ? setEdit(null) : ouvrirEdition(r))} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 24, height: 24, background: isEditing ? C.navy : C.ivory, marginLeft: "auto" }}>
                  {isEditing ? <X size={12} color="white" /> : <Settings size={12} color={C.navy2} />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5" style={{ paddingLeft: 32 }}>
                <span style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>Consommé <b style={{ color: C.ink }}>{fmt(r.consomme)}</b></span>
                <span style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>Plafond <b style={{ color: C.ink }}>{fmt(r.plafond)}</b></span>
              </div>
              {isEditing && (
                <Card className="p-3 mt-2" style={{ background: C.ivory, border: "none" }}>
                  <div style={{ fontFamily: sans, fontSize: 10.5, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Modifier le contrat de {r.nom}</div>
                  {r.type === "employe" && (
                    <div className="mb-2">
                      <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.sub, marginBottom: 3, textTransform: "uppercase" }}>Grade (taux & plafond de base)</div>
                      <select style={inputStyle} value={draft.grade} onChange={(e) => setDraft({ ...draft, grade: e.target.value })}>
                        {session.grades.map((g) => <option key={g.id} value={g.id}>{g.nom} — {g.taux}%</option>)}
                      </select>
                    </div>
                  )}
                  <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.sub, marginBottom: 3, textTransform: "uppercase" }}>Plafond mensuel ($)</div>
                  <input style={inputStyle} value={draft.plafond} onChange={(e) => setDraft({ ...draft, plafond: e.target.value.replace(/\D/g, "") })} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEdit(null)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11, color: C.ink }}>Annuler</button>
                    <button onClick={() => enregistrerEdition(r)} className="flex-1 rounded-lg py-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontSize: 11, fontWeight: 700 }}>Enregistrer</button>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <Card className="p-5 text-center mt-2"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun résultat.</span></Card>}
      </div>
    </div>
  );
}

function Finance({ session, setSession, notify, go, initialAction }) {
  const [sub, setSub] = useState(initialAction || "cotisations");
  const [payStatus, setPayStatus] = useState("idle");
  const [methode, setMethode] = useState(null);
  const [surplusEnCours, setSurplusEnCours] = useState(null);
  const [syncingCotisations, setSyncingCotisations] = useState(false);
  const factureEnRetard = session.factures.find((f) => f.statut === "En retard");
  const suspendusImpaye = session.employes.filter((e) => e.motifSuspension === "Facture impayée");
  const surplus = session.surplus || [];
  const surplusAPayer = surplus.filter((s) => s.statut === "À payer");

  const synchroniserCotisations = async () => {
    setSyncingCotisations(true);
    const distant = await chargerCanalPartage(CLE_COTISATIONS_PARTAGEES);
    const lesNotres = distant.filter((c) => c.entreprise === session.entreprise.nom);
    if (lesNotres.length > 0) {
      const facturesMaj = session.factures.map((f) => {
        const maj = lesNotres.find((c) => c.mois === f.mois);
        return maj ? { ...f, statut: maj.statut, datePaiement: maj.statut === "Payée" ? (maj.datePaiement || f.datePaiement) : undefined } : f;
      });
      setSession((s) => ({ ...s, factures: facturesMaj }));
      notify("Statut des cotisations synchronisé avec l'assureur");
    }
    setSyncingCotisations(false);
  };
  React.useEffect(() => { synchroniserCotisations(); }, []);

  const payerFacture = () => {
    if (!factureEnRetard || !methode) return;
    setPayStatus("loading");
    setTimeout(() => {
      setSession({
        ...session,
        factures: session.factures.map((f) => (f.id === factureEnRetard.id ? { ...f, statut: "Payée", datePaiement: "07/07/2026" } : f)),
        employes: session.employes.map((e) => (e.motifSuspension === "Facture impayée" ? { ...e, statut: "Actif", motifSuspension: undefined } : e)),
        alertes: [{ id: Date.now(), type: "paiement", titre: "Facture réglée", detail: `${factureEnRetard.mois} — ${fmt(factureEnRetard.montant)} payés`, gravite: "info", actionGo: "finance", actionLabel: "Voir l'historique" }, ...session.alertes],
      });
      setPayStatus("done");
      notify(`Facture ${factureEnRetard.mois} réglée — QR codes réactivés`);
    }, 1300);
  };

  const payerSurplus = (id, mode) => {
    setSurplusEnCours(id);
    setTimeout(() => {
      const s = surplus.find((x) => x.id === id);
      setSession({
        ...session,
        surplus: surplus.map((x) => (x.id === id ? { ...x, statut: "Payé", methode: mode, datePaiement: "07/07/2026" } : x)),
        alertes: [{ id: Date.now(), type: "surplus", titre: "Surplus de dérogation réglé", detail: `${s.employeNom} — ${fmt(s.montant)}`, gravite: "info", actionGo: "finance", actionLabel: "Voir le détail" }, ...session.alertes],
      });
      setSurplusEnCours(null);
      notify(`Surplus de ${fmt(s.montant)} réglé pour ${s.employeNom}`);
    }, 1100);
  };

  const totalCotisationsAnnee = session.factures.filter((f) => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
  const totalSurplusPaye = surplus.filter((s) => s.statut === "Payé").reduce((s, x) => s + x.montant, 0);
  const totalSurplusDu = surplusAPayer.reduce((s, x) => s + x.montant, 0);
  const totalConsommation = session.employes.reduce((s, e) => s + e.consomme, 0) + session.employes.reduce((s, e) => s + (e.famille || []).reduce((s2, f) => s2 + (f.consomme || 0), 0), 0);
  const repartition = [
    { label: "Cotisations payées", montant: totalCotisationsAnnee, couleur: C.navy },
    { label: "Surplus dérogations payés", montant: totalSurplusPaye, couleur: C.gold },
    { label: "Surplus en attente", montant: totalSurplusDu, couleur: C.red },
  ];
  const maxRepartition = Math.max(...repartition.map((r) => r.montant), 1);

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Finance</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Vue 360° — cotisations, surplus & dépenses</div></div>
      </div>

      <div className="px-5 flex gap-2 mb-3 overflow-x-auto">
        {[["cotisations", "Cotisations"], ["surplus", "Surplus dérogations"], ["vue360", "Vue d'ensemble"]].map(([k, l]) => (
          <button key={k} onClick={() => setSub(k)} className="flex-shrink-0 rounded-full px-3 py-2" style={{ background: sub === k ? C.navy : "white", color: sub === k ? "white" : C.ink, border: `1px solid ${sub === k ? C.navy : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>
            {l}{k === "surplus" && surplusAPayer.length > 0 ? ` (${surplusAPayer.length})` : ""}
          </button>
        ))}
      </div>

      {sub === "cotisations" && (
        <div className="px-5">
          <button onClick={synchroniserCotisations} disabled={syncingCotisations} className="w-full rounded-xl py-2.5 mb-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
            {syncingCotisations ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncingCotisations ? "Synchronisation…" : "Synchroniser avec l'assureur"}
          </button>
          {factureEnRetard ? (
            <Card className="p-4 mb-3" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <div className="flex items-center gap-2 mb-2"><ShieldAlert size={16} color={C.red} /><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.red }}>Facture {factureEnRetard.mois} en retard</span></div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>Montant dû : <b>{fmt(factureEnRetard.montant)}</b> · Échéance dépassée le {factureEnRetard.dateEcheance}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.ink, marginTop: 4 }}>{suspendusImpaye.length > 0 ? `${suspendusImpaye.length} employé(s) déjà suspendu(s) automatiquement.` : "Les QR codes de tous les employés seront suspendus automatiquement si la facture reste impayée."}</div>
            </Card>
          ) : (
            <Card className="p-4 mb-3 flex items-center gap-2" style={{ background: C.greenSoft, border: "none" }}><CheckCircle2 size={16} color={C.green} /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>Toutes les cotisations sont à jour</span></Card>
          )}

          {suspendusImpaye.length > 0 && (
            <Card className="p-3 mb-3">
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Employés suspendus (impayé)</div>
              {suspendusImpaye.map((e) => <div key={e.id} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.nom}</span><Lock size={12} color={C.red} /></div>)}
            </Card>
          )}

          {factureEnRetard && payStatus !== "done" && (
            <Card className="p-4 mb-3">
              <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", marginBottom: 8 }}>Régulariser la cotisation</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[["mobile", "Mobile Money", Smartphone], ["carte", "Carte bancaire", CreditCard], ["virement", "Virement", Landmark]].map(([id, label, Icon]) => (
                  <button key={id} onClick={() => setMethode(id)}><Card className="p-3 flex flex-col items-center gap-1.5" style={{ border: methode === id ? `2px solid ${C.gold}` : `1px solid ${C.line}` }}><Icon size={18} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, color: C.ink, textAlign: "center" }}>{label}</span></Card></button>
                ))}
              </div>
              {payStatus === "idle" && <button onClick={payerFacture} disabled={!methode} className="w-full rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: methode ? C.gold : "#C9CDD6", color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}>Payer {fmt(factureEnRetard.montant)}</button>}
              {payStatus === "loading" && <div className="flex items-center justify-center gap-2 py-2"><Loader2 size={18} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Transaction en cours…</span></div>}
            </Card>
          )}
          {payStatus === "done" && (
            <Card className="p-4 mb-3 flex items-center gap-2" style={{ background: C.greenSoft, border: "none" }}><CheckCircle2 size={16} color={C.green} /><span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, fontWeight: 600 }}>Paiement confirmé — accès réactivés</span></Card>
          )}

          <SectionLabel>Historique des cotisations</SectionLabel>
          <div className="space-y-2">
            {session.factures.map((f) => (
              <Card key={f.id} className="p-3.5 flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 36, height: 36, background: C.ivory }}><Receipt size={16} color={C.navy2} /></div>
                <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{f.mois}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Échéance {f.dateEcheance}{f.datePaiement && ` · Payée le ${f.datePaiement}`}</div></div>
                <div className="text-right"><div style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, color: C.navy }}>{fmt(f.montant)}</div><StatusPill statut={f.statut} /></div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {sub === "surplus" && (
        <div className="px-5">
          <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
            <CircleDollarSign size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Chaque dérogation approuvée (dépassement de plafond ou PEC hors contrat) génère un surplus déjà comptabilisé, à régler séparément de la cotisation mensuelle.</span>
          </Card>
          {surplusAPayer.length > 0 && (
            <Card className="p-3 mb-3 flex items-center justify-between" style={{ background: C.amberSoft }}>
              <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{surplusAPayer.length} surplus en attente</span>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.red }}>{fmt(totalSurplusDu)}</span>
            </Card>
          )}
          <div className="space-y-2">
            {surplus.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun surplus de dérogation pour l'instant.</span></Card>}
            {surplus.map((s) => (
              <Card key={s.id} className="p-3.5">
                <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{s.employeNom}</span><StatusPill statut={s.statut === "Payé" ? "Payée" : "En attente"} /></div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 2 }}>{s.motif}</div>
                <div className="flex items-center justify-between mt-1.5"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{s.hopital} · {s.date}</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(s.montant)}</span></div>
                {s.statut === "À payer" && (
                  surplusEnCours === s.id ? (
                    <div className="flex items-center justify-center gap-2 py-2 mt-2"><Loader2 size={16} color={C.navy} className="animate-spin" /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Paiement en cours…</span></div>
                  ) : (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => payerSurplus(s.id, "Mobile Money")} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Smartphone size={12} /> Mobile Money</button>
                      <button onClick={() => payerSurplus(s.id, "Virement bancaire")} className="flex-1 rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 11, fontWeight: 700 }}><Landmark size={12} /> Banque</button>
                    </div>
                  )
                )}
                {s.statut === "Payé" && <div style={{ fontFamily: sans, fontSize: 10, color: C.green, marginTop: 4 }}>Réglé le {s.datePaiement} · {s.methode}</div>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {sub === "vue360" && (
        <div className="px-5">
          <Card className="p-5 mb-3" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
            <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Consommation totale (cotisation + surplus)</div>
            <div style={{ fontFamily: serif, fontSize: 24, color: "white", marginTop: 4 }}>{fmt(totalConsommation)}</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6" }}>Soins consommés par tous les employés et leurs ayants droit</div>
          </Card>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Card className="p-3.5"><Receipt size={16} color={C.navy2} /><div style={{ fontFamily: serif, fontSize: 17, color: C.navy, marginTop: 4 }}>{fmt(totalCotisationsAnnee)}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Cotisations payées</div></Card>
            <Card className="p-3.5"><CircleDollarSign size={16} color={C.amber} /><div style={{ fontFamily: serif, fontSize: 17, color: C.navy, marginTop: 4 }}>{fmt(totalSurplusDu)}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Surplus en attente</div></Card>
          </div>
          <SectionLabel>Répartition des dépenses</SectionLabel>
          <Card className="p-4 space-y-3">
            {repartition.map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.ink }}>{r.label}</span><span style={{ fontFamily: mono, fontSize: 11.5, fontWeight: 700, color: r.couleur }}>{fmt(r.montant)}</span></div>
                <div className="rounded-full overflow-hidden" style={{ height: 7, background: C.line }}><div style={{ width: `${(r.montant / maxRepartition) * 100}%`, height: "100%", background: r.couleur }} /></div>
              </div>
            ))}
          </Card>
          <SectionLabel>Statut de la flotte</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3.5 text-center"><div style={{ fontFamily: serif, fontSize: 20, color: C.green }}>{session.employes.filter((e) => e.statut === "Actif").length}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Employés actifs</div></Card>
            <Card className="p-3.5 text-center"><div style={{ fontFamily: serif, fontSize: 20, color: C.red }}>{session.employes.filter((e) => e.statut === "Suspendu").length}</div><div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>Employés suspendus</div></Card>
          </div>
        </div>
      )}
    </div>
  );
}


function Derogations({ session, setSession, notify, go, initialAction }) {
  const [filtre, setFiltre] = useState("En attente");
  const [detail, setDetail] = useState(initialAction || null);
  const [commentaire, setCommentaire] = useState("");
  const [syncing, setSyncing] = useState(false);

  const synchroniser = async () => {
    setSyncing(true);
    const partagees = await chargerDerogationsPartagees();
    const nouvelles = partagees
      .filter((p) => p.destinataire === "Entreprise (RH souscripteur)" && !session.derogations.some((d) => d.uid === p.uid))
      .map((p) => ({
        id: Date.now() + Math.random(), uid: p.uid, employeId: null, employeNom: p.patientNom, motif: p.motif,
        montantDemande: Math.round(p.montantDemande / 1000), plafondRestant: Math.round(p.plafondRestant / 1000),
        hopital: p.etablissement, date: p.dateEnvoi, statut: "En attente",
      }));
    if (nouvelles.length > 0) {
      setSession((s) => ({
        ...s,
        derogations: [...nouvelles, ...s.derogations],
        alertes: [{ id: Date.now(), type: "derogation", titre: `${nouvelles.length} nouvelle(s) dérogation(s) reçue(s)`, detail: nouvelles.map((n) => n.employeNom).join(", "), gravite: "warning", actionGo: "derogations" }, ...s.alertes],
      }));
      notify(`${nouvelles.length} dérogation(s) reçue(s) d'un prestataire`);
    } else {
      notify("Aucune nouvelle dérogation");
    }
    setSyncing(false);
  };

  const traiter = (id, statut) => {
    const d = session.derogations.find((x) => x.id === id);
    const surplusEntry = statut === "Approuvée" ? [{ id: Date.now(), derogationId: d.id, employeNom: d.employeNom, motif: d.motif, hopital: d.hopital, montant: d.montantDemande, date: "07/07/2026", statut: "À payer" }] : [];
    setSession({
      ...session,
      derogations: session.derogations.map((x) => (x.id === id ? { ...x, statut, traitePar: session.entreprise.contactRH, commentaire } : x)),
      employes: statut === "Approuvée" ? session.employes.map((e) => (e.id === d.employeId ? { ...e, plafondMensuel: e.plafondMensuel + d.montantDemande } : e)) : session.employes,
      surplus: [...surplusEntry, ...(session.surplus || [])],
      alertes: [
        ...(statut === "Approuvée" ? [{ id: Date.now() + 1, type: "surplus", titre: "Surplus de dérogation à régler", detail: `${d.employeNom} — ${fmt(d.montantDemande)} hors contrat`, gravite: "warning", actionGo: "finance", actionLabel: "Payer le surplus" }] : []),
        { id: Date.now(), type: "derogation", titre: `Dérogation ${statut.toLowerCase()}`, detail: `${d.employeNom} — ${fmt(d.montantDemande)}`, gravite: statut === "Approuvée" ? "info" : "warning", actionGo: "derogations", refId: d.id, actionLabel: "Voir la dérogation" },
        ...session.alertes,
      ],
    });
    if (d.uid) {
      (async () => {
        const partagees = await chargerDerogationsPartagees();
        const maj = partagees.map((p) => (p.uid === d.uid ? { ...p, statut, traitePar: session.entreprise.contactRH } : p));
        await sauvegarderDerogationsPartagees(maj);
      })();
    }
    notify(statut === "Approuvée" ? `PEC débloquée pour ${d.employeNom} — surplus de ${fmt(d.montantDemande)} comptabilisé` : `Dérogation refusée pour ${d.employeNom}`);
    setDetail(null); setCommentaire("");
  };

  React.useEffect(() => { synchroniser(); }, []);

  const liste = session.derogations.filter((d) => filtre === "Toutes" || d.statut === filtre);

  if (detail) {
    const d = session.derogations.find((x) => x.id === detail);
    if (!d) { setDetail(null); return null; }
    return (
      <div className="pb-6">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => setDetail(null)} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
          <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Demande de dérogation</div>
        </div>
        <div className="px-5">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2"><span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.ink }}>{d.employeNom}</span><StatusPill statut={d.statut} /></div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.ink, marginBottom: 8 }}>{d.motif}</div>
            <div className="flex items-center gap-2 mb-1"><Building2 size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{d.hopital}</span></div>
            <div className="flex items-center gap-2"><Calendar size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{d.date}</span></div>
          </Card>

          <SectionLabel>Contexte budgétaire</SectionLabel>
          <Card className="p-4">
            <div className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${C.line}` }}><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Montant du soin demandé</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.gold }}>{fmt(d.montantDemande)}</span></div>
            <div className="flex items-center justify-between py-1.5"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Plafond restant disponible</span><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: d.plafondRestant < d.montantDemande ? C.red : C.green }}>{fmt(d.plafondRestant)}</span></div>
            {d.plafondRestant < d.montantDemande && (
              <div className="flex items-center gap-1.5 mt-2"><AlertTriangle size={12} color={C.red} /><span style={{ fontFamily: sans, fontSize: 10.5, color: C.red }}>Dépassement de {fmt(d.montantDemande - d.plafondRestant)} — validation RH requise pour débloquer la PEC.</span></div>
            )}
          </Card>

          {d.statut === "En attente" ? (
            <>
              <Field label="Commentaire (optionnel)"><textarea style={{ ...inputStyle, minHeight: 70, resize: "none" }} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Motif de la décision…" /></Field>
              <div className="flex gap-2 mt-3">
                <button onClick={() => traiter(d.id, "Refusée")} className="flex-1 rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.red}`, color: C.red, fontFamily: sans, fontWeight: 700, fontSize: 13 }}><ThumbsDown size={14} /> Refuser</button>
                <button onClick={() => traiter(d.id, "Approuvée")} className="flex-1 rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: C.green, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}><ThumbsUp size={14} /> Approuver</button>
              </div>
            </>
          ) : (
            <Card className="p-3 flex items-center gap-2 mt-2" style={{ background: C.ivory, border: "none" }}>
              <UserCheck size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>Traitée par {d.traitePar}</span>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Dérogations</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Gestionnaire de dérogations — autorisations de dépassement</div></div>
      </div>
      <div className="px-5">
        <Card className="p-3 flex items-start gap-2 mb-3" style={{ background: C.ivory, border: "none" }}>
          <FileWarning size={14} color={C.navy2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Quand un employé dépasse son plafond mais a besoin de soins urgents, l'hôpital soumet une dérogation. Approuvez-la pour débloquer immédiatement la prise en charge.</span>
        </Card>
        <button onClick={synchroniser} disabled={syncing} className="w-full rounded-xl py-2.5 mb-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${C.navy}`, color: C.navy, fontFamily: sans, fontSize: 12, fontWeight: 700 }}>
          {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {syncing ? "Synchronisation…" : "Synchroniser avec les prestataires"}
        </button>
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
          {["En attente", "Approuvée", "Refusée", "Toutes"].map((f) => (
            <button key={f} onClick={() => setFiltre(f)} className="flex-shrink-0 rounded-full px-2.5 py-1.5" style={{ background: filtre === f ? C.navy : "white", color: filtre === f ? "white" : C.ink, border: `1px solid ${filtre === f ? C.navy : C.line}`, fontFamily: sans, fontSize: 11, fontWeight: 700 }}>{f}</button>
          ))}
        </div>
        <div className="space-y-2">
          {liste.map((d) => (
            <Card key={d.id} onClick={() => setDetail(d.id)} className="p-3.5 cursor-pointer">
              <div className="flex items-center justify-between"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{d.employeNom}</span><StatusPill statut={d.statut} /></div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 2 }}>{d.motif}</div>
              <div className="flex items-center justify-between mt-2"><span style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{d.hopital} · {d.date}</span><span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.gold }}>{fmt(d.montantDemande)}</span></div>
            </Card>
          ))}
          {liste.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucune dérogation pour ce filtre.</span></Card>}
        </div>
      </div>
    </div>
  );
}


function Employes({ session, setSession, notify, go, initialAction }) {
  const [query, setQuery] = useState("");
  const [filtreGrade, setFiltreGrade] = useState("Tous");
  const [addOpen, setAddOpen] = useState(initialAction === "add");
  const [selected, setSelected] = useState(null);
  const [nouv, setNouv] = useState({ nom: "", poste: "", grade: "agent", telephone: "", email: "", photo: "", dateEmbauche: "", naissance: "", sexe: "Masculin", ville: "Kinshasa", adresse: "", groupeSanguin: "", conditionsSante: [], famille: [] });
  const [addFamOpen, setAddFamOpen] = useState(false);
  const [nouvFam, setNouvFam] = useState({ nom: "", lien: "Conjoint", naissance: "", sexe: "Féminin", lieuNaissance: "", telephone: "", photo: "", groupeSanguin: "", conditionsSante: [] });

  const liste = session.employes.filter((e) => e.nom.toLowerCase().includes(query.toLowerCase()) && (filtreGrade === "Tous" || e.grade === filtreGrade));

  const ajouterEmploye = async () => {
    if (!nouv.nom || !nouv.poste || !nouv.photo) return;
    const g = gradeInfo(nouv.grade);
    const num = session.employes.length + 1;
    const employe = {
      id: Date.now(), matricule: `MC-${String(num).padStart(4, "0")}`, nom: nouv.nom, poste: nouv.poste, grade: nouv.grade,
      statut: "Actif", photo: nouv.photo, plafondMensuel: g.plafondMensuel, consomme: 0,
      telephone: nouv.telephone, email: nouv.email, dateEmbauche: nouv.dateEmbauche || "—",
      naissance: nouv.naissance, sexe: nouv.sexe, ville: nouv.ville, adresse: nouv.adresse, groupeSanguin: nouv.groupeSanguin, conditionsSante: nouv.conditionsSante,
      famille: nouv.famille,
    };
    setSession({ ...session, employes: [...session.employes, employe] });
    setNouv({ nom: "", poste: "", grade: "agent", telephone: "", email: "", photo: "", dateEmbauche: "", naissance: "", sexe: "Masculin", ville: "Kinshasa", adresse: "", groupeSanguin: "", conditionsSante: [], famille: [] });
    setAddOpen(false);
    const resultat = await synchroniserEffectifVersAssureur(session.entreprise.nom, employe, "ajouter");
    if (resultat?.synced) {
      setSession((s) => ({ ...s, employes: s.employes.map((e) => (e.id === employe.id ? { ...e, police: resultat.police } : e)) }));
    }
    notify(`${employe.nom} ajouté(e) — QR code généré${resultat?.synced ? `, police individuelle ${resultat.police} matérialisée et transmise à l'assureur` : ""}`);
  };

  const ajouterFamMembre = () => {
    if (!nouvFam.nom || !nouvFam.naissance || !nouvFam.photo) return;
    const gradePlafond = gradeInfo(nouv.grade).plafondMensuel;
    const plafond = Math.round(gradePlafond * (nouvFam.lien === "Conjoint" ? 0.7 : 0.4));
    setNouv({ ...nouv, famille: [...nouv.famille, { ...nouvFam, id: Date.now(), plafond, consomme: 0 }] });
    setNouvFam({ nom: "", lien: "Conjoint", naissance: "", sexe: "Féminin", lieuNaissance: "", telephone: "", photo: "", groupeSanguin: "", conditionsSante: [] });
    setAddFamOpen(false);
  };

  const supprimerEmploye = async (id) => {
    const employe = session.employes.find((e) => e.id === id);
    setSession({ ...session, employes: session.employes.filter((e) => e.id !== id) });
    setSelected(null);
    if (employe) await synchroniserEffectifVersAssureur(session.entreprise.nom, employe, "retirer");
    notify("Employé retiré de la police — QR code désactivé, synchronisé avec l'assureur");
  };
  const toggleStatut = (id) => {
    setSession({ ...session, employes: session.employes.map((e) => (e.id === id ? { ...e, statut: e.statut === "Actif" ? "Suspendu" : "Actif", motifSuspension: e.statut === "Actif" ? "Suspension manuelle" : undefined } : e)) });
    notify("Statut mis à jour");
  };

  /* ---- FICHE DÉTAIL EMPLOYÉ ---- */
  if (selected) {
    const e = session.employes.find((x) => x.id === selected);
    if (!e) { setSelected(null); return null; }
    const g = gradeInfo(e.grade);
    const pct = Math.round((e.consomme / (e.plafondReel ?? e.plafondMensuel)) * 100);
    return (
      <div className="pb-6">
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, border: `1px solid ${C.line}` }}><ArrowLeft size={15} color={C.ink} /></button>
          <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Fiche employé</div>
        </div>
        <div className="px-5">
          <Card className="p-4 flex items-center gap-3">
            <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 56, height: 56 }}><img src={e.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, color: C.ink }}>{e.nom}</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{e.poste}</div><div style={{ fontFamily: mono, fontSize: 10.5, color: C.sub }}>{e.matricule}</div></div>
            <StatusPill statut={e.statut} />
          </Card>

          <SectionLabel>Couverture (grade)</SectionLabel>
          <Card className="p-4 flex items-center gap-3">
            <div className="rounded-full" style={{ width: 10, height: 10, background: g.couleur }} />
            <div className="flex-1"><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{g.nom}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Taux {g.taux}% · Plafond {fmt(g.plafondMensuel)}/mois</div></div>
          </Card>

          <SectionLabel>{e.plafondReel != null ? "Consommation annuelle réelle" : "Consommation du mois"}</SectionLabel>
          <Card className="p-4 flex items-center gap-4">
            <Ring pct={pct} size={54} stroke={6} color={pct >= 90 ? C.red : pct >= 70 ? C.amber : C.gold} />
            <div className="flex-1"><div style={{ fontFamily: serif, fontSize: 18, color: C.navy }}>{fmt(e.consomme)}</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>sur {fmt(e.plafondReel ?? e.plafondMensuel)} de plafond {e.plafondReel != null ? "annuel (toutes garanties)" : "mensuel"}</div></div>
            <div style={{ fontFamily: mono, fontSize: 15, fontWeight: 800, color: pct >= 90 ? C.red : C.navy }}>{pct}%</div>
          </Card>
          {e.statut === "Suspendu" && e.motifSuspension && (
            <Card className="p-3 flex items-center gap-2 mt-2" style={{ background: C.redSoft, border: "none" }}><Ban size={13} color={C.red} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink }}>Motif de suspension : {e.motifSuspension}</span></Card>
          )}

          <SectionLabel>Coordonnées</SectionLabel>
          <Card className="p-4 space-y-1.5">
            <div className="flex items-center gap-2"><Phone size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.telephone || "—"}</span></div>
            <div className="flex items-center gap-2"><Mail size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.email || "—"}</span></div>
            <div className="flex items-center gap-2"><Calendar size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>Embauché le {e.dateEmbauche}</span></div>
            <div className="flex items-center gap-2"><MapPin size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.adresse ? `${e.adresse}, ` : ""}{e.ville || "—"}</span></div>
            <div className="flex items-center gap-2"><Users size={13} color={C.navy2} /><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{e.naissance ? `Né(e) le ${e.naissance}` : "Date de naissance —"}{e.sexe && ` · ${e.sexe}`}{e.groupeSanguin && ` · ${e.groupeSanguin}`}</span></div>
          </Card>

          <SectionLabel>Ayants droit ({e.famille?.length || 0})</SectionLabel>
          {e.famille?.length > 0 ? (
            <div className="space-y-2">
              {e.famille.map((f, i) => {
                const fpct = f.plafond ? Math.round((f.consomme / f.plafond) * 100) : 0;
                return (
                  <Card key={i} className="p-3 flex items-center gap-3">
                    <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 34, height: 34, background: C.ivory }}>{f.photo ? <img src={f.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="flex items-center justify-center h-full"><Users size={14} color={C.navy2} /></div>}</div>
                    <div className="flex-1">
                      <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.ink }}>{f.nom}</div>
                      <div style={{ fontFamily: sans, fontSize: 10, color: C.sub }}>{f.lien}{f.naissance && ` · ${f.naissance}`}{f.groupeSanguin && ` · ${f.groupeSanguin}`}</div>
                      {f.telephone && <div style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>{f.telephone}</div>}
                    </div>
                    <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, color: fpct >= 90 ? C.red : C.navy }}>{fpct}%</span>
                  </Card>
                );
              })}
            </div>
          ) : <Card className="p-4"><span style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Aucun ayant droit déclaré.</span></Card>}

          <div className="flex gap-2 mt-4">
            <button onClick={() => toggleStatut(e.id)} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ border: `1px solid ${e.statut === "Actif" ? C.red : C.green}`, color: e.statut === "Actif" ? C.red : C.green, fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}>
              {e.statut === "Actif" ? <Ban size={14} /> : <UserCheck size={14} />} {e.statut === "Actif" ? "Suspendre" : "Réactiver"}
            </button>
            <button onClick={() => supprimerEmploye(e.id)} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: C.red, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserMinus size={14} /> Retirer</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- LISTE / AJOUT ---- */
  return (
    <div className="pb-6">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => go("dashboard")} className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 32, height: 32, border: `1px solid ${C.line}` }}><ArrowLeft size={14} color={C.ink} /></button>
        <div><div style={{ fontFamily: serif, fontSize: 19, color: C.navy, fontWeight: 700 }}>Employés</div><div style={{ fontFamily: sans, fontSize: 11, color: C.sub }}>Console d'affiliation — {session.employes.length} employé(s) sur la police</div></div>
      </div>

      {!addOpen && (
        <div className="px-5">
          <div className="relative mb-2">
            <Search size={14} color={C.sub} style={{ position: "absolute", left: 10, top: 12 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un employé…" style={{ ...inputStyle, paddingLeft: 30 }} />
          </div>
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
            <Filter size={12} color={C.sub} style={{ flexShrink: 0 }} />
            {["Tous", ...GRADES_DEFAUT.map((g) => g.id)].map((gid) => (
              <button key={gid} onClick={() => setFiltreGrade(gid)} className="flex-shrink-0 rounded-full px-2.5 py-1" style={{ background: filtreGrade === gid ? C.navy : "white", color: filtreGrade === gid ? "white" : C.ink, border: `1px solid ${filtreGrade === gid ? C.navy : C.line}`, fontFamily: sans, fontSize: 10.5, fontWeight: 700 }}>
                {gid === "Tous" ? "Tous" : gradeInfo(gid).nom.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {liste.map((e) => {
              const g = gradeInfo(e.grade);
              const pct = Math.round((e.consomme / (e.plafondReel ?? e.plafondMensuel)) * 100);
              return (
                <Card key={e.id} onClick={() => setSelected(e.id)} className="p-3.5 flex items-center gap-3 cursor-pointer">
                  <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 42, height: 42, opacity: e.statut === "Suspendu" ? 0.5 : 1 }}><img src={e.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5"><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{e.nom}</span></div>
                    <div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>{e.poste} · <span style={{ color: g.couleur, fontWeight: 700 }}>{g.nom.split(" ")[0]}</span></div>
                    <div className="flex items-center gap-1 mt-0.5"><Users size={10} color={C.sub} /><span style={{ fontFamily: sans, fontSize: 9.5, color: C.sub }}>{e.famille?.length || 0} ayant(s) droit</span></div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusPill statut={e.statut} />
                    <span style={{ fontFamily: mono, fontSize: 10, color: pct >= 90 ? C.red : C.sub }}>{pct}% conso.</span>
                  </div>
                </Card>
              );
            })}
            {liste.length === 0 && <Card className="p-5 text-center"><span style={{ fontFamily: sans, fontSize: 12, color: C.sub }}>Aucun employé trouvé.</span></Card>}
          </div>
          <button onClick={() => setAddOpen(true)} className="w-full rounded-xl py-3.5 mt-4 flex items-center justify-center gap-2" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 13.5 }}><UserPlus size={16} /> Ajouter un employé</button>
        </div>
      )}

      {addOpen && (
        <div className="px-5">
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer flex-shrink-0">
                <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 54, height: 54, background: C.ivory, border: `1.5px dashed ${nouv.photo ? C.green : C.red}` }}>
                  {nouv.photo ? <img src={nouv.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={19} color={C.navy2} />}
                </div>
                <input type="file" accept="image/*" capture="user" hidden onChange={(ev) => { const f = ev.target.files?.[0]; if (f) setNouv({ ...nouv, photo: URL.createObjectURL(f) }); }} />
              </label>
              <span style={{ fontFamily: sans, fontSize: 10.5, color: nouv.photo ? C.sub : C.red }}>Photo obligatoire (reconnaissance faciale à l'hôpital)</span>
            </div>
            <Field label="Nom complet"><input style={inputStyle} value={nouv.nom} onChange={(e) => setNouv({ ...nouv, nom: e.target.value })} placeholder="Nom et prénom" /></Field>
            <Field label="Poste"><input style={inputStyle} value={nouv.poste} onChange={(e) => setNouv({ ...nouv, poste: e.target.value })} placeholder="Ingénieur, Comptable…" /></Field>
            <Field label="Grade (détermine la couverture)">
              <select style={inputStyle} value={nouv.grade} onChange={(e) => setNouv({ ...nouv, grade: e.target.value })}>
                {session.grades.map((g) => <option key={g.id} value={g.id}>{g.nom} — {g.taux}% · {fmt(g.plafondMensuel)}/mois</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone"><input style={inputStyle} value={nouv.telephone} onChange={(e) => setNouv({ ...nouv, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
              <Field label="Date d'embauche"><input type="date" style={inputStyle} value={nouv.dateEmbauche} onChange={(e) => setNouv({ ...nouv, dateEmbauche: e.target.value })} /></Field>
            </div>
            <Field label="Email"><input style={inputStyle} type="email" value={nouv.email} onChange={(e) => setNouv({ ...nouv, email: e.target.value })} placeholder="nom@entreprise.cd" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date de naissance"><input type="date" style={inputStyle} value={nouv.naissance} onChange={(e) => setNouv({ ...nouv, naissance: e.target.value })} /></Field>
              <Field label="Sexe"><select style={inputStyle} value={nouv.sexe} onChange={(e) => setNouv({ ...nouv, sexe: e.target.value })}><option>Masculin</option><option>Féminin</option></select></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ville"><select style={inputStyle} value={nouv.ville} onChange={(e) => setNouv({ ...nouv, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
              <Field label="Groupe sanguin"><select style={inputStyle} value={nouv.groupeSanguin} onChange={(e) => setNouv({ ...nouv, groupeSanguin: e.target.value })}><option value="">Inconnu</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select></Field>
            </div>
            <Field label="Adresse"><input style={inputStyle} value={nouv.adresse} onChange={(e) => setNouv({ ...nouv, adresse: e.target.value })} placeholder="Avenue, commune…" /></Field>

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
              {nouv.conditionsSante.length > 0 && <div style={{ fontFamily: sans, fontSize: 10, color: C.sub, marginTop: 4 }}>Transmis à l'assureur pour ajuster, si nécessaire, la prime individuelle de cet employé.</div>}
            </div>

            <div style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, color: C.navy, marginTop: 4 }}>Ayants droit (optionnel)</div>
            {nouv.famille.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1"><span style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{f.nom} ({f.lien})</span><button onClick={() => setNouv({ ...nouv, famille: nouv.famille.filter((_, j) => j !== i) })}><Trash2 size={13} color={C.red} /></button></div>
            ))}
            {!addFamOpen ? (
              <button onClick={() => setAddFamOpen(true)} className="w-full rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy2 }}><Plus size={13} /> Ajouter un ayant droit</button>
            ) : (
              <Card className="p-3 space-y-2" style={{ background: C.ivory, border: "none" }}>
                <div className="flex items-center gap-2">
                  <label className="relative cursor-pointer flex-shrink-0">
                    <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: 40, height: 40, background: "white", border: `1.5px dashed ${nouvFam.photo ? C.green : C.red}` }}>
                      {nouvFam.photo ? <img src={nouvFam.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Camera size={15} color={C.navy2} />}
                    </div>
                    <input type="file" accept="image/*" capture="user" hidden onChange={(ev) => { const f = ev.target.files?.[0]; if (f) setNouvFam({ ...nouvFam, photo: URL.createObjectURL(f) }); }} />
                  </label>
                  <span style={{ fontFamily: sans, fontSize: 10, color: nouvFam.photo ? C.sub : C.red }}>Photo obligatoire</span>
                </div>
                <select style={inputStyle} value={nouvFam.lien} onChange={(e) => setNouvFam({ ...nouvFam, lien: e.target.value })}><option>Conjoint</option><option>Enfant</option><option>Autre</option></select>
                <input style={inputStyle} placeholder="Nom complet" value={nouvFam.nom} onChange={(e) => setNouvFam({ ...nouvFam, nom: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input style={inputStyle} type="date" value={nouvFam.naissance} onChange={(e) => setNouvFam({ ...nouvFam, naissance: e.target.value })} />
                  <select style={inputStyle} value={nouvFam.sexe} onChange={(e) => setNouvFam({ ...nouvFam, sexe: e.target.value })}><option>Féminin</option><option>Masculin</option></select>
                </div>
                <input style={inputStyle} placeholder="Lieu de naissance" value={nouvFam.lieuNaissance} onChange={(e) => setNouvFam({ ...nouvFam, lieuNaissance: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input style={inputStyle} placeholder="Téléphone (son accès)" value={nouvFam.telephone} onChange={(e) => setNouvFam({ ...nouvFam, telephone: e.target.value })} />
                  <select style={inputStyle} value={nouvFam.groupeSanguin} onChange={(e) => setNouvFam({ ...nouvFam, groupeSanguin: e.target.value })}><option value="">Groupe sanguin</option><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select>
                </div>
                <div style={{ fontFamily: sans, fontSize: 9.5, fontWeight: 700, color: C.sub, textTransform: "uppercase" }}>Conditions médicales connues (optionnel)</div>
                <div className="grid grid-cols-2 gap-1">
                  {CONDITIONS_SANTE.map((c) => (
                    <label key={c.id} className="flex items-center gap-1 rounded-lg px-1.5 py-1" style={{ background: nouvFam.conditionsSante.includes(c.id) ? "#FBEAE8" : C.ivory }}>
                      <input type="checkbox" checked={nouvFam.conditionsSante.includes(c.id)} onChange={(e) => setNouvFam({ ...nouvFam, conditionsSante: e.target.checked ? [...nouvFam.conditionsSante, c.id] : nouvFam.conditionsSante.filter((id) => id !== c.id) })} />
                      <span style={{ fontFamily: sans, fontSize: 9.5, color: C.ink }}>{c.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2"><button onClick={() => setAddFamOpen(false)} className="flex-1 rounded-lg py-2" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 11.5 }}>Annuler</button><button onClick={ajouterFamMembre} disabled={!nouvFam.nom || !nouvFam.naissance || !nouvFam.photo} className="flex-1 rounded-lg py-2" style={{ background: (!nouvFam.nom || !nouvFam.naissance || !nouvFam.photo) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontSize: 11.5, fontWeight: 700 }}>Ajouter</button></div>
              </Card>
            )}

            <div className="flex gap-2 pt-2">
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-xl py-3" style={{ border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 12.5, color: C.ink }}>Annuler</button>
              <button onClick={ajouterEmploye} disabled={!nouv.nom || !nouv.poste || !nouv.photo} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2" style={{ background: (!nouv.nom || !nouv.poste || !nouv.photo) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 12.5 }}><UserPlus size={14} /> Créer sa police</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


function Dashboard({ session, setSession, notify, go }) {
  const { employes, derogations, factures, entreprise } = session;
  const actifs = employes.filter((e) => e.statut === "Actif").length;
  const suspendus = employes.filter((e) => e.statut === "Suspendu").length;
  const totalFamille = employes.reduce((s, e) => s + (e.famille?.length || 0), 0);
  const consoTotal = employes.reduce((s, e) => s + e.consomme, 0);
  const plafondTotal = employes.reduce((s, e) => s + (e.plafondReel ?? e.plafondMensuel), 0);
  const pctGlobal = plafondTotal ? Math.round((consoTotal / plafondTotal) * 100) : 0;
  const derogEnAttente = derogations.filter((d) => d.statut === "En attente").length;
  const factureEnRetard = factures.find((f) => f.statut === "En retard");
  const alertesPlafond = employes.filter((e) => e.statut === "Actif" && e.consomme / (e.plafondReel ?? e.plafondMensuel) >= 0.9);
  const surplusDu = (session.surplus || []).filter((s) => s.statut === "À payer");
  const [messagePrevention, setMessagePrevention] = useState(null);

  React.useEffect(() => {
    if (!session.compteReel) return;
    (async () => {
      const comptes = await chargerCanalPartage(CLE_COMPTES_PARTAGES);
      const compte = comptes.find((c) => c.donnees?.contrat === session.entreprise.contrat);
      if (compte?.donnees?.statutContrat && compte.donnees.statutContrat !== session.entreprise.statutContrat) {
        setSession((s) => ({ ...s, entreprise: { ...s.entreprise, statutContrat: compte.donnees.statutContrat, resiliation: compte.donnees.resiliation || s.entreprise.resiliation } }));
      }
      // Réconcilie la vraie consommation ET le vrai plafond annuel (par garantie, cumulé) de chaque employé
      // (et de sa famille) depuis les PEC réellement soumises par les prestataires — sans ça, les chiffres
      // affichés ici restent figés à leur valeur de création, sans rapport avec la réalité du contrat signé.
      setSession((s) => ({
        ...s,
        employes: s.employes.map((e) => {
          if (!e.police) return e;
          const compteEmp = comptes.find((c) => c.donnees?.police === e.police);
          const garanties = compteEmp?.donnees?.garantiesConsommation || [];
          const consommeReel = garanties.reduce((tot, g) => tot + (Number(g.consomme) || 0), 0);
          const plafondReel = garanties.every((g) => g.plafond != null) && garanties.length ? garanties.reduce((tot, g) => tot + (Number(g.plafond) || 0), 0) : null;
          const familleMaj = (e.famille || []).map((f) => {
            const compteAyant = comptes.find((c) => c.donnees?.rattacheA === e.police && c.nom === f.nom);
            if (!compteAyant) return f;
            const garantiesAyant = compteAyant.donnees?.garantiesConsommation || [];
            const consommeAyant = garantiesAyant.reduce((tot, g) => tot + (Number(g.consomme) || 0), 0);
            return consommeAyant !== f.consomme ? { ...f, consomme: consommeAyant } : f;
          });
          return compteEmp ? { ...e, consomme: consommeReel, plafondReel: plafondReel ?? e.plafondReel, famille: familleMaj } : { ...e, famille: familleMaj };
        }),
      }));
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const messages = await chargerCanalPartage(CLE_MESSAGES_PREVENTION);
      const pertinent = messages.find((m) => m.audience?.toLowerCase().includes("chefs de famille") || m.audience?.toLowerCase().includes("tout le réseau") || !m.ville || m.ville === "Toutes");
      setMessagePrevention(pertinent || null);
    })();
  }, []);

  const repartitionGrade = session.grades.map((g) => ({ grade: g.nom.split(" ")[0], effectif: employes.filter((e) => e.grade === g.id).length, couleur: g.couleur }));

  return (
    <div className="pb-6">
      <div className="px-5 pt-2 pb-4">
        <div style={{ fontFamily: sans, fontSize: 13, color: C.sub }}>Espace entreprise</div>
        <div style={{ fontFamily: serif, fontSize: 21, color: C.navy, fontWeight: 700 }}>{entreprise.nom}</div>
        {session.compteReel && <div className="flex items-center gap-1 mt-0.5"><ShieldCheck size={11} color={C.green} /><span style={{ fontFamily: sans, fontSize: 9.5, color: C.green, fontWeight: 700 }}>Connecté avec vos identifiants — {session.roleConnexion}</span></div>}
      </div>

      {entreprise.statutContrat === "Résilié" && (
        <div className="px-5 mb-3">
          <Card className="p-4 flex items-start gap-2.5" style={{ background: C.redSoft, border: "none" }}>
            <XCircle size={17} color={C.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.red }}>Contrat résilié</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 2 }}>
                {entreprise.resiliation ? `Motif : ${entreprise.resiliation.motif} · Effet au ${entreprise.resiliation.dateEffet}.` : "Ce contrat n'est plus actif."} Contactez votre gestionnaire via la messagerie pour toute question.
              </div>
            </div>
          </Card>
        </div>
      )}

      {messagePrevention && (
        <div className="px-5 mb-3">
          <Card className="p-3.5 flex items-start gap-2.5" style={{ background: C.amberSoft, border: "none" }}>
            <HeartPulse size={16} color={C.navy} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontFamily: sans, fontSize: 11.5, fontWeight: 700, color: C.navy }}>{messagePrevention.type || "Conseil santé"} — diffusé par NeoGTec HealthCare</div><div style={{ fontFamily: sans, fontSize: 11.5, color: C.ink, marginTop: 2 }}>{messagePrevention.contenu}</div></div>
          </Card>
        </div>
      )}

      {(factureEnRetard || derogEnAttente > 0 || alertesPlafond.length > 0 || surplusDu.length > 0) && (
        <div className="px-5 mb-3 space-y-2">
          {factureEnRetard && (
            <Card onClick={() => go("finance", "cotisations")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.redSoft, border: `1px solid ${C.red}` }}>
              <ShieldAlert size={15} color={C.red} />
              <span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}><b>Facture {factureEnRetard.mois} en retard</b> — les QR codes de vos employés seront suspendus si non régularisée</span>
              <ChevronRight size={14} color={C.red} />
            </Card>
          )}
          {surplusDu.length > 0 && (
            <Card onClick={() => go("finance", "surplus")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.amberSoft }}>
              <CircleDollarSign size={15} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}>{surplusDu.length} surplus de dérogation à régler — {fmt(surplusDu.reduce((s, x) => s + x.montant, 0))}</span><ChevronRight size={14} color={C.amber} />
            </Card>
          )}
          {derogEnAttente > 0 && (
            <Card onClick={() => go("derogations", derogations.find((d) => d.statut === "En attente")?.id)} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.amberSoft }}>
              <FileText size={15} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}>{derogEnAttente} dérogation(s) en attente de validation</span><ChevronRight size={14} color={C.amber} />
            </Card>
          )}
          {alertesPlafond.map((e) => (
            <Card key={e.id} onClick={() => go("employes")} className="p-3 flex items-center gap-2 cursor-pointer" style={{ background: C.amberSoft }}>
              <AlertTriangle size={14} color={C.amber} /><span style={{ fontFamily: sans, fontSize: 11, color: C.ink, flex: 1 }}>{e.nom} a atteint {Math.round((e.consomme / (e.plafondReel ?? e.plafondMensuel)) * 100)}% de son plafond {e.plafondReel != null ? "annuel" : "mensuel"}</span>
            </Card>
          ))}
        </div>
      )}

      <div className="px-5 grid grid-cols-2 gap-3">
        <Card className="p-4"><Users size={18} color={C.navy2} /><div style={{ fontFamily: serif, fontSize: 22, color: C.navy, marginTop: 6 }}>{employes.length}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Employés assurés</div></Card>
        <Card className="p-4"><ShieldCheck size={18} color={C.green} /><div style={{ fontFamily: serif, fontSize: 22, color: C.navy, marginTop: 6 }}>{totalFamille}</div><div style={{ fontFamily: sans, fontSize: 10.5, color: C.sub }}>Ayants droit couverts</div></Card>
      </div>

      <div className="px-5 mt-3">
        <Card className="p-5" style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navy2})`, border: "none" }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#B9C3D6", textTransform: "uppercase", letterSpacing: 1 }}>Consommation globale du mois</div>
              <div style={{ fontFamily: serif, fontSize: 24, color: "white", marginTop: 4 }}>{fmt(consoTotal)}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: "#B9C3D6" }}>sur {fmt(plafondTotal)} de plafond cumulé</div>
            </div>
            <div className="relative flex items-center justify-center"><Ring pct={pctGlobal} size={58} stroke={6} color={pctGlobal > 85 ? C.red : C.gold} /><span className="absolute" style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: "white" }}>{pctGlobal}%</span></div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-1.5"><div className="rounded-full" style={{ width: 8, height: 8, background: C.green }} /><span style={{ fontFamily: sans, fontSize: 11, color: "white" }}>{actifs} actifs</span></div>
            <div className="flex items-center gap-1.5"><div className="rounded-full" style={{ width: 8, height: 8, background: C.red }} /><span style={{ fontFamily: sans, fontSize: 11, color: "white" }}>{suspendus} suspendus</span></div>
          </div>
        </Card>
      </div>

      <SectionLabel>Évolution de la consommation (6 derniers mois)</SectionLabel>
      <div className="px-5">
        <Card className="p-4">
          <div style={{ width: "100%", height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONSO_MENSUELLE} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="entConsoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.5} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: C.sub, fontFamily: sans }} axisLine={false} tickLine={false} width={30} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontFamily: sans, fontSize: 11, borderRadius: 8, border: `1px solid ${C.line}` }} />
                <Area type="monotone" dataKey="montant" stroke={C.gold} strokeWidth={2} fill="url(#entConsoGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <SectionLabel>Répartition des effectifs par grade</SectionLabel>
      <div className="px-5 space-y-2">
        {repartitionGrade.map((g, i) => (
          <Card key={i} className="p-3 flex items-center gap-3">
            <div className="rounded-full" style={{ width: 10, height: 10, background: g.couleur }} />
            <span style={{ fontFamily: sans, fontSize: 12, color: C.ink, flex: 1 }}>{g.grade}</span>
            <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.navy }}>{g.effectif}</span>
          </Card>
        ))}
      </div>

      <div className="px-5 mt-2">
        <button onClick={() => go("contrat")} className="w-full text-center py-2 flex items-center justify-center gap-1.5" style={{ fontFamily: sans, fontSize: 12, color: C.navy2, fontWeight: 700 }}>Voir consommation police (avec ayants droit) <ChevronRight size={14} /></button>
      </div>

      <SectionLabel>Actions rapides</SectionLabel>
      <div className="px-5 grid grid-cols-2 gap-3">
        <button onClick={() => go("employes", "add")} className="text-left"><Card className="p-4" style={{ background: "#EAF2EC", border: "none" }}><UserPlus size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Ajouter un employé</div></Card></button>
        <button onClick={() => go("derogations")} className="text-left"><Card className="p-4" style={{ background: "#FBEAE8", border: "none" }}><FileText size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Voir les dérogations</div></Card></button>
        <button onClick={() => go("finance")} className="text-left"><Card className="p-4" style={{ background: "#EEF1F8", border: "none" }}><Wallet size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Finance & paiements</div></Card></button>
        <button onClick={() => go("plus")} className="text-left"><Card className="p-4" style={{ background: "#F2EDF6", border: "none" }}><Award size={19} color={C.navy2} /><div style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 600, color: C.ink, marginTop: 8 }}>Grades & couvertures</div></Card></button>
      </div>
    </div>
  );
}


function OnboardingEntreprise({ onFinish, onCancel }) {
  const [step, setStep] = useState(0);
  const [infos, setInfos] = useState({ nom: "", secteur: "", rccm: "", adresse: "", ville: "Kinshasa", contactRH: "", telephone: "", email: "", nbEmployesEstime: "", formule: "Confort", dateDebut: "" });
  const [grades, setGrades] = useState(GRADES_DEFAUT.map((g) => ({ ...g })));
  const [creating, setCreating] = useState(false);
  const titles = ["Entreprise", "Grades & couvertures", "Confirmation"];

  const updateGrade = (id, field, val) => setGrades(grades.map((g) => (g.id === id ? { ...g, [field]: Number(val) || 0 } : g)));

  const activer = () => {
    setCreating(true);
    setTimeout(() => {
      onFinish({
        entreprise: { ...infos, contrat: `CTR-ENT-2026-${Math.floor(100000 + Math.random() * 900000)}`, formule: `${infos.formule} Entreprise`, validite: `${infos.dateDebut || "01/01/2026"} — 31/12/2026` },
        grades,
        cascade: CASCADE_DEFAUT.map((c) => ({ ...c })),
        employes: [],
        derogations: [],
        factures: [],
        surplus: [],
        alertes: [{ id: 1, type: "info", titre: "Bienvenue chez NeoGTec HealthCare Entreprise", detail: "Ajoutez vos premiers employés pour commencer", gravite: "info" }],
      });
    }, 1200);
  };

  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
        <div style={{ fontFamily: serif, fontSize: 18, color: C.navy, fontWeight: 700 }}>Créer mon espace</div>
        <button onClick={onCancel} style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>Annuler</button>
      </div>
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center gap-1.5">{titles.map((t, i) => <div key={i} className="flex-1 rounded-full" style={{ height: 4, background: i <= step ? C.gold : C.line }} />)}</div>
        <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, marginTop: 6 }}>Étape {step + 1} / {titles.length} — {titles[step]}</div>
      </div>

      {step === 0 && (
        <>
          <div className="px-5 space-y-3">
            <Field label="Raison sociale"><input style={inputStyle} value={infos.nom} onChange={(e) => setInfos({ ...infos, nom: e.target.value })} placeholder="MININGCO SARL" /></Field>
            <Field label="Secteur d'activité"><input style={inputStyle} value={infos.secteur} onChange={(e) => setInfos({ ...infos, secteur: e.target.value })} placeholder="Mines et industries extractives" /></Field>
            <Field label="RCCM"><input style={inputStyle} value={infos.rccm} onChange={(e) => setInfos({ ...infos, rccm: e.target.value })} placeholder="CD/KIN/RCCM/..." /></Field>
            <Field label="Adresse du siège"><input style={inputStyle} value={infos.adresse} onChange={(e) => setInfos({ ...infos, adresse: e.target.value })} placeholder="Boulevard Lumumba, Kinshasa" /></Field>
            <Field label="Ville"><select style={inputStyle} value={infos.ville} onChange={(e) => setInfos({ ...infos, ville: e.target.value })}><option>Kinshasa</option><option>Lubumbashi</option><option>Goma</option></select></Field>
            <Field label="Responsable RH"><input style={inputStyle} value={infos.contactRH} onChange={(e) => setInfos({ ...infos, contactRH: e.target.value })} placeholder="Nom du contact RH" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Téléphone"><input style={inputStyle} value={infos.telephone} onChange={(e) => setInfos({ ...infos, telephone: e.target.value })} placeholder="+243 8X XXX XXXX" /></Field>
              <Field label="Email"><input style={inputStyle} type="email" value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })} placeholder="rh@entreprise.cd" /></Field>
            </div>
            <Field label="Nombre d'employés estimé"><input style={inputStyle} value={infos.nbEmployesEstime} onChange={(e) => setInfos({ ...infos, nbEmployesEstime: e.target.value.replace(/\D/g, "") })} placeholder="Ex : 50" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Formule souhaitée"><select style={inputStyle} value={infos.formule} onChange={(e) => setInfos({ ...infos, formule: e.target.value })}><option>Essentiel</option><option>Confort</option><option>Premium</option></select></Field>
              <Field label="Date de début souhaitée"><input type="date" style={inputStyle} value={infos.dateDebut} onChange={(e) => setInfos({ ...infos, dateDebut: e.target.value })} /></Field>
            </div>
          </div>
          <div className="px-5 mt-3">
            <button onClick={() => setStep(1)} disabled={!infos.nom || !infos.contactRH} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: (!infos.nom || !infos.contactRH) ? "#C9CDD6" : C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>Continuer <ChevronRight size={15} /></button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="px-5">
            <div style={{ fontFamily: sans, fontSize: 12, color: C.sub, marginBottom: 10 }}>Définissez le taux de prise en charge et le plafond mensuel par grade. Vous pourrez les modifier à tout moment.</div>
            <div className="space-y-2">
              {grades.map((g) => (
                <Card key={g.id} className="p-3.5">
                  <div className="flex items-center gap-2 mb-2"><div className="rounded-full" style={{ width: 10, height: 10, background: g.couleur }} /><span style={{ fontFamily: sans, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{g.nom}</span></div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Taux (%)"><input style={inputStyle} value={g.taux} onChange={(e) => updateGrade(g.id, "taux", e.target.value)} /></Field>
                    <Field label="Plafond mensuel ($)"><input style={inputStyle} value={g.plafondMensuel} onChange={(e) => updateGrade(g.id, "plafondMensuel", e.target.value)} /></Field>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="px-5 flex gap-3 mt-3">
            <button onClick={() => setStep(0)} className="flex items-center justify-center rounded-xl" style={{ width: 46, height: 46, border: `1px solid ${C.line}`, background: "white" }}><ArrowLeft size={17} color={C.ink} /></button>
            <button onClick={() => setStep(2)} className="flex-1 rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>Continuer <ChevronRight size={15} /></button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="px-5">
            <Card className="p-4 mb-3">
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Récapitulatif</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.ink }}>{infos.nom} · {infos.secteur || "—"}</div>
              <div style={{ fontFamily: sans, fontSize: 11.5, color: C.sub }}>{grades.length} grades configurés · Formule Confort Entreprise</div>
            </Card>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.sub, textAlign: "center" }}>Vous pourrez ajouter vos employés juste après l'activation.</div>
          </div>
          <div className="px-5 mt-3">
            <button onClick={activer} disabled={creating} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2" style={{ background: C.navy, color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13.5 }}>
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={15} color={C.gold} />} {creating ? "Activation…" : "Activer mon espace entreprise"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}


function Welcome({ onCreer, onDemo, onAccederExistant, hasSession }) {
  return (
    <div className="h-full flex flex-col items-center justify-between px-6 pt-16 pb-8" style={{ background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navy2} 55%, #0F1C33 100%)` }}>
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center rounded-2xl" style={{ width: 72, height: 72, background: "rgba(198,153,46,0.15)", border: `1px solid ${C.gold}` }}><Building2 size={34} color={C.gold} /></div>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 15, color: "white", letterSpacing: 1, marginTop: 18 }}>NEOGTEC HEALTHCARE</div>
        <div style={{ fontFamily: serif, fontSize: 22, color: "white", marginTop: 10, lineHeight: 1.3 }}>Espace Entreprise</div>
        <div style={{ fontFamily: sans, fontSize: 12.5, color: "#B9C3D6", marginTop: 10, maxWidth: 280 }}>Gérez la couverture santé de vos employés : ajout, suspension, plafonds par grade, dérogations et facturation — le tout à distance.</div>
      </div>
      <div className="w-full space-y-3">
        {hasSession && (
          <button onClick={onAccederExistant} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}><LayoutDashboard size={16} /> Accéder à mon espace</button>
        )}
        <button onClick={onCreer} className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform" style={hasSession ? { border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 } : { background: C.gold, color: C.navy, fontFamily: sans, fontWeight: 800, fontSize: 14 }}><Building2 size={16} /> Créer un nouvel espace entreprise</button>
        <button onClick={onDemo} className="w-full rounded-xl py-3.5" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white", fontFamily: sans, fontWeight: 700, fontSize: 13 }}>Voir la démo (MININGCO SARL)</button>
      </div>
    </div>
  );
}


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


/* =================================================================
   APP SHELL
================================================================= */
export default function App() {
  const [view, setView] = useState("signup"); // signup | signin | welcome | onboarding | app
  const [signupData, setSignupData] = useState(null);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [tabAction, setTabAction] = useState(null);
  const [toast, setToast] = useState(null);
  const notify = (m) => setToast(m);

  const startApp = (s) => { setSession(s); setView("app"); setTab("dashboard"); notify("Espace entreprise activé"); };
  const startDemo = () => startApp({
    entreprise: COMPANY_DEMO, grades: GRADES_DEFAUT.map((g) => ({ ...g })), cascade: CASCADE_DEFAUT.map((c) => ({ ...c })), employes: buildEmployes(), derogations: buildDerogations(), factures: buildFactures(), surplus: buildSurplus(), alertes: [
      { id: 1, type: "paiement", titre: "Facture de Mai impayée", detail: "Les QR codes seront suspendus si non régularisée", gravite: "critique", actionGo: "finance", actionLabel: "Voir la facture" },
      { id: 2, type: "plafond", titre: "NGALULA Grâce à 98% de son plafond mensuel", detail: "118$ consommés sur 120$", gravite: "warning", actionGo: "employes", actionLabel: "Voir l'employé" },
      { id: 3, type: "derogation", titre: "1 dérogation en attente de validation", detail: "NGALULA Grâce — soin de 85$", gravite: "info", actionGo: "derogations", refId: 1, actionLabel: "Voir la dérogation" },
      { id: 4, type: "surplus", titre: "Surplus de dérogation à régler", detail: "ILUNGA Patrick — 30$ hors contrat", gravite: "warning", actionGo: "finance", actionLabel: "Payer le surplus" },
    ]
  });
  const logout = () => { setTab("dashboard"); setView("signin"); };

  const go = (target, action) => { setTab(target); setTabAction(action || null); };

  const tabs = [
    { id: "dashboard", label: "Accueil", icon: LayoutDashboard },
    { id: "employes", label: "Employés", icon: Users },
    { id: "derogations", label: "Dérogations", icon: FileText },
    { id: "finance", label: "Finance", icon: Wallet },
    { id: "plus", label: "Plus", icon: Settings },
  ];
  const derogEnAttente = session?.derogations?.filter((d) => d.statut === "En attente").length || 0;

  return (
    <div className="w-full flex-1 flex flex-col md:flex-row min-h-screen" style={{ background: C.ivory, fontFamily: sans }}>
      <style>{`@keyframes riseIn { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} } ::-webkit-scrollbar { display:none; }`}</style>
      
      {/* Desktop Navigation Sidebar */}
      {view === "app" && (
        <aside className="hidden md:flex flex-col w-64 border-r border-[#1B4A34] bg-[#0D2818] text-white shrink-0 justify-between p-4 z-20 shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 py-2 border-b border-[#1B4A34]">
              <div className="w-9 h-9 rounded-xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-xs shrink-0">
                ENT
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-serif text-sm font-bold tracking-wider text-white block truncate">NEOGTEC RH</span>
                {session?.entreprise?.nom && (
                  <p className="text-[11px] text-[#EFDFB8] font-medium truncate">{session.entreprise.nom}</p>
                )}
              </div>
            </div>

            <nav className="space-y-1">
              <p className="text-[10px] font-bold text-[#C6992E] uppercase tracking-wider px-3 mb-2">Navigation Espace</p>
              {tabs.map((t) => {
                const isActive = tab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => go(t.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1B4A34] text-[#EFDFB8] shadow-md font-bold border-l-4 border-[#C6992E]'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-[#C6992E]' : 'text-stone-400'} />
                      <span>{t.label}</span>
                    </div>
                    {t.id === "derogations" && derogEnAttente > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                        {derogEnAttente}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-[#1B4A34]/40 border border-[#2F8A5B]/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Contrat RH</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Actif
              </span>
            </div>
            <button onClick={logout} className="w-full py-2 text-xs text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-lg transition-all flex items-center justify-center gap-1.5 font-semibold cursor-pointer border border-rose-800/20">
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </aside>
      )}

      {/* Main App Container */}
      <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-white shadow-sm border-x border-stone-200/80">
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-200/80 relative z-10" style={{ background: C.ivory, color: C.ink, fontFamily: sans, fontSize: 13 }}>
          <div className="flex items-center gap-3">
            <span style={{ letterSpacing: 1, fontWeight: 700, color: C.navy, fontSize: 14 }}>NEOGTEC ENTREPRISE</span>
            {view === "app" && session?.entreprise?.nom && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#142644]/10 text-[#142644]">
                {session.entreprise.nom}
              </span>
            )}
          </div>
          {view === "app" && (
            <div className="flex items-center gap-3">
              <button onClick={() => go("plus")} className="relative p-1.5 rounded-lg hover:bg-stone-200/60 transition-all cursor-pointer">
                <Bell size={18} color={C.navy} />
                {derogEnAttente > 0 && <span className="absolute rounded-full" style={{ top: 2, right: 2, width: 8, height: 8, background: C.red }} />}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 max-w-7xl w-full mx-auto">
          {view === "signup" && <SignUp onDone={(data) => { setSignupData(data); setView("signin"); }} onGoSignIn={() => setView("signin")} />}
          {view === "signin" && <SignIn prefill={signupData} onDone={(sessionReelle) => (sessionReelle ? startApp(sessionReelle) : setView(session ? "app" : "welcome"))} onGoSignUp={() => setView("signup")} />}
          {view === "welcome" && <Welcome onCreer={() => setView("onboarding")} onDemo={startDemo} onAccederExistant={() => { setView("app"); setTab("dashboard"); }} hasSession={!!session} />}
          {view === "onboarding" && <OnboardingEntreprise onFinish={startApp} onCancel={() => setView("welcome")} />}
          {view === "app" && tab === "dashboard" && <Dashboard session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && tab === "employes" && <Employes session={session} setSession={setSession} notify={notify} go={go} initialAction={tabAction} />}
          {view === "app" && tab === "derogations" && <Derogations session={session} setSession={setSession} notify={notify} go={go} initialAction={tabAction} />}
          {view === "app" && tab === "finance" && <Finance session={session} setSession={setSession} notify={notify} go={go} initialAction={tabAction} />}
          {view === "app" && tab === "contrat" && <ContratConsommation session={session} setSession={setSession} notify={notify} go={go} />}
          {view === "app" && tab === "plus" && <PlusScreen session={session} setSession={setSession} notify={notify} onLogout={logout} go={go} />}
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
