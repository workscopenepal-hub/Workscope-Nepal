# Architecture

## Current Foundation

- `frontend/` contains the React and Vite JavaScript application.
- `backend/` contains the Node.js and Express JavaScript API.
- Supabase provides authentication and PostgreSQL infrastructure.
- Google OAuth is handled through Supabase Auth.

Keep frontend and backend responsibilities separate. Add an abstraction only when the current behavior requires it.
