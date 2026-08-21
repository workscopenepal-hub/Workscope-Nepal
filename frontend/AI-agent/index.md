# Frontend AI Index

Use this as the frontend entry point for Workscope Nepal.

## Start here

1. Read the root `README.md`
2. Read `AI-agent/index.md`
3. Read `AI-agent/project_plan.md` only if the task is about product direction
4. Then check the frontend code and routes

## Frontend purpose

This frontend is the public React app for the Nepal tech ecosystem directory. The live app includes:

- home and about pages
- company and directory pages
- opportunities, events, and communities listings
- login and authenticated profile flow
- submission pages for contributors

Do not treat planned ideas as implemented features unless the code proves they exist.

## Source of truth

When the docs and code disagree, prefer this order:

1. live frontend code
2. route and page structure
3. API contract
4. frontend docs
5. product plan

## Main frontend files

- `frontend/src/App.jsx` — app shell and routing entry
- `frontend/src/routes.jsx` — route map
- `frontend/src/context/AuthContext.jsx` — Supabase auth session and profile state
- `frontend/src/components/ProtectedRoute.jsx` — authenticated route guard
- `frontend/src/lib/api.js` — backend API wrapper
- `frontend/src/lib/supabase.js` — Supabase client
- `frontend/src/pages/*` — route pages

## Current implementation pattern

- React + Vite powers the app
- pages are route-driven and mostly presentation-focused
- auth state is shared via context
- data requests go through the shared API helper
- public directory pages use the backend collection APIs

## Safe editing habits

- Keep changes scoped to the current route or feature
- Reuse existing patterns instead of creating parallel implementations
- Check both page logic and API usage before changing behavior
- Preserve existing auth, navigation, and route behavior unless the task explicitly asks for a change
