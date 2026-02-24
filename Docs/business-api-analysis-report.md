# Business APIs Analysis & Optimization Report

**Date:** February 24, 2026  
**Project:** DigiSence  
**Analyzed Module:** Businesses Management System

---

## Executive Summary

This report provides a comprehensive analysis of all APIs and functions related to the **Businesses** module in the DigiSence project. It identifies latency issues and provides optimized solutions to improve performance.

---

## 1. Business APIs Overview

### 1.1 API Endpoints Summary

| Endpoint | Method | Purpose | Auth Level |
|----------|--------|---------|-------------|
| `/api/businesses` | GET | List public businesses | Public |
| `/api/businesses/[id]` | GET, PUT | Single business (public) | Public/Business |
| `/api/business` | GET, PUT, POST | Business dashboard | Business Admin |
| `/api/admin/businesses` | GET, POST, DELETE | Admin list/create businesses | Super Admin |
| `/api/admin/businesses/[id]` | PUT, DELETE | Admin update/delete business | Super Admin |
| `/api/admin/businesses/bulk/status` | POST | Bulk status update | Super Admin |
| `/api/admin/businesses/bulk/delete` | POST | Bulk delete | Super Admin |
| `/api/admin/businesses/export` | GET | Export businesses CSV | Super Admin |
| `/api/admin/businesses/import` | POST | Import businesses CSV | Super Admin |
| `/api/admin/businesses/[id]/duplicate` | POST | Duplicate business | Super Admin |
| `/api/business/products` | GET, POST | Manage business products | Business Admin |
| `/api/business/products/[id]` | GET, PUT, DELETE | Single product | Business Admin |
| `/api/business/inquiries` | GET | List business inquiries | Business Admin |
| `/api/business/inquiries/[id]` | GET, PUT | Single inquiry | Business Admin |
| `/api/business/categories` | GET, POST | Manage categories | Business Admin |
| `/api/business/upload` | POST | Upload business media | Business Admin |
| `/api/business/stats` | GET | Business statistics | Business Admin |

---

## 2. Identified Latency Issues

### 2.1 Critical Issues (High Impact)

#### Issue #1: Sequential Database Queries in Admin List
**Location:** [`src/app/api/admin/businesses/route.ts:114-144`](src/app/api/admin/businesses/route.ts:114)

```typescript
// Current: Sequential queries
const total = await db.business.count({ where }) // Query 1
const businesses = await db.business.findMany({...}) // Query 2
```

**Problem:**
- Two separate database calls instead of using `Promise.all()`
- No query optimization for common patterns

**Impact:** Medium - Adds latency equal to the slower query time

---

#### Issue #2: Redundant Existence Checks
**Location:** [`src/app/api/admin/businesses/route.ts:304-310`](src/app/api/admin/businesses/route.ts:304), [`src/app/api/admin/businesses/[id]/route.ts:57-63`](src/app/api/admin/businesses/[id]/route.ts:57)

```typescript
// Check if business exists - REDUNDANT in UPDATE
const existingBusiness = await db.business.findUnique({
  where: { id },
})
if (!existingBusiness) {
  return NextResponse.json({ error: 'Business not found' }, { status: 404 })
}
// Then update...
```

**Problem:**
- Database lookup before every update/delete operation
- Prisma's `update()` can handle non-existent records gracefully

**Impact:** Medium - Unnecessary database round-trip

---

#### Issue #3: N+1 Query in Bulk Operations
**Location:** [`src/app/api/admin/businesses/bulk/status/route.ts:38-91`](src/app/api/admin/businesses/bulk/status/route.ts:38)

```typescript
// First query to verify
const existingBusinesses = await db.business.findMany({ where: { id: { in: ids } } })

// Then update
await db.$transaction(ids.map(id => db.business.update(...)))

// Then fetch AGAIN for socket
const updatedBusinesses = await db.business.findMany({ where: { id: { in: ids } } })
```

**Problem:**
- 3 separate queries when 1 would suffice
- Individual socket emissions in loop

**Impact:** High - O(3n) database queries + O(n) socket emissions

---

#### Issue #4: Slug Uniqueness Check in Every Update
**Location:** [`src/app/api/admin/businesses/[id]/route.ts:70-86`](src/app/api/admin/businesses/[id]/route.ts:70)

```typescript
// On EVERY update, checks slug uniqueness
if (updateData.name && updateData.name !== existingBusiness.name) {
  const slugExists = await db.business.findFirst({
    where: { slug: newSlug, id: { not: existingBusiness.id } }
  })
}
```

**Problem:**
- Slug uniqueness check runs even when name hasn't changed
- No caching of uniqueness validation

**Impact:** Medium - Extra query on every update

---

