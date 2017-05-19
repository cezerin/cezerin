import * as t from './actionTypes'

const initialState = {
  editCustomer: null,
  items: [],
  selected: [],
  hasMore: false,
  totalCount: 0,
  loadingItems: false,
  errorLoadingItems: null,
  search: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case t.CUSTOMER_EDIT_REQUEST:
    //   return Object.assign({}, state, {
    //     isFetchingEdit: true
    //   })
    // case t.CUSTOMER_EDIT_RECEIVE:
    //   return Object.assign({}, state, {
    //     isFetchingEdit: false,
    //     editItem: action.item
    //   })
    // case t.CUSTOMER_EDIT_ERASE:
    //   return Object.assign({}, state, {
    //     isFetchingEdit: false,
    //     editItem: null
    //   })
    // case t.CUSTOMER_EDIT_FAILURE:
    //   return Object.assign({}, state, {
    //     isFetchingEdit: true,
    //     errorFetchEdit: action.error
    //   })
    case t.CUSTOMERS_REQUEST:
      return Object.assign({}, state, {
        loadingItems: true
      })
    case t.CUSTOMERS_RECEIVE:
      return Object.assign({}, state, {
        loadingItems: false,
        hasMore: action.has_more,
        totalCount: action.total_count,
        items: action.data
      })
    case t.CUSTOMERS_FAILURE:
      return Object.assign({}, state, {
        loadingItems: false,
        errorLoadingItems: action.error
      })
    case t.CUSTOMERS_SELECT:
      return Object.assign({}, state, {
        selected: [...state.selected, action.customerId]
      })
    case t.CUSTOMERS_DESELECT:
      return Object.assign({}, state, {
        selected: state.selected.filter(id => id !== action.customerId)
      })
    case t.CUSTOMERS_DESELECT_ALL:
      return Object.assign({}, state, {
        selected: []
      })
    case t.CUSTOMERS_SELECT_ALL:
      let selected = state.items.map(item => item.id);
      return Object.assign({}, state, {
        selected: selected
      })
    case t.CUSTOMERS_FILTER_SET_SEARCH:
      return Object.assign({}, state, {
        search: action.search
      })
    case t.CUSTOMERS_MORE_REQUEST:
      return Object.assign({}, state, {
        loadingItems: true
      })
    case t.CUSTOMERS_MORE_RECEIVE:
      return Object.assign({}, state, {
        loadingItems: false,
        hasMore: action.has_more,
        totalCount: action.total_count,
        items: [...state.items, ...action.data]
      })
    // case t.CUSTOMER_UPDATE_REQUEST:
    // case t.CUSTOMER_UPDATE_SUCCESS:
    // case t.CUSTOMER_UPDATE_FAILURE:
    case t.CUSTOMER_SET_CATEGORY_SUCCESS:
    case t.CUSTOMER_DELETE_SUCCESS:
    default:
      return state
  }
}
