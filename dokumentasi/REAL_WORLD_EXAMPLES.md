# 💡 Real-World Implementation Examples - Pohonku

**Versi:** 1.0  
**Tanggal:** February 2026  
**Target:** Developers implementing actual features

---

## 📑 Daftar Isi

1. [Full Adopt Flow Implementation](#full-adopt-flow-implementation)
2. [Dashboard with Real Data](#dashboard-with-real-data)
3. [Live Search Implementation](#live-search-implementation)
4. [Error Handling & Retry](#error-handling--retry)
5. [State Management Patterns](#state-management-patterns)
6. [Performance Optimization](#performance-optimization)

---

## Full Adopt Flow Implementation

### Complete Adopt Feature (Single File Example)

```typescript
// src/app/adopt/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getTree } from '@/lib/apiSpecies';
import { orderApi } from '@/lib/apiOrder';
import './adopt.css';

// Types
interface Species {
  id: string;
  name: string;
  latinName: string;
  category: string;
  basePrice: number;
  mainImageUrl: string;
  description?: string;
  carbonAbsorptionRate?: number;
}

interface Order {
  id: string;
  orderId: string;
  totalAmount: number;
  status: string;
}

// Constants
const CATEGORIES = [
  'Perspektif Keistimewaan',
  'Toponimi Gunungkidul',
  'Native Karst',
  'Sumbu Filosofi',
];

const DEBOUNCE_DELAY = 300;

export default function AdoptPage() {
  // State: Data
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);

  // State: UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // State: Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  // State: Debounce
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Effect: Initial load
  useEffect(() => {
    loadAllSpecies();
  }, []);

  // Effect: Filter with debounce
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      applyFilters();
    }, DEBOUNCE_DELAY);

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchQuery, selectedCategory]);

  // API: Load all species
  const loadAllSpecies = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📡 Fetching all species...');
      const response = await getTree.searchSpecies();

      if (response.success && response.data) {
        setAllSpecies(response.data);
        setFilteredSpecies(response.data);
        console.log(`✅ Loaded ${response.data.length} species`);
      } else {
        throw new Error(response.message || 'Failed to load species');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to load species';
      setError(errorMsg);
      console.error('❌ Error loading species:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter/Search
  const applyFilters = async () => {
    try {
      if (!searchQuery.trim() && !selectedCategory) {
        // No filters - show all
        setFilteredSpecies(allSpecies);
        return;
      }

      // API call with filters
      const response = await getTree.searchSpecies(
        searchQuery || undefined,
        selectedCategory || undefined
      );

      if (response.success && response.data) {
        setFilteredSpecies(response.data);
      } else {
        console.warn('Filter failed:', response.message);
      }
    } catch (err) {
      console.error('Filter error:', err);
      // Keep previous results on error
    }
  };

  // Handlers
  const handleAdoptClick = (species: Species) => {
    setSelectedSpecies(species);
    setShowOrderModal(true);
  };

  const handleOrderModalClose = () => {
    setShowOrderModal(false);
    setSelectedSpecies(null);
  };

  // Render
  return (
    <div className="adopt-page">
      {/* Header */}
      <header className="adopt-header">
        <h1>Adopsi Pohon</h1>
        <p>
          Pilih jenis pohon yang ingin Anda adopsi dan bantu kami menghijaukan
          bumi
        </p>
      </header>

      {/* Filters */}
      <section className="filters">
        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari nama pohon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={!selectedCategory ? 'active' : ''}
            onClick={() => setSelectedCategory('')}
          >
            Semua
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="content">
        {/* Loading State */}
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading species...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="error-box">
            <p>❌ {error}</p>
            <button onClick={loadAllSpecies}>Coba Lagi</button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredSpecies.length === 0 && (
          <div className="empty-state">
            <p>Tidak ada species yang sesuai dengan filter</p>
            <button onClick={() => setSearchQuery('')}>Reset Filter</button>
          </div>
        )}

        {/* Species Grid */}
        {!isLoading && !error && filteredSpecies.length > 0 && (
          <div className="species-grid">
            {filteredSpecies.map((species) => (
              <SpeciesCard
                key={species.id}
                species={species}
                onAdopt={() => handleAdoptClick(species)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Order Modal */}
      {showOrderModal && selectedSpecies && (
        <OrderModalComponent
          species={selectedSpecies}
          onClose={handleOrderModalClose}
        />
      )}
    </div>
  );
}

// Species Card Component
interface SpeciesCardProps {
  species: Species;
  onAdopt: () => void;
}

function SpeciesCard({ species, onAdopt }: SpeciesCardProps) {
  return (
    <div className="species-card">
      <div className="image-container">
        <img src={species.mainImageUrl} alt={species.name} />
        <span className="category-badge">{species.category}</span>
      </div>

      <div className="info">
        <h3>{species.name}</h3>
        <p className="latin-name">{species.latinName}</p>

        {species.description && (
          <p className="description">{species.description.substring(0, 100)}...</p>
        )}

        {species.carbonAbsorptionRate && (
          <p className="stat">
            🌿 {species.carbonAbsorptionRate} kg CO₂/tahun
          </p>
        )}

        <div className="price">
          <span className="amount">
            Rp {species.basePrice.toLocaleString('id-ID')}
          </span>
        </div>

        <button className="btn-adopt" onClick={onAdopt}>
          Adopsi
        </button>
      </div>
    </div>
  );
}

// Order Modal Component
interface OrderModalProps {
  species: Species;
  onClose: () => void;
}

function OrderModalComponent({ species, onClose }: OrderModalProps) {
  const [nameOnTag, setNameOnTag] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameOnTag.trim()) {
      setOrderError('Nama di tag tidak boleh kosong');
      return;
    }

    try {
      setIsProcessing(true);
      setOrderError(null);

      console.log('📦 Creating order for species:', species.id);
      console.log('   Name on tag:', nameOnTag);

      const response = await orderApi.createOrder({
        speciesId: species.id,
        nameOnTag: nameOnTag.trim(),
      });

      console.log('📡 Order response:', response);

      if (response.success && response.data?.id) {
        console.log('✅ Order created:', response.data.id);
        setOrderId(response.data.id);
        setShowPaymentModal(true);
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error creating order';
      setOrderError(errorMsg);
      console.error('❌ Order error:', errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    onClose();
  };

  // Payment Modal is shown if orderId exists
  if (showPaymentModal && orderId) {
    return (
      <PaymentModalComponent
        orderId={orderId}
        amount={species.basePrice}
        onSuccess={handlePaymentClose}
        onClose={handlePaymentClose}
      />
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Adopsi {species.name}</h2>

        <div className="species-preview">
          <img src={species.mainImageUrl} alt={species.name} />
          <div className="species-info">
            <p>
              <strong>Nama:</strong> {species.name}
            </p>
            <p>
              <strong>Latin:</strong> {species.latinName}
            </p>
            <p>
              <strong>Harga:</strong> Rp{' '}
              {species.basePrice.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama di Tag Pohon *</label>
            <input
              type="text"
              placeholder='Contoh: "Dari John Doe"'
              value={nameOnTag}
              onChange={(e) => setNameOnTag(e.target.value)}
              disabled={isProcessing}
            />
            <small>Nama ini akan ditampilkan di tag pohon</small>
          </div>

          {orderError && <div className="error-message">{orderError}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Lanjutkan ke Pembayaran'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Payment Modal Component
interface PaymentModalProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

function PaymentModalComponent({
  orderId,
  amount,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      console.log('💳 Getting payment token for order:', orderId);

      const response = await orderApi.createPayment(orderId);

      console.log('📡 Payment response:', response);

      if (response.success && response.data?.token) {
        const snapToken = response.data.token;
        console.log('✅ Got Snap token, opening payment UI');

        // Open Midtrans Snap
        const snap = (window as any).snap;
        snap.pay(snapToken, {
          onSuccess: (result: any) => {
            console.log('✅ Payment success:', result);
            showNotification('Pembayaran berhasil!', 'success');
            onSuccess();
          },
          onPending: (result: any) => {
            console.log('⏳ Payment pending:', result);
          },
          onError: (result: any) => {
            console.error('❌ Payment error:', result);
            setPaymentError('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: () => {
            console.log('Payment dialog closed by user');
          },
        });
      } else {
        throw new Error(
          response.message || 'Failed to get payment token'
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Payment error';
      setPaymentError(errorMsg);
      console.error('❌ Payment error:', errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Konfirmasi Pembayaran</h2>

        <div className="payment-summary">
          <div className="summary-item">
            <span>Total Pembayaran:</span>
            <span className="amount">
              Rp {amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {paymentError && (
          <div className="error-message">{paymentError}</div>
        )}

        <div className="form-actions">
          <button
            onClick={handlePayment}
            className="btn-primary"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Bayar Sekarang'}
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isProcessing}
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

// Notification helper (simple implementation)
function showNotification(message: string, type: 'success' | 'error' = 'success') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // In real app, use toast library like react-toastify
}
```

---

## Dashboard with Real Data

### Complete Dashboard Implementation

```typescript
// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/apiDashboard';

interface Species {
  id: string;
  name: string;
  latinName: string;
  imageUrl: string;
  carbonRate: number;
  category: string;
}

interface Tree {
  id: string;
  serialNumber: string;
  latitude: string | null;
  longitude: string | null;
  plantedAt: string | null;
  status: string;
}

interface Order {
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  purchasedAt: string;
}

interface Adoption {
  adoptionId: string;
  adoptedAt: string;
  nameOnTag: string;
  species: Species;
  tree: Tree;
  order: Order;
}

interface Stats {
  totalAdoptions: number;
  totalTreesPlanted: number;
  totalCarbonAbsorbed: number;
  lastMonthAdoptions: number;
  averageCarbonPerTree: number;
  totalInvested: number;
}

export default function DashboardPage() {
  // State: Data
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedAdoption, setSelectedAdoption] = useState<any>(null);

  // State: UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Effect: Load data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // API: Load all dashboard data in parallel
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 Loading dashboard data...');

      // Fetch both requests in parallel
      const [adoptionsRes, statsRes] = await Promise.all([
        dashboardApi.getDashboard(),
        dashboardApi.getStatsAdoption(),
      ]);

      // Process adoptions
      if (adoptionsRes.success && adoptionsRes.data) {
        setAdoptions(adoptionsRes.data);
        console.log(`✅ Loaded ${adoptionsRes.data.length} adoptions`);
      } else {
        throw new Error(
          adoptionsRes.message || 'Failed to load adoptions'
        );
      }

      // Process stats
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
        console.log('✅ Loaded statistics');
      } else {
        console.warn('Stats failed:', statsRes.message);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMsg);
      console.error('❌ Dashboard error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adoption detail view
  const handleViewDetail = async (adoptionId: string) => {
    try {
      console.log('📋 Fetching adoption detail:', adoptionId);

      const response = await dashboardApi.getAdoptionDetail(adoptionId);

      if (response.success && response.data) {
        setSelectedAdoption(response.data);
        setIsDetailModalOpen(true);
        console.log('✅ Loaded adoption detail');
      } else {
        console.error('Failed to load detail:', response.message);
      }
    } catch (err) {
      console.error('Detail error:', err);
    }
  };

  // Render
  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard Adopsi Saya</h1>
        <button
          className="btn-refresh"
          onClick={loadDashboardData}
          disabled={isLoading}
        >
          🔄 Refresh
        </button>
      </header>

      {/* Error State */}
      {error && !isLoading && (
        <div className="error-banner">
          <p>❌ {error}</p>
          <button onClick={loadDashboardData}>Coba Lagi</button>
        </div>
      )}

      {/* Statistics */}
      {!isLoading && stats && (
        <section className="stats-section">
          <h2>Statistik Adopsi</h2>
          <div className="stats-grid">
            <StatCard
              label="Total Adopsi"
              value={stats.totalAdoptions}
              icon="🌱"
            />
            <StatCard
              label="Pohon Ditanam"
              value={stats.totalTreesPlanted}
              icon="🌳"
            />
            <StatCard
              label="CO₂ Terserap"
              value={`${stats.totalCarbonAbsorbed.toFixed(2)} kg`}
              icon="🌍"
            />
            <StatCard
              label="Bulan Ini"
              value={stats.lastMonthAdoptions}
              icon="📈"
            />
            <StatCard
              label="Rata-rata CO₂"
              value={`${stats.averageCarbonPerTree.toFixed(2)} kg`}
              icon="📊"
            />
            <StatCard
              label="Total Investasi"
              value={`Rp ${stats.totalInvested.toLocaleString('id-ID')}`}
              icon="💰"
            />
          </div>
        </section>
      )}

      {/* Adoptions List */}
      <section className="adoptions-section">
        <h2>Daftar Adopsi ({adoptions.length})</h2>

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading adoptions...</p>
          </div>
        )}

        {!isLoading && adoptions.length === 0 && (
          <div className="empty-state">
            <p>Anda belum memiliki adopsi pohon</p>
            <a href="/adopt" className="btn-primary">
              Adopsi Pohon Sekarang
            </a>
          </div>
        )}

        {!isLoading && adoptions.length > 0 && (
          <div className="adoptions-list">
            {adoptions.map((adoption) => (
              <AdoptionCard
                key={adoption.adoptionId}
                adoption={adoption}
                onViewDetail={() =>
                  handleViewDetail(adoption.adoptionId)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedAdoption && (
        <AdoptionDetailModal
          adoption={selectedAdoption}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <div className="content">
        <p className="label">{label}</p>
        <p className="value">{value}</p>
      </div>
    </div>
  );
}

// Adoption Card Component
interface AdoptionCardProps {
  adoption: Adoption;
  onViewDetail: () => void;
}

function AdoptionCard({ adoption, onViewDetail }: AdoptionCardProps) {
  return (
    <div className="adoption-card">
      <div className="image-container">
        <img src={adoption.species.imageUrl} alt={adoption.species.name} />
      </div>

      <div className="info">
        <h3>{adoption.species.name}</h3>
        <p className="latin-name">{adoption.species.latinName}</p>

        <div className="details">
          <p>
            <strong>Nama Tag:</strong> {adoption.nameOnTag}
          </p>
          <p>
            <strong>Serial:</strong> {adoption.tree.serialNumber}
          </p>
          <p>
            <strong>Status:</strong> {adoption.tree.status}
          </p>
          <p>
            <strong>Tanggal Adopsi:</strong>{' '}
            {new Date(adoption.adoptedAt).toLocaleDateString('id-ID')}
          </p>
        </div>

        <div className="stats">
          <span>🌿 {adoption.species.carbonRate} kg CO₂/tahun</span>
        </div>

        <button
          className="btn-details"
          onClick={onViewDetail}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

// Adoption Detail Modal Component
interface AdoptionDetailModalProps {
  adoption: any;
  onClose: () => void;
}

function AdoptionDetailModal({
  adoption,
  onClose,
}: AdoptionDetailModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Detail Adopsi: {adoption.species.name}</h2>

        {/* Species Info */}
        <section className="modal-section">
          <h3>📋 Info Spesies</h3>
          <div className="detail-grid">
            <div>
              <img
                src={adoption.species.imageUrl}
                alt={adoption.species.name}
                style={{ maxWidth: '200px', borderRadius: '8px' }}
              />
            </div>
            <div>
              <p>
                <strong>Nama:</strong> {adoption.species.name}
              </p>
              <p>
                <strong>Latin:</strong> {adoption.species.latinName}
              </p>
              <p>
                <strong>Kategori:</strong> {adoption.species.category}
              </p>
              <p>
                <strong>CO₂ Absorption:</strong>{' '}
                {adoption.species.carbonRate} kg/tahun
              </p>
              {adoption.species.description && (
                <p>
                  <strong>Deskripsi:</strong> {adoption.species.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Tree Info */}
        <section className="modal-section">
          <h3>🌳 Info Pohon</h3>
          <div className="detail-list">
            <p>
              <strong>Serial Number:</strong> {adoption.tree.serialNumber}
            </p>
            <p>
              <strong>Status:</strong> {adoption.tree.status}
            </p>
            <p>
              <strong>Health:</strong> {adoption.tree.healthStatus}
            </p>
            <p>
              <strong>Tanggal Tanam:</strong>{' '}
              {new Date(adoption.tree.plantedAt).toLocaleDateString('id-ID')}
            </p>
            {adoption.tree.latitude && adoption.tree.longitude && (
              <p>
                <strong>Lokasi GPS:</strong> {adoption.tree.latitude},{' '}
                {adoption.tree.longitude}
              </p>
            )}
          </div>
        </section>

        {/* Statistics */}
        {adoption.stats && (
          <section className="modal-section">
            <h3>📊 Statistik</h3>
            <div className="detail-list">
              <p>
                <strong>Hari Aktif:</strong> {adoption.stats.daysActive}
              </p>
              <p>
                <strong>CO₂ Terserap:</strong>{' '}
                {adoption.stats.estimatedCO2Absorbed.toFixed(2)} kg
              </p>
              <p>
                <strong>Progress Pertumbuhan:</strong> {adoption.stats.growthProgress}%
              </p>
            </div>
          </section>
        )}

        {/* Order Info */}
        <section className="modal-section">
          <h3>🛒 Informasi Pembelian</h3>
          <div className="detail-list">
            <p>
              <strong>Order Number:</strong> {adoption.order.orderNumber}
            </p>
            <p>
              <strong>Total Amount:</strong> Rp{' '}
              {adoption.order.totalAmount.toLocaleString('id-ID')}
            </p>
            <p>
              <strong>Payment Status:</strong> {adoption.order.paymentStatus}
            </p>
            <p>
              <strong>Purchase Date:</strong>{' '}
              {new Date(adoption.order.purchasedAt).toLocaleDateString('id-ID')}
            </p>
          </div>
        </section>

        <button className="btn-primary" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
```

---

## Live Search Implementation

### Search with Debounce & Instant Results

```typescript
// src/components/LiveSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTree } from '@/lib/apiSpecies';

interface SearchResult {
  id: string;
  name: string;
  latinName: string;
  category: string;
  mainImageUrl: string;
}

interface LiveSearchProps {
  onSelect: (item: SearchResult) => void;
  placeholder?: string;
}

export default function LiveSearch({
  onSelect,
  placeholder = 'Cari pohon...',
}: LiveSearchProps) {
  // State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Effect: Debounced search
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If query is empty, clear results
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Set new timer for search
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [query]);

  // API: Perform search
  const performSearch = async (searchQuery: string) => {
    try {
      setIsSearching(true);

      const response = await getTree.searchSpecies(searchQuery);

      if (response.success && response.data) {
        setResults(response.data);
        setShowResults(true);
        setSelectedIndex(-1);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="live-search">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {isSearching && <div className="search-spinner"></div>}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="clear-btn"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="results-dropdown">
          {isSearching && (
            <div className="result-item loading">
              Searching...
            </div>
          )}

          {!isSearching && results.length === 0 && (
            <div className="result-item empty">
              Tidak ada hasil untuk "{query}"
            </div>
          )}

          {!isSearching &&
            results.map((result, index) => (
              <div
                key={result.id}
                className={`result-item ${
                  selectedIndex === index ? 'selected' : ''
                }`}
                onClick={() => handleSelectResult(result)}
              >
                <img
                  src={result.mainImageUrl}
                  alt={result.name}
                  className="result-image"
                />
                <div className="result-info">
                  <p className="result-name">{result.name}</p>
                  <p className="result-latin">
                    {result.latinName}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling & Retry

### Robust Error Handling Pattern

```typescript
// Fetch with retry logic
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 1.5,
    onRetry,
  } = options;

  let lastError: Error | null = null;
  let delay = delayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break; // No more retries
      }

      // Log retry attempt
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Wait before retry with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= backoffMultiplier;
    }
  }

  throw lastError;
}

// Usage in component
const [retryCount, setRetryCount] = useState(0);

const loadData = async () => {
  try {
    const data = await fetchWithRetry(
      () => getTree.getAllSpecies(),
      {
        maxRetries: 3,
        delayMs: 500,
        onRetry: (attempt, error) => {
          console.warn(
            `Retry attempt ${attempt}: ${error.message}`
          );
          setRetryCount(attempt);
        },
      }
    );
    setData(data);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Failed after 3 retries'
    );
  }
};
```

---

## State Management Patterns

### Complex State with useReducer

```typescript
// State machine for order flow
type OrderState = 
  | 'idle'
  | 'creating'
  | 'created'
  | 'paying'
  | 'paid'
  | 'failed';

