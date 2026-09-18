/**
 * 📄 Fichier : /src/backend/services/document.service.ts
 * 🎯 Objectif : Service de gestion des documents (upload, stockage, génération PDF)
 * 📁 Stockage : Supabase Storage, S3, ou fallback local
 * 📄 Génération : Contrats PDF, reçus, attestations
 */

export interface DocumentUploadRequest {
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  base64Content?: string; // Pour environnement sans upload réel
  category: 'contract' | 'receipt' | 'claim' | 'id_proof' | 'medical';
  metadata?: Record<string, any>;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  category: string;
  metadata?: Record<string, any>;
  createdAt: string;
  uploadedBy: string;
}

// Stockage mémoire des documents (fallback sans DB/Storage)
const documentsMemoryStore: Map<string, DocumentRecord> = new Map();

/**
 * Téléverse un document
 */
export async function uploadDocument(request: DocumentUploadRequest): Promise<{ success: boolean; document?: DocumentRecord; error?: string }> {
  try {
    // Validation
    if (!request.userId || !request.fileName || !request.fileType) {
      return {
        success: false,
        error: 'Paramètres de téléversement invalides.'
      };
    }

    // Vérifier la taille (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (request.fileSize > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'Le fichier dépasse la taille maximale autorisée (10MB).'
      };
    }

    // Vérifier le type de fichier
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(request.fileType)) {
      return {
        success: false,
        error: 'Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG, DOC, DOCX.'
      };
    }

    // Créer l'enregistrement du document
    const documentId = 'DOC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const documentRecord: DocumentRecord = {
      id: documentId,
      userId: request.userId,
      fileName: `${documentId}_${request.fileName}`,
      originalName: request.fileName,
      fileType: request.fileType,
      fileSize: request.fileSize,
      url: '', // Sera rempli après upload
      category: request.category,
      metadata: request.metadata,
      createdAt: new Date().toISOString(),
      uploadedBy: request.userId
    };

    // Essayer d'uploader vers Supabase Storage si disponible
    let storageUrl: string;
    
    try {
      // En production: Upload réel vers Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('documents')
      //   .upload(documentRecord.fileName, fileBlob, { contentType: request.fileType });
      
      // Simulation: URL fictive
      storageUrl = `https://storage.supabase.co/documents/${documentRecord.fileName}`;
      
      console.log(`[DOCUMENT] Upload simulé: ${documentRecord.fileName} (${request.fileSize} bytes)`);
    } catch (err) {
      console.warn('[STORAGE] Indisponible, utilisation URL locale:', err);
      // Fallback: URL locale simulée
      storageUrl = `/api/documents/local/${documentRecord.fileName}`;
    }

    documentRecord.url = storageUrl;
    
    // Sauvegarder localement
    documentsMemoryStore.set(documentId, documentRecord);

    console.log(`[DOCUMENT] Document enregistré: ${documentId} pour l'utilisateur ${request.userId}`);

    return {
      success: true,
      document: documentRecord
    };
  } catch (error) {
    console.error('[DOCUMENT] Erreur lors du téléversement:', error);
    return {
      success: false,
      error: 'Échec du téléversement du document.'
    };
  }
}

/**
 * Récupère les documents d'un utilisateur
 */
export function getUserDocuments(userId: string, category?: string): DocumentRecord[] {
  let docs = Array.from(documentsMemoryStore.values())
    .filter(d => d.userId === userId);
  
  if (category) {
    docs = docs.filter(d => d.category === category);
  }
  
  return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Récupère un document par son ID
 */
export function getDocument(documentId: string): DocumentRecord | undefined {
  return documentsMemoryStore.get(documentId);
}

/**
 * Génère un contrat PDF
 */
export async function generateContractPDF(contractData: {
  contractNumber: string;
  subscriberName: string;
  formula: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  members: Array<{ name: string; matricule: string }>;
}): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    console.log(`[PDF CONTRAT] Génération pour ${contractData.contractNumber}`);
    
    // En production: Génération PDF avec pdfkit, Puppeteer ou react-pdf
    // 1. Charger un template HTML
    // 2. Injecter les données du contrat
    // 3. Convertir en PDF
    // 4. Uploader vers le storage
    
    const documentId = 'CTR-PDF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const pdfRecord: DocumentRecord = {
      id: documentId,
      userId: 'system',
      fileName: `contrat_${contractData.contractNumber}.pdf`,
      originalName: `Contrat ${contractData.subscriberName}`,
      fileType: 'application/pdf',
      fileSize: 0, // Sera calculé après génération
      url: `https://storage.neogtec.com/contracts/${documentId}.pdf`,
      category: 'contract',
      metadata: {
        contractNumber: contractData.contractNumber,
        subscriberName: contractData.subscriberName,
        formula: contractData.formula,
        generatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      uploadedBy: 'system'
    };
    
    documentsMemoryStore.set(documentId, pdfRecord);
    
    console.log(`[PDF CONTRAT] Généré: ${documentId}`);
    
    return {
      success: true,
      pdfUrl: pdfRecord.url
    };
  } catch (error) {
    console.error('[PDF CONTRAT] Erreur de génération:', error);
    return {
      success: false,
      error: 'Échec de la génération du contrat PDF.'
    };
  }
}

/**
 * Génère une attestation d'assurance
 */
export async function generateAttestationPDF(memberData: {
  matricule: string;
  nom: string;
  entrepriseNom: string;
  formule: string;
  validUntil: string;
}): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    console.log(`[PDF ATTESTATION] Génération pour ${memberData.matricule}`);
    
    const documentId = 'ATT-PDF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const pdfRecord: DocumentRecord = {
      id: documentId,
      userId: memberData.matricule,
      fileName: `attestation_${memberData.matricule}.pdf`,
      originalName: `Attestation ${memberData.nom}`,
      fileType: 'application/pdf',
      fileSize: 0,
      url: `https://storage.neogtec.com/attestations/${documentId}.pdf`,
      category: 'contract',
      metadata: {
        matricule: memberData.matricule,
        nom: memberData.nom,
        entrepriseNom: memberData.entrepriseNom,
        formule: memberData.formule,
        validUntil: memberData.validUntil,
        generatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      uploadedBy: 'system'
    };
    
    documentsMemoryStore.set(documentId, pdfRecord);
    
    console.log(`[PDF ATTESTATION] Généré: ${documentId}`);
    
    return {
      success: true,
      pdfUrl: pdfRecord.url
    };
  } catch (error) {
    console.error('[PDF ATTESTATION] Erreur de génération:', error);
    return {
      success: false,
      error: 'Échec de la génération de l\'attestation PDF.'
    };
  }
}

/**
 * Supprime un document
 */
export async function deleteDocument(documentId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  const document = documentsMemoryStore.get(documentId);
  
  if (!document) {
    return {
      success: false,
      error: 'Document non trouvé.'
    };
  }
  
  // Vérifier les permissions
  if (document.userId !== userId && userId !== 'admin') {
    return {
      success: false,
      error: 'Vous n\'avez pas la permission de supprimer ce document.'
    };
  }
  
  // En production: Supprimer du storage aussi
  // await supabase.storage.from('documents').remove([document.fileName]);
  
  documentsMemoryStore.delete(documentId);
  
  console.log(`[DOCUMENT] Supprimé: ${documentId}`);
  
  return { success: true };
}
