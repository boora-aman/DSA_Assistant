/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
    },
    webpack: (config) => {
      // Increase memory limit for webpack
      config.performance = {
        ...config.performance,
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000
      };
      return config;
    }
  }
  
  export default nextConfig