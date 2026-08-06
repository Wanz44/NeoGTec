/**
 * 📄 Fichier : /src/backend/services/payment.service.ts
 * 🎯 Objectif : Service de paiement avec intégration Mobile Money
 * 💳 Supports : M-Pesa, Orange Money, Airtel Money, Carte Bancaire
 * 📝 Génère : Reçus PDF, gestion des échecs, webhooks
 */

export interface PaymentInitRequest {
  userId: string;
  amount: number;
  currency: 'USD' | 'CDF' | 'EUR';
  method: 'mpesa' | 'orange_money' | 'airtel_money' | 'card';
  phoneNumber?: string;
  contractId?: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  providerReference?: string;
  receiptUrl?: string;
  error?: string;
  nextAction?: 'awaiting_user_confirmation' | 'redirect_to_provider';
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  providerReference?: string;
  createdAt: string;
  completedAt?: string;
  receiptUrl?: string;
  contractId?: string;
  description?: string;
}

// Stockage mémoire des paiements (fallback sans DB)
const paymentsMemoryStore: Map<string, PaymentRecord> = new Map();

/**
 * Initialise un paiement Mobile Money
 */
export async function initiatePayment(request: PaymentInitRequest): Promise<PaymentResponse> {
  try {
    // Validation
    if (!request.userId || !request.amount || request.amount <= 0) {
      return {
        success: false,
        status: 'failed',
        error: 'Paramètres de paiement invalides.'
      };
    }

    if (request.method !== 'card' && !request.phoneNumber) {
      return {
        success: false,
        status: 'failed',
        error: 'Numéro de téléphone requis pour le paiement Mobile Money.'
      };
    }

    // Créer l'enregistrement de paiement
    const paymentId = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const paymentRecord: PaymentRecord = {
      id: paymentId,
      userId: request.userId,
      amount: request.amount,
      currency: request.currency,
      method: request.method,
      status: 'pending',
      createdAt: new Date().toISOString(),
      contractId: request.contractId,
      description: request.description
    };

    // Sauvegarder localement
    paymentsMemoryStore.set(paymentId, paymentRecord);

    console.log(`[PAIEMENT] Initialisation: ${paymentId} - ${request.method} - ${request.amount} ${request.currency}`);

    // Simulation d'appel API fournisseur Mobile Money
    let providerResponse: { reference?: string; requiresConfirmation: boolean };

    switch (request.method) {
      case 'mpesa':
        providerResponse = await simulateMpesaPayment(request.phoneNumber!, request.amount, request.currency);
        break;
      case 'orange_money':
        providerResponse = await simulateOrangeMoneyPayment(request.phoneNumber!, request.amount, request.currency);
        break;
      case 'airtel_money':
        providerResponse = await simulateAirtelMoneyPayment(request.phoneNumber!, request.amount, request.currency);
        break;
      case 'card':
        providerResponse = { reference: 'CARD-' + Math.random().toString(36).substr(2, 8), requiresConfirmation: false };
        break;
      default:
        return {
          success: false,
          status: 'failed',
          error: 'Méthode de paiement non supportée.'
        };
    }

    // Mettre à jour le statut
    paymentRecord.providerReference = providerResponse.reference;
    paymentRecord.status = providerResponse.requiresConfirmation ? 'pending' : 'completed';
    
    if (paymentRecord.status === 'completed') {
      paymentRecord.completedAt = new Date().toISOString();
    }

    paymentsMemoryStore.set(paymentId, paymentRecord);

    // Générer un reçu si paiement complété
    let receiptUrl: string | undefined;
    if (paymentRecord.status === 'completed') {
      receiptUrl = await generateReceipt(paymentRecord);
      paymentRecord.receiptUrl = receiptUrl;
      paymentsMemoryStore.set(paymentId, paymentRecord);
    }

    return {
      success: true,
      paymentId,
      status: paymentRecord.status,
      providerReference: providerResponse.reference,
      receiptUrl,
      nextAction: providerResponse.requiresConfirmation 
        ? 'awaiting_user_confirmation' 
        : undefined
    };
  } catch (error) {
    console.error('[PAIEMENT] Erreur lors de l\'initialisation:', error);
    return {
      success: false,
      status: 'failed',
      error: 'Échec de l\'initialisation du paiement.'
    };
  }
}

/**
 * Simule un appel API M-Pesa (Vodacom RDC)
 */
