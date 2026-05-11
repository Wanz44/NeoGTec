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
  ShieldAlert // Icône pour les alertes critiques | 🔗 Module: lucide-react
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
  { id: 'governance', name: 'Gouvernance & SAAS', icon: Settings, category: 'system', description: "Gestion multi-tenancy" },
  { id: 'pricing', name: 'Tarification', icon: Calculator, category: 'core', description: "Moteur de calcul de primes" },
  { id: 'medical', name: 'Assurés & Médical', icon: Users, category: 'core', description: "Gestion des dossiers santé" },
  { id: 'operational', name: 'Opérationnel', icon: Activity, category: 'core', description: "Traitement des sinistres" },
  { id: 'network', name: 'Réseau de Soins', icon: Network, category: 'core', description: "Gestion des prestataires" },
  { id: 'financial', name: 'Financier', icon: Wallet, category: 'core', description: "Flux de trésorerie" },
  { id: 'telecom', name: 'Com & Télécom', icon: PhoneCall, category: 'core', description: "Canaux de communication" },
  { id: 'security', name: 'Sécurité & Accès', icon: Lock, category: 'system', description: "Contrôle RBAC" },
  { id: 'audit', name: 'Conformité & Audit', icon: ShieldCheck, category: 'system', description: "Logs immuables" },
  { id: 'alerts', name: 'Alertes Critiques', icon: ShieldAlert, category: 'system', description: "Notifications temps-réel" }
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
  { label: 'Indice Mutuelle', value: '0', change: 0, trend: 'up' },
  { label: 'Claims Latence', value: '0', change: 0, trend: 'down' },
  { label: 'CA Consolidé', value: '0.00 $', change: 0, trend: 'up' },
  { label: 'Uptime Système', value: '100.00%', change: 0, trend: 'up' }
];

// Liste simulée des sinistres récents pour l'interface de suivi
export const MOCK_CLAIMS = [
  { id: 'CL-0001', user: 'Attente Données', status: 'En attente', date: '2024-00-00', amount: '0.00 $' },
  { id: 'CL-0002', user: 'Attente Données', status: 'Approuvé', date: '2024-00-00', amount: '0.00 $' },
  { id: 'CL-0003', user: 'Attente Données', status: 'Payé', date: '2024-00-00', amount: '0.00 $' },
  { id: 'CL-0004', user: 'Attente Données', status: 'Rejeté', date: '2024-00-00', amount: '0.00 $' }
];
