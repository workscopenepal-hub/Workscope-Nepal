import { Router } from 'express';
import { requireUser } from '../middleware/auth.js';

export function createProfileRouter() {
  const router = Router();

  router.get('/', requireUser, async (request, response) => {
    const { data, error } = await request.supabase
      .from('profiles')
      .select('id, public_id, role, created_at, updated_at')
      .eq('id', request.user.id)
      .single();

    if (error) return response.status(404).json({ error: 'Profile not found.' });
    response.json(data);
  });

  return router;
}
