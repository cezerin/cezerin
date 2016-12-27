import api from 'cezerin-client'
import settings from 'lib/settings'

let token = localStorage.getItem('token');
if(token) {
  api.init(settings.apiBaseUrl, token);
}

export default api;
