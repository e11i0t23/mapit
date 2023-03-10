/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; style-src 'self' 'unsafe-inline'  https://fonts.googleapis.com; form-action 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com  https://*.googleapis.com; connect-src 'self' https://maps.googleapis.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com ${process.env.NODE_ENV == "development" && "http://localhost:*"}; img-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com; base-uri 'self'; frame-ancestors 'self' https://*.elliot-powell.com; font-src 'self' https://fonts.gstatic.com;`,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}