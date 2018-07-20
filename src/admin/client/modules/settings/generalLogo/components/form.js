import React from 'react';
import ImageUpload from 'modules/shared/imageUpload';
import Paper from 'material-ui/Paper';

export default class GeneralLogoSettingsForm extends React.Component {
	componentDidMount() {
		this.props.onLoad();
	}

	render() {
		const { onImageUpload, onImageDelete, settings } = this.props;
		let imageUrl = settings && settings.logo ? settings.logo : '';

		return (
			<Paper className="paper-box" zDepth={1}>
				<div style={{ padding: 30 }}>
					<ImageUpload
						uploading={false}
						imageUrl={imageUrl}
						onDelete={onImageDelete}
						onUpload={onImageUpload}
					/>
				</div>
			</Paper>
		);
	}
}
