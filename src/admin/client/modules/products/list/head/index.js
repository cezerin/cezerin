import React from 'react'
import { connect } from 'react-redux'
import { fetchProducts, deleteProducts, setCategory, setFilter } from '../../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    search: state.products.filter.search,
    selectedCount: state.products.selected.length
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearch: (event, value) => {
      dispatch(setFilter({ search: value }));
      dispatch(fetchProducts());
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
