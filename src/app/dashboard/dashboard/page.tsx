'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { X, Download, Trees, Leaf, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dashboardApi } from '@/lib/apiDashboard';
import { Typography } from '@/components/ui/Typography';
import AdoptionDetailModal from '@/components/dashboard/AdoptionDetailModal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Adoption {
  id: string;
  treeName: string;
  treeType: string;
  location: string;
  status: string;
  plantedAt: string;
  lastUpdated: string;
  imageUrl?: string;
  coordinates?: string;
  carbonAbsorbed: number;
  adoptionDurationMonths: number;
  growthPhase: string;
  healthStatus: string;
  nextUpdateDate: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = ['#1E562A', '#4CAF50', '#8BC34A', '#C8E6C9', '#E8F5E9'];


// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDistributionData = (adoptions: Adoption[], key: keyof Adoption) => {
  const counts: Record<string, number> = {};
  adoptions.forEach(tree => { const val = tree[key] as string; counts[val] = (counts[val] || 0) + 1; });
  return Object.keys(counts).map(name => ({ name, value: counts[name] }));
};

const getTotalCarbon = (adoptions: Adoption[]) => adoptions.reduce((sum, t) => sum + t.carbonAbsorbed, 0);

const getNearestExpiry = (adoptions: Adoption[]): string => {
  if (!adoptions.length) return '-';
  let nearest = Infinity;
  let str = '-';
  adoptions.forEach(t => {
    const d = new Date(t.plantedAt);
    if (!isNaN(d.getTime()) && t.adoptionDurationMonths) {
      const exp = new Date(d); exp.setMonth(exp.getMonth() + t.adoptionDurationMonths);
      if (exp.getTime() < nearest) { nearest = exp.getTime(); str = exp.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }); }
    }
  });
  return str;
};

