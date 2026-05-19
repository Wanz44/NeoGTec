/**
 * 📄 Fichier : /src/constants.ts
 * 🎯 Objectif : Centralisation des données de structure, constantes de modules et données simulées.
 * 🔗 Liens : Connecté à /src/components/Sidebar.tsx, /src/App.tsx, /src/components/Dashboard.tsx
 * 📅 Version : 1.0.0
 */

import { 
  LayoutDashboard, // Icône pour le pilotage central | 🔗 Module: lucide-react
  Settings, // Icône pour la configuration système | 🔗 Module: lucide-react
  Users, // Icône pour la gestion des adhérents | 🔗 Module: lucide-react
  Activity, // Icône pour le suivi opérationnel | 🔗 Module: lucide-react
  ShieldCheck, // Icône pour les indicateurs de sécurité | 🔗 Module: lucide-react
  Wallet, // Icône pour les flux financiers | 🔗 Module: lucide-react
  PhoneCall, // Icône pour les alertes télécom | 🔗 Module: lucide-react
  Network, // Icône pour le maillage réseau | 🔗 Module: lucide-react
  Calculator, // Icône pour les algorithmes de prix | 🔗 Module: lucide-react
  Lock, // Icône pour l'accès restreint | 🔗 Module: lucide-react
  FileCheck, // Icône pour la validation documentaire | 🔗 Module: lucide-react
  ShieldAlert, // Icône pour les alertes critiques | 🔗 Module: lucide-react
  FileText, // Icône pour les contrats
  AlertCircle, // Icône pour les réclamations
  CreditCard, // Icône pour les paiements
  UserCheck, // Icône pour le CRM
  Stethoscope, // Icône pour la télémédecine
  Building2, // Icône pour les partenaires
  BarChart3, // Icône pour le BI
  Shield // Icône pour l'administration système
} from 'lucide-react'; // Import global des icônes pour l'UI | 🔗 Fichier lié: package.json

// Contrat d'interface pour la définition technique d'un module applicatif
export interface Module {
  id: string; // Identifiant technique (ex: dashboard)
  name: string; // Nom affiché dans le menu
  icon: any; // Composant icône Lucide
  description: string; // Utilité fonctionnelle
  category: 'core' | 'system'; // Classification métier ou technique
}

// Registre des 15 modules constituant le cadre applicatif AssurAdvancé
export const MODULES: Module[] = [
  { id: 'dashboard', name: 'Tableau de Bord', icon: LayoutDashboard, category: 'core', description: "Pilotage général et KPIs" },
  { id: 'contracts', name: 'Gestion Polices & Sinistres', icon: FileText, category: 'core', description: "Contrats et dossiers sinistres" },
  { id: 'reclamation', name: 'Module Réclamation', icon: AlertCircle, category: 'core', description: "Gestion des litiges" },
  { id: 'payment', name: 'Gestion Financière', icon: CreditCard, category: 'core', description: "Cotisations, Mobile Money & Comptabilité" },
  { id: 'crm', name: 'CRM & Commercial', icon: UserCheck, category: 'core', description: "Gestion relation client" },
  { id: 'telemedicine', name: 'Module Télémédecine', icon: Stethoscope, category: 'core', description: "Consultations à distance" },
  { id: 'claims', name: 'Sinistres & Contentieux', icon: ShieldCheck, category: 'core', description: "Déclarations, Litiges & Expertise" },
  { id: 'partners', name: 'Partenaires Hospitaliers', icon: Building2, category: 'core', description: "Réseau de soins et prestataires" },
  { id: 'integrations', name: 'Interopérabilité', icon: Network, category: 'system', description: "Connexions SNIS, APIs & Télémédecine" },
  { id: 'bi', name: 'Business Intelligence', icon: BarChart3, category: 'system', description: "Analyse de données avancée" },
  { id: 'system-config', name: 'Système', icon: LayoutDashboard, category: 'system', description: "Configuration système critique" },
  { id: 'governance', name: 'Gouvernance & Multi-Entités', icon: Settings, category: 'system', description: "Gestion mutualisée" },
  { id: 'alerts', name: 'Alertes Critiques', icon: ShieldAlert, category: 'system', description: "Notifications temps-réel" },
  { id: 'admin', name: 'Administration Système', icon: Shield, category: 'system', description: "Paramétrages critiques" },
  { id: 'settings', name: 'Module Système', icon: Settings, category: 'system', description: "Configuration globale, monitoring et administration" }
];

// Interface pour les indicateurs de performance (KPIs)
export interface Metric {
  label: string; // Nom de la métrique (ex: Claims Latence)
  value: string; // Valeur actuelle formatée
  change: number; // Delta d'évolution (%)
  trend: 'up' | 'down'; // Sens de la variation graphique
}

// Données statiques pour l'initialisation du dashboard
export const MOCK_METRICS: Metric[] = [
  { label: 'Indice Mutuelle', value: '1,248', change: 12.5, trend: 'up' },
  { label: 'Sinistres Actifs', value: '432', change: 4.2, trend: 'down' },
  { label: 'Flux Financier', value: '1.24 M$', change: 8.1, trend: 'up' },
  { label: 'Uptime Système', value: '99.98%', change: 0.1, trend: 'up' }
];

// Liste simulée des sinistres récents pour l'interface de suivi
export const MOCK_CLAIMS = [
  { id: 'CL-8842', user: 'Adonaï WANZAMBI', status: 'Approuvé', date: '2024-05-12', amount: '1,250.00 $' },
  { id: 'CL-8843', user: 'Marie Curie', status: 'En attente', date: '2024-05-14', amount: '3,420.00 $' },
  { id: 'CL-8844', user: 'Thomas Edison', status: 'Payé', date: '2024-05-15', amount: '890.00 $' },
  { id: 'CL-8845', user: 'Albert Einstein', status: 'Rejeté', date: '2024-05-18', amount: '12,000.00 $' }
];
