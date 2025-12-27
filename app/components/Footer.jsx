import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-500 py-12 border-t border-neutral-900">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-2xl font-black tracking-tighter text-neutral-800 uppercase">
          Urbnwave
        </div>
        <p className="font-mono text-[10px] tracking-widest">
          © 2025 URBNWAVE. ALL HIDDEN DETAILS RESERVED.
        </p>
      </div>
    </footer>
  );
}