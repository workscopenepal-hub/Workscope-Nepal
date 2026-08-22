# Workscope Nepal

Workscope Nepal is an open-source, community-driven information platform for Nepal's technology ecosystem. It is designed as a directory and discovery layer where people can learn what companies exist in Nepal, what opportunities are available, which events are happening, and which communities are active.

This project is not only a job board. It is a practical information flow for understanding the wider tech landscape in Nepal: who is operating in the ecosystem, what they are doing, where opportunities are emerging, and how people can connect with the community.

The platform helps answer questions like:

- Which companies and teams exist in Nepal's tech ecosystem?
- What opportunities are available for developers and professionals?
- What events, meetups, and communities are relevant?
- What is the culture or working environment like at different companies?
- How can people discover information that is otherwise scattered across fragmented channels?

## Why this project exists

Information about Nepal's IT ecosystem is often spread across job boards, social media, company websites, event pages, community groups, and personal networks. Workscope Nepal brings that information together into a more discoverable and useful structure.

The goal is to make it easier for developers, students, employers, and the broader tech community to understand:

- the companies operating in Nepal
- the opportunities they offer
- the events and communities around them
- the overall momentum of the ecosystem

## Long-term vision

The long-term vision is to build a trusted source of information for Nepal's technology workforce. The platform should make it easier to:

- discover companies and workplaces
- explore career opportunities
- find relevant events and communities
- understand the ecosystem beyond just hiring
- contribute local insight and community knowledge

This is a directory and information platform first, with job discovery and opportunity discovery as important parts of the wider experience.

## Open-source philosophy

This project follows a practical engineering approach: do not reinvent the wheel when a mature, reliable open-source library, service, or platform already solves the problem well.

That said, new dependencies and integrations must still be evaluated for:

- maintenance and support
- security
- licensing
- compatibility
- performance impact
- long-term sustainability

The goal is pragmatic, maintainable software, not unnecessary complexity.

## Technology stack

The current repository is built around a simple modern stack:

- Frontend: React + Vite + JavaScript
- UI tooling: Tailwind CSS and related frontend utilities
- Backend: Node.js + Express
- Database/auth platform: Supabase
- Database: PostgreSQL via Supabase
- Authentication: Supabase Auth with Google OAuth

## High-level architecture

```text
User
  |
  v
React Frontend
  |
  v
Node.js Backend API
  |
  +----------------------+
  |                      |
  v                      v
Supabase Auth          Supabase Database
Google OAuth          PostgreSQL
```

### Frontend

The frontend is responsible for the user interface, interaction flows, client-side behavior, and requests to the backend or Supabase-powered features.

### Backend

The backend exposes API endpoints, applies server-side validation, handles business logic, and coordinates requests that depend on Supabase-backed services.

### Supabase

Supabase provides the project's backend infrastructure for authentication and data storage, including PostgreSQL and authentication features such as Google OAuth.

### Roles and moderation

Profiles use three database roles: `user`, `moderator`, and `admin`. New authenticated users receive the `user` role automatically. Moderators and admins can review submissions; only the database owner or a controlled administrator workflow should change a profile role. Role assignment is not exposed through the public application.

To promote an existing profile manually, use the Supabase SQL Editor with the user's UUID from `auth.users`:

```sql
update public.profiles
set role = 'moderator'
where id = 'USER_UUID_HERE';
```

Use `role = 'admin'` only for the project owner. Normal authenticated users cannot update the role column because profile role updates are revoked from the application database role and protected by the database trigger.

The Supabase access token is short-lived and refreshed automatically by the client session. With the default Supabase settings, access tokens last about one hour; the session normally remains active across page reloads until the user signs out, the refresh token is revoked, or the project session policy expires.

## Repository structure

```text
Workscope-Nepal/
├── AI-agent/                 # Project-wide AI and workflow guidance
├── backend/                  # Node.js Express API
├── frontend/                 # React + Vite frontend
├── supabase/                 # Supabase configuration and migrations
├── contribution_guidelines/  # Contribution policy
├── LICENSE
├── README.md
└── ...
```

### Major directories

- `AI-agent/`: project-wide instructions and planning notes
- `backend/`: server-side API, validation, config, and routes
- `frontend/`: React app and client-side logic
- `supabase/`: Supabase config, migrations, and schema-related tooling
- `contribution_guidelines/`: contribution rules and workflow guidance

## Prerequisites

Before starting local development, you should have:

- Git
- Node.js and npm
- a Supabase account/project for local configuration
- a Google Cloud project if you are configuring Google OAuth

## Clone the project

If you are just setting up locally:

