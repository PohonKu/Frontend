'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/home/Footer';

export function FooterWrapper() {
    const pathname = usePathname();

    // Hide the footer on dashboard and login routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
        return null;
    }

    return <Footer />;
}
