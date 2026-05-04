import { env } from '../config/env.js';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.requestTimeoutMs);
  try {
    const response = await fetch(`${env.sub2apiBaseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    return { response, data };
  } finally {
    clearTimeout(timeout);
  }
}

export const sub2apiClient = {
  get(path, headers = {}) {
    return request(path, { method: 'GET', headers });
  },
  post(path, body, headers = {}) {
    return request(path, { method: 'POST', headers, body: JSON.stringify(body || {}) });
  },
  put(path, body, headers = {}) {
    return request(path, { method: 'PUT', headers, body: JSON.stringify(body || {}) });
  },
  delete(path, headers = {}) {
    return request(path, { method: 'DELETE', headers });
  },
};
