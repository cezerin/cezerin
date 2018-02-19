import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'

export function exportRequest() {
  return {
    type: t.THEME_EXPORT_REQUEST
  }
}

export function exportReceive() {
  return {
    type: t.THEME_EXPORT_RECEIVE
  }
}

export function installRequest() {
  return {
    type: t.THEME_INSTALL_REQUEST
  }
}

export function installReceive() {
  return {
    type: t.THEME_INSTALL_RECEIVE
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

function receiveCheckoutFields(checkoutFields) {
  return {
    type: t.CHECKOUT_FIELDS_RECEIVE,
    checkoutFields
  }
}

function receiveCheckoutField(checkoutField) {
  return {
    type: t.CHECKOUT_FIELD_RECEIVE,
    checkoutField
  }
}

function requestCheckoutField() {
  return {
    type: t.CHECKOUT_FIELD_REQUEST
  }
}

function receiveShippingMethods(shippingMethods) {
  return {
    type: t.SHIPPING_METHODS_RECEIVE,
    shippingMethods
  }
}

function receivePaymentMethods(paymentMethods) {
  return {
    type: t.PAYMENT_METHODS_RECEIVE,
    paymentMethods
  }
}

function receivePaymentGateway(paymentGatewayEdit) {
  return {
    type: t.PAYMENT_GATEWAY_RECEIVE,
    paymentGatewayEdit
  }
}

export function receiveShippingMethod(shippingMethodEdit) {
  return {
    type: t.SHIPPING_METHOD_RECEIVE,
    shippingMethodEdit
  }
}

export function receivePaymentMethod(paymentMethodEdit) {
  return {
    type: t.PAYMENT_METHOD_RECEIVE,
    paymentMethodEdit
  }
}

function receiveTokens(tokens) {
  return {
    type: t.TOKENS_RECEIVE,
    tokens
  }
}

export function receiveToken(tokenEdit) {
  return {
    type: t.TOKEN_RECEIVE,
    tokenEdit
  }
}

export function receiveNewToken(newToken) {
  return {
    type: t.NEW_TOKEN_RECEIVE,
    newToken
  }
}

export function receiveThemeSettings(settings) {
  return {
    type: t.THEME_SETTINGS_RECEIVE,
    settings
  }
}

export function receiveThemeSettingsSchema(schema) {
  return {
    type: t.THEME_SETTINGS_SCHEMA_RECEIVE,
    schema
  }
}

function receiveWebhooks(webhooks) {
  return {
    type: t.WEBHOOKS_RECEIVE,
    webhooks
  }
}

export function receiveWebhook(webhookEdit) {
  return {
    type: t.WEBHOOK_RECEIVE,
    webhookEdit
  }
}

export function fetchSettings() {
  return (dispatch, getState) => {
    // API can be not init on app start
    if(api) {
      return api.settings.retrieve().then(({status, json}) => {
        dispatch(receiveSettings(json))
      }).catch(error => {});
    }
  }
}

export function fetchEmailSettings() {
  return (dispatch, getState) => {
    return api.settings.retrieveEmailSettings().then(({status, json}) => {
      dispatch(receiveEmailSettings(json))
    }).catch(error => {});
  }
}

export function deleteLogo() {
  return (dispatch, getState) => {
    return api.settings.deleteLogo()
      .then(({status, json}) => {
        if(status === 200) {
          dispatch(fetchSettings());
        } else {
          throw status
        }
      })
      .catch(error => {
          //dispatch error
          console.log(error)
      });
  }
}

export function updateSettings(settings) {
  return (dispatch, getState) => {
    delete settings.logo_file;
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

export function fetchCheckoutFields() {
  return (dispatch, getState) => {
    return api.checkoutFields.list().then(({status, json}) => {
      dispatch(receiveCheckoutFields(json))
    }).catch(error => {});
  }
}

export function fetchCheckoutField(fieldName) {
  return (dispatch, getState) => {
    dispatch(requestCheckoutField())
    return api.checkoutFields.retrieve(fieldName).then(({status, json}) => {
      json.fieldName = fieldName;
      dispatch(receiveCheckoutField(json))
    }).catch(error => {});
  }
}

export function updateCheckoutField(checkoutField) {
  return (dispatch, getState) => {
    return api.checkoutFields.update(checkoutField.fieldName, checkoutField).then(({status, json}) => {
      json.fieldName = fieldName;
      dispatch(receiveCheckoutField(json))
    }).catch(error => {});
  }
}

export function fetchShippingMethods() {
  return (dispatch, getState) => {
    return api.shippingMethods.list().then(({status, json}) => {
      dispatch(receiveShippingMethods(json))
    }).catch(error => {});
  }
}

export function fetchPaymentMethods() {
  return (dispatch, getState) => {
    return api.paymentMethods.list().then(({status, json}) => {
      dispatch(receivePaymentMethods(json))
    }).catch(error => {});
  }
}

export function updateShippingMethod(method) {
  return (dispatch, getState) => {
    return api.shippingMethods.update(method.id, method).then(({status, json}) => {
      dispatch(fetchShippingMethods())
    }).catch(error => {});
  }
}

export function updatePaymentMethod(method) {
  return (dispatch, getState) => {
    return api.paymentMethods.update(method.id, method).then(({status, json}) => {
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function fetchShippingMethod(id) {
  return (dispatch, getState) => {
    return api.shippingMethods.retrieve(id).then(({status, json}) => {
      dispatch(receiveShippingMethod(json))
    }).catch(error => {});
  }
}

export function fetchPaymentMethod(id) {
  return (dispatch, getState) => {
    return api.paymentMethods.retrieve(id).then(({status, json}) => {
      dispatch(receivePaymentMethod(json))
    }).catch(error => {});
  }
}

export function deleteShippingMethod(methodId) {
  return (dispatch, getState) => {
    return api.shippingMethods.delete(methodId).then(({status, json}) => {
      dispatch(fetchShippingMethods())
    }).catch(error => {});
  }
}

export function deletePaymentMethod(methodId) {
  return (dispatch, getState) => {
    return api.paymentMethods.delete(methodId).then(({status, json}) => {
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function createShippingMethod(method) {
  return (dispatch, getState) => {
    return api.shippingMethods.create(method).then(({status, json}) => {
      dispatch(fetchShippingMethods())
    }).catch(error => {});
  }
}

export function createPaymentMethod(method) {
  return (dispatch, getState) => {
    return api.paymentMethods.create(method).then(({status, json}) => {
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function fetchTokens() {
  return (dispatch, getState) => {
    return api.tokens.list().then(({status, json}) => {
      dispatch(receiveTokens(json))
    }).catch(error => {});
  }
}

export function fetchToken(id) {
  return (dispatch, getState) => {
    return api.tokens.retrieve(id).then(({status, json}) => {
      dispatch(receiveToken(json))
    }).catch(error => {});
  }
}

export function createToken(token) {
  return (dispatch, getState) => {
    return api.tokens.create(token).then(({status, json}) => {
      dispatch(fetchTokens())
      dispatch(receiveNewToken(json.token))
    }).catch(error => {});
  }
}

export function updateToken(token) {
  return (dispatch, getState) => {
    return api.tokens.update(token.id, token).then(({status, json}) => {
      dispatch(fetchTokens())
    }).catch(error => {});
  }
}

export function deleteToken(tokenId) {
  return (dispatch, getState) => {
    return api.tokens.delete(tokenId).then(({status, json}) => {
      dispatch(fetchTokens())
    }).catch(error => {});
  }
}

export function fetchPaymentGateway(gatewayName) {
  return (dispatch, getState) => {
    if(gatewayName && gatewayName.length > 0){
      return api.paymentGateways.retrieve(gatewayName).then(({status, json}) => {
        dispatch(receivePaymentGateway(json))
      }).catch(error => {});
    } else {
      dispatch(receivePaymentGateway(null))
    }
  }
}

export function updatePaymentGateway(gatewayName, data) {
  return (dispatch, getState) => {
    return api.paymentGateways.update(gatewayName, data).then(({status, json}) => {
      dispatch(receivePaymentGateway(json))
    }).catch(error => {});
  }
}

export function uploadLogo(form) {
  return (dispatch, getState) => {
    return api.settings.uploadLogo(form)
    .then(() => {
      dispatch(fetchSettings());
    })
    .catch(error => {});
  }
}

export function fetchThemeSettings() {
  return (dispatch, getState) => {
    return Promise.all([
      api.theme.settings.retrieve(),
      api.theme.settings.retrieveSchema()
    ])
    .then(([ settingsResponse, schemaResponse ]) => {
      dispatch(receiveThemeSettings(settingsResponse.json))
      dispatch(receiveThemeSettingsSchema(schemaResponse.json))
    })
    .catch(error => {});
  }
}

export function updateThemeSettings(settings) {
  return (dispatch, getState) => {
    return api.theme.settings.update(settings).then(() => {
      dispatch(fetchThemeSettings())
    }).catch(error => {});
  }
}

export function fetchWebhooks() {
  return (dispatch, getState) => {
    return api.webhooks.list().then(({status, json}) => {
      dispatch(receiveWebhooks(json))
    }).catch(error => {});
  }
}

export function fetchWebhook(id) {
  return (dispatch, getState) => {
    return api.webhooks.retrieve(id).then(({status, json}) => {
      dispatch(receiveWebhook(json))
    }).catch(error => {});
  }
}

export function createWebhook(webhook) {
  return (dispatch, getState) => {
    return api.webhooks.create(webhook).then(({status, json}) => {
      dispatch(fetchWebhooks())
    }).catch(error => {});
  }
}

export function updateWebhook(webhook) {
  return (dispatch, getState) => {
    return api.webhooks.update(webhook.id, webhook).then(({status, json}) => {
      dispatch(fetchWebhooks())
    }).catch(error => {});
  }
}

export function deleteWebhook(webhookId) {
  return (dispatch, getState) => {
    return api.webhooks.delete(webhookId).then(({status, json}) => {
      dispatch(fetchWebhooks())
    }).catch(error => {});
  }
}
