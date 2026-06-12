/**
 * 📄 Fichier : /server.ts
 * 🎯 Objectif : Point d'entrée du serveur backend Express (Architecture Full-Stack).
 * 🔗 Liens : Fournit les API pour /src/App.tsx et gère le middleware Vite en développement.
 * 📅 Version : 1.0.0 | Node.js Runtime
 */

import express from "express"; // Framework web pour Node.js | 🔗 Fichier lié: package.json
import path from "path"; // Utilitaire de gestion des chemins de fichiers | 🔗 Module natif: path
import { createServer as createViteServer } from "vite"; // Serveur de développement Vite pour le HMR | 🔗 Fichier lié: package.json

// Fonction asynchrone d'initialisation du serveur applicatif
async function startServer() {
  const app = express(); // Instanciation de l'application Express
  const PORT = 3000; // Port d'écoute standard pour l'environnement AI Studio | 🔗 Contrainte système: Port 3000

  app.use(express.json()); // Middleware pour le parsing des corps de requêtes JSON

  // --- API ROUTES (Cœur métier) ---

  // Endpoint de vérification de santé système (Healthcheck)
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() }); // Retourne le status et l'horodatage serveur
  });

  // Mock API pour les métriques de l'assurance (Consommé par le dashboard) | 🔗 Fichier lié: /src/components/Dashboard.tsx
  app.get("/api/metrics", (req, res) => {
    res.json({
      activeUsers: 128450, // Donnée simulée : nombre d'assurés
      pendingClaims: 1240, // Donnée simulée : sinistres en attente
      revenueToday: "1.2M $" // Donnée simulée : CA du jour
    });
  });

  // 📂 Endpoint d'intégration B2B : Acquisition de Lead (Tunnel NeoGTec ARCA-RDC)
  app.post("/api/lead", (req, res) => {
    const { raison_sociale, nb_employes, assureur_actuel, besoins, nom, email_pro, phone, message, website_url_field } = req.body;

    // 1. Protection anti-bot Honeypot
    if (website_url_field) {
      return res.status(400).json({ error: "Spam bot detecté !" });
    }

    // 2. Validation basique des données obligatoires
    if (!raison_sociale || !nb_employes || !nom || !email_pro || !phone || !besoins || besoins.length === 0) {
      return res.status(400).json({ error: "Certains champs obligatoires sont manquants ou incorrects." });
    }

    // 3. Logger dans les logs serveur l'opportunité commerciale
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

    // 4. Assurer la persistence locale de test d'audit logs
    const savedLeads = [];
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

    // Retourner succes
    return res.status(200).json({
      success: true,
      message: "Demande de contrat NeoGTec enregistrée avec succès. Un conseiller va vous contacter.",
      lead_id: leadRecord.id
    });
  });

  // --- MIDDLEWARE VITE / STATIC SERVING ---

  // Configuration différentielle selon l'environnement (Dev vs Prod)
  if (process.env.NODE_ENV !== "production") {
    // Mode Développement : On utilise le serveur de build Vite en mode middleware
    const vite = await createViteServer({
      server: { middlewareMode: true }, // Intégration directe dans Express
      appType: "spa", // Mode Single Page Application
    });
    app.use(vite.middlewares); // Injection des middlewares Vite (HMR, transformations TS)
  } else {
    // Mode Production : On sert les fichiers pré-compilés du dossier 'dist'
    const distPath = path.join(process.cwd(), 'dist'); // Chemin vers les assets de production
    app.use(express.static(distPath)); // Service des fichiers statiques (JS, CSS, Images)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html')); // Fallback SPA : redirection de toutes les routes vers index.html
    });
  }

  // Lancement effectif de l'écoute réseau
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log de confirmation au démarrage
  });
}

// Exécution de la fonction de démarrage | 🔗 Entrypoint défini dans package.json sous "dev"
startServer();
