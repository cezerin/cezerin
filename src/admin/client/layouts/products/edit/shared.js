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

const ProductMenu = ({ productId }) => (
  <List>
    <Link style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/general`}><ListItem primaryText={messages.description} leftIcon={<FontIcon className="material-icons">description</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/inventory`}><ListItem primaryText={messages.products_inventory} leftIcon={<FontIcon className="material-icons">store</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/variants`}><ListItem primaryText={messages.productVariants} leftIcon={<FontIcon className="material-icons">palette</FontIcon>}/></Link>
    <Link style={styles.link} activeStyle={styles.linkActive} to={`/admin/product/${productId}/images`}><ListItem primaryText={messages.images} leftIcon={<FontIcon className="material-icons">photo_camera</FontIcon>}/></Link>
  </List>
)

export default({children, params}) => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-full-height">
      <ProductMenu productId={params.productId} />
    </div>
    <div className="col-xs-9 col--no-gutter scroll col-full-height">
      {React.cloneElement(children, { productId: params.productId })}
    </div>
  </div>
)
