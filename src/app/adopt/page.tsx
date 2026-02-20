'use client';

import React, { useState, useEffect } from 'react';
import { getTree } from '@/lib/apiSpecies';
import AdoptSpeciesCard from '@/components/adopt/AdoptSpeciesCard';
import OrderModal from '@/components/adopt/OrderModal';

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

const categories = [
  'Tanaman Perspektif Keistimewaan',
  'Tanaman Toponimi Gunungkidul',
  'Tanaman Native Karst',
  'Tanaman Sumbu Filosofi',
];

export default function AdoptPage() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  // Fetch semua species
  useEffect(() => {
    fetchAllSpecies();
  }, []);

  const fetchAllSpecies = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await getTree.searchSpecies();
      if (response.success) {
        setSpeciesList(response.data || []);
        setFilteredSpecies(response.data || []);
      } else {
        setError(response.message || 'Gagal mengambil data species');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Filter dengan debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      filterSpecies(searchQuery, selectedCategory);
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchQuery, selectedCategory]);

  const filterSpecies = (search: string, category: string) => {
    let filtered = speciesList;

    if (search) {
      filtered = filtered.filter(
        (species) =>
          species.name.toLowerCase().includes(search.toLowerCase()) ||
          species.latinName.toLowerCase().includes(search.toLowerCase()) ||
          species.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((species) => species.category === category);
    }

    setFilteredSpecies(filtered);
  };

  const handleAdoptClick = (species: Species) => {
    setSelectedSpecies(species);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedSpecies(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            🌱 Adopsi Pohon Gunungkidul
          </h1>
          <p className="text-lg text-gray-600">
            Pilih pohon impian Anda dan bantu melestarikan alam Gunungkidul
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Cari Pohon
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama atau nama latin..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Filter Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filter Button */}
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
              >
                🗑️ Bersihkan Filter
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filteredSpecies.length}</span> pohon
            {selectedCategory && ` di kategori ${selectedCategory}`}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Species Grid */}
        {!isLoading && filteredSpecies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecies.map((species) => (
              <AdoptSpeciesCard
                key={species.id}
                species={species}
                onAdoptClick={() => handleAdoptClick(species)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredSpecies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {searchQuery || selectedCategory
                ? '❌ Tidak ada pohon yang sesuai dengan filter Anda'
                : '❌ Tidak ada data pohon tersedia'}
            </p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedSpecies && (
        <OrderModal
          species={selectedSpecies}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
