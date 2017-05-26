import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { deleteImage, updateImages, fetchImages  } from '../../actions'
import ProductImages from './components/images'

const mapStateToProps = (state, ownProps) => {
  const { productId } = ownProps.match.params;
  return {
    images: state.products.editProductImages,
    productId: productId
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onImageDelete: (productId, imageId) => {
      dispatch(deleteImage(productId, imageId));
    },
    onImageSort: (productId, images) => {
      dispatch(updateImages(productId, images));
    },
    fetchData: () => {
      const { productId } = ownProps.match.params;
      dispatch(fetchImages(productId));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductImages));
