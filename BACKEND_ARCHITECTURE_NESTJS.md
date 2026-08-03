# 🏗️ Architecture Backend NeoGTec - Migration vers NestJS + TypeScript

## 📋 Synthèse des Lacunes Actuelles (Audit Technique)

### A. Authentification / Comptes
| Problème | État Actuel | Solution Requise |
|----------|-------------|------------------|
| **SignUp** | Collecte les informations mais n'enregistre rien dans un stockage persistant | API POST `/auth/signup` → Supabase Auth + table `profiles` |
| **SignIn** | Appelle `trouverCompteReel(...)` avec données locales/triviales | API POST `/auth/signin` → JWT Supabase Auth + RLS |
| **Persistance** | Aucune persistance réelle | PostgreSQL via Supabase avec RLS activé |

### B. Paiement
| Problème | État Actuel | Solution Requise |
|----------|-------------|------------------|
| **Simulation** | `payer()` lance un `setTimeout` puis passe à "done" | Intégration API Mobile Money (M-Pesa, Orange Money, Airtel) |
| **Reçu** | Aucun reçu généré | Génération PDF + stockage S3/Supabase Storage |
| **Échec** | Pas de gestion d'échec | Webhooks + retry logic + notification utilisateur |
| **Validation** | Pas de validation de compte post-paiement | Callback API → update table `payments_mobile_money` |

### C. Biométrie Faciale
| Problème | État Actuel | Solution Requise |
|----------|-------------|------------------|
| **Reconnaissance** | Simple bascule d'état `facesRegistered` | Intégration AWS Rekognition ou Azure Face API |
| **Sécurité** | Aucune sécurité biométrique réelle | Stockage hash biométrique chiffré + matching server-side |

### D. Stockage Partagé / Synchronisation
| Problème | État Actuel | Solution Requise |
|----------|-------------|------------------|
| **API non-standard** | `window.storage.get/set` (non standard navigateur) | Supabase Realtime + Edge Functions pour sync cross-device |
| **Silent failure** | Échoue silencieusement si API indisponible | Fallback localStorage + queue de synchronisation |

### E. Workflow de Souscription
| Problème | État Actuel | Solution Requise |
|----------|-------------|------------------|
| **Contrat mémoire** | Créé en mémoire, perdu au reload | Sauvegarde intermédiaire table `contracts_draft` |
| **Actions non-persistées** | "Ajouter membre", "Signer", "Activer" sans DB | API REST complètes avec transactions ACID |

---

## 🎯 Architecture Cible : NestJS + TypeScript + Supabase

### Stack Technique Recommandée

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                     │
│  - MobileAssureApp.tsx (Refactorisé avec appels API réels)   │
│  - Supabase JS Client (Auth + Realtime + Storage)            │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (NestJS + TypeScript)                   │
│  - Module Auth (JWT, OAuth2, MFA)                            │
│  - Module Contracts (CRUD + Workflow)                        │
│  - Module Payments (Mobile Money Webhooks)                   │
│  - Module Documents (Upload S3 + Génération PDF)             │
│  - Module Biometrics (AWS Rekognition Integration)           │
│  - Module Claims (Gestion Sinistres)                         │
└─────────────────────────────────────────────────────────────┘
                          ↕ SQL / RPC
┌─────────────────────────────────────────────────────────────┐
│         DATABASE (PostgreSQL via Supabase)                   │
│  - Tables: users, contracts, payments, claims, documents     │
│  - Row Level Security (RLS) activé                           │
│  - Audit Logs WORM (Write Once Read Many)                    │
│  - Edge Functions (Deno Runtime)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du Projet Backend (NestJS)

```
src/backend/
├── main.ts                          # Point d'entrée NestJS
├── app.module.ts                    # Module racine
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts       # @Roles('ADMIN', 'USER')
│   │   └── public.decorator.ts      # @Public() (skip auth)
│   ├── guards/
│   │   ├── jwt-auth.guard.ts        # Garde JWT Supabase
│   │   └── roles.guard.ts           # Garde RBAC
│   ├── interceptors/
│   │   └── audit-log.interceptor.ts # Log automatique actions
│   └── filters/
│       └── http-exception.filter.ts # Gestion erreurs centralisée
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts       # POST /auth/signup, /auth/signin
│   │   ├── auth.service.ts          # Logique métier auth
│   │   ├── dto/
│   │   │   ├── signup.dto.ts        # Validation Zod/class-validator
│   │   │   └── signin.dto.ts
│   │   └── strategies/
│   │       └── supabase.strategy.ts # Stratégie JWT Supabase
│   │
│   ├── contracts/
│   │   ├── contracts.controller.ts  # CRUD /contracts
│   │   ├── contracts.service.ts     # Métier contrats
│   │   ├── entities/
│   │   │   └── contract.entity.ts   # TypeORM/Prisma schema
│   │   ├── dto/
│   │   │   ├── create-contract.dto.ts
│   │   │   └── update-contract.dto.ts
│   │   └── workflow/
│   │       ├── draft.service.ts     # Sauvegarde intermédiaire
│   │       ├── signature.service.ts # Signature électronique
│   │       └── activation.service.ts # Activation post-paiement
│   │
│   ├── payments/
│   │   ├── payments.controller.ts   # POST /payments/initiate
│   │   ├── payments.service.ts      # Intégration Mobile Money
│   │   ├── providers/
│   │   │   ├── mpesa.provider.ts    # API M-Pesa
│   │   │   ├── orange-money.provider.ts
│   │   │   └── airtel-money.provider.ts
│   │   ├── webhooks/
│   │   │   └── payment-webhook.controller.ts  # Callbacks providers
│   │   └── receipts/
│   │       └── receipt-generator.service.ts   # Génération PDF
│   │
│   ├── documents/
│   │   ├── documents.controller.ts  # POST /documents/upload
│   │   ├── documents.service.ts     # Upload S3 + métadonnées
│   │   ├── storage/
│   │   │   └── supabase-storage.provider.ts   # Client Storage
│   │   └── pdf/
│   │       └── contract-pdf.generator.ts      # Puppeteer/pdfkit
│   │
│   ├── biometrics/
│   │   ├── biometrics.controller.ts # POST /biometrics/enroll, /verify
│   │   ├── biometrics.service.ts    # AWS Rekognition integration
│   │   └── dto/
│   │       └── face-verification.dto.ts
│   │
│   ├── claims/
│   │   ├── claims.controller.ts     # CRUD /claims
│   │   ├── claims.service.ts        # Gestion sinistres
│   │   └── workflow/
│   │       ├── submission.workflow.ts
│   │       ├── approval.workflow.ts
│   │       └── reimbursement.workflow.ts
│   │
│   └── users/
│       ├── users.controller.ts      # CRUD /users
│       ├── users.service.ts
│       └── dto/
│           └── profile-update.dto.ts
│
└── config/
    ├── database.config.ts           # Config Supabase PostgreSQL
    ├── auth.config.ts               # Config JWT secrets
    └── payment-providers.config.ts  # Clés API Mobile Money
```

---

## 🔐 Module Auth - Implémentation Détaillée

