'use client';

import { usePathname } from 'next/navigation';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';

// Custom SVG icons for TikTok and Flickr
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const FlickrIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
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

  const scrollToFAQ = () => {
    window.location.href = '/faq';
  };

  const navigateToContact = () => {
    window.location.href = '/contact';
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', hoverClass: 'hover:bg-[#E4405F] hover:border-[#E4405F]' },
    { name: 'YouTube', icon: Youtube, href: '#', hoverClass: 'hover:bg-[#FF0000] hover:border-[#FF0000]' },
    { name: 'TikTok', icon: TiktokIcon, href: '#', hoverClass: 'hover:bg-[#000000] hover:border-[#000000]' },
    { name: 'Facebook', icon: Facebook, href: '#', hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2]' },
    { name: 'Twitter', icon: Twitter, href: '#', hoverClass: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]' },
    { name: 'Flickr', icon: FlickrIcon, href: '#', hoverClass: 'hover:bg-[#0063DC] hover:border-[#0063DC]' }
  ];

  return (
    <footer className="w-full relative z-20 mt-auto bg-transparent pb-8 pt-4 px-6 md:px-12">
      <div className="relative max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">

        {/* Left Section - Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:flex-1">
          <button
            onClick={scrollToFAQ}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/60 text-white font-tilt text-sm transition-all duration-300 hover:bg-white/10 hover:border-white focus:outline-none"
          >
            FAQ
          </button>
          <button
            onClick={navigateToContact}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-[#1A581E] font-tilt text-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg focus:outline-none"
          >
            HUBUNGI KAMI
          </button>
        </div>

        {/* Center Section - Copyright */}
        <div className="flex justify-center w-full md:w-auto md:flex-1 order-3 md:order-none">
          <p className="text-white/90 font-sans text-xs sm:text-sm text-center">
            Copyright © {new Date().getFullYear()} PohonKu. All Rights Reserved.
          </p>
        </div>

        {/* Right Section - Social Media */}
        <div className="flex justify-center md:justify-end w-full md:w-auto md:flex-1 gap-3 flex-wrap">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.hoverClass}`}
                aria-label={social.name}
              >
                <Icon width={18} height={18} />
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-black/90 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {social.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
