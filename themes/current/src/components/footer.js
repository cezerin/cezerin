import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import { Grid, Row, Col} from 'react-bootstrap'
import config from '../../config.json'
import text from '../locale'

export default() => {
  return (
    <footer>
      <Grid>
         <Row>
           <Col xs={12} sm={4} md={4}>
             Text: {text.cart.title}
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
             <p>
               <img src="/assets/images/payment/paypal.svg" alt="paypal" width="60" />
               <img src="/assets/images/payment/alipay.svg" alt="alipay" width="60" />
             </p>
             <p style={{ textAlign:'center' }}>{text.footer.copyright} <Link to="/privacy">Privacy Policy</Link> <Link to="/">Terms of Use</Link> <Link to="/about-us">About</Link> <Link to="/sitemap">Site Map</Link>.</p>
           </Col>
         </Row>
       </Grid>
    </footer>
  )
}
