import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import {fetchSettings} from 'modules/settings/actions'
import settings from 'lib/settings'
import {listenEvents} from 'lib/events'
import reducers from './rootReducer'
import App from './app'
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));
store.dispatch(fetchSettings());

if (!!window.EventSource) {
  listenEvents(store);
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'));

//registerServiceWorker();
