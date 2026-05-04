# Compatibility Matrix

| Area | Sub-Router expectation | sub2api capability | Status | Notes |
| --- | --- | --- | --- | --- |
| Auth | `/api/dist/user/login` | `/api/v1/auth/login` | In progress | Response format + token storage mapping needed |
| Register | `/api/dist/user/register` | `/api/v1/auth/register` | In progress | Depends on `registration_enabled` |
| Session | cookie-ish dist flow | bearer + refresh token | In progress | Adapter normalizes session model |
| Site info | `/api/dist/site/info` | `/api/v1/settings/public` | In progress | Theme/template semantics differ |
| API keys | `/api/dist/token/*` | `/api/v1/keys*` | In progress | Key prefix + model list normalization |
| Usage/logs | `/api/dist/user/logs` | `/api/v1/usage*` | Planned | Need log shape translation |
| Packages | `/api/dist/site/packages` | `/api/v1/subscriptions*` | Planned | Product model mismatch |
| Payments | `/api/dist/topup/*` | `/api/v1/payment/*` | Planned | Requires payment feature enablement |
| Affiliate | `/api/dist/aff*` | partial / different semantics | Downgrade | likely hide or reshape |
| KOL/sub-distributor | dist-specific business flow | no direct equivalent | Downgrade | explicit non-support |
