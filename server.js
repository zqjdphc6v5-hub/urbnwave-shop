// Virtual/magic modules
import * as remixBuild from 'virtual:remix/server-build';
import {
  createRequestHandler,
  getStorefrontApiStatus,
} from '@shopify/remix-oxygen';
import {createAppLoadContext} from '~/lib/context';

/**
 * Export a fetch handler in compliance with the OpenVector standard.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   */
  async fetch(request, env, executionContext) {
    try {
      /**
       * Open a cache instance in the worker and a fixed number of seconds.
       */
      const cache = await caches.open('hydrogen');
      const waitUntil = executionContext.waitUntil.bind(executionContext);

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => createAppLoadContext(request, env, waitUntil, cache),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /**
         * Check for Storefront API status to give a better error message
         * when the API is down or the domain/token are incorrect.
         */
        await getStorefrontApiStatus({
          publicStorefrontApiToken: env.PUBLIC_STOREFRONT_API_TOKEN,
          storeDomain: env.PUBLIC_STORE_DOMAIN,
        });
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};