import clientSettings from '../client/settings'
import api from 'cezerin-client'
api.initAjax(clientSettings.ajaxBaseUrl);

import * as t from './actionTypes'

function receiveProducts(products) {
  return {
    type: t.PRODUCTS_RECEIVE,
    products
  }
}

export function selectCategory(id) {
  return {
    type: t.CATEGORIES_SELECT,
    selectedId: id
  }
}

export function deselectCategory() {
  return {
    type: t.CATEGORIES_DESELECT
  }
}


function productCategoriesReceive(categories) {
  return {
    type: t.PRODUCT_CATEGORIES_RECEIVE,
    categories
  }
}

export function fetchProductCategories() {
  return (dispatch, getState) => {
    return api.ajax.products.categories.list().then(({status, json}) => {
      dispatch(productCategoriesReceive(json))
    }).catch(error => {});
  }
}

export function fetchProducts() {
  return (dispatch, getState) => {
    const state = getState();
    // if (!state.products.isFetching) {
      // dispatch(requestProducts());

      let filter = { limit: 20, fields: 'path,id,name,category_id,category_name,sku,images,active,discontinued,stock_status,stock_quantity,price,currency,on_sale,regular_price' };
      filter.category_id = state.app.selectedId;

      return api.ajax.products.list(filter)
        .then(({status, json}) => {
          dispatch(receiveProducts(json))
        })
        .catch(error => {
            // dispatch(receiveProductsError(error));
        });
    // }
  }
}
