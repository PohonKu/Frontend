'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search, Leaf, RefreshCw, Filter, X,
  Tag, ChevronDown, CheckCircle2, Clock, TreePine,
} from 'lucide-react';
import { adminApi } from '@/lib/apiAdmin';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdoptionUser   { id: string; fullName: string; email: string; avatarUrl: string | null; phone: string | null; }
interface AdoptionSpecies{ id: string; name: string; latinName: string; mainImageUrl: string; }
interface TreeUpdate     { heightCm: number; co2AbsorbedTotal: number; createdAt: string; }
interface AdoptionTree   { id: string; serialNumber: string; latitude: string | null; longitude: string | null; status: string; plantedAt: string | null; treeUpdates: TreeUpdate[]; }
interface AdoptionOrder  { id: string; orderNumber: string; totalAmount: string; paymentStatus: string; createdAt: string; }
interface Adoption {
  id: string; userId: string; treeId: string; orderId: string; speciesId: string;
  nameOnTag: string; certificateUrl: string | null;
  adoptedAt: string; expiresAt: string; createdAt: string; updatedAt: string;
  user: AdoptionUser; species: AdoptionSpecies; tree: AdoptionTree; order: AdoptionOrder;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (v: string | number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v));
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
const AVATAR_COLORS = ['bg-emerald-100 text-emerald-700','bg-blue-100 text-blue-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700','bg-violet-100 text-violet-700'];
const isExpired   = (expiresAt: string) => new Date(expiresAt) < new Date();
const getDaysLeft = (expiresAt: string) => Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const Avatar = ({ user, size = 'md' }: { user: AdoptionUser; size?: 'sm' | 'md' }) => {
  const dim   = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const color = AVATAR_COLORS[user.fullName.charCodeAt(0) % AVATAR_COLORS.length];
  if (user.avatarUrl) return (
    <div className={`${dim} rounded-full overflow-hidden border border-gray-100 shrink-0 relative`}>
      <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover"
        onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
    </div>
  );
  return <div className={`${dim} rounded-full flex items-center justify-center font-bold shrink-0 ${color}`}>{getInitials(user.fullName)}</div>;
};

const StatusBadge = ({ adoption }: { adoption: Adoption }) => {
  const expired    = isExpired(adoption.expiresAt);
  const daysLeft   = getDaysLeft(adoption.expiresAt);
  if (expired)              return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200"><X className="w-3 h-3" /> Kedaluwarsa</span>;
  if (!expired && daysLeft <= 30) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100"><Clock className="w-3 h-3" /> {daysLeft} hari lagi</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100"><CheckCircle2 className="w-3 h-3" /> Aktif</span>;
};

