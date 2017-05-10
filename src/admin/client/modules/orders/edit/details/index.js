import { connect } from 'react-redux'
import { fetchOrder, deleteOrderItem, updateOrderItem, clearOrderDetails } from '../../actions'
import OrderDetails from './components/details'

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings,
    order: state.orders.editOrder
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      dispatch(fetchOrder(ownProps.orderId));
    },
    clearData: () => {
      dispatch(clearOrderDetails());
    },
    onItemDelete: (itemId) => {
      dispatch(deleteOrderItem(ownProps.orderId, itemId));
    },
    onItemUpdate: (itemId, quantity, variantId) => {
      dispatch(updateOrderItem(ownProps.orderId, itemId, quantity, variantId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
