const withGraphQL = require('next-plugin-graphql');

module.exports = withGraphQL({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  env: {
    GRAPHQL_API: process.env.GRAPHQL_API,
    'client-version': process.env.npm_package_version,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.GRAPHQL_API},
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
});