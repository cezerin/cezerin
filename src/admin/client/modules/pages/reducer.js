import * as t from './actionTypes';

const initialState = {
	pages: [],
	pageEdit: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.PAGES_RECEIVE:
			return Object.assign({}, state, { pages: action.pages });
		case t.PAGE_RECEIVE:
			return Object.assign({}, state, { pageEdit: action.pageEdit });
		default:
			return state;
	}
};
