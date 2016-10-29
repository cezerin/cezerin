import React from 'react';
import { Link } from 'react-router'

import settings from 'lib/settings'
import messages from 'src/locale'
import ProductCategoryActions from 'modules/product-categories/actions/index'
import Drawer from './drawer'
import Search from './search'

import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import LinearProgress from 'material-ui/LinearProgress';

export default class AppBarTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    const { isLoading, category } = this.props;
    const location = this.props.location.pathname;
    const menu = settings.admin.menu;

    let title = 'Dashboard';
    let leftButton = <IconButton onTouchTap={this.handleToggle}><FontIcon className="material-icons">menu</FontIcon></IconButton>;
    let rightElements = null;
    {/* <IconButton><FontIcon color="#fff" className="material-icons">notifications</FontIcon></IconButton> */}

    if(location === '/admin/products'){
      title = messages.products.title;
      if(category){
        title = category.name;
      }

      rightElements = <div style={{float:'left'}}>
      <Search style={{float:'left'}} />
      <IconButton><FontIcon color="#fff" className="material-icons">delete</FontIcon></IconButton>
      <IconMenu
        iconButtonElement={
          <IconButton><FontIcon color="#fff" className="material-icons">more_vert</FontIcon></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Refresh" />
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
      </IconMenu>
      </div>
    }
    else if(location.startsWith('/admin/product/')){
      title = '';
      leftButton = <IconButton><Link to="/admin/products"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = <div style={{float:'left'}}>
      <IconButton><FontIcon color="#fff" className="material-icons">delete</FontIcon></IconButton>
      <IconMenu
        iconButtonElement={
          <IconButton><FontIcon color="#fff" className="material-icons">more_vert</FontIcon></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Refresh" />
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
      </IconMenu>
      </div>
    }
    else if(location === '/admin/products/categories'){
      title = messages.productCategories.title;
      if(category){
        title = category.name;
        rightElements = <ProductCategoryActions />
      }
    }

    return (
      <div>
        {isLoading &&
          <LinearProgress mode="indeterminate" color="#fff" style={{ backgroundColor: 'transparent', borderRadius: 0, height: 2, zIndex: 1101, top: 0, position: 'absolute'  }} />
        }
        <AppBar
          style={{ paddingLeft: 28, paddingRight: 28 }}
          titleStyle={{ fontSize: 18 }}
          title={title}
          iconElementLeft={leftButton}
          iconElementRight={rightElements}
        />

        <Drawer open={this.state.open} handleClose={(open) => this.handleClose()} menu={menu} title={<span>Menu</span>} currentUrl={location} />
      </div>
    );
  }
}
