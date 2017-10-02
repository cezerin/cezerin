import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import Form from './form'

const mapStateToProps = (state, ownProps) => {
  return {
    cart: state.app.cart,
    settings: state.app.settings,
    themeSettings: state.app.themeSettings
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: () => {}
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));
