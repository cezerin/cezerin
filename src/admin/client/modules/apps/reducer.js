import * as t from './actionTypes'

const initialState = {
  account: null,
  services: [],
  service: null,
  serviceSettings: null,
  serviceLogs: null,
  loadingEnableDisableService: false
};

export default(state = initialState, action) => {
  switch (action.type) {
    case t.ACCOUNT_RECEIVE:
      return Object.assign({}, state, {account: action.account})
    case t.SERVICES_RECEIVE:
      return Object.assign({}, state, {services: action.services})
    case t.SERVICE_RECEIVE:
      return Object.assign({}, state, {service: action.service})
    case t.SERVICE_SETTINGS_REQUEST:
      return Object.assign({}, state, {serviceSettings: null})
    case t.SERVICE_SETTINGS_RECEIVE:
      return Object.assign({}, state, {serviceSettings: action.serviceSettings})
    case t.SERVICE_LOGS_RECEIVE:
      return Object.assign({}, state, {serviceLogs: action.serviceLogs})
    case t.SERVICE_ENABLE_REQUEST:
      return Object.assign({}, state, {loadingEnableDisableService: true})
    case t.SERVICE_ENABLE_RECEIVE:
      return Object.assign({}, state, {loadingEnableDisableService: false})
    default:
      return state
  }
}
