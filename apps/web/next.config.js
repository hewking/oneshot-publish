module.exports = {
  compiler: {
    emotion: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://your-vercel-api-url.vercel.app/api/:path*' 
          : 'http://localhost:3001/api/:path*',
      },
    ]
  },
}