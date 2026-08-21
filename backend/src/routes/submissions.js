import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAdmin, requireUser } from '../middleware/auth.js';
import { submissionTypes, validateSubmission } from '../validation/submissions.js';

const submissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

export function createSubmissionRouter() {
  const router = Router();

  router.post('/', submissionRateLimit, requireUser, async (request, response) => {
    const { type, data } = request.body;
    if (!submissionTypes.includes(type) || !data || typeof data !== 'object' || Array.isArray(data)) {
      return response.status(400).json({ error: 'A valid submission type and data object are required.' });
    }

    const validationError = validateSubmission(type, data);
    if (validationError) return response.status(400).json({ error: validationError });

    const { data: submission, error } = await request.supabase
      .from('submissions')
      .insert({ submitted_by: request.user.id, type, data })
      .select('id, submitted_by, type, data, status, created_at, updated_at')
      .single();

    if (error) return response.status(400).json({ error: 'Unable to create submission.' });
    response.status(201).json(submission);
  });

  router.get('/', requireUser, async (request, response) => {
    const { data: profile } = await request.supabase.from('profiles').select('role').eq('id', request.user.id).single();
    const query = request.supabase.from('submissions').select('*').order('created_at', { ascending: false });
    const { data, error } = profile?.role === 'admin'
      ? await query
      : await query.eq('submitted_by', request.user.id);

    if (error) return response.status(500).json({ error: 'Unable to load submissions.' });
    response.json(data);
  });

  router.patch('/:id', requireUser, requireAdmin, async (request, response) => {
    const { status, review_note: reviewNote } = request.body;
    if (!['approved', 'rejected'].includes(status)) {
      return response.status(400).json({ error: 'Status must be approved or rejected.' });
    }

    const { data: submission, error } = await request.supabase
      .from('submissions')
      .update({ status, reviewed_by: request.user.id, reviewed_at: new Date().toISOString(), review_note: reviewNote || null })
      .eq('id', request.params.id)
      .eq('status', 'pending')
      .select('*')
      .single();

    if (error) return response.status(404).json({ error: 'Submission not found.' });

    if (status === 'rejected') {
      const { error: messageError } = await request.supabase.from('submission_messages').insert({
        submission_id: submission.id,
        recipient_id: submission.submitted_by,
        message: reviewNote || 'Your submission was rejected.',
      });
      if (messageError) return response.status(500).json({ error: 'Submission updated, but the rejection message failed.' });
    }

    response.json(submission);
  });

  return router;
}
