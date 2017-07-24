import * as t from './actionTypes'

const initialState = {
  account: {},
  services: []
};

export default(state = initialState, action) => {
  switch (action.type) {
    case t.ACCOUNT_RECEIVE:
      return Object.assign({}, state, {account: action.account})
    case t.SERVICES_RECEIVE:
      return Object.assign({}, state, {services: action.services})
    default:
      return state
  }
}
