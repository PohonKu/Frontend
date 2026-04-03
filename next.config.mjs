/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.pohonku.id',
      },
    ],

    domains: ['placeholder.com'],
  },

  async headers() {
    // Midtrans domains — both sandbox and production whitelisted
    const midtransDomains = [
      'https://app.sandbox.midtrans.com',
      'https://app.midtrans.com',
      'https://api.sandbox.midtrans.com',
      'https://api.midtrans.com',
    ].join(' ');

    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com ${midtransDomains}`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${midtransDomains}`,
      "img-src 'self' blob: data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      `connect-src 'self' https: ${midtransDomains}`,
      `frame-src ${midtransDomains}`,
      `frame-ancestors 'self' ${midtransDomains}`,
    ].join('; ');

    const securityHeaders = [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Content-Security-Policy', value: [
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://app.sandbox.midtrans.com https://app.midtrans.com",
          "frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
          "connect-src 'self' https://api.sandbox.midtrans.com https://api.midtrans.com",
        ].join('; '),
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
