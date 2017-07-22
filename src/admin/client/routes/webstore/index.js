import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import * as auth from 'lib/webstoreAuth'
import WebStoreLogin from 'routes/webstore/login'

const WebStoreHome = () => {
  return (
    <div>
      Apps
    </div>
  )
}

export default class WebStoreApp extends React.Component {
  componentWillMount() {
    auth.validateCurrentToken();
  }

  render() {
    return(
      <Switch>
        <Route path="/admin/webstore" exact component={WebStoreHome}/>
        <Route path="/admin/webstore/login" exact component={WebStoreLogin}/>
      </Switch>
    )
  }
}
