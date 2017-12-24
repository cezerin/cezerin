import React from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { deleteGroup, deselectGroup } from '../actions'
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
    },
    onCreate: () => {
      dispatch(deselectGroup())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
