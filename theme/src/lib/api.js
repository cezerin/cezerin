import CezerinClient from 'ucommerce-client';
import clientSettings from '../../../config/store';

const api = new CezerinClient({
	ajaxBaseUrl: clientSettings.ajaxBaseUrl || '/ajax'
});

export { api as default } from './settings';
