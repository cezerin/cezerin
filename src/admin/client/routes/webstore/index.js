import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import * as auth from 'lib/webstoreAuth'
import NotFound from 'routes/notFound'
import Login from 'routes/webstore/login'
import Account from 'modules/webstore/account'
import Services from 'modules/webstore/services'
import ServiceDetails from 'modules/webstore/serviceDetails'

export default class WebStoreApp extends React.Component {
  componentWillMount() {
    auth.validateCurrentToken();
  }

  render() {
    return(
      <Switch>
        <Route path="/admin/webstore" exact component={Services}/>
        <Route path="/admin/webstore/service/:serviceId" exect component={ServiceDetails}/>
        <Route path="/admin/webstore/login" exact component={Login}/>
        <Route path="/admin/webstore/account" exact component={Account}/>
        <Route component={NotFound}/>
      </Switch>
    )
  }
}
