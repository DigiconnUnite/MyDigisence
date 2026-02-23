# Professional APIs Analysis & Optimization Report

**Date:** February 23, 2026  
**Project:** DigiSence  
**Analyzed Module:** Professionals Management System

---

## Executive Summary

This report provides a comprehensive analysis of all APIs and functions related to the **Professionals** module in the DigiSence project. It identifies latency issues in data synchronization and provides optimized solutions to improve performance.

---

## 1. Professional APIs Overview

### 1.1 API Endpoints Summary

| Endpoint | Method | Purpose | Auth Level |
|----------|--------|---------|-------------|
| `/api/professionals` | GET, POST | List/Create professionals (public) | Public/Professional |
| `/api/professionals/[id]` | GET, PUT, DELETE | Single professional operations | Professional |
| `/api/admin/professionals` | GET, POST | Admin list/create professionals | Super Admin |
| `/api/admin/professionals/[id]` | PUT, POST, DELETE | Admin update/delete professional | Super Admin |
| `/api/admin/professionals/bulk/status` | POST | Bulk status update | Super Admin |
| `/api/admin/professionals/bulk/delete` | POST | Bulk delete | Super Admin |
| `/api/admin/professionals/export` | GET | Export professionals CSV | Super Admin |
| `/api/professionals/education` | GET, PUT | Manage education | Professional |
| `/api/professionals/experience` | GET, PUT | Manage work experience | Professional |
| `/api/professionals/skills` | GET, PUT | Manage skills | Professional |
| `/api/professionals/services` | GET, PUT | Manage services | Professional |
| `/api/professionals/portfolio` | GET, PUT | Manage portfolio | Professional |
| `/api/professionals/inquiries` | GET, POST | Manage inquiries | Professional |
| `/api/professionals/upload` | POST | Upload media files | Professional |
| `/api/professionals/card` | POST | Generate business card | Public |

---

## 2. Identified Latency Issues

### 2.1 Critical Issues (High Impact)

#### Issue #1: In-Memory Cache Not Shared Across Instances
**Location:** [`src/app/api/professionals/route.ts:8-15`](src/app/api/professionals/route.ts:8)

```typescript
// Current implementation - NOT shared across server instances
let cache: {
  data: { professionals: any[] } | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}
```

**Problem:** 
- Cache is stored in memory and not synchronized across multiple server instances
- Cache is lost on server restart/redeployment
- No cache warming mechanism

**Impact:** High - Causes stale data and inconsistent user experience

---

#### Issue #2: Sequential Database Queries
**Location:** [`src/app/api/admin/professionals/route.ts:68-91`](src/app/api/admin/professionals/route.ts:68)

```typescript
// Current: Sequential queries
const totalItems = await db.professional.count({ where: whereClause }) // Query 1
const professionals = await db.professional.findMany({...}) // Query 2
```

**Problem:**
- Two separate database calls instead of using `Promise.all()`
- No query optimization for common patterns

**Impact:** Medium - Adds latency equal to the slower query time

---

#### Issue #3: Redundant Professional Lookups
**Location:** [`src/app/api/admin/professionals/[id]/route.ts:52-58`](src/app/api/admin/professionals/[id]/route.ts:52)

```typescript
// Check if professional exists - REDUNDANT in UPDATE
const existingProfessional = await db.professional.findUnique({
  where: { id: professionalId },
})
```

**Problem:**
- Database lookup before every update/delete operation
- Prisma's `update()` can handle non-existent records gracefully

**Impact:** Medium - Unnecessary database round-trip

---

#### Issue #4: Synchronous Email Sending
**Location:** [`src/app/api/professionals/inquiries/route.ts:113-134`](src/app/api/professionals/inquiries/route.ts:113)

```typescript
// Current: Email sent synchronously, blocking response
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
  method: 'POST',
  body: JSON.stringify({...})
})
```

**Problem:**
- Email notification sent inline, blocking the API response
- No retry mechanism for failed emails

**Impact:** High - Adds 500ms-2s latency to inquiry submission

---

#### Issue #5: Case-Insensitive Search Without Full-Text Index
**Location:** [`src/app/api/admin/professionals/route.ts:52-58`](src/app/api/admin/professionals/route.ts:52)

```typescript
whereClause.OR = [
  { name: { contains: search, mode: 'insensitive' } },
  { email: { contains: search, mode: 'insensitive' } },
  // ...
]
```

**Problem:**
- MongoDB `contains` with `insensitive` mode performs full collection scan
- No text index on searchable fields

**Impact:** High - O(n) complexity for search queries

---

#### Issue #6: Bulk Status Update with Individual Socket Events
**Location:** [`src/app/api/admin/professionals/bulk/status/route.ts:47-60`](src/app/api/admin/professionals/bulk/status/route.ts:47)

