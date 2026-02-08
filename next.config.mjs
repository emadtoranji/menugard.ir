/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';

function hourToSecond(hours) {
  return hours * 3600;
}

function dayToSecond(days) {
  return days * 86400;
}

const nextConfig = {
  cacheComponents: isProduction,
  cacheLife: {
    '/': {
      stale: hourToSecond(3),
      revalidate: dayToSecond(1),
      expire: dayToSecond(3),
    },
    '/sitemap': {
      stale: hourToSecond(6),
      revalidate: hourToSecond(12),
      expire: dayToSecond(31),
    },
    '/[lng]/(components)/footer': {
      stale: dayToSecond(1),
      revalidate: dayToSecond(30),
      expire: dayToSecond(60),
    },
    '/[lng]/(home)': {
      stale: dayToSecond(7),
      revalidate: dayToSecond(30),
      expire: dayToSecond(60),
    },
    '/[lng]/(store)/(all-stores)/store': {
      stale: hourToSecond(1),
      revalidate: hourToSecond(3),
      expire: hourToSecond(6),
    },
    '/[lng]/(store)/(one-store)/store/[slug]': {
      stale: hourToSecond(1),
      revalidate: hourToSecond(3),
      expire: hourToSecond(6),
    },
    '/[lng]/[...rest]': {
      stale: dayToSecond(1),
      revalidate: dayToSecond(3),
      expire: dayToSecond(14),
    },
    '/[lng]/dashboard/(overview)': {
      stale: 600, // 10 minutes
      revalidate: 1800, // 30 minutes
      expire: hourToSecond(3),
    },
    '/[lng]/dashboard/finance': {
      stale: 60, // 60 seconds
      revalidate: 60, // 60 seconds
      expire: hourToSecond(1),
    },
    '/[lng]/dashboard/faqs': {
      stale: dayToSecond(1),
      revalidate: dayToSecond(30),
      expire: dayToSecond(60),
    },
    '/[lng]/manifest.json': {
      stale: hourToSecond(1),
      revalidate: hourToSecond(3),
      expire: hourToSecond(6),
    },
  },
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  //output: 'standalone',
  reactCompiler: true,
  trailingSlash: false,
  compress: true,

  compiler: {
    removeConsole: isProduction,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: isProduction
              ? 'max-age=31536000; includeSubDomains; preload'
              : 'max-age=1',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
