import {Await, NavLink, useAsyncValue} from 'react-router';
import {Suspense} from 'react';
import {useAside} from '~/components/Aside';

export function Header({header, cart, isLoggedIn}) {
  const {shop, menu} = header;

  return (
    <header className="header fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4 h-16 md:h-20 max-w-[1920px] mx-auto">
        
        {/* LEFT: Logo / Brand */}
        <NavLink prefetch="intent" to="/" className="z-10 group">
          <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white group-hover:text-red-600 transition-colors">
            {shop.name}
            <span className="hidden md:inline-block text-[10px] font-mono font-normal text-neutral-500 ml-2 not-italic tracking-widest">
              // SYS.ONLINE
            </span>
          </h1>
        </NavLink>

        {/* CENTER: Navigation (Desktop) */}
        <nav className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
          {(menu?.items || []).map((item) => (
            <NavLink
              key={item.id}
              to={item.url}
              prefetch="intent"
              className={({isActive}) => `
                text-xs font-mono tracking-[0.2em] uppercase transition-colors
                ${isActive ? 'text-red-600 border-b border-red-600' : 'text-neutral-400 hover:text-white'}
              `}
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: Actions (Search / Cart) */}
        <div className="flex items-center gap-6 z-10">
          <SearchToggle />
          <CartToggle cart={cart} />
        </div>
      </div>
    </header>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="text-white hover:text-red-600 transition-colors" 
      onClick={() => open('search')}
    >
      <span className="sr-only">Search</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    </button>
  );
}

function CartToggle({cart}) {
  const {open} = useAside();
  
  return (
    <Suspense fallback={<CartBadge count={0} open={open} />}>
      <Await resolve={cart}>
        {(cart) => (
          <CartBadge 
            count={cart?.totalQuantity || 0} 
            open={open} 
          />
        )}
      </Await>
    </Suspense>
  );
}

function CartBadge({count, open}) {
  return (
    <button
      onClick={() => open('cart')}
      className="relative flex items-center gap-2 group"
    >
      <span className="hidden md:block font-mono text-[10px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
        System_Cart
      </span>
      <div className="flex items-center justify-center w-8 h-8 border border-neutral-700 bg-neutral-900 group-hover:border-red-600 transition-colors">
        <span className="font-mono text-xs text-white group-hover:text-red-600">
          [{count}]
        </span>
      </div>
    </button>
  );
}