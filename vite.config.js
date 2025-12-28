import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouter } from "@react-router/dev/vite";
import { hydrogen } from "@shopify/hydrogen/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    reactRouter(),
    hydrogen(),
  ],
});