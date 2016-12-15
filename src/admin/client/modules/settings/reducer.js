import * as t from './actionTypes'

const initialState = {
  exportInProcess: false,
  installInProcess: false
};

export default (state = initialState, action) => {
  switch (action.type) {

    case t.THEMES_EXPORT_REQUEST:
      return Object.assign({}, state, {
        exportInProcess: true
      })
    case t.THEMES_EXPORT_RECEIVE:
      return Object.assign({}, state, {
        exportInProcess: false,
      })
    case t.THEMES_INSTALL_REQUEST:
      return Object.assign({}, state, {
        installInProcess: true
      })
    case t.THEMES_INSTALL_RECEIVE:
      return Object.assign({}, state, {
        installInProcess: false,
      })
    default:
      return state
  }
}
