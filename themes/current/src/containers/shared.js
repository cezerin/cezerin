import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import Header from '../components/header'
import Footer from '../components/footer'

const SharedContainer = (props) => {
  const {currentPage} = props.state;
  let hideFooter = currentPage.path === '/checkout-success' || currentPage.path === '/checkout';

  return (
    <div>
      <Header {...props} />
      <div style={{ paddingTop: '3.25rem' }}>
        {props.children}
      </div>
      {!hideFooter &&
        <Footer />
      }
    </div>
  )
}

export default SharedContainer