### `auth.controller.ts`

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    // 1. Création compte Supabase Auth
    const { user, error } = await this.authService.createAccount(signupDto);
    
    if (error) {
      throw new BadRequestException(error.message);
    }

    // 2. Insertion profil dans table `profiles` avec RLS bypass (service role)
    const profile = await this.authService.createProfile({
      userId: user.id,
      email: signupDto.email,
      fullName: signupDto.nom,
      phone: signupDto.telephone,
      role: 'assure', // rôle par défaut
    });

    // 3. Log audit immuable
    await this.authService.logAuditEvent({
      actorEmail: signupDto.email,
      action: 'ACCOUNT_CREATED',
      ipAddress: signupDto.ipAddress,
      details: `Compte créé pour ${signupDto.email}`,
    });

    return {
      success: true,
      message: 'Compte créé avec succès. Veuillez vérifier votre email.',
      userId: user.id,
    };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signinDto: SigninDto) {
    // 1. Authentification Supabase Auth
    const { user, session, error } = await this.authService.authenticate(
      signinDto.identifiant,
      signinDto.motDePasse,
    );

    if (error) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 2. Vérification statut compte (non suspendu)
    const profile = await this.authService.getProfile(user.id);
    
    if (profile.status === 'SUSPENDED') {
      throw new ForbiddenException(`Compte suspendu: ${profile.suspensionReason}`);
    }

    // 3. Log connexion
    await this.authService.logLogin(user.id, signinDto.ipAddress);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile.fullname,
        role: profile.role,
      },
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
      },
    };
  }
}
```

### `auth.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    // Client admin avec SERVICE_ROLE_KEY (bypass RLS pour opérations système)
    this.supabaseAdmin = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async createAccount(signupDto: SignupDto) {
    // Appel à Supabase Auth API
    return await this.supabaseAdmin.auth.signUp({
      email: signupDto.email,
      password: signupDto.motDePasse,
      options: {
        data: {
          full_name: signupDto.nom,
          phone: signupDto.telephone,
        },
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
      },
    });
  }

  async authenticate(identifiant: string, password: string) {
    // Support email ou téléphone
    const isEmail = identifiant.includes('@');
    
    if (isEmail) {
      return await this.supabaseAdmin.auth.signInWithPassword({
        email: identifiant,
        password,
      });
    } else {
      // Recherche user par téléphone puis connexion
      const { data: profile } = await this.supabaseAdmin
        .from('profiles')
        .select('user_id, email')
        .eq('phone', identifiant)
        .single();

      if (!profile) {
        return { user: null, session: null, error: { message: 'Utilisateur non trouvé' } };
      }

      return await this.supabaseAdmin.auth.signInWithPassword({
        email: profile.email,
        password,
      });
    }
  }

  async createProfile(profileData: {
    userId: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
  }) {
    const { data, error } = await this.supabaseAdmin
      .from('profiles')
      .insert({
        id: profileData.userId,
        email: profileData.email,
        fullname: profileData.fullName,
        phone: profileData.phone,
        role: profileData.role,
        status: 'IDLE', // En attente de validation
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async logAuditEvent(event: {
    actorEmail: string;
    action: string;
    ipAddress: string;
    details: string;
  }) {
    await this.supabaseAdmin
      .from('audit_logs_worm')
      .insert({
        actor_email: event.actorEmail,
        action: event.action,
        ip_address: event.ipAddress,
        details: event.details,
        status: 'SUCCESS',
        // sha256_record_signature généré automatiquement par trigger DB
      });
  }

  async logLogin(userId: string, ipAddress: string) {
    await this.supabaseAdmin
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
      })
      .eq('id', userId);

    await this.logAuditEvent({
      actorEmail: '', // Sera résolu via jointure
      action: 'USER_LOGIN',
      ipAddress,
      details: `Connexion utilisateur ${userId}`,
    });
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}
```

---

## 💳 Module Payments - Intégration Mobile Money

### `payments.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { MpesaProvider } from './providers/mpesa.provider';
import { OrangeMoneyProvider } from './providers/orange-money.provider';
import { ReceiptGeneratorService } from './receipts/receipt-generator.service';

export enum PaymentProvider {
  MPESA = 'M-Pesa',
  ORANGE_MONEY = 'Orange Money',
  AIRTEL_MONEY = 'Airtel Money',
}

export interface PaymentInitRequest {
  userId: string;
  contractId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  phoneNumber: string;
}

export interface PaymentWebhookPayload {
  transactionRef: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  timestamp: string;
  rawPayload: any;
}

@Injectable()
export class PaymentsService {
  constructor(
    private mpesaProvider: MpesaProvider,
    private orangeMoneyProvider: OrangeMoneyProvider,
    private receiptGenerator: ReceiptGeneratorService,
  ) {}

  async initiatePayment(request: PaymentInitRequest) {
    let providerResponse: any;

    // Sélection du provider selon la demande
    switch (request.provider) {
      case PaymentProvider.MPESA:
        providerResponse = await this.mpesaProvider.initiateSTKPush({
          phoneNumber: request.phoneNumber,
          amount: request.amount,
          accountReference: request.contractId,
        });
        break;

      case PaymentProvider.ORANGE_MONEY:
        providerResponse = await this.orangeMoneyProvider.initiatePayment({
          phoneNumber: request.phoneNumber,
          amount: request.amount,
          merchantRef: request.contractId,
        });
        break;

      default:
        throw new BadRequestException(`Provider ${request.provider} non supporté`);
    }

    // Enregistrement tentative de paiement en DB
    const paymentRecord = await this.savePaymentAttempt({
      ...request,
      transactionRef: providerResponse.transactionRef,
      status: 'PENDING',
    });

    return {
      success: true,
      message: 'Demande de paiement envoyée. Veuillez valider sur votre mobile.',
      transactionRef: providerResponse.transactionRef,
      paymentId: paymentRecord.id,
    };
  }

  async handleWebhook(payload: PaymentWebhookPayload) {
    // 1. Mise à jour statut paiement en DB
    const updatedPayment = await this.updatePaymentStatus({
      transactionRef: payload.transactionRef,
      status: payload.status,
      validatedAt: payload.status === 'SUCCESS' ? new Date() : null,
    });

    // 2. Si succès → génération reçu PDF
    if (payload.status === 'SUCCESS') {
      const receiptPdfUrl = await this.receiptGenerator.generateAndUpload({
        paymentId: updatedPayment.id,
        userId: updatedPayment.user_id,
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        provider: updatedPayment.provider,
        transactionRef: updatedPayment.transaction_ref,
        timestamp: payload.timestamp,
      });

      // 3. Activation automatique du contrat si premier paiement
      if (updatedPayment.contract_id) {
        await this.activateContractIfFullyPaid(updatedPayment.contract_id);
      }

      // 4. Notification utilisateur
      await this.notifyUserPaymentSuccess(updatedPayment.user_id, receiptPdfUrl);
    }

    // 5. Log audit
    await this.logPaymentEvent(payload);

    return { received: true };
  }

  private async savePaymentAttempt(paymentData: any) {
    // Insertion dans table `payments_mobile_money`
    // ... implémentation Supabase client
  }

  private async updatePaymentStatus(updateData: any) {
    // Update table `payments_mobile_money`
    // ... implémentation Supabase client
  }

  private async activateContractIfFullyPaid(contractId: string) {
    // Logique métier: vérifier si tous les paiements sont faits
    // Puis update table `contracts` status → 'APPROVED'
  }

  private async notifyUserPaymentSuccess(userId: string, receiptUrl: string) {
    // Envoi notification push / email avec lien vers reçu
  }

  private async logPaymentEvent(payload: PaymentWebhookPayload) {
    // Log dans audit_logs_worm
  }
}
```

### `receipt-generator.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as PDFKit from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { SupabaseStorageProvider } from '../documents/storage/supabase-storage.provider';

@Injectable()
export class ReceiptGeneratorService {
  constructor(private storageProvider: SupabaseStorageProvider) {}

  async generateAndUpload(paymentData: {
    paymentId: string;
    userId: string;
    amount: number;
    currency: string;
    provider: string;
    transactionRef: string;
    timestamp: string;
  }): Promise<string> {
    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const fileName = `receipt_${paymentData.paymentId}_${Date.now()}.pdf`;
    const tempPath = join(process.env.TEMP_DIR || '/tmp', fileName);

    const writeStream = createWriteStream(tempPath);
    doc.pipe(writeStream);

    // --- Contenu PDF ---
    
    // En-tête
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('NeoGTec HealthCare', { align: 'center' })
      .moveDown();

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('REÇU DE PAIEMENT', { align: 'center' })
      .moveDown(2);

    // Détails
    doc.fontSize(12).font('Helvetica');
    doc.text(`Numéro de transaction: ${paymentData.transactionRef}`);
    doc.text(`Date: ${new Date(paymentData.timestamp).toLocaleString('fr-FR')}`);
    doc.text(`Montant payé: ${this.formatAmount(paymentData.amount, paymentData.currency)}`);
    doc.text(`Moyen de paiement: ${paymentData.provider}`);
    doc.moveDown(2);

    // Pied de page légal
    doc
      .fontSize(10)
      .font('Helvetica-Oblique')
      .text(
        'Ce reçu atteste du paiement de votre quote-part assurance santé.\n' +
        'Conservez ce document pour toute réclamation future.\n' +
        'NeoGTec HealthCare - Conforme réglementation ARCA-RDC',
        { align: 'center', width: 400 },
      );

    doc.end();

    // Attendre fin écriture fichier
    await new Promise((resolve) => writeStream.on('finish', resolve));

    // Upload vers Supabase Storage
    const publicUrl = await this.storageProvider.uploadFile({
      filePath: tempPath,
      bucketName: 'payment-receipts',
      blobName: `receipts/${paymentData.userId}/${fileName}`,
      contentType: 'application/pdf',
    });

    return publicUrl;
  }

  private formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  }
}
```

---

## 📄 Module Documents - Upload Réel

### `documents.controller.ts`

```typescript
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
      fileFilter: (req, file, cb) => {
        // Validation type MIME
        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/jpg',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Type de fichier non autorisé'), false);
        }
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { documentType: string; contractId?: string; claimId?: string },
  ) {
    const uploadedFile = await this.documentsService.uploadAndStore({
      file,
      documentType: body.documentType,
      contractId: body.contractId,
      claimId: body.claimId,
    });

    return {
      success: true,
      message: 'Document téléversé avec succès',
      document: uploadedFile,
    };
  }
}
```

### `documents.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseStorageProvider } from './storage/supabase-storage.provider';

