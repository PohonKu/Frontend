'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Leaf, Trees, RefreshCw, Search, X, ChevronDown,
  Ruler, Gauge, Wind, Calendar, Tag, CheckCircle2,
  Clock, AlertCircle, ImageOff,
} from 'lucide-react';
import { dashboardApi } from '@/lib/apiDashboard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TreeUpdateItem {
  id: string;
  photoUrl: string;
  heightCm: number;
  diameterCm: number;
  co2AbsorbedTotal: number;
  adminNotes: string | null;
  createdAt: string;
}

interface AdoptionUpdate {
  adoptionId: string;
  nameOnTag: string;
  adoptedAt: string;
  expiresAt: string;
  species: {
    id: string;
    name: string;
    latinName: string;
    mainImageUrl: string;
    category: string;
    carbonAbsorptionRate: number;
  };
  tree: {
    id: string;
    serialNumber: string;
    latitude: string | null;
    longitude: string | null;
    plantedAt: string | null;
    status: string;
    updates: TreeUpdateItem[];
    totalUpdates: number;
    hasUpdates: boolean;
  };
  order: {
    orderNumber: string;
    totalAmount: string;
    paymentStatus: string;
    createdAt: string;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const formatRupiah = (v: string | number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v));

const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

const getDaysLeft = (expiresAt: string) =>
  Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ expiresAt }: { expiresAt: string }) => {
  const expired  = isExpired(expiresAt);
  const daysLeft = getDaysLeft(expiresAt);
  if (expired) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      <X className="w-3 h-3" /> Kedaluwarsa
    </span>
  );
  if (daysLeft <= 30) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> {daysLeft} hari lagi
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 className="w-3 h-3" /> Aktif
    </span>
  );
};

// ─── Timeline Item ────────────────────────────────────────────────────────────

const TimelineItem = ({ update, isLatest }: { update: TreeUpdateItem; isLatest: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${isLatest ? 'bg-[#1E562A]' : 'bg-gray-300'}`} />
      <div className="w-px flex-1 bg-gray-200 mt-1" />
    </div>
    <div className="pb-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold ${isLatest ? 'text-[#1E562A]' : 'text-gray-500'}`}>
          {isLatest ? '✦ Update Terbaru' : 'Update Sebelumnya'}
        </span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDateShort(update.createdAt)}
        </span>
      </div>
      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100">
        <Image src={update.photoUrl} alt="Foto pohon" fill className="object-cover"
          onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <ImageOff className="w-8 h-8 text-gray-300" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { icon: Ruler, label: 'Tinggi',    value: `${update.heightCm} cm` },
          { icon: Gauge, label: 'Diameter',  value: `${update.diameterCm} cm` },
          { icon: Wind,  label: 'CO₂ Total', value: `${update.co2AbsorbedTotal} kg` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className={`rounded-xl p-3 text-center ${isLatest ? 'bg-[#1E562A]/5 border border-[#1E562A]/10' : 'bg-gray-50 border border-gray-100'}`}>
            <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${isLatest ? 'text-[#1E562A]' : 'text-gray-400'}`} />
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-bold mt-0.5 ${isLatest ? 'text-[#1E562A]' : 'text-gray-800'}`}>{value}</p>
          </div>
        ))}
      </div>
      {update.adminNotes && (
        <div className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Catatan dari Tim PohonKu</p>
          <p className="text-sm text-gray-700 leading-relaxed">{update.adminNotes}</p>
        </div>
      )}
    </div>
  </div>
);

// ─── Adoption Card ────────────────────────────────────────────────────────────

