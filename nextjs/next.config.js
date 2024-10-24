/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler:
    process.env.NODE_ENV === "production"
      ? require.resolve("./cache-handler.mjs")
      : undefined,
  output: "standalone",
  cacheMaxMemorySize: 0, // disable default in-memory caching
};

module.exports = nextConfig;
