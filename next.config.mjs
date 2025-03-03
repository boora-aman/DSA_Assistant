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
  // experimental: {
  //   webpackBuildWorker: true,
  //   parallelServerBuildTraces: true,
  //   parallelServerCompiles: true,
  // },
}

// Try to import user config
let userConfig = {}
try {
  userConfig = await import('./v0-user-next.config.js')
  userConfig = userConfig.default || userConfig
} catch (e) {
  // ignore error
  console.log('No user config found or error importing it')
}

// Merge configurations
function mergeConfig(baseConfig, userConfig) {
  if (!userConfig || typeof userConfig !== 'object') {
    return baseConfig
  }

  const mergedConfig = { ...baseConfig }
  
  for (const key in userConfig) {
    if (
      typeof baseConfig[key] === 'object' &&
      !Array.isArray(baseConfig[key]) &&
      baseConfig[key] !== null
    ) {
      mergedConfig[key] = {
        ...baseConfig[key],
        ...userConfig[key],
      }
    } else {
      mergedConfig[key] = userConfig[key]
    }
  }
  
  return mergedConfig
}

// Apply user configuration
const finalConfig = mergeConfig(nextConfig, userConfig)

export default finalConfig