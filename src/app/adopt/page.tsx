'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import HeroSection from '@/components/adopt-landing/HeroSection';
import ImpactStats from '@/components/adopt-landing/ImpactStats';
import FeaturedTrees from '@/components/adopt-landing/FeaturedTrees';
import HowItWorks from '@/components/adopt-landing/HowItWorks';

export default function AdoptLandingPage() {
  const [heroName, setHeroName] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/login?redirect=${pathname}`);
    } else {
      setIsAuthorized(true);
    }
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1E562A] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Memeriksa otentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <HeroSection treeName={heroName} setTreeName={setHeroName} />
      <ImpactStats />
      <FeaturedTrees prefilledName={heroName} />
      <HowItWorks />
    </main>
  );
}
