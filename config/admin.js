// config used by dashboard client side only
let domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
module.exports = {
  // dashboard UI language
  language: 'en',
  apiBaseUrl: `${domain}/api/v1`
}
