'use client';

import React from 'react';
import LiveSearchSpecies from '@/components/fetching/LiveSearchSpecies';

/**
 * Demo page untuk testing search API
 * Live search - tampilkan semua species awalnya dan filter real-time
 */
export default function SearchDemoPage() {
  const [selectedSpecies, setSelectedSpecies] = React.useState<any[]>([]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Demo Search Species API</h1>
          <p className="text-green-100">
            Fitur pencarian real-time - lihat semua species & filter instant
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Search Component */}
        <LiveSearchSpecies
          onResultsUpdate={setSelectedSpecies}
        />

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">✨ Fitur Live Search</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Semua species ditampilkan secara otomatis saat halaman dimuat</li>
            <li>• Ketik nama species untuk filter real-time (tidak perlu klik tombol)</li>
            <li>• Pilih kategori untuk filter berdasarkan kategori</li>
            <li>• Kombinasikan search dan kategori untuk hasil yang lebih spesifik</li>
            <li>• Hasil diupdate secara instant saat Anda mengetik atau memilih kategori</li>
            <li>• Klik "Bersihkan" untuk menghapus semua filter</li>
          </ul>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4">📖 API yang Digunakan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-gray-300">
              <h4 className="font-semibold mb-2">📍 Load Awal</h4>
              <code className="text-xs bg-gray-50 p-2 block">
                GET /api/v1/trees/species
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Memuat semua species saat halaman dibuka
              </p>
            </div>

            <div className="bg-white p-4 rounded border border-gray-300">
              <h4 className="font-semibold mb-2">🔍 Filter Real-time</h4>
              <p className="text-xs text-gray-600 mt-2">
                Filter dilakukan di client-side (tidak perlu API call)
              </p>
            </div>
          </div>
        </div>

        {/* Technology Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-gray-900 mb-3">💡 Keuntungan Live Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-green-600 mb-1">⚡ Cepat</p>
              <p>Hasil update instant tanpa delay</p>
            </div>
            <div>
              <p className="font-semibold text-blue-600 mb-1">📱 Offline Ready</p>
              <p>Tetap berfungsi bahkan tanpa koneksi</p>
            </div>
            <div>
              <p className="font-semibold text-purple-600 mb-1">🎯 Akurat</p>
              <p>Filter presisi dengan kata kunci</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
