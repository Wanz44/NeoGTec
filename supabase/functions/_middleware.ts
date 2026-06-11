/**
 * 🛰️ Fichier : /supabase/functions/_middleware.ts
 * 🎯 Objectif : Middleware Global pour Edge Functions Supabase
 * Rôle : Intercepter toutes les requêtes, valider le jeton JWT, inspecter le profil utilisateur,
 *        vérifier le statut (interdire l'accès si suspendu), gérer l'onboarding forcé,
 *        et injecter le contexte tenant_id / is_staff via set_tenant_context() pour le RLS.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

export async function handleRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Authentification requise. Jeton non fourni." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const token = authHeader.split(" ")[1];

  // Instancier le client admin de service de Supabase pour avoir accès aux profils
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  // 1. Récupérer l'utilisateur à partir du JWT
  const { data: { user }, error: authError } = await adminClient.auth.getUser(token);
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Session invalide ou expirée." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Extraire de la table public.profiles
  const { data: profile, error: dbError } = await adminClient
    .from("profiles")
    .select("tenant_id, role, status, must_change_password, suspension_reason")
    .eq("id", user.id)
    .single();

  if (dbError || !profile) {
    return new Response(
      JSON.stringify({ error: "Profil utilisateur non configuré dans NeoGTec." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Bloquer si status='suspended' avec message d'explications
  if (profile.status === "suspended") {
    const reason = profile.suspension_reason || "Non spécifié par la direction NeoGTec.";
    return new Response(
      JSON.stringify({ 
        blocked: true, 
        status: "suspended",
        message: `Votre compte a été suspendu par l'administration. Motif : ${reason}` 
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 4. Rediriger vers /onboarding si must_change_password=true
  if (profile.must_change_password) {
    return new Response(
      JSON.stringify({ 
        redirect: "/onboarding", 
        must_change_password: true,
        message: "Changement de mot de passe obligatoire requis avant toute opération." 
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 5. Injecter le contexte RLS via set_tenant_context (app.tenant_id et app.is_staff)
  const isNeoGtecStaff = ["super_admin", "support_neogtec"].includes(profile.role);
  const userTenantId = profile.tenant_id || "";

  // On crée un client Supabase avec le token de l'utilisateur pour que les RLS s'appliquent
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
  });

  // Appliquer le contexte de sécurité via la fonction SECURITY DEFINER
  const { error: contextError } = await userClient.rpc("set_tenant_context", {
    p_tenant_id: userTenantId,
    p_is_staff: isNeoGtecStaff
  });

  if (contextError) {
    console.error("Échec d'injection du contexte de sécurité RLS:", contextError);
    // On continue quand même car certaines requêtes initiales n'ont pas encore la prise en charge de cette fonction
  }

  // Répondre avec les en-têtes de contexte enrichis
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "application/json");
  responseHeaders.set("X-Tenant-Id", userTenantId);
  responseHeaders.set("X-Is-NeoGTec-Staff", String(isNeoGtecStaff));
  responseHeaders.set("X-User-Role", profile.role);

  return new Response(
    JSON.stringify({ 
      status: "authorized", 
      tenant_id: userTenantId, 
      is_staff: isNeoGtecStaff,
      role: profile.role 
    }),
    { status: 200, headers: responseHeaders }
  );
}
