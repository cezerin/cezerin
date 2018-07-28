import * as t from './actionTypes';

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
		case t.CUSTOMERS_DETAIL_REQUEST:
			return Object.assign({}, state, {});
		case t.CUSTOMERS_DETAIL_RECEIVE:
			return Object.assign({}, state, {
				editCustomer: action.item
			});
		case t.CUSTOMERS_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.CUSTOMERS_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: action.data
			});
		case t.CUSTOMERS_FAILURE:
			return Object.assign({}, state, {
				loadingItems: false,
				errorLoadingItems: action.error
			});
		case t.CUSTOMERS_SELECT:
			return Object.assign({}, state, {
				selected: [...state.selected, action.customerId]
			});
		case t.CUSTOMERS_DESELECT:
			return Object.assign({}, state, {
				selected: state.selected.filter(id => id !== action.customerId)
			});
		case t.CUSTOMERS_DESELECT_ALL:
			return Object.assign({}, state, {
				selected: []
			});
		case t.CUSTOMERS_SELECT_ALL:
			let selected = state.items.map(item => item.id);
			return Object.assign({}, state, {
				selected: selected
			});
		case t.CUSTOMERS_FILTER_SET_SEARCH:
			return Object.assign({}, state, {
				search: action.search
			});
		case t.CUSTOMERS_MORE_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.CUSTOMERS_MORE_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: [...state.items, ...action.data]
			});
		case t.CUSTOMER_DELETE_SUCCESS:
		default:
			return state;
	}
};
