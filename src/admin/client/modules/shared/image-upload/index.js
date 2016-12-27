import React from 'react'
import messages from 'src/locales'
import Dropzone from 'react-dropzone';

import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';

import style from './style.css'

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreview: this.props.imageUrl,
      percentComplete: 100,
      uploadIsComplete: false
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDelete = () => {
    this.setState({
      imagePreview: null
    });
    this.props.onDelete();
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      imagePreview: nextProps.imageUrl,
      percentComplete: 100
    });
  }

  onDrop(files) {
    let file = files[0];
    this.setState({
      imagePreview: file.preview,
      percentComplete: 0
    });

    var xhr = new XMLHttpRequest();
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
    data.append('file', file);
    xhr.send(data);
  }

  render() {
    const { percentComplete, imagePreview, uploadIsComplete } = this.state;
    const hasPreview = imagePreview !== null && imagePreview !== '';
    const previewIsFileUrl = hasPreview ? imagePreview.startsWith('http') : null;

    let htmlPreview =
      <div style={{paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>
        <FontIcon style={{fontSize: 90, color: '#cccccc'}} className="material-icons">photo_camera</FontIcon>
        <div className={style.dropText}>{messages.help.dropHere}</div>
      </div>

    if(hasPreview && previewIsFileUrl) {
      htmlPreview =
        <a href={imagePreview} target="_blank">
          <img src={imagePreview} title={imagePreview} />
        </a>
    } else if(hasPreview && !previewIsFileUrl) {
      htmlPreview = <img src={imagePreview} />
    }

    return (
      <Paper zDepth={1} rounded={false} style={{width:200}}>
            <Dropzone
              onDrop={this.onDrop}
              multiple={false}
              disableClick={hasPreview}
              accept="image/*"
              ref={(node) => { this.dropzone = node; }}
              style={{}}
              className={style.dropzone}
              activeClassName={style.dropzoneActive}
              rejectClassName={style.dropzoneReject}>
              <div className={style.preview}>
                {htmlPreview}
              </div>
            </Dropzone>
        {percentComplete < 100 &&
          <LinearProgress mode="determinate" value={percentComplete} />
        }
        <div className={style.footer}>
          <IconButton touch={true} tooltip={messages.actions.upload} onTouchTap={() => { this.dropzone.open() }} tooltipPosition="top-right">
            <FontIcon color="rgba(0,0,0,0.5)" className="material-icons">file_upload</FontIcon>
          </IconButton>
          {hasPreview &&
            <IconButton touch={true} tooltip={messages.actions.delete} onTouchTap={this.onDelete} tooltipPosition="top-right">
              <FontIcon color="rgba(0,0,0,0.5)" className="material-icons">delete</FontIcon>
            </IconButton>
          }
        </div>
        <Snackbar
          open={uploadIsComplete}
          message={messages.messages.uploadComplete}
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </Paper>
    )
  }
}
