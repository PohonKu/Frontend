# 📚 Dokumentasi API Lengkap - Pohonku Application

**Versi:** 1.0  
**Tanggal:** February 2026  
**Ditulis untuk:** Frontend Team & Backend Integration

---

## 📑 Daftar Isi

1. [Pengenalan Sistem API](#pengenalan-sistem-api)
2. [Arsitektur & Setup](#arsitektur--setup)
3. [Daftar Endpoint API](#daftar-endpoint-api)
4. [Implementasi API di Frontend](#implementasi-api-di-frontend)
5. [Flow End-to-End](#flow-end-to-end)
6. [Integrasi dengan Komponen](#integrasi-dengan-komponen)
7. [Error Handling & Best Practices](#error-handling--best-practices)
8. [Environment Configuration](#environment-configuration)

---

## Pengenalan Sistem API

### Tujuan Sistem
Pohonku menggunakan REST API yang terintegrasi dengan backend untuk mengelola:
- **Data Spesies Pohon** - Katalog lengkap pohon yang bisa diadopsi
- **Adopsi Pohon** - Proses pembelian dan adopsi pohon
- **Pembayaran** - Integrasi dengan Midtrans untuk pembayaran
- **Dashboard Pengguna** - Tracking adopsi dan statistik
- **Autentikasi** - Login dan manajemen profile

### Stack Teknologi
- **Frontend Framework:** Next.js 14.2.15
- **Runtime:** React 18.3.1
- **HTTP Client:** Fetch API (Native)
- **Autentikasi:** JWT Token (localStorage)
- **Type Safety:** TypeScript
- **API Base URL:** Environment Variable `NEXT_PUBLIC_API_URL`

---

## Arsitektur & Setup

### Folder Structure API
```
src/
├── lib/
│   ├── wraper.ts          # Base API wrapper dengan interceptor
│   ├── apiSpecies.ts      # Endpoints untuk data spesies pohon
│   ├── apiLogin.ts        # Endpoints untuk autentikasi
│   ├── apiOrder.ts        # Endpoints untuk order/adopsi
│   ├── apiPayment.ts      # Endpoints untuk pembayaran
│   ├── apiDashboard.ts    # Endpoints untuk dashboard user
│   ├── useMidtrans.ts     # Hook untuk integrasi Midtrans
│   └── wraper.ts          # Fungsi fetch wrapper dengan error handling
├── types/
│   ├── index.ts           # Type definitions untuk entities
│   └── css.d.ts           # CSS module types
└── services/
    ├── fetchData.tsx      # Service layer untuk data fetching
    └── mockData.ts        # Data mock untuk testing

.env.local (not tracked)
├── NEXT_PUBLIC_API_URL    # URL backend API
└── NEXT_PUBLIC_MIDTRANS_CLIENT_KEY  # Midtrans public key
```

### Environment Setup

#### .env.local Configuration
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000  # Sesuaikan dengan URL backend

# Payment Gateway (Midtrans)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_CLIENT_KEY

# Optional
NEXT_PUBLIC_ENVIRONMENT=development  # development, staging, production
```

#### Variable Setup Check
```bash
# Pastikan variable tersedia di build time
# Next.js hanya meng-expose variables yang dimulai dengan NEXT_PUBLIC_

# Verify di browser console:
console.log(process.env.NEXT_PUBLIC_API_URL)
```

---

## Daftar Endpoint API

### 1️⃣ API Spesies Pohon (Trees/Species)
**Base Path:** `/api/v1/trees/species`

#### GET - Ambil Semua Spesies
```http
GET /api/v1/trees/species
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "spec_001",
      "name": "Nangka",
      "latinName": "Artocarpus heterophyllus",
      "category": "Tanaman Perspektif Keistimewaan",
      "basePrice": 150000,
      "description": "Pohon penghasil buah...",
      "mainImageUrl": "https://...",
      "carbonAbsorptionRate": 25.5,
      "funFact": "Pohon nangka bisa tumbuh..."
    }
  ],
  "message": "Species fetched successfully"
}
```

#### GET - Ambil Spesies Berdasarkan ID
```http
GET /api/v1/trees/species/:id
```

**Parameter:**
- `id` (string) - Species ID

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "spec_001",
    "name": "Nangka",
    "latinName": "Artocarpus heterophyllus",
    "category": "Tanaman Perspektif Keistimewaan",
    "basePrice": 150000,
    "description": "Pohon penghasil buah nangka...",
    "mainImageUrl": "https://...",
    "carbonAbsorptionRate": 25.5,
    "funFact": "Pohon nangka dapat menyerap CO2..."
  }
}
```

#### GET - Filter Spesies Berdasarkan Kategori
```http
GET /api/v1/trees/species/category/:category
```

**Parameter:**
- `category` (string) - Kategori pohon
  - `Perspektif Keistimewaan`
  - `Toponimi Gunungkidul`
  - `Native Karst`
  - `Sumbu Filosofi`

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "spec_001",
      "name": "Nangka",
      ...
    }
  ]
}
```

#### GET - Search Spesies
```http
GET /api/v1/trees/species?search=nangka&category=Perspektif%20Keistimewaan
```

**Query Parameters:**
- `search` (optional) - Nama pohon untuk dicari
- `category` (optional) - Kategori filter

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "spec_001",
      "name": "Nangka",
      ...
    }
  ]
}
```

---

### 2️⃣ API Autentikasi (Auth)
**Base Path:** `/api/v1/auth`

#### GET - Get Current User Profile
```http
GET /api/v1/auth/me
Headers: Authorization: Bearer {token}
```

**Headers Required:**
- `Authorization: Bearer {access_token}`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://...",
    "createdAt": "2026-02-01T10:00:00Z"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or expired token"
}
```

---

### 3️⃣ API Order/Adopsi (Orders)
**Base Path:** `/api/v1/orders`

#### POST - Buat Order/Adopsi Baru
```http
POST /api/v1/orders
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json

Body: {
  "speciesId": "spec_001",
  "nameOnTag": "Dari: John Doe"
}
```

**Request Body:**
```json
{
  "speciesId": "spec_001",      // ID spesies yang diadopsi (required)
  "nameOnTag": "Dari: John Doe" // Nama di tag pohon (required)
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id": "order_001",
    "orderId": "ORD-2026021-001",
    "userId": "user_001",
    "speciesId": "spec_001",
    "totalAmount": 150000,
    "status": "PENDING_PAYMENT",
    "nameOnTag": "Dari: John Doe",
    "createdAt": "2026-02-21T10:30:00Z"
  },
  "message": "Order created successfully"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Invalid species or user not authenticated"
}
```

#### GET - Ambil Detail Order
```http
GET /api/v1/orders/:orderId
Headers: Authorization: Bearer {token}
```

**Parameter:**
- `orderId` (string) - Order ID

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "order_001",
    "orderId": "ORD-2026021-001",
    "userId": "user_001",
    "speciesId": "spec_001",
    "totalAmount": 150000,
    "status": "PENDING_PAYMENT",
    "paymentMethod": null,
    "transactionNumber": null,
    "paidAt": null,
    "createdAt": "2026-02-21T10:30:00Z",
    "updatedAt": "2026-02-21T10:30:00Z"
  }
}
```

