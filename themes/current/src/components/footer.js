import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import { Grid, Row, Col} from 'react-bootstrap'

export default() => {
  return (
    <footer>
      <Grid>
         <Row>
           <Col xs={12} sm={4} md={4}>
             Store
             <ul>
               <li><Link to="/">Link to page</Link></li>
             </ul>
           </Col>
           <Col xs={12} sm={4} md={4}>
             Help & Support
             <ul>
               <li><Link to="/">Link to page</Link></li>
             </ul>
           </Col>
           <Col xs={12} sm={4} md={4}>
             Subscribe
           </Col>
         </Row>
         <Row>
           <Col xs={12}>
             <p style={{ textAlign:'center' }}>Copyright © 2017 Demo Drone Store. All Rights Reserved. <Link to="/">Privacy Policy</Link> <Link to="/">Terms of Use</Link>  <Link to="/">Site Map</Link>.</p>
           </Col>
         </Row>
       </Grid>
    </footer>
  )
}
