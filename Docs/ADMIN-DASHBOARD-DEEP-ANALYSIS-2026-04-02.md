# Admin Dashboard Deep Analysis

Date: 2026-04-02
Scope: Admin dashboard frontend and related admin APIs

## 1) What I reviewed

- Frontend dashboard modules under src/app/dashboard/admin
- Admin APIs under src/app/api/admin
- Registration inquiry APIs under src/app/api/registration-inquiries
- Socket synchronization path for admin realtime updates

## 2) Confirmed issues (what is not working)

### Critical

1. Business bulk delete is broken due request/response contract mismatch
- Frontend sends payload key ids:
  - src/app/dashboard/admin/hooks/useBulkActions.ts:97
- API expects payload key businessIds and rejects ids:
  - src/app/api/admin/businesses/bulk/delete/route.ts:23
  - src/app/api/admin/businesses/bulk/delete/route.ts:36
  - src/app/api/admin/businesses/bulk/delete/route.ts:37
- User impact: bulk business deletion returns 400 and fails consistently.

2. Registration inquiry status updates are sent to a non-existent dynamic route
- Dashboard/hook calls /api/registration-inquiries/{id}:
  - src/app/dashboard/admin/hooks/useRegistrationActions.ts:45
  - src/app/dashboard/admin/hooks/useRegistrationActions.ts:122
  - src/app/dashboard/admin/hooks/useRegistrationActions.ts:149
  - src/app/dashboard/admin/hooks/useRegistrationActions.ts:207
  - src/app/dashboard/admin/page.tsx:2753
- But no dynamic route exists at src/app/api/registration-inquiries/[id]/route.ts.
- Current file with PUT/DELETE is non-dynamic route file and includes params usage that does not match this path shape:
  - src/app/api/registration-inquiries/route.ts:189
  - src/app/api/registration-inquiries/route.ts:191
  - src/app/api/registration-inquiries/route.ts:232
- User impact: inquiry status transitions (UNDER_REVIEW, COMPLETED, REJECTED) are likely failing in the admin flow.

### High

3. Realtime stats can become incorrect after delete events
- Socket sync decrements active counters unconditionally on delete:
  - src/app/dashboard/admin/hooks/useSocketSync.ts:86
  - src/app/dashboard/admin/hooks/useSocketSync.ts:165
- User impact: active counts can drift negative or become inaccurate when deleting inactive records.

