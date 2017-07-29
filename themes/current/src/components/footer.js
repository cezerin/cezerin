import React from 'react'
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'

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
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                  </ul>
                </div>
              </div>

              <div className="column is-3">
                <div className="title is-5">Support</div>
                <div>
                  <ul className="footer-menu">
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                  </ul>
                </div>
              </div>

              <div className="column is-3">
                <div className="title is-5">Store</div>
                <p>
                  7000 Melrose Av<br />
                  Los Angeles, California
                </p>
                <p>
                  302.012.333.010<br />
                  <a href="mailto:info@store.com">info@store.com</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
