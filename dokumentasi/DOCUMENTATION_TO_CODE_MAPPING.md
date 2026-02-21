# 🗺️ API Documentation to Code Mapping

**Versi:** 1.0  
**Tanggal:** February 2026  
**Purpose:** Map dokumentasi ke implementasi actual di codebase

---

## 📍 Dokumentasi → Source Code Mapping

### API Wrapper & Base Implementation

| Dokumentasi | File Source | Penjelasan |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#api-wrapper](./API_DOCUMENTATION_COMPLETE.md#1-api-wrapper-apifetch) | [src/lib/wraper.ts](../src/lib/wraper.ts) | Base fetch wrapper dengan error handling & token attachment |
| [ARCHITECTURE_AND_INTEGRATION.md#api-request-cycle](./ARCHITECTURE_AND_INTEGRATION.md#api-requestresponse-cycle) | [src/lib/wraper.ts](../src/lib/wraper.ts#L1-L50) | Request flow implementation |

---

### API Modules Implementation

#### Species/Trees API
| Dokumentasi | File Source | Methods |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#1-api-spesies-pohon](./API_DOCUMENTATION_COMPLETE.md#1️⃣-api-spesies-pohon-treesspecies) | [src/lib/apiSpecies.ts](../src/lib/apiSpecies.ts) | `getAllSpecies()`, `getSpeciesById()`, `getSpeciesByCategory()`, `searchSpecies()` |
| [API_INTEGRATION_GUIDE.md#task-1](./API_INTEGRATION_GUIDE.md#task-1-fetch-all-species) | [src/lib/apiSpecies.ts](../src/lib/apiSpecies.ts#L1-L15) | Basic fetch example |
| [API_INTEGRATION_GUIDE.md#task-2](./API_INTEGRATION_GUIDE.md#task-2-search--filter-species) | [src/lib/apiSpecies.ts](../src/lib/apiSpecies.ts#L41-L61) | Search with debounce |

#### Order/Adoption API
| Dokumentasi | File Source | Methods |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#3-api-orderadopsi](./API_DOCUMENTATION_COMPLETE.md#3️⃣-api-orderadopsi-orders) | [src/lib/apiOrder.ts](../src/lib/apiOrder.ts) | `createOrder()`, `getPendingPayments()`, `createPayment()` |
| [API_INTEGRATION_GUIDE.md#task-5](./API_INTEGRATION_GUIDE.md#task-5-create-order-adoption) | [src/lib/apiOrder.ts](../src/lib/apiOrder.ts) | Order creation example |
| [API_INTEGRATION_GUIDE.md#task-6](./API_INTEGRATION_GUIDE.md#task-6-process-payment-with-midtrans) | [src/lib/apiOrder.ts](../src/lib/apiOrder.ts) | Payment integration |

#### Dashboard API
| Dokumentasi | File Source | Methods |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#4-api-dashboardadopsi](./API_DOCUMENTATION_COMPLETE.md#4️⃣-api-dashboardadopsi-adoptions) | [src/lib/apiDashboard.ts](../src/lib/apiDashboard.ts) | `getDashboard()`, `getAdoptionDetail()`, `getStatsAdoption()` |
| [API_INTEGRATION_GUIDE.md#task-7](./API_INTEGRATION_GUIDE.md#task-7-fetch-dashboard-adoptions) | [src/lib/apiDashboard.ts](../src/lib/apiDashboard.ts) | Dashboard fetch example |
| [API_INTEGRATION_GUIDE.md#task-8](./API_INTEGRATION_GUIDE.md#task-8-fetch-adoption-stats) | [src/lib/apiDashboard.ts](../src/lib/apiDashboard.ts) | Stats fetching |

#### Login/Auth API
| Dokumentasi | File Source | Methods |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#2-api-autentikasi-auth](./API_DOCUMENTATION_COMPLETE.md#2️⃣-api-autentikasi-auth) | [src/lib/apiLogin.ts](../src/lib/apiLogin.ts) | `getProfile()` |
| [API_INTEGRATION_GUIDE.md#task-10](./API_INTEGRATION_GUIDE.md#task-10-get-user-profile) | [src/lib/apiLogin.ts](../src/lib/apiLogin.ts) | Profile fetch example |

---

## 🎨 Component Implementations

### Adopt Page Feature

| Dokumentasi | Component | Path |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#flow-1-user-menjelajahi](./API_DOCUMENTATION_COMPLETE.md#-flow-1-user-menjelajahi--mengadopsi-pohon) | AdoptPage | [src/app/adopt/page.tsx](../src/app/adopt/page.tsx) |
| [API_INTEGRATION_GUIDE.md#task-2](./API_INTEGRATION_GUIDE.md#task-2-search--filter-species) | Search with debounce | [src/app/adopt/page.tsx#L70-L90](../src/app/adopt/page.tsx#L70-L90) |
| [API_INTEGRATION_GUIDE.md#task-5](./API_INTEGRATION_GUIDE.md#task-5-create-order-adoption) | OrderModal | [src/components/adopt/OrderModal.tsx](../src/components/adopt/OrderModal.tsx) |
| [API_INTEGRATION_GUIDE.md#task-6](./API_INTEGRATION_GUIDE.md#task-6-process-payment-with-midtrans) | PaymentModal | [src/components/adopt/PaymentModal.tsx](../src/components/adopt/PaymentModal.tsx) |
| [API_INTEGRATION_GUIDE.md#task-1](./API_INTEGRATION_GUIDE.md#task-1-fetch-all-species) | SpeciesCard | [src/components/adopt/AdoptSpeciesCard.tsx](../src/components/adopt/AdoptSpeciesCard.tsx) |
| [REAL_WORLD_EXAMPLES.md#full-adopt-flow](./REAL_WORLD_EXAMPLES.md#full-adopt-flow-implementation) | Complete example | [src/app/adopt/page.tsx](../src/app/adopt/page.tsx) |

**Key Implementation:**
```typescript
// File: src/app/adopt/page.tsx
// Shows:
// 1. State management (species, filters, modal)
// 2. API calls (getTree.searchSpecies)
// 3. Debounce implementation
// 4. Error handling
// 5. Component composition
// 6. User interaction handling
```

---

### Dashboard Feature

| Dokumentasi | Component | Path |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#flow-2-user-melihat-dashboard](./API_DOCUMENTATION_COMPLETE.md#-flow-2-user-melihat-dashboard-adopsi) | DashboardPage | [src/app/dashboard/page.tsx](../src/app/dashboard/page.tsx) |
| [API_INTEGRATION_GUIDE.md#task-7](./API_INTEGRATION_GUIDE.md#task-7-fetch-dashboard-adoptions) | Adoptions List | [src/components/dashboard/AdoptionList.tsx](../src/components/dashboard/AdoptionList.tsx) |
| [API_INTEGRATION_GUIDE.md#task-8](./API_INTEGRATION_GUIDE.md#task-8-fetch-adoption-stats) | Stats Display | [src/components/dashboard/AdoptionStats.tsx](../src/components/dashboard/AdoptionStats.tsx) |
| [API_INTEGRATION_GUIDE.md#task-9](./API_INTEGRATION_GUIDE.md#task-9-get-adoption-detail) | Detail Modal | [src/components/dashboard/AdoptionDetailModal.tsx](../src/components/dashboard/AdoptionDetailModal.tsx) |
| [REAL_WORLD_EXAMPLES.md#dashboard-with-real-data](./REAL_WORLD_EXAMPLES.md#dashboard-with-real-data) | Complete example | [src/app/dashboard/page.tsx](../src/app/dashboard/page.tsx) |

**Key Implementation:**
```typescript
// File: src/app/dashboard/page.tsx
// Shows:
// 1. Parallel API calls (Promise.all)
// 2. Loading states
// 3. Error handling
// 4. Data display logic
// 5. Modal management
```

---

### Home Page Components

| Dokumentasi | Component | Path |
|---|---|---|
| [API_DOCUMENTATION_COMPLETE.md#pengenalan-sistem](./API_DOCUMENTATION_COMPLETE.md#pengenalan-sistem-api) | Header | [src/components/home/Header.tsx](../src/components/home/Header.tsx) |
| - | AboutSection | [src/components/home/AboutSection.tsx](../src/components/home/AboutSection.tsx) |
| - | ProjectArea | [src/components/home/ProjectArea.tsx](../src/components/home/ProjectArea.tsx) |
| - | GoalsSection | [src/components/home/GoalsSection.tsx](../src/components/home/GoalsSection.tsx) |
| - | TeamMember | [src/components/home/TeamMember.tsx](../src/components/home/TeamMember.tsx) |
| - | Footer | [src/components/home/Footer.tsx](../src/components/home/Footer.tsx) |

---

## 🔍 By API Endpoint

### GET /api/v1/trees/species

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#get-ambil-semua-spesies](./API_DOCUMENTATION_COMPLETE.md#get---ambil-semua-spesies)
- Architecture: [ARCHITECTURE_AND_INTEGRATION.md#1-speciestree-catalog-flow](./ARCHITECTURE_AND_INTEGRATION.md#1-speciestree-catalog-flow)

**Implementation:**
- API Module: [src/lib/apiSpecies.ts#getAllSpecies](../src/lib/apiSpecies.ts#L4-L12)
- Example: [API_INTEGRATION_GUIDE.md#task-1](./API_INTEGRATION_GUIDE.md#task-1-fetch-all-species)
- Real Component: [src/app/adopt/page.tsx#fetchAllSpecies](../src/app/adopt/page.tsx#L38-L58)

---

### GET /api/v1/trees/species?search=...&category=...

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#get-search-spesies](./API_DOCUMENTATION_COMPLETE.md#get---search-spesies)
- Architecture: [ARCHITECTURE_AND_INTEGRATION.md#3-search-spesies-dengan-live-search](./ARCHITECTURE_AND_INTEGRATION.md#3-search-spesies-dengan-live-search)

**Implementation:**
- API Module: [src/lib/apiSpecies.ts#searchSpecies](../src/lib/apiSpecies.ts#L37-L61)
- Example: [API_INTEGRATION_GUIDE.md#task-2](./API_INTEGRATION_GUIDE.md#task-2-search--filter-species)
- Debounce: [ARCHITECTURE_AND_INTEGRATION.md#debounce-pattern](./ARCHITECTURE_AND_INTEGRATION.md#debounce-pattern)
- Real Component: [src/app/adopt/page.tsx#useEffect-debounce](../src/app/adopt/page.tsx#L64-L88)

---

### POST /api/v1/orders

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#post-buat-orderadopsi-baru](./API_DOCUMENTATION_COMPLETE.md#post---buat-orderadopsi-baru)
- Flow: [API_DOCUMENTATION_COMPLETE.md#flow-end-to-end#2-order-creation-flow](./API_DOCUMENTATION_COMPLETE.md#2-order-creation-flow)

**Implementation:**
- API Module: [src/lib/apiOrder.ts#createOrder](../src/lib/apiOrder.ts#L8-L18)
- Example: [API_INTEGRATION_GUIDE.md#task-5](./API_INTEGRATION_GUIDE.md#task-5-create-order-adoption)
- Real Component: [src/components/adopt/OrderModal.tsx#handleCreateOrder](../src/components/adopt/OrderModal.tsx#L40-L70)

---

### POST /api/v1/orders/:orderId/payment

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#post-buat-payment-untuk-order](./API_DOCUMENTATION_COMPLETE.md#post---buat-payment-untuk-order)
- Flow: [API_DOCUMENTATION_COMPLETE.md#3-payment-processing-flow](./API_DOCUMENTATION_COMPLETE.md#3-payment-processing-flow)
- Midtrans: [API_DOCUMENTATION_COMPLETE.md#11-redirect-ke-midtrans-snap](./API_DOCUMENTATION_COMPLETE.md#11-redirect-ke-midtrans-snap)

**Implementation:**
- API Module: [src/lib/apiOrder.ts#createPayment](../src/lib/apiOrder.ts#L20-L26)
- Example: [API_INTEGRATION_GUIDE.md#task-6](./API_INTEGRATION_GUIDE.md#task-6-process-payment-with-midtrans)
- Real Component: [src/components/adopt/PaymentModal.tsx#handlePayment](../src/components/adopt/PaymentModal.tsx#L30-L70)

---

### GET /api/v1/adoptions

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#get-ambil-daftar-adopsi-user](./API_DOCUMENTATION_COMPLETE.md#get---ambil-daftar-adopsi-user)
- Flow: [ARCHITECTURE_AND_INTEGRATION.md#4-dashboardadoption-view-flow](./ARCHITECTURE_AND_INTEGRATION.md#4-dashboardadoption-view-flow)

**Implementation:**
- API Module: [src/lib/apiDashboard.ts#getDashboard](../src/lib/apiDashboard.ts#L5-L10)
- Example: [API_INTEGRATION_GUIDE.md#task-7](./API_INTEGRATION_GUIDE.md#task-7-fetch-dashboard-adoptions)
- Real Component: [src/app/dashboard/page.tsx#fetchDashboardData](../src/app/dashboard/page.tsx#L45-L73)

---

### GET /api/v1/adoptions/stats

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#get-ambil-statistik-adopsi](./API_DOCUMENTATION_COMPLETE.md#get---ambil-statistik-adopsi)

**Implementation:**
- API Module: [src/lib/apiDashboard.ts#getStatsAdoption](../src/lib/apiDashboard.ts#L20-L24)
- Example: [API_INTEGRATION_GUIDE.md#task-8](./API_INTEGRATION_GUIDE.md#task-8-fetch-adoption-stats)
- Real Component: [src/app/dashboard/page.tsx#statsResponse](../src/app/dashboard/page.tsx#L67-L71)

---

### GET /api/v1/adoptions/:adoptionId

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#get-ambil-detail-adopsi-spesifik](./API_DOCUMENTATION_COMPLETE.md#get---ambil-detail-adopsi-spesifik)

**Implementation:**
- API Module: [src/lib/apiDashboard.ts#getAdoptionDetail](../src/lib/apiDashboard.ts#L13-L17)
- Example: [API_INTEGRATION_GUIDE.md#task-9](./API_INTEGRATION_GUIDE.md#task-9-get-adoption-detail)
- Real Component: [src/components/dashboard/AdoptionDetailModal.tsx](../src/components/dashboard/AdoptionDetailModal.tsx)

---

### GET /api/v1/auth/me

**Dokumentasi:**
- Detail: [API_DOCUMENTATION_COMPLETE.md#get-get-current-user-profile](./API_DOCUMENTATION_COMPLETE.md#get---get-current-user-profile)

**Implementation:**
- API Module: [src/lib/apiLogin.ts#getProfile](../src/lib/apiLogin.ts#L3-L14)
- Example: [API_INTEGRATION_GUIDE.md#task-10](./API_INTEGRATION_GUIDE.md#task-10-get-user-profile)
- Real Component: [src/components/profile/page.tsx](../src/components/profile/page.tsx)

---

## 🎓 Learning Paths by Role

### Frontend Developer - Implementing Features

**Path:**
1. Read: [API_DOCS_INDEX.md](./API_DOCS_INDEX.md) - Overview
2. Find: Your feature endpoint mapping above
3. Read: Relevant "Dokumentasi" link
4. Code: Copy from "Implementation" links
5. Test: With real API

**Example - Implementing Adopt Feature:**
1. [API_DOCS_INDEX.md](./API_DOCS_INDEX.md#-saya-ingin-)
2. [API_DOCUMENTATION_COMPLETE.md#daftar-endpoint-api](./API_DOCUMENTATION_COMPLETE.md#daftar-endpoint-api)
3. [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md#-common-tasks--code-examples)
4. [REAL_WORLD_EXAMPLES.md#full-adopt-flow](./REAL_WORLD_EXAMPLES.md#full-adopt-flow-implementation)
5. Check [src/app/adopt/page.tsx](../src/app/adopt/page.tsx) for reference

---

### Backend Developer - Understanding Frontend Integration

**Path:**
1. Read: [ARCHITECTURE_AND_INTEGRATION.md](./ARCHITECTURE_AND_INTEGRATION.md)
2. Study: Component integration maps above
3. Check: How data flows from API to UI
4. Review: Error handling & status codes

**Key Files:**
- [ARCHITECTURE_AND_INTEGRATION.md#high-level-architecture](./ARCHITECTURE_AND_INTEGRATION.md#high-level-architecture-diagram)
- [ARCHITECTURE_AND_INTEGRATION.md#data-flow-architecture](./ARCHITECTURE_AND_INTEGRATION.md#data-flow-architecture)
- [API_DOCUMENTATION_COMPLETE.md#error-handling](./API_DOCUMENTATION_COMPLETE.md#error-handling--best-practices)

---

### API Designer - Planning New Features

**Path:**
1. Read: [ARCHITECTURE_AND_INTEGRATION.md](./ARCHITECTURE_AND_INTEGRATION.md)
2. Study: Existing patterns in code
3. Check: How components consume API
4. Design: Following established patterns

**Key Resources:**
- [ARCHITECTURE_AND_INTEGRATION.md#state-management-pattern](./ARCHITECTURE_AND_INTEGRATION.md#state-management-pattern)
- [ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture](./ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture)
- Component implementations above

---

## 🔗 Cross-References

### By Concept

**State Management:**
- Pattern: [ARCHITECTURE_AND_INTEGRATION.md#state-management-pattern](./ARCHITECTURE_AND_INTEGRATION.md#state-management-pattern)
- Example: [REAL_WORLD_EXAMPLES.md#state-management-patterns](./REAL_WORLD_EXAMPLES.md#state-management-patterns)
- Real Code: [src/app/adopt/page.tsx](../src/app/adopt/page.tsx) & [src/app/dashboard/page.tsx](../src/app/dashboard/page.tsx)

**Error Handling:**
- Pattern: [ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture](./ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture)
- Example: [API_INTEGRATION_GUIDE.md#error-handling--retry](./API_INTEGRATION_GUIDE.md#error-handling--retry)
- Real Code: [src/lib/wraper.ts](../src/lib/wraper.ts#L20-L45)

**Debouncing:**
- Pattern: [ARCHITECTURE_AND_INTEGRATION.md#debounce-pattern](./ARCHITECTURE_AND_INTEGRATION.md#debounce-pattern)
- Example: [API_INTEGRATION_GUIDE.md#task-2](./API_INTEGRATION_GUIDE.md#task-2-search--filter-species)
- Real Code: [src/app/adopt/page.tsx#useEffect](../src/app/adopt/page.tsx#L64-L88)

**Parallel Requests:**
- Pattern: [ARCHITECTURE_AND_INTEGRATION.md#parallel-requests](./ARCHITECTURE_AND_INTEGRATION.md#parallel-requests)
- Example: [API_INTEGRATION_GUIDE.md#task-7](./API_INTEGRATION_GUIDE.md#task-7-fetch-dashboard-adoptions)
- Real Code: [src/app/dashboard/page.tsx#Promise.all](../src/app/dashboard/page.tsx#L47-L55)

---

## 📊 Documentation Coverage Matrix

| Feature | API Docs | Architecture | Integration Guide | Real Examples | Source Code |
|---------|----------|--------------|-------------------|---------------|-------------|
| Species Fetch | ✅ | ✅ | ✅ | ✅ | ✅ |
| Species Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| Order Creation | ✅ | ✅ | ✅ | ✅ | ✅ |
| Payment Midtrans | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Adoption Stats | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ | ✅ | ✅ |
| Performance | ✅ | ✅ | ✅ | ✅ | ✅ |
| Security | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🚀 Quick Navigation

### I want to...

**...understand how a feature works:**
→ Find feature in "Component Implementations" above → Read "Real Component" links

**...implement a new feature:**
→ Read [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) → Copy code from examples → Check existing component in source code

**...debug an API issue:**
→ Check endpoint in "By API Endpoint" section above → Read Dokumentasi link → Check source code implementation

**...optimize performance:**
→ Read [ARCHITECTURE_AND_INTEGRATION.md#performance-optimization](./ARCHITECTURE_AND_INTEGRATION.md#performance-optimization)

**...understand error handling:**
→ Read [ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture](./ARCHITECTURE_AND_INTEGRATION.md#error-handling-architecture) → Check source code

**...learn the codebase:**
→ Follow "Learning Paths by Role" above

---

## 📝 Files Summary

### Documentation Files (5)
1. **API_DOCUMENTATION_COMPLETE.md** - Full technical reference
2. **ARCHITECTURE_AND_INTEGRATION.md** - System design & flows
3. **API_INTEGRATION_GUIDE.md** - Practical code examples
4. **REAL_WORLD_EXAMPLES.md** - Production implementations
5. **API_DOCS_INDEX.md** - Navigation hub

### Source Code Files (Referenced)
- **API Layer:** `src/lib/wraper.ts`, `apiSpecies.ts`, `apiOrder.ts`, `apiDashboard.ts`, `apiLogin.ts`
- **Pages:** `src/app/adopt/page.tsx`, `src/app/dashboard/page.tsx`
- **Components:** `src/components/adopt/`, `src/components/dashboard/`, etc.
- **Types:** `src/types/index.ts`

---

**Last Updated:** February 21, 2026  
**Status:** ✅ Complete Mapping Ready
