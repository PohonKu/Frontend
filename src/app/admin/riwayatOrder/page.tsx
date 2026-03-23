'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Search, ShoppingBag, TrendingUp, Wallet,
  CheckCircle2, Clock, XCircle, RefreshCw, Filter,
  Calendar, Tag, Leaf, ChevronDown, X,
} from 'lucide-react';
import { adminApi } from '@/lib/apiAdmin';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderUser { id: string; fullName: string; email: string; phone: string | null; avatarUrl: string | null; }
interface Species   { id: string; name: string; latinName: string; mainImageUrl: string; }
interface OrderItem { id: string; orderId: string; speciesId: string; nameOnTag: string; durationYears: number; priceAtPurchase: string; species: Species; }
interface Order {
  id: string; userId: string; orderNumber: string;
  totalAmount: string; paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | string;
  paymentMethod: string | null; snapToken: string | null;
  expiredAt: string | null; createdAt: string; updatedAt: string;
  orderItems: OrderItem; user: OrderUser;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (v: string | number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v));
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const toYMD = (iso: string) => iso.slice(0, 10);
const toYM  = (iso: string) => iso.slice(0, 7);
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_COLORS = ['bg-emerald-100 text-emerald-700','bg-blue-100 text-blue-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700','bg-violet-100 text-violet-700'];
const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string; activeCls: string }> = {
  PAID:    { label: 'Lunas',    icon: CheckCircle2, cls: 'bg-green-50 text-green-700 border-green-100', activeCls: 'bg-green-600 text-white border-green-600' },
  PENDING: { label: 'Menunggu', icon: Clock,        cls: 'bg-amber-50 text-amber-700 border-amber-100', activeCls: 'bg-amber-500 text-white border-amber-500' },
  FAILED:  { label: 'Gagal',    icon: XCircle,      cls: 'bg-red-50 text-red-600 border-red-100',       activeCls: 'bg-red-600 text-white border-red-600' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[150px]">
      <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-sm font-bold text-[#1E562A]">{formatRupiah(payload[0].value)}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{payload[0].payload.count} transaksi</p>
    </div>
  );
};

const Avatar = ({ user, size = 'md' }: { user: OrderUser; size?: 'sm' | 'md' }) => {
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

const OrderRow = ({ order }: { order: Order }) => {
  const status = STATUS_CONFIG[order.paymentStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
      <td className="px-4 py-3.5 min-w-[130px]">
        <p className="text-xs font-mono font-semibold text-[#1E562A]">{order.orderNumber}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar user={order.user} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[130px]">{order.user.fullName}</p>
            <p className="text-[10px] text-gray-400 truncate max-w-[130px]">{order.user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
            <Image src={order.orderItems.species.mainImageUrl} alt={order.orderItems.species.name} fill className="object-cover"
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[110px]">{order.orderItems.species.name}</p>
            <p className="text-[10px] text-gray-400 italic truncate">{order.orderItems.species.latinName}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-xs text-gray-600"><Tag className="w-3 h-3 text-gray-400 shrink-0" />{order.orderItems.nameOnTag}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500"><Leaf className="w-3 h-3 text-gray-400 shrink-0" />{order.orderItems.durationYears} thn</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm font-bold text-gray-900">{formatRupiah(order.totalAmount)}</p>
        <p className="text-[10px] text-gray-400 capitalize">{order.paymentMethod?.replace('_', ' ') || '-'}</p>
      </td>
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${status.cls}`}>
          <StatusIcon className="w-3 h-3" />{status.label}
        </span>
      </td>
    </tr>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false);
  const status     = STATUS_CONFIG[order.paymentStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(o => !o)}>
        <Avatar user={order.user} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="text-[11px] font-mono font-bold text-[#1E562A]">{order.orderNumber}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${status.cls}`}>
              <StatusIcon className="w-2.5 h-2.5" />{status.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 truncate">{order.user.fullName}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className="text-sm font-bold text-gray-900">{formatRupiah(order.totalAmount)}</p>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <div className="flex items-center gap-3 py-3 mb-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
              <Image src={order.orderItems.species.mainImageUrl} alt={order.orderItems.species.name} fill className="object-cover"
                onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{order.orderItems.species.name}</p>
              <p className="text-[10px] text-gray-400 italic">{order.orderItems.species.latinName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Email',       value: order.user.email },
              { label: 'Nama di tag', value: order.orderItems.nameOnTag },
              { label: 'Durasi',      value: `${order.orderItems.durationYears} tahun` },
              { label: 'Metode',      value: order.paymentMethod?.replace('_', ' ') || '-' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-xs text-gray-900 font-medium truncate capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [filterStatus,  setFilterStatus]  = useState('ALL');

  const now       = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const minus2    = (() => { const d = new Date(now.getFullYear(), now.getMonth() - 2, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })();

  const [chartMode,   setChartMode]   = useState<'single' | 'range'>('single');
  const [singleMonth, setSingleMonth] = useState(thisMonth);
  const [rangeFrom,   setRangeFrom]   = useState(minus2);
  const [rangeTo,     setRangeTo]     = useState(thisMonth);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res  = await adminApi.getAllOrder();
      const list = res?.data ?? res ?? [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setOrdersLoading(false); }
  };

  const chartData = useMemo(() => {
    const paid = orders.filter(o => {
      if (o.paymentStatus !== 'PAID') return false;
      const ym = toYM(o.createdAt);
      return chartMode === 'single' ? ym === singleMonth : (ym >= rangeFrom && ym <= rangeTo);
    });
    const grouped: Record<string, { total: number; count: number; date: Date }> = {};
    paid.forEach(o => {
      const key = toYMD(o.createdAt);
      if (!grouped[key]) grouped[key] = { total: 0, count: 0, date: new Date(o.createdAt) };
      grouped[key].total += Number(o.totalAmount);
      grouped[key].count += 1;
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([, { total, count, date }]) => ({
      date: chartMode === 'single'
        ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' }),
      total, count,
    }));
  }, [orders, chartMode, singleMonth, rangeFrom, rangeTo]);

  const chartRevenue = useMemo(() => chartData.reduce((s, d) => s + d.total, 0), [chartData]);
  const chartTxCount = useMemo(() => chartData.reduce((s, d) => s + d.count, 0), [chartData]);
  const totalRevenue = orders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + Number(o.totalAmount), 0);
  const paidCount    = orders.filter(o => o.paymentStatus === 'PAID').length;
  const pendingCount = orders.filter(o => o.paymentStatus === 'PENDING').length;

  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const ok = o.orderNumber.toLowerCase().includes(q) || o.user.fullName.toLowerCase().includes(q)
      || o.user.email.toLowerCase().includes(q) || o.orderItems.species.name.toLowerCase().includes(q)
      || o.orderItems.nameOnTag.toLowerCase().includes(q);
    return ok && (filterStatus === 'ALL' || o.paymentStatus === filterStatus);
  });

  const periodLabel = useMemo(() => {
    if (chartMode === 'single') return new Date(singleMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const from = new Date(rangeFrom + '-01').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    const to   = new Date(rangeTo   + '-01').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    return `${from} — ${to}`;
  }, [chartMode, singleMonth, rangeFrom, rangeTo]);

  const applyPreset = (months: number) => {
    const to   = new Date();
    const from = new Date(to.getFullYear(), to.getMonth() - (months - 1), 1);
    setRangeFrom(`${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}`);
    setRangeTo(`${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
            <ShoppingBag className="w-5 h-5 text-[#1E562A] shrink-0" /> Riwayat Order
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">Seluruh transaksi yang telah masuk</p>
        </div>
        <button onClick={fetchOrders}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 shrink-0">
          <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Wallet,      bg: 'bg-[#1E562A]/10', ic: 'text-[#1E562A]', label: 'Total Pendapatan', value: formatRupiah(totalRevenue), sub: `${paidCount} transaksi lunas`, vc: 'text-[#1E562A]', span: true },
            { icon: CheckCircle2,bg: 'bg-green-50',      ic: 'text-green-600', label: 'Lunas',           value: String(paidCount),          sub: 'order',                        vc: 'text-gray-900', span: false },
            { icon: Clock,       bg: 'bg-amber-50',      ic: 'text-amber-600', label: 'Pending',         value: String(pendingCount),        sub: 'order',                        vc: 'text-gray-900', span: false },
          ].map(({ icon: Icon, bg, ic, label, value, sub, vc, span }) => (
            <div key={label} className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${span ? 'col-span-2 sm:col-span-1' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${ic}`} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
              </div>
              <p className={`text-xl font-bold ${vc} truncate`}>{value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1E562A] shrink-0" /> Grafik Pendapatan Harian
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{periodLabel}</p>
            </div>
            <div className="flex flex-row sm:flex-col sm:items-end gap-3 sm:gap-0.5">
              <p className="text-base font-bold text-[#1E562A]">{formatRupiah(chartRevenue)}</p>
              <p className="text-[11px] text-gray-400 self-end sm:self-auto">{chartTxCount} transaksi</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 space-y-3">
            <div className="flex gap-2">
              {[{ key: 'single', label: 'Per Bulan' }, { key: 'range', label: 'Rentang' }].map(({ key, label }) => (
                <button key={key} onClick={() => setChartMode(key as 'single' | 'range')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold border transition-all
                    ${chartMode === key ? 'bg-[#1E562A] text-white border-[#1E562A]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                  {label}
                </button>
              ))}
            </div>

            {chartMode === 'single' ? (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input type="month" value={singleMonth} onChange={e => setSingleMonth(e.target.value)}
                  className="flex-1 sm:flex-none text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 text-gray-900 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <input type="month" value={rangeFrom} onChange={e => setRangeFrom(e.target.value)} max={rangeTo}
                    className="flex-1 min-w-[130px] text-sm border text-gray-900 border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white" />
                  <span className="text-xs text-gray-400 font-semibold shrink-0">s/d</span>
                  <input type="month" value={rangeTo} onChange={e => setRangeTo(e.target.value)} min={rangeFrom}
                    className="flex-1 min-w-[130px] text-sm border text-gray-900 border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <p className="text-[10px] text-gray-400 font-semibold self-center mr-1">Cepat:</p>
                  {[{ label: '1 bulan', months: 1 }, { label: '3 bulan', months: 3 }, { label: '6 bulan', months: 6 }, { label: '1 tahun', months: 12 }].map(({ label, months }) => (
                    <button key={label} onClick={() => applyPreset(months)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-200 bg-white text-gray-500 hover:border-[#1E562A] hover:text-[#1E562A] transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {chartData.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-9 h-9 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Tidak ada transaksi di periode ini</p>
              </div>
            </div>
          ) : (
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E562A" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#1E562A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'inherit' }} axisLine={false} tickLine={false} dy={6} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'inherit' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={38} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#1E562A" strokeWidth={2.5} fill="url(#grad)"
                    dot={{ fill: '#1E562A', strokeWidth: 0, r: 3.5 }} activeDot={{ r: 6, fill: '#1E562A', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Cari nomor order, nama, atau pohon..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm border text-gray-900 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {(['ALL', 'PAID', 'PENDING', 'FAILED'] as const).map(s => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                    ${filterStatus === s ? (s === 'ALL' ? 'bg-[#1E562A] text-white border-[#1E562A]' : cfg?.activeCls) : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                  {s === 'ALL' ? 'Semua' : cfg?.label || s}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400">Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari {orders.length} order</p>
        </div>

        {/* List */}
        {ordersLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3 bg-gray-200 rounded w-1/3" /><div className="h-2.5 bg-gray-100 rounded w-1/2" /></div>
                <div className="h-4 bg-gray-200 rounded w-20 shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
            <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">Tidak ada order ditemukan</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80">
                      {['No. Order', 'Pembeli', 'Pohon', 'Detail', 'Total', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{filtered.map(o => <OrderRow key={o.id} order={o} />)}</tbody>
                </table>
              </div>
            </div>
            <div className="md:hidden space-y-3">{filtered.map(o => <OrderCard key={o.id} order={o} />)}</div>
          </>
        )}
      </div>
    </div>
  );
}