import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from '~/styles/tailwind.css?url';
import {PageLayout} from '~/components/PageLayout';

/**
 * @type {import('@remix-run/node').LinksFunction}
 */
export const links = () => [
  {rel: 'stylesheet', href: resetStyles},
  {rel: 'stylesheet', href: appStyles},
  {rel: 'stylesheet', href: tailwindCss},
  {
    rel: 'preconnect',
    href: 'https://cdn.shopify.com',
  },
  {
    rel: 'preconnect',
    href: 'https://shop.app',
  },
  {rel: 'icon', type: 'image/svg+xml', href: favicon},
];

/**
 * @param {import('@remix-run/node').LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront, env} = context;
  const layout = await storefront.query(HEADER_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      footerMenuHandle: 'footer',
    },
  });

  const analytics = {
    shopId: layout.shop.id,
    shopName: layout.shop.name,
  };

  return {
    layout,
    analytics,
    nonce: context.nonce,
  };
}

export default function App() {
  const nonce = useNonce();
  const data = useRouteLoaderData('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <PageLayout {...data.layout}>
          <Outlet />
        </PageLayout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}