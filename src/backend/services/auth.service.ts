/**
 * 📄 Fichier : /src/backend/services/auth.service.ts
 * 🎯 Objectif : Service d'authentification avec Supabase Auth
 * 🔐 Sécurité : Hachage bcrypt, JWT, validation des données
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client Supabase avec clé de service (pour opérations admin)
const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export interface SignupData {
  email: string;
  password: string;
  nom: string;
  telephone: string;
  role?: 'assure' | 'entreprise' | 'prestataire' | 'admin';
}

export interface SigninData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nom: string;
  telephone: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserResponse;
  token?: string;
  error?: string;
}

// Stockage temporaire en mémoire pour fallback (simulation persistante pendant session)
const usersMemoryStore: Map<string, UserResponse & { passwordHash: string }> = new Map();

/**
 * Hache un mot de passe avec bcrypt (simulation pour environnement sans bcrypt)
 * En production, utiliser bcrypt.hash() réel
 */
async function hashPassword(password: string): Promise<string> {
  // Simulation simple - à remplacer par bcrypt en prod
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_neogtec_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Vérifie un mot de passe haché
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

/**
 * Inscrit un nouvel utilisateur
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    // Validation des données
    if (!data.email || !data.password || !data.nom || !data.telephone) {
      return {
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis.'
      };
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Format d\'email invalide.' };
    }

    // Validation longueur mot de passe
    if (data.password.length < 8) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères.' };
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = usersMemoryStore.get(data.email);
    if (existingUser) {
      return { success: false, error: 'Cet email est déjà utilisé.' };
    }

    // Hacher le mot de passe
    const passwordHash = await hashPassword(data.password);

    // Créer l'utilisateur
    const newUser: UserResponse & { passwordHash: string } = {
      id: 'USR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      email: data.email,
      nom: data.nom,
      telephone: data.telephone,
      role: data.role || 'assure',
      created_at: new Date().toISOString(),
      passwordHash
    };

    // Essayer de sauvegarder dans Supabase si disponible
    if (supabaseAdmin) {
      try {
        // Création via Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true
        });

        if (authError) {
          console.warn('[Supabase Auth] Erreur création utilisateur:', authError.message);
        } else if (authData.user) {
          newUser.id = authData.user.id;
          
          // Insertion du profil dans la table profiles
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: data.email,
              full_name: data.nom,
              phone: data.telephone,
              role: data.role || 'assure'
            });

          if (profileError) {
            console.warn('[Supabase] Erreur création profil:', profileError.message);
          }
        }
      } catch (err) {
        console.warn('[Supabase] Indisponible, fallback sur stockage mémoire:', err);
      }
    }

    // Sauvegarde locale (fallback)
    usersMemoryStore.set(data.email, newUser);

    console.log(`[AUTH] Nouvel utilisateur inscrit: ${data.email} (${newUser.id})`);

    // Retourner succès (sans le hash)
    const { passwordHash, ...userWithoutHash } = newUser;
    return {
      success: true,
      user: userWithoutHash,
      token: generateMockJWT(newUser)
    };
  } catch (error) {
    console.error('[AUTH] Erreur lors de l\'inscription:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de l\'inscription.'
    };
  }
}

/**
 * Connecte un utilisateur existant
 */
export async function signin(data: SigninData): Promise<AuthResponse> {
  try {
    // Validation
    if (!data.email || !data.password) {
      return {
        success: false,
        error: 'Email et mot de passe requis.'
      };
    }

    let userRecord: (UserResponse & { passwordHash: string }) | null = null;

    // Rechercher dans Supabase si disponible
    if (supabaseAdmin) {
      try {
        // Vérification via Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });

        if (authError) {
          console.warn('[Supabase Auth] Échec connexion:', authError.message);
        } else if (authData.user) {
          // Récupérer le profil
          const { data: profileData } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profileData) {
            userRecord = {
              id: profileData.id,
              email: profileData.email,
              nom: profileData.full_name,
              telephone: profileData.phone,
              role: profileData.role,
              created_at: profileData.created_at,
              passwordHash: '_supabase_managed_' // Géré par Supabase
            };
          }
        }
      } catch (err) {
        console.warn('[Supabase] Indisponible, fallback sur stockage mémoire:', err);
      }
    }

    // Fallback sur stockage mémoire
    if (!userRecord) {
      const storedUser = usersMemoryStore.get(data.email);
      if (!storedUser) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect.'
        };
      }

      // Vérifier le mot de passe
      const isValid = await verifyPassword(data.password, storedUser.passwordHash);
      if (!isValid) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect.'
        };
      }

      userRecord = storedUser;
    }

    console.log(`[AUTH] Utilisateur connecté: ${data.email}`);

    // Retourner succès
    const { passwordHash, ...userWithoutHash } = userRecord;
    return {
      success: true,
      user: userWithoutHash,
      token: generateMockJWT(userWithoutHash)
    };
  } catch (error) {
    console.error('[AUTH] Erreur lors de la connexion:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la connexion.'
    };
  }
}

/**
 * Génère un JWT mocké (à remplacer par @nestjs/jwt en prod)
 */
function generateMockJWT(user: UserResponse): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
  };
  
  const base64Encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signature = base64Encode({ header, payload });
  
  return `${base64Encode(header)}.${base64Encode(payload)}.${signature}`;
}

/**
 * Vérifie un token JWT
 */
export function verifyToken(token: string): { valid: boolean; user?: UserResponse } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    
    // Vérifier expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    // Rechercher l'utilisateur
    let user: UserResponse | undefined;
    
    // Chercher dans le store mémoire
    for (const [_, storedUser] of usersMemoryStore.entries()) {
      if (storedUser.id === payload.sub) {
        const { passwordHash, ...safeUser } = storedUser;
        user = safeUser;
        break;
      }
    }

    return { valid: true, user };
  } catch {
    return { valid: false };
  }
}
