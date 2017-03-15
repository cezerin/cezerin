import React from 'react'
import Helmet from 'react-helmet'
import ProductDetail from '../components/productDetail'

export default({
  location,
  currentPage,
  currentCategory,
  currentProduct,
  categories,
  products,
  productsFilter,
  cart,
  addCartItem,
  deleteCartItem
}) => {
  if (currentProduct) {
    return (
      <div>
        <Helmet title={currentProduct.meta_title !== ''
          ? currentProduct.meta_title
          : currentProduct.name} meta={[
          {
            name: 'description',
            content: currentProduct.meta_description
          }, {
            property: 'og:type',
            content: 'article'
          }
        ]} link={[{
            rel: 'canonical',
            href: currentProduct.url
          }
        ]}/>
        <ProductDetail product={currentProduct} addCartItem={addCartItem}/>
      </div>
    )
  } else {
    return <div></div>
  }
}
