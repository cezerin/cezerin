import React from 'react'
import {Link} from 'react-router'
import config from '../lib/config'
import text from '../lib/text'

export default() => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="content has-text-centered">
          <p>
            {text.footerCopyright}&nbsp;
            <Link to="/privacy">Privacy Policy</Link>. The website content is licensed&nbsp;
            <Link to="/about-us">About</Link>. This <Link to="/page-not-exists">page</Link> is not exists.
          </p>
          <p>
            <img src="/assets/images/payment/mastercard.svg" alt="mastercard" width="60" style={{ marginRight: '10px' }}/>
            <img src="/assets/images/payment/visa.svg" alt="visa" width="60" style={{ marginRight: '10px' }}/>
            <img src="/assets/images/payment/paypal.svg" alt="paypal" width="60" style={{ marginRight: '10px' }}/>
          </p>
        </div>
      </div>
    </footer>
  )
}
