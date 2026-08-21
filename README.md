# Workscope Nepal

Workscope Nepal is an open-source platform for information about Nepalese IT companies. The project is currently limited to its JavaScript application boilerplate; product functionality will be added incrementally.

## Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, JavaScript
- Infrastructure: Supabase-ready configuration for future authentication and PostgreSQL use

## Structure

```text
AI-agent/   Project instructions and planning notes
backend/    Express API
frontend/   React and Vite application
```

## Local Development

Install the dependencies manually from the repository root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Create local environment files from the examples before starting the applications:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

The API health check is available at `http://localhost:5000/api/health`.

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

No Supabase credentials are included in this repository. Fill in local environment values for local development.

## Database migrations

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and authenticate with your Supabase project. The schema source of truth is in `supabase/migrations`.

Run locally:

```bash
supabase start
supabase db reset
```

Apply to a remote project after linking it:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

To create the initial administrator in a controlled SQL session, set `app.initial_admin_user_id` to the existing authenticated user's UUID and run `select public.promote_initial_admin();`. Never expose this operation as a normal API endpoint.

The backend exposes public reads at `/api/companies`, `/api/opportunities`, `/api/events`, and `/api/communities`, plus authenticated `/api/profile`, `/api/submissions`, and `/api/submission-messages`. Admins review submissions with `PATCH /api/submissions/:id`.
