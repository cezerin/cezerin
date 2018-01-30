import React from 'react'
import messages from 'lib/text'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ConfirmationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.open) {
      this.setState({
        open: nextProps.open
      })
    }
  }

  close = () => {
    this.setState({open: false});
  }

  handleCancel = () => {
    this.close();
    if(this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleDelete = () => {
    this.close();
    if(this.props.onDelete) {
      this.props.onDelete();
    }
  }

  render() {
    const { isSingle = true, itemsCount = 0, itemName = '' } = this.props;

    const title = isSingle ?
      messages.singleDeleteTitle.replace('{name}', itemName) :
      messages.multipleDeleteTitle.replace('{count}', itemsCount);

    const description = isSingle ?
      messages.singleDeleteDescription :
      messages.multipleDeleteDescription.replace('{count}', itemsCount);

    const actions = [
      <FlatButton
        label={messages.cancel}
        onClick={this.handleCancel}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={messages.actions_delete}
        primary={true}
        keyboardFocused={true}
        onClick={this.handleDelete}
      />
    ];

    return (
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleCancel}
          contentStyle={{ maxWidth: 540 }}
          titleStyle={{ fontSize: '18px', lineHeight: '28px' }}
        >
          <div style={{ wordWrap: 'break-word'}}>{description}</div>
        </Dialog>
    )
  }
}
