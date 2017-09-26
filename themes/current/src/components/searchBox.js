import React from 'react';
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      this.handleSearch();
    }
  }

  handleSearch = () => {
    this.props.onSearch(this.state.value);
  }

  handleClear = () => {
    this.setState({value: ''});
    this.props.onSearch('');
  }

  render() {
    return <div className={'search-box ' + this.props.className}>
      <input className="search-input" type="text" placeholder={text.searchPlaceholder} value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
      <img className="search-icon-search" src="/assets/images/search.svg" alt={text.search} title={text.search} onClick={this.handleSearch}/>
      {this.state.value && this.state.value !== '' &&
        <img className="search-icon-clear" src="/assets/images/close.svg" onClick={this.handleClear} />
      }
    </div>
  }
}
