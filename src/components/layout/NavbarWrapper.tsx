'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
    const pathname = usePathname();

    // Hide the navbar on dashboard routes
    if (pathname.startsWith('/dashboard')) {
        return null;
    }

    return <Navbar />;
}
