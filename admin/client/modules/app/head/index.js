import { connect } from 'react-redux'
import AppBar from './components/appBar'

const mapStateToProps = (state) => {
  return {
    selectedProducts: state.products.selected,
    location: state.app.location,
    category: state.productCategories.items.find((item) => (item.id === state.productCategories.selectedId)),
    isLoading: state.productCategories.isFetching ||
      state.productCategories.isSaving
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBar)
