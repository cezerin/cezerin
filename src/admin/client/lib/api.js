import api from 'cezerin-client'
import settings from 'lib/settings'

let token = localStorage.getItem('dashboard_token');
if(token) {
  api.init(settings.apiBaseUrl, token);
}

export default api;
