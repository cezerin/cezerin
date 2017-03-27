import {addCartItem, deleteCartItem, updateCartItemQuantiry, fetchMoreProducts, setSearch, setSort, setPriceFrom, setPriceTo} from './actions'

export const mapStateToProps = (state, ownProps) => {
  return {
    state: state.app
  }
}

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addCartItem: (item) => {
      dispatch(addCartItem(item));
    },
    deleteCartItem: (item_id) => {
      dispatch(deleteCartItem(item_id));
    },
    updateCartItemQuantiry: (item_id, quantity) => {
      dispatch(updateCartItemQuantiry(item_id, quantity));
    },
    loadMoreProducts: () => {
      dispatch(fetchMoreProducts());
    },
    setSearch: (search) => {
      dispatch(setSearch(search));
    },
    setSort: (sort) => {
      dispatch(setSort(sort));
    },
    setPriceFrom: (price_from) => {
      dispatch(setPriceFrom(price_from));
    },
    setPriceTo: (price_to) => {
      dispatch(setPriceTo(price_to));
    }
  }
}
