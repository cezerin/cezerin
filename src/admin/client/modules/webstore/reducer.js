import * as t from './actionTypes'

const initialState = {
  account: {}
};

export default(state = initialState, action) => {
  switch (action.type) {
    case t.ACCOUNT_RECEIVE:
      return Object.assign({}, state, {account: action.account})
    default:
      return state
  }
}
