import { connect } from 'react-redux'
import { fetchEmailTemplate, updateEmailTemplate } from '../actions'
import Form from './components/form'

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.settings.emailTemplate
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: () => {
      const {templateName} = ownProps.match.params;
      dispatch(fetchEmailTemplate(templateName))
    },
    onSubmit: (values) => {
      dispatch(updateEmailTemplate(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
