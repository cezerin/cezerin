import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';

import messages from 'lib/text';
import * as helper from 'lib/helper';
import sortBy from 'lodash/sortBy';
import style from './style.css';
import DynamicEditControl from './dynamicEditControl';
import ArrayEditor from './arrayEditor';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class ThemeSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		let {
			handleSubmit,
			pristine,
			submitting,
			initialValues,
			reset,
			settingsSchema
		} = this.props;
		if (initialValues && settingsSchema) {
			let lastSection = null;
			const sortedSettingsSchema = sortBy(settingsSchema, ['section', 'label']);

			const fields = sortedSettingsSchema.map((item, index) => {
				let sectionTitle = null;
				if (item.section !== lastSection) {
					lastSection = item.section;
					sectionTitle =
						item.section && item.section !== '' ? (
							<div className={style.sectionTitle}>{item.section}</div>
						) : null;
				}

				return (
					<div key={index}>
						{sectionTitle}
						<DynamicEditControl
							type={item.type}
							fieldName={item.key}
							label={item.label}
							options={item.options}
							properties={item.properties}
						/>
					</div>
				);
			});

			return (
				<form
					onSubmit={handleSubmit}
					style={{
						display: 'initial',
						width: '100%'
					}}
				>
					<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
						{messages.themeSettings}
					</div>
					<Paper className="paper-box" zDepth={1}>
						<div className={style.innerBox}>{fields}</div>
						<div className="buttons-box">
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
	}
}

export default reduxForm({
	form: 'ThemeSettingsForm',
	enableReinitialize: true
})(ThemeSettings);
