import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateProduct } from '../../actions';
import ProductAdditionalForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.products.editProduct,
		settings: state.settings.settings,
		categories: state.productCategories.items
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				updateProduct({
					id: values.id,
					tags: values.tags,
					position: values.position,
					related_product_ids: values.related_product_ids,
					category_id: values.category_id,
					category_ids: values.category_ids
				})
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ProductAdditionalForm)
);
