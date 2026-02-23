# Professional Public Profile Redesign Specification

## Overview

This document provides a detailed analysis and specification for redesigning the Professional Public Profile page (`/pcard/[slug]`) to match the layout of the Business Public Profile page (`/catalog/[slug]`).

---

## Current Layout Analysis

### Business Public Profile Layout (Target)

The Business Profile currently uses:

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Desktop Only - Fixed Top Navigation)           │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   ASIDE      │          MAIN CONTENT                    │
│  (Sidebar)   │       (Scrollable Container)              │
│              │                                          │
│  - Logo      │  - Hero/Banner Section                  │
│  - Name      │  - Brands Section                       │
│  - Category  │  - Products Section                     │
│  - Phone     │  - Portfolio Section                    │
│  - Email     │  - About/Opening Hours                  │
│  - Actions   │                                          │
│  - Social    │                                          │
│              │                                          │
│  (Sticky)   │                                          │
│              │                                          │
├──────────────┴──────────────────────────────────────────┤
│  MOBILE BOTTOM NAVIGATION (4 tabs)                      │
└─────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Grid Layout**: `grid-cols-1 md:grid-cols-4`
- **Aside**: `md:col-span-1` (25% width on desktop)
- **Main**: `md:col-span-3` (75% width on desktop)
- **Scrollable Main**: `h-full overflow-y-auto` with `min-w-0`
- **Sticky Sidebar**: `sticky top-24` for content inside aside

---

### Professional Public Profile Layout (Current)

The Professional Profile currently uses:

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Desktop Only - Fixed Top Navigation)           │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   ASIDE      │          MAIN CONTENT                    │
│  (Sidebar)   │       (Scrollable Container)              │
│              │                                          │
│  - Banner    │  - Profile Header Card (Mobile)         │
│  - Profile   │  - Work Experience                       │
│  - CTA       │  - Expert Area (Skills)                 │
│  - Contact   │  - Portfolio                            │
│              │  - Services                             │
│              │  - Let's Talk                            │
│              │                                          │
│  (Sticky)   │                                          │
│              │                                          │
├──────────────┴──────────────────────────────────────────┤
│  MOBILE BOTTOM NAVIGATION (5 tabs)                      │
└─────────────────────────────────────────────────────────┘
```

**Current Grid**: `grid-cols-1 md:grid-cols-4` (Same as Business)

---

## Detailed Comparison

| Aspect | Business Profile | Professional Profile | Action |
|--------|-----------------|---------------------|--------|
| Grid System | `grid-cols-1 md:grid-cols-4` | `grid-cols-1 md:grid-cols-4` | ✅ Already matches |
| Aside Width | `md:col-span-1` | `md:col-span-1` | ✅ Already matches |
| Main Width | `md:col-span-3` | `md:col-span-3` | ✅ Already matches |
| Scrollable Main | `h-full overflow-y-auto mb-5` | `h-full overflow-y-auto` | ⚠️ Needs margin bottom |
| Header | Desktop navigation | Desktop navigation | ✅ Already matches |
| Mobile Nav | 4 items | 5 items | ⚠️ Consider aligning |
| Sidebar Content | Business info + CTA | Profile + CTA + Contact | ⚠️ Restructure |
| Hero Section | Carousel with slides | Static banner | ⚠️ Enhance |
| Main Sections | Brands, Products, Portfolio, About | About, Services, Portfolio, Contact | ⚠️ Restructure |

---

## Proposed Changes

### 1. Container Structure (Lines ~1347-1364, ~1421-1430)

**Current Professional:**
```tsx
<div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden">
  <aside className="hidden md:block md:col-span-1 h-full overflow-y-auto z-20">
    {/* Sticky content */}
  </aside>
  <main className="md:col-span-3 h-full overflow-y-auto relative scroll-smooth min-w-0">
    {/* Scrollable content */}
  </main>
