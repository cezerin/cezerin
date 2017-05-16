import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import login from 'modules/app/login/reducer';
import productCategories from 'modules/productCategories/reducer';
import products from 'modules/products/reducer';
import customerGroups from 'modules/customer-groups/reducer';
import customers from 'modules/customers/reducer';
import orders from 'modules/orders/reducer';
import settings from 'modules/settings/reducer';

const initialState = {
  location: null,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return Object.assign({}, state, {
        location: action.payload
      });
    default:
      return state
  }
}

export default combineReducers({
  app: appReducer,
  auth: login,
  form: formReducer,
  routing: routerReducer,
  productCategories,
  products,
  settings,
  customerGroups,
  customers,
  orders
});
