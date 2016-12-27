import React from 'react'
import {Link} from 'react-router'
import messages from 'src/locales'
import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  link: {
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: 'inherit'
  }
}

const SettingsMenu = () => (
  <List>
    <Link style={styles.link} to="/admin/settings/general"><ListItem primaryText={messages.settings.general} leftIcon={<FontIcon className="material-icons">settings</FontIcon>}/></Link>
    <Link style={styles.link} to="/admin/settings/shipping"><ListItem primaryText={messages.settings.shipping} leftIcon={<FontIcon className="material-icons">local_shipping</FontIcon>}/></Link>
    <Link style={styles.link} to="/admin/settings/payments"><ListItem primaryText={messages.settings.payments} leftIcon={<FontIcon className="material-icons">payment</FontIcon>}/></Link>
    <Link style={styles.link} to="/admin/settings/theme"><ListItem primaryText={messages.settings.theme} leftIcon={<FontIcon className="material-icons">palette</FontIcon>}/></Link>
  </List>
)

export default({children}) => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-categories">
      <SettingsMenu/>
    </div>
    <div className="col-xs-9 col--no-gutter scroll">
      {children}
    </div>
  </div>
)
