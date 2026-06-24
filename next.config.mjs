/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The dynamic OG route (app/api/og) reads brand TTFs from lib/og-fonts at
  // runtime. Force them into that function's serverless bundle on Vercel — file
  // tracing won't pick up a runtime fs.readFile path on its own.
  outputFileTracingIncludes: {
    "/api/og": ["./lib/og-fonts/**"],
    "/api/og/story": ["./lib/og-fonts/**"],
  },
};

export default nextConfig;