interface OrderContextState {
  state: OrderState;
  orderId: string | null;
  error: string | null;
}

type OrderAction =
  | { type: 'CREATE_START' }
  | { type: 'CREATE_SUCCESS'; orderId: string }
  | { type: 'CREATE_ERROR'; error: string }
  | { type: 'PAY_START' }
  | { type: 'PAY_SUCCESS' }
  | { type: 'PAY_ERROR'; error: string }
  | { type: 'RESET' };

function orderReducer(
  state: OrderContextState,
  action: OrderAction
): OrderContextState {
  switch (action.type) {
    case 'CREATE_START':
      return { ...state, state: 'creating', error: null };
    case 'CREATE_SUCCESS':
      return { 
        ...state, 
        state: 'created', 
        orderId: action.orderId,
        error: null
      };
    case 'CREATE_ERROR':
      return { 
        ...state, 
        state: 'failed', 
        error: action.error 
      };
    case 'PAY_START':
      return { ...state, state: 'paying', error: null };
    case 'PAY_SUCCESS':
      return { ...state, state: 'paid', error: null };
    case 'PAY_ERROR':
      return { 
        ...state, 
        state: 'failed', 
        error: action.error 
      };
    case 'RESET':
      return { state: 'idle', orderId: null, error: null };
  }
}

