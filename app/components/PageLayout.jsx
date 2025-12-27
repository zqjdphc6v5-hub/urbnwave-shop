import {Await, Link} from '@shopify/hydrogen';
import {Suspense, useId} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  return (
    /* The Provider handles opening/closing sidebars (Cart/Search) */
    <Aside.Provider>
      {/* Apply the core branding to the main wrapper:
        - Dark background (bg-neutral-950)
        - White text
        - Red selection color for the streetwear vibe
      */}
      <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        
        {/* Overlays for Cart and Search */}
        <CartAside cart={cart} />
        <SearchAside />
        <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />

        {/* Global Navigation */}
        {header && (
          <Header
            header={header}
            cart={cart}
            isLoggedIn={isLoggedIn}
            publicStoreDomain={publicStoreDomain}
          />
        )}

        {/* Main Content Area - grows to push footer down */}
        <main className="flex-grow pt-24">
          {children}
        </main>

        {/* Global Footer */}
        <Footer
          footer={footer}
          header={header}
          publicStoreDomain={publicStoreDomain}
        />
      </div>
    </Aside.Provider>
  );
}

/**
 * Side Panel for the Shopping Cart
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="YOUR BAG">
      <Suspense fallback={<p className="p-6 font-mono text-sm animate-pulse">LOADING CART...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return (
              <div className="bg-neutral-900 h-full">
                <CartMain cart={cart} layout="aside" />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

/**
 * Side Panel for Search
 */
function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH THE ARCHIVE">
      <div className="predictive-search p-6 bg-neutral-900 h-full">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex flex-col gap-4">
              <input
                className="bg-transparent border-b-2 border-neutral-700 p-2 focus:border-red-600 outline-none uppercase font-bold tracking-widest text-lg"
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="FIND GEAR"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              <button 
                className="bg-white text-black font-black py-2 hover:bg-red-600 hover:text-white transition-all uppercase skew-x-[-10deg]"
                onClick={goToSearch}
              >
                <span className="skew-x-[10deg] block">EXECUTE</span>
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className="mt-8 font-mono text-xs animate-pulse">SCANNING DATABASE...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <div className="mt-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    className="block mt-4 text-red-600 font-bold hover:italic"
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    VIEW ALL {total} RESULTS →
                  </Link>
                ) : null}
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

/**
 * Side Panel for Mobile Navigation
 */
function MobileMenuAside({header, publicStoreDomain}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="DIRECTORY">
        <div className="bg-neutral-900 h-full p-6 text-2xl font-black italic uppercase">
          <HeaderMenu
            menu={header.menu}
            viewport="mobile"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </Aside>
    )
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */