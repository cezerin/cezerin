import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchOptions, fetchVariants, createVariant, updateVariant, setVariantOption, deleteVariant, createOption } from '../../actions'
import ProductVariantsGrid from './components/grid'

const mapStateToProps = (state, ownProps) => {
  const { productId } = ownProps.match.params;
  return {
    options: state.products.editProductOptions,
    variants: state.products.editProductVariants,
    productId: productId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { productId } = ownProps.match.params;
      dispatch(fetchOptions(productId));
      dispatch(fetchVariants(productId));
    },
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
