import React, {PropTypes} from 'react';
import messages from 'src/locale'

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

export default class Categories extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  getItem(selectedId, allItems, item) {
    return <ListItem
      key={item.id}
      style={item.id === selectedId ? styles.selectedItem : styles.item}
      innerDivStyle={styles.innerItem}
      primaryText={item.name}
      nestedItems={this.getChildren(selectedId, allItems, item.id)}
      leftIcon={<FontIcon className="material-icons">{item.active ? 'folder' : 'visibility_off'}</FontIcon>}
      onTouchTap={() => { this.props.onSelect(item.id) }}
           />
  }

  getChildren(selectedId, allItems, id){
    if(allItems && id){
      return allItems.filter(item => item.parent_id === id).map(item => this.getItem(selectedId, allItems, item));
    } else {
      return [];
    }
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

    var rows = items.filter(item => item.parent_id === null).map(item => this.getItem(selectedId, items, item));

    return (
      <div>
        <List>
          {showRoot &&
            <ListItem
              primaryText={messages.productCategories.root}
              style={'root' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">home</FontIcon>}
              onTouchTap={() => { onSelect('root') }}
            />
          }

          {showAll &&
            <ListItem
              primaryText={messages.productCategories.all}
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
