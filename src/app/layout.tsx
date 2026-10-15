import type { Metadata } from "next";
// 1. Import font baru: Tilt_Warp dan Inria_Serif
import { Inter, Tilt_Warp, Inria_Serif } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";

// Inter — body text, descriptions, labels
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter-source",
});

// Tilt Warp — titles, subtitles, headings
const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tilt-source",
  display: "swap",
});

// Inria Serif — buttons, navigation links
const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // 300 (Light), 400 (Regular), 700 (Bold)
  variable: "--font-inria-source",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PohonKu",
  description: "PohonKu: Adopsi Tanaman Langka — program konservasi Fakultas Kehutanan UGM di Tahura Bunder, Gunungkidul.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={(await headers()).get('x-pohonku-locale') === 'en' ? 'en' : 'id'} data-scroll-behavior="smooth">
      <body className={`
        ${sans.variable} 
        ${tiltWarp.variable} 
        ${inriaSerif.variable} 
        font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col
      `}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
