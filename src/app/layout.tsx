import type { Metadata } from "next";
// 1. Import font baru: Tilt_Warp dan Inria_Serif
import { Inter, Tilt_Warp, Inria_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

// Inter — body text, descriptions, labels
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Tilt Warp — titles, subtitles, headings
const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tilt",
  display: "swap",
});

// Inria Serif — buttons, navigation links
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
      <body className={`
        ${sans.variable} 
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