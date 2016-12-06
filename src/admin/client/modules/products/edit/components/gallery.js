import { connect } from 'react-redux'
import { fetchProduct, deleteImage, updateImages } from '../../actions'
import Gallery from 'modules/shared/image-upload-multiple'

const mapStateToProps = (state) => {
  let product = state.products.editItem;
  let images = [];
  let productId = null;
  if(product) {
    images = product.images;
    productId = product.id;
  }

  return {
    images: images,
    productId: productId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onImageDelete: (productId, imageId) => {
      dispatch(deleteImage(productId, imageId));
    },
    onImageSort: (productId, images) => {
      dispatch(updateImages(productId, images));
    },
    onUpload: (productId) => {
      dispatch(fetchProduct(productId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
