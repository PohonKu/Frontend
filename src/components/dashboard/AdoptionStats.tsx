import React from 'react';

interface StatsProps {
  stats: {
    totalAdoptions: number;
    totalTreesPlanted: number;
    totalCarbonAbsorbed: number;
    lastMonthAdoptions: number;
  };
}

export default function AdoptionStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Adopsi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Adopsi</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalAdoptions}</p>
            <p className="text-xs text-gray-500 mt-2">pohon yang diadopsi</p>
          </div>
          <div className="text-3xl">🎋</div>
        </div>
      </div>

      {/* Pohon Ditanam */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Pohon Ditanam</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTreesPlanted}</p>
            <p className="text-xs text-gray-500 mt-2">di lapangan</p>
          </div>
          <div className="text-3xl">🌳</div>
        </div>
      </div>

      {/* Karbon Terserap */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Karbon Terserap</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalCarbonAbsorbed}
            </p>
            <p className="text-xs text-gray-500 mt-2">ton per tahun</p>
          </div>
          <div className="text-3xl">♻️</div>
        </div>
      </div>

      {/* Adopsi Bulan Ini */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Bulan Ini</p>
            <p className="text-3xl font-bold text-gray-900">{stats.lastMonthAdoptions}</p>
            <p className="text-xs text-gray-500 mt-2">adopsi baru</p>
          </div>
          <div className="text-3xl">📈</div>
        </div>
      </div>
    </div>
  );
}
