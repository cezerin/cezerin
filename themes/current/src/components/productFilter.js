import React from 'react'
import {Link} from 'react-router'
import text from '../lib/text'
import config from '../lib/config'

import CategoryTree from './categoryTree'
import Sort from './sort'
import PriceSlider from './priceSlider'

export default class ProductFilter extends React.Component {
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
    const { sidebarIsActive } = this.state;
    const { categoryDetails, categories, settings, productFilter, products_min_price, products_max_price} = this.props.state;

    return (
      <div className="column is-one-quarter">
        <div className="is-hidden-tablet">
          <button className="button is-fullwidth" onClick={this.sidebarToggle}>{text.filterProducts}</button>
        </div>

        <div className={sidebarIsActive ? 'modal is-active' : 'is-hidden-mobile'}>
          <div className={sidebarIsActive ? 'modal-background' : ''}></div>
          <div className={sidebarIsActive ? 'modal-content' : ''}>
            <div className={sidebarIsActive ? 'box sidebar' : ''}>

              <div className="is-hidden-tablet" style={{ marginBottom: 30 }}>
                <Sort defaultSort={settings.default_product_sorting} currentSort={productFilter.sort} setSort={this.props.setSort} />
              </div>

              <CategoryTree
                categories={categories}
                activeCategory={categoryDetails}
                onClick={this.sidebarClose}
              />

              <PriceSlider
                minPrice={products_min_price}
                maxPrice={products_max_price}
                minValue={productFilter.price_from}
                maxValue={productFilter.price_to}
                setPriceFromAndTo={this.props.setPriceFromAndTo}
                settings={settings}
              />

            </div>
          </div>
          {sidebarIsActive &&
            <button className="modal-close" onClick={this.sidebarClose}></button>
          }
        </div>

      </div>
    )
  }
}
