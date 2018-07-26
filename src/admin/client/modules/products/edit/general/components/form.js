import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import Editor from 'modules/shared/editor';

import messages from 'lib/text';
import style from './style.css';
import api from 'lib/api';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
	const errors = {};
	const requiredFields = ['name'];

	requiredFields.map(field => {
		if (values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

const slugExists = values => {
	if (values.slug && values.slug.length > 0) {
		return api.products
			.slugExists(values.id, values.slug)
			.then(response => response.status === 200);
	} else {
		return Promise.resolve(false);
	}
};

const asyncValidate = values => {
	return Promise.all([slugExists(values)]).then(([isSlugExists]) => {
		let errors = {};

		if (isSlugExists) {
			errors.slug = messages.errors_urlTaken;
		}

		if (Object.keys(errors).length > 0) {
			return Promise.reject(errors);
		} else {
			return Promise.resolve();
		}
	});
};

const ProductGeneralForm = ({
	handleSubmit,
	pristine,
	reset,
	submitting,
	initialValues
}) => {
	if (initialValues) {
		return (
			<form onSubmit={handleSubmit}>
				<Paper className="paper-box" zDepth={1}>
					<div className={style.innerBox}>
						<Field
							name="name"
							component={TextField}
							floatingLabelText={messages.products_name + ' *'}
							fullWidth={true}
						/>
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
						<div className="field-hint" style={{ marginTop: 40 }}>
							{messages.description}
						</div>
						<Field name="description" component={Editor} />
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
							disabled={pristine || submitting}
						/>
					</div>
				</Paper>
			</form>
		);
	} else {
		return null;
	}
};

export default reduxForm({
	form: 'ProductGeneralForm',
	validate,
	asyncValidate,
	asyncBlurFields: ['slug'],
	enableReinitialize: true
})(ProductGeneralForm);
