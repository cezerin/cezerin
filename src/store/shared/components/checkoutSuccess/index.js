import { connect } from 'react-redux'
import { fetchCart } from '../../actions'
import Report from './report'

const mapStateToProps = (state) => {
  return {
    order: state.app.order
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
