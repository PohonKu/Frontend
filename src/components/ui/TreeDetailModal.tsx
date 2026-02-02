'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { TreeSpeciesCard } from './TreeCard';

interface TreeDetailModalProps {
  species: TreeSpeciesCard;
  onClose: () => void;
  onAdopt?: (speciesId: string) => void;
}

type TabType = 'deskripsi' | 'cerita';

export default function TreeDetailModal({ species, onClose, onAdopt }: TreeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('deskripsi');

  const isAvailable = species.stock > 0;

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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-700" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Banner Image */}
          <div className="relative h-72 bg-gray-100">
            <Image
              src={species.image}
              alt={species.localName}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Modal Body */}
          <div className="p-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Key Info */}
              <div className="space-y-6">
                {/* Title & Scientific Name */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif leading-tight">
                    {species.localName}
                  </h2>
                  <p className="text-lg text-gray-500 italic">
                    {species.scientificName}
                  </p>
                </div>

                {/* Price & Stock */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price per Tree</p>
                      <p className="text-3xl font-bold text-[#1A581E]">
                        {formatPrice(species.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Available Stock</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {species.stock}
                      </p>
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="pt-4 border-t border-green-200">
                    {isAvailable ? (
                      <div className="flex items-center gap-2 text-[#1A581E]">
                        <div className="w-3 h-3 bg-[#1A581E] rounded-full animate-pulse" />
                        <span className="font-semibold">Ready for Adoption</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        <span className="font-semibold">Currently Out of Stock</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onAdopt?.(species.id)}
                  disabled={!isAvailable}
                  className={`
                    w-full font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200
                    transform active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2
                    ${
                      isAvailable
                        ? 'bg-[#1A581E] hover:bg-[#124416] text-white focus:ring-[#1A581E]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isAvailable ? 'Adopt This Tree Now' : 'Sold Out'}
                </button>
              </div>

              {/* Right Column - Rich Details */}
              <div className="space-y-6">
                {/* Tab Switcher */}
                <div className="flex gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('deskripsi')}
                    className={`
                      px-6 py-3 font-semibold text-sm transition-all relative
                      ${activeTab === 'deskripsi'
                        ? 'text-[#1A581E]'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    Deskripsi
                    {activeTab === 'deskripsi' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A581E] rounded-t-full" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('cerita')}
                    className={`
                      px-6 py-3 font-semibold text-sm transition-all relative
                      ${activeTab === 'cerita'
                        ? 'text-[#1A581E]'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    Cerita & Filosofi
                    {activeTab === 'cerita' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A581E] rounded-t-full" />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {activeTab === 'deskripsi' ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">{species.description}</p>
                    </div>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: 'Coming soon: Cerita & filosofi akan ditambahkan...' }}
                    />
                  )}
                </div>

                {/* Fun Fact Box */}
                {species.description && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg
                          className="w-6 h-6 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 011 4 2 2 0 011.414 1.414l.293.293a1 1 0 001.414 0l3-3a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-.293.293zM7 2a1 1 0 00-1 1v2a1 1 0 002 0V4a1 1 0 002-2V3a1 1 0 00-1-1zm0 5a1 1 0 00-1 1v2a1 1 0 002 0V9a1 1 0 002-2V8a1 1 0 00-1-1zm3 5a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1zm3-5a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1zm-6 8a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-yellow-800 mb-1">
                          Fun Fact
                        </p>
                        <p className="text-sm text-yellow-700 leading-relaxed">
                          Tanaman ini memiliki keunikan khusus dan memainkan peran penting dalam ekosistem lokal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
