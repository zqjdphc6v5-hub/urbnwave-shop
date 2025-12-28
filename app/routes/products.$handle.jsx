import {Suspense} from 'react';
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';

/**
 * @type {import('@remix-run/node').MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `URBNWAVE | ${data?.product.title ?? ''}`}];
};

/**
 * @param {import('@remix-run/node').LoaderFunctionArgs}
 */
export async function loader(args) {
  const {handle} = args.params;
  const {storefront} = args.context;

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

  const selectedVariant = product.selectedVariant ?? product?.variants?.nodes[0];

  return defer({product, selectedVariant});
}

export default function Product() {
  const {product, selectedVariant} = useLoaderData();

  return (
    <div className="product-page bg-neutral-950 min-h-screen text-white pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 border-b border-neutral-900">
        
        {/* MEDIA GALLERY */}
        <div className="media-gallery border-r border-neutral-900">
          <div className="grid grid-cols-1">
            {product.media.nodes.map((media) => (
              <div key={media.id} className="w-full border-b border-neutral-900 last:border-b-0 relative group">
                 <Image
                    data={media.image}
                    sizes="(min-width: 45em) 50vw, 100vw"
                    className="w-full h-auto object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT DATA */}
        <div className="product-details md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:overflow-y-auto p-6 md:p-12 space-y-8 bg-neutral-950">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            {product.title}
          </h1>

          <div className="price-section">
            <Money data={selectedVariant.price} className="text-3xl font-mono text-white" />
          </div>

          <Suspense fallback={<div>LOADING_SPECS...</div>}>
            <VariantSelector
              handle={product.handle}
              options={product.options}
              variants={product.variants}
            >
              {({option}) => (
                <div key={option.name} className="space-y-3">
                  <h3 className="text-[10px] font-mono uppercase text-neutral-500 tracking-widest">{option.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map(({value, isAvailable, isActive, to}) => (
                      <a
                        key={value}
                        href={to}
                        className={`px-4 py-2 text-xs font-mono border transition-all ${isActive ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-neutral-800 text-neutral-400 hover:text-white'}`}
                      >
                        {value}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </VariantSelector>
          </Suspense>

          <div className="pt-6">
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
              disabled={!selectedVariant.availableForSale}
            >
              {selectedVariant.availableForSale ? 'INITIATE_ACQUISITION' : 'OUT_OF_STOCK'}
            </AddToCartButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddToCartButton({children, disabled, lines}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <button
          type="submit"
          disabled={disabled || fetcher.state !== 'idle'}
          className="w-full bg-red-600 text-white font-black py-4 uppercase tracking-widest skew-x-[-10deg] hover:bg-white hover:text-black transition-all disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          <span className="skew-x-[10deg] block">{children}</span>
        </button>
      )}
    </CartForm>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        sku
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url altText width height }
      }
      variants(first: 250) {
        nodes {
          id
          title
          availableForSale
          selectedOptions { name value }
        }
      }
      media(first: 10) {
        nodes {
          ... on MediaImage { id image { url altText width height } }
        }
      }
    }
  }
`;