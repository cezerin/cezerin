import { connect } from 'react-redux'
import { fetchEmailSettings, updateEmailSettings } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.emailSettings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchEmailSettings())
    },
    onSubmit: (values) => {
      dispatch(updateEmailSettings(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
