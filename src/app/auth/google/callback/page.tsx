'use client';
import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { session } from '@/features/adopter/data';
import { safeReturn } from '@/features/adopter/model';
function Callback() {
  const params = useSearchParams(), router = useRouter();
  const handled = useRef(false);
  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const access = params.get('accessToken'), refresh = params.get('refreshToken');
    const stored = localStorage.getItem('post_login_redirect');
    const locale = stored?.startsWith('/en/') ? 'en' : 'id';
    window.history.replaceState({}, '', '/auth/google/callback');
    if (params.get('success') === 'true' && access && refresh) {
      session.save(access, refresh); localStorage.removeItem('post_login_redirect');
      router.replace(safeReturn(stored, locale));
    } else router.replace(`/${locale}/login?error=google_failed`);
  }, [params, router]);
  return <p role="status" className="p-12">Memproses / Signing in…</p>;
}
export default function Page() { return <Suspense><Callback /></Suspense>; }
