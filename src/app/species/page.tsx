'use client';

import React from 'react';
import LiveSearchSpecies from '@/components/fetching/LiveSearchSpecies';

/**
 * Species Page
 * Halaman untuk menampilkan dan mencari species pohon
 * Menggunakan Live Search - tampilkan semua & filter real-time
 */
export default function Page() {
  const [results, setResults] = React.useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">🌳 Tree Species Catalog</h1>
          <p className="text-green-100 mt-2">
            Jelajahi koleksi lengkap spesies pohon - cari dan filter secara real-time
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Search Component */}
        <LiveSearchSpecies
          onResultsUpdate={setResults}
        />

        {/* Quick Tips */}
        <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <h3 className="font-bold text-green-900 mb-2">💡 Tips Pencarian</h3>
          <ul className="text-green-800 text-sm space-y-1">
            <li>✓ Semua spesies ditampilkan saat halaman dibuka</li>
            <li>✓ Ketik nama spesies untuk filter real-time</li>
            <li>✓ Pilih kategori untuk hasil yang lebih spesifik</li>
            <li>✓ Kombinasikan search dan kategori untuk hasil tepat</li>
            <li>✓ Klik "Bersihkan" untuk melihat semua spesies kembali</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
