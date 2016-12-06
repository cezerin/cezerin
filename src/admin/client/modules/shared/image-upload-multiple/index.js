import React from 'react'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import settings from 'lib/settings'
import style from './style.css'
import GalleryItem from './item'
import MultiUploader from './uploader'
import api from 'lib/api'

const SortableItem = SortableElement(({ image, onDelete }) =>
	<li className={style.item}><GalleryItem url={image.url} alt={image.alt} id={image.id} onDelete={onDelete} /></li>
)

const SortableList = SortableContainer(({items, onDelete}) =>
		<ul className={style.list}>
			{items.map((value, index) =>
        <SortableItem key={`item-${index}`} index={index} image={value} onDelete={onDelete} />
      )}
		</ul>
)

const Gallery = ({ productId, images, onImageDelete, onImageSort, onUpload }) => {
  const postUrl = `${settings.api.url.base}products/${productId}/images`;
  const apiToken = api.token;

  if(images && images.length > 0) {
    return (
        <MultiUploader onUpload={() => onUpload(productId)} postUrl={postUrl} apiToken={apiToken}>
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
        </MultiUploader>
    )
  } else {
    return <MultiUploader onUpload={() => onUpload(productId)} postUrl={postUrl} apiToken={apiToken} />
  }
}

export default Gallery;
