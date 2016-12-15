const domain = 'http://localhost';
const rootDir = '/var/www/cezerin';

module.exports = {
  language: 'en',

  security: {
    jwtSecret: 'QjiYppcTZOBGHfFD4g0mZD'
  },
  server: {
    mongodb: 'mongodb://139.59.130.223:27017/shop'
  },

  path: {
    uploads: {
      categories: `${rootDir}/public/uploads/categories`,
      products: `${rootDir}/public/uploads/products`,
      files: `${rootDir}/public/uploads/files`
    }
  },

  url: {
    uploads: {
      categories: `${domain}/static/categories`,
      products: `${domain}/static/products`,
      files: `${domain}/static/files`
    }
  },
  store: {
    url: {
      base: `${domain}`
    }
  },
  api: {
    baseUrl: `${domain}/api`,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc0OTgxNTE1fQ.dEyqeTPqFErKqoFKXTi6joNMn8UHgTvGWsjNMHJ7owY'
  }
}