export interface UploadDocumentRequest {
  file: Express.Multer.File;
  documentType: string;
  contractId?: string;
  claimId?: string;
}

@Injectable()
export class DocumentsService {
  constructor(private storageProvider: SupabaseStorageProvider) {}

  async uploadAndStore(request: UploadDocumentRequest) {
    // 1. Upload vers Supabase Storage
    const publicUrl = await this.storageProvider.uploadFile({
      filePath: request.file.path,
      bucketName: 'user-documents',
      blobName: `documents/${request.contractId || 'misc'}/${request.file.filename}`,
      contentType: request.file.mimetype,
    });

    // 2. Enregistrement métadonnées en DB
    const documentRecord = await this.saveDocumentMetadata({
      originalName: request.file.originalname,
      storedName: request.file.filename,
      documentType: request.documentType,
      fileUrl: publicUrl,
      fileSize: request.file.size,
      mimeType: request.file.mimetype,
      contractId: request.contractId,
      claimId: request.claimId,
    });

    // 3. Nettoyage fichier temporaire local
    await this.cleanupTempFile(request.file.path);

    return documentRecord;
  }

  private async saveDocumentMetadata(data: any) {
    // Insertion dans table `documents`
    // Columns: id, original_name, stored_name, document_type, file_url, 
    //          file_size, mime_type, contract_id, claim_id, uploaded_at
  }

