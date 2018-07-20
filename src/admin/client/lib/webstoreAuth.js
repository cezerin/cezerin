import messages from './text';

const LOGIN_PATH = '/admin/apps/login';
const HOME_PATH = '/admin/apps';

const getParameterByName = (name, url) => {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const validateCurrentToken = () => {
	if (location.pathname !== LOGIN_PATH) {
		if (!isCurrentTokenValid()) {
			location.replace(LOGIN_PATH);
		}
	}
};

export const checkTokenFromUrl = () => {
	if (location.pathname === LOGIN_PATH) {
		const token = getParameterByName('webstoretoken');
		if (token && token !== '') {
			const tokenData = parseJWT(token);

			if (tokenData) {
				const expiration_date = tokenData.exp * 1000;
				if (expiration_date > Date.now()) {
					saveToken({ token, email: tokenData.email, expiration_date });
					location.replace(HOME_PATH);
				} else {
					alert(messages.tokenExpired);
				}
			} else {
				alert(messages.tokenInvalid);
			}
		} else {
			if (isCurrentTokenValid()) {
				location.replace(HOME_PATH);
			}
		}
	}
};

const parseJWT = jwt => {
	try {
		const payload = jwt.split('.')[1];
		const tokenData = JSON.parse(atob(payload));
		return tokenData;
	} catch (e) {
		return null;
	}
};

const saveToken = data => {
	localStorage.setItem('webstore_token', data.token);
	localStorage.setItem('webstore_email', data.email);
	localStorage.setItem('webstore_exp', data.expiration_date);
};

export const isCurrentTokenValid = () => {
	const expiration_date = localStorage.getItem('webstore_exp');
	return (
		localStorage.getItem('webstore_token') &&
		expiration_date &&
		expiration_date > Date.now()
	);
};
