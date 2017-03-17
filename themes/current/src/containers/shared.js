import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

const SharedContainer = (props) => {
  return (
    <div>
      <Header {...props}/>
      {props.children}
      <Footer/>
    </div>
  )
}

export default SharedContainer
