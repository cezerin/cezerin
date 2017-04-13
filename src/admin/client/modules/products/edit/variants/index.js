import { connect } from 'react-redux'
import { fetchOptions, fetchVariants, createVariant, updateVariant, setVariantOption, deleteVariant, createOption } from '../../actions'
import ProductVariantsGrid from './components/grid'

const mapStateToProps = (state, ownProps) => {
  return {
    options: state.products.editProductOptions,
    variants: state.products.editProductVariants
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      dispatch(fetchOptions(ownProps.productId));
      dispatch(fetchVariants(ownProps.productId));
    },
    onSkuChange: (variantId, value) => {
      dispatch(updateVariant(ownProps.productId, variantId, { sku: value }));
    },
    onPriceChange: (variantId, value) => {
      dispatch(updateVariant(ownProps.productId, variantId, { price: value }));
    },
    onStockChange: (variantId, value) => {
      dispatch(updateVariant(ownProps.productId, variantId, { stock_quantity: value }));
    },
    onWeightChange: (variantId, value) => {
      dispatch(updateVariant(ownProps.productId, variantId, { weight: value }));
    },
    onOptionChange: (variantId, optionId, valueId) => {
      dispatch(setVariantOption(ownProps.productId, variantId, optionId, valueId));
    },
    createVariant: () => {
      dispatch(createVariant(ownProps.productId));
    },
    deleteVariant: (variantId) => {
      dispatch(deleteVariant(ownProps.productId, variantId));
    },
    createOption: () => {
      const newOption = {
        name: "New option",
      	position: 0,
      	required: true,
      	control: "select"
      }
      dispatch(createOption(ownProps.productId, newOption));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductVariantsGrid);
