import {createContext, useContext, useEffect, useState} from 'react';
import {useLocation} from '@remix-run/react';

/**
 * A context to manage the state of the aside (sidebar) components.
 * This allows opening/closing the cart, search, and mobile menu from anywhere.
 */
const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');
  const location = useLocation();

  // Close the aside automatically whenever the URL changes
  useEffect(() => {
    setType('closed');
  }, [location]);

  // Accessibility: Close aside when pressing the Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setType('closed');
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'visible' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close}>
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

export function useAside() {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error('useAside must be used within an Aside.Provider');
  }
  return context;
}