const getUpcomingUpdate = (adoptions: Adoption[]): string => {
  if (!adoptions.length) return '-';
  let nearest = Infinity;
  let str = '-';
  const now = Date.now();
  adoptions.forEach(t => {
    const d = new Date(t.nextUpdateDate);
    if (!isNaN(d.getTime()) && d.getTime() > now && d.getTime() < nearest) {
      nearest = d.getTime();
      str = d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  });
  if (str === '-' && adoptions[0]?.nextUpdateDate) return new Date(adoptions[0].nextUpdateDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  return str;
};

const mapAdoption = (item: any): Adoption => ({
  id: item.id || item.adoptionId || '',
  treeName: item.species?.name || item.treeName || 'Pohon',
  treeType: item.species?.latinName || item.treeType || '',
  location: item.tree?.latitude && item.tree?.longitude ? `${item.tree.latitude}, ${item.tree.longitude}` : item.location || 'Tahura Bunder, Yogyakarta',
  status: item.tree?.status || item.status || 'Aktif',
  plantedAt: item.tree?.plantedAt ? new Date(item.tree.plantedAt).toLocaleDateString('id-ID') : item.plantedAt || '-',
  lastUpdated: item.tree?.treeUpdates?.[0]?.createdAt || item.lastUpdated || new Date().toISOString(),
  imageUrl: item.species?.mainImageUrl || item.species?.imageUrl || item.imageUrl,
  carbonAbsorbed: item.tree?.treeUpdates?.[0]?.co2AbsorbedTotal ?? item.carbonAbsorbed ?? 0,
  //carbonAbsorbed: item.tree?.treeUpdates?.[0]?.co2AbsorbedTotal ?? item.species?.carbonAbsorptionRate ?? item.carbonAbsorbed ?? 0,
  adoptionDurationMonths: item.durationMonths || item.adoptionDurationMonths || 12,
  growthPhase: item.growthPhase || item.tree?.status || 'Seedling',
  healthStatus: item.healthStatus || (item.tree?.status === 'ACTIVE' ? 'Sehat' : 'Adaptasi'),
  nextUpdateDate: item.expiresAt || item.nextUpdateDate || new Date(Date.now() + 90 * 86400000).toISOString(),
});

// ─── TooltipInfo ──────────────────────────────────────────────────────────────

const TooltipInfo = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center ml-1.5 cursor-help">
    <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#1E562A] transition-colors" />
    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] leading-relaxed rounded shadow-xl transition-all duration-200 z-50 text-center pointer-events-none font-medium">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

// ─── DonutChart ───────────────────────────────────────────────────────────────

const DonutChart = ({ data, title, tooltipText }: { data: { name: string; value: number }[]; title: string; tooltipText?: string }) => {
  if (!data || data.length === 0) return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <Typography variant="body" className="font-semibold text-gray-700 mb-2">{title}</Typography>
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 font-medium">Data tidak tersedia</div>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="flex items-center justify-center mb-2">
        <Typography variant="body" className="font-semibold text-gray-700">{title}</Typography>
        {tooltipText && <TooltipInfo text={tooltipText} />}
      </div>
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none" isAnimationActive animationBegin={200} animationDuration={1200}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center text-[11px] text-gray-600 font-medium max-w-[100px] truncate" title={entry.name}>
            <span className="w-2.5 h-2.5 rounded-sm mr-1.5 shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TreeCard ─────────────────────────────────────────────────────────────────

const TreeCard = ({ tree, idx, onDetail, onCertificate, isExpired = false }: {
  tree: Adoption; idx: number;
  onDetail: (t: Adoption) => void; onCertificate: (t: Adoption) => void;
  isExpired?: boolean;
}) => (
  <div className={`bg-white rounded-lg overflow-hidden shadow-sm border flex flex-col group transition-all duration-500 animate-in fade-in zoom-in-95 duration-700
    ${isExpired ? 'border-gray-200 grayscale-[20%]' : 'border-gray-200 hover:shadow-xl hover:-translate-y-1.5 hover:border-green-200'}`}
    style={{ animationDelay: `${400 + idx * 100}ms`, animationFillMode: 'both' }}>
    <div className={`p-4 border-b border-gray-100 transition-colors duration-500 ${isExpired ? 'bg-gray-50' : 'bg-gray-50/50 group-hover:bg-[#1E562A]/5'}`}>
      <h3 className={`text-lg font-bold truncate transition-colors ${isExpired ? 'text-gray-400' : 'text-gray-900 group-hover:text-[#1E562A]'}`}>{tree.treeName}</h3>
      <p className="text-gray-400 text-xs font-serif italic mt-0.5 truncate">{tree.treeType}</p>
    </div>
    <div className="h-40 bg-gray-200 relative overflow-hidden">
      <Image src={tree.imageUrl || '/images/tree-placeholder.jpg'} alt={tree.treeName} fill
        className={`object-cover transition-transform duration-700 ease-out ${!isExpired && 'group-hover:scale-105'}`}
        onError={(e: any) => { e.currentTarget.style.display = 'none' }} />
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center -z-10">
        <Trees className="w-8 h-8 text-gray-400" />
      </div>
      {isExpired ? (
        <div className="absolute top-3 right-3 bg-gray-100/90 backdrop-blur px-2 py-1 rounded shadow-sm flex items-center gap-1.5 border border-gray-200">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Kedaluwarsa</span>
        </div>
      ) : (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm flex items-center gap-1.5 border border-white/50">
          <div className={`w-1.5 h-1.5 rounded-full ${tree.healthStatus === 'Sehat' ? 'bg-green-500' : tree.healthStatus === 'Kritis' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{tree.healthStatus}</span>
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="space-y-2 mb-4">
        {[
          { label: 'Lokasi',   value: tree.location,     truncate: true },
          { label: 'Fase',     value: tree.growthPhase,  truncate: false },
          { label: 'Serapan',  value: `${tree.carbonAbsorbed} kg`, truncate: false },
        ].map(({ label, value, truncate }) => (
          <div key={label} className="flex items-start justify-between text-xs font-medium">
            <span className="text-gray-500 uppercase tracking-wider">{label}</span>
            <span className={`text-gray-900 text-right font-semibold ${truncate ? 'max-w-[120px] truncate' : ''}`} title={truncate ? value : undefined}>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <button onClick={() => onDetail(tree)}
          className={`py-2 rounded text-xs font-semibold transition-all duration-300 border
            ${isExpired ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default' : 'bg-[#1E562A] text-white hover:bg-[#153f1e] hover:shadow-md active:scale-95 border-transparent'}`}>
          Lihat detail
        </button>
        <button onClick={() => onCertificate(tree)}
          className="py-2 text-[#1E562A] text-xs font-semibold hover:text-[#153f1e] active:scale-95 transition-all duration-300 bg-green-50/50 hover:bg-green-100 rounded border border-green-100/50 hover:border-green-200">
          Unduh sertifikat
        </button>
      </div>
    </div>
  </div>
);

// ─── TreeDetailModal ──────────────────────────────────────────────────────────

const TreeDetailModal = ({ isOpen, onClose, tree }: { isOpen: boolean; onClose: () => void; tree: Adoption | null }) => {
  if (!isOpen || !tree) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/90 shadow-sm rounded-md hover:bg-gray-100 transition-colors z-10 border border-gray-200">
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <div className="h-48 bg-gray-200 relative">
          <Image src={tree.imageUrl || '/images/tree-placeholder.jpg'} alt={tree.treeName} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h3 className="text-2xl font-serif text-white tracking-wide">{tree.treeName}</h3>
            <p className="text-gray-200 text-sm mt-1 font-medium">{tree.location}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Masa Adopsi',       value: `${tree.adoptionDurationMonths / 12} Tahun` },
              { label: 'Tanggal Tanam',     value: tree.plantedAt },
              { label: 'Fase Pertumbuhan',  value: tree.growthPhase },
              { label: 'Serapan Karbon',    value: `${tree.carbonAbsorbed} kg CO2` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 border border-gray-200 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">{label}</span>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2 uppercase text-xs tracking-wider">Status & Pembaruan</h4>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#1E562A]/10 text-[#1E562A] border border-[#1E562A]/20 rounded-md text-xs font-bold uppercase tracking-wide">{tree.healthStatus}</span>
              <span className="text-sm text-gray-600 font-medium">Diperbarui: {new Date(tree.lastUpdated).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-[#1E562A] text-white rounded hover:bg-[#153f1e] transition-colors font-semibold text-sm">Tutup</button>
        </div>
      </div>
    </div>
  );
};

// ─── CertificateModal ─────────────────────────────────────────────────────────

const CertificateModal = ({ isOpen, onClose, userName, treeName }: {
  isOpen: boolean; onClose: () => void; userName: string; treeName: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 overflow-y-auto">
      <div className="bg-white rounded max-w-4xl w-full p-2 relative shadow-2xl my-8">
        <button onClick={onClose} className="absolute -top-4 -right-4 p-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors z-10 shadow-md">
          <X className="w-4 h-4" />
        </button>
        <div className="border-[12px] border-[#1E562A] p-2 bg-gray-50">
          <div className="border-4 border-double border-[#1E562A] p-12 flex flex-col items-center text-center relative overflow-hidden bg-white">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Image src="/images/Logo.svg" alt="Watermark" width={500} height={500} className="grayscale" />
            </div>
            <Image src="/images/Logo.svg" alt="PohonKu" width={140} height={90} className="mb-8 object-contain" />
            <h1 className="text-5xl font-serif text-[#1E562A] mb-3 tracking-widest uppercase font-bold">Sertifikat Adopsi</h1>
            <p className="text-lg text-gray-500 mb-10 tracking-widest uppercase text-sm font-semibold">Apresiasi Diberikan Kepada :</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-10 border-b border-gray-300 pb-3 px-16 inline-block">{userName || 'Nama Pemilik'}</h2>
            <p className="text-lg text-gray-700 max-w-2xl leading-loose mb-16 font-serif">
              Atas dedikasi dan kontribusi nyata dalam upaya pelestarian lingkungan hidup melalui adopsi pohon spesimen <span className="font-bold text-gray-900">{treeName || 'Nama Pohon'}</span>.
            </p>
            <div className="flex justify-between w-full max-w-3xl mt-4 items-end">
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-gray-400 mb-3"></div>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Tanggal Sertifikasi</p>
                <p className="text-sm text-gray-600 mt-1 font-serif">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="w-28 h-28 border-4 border-[#1E562A] rounded-full flex items-center justify-center bg-white">
                <div className="w-24 h-24 border border-[#1E562A] rounded-full flex items-center justify-center flex-col">
                  <span className="text-[#1E562A] font-serif font-bold text-[10px] tracking-widest uppercase">Verified</span>
                  <Leaf className="text-[#1E562A] w-5 h-5 my-1" />
                  <span className="text-[#1E562A] font-serif font-bold text-[9px] uppercase tracking-wider">Foundation</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-gray-400 mb-3"></div>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Direktur Eksekutif</p>
                <p className="text-sm text-gray-600 mt-1 font-serif">PohonKu Initiative</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 px-2">
          <button className="flex items-center gap-2 bg-[#1E562A] text-white px-5 py-2.5 rounded hover:bg-[#153f1e] transition-colors shadow-sm font-semibold text-sm">
            <Download className="w-4 h-4" /> Unduh Dokumen (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
// Tidak ada: sidebar, auth check, handleLogout — semua diurus layout.tsx

export default function DashboardPage() {
  const router = useRouter();

  // User diambil ulang di sini hanya untuk greeting & certificate
  // (layout sudah verifikasi auth, page ini cukup fetch data user lagi)
  const [user,            setUser]           = useState<User | null>(null);
  const [adoptions,       setAdoptions]      = useState<Adoption[]>([]);
  const [activeAdoptions, setActiveAdoptions]= useState<Adoption[]>([]);
  const [expiredAdoptions,setExpiredAdoptions]= useState<Adoption[]>([]);

  const [selectedTree,         setSelectedTree]         = useState<Adoption | null>(null);
  const [isTreeModalOpen,      setIsTreeModalOpen]      = useState(false);
  const [certificateTree,      setCertificateTree]      = useState<Adoption | null>(null);
  const [isCertificateModalOpen,setIsCertificateModalOpen] = useState(false);
  const [adoptionDetail,       setAdoptionDetail]       = useState<any | null>(null);
  const [isDetailLoading,      setIsDetailLoading]      = useState(false);

  useEffect(() => {
    const init = async () => {
      const token  = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

      // Ambil data user untuk greeting
      try {
        const res  = await fetch(`${apiUrl}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setUser(data.data);
      } catch {}

      // Ambil data adopsi
      try {
        const res  = await fetch(`${apiUrl}/api/v1/adoptions/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error();
        const json    = await res.json();
        const payload = json?.data ?? json;
        const mapped  = (arr: any[]) => arr.map(mapAdoption);
        const active  = mapped(payload?.active  ?? []);
        const expired = mapped(payload?.expired ?? []);
        const all     = [...active, ...expired];
        setActiveAdoptions(active);
        setExpiredAdoptions(expired);
        setAdoptions(all);
      } catch {
        // If API fails or user has 0 adoptions properly handle it as empty
        setActiveAdoptions([]);
        setExpiredAdoptions([]);
        setAdoptions([]);
      }
    };
    init();
  }, []);

  const openTreeDetail = async (tree: Adoption) => {
    setIsDetailLoading(true);
    try {
      const data   = await dashboardApi.getAdoptionDetail(tree.id);
      const detail = data?.success ? data.data : data;
      if (detail?.adoptionId) { setAdoptionDetail(detail); setIsDetailLoading(false); return; }
    } catch {}
    setIsDetailLoading(false);
    setSelectedTree(tree);
    setIsTreeModalOpen(true);
  };

  const growthPhaseData  = getDistributionData(adoptions, 'growthPhase');
  const healthStatusData = getDistributionData(adoptions, 'healthStatus');
  const totalCarbon      = getTotalCarbon(adoptions);
  const nextUpdateStr    = getUpcomingUpdate(activeAdoptions);
  const nearestExpiryStr = getNearestExpiry(activeAdoptions);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">

      {/* Header */}
      <header className="mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Halo, {user?.fullName || 'Pengguna'}
        </h1>
        <p className="text-gray-600 font-serif mt-1 font-medium">
          Terima kasih telah mengadopsi pohon dan ikut serta dalam pelestarian bumi.
        </p>
      </header>

      {/* Summary green section */}
      <section className="bg-[#1E562A] rounded-xl p-6 md:p-8 mb-10 shadow-lg border border-[#153f1e] animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {/* Total */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-gray-500 font-bold text-xs mb-1 uppercase tracking-widest">Total Inventaris</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-bold text-gray-900 tracking-tighter">{adoptions.length}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pohon</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>{activeAdoptions.length} Aktif
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>{expiredAdoptions.length} Non Aktif
                </span>
              </div>
            </div>

            {/* Carbon */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-gray-500 font-bold text-xs mb-1 uppercase tracking-widest flex items-center">
                Akumulasi Serapan
                <TooltipInfo text="Total estimasi gas karbon (CO2) yang berhasil diserap oleh seluruh pohon Anda." />
              </h3>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-bold text-gray-900 tracking-tighter">{totalCarbon.toFixed(1)}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">kg CO2</span>
              </div>
            </div>

            {/* Next update */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-gray-500 font-bold text-xs mb-2 uppercase tracking-widest flex items-center">
                Pembaruan Berikutnya
                <TooltipInfo text="Estimasi tanggal tim PohonKu akan mengunggah foto perkembangan pohon Anda." />
              </h3>
              <span className="text-sm font-bold text-gray-900 truncate" title={nextUpdateStr}>{nextUpdateStr}</span>
            </div>

            {/* Expiry */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-gray-500 font-bold text-xs mb-2 uppercase tracking-widest flex items-center">
                Akhir Masa Adopsi
                <TooltipInfo text="Tanggal paling awal salah satu masa berlaku adopsi Anda yang akan segera habis." />
              </h3>
              <span className="text-sm font-bold text-gray-900 truncate" title={nearestExpiryStr}>{nearestExpiryStr}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <DonutChart data={growthPhaseData} title="Fase Pertumbuhan"
              tooltipText="Seedling (Bibit muda), Sapling (Pancang), Pole (Tiang), Tree (Dewasa)." />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <DonutChart data={healthStatusData} title="Status Kesehatan"
              tooltipText="Adaptasi (Baru tanam), Sehat (Optimal), Kritis (Butuh perawatan)." />
          </div>
        </div>
      </section>

      {/* Link ke halaman update pohon */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <Link href="/tree-updates"
          className="inline-flex items-center gap-2.5 px-5 py-3 bg-white border border-[#1E562A]/20 text-[#1E562A] rounded-xl text-sm font-semibold hover:bg-[#1E562A]/5 hover:border-[#1E562A]/40 transition-all shadow-sm group">
          <Leaf className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          Lihat Perkembangan Pohonku
          <span className="text-[#1E562A]/50 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Aktif */}
      <section className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
            <h2 className="text-xl font-serif font-bold text-gray-900">Aktif</h2>
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{activeAdoptions.length} Item</span>
        </div>

        {activeAdoptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeAdoptions.map((tree, idx) => (
              <TreeCard key={tree.id || idx} tree={tree} idx={idx}
                onDetail={openTreeDetail} onCertificate={t => { setCertificateTree(t); setIsCertificateModalOpen(true); }} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 md:p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden group/empty">
            
            {/* Elegant Minimalist Icon */}
            <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-8 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#1E562A]/5 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-2 bg-[#1E562A]/10 rounded-full"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-[#1E562A] to-[#2E8B57] rounded-full shadow-lg shadow-[#1E562A]/20 justify-center items-center flex group-hover/empty:scale-110 transition-transform duration-700 ease-out">
                <Leaf className="w-8 h-8 md:w-10 md:h-10 text-white stroke-[1.5]" />
              </div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2 relative z-10 tracking-tight transition-colors group-hover/empty:text-[#1E562A]">Tidak Ada Pohon Aktif</h3>
            <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto mb-10 leading-relaxed relative z-10">
              Anda belum memiliki pohon yang sedang dalam masa adopsi aktif. Mulai perjalanan pelestarian alam Anda bersama PohonKu hari ini.
            </p>
            
            <Link href="/adopt" className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1E562A] text-white rounded-full font-semibold hover:bg-[#153f1e] hover:shadow-xl hover:shadow-[#1E562A]/20 hover:-translate-y-1 transition-all duration-300 text-sm md:text-base group">
              Eksplorasi Katalog
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Non Aktif */}
      <section className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block"></span>
            <h2 className="text-xl font-serif font-bold text-gray-500">Non Aktif</h2>
          </div>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{expiredAdoptions.length} Item</span>
        </div>

        {expiredAdoptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80">
            {expiredAdoptions.map((tree, idx) => (
              <TreeCard key={tree.id || idx} tree={tree} idx={idx} isExpired
                onDetail={openTreeDetail} onCertificate={t => { setCertificateTree(t); setIsCertificateModalOpen(true); }} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm font-medium">Tidak ada pohon yang sudah berakhir masa adopsinya.</p>
          </div>
        )}
      </section>

      {/* Modals */}
      <TreeDetailModal isOpen={isTreeModalOpen} onClose={() => setIsTreeModalOpen(false)} tree={selectedTree} />
      <CertificateModal isOpen={isCertificateModalOpen} onClose={() => setIsCertificateModalOpen(false)}
        userName={user?.fullName || ''} treeName={certificateTree?.treeName || ''} />

      {isDetailLoading && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl flex flex-col items-center shadow-xl">
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-[#1E562A] animate-spin mb-3" />
            <p className="text-gray-600 text-sm font-medium">Memuat detail adopsi...</p>
          </div>
        </div>
      )}

      {adoptionDetail && !isDetailLoading && (
        <AdoptionDetailModal adoption={adoptionDetail} onClose={() => setAdoptionDetail(null)} />
      )}
    </div>
  );
}