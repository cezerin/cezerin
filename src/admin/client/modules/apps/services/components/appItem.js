import React from 'react';
import Item from './item'

const ServiceItem = ({ app }) => {
  return (
    <Item
      path={`/admin/apps/app/${app.key}`}
      coverUrl={app.coverUrl}
      title={app.name}
    />
  )
}

export default ServiceItem;
