import { connect } from 'react-redux';
import { fetchThemeSettings, updateThemeSettings } from '../actions';
import Form from './components/form';

const mapStateToProps = state => {
	return {
		initialValues: state.settings.themeSettings,
		settingsSchema: state.settings.themeSettingsSchema
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onLoad: () => {
			dispatch(fetchThemeSettings());
		},
		onSubmit: values => {
			dispatch(updateThemeSettings(values));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form);
