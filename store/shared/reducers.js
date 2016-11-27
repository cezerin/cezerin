import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as t from './actionTypes'

const initialState = {
  currentPage: null,
  location: null,
  selectedId: null,
  products: [],
  categories: []
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return Object.assign({}, state, {
        location: action.payload
      });

    case t.CATEGORIES_SELECT:
      return Object.assign({}, state, {
        selectedId: action.selectedId,
      })
    case t.CATEGORIES_DESELECT:
      return Object.assign({}, state, {
        selectedId: null
      })

    case t.PRODUCT_CATEGORIES_RECEIVE:
      return Object.assign({}, state, {
        categories: action.categories
      })

    case t.PRODUCTS_RECEIVE:
      return Object.assign({}, state, {
        products: action.products
      });

    default:
      return state
  }
}

export default combineReducers({
  app: appReducer,
  routing: routerReducer
});
