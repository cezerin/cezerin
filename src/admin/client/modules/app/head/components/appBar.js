import React from 'react';
import { Link } from 'react-router'

import messages from 'lib/text'
import ProductCategoryHead from 'modules/product-categories/head/index'
import CustomerGroupHead from 'modules/customer-groups/head/index'
import CustomersHead from 'modules/customers/head/index'
import ProductsHead from 'modules/products/head/index'
import OrdersHead from 'modules/orders/head/index'
import PaymentMethodHead from 'modules/settings/paymentsEdit/head'
import ShippingMethodHead from 'modules/settings/shippingEdit/head'
import PageHead from 'modules/settings/pages/edit/head'
import Drawer from './drawer'

import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';

let drawerItems = [
  {
    title: messages.drawer_home,
    url: '/admin/',
    icon: 'home'
  }, {
    title: messages.drawer_products,
    url: '/admin/products',
    icon: 'local_offer'
  }, {
    title: messages.drawer_orders,
    url: '/admin/orders',
    icon: 'shopping_cart'
  }, {
    title: messages.drawer_customers,
    url: '/admin/customers',
    icon: 'person'
  },
  // {
  //   title: messages.drawer_discounts,
  //   url: '/admin/discounts',
  //   icon: 'content_cut'
  // },{
  //   title: messages.drawer_reports,
  //   url: '/admin/reports',
  //   icon: 'timeline'
  // },
  {
    title: '-',
    url: 'settings'
  }, {
    title: messages.drawer_settings,
    url: '/admin/settings',
    icon: 'settings'
  }, {
    title: messages.drawer_logout,
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
    const { productCategory, productsSelectedCount, customersSelectedCount, customerGroup, ordersSelectedCount } = this.props;
    const location = this.props.location.pathname;

    let title = 'Dashboard';
    let leftButton = <IconButton onTouchTap={this.handleToggle}><FontIcon className="material-icons">menu</FontIcon></IconButton>;
    let rightElements = null;
    {/* <IconButton><FontIcon color="#fff" className="material-icons">notifications</FontIcon></IconButton> */}

    if(location === '/admin/products'){
      title = messages.products_title;

      if(productCategory){
        title = <span>{messages.products_title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{productCategory.name}</span>;
      }

      if(productsSelectedCount > 0) {
        title = `${productsSelectedCount} ${messages.selected}`;
      }

      rightElements = <ProductsHead />
    }
    if(location === '/admin/orders'){
      title = messages.orders_title;

      if(ordersSelectedCount > 0) {
        title = `${ordersSelectedCount} ${messages.selected}`;
      }

      rightElements = <OrdersHead />
    }
    else if(location.startsWith('/admin/product/')){
      title = title = messages.products_titleEdit;
      leftButton = <IconButton><Link to="/admin/products"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = null;
    }
    else if(location === '/admin/products/categories'){
      title = messages.productCategories_title;
      leftButton = <IconButton><Link to="/admin/products"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      if(productCategory){
        title = title = messages.productCategories_titleEdit;;
        rightElements = <ProductCategoryHead />
      }
    }
    else if(location === '/admin/customers'){
      title = messages.customers_title;

      if(customerGroup) {
        title = <span>{messages.customers_title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{customerGroup.name}</span>;
      }

      if(customersSelectedCount > 0) {
        title = `${customersSelectedCount} ${messages.selected}`;
      }

      rightElements = <CustomersHead />
    }
    else if(location === '/admin/customers/groups'){
      title = messages.customerGroups_title;
      leftButton = <IconButton><Link to="/admin/customers"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      if(customerGroup){
        title = title = messages.customerGroups_titleEdit;;
        rightElements = <CustomerGroupHead />
      }
    }
    else if(location === '/admin/settings/email'){
      title = messages.settings_emailSettings;
    }
    else if(location === '/admin/settings/email/smtp'){
      title = messages.settings_smtpSettings;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/email/templates/order_confirmation'){
      title = messages.settings_orderConfirmation;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/email/templates/customer_registration'){
      title = messages.settings_customerRegistration;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/email/templates/customer_recovery'){
      title = messages.settings_customerRecovery;
      leftButton = <IconButton><Link to="/admin/settings/email"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/theme'){
      title = messages.settings_themeSettings;
    }
    else if(location === '/admin/settings/checkout'){
      title = messages.settings_checkoutSettings;
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
      title = messages.settings_shippingMethods;
    }
    else if(location === '/admin/settings/payments'){
      title = messages.settings_paymentsMethods;
    }
    else if(location === '/admin/settings/shipping/add'){
      title = messages.settings_addShippingMethod;
      leftButton = <IconButton><Link to="/admin/settings/shipping"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location === '/admin/settings/payments/add'){
      title = messages.settings_addPaymentMethod;
      leftButton = <IconButton><Link to="/admin/settings/payments"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location.startsWith('/admin/settings/shipping/')){
      title = messages.settings_editShippingMethod;
      leftButton = <IconButton><Link to="/admin/settings/shipping"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = <ShippingMethodHead />
    }
    else if(location.startsWith('/admin/settings/payments/')){
      title = messages.settings_editPaymentMethod;
      leftButton = <IconButton><Link to="/admin/settings/payments"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = <PaymentMethodHead />
    }
    else if(location === '/admin/settings/general' || location === '/admin/settings'){
      title = messages.settings_generalSettings;
    }
    else if(location === '/admin/settings/pages'){
      title = messages.settings_pages;
    }
    else if(location === '/admin/settings/pages/add'){
      title = messages.settings_addPage;
      leftButton = <IconButton><Link to="/admin/settings/pages"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location.startsWith('/admin/settings/pages/')){
      title = messages.settings_editPage;
      leftButton = <IconButton><Link to="/admin/settings/pages"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
      rightElements = <PageHead />
    }
    else if(location === '/admin/settings/tokens'){
      title = messages.settings_tokens;
    }
    else if(location === '/admin/settings/tokens/add'){
      title = messages.settings_addToken;
      leftButton = <IconButton><Link to="/admin/settings/tokens"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }
    else if(location.startsWith('/admin/settings/tokens/')){
      title = messages.settings_editToken;
      leftButton = <IconButton><Link to="/admin/settings/tokens"><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></Link></IconButton>
    }

    return (
      <div>
        <AppBar
          style={{ paddingLeft: 28, paddingRight: 28 }}
          titleStyle={{ fontSize: 18 }}
          title={title}
          iconElementLeft={leftButton}
          iconElementRight={rightElements}
        />

        <Drawer open={this.state.open} handleClose={(open) => this.handleClose()} items={drawerItems} title={<span>{messages.drawer_title}</span>} currentUrl={location} />
      </div>
    );
  }
}
