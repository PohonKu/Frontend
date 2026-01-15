// src/modules/catalog/CatalogView.tsx
'use client'; // Wajib: Karena ada interaksi klik (useState)

import { Tree } from '@/types';
import { TreeCard } from '@/components/ui/treeCard';
import { useState } from 'react';

interface CatalogViewProps {
  trees: Tree[];
  categories: string[]; // List string kategori dari mockData
}

export const CatalogView = ({ trees, categories }: CatalogViewProps) => {
  // State untuk menyimpan filter yang sedang aktif
  // Default: 'All' (Menampilkan semua pohon)
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Logic Filtering:
  // Jika 'All', tampilkan semua.
  // Jika tidak, tampilkan pohon yang location_block-nya sama dengan kategori yang dipilih.
  const filteredTrees = activeCategory === 'All' 
    ? trees 
    : trees.filter(t => t.location_block === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* --- SIDEBAR (Filter) --- */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <h2 className="font-bold text-lg mb-4 text-green-900 border-b pb-2">
            Kategori Pohon
          </h2>
          
          <ul className="space-y-2">
            {/* 1. Tombol 'Semua Kategori' */}
            <li>
              <button 
                onClick={() => setActiveCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === 'All' 
                    ? 'bg-green-100 text-green-800 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Semua Kategori
              </button>
            </li>

            {/* 2. Tombol Loop dari Data Excel (4 Cluster) */}
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat 
                      ? 'bg-green-100 text-green-800 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* --- MAIN CONTENT (Grid Pohon) --- */}
      <section className="lg:col-span-3">
        {/* Header Section: Menampilkan nama kategori aktif & jumlah hasil */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeCategory === 'All' ? 'Semua Koleksi' : activeCategory}
          </h2>
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            {filteredTrees.length} Bibit
          </span>
        </div>

        {/* Grid Section */}
        {filteredTrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTrees.map((tree) => (
              <TreeCard key={tree.id} tree={tree} />
            ))}
          </div>
        ) : (
          // Empty State (Jika tidak ada pohon di kategori itu)
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada bibit tersedia untuk kategori ini.</p>
          </div>
        )}
      </section>
    </div>
  );
};