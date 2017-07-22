import api from 'cezerin-client'
import settings from 'lib/settings'

let token = localStorage.getItem('dashboard_token');
if(token) {
  api.init(settings.apiBaseUrl, token);
}

let webstoreToken = localStorage.getItem('webstore_token');
if(webstoreToken) {
  api.webstore.init(webstoreToken);
}

export default api;
