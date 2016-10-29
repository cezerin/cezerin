import React from 'react'

import messages from 'src/locale'
import CategorySelect from 'modules/product-categories/select'

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryIdMoveTo: null,
      openMoveTo: false,
      openDelete: false,
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

  deleteCategory = () => {
    this.setState({openDelete: false});
    this.props.onDelete(this.props.selected.id);
  };

  saveMoveTo = () => {
    this.setState({openMoveTo: false});
    this.props.onMoveTo(this.state.categoryIdMoveTo);
  };

  selectMoveTo = (category) => {
    let id = category.id === 'root' ? null : category.id;
    this.setState({categoryIdMoveTo: id});
  }

  render() {
    const { selected, onMoveUp, onMoveDown, onDelete } = this.props;
    const categoryName = selected ? selected.name : '';

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
        onTouchTap={this.deleteCategory}
      />,
    ];

    return (
      <span>
        <IconButton touch={true} tooltip={messages.actions.moveUp} onTouchTap={()=>{ onMoveUp() }}>
          <FontIcon color="#fff" className="material-icons">arrow_upward</FontIcon>
        </IconButton>
        <IconButton touch={true} tooltip={messages.actions.moveDown} onTouchTap={()=>{ onMoveDown() }}>
          <FontIcon color="#fff" className="material-icons">arrow_downward</FontIcon>
        </IconButton>
        <IconButton touch={true} tooltip={messages.actions.delete} onTouchTap={this.showDelete}>
          <FontIcon color="#fff" className="material-icons">delete</FontIcon>
        </IconButton>
        <IconMenu
        iconButtonElement={
          <IconButton touch={true}>
            <FontIcon color="#fff" className="material-icons">more_vert</FontIcon>
          </IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText={messages.actions.moveTo} onTouchTap={this.showMoveTo} />
      </IconMenu>

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
        	selected={{id: 'root', name: 'Root'}}
          showRoot={true}
        	showAll={false}
        	showTrash={false}
        />
      </Dialog>

      <Dialog
          title={messages.messages.deleteConfirmation}
          actions={actionsDelete}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDelete}
        >
        {messages.productCategories.aboutDelete.replace('{name}', categoryName)}
        </Dialog>
    </span>
    )
  }
}
