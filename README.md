# subrouter-sub2api-bridge

Compatibility bridge workspace for adapting the `Sub-Router` frontend to the `sub2api` backend.

## Goal

This project exists to make the two upstream projects work together in a maintainable way:

- `Sub-Router`: a distributor / dist-site style frontend
- `sub2api`: a subscription-to-API gateway platform

The bridge should provide:

- API contract mapping between `/api/dist/*` expectations and `sub2api`'s `/api/v1/*`
- data model normalization
- unsupported feature detection and graceful degradation
- a documented compatibility matrix
- a development lane for extracting the current in-place hacks into a cleaner standalone integration

## Scope

### In scope

- auth/login/register/session mapping
- site info mapping
- token/API key management mapping
- subscriptions/packages mapping
- usage/logs mapping
- topup/payment mapping where possible
- feature flags / graceful hiding for unsupported features

### Out of scope

- pretending unsupported distributor-only business features exist in `sub2api`
- modifying upstream projects beyond what is needed for integration hooks
- replacing either upstream project entirely

## Repository layout

- `docs/compat-matrix.md` — feature-by-feature mapping between projects
- `docs/architecture.md` — integration architecture and design decisions
- `plans/roadmap.md` — staged implementation plan
- `docs/development.md` — local development and runtime notes
- `src/` — compatibility facade source code
- `notes/` — debugging notes and migration findings

## Upstream projects

- Sub-Router: https://github.com/abingyyds/Sub-Router
- sub2api: https://github.com/Wei-Shaw/sub2api

## Development strategy

1. inventory all `Sub-Router` frontend expectations
2. map each expectation to `sub2api` capability or explicit non-support
3. move the current adapter into a cleaner standalone compatibility layer
4. add verification for critical flows
5. document every downgrade explicitly
