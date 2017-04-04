import React from 'react'
import Gallery from 'modules/shared/image-upload-multiple'

export default class ProductImages extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    let {productId, images, onImageDelete, onImageSort, fetchData} = this.props;
    return (
      <Gallery productId={productId} images={images} onImageDelete={onImageDelete} onImageSort={onImageSort} onUpload={fetchData} />
    )
  }
}
