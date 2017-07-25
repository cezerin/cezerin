import { connect } from 'react-redux'
import { fetchService } from '../actions'
import Details from './components/details'

const mapStateToProps = (state, ownProps) => {
  return {
    service: state.webstore.service
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { serviceId } = ownProps.match.params;
      dispatch(fetchService(serviceId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
