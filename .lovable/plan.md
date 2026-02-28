

## What's Already Built vs What's Needed

| Prompt | Status | Notes |
|--------|--------|-------|
| 1. CV Builder | ✅ Done | 3-step wizard with purpose, customise, templates, PDF export |
| 2. Public Website | ⚠️ Partial | Exists at `/demo` with hardcoded data; needs `/u/:username` route fetching from DB |
| 3. Website Preview | ❌ Not built | Still "coming soon" placeholder |
| 4. Badge Wall | ❌ Not built | Still "coming soon" placeholder |
| 5. AI Assistant | ✅ Done | Streaming chat with quick actions + Apply to Profile |
| 6. Profile Polish | ✅ Done | Full editor with timeline, tag inputs, photo upload |
| 7. Landing Page | ✅ Done | Hero, features, footer |

## What Needs Building (3 features)

### 1. Save CV Configuration to Database
The CV Builder exports PDF but doesn't save configurations. Add:
- **Migration**: Create `saved_cvs` table (id, user_id, name, purpose, template, visibility JSON, created_at) with RLS
- **UI**: Add a "Save CV" button on Step 3 with a name input dialog
- **Note**: This requires auth to be wired up; for now we can build the table and UI

### 2. Public Website at `/u/:username`
Currently `/demo` uses hardcoded data. Need:
- **Migration**: Add `username` column to `profiles` table (unique, text)
- **RLS**: Add public SELECT policy for profiles by username (read-only, no auth required)
- **New route**: `/u/:username` that fetches profile + experiences + badges from DB
- **Reuse** the existing `PublicProfile.tsx` design but make it data-driven
- **404 handling** when username not found
- **Note**: Experiences and badges are currently only in ProfileContext (not in DB). We'd need `experiences` and `badges` tables too, or keep the current approach and just make `/u/:username` work with mock data for the demo

### 3. Website Preview Dashboard Page (`/dashboard/website`)
Replace placeholder with:
- Heading "Your Personal Website"
- Shareable URL box with Copy Link button
- "View Website" button opening `/u/[username]` in new tab
- Embedded preview (iframe or styled card)

### 4. Badge Wall Dashboard Page (`/dashboard/badges`)
Replace placeholder with:
- Badge grid with category-colored labels
- Add/Edit/Delete badge functionality (already in ProfileEditor, but needs its own dedicated page)
- Digital Business Card with QR code (needs `qrcode.react` dependency)
- Download Card as PNG button

## Recommended Priority for This Implementation

Given that **experiences and badges aren't persisted to the database yet**, the public website and saved CVs features would only work with demo data. The most impactful things to build now:

1. **Badge Wall page** — visual, self-contained, works with ProfileContext
2. **Website Preview page** — quick win, ties things together
3. **Public Website route `/u/:username`** — can work with demo data for now, upgrade to DB later
4. **Save CV config** — requires DB tables

## Implementation Steps

### Step 1: Badge Wall Page (`/dashboard/badges`)
- Create `src/pages/BadgeWall.tsx` with:
  - Badge grid (2 cols mobile, 3-4 desktop) using ProfileContext data
  - Category-colored labels (Certification=blue, Award=gold, Achievement=green, Competition=purple, Publication=grey)
  - Add/Edit/Delete badge modal (reuse pattern from ProfileEditor)
  - Digital Business Card section: styled 3.5:2 ratio card with name, headline, university, social icons
  - QR code via `qrcode.react` linking to `/u/[username]`
  - Download Card button (html2canvas → PNG)
  - Copy Link and Share buttons
- Add `qrcode.react` dependency
- Update `App.tsx` route

### Step 2: Website Preview Page (`/dashboard/website`)
- Create `src/pages/WebsitePreview.tsx` with:
  - "Your Personal Website" heading
  - URL display box with Copy Link button (sonner toast "Copied!")
  - "View Website" button → `window.open`
  - Styled preview card showing hero section (name, headline, photo from ProfileContext)
- Update `App.tsx` route

### Step 3: Public Website at `/u/:username`
- Refactor `PublicProfile.tsx` to accept dynamic data (or create new component)
- Add route `/u/:username` in `App.tsx`
- For now, use demo data (same as ProfileContext default) when username matches "demotozero"
- Show 404 for unknown usernames
- Later: add `username` column to profiles and fetch from DB

### Step 4: Save CV to Database
- Migration: `saved_cvs` table with RLS
- Add "Save CV" button with name input dialog in CVBuilder Step 3
- Save purpose, template, visibility config as JSON

