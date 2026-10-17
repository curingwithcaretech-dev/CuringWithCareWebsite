const isDev = process.env.NODE_ENV !== "production";

// The site is fully static and loads nothing from other domains, so the policy only allows
// its own files. Static pages can't carry nonces, and Next writes a per-build inline bootstrap
// script into each page, so inline scripts are allowed (Next's documented setup for static
// sites). Dev mode also needs eval for fast refresh.
const scriptSrc = `'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`;
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Pages only: build assets and the research PDFs don't need a policy.
      {
        source: "/((?!_next/static|_next/image|research/|favicon.ico).*)",
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      },
    ];
  },
  async redirects() {
    return [
      // The 2025 Cancer Awareness & Action Challenge page now lives on the Research hub.
      { source: "/caac", destination: "/research", permanent: true },
    ];
  },
  images: {
    // 55 for the full-screen hero, 65 for other large photos, 75 everywhere else.
    qualities: [55, 65, 75],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