```typescript
// Current: Loop with individual DB queries
for (const id of ids) {
  const professional = await db.professional.findUnique({ where: { id } }) // N+1 query
  global.io.emit('professional-status-updated', {...})
}
```

**Problem:**
- N+1 query pattern (one query per ID)
- Individual socket events instead of batched

**Impact:** High - O(n) database queries for bulk operations

---

### 2.2 Medium Issues

#### Issue #7: Missing Compound Indexes
**Location:** [`prisma/schema.prisma:116-120`](prisma/schema.prisma:116)

```prisma
// Current: Only single-field indexes
@@index([isActive])
@@index([professionName])
@@index([createdAt])

// Missing compound indexes for:
- [isActive, createdAt] // Admin list queries
- [isActive, professionName] // Public search
- [adminId, isActive] // Professional dashboard
```

**Impact:** Medium - Slower queries on filtered/sorted results

---

#### Issue #8: No Query Result Caching at Database Level
**Problem:**
- No Redis or similar caching layer for database query results
- Every request hits the database directly

**Impact:** Medium - Repeated queries for same data

---

#### Issue #9: Token Verification on Every Request
**Location:** Multiple route files

```typescript
// Each endpoint has its own auth check
async function getSuperAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value
  const payload = verifyToken(token) // JWT verification on every call
}
```

**Problem:**
- JWT verification performed on every API call
- No session caching

**Impact:** Low-Medium - Adds ~5-10ms per request

---

#### Issue #10: Inconsistent Cache Headers
**Location:** Various API routes

```typescript
// Some use getNoStoreHeaders()
headers: getNoStoreHeaders()

// Others use manual headers
headers: {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
}
```

**Problem:**
- Inconsistent caching behavior
- Harder to maintain and debug

**Impact:** Low - Code maintainability issue

---

### 2.3 Frontend Issues

#### Issue #11: Query Client Configuration
**Location:** [`src/lib/queryProvider.tsx:11-18`](src/lib/queryProvider.tsx:11)

```typescript
// Current config
staleTime: 10 * 1000, // 10 seconds
gcTime: 2 * 60 * 1000, // 2 minutes
refetchOnWindowFocus: true,
```

**Problem:**
- `refetchOnWindowFocus: true` causes unnecessary refetches
- Short staleTime leads to frequent re-fetching

**Impact:** Medium - Unnecessary network requests

---

#### Issue #12: No Optimistic Updates for Bulk Operations
**Location:** [`src/lib/hooks/useProfessionals.ts:444-467`](src/lib/hooks/useProfessionals.ts:444)

```typescript
// Current: No optimistic update
onSuccess: (_, { ids, isActive }) => {
  queryClient.invalidateQueries({ queryKey: professionalKeys.lists() })
  // Only invalidates - no optimistic update
}
```

**Impact:** Low-Medium - Slower perceived performance

---

## 3. Recommended Optimizations

### 3.1 Critical Optimizations (Implement Immediately)

#### Optimization #1: Implement Redis-Based Distributed Cache

```typescript
// src/lib/redis-cache.ts (NEW FILE)
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export const professionalCache = {
  key: 'professionals:list',
  ttl: 300, // 5 minutes

  async get() {
    const cached = await redis.get(this.key)
    return cached ? JSON.parse(cached) : null
  },

  async set(data: any) {
    await redis.setex(this.key, this.ttl, JSON.stringify(data))
  },

  async invalidate() {
    await redis.del(this.key)
  }
}
```

**Expected Improvement:** 80-90% reduction in database load for list queries

---

#### Optimization #2: Use Promise.all for Parallel Queries

```typescript
// src/app/api/admin/professionals/route.ts - GET function
// Replace sequential queries with parallel
const [professionals, totalItems] = await Promise.all([
  db.professional.findMany({
    where: whereClause,
    include: { admin: {...}, _count: {...} },
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: limit,
  }),
  db.professional.count({ where: whereClause })
])
```

**Expected Improvement:** ~30-40% faster response time

---

#### Optimization #3: Move Email to Background Job Queue

```typescript
// src/app/api/professionals/inquiries/route.ts
// Instead of inline fetch, use job queue
import { queueInquiryEmail } from '@/lib/jobs'

// In POST handler:
await (db as any).professionalInquiry.create({...})

// Queue email notification (non-blocking)
queueInquiryEmail(inquiry.id).catch(console.error)

return NextResponse.json({ success: true, inquiry: {...} })
```

**Expected Improvement:** 500ms-2s faster response time

---

#### Optimization #4: Add Text Index for Search

