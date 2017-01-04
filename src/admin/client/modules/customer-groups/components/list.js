import React, {PropTypes} from 'react';
import messages from 'src/locales'

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
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
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

export default class Groups extends React.Component {
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
      showRoot,
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
          {showRoot &&
            <ListItem
              primaryText={messages.customers.noGroup}
              style={'root' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">clear</FontIcon>}
              onTouchTap={() => { onSelect('root') }}
            />
          }

          {showAll &&
            <ListItem
              primaryText={messages.customerGroups.all}
              style={'all' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
              onTouchTap={() => { onSelect('all') }}
            />
          }

          {rows}

        </List>
        {showAdd &&
          <FloatingActionButton secondary={false} style={styles.fab} onTouchTap={() => { onCreate() }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
        }
      </div>
    )
  }
}
