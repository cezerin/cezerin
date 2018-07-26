import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { reset } from 'redux-form';
import {
	deleteCategory,
	moveUpCategory,
	moveDownCategory,
	replaceCategory,
	createCategory
} from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = state => {
	return {
		selected: state.productCategories.items.find(
			item => item.id === state.productCategories.selectedId
		)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onMoveUp: () => {
			dispatch(moveUpCategory());
		},
		onMoveDown: () => {
			dispatch(moveDownCategory());
		},
		onDelete: id => {
			dispatch(deleteCategory(id));
			dispatch(reset('FormProductCategory'));
		},
		onMoveTo: id => {
			dispatch(replaceCategory(id));
			dispatch(reset('FormProductCategory'));
		},
		onCreate: () => {
			dispatch(createCategory());
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