#### Issue #5: Missing Index on Admin ID
**Location:** [`prisma/schema.prisma`](prisma/schema.prisma)

```prisma
// Business model - missing adminId index
adminId     String   @unique  // Only unique constraint, not index

@@index([isActive])
@@index([categoryId])
@@index([createdAt])
// Missing: @@index([adminId])
```

**Impact:** Medium - Slower queries on business dashboard

---

#### Issue #6: Inefficient Product Loading in Public API
**Location:** [`src/app/api/businesses/route.ts:48-72`](src/app/api/businesses/route.ts:48)

```typescript
// Public business API loads ALL products
products: {
  where: { isActive: true },
  select: { /* 14 fields */ },
  orderBy: { createdAt: 'desc' },
  // NO take limit!
}
```

**Problem:**
- Loads all products for each business
- No pagination or limiting
- Large payload size

**Impact:** High - O(n) products per business

---

#### Issue #7: Duplicate Business Admin Lookup
**Location:** [`src/app/api/business/products/route.ts:45-51`](src/app/api/business/products/route.ts:45)

```typescript
// Every product API call does this
async function getBusinessId(adminId: string) {
  const business = await db.business.findUnique({
    where: { adminId },
    select: { id: true }
  })
  return business?.id
}
```

**Problem:**
- Repeated lookup on every request
- Could use cached value from auth token

**Impact:** Medium - Extra query per operation

---

#### Issue #8: No Optimistic Updates for Bulk Operations
**Location:** [`src/lib/hooks/useBusinesses.ts:454-476`](src/lib/hooks/useBusinesses.ts:454)

```typescript
// Current: No optimistic update
onSuccess: (_, { ids, isActive }) => {
  queryClient.invalidateQueries({ queryKey: businessKeys.lists() })
  // Only invalidates - no optimistic update
}
```

**Impact:** Low-Medium - Slower perceived performance

---

#### Issue #9: In-Memory Rate Limiter
**Location:** [`src/app/api/business/route.ts:6-29`](src/app/api/business/route.ts:6)

```typescript
// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
```

**Problem:**
- Not shared across server instances
- Lost on server restart
- No distributed rate limiting

**Impact:** Low - Security concern, not performance

---

#### Issue #10: Unused Fields in Public API Response
**Location:** [`src/app/api/businesses/route.ts:37-46`](src/app/api/businesses/route.ts:37)

```typescript
// Loading unnecessary fields
heroContent: true,
brandContent: true,
portfolioContent: true,
// These are heavy JSON fields not needed in list view
```

**Impact:** Medium - Larger response size

---

## 3. Recommended Optimizations

### 3.1 Critical Optimizations (Implement Immediately)

#### Optimization #1: Parallel Queries in Admin List

```typescript
// src/app/api/admin/businesses/route.ts - GET function
const [total, businesses] = await Promise.all([
  db.business.count({ where }),
  db.business.findMany({
    where,
    include: {...},
    orderBy: {...},
    skip,
    take: limit,
  })
])
```

**Expected Improvement:** 30-40% faster

---

#### Optimization #2: Remove Redundant Existence Checks

```typescript
// Instead of:
const existing = await db.business.findUnique({ where: { id } })
if (!existing) return 404
await db.business.update({ where: { id }, data: {...} })

// Use:
const business = await db.business.update({
  where: { id },
  data: {...}
}).catch(() => null)

if (!business) return NextResponse.json({ error: 'Not found' }, { status: 404 })
```

**Expected Improvement:** 1 less DB query per operation

---

#### Optimization #3: Optimize Bulk Operations

```typescript
// Instead of 3 queries + N socket events, use 1 query + 1 batched event
const updatedBusinesses = await db.business.updateMany({
  where: { id: { in: ids } },
  data: { isActive },
})

// Single batched socket event
if (global.io) {
  global.io.emit('businesses-bulk-status-updated', {
    ids,
    isActive,
    count: ids.length,
    action: 'bulk_status_update',
    timestamp: new Date().toISOString()
  })
}
```

**Expected Improvement:** 70-80% faster bulk operations

---

#### Optimization #4: Add Admin ID Index

```prisma
// prisma/schema.prisma
model Business {
  // ... existing fields
  
  // Add index for business admin queries
  @@index([adminId])
  
  // Compound indexes for common queries
  @@index([isActive, createdAt])
  @@index([categoryId, isActive])
}
```

**Expected Improvement:** 20-40% faster business dashboard queries

---

#### Optimization #5: Limit Products in Public API

```typescript
// src/app/api/businesses/route.ts - Add pagination
products: {
  where: { isActive: true },
  select: { /* minimal fields */ },
  orderBy: { createdAt: 'desc' },
  take: 10, // Limit to 10 products in list view
}
```

