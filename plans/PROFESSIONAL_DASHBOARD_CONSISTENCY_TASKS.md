# Professional Dashboard Consistency Implementation Tasks

## Overview
This file contains the detailed implementation tasks for making the Professional Dashboard consistent with the Admin Dashboard in terms of layout, design, and shared component usage.

## Related Documents
- **Analysis Report:** `PROFESSIONAL_DASHBOARD_ANALYSIS_REPORT.md`
- **Reference Implementation:** `src/app/dashboard/admin/page.tsx`

---

## Task 1: Layout Structure Standardization

### Task 1.1: Update Container Structure
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** High

**Changes:**
```tsx
// Current structure (remove theme dependency):
<div className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}>

// Target structure (match admin dashboard):
<div className="max-h-screen min-h-screen relative flex flex-col">
  <div className="fixed inset-0 bg-linear-to-b from-blue-400 to-white bg-center blur-sm -z-10"></div>
  {/* Header, Sidebar, Content */}
</div>
```

**Steps:**
1. [ ] Wrap entire component in consistent container
2. [ ] Add fixed gradient background
3. [ ] Standardize content padding to `p-4 sm:p-6`
4. [ ] Remove theme dependency from main container

### Task 1.2: Add Fixed Header Bar
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** High

**Changes:**
```tsx
// Add fixed header similar to admin dashboard:
<div className="bg-white border-b border-gray-200 shadow-sm shrink-0 h-13">
  <div className="flex justify-between items-center px-4 sm:px-6 py-2">
    <div className="hidden md:flex"></div>
    <div className="flex items-center md:hidden">
      <img src="/logo.png" alt="DigiSense" className="h-8 w-auto" />
      <span className="h-8 border-l border-gray-300 mx-2"></span>
      <div><span className="font-semibold">Professional</span></div>
    </div>
    <div className="flex items-center leading-tight space-x-2 sm:space-x-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-gray-900">{user?.name || "Professional"}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <span className="h-8 border-l border-gray-300 mx-2"></span>
      <div className="flex-2">
        <div className items-center space-x="w-8 h-8 rounded-full bg-black flex items-center justify-center">
          <User className="h-4 w-4 sm:h-4 sm:w-4 text-white" />
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Task 2: UnifiedModal Integration

### Task 2.1: Import UnifiedModal
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** High

**Changes:**
```tsx
// Add import:
import { UnifiedModal } from "@/components/ui/UnifiedModal";

// Add state for modal management:
const [showRightPanel, setShowRightPanel] = useState(false);
const [rightPanelContent, setRightPanelContent] = useState<string | null>(null);
```

### Task 2.2: Replace Dialog Components with UnifiedModal
**Files:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** High

**Dialogs to Replace:**
1. [ ] Experience Dialog → UnifiedModal
2. [ ] Education Dialog → UnifiedModal
3. [ ] Services Dialog → UnifiedModal
4. [ ] Portfolio Dialog → UnifiedModal
5. [ ] Skills Dialog → UnifiedModal
6. [ ] Inquiry Dialog → UnifiedModal

**Pattern:**
```tsx
// Current:
<Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
  <DialogContent className="max-w-md">
    {/* content */}
  </DialogContent>
</Dialog>

// Target:
<UnifiedModal
  isOpen={showSkillDialog}
  onClose={(open) => !open && setShowSkillDialog(false)}
  title={editingSkillItem !== null ? 'Edit Skill' : 'Add Skill'}
  description="Manage your professional skills"
  footer={<Button type="submit" form="skill-form">Save</Button>}
>
  {/* content */}
</UnifiedModal>
```

---

## Task 3: Card Styling Standardization

### Task 3.1: Remove Theme Dependency from Dashboard Cards
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Medium

**Changes:**
```tsx
// Current:
<Card className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}>

// Target:
<Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
```

**Cards to Update:**
- [ ] StatCard component
- [ ] ActionCard component
- [ ] Profile cards
- [ ] Table cards

### Task 3.2: Standardize Card Header Styling
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Medium

**Changes:**
```tsx
// Standard header pattern:
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium text-gray-900">Title</CardTitle>
  <Icon className="h-4 w-4 text-gray-400" />
</CardHeader>
<CardContent>
  <div className="text-2xl font-bold text-gray-900">Value</div>
  <p className="text-xs text-gray-500">Subtitle</p>
</CardContent>
```

---

## Task 4: Table Styling Standardization

### Task 4.1: Standardize Table Headers
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Medium

**Changes:**
```tsx
// Current:
<TableHeader className="bg-amber-100">

// Target:
<TableHeader className="bg-[#080322]">
  <TableRow>
    <TableHead className="text-white font-medium">Column</TableHead>
  </TableRow>
</TableHeader>
```

**Tables to Update:**
- [ ] Inquiries table
- [ ] Any other data tables

### Task 4.2: Standardize Status Badge Usage
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Medium

**Changes:**
```tsx
// Add import:
import StatusBadge from "@/components/ui/StatusBadge";

