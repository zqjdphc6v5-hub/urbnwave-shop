"use client";

import React from 'react';
import Reveal from './RevealAnimation';
import ArchitectCard from './Architects';

const ASSETS = {
  kai: "https://modulate.com.au/URBNimages/Gemini_Generated_Image_ma9h0pma9h0pma9h.png",
  june: "https://modulate.com.au/URBNimages/Gemini_Generated_Image_qqcs4lqqcs4lqqcs.png",
};

export default function OriginStory() {
  return (
    <section className="bg-black text-white border-b border-neutral-800">
      <div className="px-6 py-20 md:px-12 md:py-24 border-b border-neutral-800 max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-neutral-100">THE ORIGIN</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <Reveal delay={200}>
              <p className="text-lg md:text-2xl text-neutral-400 leading-relaxed font-light">
                <span className="text-white font-bold">URBNWAVE</span> wasn't founded in a boardroom. It was found in the margins. It exists in the space between the structure of the city and the chaos of living in it. It is the collision of two distinct obsessions.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-4 flex items-end justify-end">
            <Reveal delay={400} className="w-full">
              <div className="h-[2px] w-full bg-neutral-800"></div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <ArchitectCard 
          name="KAI" 
          role="The Observer // Structure / Photo" 
          bio="Kai doesn’t just watch the city; he documents its bones. A Japanese teen transplanted to the Australian suburbs, he found comfort in the concrete. While others sleep, Kai stalks the empty car parks and neon-soaked alleyways of Melbourne, armed with a beat-up 35mm camera. He is obsessed with the permanent things: the brutalist architecture, the wet asphalt, the way yellow sodium light hits a steel beam. He captures the grid. He provides the order."
          img={ASSETS.kai}
          delay={0}
        />
        <ArchitectCard 
          name="JUNE" 
          role="The Breaker // Chaos / Sketch" 
          bio="If Kai builds the structure, June tears it down. She lives in the transient spaces—train stations, 24-hour food courts, the back of the bus. She believes in Wabi-Sabi: the idea that nothing is perfect, and nothing is finished until it’s been wrecked a little. June takes Kai’s pristine photographs and destroys them. Using a handheld scanner and a battered notebook thick with sketches, she glitches, crops, and distorts the reality. She adds the noise. She breaks the image just enough to make it feel like a memory."
          img={ASSETS.june}
          delay={200}
        />
      </div>
    </section>
  );
}