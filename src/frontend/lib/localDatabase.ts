/**
 * 🗄️ LOCAL DATABASE ENGINE (NeoGTec Local DB)
 * Gère de manière centralisée et persistante :
 * - Les comptes et utilisateurs (Assuré, Entreprise RH, Prestataire, Back-office Assureur)
 * - Les dossiers médicaux & consultations
 * - Les permissions & matrice de rôles
 * - Les notifications en temps réel
 * - Les contrats, polices & ayants-droit
 * - Les paiements, cotisations & reçus Mobile Money
 * - Les dérogations hors-réseau
 */

export interface DBCompte {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: 'assure' | 'entreprise' | 'prestataire' | 'assureur' | 'superadmin';
  roleLibelle: string;
  statut: 'Actif' | 'Suspendu' | 'En attente';
  motDePasse?: string;
  carteCode: string;
  photo?: string;
  biometrieActivee: boolean;
  biometrieFaceRegistered: boolean;
  createdAt: string;
  entrepriseId?: string;
  etablissementId?: string;
}

export interface DBDossierMedical {
  id: string;
  assureId: string;
  assureNom: string;
  codeCarte: string;
  typeSoin: string;
  etablissementNom: string;
  medecinNom: string;
  dateSoin: string;
  diagnostic: string;
  ordonnance: string[];
  coutCDF: number;
  coutUSD: number;
  tauxPriseEnCharge: number;
  partAssureCDF: number;
  partAssureurCDF: number;
  statut: 'En cours' | 'Validé' | 'Refusé' | 'Archivé';
  piecesJointes?: { id: string; nom: string; type: string; url: string }[];
}

export interface DBPermissionRole {
  roleId: string;
  roleNom: string;
  droits: {
    voirContrats: boolean;
    creerAvenant: boolean;
    validerSinistres: boolean;
    traiterPEC: boolean;
    accederDossierMedical: boolean;
    gererDerogations: boolean;
    gererCotisations: boolean;
    voirAuditLogs: boolean;
    gererUtilisateurs: boolean;
  };
}

export interface DBNotification {
  id: string;
  destinataireId?: string; // null = global
  destinataireEspace: 'assure' | 'entreprise' | 'prestataire' | 'assureur' | 'tous';
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  lu: boolean;
  timestamp: string;
}

export interface DBContrat {
  id: string;
  type: 'Individuel' | 'Famille' | 'Entreprise';
  souscripteurNom: string;
  souscripteurEmail: string;
  souscripteurTel: string;
  titulaireId: string;
  formuleNom: string;
  plafondUSD: number;
  cotisationMoisUSD: number;
  cotisationAnUSD: number;
  statut: 'Actif' | 'En attente' | 'Suspendu' | 'Résilier';
  datePriseEffet: string;
  dateExpiration: string;
  ayantsDroit: {
    id: string;
    nom: string;
    relation: 'Conjoint' | 'Enfant' | 'Parent' | 'Autre';
    age: number;
    carteCode: string;
    photo?: string;
  }[];
  documents: { id: string; nom: string; date: string; size: string; url: string }[];
  signatureDataUrl?: string;
}

export interface DBPaiement {
  id: string;
  contratId: string;
  payerNom: string;
  telephone: string;
  montantCDF: number;
  montantUSD: number;
  canal: 'M-Pesa' | 'Airtel Money' | 'Orange Money' | 'Afrimoney' | 'Carte Bancaire' | 'Virement';
  referenceTx: string;
  statut: 'Succès' | 'En attente' | 'Échoué';
  motif: string;
  recuPdfUrl?: string;
  timestamp: string;
}

export interface DBDerogation {
  id: string;
  assureId: string;
  assureNom: string;
  demandeurRole: 'assure' | 'entreprise' | 'prestataire';
  etablissementNom: string;
  typeActe: string;
  montantEstimeUSD: number;
  motifMedical: string;
  statut: 'En attente' | 'Approuvé' | 'Rejeté';
  dateDemande: string;
  avisMedecinNote?: string;
  dateDecision?: string;
}

