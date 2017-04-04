import React from 'react'
import Dropzone from 'react-dropzone';
import messages from 'lib/text'
import style from './style.css'

import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

export default class MultiUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      percentComplete: 100,
      uploadIsComplete: false
    };
    this.onDrop = this.onDrop.bind(this);
  }

  uploadSuccess = () => {
    this.setState({
      uploadIsComplete: true,
      percentComplete: 100
    });
    this.props.onUpload();
  };

  closeSnackbar = () => {
    this.setState({
      uploadIsComplete: false,
    });
  };

  onDrop(files) {
    this.setState({
      percentComplete: 0
    });

    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('POST', this.props.postUrl);
    xhr.setRequestHeader('Authorization', `Bearer ${this.props.apiToken}`);
    xhr.onload = () => {
      if (xhr.status !== 200) {
          alert(`Request failed. Code: ${xhr.status}. Message: ${xhr.responseText}`);
      }
    }

    xhr.upload.addEventListener("error", () => { alert('An error occurred while uploading'); });
    xhr.upload.addEventListener("load", () => { this.uploadSuccess(); });
    xhr.upload.addEventListener("progress", (oEvent) => {
      if (oEvent.lengthComputable) {
        var percent = oEvent.loaded / oEvent.total * 100;
        this.setState({
          percentComplete: percent
        });
      } else {
        this.setState({
          percentComplete: 100
        });
      }
    });

    var data = new FormData();
    files.map(file => { data.append('file', file) });
    xhr.send(data);
  }

  render() {
    const { percentComplete, uploadIsComplete } = this.state;

    return (
      <div>
        <Dropzone
          onDrop={this.onDrop}
          multiple={true}
          disableClick={true}
          accept="image/*"
          ref={(node) => { this.dropzone = node; }}
          style={{}}
          className={style.dropzone}
          activeClassName={style.dropzoneActive}
          rejectClassName={style.dropzoneReject}>
          {this.props.children}
          {!this.props.children &&
            <div className={style.dropzoneEmpty}>
              {messages.help_dropHere}
            </div>
          }
        </Dropzone>


        {percentComplete === 100 &&
          <RaisedButton label={messages.actions_upload} style={{ marginLeft:20, marginTop:10 }} onTouchTap={() => { this.dropzone.open() }} />
        }

        {percentComplete < 100 &&
          <LinearProgress style={{ marginTop:10 }} mode="determinate" value={percentComplete} />
        }
        <Snackbar
          open={uploadIsComplete}
          message={messages.messages_uploadComplete}
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </div>
    )
  }
}
