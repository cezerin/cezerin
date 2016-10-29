import React from 'react';
import messages from 'src/locale'
import SelectableList from './selectableList'

import { ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class ListExampleSelectable extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  getChildren(allItems, id){
    if(allItems && id){
      return allItems.filter(item => item.parent_id === id).map(item =>
        <ListItem
        value={item.id}
        key={item.id}
        primaryText={item.name}
        nestedItems={this.getChildren(allItems, item.id)}
        leftIcon={<FontIcon className="material-icons">{item.active ? 'folder' : 'visibility_off'}</FontIcon>}
        onTouchTap={() => { this.props.onSelect(item) }}
        />
      );
    } else {
      return [];
    }
  }

  render(){
    const {
    	onSelect,
    	selected,
    	items,
      showRoot,
    	showAll,
    	showTrash
    } = this.props;

    var seletedValue = selected ? selected.id : showRoot ? 'root' : null;

    var rows = items.filter(item => item.parent_id === null).map(item =>
      <ListItem
      value={item.id}
      key={item.id}
      primaryText={item.name}
      nestedItems={this.getChildren(items, item.id)}
      leftIcon={<FontIcon className="material-icons">{item.active ? 'folder' : 'visibility_off'}</FontIcon>}
      onTouchTap={() => { onSelect(item) }}
      />
    );

    return (
        <SelectableList defaultValue={seletedValue}>
          {showRoot &&
            <ListItem
            value="root"
            primaryText={messages.productCategories.root}
            initiallyOpen={true}
            nestedItems={rows}
            leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
            onTouchTap={() => { onSelect({id: "root", name: messages.productCategories.root}) }}
            />
          }

          {showAll &&
            <ListItem
            value="all"
            primaryText={messages.productCategories.all}
            leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
            onTouchTap={() => { onSelect({id: "all", name: messages.productCategories.all}) }}
            />
          }

          {!showRoot && rows}

          {showTrash &&
            <ListItem
            value="trash"
            primaryText={messages.trash}
            leftIcon={<FontIcon className="material-icons">delete</FontIcon>}
            onTouchTap={() => { onSelect({id: "trash", name: messages.trash}) }}
            />
          }
        </SelectableList>
    )
  }
}
