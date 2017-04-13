import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchOptions, updateOption, deleteOption } from '../../actions'
import ProductOptionForm from './components/form'

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.products.editProductOptions.find(option => option.id === ownProps.optionId)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      dispatch(fetchOptions(ownProps.productId));
    },
    deleteOption: () => {
      dispatch(deleteOption(ownProps.productId, ownProps.optionId));
      dispatch(push(`/admin/product/${ownProps.productId}/variants`));
    },
    onSubmit: (values) => {
      dispatch(updateOption(ownProps.productId, ownProps.optionId, values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductOptionForm);
