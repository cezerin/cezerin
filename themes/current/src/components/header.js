import React from 'react'
import {Link} from 'react-router'
import MiniCart from './miniCart'
import text from '../lib/text'

const CartIndicator = ({cart}) => {
  if (cart && cart.items && cart.items.length > 0) {
    let itemsCount = 0;
    for(let item of cart.items) {
      itemsCount += item.quantity;
    }
    return <span className="tag is-danger">{itemsCount}</span>
  } else {
    return <span></span>
  }
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
    const {categories, cart, settings} = this.props.state;
    const classMenu = this.state.mobileMenuIsActive ? 'nav-center nav-menu is-active' : 'nav-center nav-menu is-hidden-mobile';
    const classToggle = this.state.mobileMenuIsActive ? 'nav-toggle is-active' : 'nav-toggle';
    const categoriesLinks = categories.filter(category => category.parent_id === null).map(category => (
      <Link className="nav-item" activeClassName="is-active" key={category.id} to={category.path} onClick={this.menuClose}>
        {category.name}
      </Link>
    ));

    return (
      <nav className="nav has-shadow">
        <div className="container">
          <span className={classToggle} onClick={this.menuToggle}>
            <span/>
            <span/>
            <span/>
          </span>
          <div className="nav-left">
            <Link className="nav-item" to="/">
              <img src="/assets/images/logo.png" alt="Store logo"/>
            </Link>
          </div>
          <div className={classMenu}>
            {categoriesLinks}
          </div>
          <div className="nav-right is-flex-mobile">
            <span className="nav-item" onClick={this.cartToggle} style={{ cursor: 'pointer' }}>
              <span className="icon">
                <img src="/assets/images/shopping-bag.svg" alt={text.cart} title={text.cart}/>
              </span>
              <CartIndicator cart={cart} />
            </span>
            <MiniCart cart={cart} deleteCartItem={this.props.deleteCartItem} active={this.state.cartIsActive} settings={settings} cartToggle={this.cartToggle} />
          </div>
        </div>
      </nav>
    )
  }
}
