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
    color: '#616161'
  },
  activeIcon: {
    left: 14,
    color: 'inherit'
  },
  item: {
    paddingLeft: 80,
    // fontSize: 14,
    // fontWeight: 500
  },
  selected: {
    color: '#ff5722',
    backgroundColor: '#f5f5f5'
  }
}

const SideBar = ({ open, handleClose, menu, title, currentUrl }) => {
  return (
    <Drawer
      docked={false}
      width={280}
      open={open}
      onRequestChange={handleClose}
    >
      <AppBar
        title={title}
        style={{ backgroundColor: '#fff', paddingLeft: 30 }}
        titleStyle={{ color: '#777', fontSize: 18 }}
        zDepth={0}
        iconElementLeft={
          <IconButton onTouchTap={handleClose}>
            <FontIcon color="#9e9e9e" className="material-icons">menu</FontIcon>
          </IconButton>
        }
      />

      <Menu onItemTouchTap={handleClose} value={currentUrl} selectedMenuItemStyle={styles.selected} disableAutoFocus={true}>
        {menu.map((item) => {
          if(item.title === '-') {
            return <Divider key={item.url} />
          } else {
            return <MenuItem
              key={item.url}
              value={item.url}
              containerElement={<Link to={item.url} />}
              primaryText={item.title}
              innerDivStyle={styles.item}
              leftIcon={<FontIcon style={item.url === currentUrl ? styles.activeIcon : styles.icon} className="material-icons">{item.icon}</FontIcon>}
            />
          }
        })}
      </Menu>
    </Drawer>
  )
}

export default SideBar
