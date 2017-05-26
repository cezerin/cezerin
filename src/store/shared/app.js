import React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import IndexContainer from './containers/index'
import SharedContainer from './containers/shared'
import CategoryContainer from './containers/category'
import ProductContainer from './containers/product'
import PageContainer from './containers/page'
import CheckoutContainer from './containers/checkout'
import CheckoutSuccessContainer from './containers/checkoutSuccess'
import NotFoundContainer from './containers/notfound'
import SearchContainer from './containers/search'

import {setCurrentPage} from './actions'
import {PAGE, PRODUCT_CATEGORY, PRODUCT, RESERVED, SEARCH} from './pageTypes'

class ScrollToTopOnMount extends React.Component {
  componentDidMount(prevProps) {
    window.scrollTo(0, 0)
  }

  render() {
    return null
  }
}

class SwitchContainers extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.props.setCurrentPage(nextProps.location.pathname);
  }

  render() {
    const { history, location, currentPage } = this.props;
    switch(currentPage.type){
      case PRODUCT:
        return (
          <div>
            <ScrollToTopOnMount />
            <ProductContainer />
          </div>
        );
      case PRODUCT_CATEGORY:
        return <CategoryContainer />;
      case SEARCH:
        return <SearchContainer />;
      case PAGE:
        if(location.pathname === '/'){
          return <IndexContainer />;
        } else if(location.pathname === '/checkout'){
          return <CheckoutContainer />;
        } if(location.pathname === '/checkout-success'){
          return <CheckoutSuccessContainer />;
        } else {
          return <PageContainer />;
        }
      default:
        return <NotFoundContainer />;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentPage: state.app.currentPage
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setCurrentPage: (pathname) => {
      dispatch(setCurrentPage(pathname))
    }
  }
}

const SwitchContainersConnected = connect(mapStateToProps, mapDispatchToProps)(SwitchContainers);

const App = () => (
  <SharedContainer>
    <Route component={SwitchContainersConnected}/>
  </SharedContainer>
)

export default App
