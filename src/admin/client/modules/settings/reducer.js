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
  pages: [],
  pageEdit: {}
};

export default(state = initialState, action) => {
  switch (action.type) {
    case t.THEMES_EXPORT_REQUEST:
      return Object.assign({}, state, {exportInProcess: true})
    case t.THEMES_EXPORT_RECEIVE:
      return Object.assign({}, state, {exportInProcess: false})
    case t.THEMES_INSTALL_REQUEST:
      return Object.assign({}, state, {installInProcess: true})
    case t.THEMES_INSTALL_RECEIVE:
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
    case t.CHECKOUT_FIELD_REQUEST:
      return Object.assign({}, state, {checkoutField: null})
    case t.CHECKOUT_FIELD_RECEIVE:
      return Object.assign({}, state, {checkoutField: action.checkoutField})
    case t.CHECKOUT_FIELDS_RECEIVE:
      return Object.assign({}, state, {checkoutFields: action.checkoutFields})
    case t.PAGES_RECEIVE:
      return Object.assign({}, state, {pages: action.pages})
    case t.PAGE_RECEIVE:
      return Object.assign({}, state, {pageEdit: action.pageEdit})
    default:
      return state
  }
}
