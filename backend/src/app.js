import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, hasSupabaseConfig } from './config/env.js';
import { createCollectionRouter } from './routes/collections.js';
import { createProfileRouter } from './routes/profile.js';
import { createSubmissionRouter } from './routes/submissions.js';
import { createSubmissionMessagesRouter } from './routes/submissionMessages.js';

export function createApp() {
  const app = express();

  if (!hasSupabaseConfig()) {
    console.warn('SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required for API routes.');
  }

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.frontendUrl }));
  app.use(express.json({ limit: '32kb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));

  app.use('/api', createCollectionRouter());
  app.use('/api/profile', createProfileRouter());
  app.use('/api/submissions', createSubmissionRouter());
  app.use('/api/submission-messages', createSubmissionMessagesRouter());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  return app;
}
