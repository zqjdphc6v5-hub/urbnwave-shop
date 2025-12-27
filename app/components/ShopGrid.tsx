"use client";

import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import Reveal from './RevealAnimation';

const SHOPIFY_DOMAIN = "your-shop-name.myshopify.com"; 
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = "your-public-storefront-access-token";

const MOCK_PRODUCTS = [
  { id: '1', title: 'Oversized Acid Wash Tee', handle: 'oversized-acid-tee', price: '45.00', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop' },
  { id: '2', title: 'Tactical Cargo Pant V2', handle: 'tactical-cargo-v2', price: '120.00', img: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=1000&auto=format&fit=crop' },
  { id: '3', title: 'Nocturnal Hoodie', handle: 'nocturnal-hoodie', price: '95.00', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop' },
  { id: '4', title: 'Industrial Belt / Yellow', handle: 'industrial-belt-yellow', price: '35.00', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop' },
  { id: '5', title: 'Distressed Denim Jacket', handle: 'distressed-denim', price: '150.00', img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop' },
  { id: '6', title: 'Tech Runner Sneakers', handle: 'tech-runner', price: '180.00', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop' },
  { id: '7', title: 'Concrete Beanie', handle: 'concrete-beanie', price: '25.00', img: 'https://images.unsplash.com/photo-1576063182653-d87d292a32e2?q=80&w=1000&auto=format&fit=crop' },
  { id: '8', title: 'Layered Mesh Longsleeve', handle: 'layered-mesh', price: '60.00', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop' },
  { id: '9', title: 'Utility Vest / Black', handle: 'utility-vest', price: '85.00', img: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1000&auto=format&fit=crop' },
  { id: '10', title: 'Reflective Windbreaker', handle: 'reflective-windbreaker', price: '140.00', img: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=1000&auto=format&fit=crop' },
  { id: '11', title: 'Cyberpunk Socks (3-Pack)', handle: 'cyberpunk-socks', price: '20.00', img: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1000&auto=format&fit=crop' },
  { id: '12', title: 'Archive Cap / Faded', handle: 'archive-cap', price: '40.00', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop' },
];

const ProductSkeleton = ({ id }: { id: string }) => (
  <div className="border border-neutral-800 p-4 md:p-6 flex flex-col justify-between h-[650px] md:h-[600px] hover:border-neutral-500 transition-colors duration-300 group cursor-pointer bg-neutral-950">
    <div className="w-full h-[460px] md:h-[450px] bg-neutral-900/50 border border-neutral-800 relative flex items-center justify-center overflow-hidden">
      <div className="absolute w-full h-[1px] bg-neutral-800 transform rotate-45"></div>
      <div className="absolute w-full h-[1px] bg-neutral-800 transform -rotate-45"></div>
      <div className="text-neutral-700 font-mono text-xs z-10 bg-black px-2">LOADING_DATA_{id}</div>
    </div>
    <div className="space-y-2 mt-4">
      <div className="h-4 w-3/4 bg-neutral-900 animate-pulse"></div>
      <div className="h-3 w-1/2 bg-neutral-900 animate-pulse"></div>
    </div>
  </div>
);

// Define a minimal type for the product structure we expect
interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  images?: {
    edges: {
      node: {
        url: string;
        altText?: string;
      }
    }[]
  };
  img?: string; // Fallback for mock data
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    }
  };
  price?: string; // Fallback for mock data
}

const ProductCard = ({ product }: { product: Product }) => {
  const image = product.images?.edges?.[0]?.node || { url: product.img, altText: product.title };
  const price = product.priceRange?.minVariantPrice || { amount: product.price, currencyCode: 'USD' };
  
  return (
    <a href={`https://${SHOPIFY_DOMAIN}/products/${product.handle}`} target="_blank" rel="noopener noreferrer" className="h-full block">
      <div className="border border-neutral-800 p-4 md:p-6 flex flex-col justify-between h-[650px] md:h-[600px] hover:border-neutral-500 transition-colors duration-300 group cursor-pointer bg-neutral-950 relative overflow-hidden">
        {/* NEW: Scanline Effect on Hover */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(transparent_0%,rgba(0,255,0,0.1)_50%,transparent_100%)] bg-[length:100%_4px]" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff00ff] z-20 opacity-0 group-hover:opacity-100 animate-scanline" />
        
        <div className="w-full h-[460px] md:h-[450px] bg-neutral-900 relative flex items-center justify-center overflow-hidden">
          {image.url ? (
            <img src={image.url} alt={image.altText || product.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="text-neutral-600 font-mono text-xs">NO_IMAGE</div>
          )}
        </div>
        <div className="space-y-1 mt-4">
          <h3 className="text-lg md:text-xl font-black uppercase leading-tight line-clamp-2">{product.title}</h3>
          <p className="font-mono text-xs text-neutral-500">// {product.handle.toUpperCase().replace(/-/g, '_')}</p>
        </div>
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-neutral-900">
          <div className="font-mono text-sm font-bold text-[#ff00ff]">
            {price.amount && parseFloat(price.amount).toLocaleString(undefined, { style: 'currency', currency: price.currencyCode || 'USD' })}
          </div>
          <div className="bg-neutral-900 p-3 md:p-2 text-neutral-400 group-hover:text-white group-hover:bg-[#ff00ff] group-hover:text-black transition-all">
            <Plus size={16} />
          </div>
        </div>
        <style>{`
          @keyframes scanline { 0% { top: 0%; } 100% { top: 100%; } }
          .animate-scanline { animation: scanline 2s linear infinite; }
        `}</style>
      </div>
    </a>
  );
};

export default function ShopGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopifyProducts = async () => {
      // Basic check if user replaced the placeholders
      if (SHOPIFY_DOMAIN.includes("your-shop") || SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes("your-public")) {
        console.log("Using Mock Data");
        // Simulate loading then load mock data
        setLoading(true);
        setTimeout(() => {
          setProducts(MOCK_PRODUCTS);
          setLoading(false);
        }, 1200);
        return;
      }

      const query = `
        {
          products(first: 12) {
            edges {
              node {
                id
                title
                handle
                description
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({ query }),
        });

        const json = await response.json();
        
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }

        setProducts(json.data.products.edges.map((edge: any) => edge.node));
        setLoading(false);
      } catch (err) {
        console.error("Shopify Fetch Error:", err);
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
      }
    };

    fetchShopifyProducts();
  }, []);

  return (
    <section className="bg-black text-white min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-neutral-800 pb-8">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">COLLECTION 01</h2>
            <span className="font-mono text-neutral-500 mt-4 md:mt-0">[ 12 ITEMS / READY TO SHIP ]</span>
          </Reveal>
        </div>

        {SHOPIFY_DOMAIN.includes("your-shop") && !loading && (
           <Reveal>
             <div className="mb-8 p-3 border border-neutral-800 bg-neutral-900/50 text-neutral-500 font-mono text-xs flex items-center gap-3">
               <AlertCircle size={16} />
               <span>DEMO MODE: DISPLAYING MOCK DATA. CONNECT SHOPIFY API TO LOAD REAL INVENTORY.</span>
             </div>
           </Reveal>
        )}

        <div id="shopify-collection-container" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
             [...Array(12)].map((_, i) => (
              <ProductSkeleton key={i} id={String(i + 1).padStart(2, '0')} />
            ))
          ) : (
            products.map((product, i) => (
              <Reveal key={product.id} delay={i * 50}>
                <ProductCard product={product} />
              </Reveal>
            ))
          )}
        </div>
        
        <Reveal delay={200}>
          <div className="mt-24 text-center border-t border-neutral-900 pt-12">
            <p className="font-mono text-xs text-neutral-600 mb-4">
              // END OF COLLECTION
            </p>
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm font-bold tracking-widest uppercase border-b border-white pb-1 hover:text-[#ff00ff] hover:border-[#ff00ff] transition-colors"
            >
                Back to Top
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}