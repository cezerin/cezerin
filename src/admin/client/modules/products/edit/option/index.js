import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchOptions, updateOption, deleteOption, createOptionValue, updateOptionValue, deleteOptionValue } from '../../actions'
import ProductOptionForm from './components/option'

const mapStateToProps = (state, ownProps) => {
  const option = state.products.editProductOptions.find(option => option.id === ownProps.optionId);
  return {
    initialValues: option,
    optionValues: (option && option.values && option.values.length > 0) ? option.values : []
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
    },
    createOptionValue: (valueName) => {
      dispatch(createOptionValue(ownProps.productId, ownProps.optionId, valueName));
    },
    updateOptionValue: (valueId, valueName) => {
      dispatch(updateOptionValue(ownProps.productId, ownProps.optionId, valueId, valueName));
    },
    deleteOptionValue: (valueId) => {
      dispatch(deleteOptionValue(ownProps.productId, ownProps.optionId, valueId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductOptionForm);
