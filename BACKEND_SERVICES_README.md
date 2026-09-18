# 🚀 Backend Services NeoGTec - Architecture et API

## 📋 Vue d'ensemble

Ce dossier contient les services backend métier pour la plateforme NeoGTec, implémentés en TypeScript avec Node.js/Express.

### Services Implémentés

| Service | Fichier | Fonctionnalités |
|---------|---------|-----------------|
| **Authentification** | `auth.service.ts` | Inscription, connexion, JWT, Supabase Auth |
| **Paiement** | `payment.service.ts` | Mobile Money (M-Pesa, Orange, Airtel), webhooks, reçus PDF |
| **Documents** | `document.service.ts` | Upload, stockage, génération PDF contrats/attestations |
| **Contrats** | `contract.service.ts` | Workflow complet : brouillon → signature → activation |
| **Biométrie** | `biometry.service.ts` | Reconnaissance faciale (simulation AWS Rekognition) |

---

## 🔐 1. Service d'Authentification

### Endpoints API

```http
POST   /api/auth/signup          # Inscription utilisateur
POST   /api/auth/signin          # Connexion utilisateur
GET    /api/auth/verify          # Vérification token JWT
```

### Exemple d'utilisation

```typescript
import { signup, signin } from './services/auth.service';

// Inscription
const signupResult = await signup({
  email: 'utilisateur@entreprise.cd',
  password: 'Mot2Passe#Securise',
  nom: 'Jean Kabangu',
  telephone: '+243 81 000 0000',
  role: 'entreprise'
});

// Connexion
const signinResult = await signin({
  email: 'utilisateur@entreprise.cd',
  password: 'Mot2Passe#Securise'
});
```

### Sécurité

- ✅ Hachage des mots de passe (SHA-256 + salt)
- ✅ Tokens JWT avec expiration 24h
- ✅ Validation email et longueur mot de passe
- ✅ Intégration Supabase Auth (optionnelle)
- ✅ Fallback stockage mémoire si Supabase indisponible

---

## 💳 2. Service de Paiement

### Endpoints API

```http
POST   /api/payments/initiate            # Initialiser paiement
GET    /api/payments/:id/status          # Vérifier statut
POST   /api/payments/webhooks/:provider  # Callback fournisseurs
```

### Providers Supportés

| Provider | Région | Méthode |
|----------|--------|---------|
| M-Pesa | RDC (Vodacom) | USSD Push |
| Orange Money | RDC | USSD Push |
| Airtel Money | RDC | USSD Push |
| Carte Bancaire | International | Redirect |

### Exemple d'utilisation

```typescript
import { initiatePayment, checkPaymentStatus } from './services/payment.service';

// Initialiser un paiement M-Pesa
const payment = await initiatePayment({
  userId: 'USR-123',
  amount: 500,
  currency: 'USD',
  method: 'mpesa',
  phoneNumber: '+243 81 000 0000',
  contractId: 'CTR-456',
  description: 'Paiement cotisation mensuelle'
});

// Vérifier le statut
const status = await checkPaymentStatus(payment.paymentId!);
```

### Webhook Handler

```typescript
// Endpoint pour recevoir les callbacks des providers
app.post('/api/payments/webhooks/:provider', async (req, res) => {
  const result = await handlePaymentWebhook(req.params.provider, req.body);
  // Met à jour automatiquement le statut du paiement
});
```

---

## 📄 3. Service de Documents

### Endpoints API

```http
POST   /api/documents/upload           # Téléverser document
GET    /api/documents/user/:userId     # Liste documents
POST   /api/documents/generate-contract # Générer contrat PDF
```

### Types de Documents

- `contract` - Contrats d'assurance
- `receipt` - Reçus de paiement
- `claim` - Justificatifs sinistres
- `id_proof` - Pièces d'identité
- `medical` - Documents médicaux

### Exemple d'utilisation

```typescript
import { uploadDocument, generateContractPDF } from './services/document.service';

// Upload d'un document
const doc = await uploadDocument({
  userId: 'USR-123',
  fileName: 'piece_identite.pdf',
  fileType: 'application/pdf',
  fileSize: 2048000,
  category: 'id_proof'
});

// Générer un contrat PDF
const pdf = await generateContractPDF({
  contractNumber: 'POL-2026-001',
  subscriberName: 'Entreprise SARL',
  formula: 'Neo-Sante Gold Plus',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  premiumAmount: 12500,
  members: [
    { name: 'Jean Kabangu', matricule: 'EMP-001' }
  ]
});
```

