# Backend Rules

Use these rules with the project-wide guide in the root `AI-agent/` folder.

## Keep the backend focused

- This backend is the API layer for Workscope Nepal, not a general app server.
- Keep routes small and clear. Do not add unrelated services or controllers.
- Prefer working with the existing Express pattern over creating new abstractions.

## Trust and access

- Public reads are allowed for companies, opportunities, events, and communities.
- Authenticated users may access their own profile and create submissions.
- Admins are the only users allowed to approve or reject submissions.
- Treat submitted data as untrusted until it is reviewed and approved.

## Code and schema rules

- Use JavaScript only; do not introduce TypeScript.
- Read the route, auth middleware, validation, and migration before changing behavior.
- Do not invent tables, policies, or fields without a matching migration.
- Never expose Supabase service keys, OAuth secrets, or other credentials.

## Submission flow

The live flow is:

1. user submits data through `/api/submissions`
2. submission is stored with status `pending`
3. admin reviews the submission
4. admin marks it `approved` or `rejected`
5. approved records are materialized into the public directory tables

Do not bypass this review path.

## Safe editing habits

- Preserve existing route behavior unless the task explicitly asks for a change.
- Do not change public API response shapes without checking the consuming code.
- Keep validation and database logic aligned with the real schema.
- If a task touches data trust, check both the route and the migration before editing.
