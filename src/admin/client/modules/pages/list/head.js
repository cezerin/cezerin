import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Buttons from './components/headButtons'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Buttons));
