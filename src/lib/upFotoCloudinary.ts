
import { useState } from 'react';
import { apiFetch } from './wrapper';

interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface UseCloudinaryUploadReturn {
  uploading: boolean;
  progress: number;                          // 0–100
  compressedSize: number | null;             // bytes hasil kompres, null sebelum upload
  error: string | null;
  uploadImage: (file: File) => Promise<string>; // returns secure_url
}


const TARGET_BYTES = 300 * 1024; // 300 KB — batas maksimal ukuran file yang dikirim
const MAX_WIDTH_PX = 1200;       // lebar maksimal gambar (pixel)
const QUALITY_INIT = 0.85;       // kualitas JPEG awal
const QUALITY_STEP = 0.05;       // penurunan quality per iterasi
const QUALITY_MIN  = 0.30;       // batas minimum quality (30%) sebelum scale-down dimensi
const SCALE_STEP   = 0.80;       // faktor scale-down dimensi (80% dari ukuran sebelumnya)
const DIM_MIN_PX   = 300;        // dimensi minimum — hindari gambar terlalu kecil
 

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Gagal export canvas ke Blob'))),
      'image/jpeg',
      quality,
    ),
);




// Kompresi gambar sebelum upload menggunakan canvas
const compressImage = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    const img    = new window.Image();
    const objUrl = URL.createObjectURL(file);
 
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      reject(new Error('Gagal memuat gambar — pastikan file adalah gambar yang valid'));
    };
 
    img.onload = async () => {
      URL.revokeObjectURL(objUrl);
 
      // File sudah kecil — skip kompresi
      if (file.size <= TARGET_BYTES) {
        resolve(file);
        return;
      }
 
      // Dimensi awal
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_WIDTH_PX) {
        h = Math.round((h * MAX_WIDTH_PX) / w);
        w = MAX_WIDTH_PX;
      }
 
      const canvas = document.createElement('canvas');
      const ctx    = canvas.getContext('2d')!;
      let quality  = QUALITY_INIT;
      let blob!: Blob;
 
      outerLoop: while (true) {
        // Render ke canvas dengan dimensi saat ini
        canvas.width  = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
 
        // Turunkan quality sampai target tercapai atau mentok minimum
        while (quality >= QUALITY_MIN) {
          try {
            blob = await canvasToBlob(canvas, quality);
          } catch (err) {
            reject(err);
            return;
          }
          if (blob.size <= TARGET_BYTES) break outerLoop; // ✓ ukuran sudah ok
          quality -= QUALITY_STEP;
        }
 
        // Quality mentok → scale-down dimensi dan coba lagi
        const newW = Math.round(w * SCALE_STEP);
        const newH = Math.round(h * SCALE_STEP);
        if (newW < DIM_MIN_PX) {
          // Dimensi sudah terlalu kecil, pakai hasil terakhir meski masih agak besar
          break outerLoop;
        }
        w       = newW;
        h       = newH;
        quality = QUALITY_INIT; // reset quality untuk putaran dimensi baru
      }
 
      const outName = file.name.replace(/\.[^.]+$/, '') + '_compressed.jpg';
      resolve(new File([blob], outName, { type: 'image/jpeg', lastModified: Date.now() }));
    };
 
    img.src = objUrl;
  });
export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [uploading,      setUploading]      = useState(false);
  const [progress,       setProgress]       = useState(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error,          setError]          = useState<string | null>(null);
 
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setCompressedSize(null);
 
    try {
      // ── Step 1: Kompres ke ≤ 300 KB ────────────────────────────────────────
      setProgress(10);
      const compressed = await compressImage(file);
      setCompressedSize(compressed.size);
      setProgress(25);
 
      // ── Step 2: Minta signed signature dari backend ─────────────────────────
      const sigRes = await apiFetch<{ data: UploadSignature }>('/api/v1/upload/signature');
      const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;
      setProgress(40);
 
      // ── Step 3: Upload ke Cloudinary via XHR (ada progress) ────────────────
      const formData = new FormData();
      formData.append('file',      compressed);
      formData.append('signature', signature);
      formData.append('timestamp', String(timestamp));
      formData.append('api_key',   apiKey);
      formData.append('folder',    folder);
 
      const secureUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
 
        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) {
            // Progress 40–100% untuk fase upload aktual
            setProgress(40 + Math.round((e.loaded / e.total) * 60));
          }
        });
 
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText).secure_url);
          } else {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData?.error?.message || 'Upload ke Cloudinary gagal'));
          }
        });
 
        xhr.addEventListener('error',  () => reject(new Error('Koneksi terputus saat upload')));
        xhr.addEventListener('abort',  () => reject(new Error('Upload dibatalkan')));
 
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
      });
 
      setProgress(100);
      return secureUrl;
 
    } catch (err: any) {
      const msg = err.message || 'Gagal mengupload foto';
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };
 
  return { uploading, progress, compressedSize, error, uploadImage };
};
 