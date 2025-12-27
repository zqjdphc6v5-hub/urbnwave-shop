import {Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from 'react-router';
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';

export const meta = ({data}) => {
  return [{title: `URBNWAVE | ${data?.product.title ?? ''}`}];
};

export async function loader(args) {
  const {handle} = args.params;
  const {storefront} = args.context;

  // 1. Get the selected variant based on URL params (size/color)
  const selectedOptions = getSelectedProductOptions(args.request);

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
    },
  });

  if (!product) {
    throw new Response(null, {status: 404});
  }

  // 2. Determine the selected variant or default to the first one
  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  return defer({product, selectedVariant});
}

export default function Product() {
  const {product, selectedVariant} = useLoaderData();

  return (
    <div className="product-page bg-neutral-950 min-h-screen text-white pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 border-b border-neutral-900">
        
        {/* LEFT COLUMN: Media Gallery (Scrollable) */}
        <div className="media-gallery border-r border-neutral-900">
          <div className="grid grid-cols-1">
            {product.media.nodes.map((media) => (
              <div key={media.id} className="w-full border-b border-neutral-900 last:border-b-0 relative group">
                 <Image
                    data={media.image}
                    sizes="(min-width: 45em) 50vw, 100vw"
                    className="w-full h-auto object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-red-600 bg-black/50 px-2 py-1 backdrop-blur-sm">
                    IMG_ID: {media.id.split('/').pop()}
                  </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Technical Data Sheet (Sticky) */}
        <div className="product-details md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:overflow-y-auto p-6 md:p-12 space-y-8 bg-neutral-950">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
               <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                {product.title}
              </h1>
              {selectedVariant.availableForSale && (
                <span className="animate-pulse w-2 h-2 bg-red-600 rounded-full mt-2"></span>
              )}
            </div>
            
            <div className="font-mono text-xs text-neutral-500 tracking-widest uppercase border-b border-neutral-800 pb-4">
              SKU_REF // {selectedVariant?.sku || 'N/A'}
            </div>
          </div>

          {/* Price */}
          <div className="price-section">
            <Money
              data={selectedVariant.price}
              className="text-3xl font-mono text-white"
            />
            {selectedVariant.compareAtPrice && (
              <Money
                data={selectedVariant.compareAtPrice}
                className="text-xl font-mono text-neutral-600 line-through ml-4"
              />
            )}
          </div>

          {/* Variant Selector */}
          <Suspense fallback={<div>LOADING_SPECS...</div>}>
            <VariantSelector
              handle={product.handle}
              options={product.options}
              variants={product.variants}
            >
              {({option}) => (
                <div key={option.name} className="space-y-3">
                  <h3 className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest">
                    SELECT_{option.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map(({value, isAvailable, isActive, to}) => (
                      <a
                        key={option.name + value}
                        href={to}
                        className={`
                          px-4 py-2 text-xs font-mono border transition-all duration-200 uppercase
                          ${isActive 
                            ? 'border-red-600 bg-red-600/10 text-red-500' 
                            : 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'}
                          ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}
                        `}
                      >
                        {value}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </VariantSelector>
          </Suspense>

          {/* Description (Parsed as HTML) */}
          <div className="prose prose-invert prose-sm font-mono text-neutral-400 border-t border-neutral-800 pt-6">
             <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </div>

          {/* Action Buttons */}
          <div className="pt-6">
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              analytics={{
                products: [product],
                totalValue: parseFloat(selectedVariant.price.amount),
              }}
            >
              {selectedVariant?.availableForSale ? 'INITIATE_ACQUISITION' : 'OUT_OF_STOCK'}
            </AddToCartButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Button Component matching your style
function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
          <button
            type="