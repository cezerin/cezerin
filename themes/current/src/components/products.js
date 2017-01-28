import React from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Grid,
  Row,
  Col,
  Thumbnail,
  Button
} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router'

const ProductsListItem = ({product, addToCart}) => {
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0].url
    : '/assets/images/placeholder.png';
  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <Thumbnail src={imageUrl} alt={product.name}>
        <h3>{product.name}</h3>
        <p>{product.price} {product.currency}</p>
        <p>
          <LinkContainer to={product.path}>
            <Button bsStyle="primary">Details</Button>
          </LinkContainer>&nbsp;
          <Button onClick={() => addToCart({ product_id: product.id, variant_id: null, quantity: 1 })} bsStyle="default">Add to cart</Button>
        </p>
      </Thumbnail>
    </Col>
  )
}

const ProductsList = ({products, addToCart}) => {
  return (
    <div>
      <Grid fluid={true}>
        <Row>
          {products.map(product => (<ProductsListItem key={product.id} product={product} addToCart={addToCart}/>))}
        </Row>
      </Grid>
    </div>
  )
}

export default ProductsList
