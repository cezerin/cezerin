import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import {syncHistoryWithStore, routerReducer, routerMiddleware, push} from 'react-router-redux'

import settings from 'lib/settings'
import messages from 'src/locales'
import reducers from 'src/rootReducer'

import layoutLogin from 'layouts/login'
import layoutShared from 'layouts/shared'
import layoutHome from 'layouts/home'
import layoutNotFound from 'layouts/404'
import layoutProducts from 'layouts/products'
import layoutProductsEdit from 'layouts/products/edit'
import layoutProductsCategories from 'layouts/products/categories'

import layoutSettingsShared from 'layouts/settings/shared'
import layoutSettingsGeneral from 'layouts/settings/general'
import layoutSettingsThemes from 'layouts/settings/themes'

const routerMiddlewareConst = routerMiddleware(browserHistory);
const store = createStore(reducers, applyMiddleware(thunkMiddleware, routerMiddlewareConst));
const history = syncHistoryWithStore(browserHistory, store)

function checkLogged(nextState, replace) {
  if (localStorage.getItem('token')) {
    replace({
      pathname: '/admin',
      state: {
        nextPathname: nextState.location.pathname
      }
    })
  }
}

function checkToken(nextState, replace) {
  if (nextState.location.pathname !== settings.admin.pages.login && !localStorage.getItem('token')) {
    replace({
      pathname: settings.admin.pages.login,
      state: {
        nextPathname: nextState.location.pathname
      }
    })
  }
}

function removeToken(nextState, replace) {
  localStorage.removeItem('token');
  location.replace(settings.admin.pages.login);
}

var appElement = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
  <Router history={history}>
    <Route path="/admin" onEnter={checkToken}>
      <Route path="login" component={layoutLogin} onEnter={checkLogged}/>
      <Route path="logout" component={layoutNotFound} onEnter={removeToken}/>
      <Route component={layoutShared}>
        <IndexRoute component={layoutHome}/>
        <Route path="orders" component={layoutNotFound}/>
        <Route path="cusomers" component={layoutNotFound}/>
        <Route path="products" component={layoutProducts}/>
        <Route path="product/:id" component={layoutProductsEdit}/>
        <Route path="products/categories" component={layoutProductsCategories}/>
        <Route path="settings" component={layoutSettingsShared}>
          <IndexRoute component={layoutSettingsGeneral}/>
          <Route path="general" component={layoutSettingsGeneral}/>
          <Route path="theme" component={layoutSettingsThemes}/>
          <Route path="shipping" component={layoutNotFound}/>
          <Route path="payments" component={layoutNotFound}/>
        </Route>
      </Route>
    </Route>
  </Router>
</Provider>, appElement)
