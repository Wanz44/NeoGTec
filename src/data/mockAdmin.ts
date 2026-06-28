/**
 * 📊 Fichier : /src/data/mockAdmin.ts
 * 📋 Description : Jeux de données mockées de haute fidélité pour les graphiques NeoGTec et Tremor.
 */

export interface TimeSeriesData {
  date: string;
  total: number;
}

// 1. Assurés Actifs Mensuels
export const assuresData: TimeSeriesData[] = [
  { date: "1 Jun", total: 180000 },
  { date: "3 Jun", total: 184500 },
  { date: "5 Jun", total: 189000 },
  { date: "8 Jun", total: 192000 },
  { date: "10 Jun", total: 195000 },
  { date: "12 Jun", total: 198000 },
  { date: "15 Jun", total: 200100 },
  { date: "18 Jun", total: 201450 }
];

// 2. PEC Data history
export const pecData = [
  { date: "1 Jun", total: 6200 },
  { date: "3 Jun", total: 6500 },
  { date: "5 Jun", total: 6900 },
  { date: "8 Jun", total: 7200 },
  { date: "10 Jun", total: 7500 },
  { date: "12 Jun", total: 7800 },
  { date: "15 Jun", total: 8100 },
  { date: "18 Jun", total: 8450 }
];

// 3. Sinistralité (loss ratio)
export const siniData = [
  { date: "1 Jun", total: 72 },
  { date: "3 Jun", total: 71 },
  { date: "5 Jun", total: 73 },
  { date: "8 Jun", total: 70 },
  { date: "10 Jun", total: 69 },
  { date: "12 Jun", total: 70 },
  { date: "15 Jun", total: 68 },
  { date: "18 Jun", total: 68 }
];

// 4. Connexions par pays (Stacked chart)
export const connexionsData = [
  { date: "13 Jun", RDC: 12000, Kenya: 800, Nigeria: 477 },
  { date: "14 Jun", RDC: 12500, Kenya: 950, Nigeria: 600 },
  { date: "15 Jun", RDC: 13277, Kenya: 1200, Nigeria: 850 },
  { date: "16 Jun", RDC: 12800, Kenya: 1100, Nigeria: 720 },
  { date: "17 Jun", RDC: 13500, Kenya: 1300, Nigeria: 980 },
  { date: "18 Jun", RDC: 11200, Kenya: 850, Nigeria: 540 },
  { date: "19 Jun", RDC: 12200, Kenya: 920, Nigeria: 630 },
  { date: "20 Jun", RDC: 13100, Kenya: 1050, Nigeria: 710 }
];

// 5. PEC par catégorie type (Stacked charts)
export const pecTypeData = [
  { mois: "Jan", "Hôpital": 12000, "Pharmacie": 8000, "Labo": 4000 },
  { mois: "Feb", "Hôpital": 14000, "Pharmacie": 7500, "Labo": 4800 },
  { mois: "Mar", "Hôpital": 15500, "Pharmacie": 9200, "Labo": 5100 },
  { mois: "Apr", "Hôpital": 13000, "Pharmacie": 8900, "Labo": 3900 },
  { mois: "May", "Hôpital": 16200, "Pharmacie": 10500, "Labo": 6000 },
  { mois: "Jun", "Hôpital": 17500, "Pharmacie": 11100, "Labo": 6300 }
];

// 6. NPS Satisfaction
export const npsData = [
  { name: "Très Satisfait", value: 1450 },
  { name: "Satisfait", value: 920 },
  { name: "Neutre", value: 340 },
  { name: "Insatisfait", value: 120 },
  { name: "Très Insatisfait", value: 45 }
];

// 7. Sources PEC distribution
export const sourcesData = [
  { name: "App Mobile", total: 1450 },
  { name: "Hôpital", total: 850 },
  { name: "Téléconsult", total: 380 },
  { name: "RH", total: 167 }
];

// 8. Entonnoir de Soin (Funnel Data)
export const funnelData = [
  { name: "QR Scanné", value: 100 },
  { name: "PEC Créée", value: 80 },
  { name: "Validée", value: 65 },
  { name: "Payée J+1", value: 48 }
];

// 9. Coût Moyen PEC (Sun to Sat)
export const coutPecData = [
  { jour: "Sun", "Attribué": 145, "Réel": 130 },
  { jour: "Mon", "Attribué": 150, "Réel": 155 },
  { jour: "Tue", "Attribué": 145, "Réel": 140 },
  { jour: "Wed", "Attribué": 155, "Réel": 150 },
  { jour: "Thu", "Attribué": 150, "Réel": 162 },
  { jour: "Fri", "Attribué": 142, "Réel": 138 },
  { jour: "Sat", "Attribué": 148, "Réel": 142 }
];

// 10. LTV Tenant MRR/Churn/Sinistralité metrics over 12 mo
export const ltvData = [
  { mois: "Jul", "MRR": 95, "Churn": 1.2, "Sinistralité": 65 },
  { mois: "Aug", "MRR": 98, "Churn": 1.1, "Sinistralité": 68 },
  { mois: "Sep", "MRR": 102, "Churn": 1.4, "Sinistralité": 72 },
  { mois: "Oct", "MRR": 105, "Churn": 1.0, "Sinistralité": 67 },
  { mois: "Nov", "MRR": 110, "Churn": 0.9, "Sinistralité": 64 },
  { mois: "Dec", "MRR": 115, "Churn": 1.3, "Sinistralité": 62 },
  { mois: "Jan", "MRR": 118, "Churn": 1.2, "Sinistralité": 68 },
  { mois: "Feb", "MRR": 122, "Churn": 1.1, "Sinistralité": 69 },
  { mois: "Mar", "MRR": 125, "Churn": 0.8, "Sinistralité": 70 },
  { mois: "Apr", "MRR": 128, "Churn": 1.5, "Sinistralité": 66 },
  { mois: "May", "MRR": 131, "Churn": 1.2, "Sinistralité": 68 },
  { mois: "Jun", "MRR": 135, "Churn": 1.1, "Sinistralité": 68 }
];

// 11. Assurés Actifs Mensuels par pays
export const assuresMensuel = [
  { date: "Jun 06", RDC: 4200 },
  { date: "Jun 08", RDC: 5000 },
  { date: "Jun 10", RDC: 6900 },
  { date: "Jun 12", RDC: 5400 },
  { date: "Jun 14", RDC: 4100 },
  { date: "Jun 16", RDC: 2600 },
  { date: "Jun 18", RDC: 3600 },
  { date: "Jun 20", RDC: 4500 },
  { date: "Jun 22", RDC: 4900 },
  { date: "Jun 24", RDC: 7400 },
  { date: "Jun 26", RDC: 6900 }
];
