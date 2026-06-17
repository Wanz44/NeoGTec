// --- CONFIGURATION SOUVERAINE & STATIC DATA FOR NEOGTEC ---
import React from 'react';

export interface CountryConfig {
  code: string;
  name: string;
  currency: 'USD' | 'CDF' | 'KES' | 'NGN' | 'XOF';
  rate: number; // 1 USD = rate
  symbol: string;
}

export const COUNTRIES: CountryConfig[] = [
  { code: 'RDC', name: 'République Démocratique du Congo', currency: 'CDF', rate: 2800, symbol: 'FC' },
  { code: 'KE', name: 'Kenya', currency: 'KES', rate: 130, symbol: 'KSh' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', rate: 1450, symbol: '₦' },
  { code: 'CI', name: 'Côte d’Ivoire', currency: 'XOF', rate: 605, symbol: 'FCFA' },
  { code: 'SN', name: 'Sénégal', currency: 'XOF', rate: 605, symbol: 'FCFA' },
  { code: 'US', name: 'International', currency: 'USD', rate: 1, symbol: '$' }
];

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  impact: string;
}

export const risksList: RiskItem[] = [
  {
    id: "f",
    title: "Fraude de Prise en Charge",
    description: "Des personnes usurpatrices profitent des listes d'assurés collectives papier de salariés absents.",
    impact: "15% de vos primes de santé partent en faux soins. Soit ~30 000 $ par an pour 500 employés."
  },
  {
    id: "d",
    title: "Fuite de Secrets Médicaux",
    description: "Les comptes-rendus cliniques de vos salariés transitent sur des messageries ou e-mails vulnérables.",
    impact: "Risque pénal lourd : La Loi n°18/035 interdit strictement le partage de données de santé hors RDC."
  },
  {
    id: "l",
    title: "Lenteurs de Validation (PEC)",
    description: "Les familles attendent l'approbation de bons papier urgents pendant des jours aux réceptions des hôpitaux.",
    impact: "Délai moyen d'admission de 15 jours, ce qui dégrade l'efficacité et nuit gravement au climat social."
  },
  {
    id: "p",
    title: "Plaintes administratives RH",
    description: "Vos employés voient leurs droits d'admissions refusés aux guichets par manque d'accords clairs.",
    impact: "80% des appels au support RH interne proviennent de conflits d'admissions en clinique."
  },
  {
    id: "a",
    title: "Audits de Régulation Infructueux",
    description: "Impossible de tracer de manière immuable l'ensemble des cotisations de Tiers Payant.",
    impact: "Pénalités sévères de l'organisme de tutelle ARCA pouvant atteindre 50 000 000 FC d'amende."
  }
];

export interface SolutionItem {
  id: number;
  title: string;
  risk: string;
  desc: string;
}

export const solutionsList: SolutionItem[] = [
  {
    id: 1,
    title: "QR Code Intelligent Dynamique",
    risk: "Fraude : 15% de vos primes perdues par rachat de cartes papier.",
    desc: "Chaque affilié présente un code QR crypté et temporaire sur son mobile, régénéré automatiquement toutes les 24h. Impossible à copier ou prêter."
  },
  {
    id: 2,
    title: "Hébergement Clinique Souverain",
    risk: "Fuite : Violation de la confidentialité et de la Loi n°18/035.",
    desc: "Chaque dossier de santé reste chiffré de bout en bout et hébergé sur nos serveurs souverains à Kinshasa, à l'intérieur des frontières."
  },
  {
    id: 3,
    title: "Matching et Clearing Automatique",
    risk: "Lenteurs : Processus manuel laborieux bloquant l'accès clinique.",
    desc: "Notre algorithme vérifie et valide instantanément 92% des factures médicales en ligne. L'éligibilité est vérifiée en temps réel sans lenteur humaine."
  },
  {
    id: 4,
    title: "Dashboard d'activité Salarié",
    risk: "Plaintes : Des familles rejetées aux cliniques par défaut d'information.",
    desc: "Le collaborateur consulte en toute sécurité son plafond d'assurance et ses consommations courantes directement sur son interface."
  },
  {
    id: 5,
    title: "Rapports réglementaires certifiés",
    risk: "Audits : Calculs financiers incorrects risquant des amendes ARCA.",
    desc: "Obtenez des registres d'audits infalsifiables et des états analytiques consolidés en un seul clic, prêts pour tous les contrôles comptables."
  }
];

