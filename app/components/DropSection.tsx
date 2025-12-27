"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from './RevealAnimation';

const ASSETS = {
  dropHero: "https://modulate.com.au/URBNimages/Gemini_Generated_Image_4foae64foae64foa.png",
  dropDetail: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1000&auto=format&fit=crop",
};

export default function DropSection() {
  return (
    <section className="bg-black text-white py-24 px-6 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-neutral-800 pb-6">
          <Reveal>
            <h2 className="text-8xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-4">
              DROP<br/>001
            </h2>
            <div className="flex gap-4 items-center">
              <span className="bg-[#ff00ff] text-black px-3 py-1 font-mono text-sm font-bold tracking-widest">
                LIVE NOW
              </span>
              <span className="font-mono text-xs text-neutral-400">
                // EDITORIAL PREVIEW
              </span>
            </div>
          </Reveal>
          <Reveal delay={200} className="text-left md:text-right font-mono text-xs text-neutral-500 mt-8 md:mt-0">
            <p className="mb-1">LIMITED QUANTITY ///</p>
            <p className="mb-1">NO RESTOCKS ///</p>
            <p>WORLDWIDE SHIP ///</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[400px]">
          {/* Item 1: Large Feature */}
          <div className="md:col-span-2 md:row-span-2">
            <Reveal className="h-full">
              <div className="h-full min-h-[400px] border border-neutral-800 relative group overflow-hidden bg-neutral-900">
                <img 
                  src={ASSETS.dropHero} 
                  alt="Drop Hero" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <h3 className="text-4xl font-black uppercase italic mb-2">Heavyweight_Hoodie_V1</h3>
                    <p className="font-mono text-[#ff00ff] text-xl">$120.00</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Item 2: Vertical Detail */}
          <div className="md:col-span-1 md:row-span-2">
            <Reveal delay={200} className="h-full">
              <div className="h-full min-h-[400px] border border-neutral-800 relative group overflow-hidden bg-neutral-900">
                <img 
                src={ASSETS.dropDetail} 
                alt="Detail" 
                className="w-full h-full object-cover grayscale contrast-125 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute top-4 right-4 bg-black border border-white px-2 py-1 z-10">
                <span className="text-xs font-mono font-bold">DETAIL_VIEW</span>
              </div>
              <div className="absolute bottom-8 left-8">
                  <p className="font-black text-2xl rotate-[-90deg] origin-bottom-left text-neutral-500 group-hover:text-white transition-colors">TEXTURE</p>
              </div>
              </div>
            </Reveal>
          </div>

          {/* Item 3: Square Product */}
          <div className="md:col-span-1 md:row-span-1">
            <Reveal delay={300} className="h-full">
              <div className="h-full min-h-[300px] border border-neutral-800 relative group overflow-hidden p-8 flex flex-col justify-between bg-neutral-900/40 hover:bg-neutral-900 transition-colors">
                  <div className="font-mono text-xs text-neutral-500 border-b border-neutral-800 pb-2">ACCESSORY_01</div>
                  <div>
                    <div className="text-2xl font-black uppercase leading-tight mb-2">Utility Belt<br/>Black_Ops</div>
                    <p className="font-mono text-sm text-neutral-400">$45.00</p>
                  </div>
                  <ArrowRight className="self-end text-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300"/>
              </div>
            </Reveal>
          </div>

          {/* Item 4: CTA Block */}
          <div className="md:col-span-1 md:row-span-1">
            <Reveal delay={400} className="h-full">
              <div className="h-full min-h-[200px] border border-neutral-800 relative group overflow-hidden bg-white text-black p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#ff00ff] transition-colors duration-300">
                  <div className="text-center z-10">
                      <p className="font-black text-4xl tracking-tighter mb-2">VIEW ALL</p>
                      <p className="font-mono text-xs border-t border-black pt-2 inline-block">12 ITEMS</p>
                  </div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 mix-blend-multiply"></div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}