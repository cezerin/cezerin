import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchOrder, updateOrder, deleteOrderItem, updateOrderItem, updateShippingAddress, clearOrderDetails, checkoutOrder } from '../actions'
import OrderDetails from './components/details'

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings,
    order: state.orders.editOrder,
    processingCheckout: state.orders.processingCheckout
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { orderId } = ownProps.match.params;
      dispatch(fetchOrder(orderId));
    },
    clearData: () => {
      dispatch(clearOrderDetails());
    },
    onItemDelete: (itemId) => {
      const { orderId } = ownProps.match.params;
      dispatch(deleteOrderItem(orderId, itemId));
    },
    onItemUpdate: (itemId, quantity, variantId) => {
      const { orderId } = ownProps.match.params;
      dispatch(updateOrderItem(orderId, itemId, quantity, variantId));
    },
    onShippingAddressUpdate: (address) => {
      const { orderId } = ownProps.match.params;
      dispatch(updateShippingAddress(orderId, address));
    },
    onOrderSummaryUpdate: (order) => {
      const { orderId } = ownProps.match.params;
      dispatch(updateOrder({
        id: order.id,
        tracking_number: order.tracking_number,
        status_id: order.status_id,
        shipping_method_id:  order.shipping_method_id,
        payment_method_id: order.payment_method_id,
        comments: order.comments,
        note: order.note,
        email: order.email,
        mobile: order.mobile
      }));
    },
    onCheckout: () => {
      const { orderId } = ownProps.match.params;
      dispatch(checkoutOrder(orderId));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderDetails));
