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
  addCartItem,
  deleteCartItem,
  updateCartItemQuantiry
}) => {
  return (
    <div id="wrapper" className="wrapper">
      <Header cart={cart} deleteCartItem={deleteCartItem} updateCartItemQuantiry={updateCartItemQuantiry} categories={categories} currentCategory={currentCategory}/> {children}
      <Footer/>
    </div>
  )
}
