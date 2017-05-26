import { connect } from 'react-redux'
import { fetchSettings, updateSettings } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchSettings())
    },
    onSubmit: (values) => {
      dispatch(updateSettings(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
