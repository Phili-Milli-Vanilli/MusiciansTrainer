/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA Configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Statischer Export für PWA
  output: 'export',
  // Deaktiviere die Verwendung von React Strict Mode für bessere PWA-Leistung
  reactStrictMode: false,
  // Trailing Slash für bessere Kompatibilität
  trailingSlash: true,
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}

export default nextConfig
