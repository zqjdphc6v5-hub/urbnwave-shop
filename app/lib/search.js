/**
 * Returns the empty state of a predictive search result to reset the search state.
 * Used by SearchResultsPredictive to initialize the UI.
 */
export function getEmptyPredictiveSearchResult() {
  return {
    total: 0,
    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: [],
    },
  };
}

/**
 * A utility function that appends tracking parameters to a URL. 
 * Shopify uses these to track search conversion in your admin dashboard.
 * * @param {UrlWithTrackingParams} options
 */
export function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term,
}) {
  const url = new URL(baseUrl, 'http://localhost'); // Temporary base for parsing
  const searchParams = new URLSearchParams(extraParams);

  // We set 'q' directly. URLSearchParams handles encoding automatically.
  // Note: We avoid double-encoding the term here.
  if (term) {
    searchParams.set('q', term);
  }

  let queryString = searchParams.toString();

  // Append Shopify's internal tracking string if it exists.
  if (trackingParams) {
    queryString = queryString ? `${queryString}&${trackingParams}` : trackingParams;
  }

  return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
}

/**
 * @typedef {Object} UrlWithTrackingParams
 * @property {string} baseUrl
 * @property {string|null} [trackingParams]
 * @property {Record<string,string>} [params]
 * @property {string} term
 */

/** @typedef {import('storefrontapi.generated').PredictiveSearchQuery} PredictiveSearchQuery */
/** @typedef {import('storefrontapi.generated').RegularSearchQuery} RegularSearchQuery */

/**
 * @typedef {{
 * type: Type;
 * term: string;
 * error?: string;
 * result: {total: number; items: Items};
 * }} ResultWithItems
 * @template {'predictive' | 'regular'} Type
 * @template Items
 */

/** @typedef {ResultWithItems<'regular', RegularSearchQuery>} RegularSearchReturn */
/** @typedef {ResultWithItems<'predictive', NonNullable<PredictiveSearchQuery['predictiveSearch']>>} PredictiveSearchReturn */