import {Link} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';

export function SearchResults({term, result, children}) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({term, articles}) {
  if (!articles?.nodes.length) return null;

  return (
    <div className="search-result-section">
      <h2 className="text-xs font-mono uppercase text-neutral-500 tracking-[0.3em] mb-6">// ARTICLES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.nodes.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link key={article.id} prefetch="intent" to={articleUrl} className="p-4 border border-neutral-900 hover:border-red-600 transition-colors uppercase font-bold italic">
              {article.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}) {
  if (!pages?.nodes.length) return null;

  return (
    <div className="search-result-section">
      <h2 className="text-xs font-mono uppercase text-neutral-500 tracking-[0.3em] mb-6">// PAGES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.nodes.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link key={page.id} prefetch="intent" to={pageUrl} className="p-4 border border-neutral-900 hover:border-red-600 transition-colors uppercase font-bold italic">
              {page.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({term, products}) {
  if (!products?.nodes.length) return null;

  return (
    <div className="search-result-section">
      <h2 className="text-xs font-mono uppercase text-neutral-500 tracking-[0.3em] mb-6">// PRODUCTS</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => (
          <div>
            <div className="mb-8">
              <PreviousLink className="font-mono text-xs text-red-600 uppercase hover:italic">
                {isLoading ? 'SYNCING...' : '↑ PREVIOUS_BATCH'}
              </PreviousLink>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
              {nodes.map((product) => {
                const productUrl = urlWithTrackingParams({
                  baseUrl: `/products/${product.handle}`,
                  trackingParams: product.trackingParameters,
                  term,
                });
                const price = product?.selectedOrFirstAvailableVariant?.price;
                const image = product?.selectedOrFirstAvailableVariant?.image;

                return (
                  <Link key={product.id} prefetch="intent" to={productUrl} className="group">
                    {image && (
                      <div className="bg-neutral-900 aspect-square overflow-hidden mb-4 border border-neutral-800 group-hover:border-red-600 transition-all">
                        <Image data={image} alt={product.title} sizes="25vw" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    )}
                    <p className="text-sm font-black uppercase italic leading-none mb-2">{product.title}</p>
                    <small className="font-mono text-neutral-500">{price && <Money data={price} />}</small>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 border-t border-neutral-900 pt-8">
              <NextLink className="font-mono text-xs text-red-600 uppercase hover:italic">
                {isLoading ? 'SYNCING...' : 'LOAD_MORE_ASSETS ↓'}
              </NextLink>
            </div>
          </div>
        )}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return <p className="font-mono text-neutral-500 uppercase tracking-widest">QUERY_FAILURE: NO RESULTS FOUND.</p>;
}