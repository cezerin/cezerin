import React from 'react'
import {Link} from 'react-router'

const ProductsListItem = ({product, addCartItem}) => {
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0].url
    : '/assets/images/placeholder.png';

  return (
    <div className="column is-half-mobile is-one-third-tablet">
      <div className="image">
        <Link to={product.path}>
          <img src={imageUrl} style={{ background: 'rgba(0,0,0,0.05)' }}/>
        </Link>
      </div>
      <div className="content has-text-centered">
        <Link to={product.path}>{product.name}</Link>
        <p>{product.price} {product.currency}</p>
      </div>
    </div>
  )
}

const ProductsList = ({products, addCartItem}) => {
  const items = products.map(product => <ProductsListItem key={product.id} product={product} addCartItem={addCartItem}/>)
  return (
    <div className="columns is-multiline is-mobile">
      {items}
    </div>
  )
}

export default ProductsList
