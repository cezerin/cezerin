import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { updateStatus, createStatus, deselectStatus } from '../actions';
import Form from './components/form';

const mapStateToProps = state => {
	return {
		statusId: state.orderStatuses.selectedId,
		items: state.orderStatuses.items,
		initialValues: state.orderStatuses.items.find(
			item => item.id === state.orderStatuses.selectedId
		),
		isSaving: state.orderStatuses.isSaving
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSubmit: values => {
			if (values.id) {
				dispatch(updateStatus(values));
			} else {
				dispatch(createStatus(values));
			}
		},
		onCancel: () => {
			dispatch(deselectStatus());
			dispatch(reset('FormOrderStatus'));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
