import * as t from './actionTypes'
import clientSettings from '../client/settings'
import api from 'cezerin-client'
api.initAjax(clientSettings.ajaxBaseUrl);

function receiveProducts(products) {
  return {type: t.PRODUCTS_RECEIVE, products}
}

function receiveProduct(product) {
  return {type: t.PRODUCT_RECEIVE, product}
}

function receiveCategories(categories) {
  return {type: t.CATEGORIES_RECEIVE, categories}
}

export function receiveSitemap(currentPage) {
  //console.log(currentPage);
  return {type: t.SITEMAP_RECEIVE, currentPage}
}

function setCurrentCategory(category) {
  return {type: t.SET_CURRENT_CATEGORY, category}
}

function resetCurrentCategory() {
  return {type: t.SET_CURRENT_CATEGORY, category: null}
}

export function setCategory(category_id) {
  return (dispatch, getState) => {
    const state = getState();
    const category = state.app.categories.find(c => c.id === category_id);
    dispatch(setCurrentCategory(category));
    dispatch(fetchProducts());
    dispatch(receiveProduct(null))
  }
}

export function fetchCategories() {
  return (dispatch, getState) => {
    return api.ajax.product_categories.list().then(({status, json}) => {
      dispatch(receiveCategories(json))
    }).catch(error => {});
  }
}

export function fetchProduct(product_id) {
  return (dispatch, getState) => {
    return api.ajax.products.retrieve(product_id).then(({status, json}) => {
      dispatch(receiveProduct(json))
    }).catch(error => {});
  }
}

export function fetchProducts() {
  return (dispatch, getState) => {
    const state = getState();

    let filter = state.app.productsFilter;
    filter.category_id = state.app.currentCategory.id;
    filter.fields = 'path,id,name,category_id,category_name,sku,images,active,discontinued,stock_status,stock_quantity,price,currency,on_sale,regular_price';

    return api.ajax.products.list(filter).then(({status, json}) => {
      dispatch(receiveProducts(json))
    }).catch(error => {});
  }
}

const getCurrentPage = (path) => {
  return api.ajax.sitemap.retrieve(path).then(({status, json}) => json)
}

const getCategories = () => {
  return api.ajax.product_categories.list().then(({status, json}) => json)
}

const getProducts = (filter) => {
  return api.ajax.products.list(filter).then(({status, json}) => json)
}

const getProduct = (currentPage) => {
  if (currentPage.type === 'product') {
    return api.ajax.products.retrieve(currentPage.resource).then(({status, json}) => json)
  } else {
    return Promise.resolve();
  }
}

const getCommonData = (req, currentPage, productsFilter) => {
  return Promise.all([
    getCategories(),
    getProduct(currentPage),
    getProducts(productsFilter)
  ]).then(([categories, product, products]) => {

    let currentCategory = null;
    if (currentPage.type === 'product-category') {
      currentCategory = categories.find(c => c.id === currentPage.resource);
    }

    return {categories, product, products, currentCategory}
  });
}

export const getInitialState = (req) => {
  let initialState = {
    app: {
      language: clientSettings.language,
      location: null,
      currentPage: null,
      currentCategory: null,
      currentProduct: null,
      categories: [],
      products: [],
      productsFilter: {
        limit: 20,
        fields: 'path,id,name,category_id,category_name,sku,images,active,discontinued,stock_status,stock_quantity,price,currency,on_sale,regular_price'
      }
    }
  }

  return getCurrentPage(req.url).then(currentPage => {
    if (currentPage) {
      initialState.app.currentPage = currentPage;
      if (currentPage.type === 'product-category') {
        initialState.app.productsFilter.category_id = currentPage.resource;
      }

      return getCommonData(req, currentPage, initialState.app.productsFilter).then(commonData => {
        initialState.app.categories = commonData.categories;
        initialState.app.currentProduct = commonData.product;
        initialState.app.products = commonData.products;
        initialState.app.currentCategory = commonData.currentCategory;
        return initialState;
      })
    } else {
      // page not found
      return null;
    }
  });

}
