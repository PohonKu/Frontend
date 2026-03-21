'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home, LayoutDashboard, Trees, Leaf, LogOut, Menu, X, ChevronLeft,
} from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
}

const NAV_ITEMS = [
  { href: '/dashboard/dashboard',       icon: LayoutDashboard, label: 'Dashboard'      },
  { href: '/dashboard/treeUpdate',    icon: Leaf,            label: 'Update Pohon'   },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,              setUser]              = useState<UserData | null>(null);
  const [authLoading,       setAuthLoading]       = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false);

  // Auth check — sekali di layout, tidak perlu diulang di tiap page
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

        const me: UserData = (await res.json()).data;
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

  if (authLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-2 border-gray-200 border-t-[#1E562A] rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Memuat dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className={`
        bg-[#1E562A] text-white flex flex-col flex-shrink-0 z-40 shadow-xl border-r border-[#153f1e]
        transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0
        md:relative md:translate-x-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-16' : 'md:w-72'}
        w-72
      `}>

        {/* Logo */}
        <div className={`p-4 border-b border-white/10 flex items-center gap-2 min-h-[80px]
          ${sidebarCollapsed ? 'md:justify-center md:px-2' : 'justify-between'}`}>
          <div className={`bg-white rounded-lg flex justify-center items-center transition-all duration-300 cursor-pointer
            ${sidebarCollapsed ? 'md:w-10 md:h-10 md:p-1 flex-1 py-3 px-4' : 'flex-1 py-3 px-4'}`}
            onClick={() => router.push('/')}>
            <Image
              src="/images/Logo.svg"
              alt="PohonKu"
              width={sidebarCollapsed ? 28 : 110}
              height={sidebarCollapsed ? 28 : 40}
              className="object-contain transition-all duration-300"
            />
          </div>

          {/* Desktop collapse */}
          <button
            onClick={() => setSidebarCollapsed(p => !p)}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors shrink-0 hidden md:flex"
            title={sidebarCollapsed ? 'Perluas' : 'Perkecil'}
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

        {/* User greeting */}
        {!sidebarCollapsed && user && (
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Selamat datang,</p>
            <p className="text-white font-bold text-sm mt-0.5 truncate">{user.fullName}</p>
            <p className="text-white/40 text-[11px] truncate">{user.email}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Home — selalu ke landing page */}
          <Link
            href="/"
            title={sidebarCollapsed ? 'Home' : ''}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-white/60 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent
              ${sidebarCollapsed ? 'md:justify-center md:px-2' : ''}`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className={`text-sm font-semibold tracking-wide ${sidebarCollapsed ? 'md:hidden' : ''}`}>Home</span>
          </Link>

          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active =
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                title={sidebarCollapsed ? label : ''}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
                  ${active
                    ? 'bg-white/10 text-white font-semibold border-l-[3px] border-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'
                  }
                  ${sidebarCollapsed ? 'md:justify-center md:px-2' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={`text-sm font-semibold tracking-wide ${sidebarCollapsed ? 'md:hidden' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Keluar' : ''}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 bg-white border border-red-100 transition-all font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 group
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

      {/* ── CONTENT ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-4 h-4 text-gray-600" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 truncate">
              {NAV_ITEMS.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label || 'Dashboard'}
            </p>
            {user && <p className="text-[10px] text-gray-400 truncate">{user.fullName}</p>}
          </div>
          <Image src="/images/Logo.svg" alt="PohonKu" width={60} height={24} className="object-contain shrink-0" />
        </div>

        {/* Page content — user disini, dikasih user via context nanti bisa pakai prop */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}