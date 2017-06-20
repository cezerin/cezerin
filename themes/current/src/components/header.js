import React from 'react'
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'

import Cart from './cart'
import CartIndicator from './cartIndicator'

const HeadMenuItems = ({ categories, onClick, className}) => {
  let items = categories.filter(category => category.parent_id === null).map((category, index) => (
    <NavLink className="nav-item" activeClassName="is-active" key={index} to={category.path} onClick={onClick}>
      {category.name}
    </NavLink>
  ));

  return (
    <div className={className} style={{ flexGrow: 4 }}>
      {items}
    </div>
  )
}

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMenuIsActive: false,
      cartIsActive: false
    }
  }

  menuToggle = () => this.setState({
    mobileMenuIsActive: !this.state.mobileMenuIsActive,
    cartIsActive: false
  });
  menuClose = () => this.setState({mobileMenuIsActive: false});

  cartToggle = () => this.setState({
    cartIsActive: !this.state.cartIsActive,
    mobileMenuIsActive: false
  });

  render() {
    const {categories, cart, settings, currentPage, location} = this.props.state;
    const classMenu = this.state.mobileMenuIsActive ? 'nav-right nav-menu is-active' : 'nav-right nav-menu is-hidden-mobile';
    const classToggle = this.state.mobileMenuIsActive ? 'nav-toggle is-active' : 'nav-toggle';
    const classBackToggle = this.state.mobileMenuIsActive ? 'nav-toggle nav-item is-active' : 'nav-toggle nav-item';
    const showBackButton = currentPage.type === 'product' && location.hasHistory;

    return (
      <nav className="nav has-shadow" style={{ zIndex: 100, position: 'fixed', width: '100%' }}>
        <div className="container">

          {!showBackButton &&
            <span className={classToggle} onClick={this.menuToggle}>
              <span/>
              <span/>
              <span/>
            </span>
          }

          {showBackButton &&
            <span className={classBackToggle} onClick={this.props.goBack} style={{ justifyContent: 'center' }}>
              <img className="icon" src="/assets/images/arrow_left_big.svg" style={{ width: 18 }} />
            </span>
          }

          <div className="nav-left">
            <NavLink className="nav-item" to="/">
              <img src={settings.logo}/>
            </NavLink>
          </div>

          <HeadMenuItems categories={categories} onClick={this.menuClose} className={classMenu} />

          <div className="nav-right is-flex-mobile">
            <NavLink className="nav-item" to="/search">
              <span className="icon">
                <img src="/assets/images/search.svg" alt={text.search} title={text.search} style={{ width: 24 }}/>
              </span>
            </NavLink>
            <span className="nav-item" onClick={this.cartToggle} style={{ cursor: 'pointer' }}>
              <span className="icon">
                <img src="/assets/images/shopping-bag.svg" alt={text.cart} title={text.cart} style={{ width: 24 }}/>
              </span>
              <CartIndicator cart={cart} />
            </span>
            <Cart cart={cart} deleteCartItem={this.props.deleteCartItem} active={this.state.cartIsActive} settings={settings} cartToggle={this.cartToggle} />
          </div>
        </div>
      </nav>
    )
  }
}
