var api = require('cezerin-client');
api.init("http://localhost/api/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc0OTgxNTE1fQ.dEyqeTPqFErKqoFKXTi6joNMn8UHgTvGWsjNMHJ7owY");

import * as t from './actionTypes'

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
