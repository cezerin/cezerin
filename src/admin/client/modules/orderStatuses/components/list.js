import React from 'react';
import { Link } from 'react-router-dom'
import messages from 'lib/text'
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  selectedItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  innerItem: {
    paddingLeft: 55
  }
}

const FolderIcon = <FontIcon className="material-icons">folder</FontIcon>;

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
    	showAll,
      showManage
    } = this.props;

    const rows = items.map(item => (
      <ListItem
        key={item.id}
        className="treeItem"
        style={item.id === selectedId ? styles.selectedItem : null}
        innerDivStyle={styles.innerItem}
        primaryText={item.name}
        leftIcon={FolderIcon}
        onClick={() => { this.props.onSelect(item.id) }}
       />
    ));

    return (
      <List>
        {showAll &&
          <ListItem
            className="treeItem"
            primaryText={messages.allOrderStatuses}
            style={'all' === selectedId ? styles.selectedItem : null}
            innerDivStyle={styles.innerItem}
            leftIcon={FolderIcon}
            onClick={() => { onSelect('all') }}
          />
        }

        {rows}

        {showManage &&
          <Link to="/admin/orders/statuses" style={{ textDecoration: 'none' }}>
            <ListItem
              className="treeItem"
              primaryText={messages.manageOrderStatuses}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
            />
          </Link>
        }
      </List>
    )
  }
}