#### POST - Buat Payment untuk Order
```http
POST /api/v1/orders/:orderId/payment
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json

Body: {}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "token": "MIDTRANS_SNAP_TOKEN",
    "redirectUrl": "https://app.sandbox.midtrans.com/snap/v2/vtweb/...",
    "orderId": "order_001"
  },
  "message": "Payment token generated"
}
```

---

### 4️⃣ API Dashboard/Adopsi (Adoptions)
**Base Path:** `/api/v1/adoptions`

#### GET - Ambil Daftar Adopsi User
```http
GET /api/v1/adoptions
Headers: Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "adoptionId": "adopt_001",
      "adoptedAt": "2026-02-15T09:00:00Z",
      "nameOnTag": "Dari: John Doe",
      "species": {
        "id": "spec_001",
        "name": "Nangka",
        "latinName": "Artocarpus heterophyllus",
        "imageUrl": "https://...",
        "carbonRate": 25.5,
        "category": "Perspektif Keistimewaan"
      },
      "tree": {
        "id": "tree_001",
        "serialNumber": "NK-001-2026",
        "latitude": "-7.8945",
        "longitude": "110.4032",
        "plantedAt": "2026-02-16T14:30:00Z",
        "status": "ACTIVE",
        "createdAt": "2026-02-16T14:30:00Z",
        "latestUpdate": "2026-02-20T08:15:00Z"
      },
      "order": {
        "orderNumber": "ORD-2026021-001",
        "totalAmount": 150000,
        "paymentStatus": "PAID",
        "purchasedAt": "2026-02-15T09:00:00Z"
      }
    }
  ],
  "message": "Adoptions retrieved successfully"
}
```

