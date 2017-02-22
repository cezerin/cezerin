import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchPages } from '../../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    pages: state.settings.pages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchPages())
    },
    pushUrl: (path) => {
      dispatch(push(path));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
