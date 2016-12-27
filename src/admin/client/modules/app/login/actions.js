import { push } from 'react-router-redux';
import api from 'lib/api';
import settings from 'lib/settings';
import * as t from './actionTypes'

const requestLogin = (email, pass) => ({
  type: t.LOGIN_REQUEST,
  isFetching: true,
  isAuthenticated: false,
  email
});

const receiveLogin = (email, token) => ({
  type: t.LOGIN_SUCESS,
  isFetching: false,
  isAuthenticated: true,
  email,
  token
});

const loginError = (error) => ({
  type: t.LOGIN_FAILURE,
  isFetching: false,
  isAuthenticated: false,
  error
});

export const loginUser = (email, pass) => {
    return (dispatch, getState) => {
        dispatch(requestLogin(email, pass));
        return api.authorize(settings.apiBaseUrl, email, pass).then(({status, json}) => {
            console.log(status);
            console.log(json);
            if (json.token) {
                localStorage.setItem('token', json.token);
                localStorage.setItem('user', email);
                api.init(settings.apiBaseUrl, json.token);

                dispatch(receiveLogin(email, json.token));
                dispatch(push(settings.admin.pages.home));
            } else {
                dispatch(loginError(json.message));
            }
        }).catch(error => {
            dispatch(loginError(error));
        });
    }
}
