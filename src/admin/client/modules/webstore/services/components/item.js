import React from 'react';
import { Link } from 'react-router-dom'
import messages from 'lib/text'
import style from './style.css'
import {Card, CardMedia, CardTitle} from 'material-ui/Card';

const ServicesListItem = ({ service }) => {
  return (
    <Card style={{ width: 320, marginBottom: 15, marginRight: 15 }}>
      <CardMedia
        className={style.servicesCover}
        style={{ backgroundImage: `url(${service.cover_url})` }}>
      </CardMedia>
      <CardTitle
        title={service.name}
        titleStyle={{ fontSize: '16px', lineHeight: '22px' }}
      />
    </Card>
  )
}

export default ServicesListItem;