// Usage in component
const [orderState, dispatch] = useReducer(orderReducer, {
  state: 'idle',
  orderId: null,
  error: null,
});

const handleCreateOrder = async (data) => {
  dispatch({ type: 'CREATE_START' });
  try {
    const response = await orderApi.createOrder(data);
    dispatch({ 
      type: 'CREATE_SUCCESS', 
      orderId: response.data.id 
    });
  } catch (err) {
    dispatch({ 
      type: 'CREATE_ERROR', 
      error: err.message 
    });
  }
};
```

---

## Performance Optimization

### Memoized API Calls

```typescript
import { useMemo, useCallback } from 'react';

// Memoize API functions to prevent unnecessary calls
const SpeciesCache = () => {
  const cache = useMemo(() => new Map<string, any>(), []);

  const getSpeciesWithCache = useCallback(
    async (id: string) => {
      if (cache.has(id)) {
        return cache.get(id);
      }

      const data = await getTree.getSpeciesById(id);
      cache.set(id, data);
      return data;
    },
    [cache]
  );

  return { getSpeciesWithCache };
};

// Lazy load components
const OrderModal = dynamic(
  () => import('./OrderModal'),
  { loading: () => <div>Loading...</div> }
);

// Virtualized list for many items
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={species.length}
  itemSize={100}
>
  {({ index, style }) => (
    <div style={style}>
      <SpeciesCard species={species[index]} />
    </div>
  )}
</FixedSizeList>
```

---

**Last Updated:** February 21, 2026  
**Status:** Ready for Production Implementation
