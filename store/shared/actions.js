import * as t from './actionTypes'
import clientSettings from '../client/settings'
import api from 'cezerin-client'
api.initAjax(clientSettings.ajaxBaseUrl);



//
// export const SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY'


function receiveProducts(products) {
  return {type: t.PRODUCTS_RECEIVE, products}
}

function receiveProduct(product) {
  return {type: t.PRODUCT_RECEIVE, product}
}

function receiveCategories(categories) {
  return {type: t.SITEMAP_RECEIVE, categories}
}

function receiveSitemap(currentPage) {
  return {type: t.CATEGORIES_RECEIVE, currentPage}
}






export function selectCategory(id) {
  return {type: t.CATEGORIES_SELECT, selectedId: id}
}

export function deselectCategory() {
  return {type: t.CATEGORIES_DESELECT}
}

function productCategoriesReceive(categories) {
  return {type: t.PRODUCT_CATEGORIES_RECEIVE, categories}
}

export function fetchProductCategories() {
  return (dispatch, getState) => {
    return api.ajax.products.categories.list().then(({status, json}) => {
      dispatch(productCategoriesReceive(json))
    }).catch(error => {});
  }
}

export function fetchCategories() {
  return (dispatch, getState) => {
    return api.ajax.products.categories.list().then(({status, json}) => {
      dispatch(receiveProducts(json))
    }).catch(error => {});
  }
}


export function fetchProducts() {
  return (dispatch, getState) => {
    const state = getState();

    let filter = state.productsFilter;
    filter.category_id = state.app.currentCategory.id;
    filter.fields = 'path,id,name,category_id,category_name,sku,images,active,discontinued,stock_status,stock_quantity,price,currency,on_sale,regular_price';

    return api.ajax.products.list(filter).then(({status, json}) => {
      dispatch(receiveProducts(json))
    }).catch(error => {});
  }
}
