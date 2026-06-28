// Dictionnaire CM2 NeoGTec - 12 mots maximum par phrase
// Règle: Verbe d'action au début, pas de jargon technique

export const dictionnaire = {
  assuranceRH: "Gagnez 70% de temps sur la gestion médicale de votre équipe.",
  zeroPapier: "Zéro papier. Tout se gère directement sur le téléphone mobile.",
  tracableARCA: "Rapports d'audits certifiés ARCA-RDC disponibles en un seul clic.",
  fraudeIdentity: "QR codes cryptés régénérés toutes les 24h pour stopper l'usurpation.",
  paiementRapide: "Nous payons l'hôpital partenaire chaque jeudi. Aucun retard possible.",
  budgetSante: "Moins de dépenses maladie inutiles. Maîtrisez enfin votre trésorerie.",
  supportAssistance: "Assistance client disponible par téléphone et e-mail à Kinshasa."
};

export function getWording(key: keyof typeof dictionnaire): string {
  return dictionnaire[key];
}