```bash
git clone <repository-url>
cd Workscope-Nepal
```

If you plan to contribute, fork the repository first and follow the contribution guide in [contribution_guidelines/CONTRIBUTING.md](contribution_guidelines/CONTRIBUTING.md).

## Environment configuration

This repository includes environment example files in the relevant app folders. Copy them before running the project locally:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Important:

- Never commit `.env` files or any secrets.
- Fill in the real values for your local environment.
- Keep local configuration separate from the repository.

### Backend environment

The backend example includes values such as:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

### Frontend environment

The frontend example includes values such as:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_API_URL=
```

For local development, `VITE_API_URL` should normally point at the backend, for example:

```env
VITE_API_URL=http://localhost:5000
```

## Frontend setup

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

This starts the Vite development server. Use the local URL shown in the terminal output to access the app in the browser.

## Backend setup

From the repository root:

```bash
cd backend
npm install
npm run dev
```

The backend uses the script defined in [backend/package.json](backend/package.json), and the server listens on port `5000` by default.

The health endpoint is available at:

```text
http://localhost:5000/api/health
```

## Supabase setup

The project has Supabase configuration under [supabase/config.toml](supabase/config.toml) and migration files under [supabase/migrations](supabase/migrations).

For a local setup:

1. Create a Supabase project.
2. Copy the project URL and public keys into the backend and frontend environment files.
3. Configure the project to match your local development environment.
4. Apply the existing migrations and database configuration as needed for your setup.

Use the Supabase CLI and project configuration as needed for local or remote database setup, but do not guess values that are not present in the repository.

## Google OAuth setup

Google OAuth is part of the intended authentication flow.

The general setup is:

1. Create or select a Google Cloud project.
2. Configure the OAuth consent screen.
3. Create OAuth credentials for the application.
4. Add the correct redirect/callback URL for Supabase Auth.
5. Add the generated Google client ID and secret in Supabase authentication settings.
6. Enable the Google provider in the Supabase project.

The Supabase dashboard should be used to configure the provider, and the credentials should be stored as environment or project secrets rather than committed to the repository.

## Troubleshooting OAuth

If Google authentication is not working, check:

- Supabase auth provider configuration
- Google OAuth client configuration
- redirect URL matching
- local frontend/backend URL values
- environment variables in the project config

Official Supabase and Google documentation are the best source of truth for current OAuth setup steps.

## Running the complete project locally

Open two terminals:

### Terminal 1: frontend

```bash
cd frontend
npm run dev
```

### Terminal 2: backend

```bash
cd backend
npm run dev
```

The frontend and backend should be configured to work together through their local environment values, especially `VITE_API_URL` and `FRONTEND_URL`.

## Development workflow

A typical development flow is:

1. read the project docs
2. configure environment variables
3. run the app locally
4. read relevant AI-agent rules
5. create a branch
6. implement and test the change
7. review the diff
8. open a pull request

For the detailed contribution process, see [contribution_guidelines/CONTRIBUTING.md](contribution_guidelines/CONTRIBUTING.md).

## AI-assisted development

This project includes project-specific AI guidance in:

- [AI-agent/README.md](AI-agent/README.md)
- [AI-agent/architecture.md](AI-agent/architecture.md)
- [AI-agent/conventions.md](AI-agent/conventions.md)
- [backend/AI-agent/README.md](backend/AI-agent/README.md)
- [backend/AI-agent/rules.md](backend/AI-agent/rules.md)
- [frontend/AI-agent/README.md](frontend/AI-agent/README.md)

Contributors using AI coding assistants must still read the relevant project rules, validate generated code, and remain responsible for correctness and project standards.

## Contributing

Contributions are welcome. For the full contribution policy, including branch naming, commit expectations, testing requirements, PR description guidance, and security expectations, see [contribution_guidelines/CONTRIBUTING.md](contribution_guidelines/CONTRIBUTING.md).

## Current project status

Workscope Nepal is under active development. The architecture and feature set will continue to evolve as the project grows and the community contributes improvements.

## Community-first philosophy

This project is intended to benefit the wider Nepal technology ecosystem. It is not just a job listing or a single app feature; it is a community-oriented platform meant to make information more visible, accessible, and useful to the people involved in the ecosystem.

---

## Quick start summary

```bash
# backend
cd backend
npm install
cp .env.example .env
npm run dev

# frontend
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Then configure your Supabase project and Google OAuth credentials in the related dashboard settings, and continue with the contribution workflow in [contribution_guidelines/CONTRIBUTING.md](contribution_guidelines/CONTRIBUTING.md).
