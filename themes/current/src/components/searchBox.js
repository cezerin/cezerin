import React from 'react';
import text from '../lib/text'

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyPress(e) {
    if (e.keyCode === 13 || e.which === 13) {
      this.props.onSearch(this.state.value)
    }
  }

  render() {
    return (
      <input className="input" type="text" placeholder={text.searchPlaceholder} value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
    )
  }
}
