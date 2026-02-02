'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface TreeSpeciesCard {
  id: string;
  localName: string;
  scientificName: string;
  cluster: string;
  image: string;
  price: number;
  stock: number;
  description?: string;
}

interface TreeCardProps {
  species: TreeSpeciesCard;
  onAdopt?: (speciesId: string) => void;
  onClick?: () => void;
}

export default function TreeCard({ species, onAdopt, onClick }: TreeCardProps) {
  const isAvailable = species.stock > 0;
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  // Format price to IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-out border border-gray-100 hover:bg-[#CEFFD1] cursor-pointer"
    >
      {/* Image Container - 4:3 Aspect Ratio */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={species.image}
          alt={species.localName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {isAvailable ? (
            <div className="bg-[#1A581E]/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-xs font-semibold text-white">Available</span>
            </div>
          ) : (
            <div className="bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-xs font-semibold text-white">Sold Out</span>
            </div>
          )}
        </div>

        {/* Cluster Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-xs font-medium text-[#1A581E]">
            {species.cluster}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Local Name - Serif, Bold */}
        <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">
          {species.localName}
        </h3>

        {/* Scientific Name - Italic, Gray */}
        <p className="text-sm text-gray-500 italic mb-3">
          {species.scientificName}
        </p>

        {/* Price - Highlighted */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-lg font-bold text-[#1A581E]">
              {formatPrice(species.price)}
            </p>
          </div>

          {/* Stock Count */}
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Available</p>
            <p className="text-lg font-bold text-gray-900">
              {species.stock} <span className="text-sm font-normal">trees</span>
            </p>
          </div>
        </div>

        {/* Action Button - Full Width with Hover Text Change */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onAdopt?.(species.id);
          }}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
          disabled={!isAvailable}
          className={`
            w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-out
            transform active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              isAvailable
                ? 'bg-[#1A581E] hover:bg-[#124416] text-white focus:ring-[#1A581E]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isAvailable ? (isHoveringButton ? 'View More' : 'Adopt Tree') : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}