4. Registration workflows are fragmented across two API designs
- Frontend mostly uses /api/registration-inquiries/*
- New admin endpoints exist at /api/admin/registration-inquiries/[id]/approve and reject
- This split increases risk of stale paths and inconsistent behavior.

5. Query sort fields are not allowlisted in list APIs
- sortBy and sortOrder are read from query and forwarded into Prisma orderBy directly in list handlers.
- User impact: malformed/malicious sortBy can produce 500 errors and unstable behavior.

### Medium

6. Professional form state is partially dead / not submitted
- Several advanced profile states exist (work experience, education, skills, services, portfolio, social links) but create/update calls send only basic fields.
- User impact: admins may expect these fields to persist, but payload does not include them.

7. Duplicate state systems increase inconsistency risk
- The page keeps both full arrays and paginated data objects for similar entities.
- Socket updates and table fetch updates can diverge under concurrent changes.

8. Inconsistent REST semantics
- Update handlers are implemented using POST for resource updates in multiple places where PUT/PATCH would be clearer.
- This does not always break functionality, but increases maintenance cost and confusion.

9. Sensitive debug logging in registration inquiries API
- GET path logs detailed debug traces in server output:
  - src/app/api/registration-inquiries/route.ts
- User impact: noisy logs and possible exposure of operational details in production logs.

## 3) What appears to be working

- Role gating is broadly present on admin endpoints (SUPER_ADMIN checks)
- Zod validation is used across most write operations
- Transactions are used in critical create/delete flows for business/professional lifecycle
- Export endpoints are implemented cleanly for businesses/professionals
- Dedicated approve/reject admin endpoints exist for registration inquiries (good direction)

## 4) Root-cause summary

Primary root causes are API contract drift and duplicated logic:

- Contract drift: frontend and backend payload shapes are not centrally typed/shared.
- Path drift: old registration routes coexist with newer admin routes.
- State drift: multiple overlapping state stores (manual arrays + paginated state + socket updates).

## 5) How to make it better (prioritized)

## Phase 1: Fix broken behavior first (same day)

1. Unify bulk delete payload contract
- Option A: change business bulk delete API to accept ids
- Option B: change frontend business bulk delete payload to businessIds
- Preferred: align all bulk endpoints to ids for consistency.

2. Fix registration inquiry status pathing
- Create dynamic route src/app/api/registration-inquiries/[id]/route.ts OR
- Migrate frontend to admin approve/reject endpoints only.
- Preferred: use admin approve/reject endpoints and remove legacy status update flow from dashboard.

3. Correct socket counter logic
- On delete events, decrement active count only if deleted entity was active.
- Clamp to minimum 0 to avoid negative counters.

4. Add allowlists for sortable fields
- Validate sortBy against explicit enum before using Prisma orderBy.

## Phase 2: Stabilize architecture (1-3 days)

5. Define shared request/response types for admin API contracts
- Put in a shared types module and use on both frontend hooks and route handlers.

6. Remove duplicate registration flow code paths
- Keep one canonical process:
  - approve endpoint creates account + marks inquiry completed
  - reject endpoint marks rejected with notes

7. Consolidate dashboard state management
- Move to a single source of truth per entity (React Query preferred) and treat socket events as cache updates.

8. Normalize error handling
- Return consistent shape { error, code, details? } and show actionable toasts.

## Phase 3: Quality and ops hardening (3-7 days)

9. Add integration tests for admin-critical flows
- bulk delete/status for businesses and professionals
- inquiry approve/reject and status transitions
- auth guard verification on all admin endpoints

10. Add observability and audit quality
- Structured logs with requestId
- Capture failed email notifications with retry queue
- Ensure audit log entries for all admin mutations

11. Add strict security controls
- Rate limiting and CSRF policy checks on admin mutating endpoints
- Validate content-length/file constraints for import route

## 6) Suggested test checklist

Functional
- Business bulk delete from UI succeeds and removes selected rows
- Registration inquiry approve/reject updates status correctly
- Account creation from inquiry sends credentials and updates inquiry state
- Socket updates keep cards/counters in sync under multi-tab usage

Contract
- All bulk endpoints accept identical payload shape
- All list endpoints reject invalid sortBy with 400 (not 500)

Security
- Non-super-admin gets 401 on every admin endpoint
- Mutating routes reject missing/invalid auth token

Reliability
- Concurrent updates from two tabs do not corrupt pagination or counters
- Import route handles malformed CSV with deterministic errors

## 7) Notes from validation

- I attempted lint execution, but script invocation failed in this environment with:
  - Invalid project directory provided, no such directory: E:\Projects - 2025\DigiSence\lint
- Static analysis above is based on direct code inspection and route/hook contract tracing.

## 8) Immediate action plan recommendation

1. Fix bulk delete payload mismatch.
2. Replace registration status updates in dashboard with admin approve/reject endpoints.
3. Patch socket counter decrement logic.
4. Add shared contract types for all admin bulk/list endpoints.
5. Add regression tests for these three flows before further refactor.

## 9) End-to-end execution plan (implementation order)

### Stage A: Contract and endpoint stabilization
- Unify bulk endpoint payload shape to ids across admin entities.
- Remove dashboard dependency on /api/registration-inquiries/{id} and use canonical admin approve/reject endpoints.
- Keep backward compatibility where needed to avoid breaking in-flight clients.

### Stage B: State correctness and realtime consistency
- Update socket delete handlers to prevent negative counters.
- Carry entity isActive state in delete events so active counters only decrement when appropriate.
- Clamp computed counters with Math.max(0, value - 1) in destructive update paths.

### Stage C: Validation and hardening
- Validate changed files with diagnostics.
- Run targeted regression checks for:
  - Business bulk delete
  - Inquiry approve
  - Inquiry reject
  - Counter correctness on delete events
- Update technical docs with final status and residual follow-up work.

## 10) Implementation status (completed now)

Completed in code:

1. Business bulk delete contract fixed and made backward compatible
- Updated API to accept ids (primary) and legacy businessIds (fallback).
- File: src/app/api/admin/businesses/bulk/delete/route.ts

2. Registration inquiry flow migrated to canonical admin endpoints
- Dashboard hook now calls:
  - POST /api/admin/registration-inquiries/{id}/approve
  - POST /api/admin/registration-inquiries/{id}/reject
- Removed legacy dashboard calls to /api/registration-inquiries/{id}.
- Files:
  - src/app/dashboard/admin/hooks/useRegistrationActions.ts
  - src/app/dashboard/admin/page.tsx

3. Realtime counter drift patched
- Delete handlers now clamp totals and only decrement active counters when event payload confirms isActive.
- File: src/app/dashboard/admin/hooks/useSocketSync.ts

4. Delete event payloads enriched for counter accuracy
- Added isActive to delete broadcasts for business/professional delete flows.
- Files:
  - src/app/api/admin/businesses/route.ts
  - src/app/api/admin/professionals/[id]/route.ts
  - src/app/api/admin/professionals/bulk/delete/route.ts

5. Sort field allowlists added to admin list APIs
- Businesses and professionals list routes now validate sortBy/sortOrder against explicit allowed values.
- Files:
  - src/app/api/admin/businesses/route.ts
  - src/app/api/admin/professionals/route.ts

6. Legacy registration inquiry route normalized
- Collection route now handles collection operations only (GET/POST).
- Dynamic [id] route is the canonical item mutation path (GET/PUT/DELETE) with super-admin checks.
- Files:
  - src/app/api/registration-inquiries/route.ts
  - src/app/api/registration-inquiries/[id]/route.ts

## 11) Remaining follow-up (recommended)

- Add allowlists for sortBy fields in list endpoints to avoid invalid Prisma orderBy.
- Add integration tests around inquiry approval and bulk operations.
- Normalize all admin response envelopes to shared typed contracts.

Status update:
- Sort allowlists completed.
