import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'

import productCategories from 'modules/productCategories/reducer';
import products from 'modules/products/reducer';
import customerGroups from 'modules/customerGroups/reducer';
import customers from 'modules/customers/reducer';
import orders from 'modules/orders/reducer';
import orderStatuses from 'modules/orderStatuses/reducer';
import settings from 'modules/settings/reducer';
import webstore from 'modules/webstore/reducer';

export default combineReducers({
  form: formReducer,
  productCategories,
  products,
  settings,
  customerGroups,
  customers,
  orders,
  orderStatuses,
  webstore
});
