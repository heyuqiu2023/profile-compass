

## Rename "Layer" to "Lumora"

### Files to edit (11 total)

**`index.html`** — Update `<title>`, `<meta name="author">`, `og:title`, `twitter:title` from "Layer" to "Lumora"

**`src/pages/Index.tsx`** — Nav logo text, footer "Layer © 2026" → "Lumora © 2026"

**`src/pages/Onboarding.tsx`** — Header logo text, "Create My Layer 🚀" → "Create My Lumora 🚀"

**`src/pages/Auth.tsx`** — "Sign in to your Layer account" → "Lumora account", "Built with Layer" → "Built with Lumora"

**`src/pages/DashboardHome.tsx`** — "Your Layer is live" → "Your Lumora is live"

**`src/pages/DashboardLayout.tsx`** — Mobile header logo text

**`src/pages/AIAssistant.tsx`** — "Layer AI Assistant" → "Lumora AI Assistant"

**`src/pages/PublicProfile.tsx`** — Footer "Built with Layer"

**`src/components/dashboard/DashboardSidebar.tsx`** — Sidebar logo text

**`src/components/onboarding/StepReview.tsx`** — "creating your Layer" → "creating your Lumora"

**`supabase/functions/ai-assistant/index.ts`** — "Layer AI" → "Lumora AI" in system prompt

### Not touched
- `src/components/ui/chart.tsx` — `recharts-layer` is a CSS class from Recharts library, not our brand name

