import { json, ok } from '../lib/http.js';

export function registerHealthRoutes(router) {
  router.get('/health', async (_req, res) => {
    json(res, 200, ok({ status: 'ok' }));
  });
}