async function simulateMpesaPayment(phone: string, amount: number, currency: string): Promise<{ reference?: string; requiresConfirmation: boolean }> {
  // En production: Appel réel à l'API M-Pesa Daraja
  console.log(`[M-PESA] Demande de paiement: ${phone} - ${amount} ${currency}`);
  
  // Simulation délai réseau
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 95% de succès simulé
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      reference: 'MPESA-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      requiresConfirmation: true // L'utilisateur doit confirmer sur son téléphone
    };
  } else {
    throw new Error('Échec de la demande M-Pesa');
  }
}

/**
 * Simule un appel API Orange Money
 */
async function simulateOrangeMoneyPayment(phone: string, amount: number, currency: string): Promise<{ reference?: string; requiresConfirmation: boolean }> {
  console.log(`[ORANGE MONEY] Demande de paiement: ${phone} - ${amount} ${currency}`);
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      reference: 'OM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      requiresConfirmation: true
    };
  } else {
    throw new Error('Échec de la demande Orange Money');
  }
}

/**
 * Simule un appel API Airtel Money
 */
async function simulateAirtelMoneyPayment(phone: string, amount: number, currency: string): Promise<{ reference?: string; requiresConfirmation: boolean }> {
  console.log(`[AIRTEL MONEY] Demande de paiement: ${phone} - ${amount} ${currency}`);
  await new Promise(resolve => setTimeout(resolve, 1300));
  
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      reference: 'AM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      requiresConfirmation: true
    };
  } else {
    throw new Error('Échec de la demande Airtel Money');
  }
}

/**
 * Génère un reçu PDF (simulation)
 */
async function generateReceipt(payment: PaymentRecord): Promise<string> {
  console.log(`[REÇU] Génération du reçu pour ${payment.id}`);
  
  // En production: Génération PDF avec pdfkit ou Puppeteer
  // Upload vers S3/Supabase Storage
  // Retourner l'URL publique
  
  // Simulation: retourne une URL fictive
  return `https://storage.neogtec.com/receipts/${payment.id}.pdf`;
}

/**
 * Vérifie le statut d'un paiement
 */
export async function checkPaymentStatus(paymentId: string): Promise<PaymentResponse> {
  const payment = paymentsMemoryStore.get(paymentId);
  
  if (!payment) {
    return {
      success: false,
      status: 'failed',
      error: 'Paiement non trouvé.'
    };
  }

  // Si en attente, vérifier auprès du fournisseur (simulation)
  if (payment.status === 'pending') {
    // En production: appel API fournisseur pour vérification
    const isConfirmed = Math.random() > 0.3; // 70% de confirmation
    
    if (isConfirmed) {
      payment.status = 'completed';
      payment.completedAt = new Date().toISOString();
      payment.receiptUrl = await generateReceipt(payment);
      paymentsMemoryStore.set(paymentId, payment);
      
      console.log(`[PAIEMENT] Confirmé: ${paymentId}`);
    }
  }

  return {
    success: payment.status === 'completed',
    paymentId: payment.id,
    status: payment.status,
    providerReference: payment.providerReference,
    receiptUrl: payment.receiptUrl
  };
}

/**
 * Webhook handler pour les callbacks fournisseurs
 */
export async function handlePaymentWebhook(provider: string, payload: any): Promise<{ success: boolean }> {
  console.log(`[WEBHOOK] Réception callback ${provider}:`, payload);
  
  // En production:
  // 1. Vérifier la signature du webhook
  // 2. Extraire le paymentId de la référence
  // 3. Mettre à jour le statut dans la DB
  // 4. Déclencher les actions métier (activation contrat, etc.)
  
  const { transactionId, status, amount } = payload;
  
  if (status === 'SUCCESS' || status === 'COMPLETED') {
    // Rechercher le paiement par référence
    for (const [id, payment] of paymentsMemoryStore.entries()) {
      if (payment.providerReference === transactionId) {
        payment.status = 'completed';
        payment.completedAt = new Date().toISOString();
        payment.receiptUrl = await generateReceipt(payment);
        paymentsMemoryStore.set(id, payment);
        
        console.log(`[WEBHOOK] Paiement ${id} marqué comme complété`);
        break;
      }
    }
  } else if (status === 'FAILED' || status === 'CANCELLED') {
    // Marquer comme échoué
    for (const [id, payment] of paymentsMemoryStore.entries()) {
      if (payment.providerReference === transactionId) {
        payment.status = 'failed';
        paymentsMemoryStore.set(id, payment);
        
        console.log(`[WEBHOOK] Paiement ${id} marqué comme échoué`);
        break;
      }
    }
  }
  
  return { success: true };
}

/**
 * Récupère l'historique des paiements d'un utilisateur
 */
export function getUserPayments(userId: string): PaymentRecord[] {
  return Array.from(paymentsMemoryStore.values())
    .filter(p => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
