'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { orderApi } from '@/lib/apiPayment';
import PaymentModal from './PaymentModal';

interface Species {
  id: string;
  name: string;
  latinName: string;
  category: string;
  basePrice: number;
  mainImageUrl: string;
  description?: string;
}

interface OrderModalProps {
  species: Species;
  onClose: () => void;
}

interface OrderResponse {
  success: boolean;
  data?: {
    id: string;
    orderId: string;
  };
  message?: string;
}

export default function OrderModal({ species, onClose }: OrderModalProps) {
  const [nameOnTag, setNameOnTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameOnTag.trim()) {
      setError('Nama di tag tidak boleh kosong');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      console.log('📦 Creating order for species:', species.id);

      const response = (await orderApi.createOrder({
        speciesId: species.id,
        nameOnTag: nameOnTag.trim(),
      })) as OrderResponse;

      console.log('📡 Order creation response:', response);

      if (response.success && response.data?.id) {
        console.log('✅ Order created:', response.data.id);
        setOrderId(response.data.id);
        setShowPaymentModal(true);
      } else {
        console.error('❌ Order creation failed:', response);
        setError(response.message || 'Gagal membuat pesanan');
      }
    } catch (err) {
      console.error('❌ Error creating order:', err);
      setError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat pesanan'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-40"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="sticky top-0 flex justify-end p-4 bg-white border-b">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Species Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Adopsi {species.name}
              </h2>

              {/* Species Image */}
              <div className="relative w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {species.mainImageUrl ? (
                  <Image
                    src={species.mainImageUrl}
                    alt={species.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">Gambar tidak tersedia</span>
                  </div>
                )}
              </div>

              {/* Species Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nama Ilmiah</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {species.latinName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Kategori</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {species.category}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Harga Adopsi</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(species.basePrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Name on Tag Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Nama di Tag Pohon
                </label>
                <input
                  type="text"
                  value={nameOnTag}
                  onChange={(e) => setNameOnTag(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  disabled={isLoading}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nama ini akan ditampilkan di tag pohon yang Anda adopsi
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !nameOnTag.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Memproses...
                  </span>
                ) : (
                  '✓ Lanjut ke Pembayaran'
                )}
              </button>

              <button>

              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition disabled:bg-gray-300"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && orderId && (
        <PaymentModal orderId={orderId} onClose={handlePaymentClose} />
      )}
    </>
  );
}
