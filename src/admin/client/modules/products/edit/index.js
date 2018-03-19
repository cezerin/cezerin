import React from 'react'
import messages from 'lib/text'

import {Tabs, Tab} from 'material-ui/Tabs';

import ProductVariants from 'modules/products/edit/variants'
import ProductAttributes from 'modules/products/edit/attributes'
import ProductInventory from 'modules/products/edit/inventory'
import ProductImages from 'modules/products/edit/images'
import ProductGeneral from 'modules/products/edit/general'
import ProductAdditional from 'modules/products/edit/additional'

class ProductEditContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData();
  }

  componentWillUnmount() {
    this.props.eraseData();
  }

  render() {
    return (
      <Tabs style={{margin: 20}}>
        <Tab label="Description">
          <div style={{margin: 20, color: 'rgba(0, 0, 0, 0.52)'}}>{messages.general}</div>
          <ProductGeneral />
        </Tab>
        <Tab label="Inventory">
          <div style={{margin: 20, color: 'rgba(0, 0, 0, 0.52)'}}>{messages.products_inventory}</div>
          <ProductInventory/>
        </Tab>
        <Tab label="Variants">
          <div style={{margin: 20, color: 'rgba(0, 0, 0, 0.52)'}}>{messages.productVariants}</div>
          <ProductVariants/>
        </Tab>
        <Tab label="Attributes">
          <div style={{margin: 20, color: 'rgba(0, 0, 0, 0.52)'}}>{messages.attributes}</div>
          <ProductAttributes/>
        </Tab>
        <Tab label="Additional Info">
          <div style={{margin: 20, color: 'rgba(0, 0, 0, 0.52)'}}>{messages.additionalInfo}</div>
          <ProductAdditional/>
        </Tab>
        <Tab label="Images">
          <div style={{margin: 20, color: 'rgba(0, 0, 0, 0.52)'}}>{messages.images}</div>
          <ProductImages/>
        </Tab>
      </Tabs>
    )
  }
}




import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchProduct, cancelProductEdit } from '../actions'
import { fetchCategoriesIfNeeded } from 'modules/productCategories/actions'

const mapStateToProps = (state, ownProps) => {
  return {
    product: state.products.editProduct
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { productId } = ownProps.match.params;
      dispatch(fetchProduct(productId));
      dispatch(fetchCategoriesIfNeeded());
    },
    eraseData: () => {
      dispatch(cancelProductEdit());
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductEditContainer));
