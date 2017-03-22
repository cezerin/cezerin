import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

const SharedContainer = (props) => {
  let hideFooter = props.state.currentPage.path === '/checkout-success' || props.state.currentPage.path === '/checkout';
  return (
    <div>
      <Header {...props}/>
      {props.children}
      {!hideFooter &&
        <Footer />
      }
    </div>
  )
}

export default SharedContainer
