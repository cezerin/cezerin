import CezerinClient from 'cezerin-client'
import clientSettings from '../../../config/store'

const api = new CezerinClient({
  ajaxBaseUrl: clientSettings.ajaxBaseUrl || '/ajax'
});

export default api;
