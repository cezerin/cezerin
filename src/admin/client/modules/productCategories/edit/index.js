import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { updateCategory, deselectCategory, fetchCategories, deleteImage, uploadImage } from '../actions'
import ProductCategoryEditForm from './components/form'

const mapStateToProps = (state) => {
  return {
    uploadingImage: state.productCategories.uploadingImage,
    categoryId: state.productCategories.selectedId,
    items: state.productCategories.items,
    initialValues: state.productCategories.items.find((item) => (item.id === state.productCategories.selectedId)),
    isSaving: state.productCategories.isSaving
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onImageDelete: () => {
      dispatch(deleteImage());
    },
    onImageUpload: (form) => {
      dispatch(uploadImage(form));
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategoryEditForm);
