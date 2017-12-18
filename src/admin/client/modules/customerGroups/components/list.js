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
    	showAll,
      showRoot,
      showManage
    } = this.props;

    var rows = items.map(item => <ListItem
      key={item.id}
      style={item.id === selectedId ? styles.selectedItem : styles.item}
      innerDivStyle={styles.innerItem}
      primaryText={item.name}
      leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
      onClick={() => { this.props.onSelect(item.id) }}
           />);

    return (
      <div>
        <List>
          {showRoot &&
            <ListItem
              primaryText={messages.customers_noGroup}
              style={'root' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">clear</FontIcon>}
              onClick={() => { onSelect('root') }}
            />
          }

          {showAll &&
            <ListItem
              primaryText={messages.customerGroups_all}
              style={'all' === selectedId ? styles.selectedItem : styles.item}
              innerDivStyle={styles.innerItem}
              leftIcon={<FontIcon className="material-icons">folder</FontIcon>}
              onClick={() => { onSelect('all') }}
            />
          }

          {rows}

          {showManage &&
            <Link to="/admin/customers/groups" style={{ textDecoration: 'none' }}>
              <ListItem
                primaryText={messages.customerGroups_titleEditMany}
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
