var api = require('cezerin-client');
api.init("http://localhost/api/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc0OTgxNTE1fQ.dEyqeTPqFErKqoFKXTi6joNMn8UHgTvGWsjNMHJ7owY");

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
    return api.products.categories.list().then(({status, json}) => {
      dispatch(productCategoriesReceive(json))
    }).catch(error => {});
  }
}

export function fetchProducts() {
  return (dispatch, getState) => {
    const state = getState();
    // if (!state.products.isFetching) {
      // dispatch(requestProducts());

      let filter = { limit: 20, fields: 'id,name,category_id,category_name,sku,images,active,discontinued,stock_status,stock_quantity,price,currency,on_sale,regular_price' };
      filter.category_id = state.app.selectedId;

      return api.products.list(filter)
        .then(({status, json}) => {
          dispatch(receiveProducts(json))
        })
        .catch(error => {
            // dispatch(receiveProductsError(error));
        });
    // }
  }
}
