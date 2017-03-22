const baseUrl = 'http://localhost:3000';
const uploadRootDir = '/var/www/cezerin/public/static';

// config used by server side only
module.exports = {
  // used by API to build full url
  storeBaseUrl: baseUrl,

  // used in sign-in email
  adminLoginUrl: `${baseUrl}/admin/login`,

  // used by store server (render and ajax)
  apiBaseUrl: `${baseUrl}/api/v1`,

  nodeServerPort: 3000,
  nodeServerHost: '127.0.0.1',

  // used by API only
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
    // key to sign tokens
    jwtSecret: 'NyDlK17iuWP9k5IjXZOilSVdMvFylG',
    // key to sign store cookies
    cookieKey: '4BsUetCikZKSIYkJ6Si2Zkkox8B5Kl',
    // token to access API from store
    token: '---'
  },

  // path to upload files
  path: {
    categories: `${uploadRootDir}/categories`,
    products: `${uploadRootDir}/products`,
    files: `${uploadRootDir}/files`
  },

  // url to access uploaded files
  url: {
    categories: `${baseUrl}/static/categories`,
    products: `${baseUrl}/static/products`,
    files: `${baseUrl}/static/files`
  }
}
