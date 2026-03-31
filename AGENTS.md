# Murabbiyona LMS

## Cursor Cloud specific instructions

### Overview
Murabbiyona is a client-side React SPA (Learning Management System) for teachers/schools in Uzbekistan. There is no backend in this repo — the app connects to a hosted **Supabase** instance for auth, database, and storage.

### Prerequisites
- **Node.js 22.x** (pre-installed)
- **npm** as the package manager (lockfile: `package-lock.json`)

### Environment Variables
Copy `.env.example` to `.env` and fill in real Supabase credentials:
- `VITE_SUPABASE_URL` — must be a valid URL (e.g. `https://xyz.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — the Supabase anonymous/public key

Without real credentials, the app renders the login/register UI but authentication and data operations will fail.

### Common Commands
All commands are defined in `package.json`:
- `npm run dev` — start Vite dev server (default: `localhost:5173`)
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run preview` — preview production build

### Gotchas
- The `.env.example` uses `https://placeholder.supabase.co` as a placeholder URL. The Supabase client requires a valid URL format; raw strings like `your_supabase_url` will cause a runtime crash.
- The app's UI is in Uzbek by default (with Russian and English translations via i18next).
- There are ~27 pre-existing ESLint errors in the codebase (mostly `@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`, and `react-hooks/preserve-manual-memoization`). These are not regressions.
- No automated test suite exists in this repo.
