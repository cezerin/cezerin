import * as t from './actionTypes'

// export function selectCategory(category) {
//   return {
//     type: t.SELECT_CATEGORY,
//     category
//   }
// }

function requestProducts() {
  return {
    type: t.REQUEST_PRODUCTS
  }
}

function receiveProducts(json) {
  return {
    type: t.RECEIVE_PRODUCTS,
    products: json,
    receivedAt: Date.now()
  }
}

export function fetchProducts(category) {
  return (dispatch, getState) => {
    // const { products } = getState();
    // if (products.isFetching) {
    //   return false
    // }

    dispatch(requestProducts())
    return fetch('/admin/assets/api/products-cars.json')
      .then(response => response.json())
      .then(json => { setTimeout(() => { dispatch(receiveProducts(json)) }, 2000) })
  }
}
