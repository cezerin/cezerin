import { routerReducer, LOCATION_CHANGE } from 'react-router-redux';
import { combineReducers } from 'redux';
import productCategories from './reducer';

const initialState = {
  location: null,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return Object.assign({}, state, {
        location: action.payload
      });
    default:
      return state
  }
}

export default combineReducers({
  app: appReducer,
  routing: routerReducer,
  productCategories,
});
