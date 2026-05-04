function compilePath(path) {
  const keys = [];
  const pattern = path
    .split('/')
    .map((segment) => {
      if (!segment) return '';
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return {
    path,
    keys,
    regex: new RegExp(`^${pattern}$`),
  };
}

export function createRouter() {
  const routes = [];

  function register(method, path, handler) {
    routes.push({ method, handler, ...compilePath(path) });
  }

  async function handle(req, res, context = {}) {
    const url = new URL(req.url, 'http://bridge.local');
    const route = routes.find((item) => item.method === req.method && item.regex.test(url.pathname));
    if (!route) return false;

    const match = url.pathname.match(route.regex);
    const params = {};
    route.keys.forEach((key, index) => {
      params[key] = match?.[index + 1] ? decodeURIComponent(match[index + 1]) : '';
    });

    await route.handler(req, res, { ...context, url, params });
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
