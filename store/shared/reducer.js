import * as t from './actionTypes'

const initialState = {
  categories: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case t.PRODUCT_CATEGORIES_RECEIVE:
      return Object.assign({}, state, {
        categories: action.categories
      })
    default:
      return state
  }
}
