import React from 'react'
import {connect} from 'react-redux'
import {mapStateToProps, mapDispatchToProps} from '../containerProps'
import {ProductContainer} from 'theme'

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer);
