'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/home/Footer';

export function FooterWrapper() {
  const pathname = usePathname();

  const hiddenRoutes = ['/dashboard', '/login', '/admin', '/cust', '/riwayatOrder', '/adopsi', '/addSpecies'];

  const shouldHide = hiddenRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (shouldHide) {
    return null;
  }

  return <Footer />;
}