import React from 'react'
import { NavLink } from 'react-router-dom'
import * as helper from '../../lib/helper'
import { themeSettings, text } from '../../lib/settings'
import CustomProductList from './custom'

const Fragment = React.Fragment;

export default class ViewedProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedProducts: []
    }
  }

  getArrayFromLocalStorage = () => {
    let values = [];
    let viewedProducts = localStorage.getItem("viewedProducts");

    try{
      if(viewedProducts && viewedProducts.length > 0){
        let viewedProductsParsed = JSON.parse(viewedProducts);
        if(Array.isArray(viewedProductsParsed)){
          values = viewedProductsParsed;
        }
      }
    } catch(e){};

    return values;
  }

  addProductIdToLocalStorage = productId => {
    if(productId && productId.length > 0){
      let viewedProducts = this.getArrayFromLocalStorage();

      if(viewedProducts.includes(productId)){
        const index = viewedProducts.indexOf(productId);
        viewedProducts.splice(index, 1);
        viewedProducts.push(productId);
      } else {
        viewedProducts.push(productId);
      }

      localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
      this.setState({ viewedProducts: viewedProducts });
    }
  }

  componentDidMount() {
    const viewedProducts = this.getArrayFromLocalStorage();
    this.setState({ viewedProducts: viewedProducts });

    if(this.props.product && this.props.product.id){
      this.addProductIdToLocalStorage(this.props.product.id)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.viewedProducts !== nextState.viewedProducts;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.product !== nextProps.product && nextProps.product && nextProps.product.id){
      this.addProductIdToLocalStorage(nextProps.product.id)
    }
  }

  render() {
    const { limit, settings, addCartItem, product } = this.props;
    let { viewedProducts } = this.state;

    if(viewedProducts && product && product.id){
      viewedProducts = viewedProducts.filter(id => id !== product.id);
    }

    if(viewedProducts && viewedProducts.length > 0){
      const ids = viewedProducts.reverse().slice(0, limit);
      return (
        <section className="section section-product-related">
          <div className="container">
            <div className="title is-4 has-text-centered">{text.recentlyViewed}</div>
            <CustomProductList
              ids={ids}
              settings={settings}
              addCartItem={addCartItem}
              limit={limit}
              isCentered={true}
            />
          </div>
        </section>
      )
    } else {
      return null;
    }
  }
}
