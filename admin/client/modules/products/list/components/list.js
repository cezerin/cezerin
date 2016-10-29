import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head'
import ProductsListItem from './item'

export default class ProductsList extends React.Component {
    constructor(props){
      super(props);
    }

    componentDidMount(){
      this.props.onLoad();
    }

    render(){
      return (
        <div>
          <List>
            <Head />
            <Divider />
            { this.props.isFetching &&
              <p>Loading...</p>
            }
            {
              this.props.items.map( (item, index) => (
                <ProductsListItem key={index} data={item} />
              ))
            }
          </List>
        </div>
      )
    }
}
