import React from 'react';
import {connect} from 'react-redux'
import {selectCategory, fetchProducts} from '../actions'
import Helmet from "react-helmet";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

const Item = ({ selectedId, categories, category, onClick }) => (
  <LinkContainer to={'/'+category.slug}><NavItem onClick={() => { onClick(category.id) }}>{category.name}</NavItem></LinkContainer>
)

const List = ({ categories, selectedId, onClick }) => {
  var rows = categories.filter(category => category.parent_id === null).map(category => <Item key={category.id} selectedId={selectedId} categories={categories} category={category} onClick={onClick} />);

  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Cezerin</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          {rows}
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">Link Right</NavItem>
          <NavItem eventKey={2} href="#">Link Right</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapStateToProps = (state) => {
  return {
    categories: state.app.categories,
    selectedId: state.app.selectedId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (categoryId) => {
      dispatch(selectCategory(categoryId));
      dispatch(fetchProducts());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
