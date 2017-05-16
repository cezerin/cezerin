import React from 'react'
import { connect } from 'react-redux'
import { addOrderItem, updateOrder, deleteCurrentOrder, closeOrder, cancelOrder } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
    order: state.orders.editOrder
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: () => {
      dispatch(deleteCurrentOrder());
    },
    setCancelled: (orderId) => {
      dispatch(cancelOrder(orderId));
    },
    holdOrder: (orderId) => {
      dispatch(updateOrder({ id: orderId, hold: true }));
    },
    resumeOrder: (orderId) => {
      dispatch(updateOrder({ id: orderId, hold: false }));
    },
    setClosed: (orderId) => {
      dispatch(closeOrder(orderId));
    },
    addItem: (orderId, productId) => {
      dispatch(addOrderItem(orderId, productId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