// Replace inline status badges:
<Badge variant="outline" className="rounded-full">
  {inquiry.status}
</Badge>

// With:
<StatusBadge 
  status={inquiry.status}
  variant={inquiry.status === 'NEW' ? 'warning' : inquiry.status === 'READ' ? 'info' : 'success'}
/>
```

---

## Task 5: Additional Components Integration

### Task 5.1: Add Pagination Component
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Low

**Changes:**
```tsx
// Add import:
import { Pagination } from "@/components/ui/pagination";

// Add pagination state:
const [inquiryPagination, setInquiryPagination] = useState({
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
});

// Add pagination to inquiries table:
<Pagination
  currentPage={inquiryPagination.page}
  totalPages={inquiryPagination.totalPages}
  totalItems={inquiryPagination.totalItems}
  itemsPerPage={inquiryPagination.limit}
  onPageChange={(page) => setInquiryPagination(prev => ({ ...prev, page }))}
  onItemsPerPageChange={(limit) => setInquiryPagination(prev => ({ ...prev, limit, page: 1 }))}
/>
```

### Task 5.2: Add BulkActionsToolbar (if applicable)
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Low

**Note:** Professional dashboard may not need bulk actions for inquiries currently.

---

## Task 6: Grid Layout Standardization

### Task 6.1: Standardize Dashboard Overview Grid
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Medium

**Changes:**
```tsx
// Current:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

// Target (align with admin pattern for overview):
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
```

**Note:** The 4-column grid is acceptable for professional dashboard as it has fewer stats.

---

## Task 7: Mobile Navigation Consistency

### Task 7.1: Verify SharedSidebar Mobile Nav
**Status:** ✅ ALREADY CONSISTENT

**Note:** The mobile bottom navigation is already implemented consistently via `SharedSidebar` component. Both dashboards use the same component with the same structure.

**Verified Features:**
- ✅ Bottom navigation bar with icons
- ✅ "More" menu for additional items
- ✅ Active state highlighting (orange-400)
- ✅ Logout option in More menu

---

## Task 8: Button Styling Standardization

### Task 8.1: Standardize Primary Button
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Medium

**Changes:**
```tsx
// Current (theme-dependent):
<Button className={themeSettings.buttonStyle}>

// Target (match admin):
<Button className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity">
```

### Task 8.2: Standardize Outline Button
**Status:** [ ] Pending
**Priority:** Low

**Changes:**
```tsx
// Target:
<Button variant="outline" className="rounded-xl border-gray-200">
```

---

## Task 9: Loading States Standardization

### Task 9.1: Update Skeleton Loading States
**File:** `src/app/dashboard/professional/[professional-slug]/page.tsx`
**Status:** [ ] Pending
**Priority:** Low

**Changes:**
```tsx
// Update renderSkeletonContent to match admin pattern:
const renderSkeletonContent = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white border border-gray-200 shadow-sm rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

---

## Implementation Order

### Phase 1: High Priority
1. [ ] Task 1.1: Update Container Structure
2. [ ] Task 1.2: Add Fixed Header Bar
3. [ ] Task 2.1: Import UnifiedModal
4. [ ] Task 2.2: Replace Dialogs with UnifiedModal

### Phase 2: Medium Priority
5. [ ] Task 3.1: Remove Theme Dependency from Cards
6. [ ] Task 3.2: Standardize Card Headers
7. [ ] Task 4.1: Standardize Table Headers
8. [ ] Task 4.2: Add StatusBadge Usage
9. [ ] Task 8.1: Standardize Primary Button

### Phase 3: Low Priority
10. [ ] Task 5.1: Add Pagination Component
11. [ ] Task 8.2: Standardize Outline Button
12. [ ] Task 9.1: Update Skeleton Loading States

### Already Consistent (No Action Needed)
- ✅ Mobile Navigation (via SharedSidebar)
- ✅ Sidebar Component (SharedSidebar)
- ✅ Menu Item Structure

---

## Testing Checklist

After implementation, verify:

- [ ] Dashboard loads with consistent layout
- [ ] Mobile bottom navigation works correctly
- [ ] Forms open in UnifiedModal with consistent styling
- [ ] Cards have consistent rounded-3xl styling
- [ ] Table headers have dark background
- [ ] Status badges are consistent
- [ ] Loading states match admin pattern
- [ ] Button styles are consistent
- [ ] Mobile responsive layout works

---

## Files to Modify

1. `src/app/dashboard/professional/[professional-slug]/page.tsx` - Main changes
2. `src/app/dashboard/professional/[professional-slug]/page.tsx` - Add StatusBadge import
3. `src/app/dashboard/professional/[professional-slug]/page.tsx` - Add UnifiedModal import

---

## Estimated Effort

| Phase | Tasks | Effort |
|-------|-------|--------|
| Phase 1 | 4 | High |
| Phase 2 | 6 | Medium |
| Phase 3 | 3 | Low |

---

*Task File Created: 2026-02-10*
*Based on Analysis Report: PROFESSIONAL_DASHBOARD_ANALYSIS_REPORT.md*
