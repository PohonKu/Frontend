'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Trees, Plus, Pencil, Trash2, X, ChevronRight,
  Ruler, Gauge, Leaf, FileText, AlertTriangle, CheckCircle,
  RefreshCw, Search,
} from 'lucide-react';
import { adminApi, TreeUpdatePayload } from '@/lib/apiAdmin';
import { ImageUploader } from '@/components/ui/imageUplouder';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tree {
  id: string;
  serialNumber: string;
  status: string;
  latitude?: number;
  longitude?: number;
  plantedAt?: string;
  species?: { name: string; latinName: string; mainImageUrl?: string; };
}

interface TreeUpdate {
  id: string; treeId: string; photoUrl: string;
  heightCm: number; diameterCm: number;
  co2AbsorbedTotal: number; adminNotes?: string;
  createdAt: string; updatedAt: string;
}

const EMPTY_FORM: TreeUpdatePayload = {
  photoUrl: '', heightCm: 0, diameterCm: 0, co2AbsorbedTotal: 0, adminNotes: '',
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300
    ${type === 'success' ? 'bg-[#1E562A] text-white' : 'bg-red-600 text-white'}`}>
    {type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
  </div>
);

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isLoading }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; isLoading: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Hapus Update?</h3>
            <p className="text-sm text-gray-500 mt-0.5">Tindakan ini tidak bisa dibatalkan.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={onConfirm} disabled={isLoading}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isLoading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Update Form Modal ────────────────────────────────────────────────────────

const UpdateFormModal = ({ isOpen, onClose, onSubmit, initialData, isEdit, isLoading, treeName }: {
  isOpen: boolean; onClose: () => void; onSubmit: (data: TreeUpdatePayload) => void;
  initialData?: Partial<TreeUpdatePayload>; isEdit: boolean; isLoading: boolean; treeName: string;
}) => {
  const [form, setForm] = React.useState<TreeUpdatePayload>(EMPTY_FORM);
 
  React.useEffect(() => {
    if (isOpen) setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
  }, [isOpen, initialData]);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'adminNotes' ? value : Number(value) }));
  };
 
  // Validasi — pastikan foto sudah diisi sebelum submit
  const canSubmit = form.photoUrl.trim() && form.heightCm > 0 && form.diameterCm > 0 && form.co2AbsorbedTotal >= 0;
 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/60">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg shadow-2xl max-h-[95vh] overflow-y-auto">
 
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Update' : 'Tambah Update Baru'}</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{treeName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
 
        <div className="p-5 space-y-5">
 
          {/* ── FOTO — pakai ImageUploader ── */}
          <ImageUploader
            label="Foto Pohon"
            required
            value={form.photoUrl}
            onChange={url => setForm(prev => ({ ...prev, photoUrl: url }))}
          />
 
          {/* ── Metrics ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'heightCm',         label: 'Tinggi (cm)',   placeholder: '142.5' },
              { name: 'diameterCm',       label: 'Diameter (cm)', placeholder: '8.4'   },
              { name: 'co2AbsorbedTotal', label: 'CO₂ (kg)',      placeholder: '24.5'  },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" name={name}
                  value={(form as any)[name] || ''}
                  onChange={handleChange}
                  required min={0} step={0.1} placeholder={placeholder}
                  className="w-full px-3 py-2.5 text-gray-900 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors"
                />
              </div>
            ))}
          </div>
 
          {/* ── Catatan ── */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Catatan Admin
            </label>
            <textarea
              name="adminNotes" value={form.adminNotes || ''} onChange={handleChange} rows={3}
              placeholder="Kondisi pohon, observasi lapangan, catatan penting..."
              className="w-full px-3.5 py-2.5 border text-gray-900 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors resize-none"
            />
          </div>
 
          {/* ── Footer buttons ── */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button
              type="button"
              onClick={() => canSubmit && !isLoading && onSubmit(form)}
              disabled={isLoading || !canSubmit}
              className="flex-1 py-2.5 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Simpan Perubahan' : 'Tambah Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 

// ─── Update Card ──────────────────────────────────────────────────────────────

const UpdateCard = ({ update, onEdit, onDelete }: {
  update: TreeUpdate; onEdit: (u: TreeUpdate) => void; onDelete: (u: TreeUpdate) => void;
}) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
    <div className="h-40 bg-gray-100 relative overflow-hidden">
      <Image src={update.photoUrl} alt="Update foto" fill className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e: any) => { e.currentTarget.style.display = 'none' }} />
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center -z-10">
        <Trees className="w-8 h-8 text-gray-300" />
      </div>
      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-gray-100">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {new Date(update.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
    <div className="p-3.5">
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Tinggi',   value: `${update.heightCm} cm`,        icon: Ruler },
          { label: 'Diameter', value: `${update.diameterCm} cm`,       icon: Gauge },
          { label: 'CO₂',      value: `${update.co2AbsorbedTotal} kg`, icon: Leaf  },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
            <Icon className="w-3 h-3 text-[#1E562A] mx-auto mb-1" />
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{label}</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
      {update.adminNotes && (
        <p className="text-xs text-gray-500 leading-relaxed border-l-2 border-[#1E562A]/30 pl-2.5 mb-3 line-clamp-2">{update.adminNotes}</p>
      )}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
        <button onClick={() => onEdit(update)}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#1E562A] bg-[#1E562A]/5 hover:bg-[#1E562A]/10 rounded-lg transition-colors border border-[#1E562A]/10">
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button onClick={() => onDelete(update)}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
          <Trash2 className="w-3 h-3" /> Hapus
        </button>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTreesPage() {
  const [trees,          setTrees]          = useState<Tree[]>([]);
  const [treesLoading,   setTreesLoading]   = useState(false);
  const [selectedTree,   setSelectedTree]   = useState<Tree | null>(null);
  const [updates,        setUpdates]        = useState<TreeUpdate[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [searchOpen,     setSearchOpen]     = useState(true);
  const [isFormOpen,     setIsFormOpen]     = useState(false);
  const [editingUpdate,  setEditingUpdate]  = useState<TreeUpdate | null>(null);
  const [deletingUpdate, setDeletingUpdate] = useState<TreeUpdate | null>(null);
  const [formLoading,    setFormLoading]    = useState(false);
  const [deleteLoading,  setDeleteLoading]  = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch trees saat mount — tidak perlu cek auth, sudah di layout
  useEffect(() => {
    const fetchTrees = async () => {
      setTreesLoading(true);
      const token = localStorage.getItem('access_token');
      
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

        const userRes = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
       

        const userData = await userRes.json();

      try {
        const treesRes = await fetch(`${apiUrl}/api/v1/trees`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const treesJson = await treesRes.json();
          console.log('Trees response:', treesJson);

          // Handle berbagai kemungkinan wrapper
          const raw = treesJson?.data ?? treesJson?.trees ?? treesJson ?? [];
          setTrees(Array.isArray(raw) ? raw : []);
      } catch (e) { console.error(e); }
      finally { setTreesLoading(false); }
    };
    fetchTrees();
  }, []);

  const fetchUpdates = useCallback(async (tree: Tree) => {
    setUpdatesLoading(true);
    setUpdates([]);
    try {
      const res  = await adminApi.getUpdatesByTreeId(tree.id);
      const list = res?.data ?? res ?? [];
      setUpdates(Array.isArray(list) ? list : []);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat update', 'error');
    } finally { setUpdatesLoading(false); }
  }, []);

  const handleSelectTree = (tree: Tree) => {
    setSelectedTree(tree);
    fetchUpdates(tree);
  };

  const handleCreate = async (data: TreeUpdatePayload) => {
    if (!selectedTree) return;
    setFormLoading(true);
    try {
      await adminApi.createTreeUpdate(selectedTree.id, data);
      showToast('Update berhasil ditambahkan', 'success');
      setIsFormOpen(false);
      fetchUpdates(selectedTree);
    } catch (err: any) { showToast(err.message || 'Gagal menambahkan update', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (data: TreeUpdatePayload) => {
    if (!selectedTree || !editingUpdate) return;
    setFormLoading(true);
    try {
      await adminApi.updateTreeUpdate(selectedTree.id, editingUpdate.id, data);
      showToast('Update berhasil diubah', 'success');
      setEditingUpdate(null); setIsFormOpen(false);
      fetchUpdates(selectedTree);
    } catch (err: any) { showToast(err.message || 'Gagal mengubah update', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedTree || !deletingUpdate) return;
    setDeleteLoading(true);
    try {
      await adminApi.deleteTreeUpdate(selectedTree.id, deletingUpdate.id);
      showToast('Update berhasil dihapus', 'success');
      setDeletingUpdate(null);
      fetchUpdates(selectedTree);
    } catch (err: any) { showToast(err.message || 'Gagal menghapus update', 'error'); }
    finally { setDeleteLoading(false); }
  };

  const filteredTrees = trees.filter(t =>
    (t.species?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 gap-3">
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-gray-900 tracking-tight truncate">Manajemen Update Pohon</h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">Pilih pohon → kelola riwayat perkembangannya</p>
        </div>
        {selectedTree && (
          <button onClick={() => { setEditingUpdate(null); setIsFormOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors shadow-sm shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Update</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Tree list panel */}
        <div className={`bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 ${searchOpen ? 'w-64 md:w-72' : 'w-14'}`}>

          <div className="p-3 border-b border-gray-100 flex items-center gap-2 min-h-[56px]">
            {searchOpen ? (
              <>
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Cari pohon..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-gray-900 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors" />
                </div>
                <button onClick={() => setSearchOpen(false)} title="Perkecil panel"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </>
            ) : (
              <button onClick={() => setSearchOpen(true)} title="Perluas panel"
                className="w-full flex justify-center items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {searchOpen && (
            <div className="px-4 py-2 border-b border-gray-50">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filteredTrees.length} Pohon</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {treesLoading && searchOpen && (
              <div className="p-4 space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            )}
            {!treesLoading && filteredTrees.length === 0 && searchOpen && (
              <p className="p-5 text-center text-gray-400 text-sm">
                {searchQuery ? 'Pohon tidak ditemukan' : 'Belum ada data pohon'}
              </p>
            )}
            {filteredTrees.map(tree => (
              <button key={tree.id} onClick={() => handleSelectTree(tree)}
                title={!searchOpen ? `${tree.species?.name || 'Pohon'} · ${tree.serialNumber}` : ''}
                className={`w-full flex items-center gap-2.5 py-3 border-b border-gray-50 text-left transition-all hover:bg-gray-50 group
                  ${selectedTree?.id === tree.id ? 'bg-[#1E562A]/5 border-l-[3px] border-l-[#1E562A]' : 'border-l-[3px] border-l-transparent'}
                  ${searchOpen ? 'px-3' : 'px-2 justify-center'}`}>
                <div className="w-8 h-8 rounded-lg bg-gray-100 relative overflow-hidden shrink-0">
                  {tree.species?.mainImageUrl
                    ? <Image src={tree.species.mainImageUrl} alt="" fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Trees className="w-3.5 h-3.5 text-gray-400" /></div>
                  }
                </div>
                {searchOpen && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selectedTree?.id === tree.id ? 'text-[#1E562A]' : 'text-gray-800'}`}>
                        {tree.species?.name || 'Pohon'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{tree.serialNumber}</p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedTree?.id === tree.id ? 'text-[#1E562A]' : 'text-gray-300 group-hover:text-gray-400'}`} />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Updates panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
          {!selectedTree ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Trees className="w-7 h-7 text-gray-300" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Pilih pohon terlebih dahulu</p>
                <p className="text-gray-400 text-sm mt-1">Klik salah satu pohon di panel kiri</p>
              </div>
              <button onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors mt-1">
                <Search className="w-3.5 h-3.5" /> Buka Panel Pohon
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5 gap-3">
                <div className="min-w-0">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">{selectedTree.species?.name || 'Pohon'}</h2>
                  <p className="text-xs text-gray-500 italic truncate">{selectedTree.species?.latinName} · {selectedTree.serialNumber}</p>
                </div>
                <button onClick={() => fetchUpdates(selectedTree)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 shrink-0">
                  <RefreshCw className={`w-4 h-4 ${updatesLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {updatesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-40 bg-gray-200" />
                      <div className="p-3.5 space-y-3">
                        <div className="grid grid-cols-3 gap-2">{[1,2,3].map(j => <div key={j} className="h-12 bg-gray-100 rounded-lg" />)}</div>
                        <div className="grid grid-cols-2 gap-2"><div className="h-8 bg-gray-100 rounded-lg" /><div className="h-8 bg-gray-100 rounded-lg" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : updates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold">Belum ada update</p>
                    <p className="text-gray-400 text-sm mt-1">Tambahkan update pertama untuk pohon ini</p>
                  </div>
                  <button onClick={() => { setEditingUpdate(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1E562A] text-white rounded-lg text-sm font-semibold hover:bg-[#153f1e] transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Update Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {updates.map(update => (
                    <UpdateCard key={update.id} update={update}
                      onEdit={u => { setEditingUpdate(u); setIsFormOpen(true); }}
                      onDelete={u => setDeletingUpdate(u)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <UpdateFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingUpdate(null); }}
        onSubmit={editingUpdate ? handleEdit : handleCreate}
        initialData={editingUpdate ? {
          photoUrl: editingUpdate.photoUrl, heightCm: editingUpdate.heightCm,
          diameterCm: editingUpdate.diameterCm, co2AbsorbedTotal: editingUpdate.co2AbsorbedTotal,
          adminNotes: editingUpdate.adminNotes,
        } : undefined}
        isEdit={!!editingUpdate}
        isLoading={formLoading}
        treeName={selectedTree?.species?.name || ''}
      />
      <ConfirmDeleteModal
        isOpen={!!deletingUpdate}
        onClose={() => setDeletingUpdate(null)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}