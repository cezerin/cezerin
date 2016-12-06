import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import * as theme from 'theme'

const Layout = ({ children }) => (
  <div id="wrapper" className="wrapper">
    <Header />
    {children}
    <Footer />
    {theme.title}
    {theme.component()}
  </div>
)

export default Layout
