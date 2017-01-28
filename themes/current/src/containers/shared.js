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
  productsFilter,
  cart,
  addToCart,
  removeFromCart
}) => {
  return (
    <div id="wrapper" className="wrapper">
      <Header cart={cart} removeFromCart={removeFromCart} categories={categories} currentCategory={currentCategory}/> {children}
      <Footer/>
    </div>
  )
}
