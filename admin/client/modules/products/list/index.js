import { connect } from 'react-redux'
import { fetchProducts } from './actions'
import List from './components/list'

const mapStateToProps = (state) => {
  return {
    items: state.products.items,
    // selected: state.productCategories.selected,
    isFetching: state.products.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchProducts());
    },
    // onSelect: (category) => {
    //   dispatch(selectCategory({ id: category.id, title: category.title }));
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
