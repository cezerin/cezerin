import React from 'react'
import Helmet from 'react-helmet'
import ProductDetail from '../components/productDetail'

const ProductContainer = (props) => {
  const {currentProduct, settings} = props.state;

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
        <ProductDetail settings={settings} product={currentProduct} addCartItem={props.addCartItem}/>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default ProductContainer
