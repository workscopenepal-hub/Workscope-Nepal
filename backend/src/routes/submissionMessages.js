import { Router } from 'express';
import { requireUser } from '../middleware/auth.js';

export function createSubmissionMessagesRouter() {
  const router = Router();

  router.get('/', requireUser, async (request, response) => {
    const { data, error } = await request.supabase
      .from('submission_messages')
      .select('id, submission_id, recipient_id, message, created_at, read_at')
      .eq('recipient_id', request.user.id)
      .order('created_at', { ascending: false });

    if (error) return response.status(500).json({ error: 'Unable to load messages.' });
    response.json(data);
  });

  return router;
}