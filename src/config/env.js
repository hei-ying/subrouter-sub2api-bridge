export const env = {
  host: process.env.BRIDGE_HOST || '0.0.0.0',
  port: Number(process.env.BRIDGE_PORT || 3099),
  sub2apiBaseUrl: process.env.SUB2API_BASE_URL || 'http://127.0.0.1:8080/api/v1',
  requestTimeoutMs: Number(process.env.BRIDGE_REQUEST_TIMEOUT_MS || 30000),
};
