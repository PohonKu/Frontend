'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trees, Plus, Pencil, Search, RefreshCw, X,
  CheckCircle, AlertTriangle, Sprout,
  DollarSign, Wind, Layers, FileText, Image as ImageIcon,
} from 'lucide-react';
import { adminApi, SpeciesPayload } from '@/lib/apiAdmin';
import { ImageUploader } from '@/components/ui/imageUplouder';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Species {
  id: string;
  name: string;
  latinName: string;
  description: string;
  storyContent: string;
  mainImageUrl: string;
  basePrice: number | string;
  carbonAbsorptionRate: number;
  availabelStok: number;
  reservedStok?: number;
  category: string;
}

interface SpeciesForm {
  name: string;
  latinName: string;
  description: string;
  storyContent: string;
  mainImageUrl: string;
  basePrice: string;
  carbonAbsorptionRate: string;
  availabelStok: string;
  category: string;
}

const EMPTY_FORM: SpeciesForm = {
  name: '', latinName: '', description: '', storyContent: '',
  mainImageUrl: '', basePrice: '', carbonAbsorptionRate: '', availabelStok: '', category: 'umum',
};

const CATEGORIES = ['Toponimi Gunungkidul', 'Native Karst', 'Perspektif Keistimewaan', 'Sumbu Filosofi'];

const formatRupiah = (v: string | number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v));

const formToPayload = (form: SpeciesForm): SpeciesPayload => ({
  name:                form.name.trim(),
  latinName:           form.latinName.trim(),
  description:         form.description.trim(),
  storyContent:        form.storyContent.trim(),
  mainImageUrl:        form.mainImageUrl.trim(),
  basePrice:           Number(form.basePrice),
  carbonAbsorptionRate:Number(form.carbonAbsorptionRate),
  availabelStok:       Number(form.availabelStok),
  category:            form.category,
});

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300
    ${type === 'success' ? 'bg-[#1E562A] text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
  </div>
);

// ─── Species Form Modal ───────────────────────────────────────────────────────

