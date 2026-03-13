# 🔍 PohonKu Frontend — Full Data Layer Audit Report

> **Date:** 2026-03-11  
> **Stack:** Next.js 14 · PostgreSQL (backend) · Midtrans (payment)  
> **Backend URL:** `https://be-production-1e0b.up.railway.app`

---

## PHASE 1 — PROJECT MAPPING

### `/src/lib` — API / Service Layer (7 files)

| File | Purpose |
|---|---|
| [wrapper.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/wrapper.ts) | Generic `apiFetch<T>` wrapper with Bearer token from `localStorage` |
| [apiLogin.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/apiLogin.ts) | `getProfile()` — `GET /api/v1/auth/me` (**no auth header sent!**) |
| [apiDashboard.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/apiDashboard.ts) | `getDashboard()`, `getAdoptionDetail()`, `getStatsAdoption()` via `apiFetch` |
| [apiOrder.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/apiOrder.ts) | Legacy `Order` class — `POST /api/v1/orders` (hardcoded `nameOnTag: 'John Doe'`) |
| [apiPayment.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/apiPayment.ts) | Modern `orderApi` — `createOrder`, `createPayment`, `getPendingPayments` |
| [apiSpecies.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/apiSpecies.ts) | `getTree` class — `getAllSpecies`, `getSpeciesById`, `getSpeciesByCategory`, `searchSpecies` |
| [useMidtrans.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/useMidtrans.ts) | Hook to dynamically load Midtrans Snap SDK |

### `/src/services` — Mock Data (2 files)

| File | Purpose |
|---|---|
| [mockData.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/services/mockData.ts) | **157 lines** of generated mock Tree/Species data from Excel clusters |
| [fetchData.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/services/fetchData.tsx) | **Empty file** (0 bytes) |

### `/src/types` — Type Definitions (3 files)

| File | Purpose |
|---|---|
| [index.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/types/index.ts) | `TreeSpecies` (snake_case: `scientific_name`, `image_url`, `co2_absorption`), `Tree`, `User` |
| [spcies.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/types/spcies.ts) | `Species` type (camelCase: `latinName`, `mainImageUrl`, `basePrice`, `availabelStock`) |
| [css.d.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/types/css.d.ts) | CSS module type declarations |

> [!CAUTION]
> **Two conflicting type definitions exist for the same domain entity:** `TreeSpecies` (snake_case fields) in `types/index.ts` vs `Species` (camelCase fields) in `types/spcies.ts`. The real API uses camelCase (matching `spcies.ts`), but the mock data uses the `TreeSpecies` shape.

### `/src/app` — Page Routes (10 routes)

| Route | File | Data Source |
|---|---|---|
| `/` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/page.tsx) | Static (no data fetching) |
| `/adopt` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/adopt/page.tsx) | Components with hardcoded data + real API |
| `/dashboard` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/dashboard/page.tsx) | Real auth API + **hardcoded mock adoptions** |
| `/login` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/login/page.tsx) | Google OAuth redirect |
| `/faq` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/faq/page.tsx) | **Hardcoded** FAQ items |
| `/contact` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/contact/page.tsx) | Wraps `ContactSection` (static) |
| `/search-db` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/search-db/page.tsx) | Real API via `ServerSideSearchSpecies` |
| `/search-demo` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/search-demo/page.tsx) | Real API via `LiveSearchSpecies` |
| `/species` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/species/page.tsx) | Real API via `LiveSearchSpecies` |
| `/trees` | [page.tsx](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/trees/page.tsx) | **Mock data** from `services/mockData.ts` |

### Components Summary (25+ files)

