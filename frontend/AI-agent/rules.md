# Frontend Rules

Use these rules with the project-wide guide in the root `AI-agent/` folder.

## Keep the frontend focused

- This app is the public interface for the Nepal tech ecosystem directory.
- Keep pages and components focused on browsing, auth, and contribution flows.
- Reuse shared patterns from the existing app instead of creating parallel implementations.

## Auth and data

- Use the shared auth context for session state and profile loading.
- Use the centralized API helper for backend requests.
- Do not duplicate Supabase or fetch logic across pages.
- Keep protected routes protected; do not bypass login checks.

## Code rules

- Use JavaScript and JSX only; do not introduce TypeScript.
- Keep route and page changes aligned with the existing app structure.
- Do not add dependencies unless the task clearly requires them.
- Keep secrets and environment values out of source code.

## Public data and trust

- Directory pages are public and should reflect the backend's public collection APIs.
- Contributor submission flows are not automatically trusted.
- Do not invent company, event, opportunity, or community data.
- If the task touches trust-sensitive content, verify the backend review flow before changing UI behavior.

## Safe editing habits

- Check the route, page, and API helper before changing behavior.
- Preserve existing navigation and user flow unless the task explicitly changes it.
- Keep UI changes minimal and readable.
- Do not add unrelated features or mock data just to complete a screen.
