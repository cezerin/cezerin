import React from 'react'
import { themeSettings, text } from '../lib/settings'

import Header from '../components/header'
import Footer from '../components/footer'

const SharedContainer = (props) => {
  const {currentPage, settings} = props.state;
  let hideFooter = currentPage.path === '/checkout-success' || currentPage.path === '/checkout';

  return (
    <div>
      <Header {...props} />
      {props.children}
      {!hideFooter &&
        <Footer settings={settings} />
      }
    </div>
  )
}

export default SharedContainer
