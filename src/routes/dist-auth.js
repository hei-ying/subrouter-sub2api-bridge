import { json, ok, fail, readJson } from '../lib/http.js';
import { buildAuthHeaders, clearBridgeTokens, getBridgeTokens, setBridgeTokens } from '../lib/cookies.js';
import { mapSub2ApiUserToDistUser } from '../mappers/user.js';
import { sub2apiClient } from '../services/sub2api-client.js';

async function fetchUsage(req) {
  const { response, data } = await sub2apiClient.get('/usage/dashboard/stats', buildAuthHeaders(req));
  if (!response.ok || !data || data.code !== 0) {
    return null;
  }
  return data.data || null;
}

export function registerDistAuthRoutes(router) {
  router.post('/api/dist/user/login', async (req, res) => {
    try {
      const body = await readJson(req);
      const payload = {
        email: body.email || body.username || '',
        password: body.password || '',
      };
      const { response, data } = await sub2apiClient.post('/auth/login', payload);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 401, fail(data?.message || 'Login failed'));
        return;
      }
      setBridgeTokens(res, data.data);
      json(res, 200, ok(mapSub2ApiUserToDistUser(data.data.user)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Login bridge error'));
    }
  });

  router.post('/api/dist/user/register', async (req, res) => {
    try {
      const body = await readJson(req);
      const payload = {
        email: body.email || (body.username ? `${body.username}@example.com` : ''),
        password: body.password || '',
        aff_code: body.aff_code || '',
      };
      const { response, data } = await sub2apiClient.post('/auth/register', payload);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 400, fail(data?.message || 'Register failed'));
        return;
      }
      setBridgeTokens(res, data.data);
      json(res, 200, ok(mapSub2ApiUserToDistUser(data.data.user)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Register bridge error'));
    }
  });

  router.get('/api/dist/user/self', async (req, res) => {
    try {
      const headers = buildAuthHeaders(req);
      if (!headers.Authorization) {
        json(res, 401, fail('Not logged in'));
        return;
      }
      const [{ response, data }, usage] = await Promise.all([
        sub2apiClient.get('/auth/me', headers),
        fetchUsage(req),
      ]);
      if (!response.ok || !data || data.code !== 0) {
        json(res, response.status || 401, fail(data?.message || 'Failed to load current user'));
        return;
      }
      json(res, 200, ok(mapSub2ApiUserToDistUser(data.data, usage)));
    } catch (error) {
      json(res, 500, fail(error instanceof Error ? error.message : 'Self bridge error'));
    }
  });

  router.post('/api/dist/user/logout', async (req, res) => {
    try {
      const { refreshToken } = getBridgeTokens(req);
      if (refreshToken) {
        await sub2apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
      clearBridgeTokens(res);
      json(res, 200, ok(true));
    } catch (error) {
      clearBridgeTokens(res);
      json(res, 200, ok(true));
    }
  });
}
