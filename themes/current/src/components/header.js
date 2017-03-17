import React from 'react'
import {Link} from 'react-router'

const CartIndicator = ({cart}) => {
  if (cart && cart.items && cart.items.length > 0) {
    return <span className="tag is-danger">{cart.items.length}</span>
  } else {
    return <span></span>
  }
}

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMenuIsActive: false
    }
  }

  menuToggle = () => this.setState({
    mobileMenuIsActive: !this.state.mobileMenuIsActive
  });
  menuClose = () => this.setState({mobileMenuIsActive: false});

  render() {
    const {categories, cart} = this.props.state;
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
            <Link className="nav-item" to="/checkout">
              <span className="icon">
                <img src="/assets/images/shopping-bag.svg" alt="cart"/>
              </span>
              <CartIndicator cart={cart} />
            </Link>
          </div>
        </div>
      </nav>
    )
  }
}
