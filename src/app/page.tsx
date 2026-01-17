import React from 'react';
import { Header } from '@/components/home/Header';
import { AboutSection } from '@/components/home/AboutSection';
import { EmptySection } from '@/components/home/EmptySection';

export default function Home() {
  return (
    <main>
      <Header />
      <AboutSection />
      <EmptySection />
    </main>
  );
}