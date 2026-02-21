# 🚀 API Integration Guide - Pohonku Frontend

**Versi:** 1.0  
**Tanggal:** February 2026  
**Target:** Frontend Developers

---

## 📌 Quick Start

### 1. Setup Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_KEY
```

### 2. Import API Modules

```typescript
// Get species data
import { getTree } from '@/lib/apiSpecies';

// Create orders
import { orderApi } from '@/lib/apiOrder';

// Manage dashboard
import { dashboardApi } from '@/lib/apiDashboard';

// Get user profile
import { getProfile } from '@/lib/apiLogin';
```

### 3. Basic API Call Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getTree } from '@/lib/apiSpecies';

export default function SpeciesPage() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getTree.getAllSpecies();
        if (response.success) {
          setSpecies(response.data);
        } else {
          setError(response.message || 'Failed to fetch');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {species.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))}
    </div>
  );
}
```

---

## 🔍 Common Tasks & Code Examples

### Task 1: Fetch All Species

```typescript
// Simple fetch all species
const response = await getTree.getAllSpecies();

if (response.success) {
  const speciesList: Species[] = response.data;
  // Use speciesList
}
```

**Response Structure:**
```typescript
{
  success: true,
  data: [
    {
      id: "spec_001",
      name: "Nangka",
      latinName: "Artocarpus heterophyllus",
      category: "Perspektif Keistimewaan",
      basePrice: 150000,
      mainImageUrl: "https://...",
      description: "...",
      carbonAbsorptionRate: 25.5
    },
    // ... more species
  ],
  message: "Species fetched successfully"
}
```

### Task 2: Search & Filter Species

```typescript
// Search by name and category
const response = await getTree.searchSpecies(
  'nangka',  // search query
  'Perspektif Keistimewaan'  // category
);

if (response.success) {
  const filtered = response.data;
}
```

**With Debounce:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getTree } from '@/lib/apiSpecies';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (timer) clearTimeout(timer);

    // Set new timer for debounce
    const newTimer = setTimeout(async () => {
      if (query.trim()) {
        const response = await getTree.searchSpecies(query);
        if (response.success) {
          setResults(response.data);
        }
      }
    }, 300); // 300ms debounce

    setTimer(newTimer);

    return () => {
      if (newTimer) clearTimeout(newTimer);
    };
  }, [query]);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search species..."
      />
      <div>
        {results.map((species) => (
          <div key={species.id}>{species.name}</div>
        ))}
      </div>
    </>
  );
}
```

### Task 3: Get Species by Category

```typescript
const category = 'Native Karst';
const response = await getTree.getSpeciesByCategory(category);

if (response.success) {
  const categorySpecies = response.data;
}
```

### Task 4: Get Species Detail by ID

```typescript
const speciesId = 'spec_001';
const response = await getTree.getSpeciesById(speciesId);

if (response.success) {
  const detail = response.data;
  console.log(detail.name);
  console.log(detail.description);
  console.log(detail.carbonAbsorptionRate);
}
```

### Task 5: Create Order (Adoption)

```typescript
'use client';

import { useState } from 'react';
import { orderApi } from '@/lib/apiOrder';

interface Species {
  id: string;
  name: string;
  basePrice: number;
}

interface OrderModalProps {
  species: Species;
  onClose: () => void;
}

export default function OrderModal({ species, onClose }: OrderModalProps) {
  const [nameOnTag, setNameOnTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameOnTag.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call API to create order
      const response = await orderApi.createOrder({
        speciesId: species.id,
        nameOnTag: nameOnTag.trim(),
      });

      if (response.success && response.data?.id) {
        setOrderId(response.data.id);
        // Proceed to payment
      } else {
        setError(response.message || 'Failed to create order');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error creating order'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adopsi: {species.name}</h2>
      <p>Harga: Rp {species.basePrice.toLocaleString('id-ID')}</p>

      <input
        type="text"
        placeholder="Nama di tag pohon"
        value={nameOnTag}
        onChange={(e) => setNameOnTag(e.target.value)}
      />

      {error && <div className="error">{error}</div>}

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Lanjutkan ke Pembayaran'}
      </button>

      <button type="button" onClick={onClose}>
        Batal
      </button>
    </form>
  );
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: "order_001",
    orderId: "ORD-2026021-001",
    userId: "user_001",
    speciesId: "spec_001",
    totalAmount: 150000,
    status: "PENDING_PAYMENT",
    nameOnTag: "Dari: John Doe",
    createdAt: "2026-02-21T10:30:00Z"
  }
}
```

### Task 6: Process Payment with Midtrans

```typescript
'use client';

import { useState, useEffect } from 'react';
import { orderApi } from '@/lib/apiOrder';

