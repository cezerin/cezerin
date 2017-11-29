import settings from './settings'
import api from './api'
import messages from './text'

const LOGIN_PATH = '/admin/login';
const HOME_PATH = '/admin/';

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const validateCurrentToken = () => {
  if (location.pathname !== LOGIN_PATH) {
    if (!isCurrentTokenValid()) {
      location.replace(LOGIN_PATH);
    }
  }
}

export const checkTokenFromUrl = () => {
  if (location.pathname === LOGIN_PATH) {
    const token = getParameterByName('token');
    if (token && token !== '') {
      const tokenData = parseJWT(token);

      if (tokenData) {
        const expiration_date = tokenData.exp * 1000;
        if (expiration_date > Date.now()) {
          saveToken({token, email: tokenData.email, expiration_date});
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
}

const parseJWT = (jwt) => {
  try {
    const payload = jwt.split('.')[1];
    const tokenData = JSON.parse(atob(payload));
    return tokenData;
  } catch (e) {
    return null;
  }
}

const saveToken = (data) => {
  localStorage.setItem('dashboard_token', data.token);
  localStorage.setItem('dashboard_email', data.email);
  localStorage.setItem('dashboard_exp', data.expiration_date);
}

const isCurrentTokenValid = () => {
  const expiration_date = localStorage.getItem('dashboard_exp');
  return localStorage.getItem('dashboard_token') && expiration_date && expiration_date > Date.now();
}

export const removeToken = () => {
  localStorage.removeItem('dashboard_token');
  localStorage.removeItem('dashboard_email');
  localStorage.removeItem('dashboard_exp');
  localStorage.removeItem('webstore_token');
  localStorage.removeItem('webstore_email');
  localStorage.removeItem('webstore_exp');
  location.replace(LOGIN_PATH);
}
