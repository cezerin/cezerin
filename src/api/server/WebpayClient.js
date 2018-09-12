import Webpay from 'webpay-nodejs';
import CERTIFICATES from './paymentGateways/TransbankCertificates';

export default new Webpay({
	commerceCode: CERTIFICATES.commerceCode,
	publicKey: CERTIFICATES.publicKey,
	privateKey: CERTIFICATES.privateKey,
	webpayKey: CERTIFICATES.webpayKey,
	env: Webpay.ENV.INTEGRACION
});