| Directory | Key Files | Data Source |
|---|---|---|
| `adopt-landing/` | `FeaturedTrees`, `HeroSection`, `ImpactStats`, `HowItWorks` | **Hardcoded** trees + stats; real order API |
| `adopt/` | `AdoptSpeciesCard`, `NameTagModal`, `OrderModal`, `PaymentModal` | Real `orderApi` + Midtrans |
| `dashboard/` | `AdoptionList`, `AdoptionStats`, `AdoptionDetailModal` | **NOT USED** — dashboard page has its own inline mock data |
| `fetching/` | `LiveSearchSpecies`, `SpeciestList`, `speciestById` | Real `getTree` API |
| `layout/` | `Navbar`, `NavbarWrapper` | Auth check via real API |
| `profile/` | `page.tsx` (ProfileImage) | Real `GET /api/v1/auth/me` |
| `ui/` | `TreeCard`, `TreeDetailModal`, `Typography` | Receives props (mock data from `/trees`) |
| Root | `ServerSideSearchSpecies`, `SpeciesCard`, `ContactSection` | Real API / Static |
| `features/catalog/` | `TreeCatalogView`, `CatalogTabs`, `types.ts` | Receives mock Trees; uses real order API |

---

## PHASE 2 — API INVENTORY

### Endpoints Defined in Frontend Codebase

| # | Endpoint | Method | File Location | Response Shape (expected by FE) | Auth |
|---|---|---|---|---|---|
| 1 | `/api/v1/auth/google` | GET (redirect) | `login/page.tsx` | Redirects to Google OAuth | No |
| 2 | `/api/v1/auth/me` | GET | `apiLogin.ts`, `dashboard/page.tsx`, `profile/page.tsx` | `{ success, data: { id, fullName, email, avatarUrl?, role } }` | **Yes** |
| 3 | `/api/v1/trees/species` | GET | `apiSpecies.ts` | `{ success, data: Species[] }` | No |
| 4 | `/api/v1/trees/species/:id` | GET | `apiSpecies.ts` | `{ success, data: Species }` | No |
| 5 | `/api/v1/trees/species/category/:cat` | GET | `apiSpecies.ts` | `{ success, data: Species[] }` | No |
| 6 | `/api/v1/trees/species?search=&category=` | GET | `apiSpecies.ts` | `{ success, data: Species[] }` | No |
| 7 | `/api/v1/orders` | POST | `apiPayment.ts`, `apiOrder.ts` | `{ success, data: { id, orderId } }` | **Yes** |
| 8 | `/api/v1/orders/:orderId/payment` | POST | `apiPayment.ts` | `{ success, data: { snapToken, transactionId } }` | **Yes** |
| 9 | `/api/v1/orders/:orderId` | GET | `apiPayment.ts` | Order detail object | **Yes** |
| 10 | `/api/v1/adoptions` | GET | `apiDashboard.ts` | Adoptions list (shape unknown — **not consumed by current dashboard**) | **Yes** |
| 11 | `/api/v1/adoptions/:id` | GET | `apiDashboard.ts` | Adoption detail (shape unknown — **not consumed**) | **Yes** |
| 12 | `/api/v1/adoptions/stats` | GET | `apiDashboard.ts` | Stats object (shape unknown — **not consumed**) | **Yes** |

### Species Response Shape (from real API, camelCase)

```json
{
  "id": "string",
  "name": "string",
  "latinName": "string",
  "storyContent": "string",
  "mainImageUrl": "string",
  "basePrice": "number",
  "carbonAbsorptionRate": "number",
  "description": "string",
  "availabelStok": "number",   // Note: typo in backend
  "category": "string"
}
```

---

## PHASE 3 — FRONTEND CONSUMPTION AUDIT

