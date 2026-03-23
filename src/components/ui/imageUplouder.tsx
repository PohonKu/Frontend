'use client';
 
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, ImageOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCloudinaryUpload } from '@/lib/upFotoCloudinary';
 
interface ImageUploaderProps {
  value: string;                    // URL saat ini (bisa kosong)
  onChange: (url: string) => void; // dipanggil dengan URL baru setelah upload
  label?: string;
  required?: boolean;
  disabled?: boolean;
}
 
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value, onChange, label = 'Foto', required = false, disabled = false,
}) => {
  const inputRef                    = useRef<HTMLInputElement>(null);
  const [dragging, setDragging]     = useState(false);
  const [preview,  setPreview]      = useState<string | null>(null);
  const [done,     setDone]         = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null); // ukuran asli sebelum kompres
 
  const { uploading, progress, compressedSize, uploadImage, error } = useCloudinaryUpload();
 
  const handleFile = async (file: File) => {
    // Validasi tipe
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WebP)');
      return;
    }
    // Validasi ukuran max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }
 
    // Tampilkan preview lokal dulu
    const blob = URL.createObjectURL(file);
    setPreview(blob);
    setDone(false);
    setOriginalSize(file.size); // simpan ukuran asli
 
    try {
      const url = await uploadImage(file);
      onChange(url);
      setDone(true);
      // Bersihkan blob preview setelah dapat URL asli
      URL.revokeObjectURL(blob);
      setPreview(null);
    } catch {
      // error sudah di-handle di hook, preview tetap tampil
    }
  };
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ''; // reset supaya bisa pilih file yang sama lagi
  };
 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
 
  const clearImage = () => {
    onChange('');
    setPreview(null);
    setDone(false);
    setOriginalSize(null);
  };
 
  const displaySrc = preview || value;
 
  return (
    <div className="space-y-1.5">
      {/* Label */}
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
 
      {/* Drop zone / preview */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && !disabled && inputRef.current?.click()}
        className={`relative w-full rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
          ${dragging ? 'border-[#1E562A] bg-[#1E562A]/5 scale-[1.01]' : 'border-dashed border-gray-200 hover:border-[#1E562A]/40 hover:bg-gray-50'}
          ${displaySrc ? 'h-44' : 'h-32'}
        `}
      >
        {displaySrc ? (
          <>
            {/* Gambar preview */}
            <Image
              src={displaySrc}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Overlay saat uploading */}
            {uploading && (
              <div className="absolute inset-0 bg-gray-900/60 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
                <div className="w-36 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-white text-xs font-semibold">{progress}%</p>
              </div>
            )}
            {/* Done checkmark + info ukuran */}
            {done && !uploading && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <div className="bg-[#1E562A] text-white px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[10px] font-bold">Berhasil diupload</span>
                </div>
                {originalSize && compressedSize && originalSize !== compressedSize && (
                  <div className="bg-gray-900/75 text-white px-2 py-1 rounded-md shadow-sm">
                    <span className="text-[10px] font-semibold">
                      {(originalSize / 1024).toFixed(0)} KB
                      {' → '}
                      <span className="text-green-300">{(compressedSize / 1024).toFixed(0)} KB</span>
                      {' '}
                      <span className="text-gray-300">
                        (-{Math.round((1 - compressedSize / originalSize) * 100)}%)
                      </span>
                    </span>
                  </div>
                )}
                {originalSize && compressedSize && originalSize === compressedSize && (
                  <div className="bg-gray-900/75 text-white px-2 py-1 rounded-md shadow-sm">
                    <span className="text-[10px] font-semibold text-gray-300">
                      {(compressedSize / 1024).toFixed(0)} KB — sudah optimal
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* Tombol hapus */}
            {!uploading && !disabled && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); clearImage(); }}
                className="absolute top-2 right-2 w-7 h-7 bg-gray-900/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Hint ganti foto */}
            {!uploading && !disabled && (
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-gray-600 text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm border border-gray-200">
                Klik untuk ganti
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="h-full flex flex-col items-center justify-center gap-2 px-4">
            {uploading ? (
              <>
                <Loader2 className="w-7 h-7 text-[#1E562A] animate-spin" />
                <div className="w-36 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E562A] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[#1E562A] text-xs font-semibold">Mengupload... {progress}%</p>
              </>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragging ? 'bg-[#1E562A] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700">
                    {dragging ? 'Lepas untuk upload' : 'Klik atau drag foto ke sini'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP · Maks 10MB · Auto dikompres ≤ 300 KB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
 
      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
 
      {/* URL manual sebagai fallback */}
      {!uploading && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">atau tempel URL langsung</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      )}
      {!uploading && (
        <input
          type="url"
          placeholder="https://res.cloudinary.com/..."
          value={value}
          onChange={e => { onChange(e.target.value); setPreview(null); setDone(false); }}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E562A]/20 focus:border-[#1E562A] transition-colors bg-white disabled:opacity-50"
        />
      )}
 
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
        disabled={uploading || disabled}
      />
    </div>
  );
};
 