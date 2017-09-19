import React from 'react'
import Gallery from 'modules/shared/imageUploadMultiple'
import Paper from 'material-ui/Paper';

export default class ProductImages extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    let {productId, images, onImageDelete, onImageSort, onImageUpload, uploadingImages} = this.props;
    return (
      <Paper className="paper-box" zDepth={1}>
        <div style={{ padding: '10px 10px 30px 10px' }}>
          <Gallery productId={productId} images={images} onImageDelete={onImageDelete} onImageSort={onImageSort} onImageUpload={onImageUpload} uploading={uploadingImages} />
        </div>
      </Paper>
    )
  }
}
