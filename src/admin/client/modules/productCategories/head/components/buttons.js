import React from 'react'

import messages from 'lib/text'
import CategorySelect from 'modules/productCategories/select'

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
      categoryIdMoveTo: 'root',
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

  selectMoveTo = (categoryId) => {
    this.setState({categoryIdMoveTo: categoryId});
  }

  render() {
    const { selected, onMoveUp, onMoveDown, onDelete } = this.props;
    const categoryName = selected ? selected.name : '';

    const actionsMoveTo = [
      <FlatButton
        label={messages.cancel}
        primary={true}
        onTouchTap={this.closeMoveTo}
      />,
      <FlatButton
        label={messages.actions_moveHere}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.saveMoveTo}
      />,
    ];

    const actionsDelete = [
      <FlatButton
        label={messages.cancel}
        primary={true}
        onTouchTap={this.closeDelete}
      />,
      <FlatButton
        label={messages.actions_delete}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteCategory}
      />,
    ];

    return (
      <span>
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_moveUp} onTouchTap={onMoveUp}>
          <FontIcon color="#fff" className="material-icons">arrow_upward</FontIcon>
        </IconButton>
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_moveDown} onTouchTap={onMoveDown}>
          <FontIcon color="#fff" className="material-icons">arrow_downward</FontIcon>
        </IconButton>
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_delete} onTouchTap={this.showDelete}>
          <FontIcon color="#fff" className="material-icons">delete</FontIcon>
        </IconButton>
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_moveTo} onTouchTap={this.showMoveTo}>
          <FontIcon color="#fff" className="material-icons">move_to_inbox</FontIcon>
        </IconButton>
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
            showRoot={true}
            showAll={false}
          />
        </Dialog>

        <Dialog
          title={messages.messages_deleteConfirmation}
          actions={actionsDelete}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDelete}
        >
          {messages.productCategories_aboutDelete.replace('{name}', categoryName)}
        </Dialog>
      </span>
    )
  }
}