| # | Component/Page | Data Source | Expected Fields | Actual API | Match? |
|---|---|---|---|---|---|
| 1 | `login/page.tsx` | Redirect to `/api/v1/auth/google` | OAuth redirect | ✅ Endpoint exists | ✅ CORRECT |
| 2 | `profile/page.tsx` | `GET /api/v1/auth/me` | `data.data.id`, `.fullName`, `.email`, `.avatarUrl`, `.role` | Real API | ✅ CORRECT |
| 3 | `dashboard/page.tsx` (auth) | `GET /api/v1/auth/me` | `userData.data.fullName`, `.email` | Real API | ✅ CORRECT |
| 4 | **`dashboard/page.tsx` (adoptions)** | **Hardcoded mock array** | `treeName`, `treeType`, `location`, `carbonAbsorbed`, etc. | `dashboardApi.getDashboard()` **exists but NOT called** | ❌ MISSING API (mock used) |
| 5 | `LiveSearchSpecies` | `getTree.getAllSpecies()` → `GET /api/v1/trees/species` | `response.success`, `response.data[].name`, `.latinName`, `.basePrice`, `.mainImageUrl`, `.category` | Real API | ✅ CORRECT |
| 6 | `ServerSideSearchSpecies` | `getTree.searchSpecies()` → `GET /api/v1/trees/species?search=&category=` | `response.success`, `response.data[].name`, `.latinName`, `.basePrice`, `.mainImageUrl` | Real API | ✅ CORRECT |
| 7 | **`FeaturedTrees`** | **Hardcoded `FEATURED_TREES` array** | `id`, `name`, `latinName`, `price`, `image`, `badge` | No API called | ❌ MISSING API |
| 8 | **`ImpactStats`** | **Hardcoded numbers** | `1200` trees, `450` CO2, `860` adopters | No API called | ❌ MISSING API |
| 9 | `OrderModal` / `FeaturedTrees` | `orderApi.createOrder()` → `POST /api/v1/orders` | `response.success`, `.data.id` | Real API | ✅ CORRECT |
| 10 | `PaymentModal` | `orderApi.createPayment()` → `POST /api/v1/orders/:id/payment` | `response.success`, `.data.snapToken` | Real API | ✅ CORRECT |
| 11 | **`/trees` page** | **`getTrees()` from `mockData.ts`** | `Tree[]` with `species.scientific_name`, `.image_url`, `.co2_absorption` | No API called | ❌ MISSING API |
| 12 | `TreeCatalogView` | Receives mock `Tree[]` props | `tree.species.name`, `.scientific_name`, `.image_url`, `.description` | No API — receives mock props | ❌ MISSING API |
| 13 | `apiLogin.ts` → `getProfile()` | `GET /api/v1/auth/me` | Response parsed directly | Real API but **no Auth header sent** | 🔴 BROKEN |
| 14 | **`apiOrder.ts` (legacy)** | `POST /api/v1/orders` | Hardcoded `nameOnTag: 'John Doe'` | Real API but unused / hardcoded | ⚠️ MISMATCH |
| 15 | `AdoptionList` component | Expects `Adoption[]` with nested `species`, `tree`, `order` | Complex nested shape | `dashboardApi.getDashboard()` — **component is NOT used anywhere** | ⚠️ MISMATCH (orphan) |
| 16 | `AdoptionStats` component | Expects `stats.totalAdoptions`, `.totalTreesPlanted`, `.totalCarbonAbsorbed`, `.lastMonthAdoptions` | Expected from stats API | `dashboardApi.getStatsAdoption()` — **component is NOT used anywhere** | ⚠️ MISMATCH (orphan) |
| 17 | `AdoptionDetailModal` | Expects `DetailAdoption` with nested `species`, `tree`, `order`, `owner` | Very detailed nested shape | `dashboardApi.getAdoptionDetail()` — **component is NOT used anywhere** | ⚠️ MISMATCH (orphan) |
| 18 | **`/faq` page** | **Hardcoded FAQ array** | 8 FAQ items with `question` + `answer` | No API | ❌ MISSING API |
| 19 | `Navbar` | Auth check via `localStorage` | `access_token` presence | No API call (client-side check) | ✅ CORRECT |
| 20 | `HeroSection` / `HowItWorks` | Fully static content | No data fields | No API needed | ✅ CORRECT |

---

## PHASE 4 — DUMMY DATA REGISTRY