#### GET - Ambil Detail Adopsi Spesifik
```http
GET /api/v1/adoptions/:adoptionId
Headers: Authorization: Bearer {token}
```

**Parameter:**
- `adoptionId` (string) - Adoption ID

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "adoptionId": "adopt_001",
    "adoptedAt": "2026-02-15T09:00:00Z",
    "nameOnTag": "Dari: John Doe",
    "species": {
      "id": "spec_001",
      "name": "Nangka",
      "latinName": "Artocarpus heterophyllus",
      "imageUrl": "https://...",
      "carbonRate": 25.5,
      "category": "Perspektif Keistimewaan",
      "description": "Pohon penghasil buah nangka..."
    },
    "tree": {
      "id": "tree_001",
      "serialNumber": "NK-001-2026",
      "latitude": "-7.8945",
      "longitude": "110.4032",
      "plantedAt": "2026-02-16T14:30:00Z",
      "status": "ACTIVE",
      "healthStatus": "GOOD",
      "createdAt": "2026-02-16T14:30:00Z",
      "latestUpdate": "2026-02-20T08:15:00Z"
    },
    "order": {
      "orderNumber": "ORD-2026021-001",
      "totalAmount": 150000,
      "paymentStatus": "PAID",
      "paymentMethod": "MIDTRANS",
      "purchasedAt": "2026-02-15T09:00:00Z"
    },
    "stats": {
      "daysActive": 6,
      "estimatedCO2Absorbed": 0.42,
      "growthProgress": 15
    }
  }
}
```

#### GET - Ambil Statistik Adopsi
```http
GET /api/v1/adoptions/stats
Headers: Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "totalAdoptions": 5,
    "totalTreesPlanted": 5,
    "totalCarbonAbsorbed": 2.15,
    "lastMonthAdoptions": 3,
    "averageCarbonPerTree": 0.43,
    "totalInvested": 750000
  },
  "message": "Statistics retrieved successfully"
}
```

---

## Implementasi API di Frontend

### 1. API Wrapper (apiFetch)

**File:** [src/lib/wraper.ts](src/lib/wraper.ts)

```typescript
// Fitur:
// ✅ Automatic token injection dari localStorage
// ✅ Error handling dan logging yang proper
// ✅ Type safety dengan generics
// ✅ Content-Type default application/json
// ✅ Environment variable validation

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // 1. Validate BASE_URL
  if (!BASE_URL) {
    throw new Error('API URL is not configured');
  }

  // 2. Build full URL
  const url = `${BASE_URL}${endpoint}`;

  // 3. Prepare headers with token
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    // 4. Make request
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // 5. Handle response
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### 2. API Species

