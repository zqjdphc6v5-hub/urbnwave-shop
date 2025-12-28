import {Link, useFetcher} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';
import {useAside} from './Aside';

/**
 * Component that renders predictive search results
 * @param {SearchResultsPredictiveProps}
 */
export function SearchResultsPredictive({children}) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

// Sub-components assignment
SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({term, articles, closeSearch}) {
  if (!articles.length) return null;
  return (
    <div className="predictive-search-result" key="articles">
      <h5 className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest mb-2">Articles</h5>
      <ul className="space-y-2">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });
          return (
            <li key={article.id}>
              <Link onClick={closeSearch} to={articleUrl} className="flex items-center gap-3 hover:text-red-600 transition-colors">
                {article.image?.url && (
                  <Image data={article.image} width={40} height={40} className="grayscale" />
                )}
                <span className="text-xs uppercase font-bold">{article.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({term, collections, closeSearch}) {
  if (!collections.length) return null;
  return (
    <div className="predictive-search-result" key="collections">
      <h5 className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest mb-2">Collections</h5>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });
          return (
            <li key={collection.id}>
              <Link onClick={closeSearch} to={collectionUrl} className="flex items-center gap-3 hover:text-red-600 transition-colors">
                {collection.image?.url && (
                  <Image data={collection.image} width={40} height={40} className="grayscale" />
                )}
                <span className="text-xs uppercase font-bold">{collection.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({term, pages, closeSearch}) {
  if (!pages.length) return null;
  return (
    <div className="predictive-search-result" key="pages">
      <h5 className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest mb-2">Pages</h5>
      <ul className="space-y-2">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });
          return (
            <li key={page.id}>
              <Link onClick={closeSearch} to={pageUrl} className="text-xs uppercase font-bold hover:text-red-600">
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({term, products, closeSearch}) {
  if (!products.length) return null;
  return (
    <div className="predictive-search-result" key="products">
      <h5 className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest mb-2">Products</h5>
      <ul className="space-y-4">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });
          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li key={product.id}>
              <Link to={productUrl} onClick={closeSearch} className="flex items-center gap-4 group">
                {image && <Image data={image} width={60} height={60} className="grayscale group-hover:grayscale-0 transition-all" />}
                <div>
                  <p className="text-sm font-black uppercase italic leading-none">{product.title}</p>
                  <small className="font-mono text-neutral-500">{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({queries, queriesDatalistId}) {
  if (!queries.length) return null;
  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => (
        suggestion ? <option key={suggestion.text} value={suggestion.text} /> : null
      ))}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({term}) {
  if (!term.current) return null;
  return (
    <p className="font-mono text-xs text-red-600 uppercase mt-4">
      NO ASSETS FOUND FOR: <q>{term.current}</q>
    </p>
  );
}

function usePredictiveSearch() {
  const fetcher = useFetcher({key: 'search'});
  const term = useRef('');
  const inputRef = useRef(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} = fetcher?.data?.result ?? getEmptyPredictiveSearchResult();
  return {items, total, inputRef, term, fetcher};
}