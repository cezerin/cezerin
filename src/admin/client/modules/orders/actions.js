import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'
import { push } from 'react-router-redux';
import moment from 'moment';

function requestOrder() {
  return {
    type: t.ORDER_DETAIL_REQUEST
  }
}

function receiveOrder(item) {
  return {
    type: t.ORDER_DETAIL_RECEIVE,
    item
  }
}

export function clearOrderDetails() {
  return receiveOrder(null);
}

function requestOrders() {
  return {
    type: t.ORDERS_REQUEST
  }
}

function requestMoreOrders() {
  return {
    type: t.ORDERS_MORE_REQUEST
  }
}

function receiveOrdersMore({ has_more, total_count, data }) {
  return {
    type: t.ORDERS_MORE_RECEIVE,
    has_more,
    total_count,
    data
  }
}

function receiveOrders({ has_more, total_count, data }) {
  return {
    type: t.ORDERS_RECEIVE,
    has_more,
    total_count,
    data
  }
}

function receiveOrdersError(error) {
  return {
    type: t.ORDERS_FAILURE,
    error
  }
}

export function selectOrder(id) {
  return {
    type: t.ORDERS_SELECT,
    orderId: id
  }
}

export function deselectOrder(id) {
  return {
    type: t.ORDERS_DESELECT,
    orderId: id
  }
}

export function deselectAllOrder() {
  return {
    type: t.ORDERS_DESELECT_ALL
  }
}

export function selectAllOrder() {
  return {
    type: t.ORDERS_SELECT_ALL
  }
}

export function setFilter(filter) {
  return {
    type: t.ORDERS_SET_FILTER,
    filter: filter
  }
}

function requestBulkUpdate() {
  return {
    type: t.ORDERS_BULK_UPDATE_REQUEST
  }
}

function receiveBulkUpdate() {
  return {
    type: t.ORDERS_BULK_UPDATE_SUCCESS
  }
}

function errorBilkUpdate() {
  return {
    type: t.ORDERS_BULK_UPDATE_FAILURE
  }
}

function deleteOrdersSuccess() {
  return {
    type: t.ORDER_DELETE_SUCCESS
  }
}

// function setGroupSuccess() {
//   return {
//     type: t.ORDER_SET_GROUP_SUCCESS
//   }
// }
//
// function requestUpdateOrder(id) {
//   return {
//     type: t.ORDER_UPDATE_REQUEST
//   }
// }
//
// function receiveUpdateOrder() {
//   return {
//     type: t.ORDER_UPDATE_SUCCESS
//   }
// }
//
// function errorUpdateOrder(error) {
//   return {
//     type: t.ORDER_UPDATE_FAILURE,
//     error
//   }
// }
//
// function successCreateOrder(id) {
//   return {
//     type: t.ORDER_CREATE_SUCCESS
//   }
// }

const getFilter = (state, offset = 0) => {
  const filterState = state.orders.filter;
  let filter = {
    limit: 50,
    offset: offset
  }

  if(filterState.search !== null && filterState.search !== ''){
    filter.search = filterState.search;
  }

  if(filterState.closed !== null){
    filter.closed = filterState.closed;
  }

  if(filterState.cancelled !== null){
    filter.cancelled = filterState.cancelled;
  }

  if(filterState.delivered !== null){
    filter.delivered = filterState.delivered;
  }

  if(filterState.paid !== null){
    filter.paid = filterState.paid;
  }

  if(filterState.hold !== null){
    filter.hold = filterState.hold;
  }

  if(filterState.draft !== null){
    filter.draft = filterState.draft;
  }

  return filter;
}

export function fetchOrders() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.orders.loadingItems) {
      dispatch(requestOrders());
      dispatch(deselectAllOrder());

      let filter = getFilter(state);

      return api.orders.list(filter)
        .then(({status, json}) => {
          dispatch(receiveOrders(json))
        })
        .catch(error => {
            dispatch(receiveOrdersError(error));
        });
    }
  }
}

export function fetchMoreOrders() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.orders.loadingItems) {
      dispatch(requestMoreOrders());

      let filter = getFilter(state, state.orders.items.length);

      return api.orders.list(filter)
        .then(({status, json}) => {
          dispatch(receiveOrdersMore(json))
        })
        .catch(error => {
            dispatch(receiveOrdersError(error));
        });
    }
  }
}

