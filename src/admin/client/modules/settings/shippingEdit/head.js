import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteShippingMethod } from '../actions';
import Buttons from './components/headButtons';

const mapStateToProps = (state, ownProps) => {
	return {
		shippingMethod: state.settings.shippingMethodEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: id => {
			dispatch(deleteShippingMethod(id));
			ownProps.history.push('/admin/settings/shipping');
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
