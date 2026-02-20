// src/app/auth/google/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (success === 'true' && accessToken && refreshToken) {
      // Simpan token ke localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      console.log('✅ Login Google berhasil!');

      // Redirect ke halaman utama
      router.push('/');
    } else {
      console.error('❌ Login Google gagal:', error);

      // ✅ FIX: Syntax error diperbaiki
      router.push(`/login?error=${error || 'google_failed'}`);
    }
  }, [searchParams, router]);

  // Tampilan loading saat proses
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
        <p className="text-gray-600">Memproses login Google...</p>
      </div>
    </div>
  );
}