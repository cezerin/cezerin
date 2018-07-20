import jwt from 'jsonwebtoken';
import CezerinClient from 'cezerin-client';
import serverSettings from './settings';

const TOKEN_PAYLOAD = { email: 'store', scopes: ['admin'] };
const STORE_ACCESS_TOKEN = jwt.sign(TOKEN_PAYLOAD, serverSettings.jwtSecretKey);

const api = new CezerinClient({
	apiBaseUrl: serverSettings.apiBaseUrl,
	ajaxBaseUrl: serverSettings.ajaxBaseUrl,
	apiToken: STORE_ACCESS_TOKEN
});

export default api;
