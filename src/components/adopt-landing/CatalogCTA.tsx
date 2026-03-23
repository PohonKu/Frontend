import React from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';

export default function CatalogCTA() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden z-10">
      
      <FadeIn className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-tilt font-bold text-[#f0f9f1] mb-8 leading-tight drop-shadow-lg">
          Koleksi Kehidupan.
        </h2>
        
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#A2E3B1] to-transparent mx-auto mb-8 opacity-70"></div>
        
        <p className="text-gray-200/90 font-sans text-xl mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Setiap pohon yang Anda adopsi memiliki cerita dan peran penting dalam memulihkan ekosistem nusantara. Temukan spesies yang tepat untuk diukir dengan nama Anda.
        </p>
        
        <Link 
          href="/trees" 
          className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium tracking-wide hover:bg-white/20 hover:border-[#A2E3B1]/50 transition-all duration-500 shadow-[0_4px_30px_rgba(162,227,177,0.15)] hover:shadow-[0_8px_40px_rgba(162,227,177,0.3)] hover:-translate-y-1 group"
        >
          <span className="text-lg font-sans">Eksplorasi Katalog</span>
          <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500 text-[#A2E3B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </FadeIn>
    </section>
  );
}
