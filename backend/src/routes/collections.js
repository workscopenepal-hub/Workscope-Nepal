import { Router } from 'express';
import { createPublicClient } from '../lib/supabase.js';

const collectionNames = ['companies', 'opportunities', 'events', 'communities'];

export function createCollectionRouter() {
  const router = Router();

  collectionNames.forEach((resource) => {
    router.get(`/${resource}`, async (_request, response) => {
      const client = createPublicClient();
      if (!client) return response.status(503).json({ error: 'Database is not configured.' });

      const { data, error } = await client.from(resource).select('*').order('created_at', { ascending: false });
      if (error) return response.status(500).json({ error: 'Unable to load records.' });
      response.json(data);
    });

    router.get(`/${resource}/:id`, async (request, response) => {
      const client = createPublicClient();
      if (!client) return response.status(503).json({ error: 'Database is not configured.' });

      const { data, error } = await client.from(resource).select('*').eq('id', request.params.id).maybeSingle();
      if (error) return response.status(500).json({ error: 'Unable to load the record.' });
      if (!data) return response.status(404).json({ error: 'Record not found.' });
      response.json(data);
    });
  });

  return router;
}
