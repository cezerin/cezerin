import React from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { deleteGroup } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    selected: state.customerGroups.items.find(item => item.id === state.customerGroups.selectedId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: (id) => {
      dispatch(deleteGroup(id));
      dispatch(reset('FormCustomerGroup'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
