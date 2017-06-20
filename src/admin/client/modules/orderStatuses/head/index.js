import React from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { deleteStatus } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    selected: state.orderStatuses.items.find(item => item.id === state.orderStatuses.selectedId)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: (id) => {
      dispatch(deleteStatus(id));
      dispatch(reset('FormOrderStatus'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