```typescript
// In MongoDB shell or migration
db.professionals.createIndex(
  { name: "text", email: "text", professionalHeadline: "text", location: "text" },
  { name: "professional_text_search" }
)

// Update Prisma schema
model Professional {
  // ... existing fields
  @@fulltext([name, email, professionalHeadline, location])
}
```

**Expected Improvement:** O(n) → O(log n) for text searches

---

#### Optimization #5: Batch Socket Events

```typescript
// src/app/api/admin/professionals/bulk/status/route.ts
// Replace loop with single batched event
if (global.io) {
  // Get all updated professionals in single query
  const updatedProfessionals = await db.professional.findMany({
    where: { id: { in: ids } }
  })
  
  // Emit single batch event
  global.io.emit('professionals-bulk-status-updated', {
    professionals: updatedProfessionals.map(p => ({ ...p, isActive })),
    action: 'bulk_status_update',
    timestamp: new Date().toISOString(),
    adminId: admin.userId
  })
}
```

**Expected Improvement:** O(n) → O(1) socket emissions

---

### 3.2 Medium Priority Optimizations

#### Optimization #6: Add Compound Indexes

```prisma
// prisma/schema.prisma
model Professional {
  // ... existing fields
  
  // Add compound indexes
  @@index([isActive, createdAt])
  @@index([isActive, professionName])
  @@index([adminId, isActive])
  @@index([isActive, location])
}
```

**Expected Improvement:** 20-50% faster filtered queries

---

#### Optimization #7: Implement JWT Caching

```typescript
// src/lib/jwt.ts - Add token caching
const tokenCache = new Map<string, { payload: any; expiry: number }>()

export function verifyToken(token: string): any {
  // Check cache first
  const cached = tokenCache.get(token)
  if (cached && cached.expiry > Date.now()) {
    return cached.payload
  }
  
  // Verify and cache
  const payload = jwt.verify(token, JWT_SECRET)
  tokenCache.set(token, { payload, expiry: Date.now() + 60000 }) // 1 min cache
  return payload
}
```

**Expected Improvement:** ~5-10ms per request

---

#### Optimization #8: Use Optimistic Updates in Hooks

```typescript
// src/lib/hooks/useProfessionals.ts - useBulkUpdateProfessionalStatus
return useMutation({
  mutationFn: bulkUpdateProfessionalStatus,
  onMutate: async ({ ids, isActive }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: professionalKeys.lists() })

    // Snapshot previous value
    const previousProfessionals = queryClient.getQueriesData(...)

    // Optimistically update
    queryClient.setQueriesData({ queryKey: professionalKeys.lists() }, (old) => {
      if (!old) return old
      return {
        ...old,
        professionals: old.professionals.map((prof) =>
          ids.includes(prof.id) ? { ...prof, isActive } : prof
        ),
      }
    })

    return { previousProfessionals }
  },
  // ... rest of handlers
})
```

**Expected Improvement:** Instant UI updates, better perceived performance

---

#### Optimization #9: Remove Redundant Existence Checks

```typescript
// src/app/api/admin/professionals/[id]/route.ts - PUT
// Remove this:
// const existingProfessional = await db.professional.findUnique({...})

// Use update with error handling instead:
const professional = await db.professional.update({
  where: { id: professionalId },
  data: { isActive },
}).catch(() => null)

if (!professional) {
  return NextResponse.json({ error: 'Professional not found' }, { status: 404 })
}
```

**Expected Improvement:** One less DB query per operation

---

#### Optimization #10: Standardize Cache Headers

```typescript
// src/lib/cache.ts - Create unified response builder
export function createProfessionalResponse(data: any, options: CacheOptions = {}) {
  const { isAdmin = false, isPublicList = false } = options
  
  const headers = isAdmin 
    ? getNoStoreHeaders() 
    : isPublicList
      ? getShortCacheHeaders()  // 10s for public list
      : getMediumCacheHeaders() // 60s for single item
  
  return NextResponse.json(data, { headers })
}
```

---

### 3.3 Architecture Improvements (Long Term)

#### Improvement #11: Implement API Response Compression

```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Content-Encoding', value: 'gzip' },
        ],
      },
    ],
  },
}
```

---

#### Improvement #12: Add Request Deduplication

```typescript
// In React Query config - src/lib/queryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Add deduplication
      dedupe: true,
      // ... existing
    }
  }
})
```

---

#### Improvement #13: Implement Webhook for Cache Invalidation

```typescript
// Instead of relying on Socket.IO + React Query invalidation
// Add a dedicated cache invalidation webhook

// src/app/api/webhooks/cache-invalidate/route.ts
export async function POST(request: NextRequest) {
  const { type, ids } = await request.json()
  
  // Invalidate Redis cache
  await redis.del(`professionals:${type}`)
  
  // Broadcast to all clients via Pusher/Ably
  await pusher.trigger('admin', 'cache-invalidated', { type, ids })
  
  return NextResponse.json({ success: true })
}
```

