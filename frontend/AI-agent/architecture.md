# Frontend Architecture

- React and Vite with JavaScript/JSX are used for the frontend.
- Tailwind CSS and shadcn/ui provide the styling and UI foundation.
- Global concerns such as theme and authentication belong in shared providers or contexts.
- Supabase client access belongs in shared frontend utilities, not repeated inside pages.
- `AuthProvider` owns the Supabase session subscription and exposes authentication actions globally.
- `ProtectedRoute` handles access checks for authenticated pages.
- Pages should remain focused on presentation and page-level composition.