const AdoptionCard = ({ adoption }: { adoption: AdoptionUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const hasUpdates   = adoption.tree.hasUpdates;
  const latestUpdate = adoption.tree.updates[0];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-fit">
      {/* Header image */}
      <div className="relative h-44 bg-gray-100">
        <Image src={adoption.species.mainImageUrl} alt={adoption.species.name} fill
          className="object-cover" onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur text-[#1E562A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {adoption.species.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge expiresAt={adoption.expiresAt} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-base leading-tight">{adoption.species.name}</h3>
          <p className="text-white/70 text-xs italic mt-0.5">{adoption.species.latinName}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-white/80 text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded">
              {adoption.tree.serialNumber}
            </span>
            <span className="text-white/70 text-[11px] flex items-center gap-1">
              <Tag className="w-3 h-3" /> {adoption.nameOnTag}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="px-4 py-3 border-b border-gray-50 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">CO₂/tahun</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{adoption.species.carbonAbsorptionRate} kg</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Total Update</p>
          <p className={`text-sm font-bold mt-0.5 ${hasUpdates ? 'text-[#1E562A]' : 'text-gray-400'}`}>
            {adoption.tree.totalUpdates}x
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Berakhir</p>
          <p className="text-[11px] font-bold text-gray-900 mt-0.5">{formatDateShort(adoption.expiresAt)}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {!hasUpdates ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <Trees className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-sm">Belum ada update</p>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-[220px] mx-auto">
              Tim PohonKu sedang memantau pohonmu. Update akan muncul di sini.
            </p>
          </div>
        ) : (
          <>
            {latestUpdate && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Update Terbaru</p>
                  <span className="text-[10px] text-gray-400">{formatDateShort(latestUpdate.createdAt)}</span>
                </div>
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-100">
                  <Image src={latestUpdate.photoUrl} alt="Update terbaru" fill className="object-cover"
                    onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { icon: Ruler, label: 'Tinggi',    value: `${latestUpdate.heightCm} cm` },
                    { icon: Gauge, label: 'Diameter',  value: `${latestUpdate.diameterCm} cm` },
                    { icon: Wind,  label: 'CO₂ Total', value: `${latestUpdate.co2AbsorbedTotal} kg` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-[#1E562A]/5 border border-[#1E562A]/10 rounded-xl p-2.5 text-center">
                      <Icon className="w-3.5 h-3.5 text-[#1E562A] mx-auto mb-1" />
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">{label}</p>
                      <p className="text-xs font-bold text-[#1E562A] mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                {latestUpdate.adminNotes && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Catatan Tim</p>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{latestUpdate.adminNotes}</p>
                  </div>
                )}
              </div>
            )}

            {adoption.tree.updates.length > 1 && (
              <button onClick={() => setExpanded(e => !e)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#1E562A] bg-[#1E562A]/5 hover:bg-[#1E562A]/10 rounded-xl border border-[#1E562A]/10 transition-colors mt-1">
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                {expanded ? 'Sembunyikan' : `Lihat ${adoption.tree.updates.length - 1} update sebelumnya`}
              </button>
            )}

            {expanded && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Riwayat Lengkap</p>
                {adoption.tree.updates.map((update, idx) => (
                  <TimelineItem key={update.id} update={update} isLatest={idx === 0} />
                ))}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-200 shrink-0" />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 pb-2">
                    Mulai diadopsi · {formatDateShort(adoption.adoptedAt)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">No. Order</p>
          <p className="text-xs font-mono font-bold text-gray-700 mt-0.5">{adoption.order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Nilai Adopsi</p>
          <p className="text-xs font-bold text-[#1E562A] mt-0.5">{formatRupiah(adoption.order.totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TreeUpdatePage() {
  const [adoptions,       setAdoptions]       = useState<AdoptionUpdate[]>([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [filterHasUpdate, setFilterHasUpdate] = useState<'ALL' | 'HAS' | 'NONE'>('ALL');

  useEffect(() => { fetchUpdates(); }, []);

  const fetchUpdates = async () => {
    setIsLoading(true);
    try {
      const res  = await dashboardApi.getAdoptionUpdates();
      const list = res?.data ?? res ?? [];
      setAdoptions(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const filtered = adoptions.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      a.species.name.toLowerCase().includes(q) ||
      a.nameOnTag.toLowerCase().includes(q) ||
      a.tree.serialNumber.toLowerCase().includes(q) ||
      a.species.category.toLowerCase().includes(q);
    const matchFilter =
      filterHasUpdate === 'ALL'  ? true :
      filterHasUpdate === 'HAS'  ? a.tree.hasUpdates :
      !a.tree.hasUpdates;
    return matchSearch && matchFilter;
  });

  const totalWithUpdates = adoptions.filter(a => a.tree.hasUpdates).length;
  const totalCO2 = adoptions.reduce((sum, a) => sum + (a.tree.updates[0]?.co2AbsorbedTotal ?? 0), 0);

  if (isLoading) return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#1E562A] rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Memuat perkembangan pohonmu...</p>
      </div>
    </div>
  );

  return (
    // Tidak ada min-h-screen / sticky header — layout.tsx sudah handle scroll & sidebar
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* Page header */}
      <div className="mb-7 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#1E562A] rounded-lg flex items-center justify-center shadow-sm shrink-0">
              <Leaf className="w-4 h-4 text-white" />
            </span>
            Perkembangan Pohonku
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-[42px]">
            Pantau kondisi dan riwayat pertumbuhan tiap pohon yang kamu adopsi.
          </p>
        </div>
        <button onClick={fetchUpdates}
          className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 shrink-0">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        {[
          { label: 'Total Pohon',    value: adoptions.length,    cls: 'text-gray-900' },
          { label: 'Sudah Diupdate', value: totalWithUpdates,    cls: 'text-[#1E562A]' },
          { label: 'Total CO₂ (kg)', value: totalCO2.toFixed(1), cls: 'text-blue-600' },
        ].map(({ label, value, cls }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm text-center">
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-tight">{label}</p>
            <p className={`text-lg sm:text-2xl font-bold ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="space-y-3 mb-5 animate-in fade-in duration-700" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text"
            placeholder="Cari nama pohon, tag, atau kategori..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {([
              { key: 'ALL',  label: 'Semua' },
              { key: 'HAS',  label: '✓ Ada Update' },
              { key: 'NONE', label: 'Belum Ada' },
            ] as const).map(({ key, label }) => (
              <button key={key} onClick={() => setFilterHasUpdate(key)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${filterHasUpdate === key
                    ? 'bg-[#1E562A] text-white border-[#1E562A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 shrink-0">
            <span className="font-bold text-gray-700">{filtered.length}</span> / {adoptions.length} adopsi
          </p>
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Tidak ada pohon ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada adopsi pohon'}
          </p>
          {!searchQuery && (
            <Link href="/adopt"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#1E562A] text-white rounded-full text-sm font-semibold hover:bg-[#153f1e] transition-colors">
              <Trees className="w-4 h-4" /> Adopsi Sekarang
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 max-w-2xl mx-auto">
          {[...filtered].sort((a, b) => Number(b.tree.hasUpdates) - Number(a.tree.hasUpdates)).map((adoption, idx) => (
            <div key={adoption.adoptionId}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}>
              <AdoptionCard adoption={adoption} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}