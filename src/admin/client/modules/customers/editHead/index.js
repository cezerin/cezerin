import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteCurrentCustomer } from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		customer: state.customers.editCustomer
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: () => {
			dispatch(deleteCurrentCustomer());
			ownProps.history.push('/admin/customers');
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
