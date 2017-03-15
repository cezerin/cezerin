import React from 'react';
import {Link} from 'react-router'

const ProductOptions = ({options, variants}) => {
  return null;
}

const RelatedProducts = ({ids}) => {
  return null;
}

// const ProductGallery = ({images}) => {
//   if (images.length > 0) {
//     const cols = images.map(image => (
//       <Col xs={6} sm={4} md={3} lg={3} key={image.id}>
//         <Thumbnail href="#" alt={image.alt} src={image.url}/>
//       </Col>
//     ))
//
//     return <Grid fluid={true}>
//       <Row>
//         {cols}
//       </Row>
//     </Grid>
//
//   } else {
//     return null;
//   }
// }

// options
// attributes

//       <ProductGallery images={product.images}/>
// RELATED PRODUCTS
//       <ProductOptions options={product.options} variant={product.variant} />

const ProductDetail = ({product, addCartItem}) => {
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0].url
    : '/assets/images/placeholder.png';

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-desktop">
          <div className="column">
            <div className="image">
              <img src={imageUrl} style={{
                background: 'rgba(0,0,0,0.02)'
              }}/>
            </div>
          </div>
          <div className="column">
            <div className="content">
              <h1>{product.name}</h1>
              <p>{product.stock_status}</p>
              <p>{product.price} {product.currency}</p>
              <button className="button" onClick={() => addCartItem({product_id: product.id, variant_id: null, quantity: 1})}>Add to cart</button>
            </div>
          </div>
        </div>
        <div className="content">
          <div dangerouslySetInnerHTML={{
            __html: product.description
          }}/>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
