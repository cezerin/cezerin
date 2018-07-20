import { connect } from 'react-redux';
import {
	fetchPaymentMethod,
	updatePaymentMethod,
	fetchShippingMethods,
	createPaymentMethod,
	receivePaymentMethod
} from '../actions';
import Form from './components/form';

const mapStateToProps = (state, ownProps) => {
	const { methodId } = ownProps.match.params;
	const gateway = state.settings.paymentMethodEdit
		? state.settings.paymentMethodEdit.gateway
		: null;

	return {
		methodId: methodId,
		gateway: gateway,
		settings: state.settings.settings,
		initialValues: state.settings.paymentMethodEdit,
		shippingMethods: state.settings.shippingMethods
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onLoad: () => {
			const { methodId } = ownProps.match.params;
			if (methodId) {
				dispatch(fetchPaymentMethod(methodId));
			} else {
				dispatch(receivePaymentMethod({ enabled: true }));
			}
			dispatch(fetchShippingMethods());
		},
		onSubmit: method => {
			if (
				method.conditions &&
				method.conditions.countries &&
				!Array.isArray(method.conditions.countries)
			) {
				const countriesStr = method.conditions.countries;
				method.conditions.countries = countriesStr
					.split(',')
					.map(item => item.trim().toUpperCase())
					.filter(item => item.length === 2);
			}

			if (method.id) {
				dispatch(updatePaymentMethod(method));
			} else {
				dispatch(createPaymentMethod(method));
				ownProps.history.push('/admin/settings/payments');
			}
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
