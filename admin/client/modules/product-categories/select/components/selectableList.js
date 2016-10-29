import React, {Component, PropTypes} from 'react';
import {List, makeSelectable} from 'material-ui/List';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired
    };

    componentWillMount = () => {
      this.setState({
        selectedIndex: this.props.defaultValue
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index
      });
    };

    componentWillReceiveProps(nextProps) {
      if(nextProps.defaultValue == null){
        this.setState({
          selectedIndex: null
        });
      }
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);
export default SelectableList;
