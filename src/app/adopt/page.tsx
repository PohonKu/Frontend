'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/adopt-landing/HeroSection';
import ImpactStats from '@/components/adopt-landing/ImpactStats';
import CatalogCTA from '@/components/adopt-landing/CatalogCTA';
import HowItWorks from '@/components/adopt-landing/HowItWorks';
import ClientAuthGuard from '@/components/auth/ClientAuthGuard';

export default function AdoptLandingPage() {
  const [heroName, setHeroName] = useState('');

  return (
    <ClientAuthGuard>
      <main className="relative min-h-screen bg-[#0A120B] text-white overflow-hidden">
        {/* Global Fixed Background for seamless transitions */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A120B]/60 via-[#0A120B]/80 to-[#1A3626]/90 backdrop-blur-[4px]" />
        </div>

        <div className="relative z-10 w-full h-full">
          <HeroSection treeName={heroName} setTreeName={setHeroName} />
          <ImpactStats />
          <CatalogCTA />
          <HowItWorks />
        </div>
      </main>
    </ClientAuthGuard>
  );
}
