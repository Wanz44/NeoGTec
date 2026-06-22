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
