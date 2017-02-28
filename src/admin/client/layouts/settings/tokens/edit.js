import React from 'react'
import TokensEdit from 'modules/settings/tokens/edit'

export default({params}) => (
  <TokensEdit tokenId={params.tokenId} isAdd={false} />
)
