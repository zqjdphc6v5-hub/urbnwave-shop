import React from 'react';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import DropSection from '@/components/DropSection';
import OriginStory from '@/components/OriginStory';
import ShopGrid from '@/components/ShopGrid';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <DropSection />
      <OriginStory />
      <ShopGrid />
    </>
  );
}