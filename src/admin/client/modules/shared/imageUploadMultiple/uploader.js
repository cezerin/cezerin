import React from 'react';
import Dropzone from 'react-dropzone';
import messages from 'lib/text';
import style from './style.css';

import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

export default class MultiUploader extends React.Component {
	onDrop = files => {
		let form = new FormData();
		files.map(file => {
			form.append('file', file);
		});
		this.props.onUpload(form);
	};

	render() {
		const { uploading } = this.props;

		return (
			<div>
				<Dropzone
					onDrop={this.onDrop}
					multiple={true}
					disableClick={true}
					accept="image/*"
					ref={node => {
						this.dropzone = node;
					}}
					style={{}}
					className={style.dropzone}
					activeClassName={style.dropzoneActive}
					rejectClassName={style.dropzoneReject}
				>
					{this.props.children}
					{!this.props.children && (
						<div className={style.dropzoneEmpty}>{messages.help_dropHere}</div>
					)}
				</Dropzone>

				{!uploading && (
					<RaisedButton
						primary={true}
						label={messages.chooseImage}
						style={{ marginLeft: 20, marginTop: 10 }}
						onClick={() => {
							this.dropzone.open();
						}}
					/>
				)}

				<Snackbar open={uploading} message={messages.messages_uploading} />
			</div>
		);
	}
}
