'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Home, LayoutDashboard, Settings, LogOut, X, Download, MapPin, Calendar, Trees, Droplets, Wind, CheckCircle, Leaf } from 'lucide-react';
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
  status: string;
  plantedAt: string;
  imageUrl?: string;
  coordinates?: string;
  carbonAbsorbed?: string;
}

// --- Constants & Mocks ---
const CHART_COLORS = ['#1E562A', '#4CAF50', '#8BC34A', '#C8E6C9'];

const mockTreeData = [
  { name: 'Sengon', value: 45 },
  { name: 'Jati', value: 30 },
  { name: 'Mahoni', value: 25 },
];

const mockCarbonData = [
  { name: 'Terserap', value: 80 },
  { name: 'Sisa Target', value: 20 },
];

const mockHealthData = [
  { name: 'Sangat Sehat', value: 60 },
  { name: 'Sehat', value: 30 },
  { name: 'Butuh Perawatan', value: 10 },
];

// --- Simple Donut Chart Component ---
const DonutChart = ({ data, title }: { data: any[], title: string }) => (
  <div className="flex flex-col items-center justify-center p-4 h-full">
    <Typography variant="body" className="font-semibold text-gray-700 mb-2">{title}</Typography>
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {data.map((entry, index) => (
        <div key={index} className="flex items-center text-xs text-gray-600">
          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
          {entry.name}
        </div>
      ))}
    </div>
  </div>
);

