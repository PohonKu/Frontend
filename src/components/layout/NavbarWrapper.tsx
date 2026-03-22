'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
    const pathname = usePathname();

    const hiddenRoutes = ['/dashboard', '/login', '/admin', '/cust', '/riwayatOrder', '/adopsi', '/addSpecies'];

    // Hide the navbar on specific routes
    if (hiddenRoutes.some(route => pathname.startsWith(route))) {
        return null;
    }

    return <Navbar />;
}