/* -------------------------------------------------------------------
   DONNÉES INITIALES (SEED DE LA BASE LOCAL)
------------------------------------------------------------------- */
const INITIAL_COMPTES: DBCompte[] = [
  {
    id: 'USR-001',
    nom: 'Adonaï Lutonadio',
    email: 'adonailutonadio70@gmail.com',
    telephone: '+243 821 555 422',
    role: 'superadmin',
    roleLibelle: 'Super Administrateur System',
    statut: 'Actif',
    carteCode: 'POL-123456-SEC',
    biometrieActivee: true,
    biometrieFaceRegistered: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'USR-002',
    nom: 'Jean PATIENT',
    email: 'jean.patient@gmail.com',
    telephone: '+243 812 345 678',
    role: 'assure',
    roleLibelle: 'Assuré Principal (Famille)',
    statut: 'Actif',
    carteCode: 'POL-987654-ASS',
    biometrieActivee: true,
    biometrieFaceRegistered: true,
    createdAt: '2026-02-01T10:30:00Z',
    entrepriseId: 'ENT-ACME',
  },
  {
    id: 'USR-003',
    nom: 'Marie KAPEND (RH ACME)',
    email: 'm.kapend@acme.cd',
    telephone: '+243 999 111 222',
    role: 'entreprise',
    roleLibelle: 'Responsable RH & Avantages',
    statut: 'Actif',
    carteCode: 'ENT-ACME-RH',
    biometrieActivee: false,
    biometrieFaceRegistered: false,
    createdAt: '2026-01-15T09:00:00Z',
    entrepriseId: 'ENT-ACME',
  },
  {
    id: 'USR-004',
    nom: 'Clinique Ngaliema (Accueil)',
    email: 'admission@ngaliema.cd',
    telephone: '+243 855 000 111',
    role: 'prestataire',
    roleLibelle: 'Hôpital Partenaire Agréé',
    statut: 'Actif',
    carteCode: 'PRES-NGALIEMA-01',
    biometrieActivee: true,
    biometrieFaceRegistered: true,
    createdAt: '2026-01-20T14:15:00Z',
    etablissementId: 'PREST-NGALIEMA',
  },
  {
    id: 'USR-005',
    nom: 'Gestionnaire Back-Office Assureur',
    email: 'validation@neogtec.com',
    telephone: '+243 800 100 200',
    role: 'assureur',
    roleLibelle: 'Chef de Département Sinistres & PEC',
    statut: 'Actif',
    carteCode: 'NEO-ASS-BO01',
    biometrieActivee: true,
    biometrieFaceRegistered: true,
    createdAt: '2026-01-05T11:00:00Z',
  }
];

const INITIAL_DOSSIERS_MEDICAUX: DBDossierMedical[] = [
  {
    id: 'DOS-2026-001',
    assureId: 'USR-002',
    assureNom: 'Jean PATIENT',
    codeCarte: 'POL-987654-ASS',
    typeSoin: 'Consultation Spécialisée & Laboratoire',
    etablissementNom: 'Clinique Ngaliema',
    medecinNom: 'Dr. Sarah LOKO',
    dateSoin: '2026-07-28',
    diagnostic: 'Paludisme simple à Plasmodium Falciparum + Bilan lipidique',
    ordonnance: ['Coartem 80/480mg (6 cp)', 'Paracétamol 1g (20 cp)', 'Vitamine C 500mg'],
    coutCDF: 125000,
    coutUSD: 50,
    tauxPriseEnCharge: 90,
    partAssureCDF: 12500,
    partAssureurCDF: 112500,
    statut: 'Validé',
    piecesJointes: [
      { id: 'DOC-01', nom: 'Feuille_de_soins_Ngaliema.pdf', type: 'application/pdf', url: '#' },
      { id: 'DOC-02', nom: 'Resultat_Labo_GoutteEpaisse.pdf', type: 'application/pdf', url: '#' }
    ]
  },
  {
    id: 'DOS-2026-002',
    assureId: 'USR-002',
    assureNom: 'Lutonadio Patrick (Fils de Jean)',
    codeCarte: 'BEN-WAN-01',
    typeSoin: 'Soins Pédiatriques & Urgence',
    etablissementNom: 'Centre Médical Monkole',
    medecinNom: 'Dr. Mukendi Pédiatre',
    dateSoin: '2026-08-01',
    diagnostic: 'Rhino-pharyngite aiguë fébrile',
    ordonnance: ['Sirop Amoxicilline 250mg', 'Suppositoires Doliprane 250mg'],
    coutCDF: 87500,
    coutUSD: 35,
    tauxPriseEnCharge: 90,
    partAssureCDF: 8750,
    partAssureurCDF: 78750,
    statut: 'Validé'
  }
];

