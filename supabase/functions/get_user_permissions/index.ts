/**
 * 🛰️ Fichier : /supabase/functions/get_user_permissions/index.ts
 * 🎯 Objectif : Calcul des permissions consolidées (Rôles + Overrides)
 * Cache : Supabase Edge Config (60s cache TTL simulated for edge resolution)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Cache local mémoire à l'Edge (60 secondes)
const permissionsCache = new Map<string, { permissions: string[]; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 1000;

serve(async (req) => {
  // Gérer les en-têtes CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Autorisation requise" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = authHeader.split(" ")[1];
    
    // Instancier le client admin de service
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // 1. Récupérer l'ID utilisateur à partir du Token JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = user.id;

    // 2. Vérifier si les permissions sont déjà en cache
    const cachedEntry = permissionsCache.get(userId);
    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      return new Response(JSON.stringify({ permissions: cachedEntry.permissions, cached: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=60",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 3. Charger le rôle depuis le profil
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profil utilisateur introuvable" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const role = profile.role;

    // 4. Charger les permissions liées au rôle
    const { data: rolePerms, error: rolePermsError } = await supabase
      .from("role_permissions")
      .select("permission_code")
      .eq("role", role);

    if (rolePermsError) throw rolePermsError;
    const permissionsSet = new Set<string>(rolePerms.map((rp) => rp.permission_code));

    // 5. Charger les surcharges (Overrides) spécifiques de l'utilisateur
    const { data: overrides, error: overridesError } = await supabase
      .from("user_permissions_override")
      .select("permission_code, is_granted")
      .eq("user_id", userId);

    if (overridesError) throw overridesError;

    // Appliquer les autorisations ou révocations manuelles
    if (overrides) {
      overrides.forEach((ov) => {
        if (ov.is_granted) {
          permissionsSet.add(ov.permission_code);
        } else {
          permissionsSet.delete(ov.permission_code);
        }
      });
    }

    const finalPermissions = Array.from(permissionsSet);

    // 6. Sauvegarder dans le cache local de l'Edge Function
    permissionsCache.set(userId, {
      permissions: finalPermissions,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return new Response(JSON.stringify({ permissions: finalPermissions, cached: false }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=60",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
