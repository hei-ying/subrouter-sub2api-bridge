import http from 'http';
import { env } from './config/env.js';
import { createRouter } from './lib/router.js';
import { json, fail } from './lib/http.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerDistSiteRoutes } from './routes/dist-site.js';
import { registerDistAuthRoutes } from './routes/dist-auth.js';
import { registerDistTokenRoutes } from './routes/dist-token.js';

const router = createRouter();
registerHealthRoutes(router);
registerDistSiteRoutes(router);
registerDistAuthRoutes(router);
registerDistTokenRoutes(router);

const server = http.createServer(async (req, res) => {
  try {
    const handled = await router.handle(req, res);
    if (!handled) {
      json(res, 404, fail(`No route for ${req.method} ${req.url}`));
    }
  } catch (error) {
    json(res, 500, fail(error instanceof Error ? error.message : 'Unexpected bridge error'));
  }
});

server.listen(env.port, env.host, () => {
  console.log(`subrouter-sub2api-bridge listening on http://${env.host}:${env.port}`);
});
