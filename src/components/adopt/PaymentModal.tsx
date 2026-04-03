'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderApi } from '@/lib/apiPayment';

interface PaymentModalProps {
  orderId: string;
  onClose: () => void;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    snapToken: string;
    transactionId: string;
  };
  message?: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void;
      embed: (token: string, elementId: string, options: any) => void;
      show: () => void;
      hide: () => void;
      isRunning: () => boolean;
    };
  }
}

export default function PaymentModal({ orderId, onClose }: PaymentModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [snapLoaded, setSnapLoaded] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap script
    const loadMidtransScript = () => {
      if (window.snap) {
        console.log('✅ Midtrans Snap sudah loaded');
        setSnapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.async = true;
      script.setAttribute(
        'data-client-key',
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
      );

      script.onload = () => {
        console.log('✅ Midtrans Snap script loaded successfully');
        setSnapLoaded(true);
      };

      script.onerror = () => {
        console.error('❌ Failed to load Midtrans script');
        setError('Gagal memuat payment . Silakan refresh halaman dan coba lagi.');
        setSnapLoaded(false);
      };

      document.body.appendChild(script);
    };

    loadMidtransScript();
  }, []);

  useEffect(() => {
    if (!snapLoaded) {
      console.log('⏳ Waiting for Midtrans Snap to load...');
      return;
    }

    // Get payment token dari backend
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        setError('');

        console.log('🔄 Getting payment token for order:', orderId);

        const response = (await orderApi.createPayment(
          orderId
        )) as PaymentResponse;

        console.log('📡 API Response:', response);

        if (response.success && response.data?.snapToken) {
          console.log('✅ Snap token received, triggering payment...');
          // Trigger Midtrans Snap popup
          triggerPayment(response.data.snapToken);
        } else {
          console.error('❌ Invalid response:', response);
          setError(response.message || 'Gagal mendapatkan token pembayaran. Silakan coba lagi.');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('❌ Error initializing payment:', err);
        setError(
          err instanceof Error ? err.message : 'Terjadi kesalahan saat menginisialisasi pembayaran'
        );
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [snapLoaded, orderId]);

  const triggerPayment = (snapToken: string) => {
    if (!window.snap) {
      console.error('❌ window.snap is not available');
      setError('Payment gateway tidak tersedia. Silakan refresh halaman.');
      setIsLoading(false);
      return;
    }

    console.log('🔐 Triggering Midtrans Snap payment');

    window.snap.pay(snapToken, {
      onSuccess: (result: any) => {
        console.log('✅ Pembayaran berhasil!', result);
        // Redirect ke dashboard atau halaman sukses
        router.push('/dashboard');
      },
      onPending: (result: any) => {
        console.log('⏳ Menunggu pembayaran', result);
      },
      onError: (result: any) => {
        console.log('❌ Pembayaran gagal', result);
        setError('Pembayaran gagal. Silakan coba lagi.');
        setIsLoading(false);
      },
      onClose: () => {
        console.log('⚠️ Popup ditutup tanpa menyelesaikan pembayaran');
        setIsLoading(false);
        // User bisa kembali dan retry
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">💳 Pembayaran</h2>
        </div>

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#1E562A] blur-xl opacity-20 animate-pulse rounded-full"></div>
              <div className="relative bg-white shadow-lg shadow-[#1E562A]/10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#1E562A]/20">
                <svg className="w-8 h-8 text-[#1E562A] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {/* Spinning outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1E562A] animate-spin"></div>
              </div>
            </div>
            <p className="text-gray-900 font-semibold mb-2 font-tilt tracking-wide">Membuka Gerbang Pembayaran</p>
            <p className="text-sm text-gray-500 font-sans">Menghubungkan ke midtrans secara aman...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="space-y-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold mb-1">Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  // Retry initialization
                  const initializePayment = async () => {
                    try {
                      const response = (await orderApi.createPayment(
                        orderId
                      )) as PaymentResponse;

                      if (response.success && response.data?.snapToken) {
                        triggerPayment(response.data.snapToken);
                      } else {
                        setError(
                          response.message ||
                          'Gagal mendapatkan token pembayaran. Silakan coba lagi.'
                        );
                        setIsLoading(false);
                      }
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : 'Terjadi kesalahan saat menginisialisasi pembayaran'
                      );
                      setIsLoading(false);
                    }
                  };
                  initializePayment();
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                🔄 Coba Lagi
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
              >
                ✕ Tutup
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        {!error && isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
            <p className="font-semibold mb-2">📋 Informasi Pembayaran:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                ID Pesanan: <span className="font-mono">{orderId}</span>
              </li>
              <li>Metode: Midtrans (Sandbox)</li>
              <li>Popup akan muncul otomatis setelah siap</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