interface PaymentModalProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentModal({
  orderId,
  amount,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Midtrans Snap script once at component mount
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Get Midtrans token from backend
      const response = await orderApi.createPayment(orderId);

      if (response.success && response.data?.token) {
        const snapToken = response.data.token;

        // Trigger Midtrans Snap payment UI
        if (typeof window !== 'undefined') {
          const snap = (window as any).snap;
          
          snap.pay(snapToken, {
            onSuccess: (result: any) => {
              console.log('Payment success:', result);
              onSuccess();
              onClose();
            },
            onPending: (result: any) => {
              console.log('Payment pending:', result);
            },
            onError: (result: any) => {
              console.error('Payment error:', result);
              setError('Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: () => {
              console.log('Snap closed');
            },
          });
        }
      } else {
        setError(
          response.message || 'Failed to get payment token'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Payment error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <h2>Konfirmasi Pembayaran</h2>
      <p>Total Pembayaran: Rp {amount.toLocaleString('id-ID')}</p>

      {error && <div className="error">{error}</div>}

      <button
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Bayar Sekarang'}
      </button>

      <button onClick={onClose}>
        Batalkan
      </button>
    </div>
  );
}
```

### Task 7: Fetch Dashboard Adoptions

```typescript
'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/apiDashboard';

interface Adoption {
  adoptionId: string;
  adoptedAt: string;
  nameOnTag: string;
  species: {
    id: string;
    name: string;
    latinName: string;
  };
  tree: {
    id: string;
    serialNumber: string;
    status: string;
  };
  order: {
    orderNumber: string;
    totalAmount: number;
    paymentStatus: string;
  };
}

export default function DashboardPage() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        
        // Fetch adoptions list
        const response = await dashboardApi.getDashboard();
        
        if (response.success) {
          setAdoptions(response.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Adoptions</h1>
      {adoptions.map((adoption) => (
        <div key={adoption.adoptionId} className="adoption-card">
          <h3>{adoption.species.name}</h3>
          <p>Latin: {adoption.species.latinName}</p>
          <p>Serial: {adoption.tree.serialNumber}</p>
          <p>Status: {adoption.tree.status}</p>
          <p>Adopted: {new Date(adoption.adoptedAt).toLocaleDateString('id-ID')}</p>
        </div>
      ))}
    </div>
  );
}
```

### Task 8: Fetch Adoption Stats

```typescript
'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/apiDashboard';

interface Stats {
  totalAdoptions: number;
  totalTreesPlanted: number;
  totalCarbonAbsorbed: number;
  lastMonthAdoptions: number;
  averageCarbonPerTree: number;
  totalInvested: number;
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await dashboardApi.getStatsAdoption();
      if (response.success) {
        setStats(response.data);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="stats-container">
      <div className="stat-box">
        <h3>Total Adopsi</h3>
        <p className="big-number">{stats.totalAdoptions}</p>
      </div>
      
      <div className="stat-box">
        <h3>Pohon Ditanam</h3>
        <p className="big-number">{stats.totalTreesPlanted}</p>
      </div>
      
      <div className="stat-box">
        <h3>CO₂ Terserap (kg)</h3>
        <p className="big-number">{stats.totalCarbonAbsorbed.toFixed(2)}</p>
      </div>
      
      <div className="stat-box">
        <h3>Bulan Ini</h3>
        <p className="big-number">{stats.lastMonthAdoptions}</p>
      </div>
    </div>
  );
}
```

### Task 9: Get Adoption Detail

```typescript
'use client';

import { useState } from 'react';
import { dashboardApi } from '@/lib/apiDashboard';

interface AdoptionDetail {
  adoptionId: string;
  species: {
    id: string;
    name: string;
    latinName: string;
    imageUrl: string;
    description: string;
    carbonRate: number;
  };
  tree: {
    id: string;
    serialNumber: string;
    latitude: string;
    longitude: string;
    plantedAt: string;
    status: string;
    healthStatus: string;
  };
  stats: {
    daysActive: number;
    estimatedCO2Absorbed: number;
    growthProgress: number;
  };
}

export default function AdoptionDetailModal({
  adoptionId,
  onClose,
}: {
  adoptionId: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<AdoptionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await dashboardApi.getAdoptionDetail(
          adoptionId
        );
        if (response.success) {
          setDetail(response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [adoptionId]);

  if (loading) return <div>Loading...</div>;
  if (!detail) return <div>Not found</div>;

  return (
    <div className="modal">
      <h2>{detail.species.name}</h2>

      {/* Species Info */}
      <section>
        <h3>Info Spesies</h3>
        <img
          src={detail.species.imageUrl}
          alt={detail.species.name}
        />
        <p>
          <strong>Latin:</strong> {detail.species.latinName}
        </p>
        <p>{detail.species.description}</p>
        <p>
          <strong>Carbon Rate:</strong> {detail.species.carbonRate} kg/tahun
        </p>
      </section>

      {/* Tree Info */}
      <section>
        <h3>Info Pohon</h3>
        <p>
          <strong>Serial:</strong> {detail.tree.serialNumber}
        </p>
        <p>
          <strong>Status:</strong> {detail.tree.status}
        </p>
        <p>
          <strong>Health:</strong> {detail.tree.healthStatus}
        </p>
        <p>
          <strong>Tanam:</strong>{' '}
          {new Date(detail.tree.plantedAt).toLocaleDateString('id-ID')}
        </p>
        {detail.tree.latitude && detail.tree.longitude && (
          <p>
            <strong>Lokasi:</strong> {detail.tree.latitude}, {detail.tree.longitude}
          </p>
        )}
      </section>

      {/* Stats */}
      <section>
        <h3>Statistik</h3>
        <p>
          <strong>Hari Aktif:</strong> {detail.stats.daysActive}
        </p>
        <p>
          <strong>CO₂ Terserap:</strong>{' '}
          {detail.stats.estimatedCO2Absorbed.toFixed(2)} kg
        </p>
        <p>
          <strong>Progress:</strong> {detail.stats.growthProgress}%
        </p>
      </section>

      <button onClick={onClose}>Tutup</button>
    </div>
  );
}
```

### Task 10: Get User Profile

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/apiLogin';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile.getProfile();
        
        if (response.success) {
          setProfile(response.data);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        // 401 means not logged in
        if (err instanceof Error && err.message.includes('401')) {
          window.location.href = '/auth/login';
        } else {
          setError(
            err instanceof Error ? err.message : 'Error'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Profile</h1>
      {profile.image && (
        <img src={profile.image} alt={profile.name} />
      )}
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Member Since:</strong>{' '}
        {new Date(profile.createdAt).toLocaleDateString('id-ID')}
      </p>
    </div>
  );
}
```

---

## 🛠️ Common Patterns

### Pattern 1: Error Boundary

```typescript
import { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ErrorBoundary({
  children,
  fallback = 'Something went wrong',
}: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="error-container">
        <p>{fallback}</p>
        <button onClick={() => setError(null)}>
          Try Again
        </button>
      </div>
    );
  }

  return children;
}
```

### Pattern 2: Loading Skeleton

```typescript
export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: '200px',
            background: '#f0f0f0',
            borderRadius: '8px',
            marginBottom: '16px',
            animation: 'pulse 2s infinite',
          }}
        />
      ))}
    </>
  );
}
```

### Pattern 3: Retry Logic

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      
      // Wait before retry
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (i + 1))
      );
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const data = await fetchWithRetry(
  () => getTree.getAllSpecies(),
  3
);
```

### Pattern 4: Request Cancellation

```typescript
const fetchWithCancel = async () => {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(
    () => controller.abort(),
    5000 // 5 second timeout
  );

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};
```

### Pattern 5: Optimistic Updates

```typescript
// Update UI before API response
const handleLike = async (itemId: string) => {
  // Optimistic update
  setItems(items.map(
    item => item.id === itemId
      ? { ...item, liked: !item.liked }
      : item
  ));

  try {
    // Make API call
    await api.toggleLike(itemId);
  } catch (err) {
    // Revert on error
    setItems(previousItems);
    showError('Failed to update');
  }
};
```

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/v1/trees/species"

**Causes:**
1. Backend is not running
2. `NEXT_PUBLIC_API_URL` is incorrect
3. Backend doesn't have this endpoint

**Solutions:**
```typescript
// Check 1: Verify BASE_URL in console
console.log(process.env.NEXT_PUBLIC_API_URL);

// Check 2: Verify backend is running
// curl http://localhost:8000/api/v1/trees/species

// Check 3: Check backend logs for errors
```

### Issue: "401 Unauthorized"

**Causes:**
1. Token not in localStorage
2. Token is expired
3. Token format is wrong

**Solutions:**
```typescript
// Check token
const token = localStorage.getItem('access_token');
console.log('Token:', token);

// Set token after login
localStorage.setItem('access_token', response.token);

// Clear token on logout
localStorage.removeItem('access_token');
```

### Issue: CORS Error

**Causes:**
1. Backend CORS not configured
2. Headers not allowed
3. Origin not whitelisted

**Solution:** Backend must allow:
```javascript
// Backend (Express example)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Issue: Network Request Timeout

**Solutions:**
```typescript
// Add timeout wrapper
const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeoutMs = 5000
) => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(
        () => reject(new Error('Request timeout')),
        timeoutMs
      )
    ),
  ]);
};
```

---

## 📚 Additional Resources

- [Complete API Documentation](./API_DOCUMENTATION_COMPLETE.md)
- [Architecture Guide](./ARCHITECTURE_AND_INTEGRATION.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Best Practices](./BEST_PRACTICES.md)

---

**Last Updated:** February 21, 2026  
**Status:** Ready for Production
