import React from 'react'
import {connect} from 'react-redux'
import {mapStateToProps, mapDispatchToProps} from '../containerProps'
import {CustomPageContainer} from 'theme'

export default connect(mapStateToProps, mapDispatchToProps)(CustomPageContainer);