const AdoptionRow = ({ adoption }: { adoption: Adoption }) => {
  const expired    = isExpired(adoption.expiresAt);
  const lastUpdate = adoption.tree.treeUpdates[0];
  return (
    <tr className={`border-b border-gray-50 transition-colors ${expired ? 'opacity-60 hover:opacity-80' : 'hover:bg-gray-50/60'}`}>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
            <Image src={adoption.species.mainImageUrl} alt={adoption.species.name} fill className="object-cover"
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[110px]">{adoption.species.name}</p>
            <p className="text-[10px] text-gray-400 font-mono">{adoption.tree.serialNumber}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar user={adoption.user} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{adoption.user.fullName}</p>
            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{adoption.user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1 text-xs text-gray-700 font-medium"><Tag className="w-3 h-3 text-gray-400 shrink-0" />{adoption.nameOnTag}</span>
        <span className="text-[10px] text-gray-400 font-mono">{adoption.order.orderNumber}</span>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-xs text-gray-700">{formatDate(adoption.adoptedAt)}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">s/d {formatDate(adoption.expiresAt)}</p>
      </td>
      <td className="px-4 py-3.5">
        {lastUpdate
          ? <div><p className="text-xs font-semibold text-gray-800">{lastUpdate.heightCm} cm · {lastUpdate.co2AbsorbedTotal} kg CO₂</p><p className="text-[10px] text-gray-400 mt-0.5">{formatDate(lastUpdate.createdAt)}</p></div>
          : <span className="text-xs text-gray-300 font-medium">Belum ada update</span>
        }
      </td>
      <td className="px-4 py-3.5"><StatusBadge adoption={adoption} /></td>
    </tr>
  );
};

const AdoptionCard = ({ adoption }: { adoption: Adoption }) => {
  const [open, setOpen] = useState(false);
  const expired         = isExpired(adoption.expiresAt);
  const lastUpdate      = adoption.tree.treeUpdates[0];
  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden ${expired ? 'border-gray-100 opacity-70' : 'border-gray-100'}`}>
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
          <Image src={adoption.species.mainImageUrl} alt={adoption.species.name} fill className="object-cover"
            onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="text-sm font-bold text-gray-900">{adoption.species.name}</p>
            <StatusBadge adoption={adoption} />
          </div>
          <p className="text-[11px] text-gray-500 italic truncate">{adoption.species.latinName}</p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{adoption.tree.serialNumber}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 space-y-3">
          <div className="flex items-center gap-3 pt-3">
            <Avatar user={adoption.user} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{adoption.user.fullName}</p>
              <p className="text-[11px] text-gray-400 truncate">{adoption.user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Nama di tag',   value: adoption.nameOnTag },
              { label: 'No. Order',     value: adoption.order.orderNumber },
              { label: 'Diadopsi',      value: formatDate(adoption.adoptedAt) },
              { label: 'Berakhir',      value: formatDate(adoption.expiresAt) },
              { label: 'Nilai order',   value: formatRupiah(adoption.order.totalAmount) },
              { label: 'Spesies latin', value: adoption.species.latinName },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-xs text-gray-900 font-medium truncate italic">{value}</p>
              </div>
            ))}
          </div>
          {lastUpdate ? (
            <div className="bg-[#1E562A]/5 border border-[#1E562A]/10 rounded-lg p-3">
              <p className="text-[10px] font-bold text-[#1E562A] uppercase tracking-wider mb-1.5">Update Terakhir</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700 font-semibold">{lastUpdate.heightCm} cm</span>
                <span className="text-gray-700 font-semibold">{lastUpdate.co2AbsorbedTotal} kg CO₂</span>
                <span className="text-gray-400">{formatDate(lastUpdate.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Belum ada update perkembangan pohon</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAdoptionsPage() {
  const [adoptions,        setAdoptions]        = useState<Adoption[]>([]);
  const [adoptionsLoading, setAdoptionsLoading] = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [filterStatus,     setFilterStatus]     = useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'SOON'>('ALL');

  useEffect(() => { fetchAdoptions(); }, []);

  const fetchAdoptions = async () => {
    setAdoptionsLoading(true);
    try {
      const res  = await adminApi.getAllAdoption();
      const list = res?.data ?? res ?? [];
      setAdoptions(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setAdoptionsLoading(false); }
  };

  const totalAdoptions  = adoptions.length;
  const activeCount     = adoptions.filter(a => !isExpired(a.expiresAt)).length;
  const expiredCount    = adoptions.filter(a =>  isExpired(a.expiresAt)).length;
  const expireSoonCount = adoptions.filter(a => { const d = getDaysLeft(a.expiresAt); return !isExpired(a.expiresAt) && d <= 30; }).length;
  const withUpdates     = adoptions.filter(a => a.tree.treeUpdates.length > 0).length;

  const filtered = adoptions.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch = a.species.name.toLowerCase().includes(q) || a.user.fullName.toLowerCase().includes(q)
      || a.user.email.toLowerCase().includes(q) || a.nameOnTag.toLowerCase().includes(q)
      || a.tree.serialNumber.toLowerCase().includes(q) || a.order.orderNumber.toLowerCase().includes(q);
    const expired  = isExpired(a.expiresAt);
    const daysLeft = getDaysLeft(a.expiresAt);
    const matchStatus =
      filterStatus === 'ALL'     ? true :
      filterStatus === 'ACTIVE'  ? !expired && daysLeft > 30 :
      filterStatus === 'SOON'    ? !expired && daysLeft <= 30 :
      filterStatus === 'EXPIRED' ? expired : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
            <Leaf className="w-5 h-5 text-[#1E562A] shrink-0" /> Data Adopsi
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">Seluruh adopsi pohon yang telah terjadi</p>
        </div>
        <button onClick={fetchAdoptions}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 shrink-0">
          <RefreshCw className={`w-4 h-4 ${adoptionsLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: TreePine,    bg: 'bg-[#1E562A]/10', ic: 'text-[#1E562A]', label: 'Total Adopsi',  val: totalAdoptions,  vc: 'text-[#1E562A]'  },
            { icon: CheckCircle2,bg: 'bg-green-50',     ic: 'text-green-600', label: 'Aktif',        val: activeCount,     vc: 'text-green-700' },
            { icon: Clock,       bg: 'bg-amber-50',     ic: 'text-amber-600', label: 'Segera Habis', val: expireSoonCount, vc: 'text-amber-700' },
            { icon: X,           bg: 'bg-gray-100',     ic: 'text-gray-500',  label: 'Kedaluwarsa',  val: expiredCount,    vc: 'text-gray-600' },
          ].map(({ icon: Icon, bg, ic, label, val, vc }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-3.5 h-3.5 ${ic}`} /></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
              </div>
              <p className={`text-2xl font-bold ${vc}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#1E562A]" /> Pohon dengan update perkembangan
            </p>
            <p className="text-sm font-bold text-[#1E562A]">{withUpdates} / {totalAdoptions}</p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1E562A] rounded-full transition-all duration-700"
              style={{ width: totalAdoptions > 0 ? `${(withUpdates / totalAdoptions) * 100}%` : '0%' }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">
            {totalAdoptions > 0 ? Math.round((withUpdates / totalAdoptions) * 100) : 0}% pohon sudah pernah diupdate
          </p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Cari pohon, adopter, serial number, atau tag..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] text-gray-900 transition-colors bg-white" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {([
              { key: 'ALL',     label: 'Semua',        cls: 'bg-[#1E562A] text-white border-[#1E562A]' },
              { key: 'ACTIVE',  label: 'Aktif',        cls: 'bg-green-600 text-white border-green-600' },
              { key: 'SOON',    label: 'Segera Habis', cls: 'bg-amber-500 text-white border-amber-500' },
              { key: 'EXPIRED', label: 'Kedaluwarsa',  cls: 'bg-gray-500 text-white border-gray-500'   },
            ] as const).map(({ key, label, cls }) => (
              <button key={key} onClick={() => setFilterStatus(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                  ${filterStatus === key ? cls : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari {adoptions.length} adopsi</p>
        </div>

        {/* List */}
        {adoptionsLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3 bg-gray-200 rounded w-1/3" /><div className="h-2.5 bg-gray-100 rounded w-1/2" /></div>
                <div className="h-4 bg-gray-100 rounded w-16 shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
            <Leaf className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">Tidak ada adopsi ditemukan</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      {['Pohon', 'Adopter', 'Nama & Order', 'Masa Adopsi', 'Update Terakhir', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{filtered.map(a => <AdoptionRow key={a.id} adoption={a} />)}</tbody>
                </table>
              </div>
            </div>
            <div className="md:hidden space-y-3">{filtered.map(a => <AdoptionCard key={a.id} adoption={a} />)}</div>
          </>
        )}
      </div>
    </div>
  );
}