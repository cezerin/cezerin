import React from 'react';
import { Link } from 'react-router-dom'
import messages from 'lib/text'
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  selectedItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  innerItem: {
    paddingLeft: 55
  },
  nestedListStyle: {
    padding: '0 0 0 15px'
  }
}

const FolderIcon = <FontIcon className="material-icons">folder</FontIcon>;
const DraftIcon = <FontIcon className="material-icons">visibility_off</FontIcon>;

class Item extends React.PureComponent {
  constructor(props){
    super(props);
  }

  handleCheck = (event, isInputChecked) => {
    const { item } = this.props;
    this.props.onCheck(item.id);
  }

  render() {
    const { item, opened, selectedIds, nestedItems } = this.props;
    const isChecked = selectedIds && selectedIds.length > 0 && selectedIds.includes(item.id);
    // const style = isChecked ? styles.selectedItem : null;

    return (
      <ListItem
        className="treeItem"
        initiallyOpen={opened}
        innerDivStyle={styles.innerItem}
        primaryText={item.name}
        nestedItems={nestedItems}
        leftCheckbox={<Checkbox checked={isChecked} onCheck={this.handleCheck} />}
        nestedListStyle={styles.nestedListStyle}
       />
    )
  }
}

export default class Categories extends React.Component {
  constructor(props){
    super(props);
  }

  getItem(selectedIds, allItems, item, opened) {
    const nestedItems = this.getChildren(selectedIds, allItems, item.id, opened);
    return (
      <Item
        key={item.id}
        item={item}
        opened={opened}
        selectedIds={selectedIds}
        nestedItems={nestedItems}
        onCheck={this.props.onCheck}
      />
    )
  }

  getChildren(selectedIds, allItems, id, opened){
    if(allItems && id){
      return allItems.filter(item => item.parent_id === id).map(item => this.getItem(selectedIds, allItems, item, opened));
    } else {
      return [];
    }
  }

  render(){
    const {
    	selectedIds,
    	items,
      opened = false
    } = this.props;

    const rows = items.filter(item => item.parent_id === null).map(item => this.getItem(selectedIds, items, item, opened));

    return (
      <List>
        {rows}
      </List>
    )
  }
}
