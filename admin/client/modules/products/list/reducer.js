import * as t from './actionTypes'

const initialState = {
  selected: [],
  isFetching: false,
  items: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case t.SELECT_CATEGORY:
    //   return Object.assign({}, state, {
    //     selected: action.category
    //   })
    case t.REQUEST_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case t.RECEIVE_PRODUCTS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.products,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}
