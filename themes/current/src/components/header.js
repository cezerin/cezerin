import React from 'react'
import { NavLink } from 'react-router-dom'
import { themeSettings, text } from '../lib/settings'

import Cart from './cart'
import CartIndicator from './cartIndicator'
import SearchBox from './searchBox'
import HeadMenu from './headMenu'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMenuIsActive: false,
      mobileSearchIsActive: false,
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

  searchToggle = () => {
    this.setState({
      mobileSearchIsActive: !this.state.mobileSearchIsActive
    });
    document.body.classList.toggle('search-active');
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

  handleSearch = search => {
    if(this.props.state.currentPage.path === '/search'){
      this.props.setSearch(search);
    } else {
      if(search && search !== ''){
        this.props.setLocation('/search?search=' + search);
      }
    }
  }

  render() {
    const {categories, cart, settings, currentPage, location, productFilter} = this.props.state;
    const classToggle = this.state.mobileMenuIsActive ? 'nav-toggle is-active' : 'nav-toggle';
    const showBackButton = currentPage.type === 'product' && location.hasHistory;

    return (
      <div>
        <header className={this.state.mobileSearchIsActive ? 'search-active' : ''}>
          <div className="container">

            <div className="columns is-gapless is-mobile" style={{ alignItems: 'center', marginTop: 0, marginBottom: '10px' }}>

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
              <div className="column is-4 has-text-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>

                <span className="icon icon-search is-hidden-tablet" onClick={this.searchToggle}>
                  <img src="/assets/images/search.svg" alt={text.search} title={text.search} style={{ width: 24 }}/>
                </span>
                <SearchBox value={productFilter.search} onSearch={this.handleSearch} className={this.state.mobileSearchIsActive ? 'search-active' : ''} />

                <CartIndicator cart={cart} onClick={this.cartToggle} />
                <div className={this.state.cartIsActive ? 'mini-cart-open' : ''}>
                  <Cart cart={cart} deleteCartItem={this.props.deleteCartItem} settings={settings} cartToggle={this.cartToggle} />
                </div>

              </div>
            </div>

            <div className="primary-nav is-hidden-mobile">
              <HeadMenu
                categories={categories}
                location={location}
                isMobile={false}
              />
            </div>

          </div>
        </header>

        <div className={(this.state.mobileMenuIsActive || this.state.cartIsActive ? 'dark-overflow' : '')} onClick={this.closeAll}></div>
        <div className={'mobile-nav is-hidden-tablet' + (this.state.mobileMenuIsActive ? ' mobile-nav-open' : '')}>
          <HeadMenu
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
