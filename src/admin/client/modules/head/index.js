import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import AppBar from './components/appBar'

const mapStateToProps = (state) => {
  const productCategory = state.productCategories.items.find((item) => (item.id === state.productCategories.selectedId));
  const customerGroup = state.customerGroups.items.find((item) => (item.id === state.customerGroups.selectedId));

  return {
    productsSelectedCount: state.products.selected.length,
    customersSelectedCount: state.customers.selected.length,
    ordersSelectedCount: state.orders.selected.length,
    productCategoryName: productCategory ? productCategory.name : null,
    customerGroupName: customerGroup ? customerGroup.name : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));
