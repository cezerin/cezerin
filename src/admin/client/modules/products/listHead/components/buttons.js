import React from 'react'
import { Link } from 'react-router-dom'

import messages from 'lib/text'
import CategorySelect from 'modules/productCategories/select'

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Search from './search';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryIdMoveTo: null,
      openMoveTo: false,
      openDelete: false
    };
  }

  showMoveTo = () => {
    this.setState({openMoveTo: true});
  };

  showDelete = () => {
    this.setState({openDelete: true});
  };

  closeMoveTo = () => {
    this.setState({openMoveTo: false});
  };

  closeDelete = () => {
    this.setState({openDelete: false});
  };

  deleteProduct = () => {
    this.setState({openDelete: false});
    this.props.onDelete();
  };

  saveMoveTo = () => {
    this.setState({openMoveTo: false});
    this.props.onMoveTo(this.state.categoryIdMoveTo);
  };

  selectMoveTo = (categoryId) => {
    this.setState({categoryIdMoveTo: categoryId});
  }

  render() {
    const { search, setSearch, selectedCount, onDelete } = this.props;

    const actionsMoveTo = [
      <FlatButton
        label={messages.cancel}
        onClick={this.closeMoveTo}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={messages.actions_moveHere}
        primary={true}
        keyboardFocused={true}
        onClick={this.saveMoveTo}
      />,
    ];

    const actionsDelete = [
      <FlatButton
        label={messages.cancel}
        onClick={this.closeDelete}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={messages.actions_delete}
        primary={true}
        keyboardFocused={true}
        onClick={this.deleteProduct}
      />,
    ];

    return (
      <span>
        <Search value={search} setSearch={setSearch} />
        {selectedCount > 0 &&
          <span>
            <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_delete} onClick={this.showDelete}>
              <FontIcon color="#fff" className="material-icons">delete</FontIcon>
            </IconButton>
            <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_moveTo} onClick={this.showMoveTo}>
              <FontIcon color="#fff" className="material-icons">folder</FontIcon>
            </IconButton>
            <Dialog
              title={messages.messages_deleteForever}
              actions={actionsDelete}
              modal={false}
              open={this.state.openDelete}
              onRequestClose={this.closeDelete}
              >
              {messages.products_aboutDelete.replace('{count}', selectedCount)}
            </Dialog>
            <Dialog
              title={messages.actions_moveTo}
              actions={actionsMoveTo}
              modal={false}
              open={this.state.openMoveTo}
              onRequestClose={this.closeMoveTo}
              autoScrollBodyContent={true}
            >
              <CategorySelect
                onSelect={this.selectMoveTo}
                selectedId={this.state.categoryIdMoveTo}
                opened={true}
              />
            </Dialog>
          </span>
        }
        <IconMenu
         iconButtonElement={
           <IconButton touch={true}>
             <FontIcon color="#fff" className="material-icons">more_vert</FontIcon>
           </IconButton>
         }
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem containerElement={<Link to="/admin/products/categories" />} primaryText={messages.productCategories_titleEditMany} />
        </IconMenu>
      </span>
    )
  }
}
