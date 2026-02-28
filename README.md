# Profile Compass

A career profile builder for university students. Users sign up, complete an onboarding wizard, build a rich profile (skills, experiences, badges), generate a CV, and get a shareable public profile page — all powered by an AI assistant for career guidance.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Key Libraries**: React Router v6, TanStack Query, Recharts, Framer Motion, jsPDF

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth` | Login / Sign-up |
| `/onboarding` | Step-by-step profile setup for new users |
| `/u/:username` | Public shareable profile page |
| `/dashboard` | Authenticated user dashboard |
| `/dashboard/profile` | Full profile editor |
| `/dashboard/cv` | CV builder with quality scoring |
| `/dashboard/website` | Personal website preview |
| `/dashboard/badges` | Achievement badge collection |
| `/dashboard/assistant` | AI career guidance chat |

## Project Structure

```
src/
├── pages/          # Top-level page components
├── components/
│   ├── ui/         # shadcn/ui primitives
│   ├── dashboard/  # Sidebar, bottom nav, AI panel
│   ├── onboarding/ # Multi-step onboarding wizard steps
│   └── cv/         # CV preview and score dashboard
├── contexts/       # React context providers (auth, etc.)
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client & auto-generated types
└── lib/            # Utility helpers

supabase/
├── migrations/     # Database schema migrations
└── functions/
    ├── ai-assistant/             # AI chat edge function
    └── extract-profile-updates/  # Parses AI responses into profile updates
```

## Getting Started

```sh
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create a .env file with your Supabase URL and anon key:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. Start the development server
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run test` | Run tests (Vitest) |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |
