import { createClient } from '@supabase/supabase-js';
import { config, hasSupabaseConfig } from '../config/env.js';

export function createPublicClient() {
  return hasSupabaseConfig() ? createClient(config.supabaseUrl, config.supabasePublishableKey) : null;
}

export function createRequestClient(request) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token || !hasSupabaseConfig()) return null;

  return createClient(config.supabaseUrl, config.supabasePublishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
