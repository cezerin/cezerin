// config used by dashboard client side only
let domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
module.exports = {
  // dashboard UI language
  language: 'en',
<<<<<<< HEAD
  apiBaseUrl: '/api/v1'
=======
  apiBaseUrl: `${domain}/api/v1`
>>>>>>> ca2e58733491181e93ba2f35bb57f7f67df76ebd
}
