import React from 'react'
import { connect } from 'react-redux'
import { fetchProductsIfNeeded, deleteProducts, setCategory, setFilterSearch } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    search: state.products.filter_search,
    selectedCount: state.products.selected.length
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearch: (value) => {
      dispatch(setFilterSearch(value));
      dispatch(fetchProductsIfNeeded());
    },
    onDelete: () => {
      dispatch(deleteProducts());
    },
    onMoveTo: (category_id) => {
      dispatch(setCategory(category_id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
