import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      {
        protocol: "https",
        hostname: "purecatamphetamine.github.io",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth/).*)",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              isDev 
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'" 
                : "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Keep unsafe-eval for react-compiler, unsafe-inline for next.js hydration
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://www.figma.com",
              "font-src 'self' data:",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}`,
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
