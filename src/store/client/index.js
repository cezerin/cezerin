import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'
import reducers from '../shared/reducers'
import * as analytics from '../shared/analytics'
import App from '../shared/app'

const initialState = window.__APP_STATE__;
const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'))

analytics.onPageLoad({ state: initialState });
