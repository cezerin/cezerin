import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import productCategories from 'modules/productCategories/reducer';
import products from 'modules/products/reducer';
import customerGroups from 'modules/customerGroups/reducer';
import customers from 'modules/customers/reducer';
import orders from 'modules/orders/reducer';
import settings from 'modules/settings/reducer';

export default combineReducers({
  form: formReducer,
  productCategories,
  products,
  settings,
  customerGroups,
  customers,
  orders
});
