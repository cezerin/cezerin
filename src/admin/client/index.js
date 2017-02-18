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
import layoutProductEdit from 'layouts/products/edit'
import layoutProductCategories from 'layouts/products/categories'
import layoutCustomers from 'layouts/customers'
import layoutCustomerEdit from 'layouts/customers/edit'
import layoutCustomerGroups from 'layouts/customers/groups'
import layoutSettingsShared from 'layouts/settings/shared'
import layoutSettingsGeneral from 'layouts/settings/general'
import layoutSettingsEmail from 'layouts/settings/email/index'
import layoutSettingsSmtp from 'layouts/settings/email/smtp'
import layoutSettingsEmailTemplates from 'layouts/settings/email/templates'
import layoutSettingsThemes from 'layouts/settings/themes'
import layoutSettingsShipping from 'layouts/settings/shipping'
import layoutSettingsShippingEdit from 'layouts/settings/shipping/edit'
import layoutSettingsPayments from 'layouts/settings/payments'
import layoutSettingsPaymentsEdit from 'layouts/settings/payments/edit'
import layoutOrders from 'layouts/orders'

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
        <Route path="products" component={layoutProducts}/>
        <Route path="product/:id" component={layoutProductEdit}/>
        <Route path="products/categories" component={layoutProductCategories}/>
        <Route path="orders" component={layoutOrders}/>
        <Route path="customers" component={layoutCustomers}/>
        <Route path="customer/:id" component={layoutCustomerEdit}/>
        <Route path="customers/groups" component={layoutCustomerGroups}/>
        <Route path="discounts" component={layoutNotFound}/>
        <Route path="reports" component={layoutNotFound}/>
        <Route path="settings" component={layoutSettingsShared}>
          <IndexRoute component={layoutSettingsGeneral}/>
          <Route path="general" component={layoutSettingsGeneral}/>
          <Route path="theme" component={layoutSettingsThemes}/>
          <Route path="shipping" component={layoutSettingsShipping}/>
          <Route path="shipping/:id" component={layoutSettingsShippingEdit}/>
          <Route path="payments" component={layoutSettingsPayments}/>
          <Route path="payments/:id" component={layoutSettingsPaymentsEdit}/>
          <Route path="checkout" component={layoutNotFound}/>
          <Route path="email" component={layoutSettingsEmail}/>
          <Route path="email/smtp" component={layoutSettingsSmtp}/>
          <Route path="email/templates/:templateName" component={layoutSettingsEmailTemplates}/>
          <Route path="taxes" component={layoutNotFound}/>
          <Route path="security" component={layoutNotFound}/>
        </Route>
      </Route>
    </Route>
  </Router>
</Provider>, appElement)
