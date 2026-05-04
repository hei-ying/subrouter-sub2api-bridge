# Architecture

## Approach

This repository is for the bridge itself, not for replacing either upstream project.

We expect to support one or both of these integration modes:

1. frontend adapter mode
   - patch or wrap `Sub-Router` API calls
   - normalize `sub2api` responses into `Sub-Router`'s expected shapes

2. backend facade mode
   - expose `/api/dist/*` endpoints through a thin compatibility service
   - translate requests into `sub2api` `/api/v1/*`
   - centralize mapping logic outside the frontend

## Likely direction

A backend facade is the cleaner long-term option because it:

- isolates incompatible business semantics
- reduces frontend-only hacks
- enables better testing
- allows graceful feature gating for unsupported areas

## Key design constraints

- `Sub-Router` and `sub2api` are not the same product model
- unsupported features must fail explicitly, not silently
- authentication/session handling must be deterministic
- payment and subscription semantics require careful translation
