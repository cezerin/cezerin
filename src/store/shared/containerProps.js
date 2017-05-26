import {getJSONLD} from './lib/jsonld'
import {addCartItem, deleteCartItem, updateCartItemQuantiry, fetchMoreProducts, setSearch, setSort, setPriceFromAndTo, setPriceFrom, setPriceTo} from './actions'

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
    setPriceFromAndTo: (priceFrom, priceTo) => {
      dispatch(setPriceFromAndTo(priceFrom, priceTo));
    },
    setPriceFrom: (priceFrom) => {
      dispatch(setPriceFrom(priceFrom));
    },
    setPriceTo: (priceTo) => {
      dispatch(setPriceTo(priceTo));
    },
    setLocation: (path) => {
      ownProps.history.push(path);
    },
    getJSONLD: (state) => {
      return getJSONLD(state);
    }
  }
}