</div>
```

**Proposed Changes:**
- Add `mb-5` to main container for mobile bottom nav spacing
- Add `pb-safe` padding for safe area on mobile
- Ensure same scroll behavior as Business Profile

### 2. Sidebar Content Restructure

**Current Sidebar Elements:**
- Profile Header Card (Banner + Image + Name + Headline)
- CTA Buttons (Call, WhatsApp, Email)
- Resume & Card Download buttons
- Address Card (Contact details + Social icons)

**Proposed Sidebar Structure (matching Business):**

```
┌─────────────────────────┐
│  Business Info Card     │
│  - Logo (circular)      │
│  - Business Name        │
│  - Category Badge       │
│  - Description          │
│  - Owner Name           │
├─────────────────────────┤
│  Action Buttons Row 1   │
│  [Call] [WhatsApp]     │
├─────────────────────────┤
│  Action Buttons Row 2   │
│  [Download Card]        │
│  [Download Catalog]    │
├─────────────────────────┤
│  Share Button          │
├─────────────────────────┤
│  Contact Details Card  │
│  - Address             │
│  - Phone               │
│  - Email               │
├─────────────────────────┤
│  Social Links          │
│  [Web] [FB] [X] [IG]   │
│  [LI] [WA]             │
└─────────────────────────┘
```

**Specific Changes:**
1. Remove banner from sidebar (move to main content as hero)
2. Keep profile picture (circular, like business logo)
3. Group action buttons in rows (Call/WhatsApp/Email)
4. Add Download Card and Download Catalog buttons
5. Move Address Card to bottom of sidebar
6. Add social icons section

### 3. Main Content Restructure

**Current Main Sections:**
1. Mobile Profile Card (shown only on mobile)
2. About Section (2 columns: Work Experience + Skills)
3. Portfolio Section
4. Services Section
5. Let's Talk (Contact Form)

**Proposed Main Sections:**
1. **Hero Section** (like Business)
   - Banner image (full width, aspect ratio 4:2 or 3:1)
   - OR Carousel with slides (like Business hero)
   
2. **Mobile Business Info Card** (shown only on mobile - same as sidebar)

3. **Brands Section** (NEW - if professional has associated brands/companies)
   - Carousel or grid of company logos they've worked with
   
4. **Services Section** (keep existing)
   - Grid of service cards

5. **Portfolio Section** (keep existing)
   - Grid of portfolio items

6. **Experience Section** (restructured)
   - Work Experience timeline
   
7. **Education & Certifications** (restructured)
   - Education cards
   - Certification cards

8. **Skills Section** (keep existing)
   - Skill badges/tags

9. **About/Contact Section** (move from sidebar to main)
   - Full about text
   - Opening hours (if applicable)

### 4. Mobile Navigation Alignment

**Current Professional:** 5 tabs (Home, About, Services, Portfolio, Contact)

**Proposed:** Match Business (4 tabs) or keep 5 but restructure:
- Home (includes profile + quick actions)
- Services (or Experience)
- Portfolio
- Contact

### 5. Visual Styling Alignment

**Colors:**
- Business uses: `orange-600` for active states, `orange-50` for backgrounds
- Professional uses: `sky-600` for active states
- **Action:** Change to use orange theme to match Business

**Cards:**
- Business: `rounded-2xl`, `shadow-lg`, `hover:shadow-xl`
- Professional: `rounded-2xl`, `shadow-none`, `border`
- **Action:** Add shadows and hover effects

**Buttons:**
- Business: `rounded-full`, specific colors
- Professional: Uses theme-based styling
- **Action:** Use similar button styles

---

## Implementation Priority

### Phase 1: Container & Layout (High Priority)
1. Fix main container margin/padding for mobile nav
2. Ensure scroll behavior matches Business profile

### Phase 2: Sidebar Restructure (High Priority)
1. Move banner to main content (hero section)
2. Group contact/CTA buttons in sidebar
3. Add download buttons to sidebar
4. Restructure social links section

### Phase 3: Main Content Restructure (Medium Priority)
1. Add hero/banner section at top
2. Restructure sections to match Business flow
3. Add Brands section if applicable

### Phase 4: Visual Styling (Medium Priority)
1. Update color theme to match Business (orange)
2. Add shadows and hover effects to cards
3. Match button styles

### Phase 5: Mobile Navigation (Low Priority)
1. Consider reducing to 4 tabs
2. Update active state styling

---

## Component Mapping

### Current Professional Components to Keep/Modify:

| Component | Keep/Modify | Notes |
|-----------|-------------|-------|
| `ProfileHeaderCard` | Modify | Remove banner, keep profile image |
| `CTAActions` | Modify | Group buttons in rows |
| `AddressCard` | Keep | Move to bottom of sidebar |
| `BasicInfoCard` | Remove | Redundant after restructure |
| `PersonalDetailsCard` | Modify | Move to main content |
| `Work Experience` | Keep | Move to main content |
| `Education` | Keep | Move to main content |
| `Skills/Expert Area` | Keep | Move to main content |
| `Services` | Keep | Move to main content |
| `Portfolio` | Keep | Move to main content |

### New Components to Add:

1. **Hero Section** - Similar to Business hero with carousel support
2. **Brands Section** - For showing companies worked with
3. **Sidebar Action Buttons** - Grouped like Business

---

## Data Requirements

### Professional Data Model Extensions (if needed):
- `companies` - Array of company logos/names worked with
- `heroSlides` - For hero carousel (like Business)
- `openingHours` - Business hours (if applicable)
- `catalogPdf` - Downloadable PDF (like Business)

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Full width, mobile bottom nav |
| Tablet (768px - 1024px) | Sidebar + Main (25/75) |
| Desktop (> 1024px) | Sidebar + Main (25/75) with larger sidebar |

---

## Accessibility Considerations

1. Maintain proper heading hierarchy
2. Ensure keyboard navigation works
3. Add proper ARIA labels
4. Maintain color contrast ratios
5. Screen reader friendly structure

---

## Performance Considerations

1. Lazy load images in portfolio
2. Optimize hero carousel
3. Use memoization for filtered data
4. Server-side rendering already in place

---

## Files to Modify

1. `src/components/ProfessionalProfile.tsx` - Main component
2. `src/app/pcard/[professional]/page.tsx` - Page wrapper (if data needs change)
3. `src/lib/image-utils.ts` - If new image handling needed

---

## Testing Checklist

- [ ] Desktop layout with sidebar
- [ ] Mobile layout with bottom nav
- [ ] Scroll behavior in main content
- [ ] All CTA buttons work
- [ ] Social links open correctly
- [ ] Image loading and optimization
- [ ] Form submissions
- [ ] Responsive breakpoints
- [ ] Color theme consistency
- [ ] Loading states

---

## Summary

The Professional Public Profile already has a similar base layout to the Business Public Profile. The main differences are in:

1. **Content organization** - Professional has more varied sections
2. **Visual styling** - Business uses orange theme, Professional uses sky theme
3. **Sidebar components** - Need restructuring to match Business pattern
4. **Hero section** - Professional lacks the carousel hero that Business has

The changes are primarily cosmetic and organizational rather than structural, making the implementation straightforward.
