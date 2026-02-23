# Professional Public Profile - Redesign Specification

## Overview
This document outlines the redesign of the Professional Public Profile page to match the layout and structure of the Business Public Profile page. The key changes involve:
- Removing conditional tab-based navigation in main content
- Displaying all sections in a stacked layout
- Maintaining the sidebar + scrollable main container architecture

---

## Current Layout Issues

### Problem 1: Conditional Section Rendering
Currently, the Professional Profile uses `currentView` state to conditionally render only ONE section at a time:
- `currentView === "about"` → shows About only
- `currentView === "services"` → shows Services only  
- `currentView === "portfolio"` → shows Portfolio only
- `currentView === "contact"` → shows Contact form only
- Default (`home`) → shows Work Experience, Expert Area, Portfolio, Services, Contact in 2-column layout

### Problem 2: Section Order Mismatch
The user's desired order is:
1. Work Experience + Expert Area (2 columns)
2. About (full page)
3. Portfolio (full card)
4. Contact information
5. Services

But current "home" view shows Portfolio in right column instead of full card.

---

## Target Layout Structure

### Page Structure (Desktop)
```
+--------------------------------------------------+
|                    HEADER                         |
+--------------------------------------------------+
|    SIDEBAR     |        MAIN CONTENT             |
|   (Sticky)     |     (Scrollable)               |
|                |                                 |
| - Profile Card |  1. Hero Section (Banner)      |
| - Contact      |                                 |
| - Quick Actions|  2. Work Experience + Expert    |
|                |     Area (2 columns)            |
|                |                                 |
|                |  3. About Section (full width)  |
|                |                                 |
|                |  4. Portfolio (full card)       |
|                |                                 |
|                |  5. Services + Contact          |
|                |     (2 columns)                 |
+--------------------------------------------------+
```

### Page Structure (Mobile)
```
+--------------------+
|       HEADER       |
+--------------------+
|    MAIN CONTENT    |
|   (Full Width)     |
|                    |
| - Profile Card     |
| - Work Experience  |
| - Expert Area      |
| - About            |
| - Portfolio        |
| - Services         |
| - Contact          |
+--------------------+
|  BOTTOM NAVIGATION |
+--------------------+
```

---

## Section Specifications

### 1. Hero Section (Banner)
**Location:** Top of main content area (desktop only)
- Full-width banner image
- Height: 200px (desktop), 120px (mobile)
- Gradient fallback: `from-orange-400 to-amber-500`
- **Note implemented in sidebar (BusinessInfoCard), may not need:** Already duplicate

### 2. Work Experience + Expert Area (2 Columns)
**Grid:** `grid-cols-1 md:grid-cols-2 gap-6`

#### Left Column: Work Experience Card
- **Title:** "Work Experience"
- **Content:** List of work experiences with:
  - Company icon (Building2)
  - Company name (bold)
  - Position
  - Location
  - Duration (date range)
  - Total years calculated
- **Max items:** 3 visible, scrollable for more
- **"View All" button** → scrolls to full section

#### Right Column: Expert Area (Skills) Card
- **Title:** "Expert Area"
- **Content:** Skill tags in flex-wrap layout
- **Max items:** 12 visible
- **"View All" button** → scrolls to About section

### 3. About Section (Full Width)
**Grid:** `grid-cols-1 md:grid-cols-3` (spans full 3 columns)

#### Content:
- **About Me:** Full text description
- **Education:** List with degree, institution, year
- **Certifications:** List with name, issuer, year
- **Skills:** All skills as tags (not just 12)

### 4. Portfolio Section (Full Card)
**Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

- **Title:** "Portfolio"
- **Content:** Grid of portfolio items
- **Each item contains:**
  - Image/Video thumbnail (aspect-video)
  - Title
  - Description (optional, truncated)
- **"View All" button** → shows full portfolio

### 5. Services + Contact (2 Columns)
**Grid:** `grid-cols-1 md:grid-cols-2 gap-6`

#### Left Column: Services Card
- **Title:** "Services"
- **Content:** Grid of services (2-4 per row)
- **Each service:**
  - Icon container (bg-sky-100)
  - Service name (bold)
- **"View All" button** → shows all services

#### Right Column: Contact/Let's Talk Card
- **Title:** "Let's Talk"
- **Content:**
  - Description text
  - Quick contact buttons (Call, WhatsApp, Email)
  - "Send Message" button → opens contact form

---

## Implementation Changes

### 1. Remove Conditional Rendering
**File:** `src/components/ProfessionalProfile.tsx`
**Lines:** ~1521-1755

**Current:**
```jsx
{currentView === "about" ? (
  // About only
) : currentView === "services" ? (
  // Services only
) : currentView === "portfolio" ? (
  // Portfolio only  
) : currentView === "contact" ? (
  // Contact only
) : (
  // Home - 2 column layout
)}
```

**Target:**
```jsx
{/* Always show all sections stacked - remove conditional */}
<div className="space-y-6 lg:space-y-8">
  {/* 1. Work Experience + Expert Area (2 columns) */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <WorkExperienceCard />
    <ExpertAreaCard />
  </div>

  {/* 2. About Section (full width) */}
  <AboutSection />

  {/* 3. Portfolio (full card) */}
  <PortfolioSection />

  {/* 4. Services + Contact (2 columns) */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ServicesCard />
    <ContactCard />
  </div>
</div>
```

### 2. Navigation Updates
- Keep header navigation but make it scroll to sections instead of changing view
- Remove `currentView` conditional logic
- Navigation buttons should scroll to corresponding sections using refs

### 3. Mobile Adaptations
- Show profile card at top (inside main content)
- Single column layout
- Bottom navigation for quick access (as currently implemented)

---

## Component Structure

### Main Sections to Extract/Create

1. **WorkExperienceCard**
   - Props: `experiences` (array)
   - Returns: Card with experience list

2. **ExpertAreaCard**  
   - Props: `skills` (array)
   - Returns: Card with skill tags

3. **AboutSection**
   - Props: `aboutMe`, `education`, `certifications`, `skills`
   - Returns: Full-width card with all about content

4. **PortfolioSection**
   - Props: `portfolio` (array)
   - Returns: Full-width card with portfolio grid

5. **ServicesCard**
   - Props: `services` (array)
   - Returns: Card with services grid

6. **ContactCard**
   - Props: `professional` (object)
   - Returns: Card with contact info and form button

---

## Color Theme
Maintain orange theme (matching Business Profile):
- Primary: `orange-600`
- Active states: `text-orange-600 bg-orange-50`
- Borders: `border-orange-200`
- Buttons: `bg-orange-500 hover:bg-orange-600`

---

## Scroll Behavior
- Sidebar: Sticky (`sticky top-24`)
- Main content: Scrollable (`overflow-y-auto`)
- Navigation: Smooth scroll to sections using refs
- Mobile: Bottom navigation with smooth transitions

---

## Acceptance Criteria

1. ✅ All sections visible on page load (no tabs/conditional)
2. ✅ Section order matches user requirement
3. ✅ Sidebar with profile info (sticky)
4. ✅ Main content scrollable
5. ✅ Mobile responsive with bottom navigation
6. ✅ Orange color theme consistent
7. ✅ Navigation scrolls to sections smoothly

---

## Files to Modify
1. `src/components/ProfessionalProfile.tsx` - Main component refactor

---

## Status: Pending User Review
This specification is ready for review. Once approved, implementation will proceed.
