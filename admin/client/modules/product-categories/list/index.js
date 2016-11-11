import { connect } from 'react-redux'
import { selectCategory, fetchCategoriesIfNeeded, createCategory } from '../actions'
import { fetchProductsIfNeeded } from '../../products/actions'
import List from '../components/list'

const mapStateToProps = (state) => {
  return {
    items: state.productCategories.items,
    selectedId: state.productCategories.selectedId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchCategoriesIfNeeded());
    },
    onSelect: (categoryId) => {
      dispatch(selectCategory(categoryId));
      dispatch(fetchProductsIfNeeded());
    },
    onCreate: () => {
      dispatch(createCategory())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