export function bulkUpdate(dataToSet) {
  return (dispatch, getState) => {
    dispatch(requestBulkUpdate());
    const state = getState();
    let promises = state.orders.selected.map(orderId => api.orders.update(orderId, dataToSet));

    return Promise.all(promises).then(values => {
      dispatch(receiveBulkUpdate());
      dispatch(fetchOrders());
    }).catch(err => { dispatch(errorBilkUpdate()); console.log(err) });
  }
}

export function deleteOrders() {
  return (dispatch, getState) => {
    const state = getState();
    let promises = state.orders.selected.map(orderId => api.orders.delete(orderId));

    return Promise.all(promises).then(values => {
      dispatch(deleteOrdersSuccess());
      dispatch(deselectAllOrder());
      dispatch(fetchOrders());
    }).catch(err => { console.log(err) });
  }
}

export function fetchOrder(orderId) {
  return (dispatch, getState) => {
    dispatch(requestOrder());

    return api.orders.retrieve(orderId).then(orderResponse => {
      let order = orderResponse.json;
      order.customer = null;

      const productIds = order && order.items && order.items.length > 0 ? order.items.map(item => item.product_id) : [];
      api.products.list({ ids: productIds, fields: 'images,enabled,stock_quantity,variants,options' }).then(productsResponse => {
        const products = productsResponse.json.data;

        const newItems = order.items.map(item => {
          item.product = products.find(p => p.id === item.product_id);
          return item;
        })

        if(order.customer_id && order.customer_id.length > 0){
          api.customers.retrieve(order.customer_id).then(customerResponse => {
            order.customer = customerResponse.json;

            dispatch(receiveOrder(order))
          })
        } else {
          dispatch(receiveOrder(order))
        }
      });
    })
    .catch(error => {});
  }
}

export function deleteOrderItem(orderId, orderItemId){
  return (dispatch, getState) => {
    const state = getState();

    api.orders.items.delete(orderId, orderItemId)
    .then(() => {
      dispatch(fetchOrder(orderId));
    })
    .catch(error => {});
  }
}

export function updateOrderItem(orderId, orderItemId, quantity, variantId){
  return (dispatch, getState) => {
    const state = getState();

    api.orders.items.update(orderId, orderItemId, { quantity: quantity, variant_id: variantId })
    .then(() => {
      dispatch(fetchOrder(orderId));
    })
    .catch(error => {});
  }
}

// export function setGroup(group_id) {
//   return (dispatch, getState) => {
//     const state = getState();
//     let promises = state.orders.selected.map(orderId => api.orders.update(orderId, { group_id: group_id }));
//
//     return Promise.all(promises).then(values => {
//       dispatch(setGroupSuccess());
//       dispatch(deselectAllOrder());
//       dispatch(fetchOrders());
//     }).catch(err => { console.log(err) });
//   }
// }

// export function updateOrder(data) {
//   return (dispatch, getState) => {
//     dispatch(requestUpdateOrder(data.id));
//
//     delete data.images;
//     if(!data.slug || data.slug === '') {
//       data.slug = data.name;
//     }
//
//     return api.orders.update(data.id, data).then(({status, json}) => {
//         dispatch(receiveUpdateOrder());
//         dispatch(fetchOrders());
//     })
//     .catch(error => {
//         dispatch(errorUpdateOrder(error));
//     });
//   }
// }

// export function createOrder() {
//   return (dispatch, getState) => {
//     const state = getState();
//     return api.orders.create({ active: false, group_id: state.orderGroups.selectedId }).then(({status, json}) => {
//         dispatch(successCreateOrder(json.id));
//         dispatch(fetchOrders());
//         dispatch(push('/admin/product/'+json.id));
//     })
//     .catch(error => {
//         //dispatch error
//         console.log(error)
//     });
//   }
// }


// export function fetchOrder(id) {
//   return (dispatch, getState) => {
//     dispatch(requestOrder());
//
//     return api.orders.retrieve(id).then(({status, json}) => {
//       const saleFrom = moment(json.date_sale_from);
//       const saleTo = moment(json.date_sale_to);
//       const stockExpected = moment(json.date_stock_expected);
//
//       json.date_sale_from = saleFrom.isValid() ? saleFrom.toDate() : null;
//       json.date_sale_to = saleTo.isValid() ? saleTo.toDate() : null;
//       json.date_stock_expected = stockExpected.isValid() ? stockExpected.toDate() : null;
//       json.weight = '';
//
//       dispatch(receiveOrder(json))
//     })
//     .catch(error => {
//       dispatch(receiveOrderError(error));
//     });
//   }
// }
