import React from 'react'
import { Button } from 'react-bootstrap'
import Categories from '../components/categories'

const Layout = ({ children }) => (
  <div id="wrapper" className="wrapper">
    <Categories />
    {children}
    <footer>Footer</footer>
  </div>
)

export default Layout