const INITIAL_PERMISSIONS: DBPermissionRole[] = [
  {
    roleId: 'superadmin',
    roleNom: 'Super Administrateur',
    droits: {
      voirContrats: true, creerAvenant: true, validerSinistres: true, traiterPEC: true,
      accederDossierMedical: true, gererDerogations: true, gererCotisations: true,
      voirAuditLogs: true, gererUtilisateurs: true
    }
  },
  {
    roleId: 'entreprise',
    roleNom: 'Responsable RH / Entreprise',
    droits: {
      voirContrats: true, creerAvenant: true, validerSinistres: false, traiterPEC: false,
      accederDossierMedical: false, gererDerogations: true, gererCotisations: true,
      voirAuditLogs: true, gererUtilisateurs: true
    }
  },
  {
    roleId: 'prestataire',
    roleNom: 'Prestataire de Soins / Hôpital',
    droits: {
      voirContrats: false, creerAvenant: false, validerSinistres: true, traiterPEC: true,
      accederDossierMedical: true, gererDerogations: true, gererCotisations: false,
      voirAuditLogs: false, gererUtilisateurs: false
    }
  },
  {
    roleId: 'assureur',
    roleNom: 'Back-Office Assureur',
    droits: {
      voirContrats: true, creerAvenant: true, validerSinistres: true, traiterPEC: true,
      accederDossierMedical: true, gererDerogations: true, gererCotisations: true,
      voirAuditLogs: true, gererUtilisateurs: false
    }
  },
  {
    roleId: 'assure',
    roleNom: 'Assuré / Adhérent',
    droits: {
      voirContrats: true, creerAvenant: false, validerSinistres: false, traiterPEC: false,
      accederDossierMedical: true, gererDerogations: true, gererCotisations: false,
      voirAuditLogs: false, gererUtilisateurs: false
    }
  }
];

const INITIAL_NOTIFICATIONS: DBNotification[] = [
  {
    id: 'NOTIF-001',
    destinataireEspace: 'tous',
    titre: 'Bienvenue sur la plateforme NeoGTec HealthCare',
    message: 'Votre espace sécurisé d’assurance santé est pleinement opérationnel.',
    type: 'success',
    lu: false,
    timestamp: '2026-08-03T08:00:00Z'
  },
  {
    id: 'NOTIF-002',
    destinataireEspace: 'assure',
    titre: 'Prise en charge approuvée',
    message: 'La demande de consultation à la Clinique Ngaliema a été validée à 90%.',
    type: 'info',
    lu: false,
    timestamp: '2026-08-02T16:30:00Z'
  },
  {
    id: 'NOTIF-003',
    destinataireEspace: 'entreprise',
    titre: 'Appel de cotisation trimestrielle',
    message: 'Le bordereau de cotisation Q3 2026 est disponible pour règlement.',
    type: 'warning',
    lu: false,
    timestamp: '2026-08-01T10:00:00Z'
  }
];

const INITIAL_CONTRATS: DBContrat[] = [
  {
    id: 'POL-987654-ASS',
    type: 'Famille',
    souscripteurNom: 'Jean PATIENT',
    souscripteurEmail: 'jean.patient@gmail.com',
    souscripteurTel: '+243 812 345 678',
    titulaireId: 'USR-002',
    formuleNom: 'AfreakCare Gold Famille (Mutuelle Lisanga)',
    plafondUSD: 10000,
    cotisationMoisUSD: 65,
    cotisationAnUSD: 780,
    statut: 'Actif',
    datePriseEffet: '2026-01-01',
    dateExpiration: '2026-12-31',
    ayantsDroit: [
      { id: 'BEN-WAN-01', nom: 'Sarah PATIENT', relation: 'Conjoint', age: 34, carteCode: 'BEN-WAN-01-SEC' },
      { id: 'BEN-WAN-02', nom: 'Lutonadio Patrick', relation: 'Enfant', age: 8, carteCode: 'BEN-WAN-02-SEC' },
      { id: 'BEN-WAN-03', nom: 'Merveille PATIENT', relation: 'Enfant', age: 4, carteCode: 'BEN-WAN-03-SEC' }
    ],
    documents: [
      { id: 'DOC-C1', nom: 'Conditions_Generales_Gold_2026.pdf', date: '2026-01-01', size: '1.2 MB', url: '#' },
      { id: 'DOC-C2', nom: 'Attestation_Couverture_Sante.pdf', date: '2026-01-01', size: '450 KB', url: '#' }
    ],
    signatureDataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIj48cGF0aCBkPSJNNCAyNSBDIDIwIDEwLCAzMCA0MCwgOTAgMjUiIHN0cm9rZT0iIzBELTI4LTE4IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4='
  }
];

