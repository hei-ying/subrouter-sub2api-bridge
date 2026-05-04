import { json, ok, fail, readJson } from '../lib/http.js';
import { buildAuthHeaders } from '../lib/cookies.js';
import { mapSub2ApiGroupToDistKeyGroup, mapSub2ApiKeyToDistToken } from '../mappers/token.js';
import { sub2apiClient } from '../services/sub2api-client.js';

const PREVIEW_MODELS = [
  'gpt-4o-mini',
  'claude-sonnet-4-5',
  'gemini-2.5-pro',
  'deepseek-chat',
  'qwen-max',
  'grok-4',
  'claude-haiku-4-5',
  'gpt-5-mini',
];

function authOr401(req, res) {
  const headers = buildAuthHeaders(req);
  if (!headers.Authorization) {
    json(res, 401, fail('Not logged in'));
    return null;
  }
  return headers;
}

export function registerDistTokenRoutes(router) {
  router.get('/api/dist/token/list', async (req, res) => {
    const headers = authOr401(req, res);
    if (!headers) return;
    try {
      const { response, data } = await sub2apiClient.get('/keys?page=1&page_size=100', headers);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 502, fail(data?.message || 'Failed to load tokens'));
        return;
      }
      json(res, 200, ok((data.data.items || []).map(mapSub2ApiKeyToDistToken)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Token list bridge error'));
    }
  });

  router.post('/api/dist/token/create', async (req, res) => {
    const headers = authOr401(req, res);
    if (!headers) return;
    try {
      const body = await readJson(req);
      const payload = {
        name: body.name,
        group_id: body.key_group_id || body.group_id || null,
      };
      const { response, data } = await sub2apiClient.post('/keys', payload, headers);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 400, fail(data?.message || 'Failed to create token'));
        return;
      }
      json(res, 200, ok(mapSub2ApiKeyToDistToken(data.data)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Token create bridge error'));
    }
  });

  router.put('/api/dist/token/:id', async (req, res, { params }) => {
    const headers = authOr401(req, res);
    if (!headers) return;
    try {
      const body = await readJson(req);
      const payload = {};
      if (body.status) payload.status = body.status === 1 ? 'active' : 'inactive';
      if (body.name) payload.name = body.name;
      if (body.group_id !== undefined) payload.group_id = body.group_id || null;
      const { response, data } = await sub2apiClient.put(`/keys/${params.id}`, payload, headers);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 400, fail(data?.message || 'Failed to update token'));
        return;
      }
      json(res, 200, ok(mapSub2ApiKeyToDistToken(data.data)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Token update bridge error'));
    }
  });

  router.delete('/api/dist/token/:id', async (req, res, { params }) => {
    const headers = authOr401(req, res);
    if (!headers) return;
    try {
      const { response, data } = await sub2apiClient.delete(`/keys/${params.id}`, headers);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 400, fail(data?.message || 'Failed to delete token'));
        return;
      }
      json(res, 200, ok(true));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Token delete bridge error'));
    }
  });

  router.get('/api/dist/token/:id/models', async (req, res) => {
    json(res, 200, ok({
      models: PREVIEW_MODELS,
      count: PREVIEW_MODELS.length,
      provider_names: [],
      restricted_by_providers: false,
      restricted_by_models: false,
    }));
  });

  router.get('/api/dist/site/key-groups', async (req, res) => {
    const headers = authOr401(req, res);
    if (!headers) return;
    try {
      const { response, data } = await sub2apiClient.get('/groups/available', headers);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 502, fail(data?.message || 'Failed to load key groups'));
        return;
      }
      json(res, 200, ok((data.data || []).map(mapSub2ApiGroupToDistKeyGroup)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Key group bridge error'));
    }
  });

  router.get('/api/dist/site/key-groups/:id/pricing', async (_req, res, { params }) => {
    json(res, 200, ok({
      group: { id: Number(params.id) },
      summary: null,
      items: [],
    }));
  });
}
