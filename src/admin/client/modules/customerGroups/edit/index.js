import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { updateGroup, createGroup, deselectGroup } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    groupId: state.customerGroups.selectedId,
    items: state.customerGroups.items,
    initialValues: state.customerGroups.items.find((item) => (item.id === state.customerGroups.selectedId)),
    isSaving: state.customerGroups.isSaving
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      if(values.id) {
        dispatch(updateGroup(values));
      } else {
        dispatch(createGroup(values));
      }
    },
    onCancel: () => {
      dispatch(deselectGroup());
      dispatch(reset('FormCustomerGroup'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
