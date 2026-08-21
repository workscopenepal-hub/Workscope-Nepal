import { createRequestClient } from '../lib/supabase.js';

export async function requireUser(request, response, next) {
  const client = createRequestClient(request);
  if (!client) return response.status(401).json({ error: 'Authentication required.' });

  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return response.status(401).json({ error: 'Authentication required.' });

  request.supabase = client;
  request.user = user;
  next();
}

export async function requireAdmin(request, response, next) {
  const { data: profile, error } = await request.supabase
    .from('profiles')
    .select('id, public_id, role')
    .eq('id', request.user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    return response.status(403).json({ error: 'Administrator access required.' });
  }

  request.profile = profile;
  next();
}
