'use client';

import React, { useState, useMemo } from 'react';
import { Tree as RawTree } from '@/types';
import { TreeCluster } from './types';
import TreeCard, { TreeSpeciesCard } from '@/components/ui/treeCard';
import TreeDetailModal from '@/components/ui/TreeDetailModal';
import CatalogTabs from './CatalogTabs';

interface TreeCatalogViewProps {
  trees: RawTree[];
}

export default function TreeCatalogView({ trees }: TreeCatalogViewProps) {
  const [activeCluster, setActiveCluster] = useState<TreeCluster>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<TreeSpeciesCard | null>(null);

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
          scientificName: tree.species.scientific_name,
          cluster: tree.location_block,
          image: tree.species.image_url,
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
    // TODO: Implement adoption logic
    console.log('Adopting species:', speciesId);
    // You could navigate to adoption form, open payment modal, etc.
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Tilt Warp, serif' }}>
          Koleksi PohonKu
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
          Jelajahi koleksi pohon langka dan bersejarah yang kami jaga. Setiap pohon memiliki cerita unik yang patut dibanggakan.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search by tree name (e.g., Nangka, Manggis)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#1A581E] focus:ring-2 focus:ring-[#1A581E]/20 transition-all text-gray-700 placeholder-gray-400"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
      </div>

      {/* Tabs/Filters */}
      <div className="mb-8 flex justify-center">
        <CatalogTabs
          activeCluster={activeCluster}
          onClusterChange={setActiveCluster}
          counts={clusterCounts}
        />
      </div>

      {/* Results Info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpecies.map((species) => (
            <TreeCard
              key={species.id}
              species={species}
              onClick={() => setSelectedSpecies(species)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌳</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak ada spesies ditemukan
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Coba kata kunci lain' : 'Coba filter lain untuk melihat koleksi kami'}
          </p>
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
    </div>
  );
}
