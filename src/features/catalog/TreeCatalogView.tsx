'use client';

import React, { useState, useMemo } from 'react';
import { Tree as RawTree } from '@/types';
import { TreeCluster } from './types';
import TreeCard, { TreeSpeciesCard } from '@/components/ui/TreeCard';
import TreeDetailModal from '@/components/ui/TreeDetailModal';
import CatalogTabs from './CatalogTabs';
import NameTagModal from '@/components/adopt/NameTagModal';
import PaymentModal from '@/components/adopt/PaymentModal';
import AuthErrorModal from '@/components/ui/AuthErrorModal';
import { orderApi } from '@/lib/apiPayment';

interface TreeCatalogViewProps {
  trees: RawTree[];
}

export default function TreeCatalogView({ trees }: TreeCatalogViewProps) {
  const [activeCluster, setActiveCluster] = useState<TreeCluster>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<TreeSpeciesCard | null>(null);

  // Adoption Flow States
  const [pendingSpecies, setPendingSpecies] = useState<TreeSpeciesCard | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showAuthError, setShowAuthError] = useState(false);

  // Group by species and calculate stock
  const groupedSpecies = useMemo(() => {
    const speciesMap = new Map<string, TreeSpeciesCard>();

    trees.forEach((tree) => {
      // Skip if species data is not available
      if (!tree.species) return;

      const speciesId = tree.species_id;

      // Initialize species entry if not exists
      if (!speciesMap.has(speciesId)) {
        speciesMap.set(speciesId, {
          id: speciesId,
          localName: tree.species.name,
          scientificName: tree.species.latinName,
          cluster: tree.location_block,
          image: tree.species.mainImageUrl,
          price: tree.price,
          stock: 0,
          description: tree.species.description,
        });
      }

      // Count available trees
      if (tree.status === 'available') {
        const species = speciesMap.get(speciesId)!;
        species.stock += 1;
      }
    });

    return Array.from(speciesMap.values());
  }, [trees]);

  // Filter by cluster and search term
  const filteredSpecies = useMemo(() => {
    let result = groupedSpecies;

    // Filter by cluster
    if (activeCluster !== 'All') {
      result = result.filter((species) => species.cluster === activeCluster);
    }

    // Filter by search term (local name or scientific name)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (species) =>
          species.localName.toLowerCase().includes(term) ||
          species.scientificName.toLowerCase().includes(term)
      );
    }

    return result;
  }, [groupedSpecies, activeCluster, searchTerm]);

  // Calculate counts for each cluster (count of unique species)
  const clusterCounts = useMemo(() => {
    const counts: Partial<Record<TreeCluster, number>> = { All: groupedSpecies.length };

    groupedSpecies.forEach((species) => {
      counts[species.cluster as TreeCluster] = (counts[species.cluster as TreeCluster] || 0) + 1;
    });

    return counts;
  }, [groupedSpecies]);

  const handleAdopt = (speciesId: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    const species = groupedSpecies.find((s) => s.id === speciesId);
    if (species) {
      setPendingSpecies(species);
    }
  };

  const handleNameSubmit = async (nameOnTag: string) => {
    if (!pendingSpecies) return;

    setIsCreatingOrder(true);
    try {
      const response = await orderApi.createOrder({
        speciesId: pendingSpecies.id,
        nameOnTag,
      });

      if (response.success && response.data?.id) {
        // Close modals and open payment
        setPendingSpecies(null);
        setSelectedSpecies(null);
        setActiveOrderId(response.data.id);
      } else {
        alert(response.message || 'Gagal membuat pesanan adopsi.');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Terjadi kesalahan koneksi saat membuat pesanan.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 md:mb-10 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 mb-3 md:mb-4 font-tilt">
          Koleksi PohonKu
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-sans">
          Jelajahi koleksi pohon langka dan bersejarah yang kami jaga. Setiap pohon memiliki cerita unik yang patut dibanggakan.
        </p>
      </div>

      {/* Control Bar (Search & Filters) */}
      <div className="mb-8 md:mb-10 px-4 flex flex-col items-center gap-5 md:gap-6 w-full max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="relative w-full max-w-[600px] shrink-0">
          <input
            type="text"
            placeholder="Search by tree name (e.g., Nangka, Manggis)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 md:px-5 md:py-3 pl-10 md:pl-12 text-sm md:text-base bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#1A581E] focus:ring-4 focus:ring-[#1A581E]/10 transition-all shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400"
          />
          <svg
            className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Tabs/Filters */}
        <div className="w-full flex justify-center">
          <CatalogTabs
            activeCluster={activeCluster}
            onClusterChange={setActiveCluster}
            counts={clusterCounts}
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 md:mb-6 px-4 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600">
          Menampilkan <span className="font-semibold text-[#1A581E]">{filteredSpecies.length}</span> species
          {activeCluster !== 'All' && (
            <span> di cluster <span className="font-semibold">{activeCluster}</span></span>
          )}
          {searchTerm && (
            <span> untuk &quot;<span className="font-semibold">{searchTerm}</span>&quot;</span>
          )}
        </p>
      </div>

      {/* Species Grid */}
      {filteredSpecies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
          {filteredSpecies.map((species) => (
            <TreeCard
              key={species.id}
              species={species}
              onClick={() => setSelectedSpecies(species)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 md:py-32 px-4 max-w-lg mx-auto animate-fade-in-up duration-700">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 relative group">
            {/* Background glowing circle */}
            <div className="absolute inset-0 bg-[#CEFFD1]/50 rounded-full blur-2xl group-hover:bg-[#CEFFD1]/80 transition-colors duration-500"></div>
            {/* Premium Minimalist SVG */}
            <svg className="w-full h-full text-[#1A581E] relative z-10 transform group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer soft circle */}
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" fill="#FFFFFF"/>
              {/* Magnifying Glass Handle */}
              <path d="M68 68L82 82" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.4"/>
              {/* Magnifying Glass Rim */}
              <circle cx="48" cy="48" r="28" stroke="currentColor" strokeWidth="4" fill="none"/>
              {/* Internal Sprout */}
              <path d="M48 64V46" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M48 54C48 54 41 46 41 42C41 38 45 36 48 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M48 48C48 48 55 40 55 36C55 32 51 30 48 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Earth line */}
              <path d="M38 64H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {/* Sparkles */}
              <circle cx="75" cy="30" r="2" fill="currentColor" strokeOpacity="0.6"/>
              <circle cx="25" cy="25" r="1.5" fill="currentColor" strokeOpacity="0.4"/>
            </svg>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-tilt text-gray-900 mb-3 tracking-tight">
            Koleksi Tidak Ditemukan
          </h3>
          <p className="text-base md:text-lg text-gray-500 font-sans leading-relaxed mb-8">
            {searchTerm 
              ? `Kami belum mencatat spesies dengan nama "${searchTerm}". Coba gunakan kata kunci latin atau nama lokal lain.` 
              : 'Belum ada koleksi spesies yang tersedia untuk filter kluster ini. Silakan coba eksplorasi kluster lainnya.'}
          </p>
          
          {/* CTA to reset filters */}
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveCluster('All');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A581E] text-white rounded-full font-medium shadow-md shadow-[#1A581E]/20 hover:bg-[#124416] hover:shadow-lg transition-all duration-300 transform active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Lihat Semua Koleksi
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSpecies && (
        <TreeDetailModal
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
          onAdopt={handleAdopt}
        />
      )}

      {/* Name Tag Modal */}
      {pendingSpecies && (
        <NameTagModal
          speciesName={pendingSpecies.localName}
          onClose={() => setPendingSpecies(null)}
          onSubmit={handleNameSubmit}
        />
      )}

      {/* Auth Error Modal */}
      {showAuthError && (
        <AuthErrorModal onCloseAction={() => setShowAuthError(false)} />
      )}

      {/* Loading Overlay when creating order */}
      {isCreatingOrder && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1A581E] border-t-transparent mb-4"></div>
            <p className="text-gray-900 font-medium font-sans">Menyiapkan Pesanan...</p>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {activeOrderId && (
        <PaymentModal
          orderId={activeOrderId}
          onClose={() => setActiveOrderId(null)}
        />
      )}
    </div>
  );
}
