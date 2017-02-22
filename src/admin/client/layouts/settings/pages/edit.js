import React from 'react'
import PagesEdit from 'modules/settings/pages/edit'

export default({params}) => (
  <PagesEdit pageId={params.pageId} isAdd={false} />
)
