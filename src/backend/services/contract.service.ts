/**
 * 📄 Fichier : /src/backend/services/contract.service.ts
 * 🎯 Objectif : Service de gestion des contrats d'assurance
 * 📝 Fonctionnalités : Création, signature, activation, persistance
 */

import { generateContractPDF, generateAttestationPDF } from './document.service';

export interface ContractDraft {
  id: string;
  userId: string;
  entrepriseNom: string;
  formule: string;
  nbEmployes: number;
  besoins: string[];
  status: 'draft' | 'pending_signature' | 'signed' | 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
  members?: Array<{
    matricule: string;
    nom: string;
    email: string;
    ayantsDroit?: Array<{ nom: string; lien: string }>;
  }>;
  startDate?: string;
  endDate?: string;
  premiumAmount?: number;
}

export interface Contract extends ContractDraft {
  contractNumber: string;
  signedAt?: string;
  activatedAt?: string;
  pdfUrl?: string;
}

// Stockage mémoire des contrats (fallback sans DB)
const contractsMemoryStore: Map<string, Contract> = new Map();
const draftsMemoryStore: Map<string, ContractDraft> = new Map();

/**
 * Crée un nouveau brouillon de contrat
 */
export async function createContractDraft(data: {
  userId: string;
  entrepriseNom: string;
  formule: string;
  nbEmployes: number;
  besoins: string[];
}): Promise<{ success: boolean; draft?: ContractDraft; error?: string }> {
  try {
    // Validation
    if (!data.userId || !data.entrepriseNom || !data.formule) {
      return {
        success: false,
        error: 'Les informations de l\'entreprise et la formule sont requises.'
      };
    }

    const draftId = 'DRAFT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const draft: ContractDraft = {
      id: draftId,
      userId: data.userId,
      entrepriseNom: data.entrepriseNom,
      formule: data.formule,
      nbEmployes: data.nbEmployes,
      besoins: data.besoins,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: []
    };

    draftsMemoryStore.set(draftId, draft);

    console.log(`[CONTRAT] Brouillon créé: ${draftId} pour ${data.entrepriseNom}`);

    return {
      success: true,
      draft
    };
  } catch (error) {
    console.error('[CONTRAT] Erreur lors de la création du brouillon:', error);
    return {
      success: false,
      error: 'Échec de la création du brouillon.'
    };
  }
}

/**
 * Ajoute un membre au brouillon de contrat
 */
export async function addMemberToDraft(draftId: string, member: {
  matricule: string;
  nom: string;
  email: string;
  ayantsDroit?: Array<{ nom: string; lien: string }>;
}): Promise<{ success: boolean; draft?: ContractDraft; error?: string }> {
  const draft = draftsMemoryStore.get(draftId);
  
  if (!draft) {
    return {
      success: false,
      error: 'Brouillon non trouvé.'
    };
  }

  if (!draft.members) {
    draft.members = [];
  }

  // Vérifier si le matricule existe déjà
  const exists = draft.members.some(m => m.matricule === member.matricule);
  if (exists) {
    return {
      success: false,
      error: 'Un membre avec ce matricule existe déjà.'
    };
  }

  draft.members.push(member);
  draft.updatedAt = new Date().toISOString();
  
  draftsMemoryStore.set(draftId, draft);

  console.log(`[CONTRAT] Membre ajouté au brouillon ${draftId}: ${member.nom} (${member.matricule})`);

  return {
    success: true,
    draft
  };
}

/**
 * Signe le contrat (simulation de signature électronique)
 */
