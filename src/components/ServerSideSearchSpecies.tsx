'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { getTree } from '@/lib/apiSpecies';

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

interface ServerSideSearchSpeciesProps {
  onResultsUpdate?: (results: Species[]) => void;
  children?: ReactNode;
  debounceDelay?: number;
}

export default function ServerSideSearchSpecies({
  onResultsUpdate,
  children,
  debounceDelay = 500,
}: ServerSideSearchSpeciesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // ✅ PERBAIKAN 1: hasSearched dimulai true agar langsung tampil hasil
  const [hasSearched, setHasSearched] = useState(true);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const categories = ['Tanaman Perspektif Keistimewaan', 'Tanaman Toponimi Gunungkidul', 'Tanaman Native Karst', 'Tanaman Sumbu Filosofi', 'Medis'];

  const fetchSpecies = async (search: string = '', category: string = '') => {
    try {
      setIsLoading(true);
      setError('');
      setHasSearched(true);

      const response = await getTree.searchSpecies(
        search || undefined,
        category || undefined
      );

      if (response.success) {
        setFilteredSpecies(response.data || []);
        onResultsUpdate?.(response.data || []);
      } else {
        setFilteredSpecies([]);
        setError(response.message || 'Gagal mengambil data species');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat mencari'
      );
      setFilteredSpecies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ PERBAIKAN 2: Fetch semua species saat pertama kali komponen mount
  // Setelah itu, setiap perubahan search/category trigger debounced fetch
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      fetchSpecies(searchQuery, selectedCategory);
    }, debounceDelay);

    setDebounceTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchQuery, selectedCategory, debounceDelay]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    // ✅ PERBAIKAN 3: Saat clear, tidak reset hasSearched — biarkan tetap tampil
    // fetchSpecies akan dipanggil ulang oleh useEffect karena state berubah
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Cari Spesies Pohon
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama spesies (misal: Pinus, Mahoni)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Search dilakukan real-time setelah berhenti mengetik
            </p>
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

          {/* Clear Button */}
          {(searchQuery || selectedCategory) && (
            <button
              onClick={handleClearSearch}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
            >
              🗑️ Bersihkan Filter
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Mencari spesies...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">❌ Terjadi Kesalahan</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results — selalu tampil setelah mount */}
      {!isLoading && hasSearched && !error && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {filteredSpecies.length > 0 ? (
            <>
              {/* Results Summary */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  {searchQuery || selectedCategory ? '✨ Hasil Pencarian' : '🌳 Semua Spesies'}
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredSpecies.length} spesies
                </span>
              </div>

              {/* Display Children or Default Grid */}
              {children ? (
                <>
                  {React.cloneElement(children as React.ReactElement, {
                    species: filteredSpecies,
                  })}
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSpecies.map((species) => (
                    <div
                      key={species.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {species.mainImageUrl && (
                        <div className="h-48 bg-gray-200 overflow-hidden">
                          <img
                            src={species.mainImageUrl}
                            alt={species.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {species.category}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {species.name}
                        </h3>

                        <p className="text-sm text-gray-600 italic mb-2">
                          {species.latinName}
                        </p>

                        {species.description && (
                          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                            {species.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500">Harga</p>
                            <p className="font-bold text-green-600">
                              Rp {species.basePrice?.toLocaleString('id-ID')}
                            </p>
                          </div>
                          {species.carbonAbsorptionRate && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">CO₂ Absorption</p>
                              <p className="font-bold text-blue-600">
                                {species.carbonAbsorptionRate} kg/yr
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-gray-600 font-medium">
                Tidak ada spesies yang sesuai dengan pencarian Anda
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Coba ubah kata kunci atau pilih kategori lain
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ DIHAPUS: Initial State placeholder sudah tidak diperlukan */}
    </div>
  );
}