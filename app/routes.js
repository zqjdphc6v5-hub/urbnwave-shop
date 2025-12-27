export default [
  {
    path: "/",
    file: "routes/_index.jsx",
  },
  {
    path: "/products/:handle",
    file: "routes/products.$handle.jsx",
  },
  {
    path: "/collections/:handle",
    file: "routes/collections.$handle.jsx",
  },
  {
    path: "/pages/:handle",
    file: "routes/pages.$handle.jsx",
  },
  {
    path: "/policies/:handle",
    file: "routes/policies.$handle.jsx",
  }
];