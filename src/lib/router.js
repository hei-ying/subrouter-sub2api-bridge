export function createRouter() {
  const routes = [];

  function register(method, path, handler) {
    routes.push({ method, path, handler });
  }

  async function handle(req, res, context = {}) {
    const url = new URL(req.url, 'http://bridge.local');
    const route = routes.find((item) => item.method === req.method && item.path === url.pathname);
    if (!route) return false;
    await route.handler(req, res, { ...context, url });
    return true;
  }

  return {
    get: (path, handler) => register('GET', path, handler),
    post: (path, handler) => register('POST', path, handler),
    put: (path, handler) => register('PUT', path, handler),
    delete: (path, handler) => register('DELETE', path, handler),
    handle,
  };
}
