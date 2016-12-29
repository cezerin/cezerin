import { connect } from 'react-redux'
import { fetchProducts, setFilterActive, setFilterDiscontinued, setFilterOnSale, setFilterStock } from '../actions'
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
      dispatch(fetchProducts());
    },
    setDiscontinued: (value) => {
      dispatch(setFilterDiscontinued(value));
      dispatch(fetchProducts());
    },
    setOnSale: (value) => {
      dispatch(setFilterOnSale(value));
      dispatch(fetchProducts());
    },
    setStock: (value) => {
      dispatch(setFilterStock(value));
      dispatch(fetchProducts());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