export interface ModuleItem {
  id: number;
  type: "Core" | "Add-on";
  name: string;
  benefit: string;
  price: number;
  desc: string;
}

export const modulesList: ModuleItem[] = [
  { id: 1, type: "Core", name: "Prise en Charge (PEC) Digitale", benefit: "Valide les accords de soins en moins de 48h.", price: 0, desc: "Générez des accords de soins digitaux certifiés ARCA sans bordereaux papier physiques." },
  { id: 2, type: "Core", name: "QR Code Éligibilité", benefit: "Identifie instantanément le statut de l'assuré.", price: 0, desc: "Un passeport santé virtuel inviolable qui se renouvelle automatiquement pour barrer la fraude." },
  { id: 3, type: "Add-on", name: "Téléconsultation active", benefit: "Médecin consultable sur WhatsApp en 5min.", price: 200, desc: "Évitez les absences de collaborateurs pour des maux bénins grâce aux diagnostics à distance." },
  { id: 4, type: "Core", name: "Portail RH National", benefit: "Incorporez, suspendez les bénéficiaires en 1 clic.", price: 0, desc: "Gérez vos effectifs et ayants droit d'assurance santé globale sans aucun fichier Excel fastidieux." },
  { id: 5, type: "Core", name: "Saisie Médecin", benefit: "Ordonnances et diagnostics en ligne cryptés.", price: 0, desc: "Permet aux praticiens raccordés d'émettre des prescriptions dématérialisées de façon sécurisée." },
  { id: 6, type: "Core", name: "Guichet Admission", benefit: "Supprime les bordereaux et frais d'encaissement.", price: 0, desc: "Interface simple pour que la clinique valide l'admission sans paperasse ni délais d'attente." },
  { id: 7, type: "Add-on", name: "Système Multi-devises", benefit: "Rapprochement automatique (CDF, USD, KES, XOF).", price: 150, desc: "Gérez les plafonds santé de vos filiales régionales avec ajustements automatiques des taux." },
  { id: 8, type: "Core", name: "Calculateur Quote-part", benefit: "Calculs instantanés de la part salariale.", price: 0, desc: "Déduisez avec précision la quote-part employé sur les factures de soins selon vos accords de groupe." },
  { id: 9, type: "Add-on", name: "Détecteur de Fraude par IA", benefit: "Repère les sur-prescriptions de médicaments.", price: 250, desc: "Analyse en direct pour interdire les ordonnances fictives et les rachets d'assurés." },
  { id: 10, type: "Add-on", name: "Canal Notifications SMS/WhatsApp", benefit: "Alerte instantanée des validations de soins.", price: 100, desc: "Envoyez des alertes aux familles et à vos RH dès qu'une prestation clinique est validée." },
  { id: 11, type: "Add-on", name: "Contrat Certifié DocuSign", benefit: "Engagement contractuel sans déplacement physique.", price: 300, desc: "Signez toutes vos fiches d'admissions collectives et accords Tiers Payant en ligne de façon légale." },
  { id: 12, type: "Core", name: "Rapports Analytiques", benefit: "Vue en temps réel sur la consommation financière.", price: 0, desc: "Fournit au DAF une visibilité parfaite sur les dépenses de santé par pathologie ou département." },
  { id: 13, type: "Core", name: "Importateur de Listes", benefit: "Mise à jour de 1000 salariés en 2 minutes.", price: 0, desc: "Uploadez vos effectifs depuis votre fichier ERP habituel sans ressaisie fastidieuse." },
  { id: 14, type: "Core", name: "Géolocalisation Cliniques", benefit: "Oriente l'assuré vers la bonne clinique éligible.", price: 0, desc: "L'employé localise en 1 clic les hôpitaux raccordés les plus proches assurant le Tiers Payant." },
  { id: 15, type: "Core", name: "Coffre-fort Médical Crypté", benefit: "Assure la confidentialité contre les fuites.", price: 0, desc: "Hébergement ultra-sécurisé de l'historique clinique pour répondre à la réglementation Loi 18/035." },
  { id: 16, type: "Core", name: "Clearing Algorithmique", benefit: "Traitement infaillible et facturation propre.", price: 0, desc: "Consolide l'historique de facturation et réduit les délais de paiement cliniques de 70%." }
];

