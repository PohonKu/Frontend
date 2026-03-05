'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/adopt-landing/HeroSection';
import ImpactStats from '@/components/adopt-landing/ImpactStats';
import FeaturedTrees from '@/components/adopt-landing/FeaturedTrees';
import HowItWorks from '@/components/adopt-landing/HowItWorks';

export default function AdoptLandingPage() {
  const [heroName, setHeroName] = useState('');

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <HeroSection treeName={heroName} setTreeName={setHeroName} />
      <ImpactStats />
      <FeaturedTrees prefilledName={heroName} />
      <HowItWorks />
    </main>
  );
}
