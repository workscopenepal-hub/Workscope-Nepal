import 'dotenv/config';

export const config = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export function hasSupabaseConfig() {
  return Boolean(config.supabaseUrl && config.supabasePublishableKey);
}
