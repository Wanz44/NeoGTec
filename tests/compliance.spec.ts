/**
 * 🛰️ Fichier : /tests/compliance.spec.ts
 * 🎯 Objectif : Automatisation de tests de non-régression et de légalité RBAC (NeoGTec)
 * CONFORMITÉ : ARCA-RDC Multi-Tenant Isolation, Bloqueur de Fuite de Données
 */

import { test, expect } from "@playwright/test";

test.describe("Vérification et Non-Leak Multi-Tenant & RBAC (NeoGTec)", () => {

  // Test 1: Paul (SUPER_ADMIN) accède à la console SaaS et voit les boutons associés
  test("Paul (Super Admin) - Visualise les options d'administration SaaS globale", async ({ page }) => {
    // 1. Simuler l'authentification de Paul
    await page.goto("/login");
    await page.fill("#login-email", "paul@neogtec.com");
    await page.fill("#login-password", "superSecurePaul2026!");
    await page.click("#login-submit-btn");

    // 2. Doit être redirigé vers l'interface ou dashboard d'administration globale
    await expect(page).toHaveURL(/.*dashboard/);

    // 3. Vérifier que la barre latérale comprend bien l'icône de console SaaS
    const saasSidebarLink = page.locator("#sidebar-link-saas");
    await expect(saasSidebarLink).toBeVisible();

    // 4. Doit pouvoir cliquer dessus et visualiser le registre de conventionnement SaaS
    await saasSidebarLink.click();
    await expect(page.locator("h1")).toContainText("Console Cloud & Licences Contrats");
  });

  // Test 2: Marie (RH_ENTREPRISE / ACME) ne voit pas de console SaaS (Zero Leak)
  test("Marie (RH Entreprise) - Ne peut absolument pas voir les options SaaS", async ({ page }) => {
    // 1. Authentification de Marie
    await page.goto("/login");
    await page.fill("#login-email", "m.kapend@acme.cd");
    await page.fill("#login-password", "marieKapend2026!");
    await page.click("#login-submit-btn");

    // 2. Accès au dashboard RH de son entreprise
    await expect(page).toHaveURL(/.*dashboard/);

    // 3. La console d'administration SaaS doit être absente de la barre latérale
    const saasSidebarLink = page.locator("#sidebar-link-saas");
    await expect(saasSidebarLink).not.toBeVisible();

    // 4. Tentative d'accès forcé par l'URL -> Redirige vers la page d'interdiction 403
    await page.goto("/saas/tenants");
    await expect(page).toHaveURL(/.*403/);
  });

  // Test 3: Jean (SUPPORT_CLIENT ou ASSURÉ) ne voit pas de bouton Approuver la Prise En Charge (PEC) (Anti Privilege Escalation)
  test("Jean (Support) - Visualise la PEC mais ne possède pas le bouton approbation", async ({ page }) => {
    // 1. Authentification de Jean
    await page.goto("/login");
    await page.fill("#login-email", "jean.m@acme.cd");
    await page.fill("#login-password", "jeanSupport2026!");
    await page.click("#login-submit-btn");

    // 2. Accès au profil
    await expect(page).toHaveURL(/.*dashboard/);

    // 3. Recherche de l'onglet PEC ou accès par URL directe
    await page.goto("/hopital/pec/PEC-001");

    // 4. Le bouton d'approbation d'urgence doit être verrouillé (disabled avec l'icône de clé)
    const disabledButton = page.locator("#approve-pec-locked");
    await expect(disabledButton).toBeVisible();

    // 5. Le bouton d'approbation standard utilisable par les médecins ne doit pas être visible ou cliquable
    const activeApproveButton = page.locator("#approve-pec-btn");
    await expect(activeApproveButton).not.toBeVisible();
  });
});
