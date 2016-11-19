import React from 'react'
import messages from 'src/locale'
import style from './style.css'

import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const GalleryItem = ({ url, alt, id, onDelete }) => (
  <Paper zDepth={1} rounded={false}>
    <div className={style.preview}>
      <img src={url} title={alt} />
      <div className={style.footer}>
        <IconButton touch={true} style={{ zIndex:9999 }} tooltip={messages.actions.delete} tooltipPosition="top-right" onTouchTap={() => { onDelete(id) }}>
          <FontIcon color="rgba(0,0,0,0.5)" className="material-icons">delete</FontIcon>
        </IconButton>
      </div>
    </div>
  </Paper>
)

export default GalleryItem;
