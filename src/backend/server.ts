/**
 * 📄 Fichier : /src/backend/server.ts
 * 🎯 Objectif : Point d'entrée du serveur backend Express (Architecture Full-Stack).
 * 🔗 Liens : Fournit les API pour /src/App.tsx et gère le middleware Vite en développement.
 * 📅 Version : 2.0.0 | Node.js Runtime avec Services Métier
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Import des services métier
import { signup, signin, verifyToken } from "./services/auth.service";
import { initiatePayment, checkPaymentStatus, handlePaymentWebhook } from "./services/payment.service";
import { uploadDocument, getUserDocuments, generateContractPDF } from "./services/document.service";
import { 
  createContractDraft, 
  addMemberToDraft, 
  signContract, 
  activateContract, 
  getUserContracts 
} from "./services/contract.service";
import { enrollBiometric, verifyBiometric, isEnrolled } from "./services/biometry.service";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' })); // Augmenté pour uploads de documents

  // --- API ROUTES AUTHENTIFICATION ---

  // POST /api/auth/signup - Inscription utilisateur
  app.post("/api/auth/signup", async (req, res) => {
    const result = await signup(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // POST /api/auth/signin - Connexion utilisateur
  app.post("/api/auth/signin", async (req, res) => {
    const result = await signin(req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  });

  // GET /api/auth/verify - Vérification token
  app.get("/api/auth/verify", (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ valid: false, error: 'Token requis' });
    }
    const result = verifyToken(token);
    res.json(result);
  });

  // --- API ROUTES PAIEMENT ---

  // POST /api/payments/initiate - Initialiser un paiement
  app.post("/api/payments/initiate", async (req, res) => {
    const result = await initiatePayment(req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // GET /api/payments/:paymentId/status - Vérifier statut paiement
  app.get("/api/payments/:paymentId/status", async (req, res) => {
    const result = await checkPaymentStatus(req.params.paymentId);
    res.json(result);
  });

  // POST /api/payments/webhooks/:provider - Webhook fournisseurs
  app.post("/api/payments/webhooks/:provider", async (req, res) => {
    const result = await handlePaymentWebhook(req.params.provider, req.body);
    res.json(result);
  });

  // --- API ROUTES DOCUMENTS ---

  // POST /api/documents/upload - Téléverser un document
  app.post("/api/documents/upload", async (req, res) => {
    const result = await uploadDocument(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // GET /api/documents/user/:userId - Documents d'un utilisateur
  app.get("/api/documents/user/:userId", (req, res) => {
    const docs = getUserDocuments(req.params.userId, req.query.category as string);
    res.json(docs);
  });

  // POST /api/documents/generate-contract - Générer contrat PDF
  app.post("/api/documents/generate-contract", async (req, res) => {
    const result = await generateContractPDF(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // --- API ROUTES CONTRATS ---

  // POST /api/contracts/draft - Créer brouillon contrat
  app.post("/api/contracts/draft", async (req, res) => {
    const result = await createContractDraft(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // POST /api/contracts/draft/:draftId/members - Ajouter membre
  app.post("/api/contracts/draft/:draftId/members", async (req, res) => {
    const result = await addMemberToDraft(req.params.draftId, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // POST /api/contracts/draft/:draftId/sign - Signer contrat
  app.post("/api/contracts/draft/:draftId/sign", async (req, res) => {
    const result = await signContract(req.params.draftId, req.body.userId);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // POST /api/contracts/:contractId/activate - Activer contrat
  app.post("/api/contracts/:contractId/activate", async (req, res) => {
    const result = await activateContract(req.params.contractId, req.body.paymentId);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // GET /api/contracts/user/:userId - Contrats d'un utilisateur
  app.get("/api/contracts/user/:userId", (req, res) => {
    const contracts = getUserContracts(req.params.userId, req.query.status as string);
    res.json(contracts);
  });

  // --- API ROUTES BIOMETRIE ---

  // POST /api/biometry/enroll - Enrôlement biométrique
  app.post("/api/biometry/enroll", async (req, res) => {
    const result = await enrollBiometric(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // POST /api/biometry/verify - Vérification biométrique
  app.post("/api/biometry/verify", async (req, res) => {
    const result = await verifyBiometric(req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });

  // GET /api/biometry/:userId/status - Statut enrôlement
  app.get("/api/biometry/:userId/status", (req, res) => {
    const enrolled = isEnrolled(req.params.userId);
    res.json({ enrolled });
  });

  // --- ROUTES EXISTANTES ---

  // Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Metrics mock
  app.get("/api/metrics", (req, res) => {
    res.json({
      activeUsers: 128450,
      pendingClaims: 1240,
      revenueToday: "1.2M $"
    });
  });

  // Lead B2B
  app.post("/api/lead", (req, res) => {
    const { raison_sociale, nb_employes, assureur_actuel, besoins, nom, email_pro, phone, message, website_url_field } = req.body;

    if (website_url_field) {
      return res.status(400).json({ error: "Spam bot detecté !" });
    }

    if (!raison_sociale || !nb_employes || !nom || !email_pro || !phone || !besoins || besoins.length === 0) {
      return res.status(400).json({ error: "Certains champs obligatoires sont manquants ou incorrects." });
    }

    console.log(`
      📬 [EXPRESS LEAD RECEIVED]
      -----------------------------------------------
      Raison Sociale : ${raison_sociale} (${nb_employes} salariés)
      Assureur : ${assureur_actuel || 'Aucun'}
      Besoins : ${besoins.join(', ')}
      Contact : ${nom} (${email_pro} / Tél: ${phone})
      Message : ${message || 'Aucun'}
      -----------------------------------------------
    `);

    const leadRecord = {
      id: "LD-" + Math.floor(100000 + Math.random() * 900000),
      raison_sociale,
      nb_employes,
      assureur_actuel,
      besoins,
      nom,
      email_pro,
      phone,
      message,
      status: 'DEMANDE',
      created_at: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: "Demande de contrat NeoGTec enregistrée avec succès. Un conseiller va vous contacter.",
      lead_id: leadRecord.id
    });
  });

  // --- MIDDLEWARE VITE / STATIC SERVING ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║  🚀 Serveur NeoGTec démarré sur http://localhost:${PORT}     ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  ✅ Auth:        /api/auth/*                              ║
    ║  ✅ Paiement:    /api/payments/*                          ║
    ║  ✅ Documents:   /api/documents/*                         ║
    ║  ✅ Contrats:    /api/contracts/*                         ║
    ║  ✅ Biométrie:   /api/biometry/*                          ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
  });
}

startServer();
