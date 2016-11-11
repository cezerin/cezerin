import { connect } from 'react-redux'
import { fetchProductsIfNeeded, fetchProductsMoreIfNeeded, selectProduct, deselectProduct, selectAllProduct, deselectAllProduct } from '../actions'
import List from './components/list'

const mapStateToProps = (state) => {
  return {
    items: state.products.items,
    selected: state.products.selected,
    isFetching: state.products.isFetching,
    isFetchingMore: state.products.isFetchingMore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchProductsIfNeeded());
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
      dispatch(fetchProductsMoreIfNeeded());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
