import { json, ok, fail } from '../lib/http.js';
import { sub2apiClient } from '../services/sub2api-client.js';
import { mapPublicSettingsToDistSite } from '../mappers/site.js';

export function registerDistSiteRoutes(router) {
  router.get('/api/dist/site/info', async (_req, res) => {
    try {
      const { response, data } = await sub2apiClient.get('/settings/public');
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 502, fail(data?.message || 'Failed to load site info'));
        return;
      }
      json(res, 200, ok(mapPublicSettingsToDistSite(data.data)));
    } catch (error) {
      json(res, 502, fail(error instanceof Error ? error.message : 'Bridge request failed'));
    }
  });
}