export interface PlanItem {
  name: string;
  motto: string;
  desc: string;
  basePriceUsd: number;
  features: string[];
  recommended?: boolean;
}

export const plansList: PlanItem[] = [
  {
    name: "Silver",
    motto: "ESSENTIEL POUR PME",
    desc: "Idéal pour éliminer totalement la fraude d'identité et numériser vos adhésions.",
    basePriceUsd: 2,
    features: [
      "Prises en Charge (PEC) sous 48h",
      "Passeport QR Code Patient",
      "Espace de gestion RH National",
      "Importateur de listes Excel",
      "Chiffrement souverain des données en RDC",
      "Support standard par e-mail en français"
    ]
  },
  {
    name: "Gold",
    motto: "RECOMMANDÉ POUR GRANDS COMPTES",
    desc: "Le summum de la synchronisation de santé avec alertes de soins et détection de fraude.",
    basePriceUsd: 5,
    features: [
      "Tout le contenu du niveau Silver",
      "Accès aux modules de Téléconsultation",
      "Détecteur de fraude intelligent",
      "Notifications automatiques WhatsApp/SMS",
      "Support technique prioritaire 24h/24",
      "Garantie légale Loi n°18/035 protection privée"
    ],
    recommended: true
  },
  {
    name: "Platinum",
    motto: "PERFORMANCE MULTINATIONALES",
    desc: "Ajustements multi-devises régionaux et rapports analytiques avancés pour DAF.",
    basePriceUsd: 8,
    features: [
      "Accès complet aux 16 modules technologiques",
      "Double authentification et coffre-fort RGPD",
      "Système multi-devises (CDF, USD, XOF)",
      "Signature contractuelle DocuSign",
      "Audit financier complet certifié ARCA Gombe",
      "Account Manager dédié et support VIP"
    ]
  }
];

export interface FAQItem {
  q: string;
  a: string;
}

export const faqItemsList: FAQItem[] = [
  {
    q: "Êtes-vous agréé par l'ARCA ?",
    a: "Oui, NeoGTec est officiellement agréé et enregistré sous le certificat réglementaire ARCA-RDC n° 24/41098. Notre plateforme répond scrupuleusement au code des assurances congolais."
  },
  {
    q: "Où sont hébergées et stockées mes données de santé ?",
    a: "Conformément à la Loi souveraine n°18/035, l'ensemble des données de santé reste hébergé localement au Congo sur des serveurs souverains sécurisés à Kinshasa-Gombe."
  },
  {
    q: "En combien de temps l'affiliation de mes salariés est-elle active ?",
    a: "Le raccordement prend moins de 5 jours ouvrés. Importez votre liste d'employés et distribuez directement leurs laissez-passer digitaux."
  },
  {
    q: "Comment le QR code élimine-t-il la fraude d'identité ?",
    a: "Chaque QR code patient change dynamiquement sur l'application mobile toutes les 24 heures. Impossible d'utiliser une capture d'écran, un code expiré ou la carte d'un tiers."
  },
  {
    q: "Que se passe-t-il en cas de coupure Internet dans l'hôpital ?",
    a: "Notre application est équipée d'un mode hors-ligne chiffré. L'admission valide le code puis synchronise automatiquement les transactions dès le rétablissement de la connexion."
  },
  {
    q: "Puis-je conserver mon assureur ou ma mutuelle actuelle ?",
    a: "Tout à fait. NeoGTec est un concentrateur de services. Nous fournissons la plateforme technique, vous conservez vos contrats auprès des assureurs de votre choix."
  }
];
