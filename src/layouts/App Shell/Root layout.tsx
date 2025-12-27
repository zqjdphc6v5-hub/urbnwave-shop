import React from 'react';
import NoiseOverlay from '@/components/NoiseOverlay';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import '@/index.css'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NoiseOverlay />
      <Navbar />
      <main className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
        {children}
      </main>
      <Footer />
    </>
  );
}