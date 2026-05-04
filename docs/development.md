# Development

## Run locally

```bash
cd /root/subrouter-sub2api-bridge
npm run dev
```

Defaults:

- bridge host: `0.0.0.0`
- bridge port: `3099`
- sub2api upstream: `http://127.0.0.1:8080/api/v1`

Environment variables:

- `BRIDGE_HOST`
- `BRIDGE_PORT`
- `SUB2API_BASE_URL`
- `BRIDGE_REQUEST_TIMEOUT_MS`

## Current implementation status

Implemented:

- `GET /health`
- `GET /api/dist/site/info`
- `POST /api/dist/user/login`
- `POST /api/dist/user/register`
- `GET /api/dist/user/self`
- `POST /api/dist/user/logout`
- `GET /api/dist/token/list`
- `POST /api/dist/token/create`
- `PUT /api/dist/token/:id`
- `DELETE /api/dist/token/:id`
- `GET /api/dist/token/:id/models`
- `GET /api/dist/site/key-groups`
- `GET /api/dist/site/key-groups/:id/pricing`

Planned next:

- auth facade routes
- token facade routes
- usage/logs facade routes
- subscription/package facade routes
- payment facade routes
