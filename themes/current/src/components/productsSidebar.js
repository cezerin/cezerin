import React from 'react'
import {Link} from 'react-router'
import MediaQuery from 'react-responsive'
import text from '../lib/text'
import CategoriesTree from './categoriesTree'
import ProductsSort from './productsSort'

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarIsActive: false
    }
  }

  sidebarToggle = () => this.setState({
    sidebarIsActive: !this.state.sidebarIsActive
  });

  sidebarClose = () => this.setState({sidebarIsActive: false});

  render() {
    const sidebarClass = this.state.sidebarIsActive ? 'modal is-active' : 'modal';

    return (
      <div className="column is-one-quarter">
        <div className="is-hidden-tablet">
          <button className="button is-fullwidth" onClick={this.sidebarToggle}>{text.filterProducts}</button>
        </div>

        <MediaQuery maxWidth={768}>
          <div className={sidebarClass}>
            <div className="modal-background"></div>
            <div className="modal-content">
              <div className="box sidebar">
                <div style={{ marginBottom: 30 }}>
                  <ProductsSort />
                </div>
                <CategoriesTree categories={this.props.state.categories} activeCategory={this.props.state.currentCategory} onClick={this.sidebarClose} />
              </div>
            </div>
            <button className="modal-close" onClick={this.sidebarClose}></button>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={768}>
          <CategoriesTree categories={this.props.state.categories} activeCategory={this.props.state.currentCategory} onClick={this.sidebarClose} />
        </MediaQuery>
      </div>
    )
  }
}
