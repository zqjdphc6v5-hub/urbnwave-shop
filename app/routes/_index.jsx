import {useLoaderData} from 'react-router';
import {Suspense} from 'react';
import {Await} from '@shopify/hydrogen';

// --- THE CORRECT IMPORTS ---
// Since your file says "export default function Hero()",
// we must import them WITHOUT curly braces.
import Navbar from '~/components/Navbar';
import HeroSection from '~/components/HeroSection';
import Marquee from '~/components/Marquee';
import OriginStory from '~/components/OriginStory';
import ShopGrid from '~/components/ShopGrid';
import DropSection from '~/components/DropSection';
import Architects from '~/components/Architects';
import SiteFooter from '~/components/SiteFooter'; // Ensure you renamed footer.tsx to this
import NoiseOverlay from '~/components/NoiseOverlay';

export const meta = () => {
  return [{title: 'URBNWAVE | ARCHIVE'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);
  return {
    featuredCollection: collections.nodes[0],
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });
  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData();

  return (
    <div className="home bg-neutral-950 min-h-screen text-white selection:bg-red-600 selection:text-white">
      
      {/* 1. TEXTURE */}
      <NoiseOverlay />

      {/* 2. NAVIGATION */}
      <Navbar />

      {/* 3. HERO SECTION */}
      {/* We pass the collection data to your Hero */}
      <HeroSection collection={data.featuredCollection} />

      {/* 4. SCROLLER */}
      <Marquee />

      {/* 5. ABOUT */}
      <OriginStory />

      {/* 6. DROP/VIDEO */}
      <DropSection />

      {/* 7. PRODUCTS */}
      <ShopGrid products={data.recommendedProducts} />

      {/* 8. ARCHITECTS */}
      <Architects />

      {/* 9. FOOTER */}
      <SiteFooter />
    </div>
  );
}

// --- GRAPHQL QUERIES ---

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    availableForSale
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;