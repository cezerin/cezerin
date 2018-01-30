import React from 'react'
import messages from 'lib/text'
import DeleteConfirmation from 'modules/shared/deleteConfirmation'
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
const Fragment = React.Fragment;

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDelete: false,
    };
  }

  showDelete = () => {
    this.setState({openDelete: true});
  };

  closeDelete = () => {
    this.setState({openDelete: false});
  };

  deleteGroup = () => {
    this.setState({openDelete: false});
    this.props.onDelete(this.props.selected.id);
  };

  render() {
    const { selected, onDelete, onCreate } = this.props;
    const groupName = selected && selected.name && selected.name.length > 0 ? selected.name : 'Draft';

    return (
      <span>
        {selected &&
          <Fragment>
            <IconButton touch={true} tooltip={messages.actions_delete} tooltipPosition="bottom-left" onClick={this.showDelete}>
              <FontIcon color="#fff" className="material-icons">delete</FontIcon>
            </IconButton>
            <DeleteConfirmation
              open={this.state.openDelete}
              isSingle={true}
              itemsCount={1}
              itemName={groupName}
              onCancel={this.closeDelete}
              onDelete={this.deleteGroup}
            />
          </Fragment>
        }
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.customerGroups_titleAdd} onClick={onCreate}>
          <FontIcon color="#fff" className="material-icons">add</FontIcon>
        </IconButton>
      </span>
    )
  }
}
