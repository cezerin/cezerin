import React from 'react'
import Helmet from 'react-helmet'
import ProductDetail from '../components/productDetail'

const ProductContainer = (props) => {
  const {productDetails, settings} = props.state;

  if (productDetails) {
    return (
      <div>
        <Helmet title={productDetails.meta_title !== ''
          ? productDetails.meta_title
          : productDetails.name} meta={[
          {
            name: 'description',
            content: productDetails.meta_description
          }, {
            property: 'og:type',
            content: 'article'
          }
        ]} link={[{
            rel: 'canonical',
            href: productDetails.url
          }
        ]}/>
        <ProductDetail settings={settings} product={productDetails} addCartItem={props.addCartItem}/>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default ProductContainer
