'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownLinks = [
    { label: 'About', href: '/about' },
    { label: 'Project Area', href: '/project-area' },
    { label: 'Team Member', href: '/team' },
    { label: 'Sustainable Development Goals', href: '/sdgs' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="w-full h-[96px] px-[70px] flex items-center justify-between">

        {/* --- 1. LOGO (KIRI) --- */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-[10px] p-[10px] opacity-100">
            <Image
              src="/images/Logo.svg"
              alt="PohonKu Logo"
              width={185}
              height={143.860595703125}
              className="object-contain"
              style={{ transform: 'rotate(0deg)' }}
            />
          </div>
        </Link>

        {/* --- 2. MENU ITEMS (TENGAH) --- */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-16">

            {/* Dropdown: PohonKu */}
            <div className="relative h-full flex items-center">
              <div
                className="relative inline-block"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 focus:outline-none group h-full">
                  <Typography
                    variant="beranda-nav"
                    className={`transition-colors ${isDropdownOpen ? 'text-[#1A581E]' : 'text-gray-900 group-hover:text-[#1A581E]'}`}
                  >
                    PohonKu
                  </Typography>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#1A581E]' : 'text-gray-900 group-hover:text-[#1A581E]'}`}
                  />
                </button>

                {/* Dropdown Content */}
                <div
                  className={`absolute top-full left-0 w-[310px] bg-[#1A581E] rounded-none mt-1
                    transition-all duration-200 origin-top z-50 transform
                    ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                  aria-hidden={!isDropdownOpen}
                >
                  <div className="flex flex-col divide-y divide-white">
                    {dropdownLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex min-h-[35px] px-4 py-2 items-center gap-[10px] transition-colors hover:bg-[#234f27]"
                      >
                        <Typography variant="beranda-nav" weight="light" className="text-white tracking-wide">
                          {link.label}
                        </Typography>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Link: Contact */}
            <Link href="/contact" className="group relative py-1">
              <Typography variant="beranda-nav" className="text-gray-900 group-hover:text-[#1A581E] transition-colors">
                Contact
              </Typography>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A581E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            {/* Link: Tree List */}
            <Link href="/trees" className="group relative py-1">
              <Typography variant="beranda-nav" className="text-gray-900 group-hover:text-[#1A581E] transition-colors">
                Tree List
              </Typography>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A581E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            {/* Button: Adopt a Tree */}
            <Link
              href="/adopt"
              className="bg-[#1A581E] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              <Typography variant="beranda-nav" className="text-white">
                Adopt a Tree
              </Typography>
            </Link>
          </div>
        </div>

        {/* --- 3. PROFILE SECTION (KANAN) --- */}
        <div className="hidden md:flex items-center gap-[10px] opacity-100 flex-shrink-0">
          <Link href="/profile" className="rounded-[20px]">
            <Image
              src="/images/guestProfile.svg"
              alt="Profile"
              width={40}
              height={40}
              className="hover:opacity-80 transition-opacity rounded-[20px]"
              style={{ transform: 'rotate(0deg)' }}
            />
          </Link>
        </div>

        {/* --- MOBILE HAMBURGER --- */}
        <button
          className="md:hidden p-2 text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-white border-b border-gray-100 shadow-lg p-6 flex flex-col gap-4 z-40 animate-in fade-in slide-in-from-top-4">

          {/* Dropdown in Mobile */}
          <div className="flex flex-col gap-3">
            <Typography variant="beranda-nav" className="text-[#1A581E] font-bold border-b border-gray-100 pb-2">PohonKu</Typography>
            <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-100">
              {dropdownLinks.map(link => (
                <Link key={link.label} href={link.href} className="block text-gray-600 hover:text-[#1A581E]">
                  <Typography variant="beranda-nav" className="font-normal">{link.label}</Typography>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/contact" className="py-2 border-b border-gray-100">
            <Typography variant="beranda-nav" className="text-gray-900">Contact</Typography>
          </Link>

          <Link href="/trees" className="py-2 border-b border-gray-100">
            <Typography variant="beranda-nav" className="text-gray-900">Tree List</Typography>
          </Link>

          <div className="flex flex-col gap-4 pt-2">
            <Link href="/adopt" className="bg-[#1A581E] text-white py-3 rounded-lg text-center hover:opacity-90 active:scale-95">
              <Typography variant="beranda-nav" className="text-white">Adopt a Tree</Typography>
            </Link>

            <Link href="/profile" className="text-center py-2 text-gray-500 hover:text-[#1A581E]">
              <Typography variant="beranda-nav">Profile</Typography>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};