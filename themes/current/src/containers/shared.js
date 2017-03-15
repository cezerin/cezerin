import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default(props) => {
  return (
    <div>
      <Header {...props}/>
      {props.children}
      <Footer/>
    </div>
  )
}