**File:** [src/lib/apiSpecies.ts](src/lib/apiSpecies.ts)

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class GetTree {
  // ✅ GET /api/v1/trees/species
  async getAllSpecies() {
    const res = await fetch(
      `${BASE_URL}/api/v1/trees/species`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch species');
    return res.json();
  }

  // ✅ GET /api/v1/trees/species/:id
  async getSpeciesById(id: string) {
    const res = await fetch(
      `${BASE_URL}/api/v1/trees/species/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch species by id');
    return res.json();
  }

  // ✅ GET /api/v1/trees/species/category/:category
  async getSpeciesByCategory(category: string) {
    const res = await fetch(
      `${BASE_URL}/api/v1/trees/species/category/${category}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch species by category');
    return res.json();
  }

  // ✅ GET /api/v1/trees/species?search=...&category=...
  async searchSpecies(searchName?: string, category?: string) {
    const params = new URLSearchParams();
    if (searchName) params.append('search', searchName);
    if (category) params.append('category', category);

    const url = params.toString()
      ? `${BASE_URL}/api/v1/trees/species?${params}`
      : `${BASE_URL}/api/v1/trees/species`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to search species');
    return res.json();
  }
}

export const getTree = new GetTree();
```

### 3. API Login/Auth

**File:** [src/lib/apiLogin.ts](src/lib/apiLogin.ts)

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class Login {
  // ✅ GET /api/v1/auth/me
  // Mengambil profil user yang sedang login
  // Memerlukan token di header Authorization
  async getProfile() {
    const token = localStorage.getItem('access_token');
    const res = await fetch(
      `${BASE_URL}/api/v1/auth/me`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }
}

export const getProfile = new Login();
```

### 4. API Order

**File:** [src/lib/apiOrder.ts](src/lib/apiOrder.ts)

```typescript
interface CreateOrderPayload {
  speciesId: string;
  nameOnTag: string;
}

export const orderApi = {
  // ✅ POST /api/v1/orders
  async createOrder(data: CreateOrderPayload) {
    return apiFetch<any>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ✅ POST /api/v1/orders/:orderId/payment
  async createPayment(orderId: string) {
    return apiFetch<any>(
      `/api/v1/orders/${orderId}/payment`,
      { method: 'POST' }
    );
  },

  // ✅ GET /api/v1/orders/:orderId
  async getPendingPayments(orderId: string) {
    return apiFetch<any>(
      `/api/v1/orders/${orderId}`,
      { method: 'GET' }
    );
  }
};
```

### 5. API Dashboard

**File:** [src/lib/apiDashboard.ts](src/lib/apiDashboard.ts)

```typescript
import { apiFetch } from './wraper';

export const dashboardApi = {
  // ✅ GET /api/v1/adoptions
  async getDashboard() {
    return apiFetch<any>('/api/v1/adoptions', {
      method: 'GET',
    });
  },

  // ✅ GET /api/v1/adoptions/:adoptionId
  async getAdoptionDetail(adoptionId: string) {
    return apiFetch<any>(
      `/api/v1/adoptions/${adoptionId}`,
      { method: 'GET' }
    );
  },

  // ✅ GET /api/v1/adoptions/stats
  async getStatsAdoption() {
    return apiFetch<any>('/api/v1/adoptions/stats', {
      method: 'GET',
    });
  }
};
```

---

## Flow End-to-End

### 🔄 Flow 1: User Menjelajahi & Mengadopsi Pohon

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER MEMBUKA HALAMAN ADOPT (/adopt)                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. FETCH SEMUA SPESIES                                          │
│ - Endpoint: GET /api/v1/trees/species                           │
│ - Caller: src/app/adopt/page.tsx (useEffect)                   │
│ - Response: Array<Species>                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. DISPLAY SPECIES LIST                                         │
│ - Components: AdoptSpeciesCard x N                              │
│ - Show: Nama, Harga, Gambar, Kategori                          │
│ - Action Buttons: "Adopsi" & "Detail"                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. USER FILTER/SEARCH (Optional)                                │
│ - Endpoint: GET /api/v1/trees/species?search=...&category=...  │
│ - Debounce: 300ms                                               │
│ - Update UI dengan hasil filter                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. USER KLIK "ADOPSI" PADA POHON                                │
│ - Event: onClick di AdoptSpeciesCard                            │
│ - Action: Set selectedSpecies + Open OrderModal                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. ORDER MODAL TERBUKA                                          │
│ - Component: src/components/adopt/OrderModal.tsx               │
│ - Fields: Species Info, Harga, Input "Nama di Tag"             │
│ - Buttons: "Lanjutkan ke Pembayaran" & "Batal"                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. USER SUBMIT ORDER                                            │
│ - Endpoint: POST /api/v1/orders                                 │
│ - Payload: { speciesId, nameOnTag }                            │
│ - Headers: Authorization: Bearer {token}                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. ORDER CREATED SUCCESSFULLY                                   │
│ - Response: { success, data: { id, orderId, totalAmount, ... }} │
│ - Store: orderId di state untuk step payment                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. PAYMENT MODAL TERBUKA                                        │
│ - Component: src/components/adopt/PaymentModal.tsx             │
│ - Show: Order summary, Total Harga, Tombol "Bayar"             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. USER KLIK "BAYAR"                                           │
│ - Endpoint: POST /api/v1/orders/:orderId/payment               │
│ - Response: { token: MIDTRANS_SNAP_TOKEN, redirectUrl: ... }  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. REDIRECT KE MIDTRANS SNAP                                   │
│ - Load Midtrans Snap library dari CDN                          │
│ - Trigger: window.snap.pay(TOKEN)                             │
│ - Snap opens payment methods UI                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. USER PILIH & LAKUKAN PEMBAYARAN                             │
│ - Methods: Bank Transfer, E-Wallet, Credit Card, etc           │
│ - Proses di Midtrans Gateway                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 13. PAYMENT CONFIRMATION                                        │
│ - Midtrans verifikasi pembayaran                               │
│ - Update order status: PENDING_PAYMENT → PAID                  │
│ - Backend trigger proses adopsi                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 14. REDIRECT & SUCCESS MESSAGE                                  │
│ - Close modals                                                  │
│ - Show success notification                                     │
│ - Redirect ke dashboard atau home                              │
└─────────────────────────────────────────────────────────────────┘
```

### 📊 Flow 2: User Melihat Dashboard Adopsi

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER MEMBUKA HALAMAN DASHBOARD (/dashboard)                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. CHECK AUTHENTICATION                                         │
│ - Ambil token dari localStorage                                 │
│ - Jika tidak ada → redirect ke login                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. FETCH ADOPTION LIST & STATS (PARALLEL)                       │
│ - Call 1: GET /api/v1/adoptions                                 │
│ - Call 2: GET /api/v1/adoptions/stats                           │
│ - Headers: Authorization: Bearer {token}                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. RENDER DASHBOARD                                             │
│ - Component: AdoptionStats (Statistics card)                    │
│   - Show: Total Adopsi, Total Pohon, Total CO2 Terserap         │
│ - Component: AdoptionList (List of adoptions)                   │
│   - Show: Nama Pohon, Tanggal Adopsi, Status                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. USER KLIK ADOPSI UNTUK LIHAT DETAIL                          │
│ - Event: onClick di AdoptionList item                           │
│ - Action: Set selectedAdoption + Open DetailModal              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. FETCH DETAIL ADOPSI SPESIFIK                                 │
│ - Endpoint: GET /api/v1/adoptions/:adoptionId                   │
│ - Headers: Authorization: Bearer {token}                       │
│ - Response: Full adoption details dengan tree info              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. DISPLAY ADOPTION DETAIL MODAL                                │
│ - Component: AdoptionDetailModal.tsx                            │
│ - Show:                                                         │
│   • Info pohon: Nama, Species, Gambar                          │
│   • Lokasi: Latitude, Longitude (peta)                         │
│   • Status: Tanggal tanam, Health status                       │
│   • Statistik: CO2 terserap, Growth progress                   │
│   • Info adopsi: Nama di tag, Tanggal adopsi                  │
└─────────────────────────────────────────────────────────────────┘
```

### 🔍 Flow 3: User Search Spesies dengan Live Search

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER KETIK DI SEARCH BOX                                     │
│ - Input event triggered                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. DEBOUNCE: WAIT 300MS                                         │
│ - Cancel previous timeout jika ada                              │
│ - Set new timeout untuk search API call                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. FETCH SEARCH RESULTS                                         │
│ - Endpoint: GET /api/v1/trees/species?search=...&category=...  │
│ - Params:                                                       │
│   • search: input value dari search box                        │
│   • category: selected category (if any)                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. FILTER RESULTS LOCALLY (Optional)                            │
│ - Gunakan data dari response                                    │
│ - Atau filter di frontend untuk UX instant                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. UPDATE UI                                                    │
│ - Update filteredSpecies state                                  │
│ - Re-render SpeciesCard list                                    │
│ - Show "tidak ada hasil" jika kosong                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integrasi dengan Komponen

### Adopt Page Flow

**File:** [src/app/adopt/page.tsx](src/app/adopt/page.tsx)

```typescript
'use client';

export default function AdoptPage() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  // 1️⃣ Fetch semua spesies pada mount
  useEffect(() => {
    fetchAllSpecies();
  }, []);

  const fetchAllSpecies = async () => {
    try {
      const response = await getTree.searchSpecies();
      if (response.success) {
        setSpeciesList(response.data || []);
        setFilteredSpecies(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  // 2️⃣ Filter & search dengan debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      filterSpecies(searchQuery, selectedCategory);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const filterSpecies = async (search?: string, category?: string) => {
    try {
      const response = await getTree.searchSpecies(search, category);
      setFilteredSpecies(response.data || []);
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  // 3️⃣ Handle adopsi klik
  const handleAdoptClick = (species: Species) => {
    setSelectedSpecies(species);
    setShowOrderModal(true);
  };

  return (
    <div>
      {/* Search & Filter */}
      <SearchBox 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Filter */}
      <CategoryButtons
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Species Grid */}
      <div className="grid">
        {filteredSpecies.map((species) => (
          <AdoptSpeciesCard
            key={species.id}
            species={species}
            onAdoptClick={() => handleAdoptClick(species)}
          />
        ))}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedSpecies && (
        <OrderModal
          species={selectedSpecies}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedSpecies(null);
          }}
        />
      )}
    </div>
  );
}
```

### Order Modal Flow

**File:** [src/components/adopt/OrderModal.tsx](src/components/adopt/OrderModal.tsx)

```typescript
export default function OrderModal({ species, onClose }: OrderModalProps) {
  const [nameOnTag, setNameOnTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // 1️⃣ User submit form
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameOnTag.trim()) {
      setError('Nama di tag tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
      
      // 2️⃣ Call API: POST /api/v1/orders
      const response = await orderApi.createOrder({
        speciesId: species.id,
        nameOnTag: nameOnTag.trim(),
      });

      // 3️⃣ Handle response
      if (response.success && response.data?.id) {
        setOrderId(response.data.id);
        setShowPaymentModal(true); // Buka payment modal
      } else {
        setError(response.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Order Form */}
      <form onSubmit={handleCreateOrder}>
        <div className="species-info">
          {/* Display species details */}
        </div>
        
        <input
          type="text"
          placeholder="Nama di tag pohon"
          value={nameOnTag}
          onChange={(e) => setNameOnTag(e.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Lanjutkan ke Pembayaran'}
        </button>
      </form>

      {/* Payment Modal */}
      {showPaymentModal && orderId && (
        <PaymentModal
          orderId={orderId}
          amount={species.basePrice}
          onClose={() => {
            setShowPaymentModal(false);
            onClose(); // Close order modal juga
          }}
        />
      )}
    </>
  );
}
```

### Payment Modal Flow

**File:** [src/components/adopt/PaymentModal.tsx](src/components/adopt/PaymentModal.tsx)

```typescript
export default function PaymentModal({
  orderId,
  amount,
  onClose,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // 1️⃣ Call API: POST /api/v1/orders/:orderId/payment
      const response = await orderApi.createPayment(orderId);

      if (response.success && response.data?.token) {
        // 2️⃣ Get Midtrans token
        const snapToken = response.data.token;

        // 3️⃣ Load dan trigger Midtrans Snap
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.snap.pay(snapToken, {
            onSuccess: (result: any) => {
              console.log('Payment success:', result);
              showNotification('Pembayaran berhasil!');
              onClose();
            },
            onPending: (result: any) => {
              console.log('Pending:', result);
            },
            onError: (result: any) => {
              console.error('Payment error:', result);
              showNotification('Pembayaran gagal');
            },
          });
        };
      }
    } catch (err) {
      console.error('Payment error:', err);
      showNotification('Gagal memproses pembayaran');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <h2>Konfirmasi Pembayaran</h2>
      <div className="amount">
        <p>Total: Rp {formatPrice(amount)}</p>
      </div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Processing...' : 'Bayar Sekarang'}
      </button>
    </div>
  );
}
```

### Dashboard Page Flow

**File:** [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)

```typescript
'use client';

export default function DashboardPage() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 2️⃣ Fetch adoptions list
      const adoptionsResponse = await dashboardApi.getDashboard();
      if (adoptionsResponse.success) {
        setAdoptions(adoptionsResponse.data);
      }

      // 3️⃣ Fetch stats
      const statsResponse = await dashboardApi.getStatsAdoption();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ Handle adoption detail view
  const handleViewDetail = async (adoptionId: string) => {
    try {
      const detailResponse = await dashboardApi.getAdoptionDetail(adoptionId);
      if (detailResponse.success) {
        setSelectedAdoption(detailResponse.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
    }
  };

  return (
    <div>
      {/* Display stats */}
      {stats && <AdoptionStats stats={stats} />}

      {/* Display adoptions list */}
      <AdoptionList
        adoptions={adoptions}
        onViewDetail={handleViewDetail}
      />

      {/* Detail modal */}
      {isModalOpen && selectedAdoption && (
        <AdoptionDetailModal
          adoption={selectedAdoption}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
```

---

## Error Handling & Best Practices

### 1. Error Handling Hierarchy

```typescript
// ✅ Global Error Handler
async function apiCall() {
  try {
    const response = await apiFetch<Species>('/api/v1/trees/species');
    // ✅ Success handling
    return response;
  } catch (error) {
    // ✅ Error handling dengan cascade
    if (error instanceof TypeError) {
      // Network error (no internet, etc)
      console.error('Network error:', error);
      showNotification('Tidak ada koneksi internet');
    } else if (error instanceof Error) {
      // API error
      console.error('API error:', error.message);
      if (error.message.includes('401')) {
        // Unauthorized - redirect to login
        redirectToLogin();
      } else if (error.message.includes('404')) {
        // Not found
        showNotification('Data tidak ditemukan');
      } else {
        // Generic error
        showNotification(error.message);
      }
    }
  }
}
```

### 2. Token Management

```typescript
// ✅ Store token setelah login
const handleLoginSuccess = (token: string) => {
  localStorage.setItem('access_token', token);
  // apiFetch akan otomatis attach token ke header
};

// ✅ Remove token saat logout
const handleLogout = () => {
  localStorage.removeItem('access_token');
  redirectToLogin();
};

// ✅ Refresh token logic (jika diperlukan)
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  
  if (response.ok) {
    const { accessToken } = await response.json();
    localStorage.setItem('access_token', accessToken);
    return accessToken;
  } else {
    // Token invalid, redirect to login
    localStorage.removeItem('access_token');
    redirectToLogin();
  }
};
```

### 3. Loading States

```typescript
// ✅ Proper loading state management
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<T | null>(null);

const fetchData = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await apiCall();
    setData(response);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setIsLoading(false);
  }
};

// ✅ Render dengan state checks
return (
  <>
    {isLoading && <LoadingSpinner />}
    {error && <ErrorMessage message={error} />}
    {data && <DataDisplay data={data} />}
  </>
);
```

### 4. Request Debouncing

```typescript
// ✅ Debounce untuk search
useEffect(() => {
  // Clear previous timeout
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timeout
  const timer = setTimeout(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  }, 300); // 300ms debounce

  setDebounceTimer(timer);

  // Cleanup on unmount
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
}, [searchQuery]);
```

### 5. Request Caching

```typescript
// ✅ Cache species data untuk performa
const [speciesCache, setSpeciesCache] = useState<Map<string, Species>>(
  new Map()
);

const getSpeciesWithCache = async (id: string): Promise<Species> => {
  // Check cache first
  if (speciesCache.has(id)) {
    return speciesCache.get(id)!;
  }

  // Fetch from API
  const species = await getTree.getSpeciesById(id);

  // Store in cache
  const newCache = new Map(speciesCache);
  newCache.set(id, species);
  setSpeciesCache(newCache);

  return species;
};
```

### 6. Parallel Requests

```typescript
// ✅ Fetch multiple endpoints in parallel
const fetchDashboardData = async () => {
  try {
    setLoading(true);

    // Execute both requests in parallel
    const [adoptionsRes, statsRes] = await Promise.all([
      dashboardApi.getDashboard(),
      dashboardApi.getStatsAdoption(),
    ]);

    if (adoptionsRes.success) {
      setAdoptions(adoptionsRes.data);
    }

    if (statsRes.success) {
      setStats(statsRes.data);
    }
  } catch (err) {
    setError('Failed to fetch data');
  } finally {
    setLoading(false);
  }
};
```

---

## Environment Configuration

### Development Setup

```bash
# 1. Create .env.local file in project root
touch .env.local

# 2. Add configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=VT-mid-client-key

# 3. Verify setup
npm run dev
# Check browser console: console.log(process.env.NEXT_PUBLIC_API_URL)
```

### Production Setup

```bash
# Variables di production (di hosting platform)
NEXT_PUBLIC_API_URL=https://api.pohonku.com
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=YOUR_PRODUCTION_MIDTRANS_KEY

# Build untuk production
npm run build
npm start
```

### Midtrans Configuration

```typescript
// useMidtrans.ts - Hook untuk Midtrans integration
import { useEffect } from 'react';

export const useMidtrans = () => {
  useEffect(() => {
    // Load Midtrans Snap library
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute(
      'data-client-key',
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
    );
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payWithSnap = (token: string, callbacks: any) => {
    if (typeof window !== 'undefined' && (window as any).snap) {
      (window as any).snap.pay(token, callbacks);
    }
  };

  return { payWithSnap };
};
```

---

## Checklist Implementasi

- [x] API Wrapper dengan error handling
- [x] Semua endpoints terdokumentasi
- [x] Token authentication di header
- [x] Loading states di components
- [x] Error handling yang proper
- [x] Debounce untuk search
- [x] Parallel requests untuk dashboard
- [x] Type safety dengan TypeScript
- [x] Environment variables configured
- [x] Midtrans integration ready

---

## Troubleshooting

### Issue: "API URL is not configured"
**Solusi:** 
- Pastikan `.env.local` ada di project root
- Pastikan `NEXT_PUBLIC_API_URL` di-set
- Restart dev server: `npm run dev`

### Issue: "401 Unauthorized"
**Solusi:**
- Token tidak ada atau expired di localStorage
- Cek: `localStorage.getItem('access_token')`
- Jika kosong, user harus login dulu

### Issue: CORS Error
**Solusi:**
- Backend harus configure CORS dengan benar
- Allowed origins harus include frontend URL
- Check backend CORS configuration

### Issue: Midtrans Payment Failed
**Solusi:**
- Cek Midtrans client key di `.env.local`
- Pastikan menggunakan sandbox untuk development
- Verify token generation dari backend

---

## Dokumentasi Tambahan

- [Backend API Guide](./BACKEND_GUIDE.md)
- [Live Search Integration](./LIVE_SEARCH_INTEGRATION.md)
- [Adopt Tree Implementation](./ADOPT_TREE_IMPLEMENTATION.md)
- [Testing Guide](./TESTING_GUIDE.md)

---

**Last Updated:** February 21, 2026
**Status:** Complete & Production Ready
