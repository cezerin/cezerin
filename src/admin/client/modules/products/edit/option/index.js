import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchOptions, updateOption, deleteOption, createOptionValue, updateOptionValue, deleteOptionValue } from '../../actions'
import ProductOptionForm from './components/option'

const mapStateToProps = (state, ownProps) => {
  const { productId, optionId } = ownProps.match.params;

  const oldOptions = state.products.editProduct ? state.products.editProduct.options : [];
  const options = state.products.editProductOptions || oldOptions;
  const option = options.find(option => option.id === optionId);

  return {
    initialValues: option,
    optionValues: (option && option.values && option.values.length > 0) ? option.values : []
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { productId } = ownProps.match.params;
      dispatch(fetchOptions(productId));
    },
    deleteOption: () => {
      const { productId, optionId } = ownProps.match.params;
      dispatch(deleteOption(productId, optionId));
      ownProps.history.push(`/admin/product/${productId}`);
    },
    onSubmit: (values) => {
      const { productId, optionId } = ownProps.match.params;
      dispatch(updateOption(productId, optionId, values));
    },
    createOptionValue: (valueName) => {
      const { productId, optionId } = ownProps.match.params;
      dispatch(createOptionValue(productId, optionId, valueName));
    },
    updateOptionValue: (valueId, valueName) => {
      const { productId, optionId } = ownProps.match.params;
      dispatch(updateOptionValue(productId, optionId, valueId, valueName));
    },
    deleteOptionValue: (valueId) => {
      const { productId, optionId } = ownProps.match.params;
      dispatch(deleteOptionValue(productId, optionId, valueId));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductOptionForm));