export const SpeciesFormModal = ({
  isOpen, onClose, onSubmit, initialData, isEdit, isLoading,
}: {
  isOpen: boolean; onClose: () => void;
  onSubmit: (data: SpeciesForm) => void;
  initialData?: Partial<SpeciesForm>; isEdit: boolean; isLoading: boolean;
}) => {
  const [form, setForm] = useState<SpeciesForm>(EMPTY_FORM);
  const [tab,  setTab]  = useState<'basic' | 'detail'>('basic');
 
  useEffect(() => {
    if (isOpen) { setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM); setTab('basic'); }
  }, [isOpen, initialData]);
 
  const set = (field: keyof SpeciesForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));
 
  const basicValid =
    form.name.trim() && form.latinName.trim() && form.mainImageUrl.trim() &&
    form.description.trim() && form.basePrice && form.carbonAbsorptionRate && form.availabelStok;
 
  if (!isOpen) return null;
 
  const inputCls = "w-full px-3.5 py-2.5 border text-gray-900 border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white";
  const labelCls = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";
 
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl shadow-2xl max-h-[95vh] flex flex-col">
 
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{isEdit ? 'Edit Species' : 'Tambah Species Baru'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Lengkapi seluruh informasi spesies pohon</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
 
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 shrink-0">
          {[{ key: 'basic', label: 'Informasi Dasar' }, { key: 'detail', label: 'Konten & Cerita' }].map(({ key, label }) => (
            <button key={key} type="button"
              onClick={() => { if (key === 'detail' && !basicValid) return; setTab(key as 'basic' | 'detail'); }}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors -mb-px
                ${tab === key ? 'border-[#1E562A] text-[#1E562A]'
                  : key === 'detail' && !basicValid ? 'border-transparent text-gray-200 cursor-not-allowed'
                  : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>
 
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
 
          {/* ── TAB BASIC ── */}
          {tab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nama Umum <span className="text-red-500">*</span></label>
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Mangga Golek" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Nama Latin <span className="text-red-500">*</span></label>
                  <input value={form.latinName} onChange={e => set('latinName', e.target.value)}
                    placeholder="Mangifera indica" className={`${inputCls} italic`} />
                </div>
              </div>
 
              {/* ── FOTO — pakai ImageUploader ── */}
              <ImageUploader
                label="Foto Utama Species"
                required
                value={form.mainImageUrl}
                onChange={url => set('mainImageUrl', url)}
              />
 
              <div>
                <label className={labelCls}><FileText className="w-3 h-3 inline mr-1" />Deskripsi Singkat <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={3} placeholder="Deskripsi singkat mengenai spesies ini..."
                  className={`${inputCls} resize-none`} />
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}><DollarSign className="w-3 h-3 inline mr-1" />Harga Dasar (Rp) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.basePrice} onChange={e => set('basePrice', e.target.value)}
                    min={0} placeholder="200000" className={inputCls} />
                  {form.basePrice && <p className="text-[10px] text-[#1E562A] font-semibold mt-1">{formatRupiah(form.basePrice)}</p>}
                </div>
                <div>
                  <label className={labelCls}><Wind className="w-3 h-3 inline mr-1" />CO₂ Serapan (kg/thn) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.carbonAbsorptionRate} onChange={e => set('carbonAbsorptionRate', e.target.value)}
                    min={0} step={0.1} placeholder="12.5" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><Layers className="w-3 h-3 inline mr-1" />Stok Tersedia <span className="text-red-500">*</span></label>
                  <input type="number" value={form.availabelStok} onChange={e => set('availabelStok', e.target.value)}
                    min={0} placeholder="50" className={inputCls} />
                </div>
              </div>
 
              <div>
                <label className={labelCls}>Kategori <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}
 
          {/* ── TAB DETAIL ── */}
          {tab === 'detail' && (
            <div>
              <label className={labelCls}>Konten Cerita / Story <span className="text-red-500">*</span></label>
              <p className="text-[10px] text-gray-400 mb-2">Narasi lengkap. Bisa berisi teks panjang atau HTML.</p>
              <textarea value={form.storyContent} onChange={e => set('storyContent', e.target.value)}
                rows={14} placeholder="Pohon ini merupakan spesies endemik yang..."
                className={`${inputCls} resize-y font-mono text-xs leading-relaxed`} />
              <p className="text-[10px] text-gray-400 mt-1">{form.storyContent.length} karakter</p>
            </div>
          )}
        </div>
 
        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100 shrink-0">
          {tab === 'basic' ? (
            <>
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="button" onClick={() => basicValid && setTab('detail')} disabled={!basicValid}
                className="flex-1 py-2.5 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Lanjut →
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setTab('basic')}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                ← Kembali
              </button>
              <button type="button" onClick={() => onSubmit(form)}
                disabled={isLoading || !form.storyContent.trim()}
                className="flex-1 py-2.5 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {isLoading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isEdit ? 'Simpan Perubahan' : 'Tambah Species'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 

// ─── Species Card ─────────────────────────────────────────────────────────────

const SpeciesCard = ({ species, onEdit }: { species: Species; onEdit: (s: Species) => void }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col">
    <div className="h-44 bg-gray-100 relative overflow-hidden">
      <Image src={species.mainImageUrl} alt={species.name} fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center -z-10">
        <Trees className="w-8 h-8 text-gray-300" />
      </div>
      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-md shadow-sm border border-gray-100">
        <p className="text-[10px] font-bold text-[#1E562A] uppercase tracking-wider capitalize">{species.category}</p>
      </div>
    </div>

    <div className="p-4 flex flex-col flex-1">
      <div className="mb-3">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1E562A] transition-colors leading-tight">{species.name}</h3>
        <p className="text-xs text-gray-400 italic mt-0.5">{species.latinName}</p>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">{species.description}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: DollarSign, label: 'Harga',   value: formatRupiah(species.basePrice) },
          { icon: Wind,       label: 'CO₂/thn', value: `${species.carbonAbsorptionRate} kg` },
          { icon: Layers,     label: 'Stok',    value: String(species.availabelStok), red: species.availabelStok === 0 },
        ].map(({ icon: Icon, label, value, red }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
            <Icon className="w-3 h-3 text-[#1E562A] mx-auto mb-0.5" />
            <p className="text-[9px] text-gray-400 font-bold uppercase">{label}</p>
            <p className={`text-xs font-bold mt-0.5 truncate ${red ? 'text-red-500' : 'text-gray-900'}`}>{value}</p>
          </div>
        ))}
      </div>

      <button onClick={() => onEdit(species)}
        className="w-full flex items-center justify-center gap-2 py-2 bg-[#1E562A]/5 hover:bg-[#1E562A]/10 border border-[#1E562A]/10 rounded-lg text-xs font-semibold text-[#1E562A] transition-colors">
        <Pencil className="w-3 h-3" /> Edit Species
      </button>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
// Tidak ada: useRouter untuk auth, sidebar state, user state, navItems, <aside>, handleLogout
// Semua itu sudah ada di src/app/admin/layout.tsx

export default function AdminSpeciesPage() {
  const [speciesList,    setSpeciesList]    = useState<Species[]>([]);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isFormOpen,     setIsFormOpen]     = useState(false);
  const [editingItem,    setEditingItem]    = useState<Species | null>(null);
  const [formLoading,    setFormLoading]    = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch saat mount — tidak perlu cek auth, sudah diurus layout
  useEffect(() => { fetchSpecies(); }, []);

  const fetchSpecies = async () => {
    setSpeciesLoading(true);
    try {
      const res  = await adminApi.getAllSpecies();
      const list = res?.data ?? res ?? [];
      setSpeciesList(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setSpeciesLoading(false); }
  };

  const handleCreate = async (form: SpeciesForm) => {
    setFormLoading(true);
    try {
      await adminApi.createSpecies(formToPayload(form));
      showToast('Species berhasil ditambahkan', 'success');
      setIsFormOpen(false);
      await fetchSpecies();
    } catch (err: any) { showToast(err.message || 'Gagal menambah species', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (form: SpeciesForm) => {
    if (!editingItem) return;
    setFormLoading(true);
    try {
      await adminApi.updateSpecies(editingItem.id, formToPayload(form));
      showToast('Species berhasil diubah', 'success');
      setIsFormOpen(false);
      setEditingItem(null);
      await fetchSpecies();
    } catch (err: any) { showToast(err.message || 'Gagal mengubah species', 'error'); }
    finally { setFormLoading(false); }
  };

  const categories = ['ALL', ...Array.from(new Set(speciesList.map(s => s.category).filter(Boolean)))];
  const filtered   = speciesList.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) || s.latinName.toLowerCase().includes(q) ||
       (s.description || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q))
      && (filterCategory === 'ALL' || s.category === filterCategory)
    );
  });

  const outOfStock = speciesList.filter(s => s.availabelStok === 0).length;
  const totalStock = speciesList.reduce((sum, s) => sum + (s.availabelStok || 0), 0);

  return (
    // Wrapper: flex-col + h-full agar mengisi area konten dari layout
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
            <Sprout className="w-5 h-5 text-[#1E562A] shrink-0" />
            Kelola Species
          </h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">Tambah dan edit spesies pohon yang tersedia</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={fetchSpecies}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
            <RefreshCw className={`w-4 h-4 ${speciesLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors shadow-sm">
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Species</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Sprout,        bg: 'bg-[#1E562A]/10', ic: 'text-[#1E562A]', label: 'Total Species', val: speciesList.length,  vc: 'text-[#1E562A]'  },
            { icon: Layers,        bg: 'bg-blue-50',       ic: 'text-blue-600',  label: 'Kategori',      val: categories.length-1, vc: 'text-blue-700'  },
            { icon: Trees,         bg: 'bg-green-50',      ic: 'text-green-600', label: 'Total Stok',    val: totalStock,          vc: 'text-green-700' },
            { icon: AlertTriangle, bg: 'bg-red-50',        ic: 'text-red-500',   label: 'Stok Habis',    val: outOfStock,          vc: outOfStock > 0 ? 'text-red-600' : 'text-gray-400' },
          ].map(({ icon: Icon, bg, ic, label, val, vc }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${ic}`} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
              </div>
              <p className={`text-2xl font-bold ${vc}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Cari nama, nama latin, atau deskripsi..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">Kategori:</span>
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize
                  ${filterCategory === c ? 'bg-[#1E562A] text-white border-[#1E562A]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {c === 'ALL' ? 'Semua' : c}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari {speciesList.length} species
          </p>
        </div>

        {/* Grid */}
        {speciesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded" />
                  <div className="grid grid-cols-3 gap-2">{[1,2,3].map(j => <div key={j} className="h-14 bg-gray-100 rounded-lg" />)}</div>
                  <div className="h-8 bg-gray-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-16 text-center shadow-sm">
            <Sprout className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg">Tidak ada species ditemukan</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Mulai tambahkan species pohon pertama'}
            </p>
            {!searchQuery && (
              <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors">
                <Plus className="w-4 h-4" /> Tambah Species Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(s => (
              <SpeciesCard key={s.id} species={s} onEdit={s => { setEditingItem(s); setIsFormOpen(true); }} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <SpeciesFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
        onSubmit={editingItem ? handleEdit : handleCreate}
        initialData={editingItem ? {
          name: editingItem.name, latinName: editingItem.latinName,
          description: editingItem.description, storyContent: editingItem.storyContent,
          mainImageUrl: editingItem.mainImageUrl, basePrice: String(editingItem.basePrice),
          carbonAbsorptionRate: String(editingItem.carbonAbsorptionRate),
          availabelStok: String(editingItem.availabelStok), category: editingItem.category,
        } : undefined}
        isEdit={!!editingItem}
        isLoading={formLoading}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}