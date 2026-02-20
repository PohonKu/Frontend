'use client';

import React from 'react';

interface DetailAdoption {
  adoptionId: string;
  adoptedAt: string;
  nameOnTag: string;
  certificateUrl: string | null;
  species: {
    id: string;
    name: string;
    latinName: string;
    storyContent: string;
    mainImageUrl: string;
    basePrice: string;
    carbonAbsorptionRate: number;
    createdAt: string;
    updatedAt: string;
    description: string;
    availabelStok: number;
    reservedStok: number;
    category: string;
  };
  tree: {
    id: string;
    speciesId: string;
    serialNumber: string;
    latitude: string | null;
    longitude: string | null;
    status: string;
    plantedAt: string | null;
    createdAt: string;
    updatedAt: string;
    treeUpdates: any[];
    updates: any[];
  };
  order: {
    id: string;
    userId: string;
    orderNumber: string;
    totalAmount: string;
    paymentStatus: string;
    paymentMethod: string;
    snapToken: string;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
  };
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface AdoptionDetailModalProps {
  adoption: DetailAdoption;
  onClose: () => void;
}

const formatCurrency = (amount: string): string => {
  const numAmount = parseInt(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numAmount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdoptionDetailModal({
  adoption,
  onClose,
}: AdoptionDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          ✕
        </button>

        {/* Header Image */}
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img
            src={adoption.species.mainImageUrl}
            alt={adoption.species.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/500x300?text=Pohon';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold text-white mb-1">
              {adoption.species.name}
            </h1>
            <p className="text-white/90 italic">{adoption.species.latinName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Adopsi Info */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Informasi Adopsi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Nama Tag</p>
                <p className="text-sm font-bold text-gray-900">{adoption.nameOnTag}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">No. Adopsi</p>
                <p className="text-sm font-bold text-gray-900">{adoption.order.orderNumber}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Tanggal</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(adoption.adoptedAt).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Status</p>
                <p className={`text-xs font-bold px-2 py-1 rounded ${adoption.order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {adoption.order.paymentStatus}
                </p>
              </div>
            </div>
          </section>

          {/* Pohon Info */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Data Pohon
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Nomor Seri</p>
                <p className="text-sm font-bold text-blue-900">{adoption.tree.serialNumber}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Status</p>
                <p className="text-sm font-bold text-blue-900">{adoption.tree.status}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Kategori</p>
                <p className="text-sm font-bold text-blue-900">{adoption.species.category}</p>
              </div>
            </div>
            {adoption.tree.latitude && adoption.tree.longitude && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-700 font-semibold mb-1">📍 Lokasi</p>
                <p className="text-sm text-orange-900">
                  {adoption.tree.latitude}, {adoption.tree.longitude}
                </p>
              </div>
            )}
          </section>

          {/* Spesies Info */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Tentang Spesies
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {adoption.species.description}
            </p>
            {adoption.species.storyContent && (
              <div className="bg-purple-50 border-l-4 border-purple-300 p-4 rounded mb-4">
                <h3 className="font-semibold text-purple-900 mb-2">Cerita Menarik</h3>
                <p className="text-sm text-purple-800 leading-relaxed">
                  {adoption.species.storyContent}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">Karbon/Tahun</p>
                <p className="text-sm font-bold text-green-900">
                  {adoption.species.carbonAbsorptionRate} ton
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">Harga</p>
                <p className="text-sm font-bold text-green-900">
                  {formatCurrency(adoption.species.basePrice)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">Stok</p>
                <p className="text-sm font-bold text-green-900">
                  {adoption.species.availabelStok}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-700 font-semibold mb-1">Tereservasi</p>
                <p className="text-sm font-bold text-green-900">
                  {adoption.species.reservedStok}
                </p>
              </div>
            </div>
          </section>

          {/* Pesanan */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Detail Pesanan
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">Nomor Pesanan</span>
                <span className="font-semibold text-green-900">
                  {adoption.order.orderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-green-200 pt-2">
                <span className="text-green-700 font-semibold">Total Harga</span>
                <span className="font-bold text-lg text-green-900">
                  {formatCurrency(adoption.order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">Metode</span>
                <span className="font-semibold text-green-900">
                  {adoption.order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">Tanggal</span>
                <span className="font-semibold text-green-900">
                  {formatDate(adoption.order.createdAt)}
                </span>
              </div>
            </div>
          </section>

          {/* Pemilik */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Pemilik
            </h2>
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {adoption.owner.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {adoption.owner.fullName}
                </p>
                <p className="text-sm text-gray-600">{adoption.owner.email}</p>
              </div>
            </div>
          </section>

          {/* Sertifikat */}
          {adoption.certificateUrl && (
            <section className="mb-8">
              <a
                href={adoption.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                📄 Unduh Sertifikat
              </a>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex gap-3 justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold rounded-lg transition-colors"
          >
            Tutup
          </button>
          {adoption.certificateUrl && (
            <a
              href={adoption.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Unduh Sertifikat
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
