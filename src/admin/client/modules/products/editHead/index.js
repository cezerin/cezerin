import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteCurrentProduct } from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		product: state.products.editProduct
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: () => {
			dispatch(deleteCurrentProduct());
			ownProps.history.push('/admin/products');
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
