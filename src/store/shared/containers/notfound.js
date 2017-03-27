import React from 'react'
import {connect} from 'react-redux'
import {mapStateToProps, mapDispatchToProps} from '../containerProps'
import {NotFoundContainer} from 'theme'

export default connect(mapStateToProps, mapDispatchToProps)(NotFoundContainer);
