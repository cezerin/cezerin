import { connect } from 'react-redux';
import {
	updateCategory,
	deselectCategory,
	fetchCategories,
	deleteImage,
	uploadImage
} from '../actions';
import ProductCategoryEditForm from './components/form';

const mapStateToProps = state => {
	return {
		uploadingImage: state.productCategories.uploadingImage,
		categoryId: state.productCategories.selectedId,
		items: state.productCategories.items,
		initialValues: state.productCategories.items.find(
			item => item.id === state.productCategories.selectedId
		),
		isSaving: state.productCategories.isSaving
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onImageDelete: () => {
			dispatch(deleteImage());
		},
		onImageUpload: form => {
			dispatch(uploadImage(form));
		},
		onSubmit: values => {
			delete values.image;
			if (!values.slug || values.slug === '') {
				values.slug = values.name;
			}
			dispatch(updateCategory(values));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProductCategoryEditForm);
