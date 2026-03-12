'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, LockKeyhole } from 'lucide-react';

interface AuthErrorModalProps {
  onCloseAction: () => void;
}

export default function AuthErrorModal({ onCloseAction }: AuthErrorModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    // Save current path to redirect back later, then go to login
    localStorage.setItem('post_login_redirect', pathname);
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onCloseAction}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          aria-label="Tutup modal"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2 mb-8">
          <div className="w-16 h-16 bg-[#1A581E]/10 rounded-full flex items-center justify-center mb-6 border border-[#1A581E]/20">
            <LockKeyhole className="w-8 h-8 text-[#1A581E]" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 font-tilt mb-3">
            Akses Membutuhkan Login
          </h2>
          
          <p className="text-gray-600 font-sans text-sm leading-relaxed max-w-[280px]">
            Untuk mengadopsi pohon dan memantau perkembangannya, Anda perlu masuk ke akun PohonKu terlebih dahulu.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleLoginClick}
            className="w-full bg-[#1A581E] hover:bg-[#154617] text-white font-bold py-3.5 px-4 rounded-xl font-sans tracking-wide shadow-lg shadow-[#1A581E]/20 transition-all focus:ring-4 focus:ring-[#1A581E]/30"
          >
            Lanjut ke Halaman Login
          </button>
          
          <button 
            onClick={onCloseAction}
            className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold py-3.5 px-4 rounded-xl font-sans tracking-wide transition-all"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
