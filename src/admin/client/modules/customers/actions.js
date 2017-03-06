import * as t from './actionTypes'
import api from 'lib/api'
import messages from 'lib/text'
// import { push } from 'react-router-redux';
// import moment from 'moment';

// function requestCustomer() {
//   return {
//     type: t.CUSTOMER_EDIT_REQUEST
//   }
// }
//
// function receiveCustomer(item) {
//   return {
//     type: t.CUSTOMER_EDIT_RECEIVE,
//     item
//   }
// }
//
// function receiveCustomerError(error) {
//   return {
//     type: t.CUSTOMER_EDIT_FAILURE,
//     error
//   }
// }

// export function cancelCustomerEdit() {
//   return {
//     type: t.CUSTOMER_EDIT_ERASE
//   }
// }

function requestCustomers() {
  return {
    type: t.CUSTOMERS_REQUEST
  }
}

function requestMoreCustomers() {
  return {
    type: t.CUSTOMERS_MORE_REQUEST
  }
}

function receiveCustomersMore(items) {
  return {
    type: t.CUSTOMERS_MORE_RECEIVE,
    items
  }
}

function receiveCustomers(items) {
  return {
    type: t.CUSTOMERS_RECEIVE,
    items
  }
}

function receiveCustomersError(error) {
  return {
    type: t.CUSTOMERS_FAILURE,
    error
  }
}

export function selectCustomer(id) {
  return {
    type: t.CUSTOMERS_SELECT,
    customerId: id
  }
}

export function deselectCustomer(id) {
  return {
    type: t.CUSTOMERS_DESELECT,
    customerId: id
  }
}

export function deselectAllCustomer() {
  return {
    type: t.CUSTOMERS_DESELECT_ALL
  }
}

export function selectAllCustomer() {
  return {
    type: t.CUSTOMERS_SELECT_ALL
  }
}

export function setFilterSearch(value) {
  return {
    type: t.CUSTOMERS_FILTER_SET_SEARCH,
    search: value
  }
}

// export function setFilterStock(value) {
//   return {
//     type: t.CUSTOMERS_FILTER_SET_STOCK,
//     stock_status: value
//   }
// }
//
// export function setFilterActive(value) {
//   return {
//     type: t.CUSTOMERS_FILTER_SET_ACTIVE,
//     active: value
//   }
// }
//
// export function setFilterDiscontinued(value) {
//   return {
//     type: t.CUSTOMERS_FILTER_SET_DISCONTINUED,
//     discontinued: value
//   }
// }
//
// export function setFilterOnSale(value) {
//   return {
//     type: t.CUSTOMERS_FILTER_SET_ONSALE,
//     on_sale: value
//   }
// }
//
function deleteCustomersSuccess() {
  return {
    type: t.CUSTOMER_DELETE_SUCCESS
  }
}

function setGroupSuccess() {
  return {
    type: t.CUSTOMER_SET_GROUP_SUCCESS
  }
}
//
// function requestUpdateCustomer(id) {
//   return {
//     type: t.CUSTOMER_UPDATE_REQUEST
//   }
// }
//
// function receiveUpdateCustomer() {
//   return {
//     type: t.CUSTOMER_UPDATE_SUCCESS
//   }
// }
//
// function errorUpdateCustomer(error) {
//   return {
//     type: t.CUSTOMER_UPDATE_FAILURE,
//     error
//   }
// }
//
// function successCreateCustomer(id) {
//   return {
//     type: t.CUSTOMER_CREATE_SUCCESS
//   }
// }

export function fetchCustomers() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.customers.isFetchingItems) {
      dispatch(requestCustomers());
      dispatch(deselectAllCustomer());

      let filter = { limit: 20 };
      filter.search = state.customers.filter_search;

      if(state.customerGroups.selectedId) {
        filter.group_id = state.customerGroups.selectedId;
      }

      return api.customers.list(filter)
        .then(({status, json}) => {
          dispatch(receiveCustomers(json))
        })
        .catch(error => {
            dispatch(receiveCustomersError(error));
        });
    }
  }
}

export function fetchMoreCustomers() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(requestMoreCustomers());

    let filter = { limit: 50 };
    filter.offset = state.customers.items.length;
    filter.search = state.customers.filter_search;

    if(state.customerGroups.selectedId) {
      filter.group_id = state.customerGroups.selectedId;
    }

    return api.customers.list(filter)
      .then(({status, json}) => {
        dispatch(receiveCustomersMore(json))
      })
      .catch(error => {
          dispatch(receiveCustomersError(error));
      });
  }
}

export function deleteCustomers() {
  return (dispatch, getState) => {
    const state = getState();
    let promises = state.customers.selected.map(customerId => api.customers.delete(customerId));

    return Promise.all(promises).then(values => {
      dispatch(deleteCustomersSuccess());
      dispatch(deselectAllCustomer());
      dispatch(fetchCustomers());
    }).catch(err => { console.log(err) });
  }
}

export function setGroup(group_id) {
  return (dispatch, getState) => {
    const state = getState();
    let promises = state.customers.selected.map(customerId => api.customers.update(customerId, { group_id: group_id }));

    return Promise.all(promises).then(values => {
      dispatch(setGroupSuccess());
      dispatch(deselectAllCustomer());
      dispatch(fetchCustomers());
    }).catch(err => { console.log(err) });
  }
}

// export function updateCustomer(data) {
//   return (dispatch, getState) => {
//     dispatch(requestUpdateCustomer(data.id));
//
//     delete data.images;
//     if(!data.slug || data.slug === '') {
//       data.slug = data.name;
//     }
//
//     return api.customers.update(data.id, data).then(({status, json}) => {
//         dispatch(receiveUpdateCustomer());
//         dispatch(fetchCustomers());
//     })
//     .catch(error => {
//         dispatch(errorUpdateCustomer(error));
//     });
//   }
// }

// export function createCustomer() {
//   return (dispatch, getState) => {
//     const state = getState();
//     return api.customers.create({ active: false, group_id: state.customerGroups.selectedId }).then(({status, json}) => {
//         dispatch(successCreateCustomer(json.id));
//         dispatch(fetchCustomers());
//         dispatch(push('/admin/product/'+json.id));
//     })
//     .catch(error => {
//         //dispatch error
//         console.log(error)
//     });
//   }
// }


// export function fetchCustomer(id) {
//   return (dispatch, getState) => {
//     dispatch(requestCustomer());
//
//     return api.customers.retrieve(id).then(({status, json}) => {
//       const saleFrom = moment(json.date_sale_from);
//       const saleTo = moment(json.date_sale_to);
//       const stockExpected = moment(json.date_stock_expected);
//
//       json.date_sale_from = saleFrom.isValid() ? saleFrom.toDate() : null;
//       json.date_sale_to = saleTo.isValid() ? saleTo.toDate() : null;
//       json.date_stock_expected = stockExpected.isValid() ? stockExpected.toDate() : null;
//       json.weight = '';
//
//       dispatch(receiveCustomer(json))
//     })
//     .catch(error => {
//       dispatch(receiveCustomerError(error));
//     });
//   }
// }
