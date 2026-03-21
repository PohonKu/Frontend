'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
    const pathname = usePathname();

    // Hide the navbar on dashboard and login routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
        return null;
    }

    return <Navbar />;
}