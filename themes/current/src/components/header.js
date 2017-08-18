import React from 'react'
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'

import Cart from './cart'
import CartIndicator from './cartIndicator'

class HeadMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    }
  }

  onMouseEnterHandler = () => {
    if(!this.props.isMobile && this.props.level === 1){
      this.setState({
        isActive: true
      })
    }
  }

  onMouseLeaveHandler = () => {
    if(!this.props.isMobile && this.props.level === 1){
      this.setState({
        isActive: false
      })
    }
  }

  isActiveToggle = () => this.setState({
    isActive: !this.state.isActive
  })

  render() {
    const { categories, category, onClick, level, isMobile } = this.props;
    const items = categories.filter(item => item.parent_id === category.id).map((subcategory, index) => (
      <HeadMenuItem key={index} category={subcategory} onClick={onClick} categories={categories} level={level + 1} isMobile={isMobile} />
    ));
    const hasItems = items.length > 0;

    return (
      <li
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        className={(level === 2 ? 'column is-3' : '')+(this.state.isActive ? ' is-active' : '') + (hasItems ? ' has-items' : '')}>
        <div className="cat-parent">
          <NavLink activeClassName="is-active" className={hasItems ? 'has-items' : ''} to={category.path} onClick={onClick}>
            {category.name}
          </NavLink>
          {hasItems && isMobile &&
            <span onClick={this.isActiveToggle}></span>
          }
        </div>
        {hasItems &&
          <ul className={(level === 1 ? 'columns is-gapless is-multiline' : '') + ' nav-level-' + level}>
            {items}
          </ul>
        }
      </li>
    )
  }
}

class HeadMenuItems extends React.PureComponent {
  render() {
    const { categories, onClick, isMobile } = this.props;
    const addItemsToMenu = config.header_menu.map(item => ({ name: item.name, path: item.path, id: item.id || '', parent_id: item.parent_id || null }))
    const menuItems = [...categories, ...addItemsToMenu];

    const items = menuItems.filter(category => category.parent_id === null).map((category, index) => (
      <HeadMenuItem key={index} category={category} onClick={onClick} categories={categories} level={1} isMobile={isMobile} />
    ));

    return (
      <ul className="nav-level-0">
        {items}
      </ul>
    )
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

  menuToggle = () => {
    this.setState({
      mobileMenuIsActive: !this.state.mobileMenuIsActive,
      cartIsActive: false
    });
    document.body.classList.toggle('noscroll');
  }

  menuClose = () => {
    this.setState({mobileMenuIsActive: false});
    document.body.classList.remove('noscroll');
  }

  closeAll = () => {
    this.setState({
      cartIsActive: false,
      mobileMenuIsActive: false
    });
    document.body.classList.remove('noscroll');
  }

  cartToggle = () => {
    this.setState({
      cartIsActive: !this.state.cartIsActive,
      mobileMenuIsActive: false
    });
    document.body.classList.remove('noscroll');
  }

  render() {
    const {categories, cart, settings, currentPage, location} = this.props.state;
    const classToggle = this.state.mobileMenuIsActive ? 'nav-toggle is-active' : 'nav-toggle';
    const showBackButton = currentPage.type === 'product' && location.hasHistory;

    return (
      <div>
        <header>
          <div className="container">

            <div className="columns is-gapless is-mobile" style={{ alignItems: 'center', marginTop: 0 }}>

              <div className="column is-4">
                {!showBackButton &&
                  <span className={classToggle} onClick={this.menuToggle}>
                    <span/>
                    <span/>
                    <span/>
                  </span>
                }
                {showBackButton &&
                  <span className="nav-toggle nav-item is-hidden-tablet" onClick={this.props.goBack} style={{ justifyContent: 'center' }}>
                    <img className="icon" src="/assets/images/arrow_back.svg" style={{ width: 18 }} />
                  </span>
                }
              </div>

              <div className="column is-4 has-text-centered">
                <NavLink className="logo-image" to="/">
                  <img src={settings.logo} alt="logo" />
                </NavLink>
              </div>
              <div className="column is-4 has-text-right" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <NavLink className="icon icon-search" to="/search">
                  <img src="/assets/images/search.svg" alt={text.search} title={text.search} style={{ width: 24 }}/>
                </NavLink>

                <img src="/assets/images/shopping-bag.svg" className="icon icon-cart" onClick={this.cartToggle} alt={text.cart} title={text.cart} style={{ width: 24 }}/>
                <CartIndicator cart={cart} />

                <div className={this.state.cartIsActive ? 'mini-cart-open' : ''}>
                  <Cart cart={cart} deleteCartItem={this.props.deleteCartItem} settings={settings} cartToggle={this.cartToggle} />
                </div>

              </div>
            </div>

            <div className="primary-nav is-hidden-mobile">
              <HeadMenuItems
                categories={categories}
                location={location}
                isMobile={false}
              />
            </div>

          </div>
        </header>

        <div className={'is-hidden-tablet' + (this.state.mobileMenuIsActive || this.state.cartIsActive ? ' dark-overflow' : '')} onClick={this.closeAll}></div>
        <div className={'mobile-nav is-hidden-tablet' + (this.state.mobileMenuIsActive ? ' mobile-nav-open' : '')}>
          <HeadMenuItems
            isMobile={true}
            categories={categories}
            location={location}
            onClick={this.menuClose}
          />
        </div>
    </div>
    )
  }
}
