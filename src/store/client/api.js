import CezerinClient from 'cezerin-client';
import clientSettings from './settings';

let webstoreToken = localStorage.getItem('webstore_token');

const api = new CezerinClient({
	ajaxBaseUrl: clientSettings.ajaxBaseUrl || '/ajax',
	apiBaseUrl: clientSettings.apiBaseUrl || '/api/v1',
	webstoreToken
});

export default api;
