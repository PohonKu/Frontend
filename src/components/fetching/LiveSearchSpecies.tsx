'use client';

import React, { useState, useEffect } from 'react';
import { getTree } from '@/lib/apiSpecies';
import Image from "next/image";


interface Species {
  id: string;
  name: string;
  latinName: string;
  category: string;
  basePrice: number;
  description: string;
  mainImageUrl?: string;
  carbonAbsorptionRate?: number;
  availabelStok?: number;
}

interface LiveSearchProps {
  onResultsUpdate?: (results: Species[]) => void;
  children?: React.ReactNode;
}

/**
 * Live Search Component
 * Menampilkan semua species awalnya dan filter real-time saat user mengetik/memilih kategori
 */
export const LiveSearchSpecies: React.FC<LiveSearchProps> = ({
  onResultsUpdate,
  children
}) => {
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all species on mount
  useEffect(() => {
    const loadAllSpecies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTree.getAllSpecies();
        
        if (response.success) {
          setAllSpecies(response.data);
          setFilteredSpecies(response.data);
          onResultsUpdate?.(response.data);
        } else {
          setError('Gagal memuat data species');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAllSpecies();
  }, [onResultsUpdate]);

  // Filter species real-time
  useEffect(() => {
    const results = allSpecies.filter(species => {
      const matchesSearch = !searchQuery || 
        species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        species.latinName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        species.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredSpecies(results);
    onResultsUpdate?.(results);
  }, [searchQuery, selectedCategory, allSpecies, onResultsUpdate]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  return (
    <div className="w-full">
      {/* Search & Filter Container */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">🔍 Cari Species Pohon</h2>

        <div className="flex flex-col gap-4">
          {/* Search & Category Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari nama species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Semua Kategori</option>
              <option value="Tropis">Tropis</option>
              <option value="Subtropis">Subtropis</option>
              <option value="Hutan">Hutan</option>
              <option value="Buah">Buah</option>
              <option value="Medis">Medis</option>
            </select>

            {/* Clear Button */}
            {(searchQuery || selectedCategory) && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Bersihkan
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Filter aktif:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  🔎 {searchQuery}
                </span>
              )}
              {selectedCategory && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  📁 {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Memuat data...</span>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">
              Ditemukan <span className="text-green-600 text-lg">{filteredSpecies.length}</span> species
              {allSpecies.length > 0 && ` dari ${allSpecies.length} total`}
            </p>
          </div>
        )}

        {/* Results Display */}
        {!loading && filteredSpecies.length > 0 && (
          <div>
            {children ? (
              React.cloneElement(children as React.ReactElement, { 
                species: filteredSpecies 
              })
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSpecies.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    {item.mainImageUrl && (
                      <Image
                        src={item.mainImageUrl}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                    )}
                   
                    <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                    
                    <p className="text-gray-600 italic text-sm mb-2">
                      {item.latinName}
                    </p>
                    <p className="text-gray-700 text-sm mb-2">
                      {item.description?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        Rp {item.basePrice?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredSpecies.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">Tidak ada species yang sesuai</p>
            <p className="text-gray-400 text-sm mt-2">
              Coba ubah kriteria pencarian atau kategori
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSearchSpecies;
