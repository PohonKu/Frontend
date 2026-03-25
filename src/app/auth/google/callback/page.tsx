// src/app/auth/google/callback/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    console.log('Callback params:', { success, accessToken: !!accessToken, refreshToken: !!refreshToken, error });
    console.log('Full URL:', window.location.href);

    if (success === 'true' && accessToken && refreshToken) {
      // Simpan token ke localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // Dispatch event to update navbar state across the app
      window.dispatchEvent(new Event('auth-change'));

      console.log('✅ Login Google berhasil!');

      // Dispatch security event to Vercel Logs
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AUTH_SUCCESS',
          message: 'User logged in via Google successfully',
        })
      }).catch(() => {});

      const redirect = localStorage.getItem('post_login_redirect') || '/dashboard/dashboard';
      localStorage.removeItem('post_login_redirect');

      // Redirect ke halaman yang disimpan atau default
      router.push(redirect);
    } else {
      console.error('❌ Login Google gagal:', error);

      // Dispatch security event to Vercel Logs for failed auth
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SECURITY_EVENT',
          message: `Failed Google login attempt: ${error || 'unknown_error'}`,
        })
      }).catch(() => {});

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

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Memuat rute...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}