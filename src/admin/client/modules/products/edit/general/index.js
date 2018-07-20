import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateProduct } from '../../actions';
import ProductGeneralForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.products.editProduct
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				updateProduct({
					id: values.id,
					name: values.name,
					slug: values.slug,
					meta_title: values.meta_title,
					meta_description: values.meta_description,
					description: values.description
				})
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ProductGeneralForm)
);
