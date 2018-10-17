import Webpay from 'webpay-nodejs';
import CERTIFICATES from './paymentGateways/TransbankCertificates';

export const WP = new Webpay({
	commerceCode: CERTIFICATES.commerceCode,
	publicKey: CERTIFICATES.publicKey,
	privateKey: CERTIFICATES.privateKey,
	webpayKey: CERTIFICATES.webpayKey,
	env: Webpay.ENV.INTEGRACION
});

export const webpayOrders = [];

export default {};
