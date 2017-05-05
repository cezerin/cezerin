import React from 'react';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Head from './head'
import OrdersListItem from './item'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import messages from 'lib/text'
import style from './style.css'

export default class OrdersList extends React.Component {
    constructor(props){
      super(props);
    }

    componentDidMount(){
      this.props.onLoad();
    }

    render(){
      const { items, selected, isFetchingItems, isFetchingMore, onSelect, onSelectAll, loadMore, onCreate, settings } = this.props;
      const rows = items.map((item, index) => (
        <OrdersListItem key={index} order={item} selected={selected} onSelect={onSelect} settings={settings} />
      ));

      return (
        <div>
          <List>
            <Head onSelectAll={onSelectAll} />
            <Divider />
            {rows}
            <div className={style.more}>
              <RaisedButton
                disabled={isFetchingMore}//disabled={loadingItems || !hasMore}
                label={messages.actions_loadMore}
                labelPosition="before"
                primary={false}
                icon={<FontIcon className="material-icons">refresh</FontIcon>}
                onTouchTap={loadMore}
              />
             </div>
          </List>
          {/* <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px', zIndex: 1}} onTouchTap={() => { onCreate() }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton> */}
        </div>
      )
    }
}
