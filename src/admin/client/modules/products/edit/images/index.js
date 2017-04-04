import { connect } from 'react-redux'
import { deleteImage, updateImages, fetchImages  } from '../../actions'
import ProductImages from './components/images'

const mapStateToProps = (state, ownProps) => {
  return {
    images: state.products.editProductImages,
    productId: ownProps.productId
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
      dispatch(fetchImages(ownProps.productId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductImages);