export async function signContract(draftId: string, userId: string): Promise<{ success: boolean; contract?: Contract; error?: string }> {
  const draft = draftsMemoryStore.get(draftId);
  
  if (!draft) {
    return {
      success: false,
      error: 'Brouillon non trouvé.'
    };
  }

  if (draft.userId !== userId) {
    return {
      success: false,
      error: 'Vous n\'avez pas la permission de signer ce contrat.'
    };
  }

  if (draft.status !== 'draft') {
    return {
      success: false,
      error: 'Ce contrat ne peut plus être signé (statut: ' + draft.status + ').'
    };
  }

  // Validation: au moins un membre
  if (!draft.members || draft.members.length === 0) {
    return {
      success: false,
      error: 'Au moins un membre doit être ajouté avant la signature.'
    };
  }

  // Calculer la prime (simulation)
  const basePremium = 50; // USD par employé
  const formulaMultiplier = draft.formule.includes('Gold') ? 1.5 : draft.formule.includes('Executive') ? 2.0 : 1.0;
  const premiumAmount = Math.round(basePremium * draft.nbEmployes * formulaMultiplier * 100) / 100;

  // Créer le contrat final
  const contractId = 'CTR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  const contractNumber = 'POL-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  
  const contract: Contract = {
    ...draft,
    id: contractId,
    contractNumber,
    status: 'signed',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    premiumAmount,
    signedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Générer le PDF du contrat
  const pdfResult = await generateContractPDF({
    contractNumber: contract.contractNumber,
    subscriberName: contract.entrepriseNom,
    formula: contract.formule,
    startDate: contract.startDate!,
    endDate: contract.endDate!,
    premiumAmount: contract.premiumAmount!,
    members: contract.members!.map(m => ({ name: m.nom, matricule: m.matricule }))
  });

  if (pdfResult.success) {
    contract.pdfUrl = pdfResult.pdfUrl;
  }

  // Sauvegarder le contrat
  contractsMemoryStore.set(contractId, contract);
  
  // Supprimer le brouillon
  draftsMemoryStore.delete(draftId);

  console.log(`[CONTRAT] Signé: ${contractNumber} pour ${contract.entrepriseNom}`);

  return {
    success: true,
    contract
  };
}

/**
 * Active un contrat après paiement
 */
export async function activateContract(contractId: string, paymentId: string): Promise<{ success: boolean; contract?: Contract; error?: string }> {
  const contract = contractsMemoryStore.get(contractId);
  
  if (!contract) {
    return {
      success: false,
      error: 'Contrat non trouvé.'
    };
  }

  if (contract.status !== 'signed') {
    return {
      success: false,
      error: 'Seuls les contrats signés peuvent être activés.'
    };
  }

  // En production: Vérifier que le paiement est confirmé
  // const paymentStatus = await checkPaymentStatus(paymentId);
  // if (paymentStatus.status !== 'completed') { ... }

  contract.status = 'active';
  contract.activatedAt = new Date().toISOString();
  contract.updatedAt = new Date().toISOString();
  
  contractsMemoryStore.set(contractId, contract);

  // Générer les attestations pour chaque membre
  for (const member of contract.members || []) {
    await generateAttestationPDF({
      matricule: member.matricule,
      nom: member.nom,
      entrepriseNom: contract.entrepriseNom,
      formule: contract.formule,
      validUntil: contract.endDate!
    });
  }

  console.log(`[CONTRAT] Activé: ${contract.contractNumber} (paiement: ${paymentId})`);

  return {
    success: true,
    contract
  };
}

/**
 * Récupère les contrats d'un utilisateur
 */
export function getUserContracts(userId: string, status?: string): Contract[] {
  let contracts = Array.from(contractsMemoryStore.values())
    .filter(c => c.userId === userId);
  
  if (status) {
    contracts = contracts.filter(c => c.status === status);
  }
  
  return contracts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Récupère un contrat par son numéro
 */
export function getContractByNumber(contractNumber: string): Contract | undefined {
  return Array.from(contractsMemoryStore.values())
    .find(c => c.contractNumber === contractNumber);
}

/**
 * Suspend un contrat
 */
export async function suspendContract(contractId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  const contract = contractsMemoryStore.get(contractId);
  
  if (!contract) {
    return {
      success: false,
      error: 'Contrat non trouvé.'
    };
  }

  if (contract.status !== 'active') {
    return {
      success: false,
      error: 'Seuls les contrats actifs peuvent être suspendus.'
    };
  }

  contract.status = 'suspended';
  contract.updatedAt = new Date().toISOString();
  contract.metadata = { ...contract.metadata, suspensionReason: reason, suspendedAt: new Date().toISOString() };
  
  contractsMemoryStore.set(contractId, contract);

  console.log(`[CONTRAT] Suspendu: ${contract.contractNumber} - Raison: ${reason}`);

  return { success: true };
}

/**
 * Récupère tous les contrats (admin)
 */
export function getAllContracts(): Contract[] {
  return Array.from(contractsMemoryStore.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