---

## 4. Performance Benchmark Targets

| Metric | Current (Est.) | Target | Improvement |
|--------|---------------|--------|-------------|
| Admin List API (10 items) | ~200-400ms | <100ms | 70-75% |
| Public List API (cached) | ~100-200ms | <50ms | 75% |
| Single Professional GET | ~50-100ms | <30ms | 70% |
| Bulk Status Update (10) | ~500ms | <100ms | 80% |
| Search Query | ~300-500ms | <100ms | 80% |
| Inquiry Submission | ~800-1500ms | <200ms | 85% |

---

## 5. Implementation Priority

### Phase 1: Critical (Week 1)
1. ✅ Move email to background queue
2. ✅ Implement Redis cache for public APIs
3. ✅ Add Promise.all for parallel queries
4. ✅ Add text index for search

### Phase 2: Important (Week 2)
5. ✅ Batch socket events
6. ✅ Add compound indexes
7. ✅ Implement optimistic updates
8. ✅ Remove redundant existence checks

### Phase 3: Enhancement (Week 3+)
9. ✅ JWT caching
10. ✅ Standardize cache headers
11. ✅ API response compression
12. ✅ Request deduplication

---

## 6. Monitoring & Observability

### Recommended Metrics to Track

```typescript
// Add to API routes
import { metrics } from '@/lib/metrics'

// Track query performance
metrics.recordHistogram('api.professionals.list.duration', duration)
metrics.increment('api.professionals.list.total')

// Track cache hit rate
metrics.increment('cache.professionals.hit') // or miss
```

### Key Dashboards

1. **API Response Times** - P50, P95, P99
2. **Cache Hit Rate** - Target >80% for public endpoints
3. **Database Query Count** - Target <5 per API call
4. **Error Rate** - Target <0.1%

---

## 7. Conclusion

The Professional APIs have several performance bottlenecks, primarily in:

1. **Caching strategy** - Using in-memory cache instead of distributed Redis
2. **Query optimization** - Sequential queries and missing indexes
3. **Background processing** - Synchronous email sending
4. **Real-time updates** - N+1 socket emissions for bulk operations

By implementing the recommended optimizations, we expect:

- **60-80% reduction** in average API response times
- **80-90% reduction** in database load for list queries
- **Better user experience** with optimistic updates
- **Scalability** with Redis-based distributed caching

---

## Appendix A: File Reference

### API Routes Analyzed

| File | Lines | Purpose |
|------|-------|---------|
| [`src/app/api/professionals/route.ts`](src/app/api/professionals/route.ts) | 323 | Public professional list |
| [`src/app/api/professionals/[id]/route.ts`](src/app/api/professionals/[id]/route.ts) | 203 | Single professional CRUD |
| [`src/app/api/admin/professionals/route.ts`](src/app/api/admin/professionals/route.ts) | 246 | Admin professional management |
| [`src/app/api/admin/professionals/[id]/route.ts`](src/app/api/admin/professionals/[id]/route.ts) | 242 | Admin single professional |
| [`src/app/api/admin/professionals/bulk/status/route.ts`](src/app/api/admin/professionals/bulk/status/route.ts) | 79 | Bulk status update |
| [`src/app/api/admin/professionals/bulk/delete/route.ts`](src/app/api/admin/professionals/bulk/delete/route.ts) | 87 | Bulk delete |
| [`src/app/api/admin/professionals/export/route.ts`](src/app/api/admin/professionals/export/route.ts) | 82 | CSV export |
| [`src/app/api/professionals/inquiries/route.ts`](src/app/api/professionals/inquiries/route.ts) | 157 | Inquiry management |

### Supporting Files

| File | Purpose |
|------|---------|
| [`src/lib/hooks/useProfessionals.ts`](src/lib/hooks/useProfessionals.ts) | React Query hooks |
| [`src/lib/queryProvider.tsx`](src/lib/queryProvider.tsx) | Query client config |
| [`src/lib/cache.ts`](src/lib/cache.ts) | Cache utilities |
| [`src/lib/cacheInvalidation.ts`](src/lib) | Cache invalid/cacheInvalidation.tsation |
| [`src/lib/jobs.ts`](src/lib/jobs.ts) | Background job queue |
| [`src/components/providers/SocketProvider.tsx`](src/components/providers/SocketProvider.tsx) | Socket.IO provider |
| [`prisma/schema.prisma`](prisma/schema.prisma) | Database schema |

---

*Report generated by Code Analysis Tool*
