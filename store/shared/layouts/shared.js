import React from 'react'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import Categories from '../components/categories'

// xs (for phones)
// sm (for tablets)
// md (for desktops)
// lg (for larger desktops)

const Layout = ({ children }) => (
  <div id="wrapper" className="wrapper">
    <Categories />
    <Grid>
      <Row className="show-grid">
        <Col md={4}>
          Filter
        </Col>
        <Col md={8}>
          {children}
        </Col>
      </Row>
    </Grid>
    <footer>Footer</footer>
  </div>
)

export default Layout
