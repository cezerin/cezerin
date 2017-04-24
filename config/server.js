// config used by server side only
const NODE_SERVER_PORT = 3000;
const NODE_SERVER_HOST = '127.0.0.1';

module.exports = {
  // used by store server (render and ajax)
  apiBaseUrl: `http://${NODE_SERVER_HOST}:${NODE_SERVER_PORT}/api/v1`,

  // used by
  ajaxBaseUrl: `http://${NODE_SERVER_HOST}:${NODE_SERVER_PORT}/ajax`,

  // used in sign-in email
  adminLoginUrl: '/admin/login',

  nodeServerPort: NODE_SERVER_PORT,
  nodeServerHost: NODE_SERVER_HOST,

  // used by API only
  mongodbServerUrl: 'mongodb://127.0.0.1:27017/shop',

  // key to sign tokens
  jwtSecretKey: '-',

  // key to sign store cookies
  cookieSecretKey: '-',

  // path to uploads
  categoriesUploadPath: 'public/static/categories',
  productsUploadPath: 'public/static/products',
  filesUploadPath: 'public/static/files',

  // url to uploads
  categoriesUploadUrl: '/static/categories',
  productsUploadUrl: '/static/products',
  filesUploadUrl: '/static/files',

  // store UI language
  language: 'en',
  orderStartNumber: 1000
}
