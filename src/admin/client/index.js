import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import {fetchSettings} from 'modules/settings/actions'
import settings from 'lib/settings'
import reducers from './rootReducer'
import App from './app'
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));
store.dispatch(fetchSettings());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'));

//registerServiceWorker();
