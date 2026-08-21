# Frontend Rules

- Use JavaScript and JSX only. Do not create `.ts` or `.tsx` files.
- Do not add dependencies unless the requested behavior requires them.
- Do not put Supabase credentials or secrets in source code.
- Keep authentication state global; do not duplicate auth logic across pages.
- Reuse existing components and `src/lib/utils.js` where appropriate.
- Do not configure database tables, create mock data, or add unrelated features.
- Make incremental changes and preserve unrelated frontend behavior.
