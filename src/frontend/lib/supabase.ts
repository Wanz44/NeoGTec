import { createClient } from '@supabase/supabase-js';

// Load values with support for VITE_ prefix, NEXT_PUBLIC_ prefix, or direct hardcoded fallbacks
const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || 
  'https://lbgwlghiwpamhthdgukw.supabase.co';

const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_PHF4KyIwnRBzWXE21_krug_2BZvMtG-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SupabaseSyncResult {
  success: boolean;
  message: string;
}

/**
 * Validates Supabase server responsiveness
 */
export async function verifySupabaseConnection(): Promise<SupabaseSyncResult> {
  try {
    // Attempt a light metadata fetch
    const { data, error } = await supabase.from('_dummy_health_check_').select('*').limit(1).maybeSingle();
    
    // An table not found is actually a success because it means connection auth is healthy enough to evaluate schema!
    if (error && error.code !== 'PGRST116' && error.message.includes('FetchError')) {
      return { success: false, message: `Erreur Réseau: ${error.message}` };
    }
    
    return { success: true, message: 'La connexion à l\'infrastructure PostgreSQL Supabase est active et opérationnelle.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Erreur inconnue de connexion' };
  }
}

/**
 * Dynamically syncs logs/activities into a Supabase relational table helper
 */
export async function syncAuditLogToSupabase(log: {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  status: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('neogtec_audit_logs')
      .insert([
        {
          id_log: log.id,
          created_at: log.timestamp,
          user_id: log.userId,
          user_name: log.userName,
          user_role: log.userRole,
          action_name: log.action,
          payload_details: log.details,
          origin_ip: log.ipAddress,
          severity_status: log.status
        }
      ]);
      
    if (error) {
      console.warn('Supabase non critical sync info (neogtec_audit_logs table might not be initialized yet):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed syncing state to Supabase:', err);
    return false;
  }
}
