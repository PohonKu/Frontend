'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/apiDashboard';
import AdoptionStats from '@/components/dashboard/AdoptionStats';
import AdoptionList from '@/components/dashboard/AdoptionList';
import AdoptionDetailModal from '@/components/dashboard/AdoptionDetailModal';

interface Adoption {
  adoptionId: string;
  adoptedAt: string;
  nameOnTag: string;
  species: {
    id: string;
    name: string;
    latinName: string;
    imageUrl: string;
    carbonRate: number;
    category: string;
  };
  tree: {
    id: string;
    serialNumber: string;
    latitude: string | null;
    longitude: string | null;
    plantedAt: string | null;
    status: string;
    createdAt: string;
    latestUpdate: string | null;
  };
  order: {
    orderNumber: string;
    totalAmount: number;
    paymentStatus: string;
    purchasedAt: string;
  };
}

interface Stats {
  totalAdoptions: number;
  totalTreesPlanted: number;
  totalCarbonAbsorbed: number;
  lastMonthAdoptions: number;
}

export default function DashboardPage() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedAdoption, setSelectedAdoption] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch adoptions list
      const adoptionsResponse = await dashboardApi.getDashboard();
      if (adoptionsResponse.success) {
        setAdoptions(adoptionsResponse.data);
      } else {
        setError(adoptionsResponse.message || 'Failed to fetch adoptions');
      }

      // Fetch stats
      const statsResponse = await dashboardApi.getStatsAdoption();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionClick = async (adoptionId: string) => {
    try {
      const response = await dashboardApi.getAdoptionDetail(adoptionId);
      if (response.success) {
        setSelectedAdoption(response.data);
        setIsModalOpen(true);
      } else {
        setError(response.message || 'Failed to fetch adoption details');
      }
    } catch (err) {
      console.error('Error fetching adoption details:', err);
      setError('Failed to load adoption details');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdoption(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Adopsi
          </h1>
          <p className="text-gray-600">Kelola dan pantau pohon yang telah Anda adopsi</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded">
          <div className="flex justify-between items-start">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-semibold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && !loading && <AdoptionStats stats={stats} />}

        {/* Adoption List Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Daftar Adopsi Saya
            </h2>
            {!loading && adoptions.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {adoptions.length} pohon
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg h-96 animate-pulse"
                >
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : adoptions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum ada adopsi
              </h3>
              <p className="text-gray-600">
                Mulai adopsi pohon sekarang untuk melihatnya di sini
              </p>
            </div>
          ) : (
            <AdoptionList
              adoptions={adoptions}
              onAdoptionClick={handleAdoptionClick}
            />
          )}
        </div>
      </div>

      {isModalOpen && selectedAdoption && (
        <AdoptionDetailModal
          adoption={selectedAdoption}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