| # | File | Variable/Data | Data Shape | Existing API? | Notes |
|---|---|---|---|---|---|
| 1 | [mockData.ts](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/services/mockData.ts) | `MOCK_SPECIES`, `MOCK_TREES`, `CLUSTER_1-4` | `TreeSpecies[]` (snake_case), `Tree[]` | **Partial** — species API exists, but field names **mismatch** (API uses camelCase, mocks use snake_case) | Trees API doesn't exist. Used by `/trees` page |
| 2 | [dashboard/page.tsx:333-338](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/dashboard/page.tsx#L333-L338) | `mockAdoptions` (inline) | `Adoption[]` with `treeName`, `treeType`, `carbonAbsorbed`, `growthPhase`, `healthStatus`, `adoptionDurationMonths`, `nextUpdateDate` | **Yes** — `dashboardApi.getDashboard()` exists but is **never called**. Shape almost certainly mismatches | `dashboardApi` defined but deliberately ignored, mock always used |
| 3 | [FeaturedTrees.tsx:12-37](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/components/adopt-landing/FeaturedTrees.tsx#L12-L37) | `FEATURED_TREES` | `{ id, name, latinName, price, image, badge }[]` | **Partial** — species API exists, but no "featured" endpoint or `badge` field | Should fetch top/featured species from API |
| 4 | [ImpactStats.tsx:24-26](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/components/adopt-landing/ImpactStats.tsx#L24-L26) | `1200`, `450`, `860` (hardcoded numbers) | Three numbers: trees planted, CO2, adopters | **No** — no public stats API exists | Needs a public stats endpoint |
| 5 | [faq/page.tsx:14-46](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/app/faq/page.tsx#L14-L46) | `faqItems` | `{ question, answer }[]` | **No** | Low priority — FAQ is usually static |
| 6 | [apiOrder.ts:14](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/lib/apiOrder.ts#L14) | `nameOnTag: 'John Doe'` | Hardcoded string in legacy code | N/A | Legacy file — unused but should be deleted |
| 7 | [LiveSearchSpecies.tsx:112-118](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/components/fetching/LiveSearchSpecies.tsx#L112-L118) | Category dropdown options: `Tropis`, `Subtropis`, `Hutan`, `Buah`, `Medis` | String options | **Mismatch** — API categories are `Tanaman Perspektif Keistimewaan`, `Tanaman Toponimi Gunungkidul`, etc. | Categories in dropdown **don't match** API categories |
| 8 | [ServerSideSearchSpecies.tsx:37](file:///c:/UGM/PohonKu/fe/pohonku-frontend/src/components/ServerSideSearchSpecies.tsx#L37) | `categories` array | Correct API categories + `Medis` | **Mostly correct** — but includes `Medis` which may not exist in DB | Should fetch categories dynamically |

---

## PHASE 5 — MISSING API REQUIREMENTS

### API #1: Trees Inventory List
- **Endpoint:** `GET /api/v1/trees` or `GET /api/v1/trees?species_id=&status=`
- **Purpose:** Replace mock tree inventory data used by `/trees` page
- **Needed by:** `/trees` page, `TreeCatalogView`, `TreeCard`, `TreeDetailModal`
- **Expected Request:** `?species_id=string&status=available|sold&cluster=string`
- **Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string — e.g. Nangka #01",
      "price": "number — Rupiah",
      "status": "available | sold | maintenance",
      "locationBlock": "string — cluster name",
      "coords": { "lat": "number", "lng": "number" },
      "speciesId": "string",
      "species": {
        "id": "string",
        "name": "string",
        "latinName": "string",
        "mainImageUrl": "string",
        "description": "string",
        "carbonAbsorptionRate": "number"
      }
    }
  ]
}
```
- **Priority:** 🔴 HIGH
- **Complexity:** Simple CRUD — the species endpoint already exists, this just adds a tree layer

---

### API #2: User Adoptions List (Dashboard)
- **Endpoint:** `GET /api/v1/adoptions`
- **Purpose:** Replace hardcoded mock adoptions in the dashboard
- **Needed by:** `/dashboard` page
- **Expected Response:** *(should match the `AdoptionList` component shape in `components/dashboard/AdoptionList.tsx`)*
```json
{
  "success": true,
  "data": [
    {
      "adoptionId": "string",
      "adoptedAt": "ISO date string",
      "nameOnTag": "string",
      "species": { "id": "string", "name": "string", "latinName": "string", "imageUrl": "string", "carbonRate": "number", "category": "string" },
      "tree": { "id": "string", "serialNumber": "string", "latitude": "string|null", "longitude": "string|null", "plantedAt": "string|null", "status": "string", "latestUpdate": "string|null" },
      "order": { "orderNumber": "string", "totalAmount": "number", "paymentStatus": "string", "purchasedAt": "string" }
    }
  ]
}
```
- **Priority:** 🔴 HIGH — dashboard is currently fully mocked
- **Complexity:** Complex query — joins across adoptions, trees, species, orders tables
- **Note:** The API endpoint `/api/v1/adoptions` is already wired in `apiDashboard.ts` — the backend may already return data. **The dashboard page just never calls it** and uses inline mock instead.

---

### API #3: Adoption Statistics
- **Endpoint:** `GET /api/v1/adoptions/stats`
- **Purpose:** Replace hardcoded stats in `AdoptionStats` component  
- **Needed by:** Dashboard stats section (component exists but is unused)
- **Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalAdoptions": "number",
    "totalTreesPlanted": "number",
    "totalCarbonAbsorbed": "number",
    "lastMonthAdoptions": "number"
  }
}
```
- **Priority:** 🟠 HIGH
- **Complexity:** Aggregate query
- **Note:** Endpoint already wired in `apiDashboard.ts` — backend may already support this.

---

### API #4: Public Impact Stats
- **Endpoint:** `GET /api/v1/stats/public` or `GET /api/v1/impact`
- **Purpose:** Replace hardcoded numbers in `ImpactStats` component (1200 trees, 450 kg CO2, 860 adopters)
- **Needed by:** `/adopt` page → `ImpactStats` component
- **Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalTreesPlanted": "number",
    "totalCO2Absorbed": "number",
    "totalActiveAdopters": "number"
  }
}
```
- **Priority:** 🟡 MEDIUM
- **Complexity:** Simple aggregate query (no auth required)

---

### API #5: Featured/Popular Species
- **Endpoint:** `GET /api/v1/trees/species/featured` or `GET /api/v1/trees/species?featured=true&limit=3`
- **Purpose:** Replace `FEATURED_TREES` hardcoded array in `FeaturedTrees.tsx`
- **Needed by:** `/adopt` page → `FeaturedTrees` component
- **Expected Response:**
```json
{
  "success": true,
  "data": [
    { "id": "string", "name": "string", "latinName": "string", "basePrice": "number", "mainImageUrl": "string", "badge": "string — optional tag like 'Terlaris'" }
  ]
}
```
- **Priority:** 🟡 MEDIUM
- **Complexity:** Simple query with ordering/flagging

---

### API #6: Categories List
- **Endpoint:** `GET /api/v1/trees/categories`
- **Purpose:** Replace hardcoded category dropdown options in `LiveSearchSpecies` and `ServerSideSearchSpecies`
- **Needed by:** Species search components
- **Expected Response:**
```json
{
  "success": true,
  "data": ["Tanaman Perspektif Keistimewaan", "Tanaman Toponimi Gunungkidul", "Tanaman Native Karst", "Tanaman Sumbu Filosofi"]
}
```
- **Priority:** 🟡 MEDIUM
- **Complexity:** Simple distinct query

---

## PHASE 6 — MISMATCH FIX GUIDE

### Mismatch #1: `apiLogin.ts` — Missing Auth Header 🔴
- **Problem:** `getProfile()` calls `GET /api/v1/auth/me` but **does not send the Authorization header**. The endpoint requires authentication.
- **Frontend code (broken):**
  ```ts
  // apiLogin.ts:5-6
  const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    cache: "no-store"
  })
  ```
- **Fix (use apiFetch wrapper):**
  ```ts
  import { apiFetch } from './wrapper';
  export const loginApi = {
    async getProfile() {
      return apiFetch<any>('/api/v1/auth/me', { method: 'GET' });
    }
  };
  ```
- **Recommendation:** Fix frontend — use the `apiFetch` wrapper that already handles token injection. Currently this file is not consumed by any component (dashboard/profile do their own fetch), so this is also dead code.

---

### Mismatch #2: Dual Type System — `TreeSpecies` vs `Species` ⚠️
- **Problem:** Two different interfaces define the same domain entity with conflicting field names.
- **`types/index.ts` (used by mock data):**
  ```ts
  interface TreeSpecies {
    scientific_name: string;  // snake_case
    image_url: string;        // snake_case
    co2_absorption: number;   // snake_case
  }
  ```
- **`types/spcies.ts` (used by real API):**
  ```ts
  type Species = {
    latinName: string;             // camelCase
    mainImageUrl: string;          // camelCase
    carbonAbsorptionRate: number;  // camelCase
    availabelStock: number;        // typo: "availabel" 
  }
  ```
- **Real API returns:** camelCase (`latinName`, `mainImageUrl`, `carbonAbsorptionRate`, `availabelStok`)
- **Fix:** Deprecate `types/index.ts` `TreeSpecies` interface. Standardize on `types/spcies.ts` `Species` type (with the typo fix: `availabelStock` → `availableStock` — but this requires backend change too since the backend has the `availabelStok` typo).

---

### Mismatch #3: `LiveSearchSpecies` — Wrong Category Options ⚠️
- **Problem:** Category dropdown shows `Tropis`, `Subtropis`, `Hutan`, `Buah`, `Medis` — none of which match the actual API categories.
- **Frontend code:**
  ```tsx
  // LiveSearchSpecies.tsx:112-118
  <option value="Tropis">Tropis</option>
  <option value="Subtropis">Subtropis</option>
  <option value="Hutan">Hutan</option>
  <option value="Buah">Buah</option>
  <option value="Medis">Medis</option>
  ```
- **API actual categories:** `Tanaman Perspektif Keistimewaan`, `Tanaman Toponimi Gunungkidul`, `Tanaman Native Karst`, `Tanaman Sumbu Filosofi`
- **Fix:** Replace hardcoded options with API categories (fetch dynamically or hardcode the correct values).

---

### Mismatch #4: Dashboard Ignoring Ready-Made Components ⚠️
- **Problem:** `/dashboard/page.tsx` (612 lines) has its own inline `Adoption` type, inline mock data, inline modals — while `components/dashboard/` has `AdoptionList.tsx`, `AdoptionStats.tsx`, and `AdoptionDetailModal.tsx` that are **never imported**.
- The inline `Adoption` type uses fields like `treeName`, `treeType`, `carbonAbsorbed`, `growthPhase`, `healthStatus`, `adoptionDurationMonths`, `nextUpdateDate`.
- The component `AdoptionList.tsx` expects a different nested shape: `adoptionId`, `species.name`, `tree.serialNumber`, `order.totalAmount`.
- **Fix:** Refactor dashboard page to use `AdoptionList`, `AdoptionStats`, `AdoptionDetailModal` from `components/dashboard/`, which are already structured to match the real API response shape.

---

### Mismatch #5: `apiOrder.ts` — Legacy Dead Code with Hardcoded Data ⚠️
- **Problem:** `apiOrder.ts` has hardcoded `nameOnTag: 'John Doe'` and is never imported/used. `apiPayment.ts` provides the same functionality correctly.
- **Fix:** Delete `apiOrder.ts` entirely.

---

## PHASE 7 — PRIORITY ACTION PLAN

### 🔴 CRITICAL (breaks the app right now)

- [ ] **Fix `apiLogin.ts`** — either delete it (dead code) or add auth header via `apiFetch`. Currently sends unauthenticated request to protected endpoint.
- [ ] **Fix `LiveSearchSpecies` category dropdown** — categories don't match backend. Category filtering is **completely non-functional** on this component.

---

### 🟠 HIGH (major features broken/dummy)

- [ ] **Replace dashboard mock data with real API calls** — `apiDashboard.ts` already has `getDashboard()` and `getStatsAdoption()` wired up. Connect them instead of using the inline `mockAdoptions` array.
- [ ] **Refactor dashboard to use existing components** — `AdoptionList`, `AdoptionStats`, `AdoptionDetailModal` are built and ready but orphaned.
- [ ] **Replace `/trees` page mock data with real API** — build `GET /api/v1/trees` endpoint, or refactor to use species API with stock counts.
- [ ] **Unify type system** — deprecate `types/index.ts` `TreeSpecies` snake_case interface. Standardize on camelCase to match API.
- [ ] **Delete `apiOrder.ts`** — dead code with hardcoded values. `apiPayment.ts` is the active replacement.
- [ ] **Delete empty `fetchData.tsx`** — 0-byte dead file.

---

### 🟡 MEDIUM (minor issues, degraded experience)

- [ ] **Build public stats API** (`GET /api/v1/stats/public`) — replace hardcoded numbers in `ImpactStats` (1200, 450, 860).
- [ ] **Build featured species API** — replace `FEATURED_TREES` hardcoded array in `FeaturedTrees.tsx`.
- [ ] **Build dynamic categories API** — replace hardcoded dropdown options in both search components.
- [ ] **Fix `availabelStok` typo** — both frontend and backend have this typo (`availabel` → `available`). Coordinate fix across both.
- [ ] **Fix `ServerSideSearchSpecies` categories** — includes `Medis` which may not exist on backend.

---

### 🟢 LOW (nice to have, polish)

- [ ] **Build FAQ API** — replace hardcoded FAQ items (`/faq` page). Low priority since FAQ content is typically static.
- [ ] **Remove console.log statements** — `profile/page.tsx`, `wrapper.ts`, `PaymentModal.tsx`, etc. have extensive debug logging left in production code.
- [ ] **Clean up `useMidtrans.ts`** — hook exists but is never imported (PaymentModal loads the script inline instead).
- [ ] **Rename `spcies.ts`** → `species.ts` to fix the typo in the filename.
- [ ] **Rename `SpeciestList.tsx`** → `SpeciesList.tsx` and `speciestById.tsx` → `speciesById.tsx` to fix typos.

---

## PHASE 8 — FINAL SUMMARY STATS

| Metric | Count |
|---|---|
| **Total API endpoints found** | 12 |
| **Endpoints working correctly** | 7 (`auth/google`, `auth/me`×3 callers, `species`×4 variants, `orders`, `orders/:id/payment`) |
| **Endpoints with mismatch** | 1 (`apiLogin.ts` — no auth header) |
| **Broken endpoints** | 1 (`apiLogin.ts` — will 401) |
| **Components using dummy data** | 6 (dashboard, `/trees`, `FeaturedTrees`, `ImpactStats`, FAQ, `LiveSearchSpecies` categories) |
| **Orphaned/dead code files** | 4 (`apiOrder.ts`, `fetchData.tsx`, `apiLogin.ts`, `useMidtrans.ts`) |
| **Orphaned ready-made components (not used)** | 3 (`AdoptionList`, `AdoptionStats`, `AdoptionDetailModal`) |
| **Missing APIs needed** | 4-6 (trees list, public stats, featured species, categories; adoptions API exists but shape needs verification) |
| **Type system mismatches** | 2 conflicting type files; snake_case vs camelCase |
| **Estimated effort to fix all issues** | **3-5 days** (1 day: cleanup/delete dead code + fix category dropdowns + connect existing dashboard APIs; 2-3 days: build missing APIs + refactor dashboard + refactor trees page; 1 day: polish + testing) |

---

> [!IMPORTANT]
> **The most impactful quick wins are:**
> 1. Delete dead code (`apiOrder.ts`, `fetchData.tsx`)
> 2. Fix the `LiveSearchSpecies` category dropdown (5-minute fix)
> 3. Connect `dashboardApi.getDashboard()` in the dashboard page instead of mock data (already wired!)
> 4. Refactor dashboard to use the existing `AdoptionList` / `AdoptionStats` / `AdoptionDetailModal` components
