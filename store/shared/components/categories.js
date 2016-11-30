import React from 'react';
import {connect} from 'react-redux'
import Helmet from "react-helmet";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'

const Item = ({ selectedId, categories, category }) => (
  <LinkContainer to={category.path}><NavItem>{category.name}</NavItem></LinkContainer>
)

const List = ({ categories, currentCategory }) => {
  let selectedId = currentCategory ? currentCategory.id : null;
  var rows = categories.filter(category => category.parent_id === null).map(category => <Item key={category.id} selectedId={selectedId} categories={categories} category={category} />);

  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">Drone Store</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          {rows}
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">Delivery</NavItem>
          <NavItem eventKey={2} href="#">Payment</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapStateToProps = (state) => {
  return {
    categories: state.app.categories,
    currentCategory: state.app.currentCategory
  }
}

export default connect(mapStateToProps)(List);
