import React from 'react'
import messages from 'lib/text'
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';

export default class SelectTokenScopes extends React.Component {
  constructor(props) {
    super(props)
    const values = Array.isArray(props.input.value) ? props.input.value : [];
    this.state = {
      selectedScopes: values
    };
  }

  componentWillReceiveProps(nextProps) {
    const values = Array.isArray(nextProps.input.value) ? nextProps.input.value : [];
    if (values !== this.state.selectedScopes) {
      this.setState({
        selectedScopes: values
      });
    }
  }

  onCheckboxChecked = (scope) => {
    let values = this.state.selectedScopes;
    if(values.includes(scope)) {
      values = values.filter(item => item !== scope);
    } else {
      values.push(scope);
    }
    this.setState({ selectedScopes: values});
    this.props.input.onChange(values)
  }

  isCheckboxChecked = (scope) => {
    return this.state.selectedScopes.includes(scope);
  }

  render() {
    const items = this.props.scopes.map(scope =>
      <ListItem key={scope}
        leftCheckbox={<Checkbox checked={this.isCheckboxChecked(scope)} disabled={this.props.disabled} onCheck={(e, isChecked) => {
          this.onCheckboxChecked(scope)
        }} />}
        primaryText={scope}
      />
    )

    return (
      <List>
        {items}
      </List>
    )
  }
}
