import React from 'react'
import {Link} from 'react-router'
import messages from 'lib/text'
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

const SettingsMenu = () => (
  <List>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/general"><ListItem primaryText={messages.settings_general} leftIcon={<FontIcon className="material-icons">settings</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/shipping"><ListItem primaryText={messages.settings_shipping} leftIcon={<FontIcon className="material-icons">local_shipping</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/payments"><ListItem primaryText={messages.settings_payments} leftIcon={<FontIcon className="material-icons">payment</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/theme"><ListItem primaryText={messages.settings_theme} leftIcon={<FontIcon className="material-icons">palette</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/checkout"><ListItem primaryText={messages.settings_checkout} leftIcon={<FontIcon className="material-icons">shopping_cart</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/email"><ListItem primaryText={messages.settings_emails} leftIcon={<FontIcon className="material-icons">email</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/pages"><ListItem primaryText={messages.settings_pages} leftIcon={<FontIcon className="material-icons">description</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/tokens"><ListItem primaryText={messages.settings_tokens} leftIcon={<FontIcon className="material-icons">vpn_key</FontIcon>}/></Link>
    {/* <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/taxes"><ListItem primaryText={messages.settings_taxes} leftIcon={<FontIcon className="material-icons">attach_money</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to="/admin/settings/security"><ListItem primaryText={messages.settings_security} leftIcon={<FontIcon className="material-icons">security</FontIcon>}/></Link> */}
  </List>
)

export default({children}) => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-full-height right-border">
      <SettingsMenu/>
    </div>
    <div className="col-xs-9 col--no-gutter scroll col-full-height">
      {children}
    </div>
  </div>
)
