/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static generation for better SEO
  output: 'standalone',
  
  // Optimize images for better performance and SEO
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compression for better page load speeds (SEO factor)
  compress: true,

  // Security headers for better SEO ranking
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirects for SEO (redirect old URLs to new ones)
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/activities',
        destination: '/at-home',
        permanent: true,
      },
    ];
  },

  // Enable experimental features for better performance
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
