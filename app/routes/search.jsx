import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {getEmptyPredictiveSearchResult} from '~/lib/search';

/**
 * @type {import('@remix-run/node').MetaFunction}
 */
export const meta = () => {
  return [{title: `URBNWAVE | ARCHIVE SEARCH`}];
};

/**
 * @param {import('@remix-run/node').LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  const result = await searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return json(result);
}

export default function SearchPage() {
  const {type, term, result, error} = useLoaderData();
  
  // Predictive results are handled by the Aside sidebar, not this page.
  if (type === 'predictive') return null;

  return (
    <div className="search-page bg-neutral-950 min-h-screen text-white pt-32 px-6">
      <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-12">
        Archive_Search
      </h1>
      
      <SearchForm className="mb-12">
        {({inputRef}) => (
          <div className="flex gap-4 border-b border-neutral-800 pb-4">
            <input
              className="bg-transparent text-2xl font-mono uppercase outline-none flex-grow"
              defaultValue={term}
              name="q"
              placeholder="ENTER CRITERIA..."
              ref={inputRef}
              type="search"
            />
            <button type="submit" className="text-red-600 font-black tracking-widest hover:italic">
              [EXECUTE]
            </button>
          </div>
        )}
      </SearchForm>

      {error && <p className="text-red-600 font-mono mb-8">SYSTEM_ERROR: {error}</p>}
      
      {!term || !result?.total ? (
        <div className="py-20 border-t border-neutral-900">
           <p className="font-mono text-neutral-500 uppercase tracking-[0.2em]">Zero results found for: {term || 'NULL'}</p>
        </div>
      ) : (
        <SearchResults result={result} term={term}>
          {({articles, pages, products, term}) => (
            <div className="space-y-20">
              <SearchResults.Products products={products} term={term} />
              <SearchResults.Pages pages={pages} term={term} />
              <SearchResults.Articles articles={articles} term={term} />
            </div>
          )}
        </SearchResults>
      )}
      
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/**
 * FULL SEARCH LOGIC
 */
async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 12});
  const term = String(url.searchParams.get('q') || '');

  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) throw new Error('No search data returned');

  const total = Object.values(items).reduce(
    (acc, val) => acc + (val?.nodes?.length || 0),
    0,
  );

  return {type: 'regular', term, error: errors?.[0]?.message, result: {total, items}};
}

/**
 * PREDICTIVE SEARCH LOGIC (FOR SIDEBAR)
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);

  if (!term) return {type: 'predictive', term, result: getEmptyPredictiveSearchResult()};

  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) throw new Error(errors[0].message);

  const total = Object.values(items || {}).reduce(
    (acc, item) => acc + (item?.length || 0),
    0,
  );

  return {type: 'predictive', term, result: {items, total}};
}

// GRAPHQL QUERIES (Truncated for brevity, keep your original definitions)
const SEARCH_QUERY = `#graphql ... `;
const PREDICTIVE_SEARCH_QUERY = `#graphql ... `;