const INITIAL_PAIEMENTS: DBPaiement[] = [
  {
    id: 'PAY-2026-8801',
    contratId: 'POL-987654-ASS',
    payerNom: 'Jean PATIENT',
    telephone: '+243 812 345 678',
    montantCDF: 162500,
    montantUSD: 65,
    canal: 'M-Pesa',
    referenceTx: 'MPESA-CD-9948102',
    statut: 'Succès',
    motif: 'Cotisation mensuelle Santé - Août 2026',
    recuPdfUrl: '#',
    timestamp: '2026-08-01T09:12:00Z'
  },
  {
    id: 'PAY-2026-8802',
    contratId: 'POL-ACME-01',
    payerNom: 'ACME SARL (RH)',
    telephone: '+243 999 111 222',
    montantCDF: 6250000,
    montantUSD: 2500,
    canal: 'Virement',
    referenceTx: 'VIR-RAW-2026-0772',
    statut: 'Succès',
    motif: 'Bordereau Cotisation Flotte Employés Q2',
    recuPdfUrl: '#',
    timestamp: '2026-07-15T14:20:00Z'
  }
];

const INITIAL_DEROGATIONS: DBDerogation[] = [
  {
    id: 'DEROG-2026-014',
    assureId: 'USR-002',
    assureNom: 'Jean PATIENT',
    demandeurRole: 'assure',
    etablissementNom: 'Hôpital Militaire du Camp Kokolo (Hors Réseau)',
    typeActe: 'Chirurgie Spécialisée Urgente (Fracture)',
    montantEstimeUSD: 650,
    motifMedical: 'Établissement conventionné saturé lors de l’urgence routière.',
    statut: 'En attente',
    dateDemande: '2026-08-02T11:45:00Z'
  }
];

/* -------------------------------------------------------------------
   CLÉS DE PERSISTANCE LOCALSTORAGE & EVENT BUS
------------------------------------------------------------------- */
const KEYS = {
  COMPTES: 'neogtec_db_comptes',
  DOSSIERS: 'neogtec_db_dossiers_medicaux',
  PERMISSIONS: 'neogtec_db_permissions',
  NOTIFICATIONS: 'neogtec_db_notifications',
  CONTRATS: 'neogtec_db_contrats',
  PAIEMENTS: 'neogtec_db_paiements',
  DEROGATIONS: 'neogtec_db_derogations'
};

const DB_EVENT_NAME = 'neogtec_db_updated';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn(`LocalDB read error for ${key}:`, err);
  }
  return fallback;
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(DB_EVENT_NAME, { detail: { key, data } }));
  } catch (err) {
    console.error(`LocalDB write error for ${key}:`, err);
  }
}

