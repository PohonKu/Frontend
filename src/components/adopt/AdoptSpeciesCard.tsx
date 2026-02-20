'use client';

import React from 'react';
import Image from 'next/image';

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

interface AdoptSpeciesCardProps {
  species: Species;
  onAdoptClick: () => void;
}

export default function AdoptSpeciesCard({
  species,
  onAdoptClick,
}: AdoptSpeciesCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-200">
        {species.mainImageUrl ? (
          <Image
            src={species.mainImageUrl}
            alt={species.name}
            fill
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">Gambar tidak tersedia</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            {species.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-1">{species.name}</h3>

        {/* Latin Name */}
        <p className="text-sm text-gray-500 italic mb-3">{species.latinName}</p>

        {/* Description */}
        {species.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {species.description}
          </p>
        )}

        {/* Carbon Absorption Info */}
        {species.carbonAbsorptionRate && (
          <div className="mb-4 flex items-center text-sm text-blue-600">
            <span className="mr-2">🌍</span>
            <span>Serapan CO₂: {species.carbonAbsorptionRate} kg/tahun</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price and Button Section */}
        <div className="border-t pt-4 mt-4">
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-1">Harga Adopsi</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(species.basePrice)}
            </p>
          </div>

          {/* Adopt Button */}
          <button
            onClick={onAdoptClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            🌱 Adopsi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
