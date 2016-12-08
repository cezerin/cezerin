import React from 'react';
import {
  PageHeader,
  MenuItem,
  Grid,
  Row,
  Col,
  Image,
  Thumbnail,
  Button
} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router'

const ProductOptions = ({ options, variants }) => {
  return null;
}

const RelatedProducts = ({ ids }) => {
  return null;
}

const ProductGallery = ({images}) => {
  if (images.length > 0) {
    const cols = images.map(image => (
      <Col xs={6} sm={4} md={3} lg={3} key={image.id}>
        <Thumbnail href="#" alt={image.alt} src={image.url}/>
      </Col>
    ))

    return <Grid fluid={true}>
      <Row>
        {cols}
      </Row>
    </Grid>

  } else {
    return null;
  }
}

const ProductDetail = ({product}) => {
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0].url
    : '/assets/images/placeholder.png';

    // {product.regular_price}
    // {if (product.on_sale}
    // "active": true,
    // "discontinued": false,
    // "tags": [],
    // "attributes": [],

  return (
    <Grid>
      <Row>
        <Col xs={12} md={6}>
          <Image src={imageUrl} responsive/>
          <ProductGallery images={product.images}/>
        </Col>
        <Col xs={12} md={6}>
          <PageHeader>{product.name}</PageHeader>
          <p>{product.price} {product.currency}</p>
          <p>{product.stock_status}</p>
          <ProductOptions options={product.options} variant={product.variant} />
          <p>
            <Button bsStyle="default">Add to cart</Button>
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p>RECOMMENDED ACCESSORIES</p>
          <RelatedProducts ids={product.related_product_ids} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}></Col>
      </Row>
    </Grid>
  )
}

export default ProductDetail
