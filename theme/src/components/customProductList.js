import React from 'react'
import { NavLink } from 'react-router-dom'
import * as helper from '../lib/helper'
import api from '../lib/api'
import ProductList from './productList'

export default class CustomProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    }
  }

  componentDidMount() {
    this.fetchProducts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProducts(nextProps);
  }

  fetchProducts = ({ ids, sku, sort, limit, category_id }) => {
    const filter = {
      ids: ids,
      sku: sku,
      on_sale: null,
      search: null,
      category_id: category_id,
      price_from: null,
      price_to: null,
      sort: sort,
      fields: 'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags',
      limit: limit || 4,
      offset: 0
    };

    api.ajax.products.list(filter).then(({status, json}) => {
      this.setState({
        products: json.data
      })
    });
  }

  render() {
    const { settings, addCartItem, isCentered, columnCountOnMobile, columnCountOnDesktop, className } = this.props;

    return (
        <ProductList
          products={this.state.products}
          addCartItem={addCartItem}
          settings={settings}
          loadMoreProducts={null}
          hasMore={false}
          columnCountOnMobile={columnCountOnMobile || 2}
          columnCountOnDesktop={columnCountOnDesktop || 4}
          isCentered={isCentered}
          className={className}
        />
    )
  }
}