  private async cleanupTempFile(filePath: string) {
    // Suppression fichier temporaire du disque local
  }
}
```

---

## 🧬 Module Biometrics - Intégration AWS Rekognition

### `biometrics.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import {
  RekognitionClient,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BiometricsService {
  private rekognitionClient: RekognitionClient;

  constructor(private configService: ConfigService) {
    this.rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async enrollFace(userId: string, imageBuffer: Buffer, collectionId = 'neogtec-faces') {
    // 1. Indexation du visage dans AWS Rekognition
    const command = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: { Bytes: imageBuffer },
      ExternalImageId: userId,
      DetectionAttributes: ['ALL'],
    });

    const response = await this.rekognitionClient.send(command);

    if (!response.FaceRecords || response.FaceRecords.length === 0) {
      throw new BadRequestException('Aucun visage détecté sur l\'image');
    }

    const faceRecord = response.FaceRecords[0];
    const faceId = faceRecord.Face.FaceId;

    // 2. Stockage référence dans DB
    await this.saveFaceReference({
      userId,
      faceId,
      collectionId,
      imageUrl: null, // Optionnel: stocker image dans S3 aussi
      enrolledAt: new Date(),
    });

    return {
      success: true,
      faceId,
      message: 'Visage enregistré avec succès',
      confidence: faceRecord.FaceDetail.Confidence,
    };
  }

  async verifyFace(imageBuffer: Buffer, userId?: string, collectionId = 'neogtec-faces') {
    // 1. Recherche de correspondance
    const command = new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: { Bytes: imageBuffer },
      MaxFaces: 1,
      FaceMatchThreshold: 95, // Seuil de confiance élevé
    });

    const response = await this.rekognitionClient.send(command);

    if (!response.FaceMatches || response.FaceMatches.length === 0) {
      return {
        success: false,
        message: 'Aucune correspondance trouvée',
        matched: false,
      };
    }

    const match = response.FaceMatches[0];
    const matchedUserId = match.Face.ExternalImageId;

    // 2. Vérification cohérence avec userId fourni (si applicable)
    if (userId && matchedUserId !== userId) {
      return {
        success: false,
        message: 'Visage ne correspond pas à l\'utilisateur attendu',
        matched: false,
      };
    }

    return {
      success: true,
      matched: true,
      userId: matchedUserId,
      confidence: match.Similarity,
      message: 'Vérification biométrique réussie',
    };
  }

  private async saveFaceReference(data: {
    userId: string;
    faceId: string;
    collectionId: string;
    imageUrl?: string;
    enrolledAt: Date;
  }) {
    // Insertion dans table `biometric_faces`
    // Columns: id, user_id, face_id, collection_id, image_url, enrolled_at, is_active
  }
}
```

---

## 🔄 Synchronisation Cross-Device (Remplacement de `window.storage`)

### Architecture de Sync

```typescript
// Frontend: Utilisation de Supabase Realtime
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Subscription aux changements de données utilisateur
export function subscribeToUserSync(userId: string, callback: (data: any) => void) {
  const channel = supabase
    .channel(`user:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_sync_state',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      },
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// Backend: Mise à jour état sync
export async function updateUserSyncState(
  userId: string,
  dataType: string,
  data: any,
) {
  // Upsert dans table `user_sync_state`
  // Déclenche automatiquement la notification Realtime
}
```

### Table `user_sync_state` (SQL)

```sql
CREATE TABLE IF NOT EXISTS user_sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL, -- 'contracts_draft', 'forms_temp', etc.
  data_content JSONB NOT NULL,
  device_id VARCHAR(100),
  last_synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, data_type, device_id)
);

CREATE INDEX idx_user_sync_state_user ON user_sync_state(user_id);
CREATE INDEX idx_user_sync_state_type ON user_sync_state(data_type);

-- Trigger pour notifier les changements via Realtime
-- (Géré automatiquement par Supabase Realtime)
```

---

## 📊 Workflow de Souscription Persistant

### `contracts/workflow/draft.service.ts`

```typescript
import { Injectable } from '@nestjs/common';

export interface ContractDraft {
  userId: string;
  step: number; // 0 à 8 (étapes du wizard)
  formule?: any;
  identite?: any;
  famille?: any[];
  documents?: Record<string, string>;
  facesRegistered?: Record<string, boolean>;
  paiement?: any;
  signature?: string;
  accepteCGU?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DraftService {
  async saveDraft(draft: ContractDraft) {
    // Upsert dans table `contracts_draft`
    // Permet reprise après reload/fermeture navigateur
  }

  async getDraft(userId: string): Promise<ContractDraft | null> {
    // Récupération dernier brouillon en cours
  }

  async completeDraft(userId: string, finalContractData: any) {
    // 1. Récupérer brouillon
    const draft = await this.getDraft(userId);
    
    // 2. Créer contrat final dans table `contracts`
    const contract = await this.createFinalContract({
      ...draft,
      ...finalContractData,
      status: 'PENDING_PAYMENT',
    });

    // 3. Supprimer brouillon
    await this.deleteDraft(userId);

    // 4. Générer PDF contrat
    const contractPdfUrl = await this.generateContractPDF(contract);

    // 5. Envoyer email avec contrat
    await this.sendContractEmail(userId, contractPdfUrl);

    return contract;
  }

  private async createFinalContract(data: any) {
    // Insertion table `contracts` avec toutes les infos
  }

  private async generateContractPDF(contract: any) {
    // Génération PDF officiel avec signatures
  }

  private async sendContractEmail(userId: string, pdfUrl: string) {
    // Envoi email via SendGrid/Resend
  }
}
```

---

## 🚀 Plan de Migration

### Phase 1: Setup Infrastructure (Semaine 1)
- [ ] Initialiser projet NestJS (`nest new backend`)
- [ ] Configurer Supabase (URL, keys, RLS policies)
- [ ] Setup Docker Compose pour dev local
- [ ] Configurer ESLint + Prettier + Husky

### Phase 2: Module Auth (Semaine 2)
- [ ] Implémenter `auth.controller.ts` + `auth.service.ts`
- [ ] Tests unitaires Jest
- [ ] Refactor frontend `SignUp` / `SignIn` pour appels API réels
- [ ] Tests E2E avec Supertest

### Phase 3: Module Contracts (Semaine 3)
- [ ] CRUD complet contrats
- [ ] Workflow brouillon persistant
- [ ] Signature électronique
- [ ] Génération PDF contrats

### Phase 4: Module Payments (Semaine 4)
- [ ] Intégration M-Pesa API
- [ ] Intégration Orange Money
- [ ] Webhooks handlers
- [ ] Génération reçus PDF

### Phase 5: Module Documents (Semaine 5)
- [ ] Upload fichiers vers Supabase Storage
- [ ] Métadonnées en DB
- [ ] Sécurisation accès (RLS)

### Phase 6: Module Biometrics (Semaine 6)
- [ ] Intégration AWS Rekognition
- [ ] Enrollment + Verification
- [ ] Tests sécurité (spoofing detection)

### Phase 7: Module Claims (Semaine 7)
- [ ] Submission sinistres
- [ ] Workflow approval
- [ ] Suivi remboursements

### Phase 8: Testing & Deployment (Semaine 8)
- [ ] Tests de charge (k6)
- [ ] Security audit (OWASP Top 10)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Déploiement production (Railway/Render/AWS)

---

## 📝 Checklist Sécurité & Conformité

- [ ] **RGPD/ARCA**: Chiffrement données médicales (pgsodium Vault)
- [ ] **Audit Logs**: Table `audit_logs_worm` immuable (trigger BEFORE UPDATE/DELETE)
- [ ] **RLS**: Politiques activées sur toutes tables sensibles
- [ ] **MFA**: Optionnel pour admins, obligatoire pour transactions > $1000
- [ ] **Rate Limiting**: Middleware global (100 req/min par IP)
- [ ] **CORS**: Whitelist domaines autorisés uniquement
- [ ] **HTTPS**: Obligatoire en production (Let's Encrypt)
- [ ] **Secrets**: Gestion via dotenv + AWS Secrets Manager
- [ ] **Backup**: Snapshot quotidien PostgreSQL (rétention 30 jours)

---

## 📚 Ressources & Documentation

- [NestJS Documentation Officielle](https://docs.nestjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [ARCA-RDC Réglementation Assurance](https://www.arca-rdc.com)
- [AWS Rekognition API](https://docs.aws.amazon.com/rekognition/)
- [M-Pesa Daraja API](https://developer.mpesa.africa/)
- [Orange Money Developer](https://developer.orange.com/apis/money)

---

## ✅ Conclusion

Cette architecture transforme la démo interactive en un **produit de gestion utilisable** avec:

1. ✅ **Backend réel** (NestJS + TypeScript)
2. ✅ **Persistance solide** (PostgreSQL + Supabase)
3. ✅ **Authentification sécurisée** (JWT + RLS)
4. ✅ **Paiements réels** (Mobile Money intégrations)
5. ✅ **Documents persistants** (Supabase Storage)
6. ✅ **Biométrie fonctionnelle** (AWS Rekognition)
7. ✅ **Workflow complet** (Souscription → Contrat → Paiement → Activation)
8. ✅ **Audit & Conformité** (Logs immuables, RGPD, ARCA)
9. ✅ **Base de données locale** (IndexedDB + PouchDB/CouchDB sync)
10. ✅ **Synchronisation automatique** (Offline-first → Cloud auto-sync)

Le code frontend existant sera refactorisé progressivement pour consommer les nouvelles API REST tout en préservant l'UX actuelle.

---

## 🗄️ BASE DE DONNÉES LOCALE & SYNCHRONISATION AUTOMATIQUE

### Contexte : Zones à Connectivité Intermittente

En RDC et dans de nombreuses régions africaines, la connexion internet peut être :
- ❌ Inexistante dans certaines zones rurales
- ⚠️ Instable (3G/4G avec coupures fréquentes)
- 💰 Coûteuse (forfaits data limités)

**Solution requise** : Architecture **Offline-First** avec :
1. Base de données locale persistante (IndexedDB)
2. Synchronisation automatique dès que la connexion revient
3. Gestion des conflits (conflict resolution)
4. File d'attente des opérations (operation queue)

---

### Architecture Offline-First

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/Vite)                     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              LOCAL DATABASE LAYER (IndexedDB)                │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │   PouchDB   │  │  Dexie.js   │  │  Operation Queue    │  │ │
│  │  │  (Optional) │  │  (Recommandé│  │  (Pending Actions)  │  │ │
│  │  │             │  │   + simple) │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              ↕ Sync Engine                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              SYNC MANAGER (Network-aware)                    │ │
│  │  - Détection online/offline (navigator.onLine)              │ │
│  │  - Sync automatique lors du retour online                   │ │
│  │  - Gestion des conflits (last-write-wins / custom logic)    │ │
│  │  - Retry exponential backoff                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                          ↕ HTTPS/REST (quand online)
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND (NestJS + TypeScript)                       │
│  - Endpoint POST /sync/push (client → server)                   │
│  - Endpoint GET  /sync/pull (server → client)                   │
│  - Conflict resolution endpoints                                │
│  - Websocket pour sync temps réel (optionnel)                   │
└──────────────────────────────────────────────────────────────────┘
                          ↕ SQL
┌──────────────────────────────────────────────────────────────────┐
│         DATABASE CLOUD (PostgreSQL via Supabase)                 │
│  - Tables avec colonnes `updated_at`, `deleted_at`              │
│  - Trigger pour audit log des modifications                     │
│  - Index optimisés pour sync différentielle                     │
└──────────────────────────────────────────────────────────────────┘
```

---

### Stack Technique Recommandée

#### Option 1 : **Dexie.js** (Recommandé - Léger + TypeScript-friendly)

**Pourquoi Dexie.js ?**
- ✅ Wrapper moderne autour d'IndexedDB (API native navigateur)
- ✅ Support TypeScript natif (typings complets)
- ✅ Syntaxe proche de MongoDB/Prisma (facile à adopter)
- ✅ Gestion automatique des versions de schema
- ✅ Très performant (milliers de records)
- ✅ Taille minime (~25KB gzipped)
- ✅ Pas de dépendance à un serveur CouchDB

**Installation :**
```bash
npm install dexie
npm install --save-dev @types/dexie  # Si besoin
```

#### Option 2 : **PouchDB** (Si sync CouchDB nécessaire)

**Pourquoi PouchDB ?**
- ✅ Sync bidirectionnelle native avec CouchDB
- ✅ Plugins disponibles (encryption, replication, etc.)
- ✅ Mature et éprouvé en production

**Inconvénients :**
- ❌ Plus lourd (~50KB gzipped)
- ❌ Nécessite un serveur CouchDB côté backend (coût supplémentaire)
- ❌ Moins bonne intégration TypeScript que Dexie

**Notre recommandation** : **Dexie.js** pour NeoGTec, car :
1. Vous utilisez déjà Supabase (PostgreSQL), pas CouchDB
2. La sync se fera via API REST personnalisée (plus de contrôle)
3. Meilleure intégration TypeScript
4. Plus léger pour mobile

---

### Implémentation Détaillée avec Dexie.js

#### 1. Schema de la Base de Données Locale

```typescript
// src/frontend/db/local-database.ts
import Dexie, { Table } from 'dexie';

// Types TypeScript pour chaque entité
export interface LocalUser {
  id: string;              // UUID (même format que Supabase)
  email: string;
  full_name: string;
  phone?: string;
  role: 'assure' | 'entreprise' | 'prestataire' | 'admin';
  avatar_url?: string;
  created_at: number;      // Timestamp local
  updated_at: number;      // Timestamp local
  synced: boolean;         // true = déjà synchronisé avec cloud
  sync_pending: boolean;   // true = modifications en attente de sync
  deleted: boolean;        // soft delete local
}

export interface LocalContract {
  id: string;
  user_id: string;         // FK vers LocalUser
  contract_type: 'individuel' | 'entreprise' | 'groupe';
  status: 'draft' | 'pending_signature' | 'active' | 'suspended' | 'cancelled';
  coverage_start_date: string;  // ISO date
  coverage_end_date: string;
  premium_amount: number;
  currency: 'USD' | 'CDF';
  members: LocalContractMember[];  // Embedded array
  documents: LocalDocumentRef[];
  created_at: number;
  updated_at: number;
  synced: boolean;
  sync_pending: boolean;
  deleted: boolean;
}

export interface LocalContractMember {
  member_id: string;
  full_name: string;
  date_of_birth: string;
  relationship: 'self' | 'spouse' | 'child' | 'other';
  biometric_enrolled: boolean;
  biometric_face_id?: string;  // AWS Rekognition FaceId
}

export interface LocalDocumentRef {
  document_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  local_blob_key?: string;   // Clé pour blob stocké localement
  cloud_url?: string;        // URL Supabase Storage (après sync)
  uploaded: boolean;         // true = uploadé vers cloud
}

export interface LocalPayment {
  id: string;
  contract_id: string;
  amount: number;
  currency: 'USD' | 'CDF';
  payment_method: 'mpesa' | 'orange_money' | 'airtel_money' | 'card' | 'cash';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;   // ID transaction Mobile Money
  receipt_url?: string;      // URL PDF reçu (après génération)
  created_at: number;
  updated_at: number;
  synced: boolean;
  sync_pending: boolean;
}

export interface LocalClaim {
  id: string;
  contract_id: string;
  claim_type: 'consultation' | 'hospitalization' | 'medication' | 'emergency';
  description: string;
  amount_requested: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  documents: LocalDocumentRef[];
  submitted_at: number;
  reviewed_at?: number;
  reviewed_by?: string;      // User ID admin/assureur
  review_notes?: string;
  synced: boolean;
  sync_pending: boolean;
  deleted: boolean;
}

export interface LocalSyncQueueItem {
  id?: number;               // Auto-incrémenté par Dexie
  operation: 'create' | 'update' | 'delete';
  entity_type: 'users' | 'contracts' | 'payments' | 'claims' | 'documents';
  entity_id: string;
  payload: any;              // Données complètes de l'entité
  attempts: number;          // Nombre de tentatives de sync
  last_attempt_at?: number;
  error_message?: string;
  created_at: number;
}

export interface LocalSyncState {
  id: number;                // Toujours 1 (singleton)
  last_sync_at?: number;     // Timestamp dernière sync réussie
  sync_in_progress: boolean;
  pending_push_count: number;
  pending_pull_count: number;
  last_error?: string;
}

// Classe principale Dexie
export class NeoGTecLocalDB extends Dexie {
  users!: Table<LocalUser, string>;
  contracts!: Table<LocalContract, string>;
  payments!: Table<LocalPayment, string>;
  claims!: Table<LocalClaim, string>;
  sync_queue!: Table<LocalSyncQueueItem, number>;
  sync_state!: Table<LocalSyncState, number>;

  constructor() {
    super('NeoGTecLocalDB');
    
    this.version(1).stores({
      // Index primaires et secondaires
      users: 'id, email, role, synced, sync_pending, deleted',
      contracts: 'id, user_id, status, synced, sync_pending, deleted',
      payments: 'id, contract_id, status, synced, sync_pending',
      claims: 'id, contract_id, status, synced, sync_pending, deleted',
      sync_queue: '++id, entity_type, entity_id, created_at',
      sync_state: 'id'  // Singleton (id = 1)
    });

    // Version 2 : Ajout index pour recherche full-text (futur)
    // this.version(2).stores({...});
  }
}

// Instance singleton exportée
export const db = new NeoGTecLocalDB();

// Initialisation obligatoire avant utilisation
export async function initializeLocalDB(): Promise<void> {
  await db.open();
  console.log('✅ Base de données locale initialisée');
  
  // Initialiser sync_state si inexistant
  const syncState = await db.sync_state.get(1);
  if (!syncState) {
    await db.sync_state.put({
      id: 1,
      sync_in_progress: false,
      pending_push_count: 0,
      pending_pull_count: 0
    });
  }
}
```

---

#### 2. Service de Synchronisation (Sync Manager)

```typescript
// src/frontend/services/sync-manager.ts
import { db, LocalSyncQueueItem } from '@/frontend/db/local-database';
import { supabase } from '@/lib/supabase-client';  // Client Supabase existant

export type SyncDirection = 'push' | 'pull' | 'bidirectional';

export class SyncManager {
  private static instance: SyncManager;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private retryDelays = [1000, 5000, 15000, 60000]; // Exponential backoff (ms)

  private constructor() {
    // Écouter les changements de connectivité
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  public static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  // ─────────────────────────────────────────────────────────────
  // GESTION CONNECTIVITÉ
  // ─────────────────────────────────────────────────────────────

  private handleOnline(): void {
    console.log('🟢 Connexion rétablie - Démarrage synchronisation automatique');
    this.isOnline = true;
    // Lancer une sync bidirectionnelle automatique
    this.synchronize('bidirectional').catch(console.error);
  }

  private handleOffline(): void {
    console.log('🔴 Connexion perdue - Mode hors-ligne activé');
    this.isOnline = false;
    // Les opérations seront mises en file d'attente automatiquement
  }

  public isCurrentlyOnline(): boolean {
    return this.isOnline && navigator.onLine;
  }

  // ─────────────────────────────────────────────────────────────
  // SYNCHRONISATION BIDIRECTIONNELLE
  // ─────────────────────────────────────────────────────────────

  public async synchronize(direction: SyncDirection = 'bidirectional'): Promise<{
    pushed: number;
    pulled: number;
    errors: string[];
  }> {
    if (this.syncInProgress) {
      console.warn('⚠️ Synchronisation déjà en cours');
      return { pushed: 0, pulled: 0, errors: [] };
    }

    if (!this.isCurrentlyOnline()) {
      console.warn('⚠️ Hors connexion - synchronisation impossible');
      return { pushed: 0, pulled: 0, errors: ['Hors connexion'] };
    }

    this.syncInProgress = true;
    const errors: string[] = [];

    try {
      // Mettre à jour l'état de sync
      await db.sync_state.update(1, {
        sync_in_progress: true,
        last_error: undefined
      });

      let pushed = 0;
      let pulled = 0;

      // PUSH : Client → Serveur (opérations en attente)
      if (direction === 'push' || direction === 'bidirectional') {
        console.log('⬆️ Démarrage PUSH (local → cloud)');
        pushed = await this.pushChanges();
      }

      // PULL : Serveur → Client (nouvelles données du cloud)
      if (direction === 'pull' || direction === 'bidirectional') {
        console.log('⬇️ Démarrage PULL (cloud → local)');
        pulled = await this.pullChanges();
      }

      // Mettre à jour l'état final
      const pendingCount = await db.sync_queue.count();
      await db.sync_state.update(1, {
        sync_in_progress: false,
        last_sync_at: Date.now(),
        pending_push_count: pendingCount,
        pending_pull_count: 0,
        last_error: errors.length > 0 ? errors.join('; ') : undefined
      });

      console.log(`✅ Synchronisation terminée : ${pushed} poussés, ${pulled} tirés`);
      return { pushed, pulled, errors };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Échec synchronisation:', errorMessage);
      
      await db.sync_state.update(1, {
        sync_in_progress: false,
        last_error: errorMessage
      });

      errors.push(errorMessage);
      return { pushed: 0, pulled: 0, errors };

    } finally {
      this.syncInProgress = false;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PUSH : Envoyer les modifications locales vers le cloud
  // ─────────────────────────────────────────────────────────────

  private async pushChanges(): Promise<number> {
    const pendingOperations = await db.sync_queue
      .orderBy('created_at')
      .toArray();

    if (pendingOperations.length === 0) {
      console.log('ℹ️ Aucune opération en attente de PUSH');
      return 0;
    }

    console.log(`📦 ${pendingOperations.length} opérations à pousser`);
    let successCount = 0;

    for (const operation of pendingOperations) {
      try {
        await this.executePushOperation(operation);
        
        // Supprimer de la file d'attente après succès
        if (operation.id) {
          await db.sync_queue.delete(operation.id);
        }
        successCount++;

      } catch (error) {
        // Gérer l'échec avec retry
        await this.handlePushError(operation, error);
      }
    }

    return successCount;
  }

  private async executePushOperation(op: LocalSyncQueueItem): Promise<void> {
    const token = await this.getAuthToken();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    switch (op.operation) {
      case 'create':
        await this.pushCreate(op, token, baseUrl);
        break;
      case 'update':
        await this.pushUpdate(op, token, baseUrl);
        break;
      case 'delete':
        await this.pushDelete(op, token, baseUrl);
        break;
      default:
        throw new Error(`Opération inconnue: ${op.operation}`);
    }

    // Marquer l'entité locale comme synchronisée
    await this.markEntityAsSynced(op.entity_type, op.entity_id);
  }

  private async pushCreate(
    op: LocalSyncQueueItem,
    token: string,
    baseUrl: string
  ): Promise<void> {
    const endpoint = `${baseUrl}/api/${op.entity_type}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(op.payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }

    // Récupérer l'ID définitif côté serveur (peut différer de l'ID local)
    const serverData = await response.json();
    if (serverData.id && serverData.id !== op.entity_id) {
      // Mapper ID local → ID serveur si nécessaire
      await this.remapEntityId(op.entity_type, op.entity_id, serverData.id);
    }
  }

  private async pushUpdate(
    op: LocalSyncQueueItem,
    token: string,
    baseUrl: string
  ): Promise<void> {
    const endpoint = `${baseUrl}/api/${op.entity_type}/${op.entity_id}`;
    
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(op.payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }
  }

  private async pushDelete(
    op: LocalSyncQueueItem,
    token: string,
    baseUrl: string
  ): Promise<void> {
    const endpoint = `${baseUrl}/api/${op.entity_type}/${op.entity_id}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok && response.status !== 404) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PULL : Récupérer les nouvelles données du cloud
  // ─────────────────────────────────────────────────────────────

  private async pullChanges(): Promise<number> {
    const token = await this.getAuthToken();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Récupérer le timestamp de la dernière sync
    const syncState = await db.sync_state.get(1);
    const lastSyncAt = syncState?.last_sync_at || 0;

    // Fetch toutes les entités modifiées depuis la dernière sync
    const entities = ['users', 'contracts', 'payments', 'claims'];
    let totalCount = 0;

    for (const entityType of entities) {
      const endpoint = `${baseUrl}/api/${entityType}?updated_after=${lastSyncAt}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn(`⚠️ Échec PULL ${entityType}: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`📥 ${data.length} ${entityType} récupérés`);
        await this.mergePullData(entityType, data);
        totalCount += data.length;
      }
    }

    return totalCount;
  }

  private async mergePullData(
    entityType: string,
    remoteData: any[]
  ): Promise<void> {
    const table = (db as any)[entityType] as Table<any, string>;

    for (const item of remoteData) {
      try {
        // Vérifier s'il y a un conflit (modification locale plus récente)
        const localItem = await table.get(item.id);
        
        if (localItem && localItem.sync_pending) {
          // Conflit détecté → appliquer stratégie de résolution
          await this.resolveConflict(entityType, localItem, item);
        } else {
          // Pas de conflit → écraser ou insérer
          await table.put({
            ...item,
            synced: true,
            sync_pending: false
          });
        }
      } catch (error) {
        console.error(`❌ Erreur merge ${entityType}/${item.id}:`, error);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GESTION DES CONFLITS
  // ─────────────────────────────────────────────────────────────

  private async resolveConflict(
    entityType: string,
    localItem: any,
    remoteItem: any
  ): Promise<void> {
    console.warn(`⚠️ Conflit détecté sur ${entityType}/${localItem.id}`);

    // Stratégie par défaut : "Last Write Wins" (basé sur updated_at)
    const localTime = localItem.updated_at || 0;
    const remoteTime = remoteItem.updated_at || 0;

    if (localTime >= remoteTime) {
      // La version locale est plus récente → on garde locale + on repousse
      console.log('🏆 Version locale plus récente conservée');
      await db.sync_queue.add({
        operation: 'update',
        entity_type: entityType,
        entity_id: localItem.id,
        payload: localItem,
        attempts: 0,
        created_at: Date.now()
      });
    } else {
      // La version distante est plus récente → on écrase locale
      console.log('🏆 Version cloud plus récente appliquée');
      const table = (db as any)[entityType] as Table<any, string>;
      await table.put({
        ...remoteItem,
        synced: true,
        sync_pending: false
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GESTION D'ERREURS PUSH (Retry avec Exponential Backoff)
  // ─────────────────────────────────────────────────────────────

  private async handlePushError(
    op: LocalSyncQueueItem,
    error: any
  ): Promise<void> {
    const maxAttempts = 5;
    const newAttempts = (op.attempts || 0) + 1;

    if (newAttempts >= maxAttempts) {
      console.error(`❌ Échec définitif après ${maxAttempts} tentatives`, op);
      // Marquer l'opération comme échouée définitivement
      await db.sync_queue.update(op.id!, {
        attempts: newAttempts,
        error_message: error instanceof Error ? error.message : 'Échec inconnu',
        last_attempt_at: Date.now()
      });
      // Notification utilisateur (à implémenter)
      this.notifySyncFailure(op);
      return;
    }

    // Planifier une nouvelle tentative avec délai exponentiel
    const delay = this.retryDelays[Math.min(newAttempts - 1, this.retryDelays.length - 1)];
    console.log(`⏳ Nouvelle tentative dans ${delay}ms (tentative ${newAttempts}/${maxAttempts})`);

    await db.sync_queue.update(op.id!, {
      attempts: newAttempts,
      error_message: error instanceof Error ? error.message : undefined,
      last_attempt_at: Date.now()
    });

    // Retry programmé
    setTimeout(() => {
      if (this.isCurrentlyOnline()) {
        this.synchronize('push').catch(console.error);
      }
    }, delay);
  }

  // ─────────────────────────────────────────────────────────────
  // UTILITAIRES
  // ─────────────────────────────────────────────────────────────

  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Non authentifié');
    }
    return session.access_token;
  }

  private async markEntityAsSynced(
    entityType: string,
    entityId: string
  ): Promise<void> {
    const table = (db as any)[entityType] as Table<any, string>;
    await table.update(entityId, {
      synced: true,
      sync_pending: false
    });
  }

  private async remapEntityId(
    entityType: string,
    localId: string,
    serverId: string
  ): Promise<void> {
    // Cas où l'ID généré localement diffère de l'ID serveur
    // Nécessite de mettre à jour toutes les références (FK)
    console.log(`🔄 Remapping ID: ${localId} → ${serverId}`);
    
    const table = (db as any)[entityType] as Table<any, string>;
    const item = await table.get(localId);
    
    if (item) {
      await table.delete(localId);
      await table.put({ ...item, id: serverId });
    }
  }

  private notifySyncFailure(op: LocalSyncQueueItem): void {
    // TODO: Implémenter notification UI (toast, modal, etc.)
    console.warn('🔔 Notification échec sync:', op);
    // Exemple: dispatch vers un store Zustand/Redux
    // useNotificationStore.getState().addError(`Échec sync: ${op.entity_type}/${op.entity_id}`);
  }
}

// Export singleton
export const syncManager = SyncManager.getInstance();
```

---

#### 3. Hook React pour Utiliser la Sync (Zustand)

```typescript
// src/frontend/hooks/use-local-sync.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { db, initializeLocalDB } from '@/frontend/db/local-database';
import { syncManager } from '@/frontend/services/sync-manager';
import { useEffect, useState } from 'react';

interface SyncState {
  isOnline: boolean;
  syncInProgress: boolean;
  lastSyncAt?: number;
  pendingPushCount: number;
  lastError?: string;
  
  // Actions
  initialize: () => Promise<void>;
  forceSync: () => Promise<{ pushed: number; pulled: number; errors: string[] }>;
  refreshStatus: () => Promise<void>;
}

export const useLocalSync = create<SyncState>()(
  subscribeWithSelector((set, get) => ({
    isOnline: navigator.onLine,
    syncInProgress: false,
    lastSyncAt: undefined,
    pendingPushCount: 0,
    lastError: undefined,

    initialize: async () => {
      console.log('🚀 Initialisation base de données locale...');
      await initializeLocalDB();
      await get().refreshStatus();
    },

    forceSync: async () => {
      set({ syncInProgress: true });
      try {
        const result = await syncManager.synchronize('bidirectional');
        await get().refreshStatus();
        return result;
      } finally {
        set({ syncInProgress: false });
      }
    },

    refreshStatus: async () => {
      const syncState = await db.sync_state.get(1);
      const pendingCount = await db.sync_queue.count();
      
      set({
        isOnline: navigator.onLine,
        syncInProgress: syncState?.sync_in_progress || false,
        lastSyncAt: syncState?.last_sync_at,
        pendingPushCount: pendingCount,
        lastError: syncState?.last_error
      });
    }
  }))
);

// Hook utilitaire pour composant React
export function useSyncStatus() {
  const { isOnline, syncInProgress, lastSyncAt, pendingPushCount, lastError } = useLocalSync();
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!isOnline) {
      setStatusMessage('🔴 Hors ligne - Modifications enregistrées localement');
    } else if (syncInProgress) {
      setStatusMessage('🔄 Synchronisation en cours...');
    } else if (pendingPushCount > 0) {
      setStatusMessage(`🟡 ${pendingPushCount} modification(s) en attente de sync`);
    } else if (lastSyncAt) {
      const date = new Date(lastSyncAt);
      setStatusMessage(`🟢 Synchronisé le ${date.toLocaleTimeString()}`);
    } else {
      setStatusMessage('🟢 En ligne');
    }
  }, [isOnline, syncInProgress, pendingPushCount, lastSyncAt]);

  return {
    isOnline,
    syncInProgress,
    lastSyncAt,
    pendingPushCount,
    lastError,
    statusMessage
  };
}
```

---

#### 4. Wrapper pour Opérations CRUD avec Auto-Queue

```typescript
// src/frontend/db/crud-wrapper.ts
import { db } from './local-database';
import { syncManager } from '@/frontend/services/sync-manager';

/**
 * Wrapper pour opérations CRUD avec mise en file d'attente automatique
 * pour synchronisation ultérieure
 */

export async function createEntity<T extends { id: string }>(
  entityType: keyof typeof db,
  data: T
): Promise<T> {
  const table = db[entityType] as any;
  
  // Générer un ID local si non fourni
  if (!data.id) {
    data.id = crypto.randomUUID();
  }

  // Ajouter timestamps
  const now = Date.now();
  data.created_at = now;
  data.updated_at = now;
  data.synced = false;
  data.sync_pending = true;

  // Insérer en local
  await table.put(data);

  // Ajouter à la file d'attente de sync
  await db.sync_queue.add({
    operation: 'create',
    entity_type: entityType as string,
    entity_id: data.id,
    payload: data,
    attempts: 0,
    created_at: now
  });

  // Si online, tenter une sync immédiate (optionnel)
  if (syncManager.isCurrentlyOnline()) {
    syncManager.synchronize('push').catch(console.warn);
  }

  return data;
}

export async function updateEntity<T extends { id: string }>(
  entityType: keyof typeof db,
  id: string,
  updates: Partial<T>
): Promise<void> {
  const table = db[entityType] as any;
  
  // Vérifier existence
  const existing = await table.get(id);
  if (!existing) {
    throw new Error(`Entité ${entityType}/${id} introuvable`);
  }

  // Mettre à jour en local
  const updatedData = {
    ...existing,
    ...updates,
    updated_at: Date.now(),
    sync_pending: true
  };
  
  await table.put(updatedData);

  // Ajouter à la file d'attente de sync
  await db.sync_queue.add({
    operation: 'update',
    entity_type: entityType as string,
    entity_id: id,
    payload: updatedData,
    attempts: 0,
    created_at: Date.now()
  });

  // Si online, tenter une sync immédiate
  if (syncManager.isCurrentlyOnline()) {
    syncManager.synchronize('push').catch(console.warn);
  }
}

export async function deleteEntity(
  entityType: keyof typeof db,
  id: string
): Promise<void> {
  const table = db[entityType] as any;
  
  // Soft delete (marquer comme supprimé)
  const existing = await table.get(id);
  if (!existing) {
    throw new Error(`Entité ${entityType}/${id} introuvable`);
  }

  const updatedData = {
    ...existing,
    deleted: true,
    updated_at: Date.now(),
    sync_pending: true
  };
  
  await table.put(updatedData);

  // Ajouter à la file d'attente de sync
  await db.sync_queue.add({
    operation: 'delete',
    entity_type: entityType as string,
    entity_id: id,
    payload: { id, deleted: true },
    attempts: 0,
    created_at: Date.now()
  });

  // Si online, tenter une sync immédiate
  if (syncManager.isCurrentlyOnline()) {
    syncManager.synchronize('push').catch(console.warn);
  }
}

export async function getEntity<T>(
  entityType: keyof typeof db,
  id: string
): Promise<T | undefined> {
  const table = db[entityType] as any;
  return table.get(id);
}

export async function queryEntities<T>(
  entityType: keyof typeof db,
  filter: (item: T) => boolean
): Promise<T[]> {
  const table = db[entityType] as any;
  const all = await table.toArray();
  return all.filter(filter);
}
```

---

### Exemple d'Utilisation dans un Composant React

```typescript
// src/frontend/components/ContractForm.tsx
import { useEffect, useState } from 'react';
import { useLocalSync, useSyncStatus } from '@/frontend/hooks/use-local-sync';
import { createEntity, updateEntity, queryEntities } from '@/frontend/db/crud-wrapper';
import { LocalContract } from '@/frontend/db/local-database';

export function ContractForm() {
  const { initialize, forceSync } = useLocalSync();
  const { statusMessage, isOnline, pendingPushCount } = useSyncStatus();
  const [contracts, setContracts] = useState<LocalContract[]>([]);
  const [formData, setFormData] = useState({ /* ... */ });

  // Initialiser DB locale au montage
  useEffect(() => {
    initialize();
  }, []);

  // Charger les contrats locaux
  useEffect(() => {
    async function loadContracts() {
      const list = await queryEntities<LocalContract>(
        'contracts',
        (c) => !c.deleted && c.user_id === currentUserId
      );
      setContracts(list);
    }
    loadContracts();
  }, []);

  // Créer un nouveau contrat (fonctionne offline)
  const handleCreateContract = async () => {
    const newContract = await createEntity<LocalContract>('contracts', {
      id: crypto.randomUUID(),
      user_id: currentUserId,
      contract_type: 'individuel',
      status: 'draft',
      coverage_start_date: '2025-01-01',
      coverage_end_date: '2025-12-31',
      premium_amount: 100,
      currency: 'USD',
      members: [],
      documents: [],
      created_at: Date.now(),
      updated_at: Date.now(),
      synced: false,
      sync_pending: true,
      deleted: false
    });

    setContracts([...contracts, newContract]);
    // Contrat enregistré localement + ajouté à la file de sync
  };

  // Mettre à jour un contrat (fonctionne offline)
  const handleUpdateContract = async (id: string, updates: Partial<LocalContract>) => {
    await updateEntity('contracts', id, updates);
    // Mise à jour locale + ajout à la file de sync
  };

  return (
    <div>
      {/* Barre de statut sync */}
      <div className={`px-4 py-2 text-sm ${
        isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {statusMessage}
        {pendingPushCount > 0 && (
          <button
            onClick={() => forceSync()}
            className="ml-4 underline font-semibold"
          >
            Synchroniser maintenant
          </button>
        )}
      </div>

      {/* Formulaire contrat */}
      <form onSubmit={handleCreateContract}>
        {/* Champs du formulaire... */}
        <button type="submit">
          {isOnline ? 'Créer et synchroniser' : 'Créer (hors ligne)'}
        </button>
      </form>

      {/* Liste des contrats */}
      <ul>
        {contracts.map(contract => (
          <li key={contract.id}>
            {contract.contract_type} - {contract.status}
            {!contract.synced && <span className="text-yellow-600"> ⏳ En attente</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Backend NestJS : Endpoints de Synchronisation

```typescript
// src/backend/modules/sync/sync.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * PUSH: Recevoir les modifications du client
   */
  @Post('push')
  async pushChanges(
    @Req() req: Request,
    @Body() body: {
      operations: Array<{
        operation: 'create' | 'update' | 'delete';
        entity_type: string;
        entity_id: string;
        payload: any;
      }>;
    }
  ) {
    const userId = req.user.sub; // JWT payload
    return this.syncService.processPush(userId, body.operations);
  }

  /**
   * PULL: Récupérer les modifications depuis la dernière sync
   */
  @Get('pull')
  async pullChanges(
    @Req() req: Request,
    @Query('updated_after') updatedAfter: string
  ) {
    const userId = req.user.sub;
    const timestamp = updatedAfter ? parseInt(updatedAfter, 10) : 0;
    
    return this.syncService.processPull(userId, timestamp);
  }

  /**
   * État de synchronisation
   */
  @Get('status')
  async getSyncStatus(@Req() req: Request) {
    const userId = req.user.sub;
    return this.syncService.getSyncStatus(userId);
  }
}
```

```typescript
// src/backend/modules/sync/sync.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async processPush(
    userId: string,
    operations: Array<{
      operation: 'create' | 'update' | 'delete';
      entity_type: string;
      entity_id: string;
      payload: any;
    }>
  ) {
    const results = [];

    for (const op of operations) {
      try {
        let result;

        switch (op.operation) {
          case 'create':
            result = await this.createEntity(op.entity_type, userId, op.payload);
            break;
          case 'update':
            result = await this.updateEntity(op.entity_type, op.entity_id, userId, op.payload);
            break;
          case 'delete':
            result = await this.deleteEntity(op.entity_type, op.entity_id, userId);
            break;
        }

        results.push({ success: true, entity_id: op.entity_id, result });
      } catch (error) {
        results.push({
          success: false,
          entity_id: op.entity_id,
          error: error.message
        });
      }
    }

    return { results };
  }

  async processPull(userId: string, lastSyncTimestamp: number) {
    const [contracts, payments, claims] = await Promise.all([
      this.prisma.contract.findMany({
        where: {
          user_id: userId,
          updated_at: { gt: lastSyncTimestamp }
        }
      }),
      this.prisma.payment.findMany({
        where: {
          contract: { user_id: userId },
          updated_at: { gt: lastSyncTimestamp }
        }
      }),
      this.prisma.claim.findMany({
        where: {
          contract: { user_id: userId },
          updated_at: { gt: lastSyncTimestamp }
        }
      })
    ]);

    return {
      contracts,
      payments,
      claims,
      sync_timestamp: Date.now()
    };
  }

  private async createEntity(entityType: string, userId: string, payload: any) {
    // Implémentation selon le type d'entité
    // Exemple pour contracts:
    if (entityType === 'contracts') {
      return this.prisma.contract.create({
        data: { ...payload, user_id: userId }
      });
    }
    // ... autres types
  }

  private async updateEntity(entityType: string, id: string, userId: string, payload: any) {
    // Vérifier ownership avant update
    // ...
  }

  private async deleteEntity(entityType: string, id: string, userId: string) {
    // Soft delete avec deleted_at
    // ...
  }

  async getSyncStatus(userId: string) {
    // Retourner statistiques de sync
    return {
      last_sync_at: await this.getLastSyncTimestamp(userId),
      pending_changes: 0 // À calculer
    };
  }
}
```

---

### Configuration Supabase pour Sync

```sql
-- migrations/20250101_add_sync_columns.sql

-- Ajouter colonnes de sync aux tables existantes
ALTER TABLE contracts 
  ADD COLUMN IF NOT EXISTS synced BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sync_pending BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE payments 
  ADD COLUMN IF NOT EXISTS synced BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sync_pending BOOLEAN DEFAULT TRUE;

ALTER TABLE claims 
  ADD COLUMN IF NOT EXISTS synced BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sync_pending BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index pour optimiser les requêtes de sync
CREATE INDEX IF NOT EXISTS idx_contracts_updated_at ON contracts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_updated_at ON payments(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_updated_at ON claims(updated_at DESC);

-- Trigger pour audit log des modifications
CREATE OR REPLACE FUNCTION track_entity_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at = NOW();
    NEW.sync_pending = TRUE;
  ELSIF TG_OP = 'DELETE' THEN
    -- Soft delete au lieu de hard delete
    OLD.deleted = TRUE;
    OLD.deleted_at = NOW();
    OLD.sync_pending = TRUE;
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    NEW.created_at = NOW();
    NEW.updated_at = NOW();
    NEW.sync_pending = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer triggers
DROP TRIGGER IF EXISTS track_contract_changes ON contracts;
CREATE TRIGGER track_contract_changes
  BEFORE INSERT OR UPDATE OR DELETE ON contracts
  FOR EACH ROW EXECUTE FUNCTION track_entity_changes();

-- (Répéter pour payments, claims, etc.)
```

---

### Tests de Synchronisation

```typescript
// tests/sync.spec.ts
import { db } from '../src/frontend/db/local-database';
import { syncManager } from '../src/frontend/services/sync-manager';
import { createEntity, updateEntity } from '../src/frontend/db/crud-wrapper';

describe('Offline-First Sync', () => {
  beforeEach(async () => {
    await db.open();
    await db.sync_queue.clear();
    await db.contracts.clear();
  });

  it('devrait créer un contrat en mode offline et le synchroniser plus tard', async () => {
    // Simuler mode offline
    jest.spyOn(syncManager, 'isCurrentlyOnline').mockReturnValue(false);

    const contract = await createEntity('contracts', {
      id: 'test-123',
      user_id: 'user-456',
      contract_type: 'individuel',
      status: 'draft',
      // ... autres champs
    });

    // Vérifier création locale
    const localContract = await db.contracts.get('test-123');
    expect(localContract).toBeDefined();
    expect(localContract?.synced).toBe(false);
    expect(localContract?.sync_pending).toBe(true);

    // Vérifier file d'attente
    const queueItems = await db.sync_queue.toArray();
    expect(queueItems).toHaveLength(1);
    expect(queueItems[0].operation).toBe('create');
  });

  it('devrait synchroniser automatiquement lors du retour online', async () => {
    // Test complet de sync push/pull
    // ...
  });

  it('devrait gérer les conflits avec stratégie last-write-wins', async () => {
    // Test de résolution de conflits
    // ...
  });
});
```

---

### Checklist Déploiement Offline-First

- [ ] **Installer Dexie.js** : `npm install dexie`
- [ ] **Créer schema local** : `src/frontend/db/local-database.ts`
- [ ] **Implémenter SyncManager** : `src/frontend/services/sync-manager.ts`
- [ ] **Créer hooks React** : `src/frontend/hooks/use-local-sync.ts`
- [ ] **Wrapper CRUD** : `src/frontend/db/crud-wrapper.ts`
- [ ] **Refactoriser composants** : Utiliser `createEntity/updateEntity` au lieu de `window.storage`
- [ ] **Backend endpoints** : `/api/sync/push`, `/api/sync/pull`
- [ ] **Migration DB** : Ajouter colonnes `synced`, `sync_pending`, `deleted_at`
- [ ] **Tests** : Unitaires + intégration sync
- [ ] **UI Feedback** : Barre de statut sync + notifications
- [ ] **Documentation** : Guide utilisateur mode hors-ligne

---

### Avantages de cette Architecture

| Avantage | Description |
|----------|-------------|
| ✅ **100% Offline** | Toutes les opérations fonctionnent sans connexion |
| ✅ **Sync Auto** | Synchronisation automatique dès retour online |
| ✅ **Pas de Perte** | Aucune donnée perdue même en cas de crash navigateur |
| ✅ **Conflits Gérés** | Stratégie de résolution claire (last-write-wins ou custom) |
| ✅ **Retry Intelligent** | Exponential backoff en cas d'échec réseau |
| ✅ **Transparent** | L'utilisateur ne voit pas la complexité technique |
| ✅ **Performant** | IndexedDB = stockage local rapide (milliers de records) |
| ✅ **Type-Safe** | TypeScript de bout en bout (frontend + backend) |

---

### Conclusion

Cette architecture **Offline-First** avec **Dexie.js + Sync Manager personnalisé** transforme NeoGTec en une application **résiliente** capable de fonctionner dans les zones à connectivité limitée (zones rurales RDC, coupures réseau, etc.).

**Points clés :**
1. **Base locale IndexedDB** via Dexie.js (léger + TypeScript)
2. **File d'attente des opérations** pour replay ultérieur
3. **Détection online/offline** automatique
4. **Sync bidirectionnelle** (push + pull)
5. **Gestion des conflits** intelligente
6. **Retry avec backoff** exponentiel
7. **Feedback UI** clair pour l'utilisateur

Votre application devient ainsi **véritablement utilisable sur le terrain**, pas seulement en démo dans un bureau avec fibre optique ! 🚀
