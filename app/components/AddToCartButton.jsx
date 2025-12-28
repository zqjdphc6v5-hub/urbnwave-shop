import {CartForm} from '@shopify/hydrogen';

/**
 * @param {{
 * analytics?: unknown;
 * children: React.ReactNode;
 * disabled?: boolean;
 * lines: Array<import('@shopify/hydrogen').OptimisticCartLineInput>;
 * onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics || {})}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="w-full bg-red-600 text-white font-black py-4 uppercase tracking-[0.2em] skew-x-[-10deg] hover:bg-white hover:text-black transition-all disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
          >
            <span className="skew-x-[10deg] block">
              {fetcher.state !== 'idle' ? 'PROCESSING...' : children}
            </span>
          </button>
        </>
      )}
    </CartForm>
  );
}