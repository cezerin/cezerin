import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

import settings from 'lib/settings'
import messages from 'src/locale'
import reducers from 'src/rootReducer'

import layoutLogin from 'layout/login'
import layoutShared from 'layout/shared'
import layoutHome from 'layout/home'
import layoutNotFound from 'layout/404'
import layoutProducts from 'layout/products'
import layoutProductsEdit from 'layout/products/edit'
import layoutProductsCategories from 'layout/products/categories'

const routerMiddlewareConst = routerMiddleware(browserHistory);
const store = createStore(reducers, applyMiddleware(thunkMiddleware, routerMiddlewareConst));
const history = syncHistoryWithStore(browserHistory, store)



function checkLogged(nextState, replace) {
  if(localStorage.getItem('token')) {
    replace({
      pathname: '/admin',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function checkToken(nextState, replace){
  if(nextState.location.pathname !== settings.admin.pages.login && !localStorage.getItem('token')) {
    replace({
      pathname: settings.admin.pages.login,
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function removeToken(nextState, replace){
  localStorage.removeItem('token');
  location.replace(settings.admin.pages.login);
}


var appElement = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/admin" onEnter={checkToken}>
        <Route path="login" component={layoutLogin} onEnter={checkLogged} />
        <Route path="logout" component={layoutNotFound} onEnter={removeToken} />
        <Route component={layoutShared}>
          <IndexRoute component={layoutHome} />
          <Route path="orders" component={layoutNotFound} />
          <Route path="cusomers" component={layoutNotFound} />
          <Route path="products" component={layoutProducts} />
          <Route path="product/:url" component={layoutNotFound} />
          <Route path="products/categories" component={layoutProductsCategories} />
          <Route path="*" component={layoutNotFound} />
        </Route>
      </Route>
    </Router>
  </Provider>
, appElement)