/* -------------------------------------------------------------------
   MOTEUR DE LA BASE DE DONNÉES LOCALE
------------------------------------------------------------------- */
export const LocalDB = {
  // --- INITIALISATION ---
  init() {
    if (!localStorage.getItem(KEYS.COMPTES)) setStored(KEYS.COMPTES, INITIAL_COMPTES);
    if (!localStorage.getItem(KEYS.DOSSIERS)) setStored(KEYS.DOSSIERS, INITIAL_DOSSIERS_MEDICAUX);
    if (!localStorage.getItem(KEYS.PERMISSIONS)) setStored(KEYS.PERMISSIONS, INITIAL_PERMISSIONS);
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) setStored(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!localStorage.getItem(KEYS.CONTRATS)) setStored(KEYS.CONTRATS, INITIAL_CONTRATS);
    if (!localStorage.getItem(KEYS.PAIEMENTS)) setStored(KEYS.PAIEMENTS, INITIAL_PAIEMENTS);
    if (!localStorage.getItem(KEYS.DEROGATIONS)) setStored(KEYS.DEROGATIONS, INITIAL_DEROGATIONS);
  },

  // --- COMPTES / AUTHENTIFICATION ---
  getComptes(): DBCompte[] {
    return getStored<DBCompte[]>(KEYS.COMPTES, INITIAL_COMPTES);
  },
  getCompteById(id: string): DBCompte | undefined {
    return this.getComptes().find(c => c.id === id || c.email.toLowerCase() === id.toLowerCase() || c.carteCode === id);
  },
  creerCompte(nouveauCompte: Omit<DBCompte, 'id' | 'createdAt'>): DBCompte {
    const comptes = this.getComptes();
    const id = `USR-${String(comptes.length + 1).padStart(3, '0')}`;
    const compte: DBCompte = {
      ...nouveauCompte,
      id,
      createdAt: new Date().toISOString()
    };
    comptes.unshift(compte);
    setStored(KEYS.COMPTES, comptes);
    
    // Notification automatique
    this.ajouterNotification({
      destinataireEspace: compte.role as any,
      titre: 'Nouveau compte créé',
      message: `Compte enregistré avec succès pour ${compte.nom} (${compte.roleLibelle}).`,
      type: 'success'
    });

    return compte;
  },
  updateCompte(id: string, updates: Partial<DBCompte>): DBCompte | undefined {
    const comptes = this.getComptes();
    const index = comptes.findIndex(c => c.id === id);
    if (index !== -1) {
      comptes[index] = { ...comptes[index], ...updates };
      setStored(KEYS.COMPTES, comptes);
      return comptes[index];
    }
    return undefined;
  },

  // --- DOSSIERS MÉDICAUX & CONSULTATIONS ---
  getDossiersMedicaux(): DBDossierMedical[] {
    return getStored<DBDossierMedical[]>(KEYS.DOSSIERS, INITIAL_DOSSIERS_MEDICAUX);
  },
  creerDossierMedical(dossier: Omit<DBDossierMedical, 'id'>): DBDossierMedical {
    const dossiers = this.getDossiersMedicaux();
    const id = `DOS-2026-${String(dossiers.length + 1).padStart(3, '0')}`;
    const nouveau: DBDossierMedical = { ...dossier, id };
    dossiers.unshift(nouveau);
    setStored(KEYS.DOSSIERS, dossiers);

    this.ajouterNotification({
      destinataireEspace: 'assure',
      titre: 'Actes Médicaux Enregistrés',
      message: `Consultation médicale enregistrée à ${nouveau.etablissementNom} pour un montant de ${nouveau.coutUSD} $.`,
      type: 'info'
    });

    return nouveau;
  },

  // --- PERMISSIONS & RÔLES ---
  getPermissions(): DBPermissionRole[] {
    return getStored<DBPermissionRole[]>(KEYS.PERMISSIONS, INITIAL_PERMISSIONS);
  },
  updatePermission(roleId: string, nouveauxDroits: Partial<DBPermissionRole['droits']>): void {
    const perms = this.getPermissions();
    const index = perms.findIndex(p => p.roleId === roleId);
    if (index !== -1) {
      perms[index].droits = { ...perms[index].droits, ...nouveauxDroits };
      setStored(KEYS.PERMISSIONS, perms);
    }
  },

  // --- NOTIFICATIONS ---
  getNotifications(): DBNotification[] {
    return getStored<DBNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  ajouterNotification(notif: Omit<DBNotification, 'id' | 'lu' | 'timestamp'>): DBNotification {
    const notifications = this.getNotifications();
    const id = `NOTIF-${String(notifications.length + 1).padStart(3, '0')}`;
    const nouvelle: DBNotification = {
      ...notif,
      id,
      lu: false,
      timestamp: new Date().toISOString()
    };
    notifications.unshift(nouvelle);
    setStored(KEYS.NOTIFICATIONS, notifications);
    return nouvelle;
  },
  marquerNotifLue(id: string): void {
    const notifs = this.getNotifications();
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
      notifs[index].lu = true;
      setStored(KEYS.NOTIFICATIONS, notifs);
    }
  },

  // --- CONTRATS & AYANTS DROIT ---
  getContrats(): DBContrat[] {
    return getStored<DBContrat[]>(KEYS.CONTRATS, INITIAL_CONTRATS);
  },
  creerContrat(contrat: Omit<DBContrat, 'id'>): DBContrat {
    const contrats = this.getContrats();
    const id = `POL-${Math.floor(100000 + Math.random() * 900000)}-ASS`;
    const nouveau: DBContrat = { ...contrat, id };
    contrats.unshift(nouveau);
    setStored(KEYS.CONTRATS, contrats);
    return nouveau;
  },
  ajouterAyantDroit(contratId: string, membre: Omit<DBContrat['ayantsDroit'][0], 'id'>): DBContrat | undefined {
    const contrats = this.getContrats();
    const index = contrats.findIndex(c => c.id === contratId);
    if (index !== -1) {
      const membreId = `BEN-WAN-${String(contrats[index].ayantsDroit.length + 1).padStart(2, '0')}`;
      const nouveauMembre = { ...membre, id: membreId };
      contrats[index].ayantsDroit.push(nouveauMembre);
      setStored(KEYS.CONTRATS, contrats);
      return contrats[index];
    }
    return undefined;
  },

  // --- PAIEMENTS & REÇUS ---
  getPaiements(): DBPaiement[] {
    return getStored<DBPaiement[]>(KEYS.PAIEMENTS, INITIAL_PAIEMENTS);
  },
  enregistrerPaiement(paiement: Omit<DBPaiement, 'id' | 'timestamp'>): DBPaiement {
    const paiements = this.getPaiements();
    const id = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nouveau: DBPaiement = {
      ...paiement,
      id,
      timestamp: new Date().toISOString()
    };
    paiements.unshift(nouveau);
    setStored(KEYS.PAIEMENTS, paiements);

    this.ajouterNotification({
      destinataireEspace: 'assure',
      titre: 'Paiement Confirmé',
      message: `Règlement de ${nouveau.montantUSD} $ reçu via ${nouveau.canal}. Réf: ${nouveau.referenceTx}`,
      type: 'success'
    });

    return nouveau;
  },

  // --- DÉROGATIONS ---
  getDerogations(): DBDerogation[] {
    return getStored<DBDerogation[]>(KEYS.DEROGATIONS, INITIAL_DEROGATIONS);
  },
  creerDerogation(derogation: Omit<DBDerogation, 'id' | 'dateDemande'>): DBDerogation {
    const derogations = this.getDerogations();
    const id = `DEROG-2026-${String(derogations.length + 1).padStart(3, '0')}`;
    const nouvelle: DBDerogation = {
      ...derogation,
      id,
      dateDemande: new Date().toISOString()
    };
    derogations.unshift(nouvelle);
    setStored(KEYS.DEROGATIONS, derogations);

    this.ajouterNotification({
      destinataireEspace: 'assureur',
      titre: 'Nouvelle Demande de Dérogation',
      message: `Demande hors-réseau soumise par ${nouvelle.assureNom} pour : ${nouvelle.typeActe}`,
      type: 'warning'
    });

    return nouvelle;
  },
  traiterDerogation(id: string, statut: 'Approuvé' | 'Rejeté', note?: string): DBDerogation | undefined {
    const derogations = this.getDerogations();
    const index = derogations.findIndex(d => d.id === id);
    if (index !== -1) {
      derogations[index].statut = statut;
      derogations[index].avisMedecinNote = note;
      derogations[index].dateDecision = new Date().toISOString();
      setStored(KEYS.DEROGATIONS, derogations);

      this.ajouterNotification({
        destinataireEspace: 'assure',
        titre: `Dérogation ${statut}`,
        message: `Votre demande pour ${derogations[index].typeActe} a été ${statut.toLowerCase()}.`,
        type: statut === 'Approuvé' ? 'success' : 'error'
      });

      return derogations[index];
    }
    return undefined;
  },

  // --- ÉCOUTEUR DE CHANGEMENTS TEMPS RÉEL INTER-COMPOSANTS ---
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(DB_EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(DB_EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }
};

// Auto-initialisation au chargement du fichier
LocalDB.init();

/* -------------------------------------------------------------------
   POLYFILL / POLYFITTING DU SYSTÈME window.storage INTER-ESPACES
   Garantit que `window.storage.get` / `window.storage.set` fonctionne
------------------------------------------------------------------- */
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.storage) {
    win.storage = {
      get: (key: string, defaultValue: any = null) => {
        try {
          const val = localStorage.getItem(`neogtec_eco_${key}`);
          return val ? JSON.parse(val) : defaultValue;
        } catch {
          return defaultValue;
        }
      },
      set: (key: string, value: any) => {
        try {
          localStorage.setItem(`neogtec_eco_${key}`, JSON.stringify(value));
          window.dispatchEvent(new CustomEvent(DB_EVENT_NAME, { detail: { key, value } }));
        } catch (e) {
          console.warn('window.storage.set error:', e);
        }
      },
      remove: (key: string) => {
        try {
          localStorage.removeItem(`neogtec_eco_${key}`);
          window.dispatchEvent(new CustomEvent(DB_EVENT_NAME, { detail: { key } }));
        } catch {}
      }
    };
  }
}
