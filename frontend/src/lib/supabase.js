import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.info('[Supabase] Client configuration', {
	hasUrl: Boolean(supabaseUrl),
	hasPublishableKey: Boolean(supabasePublishableKey),
	projectRef: supabaseUrl?.match(/^https:\/\/([^.]+)\.supabase\.co$/)?.[1] ?? null,
});

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
