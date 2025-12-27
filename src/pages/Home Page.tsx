import React from 'react';
// These imports use the '@' alias from your vite.config.js
import HeroSection from '@/components/HeroSection';
import DropSection from '@/components/DropSection';
import Architects from '@/components/Architects';
import OriginStory from '@/components/OriginStory';
import ShopGrid from '@/components/ShopGrid';
import RevealAnimation from '@/components/RevealAnimation';
import Marquee from '@/components/Marquee';

export default function HomePage() {
  return (
    <>
    {/* Hero / Landing Section */}
      <HeroSection />

      {/* Scrolling Text Banner */}
      <Marquee />
      
      {/* Entry Animation Overlay */}
      <RevealAnimation />

      {/* Brand & Designer Story Sections */}
      <Architects />
      <DropSection />
      <OriginStory />

       {/* Product Grid */}
      <ShopGrid />

      

     

      
    </>
  );
}