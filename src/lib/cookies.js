const ACCESS_COOKIE = 'bridge_access_token';
const REFRESH_COOKIE = 'bridge_refresh_token';
const COOKIE_BASE = 'Path=/; HttpOnly; SameSite=Lax';

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  const pairs = header.split(/;\s*/).filter(Boolean);
  const cookies = {};
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx);
    const value = pair.slice(idx + 1);
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

export function getBridgeTokens(req) {
  const cookies = parseCookies(req);
  return {
    accessToken: cookies[ACCESS_COOKIE] || '',
    refreshToken: cookies[REFRESH_COOKIE] || '',
  };
}

export function buildAuthHeaders(req, extra = {}) {
  const { accessToken } = getBridgeTokens(req);
  return accessToken
    ? { ...extra, Authorization: `Bearer ${accessToken}` }
    : { ...extra };
}

export function setBridgeTokens(res, payload) {
  const cookies = [];
  if (payload?.access_token) {
    cookies.push(`${ACCESS_COOKIE}=${encodeURIComponent(payload.access_token)}; ${COOKIE_BASE}`);
  }
  if (payload?.refresh_token) {
    cookies.push(`${REFRESH_COOKIE}=${encodeURIComponent(payload.refresh_token)}; ${COOKIE_BASE}`);
  }
  if (cookies.length > 0) {
    res.setHeader('Set-Cookie', cookies);
  }
}

export function clearBridgeTokens(res) {
  res.setHeader('Set-Cookie', [
    `${ACCESS_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `${REFRESH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  ]);
}
