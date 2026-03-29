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
    const securityHeaders = [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Content-Security-Policy', value: [
          // ── script-src ─────────────────────────────────────────────────────
          // Tambahan: https://app.sandbox.midtrans.com (load snap.js)
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://app.sandbox.midtrans.com",
 
          // ── style-src ──────────────────────────────────────────────────────
          // Tambahan: Midtrans popup punya inline style sendiri
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://app.sandbox.midtrans.com",
 
          // ── font-src ───────────────────────────────────────────────────────
          "font-src 'self' https://fonts.gstatic.com https://app.sandbox.midtrans.com",
 
          // ── frame-src ──────────────────────────────────────────────────────
          // Midtrans Snap buka sebagai iframe / popup di dalam halaman
          "frame-src 'self' https://app.sandbox.midtrans.com https://*.midtrans.com",
 
          // ── connect-src ────────────────────────────────────────────────────
          // Tambahan: API call ke Midtrans dari frontend (token check, dll)
          "connect-src 'self' https: https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com",
 
          // ── img-src ────────────────────────────────────────────────────────
          "img-src 'self' blob: data: https:",
 
          // ── frame-ancestors ────────────────────────────────────────────────
          // Halaman ini tetap tidak boleh di-embed oleh siapapun
          "frame-ancestors 'none'",
 
          // ── default ────────────────────────────────────────────────────────
          "default-src 'self'",
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
