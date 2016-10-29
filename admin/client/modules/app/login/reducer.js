import * as t from './actionTypes'

const initialState = {
	isFetching: false,
	isAuthenticated: false,
	user: null,
	errorMessage: null
};

export default(state = initialState, action) => {
	switch (action.type) {
		case t.LOGIN_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false,
				user: action.email,
				errorMessage: null
			});
		case t.LOGIN_SUCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: true,
				user: action.email,
				errorMessage: null
			});
		case t.LOGIN_FAILURE:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false,
				user: null,
				errorMessage: action.error
			});
		case t.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false,
				user: null,
				errorMessage: null
			});
		default:
			return state
	}
}
