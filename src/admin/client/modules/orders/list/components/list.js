import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head'
import OrdersListItem from './item'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import messages from 'src/locales'
import style from './style.css'

export default class OrdersList extends React.Component {
    constructor(props){
      super(props);
    }

    componentDidMount(){
      this.props.onLoad();
    }

    render(){
      const { items, selected, isFetchingItems, isFetchingMore, onSelect, onSelectAll, loadMore, onCreate } = this.props;
      const rows = items.map((item, index) => (
        <OrdersListItem key={index} order={item} selected={selected} onSelect={onSelect} />
      ));

      return (
        <div>
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
          {/* <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px'}} onTouchTap={() => { onCreate() }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton> */}
        </div>
      )
    }
}
