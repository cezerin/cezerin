import React from 'react';
import { Link } from 'react-router-dom'
import messages from 'lib/text'
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

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
    bottom: '15px',
    zIndex: 1
  }
}

export default class Categories extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  getItem(selectedId, allItems, item, opened) {
    return <ListItem
      key={item.id}
      initiallyOpen={opened}
      style={item.id === selectedId ? styles.selectedItem : styles.item}
      innerDivStyle={styles.innerItem}
      primaryText={item.name}
      nestedItems={this.getChildren(selectedId, allItems, item.id, opened)}
      leftIcon={<FontIcon className="material-icons">{item.enabled ? 'folder' : 'visibility_off'}</FontIcon>}
      onClick={() => { this.props.onSelect(item.id) }}
     />
  }

  getChildren(selectedId, allItems, id, opened){
    if(allItems && id){
      return allItems.filter(item => item.parent_id === id).map(item => this.getItem(selectedId, allItems, item, opened));
    } else {
      return [];
    }
  }

  render(){
    const {
    	onSelect,
    	selectedId,
    	items,
    	showAll = false,
      showRoot = false,
      showManage = false,
      rootName = messages.productCategories_root,
      allName = messages.productCategories_all,
      opened = false
    } = this.props;


    var rows = items.filter(item => item.parent_id === null).map(item => this.getItem(selectedId, items, item, opened));

    return (
      <div>
        <List>
          {showRoot &&
            <ListItem
              primaryText={rootName}
              style={'root' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">home</FontIcon>}
              onClick={() => { onSelect('root') }}
            />
          }

          {showAll &&
            <ListItem
              primaryText={allName}
              style={'all' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
              onClick={() => { onSelect('all') }}
            />
          }

          {rows}

          {showManage &&
            <Link to="/admin/products/categories" style={{ textDecoration: 'none' }}>
              <ListItem
                primaryText={messages.productCategories_titleEditMany}
                style={styles.item}
                innerDivStyle={styles.innerItem}
                leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
              />
            </Link>
          }
        </List>
      </div>
    )
  }
}
