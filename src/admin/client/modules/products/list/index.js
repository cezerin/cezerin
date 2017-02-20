import { connect } from 'react-redux'
import { fetchProducts, fetchMoreProducts, selectProduct, deselectProduct, selectAllProduct, deselectAllProduct, createProduct } from '../actions'
import List from './components/list'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
    items: state.products.items,
    selected: state.products.selected,
    isFetching: state.products.isFetching,
    isFetchingMore: state.products.isFetchingMore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchProducts());
    },
    onSelect: (productId, checked) => {
      if(checked) {
        dispatch(selectProduct(productId));
      } else {
        dispatch(deselectProduct(productId));
      }
    },
    onSelectAll: (checked) => {
      if(checked) {
        dispatch(selectAllProduct());
      } else {
        dispatch(deselectAllProduct());
      }
    },
    loadMore: () => {
      dispatch(fetchMoreProducts());
    },
    onCreate: () => {
      dispatch(createProduct())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
