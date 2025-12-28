import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SearchFormPredictive,
  SearchResultsPredictive,
} from '~/components/SearchFormPredictive';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({cart, children, footer, header, isLoggedIn}) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} />
      {header && (
        <Header header={header} isLoggedIn={isLoggedIn} cart={cart} />
      )}
      <main>{children}</main>
      <Footer footer={footer} header={header} />
    </Aside.Provider>
  );
}

/**
 * @param {{cart: PageLayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <CartMain cart={cart} layout="aside" />
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button
                onClick={() => {
                  window.location.href = `/search`;
                }}
              >
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>
        <SearchResultsPredictive />
      </div>
    </Aside>
  );
}

/**
 * @param {{header: PageLayoutProps['header']}}
 */
function MobileMenuAside({header}) {
  return (
    header && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          header={header}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
      </Aside>
    )
  );
}

/**
 * @typedef {import('~/root').RootLoader} RootLoader
 * @typedef {import('~/root').LayoutProps & {children?: React.ReactNode}} PageLayoutProps
 */