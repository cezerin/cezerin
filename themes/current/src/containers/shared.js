import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default({
  language,
  children,
  location,
  currentPage,
  currentCategory,
  currentProduct,
  categories,
  products,
  productsFilter
}) => (
  <div id="wrapper" className="wrapper">
    <Header categories={categories} currentCategory={currentCategory}/>
    {children}
    <Footer/>
	<p>END OF FILE</p>
  </div>
)
