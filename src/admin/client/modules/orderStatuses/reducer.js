import * as t from './actionTypes'

const initialState = {
  items: [],
  isFetched: false,
  isFetching: false,
  isSaving: false,
  errorFetch: null,
  errorUpdate: null,
  selectedId: 'all'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case t.STATUSES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case t.STATUSES_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        isFetched: true,
        items: action.items
      })
    case t.STATUSES_FAILURE:
      return Object.assign({}, state, {
        errorFetch: action.error
      })
    case t.STATUSES_SELECT:
      return Object.assign({}, state, {
        selectedId: action.selectedId,
      })
    case t.STATUSES_DESELECT:
      return Object.assign({}, state, {
        selectedId: null
      })
    case t.STATUS_UPDATE_REQUEST:
      return Object.assign({}, state, {
        isSaving: true,
      })
    case t.STATUS_UPDATE_SUCCESS:
      return Object.assign({}, state, {
        isSaving: false
      })
    case t.STATUS_UPDATE_FAILURE:
      return Object.assign({}, state, {
        isSaving: false,
        errorUpdate: action.error
      })
    case t.STATUS_CREATE_SUCCESS:
    case t.STATUS_DELETE_SUCCESS:
    default:
      return state
  }
}
