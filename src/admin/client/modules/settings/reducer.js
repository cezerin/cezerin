import * as t from './actionTypes'

const initialState = {
  exportInProcess: false,
  installInProcess: false,
  settings: {
      language: 'en',
      currency_code: 'USD',
      currency_symbol: '$',
      currency_format: '${amount}',
      thousand_separator: '',
      decimal_separator: '.',
      decimal_number: 2,
      timezone: 'Asia/Singapore',
      date_format: 'MMMM D, YYYY',
      time_format: 'h:mm a',
      weight_unit: 'kg',
      length_unit: 'cm'
  },
  emailSettings: null,
  emailTemplate: null,
  checkoutField: null,
  checkoutFields: [],
  shippingMethods: [],
  paymentMethods: [],
  shippingMethodEdit: {},
  paymentMethodEdit: {},
  paymentGatewayEdit: {},
  tokens: [],
  tokenEdit: {},
  newToken: null,
  webhooks: [],
  webhookEdit: {},
  themeSettings: null,
  themeSettingsSchema: null
};

export default(state = initialState, action) => {
  switch (action.type) {
    case t.THEME_EXPORT_REQUEST:
      return Object.assign({}, state, {exportInProcess: true})
    case t.THEME_EXPORT_RECEIVE:
      return Object.assign({}, state, {exportInProcess: false})
    case t.THEME_INSTALL_REQUEST:
      return Object.assign({}, state, {installInProcess: true})
    case t.THEME_INSTALL_RECEIVE:
      return Object.assign({}, state, {installInProcess: false})
    case t.SETTINGS_RECEIVE:
      return Object.assign({}, state, {settings: action.settings})
    case t.EMAIL_SETTINGS_RECEIVE:
      return Object.assign({}, state, {emailSettings: action.emailSettings})
    case t.EMAIL_TEMPLATE_REQUEST:
      return Object.assign({}, state, {emailTemplate: null})
    case t.EMAIL_TEMPLATE_RECEIVE:
      return Object.assign({}, state, {emailTemplate: action.emailTemplate})
    case t.SHIPPING_METHODS_RECEIVE:
      return Object.assign({}, state, {shippingMethods: action.shippingMethods})
    case t.PAYMENT_METHODS_RECEIVE:
      return Object.assign({}, state, {paymentMethods: action.paymentMethods})
    case t.SHIPPING_METHOD_RECEIVE:
      return Object.assign({}, state, {shippingMethodEdit: action.shippingMethodEdit})
    case t.PAYMENT_METHOD_RECEIVE:
      return Object.assign({}, state, {paymentMethodEdit: action.paymentMethodEdit})
    case t.PAYMENT_GATEWAY_RECEIVE:
      return Object.assign({}, state, {paymentGatewayEdit: action.paymentGatewayEdit})
    case t.CHECKOUT_FIELD_REQUEST:
      return Object.assign({}, state, {checkoutField: null})
    case t.CHECKOUT_FIELD_RECEIVE:
      return Object.assign({}, state, {checkoutField: action.checkoutField})
    case t.CHECKOUT_FIELDS_RECEIVE:
      return Object.assign({}, state, {checkoutFields: action.checkoutFields})
    case t.TOKENS_RECEIVE:
      return Object.assign({}, state, {tokens: action.tokens})
    case t.TOKEN_RECEIVE:
      return Object.assign({}, state, {tokenEdit: action.tokenEdit, newToken: null})
    case t.NEW_TOKEN_RECEIVE:
      return Object.assign({}, state, {newToken: action.newToken})
    case t.THEME_SETTINGS_RECEIVE:
      return Object.assign({}, state, {themeSettings: action.settings})
    case t.THEME_SETTINGS_SCHEMA_RECEIVE:
      return Object.assign({}, state, {themeSettingsSchema: action.schema})
    case t.WEBHOOKS_RECEIVE:
      return Object.assign({}, state, {webhooks: action.webhooks})
    case t.WEBHOOK_RECEIVE:
      return Object.assign({}, state, {webhookEdit: action.webhookEdit})
    default:
      return state
  }
}
