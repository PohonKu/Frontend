'use client';

import React from 'react';

interface SpeciesCardProps {
  species: {
    id: string;
    name: string;
    latinName: string;
    category: string;
    basePrice: number;
    description: string;
    mainImageUrl?: string;
    carbonAbsorptionRate?: number;
    availabelStok?: number;
  };
  onClick?: (id: string) => void;
}

/**
 * Component untuk menampilkan individual species card
 * Dapat digunakan dalam berbagai konteks (grid, list, etc)
 */
export const SpeciesCard: React.FC<SpeciesCardProps> = ({
  species,
  onClick
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick?.(species.id)}
    >
      {/* Image */}
      {species.mainImageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={species.mainImageUrl}
            alt={species.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {species.carbonAbsorptionRate && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              CO2: {species.carbonAbsorptionRate} kg/yr
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
          {species.name}
        </h3>

        {/* Latin Name */}
        <p className="text-gray-500 italic text-sm mb-3">
          {species.latinName}
        </p>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {species.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Category */}
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
            {species.category}
          </span>

          {/* Price */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Harga</p>
            <p className="text-lg font-bold text-green-600">
              Rp {species.basePrice?.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Stock Info */}
        {species.availabelStok !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Stok: <span className="font-semibold text-gray-900">{species.availabelStok}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Component untuk menampilkan custom species grid dengan search results
 */
interface CustomSpeciesGridProps {
  species: any[];
  onSpeciesClick?: (id: string) => void;
  columns?: 'auto' | 2 | 3 | 4;
}

export const CustomSpeciesGrid: React.FC<CustomSpeciesGridProps> = ({
  species,
  onSpeciesClick,
  columns = 'auto'
}) => {
  const gridClass = {
    'auto': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }[String(columns)] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {species.map((item) => (
        <SpeciesCard
          key={item.id}
          species={item}
          onClick={onSpeciesClick}
        />
      ))}
    </div>
  );
};

/**
 * Component untuk menampilkan species dalam format list
 */
interface CustomSpeciesListProps {
  species: any[];
  onSpeciesClick?: (id: string) => void;
}

export const CustomSpeciesList: React.FC<CustomSpeciesListProps> = ({
  species,
  onSpeciesClick
}) => {
  return (
    <div className="space-y-4">
      {species.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSpeciesClick?.(item.id)}
        >
          {/* Image */}
          {item.mainImageUrl && (
            <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={item.mainImageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900">
              {item.name}
            </h3>
            <p className="text-gray-600 italic text-sm mb-2">
              {item.latinName}
            </p>
            <p className="text-gray-700 mb-3">
              {item.description}
            </p>

            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {item.category}
              </span>
              <span className="text-green-600 font-bold">
                Rp {item.basePrice?.toLocaleString('id-ID')}
              </span>
              {item.availabelStok !== undefined && (
                <span className="text-gray-600 text-sm">
                  Stok: {item.availabelStok}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 flex items-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpeciesCard;
