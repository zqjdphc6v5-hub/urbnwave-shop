import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';

/**
 * Handles all cart mutations (Add, Update, Remove, Discount Codes).
 * This is triggered by <CartForm /> components in your UI.
 * @param {import('@remix-run/node').ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {cart} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User can pass one or more discount codes
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];

      // Combine existing discount codes with the new ones
      const existingDiscountCodes = inputs.discountCodes || [];

      result = await cart.updateDiscountCodes([
        ...existingDiscountCodes,
        ...discountCodes,
      ]);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity(inputs.buyerIdentity);
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    return statusMessage(cartResult, 303, {headers, errors, redirectTo});
  }

  return json(
    {cart: cartResult, errors},
    {status: 200, headers},
  );
}

/**
 * Loads the cart data for the standalone /cart page.
 * @param {import('@remix-run/node').LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {cart} = context;
  return json({cart: await cart.get()});
}

export default function Cart() {
  const {cart} = useLoaderData();

  return (
    <div className="cart">
      <h1>Cart</h1>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}

/**
 * Helper to handle redirects after cart actions
 */
function statusMessage(cart, status, {headers, errors, redirectTo}) {
  return json(
    {cart, errors},
    {
      status,
      headers: {
        ...headers,
        Location: redirectTo,
      },
    },
  );
}