**Expected Improvement:** 60-80% smaller response size

---

#### Optimization #6: Cache Business Admin ID in Token

```typescript
// Add businessId to JWT payload during login
// Then use from token instead of DB lookup
const payload = verifyToken(token)
// payload.businessId already available
```

**Expected Improvement:** 1 less DB query per operation

---

#### Optimization #7: Optimistic Updates for Bulk Hooks

```typescript
// src/lib/hooks/useBusinesses.ts - useBulkUpdateStatus
onMutate: async ({ ids, isActive }) => {
  await queryClient.cancelQueries({ queryKey: businessKeys.lists() })
  
  const previous = queryClient.getQueriesData({ queryKey: businessKeys.lists() })
  
  queryClient.setQueriesData({ queryKey: businessKeys.lists() }, (old) => {
    if (!old) return old
    return {
      ...old,
      businesses: old.businesses.map(biz =>
        ids.includes(biz.id) ? { ...biz, isActive } : biz
      )
    }
  })
  
  return { previous }
}
```

**Expected Improvement:** Instant UI feedback

---

#### Optimization #8: Select Only Needed Fields

```typescript
// In public list API, select only needed fields
select: {
  id: true,
  name: true,
  slug: true,
  logo: true,
  category: { select: { name: true } },
  products: { select: { id: true }, take: 3 } // Limit
}
// Remove: heroContent, brandContent, portfolioContent
```

**Expected Improvement:** 40-50% smaller response

---

## 4. Implementation Priority

### Phase 1: Critical (Week 1)
1. ✅ Parallel queries in admin list
2. ✅ Remove redundant existence checks
3. ✅ Optimize bulk operations
4. ✅ Add admin ID index

### Phase 2: Important (Week 2)
5. ✅ Limit products in public API
6. ✅ Cache business admin ID
7. ✅ Optimistic updates for bulk hooks
8. ✅ Select only needed fields

### Phase 3: Enhancement (Week 3+)
9. Implement Redis caching for public API
10. Add distributed rate limiting
11. Implement API response compression

---

## 5. Performance Benchmark Targets

| Metric | Current (Est.) | Target | Improvement |
|--------|---------------|--------|-------------|
| Admin List (20 items) | ~250-400ms | <100ms | 70-75% |
| Public List API | ~150-250ms | <50ms | 80% |
| Bulk Status (10) | ~600ms | <100ms | 83% |
| Business Dashboard | ~100-150ms | <50ms | 66% |
| Public Single Business | ~80-120ms | <40ms | 66% |

---

## 6. File Reference

### API Routes Analyzed

| File | Lines | Purpose |
|------|-------|---------|
| [`src/app/api/admin/businesses/route.ts`](src/app/api/admin/businesses/route.ts) | 478 | Admin business management |
| [`src/app/api/admin/businesses/[id]/route.ts`](src/app/api/admin/businesses/[id]/route.ts) | 282 | Admin single business |
| [`src/app/api/business/route.ts`](src/app/api/business/route.ts) | 392 | Business dashboard |
| [`src/app/api/businesses/route.ts`](src/app/api/businesses/route.ts) | 139 | Public business listing |
| [`src/app/api/businesses/[id]/route.ts`](src/app/api/businesses/[id]/route.ts) | 124 | Public single business |
| [`src/app/api/admin/businesses/bulk/status/route.ts`](src/app/api/admin/businesses/bulk/status/route.ts) | 137 | Bulk status |
| [`src/app/api/admin/businesses/bulk/delete/route.ts`](src/app/api/admin/businesses/bulk/delete/route.ts) | 93 | Bulk delete |
| [`src/app/api/business/products/route.ts`](src/app/api/business/products/route.ts) | 173 | Product management |
| [`src/app/api/business/inquiries/route.ts`](src/app/api/business/inquiries/route.ts) | 72 | Inquiry management |

### Supporting Files

| File | Purpose |
|------|---------|
| [`src/lib/hooks/useBusinesses.ts`](src/lib/hooks/useBusinesses.ts) | React Query hooks |
| [`prisma/schema.prisma`](prisma/schema.prisma) | Database schema |

---

## 7. Summary

The Business APIs have similar latency issues to the Professionals APIs:

1. **Query Optimization** - Sequential queries and missing indexes
2. **Bulk Operations** - N+1 patterns and individual socket events
3. **Caching** - No Redis, in-memory only
4. **Payload Size** - Loading unnecessary data

By implementing these optimizations, we expect:
- **60-80% reduction** in average API response times
- **Better user experience** with optimistic updates
- **Smaller response sizes** for public APIs

---

*Report generated by Code Analysis Tool*
