import {Link} from '@shopify/hydrogen';
import {Money, Image} from '@shopify/hydrogen';

/**
 * @param {{
 * product: import('@shopify/hydrogen').ProductItemFragment;
 * loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = `/products/${product.handle}`;
  const isSoldOut = !product.availableForSale;

  return (
    <Link
      className="group flex flex-col gap-4 border border-transparent hover:border-neutral-800 p-2 transition-all duration-500"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* Image Container with Streetwear Effects */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
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
        
        {/* Status Badge */}
        {isSoldOut ? (
          <div className="absolute top-4 left-4 bg-white text-black text-[10px] font-black px-2 py-1 uppercase skew-x-[-10deg]">
            <span className="skew-x-[10deg] block">Sold Out</span>
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="skew-x-[10deg] block">In Stock</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        <h3 className="text-sm font-black uppercase tracking-tighter line-clamp-1 group-hover:text-red-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex justify-between items-center border-t border-neutral-900 pt-2">
           <span className="font-mono text-xs text-neutral-500 tracking-widest">
            PRICE_UNIT //
          </span>
          <span className="font-mono text-sm font-bold">
            <Money data={variant.price} />
          </span>
        </div>
      </div>
    </Link>
  );
}