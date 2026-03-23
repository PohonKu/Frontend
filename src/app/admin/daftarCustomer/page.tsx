'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search, Users, Mail, Phone, ShieldCheck,
  Chrome, UserCircle, Calendar, RefreshCw, Filter, X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Buyer {
  id: string; email: string; fullName: string;
  phone: string | null; role: string;
  isVerifiedEmail: boolean; avatarUrl: string | null;
  authProvider: string | null; googleId: string | null;
  createdAt: string; updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const PROVIDER_COLORS: Record<string, string> = {
  GOOGLE: 'bg-blue-50 text-blue-700 border-blue-100',
  LOCAL:  'bg-gray-100 text-gray-600 border-gray-200',
};

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-violet-100 text-violet-700',
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ buyer }: { buyer: Buyer }) => {
  const color = AVATAR_COLORS[buyer.fullName.charCodeAt(0) % AVATAR_COLORS.length];
  if (buyer.avatarUrl) return (
    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shrink-0 relative">
      <Image src={buyer.avatarUrl} alt={buyer.fullName} fill className="object-cover"
        onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
    </div>
  );
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${color}`}>
      {getInitials(buyer.fullName)}
    </div>
  );
};

// ─── Buyer Row (desktop) ──────────────────────────────────────────────────────

const BuyerRow = ({ buyer }: { buyer: Buyer }) => (
  <tr className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-3">
        <Avatar buyer={buyer} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{buyer.fullName}</p>
          <p className="text-[11px] text-gray-400 font-mono truncate">{buyer.id.slice(0, 16)}…</p>
        </div>
      </div>
    </td>
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-1.5">
        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-sm text-gray-600 truncate max-w-[200px]">{buyer.email}</span>
        {buyer.isVerifiedEmail && <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />}
      </div>
    </td>
    <td className="px-5 py-3.5">
      {buyer.phone
        ? <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /><span className="text-sm text-gray-600">{buyer.phone}</span></div>
        : <span className="text-xs text-gray-300 font-medium">—</span>
      }
    </td>
    <td className="px-5 py-3.5">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border
        ${PROVIDER_COLORS[buyer.authProvider || 'LOCAL'] || PROVIDER_COLORS.LOCAL}`}>
        {buyer.authProvider === 'GOOGLE' ? <Chrome className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
        {buyer.authProvider || 'Local'}
      </span>
    </td>
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-500">{formatDate(buyer.createdAt)}</span>
      </div>
    </td>
  </tr>
);

// ─── Buyer Card (mobile) ──────────────────────────────────────────────────────

const BuyerCard = ({ buyer }: { buyer: Buyer }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
    <Avatar buyer={buyer} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-semibold text-gray-900 truncate">{buyer.fullName}</p>
        {buyer.isVerifiedEmail && <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />}
      </div>
      <p className="text-xs text-gray-500 truncate mt-0.5">{buyer.email}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border
          ${PROVIDER_COLORS[buyer.authProvider || 'LOCAL'] || PROVIDER_COLORS.LOCAL}`}>
          {buyer.authProvider === 'GOOGLE' ? <Chrome className="w-2.5 h-2.5" /> : <UserCircle className="w-2.5 h-2.5" />}
          {buyer.authProvider || 'Local'}
        </span>
        <span className="text-[10px] text-gray-400">{formatDate(buyer.createdAt)}</span>
        {buyer.phone && <span className="text-[10px] text-gray-500">{buyer.phone}</span>}
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBuyersPage() {
  const [buyers,         setBuyers]         = useState<Buyer[]>([]);
  const [buyersLoading,  setBuyersLoading]  = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [filterProvider, setFilterProvider] = useState('ALL');

  useEffect(() => { fetchBuyers(); }, []);

  const fetchBuyers = async () => {
    const token  = localStorage.getItem('access_token') || '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    setBuyersLoading(true);
    try {
      const res  = await fetch(`${apiUrl}/api/v1/users/admin/buyers`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      const list = json?.data ?? json ?? [];
      setBuyers(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setBuyersLoading(false); }
  };

  const filtered = buyers.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      (b.phone || '').includes(q);
    return matchSearch && (filterProvider === 'ALL' || b.authProvider === filterProvider);
  });

  const providers = ['ALL', ...Array.from(new Set(buyers.map(b => b.authProvider || 'LOCAL')))];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
            <Users className="w-5 h-5 text-[#1E562A] shrink-0" /> List Pembeli
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">Seluruh pengguna yang telah mendaftar sebagai pembeli</p>
        </div>
        <button onClick={fetchBuyers}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 shrink-0">
          <RefreshCw className={`w-4 h-4 ${buyersLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Pembeli',     value: buyers.length,                                       cls: 'text-gray-900' },
            { label: 'Email Terverifikasi',value: buyers.filter(b => b.isVerifiedEmail).length,       cls: 'text-green-600' },
            { label: 'Login via Google',  value: buyers.filter(b => b.authProvider === 'GOOGLE').length, cls: 'text-blue-600' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-2xl font-bold ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Cari nama, email, atau nomor HP..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-gray-900 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {providers.map(p => (
              <button key={p} onClick={() => setFilterProvider(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                  ${filterProvider === p ? 'bg-[#1E562A] text-white border-[#1E562A]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {p === 'ALL' ? 'Semua' : p}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari {buyers.length} pembeli
          </p>
        </div>

        {/* List */}
        {buyersLoading ? (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">Tidak ada pembeli ditemukan</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {['Pembeli', 'Email', 'No. HP', 'Provider', 'Bergabung'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{filtered.map(b => <BuyerRow key={b.id} buyer={b} />)}</tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {filtered.map(b => <BuyerCard key={b.id} buyer={b} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}