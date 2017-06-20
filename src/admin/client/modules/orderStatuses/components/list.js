import React from 'react';
import messages from 'lib/text'

import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';

var styles = {
  item: {
    fontSize: 14,
    lineHeight: '14px'
  },
  selectedItem: {
    fontSize: 14,
    lineHeight: '14px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  innerItem: {
    paddingLeft: 55
  },
  fab: {
    position: 'fixed',
    left: '18%',
    bottom: '15px'
  }
}

export default class StatusesList extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render(){
    const {
    	onSelect,
    	selectedId,
    	items,
      onCreate,
    	showAll,
      showAdd
    } = this.props;

    var rows = items.map(item => <ListItem
      key={item.id}
      style={item.id === selectedId ? styles.selectedItem : styles.item}
      innerDivStyle={styles.innerItem}
      primaryText={item.name}
      leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
      onTouchTap={() => { this.props.onSelect(item.id) }}
           />);

    return (
      <div>
        <List>
          {showAll &&
            <ListItem
              primaryText={messages.allOrderStatuses}
              style={'all' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
              onTouchTap={() => { onSelect('all') }}
            />
          }

          {rows}

        </List>
        {showAdd &&
          <FloatingActionButton secondary={false} style={styles.fab} onTouchTap={onCreate}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
        }
      </div>
    )
  }
}
