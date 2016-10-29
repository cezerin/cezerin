import React from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
//import { setProductsSearch } from 'src/actions'

class AppBarSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
    this.props.onChange(event.target.value);
  };

  render() {
    return (
        <TextField
          id="text-field-controlled"
          hintText="Search"
          // hintStyle={{color:'#fff'}}
          inputStyle={{color:'#fff'}}
          value={this.state.value}
          style={this.props.style}
          onChange={this.handleChange}
        />
    );
  }
}


const mapStateToProps = (state) => {
  return {
    search: null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (search) => {
      //dispatch(setProductsSearch(search))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppBarSearch)
