import { connect } from 'react-redux'
import { fetchOrder, updateOrder, deleteOrderItem, updateOrderItem, updateShippingAddress, clearOrderDetails } from '../actions'
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
    },
    onShippingAddressUpdate: (address) => {
      dispatch(updateShippingAddress(ownProps.orderId, address));
    },
    onOrderSummaryUpdate: (order) => {
      dispatch(updateOrder({
        id: order.id,
        tracking_number: order.tracking_number,
        status_id: order.status_id,
        shipping_method_id:  order.shipping_method_id,
        payment_method_id: order.payment_method_id
      }));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
