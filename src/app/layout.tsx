import type { Metadata } from "next";
// 1. Import font baru: Tilt_Warp dan Inria_Serif
import { Inter, Playfair_Display, Tilt_Warp, Inria_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

// Setup Font Existing
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

// 2. Setup Font Baru (Sesuai Request)
const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: "400", // Sesuai spec: Regular
  variable: "--font-tilt", // Kita namakan variable-nya ini
  display: "swap",
});

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // 300 (Light), 400 (Regular), 700 (Bold)
  variable: "--font-inria",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PohonKu",
  description: "Marketplace Konservasi Pohon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Masukkan variable ke dalam className Body */}
      <body className={`
        ${sans.variable} 
        ${serif.variable} 
        ${tiltWarp.variable} 
        ${inriaSerif.variable} 
        font-sans antialiased bg-gray-50 text-gray-900
      `}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}