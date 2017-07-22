import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import messages from 'lib/text'
import WebStoreAccount from 'modules/webstore/account'
import WebStoreAccountDeveloper from 'modules/webstore/accountDeveloper'
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  link: {
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: 'inherit',
    display: 'block'
  },
  linkActive: {
    backgroundColor: 'rgba(0,0,0,0.1)'
  }
}

const AccountMenu = () => (
  <List>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to="/admin/webstore/account" exact={true}><ListItem primaryText={messages.account} leftIcon={<FontIcon className="material-icons">person</FontIcon>}/></NavLink>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to="/admin/webstore/account/developer"><ListItem primaryText={messages.developerProfile} leftIcon={<FontIcon className="material-icons">build</FontIcon>}/></NavLink>
  </List>
)

const AccountApp = ({ match }) => {
  return (
    <div className="row row--no-gutter col-full-height">
      <div className="col-xs-3 col--no-gutter scroll col-full-height">
        <AccountMenu/>
      </div>
      <div className="col-xs-9 col--no-gutter scroll col-full-height">
        <Switch>
          <Route path="/admin/webstore/account" exact component={WebStoreAccount}/>
          <Route path="/admin/webstore/account/developer" exact component={WebStoreAccountDeveloper}/>
        </Switch>
      </div>
    </div>
  )
}

export default AccountApp;
