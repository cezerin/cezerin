import { connect } from 'react-redux'
import { fetchSettings, deleteLogo } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchSettings())
    },
    onImageDelete: () => {
      dispatch(deleteLogo());
    },
    onImageUpload: () => {
      dispatch(fetchSettings());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
