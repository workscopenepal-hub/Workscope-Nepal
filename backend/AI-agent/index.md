# Backend AI Index

Use this as the backend entry point for Workscope Nepal.

## Start here

1. Read the root `README.md`
2. Read `AI-agent/index.md`
3. Read `AI-agent/project_plan.md` only if the task is about product direction
4. Then check the backend code and schema

## Backend purpose

This backend supports the Nepal tech ecosystem directory and review workflow. The real current domains are:

- companies
- opportunities
- events
- communities
- profiles
- submissions

Do not treat planned ideas as active implementation unless the code and schema prove they exist.

## Source of truth

When the docs and code disagree, prefer this order:

1. live backend code
2. migration schema and RLS
3. route contracts
4. backend docs
5. product plan

## Runtime and structure

- Express app is created in `backend/src/app.js`
- middleware includes Helmet, CORS, JSON parsing, and rate limiting
- routes are mounted under `/api`
- Supabase handles authentication and persistent data access

## Main backend files

- `backend/src/app.js` — app setup and route registration
- `backend/src/routes/collections.js` — public directory reads
- `backend/src/routes/profile.js` — authenticated profile lookup
- `backend/src/routes/submissions.js` — submission creation and admin review
- `backend/src/routes/submissionMessages.js` — recipient message reads
- `backend/src/middleware/auth.js` — auth and admin checks
- `backend/src/validation/submissions.js` — submission validation
- `backend/src/config/env.js` — runtime configuration
- `supabase/migrations/20260821000000_initial_schema.sql` — schema and RLS

## Trust model

The backend is built around a review-first workflow:

- public reads are allowed for directory data
- contributors create entries via `submissions`
- admins approve or reject pending submissions
- approved submissions are materialized into public tables

This means submitted data is untrusted until reviewed. Do not bypass the approval flow.

## Important rules

- Keep behavior aligned with the existing Express pattern
- Read the route, middleware, validation, and migration before editing
- Do not invent tables, policies, or fields without a matching migration
- Never expose service-role keys, OAuth secrets, or credentials
- Preserve public API behavior unless a task specifically requests a change

## Current implementation pattern

The backend is not a generic service layer. It is a focused API for directory information and maintainer-controlled publishing.
