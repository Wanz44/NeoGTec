// 📝 dictionnaire CM2 pour NeoGTec
// Zéro jargon, max 12 mots par phrase, verbes d'action en début de phrase.

export const wordingDict = {
  "clearing_financier": "On paie l’hôpital pour vous. Chaque jeudi.",
  "dematerialisation_processus": "Zéro papier. Tout sur mobile.",
  "optimisation_sinistralite": "Moins de dépenses maladie pour vous.",
  "pec_digitale": "Générez vos bons de soins sur mobile en 2 secondes.",
  "eligibilite_qr_code": "Vérifiez les droits instantanément avec le QR code.",
  "portail_rh": "Gérez vos salariés d'un seul clic sans Excel."
};

export function getWording(key: keyof typeof wordingDict | string, fallback: string): string {
  if (key in wordingDict) {
    return wordingDict[key as keyof typeof wordingDict];
  }
  return fallback;
}
