'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Home, LayoutDashboard, Settings, LogOut, X, Download, MapPin, Calendar, Trees, Droplets, Wind, CheckCircle, Leaf, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dashboardApi } from '@/lib/apiDashboard';
import { Typography } from '@/components/ui/Typography';

// --- Types ---
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
  status: string; // Used for listing status (Aktif dsb)
  plantedAt: string;
  lastUpdated: string;
  imageUrl?: string;
  coordinates?: string;
  carbonAbsorbed: number;
  // New Time-Based Properties
  adoptionDurationMonths: number;
  growthPhase: string; // Seedling, Sapling, Pole, Tree
  healthStatus: string; // Adaptasi, Sehat, Kritis
  nextUpdateDate: string;
}

// --- Constants & Styling ---
const CHART_COLORS = ['#1E562A', '#4CAF50', '#8BC34A', '#C8E6C9', '#E8F5E9'];

// --- Helper Functions ---
const getLatestUpdate = (adoptions: Adoption[]): string => {
  if (adoptions.length === 0) return '-';
  const dates = adoptions.map(a => new Date(a.lastUpdated).getTime());
  const maxDate = Math.max(...dates);
  return new Date(maxDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getDistributionData = (adoptions: Adoption[], key: keyof Adoption) => {
  const counts: Record<string, number> = {};
  adoptions.forEach(tree => {
    const val = tree[key] as string;
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.keys(counts).map(name => ({ name, value: counts[name] }));
};

const getTotalCarbon = (adoptions: Adoption[]): number => {
  return adoptions.reduce((sum, tree) => sum + tree.carbonAbsorbed, 0);
};

// Calculate nearest expiration date based on plantedAt + adoptionDurationMonths
const getNearestExpiry = (adoptions: Adoption[]): string => {
  if (adoptions.length === 0) return '-';
  let nearestExpiryTime = Infinity;
  let nearestDateStr = '-';

  adoptions.forEach(tree => {
    const plantedDate = new Date(tree.plantedAt);
    if (!isNaN(plantedDate.getTime()) && tree.adoptionDurationMonths) {
      const expiryDate = new Date(plantedDate);
      expiryDate.setMonth(expiryDate.getMonth() + tree.adoptionDurationMonths);
      if (expiryDate.getTime() < nearestExpiryTime) {
        nearestExpiryTime = expiryDate.getTime();
        nearestDateStr = expiryDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }
  });
  return nearestDateStr === '-' ? '-' : nearestDateStr;
};

const getUpcomingUpdate = (adoptions: Adoption[]): string => {
  if (adoptions.length === 0) return '-';
  let nearestUpdateTime = Infinity;
  let nearestDateStr = '-';
  const now = new Date().getTime();

  adoptions.forEach(tree => {
    const nextUpdate = new Date(tree.nextUpdateDate);
    if (!isNaN(nextUpdate.getTime()) && nextUpdate.getTime() > now) {
      if (nextUpdate.getTime() < nearestUpdateTime) {
        nearestUpdateTime = nextUpdate.getTime();
        nearestDateStr = nextUpdate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }
  });
  // If no future updates are found just return the earliest general update
  if (nearestDateStr === '-' && adoptions[0]?.nextUpdateDate) return new Date(adoptions[0].nextUpdateDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  return nearestDateStr;
};


const getCarbonDistribution = (adoptions: Adoption[]) => {
  return adoptions
    .map(tree => ({ name: tree.treeName, value: tree.carbonAbsorbed }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5
};

// --- UI Tooltip Component ---
const TooltipInfo = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center ml-1.5 cursor-help">
    <Info className="w-3.5 h-3.5 text-gray-400 hover:text-[#1E562A] transition-colors" />
    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] leading-relaxed rounded shadow-xl transition-all duration-200 z-50 text-center pointer-events-none font-medium">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

// --- Simple Donut Chart Component ---
const DonutChart = ({ data, title, tooltipText }: { data: { name: string, value: number }[], title: string, tooltipText?: string }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 h-full">
        <Typography variant="body" className="font-semibold text-gray-700 mb-2">{title}</Typography>
        <div className="flex items-center justify-center h-40 text-sm text-gray-400 font-medium">Data tidak tersedia</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="flex items-center justify-center mb-2">
        <Typography variant="body" className="font-semibold text-gray-700">{title}</Typography>
        {tooltipText && <TooltipInfo text={tooltipText} />}
      </div>
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '4px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '12px' }}
              itemStyle={{ color: '#374151' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center text-[11px] text-gray-600 font-medium max-w-[100px] truncate" title={entry.name}>
            <span className="w-2.5 h-2.5 rounded-sm mr-1.5 shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
            <span className="truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Modals ---
const TreeDetailModal = ({ isOpen, onClose, tree }: { isOpen: boolean; onClose: () => void; tree: Adoption | null }) => {
  if (!isOpen || !tree) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 transition-opacity">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/90 shadow-sm rounded-md hover:bg-gray-100 transition-colors z-10 border border-gray-200">
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <div className="h-48 bg-gray-200 relative">
          <Image src={tree.imageUrl || '/images/tree-placeholder.jpg'} alt={tree.treeName} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h3 className="text-2xl font-serif text-white tracking-wide">{tree.treeName}</h3>
            <p className="text-gray-200 text-sm flex items-center gap-1.5 mt-1 font-medium"><MapPin className="w-3.5 h-3.5" /> {tree.location}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Masa Adopsi</span>
              <p className="font-semibold text-gray-900">{tree.adoptionDurationMonths / 12} Tahun</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Tanggal Tanam</span>
              <p className="font-semibold text-gray-900">{tree.plantedAt}</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Fase Pertumbuhan</span>
              <p className="font-semibold text-gray-900 text-sm">{tree.growthPhase}</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Serapan Karbon</span>
              <p className="font-semibold text-gray-900">{tree.carbonAbsorbed} kg CO2</p>
            </div>
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
          <button onClick={onClose} className="px-5 py-2 bg-[#1E562A] text-white rounded hover:bg-[#153f1e] transition-colors font-semibold text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const CertificateModal = ({ isOpen, onClose, userName, treeName }: { isOpen: boolean; onClose: () => void; userName: string; treeName: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 transition-opacity overflow-y-auto">
      <div className="bg-white rounded max-w-4xl w-full p-2 relative shadow-2xl my-8">
        <button onClick={onClose} className="absolute -top-4 -right-4 p-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors z-10 shadow-md">
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Border Design */}
        <div className="border-[12px] border-[#1E562A] p-2 bg-gray-50">
          <div className="border-4 border-double border-[#1E562A] p-12 flex flex-col items-center text-center relative overflow-hidden bg-white">

            {/* Watermark logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Image src="/images/Logo.svg" alt="Watermark" width={500} height={500} className="grayscale" />
            </div>

            <Image src="/images/Logo.svg" alt="PohonKu" width={140} height={90} className="mb-8 object-contain" />

            <h1 className="text-5xl font-serif text-[#1E562A] mb-3 tracking-widest uppercase font-bold">Sertifikat Adopsi</h1>
            <p className="text-lg text-gray-500 mb-10 tracking-widest uppercase text-sm font-semibold">Apresiasi Diberikan Kepada :</p>

            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-10 border-b border-gray-300 pb-3 px-16 inline-block">
              {userName || 'Nama Pemilik'}
            </h2>

            <p className="text-lg text-gray-700 max-w-2xl leading-loose mb-16 font-serif">
              Atas dedikasi dan kontribusi nyata dalam upaya pelestarian lingkungan hidup melalui adopsi pohon spesimen <span className="font-bold text-gray-900">{treeName || 'Nama Pohon'}</span>. Kontribusi ini merupakan dukungan berharga bagi penyerapan emisi karbon global.
            </p>

            <div className="flex justify-between w-full max-w-3xl mt-4 items-end">
              <div className="flex flex-col items-center">
                <div className="w-48 border-b border-gray-400 mb-3"></div>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Tanggal Sertifikasi</p>
                <p className="text-sm text-gray-600 mt-1 font-serif">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              {/* Seal/Stamp */}
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

        {/* Action button */}
        <div className="flex justify-end mt-4 px-2">
          <button className="flex items-center gap-2 bg-[#1E562A] text-white px-5 py-2.5 rounded hover:bg-[#153f1e] transition-colors shadow-sm font-semibold text-sm">
            <Download className="w-4 h-4" /> Unduh Dokumen (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Dashboard Page ---
export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);

  // Modal states
  const [selectedTree, setSelectedTree] = useState<Adoption | null>(null);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [certificateTree, setCertificateTree] = useState<Adoption | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login?redirect=/dashboard');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://be-production-1e0b.up.railway.app';
        const userRes = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userRes.ok) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.data);

        // ALWAYS USE MOCK DATA that fulfills strict UI layout definition and properties
        const mockAdoptions: Adoption[] = [
          { id: '1', treeName: 'Pohon Mangga Golek', treeType: 'Mangifera indica', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif', plantedAt: '12 Jan 2024', lastUpdated: '2024-03-10T08:00:00Z', carbonAbsorbed: 12.5, adoptionDurationMonths: 12, growthPhase: 'Sapling', healthStatus: 'Sehat', nextUpdateDate: '2026-03-10T08:00:00Z' },
          { id: '2', treeName: 'Pohon Jati Emas', treeType: 'Tectona grandis', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif', plantedAt: '20 Feb 2024', lastUpdated: '2024-03-25T09:30:00Z', carbonAbsorbed: 8.2, adoptionDurationMonths: 24, growthPhase: 'Seedling', healthStatus: 'Adaptasi', nextUpdateDate: '2026-04-25T09:30:00Z' },
          { id: '3', treeName: 'Pohon Sengon Laut', treeType: 'Paraserianthes falcataria', location: 'Gunung Kidul, Yogyakarta', status: 'Baru Tanam', plantedAt: '05 Mar 2024', lastUpdated: '2024-03-05T14:15:00Z', carbonAbsorbed: 1.1, adoptionDurationMonths: 12, growthPhase: 'Seedling', healthStatus: 'Adaptasi', nextUpdateDate: '2025-09-05T14:15:00Z' },
          { id: '4', treeName: 'Pohon Jati Emas', treeType: 'Tectona grandis', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif', plantedAt: '15 Jan 2024', lastUpdated: '2024-03-28T11:20:00Z', carbonAbsorbed: 9.0, adoptionDurationMonths: 36, growthPhase: 'Pole', healthStatus: 'Sehat', nextUpdateDate: '2026-03-28T11:20:00Z' },
        ];

        setAdoptions(mockAdoptions);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  const openTreeDetail = (tree: Adoption) => {
    setSelectedTree(tree);
    setIsTreeModalOpen(true);
  };

  const openCertificate = (tree: Adoption) => {
    setCertificateTree(tree);
    setIsCertificateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-[#1E562A] animate-spin" />
      </div>
    );
  }

  // Derive charts purely from user's adoption array
  const growthPhaseData = getDistributionData(adoptions, 'growthPhase');
  const healthStatusData = getDistributionData(adoptions, 'healthStatus');
  const totalCarbon = getTotalCarbon(adoptions);
  const nextUpdateStr = getUpcomingUpdate(adoptions);
  const nearestExpiryStr = getNearestExpiry(adoptions);
  const treeTypeData = getDistributionData(adoptions, 'treeType');
  const treeStatusData = getDistributionData(adoptions, 'status');
  const carbonData = getCarbonDistribution(adoptions);
  const latestUpdateStr = getLatestUpdate(adoptions);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1E562A] text-white flex flex-col flex-shrink-0 hidden md:flex z-20 shadow-xl border-r border-[#153f1e]">
        {/* Logo Section */}
        <div className="p-8 pb-10">
          <div className="bg-white rounded-lg p-4 flex justify-center items-center hover:scale-105 transition-transform duration-300">
            <Image src="/images/Logo.svg" alt="PohonKu Logo" width={110} height={40} className="object-contain" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 space-y-1.5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300 hover:translate-x-1 group">
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold tracking-wide text-sm">Home</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-md bg-white/10 text-white font-semibold tracking-wide border-l-4 border-white shadow-inner">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </div>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300 hover:translate-x-1 group">
            <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-semibold tracking-wide text-sm">Pengaturan</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-all duration-300 font-semibold text-sm bg-white border border-red-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full relative bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-8 py-12">

          {/* Header */}
          <header className="mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Halo, {user?.fullName || 'Pengguna'}</h1>
            <p className="text-gray-600 font-serif mt-1 font-medium">Terima kasih telah mengadopsi pohon dan ikut serta dalam pelestarian bumi.</p>
          </header>

          {/* Summary Section */}
          <section className="bg-[#1E562A] rounded-xl p-8 mb-10 shadow-lg border border-[#153f1e] animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1 & 2: Text Stats Span 2 Columns */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {/* Total Trees */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="text-gray-500 font-bold text-xs mb-1 uppercase tracking-widest flex items-center">
                    Total Inventaris
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold text-gray-900 tracking-tighter">{adoptions.length}</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pohon</span>
                  </div>
                </div>

                {/* Total Carbon */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="text-gray-500 font-bold text-xs mb-1 uppercase tracking-widest flex items-center">
                    Akumulasi Serapan
                    <TooltipInfo text="Total estimasi gas karbon (CO2) yang berhasil diserap dan dikurangi oleh seluruh pohon Anda." />
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-bold text-gray-900 tracking-tighter">{totalCarbon.toFixed(1)}</span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">kg CO2</span>
                  </div>
                </div>

                {/* Next Update */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest flex items-center">
                      Pembaruan Berikutnya
                      <TooltipInfo text="Estimasi tanggal di mana tim PohonKu akan mengunggah foto perkembangan pohon yang Anda adopsi." />
                    </h3>
                  </div>
                  <span className="text-sm font-bold text-gray-900 truncate" title={nextUpdateStr}>{nextUpdateStr}</span>
                </div>

                {/* Nearest Expiry */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest flex items-center">
                      Akhir Masa Adopsi
                      <TooltipInfo text="Tanggal paling awal dari salah satu masa berlaku pohon adopsi Anda yang akan segera habis." />
                    </h3>
                  </div>
                  <span className="text-sm font-bold text-gray-900 truncate" title={nearestExpiryStr}>{nearestExpiryStr}</span>
                </div>
              </div>

              {/* Card 3: Donut Chart 1 (Fase Pertumbuhan) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <DonutChart
                  data={growthPhaseData}
                  title="Fase Pertumbuhan"
                  tooltipText="Tahapan usia pohon: Seedling (Bibit muda), Sapling (Pancang muda), Pole (Pohon tiang), dan Tree (Pohon dewasa yang rindang)."
                />
              </div>

              {/* Card 4: Donut Chart 2 (Status Kesehatan) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <DonutChart
                  data={healthStatusData}
                  title="Status Kesehatan"
                  tooltipText="Kondisi kesehatan pohon Anda: Adaptasi (Baru dipindah ke tanah), Sehat (Tumbuh optimal), dan Kritis (Membutuhkan perawatan khusus)."
                />
              </div>

            </div>
          </section>

          {/* Tree List Section */}
          <section className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
              <h2 className="text-xl font-serif font-bold text-gray-900">Inventaris Pohon</h2>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{adoptions.length} Item</span>
            </div>

            {adoptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {adoptions.map((tree, idx) => (
                  <div
                    key={tree.id || idx}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col group hover:shadow-xl hover:-translate-y-1.5 hover:border-green-200 transition-all duration-500 animate-in fade-in zoom-in-95 duration-700"
                    style={{ animationDelay: `${400 + (idx * 100)}ms`, animationFillMode: 'both' }}
                  >

                    {/* Header: Nama Pohon */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 group-hover:bg-[#1E562A]/5 transition-colors duration-500">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#1E562A] transition-colors">{tree.treeName}</h3>
                      <p className="text-gray-500 text-xs font-serif italic mt-0.5 truncate">{tree.treeType}</p>
                    </div>

                    {/* Image Placeholder */}
                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                      <Image
                        src={tree.imageUrl || '/images/tree-placeholder.jpg'}
                        alt={tree.treeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e: any) => { e.currentTarget.style.display = 'none' }}
                      />
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center -z-10">
                        <Trees className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm flex items-center gap-1.5 border border-white/50">
                        <div className={`w-1.5 h-1.5 rounded-full ${tree.healthStatus === 'Sehat' ? 'bg-green-500' : tree.healthStatus === 'Kritis' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{tree.healthStatus}</span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start justify-between text-xs font-medium">
                          <span className="text-gray-500 uppercase tracking-wider">Lokasi</span>
                          <span className="text-gray-900 text-right max-w-[120px] truncate" title={tree.location}>{tree.location}</span>
                        </div>
                        <div className="flex items-start justify-between text-xs font-medium">
                          <span className="text-gray-500 uppercase tracking-wider">Fase</span>
                          <span className="text-gray-900 text-right font-semibold">{tree.growthPhase}</span>
                        </div>
                        <div className="flex items-start justify-between text-xs font-medium">
                          <span className="text-gray-500 uppercase tracking-wider">Serapan</span>
                          <span className="text-gray-900 text-right font-semibold">{tree.carbonAbsorbed} kg</span>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => openTreeDetail(tree)}
                          className="bg-[#1E562A] text-white py-2 rounded text-xs font-semibold hover:bg-[#153f1e] hover:shadow-md active:scale-95 transition-all duration-300 border border-transparent"
                        >
                          Lihat detail
                        </button>
                        <button
                          onClick={() => openCertificate(tree)}
                          className="py-2 text-[#1E562A] text-xs font-semibold hover:text-[#153f1e] active:scale-95 transition-all duration-300 bg-green-50/50 hover:bg-green-100 rounded border border-green-100/50 hover:border-green-200"
                        >
                          Unduh sertifikat
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group hover:scale-110 transition-transform duration-300">
                  <Trees className="w-8 h-8 text-gray-400 group-hover:text-[#1E562A] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Inventaris Kosong</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Anda belum memiliki pohon yang diadopsi dalam inventaris ini.</p>
                <Link href="/adopt" className="px-5 py-2.5 bg-[#1E562A] text-white rounded font-semibold hover:bg-[#153f1e] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm inline-block">
                  Menuju Katalog Adopsi
                </Link>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Render Modals */}
      <TreeDetailModal isOpen={isTreeModalOpen} onClose={() => setIsTreeModalOpen(false)} tree={selectedTree} />
      <CertificateModal isOpen={isCertificateModalOpen} onClose={() => setIsCertificateModalOpen(false)} userName={user?.fullName || ''} treeName={certificateTree?.treeName || ''} />

    </div>
  );
}
