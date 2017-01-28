import {routerReducer, LOCATION_CHANGE} from 'react-router-redux'
import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initialState = {};

function appReducer(state = initialState, action) {
  switch (action.type) {

    case LOCATION_CHANGE:
      return Object.assign({}, state, {location: action.payload})

    case t.SET_CURRENT_CATEGORY:
      return Object.assign({}, state, {currentCategory: action.category})

    case t.PRODUCT_RECEIVE:
      return Object.assign({}, state, {currentProduct: action.product})

    case t.CATEGORIES_RECEIVE:
      return Object.assign({}, state, {categories: action.categories})

    case t.SITEMAP_RECEIVE:
      return Object.assign({}, state, {currentPage: action.currentPage})

    case t.PRODUCTS_RECEIVE:
      return Object.assign({}, state, {products: action.products})

    case t.CART_RECEIVE:
      return Object.assign({}, state, {cart: action.cart})

    case t.CART_REQUEST:
    case t.CART_FAILURE:
    default:
      return state
  }
}

export default combineReducers({app: appReducer, routing: routerReducer});
