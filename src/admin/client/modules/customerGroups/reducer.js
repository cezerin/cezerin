import * as t from './actionTypes';

const initialState = {
	items: [],
	isFetched: false,
	isFetching: false,
	isSaving: false,
	errorFetch: null,
	errorUpdate: null,
	selectedId: 'all'
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.GROUPS_REQUEST:
			return Object.assign({}, state, {
				isFetching: true
			});
		case t.GROUPS_RECEIVE:
			return Object.assign({}, state, {
				isFetching: false,
				isFetched: true,
				items: action.items
			});
		case t.GROUPS_FAILURE:
			return Object.assign({}, state, {
				errorFetch: action.error
			});
		case t.GROUPS_SELECT:
			return Object.assign({}, state, {
				selectedId: action.selectedId
			});
		case t.GROUPS_DESELECT:
			return Object.assign({}, state, {
				selectedId: null
			});
		case t.GROUP_UPDATE_REQUEST:
			return Object.assign({}, state, {
				isSaving: true
			});
		case t.GROUP_UPDATE_SUCCESS:
			return Object.assign({}, state, {
				isSaving: false
			});
		case t.GROUP_UPDATE_FAILURE:
			return Object.assign({}, state, {
				isSaving: false,
				errorUpdate: action.error
			});
		case t.GROUP_CREATE_SUCCESS:
		case t.GROUP_DELETE_SUCCESS:
		default:
			return state;
	}
};