// --- Modals ---
const TreeDetailModal = ({ isOpen, onClose, tree }: { isOpen: boolean; onClose: () => void; tree: Adoption | null }) => {
  if (!isOpen || !tree) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-48 bg-gray-200 relative">
          <Image src={tree.imageUrl || '/images/tree-placeholder.jpg'} alt={tree.treeName} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h3 className="text-3xl font-serif text-white">{tree.treeName}</h3>
            <p className="text-white/90 text-sm flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {tree.location}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-xl">
              <span className="text-xs text-green-800 font-medium flex items-center gap-1"><Trees className="w-3 h-3" /> Jenis Pohon</span>
              <p className="font-semibold text-gray-800 mt-1">{tree.treeType}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <span className="text-xs text-blue-800 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Tanggal Tanam</span>
              <p className="font-semibold text-gray-800 mt-1">{tree.plantedAt}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <span className="text-xs text-orange-800 font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> Koordinat</span>
              <p className="font-semibold text-gray-800 mt-1 text-sm">{tree.coordinates || '-7.8288, 110.3783'}</p>
            </div>
            <div className="bg-teal-50 p-3 rounded-xl">
              <span className="text-xs text-teal-800 font-medium flex items-center gap-1"><Wind className="w-3 h-3" /> Serapan Karbon</span>
              <p className="font-semibold text-gray-800 mt-1">{tree.carbonAbsorbed || '12 kg CO2/th'}</p>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Status & Kondisi</h4>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✨ {tree.status}</span>
              <span className="text-sm text-gray-500">Kondisi sangat baik, tumbuh optimal.</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#1E562A] text-white rounded-lg hover:bg-[#1A4C24] transition-colors font-medium">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded max-w-4xl w-full p-2 relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 shadow-lg">
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border Design */}
        <div className="border-[12px] border-[#1E562A] p-2 bg-green-50/30">
          <div className="border-4 border-double border-[#1E562A] p-10 flex flex-col items-center text-center relative overflow-hidden">

            {/* Watermark logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Image src="/images/Logo.svg" alt="Watermark" width={400} height={400} className="grayscale" />
            </div>

            <Image src="/images/Logo.svg" alt="PohonKu" width={120} height={80} className="mb-6 object-contain" />

            <h1 className="text-5xl font-serif text-[#1E562A] mb-2 tracking-wide uppercase">Sertifikat Adopsi</h1>
            <p className="text-lg text-gray-600 mb-8 italic font-serif">Apresiasi Tertinggi Diberikan Kepada :</p>

            <h2 className="text-4xl font-semibold text-gray-900 mb-8 border-b-2 border-[#1E562A] pb-2 px-12 inline-block">
              {userName || 'Nama Pahlawan Bumi'}
            </h2>

            <p className="text-xl text-gray-700 max-w-2xl leading-relaxed mb-12">
              Atas kontribusi nyata dalam melestarikan bumi melalui adopsi pohon <span className="font-bold text-[#1E562A]">{treeName || 'Pohon Spesial'}</span>. Dedikasi Anda membantu menyerap emisi karbon dan menjaga keseimbangan alam untuk generasi mendatang.
            </p>

            <div className="flex justify-between w-full max-w-3xl mt-8">
              <div className="flex flex-col items-center">
                <div className="w-40 border-b border-gray-400 mb-2"></div>
                <p className="text-sm font-semibold text-gray-700">Tanggal Adopsi</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              {/* Seal/Stamp */}
              <div className="w-32 h-32 border-4 border-[#1E562A] rounded-full flex items-center justify-center rotate-12 bg-white/80 backdrop-blur opacity-90">
                <div className="w-28 h-28 border border-dashed border-[#1E562A] rounded-full flex items-center justify-center flex-col">
                  <span className="text-[#1E562A] font-serif font-bold text-sm tracking-widest uppercase">Verified</span>
                  <Leaf className="text-[#1E562A] w-6 h-6 my-1" />
                  <span className="text-[#1E562A] font-serif font-bold text-xs">PohonKu</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 border-b border-gray-400 mb-2 mt-8"></div>
                <p className="text-sm font-semibold text-gray-700">PohonKu Foundation</p>
                <p className="text-sm text-gray-500">Direktur Utama</p>
              </div>
            </div>

          </div>
        </div>

        {/* Action button */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <button className="flex items-center gap-2 bg-[#1E562A] text-white px-6 py-3 rounded-full hover:bg-[#153f1e] transition-colors shadow-lg font-medium">
            <Download className="w-5 h-5" /> Download PDF
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
  const [stats, setStats] = useState<any>(null);

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

        // Fetch user data
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

        // Fetch adoptions and stats (using mock data structure if API fails or is empty)
        try {
          const adoptionsRes = await dashboardApi.getDashboard();
          const statsRes = await dashboardApi.getStatsAdoption();

          // Assuming API returns an array or object with data
          const adoptionsData = adoptionsRes?.data || [];

          if (adoptionsData.length === 0) {
            // Mock data for display purposes if backend is empty
            setAdoptions([
              { id: '1', treeName: 'Pohon Mangga Golek', treeType: 'Mangifera indica', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif Tumbuh', plantedAt: '12 Jan 2024' },
              { id: '2', treeName: 'Pohon Jati Emas', treeType: 'Tectona grandis', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif Tumbuh', plantedAt: '20 Feb 2024' },
              { id: '3', treeName: 'Pohon Sengon Laut', treeType: 'Paraserianthes falcataria', location: 'Gunung Kidul, Yogyakarta', status: 'Baru Ditanam', plantedAt: '05 Mar 2024' },
            ]);
          } else {
            setAdoptions(adoptionsData);
          }

          setStats(statsRes?.data || { total: 3, carbon: '25kg', health: '100% Sehat' });

        } catch (apiError) {
          console.error("API Error, using mock data", apiError);
          // Fallback Mocks
          setAdoptions([
            { id: '1', treeName: 'Pohon Mangga Golek', treeType: 'Mangifera indica', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif Tumbuh', plantedAt: '12 Jan 2024' },
            { id: '2', treeName: 'Pohon Jati Emas', treeType: 'Tectona grandis', location: 'Tahura Bunder, Yogyakarta', status: 'Aktif Tumbuh', plantedAt: '20 Feb 2024' },
          ]);
          setStats({ total: 2, carbon: '15kg', health: 'Baik' });
        }

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
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#1E562A] border-t-transparent animate-spin mb-4" />
          <p className="text-[#1E562A] font-medium text-lg animate-pulse">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1E562A] text-white flex flex-col flex-shrink-0 relative hidden md:flex z-20 shadow-xl">
        {/* Logo Section */}
        <div className="p-6 pb-8">
          <div className="bg-white rounded-xl p-3 flex justify-center items-center shadow-md">
            <Image src="/images/Logo.svg" alt="PohonKu Logo" width={120} height={50} className="object-contain" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
            <Home className="w-5 h-5" />
            <span className="font-medium tracking-wide">Home</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/20 text-white font-medium tracking-wide shadow-sm border border-white/10">
            <LayoutDashboard className="w-5 h-5 text-green-300" />
            <span>Dashboard</span>
          </div>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-medium tracking-wide">Pengaturan</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 group border border-transparent hover:border-red-500/30"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wide">Keluar</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#e8f5e9] to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">

          {/* Header */}
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 tracking-tight">Halo, {user?.fullName || 'Sahabat Bumi'}! 👋</h1>
              <p className="text-xl text-gray-600 font-serif italic text-pretty">Terima kasih telah mengadopsi pohon dan merawat bumi kita.</p>
            </div>
          </header>

          {/* Summary Section */}
          <section className="bg-[#1E562A] rounded-3xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-green-400/20 rounded-full blur-3xl" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

              {/* Card 1: Data Text */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-50/50 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Trees className="w-24 h-24 text-green-900" />
                </div>
                <h3 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Total Adopsi</h3>
                <div className="text-5xl font-bold text-[#1E562A] mb-4 flex items-baseline gap-2">
                  {adoptions.length} <span className="text-base font-medium text-gray-500">Pohon</span>
                </div>
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="truncate">Tahura Bunder</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium text-xs">Aktif</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Donut Chart 1 */}
              <div className="bg-white rounded-2xl shadow-xl border border-green-50/50 relative">
                <DonutChart data={mockTreeData} title="Distribusi Jenis Pohon" />
              </div>

              {/* Card 3: Donut Chart 2 */}
              <div className="bg-white rounded-2xl shadow-xl border border-green-50/50 relative">
                <DonutChart data={mockCarbonData} title="Target Serapan Karbon" />
              </div>

              {/* Card 4: Donut Chart 3 */}
              <div className="bg-white rounded-2xl shadow-xl border border-green-50/50 relative">
                <DonutChart data={mockHealthData} title="Status Kesehatan Pohon" />
              </div>

            </div>
          </section>

          {/* Tree List Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
                <Trees className="w-6 h-6 text-[#1E562A]" />
                Daftar Pohon Kamu
              </h2>
              <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold border border-green-200">
                {adoptions.length} Pohon Aktif
              </span>
            </div>

            {adoptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {adoptions.map((tree, idx) => (
                  <div key={tree.id || idx} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col">

                    {/* Image Placeholder / Photo */}
                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                      <Image
                        src={tree.imageUrl || '/images/tree-placeholder.jpg'}
                        alt={tree.treeName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e: any) => { e.currentTarget.style.display = 'none' }}
                      />
                      {/* Fallback solid color if image fails */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center -z-10">
                        <Trees className="w-16 h-16 text-green-200" />
                      </div>

                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-green-700 shadow-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {tree.status}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#1E562A] transition-colors">{tree.treeName}</h3>
                      <p className="text-gray-500 text-sm mb-4 font-serif italic">{tree.treeType}</p>

                      <div className="space-y-2 mb-6 flex-1">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{tree.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto gap-4">
                        <button
                          onClick={() => openTreeDetail(tree)}
                          className="flex-1 bg-[#1E562A] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#153f1e] active:scale-95 transition-all outline-none focus:ring-2 focus:ring-[#1E562A] focus:ring-offset-2"
                        >
                          Lihat detail
                        </button>
                        <button
                          onClick={() => openCertificate(tree)}
                          className="flex-1 py-2.5 text-[#1E562A] text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-[#153f1e] transition-colors text-center outline-none rounded-xl focus:bg-green-50"
                        >
                          Unduh sertifikat
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Trees className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada pohon.</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">Mulai langkah kecilmu untuk hijaukan bumi dengan mengadopsi pohon pertamamu hari ini.</p>
                <Link href="/adopt" className="px-6 py-3 bg-[#1E562A] text-white rounded-xl font-medium hover:bg-[#153f1e] transition-colors shadow-lg">
                  Mulai Adopsi Pohon
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
