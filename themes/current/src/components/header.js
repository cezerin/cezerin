import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {Link} from 'react-router'
import Cart from './cart'

const Item = ({selectedId, categories, category}) => (
  <LinkContainer to={category.path}>
    <NavItem>{category.name}</NavItem>
  </LinkContainer>
)

const Header = ({categories, currentCategory, cart, removeFromCart}) => {
  let selectedId = currentCategory
    ? currentCategory.id
    : null;
  var rows = categories.filter(category => category.parent_id === null).map(category => <Item key={category.id} selectedId={selectedId} categories={categories} category={category}/>);

  return (
    <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Drone Store 2</Link>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {rows}
          </Nav>
          <Nav pullRight>
            <LinkContainer to="/cart"><NavItem eventKey={1}>Cart</NavItem></LinkContainer>
            <LinkContainer to="/checkout"><NavItem eventKey={2}>Checkout</NavItem></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Cart cart={cart} removeFromCart={removeFromCart}/>
    </div>
  )
}

export default Header
