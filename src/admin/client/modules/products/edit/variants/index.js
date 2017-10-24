import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createVariant, updateVariant, setVariantOption, deleteVariant, createOption } from '../../actions'
import ProductVariantsGrid from './components/grid'

const mapStateToProps = (state, ownProps) => {
  const { productId } = ownProps.match.params;
  const oldOptions = state.products.editProduct ? state.products.editProduct.options : null;
  const oldVariants = state.products.editProduct ? state.products.editProduct.variants : null;

  return {
    options: state.products.editProductOptions || oldOptions,
    variants: state.products.editProductVariants || oldVariants,
    productId: productId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSkuChange: (variantId, value) => {
      const { productId } = ownProps.match.params;
      dispatch(updateVariant(productId, variantId, { sku: value }));
    },
    onPriceChange: (variantId, value) => {
      const { productId } = ownProps.match.params;
      dispatch(updateVariant(productId, variantId, { price: value }));
    },
    onStockChange: (variantId, value) => {
      const { productId } = ownProps.match.params;
      dispatch(updateVariant(productId, variantId, { stock_quantity: value }));
    },
    onWeightChange: (variantId, value) => {
      const { productId } = ownProps.match.params;
      dispatch(updateVariant(productId, variantId, { weight: value }));
    },
    onOptionChange: (variantId, optionId, valueId) => {
      const { productId } = ownProps.match.params;
      dispatch(setVariantOption(productId, variantId, optionId, valueId));
    },
    createVariant: () => {
      const { productId } = ownProps.match.params;
      dispatch(createVariant(productId));
    },
    deleteVariant: (variantId) => {
      const { productId } = ownProps.match.params;
      dispatch(deleteVariant(productId, variantId));
    },
    createOption: () => {
      const { productId } = ownProps.match.params;
      const newOption = {
        name: "New option",
      	position: 0,
      	required: true,
      	control: "select"
      }
      dispatch(createOption(productId, newOption));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductVariantsGrid));
