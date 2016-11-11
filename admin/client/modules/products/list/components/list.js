import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head'
import ProductsListItem from './item'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import messages from 'src/locale'
import style from './style.css'

export default class ProductsList extends React.Component {
    constructor(props){
      super(props);
    }

    componentDidMount(){
      this.props.onLoad();
    }

    render(){
      const { items, selected, isFetching, isFetchingMore, onSelect, onSelectAll, loadMore } = this.props;
      const rows = items.map((item, index) => (
        <ProductsListItem key={index} product={item} selected={selected} onSelect={onSelect} />
      ));

      return (
        <List>
          <Head onSelectAll={onSelectAll} />
          <Divider />
          {rows}
          <div className={style.more}>
            <FlatButton
              disabled={isFetchingMore}
               label={messages.actions.loadMore}
               labelPosition="before"
               primary={false}
               icon={<FontIcon className="material-icons">refresh</FontIcon>}
               onTouchTap={loadMore}
             />
           </div>
        </List>
      )
    }
}
