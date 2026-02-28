'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { TreeSpeciesCard } from './TreeCard';
import styles from './TreeDetailModal.module.css';

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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className={`${styles.modalContent} bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Positioned closer to content, more accessible */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={onClose}
            className={`${styles.closeButton} bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 hover:border-[#1A581E] w-12 h-12 sm:w-11 sm:h-11`}
            aria-label="Close modal"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* Scrollable Content with Custom Scrollbar */}
        <div className={`${styles.modalScroll} overflow-y-auto max-h-[92vh]`}>
          {/* Banner Image with Enhanced Design */}
          <div className={`relative h-80 sm:h-96 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden`}>
            <div className={`${styles.bannerImage} absolute inset-0`}>
              <Image
                src={species.image}
                alt={species.localName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
            {/* Decorative Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#1A581E] via-[#2B2B2B] to-[#1A581E]" />
          </div>

          {/* Modal Body with Enhanced Spacing */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Key Info */}
              <div className="space-y-6">
                {/* Title & Scientific Name with Enhanced Typography */}
                <div className="space-y-2">
                  <h2 className="text-4xl sm:text-5xl font-normal text-gray-900 font-tilt leading-tight tracking-tight">
                    {species.localName}
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-500 italic font-light">
                    {species.scientificName}
                  </p>
                </div>

                {/* Enhanced Underline Tabs */}
                <div className="flex gap-6 border-b border-gray-200 mt-6">
                  <button
                    onClick={() => setActiveTab('deskripsi')}
                    className={`
                      pb-3 font-semibold text-base transition-all duration-200 font-inria
                      ${activeTab === 'deskripsi'
                        ? 'text-gray-900 border-b-2 border-[#1A581E]'
                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                      }
                    `}
                  >
                    Deskripsi
                  </button>
                  <button
                    onClick={() => setActiveTab('cerita')}
                    className={`
                      pb-3 font-semibold text-base transition-all duration-200 font-inria
                      ${activeTab === 'cerita'
                        ? 'text-gray-900 border-b-2 border-[#1A581E]'
                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                      }
                    `}
                  >
                    Cerita & Filosofi
                  </button>
                </div>

                {/* Tab Content */}
                <div className={`${styles.tabContent} min-h-[12rem] pt-6`}>
                  {activeTab === 'deskripsi' ? (
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <p className="text-gray-700 leading-relaxed">{species.description}</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                      <p className="leading-relaxed italic text-gray-500">
                        Cerita & filosofi tentang {species.localName} akan segera ditambahkan...
                      </p>
                    </div>
                  )}
                </div>

                {/* Subtle Fun Fact Box */}
                {species.description && (
                  <div className="mt-8 bg-[#F9FAFB] border-l-4 border-[#1A581E] rounded-r-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                          <svg
                            className="w-5 h-5 text-[#1A581E]"
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
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                          Fun Fact
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Tanaman ini memiliki keunikan khusus dan memainkan peran penting dalam ekosistem lokal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Action Area */}
              <div className="space-y-8">
                {/* Price & Stock Area (Clean White Background) */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg shadow-gray-100/50">
                  <div className="mb-8">
                    <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Adoption Price</p>
                    <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-none mb-4">
                      {formatPrice(species.price)}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                        Stock: {species.stock}
                      </span>
                      {isAvailable ? (
                        <div className="flex items-center gap-2 text-[#1A581E] font-medium">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A581E] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1A581E]"></span>
                          </span>
                          Ready for Adoption
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                          <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={() => onAdopt?.(species.id)}
                    disabled={!isAvailable}
                    className={`
                      w-full font-bold text-lg py-4 px-8 rounded-xl font-inria
                      transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2
                      ${isAvailable
                        ? 'bg-[#1A581E] hover:bg-[#154617] text-white shadow-lg shadow-[#1A581E]/30 focus:ring-[#1A581E]/50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isAvailable ? 'Adopt This Tree Now' : 'Sold Out'}
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
