import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchTokens } from '../../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    tokens: state.settings.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchTokens())
    },
    pushUrl: (path) => {
      dispatch(push(path));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
