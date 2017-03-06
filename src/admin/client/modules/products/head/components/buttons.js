import React from 'react'
import { Link } from 'react-router'

import messages from 'lib/text'
import CategorySelect from 'modules/product-categories/select'

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
        label={messages.actions.cancel}
        primary={true}
        onTouchTap={this.closeMoveTo}
      />,
      <FlatButton
        label={messages.actions.moveHere}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveMoveTo}
      />,
    ];

    const actionsDelete = [
      <FlatButton
        label={messages.actions.cancel}
        primary={true}
        onTouchTap={this.closeDelete}
      />,
      <FlatButton
        label={messages.actions.delete}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteProduct}
      />,
    ];

    return (
      <span>
        <Search value={search} setSearch={setSearch} />
        {selectedCount > 0 &&
          <span>
            <IconButton touch={true} tooltip={messages.actions.delete} onTouchTap={this.showDelete}>
              <FontIcon color="#fff" className="material-icons">delete</FontIcon>
            </IconButton>
            <Dialog
              title={messages.messages.deleteForever}
              actions={actionsDelete}
              modal={false}
              open={this.state.openDelete}
              onRequestClose={this.closeDelete}
              >
              {messages.products.aboutDelete.replace('{count}', selectedCount)}
            </Dialog>
            <Dialog
              title={messages.actions.moveTo}
              actions={actionsMoveTo}
              modal={false}
              open={this.state.openMoveTo}
              onRequestClose={this.closeMoveTo}
              autoScrollBodyContent={true}
            >
              <CategorySelect
                onSelect={this.selectMoveTo}
                selectedId={this.state.categoryIdMoveTo}
                showRoot={true}
                showAll={false}
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
          <MenuItem containerElement={<Link to="/admin/products/categories" />} primaryText={messages.productCategories.titleEditMany} />
          {selectedCount > 0 &&
            <MenuItem primaryText={messages.actions.moveTo} onTouchTap={this.showMoveTo} />
          }
        </IconMenu>
      </span>
    )
  }
}
