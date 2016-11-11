import { connect } from 'react-redux'
import { fetchProductsIfNeeded, setFilterActive, setFilterDiscontinued, setFilterOnSale, setFilterStock } from '../actions'
import Filter from './components/fields'

const mapStateToProps = (state) => {
  return {
    active: state.products.filter_active,
    discontinued: state.products.filter_discontinued,
    on_sale: state.products.filter_on_sale,
    stock_status: state.products.filter_stock_status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActive: (value) => {
      dispatch(setFilterActive(value));
      dispatch(fetchProductsIfNeeded());
    },
    setDiscontinued: (value) => {
      dispatch(setFilterDiscontinued(value));
      dispatch(fetchProductsIfNeeded());
    },
    setOnSale: (value) => {
      dispatch(setFilterOnSale(value));
      dispatch(fetchProductsIfNeeded());
    },
    setStock: (value) => {
      dispatch(setFilterStock(value));
      dispatch(fetchProductsIfNeeded());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
