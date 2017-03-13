const baseUrl = 'http://localhost:3000';
const uploadRootDir = '/var/www/cezerin/public/static';

module.exports = {
  storeBaseUrl: baseUrl,
  adminLoginUrl: `${baseUrl}/admin/login`,
  apiBaseUrl: `${baseUrl}/api/v1`,

  nodeServerPort: 3000,
  nodeServerHost: '127.0.0.1',
  mongodbServerUrl: 'mongodb://<user>:<pass>@<ip>:<port>/<db>',
  orderStartNumber: 1000,

  cartCookieOptions: {
    maxAge: 604800000,
    httpOnly: true,
    signed: true,
    secure: false,
    sameSite: 'strict'
  },

  referrerCookieOptions: {
    maxAge: 604800000,
    httpOnly: true,
    signed: true,
    secure: false,
    sameSite: 'strict'
  },

  security: {
    jwtSecret: '---',
    cookieKey: '---',
    token: '---'
  },

  path: {
    categories: `${uploadRootDir}/categories`,
    products: `${uploadRootDir}/products`,
    files: `${uploadRootDir}/files`
  },

  url: {
    categories: `${baseUrl}/static/categories`,
    products: `${baseUrl}/static/products`,
    files: `${baseUrl}/static/files`
  }
}
