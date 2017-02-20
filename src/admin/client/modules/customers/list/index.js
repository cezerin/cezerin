import { connect } from 'react-redux'
import { fetchCustomers, selectCustomer, deselectCustomer, selectAllCustomer, deselectAllCustomer, fetchMoreCustomers } from '../actions'
// createProduct
import List from './components/list'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
    items: state.customers.items,
    selected: state.customers.selected,
    isFetchingItems: state.customers.isFetching,
    isFetchingMore: state.customers.isFetchingMore
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchCustomers());
    },
    onSelect: (customerId, checked) => {
      if(checked) {
        dispatch(selectCustomer(customerId));
      } else {
        dispatch(deselectCustomer(customerId));
      }
    },
    onSelectAll: (checked) => {
      if(checked) {
        dispatch(selectAllCustomer());
      } else {
        dispatch(deselectAllCustomer());
      }
    },
    loadMore: () => {
      dispatch(fetchMoreCustomers());
    },
    // onCreate: () => {
    //   dispatch(createProduct())
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
