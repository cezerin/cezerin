import { connect } from 'react-redux'
import { fetchProducts, setFilterEnabled, setFilterDiscontinued, setFilterOnSale, setFilterStock } from '../actions'
import Filter from './components/fields'

const mapStateToProps = (state) => {
  return {
    enabled: state.products.filter_enabled,
    discontinued: state.products.filter_discontinued,
    on_sale: state.products.filter_on_sale,
    stock_status: state.products.filter_stock_status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEnabled: (value) => {
      dispatch(setFilterEnabled(value));
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
