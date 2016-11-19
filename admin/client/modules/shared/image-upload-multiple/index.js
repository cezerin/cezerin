import React from 'react'
import Dropzone from 'react-dropzone';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import messages from 'src/locale'
import settings from 'lib/settings'
import style from './style.css'
import GalleryItem from './item'
import api from 'lib/api'

import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';


const SortableItem = SortableElement(({ image, onDelete }) => <li className={style.item}><GalleryItem url={image.url} alt={image.alt} id={image.id} onDelete={onDelete} /></li>);

const SortableList = SortableContainer(({items, onDelete}) => {
	return (
		<ul className={style.list}>
			{items.map((value, index) =>
        <SortableItem key={`item-${index}`} index={index} image={value} onDelete={onDelete} />
      )}
		</ul>
	);
});

const Gallery = ({ productId, images, onImageDelete, onImageSort, onUpload }) => {
  const postUrl = `${settings.api.url.base}products/${productId}/images`;
  const apiToken = api.token;

  if(images && images.length > 0) {
    return (
        <ImageUploadMultiple onUpload={() => onUpload(productId)} postUrl={postUrl} apiToken={apiToken}>
          <div className={style.gallery}>
            <SortableList
              axis="x"
              items={images}
              onDelete={imageId => {
                onImageDelete(productId, imageId);
              }}
              onSortEnd={({oldIndex, newIndex}) => {
                let sortedItems = arrayMove(images, oldIndex, newIndex);
                let withNewPosition = sortedItems.map((image, index) => { image.position = index; return image;})
                onImageSort(productId, withNewPosition);
              }} />
            </div>
        </ImageUploadMultiple>
    )
  } else {
    return <ImageUploadMultiple onUpload={() => onUpload(productId)} postUrl={postUrl} apiToken={apiToken} />
  }
}

class ImageUploadMultiple extends React.Component {
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
              {messages.help.dropHere}
            </div>
          }
        </Dropzone>


        {percentComplete === 100 &&
          <RaisedButton label={messages.actions.upload} style={{ marginLeft:10, marginTop:10 }} onTouchTap={() => { this.dropzone.open() }} />
        }

        {percentComplete < 100 &&
          <LinearProgress style={{ marginTop:10 }} mode="determinate" value={percentComplete} />
        }
        <Snackbar
          open={uploadIsComplete}
          message={messages.messages.uploadComplete}
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </div>
    )
  }
}

export default Gallery;
