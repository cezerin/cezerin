import React from 'react'
import { connect } from 'react-redux'
import { fetchOrders, setFilter, bulkUpdate, deleteOrders } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    search: state.orders.filter.search,
    selectedCount: state.orders.selected.length
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearch: (value) => {
      dispatch(setFilter({ search: value }));
      dispatch(fetchOrders());
    },
    onDelete: () => {
      dispatch(deleteOrders());
    },
    setCancelled: () => {
      dispatch(bulkUpdate({ cancelled: true }));
    },
    setDelivered: () => {
      dispatch(bulkUpdate({ delivered: true }));
    },
    setPaid: () => {
      dispatch(bulkUpdate({ paid: true }));
    },
    setHold: () => {
      dispatch(bulkUpdate({ hold: true }));
    },
    setDraft: () => {
      dispatch(bulkUpdate({ draft: true }));
    },
    setClosed: () => {
      dispatch(bulkUpdate({ closed: true }));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
