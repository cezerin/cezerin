import React from 'react';
import {connect} from 'react-redux'
// import {fetchProductCategories} from './actions'
import { Link } from 'react-router'
import Helmet from "react-helmet";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.props.fetchData();
  }

  //<Link to={'/'+category.slug} activeStyle={{fontWeight: 'bold'}}>{category.name}</Link>

  getItem(selectedId, categories, category) {
    return <NavItem key={category.id} active={category.id === selectedId}>{category.name}</NavItem>
  }

  // getChildren(selectedId, allItems, id){
  //   if(allItems && id){
  //     return allItems.filter(item => item.parent_id === id).map(item => this.getItem(selectedId, allItems, item));
  //   } else {
  //     return [];
  //   }
  // }

  render() {
    const {categories} = this.props;
    const selectedId = null;
    var rows = categories.filter(category => category.parent_id === null).map(category => this.getItem(selectedId, categories, category));

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
}

const mapStateToProps = (state) => {
  return {categories: state.productCategories.categories}
}

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchData: () => {
    //   dispatch(fetchProductCategories());
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
