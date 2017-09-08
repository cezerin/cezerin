import CezerinClient from 'cezerin-client'
import settings from 'lib/settings'

let api = null;
let dashboardToken = localStorage.getItem('dashboard_token');
let webstoreToken = localStorage.getItem('webstore_token');

if(dashboardToken) {
  api = new CezerinClient({
    apiBaseUrl: settings.apiBaseUrl || '/api/v1',
    apiToken: dashboardToken,
    webstoreToken: webstoreToken
  });
}

export default api;
