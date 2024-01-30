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
});