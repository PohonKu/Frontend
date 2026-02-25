'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Typography } from '@/components/ui/Typography';
import { usePathname } from 'next/navigation';
import { ProfileImage } from '@/components/profile/page';

export const Navbar = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const dropdownLinks = [
    { label: 'About', href: '/#about', sectionId: 'about' },
    { label: 'Project Area', href: '/#project-area', sectionId: 'project-area' },
    { label: 'Team Member', href: '/#team-member', sectionId: 'team-member' },
    { label: 'Sustainable Development Goals', href: '/#goals', sectionId: 'goals' },
  ];

  // Handle smooth scroll to section
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    // If not on home page, navigate to home first
    if (pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without triggering scroll
      window.history.pushState(null, '', `/#${sectionId}`);
    }
  };

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    // Check auth status
    setIsLoggedIn(!!localStorage.getItem('access_token'));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* --- LOGO --- */}
        <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <Image
            src="/images/Logo.svg"
            alt="PohonKu Logo"
            width={96}
            height={72}
            className="w-16 h-12 md:w-24 md:h-18 object-contain"
            priority
          />
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">

          {/* PohonKu Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 focus:outline-none group/btn">
              <Typography
                variant="nav-link"
                className="text-gray-900 group-hover/btn:text-[#1A581E] transition-colors"
              >
                PohonKu
              </Typography>
              <ChevronDown
                size={12}
                className={`text-gray-900 group-hover/btn:text-[#1A581E] transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-[#1A581E]' : ''
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-full left-0 mt-2 w-52 bg-[#1A581E] rounded-lg overflow-hidden transition-all duration-200 ${isDropdownOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
                }`}
            >
              <div className="py-2">
                {dropdownLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleScrollToSection(e, link.sectionId)}
                    className="block px-4 py-2.5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Typography variant="nav-link" weight="light" className="text-white">
                      {link.label}
                    </Typography>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <Link
            href="/contact"
            className="relative group/nav py-1"
          >
            <Typography variant="nav-link" className="text-gray-900 group-hover/nav:text-[#1A581E] transition-colors">
              Contact
            </Typography>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A581E] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>

          <Link
            href="/trees"
            className="relative group/nav py-1"
          >
            <Typography variant="nav-link" className="text-gray-900 group-hover/nav:text-[#1A581E] transition-colors">
              Tree List
            </Typography>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A581E] scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>

          {/* CTA Button */}
          <Link
            href={isLoggedIn ? "/adopt" : "/login?redirect=/adopt"}
            className="bg-[#1A581E] hover:bg-[#029146] text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Typography variant="button" className="text-white text-sm font-semibold">
              Adopt a Tree
            </Typography>
          </Link>

        </div>


        {/* --- PROFILE SECTION --- */}
        <div className="hidden lg:flex items-center">
          <div className="hidden lg:flex">
            <ProfileImage />
          </div>
        </div>

        {/* --- MOBILE HAMBURGER --- */}
        <button
          className="lg:hidden p-2 text-gray-900 hover:text-[#1A581E] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-5 flex flex-col gap-4 z-40 animate-in fade-in slide-in-from-top-4">
          {/* Mobile Dropdown */}
          <div className="flex flex-col gap-2 pb-4 border-b border-gray-100">
            <Typography variant="nav-link" className="text-[#1A581E] font-bold mb-2">
              PohonKu
            </Typography>
            <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-200">
              {dropdownLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    handleScrollToSection(e, link.sectionId);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-gray-600 hover:text-[#1A581E] transition-colors cursor-pointer"
                >
                  <Typography variant="nav-link">{link.label}</Typography>
                </a>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="block py-2 border-b border-gray-100 text-gray-900 hover:text-[#1A581E] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Typography variant="nav-link">Contact</Typography>
          </Link>

          <Link
            href="/trees"
            className="block py-2 border-b border-gray-100 text-gray-900 hover:text-[#1A581E] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Typography variant="nav-link">Tree List</Typography>
          </Link>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href={isLoggedIn ? "/adopt" : "/login?redirect=/adopt"}
              className="bg-[#1A581E] text-white py-3 rounded-lg text-center hover:bg-[#029146] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Typography variant="button" className="text-white">
                Adopt a Tree
              </Typography>
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/login?redirect=/dashboard"}
              className="text-center py-2 text-gray-500 hover:text-[#1A581E] transition-colors flex items-center justify-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/images/guestProfile.svg"
                alt="Profile"
                width={24}
                height={24}
                className="rounded-full border-2 border-transparent hover:border-[#1A581E] transition-colors lg:hidden"
              />
              <Typography variant="nav-link">Profile</Typography>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
