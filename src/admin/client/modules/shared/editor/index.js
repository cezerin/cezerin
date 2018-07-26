import React from 'react';
import TinyMCE from '../tinymce';
import settings from 'lib/settings';

const config = {
	inline: true,
	plugins: [
		'autolink lists link image charmap preview anchor',
		'searchreplace visualblocks code fullscreen',
		'media table paste code textcolor directionality'
	],
	toolbar1:
		'image media | styleselect | bold italic bullist numlist link alignleft aligncenter alignright alignjustify',
	toolbar2:
		'undo redo | forecolor paste removeformat table | outdent indent | preview code'
};

export default class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.input.value
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.value !== nextProps.input.value) {
			this.setState({
				value: nextProps.input.value
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.value !== nextState.value;
	}

	onChange = e => {
		const content = e.target.getContent();
		this.setState({ value: content });
		this.props.input.onChange(content);
	};

	render() {
		return (
			<TinyMCE
				entityId={this.props.entityId}
				content={this.state.value}
				config={{
					relative_urls: false,
					remove_script_host: false,
					convert_urls: false,
					language: settings.language,
					themes: config.themes,
					inline: config.inline,
					plugins: config.plugins,
					toolbar1: config.toolbar1,
					toolbar2: config.toolbar2,
					menubar: false
				}}
				onChange={this.onChange}
			/>
		);
	}
}
