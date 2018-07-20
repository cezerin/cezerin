import { connect } from 'react-redux';
import { fetchCheckoutField, updateCheckoutField } from '../actions';
import Form from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.settings.checkoutField
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			const { fieldName } = ownProps.match.params;
			dispatch(fetchCheckoutField(fieldName));
		},
		onSubmit: values => {
			dispatch(updateCheckoutField(values));
			ownProps.history.push('/admin/settings/checkout');
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
