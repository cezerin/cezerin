import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchProduct, cancelProductEdit, updateProduct  } from '../../actions'
import ProductAttributesForm from './components/form'

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings,
    initialValues: state.products.editProduct
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { productId } = ownProps.match.params;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductAttributesForm));
