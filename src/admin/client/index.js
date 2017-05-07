import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import {syncHistoryWithStore, routerReducer, routerMiddleware, push} from 'react-router-redux'

import {fetchSettings} from './modules/settings/actions'
import settings from './lib/settings'
import api from './lib/api'
import messages from 'lib/text'
import reducers from 'src/rootReducer'

import layoutLogin from 'layouts/login'
import layoutShared from 'layouts/shared'
import layoutHome from 'layouts/home'
import layoutNotFound from 'layouts/404'
import layoutProducts from 'layouts/products'
import layoutProductEditShared from 'layouts/products/edit/shared'
import layoutProductEditGeneral from 'layouts/products/edit/general'
import layoutProductEditInventory from 'layouts/products/edit/inventory'
import layoutProductEditImages from 'layouts/products/edit/images'
import layoutProductEditVariants from 'layouts/products/edit/variants'
import layoutProductEditOption from 'layouts/products/edit/option'
import layoutProductCategories from 'layouts/products/categories'
import layoutCustomers from 'layouts/customers'
import layoutCustomerEdit from 'layouts/customers/edit'
import layoutCustomerGroups from 'layouts/customers/groups'
import layoutOrders from 'layouts/orders'
import layoutOrdersDetails from 'layouts/orders/edit'
import layoutSettingsShared from 'layouts/settings/shared'
import layoutSettingsGeneral from 'layouts/settings/general/index'
import layoutSettingsGeneralLogo from 'layouts/settings/general/logo'
import layoutSettingsEmail from 'layouts/settings/email/index'
import layoutSettingsSmtp from 'layouts/settings/email/smtp'
import layoutSettingsEmailTemplates from 'layouts/settings/email/templates'
import layoutSettingsThemes from 'layouts/settings/themes'
import layoutSettingsShipping from 'layouts/settings/shipping'
import layoutSettingsShippingEdit from 'layouts/settings/shipping/edit'
import layoutSettingsShippingAdd from 'layouts/settings/shipping/add'
import layoutSettingsPayments from 'layouts/settings/payments'
import layoutSettingsPaymentsEdit from 'layouts/settings/payments/edit'
import layoutSettingsPaymentsAdd from 'layouts/settings/payments/add'
import layoutSettingsCheckout from 'layouts/settings/checkout/index'
import layoutSettingsCheckoutFields from 'layouts/settings/checkout/fields'
import layoutSettingsPages from 'layouts/settings/pages'
import layoutSettingsPagesAdd from 'layouts/settings/pages/add'
import layoutSettingsPagesEdit from 'layouts/settings/pages/edit'
import layoutSettingsTokens from 'layouts/settings/tokens'
import layoutSettingsTokensAdd from 'layouts/settings/tokens/add'
import layoutSettingsTokensEdit from 'layouts/settings/tokens/edit'

const routerMiddlewareConst = routerMiddleware(browserHistory);
const store = createStore(reducers, applyMiddleware(thunkMiddleware, routerMiddlewareConst));
const history = syncHistoryWithStore(browserHistory, store)
store.dispatch(fetchSettings());

const LOGIN_PATH = '/admin/login';
const HOME_PATH = '/admin';

const validateCurrentToken = (nextState, replace) => {
  if (nextState.location.pathname !== LOGIN_PATH) {
    if (!isCurrentTokenValid()) {
      replace({
        pathname: LOGIN_PATH,
        state: {
          nextPathname: nextState.location.pathname
        }
      })
    }
  }
}

const checkTokenFromUrl = (nextState, replace) => {
  if (nextState.location.pathname === LOGIN_PATH) {
    if (nextState.location.query.token) {
      const token = nextState.location.query.token;
      const tokenData = parseToken(token);

      if (tokenData) {
        const expiration_date = tokenData.exp * 1000;
        if (expiration_date > Date.now()) {
          saveTokenData({token, email: tokenData.email, expiration_date});
          api.init(settings.apiBaseUrl, token);
          store.dispatch(fetchSettings());
          replace({
            pathname: HOME_PATH,
            state: {
              nextPathname: nextState.location.pathname
            }
          })
        } else {
          alert('Token is expired')
        }
      } else {
        alert('Token is not valid');
      }
    } else {
      if (isCurrentTokenValid()) {
        replace({
          pathname: HOME_PATH,
          state: {
            nextPathname: nextState.location.pathname
          }
        })
      }
    }
  }
}

const parseToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const tokenData = JSON.parse(atob(payload));
    return tokenData;
  } catch (e) {
    return null;
  }
}

const saveTokenData = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  localStorage.setItem('expiration_date', data.expiration_date);
}

const isCurrentTokenValid = () => {
  const expiration_date = localStorage.getItem('expiration_date');
  return localStorage.getItem('token') && expiration_date && expiration_date > Date.now();
}

const removeToken = (nextState, replace) => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('expiration_date');
  location.replace(LOGIN_PATH);
}

const appElement = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
  <Router history={history}>
    <Route path="/admin" onEnter={validateCurrentToken}>
      <Route path="login" component={layoutLogin} onEnter={checkTokenFromUrl}/>
      <Route path="logout" component={layoutNotFound} onEnter={removeToken}/>
      <Route component={layoutShared}>
        <IndexRoute component={layoutHome}/>
        <Route path="products" component={layoutProducts}/>
        <Route path="products/categories" component={layoutProductCategories}/>

        <Route path="product/:productId" component={layoutProductEditShared}>
          <IndexRoute component={layoutProductEditGeneral}/>
          <Route path="general" component={layoutProductEditGeneral}/>
          <Route path="inventory" component={layoutProductEditInventory}/>
          <Route path="images" component={layoutProductEditImages}/>
          <Route path="variants" component={layoutProductEditVariants}/>
          <Route path="option/:optionId" component={layoutProductEditOption}/>
        </Route>

        <Route path="orders" component={layoutOrders}/>
        <Route path="order/:orderId" component={layoutOrdersDetails}/>
        <Route path="customers" component={layoutCustomers}/>
        <Route path="customer/:id" component={layoutCustomerEdit}/>
        <Route path="customers/groups" component={layoutCustomerGroups}/>

        <Route path="settings" component={layoutSettingsShared}>
          <IndexRoute component={layoutSettingsGeneral}/>
          <Route path="general" component={layoutSettingsGeneral}/>
          <Route path="general/logo" component={layoutSettingsGeneralLogo}/>
          <Route path="theme" component={layoutSettingsThemes}/>
          <Route path="shipping" component={layoutSettingsShipping}/>
          <Route path="shipping/add" component={layoutSettingsShippingAdd}/>
          <Route path="shipping/:id" component={layoutSettingsShippingEdit}/>
          <Route path="payments" component={layoutSettingsPayments}/>
          <Route path="payments/add" component={layoutSettingsPaymentsAdd}/>
          <Route path="payments/:id" component={layoutSettingsPaymentsEdit}/>
          <Route path="checkout" component={layoutSettingsCheckout}/>
          <Route path="checkout/fields/:fieldName" component={layoutSettingsCheckoutFields}/>
          <Route path="email" component={layoutSettingsEmail}/>
          <Route path="email/smtp" component={layoutSettingsSmtp}/>
          <Route path="email/templates/:templateName" component={layoutSettingsEmailTemplates}/>
          <Route path="pages" component={layoutSettingsPages}/>
          <Route path="pages/add" component={layoutSettingsPagesAdd}/>
          <Route path="pages/:pageId" component={layoutSettingsPagesEdit}/>
          <Route path="tokens" component={layoutSettingsTokens}/>
          <Route path="tokens/add" component={layoutSettingsTokensAdd}/>
          <Route path="tokens/:tokenId" component={layoutSettingsTokensEdit}/>
        </Route>

        <Route path="*" component={layoutNotFound} status={404}/>
      </Route>
    </Route>
  </Router>
</Provider>, appElement)
