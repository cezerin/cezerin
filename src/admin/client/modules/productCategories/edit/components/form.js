import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import Editor from 'modules/shared/editor';

import { CustomToggle } from 'modules/shared/form';
import ImageUpload from 'modules/shared/imageUpload';
import messages from 'lib/text';
import style from './style.css';
import settings from 'lib/settings';
import api from 'lib/api';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
	const errors = {};
	const requiredFields = ['name'];

	requiredFields.forEach(field => {
		if (values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

const asyncValidate = values => {
	return new Promise((resolve, reject) => {
		if (values.slug && values.slug.length > 0) {
			api.sitemap
				.retrieve({ path: '/' + values.slug })
				.then(({ status, json }) => {
					if (status === 404) {
						resolve();
					} else {
						if (json && !Object.is(json.resource, values.id)) {
							reject({ slug: messages.errors_urlTaken });
						} else {
							resolve();
						}
					}
				});
		} else {
			resolve();
		}
	});
};

const ProductCategoryEditForm = ({
	uploadingImage,
	handleSubmit,
	pristine,
	reset,
	submitting,
	onImageUpload,
	onImageDelete,
	isSaving,
	initialValues
}) => {
	let imageUrl = null;
	let categoryId = null;

	if (initialValues) {
		categoryId = initialValues.id;
		imageUrl = initialValues.image;
	}

	if (categoryId) {
		return (
			<Paper className="paper-box" zDepth={1}>
				<form onSubmit={handleSubmit}>
					<div className={style.innerBox}>
						<Field
							name="name"
							component={TextField}
							floatingLabelText={messages.productCategories_name + ' *'}
							fullWidth={true}
						/>
						<div className="field-hint" style={{ marginTop: 40 }}>
							{messages.description}
						</div>
						<Field
							name="description"
							entityId={categoryId}
							component={Editor}
						/>
						<div className={style.shortBox}>
							<Field
								name="enabled"
								component={CustomToggle}
								label={messages.enabled}
								className={style.toggle}
							/>
							<ImageUpload
								uploading={uploadingImage}
								imageUrl={imageUrl}
								onDelete={onImageDelete}
								onUpload={onImageUpload}
							/>
						</div>
						<div className="blue-title">{messages.seo}</div>
						<Field
							name="slug"
							component={TextField}
							floatingLabelText={messages.slug}
							fullWidth={true}
						/>
						<p className="field-hint">{messages.help_slug}</p>
						<Field
							name="meta_title"
							component={TextField}
							floatingLabelText={messages.pageTitle}
							fullWidth={true}
						/>
						<Field
							name="meta_description"
							component={TextField}
							floatingLabelText={messages.metaDescription}
							fullWidth={true}
						/>
					</div>
					<div
						className={
							'buttons-box ' +
							(pristine ? 'buttons-box-pristine' : 'buttons-box-show')
						}
					>
						<FlatButton
							label={messages.cancel}
							className={style.button}
							onClick={reset}
							disabled={pristine || submitting}
						/>
						<RaisedButton
							type="submit"
							label={messages.save}
							primary={true}
							className={style.button}
							disabled={pristine || submitting || isSaving}
						/>
					</div>
				</form>
			</Paper>
		);
	} else {
		return null;
	}
};

export default reduxForm({
	form: 'ProductCategoryEditForm',
	validate,
	asyncValidate,
	asyncBlurFields: ['slug'],
	enableReinitialize: true
})(ProductCategoryEditForm);
