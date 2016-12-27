import React from 'react'
import messages from 'src/locales'
import style from './style.css'

import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const GalleryItem = ({ url, alt, id, onDelete }) => (
  <Paper zDepth={1} rounded={false}>
    <div className={style.preview}>
      <img src={url} title={alt} />
    </div>
    <div className={style.footer}>
      <IconButton touch={true} tooltip={messages.actions.delete} tooltipPosition="top-right" onTouchTap={() => { onDelete(id) }}>
        <FontIcon color="rgba(0,0,0,0.5)" className="material-icons">delete</FontIcon>
      </IconButton>
    </div>
  </Paper>
)

export default GalleryItem;
