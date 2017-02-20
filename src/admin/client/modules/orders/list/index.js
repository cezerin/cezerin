import { connect } from 'react-redux'
import { fetchOrders, selectOrder, deselectOrder, selectAllOrder, deselectAllOrder, fetchMoreOrders } from '../actions'
// createProduct
import List from './components/list'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
    items: state.orders.items,
    selected: state.orders.selected,
    isFetchingItems: state.orders.isFetching,
    isFetchingMore: state.orders.isFetchingMore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchOrders());
    },
    onSelect: (orderId, checked) => {
      if(checked) {
        dispatch(selectOrder(orderId));
      } else {
        dispatch(deselectOrder(orderId));
      }
    },
    onSelectAll: (checked) => {
      if(checked) {
        dispatch(selectAllOrder());
      } else {
        dispatch(deselectAllOrder());
      }
    },
    loadMore: () => {
      dispatch(fetchMoreOrders());
    },
    // onCreate: () => {
    //   dispatch(createProduct())
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
