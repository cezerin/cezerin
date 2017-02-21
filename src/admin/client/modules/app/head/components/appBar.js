import React from 'react';
import { Link } from 'react-router'

import messages from 'src/locales'
import ProductCategoryHead from 'modules/product-categories/head/index'
import CustomerGroupHead from 'modules/customer-groups/head/index'
import CustomersHead from 'modules/customers/head/index'
import ProductsHead from 'modules/products/head/index'
import OrdersHead from 'modules/orders/head/index'
import PaymentMethodHead from 'modules/settings/paymentsEdit/head'
import ShippingMethodHead from 'modules/settings/shippingEdit/head'
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
  },{
    title: messages.drawer.discounts,
    url: '/admin/discounts',
    icon: 'content_cut'
  },{
    title: messages.drawer.reports,
    url: '/admin/reports',
    icon: 'timeline'
  },{
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
    const { isLoading, productCategory, productsSelectedCount, customersSelectedCount, customerGroup, ordersSelectedCount } = this.props;
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
    if(location === '/admin/orders'){
      title = messages.orders.title;

      if(ordersSelectedCount > 0) {
        title = `${ordersSelectedCount} ${messages.selected}`;
      }

      rightElements = <OrdersHead />
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
    else if(location === '/admin/settings/email'){
      title = messages.settings.emailSettings;
    }
    else if(location === '/admin/settings/email/smtp'){
      title = messages.settings.smtpSettings;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/email/templates/order_confirmation'){
      title = messages.settings.orderConfirmation;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/email/templates/customer_registration'){
      title = messages.settings.customerRegistration;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/email/templates/customer_recovery'){
      title = messages.settings.customerRecovery;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/theme'){
      title = messages.settings.themeSettings;
    }
    else if(location === '/admin/settings/checkout'){
      title = messages.settings.checkoutSettings;
    }
    else if(location === '/admin/settings/checkout/fields/email'){
      title = messages.email;
      leftButton = <IconButton><Link to="/admin/settings/checkout"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/checkout/fields/mobile'){
      title = messages.mobile;
      leftButton = <IconButton><Link to="/admin/settings/checkout"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/checkout/fields/country'){
      title = messages.country;
      leftButton = <IconButton><Link to="/admin/settings/checkout"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/checkout/fields/state'){
      title = messages.state;
      leftButton = <IconButton><Link to="/admin/settings/checkout"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/checkout/fields/city'){
      title = messages.city;
      leftButton = <IconButton><Link to="/admin/settings/checkout"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/shipping'){
      title = messages.settings.shippingMethods;
    }
    else if(location === '/admin/settings/payments'){
      title = messages.settings.paymentsMethods;
    }
    else if(location === '/admin/settings/shipping/add'){
      title = messages.settings.addShippingMethod;
      leftButton = <IconButton><Link to="/admin/settings/shipping"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/payments/add'){
      title = messages.settings.addPaymentMethod;
      leftButton = <IconButton><Link to="/admin/settings/payments"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location.startsWith('/admin/settings/shipping/')){
      title = messages.settings.editShippingMethod;
      leftButton = <IconButton><Link to="/admin/settings/shipping"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = <ShippingMethodHead />
    }
    else if(location.startsWith('/admin/settings/payments/')){
      title = messages.settings.editPaymentMethod;
      leftButton = <IconButton><Link to="/admin/settings/payments"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = <PaymentMethodHead />
    }
    else if(location === '/admin/settings/general' || location === '/admin/settings'){
      title = messages.settings.generalSettings;
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
