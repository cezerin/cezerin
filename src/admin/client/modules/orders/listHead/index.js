import React from 'react'
import { connect } from 'react-redux'
import { fetchOrders, setFilter, deleteOrders } from '../actions'
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
