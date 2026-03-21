'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LogOut, Trees, LayoutDashboard, Settings, Menu, X,
  ChevronLeft, Leaf, ShoppingBag, Sprout, Users,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/admin/updateTree',     icon: Trees,           label: 'Update Pohon'   },
  { href: '/admin/addSpecies',   icon: Sprout,          label: 'Kelola Species' },
  { href: '/admin/daftarCustomer',    icon: Users,           label: 'List Pembeli'   },
  { href: '/admin/riwayatOrder',    icon: ShoppingBag,     label: 'Riwayat Order'  },
  { href: '/admin/daftarrAdopsi', icon: Leaf,            label: 'Data Adopsi'    },
];

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,              setUser]              = useState<AdminUser | null>(null);
  const [authLoading,       setAuthLoading]       = useState(true);
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Auth check — dilakukan sekali di layout, tidak perlu diulang di tiap page ──
  useEffect(() => {
    const check = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { router.push('/login?redirect=' + pathname); return; }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res    = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }

        const me: AdminUser = (await res.json()).data;

        if (me.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }

        setUser(me);
      } catch {
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };
    check();
  }, []);

  // Tutup mobile sidebar saat navigasi
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  // Loading state saat cek auth
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-gray-200 border-t-[#1E562A] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className={`
        bg-[#1E562A] text-white flex flex-col flex-shrink-0 z-40 shadow-xl
        transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0
        md:relative md:translate-x-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'}
        w-64
      `}>

        {/* Logo row */}
        <div className={`p-3 border-b border-white/10 flex items-center gap-2 min-h-[64px]
          ${sidebarCollapsed ? 'md:justify-center md:px-2' : 'justify-between'}`}>
          <div className={`bg-white rounded-lg flex justify-center items-center transition-all duration-300
            ${sidebarCollapsed ? 'md:w-10 md:h-10 md:p-1 flex-1 py-2 px-3' : 'flex-1 py-2 px-3'}`}>
            <Image
              src="/images/Logo.svg"
              alt="PohonKu"
              width={sidebarCollapsed ? 28 : 90}
              height={sidebarCollapsed ? 28 : 32}
              className="object-contain transition-all duration-300"
            />
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(p => !p)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors shrink-0 hidden md:flex"
            title={sidebarCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 text-white/60 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors shrink-0 md:hidden"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* User info */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Admin Panel</p>
            <p className="text-sm font-semibold text-white mt-0.5 truncate">{user?.fullName}</p>
            <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : ''}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all w-full
                  ${active
                    ? 'bg-white/10 text-white font-semibold border-l-[3px] border-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'
                  }
                  ${sidebarCollapsed ? 'md:justify-center md:px-2' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={`text-sm ${sidebarCollapsed ? 'md:hidden' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Keluar' : ''}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-red-400 hover:bg-red-50 bg-white border border-red-100 transition-all font-semibold text-sm w-full group
              ${sidebarCollapsed ? 'md:justify-center md:px-2' : ''}`}
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span className={sidebarCollapsed ? 'md:hidden' : ''}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── CONTENT AREA ── */}
      {/* Hanya bagian ini yang berubah saat navigasi */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">

        {/* Mobile top bar — hamburger + info halaman aktif */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-4 h-4 text-gray-600" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {NAV_ITEMS.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label || 'Admin'}
            </p>
            <p className="text-[10px] text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}