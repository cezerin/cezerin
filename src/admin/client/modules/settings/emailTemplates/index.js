import { connect } from 'react-redux'
import { fetchEmailTemplate, updateEmailTemplate } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.emailTemplate
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (templateName) => {
      dispatch(fetchEmailTemplate(templateName))
    },
    onSubmit: (values) => {
      dispatch(updateEmailTemplate(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
