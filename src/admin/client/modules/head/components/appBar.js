import React from 'react';
import { Link } from 'react-router-dom'

import messages from 'lib/text'
import ProductCategoryHead from 'modules/productCategories/head/index'
import CustomerGroupHead from 'modules/customerGroups/head/index'
import CustomersHead from 'modules/customers/listHead/index'
import ProductsHead from 'modules/products/listHead/index'
import ProductHead from 'modules/products/editHead/index'
import OrdersHead from 'modules/orders/listHead/index'
import OrderHead from 'modules/orders/editHead/index'
import OrderStatusHead from 'modules/orderStatuses/head/index'
import PaymentMethodHead from 'modules/settings/paymentsEdit/head'
import ShippingMethodHead from 'modules/settings/shippingEdit/head'
import PageHead from 'modules/settings/pages/edit/head'
import DrawerMenu from './drawer'

import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

export default class AppBarTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});
  handleClose = () => this.setState({open: false});

  render() {
    const { location, productCategoryName, productsSelectedCount, customersSelectedCount, customerGroupName, ordersSelectedCount, orderStatusName } = this.props;
    const pathname = location.pathname;

    if(pathname === '/admin/login' || pathname === '/admin/logout'){
      return null;
    }

    let title = 'Dashboard';
    let leftButton = <IconButton onTouchTap={this.handleToggle}><FontIcon className="material-icons">menu</FontIcon></IconButton>;
    let rightElements = null;
    {/* <IconButton><FontIcon color="#fff" className="material-icons">notifications</FontIcon></IconButton> */}

    if(pathname === '/admin/products'){
      title = messages.products_title;

      if(productCategoryName){
        title = <span>{messages.products_title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{productCategoryName}</span>;
      }

      if(productsSelectedCount > 0) {
        title = `${productsSelectedCount} ${messages.selected}`;
      }

      rightElements = <ProductsHead />
    }
    if(pathname === '/admin/orders'){
      title = messages.orders_title;

      if(orderStatusName) {
        title = <span>{messages.orders_title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{orderStatusName}</span>;
      }

      if(ordersSelectedCount > 0) {
        title = `${ordersSelectedCount} ${messages.selected}`;
      }

      rightElements = <OrdersHead />
    }
    else if(pathname === '/admin/orders/statuses'){
      title = messages.orderStatuses;
      leftButton = <Link to="/admin/orders"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      if(orderStatusName){
        title = messages.editOrderStatus;
        rightElements = <OrderStatusHead />
      }
    }
    else if(pathname.startsWith('/admin/order/')){
      title = messages.order;
      leftButton = <Link to="/admin/orders"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      rightElements = <OrderHead />;
    }
    else if(pathname.startsWith('/admin/customer/')){
      title = messages.customer;
      leftButton = <Link to="/admin/customers"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname.startsWith('/admin/product/') && pathname.includes('/option/')){
      const productId = pathname.split('/')[3];
      title = messages.editProductOption;
      leftButton = <Link to={`/admin/product/${productId}/variants`}><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname.startsWith('/admin/product/')){
      title = messages.products_titleEdit;
      leftButton = <Link to="/admin/products"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      rightElements = <ProductHead />;
    }
    else if(pathname === '/admin/products/categories'){
      title = messages.productCategories_title;
      leftButton = <Link to="/admin/products"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      if(productCategoryName){
        title = messages.productCategories_titleEdit;;
        rightElements = <ProductCategoryHead />
      }
    }
    else if(pathname === '/admin/customers'){
      title = messages.customers_title;

      if(customerGroupName) {
        title = <span>{messages.customers_title}<FontIcon style={{top: 6}} color="#fff" className="material-icons">chevron_right</FontIcon>{customerGroupName}</span>;
      }

      if(customersSelectedCount > 0) {
        title = `${customersSelectedCount} ${messages.selected}`;
      }

      rightElements = <CustomersHead />
    }
    else if(pathname === '/admin/customers/groups'){
      title = messages.customerGroups_title;
      leftButton = <Link to="/admin/customers"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      if(customerGroupName){
        title = messages.customerGroups_titleEdit;;
        rightElements = <CustomerGroupHead />
      }
    }
    else if(pathname === '/admin/settings/email'){
      title = messages.settings_emailSettings;
    }
    else if(pathname === '/admin/settings/email/smtp'){
      title = messages.settings_smtpSettings;
      leftButton = <Link to="/admin/settings/email"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/email/templates/order_confirmation'){
      title = messages.settings_orderConfirmation;
      leftButton = <Link to="/admin/settings/email"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/email/templates/customer_registration'){
      title = messages.settings_customerRegistration;
      leftButton = <Link to="/admin/settings/email"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/email/templates/customer_recovery'){
      title = messages.settings_customerRecovery;
      leftButton = <Link to="/admin/settings/email"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/theme'){
      title = messages.settings_themeSettings;
    }
    else if(pathname === '/admin/settings/checkout'){
      title = messages.settings_checkoutSettings;
    }
    else if(pathname === '/admin/settings/checkout/fields/email'){
      title = messages.email;
      leftButton = <Link to="/admin/settings/checkout"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/checkout/fields/mobile'){
      title = messages.mobile;
      leftButton = <Link to="/admin/settings/checkout"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/checkout/fields/country'){
      title = messages.country;
      leftButton = <Link to="/admin/settings/checkout"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/checkout/fields/state'){
      title = messages.state;
      leftButton = <Link to="/admin/settings/checkout"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/checkout/fields/city'){
      title = messages.city;
      leftButton = <Link to="/admin/settings/checkout"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/shipping'){
      title = messages.settings_shippingMethods;
    }
    else if(pathname === '/admin/settings/payments'){
      title = messages.settings_paymentsMethods;
    }
    else if(pathname === '/admin/settings/shipping/add'){
      title = messages.settings_addShippingMethod;
      leftButton = <Link to="/admin/settings/shipping"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/payments/add'){
      title = messages.settings_addPaymentMethod;
      leftButton = <Link to="/admin/settings/payments"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname.startsWith('/admin/settings/shipping/')){
      title = messages.settings_editShippingMethod;
      leftButton = <Link to="/admin/settings/shipping"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      rightElements = <ShippingMethodHead />
    }
    else if(pathname.startsWith('/admin/settings/payments/')){
      title = messages.settings_editPaymentMethod;
      leftButton = <Link to="/admin/settings/payments"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      rightElements = <PaymentMethodHead />
    }
    else if(pathname === '/admin/settings/general' || pathname === '/admin/settings'){
      title = messages.settings_generalSettings;
    }
    else if(pathname === '/admin/settings/general/logo'){
      title = messages.logo;
      leftButton = <Link to="/admin/settings/general"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname === '/admin/settings/pages'){
      title = messages.settings_pages;
    }
    else if(pathname === '/admin/settings/pages/add'){
      title = messages.settings_addPage;
      leftButton = <Link to="/admin/settings/pages"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname.startsWith('/admin/settings/pages/')){
      title = messages.settings_editPage;
      leftButton = <Link to="/admin/settings/pages"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
      rightElements = <PageHead />
    }
    else if(pathname === '/admin/settings/tokens'){
      title = messages.settings_tokens;
    }
    else if(pathname === '/admin/settings/tokens/add'){
      title = messages.settings_addToken;
      leftButton = <Link to="/admin/settings/tokens"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
    }
    else if(pathname.startsWith('/admin/settings/tokens/')){
      title = messages.settings_editToken;
      leftButton = <Link to="/admin/settings/tokens"><IconButton><FontIcon color="#fff" className="material-icons">arrow_back</FontIcon></IconButton></Link>
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
        <DrawerMenu open={this.state.open} onClose={this.handleClose} currentUrl={pathname} />
      </div>
    );
  }
}
