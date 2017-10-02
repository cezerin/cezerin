import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {mapStateToProps, mapDispatchToProps} from '../containerProps'
import {CheckoutContainer} from 'theme'
import CheckoutForm from '../components/checkoutForm'

const ConnectedCheckoutContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer));

export default() => {
  return <ConnectedCheckoutContainer checkoutForm={<CheckoutForm />} />
}
