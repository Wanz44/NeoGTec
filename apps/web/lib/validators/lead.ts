import { z } from 'zod';

/**
 * 🛡️ Validation Schema : Lead B2B NeoGTec (ARCA-RDC)
 */
export const leadSchema = z.object({
  // Étape 1 : Informations de l'Entreprise
  raison_sociale: z.string()
    .min(2, { message: "La raison sociale doit contenir au moins 2 caractères." })
    .max(100, { message: "Nom trop long." }),
  nb_employes: z.string({
    required_error: "Le nombre d'employés est obligatoire."
  }).min(1, { message: "Le nombre d'employés est obligatoire." }),
  assureur_actuel: z.string().min(1, { message: "Veuillez spécifier votre assureur actuel ou 'Aucun'." }),

  // Étape 2 : Besoins du Prospect
  besoins: z.array(z.string())
    .min(1, { message: "Veuillez sélectionner au moins un besoin prioritaire." }),

  // Étape 3 : Informations de Contact Professionnel
  nom: z.string()
    .min(2, { message: "Le nom complet est obligatoire." })
    .max(100, { message: "Nom trop long." }),
  email_pro: z.string()
    .email({ message: "Veuillez fournir une adresse e-mail professionnelle valide." })
    .refine((email) => {
      // Éviter les adresses gratuites génériques pour du B2B s'il y a lieu, ou simplement valider le format
      const freeDomains = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'live.fr', 'outlook.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      return domain ? !freeDomains.includes(domain) : true;
    }, { message: "Veuillez utiliser une adresse email professionnelle (pas d'e-mail gratuit)." }),
  phone: z.string()
    .min(9, { message: "Le numéro de téléphone doit faire au moins 9 caractères." })
    .regex(/^(\+243|0)[89][0-9]{8}$/, {
      message: "Numéro invalide pour la RDC. Ex: +243 812 345 678 ou 0812345678"
    }),
  message: z.string().optional(),
  
  // Honeypot anti-spam bot
  website_url_field: z.string().max(0, { message: "Spam bot detecté !" }).optional()
});

export type LeadInput = z.infer<typeof leadSchema>;
