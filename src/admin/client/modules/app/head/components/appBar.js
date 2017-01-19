import React from 'react';
import { Link } from 'react-router'

import settings from 'lib/settings'
import messages from 'src/locales'
import ProductCategoryHead from 'modules/product-categories/head/index'
import CustomerGroupHead from 'modules/customer-groups/head/index'
import CustomersHead from 'modules/customers/head/index'
import ProductsHead from 'modules/products/head/index'
import Drawer from './drawer'

import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import LinearProgress from 'material-ui/LinearProgress';

let drawerItems = [
  {
    title: messages.drawer.home,
    url: '/admin',
    icon: 'home'
  }, {
    title: messages.drawer.products,
    url: '/admin/products',
    icon: 'local_offer'
  }, {
    title: messages.drawer.orders,
    url: '/admin/orders',
    icon: 'shopping_cart'
  }, {
    title: messages.drawer.customers,
    url: '/admin/customers',
    icon: 'person'
  }, {
    title: '-',
    url: 'settings'
  }, {
    title: messages.drawer.settings,
    url: '/admin/settings',
    icon: 'settings'
  }, {
    title: messages.drawer.logout,
    url: '/admin/logout',
    icon: 'exit_to_app'
  }
]

export default class AppBarTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    const { isLoading, productCategory, productsSelectedCount, customersSelectedCount, customerGroup } = this.props;
    const location = this.props.location.pathname;

    let title = 'Dashboard';
    let leftButton = <IconButton onTouchTap={this.handleToggle}><FontIcon className="material-icons">menu</FontIcon></IconButton>;
    let rightElements = null;
    {/* <IconButton><FontIcon color="#fff" className="material-icons">notifications</FontIcon></IconButton> */}

    if(location === '/admin/products'){
      title = messages.products.title;

      if(productCategory){
        title = <span>{messages.products.title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{productCategory.name}</span>;
      }

      if(productsSelectedCount > 0) {
        title = `${productsSelectedCount} ${messages.selected}`;
      }

      rightElements = <ProductsHead />
    }
    else if(location.startsWith('/admin/product/')){
      title = title = messages.products.titleEdit;
      leftButton = <IconButton><Link to="/admin/products"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = null;
    }
    else if(location === '/admin/products/categories'){
      title = messages.productCategories.title;
      leftButton = <IconButton><Link to="/admin/products"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      if(productCategory){
        title = title = messages.productCategories.titleEdit;;
        rightElements = <ProductCategoryHead />
      }
    }
    else if(location === '/admin/customers'){
      title = messages.customers.title;

      if(customerGroup) {
        title = <span>{messages.customers.title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{customerGroup.name}</span>;
      }

      if(customersSelectedCount > 0) {
        title = `${customersSelectedCount} ${messages.selected}`;
      }

      rightElements = <CustomersHead />
    }
    else if(location === '/admin/customers/groups'){
      title = messages.customerGroups.title;
      leftButton = <IconButton><Link to="/admin/customers"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      if(customerGroup){
        title = title = messages.customerGroups.titleEdit;;
        rightElements = <CustomerGroupHead />
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

        <Drawer open={this.state.open} handleClose={(open) => this.handleClose()} items={drawerItems} title={<span>{messages.drawer.title}</span>} currentUrl={location} />
      </div>
    );
  }
}
