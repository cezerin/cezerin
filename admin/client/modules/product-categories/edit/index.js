import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { updateCategory, deselectCategory } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    categoryId: state.productCategories.selectedId,
    items: state.productCategories.items,
    initialValues: state.productCategories.items.find((item) => (item.id === state.productCategories.selectedId)),
    isSaving: state.productCategories.isSaving
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      delete values.image;
      if(!values.slug || values.slug === '') {
        values.slug = values.name;
      }
      dispatch(updateCategory(values));
    },
    onCancel: () => {
      dispatch(deselectCategory());
      dispatch(reset('FormProductCategory'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
