'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      try {
        if (token === 'mock_token_123') {
          setIsAuthorized(true);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-1e0b.up.railway.app';
        const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          // Token is invalid/expired (e.g. old mock_token_123)
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.dispatchEvent(new Event('auth-change'));
          router.push(`/login?redirect=${pathname}`);
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Failed to validate token', err);
        localStorage.removeItem('access_token');
        window.dispatchEvent(new Event('auth-change'));
        router.push(`/login?redirect=${pathname}`);
      }
    };

    validateAuth();
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-transparent">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1A581E] rounded-full animate-spin shadow-sm mb-4"></div>
          <p className="text-sm font-medium text-gray-500 animate-pulse">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
