'use client';

import React from 'react';
import HeroSection from '@/components/adopt-landing/HeroSection';
import ImpactStats from '@/components/adopt-landing/ImpactStats';
import FeaturedTrees from '@/components/adopt-landing/FeaturedTrees';
import HowItWorks from '@/components/adopt-landing/HowItWorks';

export default function AdoptLandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <HeroSection />
      <ImpactStats />
      <FeaturedTrees />
      <HowItWorks />
    </main>
  );
}
