'use client';

import React from 'react';
import { X, MapPin, Download, Leaf } from 'lucide-react';

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

const getStatusStyle = (status: string) => {
  const map: Record<string, string> = {
    PAID: 'bg-[#1E562A]/10 text-[#1E562A] border-[#1E562A]/20',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    SOLD: 'bg-[#1E562A]/10 text-[#1E562A] border-[#1E562A]/20',
    AVAILABLE: 'bg-blue-50 text-blue-700 border-blue-200',
    RESERVED: 'bg-orange-50 text-orange-700 border-orange-200',
    ABANDONED: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export default function AdoptionDetailModal({
  adoption,
  onClose,
}: AdoptionDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          <img
            src={adoption.species.mainImageUrl}
            alt={adoption.species.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://placehold.co/500x300?text=Pohon';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-md hover:bg-white transition-colors z-10 shadow-sm border border-gray-200"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>

          <div className="absolute bottom-5 left-6">
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide mb-1">
              {adoption.species.name}
            </h1>
            <p className="text-white/80 italic text-sm font-serif">{adoption.species.latinName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">

          {/* Informasi Adopsi */}
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
              Informasi Adopsi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Nama Tag</p>
                <p className="text-sm font-bold text-gray-900">{adoption.nameOnTag}</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">No. Adopsi</p>
                <p className="text-sm font-bold text-gray-900">{adoption.order.orderNumber}</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Tanggal</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(adoption.adoptedAt).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusStyle(adoption.order.paymentStatus)}`}>
                  {adoption.order.paymentStatus}
                </span>
              </div>
            </div>
          </section>

          {/* Data Pohon */}
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
              Data Pohon
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Nomor Seri</p>
                <p className="text-sm font-bold text-gray-900">{adoption.tree.serialNumber}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${getStatusStyle(adoption.tree.status)}`}>
                  {adoption.tree.status}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Kategori</p>
                <p className="text-sm font-bold text-gray-900">{adoption.species.category}</p>
              </div>
            </div>
            {adoption.tree.latitude && adoption.tree.longitude && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Lokasi Koordinat</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {adoption.tree.latitude}, {adoption.tree.longitude}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Tentang Spesies */}
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
              Tentang Spesies
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-sm">
              {adoption.species.description}
            </p>
            {adoption.species.storyContent && (
              <div className="bg-[#1E562A]/5 border-l-4 border-[#1E562A]/30 p-4 rounded-r mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider">Cerita Menarik</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {adoption.species.storyContent}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="p-3 bg-[#1E562A]/5 rounded-lg border border-[#1E562A]/10">
                <p className="text-[10px] text-[#1E562A]/70 font-semibold uppercase tracking-wider mb-1">Karbon/Tahun</p>
                <p className="text-sm font-bold text-gray-900">
                  {adoption.species.carbonAbsorptionRate} ton
                </p>
              </div>
              <div className="p-3 bg-[#1E562A]/5 rounded-lg border border-[#1E562A]/10">
                <p className="text-[10px] text-[#1E562A]/70 font-semibold uppercase tracking-wider mb-1">Harga</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(adoption.species.basePrice)}
                </p>
              </div>
              <div className="p-3 bg-[#1E562A]/5 rounded-lg border border-[#1E562A]/10">
                <p className="text-[10px] text-[#1E562A]/70 font-semibold uppercase tracking-wider mb-1">Stok Tersedia</p>
                <p className="text-sm font-bold text-gray-900">
                  {adoption.species.availabelStok}
                </p>
              </div>
              <div className="p-3 bg-[#1E562A]/5 rounded-lg border border-[#1E562A]/10">
                <p className="text-[10px] text-[#1E562A]/70 font-semibold uppercase tracking-wider mb-1">Tereservasi</p>
                <p className="text-sm font-bold text-gray-900">
                  {adoption.species.reservedStok}
                </p>
              </div>
            </div>
          </section>

          {/* Detail Pesanan */}
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
              Detail Pesanan
            </h2>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Nomor Pesanan</span>
                <span className="font-semibold text-gray-900">{adoption.order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Metode</span>
                <span className="font-semibold text-gray-900">{adoption.order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Tanggal</span>
                <span className="font-semibold text-gray-900">{formatDate(adoption.order.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-2.5 font-semibold">
                <span className="text-gray-700">Total Harga</span>
                <span className="text-lg text-gray-900">{formatCurrency(adoption.order.totalAmount)}</span>
              </div>
            </div>
          </section>

          {/* Pemilik */}
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
              Pemilik
            </h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="w-11 h-11 rounded-full bg-[#1E562A] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 font-serif">
                {adoption.owner.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{adoption.owner.fullName}</p>
                <p className="text-sm text-gray-500">{adoption.owner.email}</p>
              </div>
            </div>
          </section>

          {/* Sertifikat */}
          {adoption.certificateUrl && (
            <section className="mb-4">
              <a
                href={adoption.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E562A] hover:bg-[#153f1e] text-white font-semibold rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Unduh Sertifikat
              </a>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex gap-3 justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold rounded-lg transition-colors text-sm"
          >
            Tutup
          </button>
          {adoption.certificateUrl && (
            <a
              href={adoption.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-[#1E562A] hover:bg-[#153f1e] text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Unduh Sertifikat
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
