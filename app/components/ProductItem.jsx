import {Link} from '@shopify/hydrogen';
import {Image, Money} from '@shopify/hydrogen';

export function ProductItem({product, loading}) {
  if (!product?.variants?.nodes?.length) return null;

  const variant = product.variants.nodes[0];
  const variantUrl = `/products/${product.handle}`;
  const isSoldOut = !product.availableForSale;

  return (
    <Link
      className="product-card group relative flex flex-col justify-between border border-neutral-800 bg-neutral-950 p-4 transition-all duration-300 hover:border-[#ff00ff] overflow-hidden"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* === CRT SCANLINE & MESH EFFECTS === */}
      
      {/* 1. THE LASER LINE (Pink) */}
      <div className="scan-laser" />

      {/* 2. THE CRT MESH (Grid lines) */}
      <div className="crt-mesh" />

      {/* ================================== */}

      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-4 z-10">
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="3/4"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
          />
        )}
        
        {isSoldOut ? (
          <div className="absolute top-4 left-4 bg-neutral-200 text-black text-[10px] font-black px-2 py-1 uppercase skew-x-[-10deg]">
            <span className="skew-x-[10deg] block">Sold Out</span>
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-[#ff00ff] text-black text-[10px] font-black px-2 py-1 uppercase skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="skew-x-[10deg] block">In Stock</span>
          </div>
        )}
      </div>

      <div className="space-y-1 relative z-20">
        <h3 className="text-sm font-black uppercase tracking-tighter line-clamp-1 text-neutral-300 group-hover:text-[#ff00ff] transition-colors">
          {product.title}
        </h3>
        <div className="flex justify-between items-center border-t border-neutral-800 pt-3 mt-2">
           <span className="font-mono text-[10px] text-neutral-500 tracking-widest">
            // PRICE
          </span>
          <span className="font-mono text-sm font-bold text-white group-hover:text-[#ff00ff] transition-colors">
            <Money data={variant.price} />
          </span>
        </div>
      </div>

      <style>{`
        /* 1. Laser Line Styles */
        .scan-laser {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #ff00ff;
          z-index: 40;
          box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
          opacity: 0; /* Hidden by default */
          pointer-events: none;
        }

        /* 2. Mesh Styles */
        .crt-mesh {
          position: absolute;
          inset: 0;
          z-index: 30;
          background: linear-gradient(
              rgba(18, 16, 16, 0) 50%, 
              rgba(0, 0, 0, 0.25) 50%
            ), 
            linear-gradient(
              90deg, 
              rgba(255, 0, 0, 0.06), 
              rgba(0, 255, 0, 0.02), 
              rgba(0, 0, 255, 0.06)
            );
          background-size: 100% 4px, 6px 100%;
          opacity: 0; /* Hidden by default */
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        /* 3. Hover Triggers */
        .group:hover .scan-laser {
          opacity: 1;
          animation: scanline 2s linear infinite;
        }
        
        .group:hover .crt-mesh {
          opacity: 1;
        }

        /* 4. Animation Keyframes */
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </Link>
  );
}