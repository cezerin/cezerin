import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default({
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
    <Header categories={categories} currentCategory={currentCategory}/> {children}
    <Footer/>
  </div>
)
