import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import messages from 'lib/text'

import {List, ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

import ProductVariants from 'modules/products/edit/variants'
import ProductAttributes from 'modules/products/edit/attributes'
import ProductOption from 'modules/products/edit/option'
import ProductInventory from 'modules/products/edit/inventory'
import ProductImages from 'modules/products/edit/images'
import ProductGeneral from 'modules/products/edit/general'


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

const ProductMenu = ({ productId }) => (
  <List>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}`} exact={true}><ListItem primaryText={messages.description} leftIcon={<FontIcon className="material-icons">description</FontIcon>}/></NavLink>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/inventory`}><ListItem primaryText={messages.products_inventory} leftIcon={<FontIcon className="material-icons">store</FontIcon>}/></NavLink>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/variants`}><ListItem primaryText={messages.productVariants} leftIcon={<FontIcon className="material-icons">palette</FontIcon>}/></NavLink>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/attributes`}><ListItem primaryText={messages.attributes} leftIcon={<FontIcon className="material-icons">playlist_add_check</FontIcon>}/></NavLink>
    <NavLink style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/images`}><ListItem primaryText={messages.images} leftIcon={<FontIcon className="material-icons">photo_camera</FontIcon>}/></NavLink>
  </List>
)

const ProductDetails = ({ match }) => {
  const { productId } = match.params;
  return (
    <div className="row row--no-gutter col-full-height">
      <div className="col-xs-3 col--no-gutter scroll col-full-height">
        <ProductMenu productId={productId} />
      </div>
      <div className="col-xs-9 col--no-gutter scroll col-full-height">
        <Route path="/admin/product/:productId" exact component={ProductGeneral}/>
        <Route path="/admin/product/:productId/inventory" component={ProductInventory}/>
        <Route path="/admin/product/:productId/images" component={ProductImages}/>
        <Route path="/admin/product/:productId/variants" component={ProductVariants}/>
        <Route path="/admin/product/:productId/option/:optionId" component={ProductOption}/>
        <Route path="/admin/product/:productId/attributes" component={ProductAttributes}/>
      </div>
    </div>
  );
}

export default ProductDetails;
