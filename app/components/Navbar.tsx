import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-40 bg-[#ff00ff] text-black">
      <div className="text-2xl font-black tracking-tighter uppercase select-none">
        Urbnwave
      </div>
      <button className="flex items-center gap-2 font-bold text-sm tracking-widest hover:opacity-70 transition-opacity uppercase">
        <span>Cart (0)</span>
        <ShoppingBag size={18} />
      </button>
    </nav>
  );
}