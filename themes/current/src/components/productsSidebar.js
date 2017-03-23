import React from 'react'
import {Link} from 'react-router'
import text from '../lib/text'
import CategoriesTree from './categoriesTree'

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
    const sidebarClass = this.state.sidebarIsActive ? 'sidebar' : 'is-hidden-mobile';

    return (
      <div className="column is-one-quarter">
        <div className="is-hidden-tablet">
          <button className="button is-fullwidth" onClick={this.sidebarToggle}>{text.filterProducts}</button>
        </div>
        <div className={sidebarClass}>
          <CategoriesTree categories={this.props.state.categories} activeCategory={this.props.state.currentCategory} />
        </div>
      </div>
    )
  }
}
