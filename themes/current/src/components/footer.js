import React from 'react'
import {Link} from 'react-router'
import config from '../lib/config'
import text from '../lib/text'

export default() => {
  return (
    <section className="section">
      <footer>
        <div className="container">
          <div className="content">

            <hr />

            <div className="columns">

              <div className="column is-3">
                <div className="image footer-logo">
                  <img src="/assets/images/logo.png" alt="Store logo" />
                </div>
                <p>Brand text text text text text text text text text text text text text text text text text</p>
              </div>

              <div className="column is-3">
                <div className="title is-5">About</div>
                <div>
                  <ul className="footer-menu">
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>

              <div className="column is-3">
                <div className="title is-5">Support</div>
                <div>
                  <ul className="footer-menu">
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>

              <div className="column is-3">
                <div className="title is-5">Store</div>
                <p>7000 Melrose Av<br />Los Angeles, California</p>
                <p>302.012.333.010<br />info@store.com</p>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
