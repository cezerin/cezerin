import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'src/locales'
import { push } from 'react-router-redux';

export function exportRequest() {
  return {
    type: t.THEMES_EXPORT_REQUEST
  }
}

export function exportReceive() {
  return {
    type: t.THEMES_EXPORT_RECEIVE
  }
}

export function installRequest() {
  return {
    type: t.THEMES_INSTALL_REQUEST
  }
}

export function installReceive() {
  return {
    type: t.THEMES_INSTALL_RECEIVE
  }
}

function receiveSettings(settings) {
  return {
    type: t.SETTINGS_RECEIVE,
    settings
  }
}

function receiveEmailSettings(emailSettings) {
  return {
    type: t.EMAIL_SETTINGS_RECEIVE,
    emailSettings
  }
}

function receiveEmailTemplate(emailTemplate) {
  return {
    type: t.EMAIL_TEMPLATE_RECEIVE,
    emailTemplate
  }
}

function requestEmailTemplate() {
  return {
    type: t.EMAIL_TEMPLATE_REQUEST
  }
}

export function fetchSettings() {
  return (dispatch, getState) => {
    return api.settings.retrieve().then(({status, json}) => {
      dispatch(receiveSettings(json))
    }).catch(error => {});
  }
}

export function fetchEmailSettings() {
  return (dispatch, getState) => {
    return api.settings.retrieveEmailSettings().then(({status, json}) => {
      dispatch(receiveEmailSettings(json))
    }).catch(error => {});
  }
}

export function updateSettings(settings) {
  return (dispatch, getState) => {
    return api.settings.update(settings).then(({status, json}) => {
      dispatch(receiveSettings(json))
    }).catch(error => {});
  }
}

export function updateEmailSettings(emailSettings) {
  return (dispatch, getState) => {
    return api.settings.updateEmailSettings(emailSettings).then(({status, json}) => {
      dispatch(receiveEmailSettings(json))
    }).catch(error => {});
  }
}

export function fetchEmailTemplate(templateName) {
  return (dispatch, getState) => {
    dispatch(requestEmailTemplate())
    return api.settings.retrieveEmailTemplate(templateName).then(({status, json}) => {
      json.templateName = templateName;
      dispatch(receiveEmailTemplate(json))
    }).catch(error => {});
  }
}

export function updateEmailTemplate(emailTemplate) {
  return (dispatch, getState) => {
    return api.settings.updateEmailTemplate(emailTemplate.templateName, emailTemplate).then(({status, json}) => {
      json.templateName = templateName;
      dispatch(receiveEmailTemplate(json))
    }).catch(error => {});
  }
}
