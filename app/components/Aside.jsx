// app/components/Aside.jsx
import {createContext, useContext, useState, useEffect} from 'react';

export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'; // Lock scroll when open
    } else {
      document.body.style.overflow = '';
    }
  }, [expanded]);

  return (
    <div
      aria-modal
      className={`fixed inset-0 z-50 transition-visibility duration-500 ${
        expanded ? 'visible' : 'invisible'
      }`}
    >
      {/* Backdrop / Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />

      {/* Drawer Panel */}
      <aside
        className={`
          absolute top-0 right-0 h-full w-[90vw] md:w-[500px] 
          bg-neutral-950 border-l border-neutral-800 
          shadow-[0_0_50px_rgba(0,0,0,0.8)]
          transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${expanded ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 h-16 md:h-20">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
            // {heading}
          </h3>
          <button
            className="text-neutral-500 hover:text-red-600 transition-colors"
            onClick={close}
          >
            <span className="sr-only">Close</span>
            {/* Custom "X" Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Drawer Content */}
        <main className="h-[calc(100%-5rem)] overflow-y-auto">
          {children}
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

export function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  const open = (mode) => setType(mode);
  const close = () => setType('closed');

  return (
    <AsideContext.Provider value={{type, open, close}}>
      {children}
    </AsideContext.Provider>
  );
}

export function useAside() {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}

// Helper to attach provider easily
Aside.Provider = AsideProvider;