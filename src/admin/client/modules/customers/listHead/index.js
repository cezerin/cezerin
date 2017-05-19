import React from 'react'
import { connect } from 'react-redux'
import { fetchCustomers, deleteCustomers, setGroup, setFilterSearch } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    search: state.customers.search,
    selectedCount: state.customers.selected.length
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearch: (value) => {
      dispatch(setFilterSearch(value));
      dispatch(fetchCustomers());
    },
    onDelete: () => {
      dispatch(deleteCustomers());
    },
    onSetGroup: (group_id) => {
      dispatch(setGroup(group_id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
