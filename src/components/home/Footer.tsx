'use client';

import { usePathname } from 'next/navigation';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

// Custom SVG icon for TikTok
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Custom SVG icon for Flickr
const FlickrIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="8" cy="12" r="4" />
    <circle cx="16" cy="12" r="4" />
  </svg>
);

export const Footer = () => {
  const pathname = usePathname();

  // Conditional Rendering: Hide on dashboard, login, and contact routes
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/contact')) {
    return null;
  }

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'TikTok', icon: TiktokIcon, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Flickr', icon: FlickrIcon, href: 'https://flickr.com' }
  ];

  const eksplorasiLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Koleksi Pohon', href: '/trees' },
    { name: 'Adopsi Pohon', href: '/adopt' }
  ];

  const bantuanLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Hubungi Kami', href: '/contact' },
    { name: 'Syarat & Ketentuan', href: '/terms' }
  ];

  return (
    <footer className="w-full relative z-20 mt-auto bg-[#F3F6F4] border-t border-gray-200/60">

      {/* Top Area - Grid Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Column 1 - Brand */}
          <div className="flex flex-col items-start">
            <h2 className="font-serif text-3xl font-bold text-[#1A581E] tracking-wide mb-4">
              PohonKu
            </h2>
            <p className="text-gray-600 font-sans leading-relaxed max-w-[280px]">
              Melestarikan alam, mengukir kebaikan di Gunungkidul.
            </p>
          </div>

          {/* Column 2 - Eksplorasi Shortcuts */}
          <div className="flex flex-col">
            <h3 className="font-sans font-semibold text-lg text-[#1A581E] mb-6 relative w-max before:absolute before:bottom-[-4px] before:left-0 before:w-1/2 before:h-[2px] before:bg-transparent hover:before:bg-[#1A581E] before:transition-colors before:duration-300">
              Eksplorasi
            </h3>
            <ul className="flex flex-col space-y-4">
              {eksplorasiLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-sans text-gray-600 hover:text-[#1A581E] transition-all duration-300 inline-block transform hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Bantuan */}
          <div className="flex flex-col">
            <h3 className="font-sans font-semibold text-lg text-[#1A581E] mb-6 relative w-max before:absolute before:bottom-[-4px] before:left-0 before:w-1/2 before:h-[2px] before:bg-transparent hover:before:bg-[#1A581E] before:transition-colors before:duration-300">
              Bantuan
            </h3>
            <ul className="flex flex-col space-y-4">
              {bantuanLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-sans text-gray-600 hover:text-[#1A581E] transition-all duration-300 inline-block transform hover:translate-x-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Kontak */}
          <div className="flex flex-col">
            <h3 className="font-sans font-semibold text-lg text-[#1A581E] mb-6 relative w-max before:absolute before:bottom-[-4px] before:left-0 before:w-1/2 before:h-[2px] before:bg-transparent hover:before:bg-[#1A581E] before:transition-colors before:duration-300">
              Kontak Kami
            </h3>
            <ul className="flex flex-col space-y-4">
              <li className="font-sans text-gray-600">
                <span className="block font-medium text-sm text-gray-400 mb-1">Informasi Umum</span>
                <a href="https://wa.me/6285715538430" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A581E] transition-all duration-300 inline-block transform hover:translate-x-1">
                  +62 857-1553-8430 (Laras)
                </a>
              </li>
              <li className="font-sans text-gray-600">
                <span className="block font-medium text-sm text-gray-400 mb-1">Bantuan Teknis</span>
                <a href="https://wa.me/6281383857627" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A581E] transition-all duration-300 inline-block transform hover:translate-x-1">
                  +62 813-8385-7627 (Arsya)
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Area - Copyright & Socials */}
      <div className="border-t border-gray-200/60">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-sm font-sans text-gray-500 text-center md:text-left">
            Copyright © 2026 PohonKu. All Rights Reserved.
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.name === 'Flickr' ? '_blank' : undefined}
                  rel={social.name === 'Flickr' ? 'noopener noreferrer' : undefined}
                  className="text-gray-400 hover:text-[#1A581E] transition-all duration-300 hover:-translate-y-[2px] focus:outline-none"
                  aria-label={social.name}
                >
                  {social.name === 'TikTok' ? (
                    <Icon className="w-[18px] h-[18px]" />
                  ) : (
                    <Icon strokeWidth={1.5} className="w-[20px] h-[20px]" />
                  )}
                </a>
              );
            })}
          </div>

        </div>
      </div>

    </footer>
  );
};
