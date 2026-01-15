// src/types/index.ts

// 1. Definisikan 4 Kategori (Cluster) Sesuai Data Excel
export type TreeCategory = 
  | 'Perspektif Keistimewaan' 
  | 'Toponimi Gunungkidul' 
  | 'Native Karst' 
  | 'Sumbu Filosofi';

// 2. Status Pohon
export type TreeStatus = 'available' | 'sold' | 'maintenance';

// 3. Interface Spesies (Data Induk Jenis Pohon)
export interface TreeSpecies {
  id: string;
  name: string;             // Contoh: "Nangka"
  scientific_name: string;  // Contoh: "Artocarpus heterophyllus"
  description: string;      // Deskripsi singkat
  story_content: string;    // HTML Rich Text untuk storytelling
  image_url: string;        // URL Gambar
  co2_absorption: number;   // Estimasi serapan karbon (kg/thn)
  
  // Kategori Wajib Ada (Untuk Filter)
  category: TreeCategory; 
}

// 4. Interface Pohon (Unit Inventory)
export interface Tree {
  id: string;
  name: string;             // Contoh: "Nangka #01"
  price: number;            // Harga dalam Rupiah
  status: TreeStatus;       // Status jual
  
  // Lokasi Blok kita samakan dengan Kategori dulu untuk MVP
  location_block: string;   

  // Koordinat untuk Peta Statis (0-100%)
  coords: {
    lat: number;
    lng: number;
    x_percent?: number; // Posisi Horizontal di Peta Gambar
    y_percent?: number; // Posisi Vertikal di Peta Gambar
  };

  // Relasi ke Spesies
  species_id: string;
  species?: TreeSpecies;    // Optional karena di database aslinya ini relation
}

// 5. Interface User (Untuk Guest/Login nanti)
export interface User {
  id?: string;
  name: string;
  email: string;
  is_guest: boolean;
  image?: string;
}