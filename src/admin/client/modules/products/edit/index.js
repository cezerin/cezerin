import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { fetchProduct, cancelProductEdit, updateProduct  } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.products.editItem,
    isFetchingEdit: state.products.isFetchingEdit
    // categoryId: state.productCategories.selectedId,
    // items: state.productCategories.items,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (productId) => {
      dispatch(fetchProduct(productId));
    },
    eraseData: () => {
      dispatch(cancelProductEdit());
    },
    onSubmit: (values) => {
      dispatch(updateProduct(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