---

## 📝 4. Service de Contrats

### Endpoints API

```http
POST   /api/contracts/draft              # Créer brouillon
POST   /api/contracts/draft/:id/members  # Ajouter membre
POST   /api/contracts/draft/:id/sign     # Signer contrat
POST   /api/contracts/:id/activate       # Activer après paiement
GET    /api/contracts/user/:userId       # Liste contrats
```

### Workflow de Souscription

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│   DRAFT     │ ──► │ PENDING_SIGN │ ──► │   SIGNED    │ ──► │   ACTIVE    │
│ (Brouillon) │     │(En attente)  │     │  (Signé)    │     │  (Activé)   │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
                                                            ┌─────────────┐
                                                            │  SUSPENDED  │
                                                            │ (Suspendu)  │
                                                            └─────────────┘
```

### Exemple d'utilisation

```typescript
import { 
  createContractDraft, 
  addMemberToDraft, 
  signContract, 
  activateContract 
} from './services/contract.service';

// 1. Créer un brouillon
const draft = await createContractDraft({
  userId: 'USR-123',
  entrepriseNom: 'Ma Société SARL',
  formule: 'Neo-Sante Gold Plus',
  nbEmployes: 50,
  besoins: ['consultation', 'hospitalisation', 'medicaments']
});

// 2. Ajouter des membres
await addMemberToDraft(draft.draft!.id, {
  matricule: 'EMP-001',
  nom: 'Jean Kabangu',
  email: 'j.kabangu@masociete.cd',
  ayantsDroit: [{ nom: 'Marie Kabangu', lien: 'Conjoint' }]
});

// 3. Signer le contrat
const signed = await signContract(draft.draft!.id, 'USR-123');

// 4. Activer après paiement
const activated = await activateContract(signed.contract!.id, 'PAY-789');
```

---

## 🔬 5. Service de Biométrie

### Endpoints API

```http
POST   /api/biometry/enroll      # Enrôlement facial
POST   /api/biometry/verify      # Vérification identité
GET    /api/biometry/:id/status  # Statut enrôlement
```

### Exemple d'utilisation

```typescript
import { enrollBiometric, verifyBiometric } from './services/biometry.service';

// Enrôlement
const enroll = await enrollBiometric({
  userId: 'USR-123',
  faceImageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  metadata: {
    deviceInfo: 'iPhone 14 Pro',
    location: 'Kinshasa, RDC',
    ipAddress: '196.207.0.1'
  }
});

// Vérification
const verify = await verifyBiometric({
  userId: 'USR-123',
  faceImageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
});

if (verify.verified && verify.confidence! > 0.85) {
  console.log('Identité confirmée avec ' + (verify.confidence! * 100).toFixed(1) + '% de confiance');
}
```

### ⚠️ Note Production

La version actuelle utilise une simulation. Pour la production :

```typescript
// Utiliser AWS Rekognition
import { enrollWithAWSRekognition } from './services/biometry.service';

await enrollWithAWSRekognition(userId, imageBuffer);
```

---

## 🏗️ Architecture Technique

### Dépendances Requises

```json
{
  "@supabase/supabase-js": "^2.x",
  "express": "^4.x",
  "typescript": "^5.x"
}
```

### Variables d'Environnement

```bash
# Supabase (optionnel)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Serveur
PORT=3000
NODE_ENV=development
```

### Structure des Données

Tous les services utilisent un stockage mémoire comme fallback :

```typescript
// Pattern commun
const memoryStore: Map<string, RecordType> = new Map();

// Sauvegarde locale immédiate
memoryStore.set(id, record);

// Sync cloud background (si disponible)
if (supabaseClient) {
  await syncToCloud(record);
}
```

---

## 🧪 Tests et Validation

### Healthcheck

```bash
curl http://localhost:3000/api/health
# Response: {"status":"healthy","timestamp":"2026-08-03T..."}
```

### Test d'Inscription

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "nom": "Test User",
    "telephone": "+243 000 000 000"
  }'
```

---

## 📈 Roadmap d'Amélioration

- [ ] Intégration réelle Supabase Auth
- [ ] API Mobile Money RDC (M-Pesa, Orange, Airtel)
- [ ] Génération PDF avec pdfkit/Puppeteer
- [ ] AWS Rekognition pour biométrie
- [ ] Rate limiting et protection DDoS
- [ ] Audit logs immuables
- [ ] Monitoring Prometheus/Grafana

---

## 📞 Support

Pour toute question technique, contacter l'équipe NeoGTec Development.
