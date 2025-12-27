import {createAppLoadContext as createHydrogenContext} from '@shopify/hydrogen';

/**
 * The app load context is used to share data across the application.
 * This is where the Storefront client, session, and cart are initialized.
 * * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext['waitUntil']} waitUntil
 * @param {Cache} cache
 */
export function createAppLoadContext(request, env, waitUntil, cache) {
  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    sessionApi: {
      get: () => Promise.resolve({}),
      set: () => Promise.resolve(),
      destroy: () => Promise.resolve(),
    },
  });

  return {
    ...hydrogenContext,
    env,
  };
}

/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
/** @typedef {import('../env').Env} Env */