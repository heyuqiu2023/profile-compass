

# Layer — "More than your degree."

A platform for UK university students to build a structured personal profile that generates purpose-built CVs, a personal portfolio website, a digital business card, and an AI assistant.

---

## Phase 1: Foundation — Landing Page, Auth & Onboarding

### Landing Page (`/`)
- Hero section with "More than your degree." heading, subheading, and two CTAs
- Four feature cards below hero (Smart CV Builder, Personal Website, Badge Wall & Card, AI Assistant)
- Clean footer with hackathon credit
- Design: white background, charcoal text (#1a1a1a), deep navy accent (#1e3a5f), warm sand highlights (#c8b89a), Inter font

### Authentication (`/auth`)
- Email/password sign up and sign in via Supabase auth
- Fields: Full name, Email (validated to end with `.ac.uk`), Password
- Redirect to `/onboarding` after signup

### Onboarding (`/onboarding`)
- 6-step multi-step form with progress bar
- Step 1: Basics (photo upload, name, headline, university, course, year, graduation)
- Step 2: About (bio, location, social links)
- Step 3: Experiences (add multiple entries with type, title, org, dates, description)
- Step 4: Skills & Interests (tag inputs)
- Step 5: Badges (achievements grid with title, issuer, date, category, icon)
- Step 6: Review summary → "Create My Layer" saves to DB, redirects to dashboard
- Steps 3-5 are skippable

### Database Setup (Supabase)
- Tables: `profiles`, `experiences`, `skills`, `interests`, `badges`, `saved_cvs`, `chat_messages`
- RLS policies for all tables (users can only access their own data)
- Trigger to auto-create profile on signup
- Storage bucket for profile photos

---

## Phase 2: Profile & Dashboard

### Dashboard (`/dashboard`)
- Sidebar navigation (desktop) / bottom nav (mobile)
- Nav items: Profile, CV Builder, My Website, Badge Wall, AI Assistant, Settings
- Welcome message with four summary cards (CVs, Website, Badge Wall, AI Assistant)

### Profile Editor (`/dashboard/profile`)
- Editable version of all onboarding fields
- Experience section as vertical timeline (newest first, type shown as colored badge)
- Badges section as editable visual grid
- Auto-save or save button

---

## Phase 3: Public Personal Website

### Public Website (`/[username]`)
- No authentication required — fully public page
- Hero: large profile photo, name, headline, university, location
- Social links row (LinkedIn, GitHub, personal site icons)
- About section with bio
- Interactive experience timeline with expand-on-click cards, color-coded type badges
- Badge Wall grid with hover scale effect
- Skills and Interests as pill tags
- "Built with Layer" footer
- Smooth scroll, fade-in animations on scroll

### Dashboard Website Preview (`/dashboard/website`)
- Preview of the generated website
- Shareable link display with "Copy Link" button

---

## Phase 4: CV Builder

### CV Builder (`/dashboard/cv`)
- **Step 1: Choose Purpose** — three selectable cards (Job Application, University Application, Social/Networking)
- **Step 2: Customise Content** — live A4 preview (left) + controls (right/bottom on mobile): toggle sections, reorder via drag-and-drop, include/exclude individual experiences, AI optimise button
- **Step 3: Export** — Download PDF (client-side generation) + Save CV with custom name
- Three distinct CV layouts tailored per purpose
- Multiple saved CVs per user

---

## Phase 5: Badge Wall & Business Card

### Badge Wall (`/dashboard/badges`)
- Visual grid of badges grouped by category
- Add, edit, reorder, delete badges

### Business Card Generator
- Standard business card ratio (3.5:2)
- Front: name, headline, university, email, social icons
- Back: top 3-4 badges as mini visual elements
- QR code linking to public website
- Export as PNG, copy link, native share on mobile

---

## Phase 6: AI Assistant

### AI Assistant (`/dashboard/assistant`)
- Chat interface (side drawer on desktop, full page on mobile)
- Two modes via toggle tabs: "Profile Help" and "CV Help"
- **Profile mode**: asks structured questions, generates polished profile entries, suggests skills/interests
- **CV mode**: accepts job/programme descriptions, tailors experience descriptions to purpose
- AI suggestions shown as styled cards with Accept/Edit buttons
- Powered by Lovable AI via Supabase edge function
- Contextual AI buttons throughout the app (next to experience descriptions, in CV builder)

---

## Phase 7: Settings & Polish

### Settings (`/dashboard/settings`)
- Edit username (affects public URL)
- Change email, password
- Delete account
- Toggle profile visibility (public/private)

### Final Polish
- Proper validation and loading states on all forms
- Mobile-first responsive design across every page
- Calm, premium aesthetic throughout

