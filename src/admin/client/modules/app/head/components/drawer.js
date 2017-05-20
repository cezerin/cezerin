import React from 'react';
import { Link } from 'react-router'

import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

let styles = {
  icon: {
    left: 14,
    color: 'rgba(0,0,0,0.54)'
  },
  iconActive: {
    left: 14,
    color: 'inherit'
  },
  item: {
    paddingLeft: 80,
    fontSize: 14,
    fontWeight: 500
  },
  itemActive: {
    color: 'rgb(25, 118, 210)',
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  appBar: {
    backgroundColor: '#fff',
    paddingLeft: 30
  },
  appBarTitle: {
    color: '#777',
    fontSize: 18
  }
}

const SideBar = ({ open, handleClose, items, title, currentUrl }) => {
  return (
    <Drawer
      docked={false}
      width={280}
      open={open}
      onRequestChange={handleClose}
    >
      <AppBar
        title={title}
        style={styles.appBar}
        titleStyle={styles.appBarTitle}
        zDepth={0}
        iconElementLeft={
          <IconButton onTouchTap={handleClose}>
            <FontIcon color="#9e9e9e" className="material-icons">menu</FontIcon>
          </IconButton>
        }
      />

      <Menu onItemTouchTap={handleClose} value={currentUrl} selectedMenuItemStyle={styles.itemActive} listStyle={{ paddingTop: 0 }} disableAutoFocus={true}>
        {items.map((item) => {
          if(item.title === '-') {
            return <Divider key={item.url} />
          } else {
            return <MenuItem
              key={item.url}
              value={item.url}
              containerElement={<Link to={item.url} />}
              primaryText={item.title}
              innerDivStyle={styles.item}
              leftIcon={<FontIcon style={item.url === currentUrl ? styles.iconActive : styles.icon} className="material-icons">{item.icon}</FontIcon>}
            />
          }
        })}
      </Menu>
    </Drawer>
  )
}

export default SideBar
