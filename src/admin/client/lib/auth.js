import settings from './settings'
import api from './api'

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
          alert('Token is expired')
        }
      } else {
        alert('Token is not valid');
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
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  localStorage.setItem('expiration_date', data.expiration_date);
}

const isCurrentTokenValid = () => {
  const expiration_date = localStorage.getItem('expiration_date');
  return localStorage.getItem('token') && expiration_date && expiration_date > Date.now();
}

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('expiration_date');
  location.replace(LOGIN_PATH);
}
