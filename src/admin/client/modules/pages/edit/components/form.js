import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

import { CustomToggle } from 'modules/shared/form';
import Editor from 'modules/shared/editor';
import TagsInput from 'react-tagsinput';
import messages from 'lib/text';
import style from './style.css';
import api from 'lib/api';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const TagsField = ({ input, placeholder }) => {
	const tagsArray =
		input.value && Array.isArray(input.value) ? input.value : [];
	return (
		<TagsInput
			value={tagsArray}
			inputProps={{ placeholder: placeholder }}
			onChange={tags => {
				input.onChange(tags);
			}}
		/>
	);
};

const validate = values => {
	const errors = {};
	const requiredFields = ['slug', 'meta_title'];

	requiredFields.map(field => {
		if (!values.is_system && values && !values[field]) {
			errors[field] = messages.errors_required;
		}
	});

	return errors;
};

const asyncValidate = (values /*, dispatch */) => {
	return new Promise((resolve, reject) => {
		if (!values.slug && values.is_system) {
			resolve();
		} else {
			api.sitemap.retrieve({ path: values.slug }).then(({ status, json }) => {
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
		}
	});
};

class EditPageForm extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	componentWillUnmount() {
		this.props.eraseData();
	}

	render() {
		let {
			handleSubmit,
			pristine,
			submitting,
			initialValues,
			pageId
		} = this.props;
		const isAdd = pageId === null || pageId === undefined;

		if (initialValues) {
			return (
				<form onSubmit={handleSubmit}>
					<Paper className="paper-box" zDepth={1}>
						<div className={style.innerBox}>
							<Field
								name="meta_title"
								component={TextField}
								floatingLabelText={messages.pageTitle}
								fullWidth={true}
							/>
							<br />
							<Field
								name="slug"
								component={TextField}
								floatingLabelText={messages.slug}
								fullWidth={true}
								disabled={initialValues.is_system}
							/>
							<p className="field-hint">{messages.help_slug}</p>
							<Field
								name="meta_description"
								component={TextField}
								floatingLabelText={messages.metaDescription}
								fullWidth={true}
							/>
							<div className="field-hint" style={{ marginTop: 40 }}>
								{messages.content}
							</div>
							<div style={{ marginBottom: 50 }}>
								<Field name="content" component={Editor} />
							</div>
							{messages.tags}
							<Field
								name="tags"
								component={TagsField}
								placeholder={messages.newTag}
							/>
							<div style={{ maxWidth: 256 }}>
								<Field
									component={CustomToggle}
									name="enabled"
									label={messages.enabled}
									style={{ paddingTop: 16, paddingBottom: 16 }}
									disabled={initialValues.is_system}
								/>
							</div>
						</div>
						<div
							className={
								'buttons-box ' +
								(pristine && !isAdd
									? 'buttons-box-pristine'
									: 'buttons-box-show')
							}
						>
							<RaisedButton
								type="submit"
								label={isAdd ? messages.add : messages.save}
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
	}
}

export default reduxForm({
	form: 'EditPageForm',
	validate,
	asyncValidate,
	asyncBlurFields: ['slug'],
	enableReinitialize: true
})(EditPageForm);
