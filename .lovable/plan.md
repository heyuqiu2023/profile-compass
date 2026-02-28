

## CV Builder — Implementation Plan

### Overview
A 3-step wizard at `/dashboard/cv` that lets users choose a CV purpose, customise visible sections/entries with a live A4 preview, and export as PDF.

### New Dependencies
- `html2canvas` and `jspdf` for PDF generation

### Files to Create

**`src/pages/CVBuilder.tsx`** — Main page with 3-step flow:

**Step 1 — Choose Purpose:** Three selectable cards (Job Application, University Application, Social/Networking) with icons and descriptions. Each sets a `purpose` state that influences default section visibility and ordering in step 2.

**Step 2 — Customise:** Split layout:
- **Right panel:** Toggle switches per section (Education, Experience, Skills, Interests, Badges) and checkboxes per individual experience entry. Purpose presets determine initial toggles (e.g., Job emphasises Experience/Skills, University emphasises Education/Projects/Research, Social emphasises Interests/Bio).
- **Left panel:** Live A4-ratio CV preview (`CVPreview` component) that reads from `useProfile()` context and respects toggle/checkbox state. Styled as a white A4 page with navy accents, clean typography.

**Step 3 — Export:** "Download PDF" button. Uses `html2canvas` to capture the CV preview div, then `jspdf` to create an A4 PDF and trigger download.

**`src/components/cv/CVPreview.tsx`** — The A4 CV render component:
- Receives profile data + visibility config as props
- Renders: name/headline header, education block, experience entries, skills tags, interests, badges
- Layout adapts based on selected purpose (section ordering)
- Styled with inline-friendly Tailwind for clean PDF output

### Files to Modify

**`src/App.tsx`** — Import `CVBuilder` and wire to `/dashboard/cv` route (replacing placeholder div).

### Design Notes
- Follows existing patterns: `container max-w-5xl`, Card components, navy primary color, `animate-fade-in-up`
- Step indicator bar at top showing progress (1→2→3)
- Back/Next buttons for navigation between steps
- A4 preview scaled to fit viewport with `aspect-ratio: 1/1.414` and `transform: scale()` for responsive sizing

