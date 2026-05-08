/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dsbtlltxfrcdjsbdfvxw.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
